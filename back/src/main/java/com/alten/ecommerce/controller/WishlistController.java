package com.alten.ecommerce.controller;

import com.alten.ecommerce.dto.WishlistItemDto;
import com.alten.ecommerce.model.User;
import com.alten.ecommerce.model.WishlistItem;
import com.alten.ecommerce.service.UserService;
import com.alten.ecommerce.service.WishlistService;
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
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/wishlist")
@SecurityRequirement(name = "bearerAuth")
public class WishlistController {

    @Autowired
    private WishlistService wishlistService;

    @Autowired
    private UserService userService;

    private WishlistItemDto convertToDto(WishlistItem wishlistItem) {
        WishlistItemDto wishlistItemDto = new WishlistItemDto();
        wishlistItemDto.setId(wishlistItem.getId());
        wishlistItemDto.setUserId(wishlistItem.getUser().getId());

        // Conversion du produit en DTO
        wishlistItemDto.setProduct(new com.alten.ecommerce.dto.ProductDto());
        wishlistItemDto.getProduct().setId(wishlistItem.getProduct().getId());
        wishlistItemDto.getProduct().setCode(wishlistItem.getProduct().getCode());
        wishlistItemDto.getProduct().setName(wishlistItem.getProduct().getName());
        wishlistItemDto.getProduct().setDescription(wishlistItem.getProduct().getDescription());
        wishlistItemDto.getProduct().setImage(wishlistItem.getProduct().getImage());
        wishlistItemDto.getProduct().setCategory(wishlistItem.getProduct().getCategory());
        wishlistItemDto.getProduct().setPrice(wishlistItem.getProduct().getPrice());
        wishlistItemDto.getProduct().setQuantity(wishlistItem.getProduct().getQuantity());
        wishlistItemDto.getProduct().setInternalReference(wishlistItem.getProduct().getInternalReference());
        wishlistItemDto.getProduct().setShellId(wishlistItem.getProduct().getShellId());
        wishlistItemDto.getProduct().setInventoryStatus(wishlistItem.getProduct().getInventoryStatus());
        wishlistItemDto.getProduct().setRating(wishlistItem.getProduct().getRating());
        wishlistItemDto.getProduct().setCreatedAt(wishlistItem.getProduct().getCreatedAt());
        wishlistItemDto.getProduct().setUpdatedAt(wishlistItem.getProduct().getUpdatedAt());

        wishlistItemDto.setCreatedAt(wishlistItem.getCreatedAt());

        return wishlistItemDto;
    }

    private User getCurrentUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String email = authentication.getName();
        return userService.getUserByEmail(email).orElseThrow(() -> new RuntimeException("Utilisateur non trouvé"));
    }

    @Operation(summary = "Récupérer la liste d'envies", description = "Retourne la liste des produits dans la liste d'envies de l'utilisateur connecté")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Liste d'envies récupérée avec succès",
                    content = @Content(mediaType = "application/json",
                            schema = @Schema(implementation = WishlistItemDto.class)))
    })
    @GetMapping
    public ResponseEntity<List<WishlistItemDto>> getWishlist() {
        User user = getCurrentUser();
        List<WishlistItem> wishlistItems = wishlistService.getWishlistByUser(user);
        List<WishlistItemDto> wishlistItemDtos = wishlistItems.stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
        return ResponseEntity.ok(wishlistItemDtos);
    }

    @Operation(summary = "Ajouter un produit à la liste d'envies", description = "Ajoute un produit à la liste d'envies de l'utilisateur connecté")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "201", description = "Produit ajouté à la liste d'envies avec succès",
                    content = @Content(mediaType = "application/json",
                            schema = @Schema(implementation = WishlistItemDto.class))),
            @ApiResponse(responseCode = "400", description = "Produit non trouvé ou déjà dans la liste d'envies")
    })
    @PostMapping
    public ResponseEntity<WishlistItemDto> addToWishlist(
            @Parameter(description = "ID du produit à ajouter") @RequestParam Long productId) {
        try {
            User user = getCurrentUser();
            WishlistItem wishlistItem = wishlistService.addToWishlist(user, productId);
            return new ResponseEntity<>(convertToDto(wishlistItem), HttpStatus.CREATED);
        } catch (RuntimeException e) {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }
    }

    @Operation(summary = "Supprimer un produit de la liste d'envies", description = "Supprime un produit de la liste d'envies de l'utilisateur connecté")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "204", description = "Produit supprimé de la liste d'envies avec succès"),
            @ApiResponse(responseCode = "400", description = "Produit non trouvé")
    })
    @DeleteMapping
    public ResponseEntity<Void> removeFromWishlist(
            @Parameter(description = "ID du produit à supprimer") @RequestParam Long productId) {
        try {
            User user = getCurrentUser();
            wishlistService.removeFromWishlist(user, productId);
            return ResponseEntity.noContent().build();
        } catch (RuntimeException e) {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }
    }
}
