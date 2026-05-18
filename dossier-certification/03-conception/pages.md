# 📱 Pages du Projet Social Network

Dans ce document nous décrivons les pages que nous avons conçues et implémentées pour le projet. Le texte est rédigé à la première personne du pluriel pour refléter le travail d'équipe et les preuves (issues / PRs) sont indiquées quand pertinentes.

## 🔎 Preuves & Mapping GitHub

Les développements décrits dans ce document sont appuyés par les tickets et PRs du dépôt `arocchet/social-network` :

- Follow / friendship: https://github.com/arocchet/social-network/issues/13
- Groups & Events: https://github.com/arocchet/social-network/issues/24
- Group feed (posts in groups): https://github.com/arocchet/social-network/issues/30
- Chat system: https://github.com/arocchet/social-network/issues/37
- Notifications: https://github.com/arocchet/social-network/issues/39
- DevOps / Docker / CI: https://github.com/arocchet/social-network/issues/40
- CI pipeline (lint/test/build): https://github.com/arocchet/social-network/issues/45
- Seed script / demo data: https://github.com/arocchet/social-network/issues/46
- Mark notification as read: https://github.com/arocchet/social-network/issues/51
- OAuth (Google): https://github.com/arocchet/social-network/issues/66
- Internationalization (i18n): https://github.com/arocchet/social-network/issues/76
- Settings: https://github.com/arocchet/social-network/issues/111
- PR stabilisation (Docker/Neon/Prisma/Redis): https://github.com/arocchet/social-network/pull/118

## 🏠 Accueil (Home/Feed) - `/`

**Objectif:** Page principale affichant le flux de posts que nous avons développé pour favoriser la découverte de contenu et l'engagement.

### Structure principale:

```
┌─ Header
│  ├─ Logo
│  ├─ Theme Toggle
│  └─ Chat Button
├─ Stories (Carousel)
├─ Feed (Infinite Scroll)
│  ├─ PostCard
│  ├─ Reactions (Like, Comment, Share)
│  └─ Load More
└─ NavigationBar (Sidebar)
```

### Fonctionnalités implémentées:

- Infinite scroll avec pagination côté serveur
- Stories affichées en haut du flux
- Interactions: like / comment / share
- Mode dark/light avec persistence
- Responsive mobile/desktop

**Preuves & références:** travail lié à l'implémentation du flux et de la pagination (voir issue/PR liées, ex. issue #13 pour le système de follow qui affecte le contenu du feed).

---

## 🔐 Authentification

Nous avons implémenté les écrans et flux d'authentification suivants : `login`, `register`, `onboarding`.

### Principaux points techniques:

- Authentification par email / username et gestion de JWT
- Flux d'inscription en plusieurs étapes (profil, avatar, préférences)
- Gestion des erreurs et retours UX pour l'utilisateur

**Preuves & références:** PRs et issues sur l'authentification et la génération de tokens (voir PRs de la milestone d'auth).

---

## 👤 Profil Utilisateur - `/profile/[userId]`

Nous avons conçu des pages profil montrant l'ensemble des contenus d'un utilisateur (posts, photos, vidéos) et des actions (follow, friend request, message). Les filtres de posts et l'édition du profil sont gérés selon le rôle du visiteur (propriétaire vs visiteur).

**Preuves & références:** fonctionnalités liées aux relations utilisateurs et demandes d'amis (issue #13 — système de follow / amitié).

---

## 💬 Messages / Chat

Nous avons construit le système de messagerie en temps réel utilisant WebSocket pour la livraison des messages et la présence utilisateur. Les vues comprennent la liste des conversations, la fenêtre de chat et les chats de groupe.

Fonctionnalités clés:

- Messages temps réel (SENT / DELIVERED / READ)
- Upload d'images dans les messages
- Typing indicator et présence
- Liste de conversations avec compte de non lus

**Preuves & références:** développement des features temps réel et corrections d'intégration (voir PR de stabilisation: https://github.com/arocchet/social-network/pull/118 concernant la configuration Docker/Neon/Prisma/Redis, qui a aidé à stabiliser l'environnement de développement pour ces fonctionnalités).

---

## 🎬 Reels / Vidéos - `/reels`

Nous avons ajouté une page dédiée aux vidéos courtes (reels) avec lecture auto, contrôles et navigation entre vidéos.

---

## 🔍 Recherche - `/search`

Nous avons implémenté une recherche catégorisée (utilisateurs, posts, hashtags) avec historique local et recherche débouncée côté client.

---

## 📅 Événements & 👥 Groupes

Nous avons conçu les pages de gestion d'événements et de groupes : création, affichage des membres, RSVP, et intégration de chats et d'événements au sein des groupes.

**Preuves & références:** issues liées à la gestion de groupes/événements (voir issue #24 pour les spécifications fonctionnelles des groupes et événements).

---

## ⚙️ Paramètres & Invitations

Pages de paramètres pour gérer profil, confidentialité, notifications, sécurité et invitations (groupes / amis).

---

## 🎨 Design System

Nous documentons succinctement la palette, la typographie et les composants réutilisables utilisés dans l'application afin d'assurer cohérence et maintenabilité.

---

## 📐 Architecture & Flux de données

Nous expliquons notre pattern de pages et la chaîne de traitement des actions utilisateur jusqu'à la mise à jour des providers et du rendu.

---

## ✅ Checklist Conception (état)

- [x] Pages principales identifiées
- [x] Wireframes analysés
- [x] Layouts définis
- [x] Composants mappés
- [x] Data flow compris
- [x] Design system documenté
- [ ] Designs Figma du projet Social Network
- [ ] User stories détaillées

---

Notes de travail:

- Si vous voulez, je peux maintenant appliquer la réécriture stylistique sur les autres fichiers de `03-conception/` (wireframes, user-stories.md) et intégrer des liens directs vers les issues/PRs spécifiques. Indiquez-moi si je dois insérer des URLs GitHub complètes pour chaque preuve ou garder les références par numéro d'issue.
