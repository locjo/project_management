package com.example.projectmanagement;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.data.domain.PageRequest;

import com.example.projectmanagement.entity.UserRole;
import com.example.projectmanagement.repository.UserRepository;

import static org.junit.jupiter.api.Assertions.assertTrue;

@SpringBootTest
class ProjectManagementApplicationTests {
	@Autowired UserRepository users;

	@Test
	void contextLoads() {
	}

	@Test
	void quickLoginProfileQueriesRunAgainstDatabase() {
		assertTrue(users.findActiveStudentsWithProfile(UserRole.STUDENT, PageRequest.of(0, 1)).size() <= 1);
		assertTrue(users.findActiveLecturersWithProfile(UserRole.LECTURER, PageRequest.of(0, 1)).size() <= 1);
	}

}
