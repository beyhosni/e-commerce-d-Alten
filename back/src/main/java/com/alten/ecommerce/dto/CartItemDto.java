package com.alten.ecommerce.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;

@Data
@Schema(description = "Représente un élément du panier d'achat")
public class CartItemDto {
    @Schema(description = "Identifiant unique de l'élément du panier", example = "1")
    private Long id;

    @Schema(description = "ID de l'utilisateur", example = "1")
    private Long userId;

    @Schema(description = "Informations du produit")
    private ProductDto product;

    @Schema(description = "Quantité", example = "2")
    private Integer quantity;

    @Schema(description = "Date de création (timestamp)", example = "1625097600000")
    private Long createdAt;

    @Schema(description = "Date de mise à jour (timestamp)", example = "1625184000000")
    private Long updatedAt;
}
