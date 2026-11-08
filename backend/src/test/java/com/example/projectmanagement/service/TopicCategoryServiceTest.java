package com.example.projectmanagement.service;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;
import java.util.Optional;
import org.junit.jupiter.api.Test;
import com.example.projectmanagement.dto.request.CreateTopicCategoryRequest;
import com.example.projectmanagement.entity.TopicCategory;
import com.example.projectmanagement.exception.AppException;
import com.example.projectmanagement.repository.*;

class TopicCategoryServiceTest {
    final TopicCategoryRepository repository = mock(TopicCategoryRepository.class);
    final TopicRepository topics = mock(TopicRepository.class);
    final RegistrationRepository registrations = mock(RegistrationRepository.class);
    final TopicCategoryService service = new TopicCategoryService(repository, topics, registrations);

    @Test void deleteProtectsBothTopicsAndCustomRegistrations() {
        var category = TopicCategory.builder().id(1L).build();
        when(repository.findById(1L)).thenReturn(Optional.of(category));
        when(topics.existsByCategoryId(1L)).thenReturn(true);
        assertThrows(AppException.class, () -> service.delete(1L));
        when(topics.existsByCategoryId(1L)).thenReturn(false);
        when(registrations.existsByCategoryId(1L)).thenReturn(true);
        assertThrows(AppException.class, () -> service.delete(1L));
        verify(repository, never()).delete(any());
        when(registrations.existsByCategoryId(1L)).thenReturn(false);
        service.delete(1L);
        verify(repository).delete(category);
        assertThrows(AppException.class, () -> service.delete(999L));
    }

    @Test void updateNormalizesFieldsAndRejectsDuplicateCodes() {
        var category = TopicCategory.builder().id(1L).code("AI").build();
        when(repository.findById(1L)).thenReturn(Optional.of(category));
        when(repository.findByCodeIgnoreCase("AI")).thenReturn(Optional.of(category));
        when(repository.save(any())).thenAnswer(call -> call.getArgument(0));
        var result = service.update(1L, new CreateTopicCategoryRequest(" ai ", " AI updated ", " details ", false));
        assertEquals("AI", result.code()); assertEquals("AI updated", result.name()); assertFalse(result.isActive());
        when(repository.findByCodeIgnoreCase("USED")).thenReturn(Optional.of(TopicCategory.builder().id(2L).build()));
        assertThrows(AppException.class, () -> service.update(1L, new CreateTopicCategoryRequest("used", "x", null, true)));
    }
}
