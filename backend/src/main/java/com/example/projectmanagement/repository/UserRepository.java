package com.example.projectmanagement.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.example.projectmanagement.entity.User;
import com.example.projectmanagement.entity.UserRole;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    boolean existsByStudentPhoneAndIdNot(String phone, Long id);
    Optional<User> findFirstByRoleAndIsActiveTrueOrderByIdAsc(com.example.projectmanagement.entity.UserRole role);

    @Query("select u from User u join u.student where u.role = :role and u.isActive = true order by u.id")
    List<User> findActiveStudentsWithProfile(@Param("role") UserRole role, Pageable limit);

    @Query("select u from User u join u.lecturer where u.role = :role and u.isActive = true order by u.id")
    List<User> findActiveLecturersWithProfile(@Param("role") UserRole role, Pageable limit);


    Optional<User> findByUsernameIgnoreCase(String username);

    Optional<User> findByEmailIgnoreCase(String email);

    boolean existsByUsernameIgnoreCase(String username);

    boolean existsByEmailIgnoreCase(String email);
}
