package com.example.projectmanagement.dto.response;

import java.time.LocalDateTime;

public record TopicResponse(
        Long id,
        Long lecturerId,
        String lecturerName,
        Long graduationTermId,
        Long categoryId,
        String categoryName,
        String title,
        String description,
        boolean active,
        LocalDateTime createdAt
) {
}
