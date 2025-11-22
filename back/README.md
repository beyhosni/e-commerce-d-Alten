# API E-commerce Alten

## Description

Ce projet est le backend pour le site e-commerce d'Alten. Il fournit une API RESTful pour la gestion des produits, des utilisateurs, des paniers d'achat et des listes d'envies.

## Technologies utilisées

- Java 17
- Spring Boot 3.1.0
- Spring Security
- Spring Data JPA
- JWT (JSON Web Tokens)
- H2 Database
- Swagger/OpenAPI

## Prérequis

- Java 17 ou supérieur
- Maven 3.6 ou supérieur

## Installation et exécution

1. Clonez le repository
2. Naviguez vers le dossier `back`
3. Exécutez la commande suivante pour démarrer l'application :

```bash
mvn spring-boot:run
```

L'application sera accessible à l'adresse `http://localhost:8080`.

## Documentation API

La documentation Swagger est accessible à l'adresse `http://localhost:8080/swagger-ui.html`.

## Endpoints

### Authentification

- `POST /api/account` - Créer un compte utilisateur
- `POST /api/token` - Se connecter et obtenir un token JWT

### Produits

- `GET /api/products` - Récupérer tous les produits
- `GET /api/products/{id}` - Récupérer un produit par son ID
- `POST /api/products` - Créer un nouveau produit (admin uniquement)
- `PUT /api/products/{id}` - Mettre à jour un produit (admin uniquement)
- `DELETE /api/products/{id}` - Supprimer un produit (admin uniquement)
- `GET /api/products/category/{category}` - Récupérer les produits par catégorie
- `GET /api/products/status/{status}` - Récupérer les produits par statut d'inventaire

### Panier d'achat

- `GET /api/cart` - Récupérer le panier de l'utilisateur connecté
- `POST /api/cart` - Ajouter un produit au panier
- `DELETE /api/cart` - Supprimer un produit du panier
- `PUT /api/cart` - Mettre à jour la quantité d'un produit dans le panier

### Liste d'envies

- `GET /api/wishlist` - Récupérer la liste d'envies de l'utilisateur connecté
- `POST /api/wishlist` - Ajouter un produit à la liste d'envies
- `DELETE /api/wishlist` - Supprimer un produit de la liste d'envies

## Utilisation

1. Créez un compte via `POST /api/account`
2. Connectez-vous via `POST /api/token` pour obtenir un token JWT
3. Incluez le token dans l'en-tête `Authorization: Bearer <token>` pour accéder aux endpoints protégés

## Compte administrateur

Un compte administrateur est créé automatiquement au démarrage de l'application :
- Email : admin@admin.com
- Mot de passe : admin123

Ce compte a les droits pour créer, modifier et supprimer des produits.

## Base de données

L'application utilise une base de données H2 en mémoire. La console H2 est accessible à l'adresse `http://localhost:8080/h2-console` avec les identifiants suivants :
- URL JDBC : `jdbc:h2:mem:ecommerce`
- Nom d'utilisateur : `sa`
- Mot de passe : `password`

## Tests

Pour exécuter les tests unitaires, utilisez la commande :

```bash
mvn test
```
