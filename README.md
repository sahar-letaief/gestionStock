# CRUD Produits & Catégories

Node.js (Express) · React (Vite) · MySQL

```
crud-app/
├── backend/           # API REST Express (port 5000)
└── frontend/          # React + Vite (port 5173)
```

> La base de données et les tables sont créées automatiquement par le backend au démarrage.

## Lancer le projet en local

1. **Backend**

   ```bash
   cd backend
   cp .env.example .env    # puis adapter les identifiants MySQL
   npm install
   npm run dev
   ```

2. **Frontend**

   ```bash
   cd frontend
   npm install
   npm run dev
   ```

Ouvrir http://localhost:5173

## API

| Méthode | Route                 | Description          |
|---------|-----------------------|----------------------|
| GET     | /api/categories       | Liste des catégories |
| POST    | /api/categories       | Créer                |
| PUT     | /api/categories/:id   | Modifier             |
| DELETE  | /api/categories/:id   | Supprimer            |
| GET     | /api/products         | Liste des produits   |
| POST    | /api/products         | Créer                |
| PUT     | /api/products/:id     | Modifier             |
| DELETE  | /api/products/:id     | Supprimer            |

---

## Travail demandé

### Partie 1 : Dockerfile et Docker Hub

1. Créer un `Dockerfile` pour chaque projet :
   - `backend/Dockerfile`
   - `frontend/Dockerfile`
2. Construire (build) les deux images et les tagger ainsi :
   - `rch-frontend` pour le frontend
   - `rch-backend` pour le backend
3. Pousser (push) les deux images sur **votre compte Docker Hub**.

### Partie 2 : Docker Compose

4. Créer un fichier `docker-compose.yml` à la racine du projet qui lance les **3 conteneurs** :

   | Service         | Nom du conteneur |
   |-----------------|------------------|
   | Frontend        | `frontend`       |
   | Backend         | `backend`        |
   | Base de données | `db`             |

5. Lancer l'application avec Docker Compose et vérifier que le CRUD fonctionne suivant la configuration du docker compose suivant la commande:

   ```bash
   docker compose up 
   ```

### Indications

- Le backend lit sa configuration MySQL dans les variables d'environnement `DB_HOST`, `DB_USER`, `DB_PASSWORD`, `DB_NAME` et `PORT`.
- Dans Docker Compose, les conteneurs communiquent par leur nom : le backend doit joindre MySQL avec `db` et non `localhost`.
- MySQL met quelques secondes à démarrer : prévoir que le backend attende la base (`depends_on`, `healthcheck`, `restart`…).
- Ne pas copier `node_modules` ni `.env` dans les images (utiliser un `.dockerignore`).

### Partie 3 : CI/CD avec GitHub Actions

6. Créer un workflow `.github/workflows/build.yml` qui **build l'application** (frontend et backend) :
   - installer les dépendances de chaque partie (`npm ci`) ;
   - lancer le build du frontend (`npm run build`).
7. Créer un workflow `.github/workflows/docker.yml` qui **build et push les images Docker** du frontend et du backend sur **votre compte Docker Hub** :
   - `<votre-user>/rch-frontend`
   - `<votre-user>/rch-backend`
8. Déclencher les workflows à chaque `push` sur votre branche et vérifier qu'ils passent au vert dans l'onglet **Actions** du dépôt, puis que les images sont bien présentes sur Docker Hub.

### Indications


- Ne jamais écrire vos identifiants Docker Hub dans un workflow : créer un **Access Token** sur Docker Hub et l'enregistrer dans les **secrets** du dépôt GitHub (`DOCKERHUB_USERNAME`, `DOCKERHUB_TOKEN`).
