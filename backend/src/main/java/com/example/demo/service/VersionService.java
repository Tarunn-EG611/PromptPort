package com.example.demo.service;

import com.example.demo.dto.VersionRequestDto;
import com.example.demo.entity.PromptTemplate;
import com.example.demo.entity.PromptVersion;
import com.example.demo.entity.Role;
import com.example.demo.exception.ResourceNotFoundException;
import com.example.demo.repository.PromptTemplateRepository;
import com.example.demo.repository.PromptVersionRepository;
import com.example.demo.repository.SystemUserRepository;
import jakarta.transaction.Transactional;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@Slf4j
public class VersionService {

    private final PromptVersionRepository versionRepository;
    private final PromptTemplateRepository templateRepository;
    private final SystemUserRepository userRepository;

    public VersionService(PromptVersionRepository versionRepository,
                          PromptTemplateRepository templateRepository,
                          SystemUserRepository userRepository) {
        this.versionRepository = versionRepository;
        this.templateRepository = templateRepository;
        this.userRepository = userRepository;
    }

    @Transactional
    public PromptVersion createVersion(Long templateId,
                                       VersionRequestDto dto,
                                       String username) {

        PromptTemplate template = templateRepository.findById(templateId)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Template not found"));

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

    @Transactional
    public void deleteVersion(Long versionId, String username) {

        PromptVersion version = versionRepository.findById(versionId)
                .orElseThrow(() -> new ResourceNotFoundException("Version not found"));

        com.example.demo.entity.SystemUser user = userRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        boolean isCreator = version.getTemplate().getCreator().getUsername().equals(username);
        boolean isTeamLead = user.getRole() == Role.TEAM_LEAD;

        if (!isCreator && !isTeamLead) {
            throw new RuntimeException("Not authorized to delete this version");
        }

        versionRepository.delete(version);
    }
}