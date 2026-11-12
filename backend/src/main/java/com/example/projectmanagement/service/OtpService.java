package com.example.projectmanagement.service;

import java.security.SecureRandom;
import java.util.concurrent.TimeUnit;

import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class OtpService {
    private static final int OTP_LENGTH = 6;
    private static final int OTP_TTL_SECONDS = 180;

    private final ResendEmailSender emailSender;
    private final StringRedisTemplate stringRedisTemplate;
    private final PasswordEncoder passwordEncoder;

    public OtpService(ResendEmailSender emailSender,
                      StringRedisTemplate stringRedisTemplate,
                      PasswordEncoder passwordEncoder) {
        this.emailSender = emailSender;
        this.stringRedisTemplate = stringRedisTemplate;
        this.passwordEncoder = passwordEncoder;
    }

    public void sendOtp(String email) {
        String otp = generateOtp();
        String otpHash = passwordEncoder.encode(otp);

        emailSender.sendOtp(email, otp);
        stringRedisTemplate.opsForValue().set("otp:" + email, otpHash, OTP_TTL_SECONDS, TimeUnit.SECONDS);
    }

    public boolean verifyOtp(String email, String otp) {
        String storedOtpHash = stringRedisTemplate.opsForValue().get("otp:" + email);

        if (storedOtpHash == null) {
            return false;
        }

        boolean matched = passwordEncoder.matches(otp, storedOtpHash);
        if (matched) {
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
