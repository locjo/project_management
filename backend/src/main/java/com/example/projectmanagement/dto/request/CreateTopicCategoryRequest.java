package com.example.projectmanagement.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record CreateTopicCategoryRequest(
        @NotBlank String code,
        @NotBlank String name,
        String description,
        @NotNull Boolean isActive
) {
}
