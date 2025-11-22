package com.alten.ecommerce.controller;

import com.alten.ecommerce.dto.AuthRequest;
import com.alten.ecommerce.dto.AuthResponse;
import com.alten.ecommerce.dto.RegisterRequest;
import com.alten.ecommerce.model.User;
import com.alten.ecommerce.repository.UserRepository;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureWebMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import org.springframework.web.context.WebApplicationContext;

import static org.junit.jupiter.api.Assertions.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureWebMvc
@ActiveProfiles("test")
class AuthControllerIntegrationTest {

    @Autowired
    private WebApplicationContext webApplicationContext;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    private MockMvc mockMvc;

    private ObjectMapper objectMapper = new ObjectMapper();

    @BeforeEach
    void setUp() {
        mockMvc = MockMvcBuilders.webAppContextSetup(webApplicationContext).build();
        userRepository.deleteAll(); // Nettoyer la base de données avant chaque test
    }

    @AfterEach
    void tearDown() {
        userRepository.deleteAll(); // Nettoyer la base de données après chaque test
    }

    @Test
    void testRegisterSuccess() throws Exception {
        // Given
        RegisterRequest registerRequest = new RegisterRequest();
        registerRequest.setUsername("newuser");
        registerRequest.setFirstname("New");
        registerRequest.setEmail("newuser@example.com");
        registerRequest.setPassword("password123");

        // When & Then
        mockMvc.perform(post("/api/account")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(registerRequest)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.token").exists())
                .andExpect(jsonPath("$.id").exists())
                .andExpect(jsonPath("$.email").value("newuser@example.com"))
                .andExpect(jsonPath("$.username").value("newuser"))
                .andExpect(jsonPath("$.firstname").value("New"));

        // Vérifier que l'utilisateur a été créé dans la base de données
        User user = userRepository.findByEmail("newuser@example.com").orElse(null);
        assertNotNull(user);
        assertEquals("newuser", user.getUsername());
        assertEquals("New", user.getFirstname());
        assertTrue(passwordEncoder.matches("password123", user.getPassword()));
    }

    @Test
    void testRegisterWithExistingEmail() throws Exception {
        // Given
        // Créer un utilisateur existant
        User existingUser = new User();
        existingUser.setUsername("existinguser");
        existingUser.setFirstname("Existing");
        existingUser.setEmail("existing@example.com");
        existingUser.setPassword(passwordEncoder.encode("password"));
        userRepository.save(existingUser);

        // Créer une demande d'inscription avec le même email
        RegisterRequest registerRequest = new RegisterRequest();
        registerRequest.setUsername("newuser");
        registerRequest.setFirstname("New");
        registerRequest.setEmail("existing@example.com"); // Email déjà utilisé
        registerRequest.setPassword("password123");

        // When & Then
        mockMvc.perform(post("/api/account")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(registerRequest)))
                .andExpect(status().isBadRequest());
    }

    @Test
    void testAuthenticateSuccess() throws Exception {
        // Given
        // Créer un utilisateur pour l'authentification
        User user = new User();
        user.setUsername("testuser");
        user.setFirstname("Test");
        user.setEmail("test@example.com");
        user.setPassword(passwordEncoder.encode("password123"));
        userRepository.save(user);

        AuthRequest authRequest = new AuthRequest();
        authRequest.setEmail("test@example.com");
        authRequest.setPassword("password123");

        // When & Then
        mockMvc.perform(post("/api/token")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(authRequest)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.token").exists())
                .andExpect(jsonPath("$.id").exists())
                .andExpect(jsonPath("$.email").value("test@example.com"))
                .andExpect(jsonPath("$.username").value("testuser"))
                .andExpect(jsonPath("$.firstname").value("Test"));
    }

    @Test
    void testAuthenticateWithWrongPassword() throws Exception {
        // Given
        // Créer un utilisateur pour l'authentification
        User user = new User();
        user.setUsername("testuser");
        user.setFirstname("Test");
        user.setEmail("test@example.com");
        user.setPassword(passwordEncoder.encode("password123"));
        userRepository.save(user);

        AuthRequest authRequest = new AuthRequest();
        authRequest.setEmail("test@example.com");
        authRequest.setPassword("wrongpassword"); // Mot de passe incorrect

        // When & Then
        mockMvc.perform(post("/api/token")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(authRequest)))
                .andExpect(status().isUnauthorized());
    }

    @Test
    void testAuthenticateWithNonExistentEmail() throws Exception {
        // Given
        AuthRequest authRequest = new AuthRequest();
        authRequest.setEmail("nonexistent@example.com");
        authRequest.setPassword("password123");

        // When & Then
        mockMvc.perform(post("/api/token")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(authRequest)))
                .andExpect(status().isUnauthorized());
    }
}
