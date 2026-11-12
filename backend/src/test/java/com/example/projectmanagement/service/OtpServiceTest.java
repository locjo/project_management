package com.example.projectmanagement.service;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

import java.util.concurrent.TimeUnit;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.ArgumentCaptor;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.data.redis.core.ValueOperations;
import org.springframework.http.HttpStatus;
import com.example.projectmanagement.exception.AppException;
import org.springframework.security.crypto.password.PasswordEncoder;

class OtpServiceTest {
    private final String email = "student@example.test";
    private StringRedisTemplate redis;
    private ValueOperations<String, String> values;
    private ResendEmailSender sender;
    private PasswordEncoder encoder;
    private OtpService service;

    @BeforeEach
    @SuppressWarnings("unchecked")
    void setUp() {
        redis = mock(StringRedisTemplate.class);
        values = mock(ValueOperations.class);
        when(redis.opsForValue()).thenReturn(values);
        sender = mock(ResendEmailSender.class);
        encoder = mock(PasswordEncoder.class);
        service = new OtpService(sender, redis, encoder);
    }

    @Test
    void sendingStoresHashWithThreeMinuteTtlAndEmailsMatchingCode() {
        when(encoder.encode(anyString())).thenReturn("hashed-otp");
        service.sendOtp(email);
        var code = ArgumentCaptor.forClass(String.class);
        verify(sender).sendOtp(eq(email), code.capture());
        assertTrue(code.getValue().matches("[0-9]{6}"));
        verify(encoder).encode(code.getValue());
        verify(values).set("otp:" + email, "hashed-otp", 180, TimeUnit.SECONDS);
        var order = inOrder(sender, values);
        order.verify(sender).sendOtp(email, code.getValue());
        order.verify(values).set("otp:" + email, "hashed-otp", 180, TimeUnit.SECONDS);
    }

    @Test
    void deliveryFailureDoesNotStoreOrReplaceOtp() {
        doThrow(new AppException("Unavailable", HttpStatus.SERVICE_UNAVAILABLE))
                .when(sender).sendOtp(eq(email), anyString());
        var error = assertThrows(AppException.class, () -> service.sendOtp(email));
        assertEquals(HttpStatus.SERVICE_UNAVAILABLE, error.getStatus());
        verify(redis, never()).opsForValue();
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
