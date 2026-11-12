package com.example.projectmanagement.service;

import static org.junit.jupiter.api.Assertions.*;

import java.net.InetSocketAddress;
import java.net.URI;
import java.net.http.HttpClient;
import java.nio.charset.StandardCharsets;
import java.util.concurrent.atomic.AtomicInteger;
import java.util.concurrent.atomic.AtomicReference;

import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.http.HttpStatus;

import com.example.projectmanagement.exception.AppException;
import com.sun.net.httpserver.HttpServer;
import tools.jackson.databind.ObjectMapper;

class ResendEmailSenderTest {
    private HttpServer server;
    private URI endpoint;
    private final AtomicInteger status = new AtomicInteger(403);
    private final AtomicReference<String> authorization = new AtomicReference<>();
    private final AtomicReference<String> payload = new AtomicReference<>();

    @BeforeEach
    void setUp() throws Exception {
        server = HttpServer.create(new InetSocketAddress("127.0.0.1", 0), 0);
        server.createContext("/emails", exchange -> {
            authorization.set(exchange.getRequestHeaders().getFirst("Authorization"));
            payload.set(new String(exchange.getRequestBody().readAllBytes(), StandardCharsets.UTF_8));
            byte[] body = "secret provider detail".getBytes(StandardCharsets.UTF_8);
            exchange.sendResponseHeaders(status.get(), status.get() == 200 ? -1 : body.length);
            if (status.get() != 200) exchange.getResponseBody().write(body);
            exchange.close();
        });
        server.start();
        endpoint = URI.create("http://127.0.0.1:" + server.getAddress().getPort() + "/emails");
    }

    @AfterEach
    void tearDown() {
        server.stop(0);
    }

    @Test
    void postsOtpEmailToResend() throws Exception {
        status.set(200);
        sender("test-key", "OTP <otp@example.com>").sendOtp("student@example.com", "123456");
        assertEquals("Bearer test-key", authorization.get());
        var json = new ObjectMapper().readTree(payload.get());
        assertEquals("OTP <otp@example.com>", json.get("from").asText());
        assertEquals("student@example.com", json.get("to").get(0).asText());
        assertEquals("Mã OTP đăng nhập", json.get("subject").asText());
        assertTrue(json.get("text").asText().contains("123456"));
    }

    @Test
    void rejectsFailedApiResponseWithoutExposingServerDetails() {
        var error = assertThrows(AppException.class,
                () -> sender("test-key", "otp@example.com").sendOtp("student@example.com", "123456"));
        assertEquals(HttpStatus.SERVICE_UNAVAILABLE, error.getStatus());
        assertFalse(error.getMessage().contains("secret provider detail"));
    }

    @Test
    void missingConfigurationDoesNotCallApi() {
        var error = assertThrows(AppException.class,
                () -> sender("", "otp@example.com").sendOtp("student@example.com", "123456"));
        assertEquals(HttpStatus.SERVICE_UNAVAILABLE, error.getStatus());
    }

    private ResendEmailSender sender(String key, String from) {
        return new ResendEmailSender(HttpClient.newHttpClient(), new ObjectMapper(), endpoint, key, from);
    }
}
