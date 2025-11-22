package com.alten.ecommerce.repository;

import com.alten.ecommerce.model.CartItem;
import com.alten.ecommerce.model.User;
import com.alten.ecommerce.model.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CartItemRepository extends JpaRepository<CartItem, Long> {
    List<CartItem> findByUser(User user);
    Optional<CartItem> findByUserAndProduct(User user, Product product);
    void deleteByUserAndProduct(User user, Product product);
}
