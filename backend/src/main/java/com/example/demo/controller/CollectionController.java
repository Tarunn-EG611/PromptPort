package com.example.demo.controller;

import com.example.demo.dto.CollectionRequestDto;
import com.example.demo.entity.PromptCollection;
import com.example.demo.service.CollectionService;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;

@RestController
@RequestMapping("/api/collections")
public class CollectionController {

    private final CollectionService collectionService;

    public CollectionController(CollectionService collectionService) {
        this.collectionService = collectionService;
    }

    @PostMapping
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<PromptCollection> createCollection(
            @RequestBody CollectionRequestDto dto,
            Principal principal) {

        return ResponseEntity.ok(
                collectionService.createCollection(
                        dto.getName(),
                        dto.getDescription(),
                        dto.getMaxCapacity(),
                        principal.getName()));
    }

    @GetMapping("/mine")
    @PreAuthorize("hasAnyAuthority('PROMPT_ENGINEER','PROMPT_COLLECTOR','TEAM_LEAD')")
    public ResponseEntity<List<PromptCollection>> getMyCollections(
            Principal principal) {

        return ResponseEntity.ok(
                collectionService.getMyCollections(principal.getName()));
    }

    @PostMapping("/{id}/sync")
    @PreAuthorize("hasAnyAuthority('PROMPT_ENGINEER','PROMPT_COLLECTOR','TEAM_LEAD')")
    public ResponseEntity<PromptCollection> syncCollection(
            @PathVariable Long id,
            @RequestBody List<Long> promptIds,
            Principal principal) {

        return ResponseEntity.ok(
                collectionService.syncCollection(
                        id,
                        promptIds,
                        principal.getName()));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyAuthority('PROMPT_ENGINEER','PROMPT_COLLECTOR','TEAM_LEAD')")
    public ResponseEntity<Void> deleteCollection(
            @PathVariable Long id,
            Principal principal) {

        collectionService.deleteCollection(id, principal.getName());
        return ResponseEntity.ok().build();
    }
}