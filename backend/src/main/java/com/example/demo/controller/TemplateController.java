package com.example.demo.controller;

import com.example.demo.dto.TemplateRequestDto;
import com.example.demo.entity.PromptTemplate;
import com.example.demo.service.TemplateService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/templates")
public class TemplateController {

    private final TemplateService templateService;

    public TemplateController(TemplateService templateService) {
        this.templateService = templateService;
    }

    @GetMapping("/analytics")
    @PreAuthorize("hasAuthority('TEAM_LEAD')")
    public ResponseEntity<Map<String, Object>> getAnalytics() {
        return ResponseEntity.ok(new HashMap<>());
    }

    @PostMapping
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<String> createTemplate(
            @Valid @RequestBody TemplateRequestDto dto,
            Principal principal) {

        templateService.createTemplate(dto, principal.getName());

        return ResponseEntity.status(HttpStatus.CREATED)
                .body("PromptTemplate created successfully.");
    }

    @PutMapping("/{id}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<String> updateTemplate(
            @PathVariable Long id,
            @Valid @RequestBody TemplateRequestDto dto,
            Principal principal) {

        templateService.updateTemplate(id, dto, principal.getName());

        return ResponseEntity.ok("PromptTemplate updated successfully.");
    }

    @PostMapping("/{id}/fork")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<PromptTemplate> forkTemplate(
            @PathVariable Long id,
            Principal principal) {

        PromptTemplate template =
                templateService.forkTemplate(id, principal.getName());

        return ResponseEntity.ok(template);
    }

    @GetMapping("/public")
    public ResponseEntity<List<PromptTemplate>> getPublicTemplates() {

        List<PromptTemplate> templates =
                templateService.getPublicTemplates();

        return ResponseEntity.ok(templates);
    }

    @GetMapping("/mine")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<List<PromptTemplate>> getMyTemplates(
            Principal principal) {

        List<PromptTemplate> templates =
                templateService.getUserTemplates(principal.getName());

        return ResponseEntity.ok(templates);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<String> deleteTemplate(
            @PathVariable Long id,
            Principal principal) {

        templateService.deleteTemplate(id, principal.getName());

        return ResponseEntity.ok("PromptTemplate deleted successfully.");
    }

    @GetMapping("/{id}")
    public ResponseEntity<PromptTemplate> getTemplate(
            @PathVariable Long id) {

        PromptTemplate template =
                templateService.getTemplate(id);

        return ResponseEntity.ok(template);
    }
}