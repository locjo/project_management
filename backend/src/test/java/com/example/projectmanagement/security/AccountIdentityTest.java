package com.example.projectmanagement.security;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;
import java.util.Optional;
import org.junit.jupiter.api.Test;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import com.example.projectmanagement.entity.User;
import com.example.projectmanagement.entity.UserRole;
import com.example.projectmanagement.repository.UserRepository;

class AccountIdentityTest {
    @Test void tokensStayBoundToAccountIdAfterRenameOrDeletion() {
        var users = mock(UserRepository.class);
        var service = new CustomUserDetailsService(users);
        var user = User.builder().id(1L).username("renamed").role(UserRole.LECTURER).isActive(true).build();
        when(users.findById(1L)).thenReturn(Optional.of(user));
        assertEquals("renamed", service.loadUserById(1L).getUsername());
        user.setActive(false);
        assertFalse(service.loadUserById(1L).isEnabled());
        when(users.findById(1L)).thenReturn(Optional.empty());
        assertThrows(UsernameNotFoundException.class, () -> service.loadUserById(1L));
        verify(users, never()).findByUsernameIgnoreCase(any());
    }
}
