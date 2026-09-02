package com.example.demo.repository;

import com.example.demo.entity.PromptTemplate;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface PromptTemplateRepository extends JpaRepository<PromptTemplate, Long> {

    List<PromptTemplate> findByIsPublicTrue();

    List<PromptTemplate> findByCreatorId(Long creatorId);

    static long countByCategoryId(Long categoryId) {

        throw new UnsupportedOperationException("Unimplemented method 'countByCategoryId'");
    }

    List<PromptTemplate> findByForkSourceId(Long forkSourceId);

    @Query("SELECT p FROM PromptTemplate p WHERE p.isPublic = true")
    List<PromptTemplate> findAllPublic();
}