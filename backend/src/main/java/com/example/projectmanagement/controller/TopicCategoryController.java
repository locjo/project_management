package com.example.projectmanagement.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.example.projectmanagement.dto.request.CreateTopicCategoryRequest;
import com.example.projectmanagement.dto.response.ApiResponse;
import com.example.projectmanagement.dto.response.TopicCategoryResponse;
import com.example.projectmanagement.service.TopicCategoryService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/categories")
public class TopicCategoryController {
    private final TopicCategoryService service;
    public TopicCategoryController(TopicCategoryService service) { this.service = service; }

    @GetMapping
    public ResponseEntity<ApiResponse<List<TopicCategoryResponse>>> getAll(@RequestParam(defaultValue = "true") boolean activeOnly) {
        return ResponseEntity.ok(ApiResponse.success("Lấy danh mục lĩnh vực thành công", service.getAll(activeOnly)));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<TopicCategoryResponse>> create(@Valid @RequestBody CreateTopicCategoryRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.success("Tạo lĩnh vực thành công", service.create(request)));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<TopicCategoryResponse>> update(@PathVariable Long id, @Valid @RequestBody CreateTopicCategoryRequest request) {
        return ResponseEntity.ok(ApiResponse.success("Cập nhật lĩnh vực thành công", service.update(id, request)));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> delete(@PathVariable Long id) {
        service.delete(id);
        return ResponseEntity.ok(ApiResponse.success("Xóa lĩnh vực thành công", null));
    }
}
