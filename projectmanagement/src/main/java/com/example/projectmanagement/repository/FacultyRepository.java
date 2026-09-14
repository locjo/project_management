package com.example.projectmanagement.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.projectmanagement.entity.Faculty;

public interface FacultyRepository extends JpaRepository<Faculty, Long> {
}
