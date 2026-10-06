package com.example.projectmanagement.service;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

import java.time.LocalDateTime;
import org.junit.jupiter.api.Test;
import com.example.projectmanagement.dto.request.CreateGraduationTermRequest;
import com.example.projectmanagement.exception.AppException;
import com.example.projectmanagement.repository.GraduationTermRepository;
import com.example.projectmanagement.repository.RegistrationRepository;

class GraduationTermServiceTest {
    @Test
    void createsTermWithRegistrationDeadlineAndRejectsInvalidDates() {
        var terms = mock(GraduationTermRepository.class);
        var service = new GraduationTermService(terms, mock(RegistrationRepository.class));
        when(terms.save(any())).thenAnswer(call -> call.getArgument(0));
        var start = LocalDateTime.of(2026, 9, 1, 0, 0);
        var end = start.plusMonths(3);

        var result = service.create(new CreateGraduationTermRequest("TERM", "Term", "2026-2027", "1", start, end, start.plusDays(7), true));
        assertEquals(start, result.startDate());
        assertEquals(end, result.endDate());
        assertEquals(start.plusDays(7), result.registerDate());
        assertTrue(result.active());
        assertThrows(AppException.class, () -> service.create(
                new CreateGraduationTermRequest("INVALID", "Term", "2026-2027", "1", end, start, start.plusDays(7), true)));
        verify(terms, times(1)).save(any());
        for (var deadline : new LocalDateTime[] { start.minusSeconds(1), end.plusSeconds(1), null }) {
            assertThrows(AppException.class, () -> service.create(
                    new CreateGraduationTermRequest("INVALID", "Term", "2026-2027", "1", start, end, deadline, true)));
        }
        assertEquals(start, service.create(new CreateGraduationTermRequest("START", "Term", "2026-2027", "1", start, end, start, true)).registerDate());
        assertEquals(end, service.create(new CreateGraduationTermRequest("END", "Term", "2026-2027", "1", start, end, end, true)).registerDate());
    }
}
