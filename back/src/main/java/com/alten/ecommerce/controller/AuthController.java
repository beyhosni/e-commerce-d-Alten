package com.alten.ecommerce.controller;

import com.alten.ecommerce.dto.AuthRequest;
import com.alten.ecommerce.dto.AuthResponse;
import com.alten.ecommerce.dto.RegisterRequest;
import com.alten.ecommerce.model.User;
import com.alten.ecommerce.service.JwtService;
import com.alten.ecommerce.service.UserService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api")
public class AuthController {

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private UserService userService;

    @Autowired
    private JwtService jwtService;

    @Operation(summary = "Créer un compte utilisateur", description = "Crée un nouveau compte utilisateur avec les informations fournies")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "201", description = "Compte créé avec succès",
                    content = @Content(mediaType = "application/json",
                            schema = @Schema(implementation = AuthResponse.class))),
            @ApiResponse(responseCode = "400", description = "Données invalides ou email déjà utilisé")
    })
    @PostMapping("/account")
    public ResponseEntity<AuthResponse> register(@Valid @RequestBody RegisterRequest registerRequest) {
        try {
            User user = new User();
            user.setUsername(registerRequest.getUsername());
            user.setFirstname(registerRequest.getFirstname());
            user.setEmail(registerRequest.getEmail());
            user.setPassword(registerRequest.getPassword());

            User createdUser = userService.createUser(user);

            String token = jwtService.generateToken(createdUser.getEmail());

            AuthResponse response = new AuthResponse();
            response.setToken(token);
            response.setId(createdUser.getId());
            response.setEmail(createdUser.getEmail());
            response.setUsername(createdUser.getUsername());
            response.setFirstname(createdUser.getFirstname());

            return new ResponseEntity<>(response, HttpStatus.CREATED);
        } catch (RuntimeException e) {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }
    }

    @Operation(summary = "Se connecter", description = "Authentifie un utilisateur et retourne un token JWT")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Authentification réussie",
                    content = @Content(mediaType = "application/json",
                            schema = @Schema(implementation = AuthResponse.class))),
            @ApiResponse(responseCode = "401", description = "Identifiants invalides")
    })
    @PostMapping("/token")
    public ResponseEntity<AuthResponse> authenticate(@Valid @RequestBody AuthRequest authRequest) {
        try {
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(authRequest.getEmail(), authRequest.getPassword())
            );

            SecurityContextHolder.getContext().setAuthentication(authentication);

            User user = userService.getUserByEmail(authRequest.getEmail()).orElseThrow();

            String token = jwtService.generateToken(user.getEmail());

            AuthResponse response = new AuthResponse();
            response.setToken(token);
            response.setId(user.getId());
            response.setEmail(user.getEmail());
            response.setUsername(user.getUsername());
            response.setFirstname(user.getFirstname());

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);
        }
    }
}
