package com.example.projectmanagement.security;

import static org.mockito.Mockito.mock;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.user;
import static org.springframework.security.test.web.servlet.setup.SecurityMockMvcConfigurers.springSecurity;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Import;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.test.context.junit.jupiter.SpringJUnitConfig;
import org.springframework.test.context.web.WebAppConfiguration;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.context.WebApplicationContext;
import org.springframework.web.servlet.config.annotation.EnableWebMvc;
import com.example.projectmanagement.config.SecurityConfig;

@SpringJUnitConfig(PortalAuthorizationTest.Config.class)
@WebAppConfiguration
class PortalAuthorizationTest {
    @Configuration
    @EnableWebMvc
    @Import(SecurityConfig.class)
    static class Config {
        @Bean RateLimiterFilter rateLimiter() { return new RateLimiterFilter(mock(StringRedisTemplate.class)); }
        @Bean JwtAuthenticationFilter jwtFilter() {
            return new JwtAuthenticationFilter(mock(JwtTokenProvider.class), mock(CustomUserDetailsService.class));
        }
        @Bean Endpoints endpoints() { return new Endpoints(); }
    }

    @RestController
    static class Endpoints {
        @GetMapping("/api/topics/department") String topics() { return "OK"; }
        @PutMapping("/api/topics/{id}/review") String review() { return "OK"; }
        @PostMapping("/api/graduation-terms") String create() { return "OK"; }
        @GetMapping("/api/graduation-terms") String terms() { return "OK"; }
    }

    @Autowired WebApplicationContext context;
    MockMvc mvc;
    @BeforeEach void setup() { mvc = MockMvcBuilders.webAppContextSetup(context).apply(springSecurity()).build(); }

    @Test void bothLeadershipRolesCanReviewButLecturersCannot() throws Exception {
        for (var role : new String[] { "FACULTY_LEADER", "HEAD_OF_DEPARTMENT" }) {
            mvc.perform(get("/api/topics/department").with(user("reviewer").roles(role))).andExpect(status().isOk());
            mvc.perform(put("/api/topics/1/review").with(user("reviewer").roles(role))).andExpect(status().isOk());
        }
        mvc.perform(put("/api/topics/1/review").with(user("lecturer").roles("LECTURER"))).andExpect(status().isForbidden());
    }

    @Test void onlyFacultyCanCreateTermsWhileHeadCanStillRead() throws Exception {
        mvc.perform(post("/api/graduation-terms").with(user("faculty").roles("FACULTY_LEADER"))).andExpect(status().isOk());
        mvc.perform(post("/api/graduation-terms").with(user("head").roles("HEAD_OF_DEPARTMENT"))).andExpect(status().isForbidden());
        mvc.perform(get("/api/graduation-terms").with(user("head").roles("HEAD_OF_DEPARTMENT"))).andExpect(status().isOk());
    }
}
