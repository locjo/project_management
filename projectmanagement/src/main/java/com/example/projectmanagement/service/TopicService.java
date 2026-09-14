package com.example.projectmanagement.service;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.projectmanagement.dto.request.CreateTopicRequest;
import com.example.projectmanagement.dto.response.TopicResponse;
import com.example.projectmanagement.entity.Lecturer;
import com.example.projectmanagement.entity.Topic;
import com.example.projectmanagement.entity.User;
import com.example.projectmanagement.exception.AppException;
import com.example.projectmanagement.repository.LecturerRepository;
import com.example.projectmanagement.repository.TopicRepository;
import com.example.projectmanagement.repository.UserRepository;

@Service
public class TopicService {

    private final TopicRepository topicRepository;
    private final LecturerRepository lecturerRepository;
    private final UserRepository userRepository;

    public TopicService(TopicRepository topicRepository,
                        LecturerRepository lecturerRepository,
                        UserRepository userRepository) {
        this.topicRepository = topicRepository;
        this.lecturerRepository = lecturerRepository;
        this.userRepository = userRepository;
    }

    @Transactional
    public TopicResponse createTopic(String username, CreateTopicRequest request) {
        User user = userRepository.findByUsernameIgnoreCase(username)
                .orElseThrow(() -> new AppException("Không tìm thấy người dùng", HttpStatus.NOT_FOUND));

        Lecturer lecturer = lecturerRepository.findByUserId(user.getId())
                .orElseThrow(() -> new AppException("Tài khoản này không phải giảng viên", HttpStatus.BAD_REQUEST));

        String title = request.title() == null ? "" : request.title().trim();
        if (title.isEmpty()) {
            throw new AppException("Tên đề tài không được để trống", HttpStatus.BAD_REQUEST);
        }

        Topic topic = Topic.builder()
                .lecturer(lecturer)
                .title(title)
                .description(request.description() == null ? null : request.description().trim())
                .active(true)
                .createdAt(LocalDateTime.now())
                .build();

        return toResponse(topicRepository.save(topic));
    }

    @Transactional(readOnly = true)
    public List<TopicResponse> getAllTopics() {
        return topicRepository.findByActiveTrueOrderByCreatedAtDesc()
                .stream()
                .map(this::toResponse)
                .toList();
    }

    @Transactional
    public TopicResponse updateTopic(String username, Long id, CreateTopicRequest request) {
        User user = userRepository.findByUsernameIgnoreCase(username)
                .orElseThrow(() -> new AppException("Không tìm thấy người dùng", HttpStatus.NOT_FOUND));

        Lecturer lecturer = lecturerRepository.findByUserId(user.getId())
                .orElseThrow(() -> new AppException("Tài khoản này không phải giảng viên", HttpStatus.BAD_REQUEST));

        Topic topic = topicRepository.findById(id)
                .orElseThrow(() -> new AppException("Không tìm thấy đề tài gợi ý", HttpStatus.NOT_FOUND));

        if (!topic.getLecturer().getId().equals(lecturer.getId())) {
            throw new AppException("Bạn không có quyền cập nhật đề tài này", HttpStatus.FORBIDDEN);
        }

        String title = request.title() == null ? "" : request.title().trim();
        if (title.isEmpty()) {
            throw new AppException("Tên đề tài không được để trống", HttpStatus.BAD_REQUEST);
        }

        topic.setTitle(title);
        topic.setDescription(request.description() == null ? null : request.description().trim());

        return toResponse(topicRepository.save(topic));
    }

    @Transactional
    public void deleteTopic(String username, Long id) {
        User user = userRepository.findByUsernameIgnoreCase(username)
                .orElseThrow(() -> new AppException("Không tìm thấy người dùng", HttpStatus.NOT_FOUND));

        Lecturer lecturer = lecturerRepository.findByUserId(user.getId())
                .orElseThrow(() -> new AppException("Tài khoản này không phải giảng viên", HttpStatus.BAD_REQUEST));

        Topic topic = topicRepository.findById(id)
                .orElseThrow(() -> new AppException("Không tìm thấy đề tài gợi ý", HttpStatus.NOT_FOUND));

        if (!topic.getLecturer().getId().equals(lecturer.getId())) {
            throw new AppException("Bạn không có quyền xóa đề tài này", HttpStatus.FORBIDDEN);
        }

        topic.setActive(false);
        topicRepository.save(topic);
    }

    private TopicResponse toResponse(Topic topic) {
        return new TopicResponse(
                topic.getId(),
                topic.getLecturer().getId(),
                topic.getLecturer().getUser().getUsername(),
                topic.getTitle(),
                topic.getDescription(),
                topic.isActive(),
                topic.getCreatedAt()
        );
    }
}
