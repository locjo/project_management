package com.example.projectmanagement.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public record CreateTopicRequest(
        @NotNull Long graduationTermId,
        @NotNull Long categoryId,
        @NotBlank @Size(max = 200) String title,
        @Size(max = 1000) String description,
        Long lecturerId
) {
    public CreateTopicRequest(Long graduationTermId, Long categoryId, String title, String description) {
        this(graduationTermId, categoryId, title, description, null);
    }
}
