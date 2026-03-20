# projet42

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Build Status](https://github.com/<your-github-username>/projet42/actions/workflows/ci.yml/badge.svg)](https://github.com/<your-github-username>/projet42/actions/workflows/ci.yml)
[![SonarCloud Quality Gate Status](https://sonarcloud.io/api/project_badges/measure?project=<your-sonarcloud-project-key>&metric=alert_status)](https://sonarcloud.io/dashboard?id=<your-sonarcloud-project-key>)
[![SonarCloud Coverage](https://sonarcloud.io/api/project_badges/measure?project=<your-sonarcloud-project-key>&metric=coverage)](https://sonarcloud.io/dashboard?id=<your-sonarcloud-project-key>)

Bienvenue sur le projet `projet42` ! Cette application est une solution complète développée avec JHipster, intégrant un backend Spring Boot 3 et un frontend Angular 17. Elle vise à fournir une plateforme robuste et moderne pour la gestion de <br/>*(Ajoutez ici une brève description de votre projet, par exemple : "tâches, de ressources, ou de données utilisateurs." ou "une application de commerce électronique simplifiée")*.

---

## Table des matières

1.  [Setup Local](#setup-local)
    *   [Prérequis](#prérequis)
    *   [Lancement de la base de données](#lancement-de-la-base-de-données)
    *   [Lancement du Backend](#lancement-du-backend)
    *   [Lancement du Frontend](#lancement-du-frontend)
2.  [Architecture](#architecture)
3.  [Captures d'écran](#captures-décran)

---

## Setup Local

Suivez ces instructions pour installer et lancer l'application sur votre machine locale.

### Prérequis

Assurez-vous d'avoir les outils suivants installés sur votre système :

*   **Java Development Kit (JDK)**: Version 17 ou supérieure.
    *   [Télécharger JDK](https://www.oracle.com/java/technologies/downloads/)
*   **Node.js**: Version 18 ou supérieure.
    *   [Télécharger Node.js](https://nodejs.org/en/download/)
*   **npm** (fourni avec Node.js): Dernière version stable.
*   **Docker** et **Docker Compose**: Pour la gestion de la base de données.
    *   [Télécharger Docker Desktop](https://www.docker.com/products/docker-desktop)
*   **Maven**: Version 3.6 ou supérieure.
    *   [Télécharger Maven](https://maven.apache.org/download.cgi)
    *OU*
*   **Gradle**: Version 7 ou supérieure.
    *   [Télécharger Gradle](https://gradle.org/install/)

### Lancement de la base de données

L'application utilise PostgreSQL. Nous utilisons Docker Compose pour faciliter le démarrage de la base de données localement.

1.  Naviguez vers le dossier contenant les fichiers Docker Compose pour la base de données :
    bash
    cd src/main/docker
    
2.  Lancez le conteneur PostgreSQL en arrière-plan :
    bash
    docker-compose -f app.yml up -d
    
    *(Si vous avez un fichier `postgresql.yml` ou similaire, ajustez la commande en conséquence.)*
    Pour arrêter la base de données :
    bash
    docker-compose -f app.yml down
    

### Lancement du Backend

Le backend est une application Spring Boot.

1.  Naviguez vers le répertoire racine du projet (là où se trouve `pom.xml` pour Maven ou `build.gradle` pour Gradle).
2.  Lancez le backend :

    *   **Avec Maven :**
        bash
        ./mvnw
        
        *(Ou `mvnw spring-boot:run` si vous rencontrez des problèmes)*
    *   **Avec Gradle :**
        bash
        ./gradlew
        
        *(Ou `./gradlew bootRun` si vous rencontrez des problèmes)*

Le backend sera disponible à l'adresse `http://localhost:8080` (par défaut).

### Lancement du Frontend

Le frontend est une application Angular.

1.  Naviguez vers le répertoire du frontend. Généralement, c'est `src/main/webapp` ou un dossier `frontend` séparé si c'est un setup mono-repo/polyglotte.
    bash
    cd src/main/webapp # ou cd frontend
    
2.  Installez les dépendances npm :
    bash
    npm install
    
3.  Lancez l'application Angular :
    bash
    npm start
    
    *(Ou `ng serve --open` pour l'ouvrir automatiquement dans votre navigateur)*

Le frontend sera disponible à l'adresse `http://localhost:4200` (par défaut).

---

## Architecture

Le projet `projet42` est conçu autour d'une architecture moderne et éprouvée, principalement générée et gérée avec **JHipster 8**.

*   **Backend**: Développé avec **Spring Boot 3**. Il expose une API RESTful et gère la logique métier, la persistance des données et la sécurité.
*   **Frontend**: Une application **Angular 17** qui interagit avec le backend via les API REST. Elle fournit une interface utilisateur riche et réactive.
*   **Base de Données**: **PostgreSQL** est utilisée comme base de données relationnelle principale pour stocker les informations de l'application.
*   **Sécurité**: L'authentification est gérée par des **JSON Web Tokens (JWT)**, assurant une communication sécurisée et stateless entre le frontend et le backend.
*   **Outils JHipster**: JHipster facilite le développement rapide en générant le code boilerplate, la configuration de sécurité, les entités, et plus encore.

Cette architecture offre modularité, scalabilité et maintenabilité, s'alignant sur les meilleures pratiques de développement d'applications d'entreprise.

---

## Captures d'écran

Voici quelques aperçus de l'application `projet42`.

### Page d'Accueil
![Page d'Accueil](docs/images/homepage.png)
*(Remplacez `docs/images/homepage.png` par le chemin réel de votre image)*

### Tableau de Bord
![Tableau de Bord](docs/images/dashboard.png)
*(Remplacez `docs/images/dashboard.png` par le chemin réel de votre image)*

### Page de Détail d'une Entité
![Page de Détail d'une Entité](docs/images/entity_detail.png)
*(Remplacez `docs/images/entity_detail.png` par le chemin réel de votre image)*