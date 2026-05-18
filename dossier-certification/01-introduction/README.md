# 01 - Introduction

## Contexte et Objectif

### 🎯 Problématique

Le projet Social Network a pour objectif de concevoir une application web sociale moderne permettant à des utilisateurs de publier du contenu, interagir avec leur réseau, échanger en temps réel et organiser leurs échanges autour de groupes, d'événements et de notifications.

Dans le cadre de la formation Zone01 Rouen Normandie, ce projet sert de support principal pour démontrer la maîtrise d'un développement full stack structuré, sécurisé et maintenable, en environnement collaboratif.

### 💡 Solution Proposée

Plateforme de réseau social permettant:

- publication de posts, stories et médias,
- réactions et commentaires,
- messagerie privée et notifications en temps réel,
- gestion de profils, d'amis et de groupes,
- recherche et découverte de contenu.

---

## 📊 Informations Projet

**Titre:** Social Network  
**Type:** Application web full-stack
**Repository:** https://github.com/arocchet/social-network
**Stack Technologique:**

- Frontend: Next.js 15, React 19, TypeScript, Tailwind CSS
- Backend: Next.js API Routes, TypeScript
- Database: PostgreSQL (Neon), Prisma ORM
- Real-time: Upstash Redis, SSE/Polling
- Media: Cloudinary
- Auth: JWT (jose), bcrypt
- Deployment: Docker, Docker Compose

---

## 👥 Équipe et Contexte

- **Responsable:** Christophe Lecart (reconversion, 20+ ans expérience en ingénierie/conformité)
- **Cadre:** Formation Zone01 Rouen Normandie (approche pratique en équipe)
- **Projet collectif:** Développement en collaboration avec d'autres candidats
- **Date de démarrage:** 2024
- **Statut actuel:** Préparation à la certification RNCP 37873
- **Objectif post-formation:** Alternance ou CDI en développement web full-stack

### Contexte du Code Initial

Le projet a démarré avec une base fonctionnelle incomplète. Ma contribution a été d':

- Stabiliser l'architecture (middleware, auth, API)
- Implémenter des fonctionnalités manquantes (notifications, temps réel, déploiement)
- Sécuriser l'authentification (JWT avec jose, hachage bcrypt)
- Documenter l'ensemble du système pour la certification

---

## 📋 Sommaire du Dossier

1. **Introduction** - Contexte et objectifs
2. **Cahier des Charges** - Spécifications fonctionnelles
3. **Conception** - Wireframes, maquettes, modélisation
4. **Développement** - Architecture et implémentation
5. **Déploiement** - Infrastructure et mise en production
6. **Bilan** - Retour d'expérience
7. **Annexes** - Code source et documentation technique

---

## ✅ Critères de Réussite

- [ ] Authentification sécurisée (JWT/Session)
- [ ] Gestion des utilisateurs
- [ ] Création et partage de contenu
- [ ] Système de réactions et de commentaires
- [ ] Système de notifications en temps réel
- [ ] Responsive design (mobile/desktop)
- [ ] Performance optimale
- [ ] Tests automatisés
- [ ] Documentation complète
- [ ] Déploiement fonctionnel
