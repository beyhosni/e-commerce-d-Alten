package com.alten.ecommerce.service;

import com.alten.ecommerce.model.Product;
import com.alten.ecommerce.repository.ProductRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyLong;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class ProductServiceTest {

    @Mock
    private ProductRepository productRepository;

    @InjectMocks
    private ProductService productService;

    private Product testProduct1;
    private Product testProduct2;

    @BeforeEach
    void setUp() {
        testProduct1 = new Product();
        testProduct1.setId(1L);
        testProduct1.setCode("P001");
        testProduct1.setName("Product 1");
        testProduct1.setDescription("Description 1");
        testProduct1.setImage("image1.jpg");
        testProduct1.setCategory("Electronics");
        testProduct1.setPrice(99.99);
        testProduct1.setQuantity(10);
        testProduct1.setInternalReference("REF001");
        testProduct1.setShellId(1001);
        testProduct1.setInventoryStatus(Product.InventoryStatus.INSTOCK);
        testProduct1.setRating(4);
        testProduct1.setCreatedAt(System.currentTimeMillis());
        testProduct1.setUpdatedAt(System.currentTimeMillis());

        testProduct2 = new Product();
        testProduct2.setId(2L);
        testProduct2.setCode("P002");
        testProduct2.setName("Product 2");
        testProduct2.setDescription("Description 2");
        testProduct2.setImage("image2.jpg");
        testProduct2.setCategory("Clothing");
        testProduct2.setPrice(49.99);
        testProduct2.setQuantity(5);
        testProduct2.setInternalReference("REF002");
        testProduct2.setShellId(1002);
        testProduct2.setInventoryStatus(Product.InventoryStatus.LOWSTOCK);
        testProduct2.setRating(3);
        testProduct2.setCreatedAt(System.currentTimeMillis());
        testProduct2.setUpdatedAt(System.currentTimeMillis());
    }

    @Test
    void testGetAllProducts() {
        // Given
        List<Product> productList = Arrays.asList(testProduct1, testProduct2);
        when(productRepository.findAll()).thenReturn(productList);

        // When
        List<Product> result = productService.getAllProducts();

        // Then
        assertEquals(2, result.size());
        assertTrue(result.contains(testProduct1));
        assertTrue(result.contains(testProduct2));
        verify(productRepository).findAll();
    }

    @Test
    void testGetProductByIdSuccess() {
        // Given
        when(productRepository.findById(anyLong())).thenReturn(Optional.of(testProduct1));

        // When
        Optional<Product> result = productService.getProductById(1L);

        // Then
        assertTrue(result.isPresent());
        assertEquals(testProduct1, result.get());
        verify(productRepository).findById(1L);
    }

    @Test
    void testGetProductByIdNotFound() {
        // Given
        when(productRepository.findById(anyLong())).thenReturn(Optional.empty());

        // When
        Optional<Product> result = productService.getProductById(999L);

        // Then
        assertFalse(result.isPresent());
        verify(productRepository).findById(999L);
    }

    @Test
    void testSaveProduct() {
        // Given
        when(productRepository.save(any(Product.class))).thenReturn(testProduct1);

        // When
        Product result = productService.saveProduct(testProduct1);

        // Then
        assertNotNull(result);
        assertEquals(testProduct1.getId(), result.getId());
        assertEquals(testProduct1.getCode(), result.getCode());
        assertEquals(testProduct1.getName(), result.getName());
        verify(productRepository).save(testProduct1);
    }

    @Test
    void testDeleteProduct() {
        // Given
        doNothing().when(productRepository).deleteById(anyLong());

        // When
        productService.deleteProduct(1L);

        // Then
        verify(productRepository).deleteById(1L);
    }

    @Test
    void testGetProductsByCategory() {
        // Given
        List<Product> electronicsProducts = Arrays.asList(testProduct1);
        when(productRepository.findByCategory(anyString())).thenReturn(electronicsProducts);

        // When
        List<Product> result = productService.getProductsByCategory("Electronics");

        // Then
        assertEquals(1, result.size());
        assertTrue(result.contains(testProduct1));
        verify(productRepository).findByCategory("Electronics");
    }

    @Test
    void testGetProductsByInventoryStatus() {
        // Given
        List<Product> inStockProducts = Arrays.asList(testProduct1);
        when(productRepository.findByInventoryStatus(any(Product.InventoryStatus.class)))
                .thenReturn(inStockProducts);

        // When
        List<Product> result = productService.getProductsByInventoryStatus(Product.InventoryStatus.INSTOCK);

        // Then
        assertEquals(1, result.size());
        assertTrue(result.contains(testProduct1));
        verify(productRepository).findByInventoryStatus(Product.InventoryStatus.INSTOCK);
    }
}
