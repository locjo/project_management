package com.example.projectmanagement.service;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import com.example.projectmanagement.dto.response.ProfileResponse;
import com.example.projectmanagement.repository.UserRepository;
import com.example.projectmanagement.dto.request.UpdateProfileRequest;
import com.example.projectmanagement.entity.User;
import org.springframework.dao.DataIntegrityViolationException;

@Service
public class ProfileService {
    private final UserRepository users;

    public ProfileService(UserRepository users) { this.users = users; }

    @Transactional(readOnly = true)
    public ProfileResponse getProfile(String username) {
        var user = users.findByUsernameIgnoreCase(username)
                .orElseThrow(() -> new AuthServiceException("Không tìm thấy tài khoản", HttpStatus.NOT_FOUND));
        return toResponse(user);
    }

    @Transactional
    public ProfileResponse updateProfile(String username, UpdateProfileRequest request) {
        var user = users.findByUsernameIgnoreCase(username)
                .orElseThrow(() -> new AuthServiceException("Không tìm thấy tài khoản", HttpStatus.NOT_FOUND));
        String email = request.email().trim();
        if (users.findByEmailIgnoreCase(email).filter(other -> !other.getId().equals(user.getId())).isPresent()) {
            throw new AuthServiceException("Email đã được tài khoản khác sử dụng", HttpStatus.CONFLICT);
        }
        if (request.student() != null && user.getStudent() == null
                || request.lecturer() != null && user.getLecturer() == null) {
            throw new AuthServiceException("Thông tin hồ sơ không phù hợp với tài khoản", HttpStatus.BAD_REQUEST);
        }
        if (request.student() != null) {
            var data = request.student();
            String phone = nullable(data.phone());
            if (phone != null && users.existsByStudentPhoneAndIdNot(phone, user.getId())) {
                throw new AuthServiceException("Số điện thoại đã được sử dụng", HttpStatus.CONFLICT);
            }
            var student = user.getStudent();
            student.setLastName(data.lastName().trim());
            student.setFirstName(data.firstName().trim());
            student.setDateOfBirth(data.dateOfBirth());
            student.setClassCode(nullable(data.classCode()));
            student.setAcademicYear(data.academicYear().trim());
            student.setPhone(phone);
        }
        if (request.lecturer() != null) user.getLecturer().setAcademicDegree(nullable(request.lecturer().academicDegree()));
        user.setEmail(email);
        try { users.saveAndFlush(user); }
        catch (DataIntegrityViolationException ex) {
            throw new AuthServiceException("Email hoặc số điện thoại đã được sử dụng", HttpStatus.CONFLICT);
        }
        return toResponse(user);
    }

    private static String nullable(String value) { return value == null || value.isBlank() ? null : value.trim(); }

    private ProfileResponse toResponse(User user) {
        var student = user.getStudent();
        var lecturer = user.getLecturer();
        return new ProfileResponse(user.getId(), user.getUsername(), user.getEmail(), user.getRole().name(),
                user.isActive(), user.getCreatedAt(),
                student == null ? null : new ProfileResponse.StudentProfile(student.getStudentCode(),
                        student.getFullName(), student.getDateOfBirth(), student.getClassCode(),
                        student.getAcademicYear(), student.getPhone(), student.getLastName(), student.getFirstName()),
                lecturer == null ? null : new ProfileResponse.LecturerProfile(lecturer.getAcademicDegree()));
    }
}
