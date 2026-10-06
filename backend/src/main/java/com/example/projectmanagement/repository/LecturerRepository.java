package com.example.projectmanagement.repository;

import java.util.Optional;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import jakarta.persistence.LockModeType;

import com.example.projectmanagement.entity.Lecturer;

public interface LecturerRepository extends JpaRepository<Lecturer, Long> {

    @EntityGraph(attributePaths = "user")
    List<Lecturer> findAllByOrderByIdAsc();

    Optional<Lecturer> findByUserId(Long userId);

    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("select l from Lecturer l where l.id = :id")
    Optional<Lecturer> findByIdForUpdate(@Param("id") Long id);
}
