package com.example.projectmanagement.dto.request;

import com.example.projectmanagement.entity.TopicStatus;
import jakarta.validation.constraints.NotNull;

public record ReviewTopicRequest(@NotNull TopicStatus status) {
}
