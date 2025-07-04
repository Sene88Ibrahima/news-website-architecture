# Site Web d'Actualités - Application Multi-Services

Une application complète de gestion d'actualités avec architecture microservices moderne, comprenant des services SOAP et REST, une interface web React responsive, et un client Java d'administration.

## 🏗️ Architecture Complète du Projet

Cette application suit une architecture microservices distribuée avec séparation claire des responsabilités :

### 🔧 Services Backend

#### Service SOAP (`soap-service/`)
- **Port** : 3001
- **Technologie** : Node.js + Express + node-soap
- **Base de données** : SQLite avec Prisma ORM
- **Fonctionnalités** :
  - Authentification sécurisée des utilisateurs
  - Gestion complète des sessions utilisateur
  - Opérations CRUD sur les utilisateurs (Create, Read, Update, Delete)
  - Récupération d'utilisateur par ID
  - Validation des données d'entrée
  - Gestion des erreurs structurée
- **Endpoints** :
  - WSDL : `http://localhost:3001/wsdl`
  - Service SOAP : `http://localhost:3001/soap`
- **Méthodes SOAP disponibles** :
  - `authenticateUser(username, password)` - Authentification
  - `getUsers(page, limit)` - Liste paginée des utilisateurs
  - `getUserById(id)` - Récupération d'un utilisateur spécifique
  - `addUser(user)` - Ajout d'un nouvel utilisateur
  - `updateUser(id, user)` - Mise à jour d'un utilisateur
  - `deleteUser(id)` - Suppression d'un utilisateur

#### Service REST (`rest-service/`)
- **Port** : 3002
- **Technologie** : Node.js + Express
- **Base de données** : SQLite avec Prisma ORM
- **Fonctionnalités** :
  - API RESTful complète pour les articles
  - Gestion des catégories d'articles
  - Support multi-format (JSON/XML)
  - Pagination avancée et filtrage
  - Validation des données
  - Middleware de sécurité
- **Endpoints principaux** :
  - `GET /health` - Vérification de l'état du service
  - `GET /api/rest/articles` - Liste des articles (avec pagination)
  - `POST /api/rest/articles` - Création d'article
  - `PUT /api/rest/articles/:id` - Mise à jour d'article
  - `DELETE /api/rest/articles/:id` - Suppression d'article
  - `GET /api/rest/categories` - Gestion des catégories

### 🖥️ Applications Frontend

#### Interface Web React (`frontend/`)
- **Port** : 3000
- **Technologie** : React 18 + TypeScript + Vite
- **Styling** : Tailwind CSS + composants personnalisés
- **Fonctionnalités** :
  - Interface utilisateur moderne et responsive
  - Gestion complète des articles (CRUD)
  - Système de catégorisation
  - Authentification intégrée avec le service SOAP
  - Navigation intuitive
  - Design adaptatif mobile-first
  - Gestion d'état avec hooks React
  - Validation côté client

#### Client Java d'Administration (`java-client/`)
- **Technologie** : Java 11+ + Maven + JAX-WS
- **Type** : Application console interactive
- **Fonctionnalités** :
  - Interface console sécurisée pour l'administration
  - Intégration complète avec le service SOAP
  - Menu administrateur avec authentification
  - Gestion des erreurs robuste
  - Classes SOAP générées automatiquement
  - Opérations d'administration avancées

## 🚀 Guide de Démarrage Complet

### 📋 Prérequis Système
- **Node.js** v16 ou supérieur (recommandé : v18+)
- **Java** 11 ou supérieur (JDK requis)
- **Maven** 3.6 ou supérieur
- **Git** pour le clonage du projet
- **Navigateur web** moderne (Chrome, Firefox, Safari, Edge)

### 🔧 Installation Initiale

1. **Cloner le projet :**
```bash
git clone <repository-url>
cd "Site Web actualités"
```

2. **Installation des dépendances :**
```bash
# Service SOAP
cd soap-service
npm install
cd ..

# Service REST
cd rest-service
npm install
cd ..

# Frontend React
cd frontend
npm install
cd ..

# Client Java (génération des classes SOAP)
cd java-client
mvn clean compile
cd ..
```

### 🚀 Méthodes de Lancement

#### Option 1 : Lancement Automatique (Recommandé)

**Windows :**
```bash
.\start-services.bat
```

**Linux/macOS :**
```bash
chmod +x start-services.sh
./start-services.sh
```

#### Option 2 : Lancement Manuel Détaillé

**1. Service SOAP (Terminal 1) :**
```bash
cd soap-service
npm install  # Si pas encore fait
npm start
# ✅ Service disponible sur http://localhost:3001
# ✅ WSDL disponible sur http://localhost:3001/wsdl
```

**2. Service REST (Terminal 2) :**
```bash
cd rest-service
npm install  # Si pas encore fait
npm start
# ✅ Service disponible sur http://localhost:3002
# ✅ Health check : http://localhost:3002/health
```

**3. Frontend React (Terminal 3) :**
```bash
cd frontend
npm install  # Si pas encore fait
npm start
# ✅ Interface web disponible sur http://localhost:3000
```

**4. Client Java (Terminal 4) :**
```bash
cd java-client
# Génération des classes SOAP (si nécessaire)
mvn jaxws:wsimport
# Compilation
mvn clean compile
# Exécution
mvn exec:java
# Ou alternativement :
java -cp "target/classes;target/dependency/*" com.newswebsite.client.NewsClientApplication
```

### 🔍 Vérification du Démarrage

Après le lancement, vérifiez que tous les services sont opérationnels :

1. **Service SOAP** : `curl http://localhost:3001/wsdl`
2. **Service REST** : `curl http://localhost:3002/health`
3. **Frontend** : Ouvrir `http://localhost:3000` dans le navigateur
4. **Client Java** : Menu d'authentification affiché dans la console

## 📋 Fonctionnalités Détaillées

### 🔐 Service SOAP - Gestion des Utilisateurs

**Authentification et Sécurité :**
- Système d'authentification sécurisé par nom d'utilisateur/mot de passe
- Gestion des sessions utilisateur avec tokens
- Validation des données d'entrée
- Gestion des erreurs structurée avec codes de retour

**Opérations CRUD Complètes :**
- **Create** : Ajout de nouveaux utilisateurs avec validation
- **Read** : Récupération d'utilisateurs (liste paginée ou par ID)
- **Update** : Mise à jour des informations utilisateur
- **Delete** : Suppression sécurisée d'utilisateurs

**Endpoints SOAP :**
- WSDL complet disponible à `/wsdl`
- Service SOAP accessible à `/soap`
- Support des types complexes (User, Request/Response objects)

### 🌐 Service REST - Gestion du Contenu

**API RESTful Complète :**
- Endpoints conformes aux standards REST
- Support des méthodes HTTP (GET, POST, PUT, DELETE)
- Codes de statut HTTP appropriés
- Headers de réponse optimisés

**Gestion des Articles :**
- CRUD complet sur les articles d'actualités
- Système de catégorisation avancé
- Pagination intelligente avec métadonnées
- Filtrage et recherche par critères
- Validation des données côté serveur

**Formats et Compatibilité :**
- Support multi-format (JSON/XML)
- Négociation de contenu automatique
- CORS configuré pour l'intégration frontend
- Rate limiting pour la protection

**Monitoring et Santé :**
- Endpoint de santé (`/health`) avec diagnostics
- Logging structuré des requêtes
- Métriques de performance

### 🖥️ Interface Web React - Expérience Utilisateur

**Design et UX :**
- Interface moderne et intuitive
- Design responsive mobile-first
- Composants réutilisables avec Tailwind CSS
- Animations et transitions fluides
- Thème cohérent et professionnel

**Fonctionnalités Utilisateur :**
- Gestion complète des articles (création, édition, suppression)
- Système de catégories avec filtrage
- Recherche en temps réel
- Pagination côté client
- Formulaires avec validation en temps réel

**Intégration Backend :**
- Authentification intégrée avec le service SOAP
- Communication asynchrone avec les APIs
- Gestion d'état centralisée
- Cache intelligent des données
- Gestion des erreurs utilisateur-friendly

### ⚙️ Client Java - Administration

**Interface Console Avancée :**
- Menu interactif avec navigation intuitive
- Interface sécurisée avec authentification obligatoire
- Gestion des erreurs robuste avec retry automatique
- Logging détaillé des opérations

**Intégration SOAP :**
- Classes Java générées automatiquement depuis le WSDL
- Client SOAP optimisé avec JAX-WS
- Sérialisation/désérialisation automatique
- Gestion des timeouts et reconnexions

**Fonctionnalités d'Administration :**
- Gestion complète des utilisateurs
- Opérations en lot (bulk operations)
- Export/import de données
- Statistiques et rapports
- Outils de diagnostic et maintenance

## 🔧 Configuration

### Ports
- Service SOAP : `http://localhost:3001`
- Service REST : `http://localhost:3002`
- Frontend : `http://localhost:3000`

### Base de Données
- **ORM** : Prisma avec SQLite
- **Schémas** :
  - `soap-service/prisma/schema.prisma`
  - `rest-service/prisma/schema.prisma`

## 🛠️ Technologies

### Backend
- **Node.js** avec Express.js
- **Prisma** ORM
- **SOAP** (node-soap)
- **SQLite** (base de données)

### Frontend
- **React** avec TypeScript
- **Tailwind CSS**
- **Vite** (bundler)

### Client Java
- **Java 11+**
- **Maven**
- **JAX-WS** (client SOAP)

## 🔒 Sécurité

- Authentification par token
- Validation des entrées
- Protection CORS
- Rate limiting

## 🧪 Tests

### Endpoints de Test

**Service SOAP :**
- WSDL : `http://localhost:3001/wsdl`
- Service : `http://localhost:3001/soap`

**Service REST :**
- Health : `http://localhost:3002/health`
- Articles : `http://localhost:3002/api/rest/articles`
- Catégories : `http://localhost:3002/api/rest/categories`

## 📝 Contribution

1. Forkez le projet
2. Créez une branche (`git checkout -b feature/nouvelle-fonctionnalite`)
3. Committez (`git commit -m 'Ajout fonctionnalité'`)
4. Poussez (`git push origin feature/nouvelle-fonctionnalite`)
5. Ouvrez une Pull Request

## 📄 Licence

Ce projet est sous licence MIT.

## 🆘 Support

Pour toute question, ouvrez une issue sur GitHub.

---