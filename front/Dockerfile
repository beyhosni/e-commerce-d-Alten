# Étape 1 : Utiliser une image Node.js comme image parent
FROM node:18.19-alpine AS build

# Étape 2 : Définir le répertoire de travail
WORKDIR /app

# Étape 3 : Copier les fichiers de configuration
COPY package*.json ./

# Étape 4 : Installer les dépendances
RUN npm install

# Étape 5 : Copier le code source
COPY . .

# Étape 6 : Construire l'application pour la production
RUN npm run build

# Étape 7 : Utiliser une image légère pour servir les fichiers statiques
FROM nginx:stable-alpine

# Étape 8 : Copier les fichiers construits vers nginx
# Copie tous les fichiers du répertoire dist vers nginx
COPY --from=build /app/dist/ /usr/share/nginx/html/

# Étape 9 : Copier la configuration nginx
COPY nginx.conf /etc/nginx/nginx.conf

# Étape 10 : Exposer le port 80
EXPOSE 80

# Étape 11 : Lancer nginx
CMD ["nginx", "-g", "daemon off;"]
