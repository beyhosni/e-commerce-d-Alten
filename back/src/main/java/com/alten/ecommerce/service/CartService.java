package com.alten.ecommerce.service;

import com.alten.ecommerce.model.CartItem;
import com.alten.ecommerce.model.Product;
import com.alten.ecommerce.model.User;
import com.alten.ecommerce.repository.CartItemRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class CartService {

    @Autowired
    private CartItemRepository cartItemRepository;

    @Autowired
    private ProductService productService;

    public List<CartItem> getCartByUser(User user) {
        return cartItemRepository.findByUser(user);
    }

    public CartItem addToCart(User user, Long productId, Integer quantity) {
        Optional<Product> productOpt = productService.getProductById(productId);

        if (!productOpt.isPresent()) {
            throw new RuntimeException("Produit non trouvé");
        }

        Product product = productOpt.get();

        // Vérifier si le produit est déjà dans le panier
        Optional<CartItem> existingItem = cartItemRepository.findByUserAndProduct(user, product);

        if (existingItem.isPresent()) {
            CartItem item = existingItem.get();
            item.setQuantity(item.getQuantity() + quantity);
            return cartItemRepository.save(item);
        } else {
            CartItem newItem = new CartItem();
            newItem.setUser(user);
            newItem.setProduct(product);
            newItem.setQuantity(quantity);
            return cartItemRepository.save(newItem);
        }
    }

    public void removeFromCart(User user, Long productId) {
        Optional<Product> productOpt = productService.getProductById(productId);

        if (!productOpt.isPresent()) {
            throw new RuntimeException("Produit non trouvé");
        }

        Product product = productOpt.get();
        cartItemRepository.deleteByUserAndProduct(user, product);
    }

    public CartItem updateCartItemQuantity(User user, Long productId, Integer quantity) {
        Optional<Product> productOpt = productService.getProductById(productId);

        if (!productOpt.isPresent()) {
            throw new RuntimeException("Produit non trouvé");
        }

        Product product = productOpt.get();
        Optional<CartItem> itemOpt = cartItemRepository.findByUserAndProduct(user, product);

        if (!itemOpt.isPresent()) {
            throw new RuntimeException("Produit non trouvé dans le panier");
        }

        CartItem item = itemOpt.get();
        item.setQuantity(quantity);
        return cartItemRepository.save(item);
    }
}
