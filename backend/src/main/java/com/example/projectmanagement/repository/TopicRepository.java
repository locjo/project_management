package com.example.projectmanagement.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.projectmanagement.entity.Topic;
import com.example.projectmanagement.entity.TopicStatus;

public interface TopicRepository extends JpaRepository<Topic, Long> {
    List<Topic> findByGraduationTermIdAndActiveTrueOrderByCreatedAtDesc(Long graduationTermId);
    List<Topic> findByGraduationTermIdAndCategoryIdAndActiveTrueOrderByCreatedAtDesc(Long graduationTermId, Long categoryId);
    Optional<Topic> findByIdAndActiveTrue(Long id);
    List<Topic> findByGraduationTermIdAndStatusAndActiveTrueOrderByCreatedAtDesc(Long graduationTermId, TopicStatus status);
    List<Topic> findByGraduationTermIdAndCategoryIdAndStatusAndActiveTrueOrderByCreatedAtDesc(Long graduationTermId, Long categoryId, TopicStatus status);
    List<Topic> findByLecturerIdAndGraduationTermIdAndActiveTrueOrderByCreatedAtDesc(Long lecturerId, Long graduationTermId);
}
