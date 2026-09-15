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
import com.example.projectmanagement.exception.AppException;
import com.example.projectmanagement.repository.GraduationTermRepository;
import com.example.projectmanagement.repository.LecturerRepository;
import com.example.projectmanagement.repository.TopicRepository;
import com.example.projectmanagement.repository.UserRepository;

@Service
public class TopicService {
    private final TopicRepository topicRepository;
    private final LecturerRepository lecturerRepository;
    private final UserRepository userRepository;
    private final GraduationTermRepository graduationTermRepository;
    private final TopicCategoryService categoryService;

    public TopicService(TopicRepository topicRepository, LecturerRepository lecturerRepository, UserRepository userRepository,
                        GraduationTermRepository graduationTermRepository, TopicCategoryService categoryService) {
        this.topicRepository = topicRepository;
        this.lecturerRepository = lecturerRepository;
        this.userRepository = userRepository;
        this.graduationTermRepository = graduationTermRepository;
        this.categoryService = categoryService;
    }

    @Transactional
    public TopicResponse create(String username, CreateTopicRequest request) {
        Lecturer lecturer = lecturerFor(username);
        GraduationTerm term = term(request.graduationTermId());
        TopicCategory category = categoryService.getEntity(request.categoryId());
        if (!term.isActive() || !category.isActive()) throw new AppException("Đợt hoặc lĩnh vực không hoạt động", HttpStatus.BAD_REQUEST);
        return toResponse(topicRepository.save(Topic.builder().lecturer(lecturer).graduationTerm(term).category(category)
                .title(request.title().trim()).description(trimToNull(request.description())).active(true).createdAt(LocalDateTime.now()).build()));
    }

    @Transactional(readOnly = true)
    public List<TopicResponse> getAll(Long termId, Long categoryId) {
        List<Topic> topics = categoryId == null
                ? topicRepository.findByGraduationTermIdAndActiveTrueOrderByCreatedAtDesc(termId)
                : topicRepository.findByGraduationTermIdAndCategoryIdAndActiveTrueOrderByCreatedAtDesc(termId, categoryId);
        return topics.stream().map(this::toResponse).toList();
    }

    @Transactional
    public TopicResponse update(String username, Long id, CreateTopicRequest request) {
        Lecturer lecturer = lecturerFor(username);
        Topic topic = topicRepository.findById(id).orElseThrow(() -> new AppException("Không tìm thấy đề tài", HttpStatus.NOT_FOUND));
        if (!topic.getLecturer().getId().equals(lecturer.getId())) throw new AppException("Bạn không có quyền cập nhật đề tài này", HttpStatus.FORBIDDEN);
        topic.setGraduationTerm(term(request.graduationTermId()));
        topic.setCategory(categoryService.getEntity(request.categoryId()));
        topic.setTitle(request.title().trim());
        topic.setDescription(trimToNull(request.description()));
        return toResponse(topicRepository.save(topic));
    }

    @Transactional
    public void delete(String username, Long id) {
        Lecturer lecturer = lecturerFor(username);
        Topic topic = topicRepository.findById(id).orElseThrow(() -> new AppException("Không tìm thấy đề tài", HttpStatus.NOT_FOUND));
        if (!topic.getLecturer().getId().equals(lecturer.getId())) throw new AppException("Bạn không có quyền xóa đề tài này", HttpStatus.FORBIDDEN);
        topic.setActive(false);
        topicRepository.save(topic);
    }

    private Lecturer lecturerFor(String username) {
        User user = userRepository.findByUsernameIgnoreCase(username).orElseThrow(() -> new AppException("Không tìm thấy người dùng", HttpStatus.NOT_FOUND));
        return lecturerRepository.findByUserId(user.getId()).orElseThrow(() -> new AppException("Tài khoản này không phải giảng viên", HttpStatus.BAD_REQUEST));
    }
    private GraduationTerm term(Long id) { return graduationTermRepository.findById(id).orElseThrow(() -> new AppException("Không tìm thấy đợt đồ án", HttpStatus.NOT_FOUND)); }
    private String trimToNull(String value) { return value == null || value.isBlank() ? null : value.trim(); }
    private TopicResponse toResponse(Topic topic) {
        return new TopicResponse(topic.getId(), topic.getLecturer().getId(), topic.getLecturer().getUser().getUsername(),
                topic.getGraduationTerm().getId(), topic.getCategory().getId(), topic.getCategory().getName(), topic.getTitle(),
                topic.getDescription(), topic.isActive(), topic.getCreatedAt());
    }
}
