package com.example.projectmanagement.service;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

import java.util.List;
import java.util.Optional;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import com.example.projectmanagement.entity.*;
import com.example.projectmanagement.repository.*;
import com.example.projectmanagement.dto.request.UpdateRegistrationStatusRequest;
import com.example.projectmanagement.dto.request.CreateRegistrationRequest;
import com.example.projectmanagement.exception.AppException;

class RegistrationServiceTest {
    private RegistrationRepository registrations;
    private StudentRepository students;
    private UserRepository users;
    private LecturerRepository lecturers;
    private GraduationTermRepository terms;
    private TopicRepository topics;
    private TopicCategoryService categories;
    private RegistrationService service;
    private Student student;
    private Lecturer lecturer;

    @BeforeEach
    void setUp() {
        registrations = mock(RegistrationRepository.class);
        students = mock(StudentRepository.class);
        users = mock(UserRepository.class);
        lecturers = mock(LecturerRepository.class);
        terms = mock(GraduationTermRepository.class);
        topics = mock(TopicRepository.class);
        categories = mock(TopicCategoryService.class);
        service = new RegistrationService(registrations, students, users, lecturers,
                terms, topics, categories);
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

    @Test
    void fifthStudentIsAcceptedButSixthIsRejectedUnderLecturerLock() {
        when(users.findByUsernameIgnoreCase("lecturer")).thenReturn(Optional.of(lecturer.getUser()));
        when(lecturers.findByUserId(4L)).thenReturn(Optional.of(lecturer));
        when(lecturers.findByIdForUpdate(3L)).thenReturn(Optional.of(lecturer));
        var registration = registration(null);
        when(registrations.findById(5L)).thenReturn(Optional.of(registration));
        when(registrations.save(any())).thenAnswer(invocation -> invocation.getArgument(0));
        when(registrations.countByLecturerIdAndGraduationTermIdAndStatus(3L, 6L, RegistrationStatus.APPROVED)).thenReturn(4L);
        assertEquals("APPROVED", service.updateRegistrationStatus("lecturer", 5L,
                new UpdateRegistrationStatusRequest(RegistrationStatus.APPROVED)).status());

        var order = inOrder(lecturers, registrations);
        order.verify(lecturers).findByIdForUpdate(3L);
        order.verify(registrations).findById(5L);
        order.verify(registrations).countByLecturerIdAndGraduationTermIdAndStatus(3L, 6L, RegistrationStatus.APPROVED);

        registration.setStatus(RegistrationStatus.PENDING);
        when(registrations.countByLecturerIdAndGraduationTermIdAndStatus(3L, 6L, RegistrationStatus.APPROVED)).thenReturn(5L);
        assertThrows(AppException.class, () -> service.updateRegistrationStatus("lecturer", 5L,
                new UpdateRegistrationStatusRequest(RegistrationStatus.APPROVED)));
        assertEquals(RegistrationStatus.PENDING, registration.getStatus());
    }

    @Test
    void registrationWindowIncludesBothBoundariesAndRequiresActiveTerm() {
        var start = java.time.LocalDateTime.of(2026, 9, 1, 0, 0);
        var end = start.plusMonths(3);
        var deadline = start.plusDays(7);
        var term = GraduationTerm.builder().isActive(true).startDate(start).endDate(end).registerDate(deadline).build();
        assertFalse(term.isRegistrationOpenAt(start.minusNanos(1)));
        assertTrue(term.isRegistrationOpenAt(start));
        assertTrue(term.isRegistrationOpenAt(start.plusDays(1)));
        assertTrue(term.isRegistrationOpenAt(deadline));
        assertFalse(term.isRegistrationOpenAt(deadline.plusNanos(1)));
        assertFalse(term.isRegistrationOpenAt(end));
        term.setActive(false);
        assertFalse(term.isRegistrationOpenAt(start.plusDays(1)));
    }

    @Test
    void registrationRejectsFutureExpiredAndInactiveTermsBeforeSaving() {
        var now = java.time.LocalDateTime.now();
        var term = GraduationTerm.builder().id(6L).isActive(true)
                .startDate(now.plusDays(1)).endDate(now.plusDays(10)).registerDate(now.plusDays(2)).build();
        when(lecturers.findById(3L)).thenReturn(Optional.of(lecturer));
        when(terms.findById(6L)).thenReturn(Optional.of(term));
        var request = new CreateRegistrationRequest(6L, 3L, 7L, null, "My proposal");
        assertThrows(AppException.class, () -> service.register("student", request));
        term.setStartDate(now.minusDays(2));
        term.setRegisterDate(now.minusDays(1));
        assertThrows(AppException.class, () -> service.register("student", request));
        term.setRegisterDate(now.plusDays(1));
        term.setActive(false);
        assertThrows(AppException.class, () -> service.register("student", request));
        verify(registrations, never()).save(any());
        verifyNoInteractions(categories);
    }

    @Test
    void studentCannotBypassTopicReviewBySubmittingPendingOrRejectedTopicId() {
        var term = GraduationTerm.builder().id(6L).isActive(true)
                .startDate(java.time.LocalDateTime.now().minusDays(1))
                .endDate(java.time.LocalDateTime.now().plusDays(2))
                .registerDate(java.time.LocalDateTime.now().plusDays(1)).build();
        var category = TopicCategory.builder().id(7L).name("AI").isActive(true).build();
        when(lecturers.findById(3L)).thenReturn(Optional.of(lecturer));
        when(terms.findById(6L)).thenReturn(Optional.of(term));
        when(categories.getEntity(7L)).thenReturn(category);
        var topic = Topic.builder().id(8L).lecturer(lecturer).graduationTerm(term).category(category).title("Topic").build();
        when(topics.findByIdAndActiveTrue(8L)).thenReturn(Optional.of(topic));
        var request = new CreateRegistrationRequest(6L, 3L, 7L, 8L, null);
        for (var status : List.of(TopicStatus.PENDING, TopicStatus.REJECTED)) {
            topic.setStatus(status);
            assertThrows(AppException.class, () -> service.register("student", request));
        }
        verify(registrations, never()).save(any());
        topic.setStatus(TopicStatus.APPROVED);
        when(registrations.save(any())).thenAnswer(invocation -> invocation.getArgument(0));
        assertEquals("Topic", service.register("student", request).title());
    }
}
