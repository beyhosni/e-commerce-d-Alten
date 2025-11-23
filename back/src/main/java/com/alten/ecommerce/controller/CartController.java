package com.alten.ecommerce.controller;

import com.alten.ecommerce.dto.CartItemDto;
import com.alten.ecommerce.model.CartItem;
import com.alten.ecommerce.model.User;
import com.alten.ecommerce.service.CartService;
import com.alten.ecommerce.service.UserService;
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
@CrossOrigin(origins = {"http://localhost:80", "http://127.0.0.1:80", "http://localhost", "http://127.0.0.1"})
@RestController
@RequestMapping("/api/cart")
@SecurityRequirement(name = "bearerAuth")
public class CartController {

    @Autowired
    private CartService cartService;

    @Autowired
    private UserService userService;

    private CartItemDto convertToDto(CartItem cartItem) {
        CartItemDto cartItemDto = new CartItemDto();
        cartItemDto.setId(cartItem.getId());
        cartItemDto.setUserId(cartItem.getUser().getId());

        // Conversion du produit en DTO
        cartItemDto.setProduct(new com.alten.ecommerce.dto.ProductDto());
        cartItemDto.getProduct().setId(cartItem.getProduct().getId());
        cartItemDto.getProduct().setCode(cartItem.getProduct().getCode());
        cartItemDto.getProduct().setName(cartItem.getProduct().getName());
        cartItemDto.getProduct().setDescription(cartItem.getProduct().getDescription());
        cartItemDto.getProduct().setImage(cartItem.getProduct().getImage());
        cartItemDto.getProduct().setCategory(cartItem.getProduct().getCategory());
        cartItemDto.getProduct().setPrice(cartItem.getProduct().getPrice());
        cartItemDto.getProduct().setQuantity(cartItem.getProduct().getQuantity());
        cartItemDto.getProduct().setInternalReference(cartItem.getProduct().getInternalReference());
        cartItemDto.getProduct().setShellId(cartItem.getProduct().getShellId());
        cartItemDto.getProduct().setInventoryStatus(cartItem.getProduct().getInventoryStatus());
        cartItemDto.getProduct().setRating(cartItem.getProduct().getRating());
        cartItemDto.getProduct().setCreatedAt(cartItem.getProduct().getCreatedAt());
        cartItemDto.getProduct().setUpdatedAt(cartItem.getProduct().getUpdatedAt());

        cartItemDto.setQuantity(cartItem.getQuantity());
        cartItemDto.setCreatedAt(cartItem.getCreatedAt());
        cartItemDto.setUpdatedAt(cartItem.getUpdatedAt());

        return cartItemDto;
    }

    private User getCurrentUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String email = authentication.getName();
        return userService.getUserByEmail(email).orElseThrow(() -> new RuntimeException("Utilisateur non trouvé"));
    }

    @Operation(summary = "Récupérer le panier d'achat", description = "Retourne la liste des produits dans le panier de l'utilisateur connecté")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Panier récupéré avec succès",
                    content = @Content(mediaType = "application/json",
                            schema = @Schema(implementation = CartItemDto.class)))
    })
    @GetMapping
    public ResponseEntity<List<CartItemDto>> getCart() {
        User user = getCurrentUser();
        List<CartItem> cartItems = cartService.getCartByUser(user);
        List<CartItemDto> cartItemDtos = cartItems.stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
        return ResponseEntity.ok(cartItemDtos);
    }

    @Operation(summary = "Ajouter un produit au panier", description = "Ajoute un produit au panier de l'utilisateur connecté")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "201", description = "Produit ajouté au panier avec succès",
                    content = @Content(mediaType = "application/json",
                            schema = @Schema(implementation = CartItemDto.class))),
            @ApiResponse(responseCode = "400", description = "Produit non trouvé")
    })
    @PostMapping
    public ResponseEntity<CartItemDto> addToCart(
            @Parameter(description = "ID du produit à ajouter") @RequestParam Long productId,
            @Parameter(description = "Quantité à ajouter") @RequestParam Integer quantity) {
        try {
            User user = getCurrentUser();
            CartItem cartItem = cartService.addToCart(user, productId, quantity);
            return new ResponseEntity<>(convertToDto(cartItem), HttpStatus.CREATED);
        } catch (RuntimeException e) {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }
    }

    @Operation(summary = "Supprimer un produit du panier", description = "Supprime un produit du panier de l'utilisateur connecté")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "204", description = "Produit supprimé du panier avec succès"),
            @ApiResponse(responseCode = "400", description = "Produit non trouvé")
    })
    @DeleteMapping
    public ResponseEntity<Void> removeFromCart(
            @Parameter(description = "ID du produit à supprimer") @RequestParam Long productId) {
        try {
            User user = getCurrentUser();
            cartService.removeFromCart(user, productId);
            return ResponseEntity.noContent().build();
        } catch (RuntimeException e) {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }
    }

    @Operation(summary = "Mettre à jour la quantité d'un produit dans le panier", description = "Met à jour la quantité d'un produit dans le panier de l'utilisateur connecté")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Quantité mise à jour avec succès",
                    content = @Content(mediaType = "application/json",
                            schema = @Schema(implementation = CartItemDto.class))),
            @ApiResponse(responseCode = "400", description = "Produit non trouvé dans le panier")
    })
    @PutMapping
    public ResponseEntity<CartItemDto> updateCartItemQuantity(
            @Parameter(description = "ID du produit à mettre à jour") @RequestParam Long productId,
            @Parameter(description = "Nouvelle quantité") @RequestParam Integer quantity) {
        try {
            User user = getCurrentUser();
            CartItem cartItem = cartService.updateCartItemQuantity(user, productId, quantity);
            return ResponseEntity.ok(convertToDto(cartItem));
        } catch (RuntimeException e) {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }
    }
}
