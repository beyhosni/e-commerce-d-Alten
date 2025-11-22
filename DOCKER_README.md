# Dockerisation de l'application E-commerce Alten

Ce document explique comment déployer l'application e-commerce d'Alten en utilisant Docker et Docker Compose.

## Prérequis

- Docker et Docker Compose installés sur votre machine

## Architecture

L'application est composée de trois services :

1. **Base de données H2** : Base de données en mémoire pour stocker les données
2. **Backend Spring Boot** : API REST pour la gestion des produits, utilisateurs, paniers, etc.
3. **Frontend Angular** : Interface utilisateur servie par Nginx

## Démarrage de l'application

Pour démarrer l'application complète avec tous ses services :

```bash
docker-compose up --build
```

Cette commande va :
- Construire les images Docker pour le backend et le frontend
- Démarrer les conteneurs dans l'ordre approprié
- Créer les réseaux et volumes nécessaires

## Accès à l'application

Une fois l'application démarrée, vous pouvez y accéder via :

- **Frontend** : http://localhost (port 80)
- **Backend API** : http://localhost:8080/api
- **Console H2** : http://localhost:8080/h2-console

## Configuration

### Variables d'environnement

Les variables d'environnement suivantes peuvent être configurées dans le fichier `docker-compose.yml` :

#### Backend
- `SPRING_DATASOURCE_URL` : URL de connexion à la base de données
- `SPRING_DATASOURCE_USERNAME` : Nom d'utilisateur de la base de données
- `SPRING_DATASOURCE_PASSWORD` : Mot de passe de la base de données
- `JWT_SECRET` : Clé secrète pour la génération des tokens JWT
- `JWT_EXPIRATION` : Durée d'expiration des tokens en millisecondes

### Ports

Les ports suivants sont configurés par défaut :

- **80** : Frontend (Nginx)
- **8080** : Backend Spring Boot
- **9092** : Base de données H2 (TCP)
- **8082** : Console H2 (Web)

## Dépannage

### Vérifier les logs

Pour consulter les logs des services :

```bash
docker-compose logs -f backend
docker-compose logs -f frontend
docker-compose logs -f db
```

### Redémarrer les services

Pour redémarrer un service spécifique :

```bash
docker-compose restart backend
docker-compose restart frontend
```

### Arrêter l'application

Pour arrêter tous les services :

```bash
docker-compose down
```

Pour arrêter les services et supprimer les volumes :

```bash
docker-compose down -v
```

## Déploiement en production

Pour un déploiement en production, vous pouvez :

1. Utiliser un registre d'images Docker (Docker Hub, AWS ECR, etc.)
2. Configurer des variables d'environnement spécifiques à la production
3. Utiliser une base de données persistante (PostgreSQL, MySQL) à la place de H2
4. Configurer un reverse proxy (Nginx, Traefik) pour la gestion SSL

## Architecture des fichiers

- `back/Dockerfile` : Configuration pour construire l'image du backend Spring Boot
- `front/Dockerfile` : Configuration pour construire l'image du frontend Angular
- `front/nginx.conf` : Configuration Nginx pour servir le frontend
- `docker-compose.yml` : Orchestration de tous les services
- `back/.dockerignore` : Fichiers à exclure de l'image Docker du backend
- `front/.dockerignore` : Fichiers à exclure de l'image Docker du frontend
