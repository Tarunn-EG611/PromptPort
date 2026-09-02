package com.example.demo.repository;

import com.example.demo.entity.PromptCollection;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface PromptCollectionRepository extends JpaRepository<PromptCollection, Long> {

    List<PromptCollection> findByOwnerId(Long ownerId);

    List<PromptCollection> findByTemplatesId(Long templateId);

    @Modifying
    @Query(value = "DELETE FROM collection_prompts WHERE template_id = :templateId", nativeQuery = true)
    void deleteAssociationsByTemplateId(Long templateId);
}