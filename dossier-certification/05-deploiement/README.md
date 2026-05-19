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
- **redis**: cache, sessions et pub/sub temps réel.

### docker-compose.yml

La configuration à la racine du projet orchestre les dépendances locales pour reproduire un environnement proche de la production.

```yaml
services:
  app:
    build: .
    ports:
      - "3000:3000"
    environment:
      DATABASE_URL: ${DATABASE_URL}
      REDIS_URL: ${REDIS_URL}
      JWT_SECRET: ${JWT_SECRET}
    depends_on:
      - db
      - redis

  db:
    image: postgres:16-alpine
    ports:
      - "5432:5432"
    environment:
      POSTGRES_DB: social-network
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: postgres

  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"
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
- **URL directe**: `DIRECT_URL` pour Prisma.
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
DIRECT_URL=postgresql://...
REDIS_URL=redis://...
JWT_SECRET=...
OAUTH_TOKEN_ENCRYPTION_KEY=...
NEXT_PUBLIC_APP_URL=https://social-network.example.com
```

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
