package com.example.projectmanagement.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.projectmanagement.entity.TopicCategory;

public interface TopicCategoryRepository extends JpaRepository<TopicCategory, Long> {
    Optional<TopicCategory> findByCodeIgnoreCase(String code);
    List<TopicCategory> findByIsActiveTrueOrderByNameAsc();
}
