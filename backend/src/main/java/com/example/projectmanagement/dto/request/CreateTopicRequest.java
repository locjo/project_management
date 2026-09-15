package com.example.projectmanagement.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record CreateTopicRequest(
        @NotNull Long graduationTermId,
        @NotNull Long categoryId,
        @NotBlank String title,
        String description
) {
}
