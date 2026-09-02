package com.example.demo.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class TemplateRequestDto {

    @NotBlank
    private String title;

    private String description;

    @NotNull
    private Long categoryId;

    @NotBlank
    private String initialPromptText;

    @NotBlank
    private String modelProvider;

    private Boolean isPublic = false;
}