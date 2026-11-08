package com.example.projectmanagement.service;

import java.util.List;
import java.util.Locale;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import com.example.projectmanagement.dto.request.CreateLecturerRequest;
import com.example.projectmanagement.dto.request.CreateStudentRequest;
import com.example.projectmanagement.dto.response.LecturerAccountResponse;
import com.example.projectmanagement.entity.*;
import com.example.projectmanagement.exception.AppException;
import com.example.projectmanagement.repository.*;

@Service
@Transactional
public class AccountManagementService {
    private final UserRepository users;
    private final LecturerRepository lecturers;
    private final StudentRepository students;
    private final RegistrationRepository registrations;
    private final TopicRepository topics;
    private final RefreshTokenRepository tokens;

    public AccountManagementService(UserRepository users, LecturerRepository lecturers, StudentRepository students,
            RegistrationRepository registrations, TopicRepository topics, RefreshTokenRepository tokens) {
        this.users = users; this.lecturers = lecturers; this.students = students;
        this.registrations = registrations; this.topics = topics; this.tokens = tokens;
    }

    @Transactional(readOnly = true)
    public List<LecturerAccountResponse> lecturers() {
        return lecturers.findAllByOrderByIdAsc().stream()
                .filter(l -> l.getUser().getRole() == UserRole.LECTURER)
                .map(l -> new LecturerAccountResponse(l.getId(), l.getUser().getId(), l.getUser().getUsername(),
                        l.getUser().getEmail(), l.getAcademicDegree())).toList();
    }

    private Lecturer lecturer(Long id) {
        Lecturer lecturer = lecturers.findById(id).orElseThrow(() -> new AppException("Không tìm thấy giảng viên", HttpStatus.NOT_FOUND));
        requireRole(lecturer.getUser(), UserRole.LECTURER);
        return lecturer;
    }

    private Student student(Long id) {
        Student student = students.findById(id).orElseThrow(() -> new AppException("Không tìm thấy sinh viên", HttpStatus.NOT_FOUND));
        requireRole(student.getUser(), UserRole.STUDENT);
        return student;
    }

    private void requireRole(User user, UserRole role) {
        if (user.getRole() != role) throw new AppException("Không được sửa hoặc xóa tài khoản quản lý", HttpStatus.FORBIDDEN);
    }

    private void updateUser(User user, String username, String email) {
        String normalizedUsername = username.trim();
        String normalizedEmail = email.trim().toLowerCase(Locale.ROOT);
        if (users.findByUsernameIgnoreCase(normalizedUsername).filter(u -> !u.getId().equals(user.getId())).isPresent())
            throw new AppException("Tên đăng nhập đã được sử dụng", HttpStatus.CONFLICT);
        if (users.findByEmailIgnoreCase(normalizedEmail).filter(u -> !u.getId().equals(user.getId())).isPresent())
            throw new AppException("Email đã được sử dụng", HttpStatus.CONFLICT);
        user.setUsername(normalizedUsername); user.setEmail(normalizedEmail);
    }

    public void updateLecturer(Long id, CreateLecturerRequest request) {
        Lecturer lecturer = lecturer(id);
        updateUser(lecturer.getUser(), request.username(), request.email());
        lecturer.setAcademicDegree(request.academicDegree() == null ? null : request.academicDegree().trim());
        users.flush();
    }

    public void updateStudent(Long id, CreateStudentRequest request) {
        Student student = student(id);
        if (students.existsByStudentCodeIgnoreCaseAndIdNot(request.studentCode().trim(), id))
            throw new AppException("Mã sinh viên đã tồn tại", HttpStatus.CONFLICT);
        updateUser(student.getUser(), request.username(), request.email());
        student.setStudentCode(request.studentCode().trim());
        student.setLastName(request.lastName().trim()); student.setFirstName(request.firstName().trim());
        student.setDateOfBirth(request.dateOfBirth());
        student.setClassCode(request.classCode() == null ? null : request.classCode().trim());
        student.setAcademicYear(request.academicYear().trim());
        students.flush();
    }

    public void deleteLecturer(Long id) {
        Lecturer lecturer = lecturer(id);
        if (topics.existsByLecturerId(id) || registrations.existsByLecturerId(id))
            throw new AppException("Không thể xóa giảng viên đã có đề tài hoặc hồ sơ đăng ký", HttpStatus.CONFLICT);
        tokens.deleteByUserId(lecturer.getUser().getId());
        users.delete(lecturer.getUser()); users.flush();
    }

    public void deleteStudent(Long id) {
        Student student = student(id);
        if (registrations.existsByStudentId(id))
            throw new AppException("Không thể xóa sinh viên đã có hồ sơ đăng ký đồ án", HttpStatus.CONFLICT);
        tokens.deleteByUserId(student.getUser().getId());
        users.delete(student.getUser()); users.flush();
    }
}
