package com.example.projectmanagement.dto.request;

import jakarta.validation.constraints.NotNull;

public record CreateRegistrationRequest(
        @NotNull(message = "graduationTermId không được để trống") Long graduationTermId,
        @NotNull(message = "lecturerId không được để trống") Long lecturerId,
        @NotNull(message = "categoryId không được để trống") Long categoryId,
        Long topicId,
        String title
) {
}
