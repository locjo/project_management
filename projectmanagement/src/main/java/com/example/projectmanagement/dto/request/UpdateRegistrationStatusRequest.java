package com.example.projectmanagement.dto.request;

import com.example.projectmanagement.entity.RegistrationStatus;

import jakarta.validation.constraints.NotNull;

public record UpdateRegistrationStatusRequest(
        @NotNull(message = "Trạng thái không được để trống") RegistrationStatus status
) {
}
