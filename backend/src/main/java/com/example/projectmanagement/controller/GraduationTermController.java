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
import org.springframework.web.bind.annotation.RestController;

import com.example.projectmanagement.dto.request.CreateGraduationTermRequest;
import com.example.projectmanagement.dto.response.ApiResponse;
import com.example.projectmanagement.dto.response.GraduationTermResponse;
import com.example.projectmanagement.service.GraduationTermService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/graduation-terms")
public class GraduationTermController {

    private final GraduationTermService graduationTermService;

    public GraduationTermController(GraduationTermService graduationTermService) {
        this.graduationTermService = graduationTermService;
    }

    @PostMapping
    public ResponseEntity<ApiResponse<GraduationTermResponse>> create(@Valid @RequestBody CreateGraduationTermRequest request) {
        GraduationTermResponse data = graduationTermService.create(request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Tạo đợt đồ án thành công", data));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<GraduationTermResponse>> update(
            @PathVariable Long id,
            @Valid @RequestBody CreateGraduationTermRequest request) {
        GraduationTermResponse data = graduationTermService.update(id, request);
        return ResponseEntity.ok(ApiResponse.success("Cập nhật đợt đồ án thành công", data));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> delete(@PathVariable Long id) {
        graduationTermService.delete(id);
        return ResponseEntity.ok(ApiResponse.success("Xóa đợt đồ án thành công", null));
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<GraduationTermResponse>>> getAll() {
        return ResponseEntity.ok(ApiResponse.success("Lấy danh sách đợt đồ án thành công", graduationTermService.getAll()));
    }

    @GetMapping("/active")
    public ResponseEntity<ApiResponse<List<GraduationTermResponse>>> getActive() {
        return ResponseEntity.ok(ApiResponse.success("Lấy danh sách đợt đồ án đang hoạt động thành công", graduationTermService.getActive()));
    }
}
