package com.example.projectmanagement.dto.request;

import java.time.LocalDate;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record CreateStudentRequest(
        @NotBlank @Size(max = 50) String username,
        @NotBlank @Email @Size(max = 100) String email,
        @NotBlank @Size(max = 50) String studentCode,
        @NotBlank @Size(max = 100) String lastName,
        @NotBlank @Size(max = 50) String firstName,
        LocalDate dateOfBirth,
        @Size(max = 50) String classCode,
        @NotBlank @Size(max = 20) String academicYear
) {}
