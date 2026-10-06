package com.example.projectmanagement.service;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

import java.util.concurrent.TimeUnit;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.ArgumentCaptor;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.data.redis.core.ValueOperations;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.security.crypto.password.PasswordEncoder;

class OtpServiceTest {
    private final String email = "student@example.test";
    private StringRedisTemplate redis;
    private ValueOperations<String, String> values;
    private JavaMailSender mail;
    private PasswordEncoder encoder;
    private OtpService service;

    @BeforeEach
    @SuppressWarnings("unchecked")
    void setUp() {
        redis = mock(StringRedisTemplate.class);
        values = mock(ValueOperations.class);
        when(redis.opsForValue()).thenReturn(values);
        mail = mock(JavaMailSender.class);
        encoder = mock(PasswordEncoder.class);
        service = new OtpService(mail, redis, encoder);
    }

    @Test
    void sendingStoresHashWithThreeMinuteTtlAndEmailsMatchingCode() {
        when(encoder.encode(anyString())).thenReturn("hashed-otp");
        service.sendOtp(email);
        var code = ArgumentCaptor.forClass(CharSequence.class);
        verify(encoder).encode(code.capture());
        assertTrue(code.getValue().toString().matches("[0-9]{6}"));
        verify(values).set("otp:" + email, "hashed-otp", 180, TimeUnit.SECONDS);
        var message = ArgumentCaptor.forClass(SimpleMailMessage.class);
        verify(mail).send(message.capture());
        assertArrayEquals(new String[] { email }, message.getValue().getTo());
        assertTrue(message.getValue().getText().contains(code.getValue()));
    }

    @Test
    void expiredOrMissingOtpCannotAuthenticate() {
        assertFalse(service.verifyOtp(email, "123456"));
        verifyNoInteractions(encoder);
        verify(redis, never()).delete(anyString());
    }

    @Test
    void incorrectOtpIsRetainedAndCorrectOtpIsDeleted() {
        when(values.get("otp:" + email)).thenReturn("hashed-otp");
        when(encoder.matches("123456", "hashed-otp")).thenReturn(true);
        assertFalse(service.verifyOtp(email, "000000"));
        verify(redis, never()).delete(anyString());
        assertTrue(service.verifyOtp(email, "123456"));
        verify(redis).delete("otp:" + email);
    }
}
