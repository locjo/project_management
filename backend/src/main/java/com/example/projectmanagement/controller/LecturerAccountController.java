package com.example.projectmanagement.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import jakarta.validation.Valid;
import com.example.projectmanagement.dto.request.CreateLecturerRequest;
import com.example.projectmanagement.dto.response.ApiResponse;
import com.example.projectmanagement.dto.response.LecturerAccountResponse;
import com.example.projectmanagement.service.LecturerAccountService;

@RestController
public class LecturerAccountController {
    private final LecturerAccountService accounts;
    public LecturerAccountController(LecturerAccountService accounts) { this.accounts = accounts; }

    @PostMapping("/api/lecturers")
    public ResponseEntity<ApiResponse<LecturerAccountResponse>> create(@Valid @RequestBody CreateLecturerRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Đã thêm giảng viên", accounts.create(request)));
    }
}
