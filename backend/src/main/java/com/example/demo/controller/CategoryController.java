package com.example.demo.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import com.example.demo.dto.CategoryRequestDto;
import com.example.demo.entity.PromptCategory;
import com.example.demo.service.CategoryService;

import java.util.List;

@RestController
@RequestMapping("/api/categories")
public class CategoryController {

    private final CategoryService categoryService;

    public CategoryController(CategoryService categoryService) {
        this.categoryService = categoryService;
    }

    @GetMapping
    public ResponseEntity<List<PromptCategory>> getAllCategories() {
        return ResponseEntity.ok(categoryService.getAllCategories());
    }

    @PostMapping("/{id}/rebuild-stats")
    public ResponseEntity<Void> rebuildStats(@PathVariable Long id) {
        categoryService.rebuildStats(id);
        return ResponseEntity.ok().build();
    }

    @PreAuthorize("hasAuthority('TEAM_LEAD')")
    @PostMapping
    public ResponseEntity<PromptCategory> createCategory(
            @RequestBody CategoryRequestDto request) {
        return ResponseEntity.ok(categoryService.createCategory(request.getName()));
    }

    @PreAuthorize("hasAuthority('TEAM_LEAD')")
    @PutMapping("/{id}")
    public ResponseEntity<PromptCategory> updateCategory(
            @PathVariable Long id,
            @RequestBody CategoryRequestDto request) {
        return ResponseEntity.ok(categoryService.updateCategory(id, request.getName()));
    }

    @PreAuthorize("hasAuthority('TEAM_LEAD')")
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteCategory(@PathVariable Long id) {
        categoryService.deleteCategory(id);
        return ResponseEntity.ok().build();
    }
}