package com.example.projectmanagement.mapper;

import com.example.projectmanagement.entity.Topic;
import com.example.projectmanagement.dto.response.TopicResponse;

public final class TopicMapper {
    private TopicMapper() {}

    public static TopicResponse toResponse(Topic topic) {
        return new TopicResponse(topic.getId(), topic.getLecturer().getId(), topic.getLecturer().getUser().getUsername(),
                topic.getGraduationTerm().getId(), topic.getCategory().getId(), topic.getCategory().getName(), topic.getTitle(),
                topic.getDescription(), topic.isActive(), topic.getCreatedAt(), topic.getStatus().name());
    }
}
