package com.example.projectmanagement.security;

import java.io.IOException;
import java.time.Duration;
import java.nio.charset.StandardCharsets;

import org.springframework.dao.DataAccessException;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

@Component
public class RateLimiterFilter extends OncePerRequestFilter {

    private final StringRedisTemplate redisTemplate;

    public RateLimiterFilter(StringRedisTemplate redisTemplate) {
        this.redisTemplate = redisTemplate;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain filterChain) throws ServletException, IOException {
        String path = request.getRequestURI();

        if (path.startsWith("/api/auth")) {
            String clientKey = request.getRemoteAddr();
            String key = "rate-limit:" + clientKey + ":" + path;
            try {
                String countStr = redisTemplate.opsForValue().get(key);
                int count = countStr == null ? 0 : Integer.parseInt(countStr);

                if (count >= 5) {
                    writeError(response, HttpStatus.TOO_MANY_REQUESTS, "Quá nhiều request, vui lòng thử lại sau");
                    return;
                }

                redisTemplate.opsForValue().increment(key);
                redisTemplate.expire(key, Duration.ofMinutes(1));
            } catch (DataAccessException ex) {
                logger.error("Redis unavailable while checking authentication rate limit", ex);
                writeError(response, HttpStatus.SERVICE_UNAVAILABLE,
                        "Dịch vụ xác thực tạm thời không khả dụng do lỗi kết nối Redis. Vui lòng thử lại sau.");
                return;
            }
        }

        filterChain.doFilter(request, response);
    }

    private void writeError(HttpServletResponse response, HttpStatus status, String message) throws IOException {
        response.setStatus(status.value());
        response.setCharacterEncoding(StandardCharsets.UTF_8.name());
        response.setContentType("application/json");
        response.getWriter().write("{\"success\":false,\"message\":\"" + message + "\",\"data\":null}");
    }
}
