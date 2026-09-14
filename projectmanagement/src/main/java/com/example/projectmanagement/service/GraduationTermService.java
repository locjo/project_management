package com.example.projectmanagement.service;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.projectmanagement.dto.request.CreateGraduationTermRequest;
import com.example.projectmanagement.dto.response.GraduationTermResponse;
import com.example.projectmanagement.entity.GraduationTerm;
import com.example.projectmanagement.exception.AppException;
import com.example.projectmanagement.repository.GraduationTermRepository;
import com.example.projectmanagement.repository.RegistrationRepository;

@Service
public class GraduationTermService {

    private final GraduationTermRepository graduationTermRepository;
    private final RegistrationRepository registrationRepository;

    public GraduationTermService(GraduationTermRepository graduationTermRepository,
                                RegistrationRepository registrationRepository) {
        this.graduationTermRepository = graduationTermRepository;
        this.registrationRepository = registrationRepository;
    }

    @Transactional
    public GraduationTermResponse create(CreateGraduationTermRequest request) {
        validateRequest(request);

        graduationTermRepository.findByCodeIgnoreCase(request.code())
                .ifPresent(existing -> {
                    throw new AppException("Mã đợt đồ án đã tồn tại", HttpStatus.BAD_REQUEST);
                });

        GraduationTerm term = GraduationTerm.builder()
                .code(request.code().trim())
                .name(request.name().trim())
                .academicYear(request.academicYear().trim())
                .semester(request.semester().trim())
                .startDate(request.startDate())
                .endDate(request.endDate())
                .registrationDeadline(request.registrationDeadline())
                .isActive(Boolean.TRUE.equals(request.isActive()))
                .build();

        return toResponse(graduationTermRepository.save(term));
    }

    @Transactional
    public GraduationTermResponse update(Long id, CreateGraduationTermRequest request) {
        GraduationTerm term = graduationTermRepository.findById(id)
                .orElseThrow(() -> new AppException("Không tìm thấy đợt đồ án", HttpStatus.NOT_FOUND));

        validateRequest(request);

        String trimmedCode = request.code().trim();
        graduationTermRepository.findByCodeIgnoreCase(trimmedCode)
                .ifPresent(existing -> {
                    if (!existing.getId().equals(id)) {
                        throw new AppException("Mã đợt đồ án đã tồn tại", HttpStatus.BAD_REQUEST);
                    }
                });

        term.setCode(trimmedCode);
        term.setName(request.name().trim());
        term.setAcademicYear(request.academicYear().trim());
        term.setSemester(request.semester().trim());
        term.setStartDate(request.startDate());
        term.setEndDate(request.endDate());
        term.setRegistrationDeadline(request.registrationDeadline());
        term.setActive(Boolean.TRUE.equals(request.isActive()));

        return toResponse(graduationTermRepository.save(term));
    }

    @Transactional
    public void delete(Long id) {
        GraduationTerm term = graduationTermRepository.findById(id)
                .orElseThrow(() -> new AppException("Không tìm thấy đợt đồ án", HttpStatus.NOT_FOUND));

        if (registrationRepository.existsByGraduationTermId(id)) {
            throw new AppException("Không thể xóa đợt đồ án vì đã có sinh viên đăng ký", HttpStatus.BAD_REQUEST);
        }

        graduationTermRepository.delete(term);
    }

    @Transactional(readOnly = true)
    public List<GraduationTermResponse> getAll() {
        return graduationTermRepository.findAllByOrderByStartDateDesc()
                .stream()
                .map(this::toResponse)
                .toList();
    }

    @Transactional(readOnly = true)
    public List<GraduationTermResponse> getActive() {
        return graduationTermRepository.findByIsActiveTrueOrderByStartDateDesc()
                .stream()
                .map(this::toResponse)
                .toList();
    }

    @Scheduled(fixedRate = 60000)
    @Transactional
    public void deactivateExpiredGraduationTerms() {
        LocalDateTime now = LocalDateTime.now();
        List<GraduationTerm> expiredTerms = graduationTermRepository.findByIsActiveTrueAndEndDateBefore(now);

        for (GraduationTerm term : expiredTerms) {
            term.setActive(false);
        }
    }

    private void validateRequest(CreateGraduationTermRequest request) {
        if (request.startDate().isAfter(request.endDate())) {
            throw new AppException("Ngày bắt đầu phải nhỏ hơn hoặc bằng ngày kết thúc", HttpStatus.BAD_REQUEST);
        }

        if (request.registrationDeadline().isAfter(request.startDate())) {
            throw new AppException("Hạn đăng ký phải nhỏ hơn hoặc bằng ngày bắt đầu", HttpStatus.BAD_REQUEST);
        }
    }

    private GraduationTermResponse toResponse(GraduationTerm term) {
        return new GraduationTermResponse(
                term.getId(),
                term.getCode(),
                term.getName(),
                term.getAcademicYear(),
                term.getSemester(),
                term.getStartDate(),
                term.getEndDate(),
                term.getRegistrationDeadline(),
                term.isActive()
        );
    }
}
