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
import com.example.projectmanagement.mapper.GraduationTermMapper;
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

        GraduationTerm term = GraduationTermMapper.toEntity(request);

        return GraduationTermMapper.toResponse(graduationTermRepository.save(term));
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

        GraduationTermMapper.updateEntity(term, request);

        return GraduationTermMapper.toResponse(graduationTermRepository.save(term));
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
                .map(GraduationTermMapper::toResponse)
                .toList();
    }

    @Transactional(readOnly = true)
    public List<GraduationTermResponse> getActive() {
        return graduationTermRepository.findByIsActiveTrueOrderByStartDateDesc()
                .stream()
                .map(GraduationTermMapper::toResponse)
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
        if (request.registerDate() == null || request.registerDate().isBefore(request.startDate())
                || request.registerDate().isAfter(request.endDate())) {
            throw new AppException("Hạn đăng ký phải từ ngày bắt đầu đến ngày kết thúc của đợt", HttpStatus.BAD_REQUEST);
        }
        if (request.startDate().isAfter(request.endDate())) {
            throw new AppException("Ngày bắt đầu phải nhỏ hơn hoặc bằng ngày kết thúc", HttpStatus.BAD_REQUEST);
        }
    }
}
