package com.example.demo.service;

import com.example.demo.dto.VersionRequestDto;
import com.example.demo.entity.PromptTemplate;
import com.example.demo.entity.PromptVersion;
import com.example.demo.exception.ResourceNotFoundException;
import com.example.demo.repository.PromptTemplateRepository;
import com.example.demo.repository.PromptVersionRepository;
import jakarta.transaction.Transactional;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@Slf4j
public class VersionService {

    private final PromptVersionRepository versionRepository;
    private final PromptTemplateRepository templateRepository;

    public VersionService(PromptVersionRepository versionRepository,
                          PromptTemplateRepository templateRepository) {
        this.versionRepository = versionRepository;
        this.templateRepository = templateRepository;
    }

    @Transactional
    public PromptVersion createVersion(Long templateId,
                                       VersionRequestDto dto,
                                       String username) {

        PromptTemplate template = templateRepository.findById(templateId)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Template not found"));

        if (!template.getCreator().getUsername().equals(username)) {
            throw new RuntimeException(
                    "Not authorized to publish version for this template");
        }

        if (versionRepository.existsByTemplateIdAndVersionTag(
                templateId, dto.getVersionTag())) {

            throw new RuntimeException(
                    "Version tag already exists for this template");
        }

        PromptVersion version = new PromptVersion();
        version.setTemplate(template);
        version.setVersionTag(dto.getVersionTag());
        version.setPromptText(dto.getPromptText());
        version.setTemperature(dto.getTemperature());
        version.setModelProvider(dto.getModelProvider());

        return versionRepository.save(version);
    }

    public List<PromptVersion> getVersionHistory(Long templateId) {
        return versionRepository
                .findByTemplateIdOrderByCreatedAtDesc(templateId);
    }
}