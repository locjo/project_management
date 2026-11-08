package com.example.projectmanagement.service;

import java.security.SecureRandom;
import java.util.concurrent.TimeUnit;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.http.HttpStatus;
import org.springframework.mail.MailAuthenticationException;
import org.springframework.mail.MailException;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import com.example.projectmanagement.exception.AppException;

@Service
public class OtpService {
    private static final Logger log = LoggerFactory.getLogger(OtpService.class);

    private static final int OTP_LENGTH = 6;
    private static final int OTP_TTL_SECONDS = 180;

    private final JavaMailSender mailSender;
    private final StringRedisTemplate stringRedisTemplate;
    private final PasswordEncoder passwordEncoder;
    private final String mailUsername;
    private final String mailPassword;

    public OtpService(JavaMailSender mailSender,
                      StringRedisTemplate stringRedisTemplate,
                      PasswordEncoder passwordEncoder,
                      @Value("${spring.mail.username:}") String mailUsername,
                      @Value("${spring.mail.password:}") String mailPassword) {
        this.mailSender = mailSender;
        this.stringRedisTemplate = stringRedisTemplate;
        this.passwordEncoder = passwordEncoder;
        this.mailUsername = mailUsername;
        this.mailPassword = mailPassword;
    }

    public void sendOtp(String email) {
        if (!StringUtils.hasText(mailUsername) || !StringUtils.hasText(mailPassword)) {
            log.error("OTP email is not configured: set MAIL_USERNAME and MAIL_PASSWORD in the environment or application-local.properties");
            throw new AppException("Dịch vụ gửi OTP chưa được cấu hình. Vui lòng liên hệ quản trị viên.",
                    HttpStatus.SERVICE_UNAVAILABLE);
        }
        String otp = generateOtp();
        String otpHash = passwordEncoder.encode(otp);

        SimpleMailMessage message = new SimpleMailMessage();
        message.setFrom(mailUsername);
        message.setTo(email);
        message.setSubject("Mã OTP đăng nhập");
        message.setText("Mã OTP của bạn là: " + otp + "\nMã này sẽ hết hạn sau 3 phút." + "\nVui lòng không chia sẻ mã này với bất kỳ ai.");
        try {
            mailSender.send(message);
        } catch (MailAuthenticationException ex) {
            log.error("OTP SMTP authentication failed: check MAIL_USERNAME and MAIL_PASSWORD (Gmail App Password)");
            throw new AppException("Dịch vụ gửi OTP không thể xác thực. Vui lòng liên hệ quản trị viên.",
                    HttpStatus.SERVICE_UNAVAILABLE);
        } catch (MailException ex) {
            log.warn("OTP email delivery failed ({})", ex.getClass().getSimpleName());
            throw new AppException("Hiện không thể gửi email OTP. Vui lòng thử lại sau.",
                    HttpStatus.SERVICE_UNAVAILABLE);
        }
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
