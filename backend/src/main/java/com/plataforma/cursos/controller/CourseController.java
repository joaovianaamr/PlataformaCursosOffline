package com.plataforma.cursos.controller;

import com.plataforma.cursos.dto.CourseDetailDto;
import com.plataforma.cursos.dto.CourseSummaryDto;
import com.plataforma.cursos.dto.ModuleSummaryDto;
import com.plataforma.cursos.model.Course;
import com.plataforma.cursos.model.CourseModule;
import com.plataforma.cursos.service.CatalogService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/v1/courses")
public class CourseController {

    private final CatalogService catalogService;

    public CourseController(CatalogService catalogService) {
        this.catalogService = catalogService;
    }

    @GetMapping
    public List<CourseSummaryDto> listCourses() {
        return catalogService.listCourses().stream()
                .map(this::toSummary)
                .toList();
    }

    @GetMapping("/{courseSlug}")
    public CourseDetailDto getCourse(@PathVariable String courseSlug) {
        Course course = catalogService.getCourse(courseSlug);
        List<ModuleSummaryDto> modules = course.modules().stream()
                .map(this::toModuleSummary)
                .toList();
        return new CourseDetailDto(course.slug(), course.title(), course.description(), course.coverImage(), modules);
    }

    private CourseSummaryDto toSummary(Course course) {
        return new CourseSummaryDto(
                course.slug(),
                course.title(),
                course.description(),
                course.coverImage(),
                course.modules().size(),
                course.hasContent()
        );
    }

    private ModuleSummaryDto toModuleSummary(CourseModule module) {
        return new ModuleSummaryDto(
                module.slug(),
                module.title(),
                module.description(),
                module.lessons().size(),
                !module.children().isEmpty(),
                module.hasContent()
        );
    }
}
