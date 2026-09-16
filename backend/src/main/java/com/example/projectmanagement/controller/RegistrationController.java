package com.example.projectmanagement.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.example.projectmanagement.dto.request.CreateRegistrationRequest;
import com.example.projectmanagement.dto.request.UpdateRegistrationStatusRequest;
import com.example.projectmanagement.dto.response.ApiResponse;
import com.example.projectmanagement.dto.response.RegistrationResponse;
import com.example.projectmanagement.service.RegistrationService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/registrations")
public class RegistrationController {

    private final RegistrationService registrationService;

    public RegistrationController(RegistrationService registrationService) {
        this.registrationService = registrationService;
    }

    @PostMapping
    public ResponseEntity<ApiResponse<RegistrationResponse>> register(
            Authentication authentication,
            @Valid @RequestBody CreateRegistrationRequest request) {

        RegistrationResponse data = registrationService.register(authentication.getName(), request);

        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Đăng ký đề tài thành công", data));
    }

    @GetMapping("/topic")
    public ResponseEntity<ApiResponse<List<RegistrationResponse>>> getMyRegistrations(Authentication authentication) {
        return ResponseEntity.ok(
                ApiResponse.success("Lấy danh sách đăng ký đề tài thành công",
                        registrationService.getMyRegistrations(authentication.getName()))
        );
    }

    @GetMapping("/lecturer/pending")
    public ResponseEntity<ApiResponse<List<RegistrationResponse>>> getPendingRegistrationsForLecturer(Authentication authentication) {
        return ResponseEntity.ok(ApiResponse.success(
                "Lấy danh sách đăng ký chờ duyệt thành công",
                registrationService.getPendingRegistrationsForLecturer(authentication.getName())
        ));
    }

    @GetMapping("/lecturer")
    public ResponseEntity<ApiResponse<List<RegistrationResponse>>> getLecturerRegistrations(
            Authentication authentication,
            @RequestParam(name = "graduationTermId") Long graduationTermId) {
        return ResponseEntity.ok(ApiResponse.success("Lấy danh sách sinh viên hướng dẫn thành công",
                registrationService.getLecturerRegistrations(authentication.getName(), graduationTermId)));
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<ApiResponse<RegistrationResponse>> updateRegistrationStatus(
            Authentication authentication,
            @PathVariable Long id,
            @Valid @RequestBody UpdateRegistrationStatusRequest request) {

        RegistrationResponse data = registrationService.updateRegistrationStatus(authentication.getName(), id, request);

        return ResponseEntity.ok(ApiResponse.success("Cập nhật trạng thái đăng ký thành công", data));
    }
}
