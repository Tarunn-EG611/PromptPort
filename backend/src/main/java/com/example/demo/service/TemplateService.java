package com.example.demo.service;

import com.example.demo.dto.TemplateRequestDto;
import com.example.demo.entity.*;
import com.example.demo.exception.ResourceNotFoundException;
import com.example.demo.repository.*;
import jakarta.transaction.Transactional;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@Slf4j
public class TemplateService {

    private final PromptTemplateRepository templateRepository;
    private final PromptVersionRepository versionRepository;
    private final PromptCategoryRepository categoryRepository;
    private final SystemUserRepository userRepository;
    private final PromptCollectionRepository collectionRepository;

    public TemplateService(PromptTemplateRepository templateRepository,
                           PromptVersionRepository versionRepository,
                           PromptCategoryRepository categoryRepository,
                           SystemUserRepository userRepository,
                           PromptCollectionRepository collectionRepository) {
        this.templateRepository = templateRepository;
        this.versionRepository = versionRepository;
        this.categoryRepository = categoryRepository;
        this.userRepository = userRepository;
        this.collectionRepository = collectionRepository;
    }

    @Transactional
    public PromptTemplate createTemplate(TemplateRequestDto dto, String username) {

        SystemUser creator = userRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        PromptCategory category = categoryRepository.findById(dto.getCategoryId())
                .orElseThrow(() -> new ResourceNotFoundException("Category not found"));

        PromptTemplate template = new PromptTemplate();
        template.setTitle(dto.getTitle());
        template.setDescription(dto.getDescription());
        template.setCreator(creator);
        template.setCategory(category);
        template.setIsPublic(dto.getIsPublic());

        template = templateRepository.save(template);

        PromptVersion version = new PromptVersion();
        version.setTemplate(template);
        version.setVersionTag("v1.0.0");
        version.setPromptText(dto.getInitialPromptText());
        version.setModelProvider(dto.getModelProvider());

        versionRepository.save(version);

        category.setTemplateCount(
                (category.getTemplateCount() == null ? 0 : category.getTemplateCount()) + 1
        );

        categoryRepository.save(category);

        return template;
    }


    @Transactional
    public PromptTemplate updateTemplate(Long id,
                                         TemplateRequestDto dto,
                                         String username) {

        PromptTemplate template = templateRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Template not found"));

        if (!template.getCreator().getUsername().equals(username)) {
            throw new RuntimeException("Not authorized to update this template");
        }

        PromptCategory category = categoryRepository.findById(dto.getCategoryId())
                .orElseThrow(() -> new ResourceNotFoundException("Category not found"));

        template.setTitle(dto.getTitle());
        template.setDescription(dto.getDescription());
        template.setCategory(category);
        template.setIsPublic(dto.getIsPublic());

        templateRepository.save(template);

        PromptVersion version = new PromptVersion();
        version.setTemplate(template);
        version.setVersionTag("v1.0.0");
        version.setPromptText(dto.getInitialPromptText());
        version.setModelProvider(dto.getModelProvider());

        versionRepository.save(version);

        return template;
    }


    @Transactional
    public PromptTemplate forkTemplate(Long sourceId, String username) {

        PromptTemplate source = templateRepository.findById(sourceId)
                .orElseThrow(() -> new ResourceNotFoundException("Source template not found"));

        SystemUser user = userRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        PromptVersion latest = versionRepository
                .findFirstByTemplateIdOrderByCreatedAtDesc(sourceId)
                .orElseThrow(() -> new RuntimeException("No versions found for source"));

        PromptTemplate fork = new PromptTemplate();
        fork.setTitle("Fork of " + source.getTitle());
        fork.setDescription(source.getDescription());
        fork.setCreator(user);
        fork.setCategory(source.getCategory());
        fork.setIsPublic(false);
        fork.setForkSource(source);

        fork = templateRepository.save(fork);

        PromptVersion version = new PromptVersion();
        version.setTemplate(fork);
        version.setVersionTag("v1.0.0");
        version.setPromptText(latest.getPromptText());
        version.setTemperature(latest.getTemperature());
        version.setModelProvider(latest.getModelProvider());

        versionRepository.save(version);

        PromptCategory category = source.getCategory();

        category.setTemplateCount(
                (category.getTemplateCount() == null ? 0 : category.getTemplateCount()) + 1
        );

        categoryRepository.save(category);

        return fork;
    }


    public List<PromptTemplate> getPublicTemplates() {
        return templateRepository.findByIsPublicTrue();
    }


    public PromptTemplate getTemplate(Long id) {

        return templateRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Template not found with ID: " + id
                        ));
    }


    public List<PromptTemplate> getUserTemplates(String username) {

        SystemUser user = userRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        return templateRepository.findByCreatorId(user.getId());
    }


    @Transactional
    public void deleteTemplate(Long id, String username) {

        try {

            PromptTemplate template = templateRepository.findById(id)
                    .orElseThrow(() ->
                            new ResourceNotFoundException("Template not found"));

            if (!template.getCreator().getUsername().equals(username)) {
                throw new RuntimeException(
                        "Not authorized to delete this template"
                );
            }

            List<PromptTemplate> forks =
                    templateRepository.findByForkSourceId(id);

            for (PromptTemplate fork : forks) {
                fork.setForkSource(null);
            }

            templateRepository.saveAllAndFlush(forks);

            collectionRepository.deleteAssociationsByTemplateId(id);

            versionRepository.deleteByTemplateId(id);

            PromptCategory category = template.getCategory();

            if (category != null &&
                    category.getTemplateCount() != null &&
                    category.getTemplateCount() > 0) {

                category.setTemplateCount(
                        category.getTemplateCount() - 1
                );

                categoryRepository.saveAndFlush(category);
            }

            templateRepository.delete(template);
            templateRepository.flush();

        } catch (RuntimeException e) {
            throw new RuntimeException("Could not delete template: " + e.getMessage(), e);
        }
    }
}