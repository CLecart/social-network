# Contenu à saisir dans le Dossier Professionnel (template Word)

Fichier source : `Dossier_Professionnel_CDA_Vierge.docx`
Candidat : **Christophe Lecart**

---

## Page de garde

| Champ | Valeur |
|---|---|
| Nom de naissance | LECART |
| Nom d'usage | LECART |
| Prénom | Christophe |
| Adresse | 76510 Notre-Dame d'Aliermont |
| Titre professionnel visé | Concepteur Développeur d'Applications |
| Modalité d'accès | ☒ Parcours de formation |

---

## Activité-type 1 — Développer une application sécurisée

### Exemple n° 1

**Intitulé :** Implémentation du système d'authentification JWT avec cookies HTTP-only et sessions Redis

**1. Tâches et opérations effectuées :**

Dans le cadre du projet Social Network, j'ai conçu et développé le système d'authentification de l'application. J'ai mis en place les endpoints d'inscription et de connexion (`/api/auth/register` et `/api/auth/login`) en Next.js App Router avec TypeScript. Les mots de passe sont hachés via bcrypt avant stockage en base de données. À la connexion, je génère un token JWT stocké dans un cookie HTTP-only sécurisé, invisible du JavaScript client, pour prévenir les attaques XSS. J'ai également mis en place un middleware Next.js qui vérifie le cookie à chaque requête protégée et redirige les utilisateurs non authentifiés. Les sessions actives sont stockées dans Redis (clé UUID → userId) pour permettre l'invalidation à distance sans attendre l'expiration du JWT.

**2. Moyens utilisés :**

- Next.js 15 (App Router, middleware, route handlers)
- TypeScript pour le typage strict des données
- bcrypt pour le hachage des mots de passe (cost factor 12)
- JWT (JSON Web Tokens) pour la gestion des sessions
- Redis pour le stockage des sessions serveur et l'invalidation
- Prisma ORM pour les requêtes sur la table User
- PostgreSQL (Neon) comme base de données de production
- Zod pour la validation des données d'entrée côté API

**3. Avec qui avez-vous travaillé ?**

J'ai travaillé au sein d'une équipe de 6 développeurs dans le cadre de la formation Zone01 Rouen Normandie. La coordination s'est faite via GitHub (issues, pull requests, code reviews). J'ai été responsable de la partie authentification et sécurisation des routes.

**4. Contexte :**

- Nom de l'entreprise / organisme : Zone01 Rouen Normandie
- Chantier / service : Projet Social Network — module Authentification & Sécurité
- Période d'exercice : Du janvier 2024 au mai 2026

**5. Informations complémentaires :**

La décision de stocker les sessions dans Redis (plutôt que de s'appuyer uniquement sur le JWT) a permis de rendre l'invalidation instantanée en cas de déconnexion forcée ou de compromission d'un compte. Ce choix est documenté dans la PR #118 du dépôt GitHub (stabilisation Docker/Neon/Prisma/Redis).

---

### Exemple n° 2

**Intitulé :** Validation et protection des routes API avec Zod et middleware Next.js

**1. Tâches et opérations effectuées :**

J'ai mis en place une couche de validation systématique sur l'ensemble des endpoints API de l'application. Chaque route handler valide les données entrantes avec Zod avant tout traitement métier, renvoyant des erreurs 400 explicites en cas de données invalides. J'ai également protégé toutes les routes privées via le middleware Next.js qui inspecte le cookie JWT à chaque requête, refusant l'accès avec une réponse 401 si le token est absent ou expiré. Enfin, j'ai appliqué un contrôle d'accès sur les ressources (ex. : un utilisateur ne peut modifier que ses propres posts), en vérifiant l'identité extraite du JWT contre l'auteur de la ressource.

**2. Moyens utilisés :**

- Zod (validation de schémas TypeScript)
- Next.js middleware (protection des routes)
- JWT décoding côté serveur pour contrôle d'accès
- TypeScript pour les types stricts sur les payloads
- Prisma pour les vérifications de propriété en base

**3. Avec qui avez-vous travaillé ?**

En équipe de 6 développeurs, avec revues de code mutuelles via GitHub Pull Requests. La stratégie de validation et de protection des routes a été décidée collectivement pour garantir la cohérence sur l'ensemble du projet.

**4. Contexte :**

- Nom de l'entreprise / organisme : Zone01 Rouen Normandie
- Chantier / service : Projet Social Network — couche API & sécurité des données
- Période d'exercice : Du mars 2024 au mai 2026

**5. Informations complémentaires :**

L'utilisation de Zod a permis de centraliser la définition des schémas de données et de les partager entre le front-end (formulaires) et le back-end (API), réduisant les incohérences de validation et les bugs liés aux données inattendues.

---

## Activité-type 2 — Concevoir et développer une application sécurisée organisée en couches

### Exemple n° 1

**Intitulé :** Conception de l'architecture full-stack en couches et développement du schéma de données Prisma

**1. Tâches et opérations effectuées :**

J'ai participé à la conception de l'architecture de l'application Social Network, organisée en couches distinctes : présentation (Next.js App Router, composants React/Tailwind), logique métier (route handlers et server actions Next.js), accès aux données (Prisma ORM), et infrastructure (PostgreSQL, Redis, Cloudinary). J'ai conçu le schéma de données Prisma couvrant 18 modèles : User, Post, Comment, Reaction, Story, Follow, Group, GroupMember, GroupPost, Event, EventMember, Message, Conversation, Notification, Session, et autres. J'ai défini les relations (one-to-many, many-to-many), les contraintes d'unicité et les cascades de suppression. J'ai produit les diagrammes UML (classe et séquence) pour documenter les interactions entre les couches.

**2. Moyens utilisés :**

- Prisma ORM (schéma, migrations, client TypeScript)
- PostgreSQL pour le stockage relationnel
- Next.js App Router (organisation en couches serveur/client)
- TypeScript pour la cohérence des types de bout en bout
- Mermaid pour les diagrammes d'architecture
- GitHub Issues (#13 follow/friendship, #24 groups/events, #37 chat, #39 notifications)

**3. Avec qui avez-vous travaillé ?**

En équipe de 6 développeurs. La modélisation des données a été une étape collective avec discussions sur les choix de relations et les contraintes métier (ex. : visibilité des posts publics vs privés, appartenance aux groupes).

**4. Contexte :**

- Nom de l'entreprise / organisme : Zone01 Rouen Normandie
- Chantier / service : Projet Social Network — architecture & modélisation
- Période d'exercice : Du janvier 2024 au mai 2026

**5. Informations complémentaires :**

Le choix de Next.js App Router a permis de combiner rendu serveur (SSR) et rendu client (CSR) selon les besoins de chaque page, optimisant les performances et le SEO tout en conservant une expérience interactive. Ce choix architectural est documenté dans la section `04-developpement` du dossier de certification.

---

### Exemple n° 2

**Intitulé :** Développement du système de messagerie et notifications temps réel avec Server-Sent Events et Upstash Redis

**1. Tâches et opérations effectuées :**

J'ai développé le système de messagerie instantanée et de notifications en temps réel du réseau social en utilisant les Server-Sent Events (SSE), protocole HTTP natif de push serveur → client. Le client maintient une connexion SSE ouverte sur un endpoint dédié (`/api/private/chat/listen`) qui interroge Upstash Redis toutes les 500 ms pour récupérer les nouveaux messages destinés à l'utilisateur. Ce mécanisme de polling Redis a été retenu à la place de WebSockets (Socket.io) pour des raisons de compatibilité avec l'architecture serverless de Vercel, qui ne permet pas de connexions TCP longue durée. J'ai appliqué la même architecture pour les notifications temps réel (nouvelles demandes d'amis, réactions sur posts, messages entrants). Chaque message est persisté en base PostgreSQL avant d'être écrit dans Redis avec un TTL de 60 secondes, garantissant qu'aucun message n'est perdu même en cas de latence côté client.

**2. Moyens utilisés :**

- Server-Sent Events (SSE) — API native Next.js App Router (`ReadableStream`)
- Upstash Redis (REST API serverless) pour le transit des messages temps réel
- `@upstash/redis` pour l'interaction Redis côté serveur
- Prisma ORM pour la persistance durable des messages (`Message`, `GroupMessage`)
- Next.js 15 App Router pour les route handlers SSE
- TypeScript pour le typage des payloads SSE
- Issue GitHub [#37 chat system](https://github.com/arocchet/social-network/issues/37) et [#39 notifications](https://github.com/arocchet/social-network/issues/39)

**3. Avec qui avez-vous travaillé ?**

En équipe de 6 développeurs. J'ai travaillé en binôme sur la partie temps réel, avec revue de code systématique pour valider la gestion des reconnexions SSE et l'absence de doublons de messages.

**4. Contexte :**

- Nom de l'entreprise / organisme : Zone01 Rouen Normandie
- Chantier / service : Projet Social Network — fonctionnalités temps réel
- Période d'exercice : Du juin 2024 au mai 2026

**5. Informations complémentaires :**

Le choix de SSE + Redis polling plutôt que WebSockets (Socket.io) est un arbitrage architectural documenté : Socket.io nécessite un serveur long-vivant incompatible avec le déploiement serverless Vercel. SSE est unidirectionnel (serveur → client), ce qui est suffisant pour les notifications et la réception de messages. Les actions de l'utilisateur (envoi de message, réaction) passent par des appels API REST classiques. Ce compromis est détaillé dans la section veille technique du dossier (`04-developpement/veille-technique.md`).

---

## Activité-type 3 — Préparer le déploiement d'une application sécurisée

### Exemple n° 1

**Intitulé :** Containerisation de l'application avec Docker et mise en place du pipeline CI/CD GitHub Actions

**1. Tâches et opérations effectuées :**

J'ai rédigé le Dockerfile multi-stage pour l'application Next.js, séparant l'étape de build (installation des dépendances, génération Prisma, compilation TypeScript) de l'image de production finale, afin de minimiser la taille de l'image livrée. J'ai configuré le `docker-compose.yml` pour orchestrer localement les trois services : l'application Next.js, PostgreSQL et Redis, avec injection des variables d'environnement via un fichier `.env`. J'ai également mis en place un pipeline GitHub Actions exécutant automatiquement : lint ESLint, tests Jest, build Next.js et push de l'image Docker. Ces travaux sont documentés dans les issues GitHub #40 (DevOps/Docker/CI) et #45 (CI pipeline).

**2. Moyens utilisés :**

- Docker (Dockerfile multi-stage)
- Docker Compose pour l'environnement local
- GitHub Actions pour le pipeline CI/CD
- ESLint pour le linting
- Jest pour les tests d'intégration
- Next.js build pour la compilation de production
- PR #118 pour la stabilisation finale du déploiement

**3. Avec qui avez-vous travaillé ?**

En équipe de 6 développeurs. La partie DevOps a été menée en collaboration, chacun contribuant à la stabilisation du pipeline (gestion des secrets, variables d'environnement, ordre des étapes de build).

**4. Contexte :**

- Nom de l'entreprise / organisme : Zone01 Rouen Normandie
- Chantier / service : Projet Social Network — infrastructure & CI/CD
- Période d'exercice : Du septembre 2024 au mai 2026

**5. Informations complémentaires :**

La PR #118 a été la plus structurante du projet côté déploiement : elle a stabilisé l'ensemble de la chaîne Docker/Neon/Prisma/Redis après plusieurs cycles d'instabilité liés aux migrations de base de données et aux configurations d'environnement entre local et production.

---

### Exemple n° 2

**Intitulé :** Déploiement en production sur Vercel avec base de données PostgreSQL Neon et migrations Prisma

**1. Tâches et opérations effectuées :**

J'ai configuré le déploiement de l'application en production sur Vercel, en utilisant PostgreSQL Neon comme base de données managée cloud. J'ai défini les variables d'environnement de production dans Vercel (DATABASE_URL, DIRECT_URL pour Prisma, UPSTASH_REDIS_REST_URL, UPSTASH_REDIS_REST_TOKEN, JWT_SECRET, CLOUDINARY_*). J'ai mis en place la procédure de migration Prisma (`prisma migrate deploy`) à exécuter lors des déploiements, en distinguant les migrations destructives des migrations additives. J'ai documenté la procédure de rollback Vercel en cas de régression, ainsi que les contrôles post-déploiement à effectuer (page d'accueil, connexion, création de post, messagerie temps réel, cookies HTTP-only).

**2. Moyens utilisés :**

- Vercel (plateforme de déploiement Next.js)
- PostgreSQL Neon (base de données cloud serverless)
- Upstash Redis (cache, sessions, temps réel via REST)
- Prisma Migrate pour les migrations en production
- Cloudinary pour le stockage des médias (images, vidéos)
- Variables d'environnement sécurisées via les secrets Vercel

**3. Avec qui avez-vous travaillé ?**

En équipe de 6 développeurs, avec une répartition des responsabilités sur la gestion des secrets et la validation post-déploiement.

**4. Contexte :**

- Nom de l'entreprise / organisme : Zone01 Rouen Normandie
- Chantier / service : Projet Social Network — mise en production
- Période d'exercice : Du novembre 2024 au mai 2026

**5. Informations complémentaires :**

L'utilisation de Neon (PostgreSQL serverless) avec une URL directe (`DIRECT_URL`) pour Prisma et une URL poolée (`DATABASE_URL`) pour l'application est une configuration spécifique documentée dans le dossier pour éviter les timeouts de connexion sur une architecture serverless comme Vercel.

---

## Documents illustrant la pratique professionnelle

> Les documents ci-dessous sont classés par activité-type et par exemple. Ils constituent les preuves de réalisation à joindre au dossier professionnel. Tous les fichiers de code sont issus du dépôt `https://github.com/arocchet/social-network`.

---

### Activité-type 1 — Développer une application sécurisée

#### Exemple n° 1 — Authentification JWT, cookies HTTP-only, sessions Redis

| Type | Document | Lien / Chemin |
|---|---|---|
| Extrait de code | Signature et vérification du JWT | `src/lib/jwt/signJwt.ts` · `src/lib/jwt/verifyJwt.ts` |
| Extrait de code | Hachage et comparaison bcrypt (cost 12) | `src/lib/security/hash.ts` |
| Extrait de code | Middleware Next.js — protection de toutes les routes privées | `src/middleware.ts` |
| Extrait de code | Route de connexion — génération JWT + cookie HTTP-only | `src/app/api/public/auth/login/route.ts` |
| Extrait de code | Route OAuth Google — state anti-CSRF | `src/app/api/public/auth/redirect/google/route.ts` |
| Capture d'écran | Maquette page de connexion (design système, champs validés) | `07-annexes/Mockups_Login.png` |
| Preuve GitHub | Issue #66 — OAuth Google authentication | https://github.com/arocchet/social-network/issues/66 |
| Preuve GitHub | PR #118 — stabilisation Docker/Neon/Prisma/Redis | https://github.com/arocchet/social-network/pull/118 |
| Documentation | Analyse sécurité OWASP complète | `04-developpement/securite-rgpd.md` |

#### Exemple n° 2 — Validation Zod et protection des routes API

| Type | Document | Lien / Chemin |
|---|---|---|
| Extrait de code | Schémas Zod partagés (posts, users, reactions, comments) | `src/lib/schemas/` |
| Extrait de code | Middleware — injection header `x-user-id` pour contrôle d'accès | `src/middleware.ts` |
| Extrait de code | Exemple d'endpoint protégé avec validation Zod | `src/app/api/private/post/route.ts` |
| Extrait de code | Helpers de réponse API standardisés (400, 401, 403, 500) | `src/lib/server/api/response.ts` |
| Preuve GitHub | Commits Christophe Lecart — validation et sécurisation API | `contribution-personnelle.md` (hashs vérifiables) |
| Documentation | Stratégie de validation et audit RGPD | `04-developpement/securite-rgpd.md` |

---

### Activité-type 2 — Concevoir et développer une application sécurisée organisée en couches

#### Exemple n° 1 — Architecture full-stack en couches et schéma de données Prisma

| Type | Document | Lien / Chemin |
|---|---|---|
| Extrait de code | Schéma Prisma complet — 18 modèles, relations, enums, contraintes d'unicité | `prisma/schema.prisma` |
| Extrait de code | Migrations versionnées | `prisma/migrations/` |
| Diagramme | MCD — Modèle Conceptuel de Données (entités et cardinalités) | `03-conception/diagrammes-uml.md` §MCD |
| Diagramme | MLD — Modèle Logique (clés étrangères, types logiques) | `03-conception/diagrammes-uml.md` §MLD |
| Diagramme | MPD — Modèle Physique PostgreSQL (DDL, index, contraintes) | `03-conception/diagrammes-uml.md` §MPD |
| Diagramme | Diagramme de classes simplifié (soutenance) | `07-annexes/diagrams/classes-simplifie.mmd` |
| Diagramme | Diagramme de cas d'utilisation (soutenance) | `07-annexes/diagrams/use-case-simplifie.mmd` |
| Capture d'écran | Maquette Feed principal — architecture composants React | `07-annexes/Mockups_Home_Feed.png` |
| Capture d'écran | Maquette Profil utilisateur | `07-annexes/Mockups_User.png` |
| Capture d'écran | Maquette Création de post | `07-annexes/Mockups_Create_Post.png` |
| Preuve GitHub | Issue #13 — Follow/Friendship system | https://github.com/arocchet/social-network/issues/13 |
| Preuve GitHub | Issue #24 — Groups & Events | https://github.com/arocchet/social-network/issues/24 |
| Preuve GitHub | Issue #37 — Chat system | https://github.com/arocchet/social-network/issues/37 |

#### Exemple n° 2 — Messagerie et notifications temps réel (SSE + Upstash Redis)

| Type | Document | Lien / Chemin |
|---|---|---|
| Extrait de code | Endpoint SSE `/chat/listen` — polling Redis, déduplication, cleanup | `src/app/api/private/chat/listen/route.ts` |
| Extrait de code | Envoi de message — persistance Prisma + écriture Redis | `src/app/api/private/chat/send/route.ts` |
| Extrait de code | Client Redis Upstash (REST, serverless-compatible) | `src/lib/server/websocket/redis.ts` |
| Extrait de code | Hook React SSE côté client | `src/hooks/use-real-time-chat.ts` |
| Preuve GitHub | Issue #37 — Chat system (SSE + Redis) | https://github.com/arocchet/social-network/issues/37 |
| Preuve GitHub | Issue #39 — Notifications temps réel | https://github.com/arocchet/social-network/issues/39 |
| Documentation | Justification du choix SSE vs WebSocket (contrainte serverless) | `04-developpement/veille-technique.md` §1.1 |

---

### Activité-type 3 — Préparer le déploiement d'une application sécurisée

#### Exemple n° 1 — Containerisation Docker et pipeline CI/CD GitHub Actions

| Type | Document | Lien / Chemin |
|---|---|---|
| Extrait de code | Dockerfile multi-stage (builder Bun + runner slim) | `Dockerfile` |
| Extrait de code | docker-compose.yml — profils dev/prod, services app + db | `docker-compose.yml` |
| Extrait de code | Pipeline GitHub Actions (lint + test + build) | `.github/workflows/ci.yml` |
| Preuve GitHub | Issue #40 — DevOps / Docker / CI | https://github.com/arocchet/social-network/issues/40 |
| Preuve GitHub | Issue #45 — CI lint/test/build/push | https://github.com/arocchet/social-network/issues/45 |
| Preuve GitHub | PR #118 — stabilisation complète de la chaîne de déploiement | https://github.com/arocchet/social-network/pull/118 |
| Documentation | Documentation déploiement complète | `05-deploiement/README.md` |

#### Exemple n° 2 — Déploiement production Vercel + PostgreSQL Neon + migrations Prisma

| Type | Document | Lien / Chemin |
|---|---|---|
| Extrait de code | Variables d'environnement documentées | `.env.exemple` |
| Extrait de code | Migrations Prisma versionnées | `prisma/migrations/` |
| Documentation | Procédure de déploiement, variables d'env, rollback Vercel | `05-deploiement/README.md` |
| Preuve GitHub | Issue #46 — Seed script / données de démonstration | https://github.com/arocchet/social-network/issues/46 |
| Preuve GitHub | PR #118 — stabilisation Docker/Neon/Prisma/Redis | https://github.com/arocchet/social-network/pull/118 |

---

## Tableau des titres, diplômes et attestations

| Intitulé | Autorité / Organisme | Date |
|---|---|---|
| Concepteur Développeur d'Applications (en cours) | Zone01 Rouen Normandie | 2024 – 2026 |
| BTS Maintenance des Automatismes Industriels (MAI) | Établissement de formation | 2003 |
| BAC PRO MSMA (Maintenance des Systèmes Mécaniques Automatisés) | Établissement de formation | 2000 |

---

## Déclaration sur l'honneur

Fait à Notre-Dame d'Aliermont, le *(date de la soutenance)*

Je soussigné(e) **Christophe Lecart**, déclare sur l'honneur que les renseignements fournis dans ce dossier sont exacts et que je suis l'auteur(e) des réalisations jointes.

Signature :

---

*Dépôt GitHub du projet : https://github.com/arocchet/social-network*
