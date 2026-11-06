package com.example.projectmanagement.dto.request;

import com.example.projectmanagement.entity.UserRole;
import jakarta.validation.constraints.NotNull;

public record QuickLoginRequest(@NotNull(message = "Vui lòng chọn vai trò") UserRole role) {}
