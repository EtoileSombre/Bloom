# Bloom 🌸

Application web **fullstack** de suivi d'habitudes réalisée dans le cadre du TP DWWM.

## Description

Bloom permet de suivre ses habitudes quotidiennes et de visualiser sa progression sous forme d'un jardin qui pousse 🌱. Les données sont persistées en base de données MySQL via une API REST Node.js.

### Fonctionnalités

- ✅ **Gestion d'objectifs** : Ajoutez, cochez et supprimez vos objectifs quotidiens
- 🔥 **Suivi de séries** : Visualisez vos séries de jours consécutifs (calculées côté serveur)
- 🏆 **Système de badges** : Déverrouillez des badges de constance (3, 7, 14, 30 jours)
- 🌱 **Jardin virtuel** : Votre jardin pousse au fur et à mesure de vos accomplissements
- 🌙 **Mode clair/sombre** : Basculez entre les thèmes selon vos préférences
- 💾 **Persistance en base** : Toutes vos données sont sauvegardées en MySQL

## Technologies utilisées

**Front-end**
- **HTML5** : Structure sémantique de l'application
- **CSS3** : Design responsive avec variables CSS et animations
- **JavaScript (Vanilla)** : Logique dynamique et appels API REST
- **Nginx (Alpine)** : Serveur web + proxy vers l'API

**Back-end**
- **Node.js + Express** : API REST (port 3000)
- **mysql2** : Connexion à la base de données

**Base de données**
- **MySQL 8** : Base de données relationnelle
- **phpMyAdmin** : Interface d'administration

**Sécurité**
- **helmet** : Headers HTTP sécurisés (CSP, X-Frame-Options, HSTS...)
- **express-rate-limit** : Protection anti brute-force (200 req/15 min)
- **Requêtes paramétrées** : Protection anti-injection SQL
- **createTextNode()** : Protection anti-XSS côté front (zéro `innerHTML`)
- **.env** : Secrets hors du code source

**Infrastructure**
- **Docker / Docker Compose** : Conteneurisation et orchestration des 5 services

## Architecture

```
Browser → :8080 (Nginx)
              ├── /        → fichiers statiques (HTML/CSS/JS)
              └── /api/    → :3000 (Express)
                                ├── MySQL  → goals, daily_checks, badges
                                └── MongoDB → logs (journal NoSQL)
```

### Structure du projet

```
Bloom/
├── index.html
├── Dockerfile                  # Image Nginx (front-end)
├── nginx.conf                  # Proxy /api/ → backend
├── docker-compose.yml          # Orchestration des 4 services
├── .dockerignore
├── Assets/
│   ├── css/style.css
│   └── js/
│       ├── api.js              # Client fetch REST
│       ├── actions.js          # Interactions utilisateur
│       ├── render.js           # Affichage
│       ├── storage.js          # Utilitaires (thème)
│       ├── theme.js
│       └── main.js
├── backend/
│   ├── server.js               # API Express (4 routes)
│   ├── package.json
│   └── Dockerfile              # Image Node.js
└── database/
    ├── script.sql              # Schéma de la base
    └── jeu_de_donnees.sql      # Données d'exemple
```

### Services Docker

| Service | Image | Port | Rôle |
|---|---|---|---|
| `frontend` | `nginx:alpine` | `8080` | Fichiers statiques + proxy API |
| `backend` | `node:20-alpine` | `3000` | API REST Express |
| `db` | `mysql:8` | `3306` (interne) | Base de données relationnelle |
| `mongo` | `mongo:7` | `27017` (interne) | Base de données NoSQL (logs) |
| `phpmyadmin` | `phpmyadmin:latest` | `9090` | Interface admin MySQL |

### API REST

| Méthode | Route | BDD | Description |
|---|---|---|---|
| `GET` | `/api/goals/with-streaks` | MySQL | Récupère tous les objectifs + streak + état du jour |
| `POST` | `/api/goals` | MySQL + MongoDB | Crée un objectif (log NoSQL automatique) |
| `DELETE` | `/api/goals/:id` | MySQL + MongoDB | Supprime un objectif (log NoSQL automatique) |
| `POST` | `/api/checks` | MySQL + MongoDB | Coche/décoche pour aujourd'hui (log NoSQL) |
| `GET` | `/api/logs` | MongoDB | Journal des 50 dernières actions |
| `GET` | `/api/logs/:goalId` | MongoDB | Journal d'un objectif spécifique |

### Schéma de la base de données

**MySQL (relationnel) — données structurées**
- **`goals`** : objectifs (titre, icône, couleur)
- **`daily_checks`** : coches journalières par objectif
- **`badges`** : badges débloqués par objectif

**MongoDB (NoSQL) — journal d'activité**
- Collection `logs` : chaque action utilisateur (ajout/suppression/coche) est enregistrée en document JSON avec horodatage. Schéma flexible adapté aux données non-structurées.

## Installation et utilisation

> Prérequis : [Docker Desktop](https://www.docker.com/products/docker-desktop/)

```bash
# 1. Cloner le repository
git clone <url-du-repo>
cd Bloom

# 2. Configurer les variables d'environnement
copy .env.example .env
# Editez .env avec vos propres mots de passe

# 3. Lancer tous les services
docker compose up -d --build
```

| Service | URL |
|---|---|
| Application | http://localhost:8080 |
| phpMyAdmin | http://localhost:9090 |
| API | http://localhost:3000/api/goals/with-streaks |

**Connexion phpMyAdmin :**
- Serveur : `db` — Utilisateur : `bloom` — Mot de passe : `bloompassword`

```bash
# Importer le jeu de données d'exemple
Get-Content database/jeu_de_donnees.sql | docker exec -i bloom-db-1 mysql -ubloom -pbloompassword bloom

# Arrêter tous les services
docker compose down

# Rebuilder après modification du code
docker compose up -d --build
```

## Compétences DWWM couvertes

### Activité Type 1 — Front-end

- ✅ **Configurer l'environnement** : Docker Compose, Nginx, `.env`, `.dockerignore`
- ⚠️ **Maquetter les interfaces** : à compléter (wireframes / Figma)
- ✅ **Interfaces statiques** : HTML5 sémantique + CSS3 responsive (variables, animations)
- ✅ **Interfaces dynamiques** : JS Vanilla, fetch API, DOM API (`createTextNode`, zéro `innerHTML`)

### Activité Type 2 — Back-end

- ✅ **Base de données relationnelle** : MySQL 8 avec clés étrangères, contraintes `UNIQUE`, `CASCADE`
- ✅ **Composants d'accès SQL** : pool de connexions mysql2, requêtes paramétrées (anti-injection)
- ✅ **Composants d'accès NoSQL** : MongoDB via Mongoose, schéma de logs, requêtes `find/sort/limit`
- ✅ **Composants métier serveur** : calcul de streaks, logique de badges, fonctions `async/await`
- ✅ **Documentation de déploiement** : voir section ci-dessous

## Aperçu des fonctionnalités

### Badges de constance

- 🌱 **Débutant** : 3 jours consécutifs
- 🌿 **Constant** : 7 jours consécutifs
- 🌳 **Dévoué** : 14 jours consécutifs
- 🌸 **Maître** : 30 jours consécutifs

### Jardin virtuel

Chaque objectif complété fait pousser une nouvelle plante dans votre jardin. Plus vous êtes constant, plus votre jardin devient luxuriant !

---
**Projet DWWM © 2026** — Application fullstack de suivi d'habitudes

## Documentation de déploiement

### Prérequis

| Outil | Version minimale | Vérification |
|---|---|---|
| Docker Desktop | 24+ | `docker --version` |
| Docker Compose | v2 | `docker compose version` |
| Git | 2+ | `git --version` |

### Déploiement en local

```bash
# 1. Cloner le projet
git clone <url-du-repo>
cd Bloom

# 2. Lancer tous les services (build automatique)
docker compose up -d --build

# 3. Vérifier que tout tourne
docker compose ps

# 4. (Optionnel) Importer le jeu de données d'exemple
Get-Content database/jeu_de_donnees.sql | docker exec -i bloom-db-1 mysql -ubloom -pbloompassword bloom
```

### URLs d'accès

| Service | URL |
|---|---|
| Application | http://localhost:8080 |
| phpMyAdmin | http://localhost:9090 |
| API REST | http://localhost:3000/api/goals/with-streaks |
| Logs NoSQL | http://localhost:3000/api/logs |

### Commandes utiles

```bash
# Voir les logs d un service
docker logs bloom-backend-1 -f

# Arrêter tous les services (données conservées)
docker compose down

# Arrêter ET supprimer les volumes (reset complet)
docker compose down -v

# Rebuilder après modification du code
docker compose up -d --build

# Accéder au shell MySQL
docker exec -it bloom-db-1 mysql -ubloom -pbloompassword bloom
```

### Variables d'environnement

Copier `.env.example` en `.env` et renseigner les valeurs :

| Variable | Description |
|---|---|
| `MYSQL_ROOT_PASSWORD` | Mot de passe root MySQL |
| `MYSQL_DATABASE` | Nom de la base MySQL |
| `MYSQL_USER` | Utilisateur MySQL |
| `MYSQL_PASSWORD` | Mot de passe MySQL |
| `DB_HOST` | Hôte MySQL (= `db` dans Docker) |
| `MONGO_URI` | URI MongoDB |
| `PORT` | Port de l'API (défaut `3000`) |

> ⚠️ Ne jamais commiter `.env` — il est dans `.gitignore`
