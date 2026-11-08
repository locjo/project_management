package com.example.projectmanagement.service;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;
import java.util.Optional;
import org.junit.jupiter.api.Test;
import com.example.projectmanagement.dto.request.*;
import com.example.projectmanagement.entity.*;
import com.example.projectmanagement.exception.AppException;
import com.example.projectmanagement.repository.*;

class AccountManagementServiceTest {
    final UserRepository users = mock(UserRepository.class);
    final LecturerRepository lecturers = mock(LecturerRepository.class);
    final StudentRepository students = mock(StudentRepository.class);
    final RegistrationRepository registrations = mock(RegistrationRepository.class);
    final TopicRepository topics = mock(TopicRepository.class);
    final RefreshTokenRepository tokens = mock(RefreshTokenRepository.class);
    final AccountManagementService service = new AccountManagementService(users, lecturers, students, registrations, topics, tokens);

    User user(UserRole role) { return User.builder().id(10L).username("old").email("old@example.test").role(role).build(); }

    @Test void updatesStudentWithoutSplittingNamesAndClearsOptionalFields() {
        var user = user(UserRole.STUDENT);
        var student = Student.builder().id(1L).user(user).classCode("old").build();
        when(students.findById(1L)).thenReturn(Optional.of(student));
        service.updateStudent(1L, new CreateStudentRequest(" new ", "NEW@example.test", " SV01 ", " Nguyễn Văn ", " An ", null, null, " 2026 "));
        assertEquals("new", user.getUsername()); assertEquals("new@example.test", user.getEmail());
        assertEquals("Nguyễn Văn", student.getLastName()); assertEquals("An", student.getFirstName());
        assertNull(student.getClassCode()); assertEquals("SV01", student.getStudentCode());
    }

    @Test void blocksDuplicateAccountAndStudentCode() {
        var student = Student.builder().id(1L).user(user(UserRole.STUDENT)).build();
        when(students.findById(1L)).thenReturn(Optional.of(student));
        when(students.existsByStudentCodeIgnoreCaseAndIdNot("SV01", 1L)).thenReturn(true);
        assertThrows(AppException.class, () -> service.updateStudent(1L, new CreateStudentRequest("new", "n@example.test", "SV01", "N", "A", null, null, "2026")));
        var lecturer = Lecturer.builder().id(2L).user(user(UserRole.LECTURER)).build();
        when(lecturers.findById(2L)).thenReturn(Optional.of(lecturer));
        when(users.findByEmailIgnoreCase("used@example.test")).thenReturn(Optional.of(User.builder().id(99L).build()));
        assertThrows(AppException.class, () -> service.updateLecturer(2L, new CreateLecturerRequest("new", "used@example.test", "Master")));
        assertEquals("old", lecturer.getUser().getUsername());
    }

    @Test void preservesAcademicHistoryOnDelete() {
        when(students.findById(1L)).thenReturn(Optional.of(Student.builder().id(1L).user(user(UserRole.STUDENT)).build()));
        when(registrations.existsByStudentId(1L)).thenReturn(true);
        assertThrows(AppException.class, () -> service.deleteStudent(1L));
        when(lecturers.findById(2L)).thenReturn(Optional.of(Lecturer.builder().id(2L).user(user(UserRole.LECTURER)).build()));
        when(topics.existsByLecturerId(2L)).thenReturn(true);
        assertThrows(AppException.class, () -> service.deleteLecturer(2L));
        when(topics.existsByLecturerId(2L)).thenReturn(false);
        when(registrations.existsByLecturerId(2L)).thenReturn(true);
        assertThrows(AppException.class, () -> service.deleteLecturer(2L));
        verify(users, never()).delete(any()); verifyNoInteractions(tokens);
    }

    @Test void deletesUnusedAccountAndRefreshTokensButProtectsManagers() {
        var user = user(UserRole.LECTURER);
        when(lecturers.findById(2L)).thenReturn(Optional.of(Lecturer.builder().id(2L).user(user).build()));
        service.deleteLecturer(2L);
        verify(tokens).deleteByUserId(10L); verify(users).delete(user);
        user.setRole(UserRole.HEAD_OF_DEPARTMENT);
        assertThrows(AppException.class, () -> service.deleteLecturer(2L));
        assertThrows(AppException.class, () -> service.updateLecturer(2L, new CreateLecturerRequest("x", "x@example.test", null)));
        assertThrows(AppException.class, () -> service.deleteStudent(999L));
    }
}
