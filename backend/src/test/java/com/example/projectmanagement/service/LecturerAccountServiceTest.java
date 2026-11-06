package com.example.projectmanagement.service;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;
import org.junit.jupiter.api.Test;
import org.mockito.ArgumentCaptor;
import com.example.projectmanagement.dto.request.CreateLecturerRequest;
import com.example.projectmanagement.entity.User;
import com.example.projectmanagement.entity.UserRole;
import com.example.projectmanagement.exception.AppException;
import com.example.projectmanagement.repository.UserRepository;

class LecturerAccountServiceTest {
    private final UserRepository users = mock(UserRepository.class);
    private final LecturerAccountService service = new LecturerAccountService(users);

    @Test void createsActiveLecturerAndLinkedProfileTogether() {
        service.create(new CreateLecturerRequest(" teacher ", "Teacher@example.test", " Tiến sĩ "));
        var captured = ArgumentCaptor.forClass(User.class);
        verify(users).saveAndFlush(captured.capture());
        var user = captured.getValue();
        assertEquals("teacher", user.getUsername());
        assertEquals("teacher@example.test", user.getEmail());
        assertEquals(UserRole.LECTURER, user.getRole());
        assertTrue(user.isActive());
        assertSame(user, user.getLecturer().getUser());
        assertEquals("Tiến sĩ", user.getLecturer().getAcademicDegree());
    }

    @Test void duplicateUsernameOrEmailDoesNotCreateAccount() {
        when(users.existsByUsernameIgnoreCase("taken")).thenReturn(true);
        assertThrows(AppException.class, () -> service.create(new CreateLecturerRequest("taken", "a@example.test", null)));
        when(users.existsByEmailIgnoreCase("taken@example.test")).thenReturn(true);
        assertThrows(AppException.class, () -> service.create(new CreateLecturerRequest("new", "taken@example.test", null)));
        verify(users, never()).saveAndFlush(any());
    }

    @Test void schemaErrorsAreNotMisreportedAsDuplicateAccounts() {
        var failure = new org.springframework.dao.DataIntegrityViolationException("legacy column cannot be null");
        when(users.saveAndFlush(any())).thenThrow(failure);
        assertSame(failure, assertThrows(org.springframework.dao.DataIntegrityViolationException.class,
                () -> service.create(new CreateLecturerRequest("new", "new@example.test", null))));
    }
}
