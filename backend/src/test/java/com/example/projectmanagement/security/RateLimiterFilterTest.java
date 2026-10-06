package com.example.projectmanagement.security;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

import jakarta.servlet.FilterChain;
import org.junit.jupiter.api.Test;
import org.springframework.data.redis.RedisConnectionFailureException;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.data.redis.core.ValueOperations;
import org.springframework.mock.web.MockHttpServletRequest;
import org.springframework.mock.web.MockHttpServletResponse;

class RateLimiterFilterTest {
    @Test
    void redisOutageReturnsServiceUnavailableInsteadOfMaskedPermissionError() throws Exception {
        var redis = mock(StringRedisTemplate.class);
        when(redis.opsForValue()).thenThrow(new RedisConnectionFailureException("Redis offline"));
        var chain = mock(FilterChain.class);
        var response = new MockHttpServletResponse();

        new RateLimiterFilter(redis).doFilter(new MockHttpServletRequest("POST", "/api/auth/send-otp"), response, chain);

        assertEquals(503, response.getStatus());
        assertEquals("UTF-8", response.getCharacterEncoding());
        assertTrue(response.getContentAsString().contains("Redis"));
        verifyNoInteractions(chain);
    }

    @Test
    @SuppressWarnings("unchecked")
    void healthyRedisAllowsRequestsAndStillEnforcesRateLimit() throws Exception {
        var redis = mock(StringRedisTemplate.class);
        ValueOperations<String, String> values = mock(ValueOperations.class);
        when(redis.opsForValue()).thenReturn(values);
        var filter = new RateLimiterFilter(redis);
        var chain = mock(FilterChain.class);
        var request = new MockHttpServletRequest("POST", "/api/auth/send-otp");
        var response = new MockHttpServletResponse();

        filter.doFilter(request, response, chain);
        verify(chain).doFilter(request, response);
        when(values.get(anyString())).thenReturn("5");
        var blockedChain = mock(FilterChain.class);
        var blockedResponse = new MockHttpServletResponse();
        filter.doFilter(new MockHttpServletRequest("POST", "/api/auth/send-otp"), blockedResponse, blockedChain);
        assertEquals(429, blockedResponse.getStatus());
        verifyNoInteractions(blockedChain);
    }
}
