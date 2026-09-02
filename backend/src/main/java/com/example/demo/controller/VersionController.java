package com.example.demo.controller;

import com.example.demo.dto.VersionRequestDto;
import com.example.demo.entity.PromptVersion;
import com.example.demo.service.VersionService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;

@RestController
@RequestMapping("/api/versions")
public class VersionController {

    private final VersionService versionService;

    public VersionController(VersionService versionService) {
        this.versionService = versionService;
    }

    @PostMapping("/template/{templateId}")
    @PreAuthorize("hasAnyAuthority('PROMPT_ENGINEER','TEAM_LEAD')")
    public ResponseEntity<PromptVersion> createVersion(
            @PathVariable Long templateId,
            @Valid @RequestBody VersionRequestDto dto,
            Principal principal) {

        return ResponseEntity.ok(
                versionService.createVersion(templateId, dto, principal.getName())
        );
    }

    @GetMapping("/template/{templateId}")
    public ResponseEntity<List<PromptVersion>> getVersionHistory(
            @PathVariable Long templateId) {

        return ResponseEntity.ok(
                versionService.getVersionHistory(templateId)
        );
    }
}