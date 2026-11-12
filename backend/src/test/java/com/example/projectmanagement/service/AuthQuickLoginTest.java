package com.example.projectmanagement.service;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;
import java.util.List;
import java.util.Optional;
import org.junit.jupiter.api.Test;
import org.springframework.data.domain.Pageable;
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
            switch (role) {
                case STUDENT -> when(users.findActiveStudentsWithProfile(eq(role), any(Pageable.class))).thenReturn(List.of(user));
                case LECTURER, HEAD_OF_DEPARTMENT -> when(users.findActiveLecturersWithProfile(eq(role), any(Pageable.class))).thenReturn(List.of(user));
                case FACULTY_LEADER -> when(users.findFirstByRoleAndIsActiveTrueOrderByIdAsc(role)).thenReturn(Optional.of(user));
            }
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
        when(users.findActiveStudentsWithProfile(eq(UserRole.STUDENT), any(Pageable.class))).thenReturn(List.of());
        assertThrows(AuthServiceException.class, () -> auth.quickLogin(UserRole.STUDENT));
        assertThrows(AuthServiceException.class, () -> auth.quickLogin(null));
        verifyNoInteractions(refresh, jwt, otp);
    }

    @Test
    void incompleteStudentAccountIsNotSelected() {
        ReflectionTestUtils.setField(auth, "quickLoginEnabled", true);
        var incomplete = User.builder().id(1L).username("legacy").role(UserRole.STUDENT).isActive(true).build();
        var complete = User.builder().id(2L).username("demo").role(UserRole.STUDENT).isActive(true).build();
        when(users.findFirstByRoleAndIsActiveTrueOrderByIdAsc(UserRole.STUDENT)).thenReturn(Optional.of(incomplete));
        when(users.findActiveStudentsWithProfile(eq(UserRole.STUDENT), any(Pageable.class))).thenReturn(List.of(complete));
        when(jwt.generateToken("demo", 2L)).thenReturn("token");

        assertEquals("demo", auth.quickLogin(UserRole.STUDENT).user().username());
        verify(users, never()).findFirstByRoleAndIsActiveTrueOrderByIdAsc(UserRole.STUDENT);
        verifyNoInteractions(otp);
    }

    @Test
    void incompleteLecturerAccountIsNotSelected() {
        ReflectionTestUtils.setField(auth, "quickLoginEnabled", true);
        var incomplete = User.builder().id(3L).username("giangvien01").role(UserRole.LECTURER).isActive(true).build();
        var complete = User.builder().id(4L).username("demo_lecturer_01").role(UserRole.LECTURER).isActive(true).build();
        when(users.findFirstByRoleAndIsActiveTrueOrderByIdAsc(UserRole.LECTURER)).thenReturn(Optional.of(incomplete));
        when(users.findActiveLecturersWithProfile(eq(UserRole.LECTURER), any(Pageable.class))).thenReturn(List.of(complete));
        when(jwt.generateToken("demo_lecturer_01", 4L)).thenReturn("token");

        assertEquals("demo_lecturer_01", auth.quickLogin(UserRole.LECTURER).user().username());
        verify(users, never()).findFirstByRoleAndIsActiveTrueOrderByIdAsc(UserRole.LECTURER);
        verifyNoInteractions(otp);
    }
}
