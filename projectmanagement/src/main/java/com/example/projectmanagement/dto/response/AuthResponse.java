package com.example.projectmanagement.dto.response;

public record AuthResponse(String accessToken, String tokenType, UserInfoResponse user) {
}

