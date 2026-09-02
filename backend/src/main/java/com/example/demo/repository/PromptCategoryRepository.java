package com.example.demo.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.demo.entity.PromptCategory;

import java.util.Optional;

public interface PromptCategoryRepository extends JpaRepository<PromptCategory, Long> {

    Optional<PromptCategory> findBySlug(String slug);

    boolean existsByName(String name);
}