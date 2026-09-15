package com.example.projectmanagement.service;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.projectmanagement.dto.response.LecturerQuotaResponse;
import com.example.projectmanagement.entity.RegistrationStatus;
import com.example.projectmanagement.exception.AppException;
import com.example.projectmanagement.repository.GraduationTermRepository;
import com.example.projectmanagement.repository.LecturerRepository;
import com.example.projectmanagement.repository.RegistrationRepository;

@Service
public class DashboardService {
    private final LecturerRepository lecturers;
    private final RegistrationRepository registrations;
    private final GraduationTermRepository terms;
    public DashboardService(LecturerRepository lecturers, RegistrationRepository registrations, GraduationTermRepository terms) {
        this.lecturers = lecturers; this.registrations = registrations; this.terms = terms;
    }
    @Transactional(readOnly = true)
    public List<LecturerQuotaResponse> lecturerQuotas(Long termId) {
        if (!terms.existsById(termId)) throw new AppException("Không tìm thấy đợt đồ án", HttpStatus.NOT_FOUND);
        return lecturers.findAll().stream().map(lecturer -> {
            long approved = registrations.countByLecturerIdAndGraduationTermIdAndStatus(lecturer.getId(), termId, RegistrationStatus.APPROVED);
            long pending = registrations.countByLecturerIdAndGraduationTermIdAndStatus(lecturer.getId(), termId, RegistrationStatus.PENDING);
            return new LecturerQuotaResponse(lecturer.getId(), lecturer.getUser().getUsername(), lecturer.getDepartment(), lecturer.getAcademicDegree(),
                    lecturer.getMaxStudents(), approved, Math.max(0, lecturer.getMaxStudents() - approved), pending);
        }).toList();
    }
}
