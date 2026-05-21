# 02 - Cahier des Charges

## Objectifs Principaux

Le projet Social Network est réalisé en équipe dans le cadre de la formation Zone01 Rouen Normandie. Le cahier des charges ci-dessous synthétise les fonctionnalités réellement suivies dans le dépôt GitHub du projet, sous forme d'issues et de PR, puis les contraintes de mise en oeuvre qui structurent le développement.

### Organisation GitHub du projet

Le travail a été découpé en tickets GitHub pour suivre le développement en équipe. Les sujets visibles dans le dépôt couvrent notamment:

- [Follow System]([Issue #13](https://github.com/arocchet/social-network/issues/13))
- [Groups & Events]([Issue #24](https://github.com/arocchet/social-network/issues/24))
- [Group feed — Posts & comments inside group]([Issue #30](https://github.com/arocchet/social-network/issues/30))
- [Chat System]([Issue #37](https://github.com/arocchet/social-network/issues/37))
- [Notifications]([Issue #39](https://github.com/arocchet/social-network/issues/39))
- [DevOps: Docker, CI/CD]([Issue #40](https://github.com/arocchet/social-network/issues/40))
- [CI — Lint, test, build, push image]([Issue #45](https://github.com/arocchet/social-network/issues/45))
- [Seed script — Demo data]([Issue #46](https://github.com/arocchet/social-network/issues/46))
- [PATCH /notifications/:id/read — Mark as read]([Issue #51](https://github.com/arocchet/social-network/issues/51))
- [OAuth (Google) authentication]([Issue #66](https://github.com/arocchet/social-network/issues/66))
- [Internationalization]([Issue #76](https://github.com/arocchet/social-network/issues/76))
- [Settings]([Issue #111](https://github.com/arocchet/social-network/issues/111))

La stabilisation du build et du déploiement a ensuite été consolidée par la PR: [PR #118](https://github.com/arocchet/social-network/pull/118)

### Fonctionnalités Essentielles

#### Gestion des Utilisateurs

- Inscription et authentification (email/password + Google OAuth)
- Gestion de profil (avatar, bannière, bio, visibilité PUBLIC/PRIVATE)
- Système de suivi (followers/following + demandes d'amitié)

#### Publication et Interaction

- Création de posts/articles
- Commentaires et réponses
- Système de likes/réactions sur posts, stories et commentaires
- Partage de contenu
- Gestion de la visibilité des publications

#### Communication

- Système de messagerie privée
- Notifications en temps réel
- Groupes/Communautés

#### Découverte

- Recherche et filtrage (users, posts, groupes)
- Historique de recherche
- Exploration du contenu public

---

## Contraintes Techniques

### Sécurité

- Authentification JWT/OAuth
- Validation des données
- Chiffrement des mots de passe (bcrypt)
- Contraintes de réactions: un utilisateur ne peut pas multiplier une même réaction sur un même contenu

> 📌 Détails techniques + audit complet (mesures en place, risques résiduels, conformité RGPD, roadmap de durcissement) dans [04-developpement/securite-rgpd.md](../04-developpement/securite-rgpd.md).

### Scalabilité

- Cache Redis
- Base de données PostgreSQL
- CDN pour assets

### Compatibilité

- Support navigateurs modernes (Chrome, Firefox, Safari, Edge)
- Responsive design (mobile/tablet/desktop)

### Performance

- Optimisation images (Next.js Image)
- Code splitting automatique
- Lazy loading
- Chargement fluide du feed, des profils et des conversations

---

## User Stories

| Utilisateur | Action         | Priorité | Critères d'acceptation     |
| ----------- | -------------- | -------- | -------------------------- |
| Visiteur    | S'inscrire     |    | Email validé, compte créé  |
| Utilisateur | Se connecter   |    | Session JWT créée          |
| Utilisateur | Créer un post  |    | Post visible immédiatement |
| Utilisateur | Commenter      |    | Commentaire visible        |
| Utilisateur | Liker/Réagir   |      | Compteur mis à jour        |
| Utilisateur | Suivre un user |      | Feed personnalisé          |

---

## Objectifs de Qualité

| Indicateur              | Cible     | Approche retenue                          |
| ----------------------- | --------- | ----------------------------------------- |
| Disponibilité           | > 99 %    | Docker + Vercel + Neon serverless         |
| Temps de chargement     | < 2 s     | SSR Next.js, React Query, lazy loading    |
| TTFB                    | < 600 ms  | Edge CDN Vercel, cache Redis              |
| Stabilité visuelle (CLS)| < 0.1     | Next.js Image, layout réservé             |
| Couverture de tests     | > 80 %    | Jest, tests d'intégration API             |

---

## Timeline

| Phase         | Durée    | Statut                            |
| ------------- | -------- | --------------------------------- |
| Conception    | 25 jours | Planifié (MVP scope)              |
| Développement | 14 jours | Phase 2 (features)                |
| Tests         | 7 jours  | Phase 3 (polish & intégration)    |
| Déploiement   | 3 jours  | Préparation & déploiement initial |

Notes:

- Phase 1 (MVP - 25 jours): implémentation des fonctionnalités critiques (auth, posts, feed, basic chat, notifications).
- Phase 2 (14 jours): fonctionnalités avancées (groups, events, reels, amélioration UX, i18n).
- Phase 3 (7 jours): tests d'intégration, corrections, optimisation performances et préparation de la soutenance.
