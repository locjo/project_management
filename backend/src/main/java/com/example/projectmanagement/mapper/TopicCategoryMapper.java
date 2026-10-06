package com.example.projectmanagement.mapper;

import com.example.projectmanagement.entity.TopicCategory;
import com.example.projectmanagement.dto.response.TopicCategoryResponse;
import com.example.projectmanagement.dto.request.CreateTopicCategoryRequest;

public final class TopicCategoryMapper {
    private TopicCategoryMapper() {}

    public static TopicCategory toEntity(CreateTopicCategoryRequest request, String normalizedCode) {
        TopicCategory category = TopicCategory.builder().build();
        updateEntity(category, request, normalizedCode);
        return category;
    }

    public static void updateEntity(TopicCategory category, CreateTopicCategoryRequest request, String normalizedCode) {
        category.setCode(normalizedCode);
        category.setName(request.name().trim());
        category.setDescription(request.description() == null || request.description().isBlank() ? null : request.description().trim());
        category.setActive(request.isActive());
    }

    public static TopicCategoryResponse toResponse(TopicCategory category) {
        return new TopicCategoryResponse(category.getId(), category.getCode(), category.getName(), category.getDescription(), category.isActive());
    }
}
