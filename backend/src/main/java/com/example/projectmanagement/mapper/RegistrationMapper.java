package com.example.projectmanagement.mapper;

import com.example.projectmanagement.entity.Registration;
import com.example.projectmanagement.dto.response.RegistrationResponse;
import com.example.projectmanagement.entity.TopicCategory;

public final class RegistrationMapper {
    private RegistrationMapper() {}

    public static RegistrationResponse toResponse(Registration r) {
        // Existing registrations may predate the optional category association.
        TopicCategory category = r.getCategory();
        return new RegistrationResponse(r.getId(), r.getStudent().getId(), r.getStudent().getFullName(), r.getLecturer().getId(),
                r.getLecturer().getUser().getUsername(), r.getGraduationTerm().getId(),
                category == null ? null : category.getId(), category == null ? "Chưa phân loại" : category.getName(),
                r.getTitle(), r.getStatus().name());
    }
}
