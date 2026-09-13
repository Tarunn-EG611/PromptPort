package com.example.demo.service;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.demo.entity.PromptCategory;
import com.example.demo.repository.PromptCategoryRepository;
import com.example.demo.repository.PromptTemplateRepository;

import java.util.List;

@Service
public class CategoryService {

    private final PromptCategoryRepository categoryRepository;
    public CategoryService(PromptCategoryRepository categoryRepository,
                           PromptTemplateRepository templateRepository) {
        this.categoryRepository = categoryRepository;
    }

    public List<PromptCategory> getAllCategories() {
        return categoryRepository.findAll();
    }

    @Transactional
    public void rebuildStats(Long categoryId) {
        PromptCategory category = categoryRepository.findById(categoryId)
                .orElseThrow(() -> new RuntimeException("Category not found"));

        category.setTemplateCount((int)PromptTemplateRepository.countByCategoryId(categoryId));
        categoryRepository.save(category);
    }

    @Transactional
    public PromptCategory createCategory(String name) {
        PromptCategory category = new PromptCategory();
        category.setName(name);
        category.setSlug(name.toLowerCase(java.util.Locale.ROOT).replace(" ", "-"));
        category.setTemplateCount(0);
        return categoryRepository.save(category);
    }

    @Transactional
    public PromptCategory updateCategory(Long id, String name) {
        PromptCategory category = categoryRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Category not found"));

        category.setName(name);
        category.setSlug(name.toLowerCase(java.util.Locale.ROOT).replace(" ", "-"));

        return categoryRepository.save(category);
    }

    @Transactional
    public void deleteCategory(Long id) {
        PromptCategory category = categoryRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Category not found"));

        categoryRepository.delete(category);
    }
}