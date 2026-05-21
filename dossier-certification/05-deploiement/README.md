# 05 - Déploiement

## Objectif

Documenter la chaîne de déploiement du projet, du poste de développement jusqu'à la mise en production sur Vercel, avec PostgreSQL Neon, Redis et les migrations Prisma.

---

## Preuves & Mapping GitHub

Les éléments de déploiement et d'intégration continue sont documentés dans les tickets et PRs suivants:

- [DevOps / Docker / CI]([Issue #40](https://github.com/arocchet/social-network/issues/40))
- [CI — Lint, test, build, push image]([Issue #45](https://github.com/arocchet/social-network/issues/45))
- [Seed script / demo data (utilisé pour tests locaux)]([Issue #46](https://github.com/arocchet/social-network/issues/46))
- [PR stabilisation (Docker/Neon/Prisma/Redis)]([PR #118](https://github.com/arocchet/social-network/pull/118))

## Docker et Containerisation

### Services principaux

- **app**: application Next.js 15 (App Router), runtime Bun.
- **db**: PostgreSQL pour les données métier (en local) / Neon (en prod).
- **Upstash Redis** (REST): cache léger et buffer de messages pour les flux SSE temps réel. Service managé configuré via variables d'environnement (`UPSTASH_REDIS_REST_URL`, `UPSTASH_REDIS_REST_TOKEN`), sans service Redis local dédié dans `docker-compose.yml`. Pas de pub/sub TCP — polling REST côté SSE.

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

Architecture **multi-stage** : l'étape `builder` compile l'application, l'étape `runner` ne contient que le strict nécessaire pour la production — image finale allégée.

```dockerfile
# ── Stage 1 : build ──────────────────────────────────────────────────────────
FROM oven/bun:1 AS builder
WORKDIR /app

# OpenSSL requis par les engines Prisma
RUN apt-get update -y && apt-get install -y --no-install-recommends openssl ca-certificates \
    && rm -rf /var/lib/apt/lists/*

COPY package.json bun.lock ./
RUN bun install          # installe toutes les dépendances (y compris devDependencies)

COPY . .
RUN bunx prisma generate  # génère le client Prisma typé
RUN bun run build         # compile Next.js en standalone

# ── Stage 2 : runner ─────────────────────────────────────────────────────────
FROM oven/bun:1 AS runner
WORKDIR /app

RUN apt-get update -y && apt-get install -y --no-install-recommends openssl ca-certificates \
    && rm -rf /var/lib/apt/lists/*

# Copie uniquement ce qui est nécessaire à l'exécution
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/.next        ./.next
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/public       ./public
COPY --from=builder /app/prisma       ./prisma

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
EXPOSE 3000

# Au démarrage : applique les migrations Prisma puis lance Next.js
CMD ["sh", "-c", "bunx prisma migrate deploy && bun run start"]
```

Points clés :
- **`prisma generate`** avant le build : génère le client TypeScript Prisma
- **`prisma migrate deploy`** au démarrage : applique les migrations sans recréer le schéma
- **OpenSSL** installé aux deux stages : requis par les engines Prisma natifs
- **Port 3000** exposé, injecté comme variable d'environnement dans docker-compose

---

## Bases de Données

### PostgreSQL sur Neon

- **URL principale**: `DATABASE_URL`.
- **Migrations**: `prisma migrate deploy` en production.
- **Sécurité**: secrets injectés via variables d'environnement, jamais committés.

### Redis

Upstash Redis sert à deux usages dans le projet :

- cache applicatif léger ;
- buffer de messages (clés `latest:chat:{from}:{to}`, `latest:chat:group:{groupId}`) lu par les endpoints **Server-Sent Events** (`/api/private/chat/listen`, `/api/private/chat/typing/listen`) pour pousser les événements aux clients ;
- diffusion des événements SSE/Redis entre instances serverless Vercel (même clé Redis vue par toutes les fonctions).

Le JWT n'est pas stocké côté serveur : il est stateless. Les sessions Redis évoquées dans certaines roadmaps internes (révocation forcée, multi-device, invalidation JWT côté serveur) sont un axe d'amélioration, pas l'implémentation actuelle.

---

## Mise en Production

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

## CI/CD

### GitHub Actions

Un pipeline simple suffit pour ce projet de certification :

- `lint` pour ESLint ;
- `test` pour Jest (via `bun run test`, qui appelle Jest avec `--experimental-vm-modules`) ;
- `build` pour Next.js (avec `prisma generate` préalable) ;
- `deploy` pour Vercel ou un déploiement équivalent.

Le projet utilise **Bun** comme package manager et runtime (cohérent avec `bun.lock` et l'image Docker `oven/bun:1`). Le `package-lock.json` est conservé pour interopérabilité, mais Bun est la source de vérité.

Workflow de déploiement du projet :

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
      - uses: oven-sh/setup-bun@v1
        with:
          bun-version: "1"
      - run: bun install --frozen-lockfile
      - run: bunx prisma generate
      - run: bun run lint
      - run: bun run test
      - run: bun run build
```

---

## Monitoring et Exploitation

### Observabilité

- **Logs applicatifs**: console structurée côté serveur (sortie capturée par Vercel).
- **Vercel Analytics**: suivi des performances front (à activer côté plateforme).
- **Sentry**: *non installé à ce jour*. Présenté comme axe d'amélioration ci-dessous.
- **Alertes**: surveillance des échecs de build et de déploiement via les notifications Vercel + GitHub Actions.

### Réversibilité

Le rollback se fait côté Vercel en cas de régression fonctionnelle ou d'erreur de migration.

```bash
vercel rollback
```

---

## Checklist de Déploiement

- [x] Dockerfile défini à la racine.
- [x] docker-compose.yml pour l'environnement local.
- [x] Variables d'environnement documentées.
- [x] Prisma Migrate pris en compte.
- [x] Redis documenté pour les sessions et le temps réel.
- [x] Déploiement cible sur Vercel.
- [x] Pipeline GitHub Actions documenté.
- [x] Monitoring des erreurs documenté (Vercel Analytics + logs structurés serveur).

---

## Résultat Attendu

Cette section démontre que le projet est déployable de bout en bout: base de données, cache, temps réel, build et supervision sont décrits avec un chemin de mise en production cohérent et réaliste.
