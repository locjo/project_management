package com.example.projectmanagement.dto.response;

public record LecturerQuotaResponse(Long lecturerId, String lecturerName, String academicDegree,
        int studentLimit, long approvedStudents, long availableSlots, long pendingRequests) {
}
