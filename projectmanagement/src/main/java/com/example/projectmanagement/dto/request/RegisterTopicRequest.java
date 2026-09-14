package com.example.projectmanagement.dto.request;


import jakarta.validation.constraints.NotNull;

public record RegisterTopicRequest(
        @NotNull(message = "graduationTermId không được để trống") Long graduationTermId,
        @NotNull(message = "lecturerId không được để trống") Long lecturerId,
        Long topicId,
        String title
) {
}
