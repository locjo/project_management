package com.example.projectmanagement.repository;

import java.util.Optional;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.projectmanagement.entity.Student;

public interface StudentRepository extends JpaRepository<Student, Long> {
    boolean existsByStudentCodeIgnoreCaseAndIdNot(String studentCode, Long id);

    Optional<Student> findByUserId(Long userId);
    List<Student> findAllByOrderByIdDesc();
    boolean existsByStudentCodeIgnoreCase(String studentCode);
    boolean existsByPhone(String phone);
}
