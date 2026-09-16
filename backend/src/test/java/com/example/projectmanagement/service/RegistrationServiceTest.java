package com.example.projectmanagement.service;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

import java.util.List;
import java.util.Optional;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import com.example.projectmanagement.entity.*;
import com.example.projectmanagement.repository.*;

class RegistrationServiceTest {
    private RegistrationRepository registrations;
    private StudentRepository students;
    private UserRepository users;
    private LecturerRepository lecturers;
    private RegistrationService service;
    private Student student;
    private Lecturer lecturer;

    @BeforeEach
    void setUp() {
        registrations = mock(RegistrationRepository.class);
        students = mock(StudentRepository.class);
        users = mock(UserRepository.class);
        lecturers = mock(LecturerRepository.class);
        service = new RegistrationService(registrations, students, users, lecturers,
                mock(GraduationTermRepository.class), mock(TopicRepository.class), mock(TopicCategoryService.class));
        User user = User.builder().id(1L).username("student").build();
        student = Student.builder().id(2L).user(user).firstName("Minh").lastName("Tran").build();
        lecturer = Lecturer.builder().id(3L).user(User.builder().id(4L).username("lecturer").build()).build();
        when(users.findByUsernameIgnoreCase("student")).thenReturn(Optional.of(user));
        when(students.findByUserId(1L)).thenReturn(Optional.of(student));
    }

    private Registration registration(TopicCategory category) {
        return Registration.builder().id(5L).student(student).lecturer(lecturer)
                .graduationTerm(GraduationTerm.builder().id(6L).build()).category(category)
                .title("Existing thesis").status(RegistrationStatus.PENDING).build();
    }

    @Test
    void studentCanReadExistingRegistrationWithoutCategory() {
        when(registrations.findByStudentOrderByIdDesc(student)).thenReturn(List.of(registration(null)));
        var result = service.getMyRegistrations("student");
        assertEquals(1, result.size());
        assertNull(result.get(0).categoryId());
        assertEquals("Chưa phân loại", result.get(0).categoryName());
        assertEquals("Existing thesis", result.get(0).title());
        assertEquals("PENDING", result.get(0).status());
        verify(registrations, never()).save(any());
    }

    @Test
    void studentCanReadCategorizedRegistration() {
        TopicCategory category = TopicCategory.builder().id(7L).name("AI").build();
        when(registrations.findByStudentOrderByIdDesc(student)).thenReturn(List.of(registration(category)));
        var result = service.getMyRegistrations("student").get(0);
        assertEquals(7L, result.categoryId());
        assertEquals("AI", result.categoryName());
    }

    @Test
    void lecturerCanReadPendingRegistrationWithoutCategory() {
        when(users.findByUsernameIgnoreCase("lecturer")).thenReturn(Optional.of(lecturer.getUser()));
        when(lecturers.findByUserId(4L)).thenReturn(Optional.of(lecturer));
        when(registrations.findByLecturerIdAndStatusOrderByIdDesc(3L, RegistrationStatus.PENDING))
                .thenReturn(List.of(registration(null)));
        var result = service.getPendingRegistrationsForLecturer("lecturer");
        assertEquals(1, result.size());
        assertNull(result.get(0).categoryId());
    }

    @Test
    void lecturerListIncludesAcceptedAndPendingStudentsForTheirOwnTerm() {
        when(users.findByUsernameIgnoreCase("lecturer")).thenReturn(Optional.of(lecturer.getUser()));
        when(lecturers.findByUserId(4L)).thenReturn(Optional.of(lecturer));
        var pending = registration(null);
        var accepted = registration(null);
        accepted.setId(8L);
        accepted.setStatus(RegistrationStatus.APPROVED);
        when(registrations.findByLecturerIdAndGraduationTermIdOrderByIdDesc(3L, 6L))
                .thenReturn(List.of(accepted, pending));

        var result = service.getLecturerRegistrations("lecturer", 6L);

        assertEquals(2, result.size());
        assertEquals("APPROVED", result.get(0).status());
        assertEquals("PENDING", result.get(1).status());
        verify(registrations).findByLecturerIdAndGraduationTermIdOrderByIdDesc(3L, 6L);
        verify(registrations, never()).findByLecturerIdOrderByIdDesc(any());
    }

    @Test
    void lecturerListReturnsEmptyForTermWithoutStudents() {
        when(users.findByUsernameIgnoreCase("lecturer")).thenReturn(Optional.of(lecturer.getUser()));
        when(lecturers.findByUserId(4L)).thenReturn(Optional.of(lecturer));
        when(registrations.findByLecturerIdAndGraduationTermIdOrderByIdDesc(3L, 10L)).thenReturn(List.of());
        assertTrue(service.getLecturerRegistrations("lecturer", 10L).isEmpty());
    }
}
