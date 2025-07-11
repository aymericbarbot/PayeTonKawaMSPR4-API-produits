# PayeTonKawaMSPR4-API-produits

# FICHIER .ENV
## Pour les variables d'environnement, créer un fichier .env à la racine du projet
## et se trourner vers un collaborateur pour les ajouter
## Penser à faire un npm install ensuite pour remettre à jour les dépendances et prendre en compte le .env

# Docker

Ouvrir l'application Docker Desktop

Se placer dans le répertoire du projet, lancer les conteneurs:

docker-compose up --build

(Le service produit est exposé sur le port 3007)

Pour arrêter les conteneurs:

docker compose down

# Local

## Installer les dépendances

npm install

## builder l'app

npm run build

## démarrer l'app

npm run dev
npm run start

# Test
## Installation de Jest
npm install --save-dev jest ts-jest @types/jest typescript
npx ts-jest config:init
## Test Untaires
### Lancer les tests
npx jest
## Test Intégration
### Installation supertest
npm install --save-dev supertest dotenv
npm install --save-dev @types/supertest

créer à la racine un fichier .env.test.local
    .Port sur lequel tourne MySQL dans Docker
    ```
    DB_HOST=127.0.0.1
    DB_PORT=3307           # <-- Doit matcher DB_FORWARD_PORT dans docker-compose
    DB_USER=monuser
    DB_PASSWORD=monpassword
    DB_NAME=testdb         # <-- Prends un nom de base de test, pas la prod !
    DB_ROOT_PASSWORD=root
    NODE_ENV=test
    ```
    .Pour ton app si besoin :
    PRODUCT_PORT=3100

créer test/setupEnvs.ts
    ```
    import dotenv from 'dotenv';

    dotenv.config({ path: '.env.test.local' });
    ```
vérifier dans le fichier les lignes suivantes :
    ```
    module.exports = {
    testEnvironment: "node",
    transform: {
        ...tsJestTransformCfg,
    },
    setupFiles: ['<rootDir>/test/setupEnvs.ts'],
    };
    ```
### Lancer les tests
npx jest