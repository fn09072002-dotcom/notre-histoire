# ❤️ Notre Histoire

Un site privé pour garder notre histoire : la chronologie de notre couple,
nos souvenirs en photos/vidéos/musique, nos messages, et nos projets
d'avenir.

## Stack

- **Frontend** : React 19 + Vite + React Router (`src/`)
- **Backend** : PHP (API simple sans framework, `backend/`)
- **Base de données** : MySQL 8.4 via Docker (`docker-compose.yml`)

## Démarrage

### 1. Base de données

```bash
docker compose up -d
docker exec -i notre-histoire-mysql mysql -uroot -proot notre_histoire < backend/database/schema.sql
```

Ce fichier est safe à relancer (`IF NOT EXISTS`) : si tu avais déjà une
base créée avec une version précédente du projet, réimporte-le simplement
pour ajouter les nouvelles tables `messages` et `projets_futurs`.

### 2. Backend (API PHP)

Depuis la racine du dossier `backend/` :

```bash
cd backend
php -S localhost:8000
```

Tu peux vérifier que la connexion à la base fonctionne en ouvrant
`http://localhost:8000/test-db.php`.

### 3. Frontend

```bash
npm install
npm run dev
```

Le site est servi sur `http://localhost:5173`.

## Fonctionnalités

- **Accueil** : compteur de durée du couple en temps réel, dates clés,
  citation, aperçu de la timeline.
- **Notre histoire** : la chronologie complète (`src/data/histoire.json`),
  facile à compléter en ajoutant des entrées au fichier.
- **Souvenirs** : galerie connectée à l'API PHP/MySQL, avec upload de
  photos, vidéos et musique, et visionneuse plein écran.
- **Ajouter un souvenir** : formulaire qui envoie titre, date, lieu,
  description, photos, vidéos et musique au backend.
- **Messages** : chacun peut choisir son nom (Fatou / Abdou), écrire un
  message et l'envoyer — les messages s'affichent dans un fil, du plus
  récent au plus ancien, avec suppression possible.
- **Notre futur** : ajoutez des rêves, objectifs ou voyages à faire à
  deux, classés par type, cochez-les une fois réalisés (ils basculent
  automatiquement dans la liste "Réalisés ❤️").

## Structure du backend

```
backend/
  api/souvenirs/
    create-with-photos.php   # créer un souvenir + upload photos/vidéos/musique
    create.php                # créer un souvenir (sans fichiers, JSON)
    list.php                  # lister les souvenirs avec leurs photos/vidéos
  api/messages/
    create.php                # envoyer un message
    list.php                  # lister les messages
    delete.php                 # supprimer un message
  api/futur/
    create.php                # ajouter un rêve/projet/voyage
    list.php                  # lister les projets (à réaliser puis réalisés)
    toggle.php                 # marquer un projet comme réalisé / non réalisé
    delete.php                 # supprimer un projet
  config/database.php         # connexion PDO à MySQL
  database/schema.sql         # schéma des tables
  uploads/                    # fichiers reçus (photos, vidéos, musique)
```

## Prochaines idées

- Ajouter la suppression/édition d'un souvenir.
- Ajouter une authentification simple (le site est privé).
- Notifications quand l'autre ajoute un souvenir, un message ou un projet.
