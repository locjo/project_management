package com.example.projectmanagement.service;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.projectmanagement.dto.request.CreateTopicRequest;
import com.example.projectmanagement.dto.response.TopicResponse;
import com.example.projectmanagement.entity.GraduationTerm;
import com.example.projectmanagement.entity.Lecturer;
import com.example.projectmanagement.entity.Topic;
import com.example.projectmanagement.entity.TopicCategory;
import com.example.projectmanagement.entity.User;
import com.example.projectmanagement.entity.UserRole;
import com.example.projectmanagement.entity.TopicStatus;
import com.example.projectmanagement.exception.AppException;
import com.example.projectmanagement.mapper.TopicMapper;
import com.example.projectmanagement.repository.GraduationTermRepository;
import com.example.projectmanagement.repository.LecturerRepository;
import com.example.projectmanagement.repository.TopicRepository;
import com.example.projectmanagement.repository.UserRepository;
import com.example.projectmanagement.repository.RegistrationRepository;

@Service
public class TopicService {
    private final TopicRepository topicRepository;
    private final LecturerRepository lecturerRepository;
    private final UserRepository userRepository;
    private final GraduationTermRepository graduationTermRepository;
    private final TopicCategoryService categoryService;
    private final RegistrationRepository registrations;

    public TopicService(TopicRepository topicRepository, LecturerRepository lecturerRepository, UserRepository userRepository,
                        GraduationTermRepository graduationTermRepository, TopicCategoryService categoryService, RegistrationRepository registrations) {
        this.topicRepository = topicRepository;
        this.lecturerRepository = lecturerRepository;
        this.userRepository = userRepository;
        this.graduationTermRepository = graduationTermRepository;
        this.categoryService = categoryService;
        this.registrations = registrations;
    }

    @Transactional
    public TopicResponse create(String username, CreateTopicRequest request) {
        Lecturer lecturer = assignedLecturer(username, request.lecturerId());
        GraduationTerm term = term(request.graduationTermId());
        TopicCategory category = categoryService.getEntity(request.categoryId());
        if (!term.isActive() || !category.isActive()) throw new AppException("Đợt hoặc lĩnh vực không hoạt động", HttpStatus.BAD_REQUEST);
        return TopicMapper.toResponse(topicRepository.save(Topic.builder().lecturer(lecturer).graduationTerm(term).category(category)
                .title(request.title().trim()).description(trimToNull(request.description())).active(true)
                .status(TopicStatus.PENDING).createdAt(LocalDateTime.now()).build()));
    }

    @Transactional(readOnly = true)
    public List<TopicResponse> getAll(Long termId, Long categoryId) {
        List<Topic> topics = categoryId == null
                ? topicRepository.findByGraduationTermIdAndStatusAndActiveTrueOrderByCreatedAtDesc(termId, TopicStatus.APPROVED)
                : topicRepository.findByGraduationTermIdAndCategoryIdAndStatusAndActiveTrueOrderByCreatedAtDesc(termId, categoryId, TopicStatus.APPROVED);
        return topics.stream().map(TopicMapper::toResponse).toList();
    }

    @Transactional
    public TopicResponse update(String username, Long id, CreateTopicRequest request) {
        Topic topic = topicRepository.findById(id).orElseThrow(() -> new AppException("Không tìm thấy đề tài", HttpStatus.NOT_FOUND));
        requireManagerOrOwner(username, topic);
        if (!topic.isActive()) throw new AppException("Không tìm thấy đề tài", HttpStatus.NOT_FOUND);
        if (registrations.existsByTopicId(id)) throw new AppException("Không thể sửa đề tài đã có hồ sơ đăng ký", HttpStatus.CONFLICT);
        GraduationTerm targetTerm = term(request.graduationTermId());
        TopicCategory targetCategory = categoryService.getEntity(request.categoryId());
        if (!topic.getGraduationTerm().isActive() || !targetTerm.isActive() || !targetCategory.isActive())
            throw new AppException("Đợt hoặc lĩnh vực không hoạt động", HttpStatus.BAD_REQUEST);
        topic.setGraduationTerm(targetTerm);
        topic.setCategory(targetCategory);
        if (request.lecturerId() != null) topic.setLecturer(assignedLecturer(username, request.lecturerId()));
        topic.setTitle(request.title().trim());
        topic.setDescription(trimToNull(request.description()));
        topic.setStatus(TopicStatus.PENDING);
        return TopicMapper.toResponse(topicRepository.save(topic));
    }

    @Transactional
    public void delete(String username, Long id) {
        Topic topic = topicRepository.findById(id).orElseThrow(() -> new AppException("Không tìm thấy đề tài", HttpStatus.NOT_FOUND));
        requireManagerOrOwner(username, topic);
        topic.setActive(false);
        topicRepository.save(topic);
    }

    @Transactional(readOnly = true)
    public List<TopicResponse> getMine(String username, Long termId) {
        Lecturer lecturer = lecturerFor(username);
        return topicRepository.findByLecturerIdAndGraduationTermIdAndActiveTrueOrderByCreatedAtDesc(lecturer.getId(), termId)
                .stream().map(TopicMapper::toResponse).toList();
    }

    @Transactional(readOnly = true)
    public List<TopicResponse> getForDepartment(String username, Long termId) {
        requireReviewer(username);
        return topicRepository.findByGraduationTermIdAndActiveTrueOrderByCreatedAtDesc(termId)
                .stream()
                .map(TopicMapper::toResponse).toList();
    }

    @Transactional(readOnly = true)
    public List<TopicResponse> getPendingForDepartment(String username, Long termId) {
        requireReviewer(username);
        return topicRepository.findByGraduationTermIdAndStatusAndActiveTrueOrderByCreatedAtDesc(termId, TopicStatus.PENDING)
                .stream()
                .map(TopicMapper::toResponse).toList();
    }

    @Transactional
    public TopicResponse review(String username, Long topicId, TopicStatus decision) {
        requireReviewer(username);
        if (decision != TopicStatus.APPROVED && decision != TopicStatus.REJECTED) {
            throw new AppException("Chỉ được phê duyệt hoặc từ chối đề tài", HttpStatus.BAD_REQUEST);
        }
        Topic topic = topicRepository.findByIdAndActiveTrue(topicId)
                .orElseThrow(() -> new AppException("Không tìm thấy đề tài", HttpStatus.NOT_FOUND));
        if (topic.getStatus() != TopicStatus.PENDING) {
            throw new AppException("Đề tài đã được xử lý. Vui lòng tải lại danh sách", HttpStatus.CONFLICT);
        }
        if (!topic.getGraduationTerm().isActive()) {
            throw new AppException("Đợt đồ án đã đóng", HttpStatus.BAD_REQUEST);
        }
        topic.setStatus(decision);
        return TopicMapper.toResponse(topicRepository.save(topic));
    }

    private void requireReviewer(String username) {
        User user = userRepository.findByUsernameIgnoreCase(username)
                .orElseThrow(() -> new AppException("Không tìm thấy người dùng", HttpStatus.NOT_FOUND));
        if (user.getRole() != UserRole.HEAD_OF_DEPARTMENT && user.getRole() != UserRole.FACULTY_LEADER) {
            throw new AppException("Chỉ trưởng bộ môn hoặc lãnh đạo khoa được duyệt đề tài", HttpStatus.FORBIDDEN);
        }
    }

    private boolean manager(User user) {
        return user.getRole() == UserRole.HEAD_OF_DEPARTMENT || user.getRole() == UserRole.FACULTY_LEADER;
    }

    private void requireManagerOrOwner(String username, Topic topic) {
        User user = userRepository.findByUsernameIgnoreCase(username)
                .orElseThrow(() -> new AppException("Không tìm thấy người dùng", HttpStatus.NOT_FOUND));
        if (!manager(user) && (user.getRole() != UserRole.LECTURER || !topic.getLecturer().getUser().getId().equals(user.getId())))
            throw new AppException("Bạn không có quyền sửa hoặc xóa đề tài này", HttpStatus.FORBIDDEN);
    }

    private Lecturer assignedLecturer(String username, Long lecturerId) {
        User user = userRepository.findByUsernameIgnoreCase(username)
                .orElseThrow(() -> new AppException("Không tìm thấy người dùng", HttpStatus.NOT_FOUND));
        if (manager(user) && lecturerId != null) {
            Lecturer lecturer = lecturerRepository.findById(lecturerId)
                    .orElseThrow(() -> new AppException("Không tìm thấy giảng viên", HttpStatus.NOT_FOUND));
            if (!lecturer.getUser().isActive() || (lecturer.getUser().getRole() != UserRole.LECTURER && lecturer.getUser().getRole() != UserRole.HEAD_OF_DEPARTMENT))
                throw new AppException("Giảng viên không hoạt động", HttpStatus.BAD_REQUEST);
            return lecturer;
        }
        if (!manager(user) && user.getRole() != UserRole.LECTURER)
            throw new AppException("Không có quyền quản lý đề tài", HttpStatus.FORBIDDEN);
        Lecturer lecturer = lecturerFor(username);
        if (lecturerId != null && !lecturerId.equals(lecturer.getId()))
            throw new AppException("Không được gán đề tài cho giảng viên khác", HttpStatus.FORBIDDEN);
        return lecturer;
    }

    private Lecturer lecturerFor(String username) {
        User user = userRepository.findByUsernameIgnoreCase(username).orElseThrow(() -> new AppException("Không tìm thấy người dùng", HttpStatus.NOT_FOUND));
        return lecturerRepository.findByUserId(user.getId()).orElseThrow(() -> new AppException("Tài khoản này không phải giảng viên", HttpStatus.BAD_REQUEST));
    }
    private GraduationTerm term(Long id) { return graduationTermRepository.findById(id).orElseThrow(() -> new AppException("Không tìm thấy đợt đồ án", HttpStatus.NOT_FOUND)); }
    private String trimToNull(String value) { return value == null || value.isBlank() ? null : value.trim(); }
}
