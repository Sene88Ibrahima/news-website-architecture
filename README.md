# Suite d'Application Site Web d'Actualités

Une application complète de site web d'actualités construite avec des technologies web modernes, comprenant un frontend React, un backend Node.js avec Prisma ORM, des services REST et SOAP, et une application client Java.

## Vue d'ensemble de l'Architecture

L'application se compose de plusieurs services :

- **Frontend** : Application React avec TypeScript
- **Backend** : Node.js avec Express et Prisma ORM
- **Service REST** : Service Express.js pour les opérations d'articles et de catégories
- **Service SOAP** : Service Node.js SOAP pour la gestion des utilisateurs
- **Client Java** : Client en ligne de commande pour interagir avec les services REST et SOAP

## Structure du Projet

```
.
├── backend/                 # Application backend Node.js principale
│   ├── prisma/             # Schéma de base de données et migrations
│   ├── src/                # Code source
│   └── package.json
├── frontend/               # Application frontend React
│   ├── src/                # Composants React et services
│   ├── public/             # Ressources statiques
│   └── package.json
├── rest-service/           # Service API REST
│   ├── server.js           # Serveur Express avec endpoints REST
│   └── package.json
├── soap-service/           # Service web SOAP
│   ├── server.js           # Implémentation du service SOAP
│   ├── wsdl/               # Définitions WSDL
│   └── package.json
├── java-client/            # Client Java en ligne de commande
│   ├── src/                # Code source Java
│   ├── pom.xml             # Configuration Maven
│   └── README.md
└── README.md               # Ce fichier
```

## Prérequis

- **Node.js** 18+ et npm
- **Java** 11+ et Maven 3.6+
- Base de données **PostgreSQL**
- **Git**

## Démarrage Rapide

### 1. Configuration de la Base de Données

1. Installez PostgreSQL et créez une base de données :
   ```sql
   CREATE DATABASE newswebsite;
   ```

2. Créez un fichier `.env` dans le répertoire `backend` :
   ```env
   DATABASE_URL="postgresql://username:password@localhost:5432/newswebsite"
   JWT_SECRET="votre-clé-jwt-super-secrète"
   PORT=3001
   ```

### 2. Configuration du Backend

```bash
cd backend
npm install
npx prisma migrate dev
npx prisma db seed
npm run dev
```

Le backend s'exécutera sur `http://localhost:3001`

### 3. Configuration du Frontend

```bash
cd frontend
npm install
npm start
```

Le frontend s'exécutera sur `http://localhost:3000`

### 4. Configuration du Service REST

```bash
cd rest-service
npm install
npm start
```

Le service REST s'exécutera sur `http://localhost:8081`

### 5. Configuration du Service SOAP

```bash
cd soap-service
npm install
npm start
```

Le service SOAP s'exécutera sur `http://localhost:8080`

### 6. Configuration du Client Java

```bash
cd java-client
mvn clean package
java -jar target/news-client-1.0.0.jar --help
```

## Détails des Services

### API Backend (Port 3001)

Backend principal de l'application avec opérations CRUD complètes :

- **Authentification** : Système d'authentification basé sur JWT
- **Articles** : Créer, lire, mettre à jour, supprimer des articles
- **Catégories** : Gérer les catégories d'articles
- **Utilisateurs** : Gestion des utilisateurs avec accès basé sur les rôles
- **Base de données** : PostgreSQL avec Prisma ORM

**Endpoints Principaux :**
- `POST /api/auth/login` - Authentification utilisateur
- `GET /api/articles` - Lister les articles
- `GET /api/categories` - Lister les catégories
- `GET /api/users` - Lister les utilisateurs (admin uniquement)

### Service REST (Port 8081)

API REST dédiée pour les intégrations externes :

- **Support de Format** : Réponses JSON et XML
- **Articles** : Accès en lecture seule aux articles
- **Catégories** : Informations sur les catégories
- **Pagination** : Support de pagination intégré
- **Limitation de Débit** : Limitation du taux de requêtes

**Endpoints Principaux :**
- `GET /api/rest/articles` - Lister les articles avec pagination
- `GET /api/rest/articles/:id` - Obtenir un article spécifique
- `GET /api/rest/categories` - Lister les catégories
- `POST /api/rest/articles` - Créer un nouvel article

### Service SOAP (Port 8080)

Service web SOAP pour la gestion des utilisateurs :

- **Gestion des Utilisateurs** : Opérations CRUD complètes
- **Authentification** : Authentification basée sur token JWT
- **Accès Basé sur les Rôles** : Opérations réservées aux administrateurs
- **WSDL** : Définition WSDL complète disponible

**Opérations :**
- `authenticateUser` - Connexion utilisateur et génération de token
- `getUsers` - Lister les utilisateurs avec pagination
- `addUser` - Créer un nouvel utilisateur
- `updateUser` - Mettre à jour un utilisateur existant
- `deleteUser` - Supprimer un utilisateur

### Application Frontend (Port 3000)

Application React moderne avec :

- **TypeScript** : Sécurité de type complète
- **Tailwind CSS** : Style moderne
- **React Router** : Routage côté client
- **Axios** : Client HTTP avec intercepteurs
- **Authentification** : Gestion des tokens JWT
- **Design Responsive** : Interface adaptée aux mobiles

### Client Java

Interface en ligne de commande pour :

- **Opérations REST** : Gestion des articles et catégories
- **Opérations SOAP** : Gestion des utilisateurs et authentification
- **Formats Multiples** : Support JSON et XML
- **CLI Complet** : Interface en ligne de commande complète

## Documentation de l'API

### Exemples d'API REST

**Obtenir les Articles (JSON) :**
```bash
curl -H "Accept: application/json" http://localhost:8081/api/rest/articles
```

**Obtenir les Articles (XML) :**
```bash
curl -H "Accept: application/xml" http://localhost:8081/api/rest/articles
```

**Créer un Article :**
```bash
curl -X POST http://localhost:8081/api/rest/articles \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Nouvel Article",
    "content": "Contenu de l'article",
    "authorId": "1",
    "categoryId": "1"
  }'
```

### Exemples d'API SOAP

**Authentifier un Utilisateur :**
```xml
<soap:Envelope xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">
  <soap:Body>
    <authenticateUserRequest xmlns="http://localhost:8080/soap">
      <username>admin</username>
      <password>password</password>
    </authenticateUserRequest>
  </soap:Body>
</soap:Envelope>
```

**Obtenir les Utilisateurs :**
```xml
<soap:Envelope xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">
  <soap:Body>
    <getUsersRequest xmlns="http://localhost:8080/soap">
      <token>votre-token-jwt</token>
      <page>1</page>
      <limit>10</limit>
    </getUsersRequest>
  </soap:Body>
</soap:Envelope>
```

## Développement

### Exécuter Tous les Services

Vous pouvez exécuter tous les services simultanément en utilisant les scripts fournis :

**Mode développement :**
```bash
# Terminal 1 - Backend
cd backend && npm run dev

# Terminal 2 - Frontend
cd frontend && npm start

# Terminal 3 - Service REST
cd rest-service && npm run dev

# Terminal 4 - Service SOAP
cd soap-service && npm run dev
```

### Gestion de la Base de Données

**Réinitialiser la base de données :**
```bash
cd backend
npx prisma migrate reset
npx prisma db seed
```

**Visualiser la base de données :**
```bash
cd backend
npx prisma studio
```

### Tests

**Tests du backend :**
```bash
cd backend
npm test
```

**Tests du frontend :**
```bash
cd frontend
npm test
```

**Tests du client Java :**
```bash
cd java-client
mvn test
```

## Déploiement

### Build de Production

**Frontend :**
```bash
cd frontend
npm run build
```

**Backend :**
```bash
cd backend
npm run build
```

**Client Java :**
```bash
cd java-client
mvn clean package
```

### Variables d'Environnement

Créez des fichiers `.env` pour chaque service :

**Backend (.env) :**
```env
DATABASE_URL=postgresql://user:pass@localhost:5432/newswebsite
JWT_SECRET=votre-clé-secrète
PORT=3001
NODE_ENV=production
```

**Service REST (.env) :**
```env
DATABASE_URL=postgresql://user:pass@localhost:5432/newswebsite
PORT=8081
NODE_ENV=production
```

**Service SOAP (.env) :**
```env
DATABASE_URL=postgresql://user:pass@localhost:5432/newswebsite
JWT_SECRET=votre-clé-secrète
PORT=8080
NODE_ENV=production
```

## Sécurité

- **Authentification JWT** : Authentification sécurisée basée sur les tokens
- **Hachage des Mots de Passe** : bcrypt pour la sécurité des mots de passe
- **Limitation de Débit** : Limitation du taux de requêtes sur tous les services
- **CORS** : Configuré pour les requêtes cross-origin
- **Validation des Entrées** : Validation complète des entrées
- **Protection contre l'Injection SQL** : Prisma ORM prévient l'injection SQL

## Surveillance et Journalisation

- **Journalisation Structurée** : Logs au format JSON
- **Gestion des Erreurs** : Gestion complète des erreurs
- **Vérifications de Santé** : Endpoints de vérification de santé sur tous les services
- **Journalisation des Requêtes** : Journalisation des requêtes HTTP

## Dépannage

### Problèmes Courants

1. **Connexion à la Base de Données** : Assurez-vous que PostgreSQL fonctionne et que la chaîne de connexion est correcte
2. **Conflits de Ports** : Vérifiez que les ports 3000, 3001, 8080, 8081 sont disponibles
3. **Variables d'Environnement** : Assurez-vous que toutes les variables d'environnement requises sont définies
4. **Dépendances** : Exécutez `npm install` dans chaque répertoire de service

### Vérifications de Santé des Services

- Backend : `http://localhost:3001/health`
- Service REST : `http://localhost:8081/health`
- Service SOAP : `http://localhost:8080/health`

## Fonctionnalités Principales

### Authentification et Autorisation
- Système de connexion/déconnexion
- Gestion des rôles (Visiteur, Éditeur, Administrateur)
- Protection des routes sensibles
- Tokens JWT sécurisés

### Gestion des Articles
- Création, modification et suppression d'articles
- Système de catégories
- Statuts de publication (Brouillon/Publié)
- Recherche et filtrage
- Pagination

### Interface Utilisateur
- Design moderne et responsive
- Navigation intuitive
- Formulaires de connexion et de gestion
- Tableaux de bord administrateur
- Messages d'erreur et de succès en français

### Services Web
- API REST pour les intégrations externes
- Service SOAP pour la gestion des utilisateurs
- Support des formats JSON et XML
- Documentation complète des APIs

## Contribution

1. Forkez le dépôt
2. Créez une branche de fonctionnalité
3. Effectuez vos modifications
4. Ajoutez des tests
5. Soumettez une pull request

## Licence

Ce projet est sous licence MIT.

## Support

Pour le support et les questions, veuillez vous référer à la documentation individuelle des services ou créer une issue dans le dépôt.