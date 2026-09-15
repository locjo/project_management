package com.example.projectmanagement.service;

import java.security.SecureRandom;
import java.time.LocalDateTime;
import java.util.concurrent.TimeUnit;

import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.projectmanagement.entity.OtpToken;
import com.example.projectmanagement.repository.OtpTokenRepository;

@Service
public class OtpService {

    private static final int OTP_LENGTH = 6;
    private static final int OTP_TTL_SECONDS = 180;

    private final OtpTokenRepository otpTokenRepository;
    private final JavaMailSender mailSender;
    private final StringRedisTemplate stringRedisTemplate;
    private final PasswordEncoder passwordEncoder;

    public OtpService(OtpTokenRepository otpTokenRepository,
                      JavaMailSender mailSender,
                      StringRedisTemplate stringRedisTemplate,
                      PasswordEncoder passwordEncoder) {
        this.otpTokenRepository = otpTokenRepository;
        this.mailSender = mailSender;
        this.stringRedisTemplate = stringRedisTemplate;
        this.passwordEncoder = passwordEncoder;
    }

    public void sendOtp(String email) {
        String otp = generateOtp();
        String otpHash = passwordEncoder.encode(otp);
        LocalDateTime expiryAt = LocalDateTime.now().plusMinutes(3);

        otpTokenRepository.save(OtpToken.builder()
                .email(email)
                .otpHash(otpHash)
                .expiryAt(expiryAt)
                .createdAt(LocalDateTime.now())
                .build());

        stringRedisTemplate.opsForValue().set("otp:" + email, otpHash, OTP_TTL_SECONDS, TimeUnit.SECONDS);

        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(email);
        message.setSubject("Mã OTP đăng nhập");
        message.setText("Mã OTP của bạn là: " + otp + "\nMã này sẽ hết hạn sau 3 phút.");
        mailSender.send(message);
    }

    @Transactional
    public boolean verifyOtp(String email, String otp) {
        String storedOtpHash = stringRedisTemplate.opsForValue().get("otp:" + email);

        if (storedOtpHash == null) {
            return false;
        }

        boolean matched = passwordEncoder.matches(otp, storedOtpHash);
        if (matched) {
            otpTokenRepository.deleteById(email);
            stringRedisTemplate.delete("otp:" + email);
        }

        return matched;
    }

    private String generateOtp() {
        SecureRandom secureRandom = new SecureRandom();
        StringBuilder sb = new StringBuilder();
        for (int i = 0; i < OTP_LENGTH; i++) {
            sb.append(secureRandom.nextInt(10));
        }
        return sb.toString();
    }
}
