package com.example.projectmanagement.mapper;

import static org.junit.jupiter.api.Assertions.*;

import java.time.LocalDateTime;
import org.junit.jupiter.api.Test;
import com.example.projectmanagement.dto.request.CreateGraduationTermRequest;
import com.example.projectmanagement.dto.request.CreateTopicCategoryRequest;
import com.example.projectmanagement.entity.GraduationTerm;
import com.example.projectmanagement.entity.TopicCategory;

class RequestMapperTest {
    @Test
    void updatingTermPreservesIdentityAndExistingNormalization() {
        var date = LocalDateTime.of(2026, 9, 1, 0, 0);
        var request = new CreateGraduationTermRequest(" TERM ", " Term name ", " 2026-2027 ", " 1 ",
                date, date.plusMonths(3), date.plusDays(7), false);
        var term = GraduationTerm.builder().id(42L).isActive(true).build();

        GraduationTermMapper.updateEntity(term, request);

        assertEquals(42L, term.getId());
        assertEquals("TERM", term.getCode());
        assertEquals("Term name", term.getName());
        assertFalse(term.isActive());
        assertEquals(date, GraduationTermMapper.toResponse(term).startDate());
        assertEquals(date.plusMonths(3), GraduationTermMapper.toResponse(term).endDate());
        assertEquals(date.plusDays(7), GraduationTermMapper.toResponse(term).registerDate());
        var created = GraduationTermMapper.toEntity(request);
        assertNull(created.getId());
        assertEquals(term.getCode(), created.getCode());
    }

    @Test
    void updatingCategoryPreservesIdentityAndClearsBlankDescription() {
        var category = TopicCategory.builder().id(9L).description("Old description").isActive(true).build();
        var request = new CreateTopicCategoryRequest(" ai ", " Artificial intelligence ", "  ", false);

        TopicCategoryMapper.updateEntity(category, request, "AI");

        assertEquals(9L, category.getId());
        assertEquals("AI", category.getCode());
        assertNull(category.getDescription());
        assertFalse(category.isActive());
        assertEquals("Artificial intelligence", TopicCategoryMapper.toResponse(category).name());
    }
}
