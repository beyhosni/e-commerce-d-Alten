package com.alten.ecommerce.dto;

import com.alten.ecommerce.model.Product;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;

@Data
@Schema(description = "Représente un produit")
public class ProductDto {
    @Schema(description = "Identifiant unique du produit", example = "1")
    private Long id;

    @Schema(description = "Code du produit", example = "PROD001")
    private String code;

    @Schema(description = "Nom du produit", example = "Smartphone X")
    private String name;

    @Schema(description = "Description du produit", example = "Un smartphone dernière génération")
    private String description;

    @Schema(description = "URL de l'image du produit", example = "https://example.com/image.jpg")
    private String image;

    @Schema(description = "Catégorie du produit", example = "Électronique")
    private String category;

    @Schema(description = "Prix du produit", example = "699.99")
    private Double price;

    @Schema(description = "Quantité en stock", example = "50")
    private Integer quantity;

    @Schema(description = "Référence interne", example = "REF-12345")
    private String internalReference;

    @Schema(description = "ID du coque", example = "5")
    private Integer shellId;

    @Schema(description = "Statut du stock", example = "INSTOCK")
    private Product.InventoryStatus inventoryStatus;

    @Schema(description = "Note du produit", example = "4")
    private Integer rating;

    @Schema(description = "Date de création (timestamp)", example = "1625097600000")
    private Long createdAt;

    @Schema(description = "Date de mise à jour (timestamp)", example = "1625184000000")
    private Long updatedAt;
}
