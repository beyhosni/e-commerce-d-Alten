# E-commerce Alten

![Java](https://img.shields.io/badge/Java-17-orange?style=flat&logo=java)
![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.1.0-brightgreen?style=flat&logo=spring)
![Angular](https://img.shields.io/badge/Angular-16-red?style=flat&logo=angular)
![Docker](https://img.shields.io/badge/Docker-2496ED?style=flat&logo=docker)
![License](https://img.shields.io/badge/License-Apache%202.0-blue?style=flat)

Application e-commerce complète développée pour Alten, avec un backend Spring Boot et un frontend Angular.

## 📋 Table des matières

- [Présentation du projet](#-présentation-du-projet)
- [Technologies utilisées](#-technologies-utilisées)
- [Démarrage rapide](#-démarrage-rapide)
- [Fonctionnalités implémentées](#-fonctionnalités-implémentées)
- [Architecture de l'application](#-architecture-de-lapplication)
- [Tests](#-tests)
- [Déploiement avec Docker](#-déploiement-avec-docker)

## 🚀 Présentation du projet

Ce projet est une application e-commerce complète développée pour Alten, permettant aux utilisateurs de :
- Parcourir un catalogue de produits
- Gérer un panier d'achat
- Gérer une liste d'envies
- Contacter le service client

L'application est architecturée selon les meilleures pratiques avec une séparation claire entre le frontend et le backend, et utilise des technologies modernes pour garantir performance et maintenabilité.

## 🛠️ Technologies utilisées

### Backend
- **Java 17** : Langage de programmation principal
- **Spring Boot 3.1.0** : Framework pour la création d'API REST
- **Spring Security** : Gestion de l'authentification et des autorisations
- **Spring Data JPA** : Accès aux données et persistance
- **JWT (JSON Web Tokens)** : Authentification stateless
- **H2 Database** : Base de données en mémoire pour le développement
- **Swagger/OpenAPI** : Documentation interactive de l'API
- **Maven** : Gestion des dépendances et build

### Frontend
- **Angular 16** : Framework frontend moderne
- **TypeScript** : Typage statique pour JavaScript
- **RxJS** : Programmation réactive
- **Bootstrap 5** : Framework CSS pour le design responsive
- **NgBootstrap** : Composants Bootstrap pour Angular
- **Angular Forms** : Gestion des formulaires et validation
- **Angular Router** : Gestion de la navigation

### DevOps
- **Docker** : Conteneurisation de l'application
- **Docker Compose** : Orchestration des services
- **Nginx** : Serveur web pour le frontend

## 🏃‍♂️ Démarrage rapide

### Prérequis
- Java 17+
- Node.js 18+
- Docker et Docker Compose (pour le déploiement)

### Lancement avec Docker (recommandé)

```bash
# Cloner le repository
git clone <repository-url>
cd product-trial-master

# Lancer tous les services
docker-compose up --build
```

L'application sera accessible via :
- Frontend : http://localhost
- Backend API : http://localhost:8080/api
- Documentation API : http://localhost:8080/swagger-ui.html

### Lancement manuel

#### Backend
```bash
cd back
mvn spring-boot:run
```

#### Frontend
```bash
cd front
npm install
ng serve
```

## ✨ Fonctionnalités implémentées

### Gestion des produits
- Affichage de la liste des produits avec pagination
- Filtrage par catégorie et statut d'inventaire
- Affichage détaillé des informations des produits
- Gestion CRUD des produits (admin uniquement)

### Gestion du panier
- Ajout de produits au panier depuis la liste
- Visualisation du contenu du panier
- Ajustement des quantités
- Calcul automatique du total
- Badge indiquant le nombre d'articles dans le panier

### Gestion de la liste d'envies
- Ajout/suppression de produits de la liste d'envies
- Visualisation de la liste d'envies

### Authentification
- Création de compte
- Connexion avec token JWT
- Gestion des rôles (utilisateur/admin)

### Formulaire de contact
- Envoi de messages au service client
- Validation des champs (email obligatoire, message < 300 caractères)
- Confirmation d'envoi

## 🏗️ Architecture de l'application

### Backend
```
├── src/main/java/com/alten/ecommerce
│   ├── config          # Configuration de sécurité, Swagger, etc.
│   ├── controller       # Contrôleurs REST pour les endpoints API
│   ├── dto             # Objets de transfert de données
│   ├── exception       # Gestion des erreurs personnalisées
│   ├── model           # Entités JPA
│   ├── repository       Interfaces Spring Data JPA
│   ├── service         # Logique métier
│   └── security        # Configuration JWT et filtres
```

### Frontend
```
├── src/app
│   ├── components      # Composants réutilisables
│   ├── services        # Services pour les appels API
│   ├── models          # Modèles de données
│   ├── guards          # Guards de routage
│   ├── interceptors    # Intercepteurs HTTP
│   └── modules        # Modules Angular
```

## 🧪 Tests

### Backend
- Tests unitaires pour les services et contrôleurs
- Tests d'intégration pour les endpoints API
- Tests de sécurité pour l'authentification

### Frontend
- Tests unitaires pour les composants et services
- Tests de validation des formulaires
- Tests d'interaction utilisateur

### Lancement des tests

```bash
# Backend
cd back
mvn test

# Frontend
cd front
npm test
```

## 🐳 Déploiement avec Docker

L'application est entièrement dockerisée avec Docker Compose pour faciliter le déploiement :

### Services
- **Base de données H2** : Persistance des données
- **Backend Spring Boot** : API REST sur le port 8080
- **Frontend Angular** : Servi par Nginx sur le port 80

### Commandes utiles
```bash
# Démarrer tous les services
docker-compose up --build

# Arrêter les services
docker-compose down

# Voir les logs
docker-compose logs -f

# Redémarrer un service
docker-compose restart backend
```

Pour plus de détails sur la configuration Docker, consultez le fichier `DOCKER_README.md`.

## 📝 Notes

- Le compte administrateur est créé automatiquement au démarrage (admin@admin.com / admin123)
- Les mots de passe sont hashés avec BCrypt
- Les tokens JWT expirent après 24 heures
- La base de données H2 est utilisée pour le développement, mais peut être remplacée par PostgreSQL/MySQL en production

## 🤝 Contribution

Ce projet a été développé dans le cadre d'une évaluation technique pour Alten.

## 📄 Licence

Ce projet est sous licence Apache 2.0.

