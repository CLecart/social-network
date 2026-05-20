# 01 - Introduction

## Contexte et Objectif

### Problématique

Le projet Social Network a pour objectif de concevoir une application web sociale moderne permettant à des utilisateurs de publier du contenu, interagir avec leur réseau, échanger en temps réel et organiser leurs échanges autour de groupes, d'événements et de notifications.

Dans le cadre de la formation Zone01 Rouen Normandie, ce projet sert de support principal pour démontrer la maîtrise d'un développement full stack structuré, sécurisé et maintenable, en environnement collaboratif.

### Solution Proposée

Plateforme de réseau social permettant:

- publication de posts, stories et médias,
- réactions et commentaires,
- messagerie privée et notifications en temps réel,
- gestion de profils, d'amis et de groupes,
- recherche et découverte de contenu.

---

## Informations Projet

**Titre:** Social Network  
**Type:** Application web full-stack
**Repository:** [arocchet/social-network](https://github.com/arocchet/social-network)
**Stack Technologique:**

- Frontend: Next.js 15, React 19, TypeScript, Tailwind CSS
- Backend: Next.js API Routes, TypeScript
- Database: PostgreSQL (Neon), Prisma ORM
- Real-time: Upstash Redis, SSE/Polling
- Media: Cloudinary
- Auth: JWT (jose), bcrypt
- Deployment: Docker, Docker Compose

---

## Équipe et Contexte

Le projet Social Network est un projet de groupe Zone01. La particularité de notre équipe : j'étais le seul membre **sans alternance**, les autres apprenants étant en entreprise à des rythmes différents (fréquences et jours variables selon les contrats). Travailler ensemble en synchrone était donc structurellement impossible.

Cette contrainte nous a conduits à **utiliser GitHub de manière professionnelle et systématique** comme seul outil de coordination :

- **Issues** pour tout tracker : chaque fonctionnalité, bug ou tâche DevOps fait l'objet d'une issue dédiée
- **Pull Requests** pour toute contribution : aucun push direct sur `main`, tout passe par une PR avec revue de code
- **Branch protection rules** : la branche `main` est protégée — merge impossible sans que tous les checks soient au vert
- **CI/CD (GitHub Actions)** : lint ESLint, tests Jest, build Next.js déclenchés automatiquement à chaque PR
- **SonarQube** : analyse statique du code intégrée au pipeline — détection de code smells, vulnérabilités et duplications avant tout merge
- **Vercel preview deployments** : chaque PR génère automatiquement un environnement de prévisualisation déployé, permettant de tester le rendu réel avant merge en production
- **Branches feature** : chacun travaille sur sa branche, merge après validation de l'ensemble des checks
- **Labels et milestones** pour prioriser et organiser les lots de travail

Chacun avançait dans son coin selon ses disponibilités, mais le code convergait proprement grâce à ces pratiques. Ce contexte m'a forcé à acquérir très tôt les réflexes d'un développeur travaillant en équipe distribuée.

### Contexte du Code Initial

Le projet a démarré avec une base fonctionnelle incomplète. Ma contribution a été d':

- Stabiliser l'architecture (middleware, auth, API)
- Implémenter des fonctionnalités manquantes (notifications, temps réel, déploiement)
- Sécuriser l'authentification (JWT avec jose, hachage bcrypt)
- Documenter l'ensemble du système pour la certification

---

## Sommaire du Dossier

1. **Introduction** - Contexte et objectifs
2. **Cahier des Charges** - Spécifications fonctionnelles
3. **Conception** - Wireframes, maquettes, modélisation
4. **Développement** - Architecture et implémentation
5. **Déploiement** - Infrastructure et mise en production
6. **Bilan** - Retour d'expérience
7. **Annexes** - Code source et documentation technique

---

## Critères de Réussite

- [x] Authentification sécurisée (JWT + Google OAuth, cookies HTTP-only)
- [x] Gestion des utilisateurs (profil, avatar, bannière, visibilité)
- [x] Création et partage de contenu (posts, stories, reels, images via Cloudinary)
- [x] Système de réactions et de commentaires (7 types de réactions, commentaires imbriqués)
- [x] Système de notifications en temps réel (SSE + Upstash Redis)
- [x] Responsive design (mobile/tablet/desktop, Tailwind CSS)
- [x] Performance optimisée (React Query, SWR, Next.js Image, code splitting)
- [x] Tests automatisés (Jest, tests d'intégration authentification)
- [x] Documentation complète (dossier 60+ pages, diagrammes, API spec)
- [x] Déploiement fonctionnel (Docker multi-stage, docker-compose, Vercel)
