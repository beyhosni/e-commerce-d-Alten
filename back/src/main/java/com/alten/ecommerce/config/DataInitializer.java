package com.alten.ecommerce.config;

import com.alten.ecommerce.model.Product;
import com.alten.ecommerce.model.User;
import com.alten.ecommerce.repository.ProductRepository;
import com.alten.ecommerce.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.util.Arrays;

@Component
public class DataInitializer implements CommandLineRunner {

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) throws Exception {
        // Vérifier si la base de données est vide
        if (productRepository.count() == 0) {
            // Ajouter des produits exemples
            Product product1 = new Product();
            product1.setCode("P001");
            product1.setName("Smartphone Pro");
            product1.setDescription("Un smartphone haut de gamme avec un excellent appareil photo");
            product1.setImage("https://example.com/images/smartphone-pro.jpg");
            product1.setCategory("Électronique");
            product1.setPrice(899.99);
            product1.setQuantity(50);
            product1.setInternalReference("REF-SP-001");
            product1.setShellId(1);
            product1.setInventoryStatus(Product.InventoryStatus.INSTOCK);
            product1.setRating(5);

            Product product2 = new Product();
            product2.setCode("P002");
            product2.setName("Laptop Ultra");
            product2.setDescription("Un ordinateur portable ultra-léger avec une autonomie de 12 heures");
            product2.setImage("https://example.com/images/laptop-ultra.jpg");
            product2.setCategory("Informatique");
            product2.setPrice(1299.99);
            product2.setQuantity(25);
            product2.setInternalReference("REF-LU-002");
            product2.setShellId(2);
            product2.setInventoryStatus(Product.InventoryStatus.INSTOCK);
            product2.setRating(4);

            Product product3 = new Product();
            product3.setCode("P003");
            product3.setName("Écouteurs Sans Fil");
            product3.setDescription("Des écouteurs sans fil avec réduction de bruit active");
            product3.setImage("https://example.com/images/earbuds.jpg");
            product3.setCategory("Audio");
            product3.setPrice(199.99);
            product3.setQuantity(5);
            product3.setInternalReference("REF-ES-003");
            product3.setShellId(3);
            product3.setInventoryStatus(Product.InventoryStatus.LOWSTOCK);
            product3.setRating(4);

            Product product4 = new Product();
            product4.setCode("P004");
            product4.setName("Tablette HD");
            product4.setDescription("Une tablette avec un écran haute définition pour le divertissement");
            product4.setImage("https://example.com/images/tablet-hd.jpg");
            product4.setCategory("Électronique");
            product4.setPrice(449.99);
            product4.setQuantity(0);
            product4.setInternalReference("REF-TH-004");
            product4.setShellId(4);
            product4.setInventoryStatus(Product.InventoryStatus.OUTOFSTOCK);
            product4.setRating(3);

            Product product5 = new Product();
            product5.setCode("P005");
            product5.setName("Montre Connectée");
            product5.setDescription("Une montre intelligente pour suivre votre activité physique");
            product5.setImage("https://example.com/images/smartwatch.jpg");
            product5.setCategory("Accessoires");
            product5.setPrice(299.99);
            product5.setQuantity(30);
            product5.setInternalReference("REF-MC-005");
            product5.setShellId(5);
            product5.setInventoryStatus(Product.InventoryStatus.INSTOCK);
            product5.setRating(4);

            productRepository.saveAll(Arrays.asList(product1, product2, product3, product4, product5));
        }

        // Créer un utilisateur admin
        if (!userRepository.existsByEmail("admin@admin.com")) {
            User admin = new User();
            admin.setUsername("admin");
            admin.setFirstname("Admin");
            admin.setEmail("admin@admin.com");
            admin.setPassword(passwordEncoder.encode("admin123"));
            userRepository.save(admin);
        }
    }
}
