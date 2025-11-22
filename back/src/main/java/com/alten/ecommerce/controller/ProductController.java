package com.alten.ecommerce.controller;

import com.alten.ecommerce.dto.ProductDto;
import com.alten.ecommerce.model.Product;
import com.alten.ecommerce.service.ProductService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/products")
@SecurityRequirement(name = "bearerAuth")
public class ProductController {

    @Autowired
    private ProductService productService;

    private ProductDto convertToDto(Product product) {
        ProductDto productDto = new ProductDto();
        productDto.setId(product.getId());
        productDto.setCode(product.getCode());
        productDto.setName(product.getName());
        productDto.setDescription(product.getDescription());
        productDto.setImage(product.getImage());
        productDto.setCategory(product.getCategory());
        productDto.setPrice(product.getPrice());
        productDto.setQuantity(product.getQuantity());
        productDto.setInternalReference(product.getInternalReference());
        productDto.setShellId(product.getShellId());
        productDto.setInventoryStatus(product.getInventoryStatus());
        productDto.setRating(product.getRating());
        productDto.setCreatedAt(product.getCreatedAt());
        productDto.setUpdatedAt(product.getUpdatedAt());
        return productDto;
    }

    private Product convertToEntity(ProductDto productDto) {
        Product product = new Product();
        product.setId(productDto.getId());
        product.setCode(productDto.getCode());
        product.setName(productDto.getName());
        product.setDescription(productDto.getDescription());
        product.setImage(productDto.getImage());
        product.setCategory(productDto.getCategory());
        product.setPrice(productDto.getPrice());
        product.setQuantity(productDto.getQuantity());
        product.setInternalReference(productDto.getInternalReference());
        product.setShellId(productDto.getShellId());
        product.setInventoryStatus(productDto.getInventoryStatus());
        product.setRating(productDto.getRating());
        product.setCreatedAt(productDto.getCreatedAt());
        product.setUpdatedAt(productDto.getUpdatedAt());
        return product;
    }

    @Operation(summary = "Récupérer tous les produits", description = "Retourne la liste de tous les produits disponibles")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Liste des produits récupérée avec succès",
                    content = @Content(mediaType = "application/json",
                            schema = @Schema(implementation = ProductDto.class)))
    })
    @GetMapping
    public ResponseEntity<List<ProductDto>> getAllProducts() {
        List<Product> products = productService.getAllProducts();
        List<ProductDto> productDtos = products.stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
        return ResponseEntity.ok(productDtos);
    }

    @Operation(summary = "Récupérer un produit par son ID", description = "Retourne un produit spécifique en fonction de son ID")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Produit trouvé",
                    content = @Content(mediaType = "application/json",
                            schema = @Schema(implementation = ProductDto.class))),
            @ApiResponse(responseCode = "404", description = "Produit non trouvé")
    })
    @GetMapping("/{id}")
    public ResponseEntity<ProductDto> getProductById(
            @Parameter(description = "ID du produit à récupérer") @PathVariable Long id) {
        Optional<Product> product = productService.getProductById(id);
        if (product.isPresent()) {
            return ResponseEntity.ok(convertToDto(product.get()));
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @Operation(summary = "Créer un nouveau produit", description = "Ajoute un nouveau produit à la base de données")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "201", description = "Produit créé avec succès",
                    content = @Content(mediaType = "application/json",
                            schema = @Schema(implementation = ProductDto.class))),
            @ApiResponse(responseCode = "403", description = "Accès refusé - seul admin@admin.com peut créer des produits")
    })
    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ProductDto> createProduct(
            @Parameter(description = "Produit à créer") @RequestBody ProductDto productDto) {
        Product product = convertToEntity(productDto);
        Product savedProduct = productService.saveProduct(product);
        return new ResponseEntity<>(convertToDto(savedProduct), HttpStatus.CREATED);
    }

    @Operation(summary = "Mettre à jour un produit", description = "Met à jour les informations d'un produit existant")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Produit mis à jour avec succès",
                    content = @Content(mediaType = "application/json",
                            schema = @Schema(implementation = ProductDto.class))),
            @ApiResponse(responseCode = "404", description = "Produit non trouvé"),
            @ApiResponse(responseCode = "403", description = "Accès refusé - seul admin@admin.com peut mettre à jour des produits")
    })
    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ProductDto> updateProduct(
            @Parameter(description = "ID du produit à mettre à jour") @PathVariable Long id,
            @Parameter(description = "Nouvelles informations du produit") @RequestBody ProductDto productDto) {
        Optional<Product> existingProduct = productService.getProductById(id);
        if (existingProduct.isPresent()) {
            Product product = convertToEntity(productDto);
            product.setId(id);
            Product updatedProduct = productService.saveProduct(product);
            return ResponseEntity.ok(convertToDto(updatedProduct));
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @Operation(summary = "Supprimer un produit", description = "Supprime un produit de la base de données")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "204", description = "Produit supprimé avec succès"),
            @ApiResponse(responseCode = "404", description = "Produit non trouvé"),
            @ApiResponse(responseCode = "403", description = "Accès refusé - seul admin@admin.com peut supprimer des produits")
    })
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deleteProduct(
            @Parameter(description = "ID du produit à supprimer") @PathVariable Long id) {
        Optional<Product> product = productService.getProductById(id);
        if (product.isPresent()) {
            productService.deleteProduct(id);
            return ResponseEntity.noContent().build();
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @Operation(summary = "Récupérer les produits par catégorie", description = "Retourne la liste des produits d'une catégorie spécifique")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Liste des produits de la catégorie récupérée avec succès",
                    content = @Content(mediaType = "application/json",
                            schema = @Schema(implementation = ProductDto.class)))
    })
    @GetMapping("/category/{category}")
    public ResponseEntity<List<ProductDto>> getProductsByCategory(
            @Parameter(description = "Catégorie des produits à récupérer") @PathVariable String category) {
        List<Product> products = productService.getProductsByCategory(category);
        List<ProductDto> productDtos = products.stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
        return ResponseEntity.ok(productDtos);
    }

    @Operation(summary = "Récupérer les produits par statut d'inventaire", description = "Retourne la liste des produits selon leur statut d'inventaire")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Liste des produits récupérée avec succès",
                    content = @Content(mediaType = "application/json",
                            schema = @Schema(implementation = ProductDto.class)))
    })
    @GetMapping("/status/{status}")
    public ResponseEntity<List<ProductDto>> getProductsByInventoryStatus(
            @Parameter(description = "Statut d'inventaire des produits à récupérer") @PathVariable Product.InventoryStatus status) {
        List<Product> products = productService.getProductsByInventoryStatus(status);
        List<ProductDto> productDtos = products.stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
        return ResponseEntity.ok(productDtos);
    }
}
