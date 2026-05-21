# User Stories & Cas d'Usage

## Vue d'Ensemble

Nous décrivons ci-dessous les user stories que nous avons rédigées et priorisées pour le projet. Le texte est rédigé à la première personne du pluriel pour refléter notre travail d'équipe et permettre d'indexer facilement chaque story sur les issues/PRs correspondantes du dépôt GitHub.

---

## Preuves & Mapping GitHub

Nous avons lié les fonctionnalités principales aux tickets du dépôt `arocchet/social-network` :

- [Follow / friendship]([Issue #13](https://github.com/arocchet/social-network/issues/13))
- [Groups & Events]([Issue #24](https://github.com/arocchet/social-network/issues/24))
- [Group feed (posts in groups)]([Issue #30](https://github.com/arocchet/social-network/issues/30))
- [Chat system]([Issue #37](https://github.com/arocchet/social-network/issues/37))
- [Notifications]([Issue #39](https://github.com/arocchet/social-network/issues/39))
- [DevOps / Docker / CI]([Issue #40](https://github.com/arocchet/social-network/issues/40))
- [CI pipeline (lint/test/build)]([Issue #45](https://github.com/arocchet/social-network/issues/45))
- [Seed script / demo data]([Issue #46](https://github.com/arocchet/social-network/issues/46))
- [Mark notification as read]([Issue #51](https://github.com/arocchet/social-network/issues/51))
- [OAuth (Google)]([Issue #66](https://github.com/arocchet/social-network/issues/66))
- [Internationalization (i18n)]([Issue #76](https://github.com/arocchet/social-network/issues/76))
- [Settings]([Issue #111](https://github.com/arocchet/social-network/issues/111))
- [PR stabilisation (Docker/Neon/Prisma/Redis)]([PR #118](https://github.com/arocchet/social-network/pull/118))

---

## Utilisateur Classique (Regular User)

### Authentification & Profil

#### US001: Créer un compte

- **As a** nouvel utilisateur
- **I want to** créer un compte avec email/password
- **So that** je peux accéder au réseau social
- **Acceptance Criteria:**
  - [ ] Formulaire d'inscription avec email/password
  - [ ] Validation email (pas de doublons)
  - [ ] Password strength checker
  - [ ] Confirmation email (optionnel)
  - [ ] Auto-login après inscription
  - [ ] Redirection vers onboarding

#### US002: Compléter le profil

- **As a** nouvel utilisateur
- **I want to** compléter mon profil avec avatar, bio, date de naissance
- **So that** ma présence est visible aux autres

#### US003: Se connecter

- **As a** utilisateur inscrit
- **I want to** me connecter avec email/username et password
- **So that** j'accède à mon compte
- **Acceptance Criteria:**
  - [ ] Login avec email OU username
  - [ ] JWT token en cookie HTTP-only
  - [ ] Session persistent
  - [ ] Remember me (7 jours)

#### US004: Consulter mon profil

- **As a** utilisateur connecté
- **I want to** voir mon profil public
- **So that** je vérifie mes informations visibles
- **Acceptance Criteria:**
  - [ ] Avatar, banner, bio
  - [ ] Statistiques (followers, following, posts)
  - [ ] Bouton edit profil

#### US005: Éditer mon profil

- **As a** utilisateur
- **I want to** modifier mes données (nom, bio, avatar, banner)
- **So that** mon profil est à jour
- **Acceptance Criteria:**
  - [ ] Modify firstname, lastname, username, bio
  - [ ] Upload avatar/banner
  - [ ] Prévisualisation
  - [ ] Confirmation de modification

#### US006: Gérer les paramètres

- **As a** utilisateur
- **I want to** accéder aux paramètres (notifications, sécurité, langue)
- **So that** je contrôle mon expérience
- **Acceptance Criteria:**
  - [ ] Theme toggle (light/dark)
  - [ ] Langue (EN/FR)
  - [ ] Notifications (push, email)
  - [ ] Confidentialité (public/private)
  - [ ] Mots de passe à proximité
  - [ ] 2FA optionnel

---

### Posts & Contenu

#### US007: Créer un post

- **As a** utilisateur connecté
- **I want to** publier un post avec texte ±images
- **So that** je partage mon contenu
- **Acceptance Criteria:**
  - [ ] Texte uniquement
  - [ ] Texte + image
  - [ ] Vidéo YouTube embed
  - [ ] Sélectionneur de visibilité (PUBLIC/PRIVATE/FRIENDS)
  - [ ] Draft auto-save
  - [ ] Vérification avant publication

#### US008: Voir le feed

- **As a** utilisateur connecté
- **I want to** voir les posts des utilisateurs que je follow
- **So that** je reste au courant
- **Acceptance Criteria:**
  - [ ] Infinite scroll pagination
  - [ ] Posts ordonnés par datetime DESC
  - [ ] Avatar + nom auteur
  - [ ] Affichage images/vidéos
  - [ ] Like count, comment count
  - [ ] Filtrer par friend only (optionnel)

#### US009: Liker un post

- **As a** utilisateur
- **I want to** liker un post en cliquant sur l'icône 
- **So that** j'exprime mon appréciation
- **Acceptance Criteria:**
  - [ ] Toggle like/unlike
  - [ ] Update like count en temps réel
  - [ ] Icône change de couleur
  - [ ] Only 1 like par user/post

#### US010: Réagir à un post

- **As a** utilisateur
- **I want to** utiliser des reactions (Love, Wow, Laugh, Sad, Angry)
- **So that** j'exprime différentes émotions
- **Acceptance Criteria:**
  - [ ] Menu de 7 reactions
  - [ ] Only 1 reaction par user/post
  - [ ] Replace like avec reaction
  - [ ] Affichage des reactions populaires

#### US011: Commenter un post

- **As a** utilisateur
- **I want to** ajouter un commentaire sur un post
- **So that** je participe à la discussion
- **Acceptance Criteria:**
  - [ ] Texte + optionnel images
  - [ ] Timestamp
  - [ ] Author info (avatar, nom)
  - [ ] Like sur commentaires
  - [ ] Réponses à commentaires (thread)

#### US012: Supprimer mon post

- **As a** propriétaire d'un post
- **I want to** supprimer mon post
- **So that** je contrôle mon contenu
- **Acceptance Criteria:**
  - [ ] Only le propriétaire peut supprimer
  - [ ] Confirmation avant suppression
  - [ ] Supprime aussi commentaires/reactions
  - [ ] Update feed immédiat

#### US013: Partager un post

- **As a** utilisateur
- **I want to** partager un post sur ma timeline
- **So that** mes amis voient ce contenu
- **Acceptance Criteria:**
  - [ ] Share button
  - [ ] Crée un nouveau post avec citation du post original
  - [ ] Garde lien vers original

---

### Stories

#### US014: Créer une story

- **As a** utilisateur
- **I want to** partager une story (24h duration)
- **So that** je partage des moments éphémères
- **Acceptance Criteria:**
  - [ ] Photo/vidéo upload
  - [ ] Filtre texte optionnel
  - [ ] Visibilité (PUBLIC/FRIENDS)
  - [ ] Auto-delete après 24h
  - [ ] Privacy: only followers

#### US015: Voir les stories

- **As a** utilisateur
- **I want to** voir les stories des utilisateurs que je follow
- **So that** je suis actif dans le réseau
- **Acceptance Criteria:**
  - [ ] Carousel en haut du feed
  - [ ] Stories chronologiques (oldest → newest)
  - [ ] Affiche seen/unseen count
  - [ ] Avatar avec badge vert (unseen)

#### US016: Interagir avec une story

- **As a** utilisateur
- **I want to** liker ou commenter une story
- **So that** j'interagis avec le contenu
- **Acceptance Criteria:**
  - [ ] Like button
  - [ ] React avec emojis
  - [ ] Voir likes/comments count

---

### Amitié & Suivi

#### US017: Suivre un utilisateur

- **As a** utilisateur
- **I want to** suivre (follow) un autre utilisateur
- **So that** je vois ses posts dans mon feed
- **Acceptance Criteria:**
  - [ ] Follow button sur profil
  - [ ] Toggle follow/unfollow
  - [ ] Counter updated
  - [ ] Follow = voir tous posts PUBLIC/FRIENDS

#### US018: Demander en amitié

- **As a** utilisateur
- **I want to** envoyer une demande d'amitié
- **So that** on devienne amis
- **Acceptance Criteria:**
  - [ ] Add friend button
  - [ ] Status PENDING → ACCEPTED
  - [ ] Notification reçue
  - [ ] Only amis = voir PRIVATE posts

#### US019: Accepter demande d'amitié

- **As a** utilisateur
- **I want to** accepter une demande d'amitié
- **So that** je confirm la relation
- **Acceptance Criteria:**
  - [ ] Voir liste demandes
  - [ ] Accept/Decline buttons
  - [ ] Notification à l'autre user
  - [ ] Add to friends list

#### US020: Consulter mes amis

- **As a** utilisateur
- **I want to** voir ma liste d'amis
- **So that** je gère mes relations
- **Acceptance Criteria:**
  - [ ] Affiche tous les amis
  - [ ] Avatar + nom
  - [ ] Last seen
  - [ ] Remove friend option

---

### Messagerie

#### US021: Envoyer un message direct

- **As a** utilisateur
- **I want to** envoyer un message privé à un autre utilisateur
- **So that** on communique 1-to-1
- **Acceptance Criteria:**
  - [ ] Accès depuis profil/friends
  - [ ] Message ±image
  - [ ] Status: SENT → DELIVERED → READ
  - [ ] SSE / polling real-time
  - [ ] Typing indicator

#### US022: Voir liste des conversations

- **As a** utilisateur
- **I want to** voir toutes mes conversations
- **So that** je gère mes DMs
- **Acceptance Criteria:**
  - [ ] List toutes conversations
  - [ ] Last message preview
  - [ ] Unread badge
  - [ ] Search conversations
  - [ ] Sort par recent
  - [ ] SSE notifications

#### US023: Archiver une conversation

- **As a** utilisateur
- **I want to** archiver une conversation
- **So that** ma liste reste organisée
- **Acceptance Criteria:**
  - [ ] Archive action
  - [ ] Hidden from main list
  - [ ] Restaurable depuis archive

---

### Recherche

#### US024: Rechercher des utilisateurs

- **As a** utilisateur
- **I want to** chercher d'autres utilisateurs par nom/username
- **So that** je trouve des gens à follow
- **Acceptance Criteria:**
  - [ ] Search bar en haut
  - [ ] Debounced search
  - [ ] Results: avatar, nom, bio, follow button
  - [ ] Recent searches saved

#### US025: Rechercher des posts

- **As a** utilisateur
- **I want to** chercher des posts par mots-clés
- **So that** je trouve du contenu pertinent
- **Acceptance Criteria:**
  - [ ] Full-text search
  - [ ] Results: author, date, like count
  - [ ] Filter par date, author

---

### Notifications

#### US026: Recevoir notifications

- **As a** utilisateur
- **I want to** être notifié des actions (like, comment, follow, message)
- **So that** je reste engagé
- **Acceptance Criteria:**
  - [ ] Notifications temps réel via SSE/Redis
  - [ ] Badge sur icône notifs

#### US027: Consulter notifications

- **As a** utilisateur
- **I want to** voir ma liste de notifications
- **So that** je vérifie les actions
- **Acceptance Criteria:**
  - [ ] List notifications
  - [ ] Mark as read/unread
  - [ ] Filter par type
  - [ ] Timestamp

---

### Groupes (Communities)

#### US028: Créer un groupe

- **As a** utilisateur
- **I want to** créer un groupe privé/public
- **So that** je crée une communauté
- **Acceptance Criteria:**
  - [ ] Nom + description
  - [ ] Avatar groupe
  - [ ] Visibilité (PUBLIC/PRIVATE)
  - [ ] Creator = owner
  - [ ] Invite members

#### US029: Rejoindre un groupe

- **As a** utilisateur
- **I want to** rejoindre un groupe public
- **So that** j'accède au contenu
- **Acceptance Criteria:**
  - [ ] Auto-join si PUBLIC
  - [ ] Request if PRIVATE
  - [ ] Owner approval
  - [ ] Add to my groups

#### US030: Voir groupe détails

- **As a** utilisateur
- **I want to** voir les infos d'un groupe
- **So that** je sais ce que c'est
- **Acceptance Criteria:**
  - [ ] Nom + description
  - [ ] Membres list
  - [ ] Events tab
  - [ ] Chat tab
  - [ ] Settings (owner only)

#### US031: Inviter dans groupe

- **As a** group owner
- **I want to** inviter des utilisateurs
- **So that** elles rejoignent le groupe
- **Acceptance Criteria:**
  - [ ] Select users
  - [ ] Send invite
  - [ ] Notification reçue
  - [ ] Accept/decline

#### US032: Communiquer dans groupe

- **As a** membre groupe
- **I want to** envoyer des messages dans le groupe
- **So that** on collabore
- **Acceptance Criteria:**
  - [ ] Group chat (comme DM)
  - [ ] All members voient
  - [ ] Typing indicator
  - [ ] Attachments (images)

---

### Événements (Events)

#### US033: Créer un événement

- **As a** group owner
- **I want to** créer un événement dans le groupe
- **So that** on organise une activité
- **Acceptance Criteria:**
  - [ ] Titre + description
  - [ ] Date/heure
  - [ ] Location (text)
  - [ ] Creator = attendee YES

#### US034: Consulter événements

- **As a** utilisateur
- **I want to** voir les événements de mes groupes
- **So that** je vois le calendrier
- **Acceptance Criteria:**
  - [ ] List view + calendar
  - [ ] Filter (upcoming, past, my events)
  - [ ] Event details: title, date, members attending
  - [ ] RSVP count

#### US035: RSVP événement

- **As a** utilisateur
- **I want to** répondre à un événement (YES/NO/MAYBE)
- **So that** l'organisateur sait combien attendus
- **Acceptance Criteria:**
  - [ ] 3 options: YES, NO, MAYBE
  - [ ] Change response
  - [ ] Affiche attendees
  - [ ] Push notif 24h avant

---

### Reels (Vidéos)

#### US036: Partager une vidéo

- **As a** utilisateur
- **I want to** partager une vidéo courte
- **So that** je crée du contenu engageant
- **Acceptance Criteria:**
  - [ ] Video upload
  - [ ] Auto-trim si > 60s
  - [ ] Thumbnail generation
  - [ ] Published dans /reels

#### US037: Regarder reels

- **As a** utilisateur
- **I want to** scroller verticalement des vidéos
- **So that** je découvre du contenu (TikTok style)
- **Acceptance Criteria:**
  - [ ] Fullscreen vertical video
  - [ ] Infinite scroll
  - [ ] Auto-play next
  - [ ] Pause on scroll out

#### US038: Interagir avec reel

- **As a** utilisateur
- **I want to** liker/commenter une vidéo
- **So that** j'engage avec le créateur
- **Acceptance Criteria:**
  - [ ] Like button floating
  - [ ] Comment button
  - [ ] Share button
  - [ ] Creator info (link to profile)

---

## Priorités & Estimation

### Phase 1: MVP (MUST HAVE) - 4 semaines

| User Story | Priorité  | Estimation   |
| ---------- | --------- | ------------ |
| US001      |  HIGH   | 2 jours      |
| US002      |  HIGH   | 1 jour       |
| US003      |  HIGH   | 2 jours      |
| US004      |  HIGH   | 1 jour       |
| US005      |  HIGH   | 2 jours      |
| US007      |  HIGH   | 3 jours      |
| US008      |  HIGH   | 2 jours      |
| US009      |  HIGH   | 1 jour       |
| US011      |  HIGH   | 2 jours      |
| US021      |  HIGH   | 3 jours      |
| US024      |  MEDIUM | 2 jours      |
| US026      |  MEDIUM | 2 jours      |
| **Total**  |           | **25 jours** |

### Phase 2: Features (SHOULD HAVE) - 2 semaines

- US010, US014, US017, US018, US028, US033, US036

### Phase 3: Polish (NICE TO HAVE) - 1 semaine

- US013, US016, US023

---

## Acceptance Criteria Summary

**Front-End:**

-  Responsive design (mobile, tablet, desktop)
-  Theme switcher (light/dark)
-  Loading states + error handling
-  Infinite scroll pagination
-  Real-time updates (SSE / Redis)
-  Image optimization (Cloudinary)
-  SEO optimization (meta tags)
-  Accessibility (WCAG 2.1 AA)

**Back-End:**

-  JWT authentication
-  Input validation + sanitization
-  Error logging
-  Database indexes

**DevOps:**

-  Docker containerization
-  CI/CD pipeline (GitHub Actions)

---

## Prochaines Étapes

1.  User stories écrites
2. [ ] Wireframes créés pour le projet
3. [ ] Prototype Figma du projet
4. [ ] Validation avec l'équipe
5. [ ] Sprint planning
6. [ ] Implémentation Phase 1
