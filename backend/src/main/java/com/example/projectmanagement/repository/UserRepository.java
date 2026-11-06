package com.example.projectmanagement.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.projectmanagement.entity.User;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    boolean existsByStudentPhoneAndIdNot(String phone, Long id);
    Optional<User> findFirstByRoleAndIsActiveTrueOrderByIdAsc(com.example.projectmanagement.entity.UserRole role);


    Optional<User> findByUsernameIgnoreCase(String username);

    Optional<User> findByEmailIgnoreCase(String email);

    boolean existsByUsernameIgnoreCase(String username);

    boolean existsByEmailIgnoreCase(String email);
}
