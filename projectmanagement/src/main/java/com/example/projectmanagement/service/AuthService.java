package com.example.projectmanagement.service;

import java.time.LocalDateTime;

import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

import com.example.projectmanagement.entity.RefreshToken;
import com.example.projectmanagement.entity.User;
import com.example.projectmanagement.repository.RefreshTokenRepository;
import com.example.projectmanagement.repository.UserRepository;
import com.example.projectmanagement.security.JwtTokenProvider;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final RefreshTokenRepository refreshTokenRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenProvider jwtTokenProvider;
    private final OtpService otpService;

    public AuthService(UserRepository userRepository,
                       RefreshTokenRepository refreshTokenRepository,
                       PasswordEncoder passwordEncoder,
                       JwtTokenProvider jwtTokenProvider,
                       OtpService otpService) {
        this.userRepository = userRepository;
        this.refreshTokenRepository = refreshTokenRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtTokenProvider = jwtTokenProvider;
        this.otpService = otpService;
    }

    @Transactional
    public LoginResult login(String username, String password) {
        if (!StringUtils.hasText(username) || !StringUtils.hasText(password)) {
            throw new AuthServiceException("Username và password không được để trống", HttpStatus.BAD_REQUEST);
        }

        User user = userRepository.findByUsernameIgnoreCase(username)
                .orElseThrow(() -> new AuthServiceException("Tài khoản không tồn tại", HttpStatus.NOT_FOUND));

        if (!passwordEncoder.matches(password, user.getPasswordHash())) {
            throw new AuthServiceException("Mật khẩu không đúng", HttpStatus.UNAUTHORIZED);
        }

        String accessToken = jwtTokenProvider.generateToken(user.getUsername(), user.getId());
        String refreshToken = jwtTokenProvider.generateToken(user.getUsername(), user.getId());

        refreshTokenRepository.save(RefreshToken.builder()
                .user(user)
                .token(refreshToken)
                .expiryDate(LocalDateTime.now().plusDays(7))
                .createdAt(LocalDateTime.now())
                .build());

        return new LoginResult(
                accessToken,
                refreshToken,
                new UserInfo(user.getId(), user.getUsername(), user.getRole() != null ? user.getRole().name() : "STUDENT")
        );
    }

    @Transactional(readOnly = true)
    public RefreshResult refreshToken(String refreshToken) {
        if (!StringUtils.hasText(refreshToken)) {
            throw new AuthServiceException("Refresh token không hợp lệ", HttpStatus.UNAUTHORIZED);
        }

        if (!jwtTokenProvider.validateToken(refreshToken)) {
            throw new AuthServiceException("Refresh token không hợp lệ hoặc đã hết hạn", HttpStatus.UNAUTHORIZED);
        }

        RefreshToken tokenEntity = refreshTokenRepository.findByToken(refreshToken)
                .orElseThrow(() -> new AuthServiceException("Refresh token không hợp lệ hoặc đã hết hạn", HttpStatus.UNAUTHORIZED));

        if (tokenEntity.getExpiryDate().isBefore(LocalDateTime.now())) {
            refreshTokenRepository.delete(tokenEntity);
            throw new AuthServiceException("Refresh token đã hết hạn", HttpStatus.UNAUTHORIZED);
        }

        User user = tokenEntity.getUser();
        String accessToken = jwtTokenProvider.generateToken(user.getUsername(), user.getId());

        return new RefreshResult(accessToken, "Bearer");
    }

    @Transactional
    public LoginResult loginWithOtp(String email, String otp) {
        if (!StringUtils.hasText(email) || !StringUtils.hasText(otp)) {
            throw new AuthServiceException("Email và OTP không được để trống", HttpStatus.BAD_REQUEST);
        }

        User user = userRepository.findByEmailIgnoreCase(email)
                .orElseThrow(() -> new AuthServiceException("Tài khoản không tồn tại", HttpStatus.NOT_FOUND));

        if (!otpService.verifyOtp(email, otp)) {
            throw new AuthServiceException("OTP không hợp lệ hoặc đã hết hạn", HttpStatus.UNAUTHORIZED);
        }

        String accessToken = jwtTokenProvider.generateToken(user.getUsername(), user.getId());
        String refreshToken = jwtTokenProvider.generateToken(user.getUsername(), user.getId());

        refreshTokenRepository.save(RefreshToken.builder()
                .user(user)
                .token(refreshToken)
                .expiryDate(LocalDateTime.now().plusDays(7))
                .createdAt(LocalDateTime.now())
                .build());

        return new LoginResult(
                accessToken,
                refreshToken,
                new UserInfo(user.getId(), user.getUsername(), user.getRole() != null ? user.getRole().name() : "STUDENT")
        );
    }

    @Transactional
    public void logout(String refreshToken) {
        if (StringUtils.hasText(refreshToken)) {
            refreshTokenRepository.deleteByToken(refreshToken);
        }
    }

    public record LoginResult(String accessToken, String refreshToken, UserInfo user) {
    }

    public record RefreshResult(String accessToken, String tokenType) {
    }

    public record UserInfo(Long id, String username, String role) {
    }
}
