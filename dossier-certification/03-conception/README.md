# 03 - Conception

## 📋 Résumé

Cette section documente la conception complète du réseau social `social-network`:

- **Pages & Wireframes:** 12+ pages principales documentées
- **Modélisation Données:** 18 modèles Prisma avec diagrammes MCD/MLD
- **User Stories:** 43 user stories avec priorités et estimations
- **Design System:** Palette couleurs, typographie, composants

---

## 📚 Documents Disponibles

### 1️⃣ [Pages et Wireframes](./pages.md)

- Accueil (Home/Feed)
- Authentification (Login/Register/Onboarding)
- Profil utilisateur
- Messages/Chat (Direct & Groupe)
- Reels/Vidéos
- Recherche
- Événements
- Groupes/Communautés
- Paramètres
- Invitations
- Design System (couleurs, typo, composants)
- Architecture page et data flow

### 2️⃣ [Dictionnaire de Données](./donnees.md)

- **18 Modèles documentés:**
  - User, Post, Comment, Reaction, Story
  - Message, Friendship, Conversation
  - GroupMessage, GroupInvitation, GroupJoinRequest, GroupMember
  - Event, Rsvp, UserSettings, Notification, Account
- **Attributs complets:** Types, constraints, descriptions
- **Relations:** Cardinalités et foreign keys
- **Enums:** Réaction types, statuts invitation, etc.
- **MCD/MLD Diagrammes:** Modèles conceptuels et logiques

### 3️⃣ [User Stories](./user-stories.md)

- **43 User Stories** organisées par rôle:
  - 👤 Utilisateur classique (28 stories)
  - 👨‍💼 Modérateur (3 stories)
  - 🛡️ Admin (2 stories)
- **Priorités & Estimations:** HIGH/MEDIUM/LOW
- **Phases de développement:**
  - Phase 1 MVP (25 jours)
  - Phase 2 Features (2 semaines)
  - Phase 3 Polish (1 semaine)
- **Acceptance Criteria:** Front/Back/DevOps

---

## 🎯 Fonctionnalités Clés

### 📱 Réseautage Social

- ✅ Posts (texte + images + vidéos)
- ✅ Followers/Following + Amitié
- ✅ Likes/Comments/Reactions
- ✅ Stories (24h ephemeral)
- ✅ Reels (vertical short videos)

### 💬 Communication

- ✅ Direct Messages (1-to-1)
- ✅ Group Chat
- ✅ Typing Indicator + Presence
- ✅ Message Status (SENT/DELIVERED/READ)

### 👥 Groupes & Événements

- ✅ Create/Join Groups
- ✅ Group Invitations
- ✅ Events Calendar
- ✅ RSVP Management

### 🔍 Discovery

- ✅ User Search
- ✅ Post Search
- ✅ Search History
- ✅ Recent Activity

### ⚙️ Personalization

- ✅ Theme Toggle (Light/Dark)
- ✅ Language (EN/FR)
- ✅ Notification Settings
- ✅ Privacy Controls

---

## 🗄️ Architecture de Données

### Modèles Principaux

```
User ←→ Post ←→ Comment ←→ Reaction
  │
  ├→ Friendship (2-way)
  ├→ Conversation
  │  ├→ ConversationMember
  │  ├→ GroupMessage
  │  ├→ Event
  │  │  ├→ Rsvp
  │  │  └→ GroupMessage
  │  ├→ GroupMember
  │  ├→ GroupInvitation
  │  └→ GroupJoinRequest
  │
  ├→ Story ←→ Reaction
  ├→ Message
  ├→ Notification
  ├→ UserSettings
  └→ Account (OAuth)
```

### Statistiques

- **18 modèles Prisma**
- **40+ relations**
- **35+ attributs User**
- **7 enums** (Visibilité, Réaction types, statuts)

---

## 📐 Pages Implémentées

| Page              | Route               | Rôle                     | Statut |
| ----------------- | ------------------- | ------------------------ | ------ |
| **Feed**          | `/`                 | Affichage posts          | ✅     |
| **Login**         | `/login`            | Authentification         | ✅     |
| **Register**      | `/register`         | Inscription              | ✅     |
| **Onboarding**    | `/onboarding`       | Complétude profil        | ✅     |
| **Profil**        | `/profile/[userId]` | Voir profil utilisateur  | ✅     |
| **Chat (List)**   | `/chat`             | Liste conversations      | ✅     |
| **Chat (Direct)** | `/chat/[id]`        | Message 1-to-1           | ✅     |
| **Reels**         | `/reels`            | Short videos             | ✅     |
| **Search**        | `/search`           | Rechercher contenu       | ✅     |
| **Groupes**       | `/groups`           | Lister groupes           | ✅     |
| **Groupe Detail** | `/groups/[id]`      | Détail groupe + chat     | ✅     |
| **Événements**    | `/events`           | Calendar événements      | ✅     |
| **Paramètres**    | `/settings`         | Préférences user         | ✅     |
| **Invitations**   | `/invitations`      | Demandes d'amitié/groupe | ✅     |

---

## 🎨 Design System

### Palette Couleurs (Thème Dark)

**Primary Colors:**

```css
--blue40: #ff6d00 (Primary action) --blue60: #ff7900 (Hover/Active);
```

**Backgrounds:**

```css
--bgLevel1: #1a191c (Darkest) --bgLevel2: #222024 --bgLevel3: #272529
  --bgLevel4: #333036 --bgLevel5: #534e57 (Lightest);
```

**Text:**

```css
--textNeutral: #ffffff (Primary text) --textNeutralAlt: #e8e1f0 (Secondary)
  --textMinimal: #bdbdbd (Tertiary);
```

**Accents:**

```css
--red50: #a71e34 (Danger) --teal50: #56ab91 (Success) --purple60: #8b2fc9
  (Accent) --green50: #25a244 (Complete);
```

### Typography

- **Font Family:** Geist (via Next.js)
- **H1:** 28-32px
- **H2:** 20-24px
- **Body:** 14-16px
- **Small:** 12px

### Breakpoints

- Mobile: < 640px
- Tablet: 640px - 1024px
- Desktop: > 1024px

### Components

- Button, Avatar, Card, Badge, Dialog
- Input, Tabs, Switch, Notification Badge

---

## 🔄 Data Flow

```
User Interaction
    ↓
Component State Update
    ↓
Custom Hook (useApi, usePostData, etc)
    ↓
API Request (via apiFetch)
    ↓
Backend Route Handler
    ↓
Prisma Query
    ↓
PostgreSQL
    ↓
Response
    ↓
Update Context/Provider
    ↓
Re-render Component
```

---

## 📊 Diagrammes

### MCD - Modèle Conceptuel de Données

Voir [donnees.md - MCD Section](./donnees.md#-mcd---modèle-conceptuel-de-données)

Représente toutes les entités et leurs relations logiques.

### MLD - Modèle Logique de Données

Voir [donnees.md - MLD Section](./donnees.md#-mld---modèle-logique-de-données)

Montre le schéma de base de données normalisé.

---

## 📋 Wireframes & Maquettes

**Ressource Notion (Designs):**  
https://zone01rouen.notion.site/#28688f0a85b44a6ea9b1da60cca90e5a

**À documenter dans cette section:**

- Screenshots des wireframes
- Descriptions UX/UI
- User flows
- Interaction patterns

---

## ✅ Checklist Conception

- [x] Pages principales documentées (12+)
- [x] Dictionnaire de données complet (18 modèles)
- [x] Diagrammes MCD/MLD
- [x] User stories (43 stories)
- [x] Design system défini
- [x] Architecture data flow
- [ ] Wireframes Notion documenter
- [ ] Screenshots maquettes
- [ ] User flows validation
- [ ] Prototype Figma

---

## 📝 Fichiers Liés

- **Introduction:** [01-introduction/README.md](../01-introduction/README.md)
- **Cahier des charges:** [02-cahier-des-charges/README.md](../02-cahier-des-charges/README.md)
- **Développement:** [04-developpement/README.md](../04-developpement/README.md)
- **Code source:** `/src`
- **Prisma Schema:** `/prisma/schema.prisma`

---

## 🚀 Prochaines Étapes

1. **Documentation Wireframes:**
   - Exporter screenshots Notion
   - Créer wireframe.md avec images
   - Annoter UX decisions

2. **Validation Design:**
   - Partager avec stakeholders
   - Recueillir feedback
   - Itérer si nécessaire

3. **Developer Handoff:**
   - Créer tasks pour développement
   - Assigner user stories
   - Sprint planning

4. **Implementation:**
   - Phase 1: MVP (25 jours)
   - Phase 2: Features (2 semaines)
   - Phase 3: Polish (1 semaine)

---

**Last Updated:** 2025-01-01  
**Version:** 1.0
