# Étape 1 : Utiliser une image Java officielle comme image parent
FROM eclipse-temurin:17-jdk

# Étape 2 : Définir le répertoire de travail
WORKDIR /app

# Étape 3 : Installer Maven, curl, Python et netcat
RUN apt-get update && apt-get install -y maven curl python3 netcat-openbsd

# Étape 4 : Copier le fichier Maven pom.xml
COPY pom.xml .

# Étape 5 : Télécharger les dépendances Maven
RUN mvn dependency:resolve

# Étape 6 : Copier le code source
COPY src ./src

# Étape 7 : Construire l'application
RUN mvn clean package -DskipTests

# Étape 8 : Exposer le port 8080
EXPOSE 8080

# Étape 9 : Vérifier que le fichier JAR existe
RUN ls -la target/

# Étape 10 : Lancer l'application avec une commande d'attente intégrée
CMD ["sh", "-c", "while ! nc -z db 1521; do echo 'En attente de la base de données...'; sleep 2; done; echo 'Base de données disponible!'; java -jar target/ecommerce-api-0.0.1-SNAPSHOT.jar"]
