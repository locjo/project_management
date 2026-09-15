package com.example.projectmanagement.dto.response;

public record LecturerQuotaResponse(Long lecturerId, String lecturerName, String department, String academicDegree,
        int maxStudents, long approvedStudents, long availableSlots, long pendingRequests) {
}
