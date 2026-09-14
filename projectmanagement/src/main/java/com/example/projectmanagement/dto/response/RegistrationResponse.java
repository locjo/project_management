package com.example.projectmanagement.dto.response;

public record RegistrationResponse(
        Long id,
        Long studentId,
        String studentName,
        Long lecturerId,
        String lecturerName,
        Long graduationTermId,
        String title,
        String status
) {
}
