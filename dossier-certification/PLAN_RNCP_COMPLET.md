# 📋 PLAN DOSSIER RNCP - Social Network

## Structure RNCP 37873 (11 sections + annexes)

Structuré à partir du référentiel RNCP 37873 et du projet Social Network.

> Ce document présente le plan du dossier professionnel : sections à rédiger, contenus à couvrir et correspondance avec les blocs RNCP.
>
> Les titres « Contenu à couvrir » sont des points à traiter dans le dossier, pas des exigences textuelles du diplôme.

---

## 📖 STRUCTURE DÉTAILLÉE

### **Section 00 – Présentation du Candidat**

_(nouvelle section - très importante)_

**Pages estimées:** 2-3 pages

**Contenu à couvrir:**

- Qui es-tu? (parcours, formation, motivations)
- Ton profil professionnel (curiosités techniques, domaines)
- Ce que tu as appris pendant la formation Zone01
- Tes compétences avant/après le projet
- Pourquoi tu as choisi ce projet social-network

**Format:** Narration personnelle, honnête et factuelle

**À intégrer:** Ton expérience de travail réelle, tes objectifs post-formation

---

### **Section 01 – Contexte du Projet**

_(fusionner 01-introduction + contexte)_

**Pages estimées:** 3-4 pages

**Contenu à couvrir:**

1. **Qui porte le projet?** (toi, la formation, l'équipe)
2. **Pourquoi un réseau social?** (problématique métier)
3. **Contexte technique initial** (état du code, fonctionnalités déjà présentes)
4. **Environnement de travail** (équipe, outils, contraintes)
5. **Enjeux métier et pédagogiques**

**Sections existantes à enrichir:**

- [ ] 01-introduction/README.md → contexte + problématique réelle
- [ ] 02-cahier-des-charges/README.md → demande client

**Contexte du projet:**

- projet réalisé en équipe dans le cadre de la formation,
- application centrée sur un réseau social moderne,
- enjeux de sécurité, de structuration des données et de temps réel.

**Ton projet:**

- [ ] Projet porté par la formation et l'équipe
- [ ] État initial du code et des fonctionnalités
- [ ] Enjeux réels (sécurité, cohérence, maintenabilité)

---

### **Section 02 – Objectifs du Projet**

_(extraits de 02-cahier-des-charges + CDA mapping)_

**Pages estimées:** 2-3 pages

> Note : dans ce plan, les cases cochées correspondent aux fonctionnalités déjà implémentées dans le code et aux preuves à utiliser dans le dossier. Les cases décochées correspondent à des éléments à expliciter dans le dossier ou à des sujets non couverts par le projet actuel.

#### **2.1 Objectifs Techniques**

- [x] Refonte UI responsive
- [x] Authentification JWT
- [x] Real-time notifications (SSE + Redis)
- [x] Database design (Prisma + PostgreSQL)
- [x] Upload d'images (Cloudinary)
- [x] Local date formatting / UI localization
- [x] Tests (Jest, integration tests)
- [x] Deployment (Docker + Vercel)

#### **2.2 Objectifs Pédagogiques RNCP (CDA mapping)**

| Bloc RNCP                                                                           | Objectif du Social Network                                       |
| ----------------------------------------------------------------------------------- | ---------------------------------------------------------------- |
| **BLOC 1** – Développer une application sécurisée                                   | UI responsive + composants métier + JWT auth + tests unitaires   |
| **BLOC 2** – Concevoir et développer une application sécurisée organisée en couches | Architecture Next.js (client/serveur/DB) + API REST + Prisma ORM |
| **BLOC 3** – Préparer le déploiement d'une application sécurisée                    | Docker + CI/CD + tests automatisés + deployment Vercel           |

#### **2.3 Couverture RNCP 37873**

- **BC01** : installé et configuré l’environnement, développé des interfaces utilisateur, conçu des composants métier et documenté le projet.
- **BC02** : analysé les besoins, défini une architecture multicouche, conçu une base de données relationnelle et développé des accès aux données SQL/NoSQL.
- **BC03** : préparé et documenté les tests, préparé le déploiement avec Docker, et contribué à la mise en production via une démarche DevOps.
- **Précisions** : le projet couvre uniquement les utilisateurs authentifiés et ne propose pas de module admin spécifique.

**À intégrer:**

- [ ] 11 compétences professionnelles RNCP mapées aux livrables
- [ ] 3 compétences transversales (communication, résolution problème, apprentissage)

---

### **Section 03 – Spécifications Fonctionnelles**

_(de 02-cahier-des-charges + 03-conception)_

**Pages estimées:** 4-5 pages

**Contenu à couvrir:**

#### **3.1 Analyse des Utilisateurs**

- [x] Utilisateur authentifié (publication, interaction)
- [x] Utilisateur avec amis (follow, chat privé)

> Limite fonctionnelle : l'application actuelle est réservée aux utilisateurs authentifiés et ne propose pas d'accès public ou de module admin.

#### **3.2 User Stories Détaillées**

```
EN TANT QUE utilisateur,
JE VEUX [fonctionnalité]
POUR [bénéfice]
```

**Fonctionnalités à détailler:**

- EN TANT QUE utilisateur, JE VEUX créer un profil POUR montrer qui je suis
- EN TANT QUE utilisateur, JE VEUX suivre d'autres profils POUR voir leur contenu
- EN TANT QUE utilisateur, JE VEUX faire un post avec des images POUR partager
- EN TANT QUE utilisateur, JE VEUX recevoir des notifications POUR ne pas rater les interactions
- EN TANT QUE utilisateur, JE VEUX envoyer des DM POUR discuter en privé

#### **3.3 Fonctionnalités Principales**

Liste complète + description (Auth, Posts, Comments, Reactions, Follow, Messages, Notifications, Groups, Stories, Reels)

#### **3.4 Maquettes/Interfaces**

- [x] Écran de connexion
- [x] Feed principal
- [x] Profil utilisateur
- [x] Conversation privée
- [x] Notifications

#### **3.5 Rôles et Permissions**

| Rôle | Droits                         |
| ---- | ------------------------------ |
| User | Publier, commenter, DM, follow |

> L'application est conçue pour des utilisateurs authentifiés uniquement.

---

### **Section 04 – Spécifications Techniques**

_(partie de 04-developpement)_

**Pages estimées:** 5-6 pages

**Contenu à couvrir:**

#### **4.1 Architecture Logicielle Globale**

```
┌─────────────────────────────────────────┐
│     CLIENT (React/Next.js)              │
│     - UI Components (Tailwind + ShadCN) │
│     - Real-time (SSE polling client)    │
│     - State mgmt (React Context + hooks) │
└──────────────────┬──────────────────────┘
                   │ HTTP + SSE/Polling
┌──────────────────▼──────────────────────┐
│     SERVEUR (Next.js API Routes)        │
│     - Authentification (JWT + cookies)  │
│     - Business logic                    │
│     - API REST + SSE/Redis real-time    │
└──────────────────┬──────────────────────┘
                   │ Prisma ORM
┌──────────────────▼──────────────────────┐
│     DONNÉES                             │
│     - PostgreSQL (Neon)                 │
│     - Redis (Upstash) - cache + RT      │
│     - Cloudinary - images               │
└─────────────────────────────────────────┘
```

#### **4.2 Organisation des Fichiers**

```
src/
├── app/
│   ├── (auth)/          # Pages d'auth
│   ├── (feed)/          # Feed principal
│   ├── profile/         # Profils
│   ├── api/             # Routes API
│   └── layout.tsx
├── components/
│   ├── ui/              # Composants réutilisables
│   ├── auth/
│   ├── feed/
│   ├── profile/
│   └── ...
├── lib/
│   ├── db/              # Prisma, DB queries
│   ├── auth.ts          # Auth config
│   ├── utils.ts
│   └── ...
├── hooks/               # Custom React hooks
├── config/              # Configuration
└── middleware.ts        # Next.js middleware
```

#### **4.3 Technologies Utilisées**

| Composant          | Choix                        | Justification           |
| ------------------ | ---------------------------- | ----------------------- |
| Frontend framework | Next.js 15 + React 19        | SSR + RSC, scalable     |
| UI styling         | Tailwind CSS + ShadCN        | Responsive, accessible  |
| Language           | TypeScript                   | Typage fort             |
| Database           | PostgreSQL (Neon)            | Relationnel, ACID       |
| ORM                | Prisma v5                    | Type-safe, migrations   |
| Real-time          | SSE + Redis                  | Notifications, chat     |
| Images             | Cloudinary                   | CDN, transformations    |
| Auth               | Google OAuth + JWT           | Sécurisé, standard      |
| Testing            | Jest + React Testing Library | Unit + integration      |
| Deployment         | Docker + Vercel/Railway      | Containerized, scalable |

#### **4.4 Modèle de Données (MCD/MLD/MPD)**

- [ ] MCD: Diagramme E-R (tables + relations)
- [ ] MLD: Modèle logique avec types SQL
- [ ] MPD: Script SQL PostgreSQL CREATE TABLE

**Tables principales:**

- users, profiles, posts, comments, reactions, follows, messages, notifications, groups, events, etc.

---

### **Section 05 – Réalisations Techniques**

_(détails de 04-developpement + extraits code)_

**Pages estimées:** 6-10 pages

**Contenu à couvrir:**

#### **5.1 Vue d'Ensemble du Système**

Schéma d'architecture haut niveau (flows utilisateurs)

#### **5.2 Authentification & Sécurité**

- Google OAuth + JWT configuration
- Password hashing (bcrypt)
- Session management via cookies sécurisés
- Code extraits:

```typescript
// src/config/auth.ts - configuration authentification du projet
```

#### **5.3 API REST & Routes**

- Endpoints principaux (POST /api/auth/login, etc.)
- Validation des données (Zod schemas)
- Error handling
- Code extraits

#### **5.4 Real-time avec SSE / Redis**

- Connexion client/serveur
- Event handlers (messages, notifications)
- Redis polling (Upstash Redis / SSE)
- Code extraits

#### **5.5 Base de Données (Prisma)**

- Schema.prisma expliqué
- Migrations
- Queries optimisées
- Code extraits:

```prisma
// prisma/schema.prisma - extrait
model Post {
  id String @id @default(cuid())
  content String
  authorId String
  author User @relation(fields: [authorId], references: [id], onDelete: Cascade)
  ...
}
```

#### **5.6 Composants Frontend**

- Layout principal
- Feed component
- Profile component
- Chat component
- Code + screenshots

#### **5.7 Système de Notifications**

- In-app notifications
- Code extraits

---

### **Section 06 – Tests et Validations**

_(nouvelle section)_

**Pages estimées:** 4-5 pages

**Contenu à couvrir:**

#### **6.1 Stratégie de Test**

- [ ] Tests unitaires (composants, hooks, utils)
- [x] Tests d'intégration (API routes)
- [ ] Couverture de tests et stratégie de régression

#### **6.2 Jeux d'Essai**

| Composant   | Entrée            | Résultat Attendu          | Statut |
| ----------- | ----------------- | ------------------------- | ------ |
| Auth Login  | email/pwd valides | Token JWT renvoyé         | ✅     |
| Auth Login  | pwd incorrect     | Erreur 401                | ✅     |
| Create Post | Texte + image     | Post créé + notif envoyée | ✅     |
| Follow User | User A → User B   | Follow relation créée     | ✅     |

#### **6.3 Environnement de Test**

- Docker Compose pour PostgreSQL + application locale
- Upstash Redis en cloud pour les scénarios temps réel
- Fixtures/seeds de données
- Mock API responses

#### **6.4 Logs & Monitoring**

- Erreurs capturées
- Performance metrics
- User action tracking

#### **6.5 Validation Finale**

- Tous les tests passent
- Aucune régression
- Performance acceptable
- Sécurité vérifiée

---

### **Section 07 – Sécurité et RGPD**

_(nouvelle section - TRÈS importante)_

**Pages estimées:** 3-4 pages

**Contenu à couvrir:**

#### **7.1 Contexte de Sécurité Initial**

- [ ] Failles trouvées (si reprise de code)
- [ ] Vulnérabilités potentielles

#### **7.2 Mesures Mises en Place**

- [ ] Authentification JWT sécurisée
- [ ] Passwords hashés (bcrypt)
- [ ] Protection XSS / validation des entrées
- [ ] SQL injection prevention (Prisma)
- [ ] Validation des données (Zod)

#### **7.3 Respect du RGPD**

- [ ] Minimisation des données
- [ ] Droit d'accès aux données personnelles
- [ ] Droit à l'oubli (delete account)
- [ ] Consentement explicite
- [ ] Politique de confidentialité
- [ ] Logs de sécurité

#### **7.4 Incident de Sécurité (si applicable)**

- [ ] Description de l'incident
- [ ] Impact réel
- [ ] Correction mise en place

---

### **Section 08 – Recherche Technique Personnelle**

_(nouvelle section - valorise l'apprentissage)_

**Pages estimées:** 2-3 pages

**Contenu à couvrir:**

#### **8.1 Domaines Explorés**

- [x] Real-time avec SSE / Redis (au-delà du simple chat)
- [x] Optimisation de performance (pagination, lazy loading)
- [ ] Scalabilité (caching, indexing)
- [x] Sécurité (JWT auth, Zod validation)
- [x] Déploiement en production (Docker, CI/CD)
- [x] Testing (Jest setup, test coverage)

#### **8.2 Sources d'Apprentissage**

- [ ] Documentation officielle (Next.js, Prisma, Upstash Redis)
- [ ] Articles/blogs (Dev.to, Medium)
- [x] Communautés (GitHub)
- [ ] Essais/erreurs personnels

#### **8.3 Découvertes Principales**

- Ce que tu as appris qui n'était pas dans la formation
- Ce qui t'a surpris ou challengé
- Comment tu as surmonté les obstacles

---

### **Section 09 – Conclusion Personnelle**

_(enrichir le 06-bilan)_

**Pages estimées:** 2-3 pages

**Contenu à couvrir:**

#### **9.1 Bilan du Projet**

- [ ] Objectifs atteints (%)
- [ ] Ce qui a bien marché
- [ ] Ce qui aurait pu être mieux
- [ ] Temps passé vs estimation

#### **9.2 Compétences Validées**

Mapping explicite:

- "Compétence 1 – Installer et configurer son environnement" → ✅ Docker setup
- "Compétence 2 – Développer des interfaces utilisateur" → ✅ React components
- etc.

#### **9.3 Vision Professionnelle**

- [ ] Qui es-tu comme développeur?
- [ ] Tes forces
- [ ] Tes faiblesses
- [ ] Comment tu veux évoluer

#### **9.4 Ce que tu ne veux pas faire**

- Rester cantonné à une seule couche technique sans compréhension globale.
- Développer sans tests ni validation.
- Construire des solutions difficiles à maintenir ou à sécuriser.

#### **9.5 Futur du Projet**

- [ ] Améliorations envisagées
- [ ] Scalabilité future
- [ ] Open source ou privé?

---

### **Section 10 – Annexes**

_(structurer 07-annexes)_

**Contenu à couvrir:**

#### **10.1 Diagrammes**

- [ ] MCD/MLD/MPD complets
- [ ] Architecture système (avec dbdiagram.io ou PlantUML)
- [ ] Flowchart user stories
- [ ] ERD avec Prisma visual

#### **10.2 Extraits de Code Significatifs**

- [ ] Auth implementation
- [ ] Real-time SSE / polling handler
- [ ] Database schema
- [ ] API endpoint example
- [ ] React component example

#### **10.3 Configuration**

- [ ] Dockerfile
- [ ] docker-compose.yml
- [ ] .env.example
- [ ] prisma schema
- [ ] next.config.ts

#### **10.4 Screenshots/Interfaces**

- [ ] UI des pages principales
- [ ] Mobile views

#### **10.5 Documentation**

- [ ] README complet
- [ ] Setup instructions
- [ ] Contributing guide

#### **10.6 Tests**

- [ ] Tests unitaires du projet
- [ ] Tests d'intégration du projet
- [ ] Coverage report

#### **10.7 Ressources**

- [ ] Bibliographie (docs, articles, tutorials)
- [ ] Outils utilisés
- [ ] Librairies npm principales

---

## 📊 TABLEAU DE MAPPING RNCP → SOCIAL NETWORK

| Compétence RNCP                                      | Preuve dans Social Network                      |
| ---------------------------------------------------- | ----------------------------------------------- |
| **1. Installer et configurer son environnement**     | Docker setup, Node env config, DB setup         |
| **2. Développer des interfaces utilisateur**         | React components, Next.js UI, responsive design |
| **3. Développer des composants métier**              | Business logic (posts, follows, notifications)  |
| **4. Contribuer à la gestion de projet**             | GitHub project, time tracking, documentation    |
| **5. Analyser les besoins et maquetter**             | User stories, wireframes, Figma mockups         |
| **6. Définir l'architecture logicielle**             | Architecture diagram, API design                |
| **7. Concevoir une base de données relationnelle**   | Prisma schema, MCD/MLD/MPD                      |
| **8. Développer des composants d'accès aux données** | Prisma queries, API routes                      |
| **9. Préparer et exécuter les plans de tests**       | Jest tests, test cases, coverage                |
| **10. Préparer et documenter le déploiement**        | Docker, deployment steps, README                |
| **11. Contribuer à la mise en production DevOps**    | CI/CD pipeline, GitHub Actions                  |

---

## ⏱️ ESTIMATION DE PAGES

- Section 00 (Présentation): **2-3 pages**
- Section 01 (Contexte): **3-4 pages**
- Section 02 (Objectifs): **2-3 pages**
- Section 03 (Spécifications fonctionnelles): **4-5 pages**
- Section 04 (Spécifications techniques): **5-6 pages**
- Section 05 (Réalisations): **6-10 pages** ← LA PLUS LONGUE
- Section 06 (Tests): **4-5 pages**
- Section 07 (Sécurité RGPD): **3-4 pages**
- Section 08 (Recherche tech): **2-3 pages**
- Section 09 (Conclusion): **2-3 pages**
- **Total (hors annexes):** ~40-50 pages
- **Annexes:** ~20-30 pages
- **TOTAL DOSSIER:** ~60-80 pages

_(Conforme à l'exigence RNCP: 40-60 pages hors annexes)_

---

## 🚀 PROCHAINE ÉTAPE

Valider ce plan, puis créer les fichiers section par section.

Veux-tu qu'on commence par quelle section?
