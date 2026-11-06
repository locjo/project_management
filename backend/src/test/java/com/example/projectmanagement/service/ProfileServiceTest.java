package com.example.projectmanagement.service;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;
import java.util.Optional;
import org.junit.jupiter.api.Test;
import com.example.projectmanagement.entity.*;
import com.example.projectmanagement.repository.UserRepository;
import com.example.projectmanagement.dto.request.UpdateProfileRequest;

class ProfileServiceTest {
    private final UserRepository users = mock(UserRepository.class);
    private final ProfileService service = new ProfileService(users);

    @Test void updateChangesOwnDetailsButPreservesIdentityAndRole() {
        var student = Student.builder().studentCode("SV001").build();
        var user = User.builder().id(1L).username("an").email("old@example.test")
                .role(UserRole.STUDENT).isActive(true).student(student).build();
        when(users.findByUsernameIgnoreCase("an")).thenReturn(Optional.of(user));
        var request = new UpdateProfileRequest("new@example.test",
                new UpdateProfileRequest.StudentDetails(" Nguyễn ", " An ", null, " CNTT ", "2026", ""), null);
        var result = service.updateProfile("an", request);
        assertEquals("new@example.test", result.email());
        assertEquals("Nguyễn An", result.student().fullName());
        assertNull(result.student().phone());
        assertEquals("SV001", result.student().studentCode());
        assertEquals("an", result.username());
        assertEquals("STUDENT", result.role());
        assertTrue(result.active());
        verify(users).saveAndFlush(user);
    }

    @Test void duplicateEmailAndIncompatibleProfileAreRejected() {
        var user = User.builder().id(1L).username("staff").email("old@example.test").role(UserRole.LECTURER).build();
        when(users.findByUsernameIgnoreCase("staff")).thenReturn(Optional.of(user));
        when(users.findByEmailIgnoreCase("taken@example.test")).thenReturn(Optional.of(User.builder().id(2L).build()));
        assertThrows(AuthServiceException.class, () -> service.updateProfile("staff", new UpdateProfileRequest("taken@example.test", null, null)));
        assertThrows(AuthServiceException.class, () -> service.updateProfile("staff", new UpdateProfileRequest("old@example.test",
                new UpdateProfileRequest.StudentDetails("A", "B", null, null, "2026", null), null)));
        verify(users, never()).saveAndFlush(any());
        assertEquals("old@example.test", user.getEmail());
    }

    @Test void duplicatePhoneIsRejectedBeforeAnyMutation() {
        var student = Student.builder().phone("0901111111").build();
        var user = User.builder().id(1L).username("an").student(student).build();
        when(users.findByUsernameIgnoreCase("an")).thenReturn(Optional.of(user));
        when(users.existsByStudentPhoneAndIdNot("0902222222", 1L)).thenReturn(true);
        var request = new UpdateProfileRequest("an@example.test",
                new UpdateProfileRequest.StudentDetails("A", "B", null, null, "2026", "0902222222"), null);
        assertThrows(AuthServiceException.class, () -> service.updateProfile("an", request));
        assertEquals("0901111111", student.getPhone());
        verify(users, never()).saveAndFlush(any());
    }

    @Test void studentProfileIncludesAvailableDetailsAndPreservesMissingValues() {
        var student = Student.builder().studentCode("SV001").lastName("Nguyễn").firstName("An")
                .academicYear("2026-2027").build();
        var user = User.builder().id(1L).username("an").email("an@example.test")
                .role(UserRole.STUDENT).isActive(true).student(student).build();
        when(users.findByUsernameIgnoreCase("an")).thenReturn(Optional.of(user));
        var result = service.getProfile("an");
        assertEquals("an@example.test", result.email());
        assertEquals("Nguyễn An", result.student().fullName());
        assertEquals("SV001", result.student().studentCode());
        assertNull(result.student().phone());
        assertNull(result.lecturer());
    }

    @Test void lecturerAndLeadershipProfilesWorkWithoutStudentRecords() {
        for (var role : new UserRole[] {UserRole.LECTURER, UserRole.HEAD_OF_DEPARTMENT, UserRole.FACULTY_LEADER}) {
            var user = User.builder().username("staff").role(role)
                    .lecturer(Lecturer.builder().academicDegree("Tiến sĩ").build()).build();
            when(users.findByUsernameIgnoreCase("staff")).thenReturn(Optional.of(user));
            var result = service.getProfile("staff");
            assertEquals(role.name(), result.role());
            assertEquals("Tiến sĩ", result.lecturer().academicDegree());
            assertNull(result.student());
        }
    }

    @Test void missingAccountReturnsNotFound() {
        when(users.findByUsernameIgnoreCase("missing")).thenReturn(Optional.empty());
        assertThrows(AuthServiceException.class, () -> service.getProfile("missing"));
    }
}
