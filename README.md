# Bloom 🌸 — Suivi d'habitudes

Application web fullstack — TP DWWM 2026

## Description

Bloom est une application de suivi d'habitudes quotidiennes. L'utilisateur crée des objectifs (ex. "10 min d'anglais", "Marcher 30 min"), les coche chaque jour, et observe sa progression sous forme d'un **jardin virtuel** qui pousse au fil du temps.

Plus l'utilisateur est régulier, plus son jardin s'épanouit. Des **badges de constance** récompensent les séries de jours consécutifs (3, 7, 14, 30 jours). Un **journal d'activité** enregistre chaque action en base NoSQL (MongoDB).

## Stack

| Couche | Technologie |
|---|---|
| Front-end | HTML5, CSS3, JavaScript Vanilla |
| Back-end | Node.js 20, Express, architecture MVC |
| BDD relationnelle | MySQL 8 |
| BDD NoSQL | MongoDB 7 + Mongoose |
| Infra | Docker Compose (5 services), Nginx |

## Architecture MVC

```
browser → Nginx :8080
    ├── /          → statiques (HTML/CSS/JS)
    └── /api/      → Express :3000
                        ├── routes/
                        ├── controllers/
                        ├── models/  → MySQL + MongoDB
                        └── config/
```

## API REST

| Méthode | Route | BDD |
|---|---|---|
| GET | `/api/goals/with-streaks` | MySQL |
| POST | `/api/goals` | MySQL + MongoDB |
| DELETE | `/api/goals/:id` | MySQL + MongoDB |
| POST | `/api/checks` | MySQL + MongoDB |
| GET | `/api/logs` | MongoDB |

## Sécurité (OWASP)

- `helmet` — headers HTTP (CSP, HSTS, X-Frame-Options...)
- `express-rate-limit` — anti brute-force
- Requêtes paramétrées — anti-injection SQL
- `createTextNode()` — anti-XSS (zéro `innerHTML`)
- `.env` + `.gitignore` — secrets hors du dépôt

## Lancement

```bash
copy .env.example .env   # configurer les secrets
docker compose up -d --build
```

| Service | URL |
|---|---|
| Application | http://localhost:8080 |
| phpMyAdmin | http://localhost:9090 |

## Compétences DWWM

**AT1 — Front-end**
- ✅ Environnement configuré (Docker, Nginx, `.env`)
- ✅  Maquettes
- ✅ Interfaces statiques (HTML5 sémantique, CSS3 responsive)
- ✅ Interfaces dynamiques (JS, fetch API, DOM API)

**AT2 — Back-end**
- ✅ BDD relationnelle (MySQL, FK, contraintes)
- ✅ Composants SQL (MVC, pool, requêtes paramétrées)
- ✅ Composants NoSQL (MongoDB, Mongoose, logs)
- ✅ Composants métier (`async/await`, streaks, badges)
- ✅ Documentation de déploiement
