package com.example.projectmanagement.controller;

import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.projectmanagement.dto.request.LoginRequest;
import com.example.projectmanagement.dto.request.SendOtpRequest;
import com.example.projectmanagement.dto.request.VerifyOtpRequest;
import com.example.projectmanagement.dto.response.ApiResponse;
import com.example.projectmanagement.dto.response.AuthResponse;
import com.example.projectmanagement.dto.response.MessageResponse;
import com.example.projectmanagement.dto.response.OtpResponse;
import com.example.projectmanagement.dto.response.RefreshTokenResponse;
import com.example.projectmanagement.dto.response.UserInfoResponse;
import com.example.projectmanagement.security.JwtTokenProvider;
import com.example.projectmanagement.service.AuthService;
import com.example.projectmanagement.service.OtpService;

import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthService authService;
    private final OtpService otpService;
    private final JwtTokenProvider jwtTokenProvider;

    public AuthController(AuthService authService, OtpService otpService, JwtTokenProvider jwtTokenProvider) {
        this.authService = authService;
        this.otpService = otpService;
        this.jwtTokenProvider = jwtTokenProvider;
    }

    @PostMapping("/login")
    public ResponseEntity<ApiResponse<AuthResponse>> login(@Valid @RequestBody LoginRequest request) {
        AuthService.LoginResult result = authService.login(request.username(), request.password());

        AuthResponse data = new AuthResponse(
                result.accessToken(),
                "Bearer",
                new UserInfoResponse(result.user().id(), result.user().username(), result.user().role())
        );

        return ResponseEntity.ok()
                .header(HttpHeaders.SET_COOKIE, jwtTokenProvider.createRefreshTokenCookie(result.refreshToken()).toString())
                .body(ApiResponse.success("Đăng nhập thành công", data));
    }

    @PostMapping("/send-otp")
    public ResponseEntity<ApiResponse<OtpResponse>> sendOtp(@Valid @RequestBody SendOtpRequest request) {
        otpService.sendOtp(request.email());
        return ResponseEntity.ok(ApiResponse.success("Mã OTP đã được gửi qua email", 
                new OtpResponse("Mã OTP đã được gửi qua email")));
    }

    @PostMapping("/login-otp")
    public ResponseEntity<ApiResponse<AuthResponse>> loginWithOtp(@Valid @RequestBody VerifyOtpRequest request) {
        AuthService.LoginResult result = authService.loginWithOtp(request.email(), request.otp());

        AuthResponse data = new AuthResponse(
                result.accessToken(),
                "Bearer",
                new UserInfoResponse(result.user().id(), result.user().username(), result.user().role())
        );

        return ResponseEntity.ok()
                .header(HttpHeaders.SET_COOKIE, jwtTokenProvider.createRefreshTokenCookie(result.refreshToken()).toString())
                .body(ApiResponse.success("Đăng nhập bằng OTP thành công", data));
    }

    @PostMapping("/refresh-token")
    public ResponseEntity<ApiResponse<RefreshTokenResponse>> refreshToken(HttpServletRequest request, HttpServletResponse response) {
        String refreshToken = extractRefreshTokenFromCookie(request);

        try {
            AuthService.RefreshResult result = authService.refreshToken(refreshToken);
            RefreshTokenResponse data = new RefreshTokenResponse(result.accessToken(), result.tokenType());
            return ResponseEntity.ok(ApiResponse.success("Làm mới token thành công", data));
        } catch (Exception ex) {
            response.addHeader(HttpHeaders.SET_COOKIE, jwtTokenProvider.cleanRefreshTokenCookie().toString());
            throw ex;
        }
    }

    @PostMapping("/logout")
    public ResponseEntity<ApiResponse<MessageResponse>> logout(HttpServletRequest request, HttpServletResponse response) {
        String refreshToken = extractRefreshTokenFromCookie(request);
        authService.logout(refreshToken);
        response.addHeader(HttpHeaders.SET_COOKIE, jwtTokenProvider.cleanRefreshTokenCookie().toString());

        return ResponseEntity.ok(ApiResponse.success("Đăng xuất thành công", new MessageResponse("Đăng xuất thành công")));
    }

    private String extractRefreshTokenFromCookie(HttpServletRequest request) {
        Cookie[] cookies = request.getCookies();
        if (cookies == null) {
            return null;
        }

        for (Cookie cookie : cookies) {
            if ("refresh_token".equals(cookie.getName())) {
                return cookie.getValue();
            }
        }

        return null;
    }

}
