package com.alten.ecommerce.repository;

import com.alten.ecommerce.model.WishlistItem;
import com.alten.ecommerce.model.User;
import com.alten.ecommerce.model.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface WishlistItemRepository extends JpaRepository<WishlistItem, Long> {
    List<WishlistItem> findByUser(User user);
    Optional<WishlistItem> findByUserAndProduct(User user, Product product);
    void deleteByUserAndProduct(User user, Product product);
}
