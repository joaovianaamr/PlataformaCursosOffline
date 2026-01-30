package com.plataforma.cursos.controller;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.GetMapping;

import java.util.Map;

@RestController
@RequestMapping("/api/v1")
public class InfoController {

    @GetMapping("/info")
    public Map<String, String> info(){
        return Map.of(
                "name", "Plataforma de cursos",
                "version", "1.0.0",
                "description", "Plataforma privada de cursos offline"
        );
    }
}
