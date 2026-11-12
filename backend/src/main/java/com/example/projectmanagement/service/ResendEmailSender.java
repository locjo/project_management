package com.example.projectmanagement.service;

import java.io.IOException;
import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.time.Duration;
import java.util.Map;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;

import com.example.projectmanagement.exception.AppException;
import tools.jackson.core.JacksonException;
import tools.jackson.databind.ObjectMapper;

@Component
public class ResendEmailSender {
    private static final Logger log = LoggerFactory.getLogger(ResendEmailSender.class);
    private static final URI API_URI = URI.create("https://api.resend.com/emails");

    private final HttpClient client;
    private final ObjectMapper objectMapper;
    private final URI endpoint;
    private final String apiKey;
    private final String from;

    @Autowired
    public ResendEmailSender(ObjectMapper objectMapper,
                             @Value("${resend.api-key:}") String apiKey,
                             @Value("${resend.from:}") String from) {
        this(HttpClient.newBuilder().connectTimeout(Duration.ofSeconds(5)).build(),
                objectMapper, API_URI, apiKey, from);
    }

    ResendEmailSender(HttpClient client, ObjectMapper objectMapper, URI endpoint, String apiKey, String from) {
        this.client = client;
        this.objectMapper = objectMapper;
        this.endpoint = endpoint;
        this.apiKey = apiKey;
        this.from = from;
    }

    public void sendOtp(String to, String code) {
        if (!StringUtils.hasText(apiKey) || !StringUtils.hasText(from)) {
            log.error("Resend OTP email is not configured: set RESEND_API_KEY and RESEND_FROM");
            throw new AppException("Dịch vụ gửi OTP chưa được cấu hình. Vui lòng liên hệ quản trị viên.",
                    HttpStatus.SERVICE_UNAVAILABLE);
        }

        String body;
        try {
            body = objectMapper.writeValueAsString(Map.of(
                    "from", from,
                    "to", new String[] {to},
                    "subject", "Mã OTP đăng nhập",
                    "text", "Mã OTP của bạn là: " + code
                            + "\nMã này sẽ hết hạn sau 3 phút."
                            + "\nVui lòng không chia sẻ mã này với bất kỳ ai."));
        } catch (JacksonException ex) {
            throw new IllegalStateException("Could not serialize OTP email", ex);
        }

        HttpRequest request = HttpRequest.newBuilder(endpoint)
                .timeout(Duration.ofSeconds(10))
                .header("Authorization", "Bearer " + apiKey)
                .header("Content-Type", "application/json")
                .POST(HttpRequest.BodyPublishers.ofString(body))
                .build();
        try {
            HttpResponse<Void> response = client.send(request, HttpResponse.BodyHandlers.discarding());
            if (response.statusCode() < 200 || response.statusCode() >= 300) {
                log.warn("Resend rejected OTP email (HTTP {})", response.statusCode());
                throw deliveryUnavailable();
            }
        } catch (IOException ex) {
            log.warn("Resend OTP request failed ({})", ex.getClass().getSimpleName());
            throw deliveryUnavailable();
        } catch (InterruptedException ex) {
            Thread.currentThread().interrupt();
            throw deliveryUnavailable();
        }
    }

    private AppException deliveryUnavailable() {
        return new AppException("Hiện không thể gửi email OTP. Vui lòng thử lại sau.",
                HttpStatus.SERVICE_UNAVAILABLE);
    }
}
