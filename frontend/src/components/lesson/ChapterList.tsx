import type { Chapter } from '@/types/course'

interface ChapterListProps {
  chapters: Chapter[]
  activeChapterSlug: string | null
  isChapterWatched: (chapterSlug: string) => boolean
  onSelect: (chapter: Chapter) => void
}

function formatTimestamp(totalSeconds: number): string {
  const seconds = Math.max(0, Math.floor(totalSeconds))
  const h = Math.floor(seconds / 3600)
  const m = Math.floor((seconds % 3600) / 60)
  const s = seconds % 60
  const mm = h > 0 ? String(m).padStart(2, '0') : String(m)
  const ss = String(s).padStart(2, '0')
  return h > 0 ? `${h}:${mm}:${ss}` : `${mm}:${ss}`
}

export function ChapterList({ chapters, activeChapterSlug, isChapterWatched, onSelect }: ChapterListProps) {
  if (chapters.length === 0) return null

  return (
    <div className="flex flex-col gap-1 rounded-md border border-border bg-surface p-2">
      <p className="px-2 py-1 font-mono text-[10px] uppercase tracking-[0.2em] text-text-muted">
        Tópicos desta aula
      </p>
      {chapters.map((chapter) => {
        const active = chapter.slug === activeChapterSlug
        const watched = isChapterWatched(chapter.slug)
        return (
          <button
            key={chapter.slug}
            type="button"
            onClick={() => onSelect(chapter)}
            className={`relative flex items-center gap-3 rounded-sm px-3 py-2 pl-4 text-left text-sm transition-colors ${
              active ? 'bg-accent/15 text-text' : 'text-text-muted hover:bg-surface-hover hover:text-text'
            }`}
          >
            {active && <span className="absolute inset-y-1 left-0 w-0.5 rounded-full bg-accent" />}
            <span className={`shrink-0 font-mono text-xs ${watched ? 'text-success' : active ? 'text-accent' : 'text-text-muted'}`}>
              {watched ? '✓' : formatTimestamp(chapter.startSeconds)}
            </span>
            <span>{chapter.title}</span>
          </button>
        )
      })}
    </div>
  )
}
