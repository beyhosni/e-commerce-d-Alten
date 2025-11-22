package com.alten.ecommerce.repository;

import com.alten.ecommerce.model.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProductRepository extends JpaRepository<Product, Long> {
    Product findByCode(String code);
    List<Product> findByCategory(String category);
    List<Product> findByInventoryStatus(Product.InventoryStatus inventoryStatus);
}
