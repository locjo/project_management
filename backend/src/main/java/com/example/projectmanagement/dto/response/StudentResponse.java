package com.example.projectmanagement.dto.response;

import java.time.LocalDate;

public record StudentResponse(
        Long id,
        Long userId,
        String username,
        String email,
        String studentCode,
        String fullName,
        LocalDate dateOfBirth,
        String classCode,
        String academicYear
) {}
