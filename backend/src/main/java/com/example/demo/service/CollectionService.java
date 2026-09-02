package com.example.demo.service;

import com.example.demo.entity.PromptCollection;
import com.example.demo.entity.PromptTemplate;
import com.example.demo.entity.SystemUser;
import com.example.demo.repository.PromptCollectionRepository;
import com.example.demo.repository.PromptTemplateRepository;
import com.example.demo.repository.SystemUserRepository;
import jakarta.transaction.Transactional;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Service
@Slf4j
public class CollectionService {

    private final PromptCollectionRepository collectionRepository;
    private final PromptTemplateRepository templateRepository;
    private final SystemUserRepository userRepository;

    public CollectionService(PromptCollectionRepository collectionRepository,
                             PromptTemplateRepository templateRepository,
                             SystemUserRepository userRepository) {
        this.collectionRepository = collectionRepository;
        this.templateRepository = templateRepository;
        this.userRepository = userRepository;
    }

    @Transactional
    public PromptCollection createCollection(String name,
                                             String description,
                                             int maxCapacity,
                                             String username) {

        SystemUser owner = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        PromptCollection collection = new PromptCollection();
        collection.setName(name);
        collection.setDescription(description);
        collection.setMaxCapacity(maxCapacity);
        collection.setOwner(owner);

        return collectionRepository.save(collection);
    }

    @Transactional
    public PromptCollection syncCollection(Long collectionId,
                                           List<Long> promptIds,
                                           String username) {

        PromptCollection collection = collectionRepository.findById(collectionId)
                .orElseThrow(() -> new RuntimeException("Collection not found"));

        if (!collection.getOwner().getUsername().equals(username)) {
            throw new RuntimeException("Not authorized to modify this collection");
        }

        if (promptIds.size() > collection.getMaxCapacity()) {
            throw new RuntimeException(
                    "Collection capacity exceeded. Max is "
                            + collection.getMaxCapacity());
        }

        Set<PromptTemplate> templates = new HashSet<>();

        for (Long id : promptIds) {
            PromptTemplate template = templateRepository.findById(id)
                    .orElseThrow(() ->
                            new RuntimeException("Template not found: " + id));

            templates.add(template);
        }

        collection.setTemplates(templates);

        return collectionRepository.save(collection);
    }

    public List<PromptCollection> getMyCollections(String username) {

        SystemUser user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        return collectionRepository.findByOwnerId(user.getId());
    }

    @Transactional
    public void deleteCollection(Long id, String username) {

        PromptCollection collection = collectionRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException("Collection not found"));

        if (!collection.getOwner().getUsername().equals(username)) {
            throw new RuntimeException(
                    "Not authorized to delete this collection");
        }

        collectionRepository.delete(collection);
        collectionRepository.flush();
    }
}