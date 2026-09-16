package com.example.projectmanagement.repository;

import java.util.Optional;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.EntityGraph;

import com.example.projectmanagement.entity.Lecturer;

public interface LecturerRepository extends JpaRepository<Lecturer, Long> {

    @EntityGraph(attributePaths = "user")
    List<Lecturer> findAllByOrderByIdAsc();

    Optional<Lecturer> findByUserId(Long userId);
}
