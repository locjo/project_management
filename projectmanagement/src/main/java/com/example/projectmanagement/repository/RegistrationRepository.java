package com.example.projectmanagement.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.projectmanagement.entity.Registration;
import com.example.projectmanagement.entity.RegistrationStatus;
import com.example.projectmanagement.entity.Student;

public interface RegistrationRepository extends JpaRepository<Registration, Long> {

    List<Registration> findByStudentOrderByIdDesc(Student student);

    List<Registration> findByLecturerIdOrderByIdDesc(Long lecturerId);

    List<Registration> findByLecturerIdAndStatusOrderByIdDesc(Long lecturerId, RegistrationStatus status);

    long countByLecturerIdAndStatus(Long lecturerId, RegistrationStatus status);

    boolean existsByGraduationTermId(Long graduationTermId);
}
