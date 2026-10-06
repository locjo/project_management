package com.example.projectmanagement.service;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.projectmanagement.dto.request.CreateTopicCategoryRequest;
import com.example.projectmanagement.dto.response.TopicCategoryResponse;
import com.example.projectmanagement.entity.TopicCategory;
import com.example.projectmanagement.exception.AppException;
import com.example.projectmanagement.mapper.TopicCategoryMapper;
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
        return categories.stream().map(TopicCategoryMapper::toResponse).toList();
    }

    @Transactional
    public TopicCategoryResponse create(CreateTopicCategoryRequest request) {
        String code = request.code().trim().toUpperCase();
        repository.findByCodeIgnoreCase(code).ifPresent(existing -> {
            throw new AppException("Mã lĩnh vực đã tồn tại", HttpStatus.BAD_REQUEST);
        });
        return TopicCategoryMapper.toResponse(repository.save(TopicCategoryMapper.toEntity(request, code)));
    }

    @Transactional
    public TopicCategoryResponse update(Long id, CreateTopicCategoryRequest request) {
        TopicCategory category = getEntity(id);
        String code = request.code().trim().toUpperCase();
        repository.findByCodeIgnoreCase(code).ifPresent(existing -> {
            if (!existing.getId().equals(id)) throw new AppException("Mã lĩnh vực đã tồn tại", HttpStatus.BAD_REQUEST);
        });
        TopicCategoryMapper.updateEntity(category, request, code);
        return TopicCategoryMapper.toResponse(repository.save(category));
    }

    @Transactional
    public void delete(Long id) {
        repository.delete(getEntity(id));
    }

    public TopicCategory getEntity(Long id) {
        return repository.findById(id).orElseThrow(() -> new AppException("Không tìm thấy lĩnh vực đề tài", HttpStatus.NOT_FOUND));
    }
}
