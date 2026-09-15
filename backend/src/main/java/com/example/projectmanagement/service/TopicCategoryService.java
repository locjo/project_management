package com.example.projectmanagement.service;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.projectmanagement.dto.request.CreateTopicCategoryRequest;
import com.example.projectmanagement.dto.response.TopicCategoryResponse;
import com.example.projectmanagement.entity.TopicCategory;
import com.example.projectmanagement.exception.AppException;
import com.example.projectmanagement.repository.TopicCategoryRepository;

@Service
public class TopicCategoryService {
    private final TopicCategoryRepository repository;

    public TopicCategoryService(TopicCategoryRepository repository) {
        this.repository = repository;
    }

    @Transactional(readOnly = true)
    public List<TopicCategoryResponse> getAll(boolean activeOnly) {
        List<TopicCategory> categories = activeOnly ? repository.findByIsActiveTrueOrderByNameAsc() : repository.findAll();
        return categories.stream().map(this::toResponse).toList();
    }

    @Transactional
    public TopicCategoryResponse create(CreateTopicCategoryRequest request) {
        String code = request.code().trim().toUpperCase();
        repository.findByCodeIgnoreCase(code).ifPresent(existing -> {
            throw new AppException("Mã lĩnh vực đã tồn tại", HttpStatus.BAD_REQUEST);
        });
        return toResponse(repository.save(TopicCategory.builder()
                .code(code).name(request.name().trim()).description(trimToNull(request.description()))
                .isActive(request.isActive()).build()));
    }

    @Transactional
    public TopicCategoryResponse update(Long id, CreateTopicCategoryRequest request) {
        TopicCategory category = getEntity(id);
        String code = request.code().trim().toUpperCase();
        repository.findByCodeIgnoreCase(code).ifPresent(existing -> {
            if (!existing.getId().equals(id)) throw new AppException("Mã lĩnh vực đã tồn tại", HttpStatus.BAD_REQUEST);
        });
        category.setCode(code);
        category.setName(request.name().trim());
        category.setDescription(trimToNull(request.description()));
        category.setActive(request.isActive());
        return toResponse(repository.save(category));
    }

    @Transactional
    public void delete(Long id) {
        repository.delete(getEntity(id));
    }

    public TopicCategory getEntity(Long id) {
        return repository.findById(id).orElseThrow(() -> new AppException("Không tìm thấy lĩnh vực đề tài", HttpStatus.NOT_FOUND));
    }

    private TopicCategoryResponse toResponse(TopicCategory category) {
        return new TopicCategoryResponse(category.getId(), category.getCode(), category.getName(), category.getDescription(), category.isActive());
    }

    private String trimToNull(String value) {
        return value == null || value.isBlank() ? null : value.trim();
    }
}
