package com.plataforma.cursos.controller;

import com.plataforma.cursos.dto.LessonDto;
import com.plataforma.cursos.dto.MaterialDto;
import com.plataforma.cursos.dto.ModuleDetailDto;
import com.plataforma.cursos.dto.ModuleSummaryDto;
import com.plataforma.cursos.model.CourseModule;
import com.plataforma.cursos.model.Lesson;
import com.plataforma.cursos.model.Material;
import com.plataforma.cursos.service.CatalogService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Arrays;
import java.util.List;

@RestController
@RequestMapping("/api/v1/courses/{courseSlug}/modules")
public class ModuleController {

    private final CatalogService catalogService;

    public ModuleController(CatalogService catalogService) {
        this.catalogService = catalogService;
    }

    @GetMapping("/{*modulePath}")
    public ModuleDetailDto getModule(@PathVariable String courseSlug, @PathVariable String modulePath) {
        List<String> slugs = parseModulePath(modulePath);
        CourseModule module = catalogService.getModule(courseSlug, slugs);

        List<LessonDto> lessons = module.lessons().stream()
                .map(lesson -> toLessonDto(courseSlug, slugs, lesson))
                .toList();
        List<MaterialDto> materials = module.materials().stream()
                .map(material -> toMaterialDto(courseSlug, slugs, material))
                .toList();
        List<ModuleSummaryDto> children = module.children().stream()
                .map(this::toSummary)
                .toList();

        return new ModuleDetailDto(module.slug(), module.title(), module.description(), lessons, materials, children);
    }

    private List<String> parseModulePath(String modulePath) {
        return Arrays.stream(modulePath.split("/"))
                .filter(s -> !s.isBlank())
                .toList();
    }

    private ModuleSummaryDto toSummary(CourseModule module) {
        return new ModuleSummaryDto(
                module.slug(),
                module.title(),
                module.description(),
                module.lessons().size(),
                !module.children().isEmpty(),
                module.hasContent()
        );
    }

    private LessonDto toLessonDto(String courseSlug, List<String> modulePath, Lesson lesson) {
        String videoUrl = "/api/v1/media/videos/%s/%s/%s".formatted(courseSlug, String.join("/", modulePath), lesson.slug());
        return new LessonDto(lesson.slug(), lesson.order(), lesson.title(), videoUrl);
    }

    private MaterialDto toMaterialDto(String courseSlug, List<String> modulePath, Material material) {
        String fileUrl = "/api/v1/media/materials/%s/%s/%s".formatted(courseSlug, String.join("/", modulePath), material.slug());
        return new MaterialDto(material.slug(), material.title(), material.type(), fileUrl);
    }
}
