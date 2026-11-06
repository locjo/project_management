package com.example.projectmanagement.service;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;
import java.util.Optional;
import org.junit.jupiter.api.Test;
import org.springframework.test.util.ReflectionTestUtils;
import com.example.projectmanagement.entity.User;
import com.example.projectmanagement.entity.UserRole;
import com.example.projectmanagement.repository.UserRepository;
import com.example.projectmanagement.repository.RefreshTokenRepository;
import com.example.projectmanagement.security.JwtTokenProvider;

class AuthQuickLoginTest {
    private final UserRepository users = mock(UserRepository.class);
    private final RefreshTokenRepository refresh = mock(RefreshTokenRepository.class);
    private final JwtTokenProvider jwt = mock(JwtTokenProvider.class);
    private final OtpService otp = mock(OtpService.class);
    private final AuthService auth = new AuthService(users, refresh, jwt, otp);

    @Test
    void fourRolesGetSessionsWithoutSendingOrVerifyingOtp() {
        ReflectionTestUtils.setField(auth, "quickLoginEnabled", true);
        for (UserRole role : UserRole.values()) {
            var user = User.builder().id(1L).username("tester").role(role).isActive(true).build();
            when(users.findFirstByRoleAndIsActiveTrueOrderByIdAsc(role)).thenReturn(Optional.of(user));
            when(jwt.generateToken("tester", 1L)).thenReturn("token");
            var session = auth.quickLogin(role);
            assertEquals(role.name(), session.user().role());
            assertEquals(1L, session.user().id());
            assertEquals("token", session.accessToken());
            assertEquals("token", session.refreshToken());
        }
        verify(refresh, times(4)).save(any());
        verifyNoInteractions(otp);
    }

    @Test
    void disabledQuickLoginCannotIssueTokens() {
        assertThrows(AuthServiceException.class, () -> auth.quickLogin(UserRole.FACULTY_LEADER));
        verifyNoInteractions(users, refresh, jwt, otp);
    }

    @Test
    void missingAccountOrRoleCannotIssueTokens() {
        ReflectionTestUtils.setField(auth, "quickLoginEnabled", true);
        when(users.findFirstByRoleAndIsActiveTrueOrderByIdAsc(UserRole.STUDENT)).thenReturn(Optional.empty());
        assertThrows(AuthServiceException.class, () -> auth.quickLogin(UserRole.STUDENT));
        assertThrows(AuthServiceException.class, () -> auth.quickLogin(null));
        verifyNoInteractions(refresh, jwt, otp);
    }
}
