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
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.example.projectmanagement.dto.request.CreateTopicRequest;
import com.example.projectmanagement.dto.request.ReviewTopicRequest;
import com.example.projectmanagement.dto.response.ApiResponse;
import com.example.projectmanagement.dto.response.TopicResponse;
import com.example.projectmanagement.service.TopicService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/topics")
public class TopicController {
    private final TopicService service;
    public TopicController(TopicService service) { this.service = service; }

    @PostMapping
    public ResponseEntity<ApiResponse<TopicResponse>> create(Authentication auth, @Valid @RequestBody CreateTopicRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.success("Tạo đề tài thành công", service.create(auth.getName(), request)));
    }
    @GetMapping
    public ResponseEntity<ApiResponse<List<TopicResponse>>> getAll(@RequestParam Long graduationTermId, @RequestParam(required = false) Long categoryId) {
        return ResponseEntity.ok(ApiResponse.success("Lấy danh sách đề tài thành công", service.getAll(graduationTermId, categoryId)));
    }
    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<TopicResponse>> update(Authentication auth, @PathVariable Long id, @Valid @RequestBody CreateTopicRequest request) {
        return ResponseEntity.ok(ApiResponse.success("Cập nhật đề tài thành công", service.update(auth.getName(), id, request)));
    }

    @GetMapping("/mine")
    public ResponseEntity<ApiResponse<List<TopicResponse>>> getMine(Authentication auth,
            @RequestParam(name = "graduationTermId") Long graduationTermId) {
        return ResponseEntity.ok(ApiResponse.success("Lấy đề tài của tôi thành công", service.getMine(auth.getName(), graduationTermId)));
    }

    @GetMapping("/pending")
    public ResponseEntity<ApiResponse<List<TopicResponse>>> getPending(Authentication auth,
            @RequestParam(name = "graduationTermId") Long graduationTermId) {
        return ResponseEntity.ok(ApiResponse.success("Lấy đề tài chờ duyệt thành công", service.getPendingForDepartment(auth.getName(), graduationTermId)));
    }

    @GetMapping("/department")
    public ResponseEntity<ApiResponse<List<TopicResponse>>> getDepartment(Authentication auth,
            @RequestParam(name = "graduationTermId") Long graduationTermId) {
        return ResponseEntity.ok(ApiResponse.success("Lấy đề tài khoa CNTT thành công", service.getForDepartment(auth.getName(), graduationTermId)));
    }

    @PutMapping("/{id}/review")
    public ResponseEntity<ApiResponse<TopicResponse>> review(Authentication auth, @PathVariable(name = "id") Long id,
            @Valid @RequestBody ReviewTopicRequest request) {
        return ResponseEntity.ok(ApiResponse.success("Đã xử lý đề tài", service.review(auth.getName(), id, request.status())));
    }
    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> delete(Authentication auth, @PathVariable Long id) {
        service.delete(auth.getName(), id);
        return ResponseEntity.ok(ApiResponse.success("Xóa đề tài thành công", null));
    }
}
