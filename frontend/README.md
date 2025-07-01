# Interface Frontend - Site Web d'Actualités

Interface utilisateur moderne développée avec React et TypeScript pour le site web d'actualités.

## 🚀 Scripts Disponibles

Dans le répertoire du projet, vous pouvez exécuter :

### `npm start`

Lance l'application en mode développement.\
Ouvrez [http://localhost:3000](http://localhost:3000) pour la voir dans le navigateur.

La page se rechargera si vous effectuez des modifications.\
Vous verrez également les erreurs de lint dans la console.

### `npm test`

Lance le testeur en mode interactif.\
Consultez la section sur [l'exécution des tests](https://facebook.github.io/create-react-app/docs/running-tests) pour plus d'informations.

### `npm run build`

Construit l'application pour la production dans le dossier `build`.\
Il regroupe correctement React en mode production et optimise la construction pour de meilleures performances.

La construction est minifiée et les noms de fichiers incluent les hachages.\
Votre application est prête à être déployée !

Consultez la section sur [le déploiement](https://facebook.github.io/create-react-app/docs/deployment) pour plus d'informations.

### `npm run eject`

**Note : c'est une opération à sens unique. Une fois que vous `eject`, vous ne pouvez pas revenir en arrière !**

Si vous n'êtes pas satisfait de l'outil de construction et des choix de configuration, vous pouvez `eject` à tout moment. Cette commande supprimera la dépendance de construction unique de votre projet.

Au lieu de cela, elle copiera tous les fichiers de configuration et les dépendances transitives (webpack, Babel, ESLint, etc.) directement dans votre projet afin que vous ayez un contrôle total sur eux. Toutes les commandes sauf `eject` fonctionneront toujours, mais elles pointeront vers les scripts copiés afin que vous puissiez les modifier. À ce stade, vous êtes seul.

Vous n'avez jamais besoin d'utiliser `eject`. L'ensemble de fonctionnalités organisé convient aux déploiements petits et moyens, et vous ne devriez pas vous sentir obligé d'utiliser cette fonctionnalité. Cependant, nous comprenons que cet outil ne serait pas utile si vous ne pouviez pas le personnaliser lorsque vous êtes prêt.

## 🛠️ Technologies Utilisées

- **React** - Bibliothèque d'interface utilisateur
- **TypeScript** - Typage statique pour JavaScript
- **Tailwind CSS** - Framework CSS utilitaire
- **Vite** - Outil de construction rapide
- **React Router** - Routage côté client
- **Axios** - Client HTTP pour les appels API

## 📋 Fonctionnalités

- Interface utilisateur moderne et responsive
- Authentification des utilisateurs
- Gestion des articles et catégories
- Navigation intuitive
- Design adaptatif pour mobile et desktop
- Intégration avec les services SOAP et REST

## 🔧 Configuration

### Variables d'Environnement

Créez un fichier `.env` dans le répertoire frontend :

```env
REACT_APP_API_URL=http://localhost:3001
REACT_APP_REST_API_URL=http://localhost:3002
REACT_APP_SOAP_API_URL=http://localhost:3001
```

### Structure du Projet

```
src/
├── components/          # Composants React réutilisables
├── pages/              # Pages de l'application
├── services/           # Services pour les appels API
├── hooks/              # Hooks React personnalisés
├── types/              # Définitions TypeScript
├── utils/              # Fonctions utilitaires
└── styles/             # Styles CSS globaux
```

## 📚 En Savoir Plus

Vous pouvez en savoir plus dans la [documentation Create React App](https://facebook.github.io/create-react-app/docs/getting-started).

Pour apprendre React, consultez la [documentation React](https://fr.reactjs.org/).

## 🤝 Contribution

1. Forkez le projet
2. Créez votre branche de fonctionnalité (`git checkout -b feature/nouvelle-fonctionnalite`)
3. Committez vos changements (`git commit -m 'Ajout d\'une nouvelle fonctionnalité'`)
4. Poussez vers la branche (`git push origin feature/nouvelle-fonctionnalite`)
5. Ouvrez une Pull Request

---

**Partie du projet Site Web d'Actualités - Interface Frontend React**
