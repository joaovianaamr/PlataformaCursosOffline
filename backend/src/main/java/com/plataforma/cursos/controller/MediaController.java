package com.plataforma.cursos.controller;

import com.plataforma.cursos.service.ExternalPdfProxyService;
import com.plataforma.cursos.service.VideoStreamingService;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.core.io.support.ResourceRegion;
import org.springframework.http.ContentDisposition;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpRange;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.MediaTypeFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.nio.file.Path;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

@RestController
@RequestMapping("/api/v1/media")
public class MediaController {

    private static final long CHUNK_SIZE = 1024 * 1024L;

    private final VideoStreamingService videoStreamingService;
    private final ExternalPdfProxyService externalPdfProxyService;

    public MediaController(VideoStreamingService videoStreamingService, ExternalPdfProxyService externalPdfProxyService) {
        this.videoStreamingService = videoStreamingService;
        this.externalPdfProxyService = externalPdfProxyService;
    }

    @GetMapping("/videos/{courseSlug}/{*itemPath}")
    public ResponseEntity<ResourceRegion> streamVideo(
            @PathVariable String courseSlug,
            @PathVariable String itemPath,
            @RequestHeader HttpHeaders headers) throws IOException {
        PathAndSlug parsed = splitItemPath(itemPath);
        Path path = videoStreamingService.resolveVideo(courseSlug, parsed.modulePath(), parsed.itemSlug());
        UrlResource video = new UrlResource(path.toUri());
        long contentLength = video.contentLength();
        List<HttpRange> ranges = headers.getRange();

        ResourceRegion region = ranges.isEmpty()
                ? new ResourceRegion(video, 0, Math.min(CHUNK_SIZE, contentLength))
                : ranges.get(0).toResourceRegion(video);

        return ResponseEntity.status(ranges.isEmpty() ? HttpStatus.OK : HttpStatus.PARTIAL_CONTENT)
                .contentType(MediaTypeFactory.getMediaType(video).orElse(MediaType.valueOf("video/mp4")))
                .header(HttpHeaders.ACCEPT_RANGES, "bytes")
                .body(region);
    }

    @GetMapping("/materials/{courseSlug}/{*itemPath}")
    public ResponseEntity<Resource> getMaterial(
            @PathVariable String courseSlug,
            @PathVariable String itemPath) throws IOException {
        PathAndSlug parsed = splitItemPath(itemPath);
        Path path = videoStreamingService.resolveMaterial(courseSlug, parsed.modulePath(), parsed.itemSlug());
        UrlResource resource = new UrlResource(path.toUri());
        // Content-Disposition "inline" pede pro navegador exibir o PDF em vez de
        // baixar. O nome do arquivo precisa ir codificado como UTF-8 (RFC 5987),
        // senão um caractere acentuado quebra o header e alguns navegadores caem
        // pro fallback de forçar o download.
        ContentDisposition disposition = ContentDisposition.inline()
                .filename(path.getFileName().toString(), StandardCharsets.UTF_8)
                .build();
        return ResponseEntity.ok()
                .contentType(MediaType.APPLICATION_PDF)
                .header(HttpHeaders.CONTENT_DISPOSITION, disposition.toString())
                .body(resource);
    }

    @GetMapping("/external-pdf")
    public ResponseEntity<byte[]> getExternalPdf(@RequestParam String driveId) throws IOException, InterruptedException {
        byte[] bytes;
        try {
            bytes = externalPdfProxyService.fetchDrivePdf(driveId);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().build();
        }
        return ResponseEntity.ok()
                .contentType(MediaType.APPLICATION_PDF)
                .header(HttpHeaders.CONTENT_DISPOSITION, ContentDisposition.inline().build().toString())
                .body(bytes);
    }

    private PathAndSlug splitItemPath(String itemPath) {
        List<String> segments = new ArrayList<>(Arrays.stream(itemPath.split("/"))
                .filter(s -> !s.isBlank())
                .toList());
        if (segments.isEmpty()) {
            throw new IllegalArgumentException("Caminho de mídia inválido");
        }
        String itemSlug = segments.remove(segments.size() - 1);
        return new PathAndSlug(segments, itemSlug);
    }

    private record PathAndSlug(List<String> modulePath, String itemSlug) {
    }
}
