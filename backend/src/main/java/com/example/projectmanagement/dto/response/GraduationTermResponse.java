package com.example.projectmanagement.dto.response;

import java.time.LocalDateTime;

public record GraduationTermResponse(
        Long id,
        String code,
        String name,
        String academicYear,
        String semester,
        LocalDateTime startDate,
        LocalDateTime endDate,
        LocalDateTime registrationDeadline,
        boolean active
) {
}
