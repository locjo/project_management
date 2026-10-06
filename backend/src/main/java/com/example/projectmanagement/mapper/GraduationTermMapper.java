package com.example.projectmanagement.mapper;

import com.example.projectmanagement.entity.GraduationTerm;
import com.example.projectmanagement.dto.response.GraduationTermResponse;
import com.example.projectmanagement.dto.request.CreateGraduationTermRequest;

public final class GraduationTermMapper {
    private GraduationTermMapper() {}

    public static GraduationTerm toEntity(CreateGraduationTermRequest request) {
        GraduationTerm term = GraduationTerm.builder().build();
        updateEntity(term, request);
        return term;
    }

    public static void updateEntity(GraduationTerm term, CreateGraduationTermRequest request) {
        term.setCode(request.code().trim());
        term.setName(request.name().trim());
        term.setAcademicYear(request.academicYear().trim());
        term.setSemester(request.semester().trim());
        term.setStartDate(request.startDate());
        term.setEndDate(request.endDate());
        term.setRegisterDate(request.registerDate());
        term.setActive(Boolean.TRUE.equals(request.isActive()));
    }

    public static GraduationTermResponse toResponse(GraduationTerm term) {
        return new GraduationTermResponse(
                term.getId(),
                term.getCode(),
                term.getName(),
                term.getAcademicYear(),
                term.getSemester(),
                term.getStartDate(),
                term.getEndDate(),
                term.getRegisterDate(),
                term.isActive()
        );
    }
}
