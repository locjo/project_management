package com.example.projectmanagement.service;

import java.util.Locale;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import com.example.projectmanagement.dto.request.CreateLecturerRequest;
import com.example.projectmanagement.dto.response.LecturerAccountResponse;
import com.example.projectmanagement.entity.Lecturer;
import com.example.projectmanagement.entity.User;
import com.example.projectmanagement.entity.UserRole;
import com.example.projectmanagement.exception.AppException;
import com.example.projectmanagement.repository.UserRepository;

@Service
public class LecturerAccountService {
    private final UserRepository users;

    public LecturerAccountService(UserRepository users) { this.users = users; }

    @Transactional
    public LecturerAccountResponse create(CreateLecturerRequest request) {
        String username = request.username().trim();
        String email = request.email().trim().toLowerCase(Locale.ROOT);
        if (users.existsByUsernameIgnoreCase(username)) {
            throw new AppException("Tên đăng nhập đã được sử dụng", HttpStatus.CONFLICT);
        }
        if (users.existsByEmailIgnoreCase(email)) {
            throw new AppException("Email đã được sử dụng", HttpStatus.CONFLICT);
        }
        var user = User.builder().username(username).email(email).role(UserRole.LECTURER).isActive(true).build();
        var lecturer = Lecturer.builder().user(user).academicDegree(request.academicDegree() == null
                || request.academicDegree().isBlank() ? null : request.academicDegree().trim()).build();
        user.setLecturer(lecturer);
        try { users.saveAndFlush(user); }
        catch (DataIntegrityViolationException ex) {
            // Only actual account uniqueness violations are conflicts. Schema
            // errors must reach the global handler and be logged with their cause.
            for (Throwable cause = ex; cause != null; cause = cause.getCause()) {
                if (cause instanceof org.hibernate.exception.ConstraintViolationException violation
                        && "23505".equals(violation.getSQLState())) {
                    if ("ukr43af9ap4edm43mmtq01oddj6".equals(violation.getConstraintName())) {
                        throw new AppException("Tên đăng nhập đã được sử dụng", HttpStatus.CONFLICT);
                    }
                    if ("uk6dotkott2kjsp8vw4d0m25fb7".equals(violation.getConstraintName())) {
                        throw new AppException("Email đã được sử dụng", HttpStatus.CONFLICT);
                    }
                }
            }
            throw ex;
        }
        return new LecturerAccountResponse(lecturer.getId(), user.getId(), user.getUsername(), user.getEmail(), lecturer.getAcademicDegree());
    }
}
