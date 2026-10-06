package com.example.projectmanagement.service;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.projectmanagement.dto.response.LecturerOptionResponse;
import com.example.projectmanagement.entity.RegistrationStatus;
import com.example.projectmanagement.exception.AppException;
import com.example.projectmanagement.mapper.LecturerMapper;
import com.example.projectmanagement.repository.GraduationTermRepository;
import com.example.projectmanagement.repository.LecturerRepository;
import com.example.projectmanagement.repository.RegistrationRepository;

@Service
public class LecturerService {
    private final LecturerRepository lecturers;
    private final GraduationTermRepository terms;
    private final RegistrationRepository registrations;

    public LecturerService(LecturerRepository lecturers, GraduationTermRepository terms,
            RegistrationRepository registrations) {
        this.lecturers = lecturers;
        this.terms = terms;
        this.registrations = registrations;
    }

    @Transactional(readOnly = true)
    public List<LecturerOptionResponse> getOptions(Long graduationTermId) {
        if (!terms.existsById(graduationTermId)) {
            throw new AppException("Không tìm thấy đợt đồ án", HttpStatus.NOT_FOUND);
        }
        // A lecturer can supervise a custom proposal without publishing a suggested topic.
        return lecturers.findAllByOrderByIdAsc().stream()
                .filter(lecturer -> lecturer.getUser().isActive())
                .map(lecturer -> {
                    int maximum = SupervisionPolicy.STUDENTS_PER_TERM;
                    long approved = registrations.countByLecturerIdAndGraduationTermIdAndStatus(
                            lecturer.getId(), graduationTermId, RegistrationStatus.APPROVED);
                    return LecturerMapper.toOptionResponse(lecturer, maximum, Math.max(0, maximum - approved));
                }).toList();
    }
}
