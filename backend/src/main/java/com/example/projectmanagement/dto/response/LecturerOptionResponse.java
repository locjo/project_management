package com.example.projectmanagement.dto.response;

public record LecturerOptionResponse(Long lecturerId, String lecturerName,
        String academicDegree, int studentLimit, long availableSlots) {
}
