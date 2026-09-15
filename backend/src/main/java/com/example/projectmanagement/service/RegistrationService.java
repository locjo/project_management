package com.example.projectmanagement.service;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.projectmanagement.dto.request.CreateRegistrationRequest;
import com.example.projectmanagement.dto.request.UpdateRegistrationStatusRequest;
import com.example.projectmanagement.dto.response.RegistrationResponse;
import com.example.projectmanagement.entity.GraduationTerm;
import com.example.projectmanagement.entity.Lecturer;
import com.example.projectmanagement.entity.Registration;
import com.example.projectmanagement.entity.RegistrationStatus;
import com.example.projectmanagement.entity.Student;
import com.example.projectmanagement.entity.Topic;
import com.example.projectmanagement.entity.TopicCategory;
import com.example.projectmanagement.entity.User;
import com.example.projectmanagement.exception.AppException;
import com.example.projectmanagement.repository.GraduationTermRepository;
import com.example.projectmanagement.repository.LecturerRepository;
import com.example.projectmanagement.repository.RegistrationRepository;
import com.example.projectmanagement.repository.StudentRepository;
import com.example.projectmanagement.repository.TopicRepository;
import com.example.projectmanagement.repository.UserRepository;

@Service
public class RegistrationService {
    private final RegistrationRepository registrations;
    private final StudentRepository students;
    private final UserRepository users;
    private final LecturerRepository lecturers;
    private final GraduationTermRepository terms;
    private final TopicRepository topics;
    private final TopicCategoryService categories;

    public RegistrationService(RegistrationRepository registrations, StudentRepository students, UserRepository users,
            LecturerRepository lecturers, GraduationTermRepository terms, TopicRepository topics, TopicCategoryService categories) {
        this.registrations = registrations; this.students = students; this.users = users; this.lecturers = lecturers;
        this.terms = terms; this.topics = topics; this.categories = categories;
    }

    @Transactional
    public RegistrationResponse register(String username, CreateRegistrationRequest request) {
        Student student = studentFor(username);
        Lecturer lecturer = lecturers.findById(request.lecturerId()).orElseThrow(() -> notFound("Không tìm thấy giảng viên hướng dẫn"));
        GraduationTerm term = terms.findById(request.graduationTermId()).orElseThrow(() -> notFound("Không tìm thấy đợt đồ án"));
        if (!term.isActive() || LocalDateTime.now().isAfter(term.getRegistrationDeadline())) throw badRequest("Đợt đăng ký đã đóng");
        TopicCategory category = categories.getEntity(request.categoryId());
        if (!category.isActive()) throw badRequest("Lĩnh vực đề tài không hoạt động");

        Topic topic = null;
        String title = request.title() == null ? "" : request.title().trim();
        if (request.topicId() != null) {
            topic = topics.findByIdAndActiveTrue(request.topicId()).orElseThrow(() -> notFound("Không tìm thấy đề tài gợi ý"));
            if (!topic.getLecturer().getId().equals(lecturer.getId()) || !topic.getGraduationTerm().getId().equals(term.getId())
                    || !topic.getCategory().getId().equals(category.getId())) throw badRequest("Đề tài không khớp giảng viên, đợt hoặc lĩnh vực đã chọn");
            title = topic.getTitle();
        }
        if (title.isEmpty()) throw badRequest("Tên đề tài không được để trống");

        Registration registration = Registration.builder().student(student).lecturer(lecturer).graduationTerm(term)
                .category(category).topic(topic).title(title)
                .status(RegistrationStatus.PENDING).build();
        return toResponse(registrations.save(registration));
    }

    @Transactional(readOnly = true)
    public List<RegistrationResponse> getMyRegistrations(String username) {
        Student student = studentFor(username);
        return registrations.findByStudentOrderByIdDesc(student).stream().map(this::toResponse).toList();
    }

    @Transactional(readOnly = true)
    public List<RegistrationResponse> getPendingRegistrationsForLecturer(String username) {
        Lecturer lecturer = lecturerFor(username);
        return registrations.findByLecturerIdAndStatusOrderByIdDesc(lecturer.getId(), RegistrationStatus.PENDING).stream().map(this::toResponse).toList();
    }

    @Transactional
    public RegistrationResponse updateRegistrationStatus(String username, Long registrationId, UpdateRegistrationStatusRequest request) {
        Lecturer lecturer = lecturerFor(username);
        Registration registration = registrations.findById(registrationId).orElseThrow(() -> notFound("Không tìm thấy đăng ký"));
        if (!registration.getLecturer().getId().equals(lecturer.getId())) throw new AppException("Bạn không có quyền xử lý đăng ký này", HttpStatus.FORBIDDEN);
        if (request.status() == RegistrationStatus.APPROVED && registration.getStatus() != RegistrationStatus.APPROVED) {
            long count = registrations.countByLecturerIdAndGraduationTermIdAndStatus(lecturer.getId(), registration.getGraduationTerm().getId(), RegistrationStatus.APPROVED);
            if (count >= lecturer.getMaxStudents()) throw badRequest("Giảng viên đã đủ chỉ tiêu trong đợt này");
        }
        registration.setStatus(request.status());
        return toResponse(registrations.save(registration));
    }

    private Student studentFor(String username) {
        User user = users.findByUsernameIgnoreCase(username).orElseThrow(() -> notFound("Không tìm thấy người dùng"));
        return students.findByUserId(user.getId()).orElseThrow(() -> badRequest("Tài khoản này không phải sinh viên"));
    }
    private Lecturer lecturerFor(String username) {
        User user = users.findByUsernameIgnoreCase(username).orElseThrow(() -> notFound("Không tìm thấy người dùng"));
        return lecturers.findByUserId(user.getId()).orElseThrow(() -> badRequest("Tài khoản này không phải giảng viên"));
    }
    private AppException notFound(String message) { return new AppException(message, HttpStatus.NOT_FOUND); }
    private AppException badRequest(String message) { return new AppException(message, HttpStatus.BAD_REQUEST); }
    private RegistrationResponse toResponse(Registration r) {
        return new RegistrationResponse(r.getId(), r.getStudent().getId(), r.getStudent().getFullName(), r.getLecturer().getId(),
                r.getLecturer().getUser().getUsername(), r.getGraduationTerm().getId(), r.getCategory().getId(), r.getCategory().getName(),
                r.getTitle(), r.getStatus().name());
    }
}
