package com.example.projectmanagement.service;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

import java.util.List;
import java.util.Optional;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.http.HttpStatus;

import com.example.projectmanagement.dto.request.CreateTopicRequest;
import com.example.projectmanagement.entity.*;
import com.example.projectmanagement.exception.AppException;
import com.example.projectmanagement.repository.*;

class TopicServiceTest {
    private TopicRepository topics;
    private LecturerRepository lecturers;
    private UserRepository users;
    private GraduationTermRepository terms;
    private TopicCategoryService categories;
    private TopicService service;
    private Lecturer owner;
    private Lecturer head;
    private GraduationTerm term;
    private TopicCategory category;

    @BeforeEach
    void setUp() {
        topics = mock(TopicRepository.class);
        lecturers = mock(LecturerRepository.class);
        users = mock(UserRepository.class);
        terms = mock(GraduationTermRepository.class);
        categories = mock(TopicCategoryService.class);
        service = new TopicService(topics, lecturers, users, terms, categories);
        owner = Lecturer.builder().id(1L)
                .user(User.builder().id(10L).username("owner").role(UserRole.LECTURER).build()).build();
        head = Lecturer.builder().id(2L)
                .user(User.builder().id(20L).username("head").role(UserRole.HEAD_OF_DEPARTMENT).build()).build();
        term = GraduationTerm.builder().id(3L).isActive(true).build();
        category = TopicCategory.builder().id(4L).name("AI").isActive(true).build();
        for (Lecturer lecturer : List.of(owner, head)) {
            when(users.findByUsernameIgnoreCase(lecturer.getUser().getUsername())).thenReturn(Optional.of(lecturer.getUser()));
            when(lecturers.findByUserId(lecturer.getUser().getId())).thenReturn(Optional.of(lecturer));
        }
        when(terms.findById(3L)).thenReturn(Optional.of(term));
        when(categories.getEntity(4L)).thenReturn(category);
        when(topics.save(any(Topic.class))).thenAnswer(invocation -> invocation.getArgument(0));
    }

    private Topic topic(TopicStatus status) {
        return Topic.builder().id(5L).lecturer(owner).graduationTerm(term).category(category)
                .title("Topic").active(true).status(status).build();
    }

    @Test
    void newTopicRequiresReviewAndApprovedTopicEditRequiresReviewAgain() {
        var request = new CreateTopicRequest(3L, 4L, "New topic", null);
        assertEquals("PENDING", service.create("owner", request).status());
        var topic = topic(TopicStatus.APPROVED);
        when(topics.findById(5L)).thenReturn(Optional.of(topic));
        assertEquals("PENDING", service.update("owner", 5L, request).status());
    }

    @Test
    void publicListOnlyQueriesApprovedTopics() {
        when(topics.findByGraduationTermIdAndStatusAndActiveTrueOrderByCreatedAtDesc(3L, TopicStatus.APPROVED))
                .thenReturn(List.of(topic(TopicStatus.APPROVED)));
        assertEquals("APPROVED", service.getAll(3L, null).get(0).status());
        verify(topics, never()).findByGraduationTermIdAndActiveTrueOrderByCreatedAtDesc(any());
    }

    @Test
    void headCanApproveOrRejectWithoutAnOrganizationalOrLecturerProfile() {
        when(lecturers.findByUserId(20L)).thenReturn(Optional.empty());
        var topic = topic(TopicStatus.PENDING);
        when(topics.findByIdAndActiveTrue(5L)).thenReturn(Optional.of(topic));
        assertEquals("APPROVED", service.review("head", 5L, TopicStatus.APPROVED).status());
        topic.setStatus(TopicStatus.PENDING);
        assertEquals("REJECTED", service.review("head", 5L, TopicStatus.REJECTED).status());
    }

    @Test
    void lecturerAndStudentCannotApprove() {
        assertEquals(HttpStatus.FORBIDDEN, assertThrows(AppException.class,
                () -> service.review("owner", 5L, TopicStatus.APPROVED)).getStatus());
        head.getUser().setRole(UserRole.STUDENT);
        assertEquals(HttpStatus.FORBIDDEN, assertThrows(AppException.class,
                () -> service.review("head", 5L, TopicStatus.APPROVED)).getStatus());
        verify(topics, never()).save(any());
    }

    @Test
    void facultyLeaderCanListApproveAndRejectWithoutLecturerProfile() {
        var faculty = User.builder().id(30L).username("faculty").role(UserRole.FACULTY_LEADER).build();
        when(users.findByUsernameIgnoreCase("faculty")).thenReturn(Optional.of(faculty));
        var proposal = topic(TopicStatus.PENDING);
        when(topics.findByGraduationTermIdAndActiveTrueOrderByCreatedAtDesc(3L)).thenReturn(List.of(proposal));
        when(topics.findByGraduationTermIdAndStatusAndActiveTrueOrderByCreatedAtDesc(3L, TopicStatus.PENDING)).thenReturn(List.of(proposal));
        when(topics.findByIdAndActiveTrue(5L)).thenReturn(Optional.of(proposal));
        assertEquals(1, service.getForDepartment("faculty", 3L).size());
        assertEquals(1, service.getPendingForDepartment("faculty", 3L).size());
        assertEquals("APPROVED", service.review("faculty", 5L, TopicStatus.APPROVED).status());
        proposal.setStatus(TopicStatus.PENDING);
        assertEquals("REJECTED", service.review("faculty", 5L, TopicStatus.REJECTED).status());
        verify(lecturers, never()).findByUserId(30L);
    }

    @Test
    void pendingQueueIncludesAllLecturersInTheSelectedTerm() {
        var own = topic(TopicStatus.PENDING);
        var other = topic(TopicStatus.PENDING);
        other.setId(6L);
        other.setLecturer(Lecturer.builder().id(7L)
                .user(User.builder().username("second-lecturer").build()).build());
        when(topics.findByGraduationTermIdAndStatusAndActiveTrueOrderByCreatedAtDesc(3L, TopicStatus.PENDING))
                .thenReturn(List.of(own, other));
        var result = service.getPendingForDepartment("head", 3L);
        assertEquals(2, result.size());
        assertEquals(5L, result.get(0).id());
        assertEquals(6L, result.get(1).id());
        verify(topics).findByGraduationTermIdAndStatusAndActiveTrueOrderByCreatedAtDesc(3L, TopicStatus.PENDING);
    }

    @Test
    void reviewListIncludesAllStatusesAndStillRequiresReviewerRole() {
        when(topics.findByGraduationTermIdAndActiveTrueOrderByCreatedAtDesc(3L))
                .thenReturn(List.of(topic(TopicStatus.PENDING), topic(TopicStatus.APPROVED), topic(TopicStatus.REJECTED)));
        assertEquals(3, service.getForDepartment("head", 3L).size());
        assertEquals(HttpStatus.FORBIDDEN, assertThrows(AppException.class,
                () -> service.getForDepartment("owner", 3L)).getStatus());
        assertEquals(HttpStatus.FORBIDDEN, assertThrows(AppException.class,
                () -> service.getPendingForDepartment("owner", 3L)).getStatus());
    }

    @Test
    void alreadyReviewedOrInvalidDecisionIsRejected() {
        when(topics.findByIdAndActiveTrue(5L)).thenReturn(Optional.of(topic(TopicStatus.APPROVED)));
        assertEquals(HttpStatus.CONFLICT, assertThrows(AppException.class,
                () -> service.review("head", 5L, TopicStatus.REJECTED)).getStatus());
        assertEquals(HttpStatus.BAD_REQUEST, assertThrows(AppException.class,
                () -> service.review("head", 5L, TopicStatus.PENDING)).getStatus());
    }
}
