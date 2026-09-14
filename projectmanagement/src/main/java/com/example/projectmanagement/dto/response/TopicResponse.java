package com.example.projectmanagement.dto.response;

import java.time.LocalDateTime;

public record TopicResponse(
        Long id,
        Long lecturerId,
        String lecturerName,
        String title,
        String description,
        boolean active,
        LocalDateTime createdAt
) {
}
