package com.alten.ecommerce.service;

import com.alten.ecommerce.model.User;
import com.alten.ecommerce.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class UserServiceTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private PasswordEncoder passwordEncoder;

    @InjectMocks
    private UserService userService;

    private User testUser;

    @BeforeEach
    void setUp() {
        testUser = new User();
        testUser.setId(1L);
        testUser.setUsername("testuser");
        testUser.setFirstname("Test");
        testUser.setEmail("test@example.com");
        testUser.setPassword("encodedPassword");
    }

    @Test
    void testCreateUserSuccess() {
        // Given
        String rawPassword = "password123";
        String encodedPassword = "encodedPassword";

        User newUser = new User();
        newUser.setUsername("newuser");
        newUser.setFirstname("New");
        newUser.setEmail("newuser@example.com");
        newUser.setPassword(rawPassword);

        when(userRepository.existsByEmail(anyString())).thenReturn(false);
        when(passwordEncoder.encode(anyString())).thenReturn(encodedPassword);
        when(userRepository.save(any(User.class))).thenReturn(testUser);

        // When
        User createdUser = userService.createUser(newUser);

        // Then
        assertNotNull(createdUser);
        assertEquals(testUser.getId(), createdUser.getId());
        assertEquals(testUser.getUsername(), createdUser.getUsername());
        assertEquals(testUser.getFirstname(), createdUser.getFirstname());
        assertEquals(testUser.getEmail(), createdUser.getEmail());
        assertEquals(encodedPassword, createdUser.getPassword());

        verify(userRepository).existsByEmail("newuser@example.com");
        verify(passwordEncoder).encode(rawPassword);
        verify(userRepository).save(any(User.class));
    }

    @Test
    void testCreateUserWithExistingEmail() {
        // Given
        User newUser = new User();
        newUser.setEmail("existing@example.com");

        when(userRepository.existsByEmail(anyString())).thenReturn(true);

        // When & Then
        RuntimeException exception = assertThrows(RuntimeException.class, () -> {
            userService.createUser(newUser);
        });

        assertEquals("Email déjà utilisé", exception.getMessage());
        verify(userRepository).existsByEmail("existing@example.com");
        verify(passwordEncoder, never()).encode(anyString());
        verify(userRepository, never()).save(any(User.class));
    }

    @Test
    void testGetUserByEmailSuccess() {
        // Given
        when(userRepository.findByEmail(anyString())).thenReturn(Optional.of(testUser));

        // When
        Optional<User> result = userService.getUserByEmail("test@example.com");

        // Then
        assertTrue(result.isPresent());
        assertEquals(testUser, result.get());
        verify(userRepository).findByEmail("test@example.com");
    }

    @Test
    void testGetUserByEmailNotFound() {
        // Given
        when(userRepository.findByEmail(anyString())).thenReturn(Optional.empty());

        // When
        Optional<User> result = userService.getUserByEmail("nonexistent@example.com");

        // Then
        assertFalse(result.isPresent());
        verify(userRepository).findByEmail("nonexistent@example.com");
    }

    @Test
    void testAuthenticateSuccess() {
        // Given
        String rawPassword = "password123";
        String encodedPassword = "encodedPassword";

        testUser.setPassword(encodedPassword);

        when(userRepository.findByEmail(anyString())).thenReturn(Optional.of(testUser));
        when(passwordEncoder.matches(anyString(), anyString())).thenReturn(true);

        // When
        Optional<User> result = userService.authenticate("test@example.com", rawPassword);

        // Then
        assertTrue(result.isPresent());
        assertEquals(testUser, result.get());
        verify(userRepository).findByEmail("test@example.com");
        verify(passwordEncoder).matches(rawPassword, encodedPassword);
    }

    @Test
    void testAuthenticateWithWrongPassword() {
        // Given
        String rawPassword = "wrongPassword";
        String encodedPassword = "encodedPassword";

        testUser.setPassword(encodedPassword);

        when(userRepository.findByEmail(anyString())).thenReturn(Optional.of(testUser));
        when(passwordEncoder.matches(anyString(), anyString())).thenReturn(false);

        // When
        Optional<User> result = userService.authenticate("test@example.com", rawPassword);

        // Then
        assertFalse(result.isPresent());
        verify(userRepository).findByEmail("test@example.com");
        verify(passwordEncoder).matches(rawPassword, encodedPassword);
    }

    @Test
    void testAuthenticateWithNonExistentEmail() {
        // Given
        when(userRepository.findByEmail(anyString())).thenReturn(Optional.empty());

        // When
        Optional<User> result = userService.authenticate("nonexistent@example.com", "password");

        // Then
        assertFalse(result.isPresent());
        verify(userRepository).findByEmail("nonexistent@example.com");
        verify(passwordEncoder, never()).matches(anyString(), anyString());
    }
}
