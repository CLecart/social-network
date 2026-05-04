# 📱 Pages du Projet Social Network

## 🏠 Accueil (Home/Feed) - `/`

**Objectif:** Page principale affichant le flux de posts

### Structure:

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

### Fonctionnalités:

- ✅ Infinite scroll pagination
- ✅ Stories en haut de page
- ✅ Like/Comment/Share posts
- ✅ Theme toggle (light/dark)
- ✅ Responsive mobile/desktop

### Composants Clés:

- `PostCard` - Affichage d'un post
- `Stories` - Carrousel de stories
- `NavigationBar` - Sidebar navigation
- `ModeToggle` - Theme switcher

---

## 🔐 Authentification

### Login - `/login`

**Layout:** 2 colonnes (formulaire + image)

```
┌─ Logo
├─ Email/Username Input
├─ Password Input
├─ Login Button
├─ Forgot Password Link
└─ Register Link
```

**Fonctionnalités:**

- ✅ Email ou username
- ✅ JWT token creation
- ✅ Remember me
- ✅ Error handling
- ✅ Forgot password

### Register - `/register`

**Layout:** 2 colonnes (formulaire + démo profil)

**Steps:**

1. Email + Password
2. Informations personnelles
3. Avatar + Bio
4. Confirmation

**Fonctionnalités:**

- ✅ Email validation
- ✅ Password strength checker
- ✅ Avatar preview
- ✅ Auto-login après inscription

### Onboarding - `/onboarding`

**Objectif:** Compléter le profil après inscription

**Steps:**

- Avatar + Banner
- Informations personnelles
- Préférences
- Connexions (follow suggestions)

---

## 👤 Profil Utilisateur - `/profile/[userId]`

**Layout (Desktop):**

```
┌─ Header
│  ├─ Banner
│  └─ Avatar + Infos
├─ Stats (Followers, Following, Posts)
├─ Action Buttons
│  ├─ Follow
│  ├─ Friend Request
│  └─ Message
├─ Tabs (Posts, Photos, Videos)
└─ Posts Grid
```

**Layout (Mobile):** Layout empilé verticalement

### Filtres Posts:

- `all` - Tous les posts
- `photos` - Images seulement
- `videos` - Vidéos seulement
- `text` - Texte seulement

### Fonctionnalités:

- ✅ Afficher posts de l'utilisateur
- ✅ Follow/Unfollow
- ✅ Friend request
- ✅ Send message
- ✅ Edit profile (si propriétaire)
- ✅ Stats (followers, following)

---

## 💬 Messages/Chat

### Chat Direct - `/chat/[id]`

**Header:**

```
┌─ Back Button
├─ User Avatar + Name
├─ Online Status
└─ Info Button
```

**Chat Window:**

```
├─ Messages List (scrollable)
├─ Message Input
└─ Send Button
```

**Fonctionnalités:**

- ✅ Messages en temps réel (WebSocket)
- ✅ Statut (SENT, DELIVERED, READ)
- ✅ Image upload
- ✅ Typing indicator
- ✅ Presence (en ligne/hors ligne)

### Chat Groupe - `/chat?group=[id]`

**Identique** au chat direct mais:

- ✅ Affiche le titre du groupe
- ✅ Montre nombre de membres
- ✅ Lien vers settings groupe

### Liste Conversations - `/chat`

**Layout:**

```
┌─ Header (Messages)
├─ Search Bar
├─ Conversations List
│  ├─ Avatar
│  ├─ Name/Title
│  ├─ Last Message Preview
│  ├─ Timestamp
│  └─ Unread Badge
└─ Create New Chat Button
```

**Fonctionnalités:**

- ✅ Search conversations
- ✅ Unread count badges
- ✅ Last message preview
- ✅ Sort by recent

---

## 🎬 Reels/Vidéos - `/reels`

**Layout:**

```
┌─ Header (Reels)
├─ Video Container (Fullscreen)
│  ├─ Video Player
│  ├─ Controls (Play, Like, Comment)
│  └─ User Info
├─ Next/Previous Arrows
└─ Load More Button
```

**Fonctionnalités:**

- ✅ Infinite scroll de vidéos
- ✅ Auto-play vidéo visible
- ✅ Like/Comment
- ✅ Video detection (URL contains 'video')
- ✅ Loader state

---

## 🔍 Recherche - `/search`

**Layout:**

```
┌─ Search Bar
├─ Recent Searches (si vide)
├─ Results
│  ├─ Users
│  ├─ Posts
│  ├─ Tags/Hashtags
│  └─ Places (optionnel)
└─ Load More
```

**Fonctionnalités:**

- ✅ Search history (localStorage)
- ✅ Debounced search
- ✅ Results categorization
- ✅ Recent searches

---

## 📅 Événements

### Liste - `/events`

**Layout:**

```
┌─ Header
├─ Stats Cards
│  ├─ À venir
│  ├─ Mes événements
│  └─ Participations
├─ Tabs (À venir, Passés, Mes événements)
└─ Events Grid
```

### Détail Groupe Événement - `/groups/[id]`

**Tabs:**

- Events
- Members
- Messages

**Event Card:**

- Titre, Description
- Date/Heure, Lieu
- Owner
- RSVP counts (YES, NO, MAYBE)
- RSVP Status (pour current user)

**Fonctionnalités:**

- ✅ RSVP (YES/NO/MAYBE)
- ✅ Filter (upcoming, past)
- ✅ Create event (owner only)
- ✅ Delete event (owner only)

---

## 👥 Groupes

### Liste - `/groups`

**Layout:**

```
┌─ Header (Mes Groupes)
├─ Create Group Button
├─ Groups Grid
│  ├─ Group Card
│  ├─ Member Preview (3 avatars)
│  ├─ Member Count
│  ├─ Last Message
│  └─ Actions (Manage, Leave)
└─ Empty State
```

### Détail - `/groups/[id]`

**Layout:**

```
┌─ Header
│  ├─ Back Button
│  ├─ Group Title
│  ├─ Member Count
│  └─ Actions (Chat, Create Event, Invite, Settings)
├─ Tabs
│  ├─ Members
│  └─ Events
└─ Content Area
```

**Fonctionnalités:**

- ✅ View members
- ✅ Invite users
- ✅ Create events
- ✅ Delete group (owner)
- ✅ Leave group
- ✅ Group chat

---

## ⚙️ Paramètres - `/settings`

### Main View:

```
┌─ Header
├─ User Profile Card
├─ Sections
│  ├─ Compte
│  │  ├─ Modifier profil
│  │  ├─ Confidentialité
│  │  └─ Notifications
│  ├─ Contenu
│  │  ├─ Amis proches
│  │  ├─ Bloqués
│  │  └─ Préférences contenu
│  └─ Autres
│     ├─ Langue
│     ├─ Sécurité
│     ├─ Aider et support
│     ├─ À propos
│     └─ Déconnexion
└─ Theme Toggle
```

### Sub-pages:

- **Edit Profile:** Modifier nom, username, bio, avatar
- **Privacy:** Compte privé/public
- **Notifications:** Push, email, SMS
- **Security:** Password change, 2FA
- **Blocked:** List et unblock
- **Close Friends:** Gérer amis proches

**Fonctionnalités:**

- ✅ Nested navigation
- ✅ Settings persistence
- ✅ User context awareness

---

## 📬 Invitations - `/invitations`

**Layout:**

```
┌─ Header (Invitations)
├─ Tabs (Groupes, Amis)
├─ Invitations List
│  ├─ Avatar
│  ├─ Name/Group Title
│  ├─ Inviter Name
│  ├─ Date
│  └─ Actions (Accept, Decline)
└─ Empty State
```

**Fonctionnalités:**

- ✅ Invitation de groupe
- ✅ Demande d'amitié
- ✅ Accept/Decline
- ✅ Success modal
- ✅ Refresh unread counts

---

## 🎨 Design System

### Palette Couleurs

```css
Primary:
--blue40: #ff6d00
--blue60: #ff7900

Backgrounds:
--bgLevel1: #1a191c (darkest)
--bgLevel2: #222024
--bgLevel3: #272529
--bgLevel4: #333036
--bgLevel5: #534e57

Text:
--textNeutral: #ffffff
--textNeutralAlt: #e8e1f0
--textMinimal: #bdbdbd

Accents:
--red50: #a71e34
--teal50: #56ab91
--purple60: #8b2fc9
--green50: #25a244
```

### Typographie

- **Font:** Geist (via Next.js font)
- **Sizes:**
  - H1: 28-32px
  - H2: 20-24px
  - Body: 14-16px
  - Small: 12px

### Responsive Breakpoints

```
Mobile: < 640px
Tablet: 640px - 1024px
Desktop: > 1024px
```

### Components Réutilisables

- `Button` - Variants (primary, outline, ghost)
- `Avatar` - With fallback
- `Card` - Container with header
- `Badge` - Labels
- `Dialog` - Modals
- `Input` - Form input
- `Tabs` - Tab navigation
- `Switch` - Toggle
- `Notification Badge` - Unread count

---

## 📐 Architecture Page

### Pattern: Composants Imbriqués

```
Page
├─ Header
├─ Layout
│  ├─ Sidebar (optional)
│  └─ Main Content
│     ├─ Filters/Controls
│     └─ Content Area
└─ Footer (optional)
```

### Providers (Context)

- `UserProvider` - User data
- `PostProvider` - Posts data
- `ReactionProvider` - Reactions
- `ThemeProvider` - Theme toggle
- `UserFormProvider` - Registration form

---

## 🔄 Data Flow

```
User Action
  ↓
Component State Update
  ↓
API Call (apiFetch)
  ↓
Server Response
  ↓
Update Provider/Context
  ↓
Re-render Component
```

---

## ✅ Checklist Conception

- [x] Pages principales identifiées
- [x] Wireframes analysés
- [x] Layouts définis
- [x] Composants mappés
- [x] Data flow compris
- [x] Design system documenté
- [ ] Designs Figma (à compléter depuis Notion)
- [ ] User stories détaillées
