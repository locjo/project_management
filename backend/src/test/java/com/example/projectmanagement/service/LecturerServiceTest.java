package com.example.projectmanagement.service;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

import java.util.List;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import com.example.projectmanagement.entity.Lecturer;
import com.example.projectmanagement.entity.User;
import com.example.projectmanagement.entity.RegistrationStatus;
import com.example.projectmanagement.exception.AppException;
import com.example.projectmanagement.repository.LecturerRepository;
import com.example.projectmanagement.repository.GraduationTermRepository;
import com.example.projectmanagement.repository.RegistrationRepository;

class LecturerServiceTest {
    private LecturerRepository lecturers;
    private GraduationTermRepository terms;
    private RegistrationRepository registrations;
    private LecturerService service;

    @BeforeEach
    void setUp() {
        lecturers = mock(LecturerRepository.class);
        terms = mock(GraduationTermRepository.class);
        registrations = mock(RegistrationRepository.class);
        service = new LecturerService(lecturers, terms, registrations);
        when(terms.existsById(9L)).thenReturn(true);
    }

    @Test
    void listsLecturerWithoutPublishedTopicsWithTermSpecificSlots() {
        var lecturer = Lecturer.builder().id(3L).maxStudents(8).department("CNTT")
                .user(User.builder().username("teacher").isActive(true).build()).build();
        when(lecturers.findAllByOrderByIdAsc()).thenReturn(List.of(lecturer));
        when(registrations.countByLecturerIdAndGraduationTermIdAndStatus(3L, 9L, RegistrationStatus.APPROVED)).thenReturn(2L);
        var options = service.getOptions(9L);
        assertEquals(1, options.size());
        assertEquals(3L, options.get(0).lecturerId());
        assertEquals(6, options.get(0).availableSlots());
        verify(registrations).countByLecturerIdAndGraduationTermIdAndStatus(3L, 9L, RegistrationStatus.APPROVED);
    }

    @Test
    void fullLecturerIsListedWithZeroSlotsAndInactiveAccountIsExcluded() {
        var full = Lecturer.builder().id(3L).maxStudents(1)
                .user(User.builder().username("full").isActive(true).build()).build();
        var inactive = Lecturer.builder().id(4L).maxStudents(8)
                .user(User.builder().username("inactive").isActive(false).build()).build();
        when(lecturers.findAllByOrderByIdAsc()).thenReturn(List.of(full, inactive));
        when(registrations.countByLecturerIdAndGraduationTermIdAndStatus(3L, 9L, RegistrationStatus.APPROVED)).thenReturn(2L);
        var options = service.getOptions(9L);
        assertEquals(1, options.size());
        assertEquals(0, options.get(0).availableSlots());
    }

    @Test
    void unknownTermIsRejected() {
        assertThrows(AppException.class, () -> service.getOptions(10L));
        verifyNoInteractions(lecturers, registrations);
    }
}
