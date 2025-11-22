package com.alten.ecommerce.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;

@Data
@Schema(description = "Représente un utilisateur")
public class UserDto {
    @Schema(description = "Identifiant unique de l'utilisateur", example = "1")
    private Long id;

    @Schema(description = "Nom d'utilisateur", example = "johndoe")
    private String username;

    @Schema(description = "Prénom de l'utilisateur", example = "John")
    private String firstname;

    @Schema(description = "Email de l'utilisateur", example = "john.doe@example.com")
    private String email;

    @Schema(description = "Date de création (timestamp)", example = "1625097600000")
    private Long createdAt;

    @Schema(description = "Date de mise à jour (timestamp)", example = "1625184000000")
    private Long updatedAt;
}
