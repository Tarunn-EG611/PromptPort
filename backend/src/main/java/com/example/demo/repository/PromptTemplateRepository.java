package com.example.demo.repository;

import com.example.demo.entity.PromptTemplate;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface PromptTemplateRepository extends JpaRepository<PromptTemplate, Long> {

    List<PromptTemplate> findByIsPublicTrue();

    List<PromptTemplate> findByCreatorId(Long creatorId);

    long countByCategoryId(Long categoryId);

    List<PromptTemplate> findByForkSourceId(Long forkSourceId);
}