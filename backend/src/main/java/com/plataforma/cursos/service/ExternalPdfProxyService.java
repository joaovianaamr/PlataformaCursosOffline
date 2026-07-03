package com.plataforma.cursos.service;

import org.springframework.stereotype.Service;

import java.io.IOException;
import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.time.Duration;
import java.util.regex.Pattern;

/**
 * Alguns materiais (exercícios/gabaritos) ficam hospedados no Google Drive em vez de
 * localmente. O navegador não consegue buscar esses PDFs direto (pdf.js esbarra em CORS
 * no redirect do Drive), então o backend baixa o arquivo por trás e repassa pro frontend
 * como se fosse local — sem restrição de CORS porque a origem passa a ser a nossa própria API.
 */
@Service
public class ExternalPdfProxyService {

    private static final Pattern DRIVE_ID_PATTERN = Pattern.compile("^[\\w-]+$");
    private static final Duration TIMEOUT = Duration.ofSeconds(15);

    private final HttpClient httpClient = HttpClient.newBuilder()
            .followRedirects(HttpClient.Redirect.NORMAL)
            .connectTimeout(TIMEOUT)
            .build();

    public byte[] fetchDrivePdf(String driveId) throws IOException, InterruptedException {
        if (!DRIVE_ID_PATTERN.matcher(driveId).matches()) {
            throw new IllegalArgumentException("ID do Google Drive inválido");
        }
        URI uri = URI.create("https://drive.usercontent.google.com/download?id=" + driveId + "&export=download");
        HttpRequest request = HttpRequest.newBuilder(uri)
                .timeout(TIMEOUT)
                .GET()
                .build();
        HttpResponse<byte[]> response = httpClient.send(request, HttpResponse.BodyHandlers.ofByteArray());
        if (response.statusCode() != 200) {
            throw new IOException("Falha ao baixar PDF do Drive: HTTP " + response.statusCode());
        }
        return response.body();
    }
}
