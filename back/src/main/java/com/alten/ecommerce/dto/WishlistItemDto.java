package com.alten.ecommerce.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;

@Data
@Schema(description = "Représente un élément de la liste d'envies")
public class WishlistItemDto {
    @Schema(description = "Identifiant unique de l'élément de la liste d'envies", example = "1")
    private Long id;

    @Schema(description = "ID de l'utilisateur", example = "1")
    private Long userId;

    @Schema(description = "Informations du produit")
    private ProductDto product;

    @Schema(description = "Date de création (timestamp)", example = "1625097600000")
    private Long createdAt;
}
