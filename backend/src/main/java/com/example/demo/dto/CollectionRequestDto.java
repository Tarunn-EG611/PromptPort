package com.example.demo.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class CollectionRequestDto {

    @NotBlank(message = "Collection name is required")
    private String name;

    private String description;

    @Min(value = 1, message = "Max capacity must be at least 1")
    private int maxCapacity = 10;
}