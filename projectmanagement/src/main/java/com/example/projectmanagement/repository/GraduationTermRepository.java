package com.example.projectmanagement.repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.projectmanagement.entity.GraduationTerm;

public interface GraduationTermRepository extends JpaRepository<GraduationTerm, Long> {

    Optional<GraduationTerm> findByCodeIgnoreCase(String code);

    List<GraduationTerm> findAllByOrderByStartDateDesc();

    List<GraduationTerm> findByIsActiveTrueOrderByStartDateDesc();

    List<GraduationTerm> findByIsActiveTrueAndEndDateBefore(LocalDateTime now);
}
