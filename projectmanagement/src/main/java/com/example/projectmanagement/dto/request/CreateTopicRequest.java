package com.example.projectmanagement.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record CreateTopicRequest(
        @NotNull(message = "lecturerId không được để trống") Long lecturerId,
        @NotBlank(message = "Tên đề tài không được để trống") String title,
        String description
) {
}
