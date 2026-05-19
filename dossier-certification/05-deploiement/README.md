# 05 - Déploiement

## Objectif

Documenter la chaîne de déploiement du projet, du poste de développement jusqu'à la mise en production sur Vercel, avec PostgreSQL Neon, Redis et les migrations Prisma.

---

## 🔎 Preuves & Mapping GitHub

Les éléments de déploiement et d'intégration continue sont documentés dans les tickets et PRs suivants:

- DevOps / Docker / CI: https://github.com/arocchet/social-network/issues/40
- CI — Lint, test, build, push image: https://github.com/arocchet/social-network/issues/45
- Seed script / demo data (utilisé pour tests locaux): https://github.com/arocchet/social-network/issues/46
- PR stabilisation (Docker/Neon/Prisma/Redis): https://github.com/arocchet/social-network/pull/118

## 🐳 Docker et Containerisation

### Services principaux

- **app**: application Next.js 14+.
- **db**: PostgreSQL pour les données métier.
- **Upstash Redis**: service temps réel configuré via variables d’environnement, sans service Redis local dédié dans `docker-compose.yml`.

### docker-compose.yml

La configuration à la racine du projet orchestre l’exécution locale de l’application et de la base de données. Le service `app` utilise le fichier `.env` pour charger les variables nécessaires, notamment l’accès à PostgreSQL et à Upstash Redis.

```yaml
services:
  app:
    profiles: ["prod"]
    build:
      context: .
      dockerfile: Dockerfile
    restart: unless-stopped
    env_file:
      - .env
    environment:
      DATABASE_URL: ${DATABASE_URL}
      NODE_ENV: production
      NEXT_TELEMETRY_DISABLED: "1"
    ports:
      - "3000:3000"

  app-dev:
    profiles: ["dev"]
    image: oven/bun:1
    working_dir: /app
    restart: unless-stopped
    env_file:
      - .env
    environment:
      DATABASE_URL: ${DATABASE_URL}
      NODE_ENV: development
      NEXT_TELEMETRY_DISABLED: "1"
      WATCHPACK_POLLING: "true"
      CHOKIDAR_USEPOLLING: "true"
    command: >
      sh -c "
        bun install &&
        bunx prisma generate &&
        bunx prisma migrate deploy &&
        bun run dev
      "
    ports:
      - "3000:3000"
    volumes:
      - .:/app
      - app-node-modules:/app/node_modules
      - app-next-cache:/app/.next
    stdin_open: true
    tty: true

volumes:
  app-node-modules:
  app-next-cache:
```

### Dockerfile

Le Dockerfile racine suit une logique simple: installer les dépendances, builder l'application puis démarrer le serveur Next.js.

Points importants:

- installation des dépendances avec lockfile;
- génération Prisma avant le build;
- image légère pour la production;
- exposition du port 3000.

---

## 📦 Bases de Données

### PostgreSQL sur Neon

- **URL principale**: `DATABASE_URL`.
- **Migrations**: `prisma migrate deploy` en production.
- **Sécurité**: secrets injectés via variables d'environnement, jamais committés.

### Redis

Redis sert à trois usages:

- sessions serveur pour l'invalidation JWT;
- cache applicatif léger;
- diffusion des événements SSE/Redis entre instances.

---

## 🚀 Mise en Production

### Vercel

Le déploiement cible Vercel pour la partie Next.js.

Flux retenu:

1. push sur la branche principale.
2. build automatique par Vercel.
3. exécution des migrations lors du déploiement si nécessaire.
4. publication avec SSL automatique.

### Variables d'environnement

```bash
DATABASE_URL=postgresql://...
JWT_SECRET=...
OAUTH_TOKEN_ENCRYPTION_KEY=...
UPSTASH_REDIS_REST_URL=https://...
UPSTASH_REDIS_REST_TOKEN=...
CLOUDINARY_CLOUD_NAME=...
CLOUDINARY_API_KEY=...
CLOUDINARY_API_SECRET=...
NEXT_PUBLIC_GIPHY_API_KEY=...
CLIENT_ID=...
CLIENT_SECRET=...
REDIRECT_URL=...
```

> Pour le temps réel, le projet utilise Upstash Redis via `UPSTASH_REDIS_REST_URL` et `UPSTASH_REDIS_REST_TOKEN`.

### Contrôles post-déploiement

- vérifier la page d'accueil et la page de connexion;
- tester la création de post;
- tester un message temps réel;
- vérifier les cookies HTTP-only et les redirections middleware.

---

## 🔄 CI/CD

### GitHub Actions

Un pipeline simple suffit pour ce projet de certification:

- `lint` pour ESLint;
- `test` pour Jest;
- `build` pour Next.js;
- `deploy` pour Vercel ou un déploiement équivalent.

Workflow de déploiement du projet:

```yaml
name: CI

on:
  push:
    branches: [main]
  pull_request:

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
      - run: npm ci
      - run: npm run lint
      - run: npm run test
      - run: npm run build
```

---

## 📊 Monitoring et Exploitation

### Observabilité

- **Logs applicatifs**: console structurée côté serveur.
- **Vercel Analytics**: suivi des performances front.
- **Sentry**: suivi des erreurs et régressions.
- **Alertes**: surveillance des échecs de build et de déploiement.

### Réversibilité

Le rollback se fait côté Vercel en cas de régression fonctionnelle ou d'erreur de migration.

```bash
vercel rollback
```

---

## ✅ Checklist de Déploiement

- [x] Dockerfile défini à la racine.
- [x] docker-compose.yml pour l'environnement local.
- [x] Variables d'environnement documentées.
- [x] Prisma Migrate pris en compte.
- [x] Redis documenté pour les sessions et le temps réel.
- [x] Déploiement cible sur Vercel.
- [x] Pipeline GitHub Actions documenté.
- [ ] Sentry ou équivalent à activer en production.

### Activation et configuration Sentry (option recommandée)

Pour activer le suivi des erreurs en production nous recommandons Sentry. Étapes résumées :

1. Créer un projet sur Sentry (https://sentry.io) et récupérer le `DSN` du projet.
2. Installer et configurer le SDK Next.js : `@sentry/nextjs`.
3. Ajouter les variables d'environnement côté plateforme (`SENTRY_DSN`, `SENTRY_ENVIRONMENT`, `SENTRY_AUTH_TOKEN` si nécessaire pour les releases).
4. Configurer `sentry.client.config.js` et `sentry.server.config.js` selon la documentation officielle.
5. Optionnel : automatiser les releases Sentry dans GitHub Actions (ajout d'un step `sentry-cli` avec `SENTRY_AUTH_TOKEN`).

Exemple d'env vars à définir dans Vercel / Railway / Platform :

```bash
SENTRY_DSN=https://examplePublicKey@o0.ingest.sentry.io/0
SENTRY_ENVIRONMENT=production
SENTRY_TRACES_SAMPLE_RATE=0.1
```

Notes:

- Activer Sentry améliore la traçabilité des erreurs et facilite la correction avant la soutenance.
- L'activation doit être faite avec attention (masquage des données sensibles, conformité RGPD si applicable).

---

## Résultat Attendu

Cette section démontre que le projet est déployable de bout en bout: base de données, cache, temps réel, build et supervision sont décrits avec un chemin de mise en production cohérent et réaliste.
