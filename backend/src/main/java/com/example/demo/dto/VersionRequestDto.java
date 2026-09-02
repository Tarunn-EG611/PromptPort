package com.example.demo.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class VersionRequestDto {

    @NotBlank
    private String versionTag;

    @NotBlank
    private String promptText;

    private Double temperature = 0.7;

    @NotBlank
    private String modelProvider;
}