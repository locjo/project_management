package com.example.projectmanagement.service;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.projectmanagement.dto.request.RegisterTopicRequest;
import com.example.projectmanagement.dto.request.UpdateRegistrationStatusRequest;
import com.example.projectmanagement.dto.response.RegistrationResponse;
import com.example.projectmanagement.entity.GraduationTerm;
import com.example.projectmanagement.entity.Lecturer;
import com.example.projectmanagement.entity.Registration;
import com.example.projectmanagement.entity.RegistrationStatus;
import com.example.projectmanagement.entity.Student;
import com.example.projectmanagement.entity.Topic;
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

    private static final int MAX_APPROVED_STUDENTS_PER_LECTURER = 5;

    private final RegistrationRepository registrationRepository;
    private final StudentRepository studentRepository;
    private final UserRepository userRepository;
    private final LecturerRepository lecturerRepository;
    private final GraduationTermRepository graduationTermRepository;
    private final TopicRepository topicRepository;

    public RegistrationService(RegistrationRepository registrationRepository,
                              StudentRepository studentRepository,
                              UserRepository userRepository,
                              LecturerRepository lecturerRepository,
                              GraduationTermRepository graduationTermRepository,
                              TopicRepository topicRepository) {
        this.registrationRepository = registrationRepository;
        this.studentRepository = studentRepository;
        this.userRepository = userRepository;
        this.lecturerRepository = lecturerRepository;
        this.graduationTermRepository = graduationTermRepository;
        this.topicRepository = topicRepository;
    }

    @Transactional
    public RegistrationResponse registerTopic(String username, RegisterTopicRequest request) {
        User user = userRepository.findByUsernameIgnoreCase(username)
                .orElseThrow(() -> new AppException("Không tìm thấy người dùng", HttpStatus.NOT_FOUND));

        Student student = studentRepository.findByUserId(user.getId())
                .orElseThrow(() -> new AppException("Tài khoản này không phải sinh viên", HttpStatus.BAD_REQUEST));

        Lecturer lecturer = lecturerRepository.findByUserId(request.lecturerId())
                .orElseThrow(() -> new AppException("Không tìm thấy giảng viên hướng dẫn", HttpStatus.NOT_FOUND));

        Topic topic = null;
        if (request.topicId() != null) {
            topic = topicRepository.findByIdAndActiveTrue(request.topicId())
                    .orElseThrow(() -> new AppException("Không tìm thấy đề tài gợi ý hợp lệ", HttpStatus.NOT_FOUND));

            if (!topic.getLecturer().getId().equals(lecturer.getId())) {
                throw new AppException("Đề tài gợi ý không thuộc giảng viên này", HttpStatus.BAD_REQUEST);
            }
        }

        GraduationTerm graduationTerm = graduationTermRepository.findById(request.graduationTermId())
                .orElseThrow(() -> new AppException("Không tìm thấy đợt đồ án", HttpStatus.NOT_FOUND));

        if (!graduationTerm.isActive()) {
            throw new AppException("Đợt đồ án hiện không hoạt động", HttpStatus.BAD_REQUEST);
        }

        String title = request.title() == null ? "" : request.title().trim();
        if (topic != null) {
            title = topic.getTitle();
        } else if (title.isEmpty()) {
            throw new AppException("Tên đề tài không được để trống", HttpStatus.BAD_REQUEST);
        }

        Registration registration = Registration.builder()
                .student(student)
                .graduationTerm(graduationTerm)
                .lecturer(lecturer)
                .topic(topic)
                .title(title)
                .status(RegistrationStatus.PENDING)
                .build();

        Registration saved = registrationRepository.save(registration);

        return toResponse(saved);
    }

    @Transactional(readOnly = true)
    public List<RegistrationResponse> getMyRegistrations(String username) {
        User user = userRepository.findByUsernameIgnoreCase(username)
                .orElseThrow(() -> new AppException("Không tìm thấy người dùng", HttpStatus.NOT_FOUND));

        Student student = studentRepository.findByUserId(user.getId())
                .orElseThrow(() -> new AppException("Tài khoản này không phải sinh viên", HttpStatus.BAD_REQUEST));

        return registrationRepository.findByStudentOrderByIdDesc(student)
                .stream()
                .map(this::toResponse)
                .toList();
    }

    @Transactional(readOnly = true)
    public List<RegistrationResponse> getPendingRegistrationsForLecturer(String username) {
        User user = userRepository.findByUsernameIgnoreCase(username)
                .orElseThrow(() -> new AppException("Không tìm thấy người dùng", HttpStatus.NOT_FOUND));

        Lecturer lecturer = lecturerRepository.findByUserId(user.getId())
                .orElseThrow(() -> new AppException("Tài khoản này không phải giảng viên", HttpStatus.BAD_REQUEST));

        return registrationRepository.findByLecturerIdAndStatusOrderByIdDesc(lecturer.getId(), RegistrationStatus.PENDING)
                .stream()
                .map(this::toResponse)
                .toList();
    }

    @Transactional
    public RegistrationResponse updateRegistrationStatus(String username, Long registrationId, UpdateRegistrationStatusRequest request) {
        User user = userRepository.findByUsernameIgnoreCase(username)
                .orElseThrow(() -> new AppException("Không tìm thấy người dùng", HttpStatus.NOT_FOUND));

        Lecturer lecturer = lecturerRepository.findByUserId(user.getId())
                .orElseThrow(() -> new AppException("Tài khoản này không phải giảng viên", HttpStatus.BAD_REQUEST));

        Registration registration = registrationRepository.findById(registrationId)
                .orElseThrow(() -> new AppException("Không tìm thấy đăng ký", HttpStatus.NOT_FOUND));

        if (!registration.getLecturer().getId().equals(lecturer.getId())) {
            throw new AppException("Bạn không có quyền xử lý đăng ký này", HttpStatus.FORBIDDEN);
        }

        if (request.status() == RegistrationStatus.APPROVED && registration.getStatus() != RegistrationStatus.APPROVED) {
            long approvedCount = registrationRepository.countByLecturerIdAndStatus(lecturer.getId(), RegistrationStatus.APPROVED);
            if (approvedCount >= MAX_APPROVED_STUDENTS_PER_LECTURER) {
                throw new AppException("Giảng viên đã đạt tối đa " + MAX_APPROVED_STUDENTS_PER_LECTURER + " sinh viên được nhận", HttpStatus.BAD_REQUEST);
            }
        }

        registration.setStatus(request.status());
        return toResponse(registrationRepository.save(registration));
    }

    private RegistrationResponse toResponse(Registration registration) {
        return new RegistrationResponse(
                registration.getId(),
                registration.getStudent().getId(),
                registration.getStudent().getFullName(),
                registration.getLecturer().getId(),
                registration.getLecturer().getUser().getUsername(),
                registration.getGraduationTerm().getId(),
                registration.getTitle(),
                registration.getStatus().name()
        );
    }
}
