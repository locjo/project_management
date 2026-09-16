package com.example.projectmanagement.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.example.projectmanagement.dto.response.ApiResponse;
import com.example.projectmanagement.dto.response.LecturerOptionResponse;
import com.example.projectmanagement.service.LecturerService;

@RestController
@RequestMapping("/api/lecturers")
public class LecturerController {
    private final LecturerService service;

    public LecturerController(LecturerService service) { this.service = service; }

    @GetMapping
    public ResponseEntity<ApiResponse<List<LecturerOptionResponse>>> getOptions(
            @RequestParam(name = "graduationTermId") Long graduationTermId) {
        return ResponseEntity.ok(ApiResponse.success("Lấy danh sách giảng viên thành công",
                service.getOptions(graduationTermId)));
    }
}
