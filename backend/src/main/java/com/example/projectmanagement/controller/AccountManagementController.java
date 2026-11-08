package com.example.projectmanagement.controller;

import java.util.List;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;
import com.example.projectmanagement.dto.request.CreateLecturerRequest;
import com.example.projectmanagement.dto.request.CreateStudentRequest;
import com.example.projectmanagement.dto.response.ApiResponse;
import com.example.projectmanagement.dto.response.LecturerAccountResponse;
import com.example.projectmanagement.service.AccountManagementService;

@RestController
@RequestMapping("/api")
public class AccountManagementController {
    private final AccountManagementService service;
    public AccountManagementController(AccountManagementService service) { this.service = service; }

    @GetMapping("/lecturers/accounts")
    public ApiResponse<List<LecturerAccountResponse>> lecturers() {
        return ApiResponse.success("Danh sách giảng viên", service.lecturers());
    }

    @PutMapping("/lecturers/{id}")
    public ApiResponse<Void> updateLecturer(@PathVariable Long id, @Valid @RequestBody CreateLecturerRequest request) {
        service.updateLecturer(id, request); return ApiResponse.success("Đã cập nhật giảng viên", null);
    }

    @DeleteMapping("/lecturers/{id}")
    public ApiResponse<Void> deleteLecturer(@PathVariable Long id) {
        service.deleteLecturer(id); return ApiResponse.success("Đã xóa giảng viên", null);
    }

    @PutMapping("/students/{id}")
    public ApiResponse<Void> updateStudent(@PathVariable Long id, @Valid @RequestBody CreateStudentRequest request) {
        service.updateStudent(id, request); return ApiResponse.success("Đã cập nhật sinh viên", null);
    }

    @DeleteMapping("/students/{id}")
    public ApiResponse<Void> deleteStudent(@PathVariable Long id) {
        service.deleteStudent(id); return ApiResponse.success("Đã xóa sinh viên", null);
    }
}
