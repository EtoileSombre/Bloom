# Présentation du projet Bloom

Ce projet a été réalisé dans le cadre de ma formation DWWM. Le sujet m'a été donné sur la plateforme STUDI. Il s'agit d'un projet fullstack qui couvre toutes les compétences du référentiel.

---

## Installation et configuration de mon environnement de travail

J'ai commencé par créer un nouveau repository sur mon compte GitHub que j'ai nommé **bloom** (Capture 1 en Annexes) et défini en mode public. Ensuite dans mon VS Code, j'ai utilisé la commande `git clone` pour récupérer le projet sur ma machine.

J'ai conteneurisé l'environnement de développement avec **Docker Desktop**. Le projet démarre via un fichier `docker-compose.yml` (Capture 2 en Annexes) qui orchestre **cinq services** :
- **frontend** — serveur Nginx qui sert les fichiers statiques (HTML/CSS/JS) sur le port 8080
- **backend** — serveur Node.js/Express (API REST) sur le port 3000
- **db** — base de données MySQL 8 avec healthcheck automatique
- **mongo** — base de données MongoDB 7 pour le journal d'activité
- **phpmyadmin** — interface d'administration MySQL accessible sur le port 9090

Pour démarrer l'environnement, j'utilise la commande :

```
docker compose up -d --build
```

Pour versionner mon travail, j'ai suivi une stratégie de branches Git :

- Créer une branche : `git checkout -b feat/branch-name`
- Ajouter, commiter et pousser après chaque avancée :
  ```
  git add .
  git commit -m "message"
  git push origin feat/branch-name
  ```
- Une fois la fonctionnalité validée, fusionner vers main :
  ```
  git checkout main
  git merge feat/branch-name
  git push origin main
  ```

---

## Création des éléments graphiques

J'ai utilisé **Figma** pour élaborer la charte graphique, le logo (Capture 3 en Annexes), les maquettes Wireframes (Mobile Capture 4 en Annexes et Desktop Capture 5 en Annexes) et les maquettes Mockup (Mobile Capture 6 en Annexes et Desktop Capture 7 en Annexes).

J'ai défini une palette de couleurs personnalisée intégrée comme **variables CSS** directement dans le fichier `style.css` :
- Mode sombre (défaut) : fond `#0f1216`, texte `#e9edf3`, cartes `#151a21`
- Mode clair : fond `#f7f8fb`, texte `#1f2430`, cartes `#ffffff`
- Couleur principale `--brand` : violet `#8b5cf6`
- Couleur d'accent `--accent` : vert `#22c55e` pour la progression

L'application propose également un **basculement de thème clair/sombre**, persisté en `localStorage` et respectant automatiquement la préférence système de l'utilisateur (`prefers-color-scheme`).

---

## Développement des interfaces utilisateur

J'ai créé une interface **single-page** (`index.html`) qui regroupe l'ensemble des fonctionnalités : ajout d'objectifs avec choix d'icône, liste des objectifs avec case à cocher, jardin virtuel, barre de progression, et affichage des badges de constance.

La structuration des contenus a été faite en **HTML5** en respectant les standards d'accessibilité pour garantir une expérience utilisateur inclusive :
- Utilisation des balises sémantiques `<header>`, `<nav>`, `<main>`, `<section>`, `<article>`, `<footer>` (Capture 8 en Annexes)
- Lien d'évitement `<a class="sr-only" href="#main">Aller au contenu</a>` pour la navigation clavier
- Classes `.sr-only` pour les labels visibles uniquement par les lecteurs d'écran
- Attributs `aria-label`, `aria-pressed`, `role="list"` / `role="listitem"` sur les éléments interactifs
- Gestion du focus visible via `:focus-visible` avec un contour coloré (`--brand`)

J'ai également intégré les éléments interactifs : formulaire d'ajout d'objectif avec sélecteur d'icône emoji, cases à cocher par objectif, boutons de suppression, et bouton de bascule de thème.

---

## Mise en forme et personnalisation des styles

Pour ce projet j'ai utilisé du **CSS3 pur** sans framework, avec un système de variables CSS personnalisées (Capture 9 en Annexes) déclarées dans la pseudo-classe `:root` et surchargées via la classe `.light` sur la balise `<html>` pour le mode clair.

J'ai créé des **composants réutilisables** (Capture 10 en Annexes) :
- Boutons `.btn` (rempli) et `.btn.ghost` (contour transparent)
- Cartes `.card` avec fond `--card`, bordure `--ring` et ombre portée
- Grille responsive `.grid` avec `grid-template-columns: repeat(auto-fill, minmax(260px, 1fr))` s'adaptant automatiquement à toutes les tailles d'écran
- Barre de progression `.progress-bar` avec transition CSS animée (`transition: width .3s ease`)
- Vue jardin `.garden-view` avec dégradé vert en fond

---

## Intégration des interactions utilisateur

J'ai utilisé **JavaScript Vanilla** pour l'ensemble des fonctionnalités dynamiques, organisé en un **espace de noms** `window.Bloom` réparti en plusieurs modules (Capture 11 en Annexes) :
- `storage.js` — utilitaires globaux (`ns.$` sélecteur, `ns.storage` pour le `localStorage`)
- `api.js` — client REST (appels `fetch` vers `/api/goals`, `/api/checks`)
- `render.js` — construction et mise à jour du DOM
- `actions.js` — gestion des événements utilisateur (cocher, ajouter, supprimer)
- `theme.js` — basculement clair/sombre
- `main.js` — initialisation de l'application

Validation des formulaires côté client avant envoi (champ titre obligatoire, longueur maximale) avec messages de retour accessibles via une région `aria-live`.

---

## Utilisation de JavaScript pour la partie dynamique

J'ai utilisé `addEventListener()` sur les événements `DOMContentLoaded`, `click`, `submit` et `change` pour piloter les comportements dynamiques de l'interface (Capture 12 en Annexes).

La récupération et l'affichage des objectifs se font avec l'**API Fetch** via des fonctions asynchrones (`async/await`). À chaque action (ajout, cochage, suppression), un appel API est déclenché puis la vue est entièrement reconstruite pour rester synchronisée avec la base de données (Capture 13 en Annexes).

J'ai géré les états d'interface en désactivant le bouton de soumission tant que le titre est vide, et en affichant des messages d'état accessibles (`aria-live="polite"`) pour guider l'utilisateur.

J'ai manipulé le DOM en créant **dynamiquement tous les éléments** via `document.createElement()` et `document.createTextNode()`, sans jamais utiliser `innerHTML` — ce qui protège contre les injections XSS (Capture 14 en Annexes). La fonction `buildCard()` dans `render.js` construit chaque carte d'objectif avec ses attributs `aria-label`, son état coché, son compteur de série (🔥 streak) et son bouton de suppression.

---

## Développement du back-end (Node.js / Express)

J'ai développé une **API REST** avec Node.js et le framework Express, organisée selon une architecture **MVC** :
- `routes/` — déclaration des endpoints
- `controllers/` — logique métier (`goalController.js`, `checkController.js`, `logController.js`)
- `models/` — accès aux données (`GoalModel.js` pour MySQL, `LogModel.js` pour MongoDB)
- `config/db.js` — connexions pool MySQL et Mongoose

Les endpoints exposés sont (Capture 15 en Annexes) :

| Méthode | Route | Base de données |
|---|---|---|
| GET | `/api/goals/with-streaks` | MySQL |
| POST | `/api/goals` | MySQL + MongoDB |
| DELETE | `/api/goals/:id` | MySQL + MongoDB |
| POST | `/api/checks` | MySQL + MongoDB |
| GET | `/api/logs` | MongoDB |

Le calcul du **streak** (série de jours consécutifs) est réalisé côté serveur dans `GoalModel.findAllWithStreaks()` : pour chaque objectif, on remonte jour par jour en arrière dans les `daily_checks` jusqu'à trouver un jour manqué.

Chaque action (ajout, suppression, cochage, décochage) est également enregistrée dans **MongoDB** via le `LogModel` afin de constituer un journal d'activité.

---

## Sécurité (OWASP)

La sécurité a constitué une préoccupation centrale tout au long du développement du projet. J'ai appliqué plusieurs mesures issues du référentiel OWASP Top 10 afin de prévenir les vulnérabilités les plus courantes (Capture 47 en Annexes).

**Protection des en-têtes HTTP avec `helmet`**
Le middleware `helmet` est appliqué en premier dans la chaîne Express. Il positionne automatiquement un ensemble d'en-têtes HTTP de sécurité : Content-Security-Policy (CSP), Strict-Transport-Security (HSTS), X-Frame-Options et X-Content-Type-Options. Ces en-têtes réduisent significativement la surface d'attaque côté navigateur.

**Limitation du débit avec `express-rate-limit`**
Afin de prévenir les attaques par force brute et le déni de service applicatif, j'ai configuré un limiteur de requêtes : chaque client est limité à 200 requêtes par tranche de 15 minutes. Au-delà de ce seuil, le serveur retourne une erreur 429 avec un message explicite.

**Prévention des injections SQL par requêtes paramétrées**
Toutes les requêtes MySQL sont rédigées avec des placeholders `?` fournis par la bibliothèque `mysql2`. Les valeurs utilisateur ne sont jamais concaténées dans les chaînes SQL. Cette approche élimine le risque d'injection SQL, classée A03 dans l'OWASP Top 10.

**Prévention des injections XSS par manipulation sûre du DOM**
Côté front-end, le code JavaScript n'utilise jamais `innerHTML`. Tout le contenu dynamique est inséré dans le DOM exclusivement via `document.createTextNode()` et `document.createElement()`. Cette pratique neutralise les attaques de type Cross-Site Scripting (XSS, A07 OWASP) en empêchant l'interprétation de balises HTML injectées.

**Validation et sanitisation des entrées côté serveur**
Avant toute écriture en base de données, les entrées utilisateur sont traitées par la fonction `sanitizeString()` qui supprime les caractères de contrôle et tronque les chaînes à une longueur maximale. Cette validation côté serveur est indépendante de toute validation côté client, conformément au principe de défense en profondeur.

**Protection des secrets avec `.env` et `.gitignore`**
Les informations sensibles (mots de passe MySQL, URI MongoDB, variables d'environnement) sont stockées dans un fichier `.env` exclu du dépôt Git via `.gitignore`. Le dépôt ne contient donc jamais de credentials en clair.

---

## Pour ce projet j'ai utilisé

**Outils :**
- **Figma** pour la réalisation des maquettes Wireframes et Mockup
- **Visual Studio Code** pour un développement efficace
- **Docker Desktop** et **Docker Compose** pour la conteneurisation de l'environnement (Nginx, Node.js, MySQL 8, MongoDB 7, phpMyAdmin)
- **Git** et **GitHub** pour le versioning et la gestion des branches

**Frontend :**
- HTML5, CSS3 (variables CSS, Flexbox, CSS Grid)
- JavaScript Vanilla (ES5/ES6, namespace pattern `window.Bloom`, Fetch API)

**Backend :**
- Node.js 20, Express 4
- `helmet`, `express-rate-limit`, `mysql2`, `mongoose`

**Bases de données :**
- MySQL 8 — données relationnelles (objectifs, coches journalières)
- MongoDB 7 — journal d'activité NoSQL (logs d'actions)
