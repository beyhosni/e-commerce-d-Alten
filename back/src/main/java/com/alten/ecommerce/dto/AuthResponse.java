package com.alten.ecommerce.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;

@Data
@Schema(description = "Réponse d'authentification")
public class AuthResponse {
    @Schema(description = "Token JWT", example = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...")
    private String token;

    @Schema(description = "Type de token", example = "Bearer")
    private String type = "Bearer";

    @Schema(description = "ID de l'utilisateur", example = "1")
    private Long id;

    @Schema(description = "Email de l'utilisateur", example = "user@example.com")
    private String email;

    @Schema(description = "Nom d'utilisateur", example = "johndoe")
    private String username;

    @Schema(description = "Prénom de l'utilisateur", example = "John")
    private String firstname;
}
