package com.example.projectmanagement.mapper;

import com.example.projectmanagement.dto.response.LecturerOptionResponse;
import com.example.projectmanagement.dto.response.LecturerQuotaResponse;
import com.example.projectmanagement.entity.Lecturer;

public final class LecturerMapper {
    private LecturerMapper() {}

    public static LecturerOptionResponse toOptionResponse(Lecturer lecturer, int maximum, long availableSlots) {
        return new LecturerOptionResponse(lecturer.getId(), lecturer.getUser().getUsername(),
                lecturer.getAcademicDegree(), maximum, availableSlots);
    }

    public static LecturerQuotaResponse toQuotaResponse(Lecturer lecturer, int studentLimit, long approved, long availableSlots, long pending) {
        return new LecturerQuotaResponse(lecturer.getId(), lecturer.getUser().getUsername(),
                lecturer.getAcademicDegree(), studentLimit,
                approved, availableSlots, pending);
    }
}
