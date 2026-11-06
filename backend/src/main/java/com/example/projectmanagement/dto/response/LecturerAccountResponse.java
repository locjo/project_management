package com.example.projectmanagement.dto.response;

public record LecturerAccountResponse(Long lecturerId, Long userId, String username,
        String email, String academicDegree) {}
