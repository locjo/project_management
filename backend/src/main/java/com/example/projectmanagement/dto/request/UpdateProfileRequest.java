package com.example.projectmanagement.dto.request;

import java.time.LocalDate;
import jakarta.validation.Valid;
import jakarta.validation.constraints.*;

public record UpdateProfileRequest(
        @NotBlank @Email @Size(max = 100) String email,
        @Valid StudentDetails student,
        @Valid LecturerDetails lecturer) {
    public record StudentDetails(
            @NotBlank @Size(max = 100) String lastName,
            @NotBlank @Size(max = 50) String firstName,
            @PastOrPresent LocalDate dateOfBirth,
            @Size(max = 50) String classCode,
            @NotBlank @Size(max = 20) String academicYear,
            @Size(max = 20) @Pattern(regexp = "^$|[+0-9][0-9 ()-]{5,19}", message = "Số điện thoại không hợp lệ") String phone) {}
    public record LecturerDetails(@Size(max = 100) String academicDegree) {}
}
