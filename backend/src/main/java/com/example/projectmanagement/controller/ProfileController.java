package com.example.projectmanagement.controller;

import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import jakarta.validation.Valid;
import com.example.projectmanagement.dto.request.UpdateProfileRequest;
import com.example.projectmanagement.dto.response.ApiResponse;
import com.example.projectmanagement.dto.response.ProfileResponse;
import com.example.projectmanagement.service.ProfileService;

@RestController
public class ProfileController {
    private final ProfileService profiles;

    public ProfileController(ProfileService profiles) { this.profiles = profiles; }

    @PutMapping("/api/users/me")
    public ApiResponse<ProfileResponse> update(Authentication authentication, @Valid @RequestBody UpdateProfileRequest request) {
        return ApiResponse.success("Đã cập nhật thông tin cá nhân", profiles.updateProfile(authentication.getName(), request));
    }

    @GetMapping("/api/users/me")
    public ApiResponse<ProfileResponse> me(Authentication authentication) {
        return ApiResponse.success("Thông tin cá nhân", profiles.getProfile(authentication.getName()));
    }
}
