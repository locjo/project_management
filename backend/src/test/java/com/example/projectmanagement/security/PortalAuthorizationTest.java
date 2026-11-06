package com.example.projectmanagement.security;

import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.verify;
import com.example.projectmanagement.controller.ProfileController;
import com.example.projectmanagement.service.ProfileService;
import com.example.projectmanagement.controller.LecturerAccountController;
import com.example.projectmanagement.service.LecturerAccountService;
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
        @Bean ProfileService profiles() { return mock(ProfileService.class); }
        @Bean ProfileController profileController(ProfileService profiles) { return new ProfileController(profiles); }
        @Bean LecturerAccountService lecturerAccounts() { return mock(LecturerAccountService.class); }
        @Bean LecturerAccountController lecturerAccountsController(LecturerAccountService accounts) { return new LecturerAccountController(accounts); }
    }

    @RestController
    static class Endpoints {
        @GetMapping("/api/topics/department") String topics() { return "OK"; }
        @PutMapping("/api/topics/{id}/review") String review() { return "OK"; }
        @PostMapping("/api/graduation-terms") String create() { return "OK"; }
        @GetMapping("/api/graduation-terms") String terms() { return "OK"; }
    }

    @Autowired WebApplicationContext context;
    @Autowired ProfileService profiles;
    MockMvc mvc;
    @BeforeEach void setup() { mvc = MockMvcBuilders.webAppContextSetup(context).apply(springSecurity()).build(); }

    @Test void bothLeadershipRolesCanReviewButLecturersCannot() throws Exception {
        for (var role : new String[] { "FACULTY_LEADER", "HEAD_OF_DEPARTMENT" }) {
            mvc.perform(get("/api/topics/department").with(user("reviewer").roles(role))).andExpect(status().isOk());
            mvc.perform(put("/api/topics/1/review").with(user("reviewer").roles(role))).andExpect(status().isOk());
        }
        mvc.perform(put("/api/topics/1/review").with(user("lecturer").roles("LECTURER"))).andExpect(status().isForbidden());
    }

    @Test void profileRequiresLoginAndUsesAuthenticatedIdentityForEveryRole() throws Exception {
        mvc.perform(get("/api/users/me")).andExpect(status().isForbidden());
        for (var role : new String[] { "STUDENT", "LECTURER", "HEAD_OF_DEPARTMENT", "FACULTY_LEADER" }) {
            mvc.perform(get("/api/users/me").param("username", "someone-else").param("id", "999")
                    .with(user(role).roles(role))).andExpect(status().isOk());
            verify(profiles).getProfile(role);
        }
    }

    @Test void onlyFacultyCanCreateTermsWhileHeadCanStillRead() throws Exception {
        mvc.perform(post("/api/graduation-terms").with(user("faculty").roles("FACULTY_LEADER"))).andExpect(status().isOk());
        mvc.perform(post("/api/graduation-terms").with(user("head").roles("HEAD_OF_DEPARTMENT"))).andExpect(status().isForbidden());
        mvc.perform(get("/api/graduation-terms").with(user("head").roles("HEAD_OF_DEPARTMENT"))).andExpect(status().isOk());
    }

    @Test void onlyFacultyCanCreateLecturersAndInputIsValidated() throws Exception {
        String body = "{\"username\":\"teacher\",\"email\":\"teacher@example.test\",\"academicDegree\":\"Master\"}";
        mvc.perform(post("/api/lecturers").contentType("application/json").content(body)).andExpect(status().isForbidden());
        for (var role : new String[] { "STUDENT", "LECTURER", "HEAD_OF_DEPARTMENT" }) {
            mvc.perform(post("/api/lecturers").with(user("other").roles(role))
                    .contentType("application/json").content(body)).andExpect(status().isForbidden());
        }
        mvc.perform(post("/api/lecturers").with(user("faculty").roles("FACULTY_LEADER"))
                .contentType("application/json").content(body)).andExpect(status().isCreated());
        mvc.perform(post("/api/lecturers").with(user("faculty").roles("FACULTY_LEADER"))
                .contentType("application/json").content("{\"username\":\"\",\"email\":\"invalid\"}"))
                .andExpect(status().isBadRequest());
    }

    @Test void profileUpdateIsAuthenticatedAndValidatesInput() throws Exception {
        mvc.perform(put("/api/users/me").contentType("application/json").content("{\"email\":\"me@example.test\"}"))
                .andExpect(status().isForbidden());
        for (var role : new String[] { "STUDENT", "LECTURER", "HEAD_OF_DEPARTMENT", "FACULTY_LEADER" }) {
            mvc.perform(put("/api/users/me").param("username", "someone-else").with(user("edit-" + role).roles(role))
                    .contentType("application/json").content("{\"email\":\"me@example.test\"}"))
                    .andExpect(status().isOk());
            verify(profiles).updateProfile(org.mockito.ArgumentMatchers.eq("edit-" + role), org.mockito.ArgumentMatchers.any());
        }
        mvc.perform(put("/api/users/me").with(user("editor").roles("STUDENT"))
                .contentType("application/json").content("{\"email\":\"invalid\"}"))
                .andExpect(status().isBadRequest());
    }
}
