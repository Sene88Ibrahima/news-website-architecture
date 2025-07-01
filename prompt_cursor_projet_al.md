# Prompt Complet - Projet d'Architecture Logicielle

## Contexte du Projet
Je dois développer un projet d'architecture logicielle complet avec 3 composants principaux :
1. **Site Web d'actualités** (Frontend + Backend)
2. **Services Web** (SOAP + REST)
3. **Application Client** (Java/Python)

## 1. SITE WEB D'ACTUALITÉS

### Architecture Technique
- **Frontend** : React.js avec TypeScript
- **Backend** : Node.js avec Express.js
- **Base de données** : PostgreSQL
- **ORM** : Prisma
- **Authentification** : JWT + bcrypt
- **Styling** : Tailwind CSS

### Modèle de Données
Créer les entités suivantes avec Prisma :

```prisma
// User avec 3 rôles : VISITOR, EDITOR, ADMIN
model User {
  id        String   @id @default(cuid())
  username  String   @unique
  email     String   @unique
  password  String
  role      Role     @default(VISITOR)
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  articles  Article[]
}

enum Role {
  VISITOR
  EDITOR
  ADMIN
}

model Category {
  id          String    @id @default(cuid())
  name        String    @unique
  description String?
  articles    Article[]
  createdAt   DateTime  @default(now())
}

model Article {
  id          String   @id @default(cuid())
  title       String
  content     String
  summary     String
  published   Boolean  @default(false)
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  authorId    String
  categoryId  String
  author      User     @relation(fields: [authorId], references: [id])
  category    Category @relation(fields: [categoryId], references: [id])
}

model AuthToken {
  id        String   @id @default(cuid())
  token     String   @unique
  isActive  Boolean  @default(true)
  createdAt DateTime @default(now())
  expiresAt DateTime?
}
```

### Fonctionnalités Frontend (React)

#### Page d'Accueil
- Affichage des derniers articles avec pagination
- Résumé de chaque article
- Boutons "Suivant" et "Précédent"
- Filtrage par catégorie
- Navigation responsive

#### Authentification
- Login/Logout
- Protection des routes selon les rôles
- Middleware de vérification des permissions

#### Interface Éditeur
- CRUD articles (Create, Read, Update, Delete)
- CRUD catégories
- Interface d'édition riche (éditeur de texte)

#### Interface Administrateur
- Toutes les fonctionnalités éditeur
- Gestion des utilisateurs (CRUD)
- Gestion des jetons d'authentification API
- Dashboard d'administration

### Structure des Composants React
```
src/
├── components/
│   ├── common/
│   │   ├── Header.tsx
│   │   ├── Footer.tsx
│   │   ├── Pagination.tsx
│   │   └── LoadingSpinner.tsx
│   ├── articles/
│   │   ├── ArticleList.tsx
│   │   ├── ArticleCard.tsx
│   │   ├── ArticleDetail.tsx
│   │   └── ArticleForm.tsx
│   ├── auth/
│   │   ├── LoginForm.tsx
│   │   └── ProtectedRoute.tsx
│   └── admin/
│       ├── UserManagement.tsx
│       ├── CategoryManagement.tsx
│       └── TokenManagement.tsx
├── pages/
│   ├── HomePage.tsx
│   ├── ArticlePage.tsx
│   ├── CategoryPage.tsx
│   ├── LoginPage.tsx
│   └── AdminPage.tsx
├── hooks/
│   ├── useAuth.tsx
│   ├── useArticles.tsx
│   └── useUsers.tsx
├── services/
│   ├── api.ts
│   ├── auth.ts
│   └── articles.ts
└── types/
    └── index.ts
```

### API Backend (Express.js)

#### Endpoints REST
```javascript
// Articles
GET    /api/articles              // Liste paginée
GET    /api/articles/:id          // Article détaillé
POST   /api/articles              // Créer (EDITOR+)
PUT    /api/articles/:id          // Modifier (EDITOR+)
DELETE /api/articles/:id          // Supprimer (EDITOR+)

// Catégories
GET    /api/categories            // Liste toutes
POST   /api/categories            // Créer (EDITOR+)
PUT    /api/categories/:id        // Modifier (EDITOR+)
DELETE /api/categories/:id        // Supprimer (EDITOR+)

// Utilisateurs
GET    /api/users                 // Liste (ADMIN)
POST   /api/users                 // Créer (ADMIN)
PUT    /api/users/:id             // Modifier (ADMIN)
DELETE /api/users/:id             // Supprimer (ADMIN)

// Auth
POST   /api/auth/login            // Connexion
POST   /api/auth/logout           // Déconnexion
GET    /api/auth/me               // Profil utilisateur

// Tokens API
GET    /api/tokens                // Liste tokens (ADMIN)
POST   /api/tokens                // Générer token (ADMIN)
DELETE /api/tokens/:id            // Supprimer token (ADMIN)
```

## 2. SERVICES WEB

### Service SOAP (avec soap-node)
Créer un service SOAP avec les opérations :

```xml
<!-- WSDL Structure -->
<definitions>
  <types>
    <schema>
      <complexType name="User">
        <sequence>
          <element name="id" type="string"/>
          <element name="username" type="string"/>
          <element name="email" type="string"/>
          <element name="role" type="string"/>
        </sequence>
      </complexType>
    </schema>
  </types>
  
  <message name="AuthenticateRequest">
    <part name="username" type="string"/>
    <part name="password" type="string"/>
  </message>
  
  <message name="GetUsersRequest">
    <part name="token" type="string"/>
  </message>
  
  <!-- Autres messages... -->
</definitions>
```

**Opérations SOAP à implémenter :**
- `authenticateUser(username, password)` → retourne token
- `getUsers(authToken)` → liste utilisateurs
- `addUser(authToken, userData)` → créer utilisateur
- `updateUser(authToken, userId, userData)` → modifier utilisateur
- `deleteUser(authToken, userId)` → supprimer utilisateur

### Service REST (Express.js séparé)
Créer un serveur REST dédié avec les endpoints :

```javascript
// Accepte Content-Type: application/xml ou application/json
GET /api/rest/articles
GET /api/rest/articles/by-category
GET /api/rest/articles/category/:categoryName

// Middleware pour gérer XML/JSON selon Accept header
app.use((req, res, next) => {
  const acceptHeader = req.headers.accept;
  req.responseFormat = acceptHeader?.includes('application/xml') ? 'xml' : 'json';
  next();
});
```

## 3. APPLICATION CLIENT (Java)

### Structure Java
```java
// Packages structure
com.project.client/
├── Main.java
├── auth/
│   ├── AuthService.java
│   └── AuthenticationException.java
├── soap/
│   ├── SoapClient.java
│   └── UserService.java
├── ui/
│   ├── LoginUI.java
│   ├── MainUI.java
│   └── UserManagementUI.java
└── models/
    └── User.java
```

### Fonctionnalités Client Java
1. **Interface de connexion** (Swing/JavaFX)
2. **Authentification via service SOAP**
3. **Interface de gestion utilisateurs** (si admin)
4. **Opérations CRUD via SOAP**

### Exemple de code principal :
```java
public class Main {
    public static void main(String[] args) {
        SwingUtilities.invokeLater(() -> {
            try {
                UIManager.setLookAndFeel(UIManager.getSystemLookAndFeel());
            } catch (Exception e) {
                e.printStackTrace();
            }
            
            LoginUI loginUI = new LoginUI();
            loginUI.setVisible(true);
        });
    }
}
```

## 4. CONFIGURATION LOCALE

### Installation et Configuration
```bash
# Installation PostgreSQL locale
# Windows: Télécharger depuis postgresql.org
# macOS: brew install postgresql
# Linux: sudo apt-get install postgresql

# Créer la base de données
createdb news_db
```

### Variables d'environnement (.env)
```env
# Database (Local)
DATABASE_URL="postgresql://postgres:password@localhost:5432/news_db"

# JWT
JWT_SECRET="dev-secret-key-change-in-production"
JWT_EXPIRES_IN="7d"

# Services Ports (Local)
SOAP_PORT=8001
REST_PORT=8002
MAIN_APP_PORT=3000

# Development
NODE_ENV=development
```

### Scripts de développement local
```json
{
  "scripts": {
    "install:all": "npm install && cd frontend && npm install && cd ../java-client && mvn install",
    "dev": "concurrently \"npm run dev:db\" \"npm run dev:backend\" \"npm run dev:frontend\" \"npm run dev:soap\" \"npm run dev:rest\"",
    "dev:backend": "nodemon backend/server.js",
    "dev:frontend": "cd frontend && npm start",
    "dev:soap": "nodemon soap-service/server.js",
    "dev:rest": "nodemon rest-service/server.js",
    "dev:db": "echo 'Database ready on localhost:5432'",
    "db:setup": "npx prisma migrate dev --name init && npx prisma db seed",
    "db:reset": "npx prisma migrate reset",
    "build:java": "cd java-client && mvn clean compile",
    "run:java": "cd java-client && mvn exec:java -Dexec.mainClass=\"com.project.client.Main\""
  }
}

### Configuration des Ports Locaux
- **Frontend React** : http://localhost:3000
- **Backend API** : http://localhost:3001  
- **Service SOAP** : http://localhost:8001/soap
- **Service REST** : http://localhost:8002/api/rest
- **PostgreSQL** : localhost:5432
```

## 5. QUALITÉ DE CODE

### Standards à respecter :
- **TypeScript** strict mode
- **ESLint + Prettier** configuration
- **Commentaires JSDoc** pour toutes les fonctions
- **Tests unitaires** (Jest + React Testing Library)
- **Validation des données** (Zod/Joi)
- **Gestion d'erreurs** centralisée
- **Logging** structuré (Winston)
- **Architecture en couches** claire

### Structure de fichiers locale :
```
projet-architecture-logicielle/
├── backend/                    # API Node.js
│   ├── src/
│   │   ├── controllers/
│   │   ├── middleware/
│   │   ├── routes/
│   │   └── utils/
│   ├── prisma/
│   │   ├── schema.prisma
│   │   └── seed.js
│   ├── package.json
│   └── server.js
├── frontend/                   # React App
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── hooks/
│   │   └── services/
│   ├── public/
│   └── package.json
├── soap-service/               # Service SOAP
│   ├── src/
│   ├── wsdl/
│   ├── package.json
│   └── server.js
├── rest-service/               # Service REST
│   ├── src/
│   ├── package.json
│   └── server.js
├── java-client/                # Application Java
│   ├── src/main/java/
│   ├── pom.xml
│   └── target/
├── .env                        # Variables d'environnement
├── package.json                # Scripts globaux
└── README.md                   # Documentation
```

### Instructions de démarrage local :

1. **Prérequis** :
   ```bash
   # Node.js 18+ et npm
   # PostgreSQL 13+
   # Java 11+ et Maven
   ```

2. **Installation** :
   ```bash
   git clone [votre-repo]
   cd projet-architecture-logicielle
   npm run install:all
   ```

3. **Configuration base de données** :
   ```bash
   # Créer la DB PostgreSQL locale
   createdb news_db
   
   # Configurer Prisma
   npm run db:setup
   ```

4. **Lancement en développement** :
   ```bash
   npm run dev
   ```

5. **Tester l'application Java** :
   ```bash
   npm run build:java
   npm run run:java
   ```

## Instructions pour Cursor (Développement Local) :

1. **Initialisation du projet** :
   - Créer la structure de dossiers complète
   - Configurer package.json avec scripts de développement local
   - Initialiser PostgreSQL en local

2. **Base de données** : 
   - Configurer Prisma avec DATABASE_URL locale
   - Créer les migrations et seed data
   - Tester la connexion DB

3. **Backend API** (Port 3001) : 
   - Développer l'API avec Express.js
   - Implémenter l'authentification JWT
   - Créer tous les endpoints REST

4. **Frontend React** (Port 3000) : 
   - Créer les composants avec Tailwind CSS
   - Implémenter le routing et la gestion d'état
   - Connecter avec l'API backend

5. **Service SOAP** (Port 8001) : 
   - Créer le serveur SOAP avec soap-node
   - Implémenter les opérations de gestion utilisateurs
   - Tester avec un client SOAP

6. **Service REST** (Port 8002) : 
   - Créer le serveur REST séparé
   - Implémenter les endpoints articles avec XML/JSON
   - Tester les formats de réponse

7. **Application Java** : 
   - Créer l'interface Swing/JavaFX
   - Implémenter le client SOAP
   - Tester l'authentification et CRUD utilisateurs

8. **Tests locaux** :
   - Tester chaque service indépendamment
   - Vérifier l'intégration entre les composants
   - Valider les 3 types d'utilisateurs

Le tout doit fonctionner en local avec `npm run dev` et l'application Java lancée séparément.