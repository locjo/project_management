package com.example.projectmanagement.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.projectmanagement.dto.request.CreateTopicRequest;
import com.example.projectmanagement.dto.response.ApiResponse;
import com.example.projectmanagement.dto.response.TopicResponse;
import com.example.projectmanagement.service.TopicService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/topics")
public class TopicController {

    private final TopicService topicService;

    public TopicController(TopicService topicService) {
        this.topicService = topicService;
    }

    @PostMapping
    public ResponseEntity<ApiResponse<TopicResponse>> createTopic(
            Authentication authentication,
            @Valid @RequestBody CreateTopicRequest request) {

        TopicResponse data = topicService.createTopic(authentication.getName(), request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Tạo đề tài gợi ý thành công", data));
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<TopicResponse>>> getAllTopics() {
        return ResponseEntity.ok(ApiResponse.success("Lấy danh sách đề tài thành công", topicService.getAllTopics()));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<TopicResponse>> updateTopic(
            Authentication authentication,
            @PathVariable Long id,
            @Valid @RequestBody CreateTopicRequest request) {

        TopicResponse data = topicService.updateTopic(authentication.getName(), id, request);
        return ResponseEntity.ok(ApiResponse.success("Cập nhật đề tài gợi ý thành công", data));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteTopic(
            Authentication authentication,
            @PathVariable Long id) {

        topicService.deleteTopic(authentication.getName(), id);
        return ResponseEntity.ok(ApiResponse.success("Xóa đề tài gợi ý thành công", null));
    }
}
