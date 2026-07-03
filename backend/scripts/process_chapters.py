#!/usr/bin/env python3
"""
Gera sidecars "<video>.meta.json" com capítulos (sub-aulas) e materiais extras
(PDFs do Drive + links de referência) para os vídeos de um módulo, a partir dos
metadados do YouTube (yt-dlp) e da descrição de cada vídeo.

Uso:
  scripts/.venv/bin/python scripts/process_chapters.py \
      --module "/media/.../Cursos/Quimica/01 - Química Geral e Inorgânica" \
      --playlist "https://www.youtube.com/playlist?list=PL0LfmDSptaT3O8cOnzySgo_wpwKmqklj9" \
      [--only 1] [--force] [--dry-run]

Idempotente: pula vídeos que já têm ".meta.json" válido, a menos que --force seja
passado. Vídeo sem correspondência na playlist ou sem `chapters` no YouTube ainda
recebe um sidecar (com chapters: [] quando aplicável), para não ser reprocessado
a cada execução.
"""
from __future__ import annotations

import argparse
import json
import re
import subprocess
import sys
import unicodedata
from dataclasses import dataclass, field
from pathlib import Path
from typing import Optional

LEADING_NUMBER = re.compile(r"^(\d+)[._\-\s]+(.+)$")
DRIVE_FILE = re.compile(r"https?://drive\.google\.com/file/d/([a-zA-Z0-9_-]+)[^\s]*")
REFERENCE_SECTION_HEADER = re.compile(r"link\s+com\s+os\s+sites\s+que\s+mencionei", re.IGNORECASE)
REFERENCE_LINE = re.compile(r"^\s*(.+?):\s*(https?://\S+)\s*$")
DENYLIST_HOSTS = ("instagram.com", "bit.ly", "youtube.com/watch", "youtu.be")


def slugify(value: str) -> str:
    """Espelha com.plataforma.cursos.util.SlugUtils#slugify (Java)."""
    spaced = re.sub(r"(?<=[a-z0-9])(?=[A-Z])", " ", value)
    normalized = unicodedata.normalize("NFD", spaced)
    without_diacritics = "".join(c for c in normalized if unicodedata.category(c) != "Mn")
    lower = without_diacritics.lower()
    dashed = re.sub(r"[^a-z0-9]+", "-", lower)
    return dashed.strip("-")


@dataclass
class ChapterEntry:
    order: int
    title: str
    slug: str
    startSeconds: float
    endSeconds: float


@dataclass
class MaterialEntry:
    type: str
    title: str
    slug: str
    filename: Optional[str] = None
    url: Optional[str] = None


@dataclass
class Sidecar:
    sourceVideoId: str
    chapters: list = field(default_factory=list)
    materials: list = field(default_factory=list)

    def to_json(self) -> dict:
        return {
            "sourceVideoId": self.sourceVideoId,
            "chapters": [c.__dict__ for c in self.chapters],
            "materials": [m.__dict__ for m in self.materials],
        }


def run_ytdlp_json(args: list[str]) -> dict:
    proc = subprocess.run(
        ["yt-dlp", "-J", "--no-warnings", *args],
        capture_output=True, text=True, timeout=120,
    )
    if proc.returncode != 0:
        raise RuntimeError(f"yt-dlp falhou ({proc.returncode}): {proc.stderr.strip()[-2000:]}")
    return json.loads(proc.stdout)


def fetch_playlist_index(playlist_url: str) -> dict[int, dict]:
    """playlist_index (1-based) -> {id, url, title}."""
    data = run_ytdlp_json(["--flat-playlist", playlist_url])
    entries = data.get("entries") or []
    by_index: dict[int, dict] = {}
    for i, entry in enumerate(entries, start=1):
        by_index[i] = {
            "id": entry.get("id"),
            "url": entry.get("url") or f"https://www.youtube.com/watch?v={entry.get('id')}",
            "title": entry.get("title"),
        }
    return by_index


def local_videos(module_dir: Path) -> list[tuple[int, Path]]:
    videos_dir = module_dir / "videos"
    result = []
    for f in sorted(videos_dir.glob("*.mp4")):
        m = LEADING_NUMBER.match(f.stem)
        if not m:
            print(f"  [aviso] não consegui extrair número de ordem: {f.name}", file=sys.stderr)
            continue
        result.append((int(m.group(1)), f))
    return result


def sidecar_path(video_file: Path) -> Path:
    # video_file.stem já lida certo com o "." real da extensão (é o único ponto
    # que importa em Path.stem); NÃO encadear outro with_suffix() em cima dele
    # -- isso re-interpretaria qualquer "." no MEIO do título (ex.: "ÓXIDOS.
    # Óxido...", "P.V = n.R.T") como se fosse uma extensão, truncando o nome.
    return video_file.with_name(video_file.stem + ".meta.json")


def is_already_processed(video_file: Path) -> bool:
    path = sidecar_path(video_file)
    if not path.is_file():
        return False
    try:
        json.loads(path.read_text(encoding="utf-8"))
        return True
    except (json.JSONDecodeError, OSError):
        return False


def extract_chapters(info: dict) -> list[ChapterEntry]:
    chapters = info.get("chapters") or []
    out = []
    for i, ch in enumerate(chapters, start=1):
        title = (ch.get("title") or f"Parte {i}").strip()
        out.append(ChapterEntry(
            order=i,
            title=title,
            slug=slugify(title),
            startSeconds=float(ch.get("start_time") or 0.0),
            endSeconds=float(ch.get("end_time") or 0.0),
        ))
    return out


def classify_drive_label(context_line: str) -> tuple[str, str]:
    """(MaterialType, título legível) a partir da linha que contém o link do Drive."""
    lowered = context_line.lower()
    if "gabarito" in lowered:
        return "EXERCICIOS", "Gabarito"
    if "exerc" in lowered:
        return "EXERCICIOS", "Exercícios"
    if "apostila" in lowered or "livro" in lowered or "paradidát" in lowered:
        return "TEORIA", "Apostila"
    return "OTHER", "Material"


def extract_drive_materials(description: str, order: int) -> list[MaterialEntry]:
    materials = []
    seen_ids = set()
    for line in description.splitlines():
        match = DRIVE_FILE.search(line)
        if not match:
            continue
        file_id = match.group(1)
        if file_id in seen_ids:
            continue
        seen_ids.add(file_id)
        mtype, label = classify_drive_label(line)
        title = label
        filename = f"{order:02d} - {label}.pdf"
        materials.append(MaterialEntry(
            type=mtype, title=title, slug=slugify(f"{label}-{file_id[:6]}"),
            filename=filename, url=f"https://drive.google.com/uc?id={file_id}",
        ))
    return materials


def extract_reference_links(description: str) -> list[MaterialEntry]:
    """Só dentro do bloco 'Link com os Sites que mencionei na aula' (evita promo)."""
    lines = description.splitlines()
    section_start = None
    for i, line in enumerate(lines):
        if REFERENCE_SECTION_HEADER.search(line):
            section_start = i + 1
            break
    if section_start is None:
        return []

    materials = []
    for line in lines[section_start:]:
        stripped = line.strip()
        if not stripped:
            if materials:
                break  # linha em branco após já ter achado itens = fim do bloco
            continue
        if any(host in stripped for host in DENYLIST_HOSTS):
            continue
        m = REFERENCE_LINE.match(stripped)
        if not m:
            # heading da próxima seção (outro emoji/maiúsculas) sem "Título: url" -> fim do bloco
            if materials:
                break
            continue
        raw_title = re.sub(r"^[\s\-•↪▪●*]+", "", m.group(1))
        title, url = raw_title.strip(' "'), m.group(2).strip()
        materials.append(MaterialEntry(
            type="LINK", title=title, slug=slugify(title), filename=None, url=url,
        ))
    return materials


def download_drive_pdf(material: MaterialEntry, archives_dir: Path, dry_run: bool) -> bool:
    dest = archives_dir / material.filename
    if dest.is_file():
        return True
    if dry_run:
        print(f"    [dry-run] baixaria {material.url} -> {dest}")
        return True
    archives_dir.mkdir(parents=True, exist_ok=True)
    file_id_match = re.search(r"id=([a-zA-Z0-9_-]+)", material.url or "")
    if not file_id_match:
        print(f"    [erro] não consegui extrair o id do Drive de {material.url}", file=sys.stderr)
        return False
    try:
        import gdown
        gdown.download(id=file_id_match.group(1), output=str(dest), quiet=False)
        return dest.is_file()
    except Exception as exc:  # noqa: BLE001 - relatar e seguir, não travar o lote
        print(f"    [erro] falha ao baixar PDF do Drive ({material.url}): {exc}", file=sys.stderr)
        return False


def process_video(order: int, video_file: Path, video_url: str, archives_dir: Path, dry_run: bool) -> Sidecar:
    print(f"  [{order:02d}] {video_file.name}")
    info = run_ytdlp_json(["--skip-download", video_url])
    chapters = extract_chapters(info)
    description = info.get("description") or ""

    drive_materials = extract_drive_materials(description, order)
    reference_materials = extract_reference_links(description)

    resolved_materials: list[MaterialEntry] = []
    for material in drive_materials:
        ok = download_drive_pdf(material, archives_dir, dry_run)
        if ok:
            resolved_materials.append(MaterialEntry(
                type=material.type, title=material.title, slug=material.slug,
                filename=material.filename, url=None,
            ))
        else:
            # fallback: guarda como link para o Drive em vez de perder a referência
            resolved_materials.append(MaterialEntry(
                type="LINK", title=material.title, slug=material.slug,
                filename=None, url=material.url,
            ))
    resolved_materials.extend(reference_materials)

    print(f"        capítulos: {len(chapters)}  |  materiais: {len(resolved_materials)}")
    return Sidecar(sourceVideoId=info.get("id", ""), chapters=chapters, materials=resolved_materials)


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    parser.add_argument("--module", required=True, help="Pasta do módulo (contém videos/ e archives/)")
    parser.add_argument("--playlist", required=True, help="URL da playlist do YouTube")
    parser.add_argument("--only", type=int, default=None, help="Processar só este número de ordem (piloto)")
    parser.add_argument("--force", action="store_true", help="Reprocessar mesmo se já houver .meta.json")
    parser.add_argument("--dry-run", action="store_true", help="Não baixa PDFs nem escreve .meta.json")
    args = parser.parse_args()

    module_dir = Path(args.module)
    if not module_dir.is_dir():
        print(f"Pasta de módulo não encontrada: {module_dir}", file=sys.stderr)
        return 1

    print(f"Módulo: {module_dir}")
    print("Buscando playlist...")
    playlist_index = fetch_playlist_index(args.playlist)
    print(f"  {len(playlist_index)} item(ns) na playlist")

    videos = local_videos(module_dir)
    if args.only is not None:
        videos = [(order, path) for order, path in videos if order == args.only]

    archives_dir = module_dir / "archives"
    processed, skipped, unmatched = 0, 0, 0

    for order, video_file in videos:
        if not args.force and is_already_processed(video_file):
            skipped += 1
            continue
        entry = playlist_index.get(order)
        if not entry:
            print(f"  [{order:02d}] {video_file.name}: sem correspondência na playlist (índice {order})", file=sys.stderr)
            unmatched += 1
            continue
        try:
            sidecar = process_video(order, video_file, entry["url"], archives_dir, args.dry_run)
        except Exception as exc:  # noqa: BLE001 - segue para o próximo vídeo do módulo
            print(f"  [{order:02d}] {video_file.name}: erro ao processar: {exc}", file=sys.stderr)
            continue

        if not args.dry_run:
            sidecar_path(video_file).write_text(
                json.dumps(sidecar.to_json(), ensure_ascii=False, indent=2), encoding="utf-8",
            )
        processed += 1

    print(f"\nConcluído: {processed} processado(s), {skipped} já prontos, {unmatched} sem correspondência.")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
