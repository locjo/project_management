package com.example.projectmanagement.dto.response;

import java.time.LocalDate;
import java.time.LocalDateTime;

public record ProfileResponse(Long id, String username, String email, String role,
        boolean active, LocalDateTime createdAt, StudentProfile student, LecturerProfile lecturer) {
    public record StudentProfile(String studentCode, String fullName, LocalDate dateOfBirth,
            String classCode, String academicYear, String phone, String lastName, String firstName) {}
    public record LecturerProfile(String academicDegree) {}
}
