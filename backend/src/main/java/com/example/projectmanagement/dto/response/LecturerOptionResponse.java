package com.example.projectmanagement.dto.response;

public record LecturerOptionResponse(Long lecturerId, String lecturerName, String department,
        String academicDegree, int maxStudents, long availableSlots) {
}
