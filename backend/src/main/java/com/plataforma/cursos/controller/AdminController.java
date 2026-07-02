package com.plataforma.cursos.controller;

import com.plataforma.cursos.service.CatalogService;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/api/v1/admin")
public class AdminController {

    private final CatalogService catalogService;

    public AdminController(CatalogService catalogService) {
        this.catalogService = catalogService;
    }

    @PostMapping("/reindex")
    public Map<String, Object> reindex() {
        int courseCount = catalogService.reindex();
        return Map.of("status", "ok", "courses", courseCount);
    }
}
