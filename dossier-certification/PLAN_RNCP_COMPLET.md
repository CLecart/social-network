# Conformité RNCP 37873 — Social Network

**Candidat :** Christophe Lecart  
**Titre visé :** Concepteur Développeur d'Applications (CDA) — Niveau 6  
**Établissement :** Zone01 Rouen Normandie  
**Projet support :** Social Network (dépôt `arocchet/social-network`)  
**Date :** Mai 2026

> Ce document présente la couverture complète du référentiel RNCP 37873 par le projet Social Network, avec les preuves techniques associées à chaque compétence.

---

##  Structure du Référentiel RNCP 37873

Le titre CDA est organisé en **3 blocs de compétences** couvrant **11 compétences professionnelles** :

| Bloc | Intitulé                                                          | Compétences |
| ---- | ----------------------------------------------------------------- | ----------- |
| BC01 | Développer une application sécurisée                              | C1 → C4     |
| BC02 | Concevoir et développer une application sécurisée organisée en couches | C5 → C8 |
| BC03 | Préparer le déploiement d'une application sécurisée              | C9 → C11    |

---

##  Bloc 1 — Développer une application sécurisée (BC01)

### C1 — Installer et configurer son environnement de travail

**Preuve principale :** Configuration complète de l'environnement de développement.

| Élément                    | Réalisation                                                        |
| -------------------------- | ------------------------------------------------------------------ |
| Environnement local        | Node.js 20+, Bun, TypeScript, ESLint, Prisma CLI                  |
| Base de données locale     | PostgreSQL via Docker Compose (`docker-compose --profile dev`)     |
| Variables d'environnement  | `.env` avec 33 variables documentées (JWT, Cloudinary, OAuth…)    |
| IDE et outils              | VS Code, extensions TypeScript/Prisma, ESLint intégré             |
| Versioning                 | Git + GitHub, branches feature/fix, 100+ commits tracés           |

**Références GitHub :** [Issue #40 — DevOps/Docker/CI](https://github.com/arocchet/social-network/issues/40)

---

### C2 — Développer des interfaces utilisateur

**Preuve principale :** 14 pages responsive implémentées avec Next.js 15 App Router.

| Page                   | Route               | Technologie                      |
| ---------------------- | ------------------- | -------------------------------- |
| Feed principal         | `/`                 | React 19, React Query, SSE       |
| Connexion              | `/login`            | React Hook Form, Zod             |
| Inscription            | `/register`         | React Hook Form, Zod, Cloudinary |
| Onboarding             | `/onboarding`       | Multi-step form                  |
| Profil utilisateur     | `/profile/[userId]` | SSR, SWR                         |
| Chat direct            | `/chat/[id]`        | SSE polling, Redis               |
| Groupes                | `/groups/[id]`      | React Query                      |
| Événements             | `/events`           | React Day Picker                 |
| Reels                  | `/reels`            | Embla Carousel                   |
| Recherche              | `/search`           | Debounce, React Query            |
| Paramètres             | `/settings`         | React Hook Form                  |
| Notifications          | `/notifications`    | SSE, Redis                       |
| Invitations            | `/invitations`      | React Query                      |
| Profil (édition)       | `/settings/profile` | Cloudinary upload                |

**Design system :** Tailwind CSS 4, Shadcn/UI, Radix UI, 110+ composants réutilisables.  
**Responsive :** Mobile (< 640px), Tablet (640–1024px), Desktop (> 1024px).  
**Accessibilité :** Radix UI (composants ARIA), next/image, alt texts.  
**Wireframes & maquettes :** disponibles dans [07-annexes](./07-annexes/).

---

### C3 — Développer des composants métier

**Preuve principale :** Logique métier encapsulée dans des composants et hooks dédiés.

| Fonctionnalité              | Composant/Hook                          | Description                              |
| --------------------------- | --------------------------------------- | ---------------------------------------- |
| Publication de posts        | `PostCreator`, `usePostData`            | Texte + image + visibilité               |
| Réactions (7 types)         | `ReactionButtons`, `ReactionPicker`     | LIKE, DISLIKE, LOVE, LAUGH, SAD, ANGRY, WOW |
| Commentaires                | `CommentList`, `CommentForm`            | Lecture et écriture avec validation      |
| Stories éphémères           | `StoryCreator`, `StoryViewer`           | Upload Cloudinary, 24h TTL               |
| Chat temps réel             | `MessageBox`, `TypingIndicator`         | SSE + Redis polling 500ms                |
| RSVP événements             | `RSVPButtons`                           | YES / NO / MAYBE                         |
| Gestion de groupes          | `GroupSettings`, `InvitationManager`    | Invitations, demandes, membres           |
| Notifications               | `NotificationBadge`                     | SSE, lecture/suppression                 |
| Follow/Friendship           | `FollowButton`                          | Suivi + demandes d'amitié                |

**Validation des données :** Zod schemas côté serveur pour tous les endpoints critiques.

---

### C4 — Contribuer à la gestion de projet

**Preuve principale :** Suivi de projet via GitHub Issues et Pull Requests.

| Pratique                 | Preuve                                                              |
| ------------------------ | ------------------------------------------------------------------- |
| Découpage en tickets     | 13 issues GitHub couvrant toutes les fonctionnalités principales    |
| Pull Requests documentées | PR #118 — stabilisation Docker/Neon/Prisma/Redis                  |
| Documentation technique  | Dossier de certification 60+ pages, API spec, diagrammes           |
| Gestion des branches     | Branches feature/, fix/, docs/ séparées                            |
| Collaboration            | Revues de code, coordination inter-équipe sur issues communes      |

**Références :** [Issue #13](https://github.com/arocchet/social-network/issues/13), [Issue #24](https://github.com/arocchet/social-network/issues/24), [PR #118](https://github.com/arocchet/social-network/pull/118)

---

##  Bloc 2 — Concevoir et développer une application sécurisée organisée en couches (BC02)

### C5 — Analyser les besoins et maquetter une application

**Preuve principale :** Cahier des charges, user stories et maquettes.

| Livrable                  | Contenu                                                   |
| ------------------------- | --------------------------------------------------------- |
| Cahier des charges        | [02-cahier-des-charges/README.md](./02-cahier-des-charges/README.md) — fonctionnalités, contraintes, timeline |
| User stories              | [03-conception/user-stories.md](./03-conception/user-stories.md) — 38+ stories avec critères d'acceptation |
| Wireframes basse-fidélité | 6 wireframes dans [07-annexes](./07-annexes/)             |
| Maquettes haute-fidélité  | 6 maquettes dans [07-annexes](./07-annexes/)              |
| Design system             | Palette, typographie, breakpoints, composants atomiques   |

---

### C6 — Définir l'architecture logicielle d'une application

**Preuve principale :** Architecture 3 couches (Client / Serveur / Données) documentée.

```
┌─────────────────────────────────────────┐
│  COUCHE PRÉSENTATION (React/Next.js)    │
│  - 110+ composants React (Tailwind)     │
│  - 30+ hooks personnalisés              │
│  - React Query + SWR (état serveur)     │
│  - SSE client (notifications/chat)      │
└──────────────────┬──────────────────────┘
                   │ HTTP/REST + SSE
┌──────────────────▼──────────────────────┐
│  COUCHE MÉTIER (Next.js API Routes)     │
│  - 60+ endpoints REST (public/private)  │
│  - Middleware JWT (auth centralisée)    │
│  - Validation Zod (toutes les entrées)  │
│  - Upstash Redis (cache + temps réel)   │
└──────────────────┬──────────────────────┘
                   │ Prisma ORM
┌──────────────────▼──────────────────────┐
│  COUCHE DONNÉES                         │
│  - PostgreSQL Neon (18 modèles)         │
│  - Upstash Redis (TTL 60s, temps réel)  │
│  - Cloudinary (médias, CDN)             │
└─────────────────────────────────────────┘
```

**Choix technologiques justifiés :**

| Composant  | Choix                  | Justification                               |
| ---------- | ---------------------- | ------------------------------------------- |
| Framework  | Next.js 15 + React 19  | SSR + RSC, performances, App Router         |
| Langage    | TypeScript             | Typage fort, sécurité à la compilation      |
| Styling    | Tailwind CSS 4 + ShadCN | Responsive, accessible, maintenable        |
| BDD        | PostgreSQL (Neon)      | ACID, relationnel, serverless               |
| ORM        | Prisma v6              | Type-safe, migrations versionnées           |
| Temps réel | SSE + Upstash Redis    | Serverless-compatible, haute disponibilité  |
| Médias     | Cloudinary             | CDN, transformations, stockage sécurisé     |
| Auth       | JWT (jose) + bcrypt    | Stateless, sécurisé, standard industrie     |

---

### C7 — Concevoir une base de données relationnelle

**Preuve principale :** 18 modèles Prisma normalisés avec contraintes d'intégrité.

| Modèle              | Rôle                                          |
| ------------------- | --------------------------------------------- |
| User                | Entité centrale, profil, visibilité           |
| Post / Comment      | Contenu utilisateur, visibilité granulaire    |
| Reaction            | Polymorphique (post, story, commentaire)      |
| Story               | Contenu éphémère, média Cloudinary            |
| Message / Conversation | Messagerie directe avec statuts SENT/DELIVERED/READ |
| GroupMessage        | Chat de groupe avec association événements    |
| Friendship          | Relation bidirectionnelle avec statut         |
| GroupMember / GroupInvitation / GroupJoinRequest | Cycle de vie complet des groupes |
| Event / Rsvp        | Événements avec réponses YES/NO/MAYBE         |
| UserSettings        | Préférences (thème, langue, notifs)           |
| Account             | Comptes OAuth (Google)                        |
| Notification        | Alertes utilisateur indexées                  |

**Diagrammes :** MCD, MLD et MPD disponibles dans [03-conception/diagrammes-uml.md](./03-conception/diagrammes-uml.md).  
**Normalisation :** 3NF respectée, contraintes d'unicité sur les relations critiques (`userId + postId`, `userId + eventId`…).

---

### C8 — Développer des composants d'accès aux données

**Preuve principale :** Couche d'accès aux données via Prisma ORM + Redis.

| Pattern                      | Implémentation                                                |
| ---------------------------- | ------------------------------------------------------------- |
| CRUD complet                 | `src/lib/server/` — fonctions dédiées par domaine (post, user, chat…) |
| Requêtes optimisées          | `select` Prisma pour limiter les colonnes renvoyées           |
| Pagination                   | Curseur Prisma (`cursor` + `take`) pour le scroll infini      |
| Cache Redis                  | TTL 60s sur les messages, invalidation à l'écriture           |
| Transactions                 | Prisma transactions pour les opérations multi-tables          |
| Migrations versionnées       | `prisma/migrations/` — historique complet                     |
| Tests d'intégration          | `__tests__/integrations/authentification.test.ts` — Jest + base SQLite |

**Sécurité des données :** Prisma empêche nativement les injections SQL (requêtes paramétrées). Zod valide toutes les entrées en amont.

---

##  Bloc 3 — Préparer le déploiement d'une application sécurisée (BC03)

### C9 — Préparer et exécuter les plans de tests d'une application

**Preuve principale :** Stratégie de tests documentée et exécutée.

| Type de test          | Outil                  | Couverture                            |
| --------------------- | ---------------------- | ------------------------------------- |
| Tests d'intégration   | Jest + ts-jest         | Authentification (register + login)   |
| Environnement isolé   | SQLite (DATABASE_TEST_URL) | Isolation complète de la prod       |
| Setup/Teardown global | `jest.globalSetup.ts` + `jest.globalTeardown.ts` | Base de test propre à chaque run |
| Jeux d'essai          | `@faker-js/faker`      | Données réalistes générées            |
| Validation métier     | Tests manuels documentés (07-annexes) | Parcours utilisateur couverts |

**Jeux d'essai documentés :**

| Scenario                | Entrée                     | Résultat attendu          | Statut |
| ----------------------- | -------------------------- | ------------------------- | ------ |
| Inscription             | Email unique + mot de passe | Compte créé, JWT renvoyé  |      |
| Connexion valide        | Email/password corrects    | Token JWT en cookie       |      |
| Connexion invalide      | Mauvais mot de passe       | Erreur 401                |      |
| Création de post        | Texte + image              | Post visible dans le feed |      |
| Follow utilisateur      | User A → User B            | Relation créée            |      |
| Envoi message           | Texte vers conversation    | Message persisté + Redis  |      |
| Réaction sur post       | Type LIKE                  | Compteur mis à jour       |      |
| RSVP événement          | YES/NO/MAYBE               | Réponse enregistrée       |      |

---

### C10 — Préparer et documenter le déploiement d'une application

**Preuve principale :** Containerisation complète Docker avec pipeline CI/CD.

| Livrable                | Contenu                                                         |
| ----------------------- | --------------------------------------------------------------- |
| Dockerfile multi-stage  | Builder (Bun) + Runtime (Node léger), génération Prisma incluse |
| docker-compose.yml      | Profils `prod` et `dev`, PostgreSQL local, volumes persistants  |
| Variables d'env         | 33 variables documentées dans [05-deploiement/README.md](./05-deploiement/README.md) |
| Pipeline CI/CD          | GitHub Actions : lint → test → build (`.github/workflows/ci.yml`) |
| Migrations automatisées | `prisma migrate deploy` exécuté au démarrage du conteneur       |

**Déploiement cible :** Vercel (Next.js) + Neon (PostgreSQL serverless) + Upstash (Redis serverless).

**Commandes de déploiement :**
```bash
# Production locale
docker compose --profile prod up --build

# Développement
docker compose --profile dev up app-dev db

# Production Vercel
git push origin main  # → déclenche CI → build → deploy automatique
```

---

### C11 — Contribuer à la mise en production dans une démarche DevOps

**Preuve principale :** Démarche DevOps documentée et appliquée.

| Pratique DevOps             | Implémentation                                              |
| --------------------------- | ----------------------------------------------------------- |
| Infrastructure as Code      | `Dockerfile` + `docker-compose.yml` versionnés dans Git     |
| Pipeline d'intégration (CI) | GitHub Actions : lint + test + build sur chaque push/PR     |
| Livraison continue (CD)     | Vercel auto-deploy sur merge dans `main`                    |
| Séparation des environnements | `dev` (hot-reload + DB locale) / `prod` (image standalone) |
| Rollback                    | `vercel rollback` — retour immédiat en cas de régression    |
| Observabilité               | Vercel Analytics, logs structurés serveur, health endpoint  |
| Sécurité secrets            | Variables d'environnement injectées, aucun secret committé  |

**Référence :** [Issue #45 — CI lint/test/build/push](https://github.com/arocchet/social-network/issues/45), [PR #118](https://github.com/arocchet/social-network/pull/118)

---

##  Tableau de Synthèse — Couverture RNCP 37873

| Compétence RNCP                                       | Statut | Preuves principales                                     |
| ----------------------------------------------------- | ------ | ------------------------------------------------------- |
| C1 — Configurer l'environnement de travail            |      | Docker, Node/Bun, Prisma, .env, ESLint                 |
| C2 — Développer des interfaces utilisateur            |      | 14 pages, 110+ composants, design system, responsive    |
| C3 — Développer des composants métier                 |      | 60+ endpoints, hooks, Zod, logique sociale complète     |
| C4 — Contribuer à la gestion de projet                |      | 13 issues, PR #118, documentation 60+ pages            |
| C5 — Analyser les besoins et maquetter                |      | Cahier des charges, 38+ user stories, wireframes/mockups |
| C6 — Définir l'architecture logicielle               |      | Architecture 3 couches, diagrammes Mermaid, justifications |
| C7 — Concevoir une base de données relationnelle      |      | 18 modèles, MCD/MLD/MPD, contraintes, migrations        |
| C8 — Développer des composants d'accès aux données   |      | Prisma ORM, Redis cache, pagination curseur, tests      |
| C9 — Préparer et exécuter les plans de tests          |      | Jest, tests intégration auth, jeux d'essai documentés   |
| C10 — Préparer et documenter le déploiement           |      | Dockerfile, docker-compose, CI/CD, variables env        |
| C11 — Contribuer à la mise en production DevOps       |      | GitHub Actions, Vercel CD, rollback, observabilité      |

**Compétences transversales :**

| Compétence                   | Démonstration                                                   |
| ---------------------------- | --------------------------------------------------------------- |
| Communication technique      | Dossier 60+ pages, diagrammes, API spec, README complet         |
| Résolution de problèmes      | Auth middleware, modélisation Prisma complexe, déploiement Docker |
| Apprentissage autonome       | Maîtrise SSE/Redis, Next.js 15 App Router, TypeScript strict    |
| Travail en équipe            | GitHub collaboratif, 13+ issues, revues de code inter-membres   |

---

##  Correspondance Dossier → Blocs RNCP

| Section du dossier               | Bloc(s) RNCP couverts |
| -------------------------------- | --------------------- |
| 00-presentation                  | Profil candidat       |
| 01-introduction                  | Contexte projet       |
| 02-cahier-des-charges            | BC02 / C5             |
| 03-conception (données, UML, stories) | BC02 / C5, C6, C7 |
| 04-developpement (API, code)     | BC01 / C2, C3 + BC02 / C8 |
| 05-deploiement                   | BC03 / C10, C11       |
| 06-bilan                         | Toutes compétences    |
| 07-annexes                       | Preuves concrètes     |
