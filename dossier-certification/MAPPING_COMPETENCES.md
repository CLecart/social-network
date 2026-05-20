#  Mapping RNCP 37873 — 11 compétences → preuves projet

Ce document est **le point d'entrée pour le jury**. Pour chaque compétence du référentiel RNCP 37873 (Concepteur Développeur d'Applications), il indique :

- la définition officielle,
- les **preuves concrètes** dans le projet Social Network (fichiers code, sections du dossier, issues GitHub, PR),
- le **niveau de couverture** ( Démontré /  Partiel /  Non couvert),
- les **éléments à montrer pendant la soutenance** (extraits de code, captures, diagrammes).

Le projet est porté par une équipe (`arocchet/social-network`) ; **Christophe Lecart** y a contribué à hauteur de **57 commits** (2ᵉ contributeur). Les commits personnels les plus représentatifs sont indiqués pour chaque compétence quand applicable.

---

##  Vue d'ensemble

| # | Bloc | Compétence | Couverture | Section dossier |
|---|---|---|---|---|
| 1 | B1 | Installer et configurer son environnement de travail |  | [05-deploiement](./05-deploiement/README.md) |
| 2 | B1 | Développer des interfaces utilisateur |  | [03-conception](./03-conception/README.md), [04-developpement](./04-developpement/README.md) |
| 3 | B1 | Développer des composants métier |  | [04-developpement](./04-developpement/README.md), [api-spec](./04-developpement/api-spec.md) |
| 4 | B1 | Contribuer à la gestion d'un projet informatique |  | [02-cahier-des-charges](./02-cahier-des-charges/README.md), preuves GitHub |
| 5 | B2 | Analyser les besoins et maquetter une application |  | [03-conception](./03-conception/README.md), [annexes mockups](./07-annexes/) |
| 6 | B2 | Définir l'architecture logicielle d'une application |  | [04-developpement](./04-developpement/README.md), [diagrammes-uml](./03-conception/diagrammes-uml.md) |
| 7 | B2 | Concevoir et mettre en place une base de données relationnelle |  | [donnees.md](./03-conception/donnees.md), [diagrammes-uml.md](./03-conception/diagrammes-uml.md) |
| 8 | B2 | Développer des composants d'accès aux données SQL et NoSQL |  | [04-developpement](./04-developpement/README.md) |
| 9 | B3 | Préparer et exécuter les plans de tests d'une application |  | [04-developpement](./04-developpement/README.md), [tests-strategy](./04-developpement/tests-strategy.md) |
| 10 | B3 | Préparer et documenter le déploiement d'une application |  | [05-deploiement](./05-deploiement/README.md) |
| 11 | B3 | Contribuer à la mise en production dans une démarche DevOps |  | [05-deploiement](./05-deploiement/README.md) |

**Sécurité (transverse aux 3 blocs) :** [04-developpement/securite-rgpd.md](./04-developpement/securite-rgpd.md)

---

##  BLOC 1 — Développer une application sécurisée

### Compétence 1 — Installer et configurer son environnement de travail en fonction du projet

> *Outils de développement, conteneurs, gestionnaire de paquets, intégration continue*

**Couverture :  Démontré**

**Preuves concrètes :**

| Élément | Localisation |
|---|---|
| Environnement Docker reproductible | `Dockerfile` + `docker-compose.yml` à la racine |
| Image runtime Bun (cohérence runtime + build) | `Dockerfile` ligne 2 : `FROM oven/bun:1` |
| Configuration `.env` documentée | `.env.exemple` (12 variables) |
| Migrations Prisma automatisées | `Dockerfile` ligne finale : `bunx prisma migrate deploy` |
| Variables d'environnement isolées | `docker-compose.yml` lignes 5-9 |
| Stack locale complète | services `app`, `db` (PostgreSQL 16), `redis` (Redis 7) |
| Section dossier dédiée | [05-deploiement/README.md](./05-deploiement/README.md) |
| Issue GitHub | [#40 DevOps/Docker/CI](https://github.com/arocchet/social-network/issues/40) |

**À montrer en soutenance :**
- `docker-compose up` qui démarre tout l'environnement en une commande
- Le `Dockerfile` multi-stage (builder Bun → runner Bun, OpenSSL pour Prisma)
- L'absence totale de credentials hardcodés (`grep -r "JWT_SECRET\s*=" src/` → uniquement référence à `process.env.JWT_SECRET`)

---

### Compétence 2 — Développer des interfaces utilisateur

> *Maquettes, design system, accessibilité, responsive, composants réutilisables*

**Couverture :  Démontré**

**Preuves concrètes :**

| Élément | Localisation |
|---|---|
| 14 pages principales documentées | [03-conception/pages.md](./03-conception/pages.md) |
| Wireframes + mockups Figma | [07-annexes/](./07-annexes/) (Wireframe_*.png, Mockups_*.png) |
| Design system (palette dark, typo Geist, breakpoints) | [03-conception/README.md](./03-conception/README.md) sections « Design System » |
| Composants UI réutilisables | `src/components/ui/` (50+ composants Radix UI + shadcn) |
| Composants métier | `src/components/feed/`, `chat/`, `groups/`, `auth/` |
| Responsive design (3 breakpoints) | Tailwind CSS — `tailwind.config.js` |
| Thème clair/sombre | `next-themes`, `src/hooks/use-theme.ts` |
| i18n (FR/EN) | Issue [#76](https://github.com/arocchet/social-network/issues/76) |
| Settings utilisateur (theme, language) | `src/app/api/private/user/settings/route.ts` |

**À montrer en soutenance :**
- Démo navigation sur mobile et desktop (responsive)
- Switch thème clair/sombre en direct
- Switch langue FR/EN
- Capture mockup → rendu final côte-à-côte pour 1-2 écrans clés (feed, profil)

---

### Compétence 3 — Développer des composants métier

> *Logique applicative, POO, API REST, refactoring, tests unitaires, cryptographie*

**Couverture :  Démontré**

**Preuves concrètes :**

| Élément | Localisation |
|---|---|
| 60+ endpoints REST organisés en couches | [04-developpement/api-spec.md](./04-developpement/api-spec.md) |
| Composants métier (posts, réactions, follow, chat, groupes, événements) | `src/lib/server/` (queries + business logic) |
| Validation systématique (36 schémas Zod) | `src/lib/schemas/` |
| Cryptographie : JWT signé HS256 via `jose` | `src/lib/jwt/signJwt.ts`, `verifyJwt.ts` |
| Cryptographie : bcrypt cost 12 | `src/lib/security/hash.ts` |
| Réponses normalisées | `src/lib/server/api/response.ts` (`respondSuccess` / `respondError`) |
| Helpers d'auth | `src/lib/server/api/getUserId.ts` |
| OAuth Google complet | `src/app/api/public/auth/redirect/google/route.ts` + `callback/google/route.ts` |
| Test d'intégration auth | `__tests__/integrations/authentification.test.ts` |

**Commits personnels de Christophe les plus représentatifs :**
- Système de réactions (likes posts/comments/stories) — fonctionnalité métier complète
- Refacto Prisma + alignement schema (commit `06fe9e5`)
- Stabilisation déploiement / dépendances (commit `c3748ea`)

**À montrer en soutenance :**
- Parcours d'une requête : `POST /api/private/post` (frontend → API route → schema Zod → query Prisma → réponse normalisée)
- Le système de réactions (cas d'unicité par `@@unique([userId, postId])`)
- Démo JWT : inspection du cookie `authToken` dans l'onglet Application des DevTools

---

### Compétence 4 — Contribuer à la gestion d'un projet informatique

> *Organisation, planification, communication, Git, suivi de tickets*

**Couverture :  Démontré**

**Preuves concrètes :**

| Élément | Localisation |
|---|---|
| Repo GitHub structuré | [arocchet/social-network](https://github.com/arocchet/social-network) |
| Issues GitHub par fonctionnalité (12 issues majeures) | Section « Preuves GitHub » dans [02-cahier-des-charges](./02-cahier-des-charges/README.md) |
| PR de stabilisation | [PR #118](https://github.com/arocchet/social-network/pull/118) (Docker/Neon/Prisma/Redis) |
| Branches feature → merge | Historique `git log` |
| 43 user stories priorisées | [03-conception/user-stories.md](./03-conception/user-stories.md) |
| Timeline en 3 phases (MVP / Features / Polish) | [02-cahier-des-charges](./02-cahier-des-charges/README.md) section Timeline |
| Travail en équipe (6 contributeurs) | `git shortlog -sn` |
| Contribution Christophe : **57 commits** (2ᵉ contributeur) | [contribution-personnelle.md](./contribution-personnelle.md) |

**À montrer en soutenance :**
- Une issue représentative et la branche/PR qui la résout
- Le `git shortlog` montrant la contribution équipe
- La structure des commits de Christophe (par domaine : réactions, certification, refacto)

---

##  BLOC 2 — Concevoir et développer une application sécurisée organisée en couches

### Compétence 5 — Analyser les besoins et maquetter une application

> *User stories, wireframes, prototypes, validation utilisateur*

**Couverture :  Démontré**

**Preuves concrètes :**

| Élément | Localisation |
|---|---|
| Cahier des charges complet | [02-cahier-des-charges/README.md](./02-cahier-des-charges/README.md) |
| 43 user stories format Agile | [03-conception/user-stories.md](./03-conception/user-stories.md) |
| Wireframes (login, feed, profil, settings, story viewer, create post) | [07-annexes/](./07-annexes/) (Wireframe_*.png) |
| Mockups graphiques aboutis | [07-annexes/](./07-annexes/) (Mockups_*.png) |
| Critères d'acceptation par US | user-stories.md, chaque US |
| Priorisation HIGH/MEDIUM/LOW | user-stories.md |
| Découpage Phase 1/2/3 | [02-cahier-des-charges](./02-cahier-des-charges/README.md) Timeline |

**À montrer en soutenance :**
- 1 user story complète : du wording (« En tant que… je veux… ») au critère d'acceptation
- 1 wireframe → 1 mockup → 1 capture du rendu réel
- Le tableau de priorisation

---

### Compétence 6 — Définir l'architecture logicielle d'une application

> *Architecture en couches, diagrammes UML (classes, séquence, cas d'utilisation), stratégie de sécurité*

**Couverture :  Démontré**

**Preuves concrètes :**

| Élément | Localisation |
|---|---|
| Architecture système (Mermaid) | [04-developpement/README.md](./04-developpement/README.md) section « Diagrammes d'Architecture » |
| Diagramme de séquence Auth (login) | idem section « Auth Flow (Login) » |
| Diagramme de séquence Real-time messaging (SSE + Redis) | idem section « Real-time Messaging Sequence » |
| Diagramme de classes UML (18 entités) | [03-conception/diagrammes-uml.md](./03-conception/diagrammes-uml.md) §4.2 |
| Diagramme de cas d'utilisation UML | idem §5.2 (radial, acteurs satellites) |
| Architecture en couches (client / API / business / data) | [04-developpement/README.md](./04-developpement/README.md) section « Structure de Code » |
| Stratégie de sécurité | [04-developpement/securite-rgpd.md](./04-developpement/securite-rgpd.md) |
| Justification choix techniques | [PLAN_RNCP_COMPLET.md](./PLAN_RNCP_COMPLET.md) section 4.3 |
| Versions simplifiées des diagrammes pour la slide | [07-annexes/diagrams/](./07-annexes/diagrams/) |

**À montrer en soutenance :**
- Le schéma d'architecture haut niveau (3 couches : Client / API / Data + services Cloudinary/Redis/Postgres)
- Le diagramme de séquence SSE + Redis pour le temps réel
- Le diagramme de cas d'utilisation radial (User central)

---

### Compétence 7 — Concevoir et mettre en place une base de données relationnelle

> *Méthode Merise (MCD, MLD, MPD), dictionnaire de données, contraintes, intégrité*

**Couverture :  Démontré**

**Preuves concrètes :**

| Élément | Localisation |
|---|---|
| **MCD** (Modèle Conceptuel) | [03-conception/diagrammes-uml.md](./03-conception/diagrammes-uml.md) §1 (DBML pour dbdiagram.io) |
| **MLD** (Modèle Logique) | idem §2 (DBML SQL-like) |
| **MPD** (Modèle Physique PostgreSQL) | idem §3 (DDL complet) |
| Diagramme de classes UML | idem §4 (18 entités, attributs typés, cardinalités) |
| Dictionnaire de données complet | [03-conception/donnees.md](./03-conception/donnees.md) (18 modèles documentés) |
| 6 enums métier | [diagrammes-uml.md](./03-conception/diagrammes-uml.md) §4.3 |
| Schema Prisma (source de vérité) | `prisma/schema.prisma` |
| Migrations Prisma | `prisma/migrations/` |
| Contraintes d'unicité composite | `@@unique` sur Reaction, Friendship, GroupMember, etc. |
| Cardinalités | Tableau « Cardinalités principales » dans [donnees.md](./03-conception/donnees.md) |

**À montrer en soutenance :**
- Coller le MCD en DBML dans dbdiagram.io pour générer la visualisation
- Le schema.prisma : un modèle Post avec sa relation `@@unique`
- Le MPD SQL en exemple (User + Account avec leurs contraintes)

---

### Compétence 8 — Développer des composants d'accès aux données SQL et NoSQL

> *Requêtes paramétrées, sécurité, performance, ORM, base relationnelle ET non-relationnelle*

**Couverture :  Démontré**

**Preuves concrètes :**

| Élément | Localisation |
|---|---|
| **SQL** : queries Prisma typées | `src/lib/db/queries/` (organisé par domaine : user/, post/, messages/, group/) |
| Anti-SQLi structurel | Prisma uniquement, **aucun `$queryRaw`** dans le code (vérifié) |
| Optimisations Prisma : `include` ciblés, `select` minimaux | `src/lib/db/queries/post/*.ts` |
| Pagination cursor-based | `src/lib/db/queries/post/getAllPosts.ts` |
| **NoSQL** : Upstash Redis (key-value) | `src/lib/server/websocket/redis.ts` |
| Patterns clés Redis | `latest:chat:{from}:{to}`, `latest:chat:group:{groupId}` |
| Filtres de visibilité métier | `src/lib/db/queries/messages/visibilityFilters.ts` |
| Validation entrées (Zod) avant insertion | 36 schémas dans `src/lib/schemas/` |

**À montrer en soutenance :**
- Une query Prisma complexe : `db.post.findMany` avec `include` (comments + reactions count)
- Le client Upstash Redis : `redisdb.set(key, value)` / `redisdb.get(key)`
- Le contrôle d'unicité côté Prisma : `@@unique([userId, postId])` empêche les doubles likes

---

##  BLOC 3 — Préparer le déploiement d'une application sécurisée

### Compétence 9 — Préparer et exécuter les plans de tests d'une application

> *Tests unitaires, intégration, E2E, sécurité, jeux d'essai, couverture*

**Couverture :  Partiel — implémentation à étoffer, stratégie documentée**

**Preuves concrètes :**

| Élément | Localisation | Statut |
|---|---|---|
| Stratégie de tests détaillée | [04-developpement/tests-strategy.md](./04-developpement/tests-strategy.md) |  |
| Configuration Jest + ts-jest | `jest.config.ts`, `jest.globalSetup.ts`, `jest.globalTeardown.ts` |  |
| Test d'intégration auth/register | `__tests__/integrations/authentification.test.ts` |  |
| Jeux d'essai documentés | tests-strategy.md section « Jeux d'essai » |  |
| Tests unitaires composants UI | À implémenter |  |
| Tests E2E (Playwright) | À implémenter |  |
| Couverture chiffrée | À mesurer |  |

**Position honnête à tenir en soutenance :** « Un test d'intégration backend est en place, la stratégie complète est documentée et le setup Jest fonctionne. L'extension de la couverture (tests UI, E2E) est listée en priorité dans le plan d'amélioration. »

**À montrer en soutenance :**
- `bun run test` qui exécute le test d'intégration auth
- Le code du test (`__tests__/integrations/authentification.test.ts`)
- La stratégie documentée (tests-strategy.md)

---

### Compétence 10 — Préparer et documenter le déploiement d'une application

> *Documentation déploiement, environnements, secrets, observabilité*

**Couverture :  Démontré**

**Preuves concrètes :**

| Élément | Localisation |
|---|---|
| Section déploiement complète | [05-deploiement/README.md](./05-deploiement/README.md) |
| `Dockerfile` multi-stage production | `Dockerfile` |
| `docker-compose.yml` pour environnement local | `docker-compose.yml` |
| Documentation variables d'env | `.env.exemple` + section 5 du dossier |
| Stratégie de migrations | Prisma migrate deploy au boot du conteneur |
| Plateforme cible : Vercel | section 5 |
| BDD : Neon PostgreSQL serverless | section 5 |
| Cache + temps réel : Upstash Redis | section 5 |
| Stockage médias : Cloudinary | section 5 |
| Rollback documenté | `vercel rollback` |
| Section observabilité (logs, Vercel Analytics, Sentry roadmap) | section 5 |
| README projet pour le setup | `/README.md` racine + `/dossier-certification/README.md` |

**À montrer en soutenance :**
- L'URL de production en live
- Le `Dockerfile` multi-stage (builder → runner)
- Le `docker-compose up` qui démarre tout local
- La page Vercel du déploiement avec son historique

---

### Compétence 11 — Contribuer à la mise en production dans une démarche DevOps

> *CI/CD, automatisation, intégration continue, livraison continue*

**Couverture :  Démontré**

**Preuves concrètes :**

| Élément | Localisation |
|---|---|
| Pipeline CI documenté (GitHub Actions) | [05-deploiement/README.md](./05-deploiement/README.md) section CI/CD |
| Steps lint / test / build / deploy | workflow YAML |
| Image Docker basée sur Bun (`oven/bun:1`) | `Dockerfile` |
| Auto-déploiement Vercel sur push main | section 5 |
| Issue CI dédiée | [#45 CI — Lint, test, build, push image](https://github.com/arocchet/social-network/issues/45) |
| Issue DevOps | [#40](https://github.com/arocchet/social-network/issues/40) |
| Seed script demo data | [#46](https://github.com/arocchet/social-network/issues/46), `prisma/seed.ts` |
| Migrations auto au boot conteneur | `Dockerfile` CMD final |
| Healthcheck endpoint | `src/app/api/private/health/route.ts` |

**À montrer en soutenance :**
- Le workflow GitHub Actions sur le repo
- Le déclenchement automatique d'un build Vercel à un commit
- Le healthcheck `GET /api/private/health` qui répond OK
- Le seed script qui peuple la BDD avec de la donnée de démo

---

##  Compétences transverses

### Sécurité de l'application

> *Le mot « sécurisée » apparaît dans l'intitulé des 3 blocs RNCP. C'est transverse.*

**Couverture :  Démontré + audit honnête**

Toutes les mesures, risques et plan de durcissement sont dans **[04-developpement/securite-rgpd.md](./04-developpement/securite-rgpd.md)** :

- Authentification stateless JWT, bcrypt 12, cookies httpOnly+secure+sameSite
- Middleware deny-by-default
- OAuth Google avec `state` cookie
- Validation Zod systématique
- SQLi écartée structurellement par Prisma
- Conformité RGPD : minimisation, droits, lacunes assumées (droit à l'oubli, portabilité)
- Roadmap de durcissement 15 actions priorisées

---

##  Vue d'ensemble — couverture estimée

| Bloc | Compétences | Démontré | Partiel | Non couvert |
|---|---|---|---|---|
| Bloc 1 (Développer) | 4 | 4 | 0 | 0 |
| Bloc 2 (Concevoir + couches) | 4 | 4 | 0 | 0 |
| Bloc 3 (Déployer) | 3 | 2 | 1 (tests) | 0 |
| **Total** | **11** | **10** | **1** | **0** |

**Honnêteté à tenir en soutenance :** la couverture des tests est partielle (un seul test d'intégration backend implémenté à ce jour). Le reste des compétences est démontrable par les fichiers cités ci-dessus.

---

##  Recommandation de lecture pour le jury

1. Commencer par ce document pour avoir la **carte des preuves**.
2. Lire la [section Sécurité / RGPD](./04-developpement/securite-rgpd.md) pour le caractère transverse « sécurisée ».
3. Suivre l'ordre du dossier : 00 → 07.
4. À chaque compétence questionnée pendant l'entretien technique, revenir à cette table → pointer le fichier / extrait correspondant.
