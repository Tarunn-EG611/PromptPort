package com.example.demo.repository;
import com.example.demo.entity.PromptVersion;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface PromptVersionRepository extends JpaRepository<PromptVersion, Long> {

    List<PromptVersion> findByTemplateIdOrderByCreatedAtDesc(Long templateId);

    Optional<PromptVersion> findFirstByTemplateIdOrderByCreatedAtDesc(Long templateId);

    boolean existsByTemplateIdAndVersionTag(Long templateId, String versionTag);

    @Modifying
    void deleteByTemplateId(Long templateId);
}