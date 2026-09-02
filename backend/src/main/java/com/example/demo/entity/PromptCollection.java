package com.example.demo.entity;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.Data;

import java.util.HashSet;
import java.util.Set;

@Data
@Entity
@Table(name = "prompt_collections")
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
public class PromptCollection {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "owner_id", nullable = false)
    private SystemUser owner;

    private String description;

    private Integer maxCapacity = 50;

    @ManyToMany
    @JoinTable(
        name = "collection_prompts",
        joinColumns = @JoinColumn(name = "collection_id"),
        inverseJoinColumns = @JoinColumn(name = "template_id")
    )
    private Set<PromptTemplate> templates = new HashSet<>();
}