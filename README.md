# Site Web d'Actualités

Un projet complet de site web d'actualités avec architecture multi-services comprenant des services SOAP et REST, une interface frontend React, et un client Java.

## 🏗️ Architecture du Projet

Ce projet suit une architecture microservices avec les composants suivants :

### Services Backend
- **Service SOAP** (`soap-service/`) - API SOAP pour l'authentification et la gestion des utilisateurs
- **Service REST** (`rest-service/`) - API REST pour la gestion des articles, catégories et utilisateurs

### Applications Frontend
- **Interface Web** (`frontend/`) - Application React avec TypeScript et Tailwind CSS
- **Client Java** (`java-client/`) - Application console Java pour l'administration

## 🚀 Démarrage Rapide

### Prérequis
- Node.js (v16 ou supérieur)
- Java 11 ou supérieur
- Maven
- Base de données (SQLite par défaut avec Prisma)

### Installation et Lancement

#### Option 1 : Lancement automatique (recommandé)

**Windows :**
```bash
.\start-services.bat
```

**Linux/macOS :**
```bash
./start-services.sh
```

#### Option 2 : Lancement manuel

1. **Service SOAP :**
```bash
cd soap-service
npm install
npm start
```

2. **Service REST :**
```bash
cd rest-service
npm install
npm start
```

3. **Frontend React :**
```bash
cd frontend
npm install
npm start
```

4. **Client Java :**
```bash
cd java-client
mvn clean compile
mvn dependency:copy-dependencies
java -cp "target/classes;target/dependency/*" com.newswebsite.client.NewsClientApplication
```

## 📋 Fonctionnalités

### Service SOAP
- Authentification des utilisateurs
- Gestion des sessions
- Opérations CRUD sur les utilisateurs
- WSDL disponible à `/wsdl`

### Service REST
- API RESTful pour les articles
- Gestion des catégories
- Support multi-format (JSON/XML)
- Pagination et filtrage
- Endpoints de santé (`/health`)

### Interface Web
- Interface utilisateur moderne et responsive
- Gestion des articles et catégories
- Authentification intégrée
- Design avec Tailwind CSS

### Client Java
- Interface console interactive
- Intégration avec le service SOAP
- Gestion des erreurs d'authentification
- Menu administrateur sécurisé

## 🔧 Configuration

### Ports par Défaut
- Service SOAP : `http://localhost:3001`
- Service REST : `http://localhost:3002`
- Frontend React : `http://localhost:3000`

### Base de Données
Le projet utilise Prisma avec SQLite par défaut. Les schémas sont définis dans :
- `soap-service/prisma/schema.prisma`
- `rest-service/prisma/schema.prisma`

## 📁 Structure du Projet

```
Site Web actualités/
├── soap-service/          # Service SOAP Node.js
│   ├── server.js
│   ├── wsdl/
│   └── prisma/
├── rest-service/          # Service REST Node.js
│   ├── server.js
│   └── prisma/
├── frontend/              # Application React
│   ├── src/
│   ├── public/
│   └── package.json
├── java-client/           # Client Java
│   ├── src/main/java/
│   └── pom.xml
├── start-services.bat     # Script de lancement Windows
├── start-services.sh      # Script de lancement Unix
└── README.md
```

## 🛠️ Technologies Utilisées

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
- Gestion des erreurs sécurisée
- Protection CORS configurée
- Rate limiting sur les APIs

## 🧪 Tests et Développement

### Endpoints de Test

**Service SOAP :**
- WSDL : `http://localhost:3001/wsdl`
- Service : `http://localhost:3001/soap`

**Service REST :**
- Santé : `http://localhost:3002/health`
- Articles : `http://localhost:3002/api/rest/articles`
- Catégories : `http://localhost:3002/api/rest/categories`

## 📝 Contribution

1. Forkez le projet
2. Créez une branche pour votre fonctionnalité (`git checkout -b feature/nouvelle-fonctionnalite`)
3. Committez vos changements (`git commit -m 'Ajout d\'une nouvelle fonctionnalité'`)
4. Poussez vers la branche (`git push origin feature/nouvelle-fonctionnalite`)
5. Ouvrez une Pull Request

## 📄 Licence

Ce projet est sous licence MIT. Voir le fichier `LICENSE` pour plus de détails.

## 🆘 Support

Pour toute question ou problème, veuillez ouvrir une issue sur le dépôt GitHub.

---

**Développé avec ❤️ pour l'apprentissage des architectures microservices**