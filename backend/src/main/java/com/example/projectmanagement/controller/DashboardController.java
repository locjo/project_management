package com.example.projectmanagement.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.example.projectmanagement.dto.response.ApiResponse;
import com.example.projectmanagement.dto.response.LecturerQuotaResponse;
import com.example.projectmanagement.service.DashboardService;

@RestController
@RequestMapping("/api/dashboard")
public class DashboardController {
    private final DashboardService service;
    public DashboardController(DashboardService service) { this.service = service; }
    @GetMapping("/lecturers")
    public ResponseEntity<ApiResponse<List<LecturerQuotaResponse>>> lecturerQuotas(@RequestParam Long graduationTermId) {
        return ResponseEntity.ok(ApiResponse.success("Lấy thống kê giảng viên thành công", service.lecturerQuotas(graduationTermId)));
    }
}
