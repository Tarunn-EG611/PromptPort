package com.example.demo.entity;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Data
@Entity
@Table(name = "prompt_templates")
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
public class PromptTemplate {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String title;

    private String description;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "creator_id", nullable = false)
    @JsonIgnoreProperties({"hibernateLazyInitializer", "handler", "password", "collections", "role"})
    private SystemUser creator;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "category_id", nullable = false)
    @JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
    private PromptCategory category;

    @Column(name = "is_public")
    private Boolean isPublic = false;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "fork_source_id")
    @JsonIgnoreProperties({"hibernateLazyInitializer", "handler", "versions", "creator", "category", "forkSource"})
    private PromptTemplate forkSource;

    @Column(name = "created_at")
    private LocalDateTime createdAt = LocalDateTime.now();

    @OneToMany(mappedBy = "template",
               cascade = CascadeType.ALL,
               fetch = FetchType.LAZY)
    @JsonIgnoreProperties("template")
    private List<PromptVersion> versions = new ArrayList<>();
}