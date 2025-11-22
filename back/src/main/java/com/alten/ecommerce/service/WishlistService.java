package com.alten.ecommerce.service;

import com.alten.ecommerce.model.Product;
import com.alten.ecommerce.model.User;
import com.alten.ecommerce.model.WishlistItem;
import com.alten.ecommerce.repository.WishlistItemRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class WishlistService {

    @Autowired
    private WishlistItemRepository wishlistItemRepository;

    @Autowired
    private ProductService productService;

    public List<WishlistItem> getWishlistByUser(User user) {
        return wishlistItemRepository.findByUser(user);
    }

    public WishlistItem addToWishlist(User user, Long productId) {
        Optional<Product> productOpt = productService.getProductById(productId);

        if (!productOpt.isPresent()) {
            throw new RuntimeException("Produit non trouvé");
        }

        Product product = productOpt.get();

        // Vérifier si le produit est déjà dans la liste d'envies
        Optional<WishlistItem> existingItem = wishlistItemRepository.findByUserAndProduct(user, product);

        if (existingItem.isPresent()) {
            throw new RuntimeException("Produit déjà dans la liste d'envies");
        } else {
            WishlistItem newItem = new WishlistItem();
            newItem.setUser(user);
            newItem.setProduct(product);
            return wishlistItemRepository.save(newItem);
        }
    }

    public void removeFromWishlist(User user, Long productId) {
        Optional<Product> productOpt = productService.getProductById(productId);

        if (!productOpt.isPresent()) {
            throw new RuntimeException("Produit non trouvé");
        }

        Product product = productOpt.get();
        wishlistItemRepository.deleteByUserAndProduct(user, product);
    }
}
