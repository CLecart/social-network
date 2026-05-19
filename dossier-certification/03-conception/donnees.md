# 🗄️ Modélisation de Données

## 📊 Dictionnaire de Données

Analysé depuis `prisma/schema.prisma`

---

## 👤 Model: User

**Description:** Entité centrale représentant un utilisateur du réseau social

### Attributs:

| Attribut   | Type              | Constraints      | Description            |
| ---------- | ----------------- | ---------------- | ---------------------- |
| id         | CUID              | PRIMARY KEY      | Identifiant unique     |
| firstName  | String            | NULLABLE         | Prénom                 |
| lastName   | String            | NULLABLE         | Nom de famille         |
| password   | String            | NULLABLE         | Hash du mot de passe   |
| email      | String            | UNIQUE           | Email utilisateur      |
| birthDate  | DateTime          | NULLABLE         | Date de naissance      |
| username   | String            | UNIQUE, NULLABLE | Pseudo unique          |
| biography  | String            | NULLABLE         | Bio utilisateur        |
| avatar     | String            | NULLABLE         | URL avatar             |
| avatarId   | String            | NULLABLE         | ID Cloudinary          |
| banner     | String            | NULLABLE         | URL bannière           |
| bannerId   | String            | NULLABLE         | ID Cloudinary bannière |
| visibility | ProfileVisibility | DEFAULT PUBLIC   | PUBLIC / PRIVATE       |

### Relations:

- `posts`: Post[] - Posts créés
- `comments`: Comment[] - Commentaires
- `friendships`: Friendship[] - Amitiés créées
- `friendsWithMe`: Friendship[] - Amitiés reçues
- `conversations`: Conversation[] - Conversations
- `messages`: Message[] (SentMessages) - Messages envoyés
- `receivedMessages`: Message[] - Messages reçus
- `notifications`: Notification[] - Notifications
- `reactions`: Reaction[] - Reactions (likes)
- `stories`: Story[] - Stories publiées
- `rsvps`: Rsvp[] - RSVPs événements
- `groupInvitations`: GroupInvitation[] (2 relations)
- `groupMembers`: GroupMember[] - Adhésion groupes
- `groupMessages`: GroupMessage[] - Messages groupe
- `eventsCreated`: Event[] - Événements créés
- `userSettings`: UserSettings - Préférences

---

## 📝 Model: Post

**Description:** Contenu publié sur le feed (texte, images, vidéos)

### Attributs:

| Attribut   | Type       | Constraints    | Description                |
| ---------- | ---------- | -------------- | -------------------------- |
| id         | CUID       | PRIMARY KEY    | Identifiant unique         |
| userId     | String     | FOREIGN KEY    | Propriétaire du post       |
| message    | String     | NOT NULL       | Contenu texte              |
| datetime   | DateTime   | DEFAULT now()  | Date de création           |
| image      | String     | NULLABLE       | URL image                  |
| mediaId    | String     | NULLABLE       | ID Cloudinary              |
| visibility | Visibility | DEFAULT PUBLIC | PUBLIC / PRIVATE / FRIENDS |

### Enums:

- `Visibility`: PUBLIC, PRIVATE, FRIENDS

### Relations:

- `user`: User - Auteur
- `comments`: Comment[] - Commentaires
- `reactions`: Reaction[] - Likes/Reactions

---

## 💬 Model: Comment

**Description:** Commentaire sur un post

### Attributs:

| Attribut | Type     | Constraints   | Description        |
| -------- | -------- | ------------- | ------------------ |
| id       | CUID     | PRIMARY KEY   | Identifiant unique |
| postId   | String   | FOREIGN KEY   | Post parent        |
| userId   | String   | FOREIGN KEY   | Auteur             |
| message  | String   | NOT NULL      | Texte commentaire  |
| datetime | DateTime | DEFAULT now() | Date création      |

### Relations:

- `post`: Post - Post parent
- `user`: User - Auteur
- `reactions`: Reaction[] - Reactions sur le commentaire

---

## ❤️ Model: Reaction

**Description:** Réactions sur posts, stories, ou commentaires (Like, Love, Wow, etc.)

### Attributs:

| Attribut  | Type         | Constraints   | Description        |
| --------- | ------------ | ------------- | ------------------ |
| id        | CUID         | PRIMARY KEY   | Identifiant unique |
| type      | ReactionType | NOT NULL      | Type de réaction   |
| userId    | String       | FOREIGN KEY   | Auteur reaction    |
| postId    | String       | NULLABLE      | Post réactionné    |
| storyId   | String       | NULLABLE      | Story réactionnée  |
| commentId | String       | NULLABLE      | Comment réactionné |
| datetime  | DateTime     | DEFAULT now() | Date création      |

### Enums:

- `ReactionType`: LIKE, DISLIKE, LOVE, LAUGH, SAD, ANGRY, WOW

### Unique Constraints:

- `userId + postId` - Un like par post/user
- `userId + storyId` - Un like par story/user
- `userId + commentId` - Un like par comment/user

### Relations:

- `user`: User - Auteur
- `post`: Post - Post réactionné
- `story`: Story - Story réactionnée
- `comment`: Comment - Commentaire réactionné

---

## 💬 Model: Message

**Description:** Messages directs 1-to-1 entre utilisateurs

### Attributs:

| Attribut    | Type          | Constraints   | Description             |
| ----------- | ------------- | ------------- | ----------------------- |
| id          | CUID          | PRIMARY KEY   | Identifiant unique      |
| senderId    | String        | FOREIGN KEY   | Expéditeur              |
| receiverId  | String        | FOREIGN KEY   | Destinataire            |
| message     | String        | NOT NULL      | Contenu message         |
| image       | String        | NULLABLE      | URL image attachée      |
| datetime    | DateTime      | DEFAULT now() | Date envoi              |
| deliveredAt | DateTime      | NULLABLE      | Date livraison          |
| readAt      | DateTime      | NULLABLE      | Date lecture            |
| status      | MessageStatus | DEFAULT SENT  | SENT / DELIVERED / READ |

### Enums:

- `MessageStatus`: SENT, DELIVERED, READ

### Relations:

- `sender`: User - Expéditeur
- `receiver`: User - Destinataire

---

## 👥 Model: Friendship

**Description:** Relations d'amitié entre utilisateurs

### Attributs:

| Attribut  | Type             | Constraints   | Description           |
| --------- | ---------------- | ------------- | --------------------- |
| id        | CUID             | PRIMARY KEY   | Identifiant unique    |
| userId    | String           | FOREIGN KEY   | Utilisateur demandeur |
| friendId  | String           | FOREIGN KEY   | Ami destinataire      |
| status    | InvitationStatus | NOT NULL      | PENDING / ACCEPTED    |
| createdAt | DateTime         | DEFAULT now() | Date création         |

### Enums:

- `InvitationStatus`: PENDING, ACCEPTED

### Unique Constraint:

- `userId + friendId` - Pas de doublons

### Relations:

- `user`: User - Demandeur
- `friend`: User - Ami

---

## 🎬 Model: Story

**Description:** Stories temporaires (24h généralement)

### Attributs:

| Attribut   | Type       | Constraints    | Description                |
| ---------- | ---------- | -------------- | -------------------------- |
| id         | CUID       | PRIMARY KEY    | Identifiant unique         |
| userId     | String     | FOREIGN KEY    | Créateur                   |
| datetime   | DateTime   | DEFAULT now()  | Date création              |
| media      | String     | NULLABLE       | URL média                  |
| mediaId    | String     | NULLABLE       | ID Cloudinary              |
| visibility | Visibility | DEFAULT PUBLIC | PUBLIC / PRIVATE / FRIENDS |

### Relations:

- `user`: User - Créateur
- `reactions`: Reaction[] - Reactions

---

## 💬 Model: Conversation

**Description:** Conversation (groupe ou DM wrapper)

### Attributs:

| Attribut  | Type     | Constraints   | Description             |
| --------- | -------- | ------------- | ----------------------- |
| id        | CUID     | PRIMARY KEY   | Identifiant unique      |
| title     | String   | NULLABLE      | Nom conversation/groupe |
| isGroup   | Boolean  | DEFAULT false | Est un groupe?          |
| createdAt | DateTime | DEFAULT now() | Date création           |
| ownerId   | String   | NULLABLE      | Propriétaire groupe     |

### Relations:

- `owner`: User - Propriétaire
- `members`: ConversationMember[] - Participants
- `messages`: GroupMessage[] - Messages
- `events`: Event[] - Événements
- `groupInvitations`: GroupInvitation[] - Invitations
- `groupMembers`: GroupMember[] - Membres
- `groupJoinRequests`: GroupJoinRequest[] - Demandes

---

## 📧 Model: ConversationMember

**Description:** Membre d'une conversation

### Attributs:

| Attribut          | Type     | Constraints   | Description        |
| ----------------- | -------- | ------------- | ------------------ |
| id                | CUID     | PRIMARY KEY   | Identifiant unique |
| userId            | String   | FOREIGN KEY   | Utilisateur        |
| conversationId    | String   | FOREIGN KEY   | Conversation       |
| joinedAt          | DateTime | DEFAULT now() | Date adhésion      |
| lastSeenAt        | DateTime | NULLABLE      | Dernier accès      |
| lastSeenMessageId | String   | NULLABLE      | Dernier message vu |

### Unique Constraint:

- `userId + conversationId` - Pas de doublons

### Relations:

- `conversation`: Conversation
- `user`: User

---

## 💬 Model: GroupMessage

**Description:** Message de groupe

### Attributs:

| Attribut       | Type          | Constraints   | Description             |
| -------------- | ------------- | ------------- | ----------------------- |
| id             | CUID          | PRIMARY KEY   | Identifiant unique      |
| conversationId | String        | FOREIGN KEY   | Groupe/Conversation     |
| senderId       | String        | FOREIGN KEY   | Expéditeur              |
| message        | String        | NOT NULL      | Contenu                 |
| image          | String        | NULLABLE      | URL image               |
| sentAt         | DateTime      | DEFAULT now() | Date envoi              |
| eventId        | String        | NULLABLE      | Événement associé       |
| deliveredAt    | DateTime      | NULLABLE      | Date livraison          |
| readAt         | DateTime      | NULLABLE      | Date lecture            |
| status         | MessageStatus | DEFAULT SENT  | SENT / DELIVERED / READ |

### Relations:

- `conversation`: Conversation
- `sender`: User
- `event`: Event

---

## 📬 Model: GroupInvitation

**Description:** Invitation à un groupe

### Attributs:

| Attribut  | Type             | Constraints     | Description         |
| --------- | ---------------- | --------------- | ------------------- |
| id        | CUID             | PRIMARY KEY     | Identifiant unique  |
| groupId   | String           | FOREIGN KEY     | Conversation/groupe |
| inviterId | String           | FOREIGN KEY     | Invitant            |
| invitedId | String           | FOREIGN KEY     | Invité              |
| status    | InvitationStatus | DEFAULT PENDING | PENDING / ACCEPTED  |
| createdAt | DateTime         | DEFAULT now()   | Date création       |

### Unique Constraint:

- `groupId + invitedId` - Pas de doublons

### Relations:

- `group`: Conversation
- `inviter`: User
- `invited`: User

---

## 🚪 Model: GroupJoinRequest

**Description:** Demande d'adhésion à un groupe

### Attributs:

| Attribut  | Type             | Constraints     | Description         |
| --------- | ---------------- | --------------- | ------------------- |
| id        | CUID             | PRIMARY KEY     | Identifiant unique  |
| groupId   | String           | FOREIGN KEY     | Groupe/Conversation |
| seeker    | String           | FOREIGN KEY     | Demandeur           |
| status    | InvitationStatus | DEFAULT PENDING | PENDING / ACCEPTED  |
| createdAt | DateTime         | DEFAULT now()   | Date création       |

### Unique Constraint:

- `groupId + seeker` - Pas de doublons

### Relations:

- `group`: Conversation
- `user`: User (seeker)

---

## 👫 Model: GroupMember

**Description:** Membre d'un groupe (adhésion confirmée)

### Attributs:

| Attribut | Type     | Constraints   | Description         |
| -------- | -------- | ------------- | ------------------- |
| id       | CUID     | PRIMARY KEY   | Identifiant unique  |
| groupId  | String   | FOREIGN KEY   | Groupe/Conversation |
| userId   | String   | FOREIGN KEY   | Membre              |
| joinedAt | DateTime | DEFAULT now() | Date adhésion       |

### Unique Constraint:

- `groupId + userId` - Pas de doublons

### Relations:

- `group`: Conversation
- `user`: User

---

## 📅 Model: Event

**Description:** Événement créé dans un groupe

### Attributs:

| Attribut    | Type     | Constraints   | Description         |
| ----------- | -------- | ------------- | ------------------- |
| id          | CUID     | PRIMARY KEY   | Identifiant unique  |
| title       | String   | NOT NULL      | Titre événement     |
| description | String   | NOT NULL      | Description         |
| datetime    | DateTime | NOT NULL      | Date/heure          |
| groupId     | String   | FOREIGN KEY   | Groupe/Conversation |
| ownerId     | String   | FOREIGN KEY   | Créateur            |
| createdAt   | DateTime | DEFAULT now() | Date création       |

### Relations:

- `group`: Conversation
- `owner`: User
- `messages`: GroupMessage[] - Messages liés
- `rsvps`: Rsvp[] - RSVPs

---

## 📋 Model: Rsvp

**Description:** Réponse à un événement

### Attributs:

| Attribut  | Type       | Constraints   | Description        |
| --------- | ---------- | ------------- | ------------------ |
| id        | CUID       | PRIMARY KEY   | Identifiant unique |
| userId    | String     | FOREIGN KEY   | Utilisateur        |
| eventId   | String     | FOREIGN KEY   | Événement          |
| status    | RsvpStatus | NOT NULL      | YES / NO / MAYBE   |
| createdAt | DateTime   | DEFAULT now() | Date réponse       |

### Enums:

- `RsvpStatus`: YES, NO, MAYBE

### Unique Constraint:

- `userId + eventId` - Un RSVP par user/event

### Relations:

- `event`: Event
- `user`: User

---

## ⚙️ Model: UserSettings

**Description:** Préférences utilisateur

### Attributs:

| Attribut             | Type     | Constraints   | Description            |
| -------------------- | -------- | ------------- | ---------------------- |
| id                   | CUID     | PRIMARY KEY   | Identifiant unique     |
| userId               | String   | UNIQUE FK     | Utilisateur            |
| theme                | String   | DEFAULT light | light / dark           |
| language             | String   | DEFAULT en    | Code langue (en, fr)   |
| notificationsEnabled | Boolean  | DEFAULT true  | Notifications activées |
| createdAt            | DateTime | DEFAULT now() | Date création          |

### Relations:

- `user`: User

---

## 🔔 Model: Notification

**Description:** Notification utilisateur

### Attributs:

| Attribut  | Type     | Constraints   | Description        |
| --------- | -------- | ------------- | ------------------ |
| id        | CUID     | PRIMARY KEY   | Identifiant unique |
| userId    | String   | FOREIGN KEY   | Destinataire       |
| type      | String   | NOT NULL      | Type notification  |
| message   | String   | NOT NULL      | Contenu            |
| isRead    | Boolean  | DEFAULT false | Lue?               |
| createdAt | DateTime | DEFAULT now() | Date création      |

### Index:

- `userId` - Pour requêtes rapides par user

### Relations:

- `user`: User

---

## 🔗 Model: Account

**Description:** Comptes OAuth

### Attributs:

| Attribut          | Type   | Constraints | Description         |
| ----------------- | ------ | ----------- | ------------------- |
| id                | CUID   | PRIMARY KEY | Identifiant unique  |
| userId            | String | FOREIGN KEY | Utilisateur         |
| provider          | String | NOT NULL    | google, github, etc |
| providerAccountId | String | NOT NULL    | ID chez provider    |
| refresh_token     | String | NULLABLE    | Refresh token       |
| access_token      | String | NULLABLE    | Access token        |
| expires_at        | BigInt | NULLABLE    | Expiration          |
| token_type        | String | NULLABLE    | Type de token       |
| scope             | String | NULLABLE    | Permissions         |
| id_token          | String | NULLABLE    | ID token            |
| session_state     | String | NULLABLE    | État session        |

### Unique Constraint:

- `provider + providerAccountId` - Par fournisseur

### Relations:

- `user`: User (CASCADE delete)

---

## 📊 MCD - Modèle Conceptuel de Données

```
┌─────────────────┐
│     USER        │
├─────────────────┤
│ id (PK)         │
│ email           │
│ username        │
│ password        │
│ avatar          │
│ banner          │
│ bio             │
│ visibility      │
└─────────────────┘
    │       │       │
    │       │       └─────────────────────────────────────┐
    │       │                                             │
    ├──────────────────────────────────────────────────────┤
    │                                                      │
    ▼                                                      ▼
┌─────────────────┐  ┌─────────────────┐   ┌──────────────────────┐
│     POST        │  │   FRIENDSHIP    │   │  CONVERSATION        │
├─────────────────┤  ├─────────────────┤   ├──────────────────────┤
│ id (PK)         │  │ id (PK)         │   │ id (PK)              │
│ userId (FK)     │  │ userId (FK)     │   │ ownerId (FK)         │
│ message         │  │ friendId (FK)   │   │ title                │
│ datetime        │  │ status          │   │ isGroup              │
│ visibility      │  └─────────────────┘   │ createdAt            │
└─────────────────┘                        └──────────────────────┘
    │                                           │
    │                                    ┌──────┴─────────┬────────────┐
    ▼                                    │                │            │
┌─────────────────┐                     ▼                ▼            ▼
│   COMMENT       │        ┌──────────────────────┐   ┌─────────────────────┐   ┌──────────────────┐
├─────────────────┤        │ CONVERSATION_MEMBER  │   │  GROUP_MESSAGE      │   │   GROUP_MEMBER   │
│ id (PK)         │        ├──────────────────────┤   ├─────────────────────┤   ├──────────────────┤
│ postId (FK)     │        │ id (PK)              │   │ id (PK)             │   │ id (PK)          │
│ userId (FK)     │        │ userId (FK)          │   │ conversationId (FK) │   │ groupId (FK)     │
│ message         │        │ conversationId (FK)  │   │ senderId (FK)       │   │ userId (FK)      │
│ datetime        │        │ joinedAt             │   │ message             │   │ joinedAt         │
└─────────────────┘        └──────────────────────┘   │ eventId (FK)        │   └──────────────────┘
    │                                                  └─────────────────────┘
    │
    └────────────┬──────────────────────────────────────────────────────────┐
                 ▼                                                          ▼
        ┌──────────────────┐                                      ┌──────────────────┐
        │   REACTION       │                                      │   STORY          │
        ├──────────────────┤                                      ├──────────────────┤
        │ id (PK)          │                                      │ id (PK)          │
        │ type             │                                      │ userId (FK)      │
        │ userId (FK)      │                                      │ media            │
        │ postId (FK)      │                                      │ visibility       │
        │ storyId (FK)     │                                      │ datetime         │
        │ commentId (FK)   │                                      └──────────────────┘
        │ datetime         │
        └──────────────────┘

┌───────────────────┐  ┌──────────────────────────┐  ┌──────────────┐
│   MESSAGE         │  │  GROUP_INVITATION        │  │   EVENT      │
├───────────────────┤  ├──────────────────────────┤  ├──────────────┤
│ id (PK)           │  │ id (PK)                  │  │ id (PK)      │
│ senderId (FK)     │  │ groupId (FK)             │  │ groupId (FK) │
│ receiverId (FK)   │  │ inviterId (FK)           │  │ ownerId (FK) │
│ message           │  │ invitedId (FK)           │  │ title        │
│ status            │  │ status                   │  │ datetime     │
│ datetime          │  │ createdAt                │  └──────────────┘
└───────────────────┘  └──────────────────────────┘      │
                                                         ▼
                                            ┌──────────────────────┐
                                            │    RSVP              │
                                            ├──────────────────────┤
                                            │ id (PK)              │
                                            │ userId (FK)          │
                                            │ eventId (FK)         │
                                            │ status (YES/NO/MAYBE)│
                                            └──────────────────────┘

┌──────────────────────┐  ┌────────────────────┐
│  USER_SETTINGS       │  │   NOTIFICATION     │
├──────────────────────┤  ├────────────────────┤
│ id (PK)              │  │ id (PK)            │
│ userId (FK)          │  │ userId (FK)        │
│ theme                │  │ type               │
│ language             │  │ message            │
│ notificationsEnabled │  │ isRead             │
└──────────────────────┘  └────────────────────┘
```

---

## 🔗 MLD - Modèle Logique de Données

```sql
User (id, firstName, lastName, password, email, birthDate, username, biography, avatar, bannerId, avatarId, visibility)
Post (id, userId-FK, message, datetime, image, mediaId, visibility)
Comment (id, postId-FK, userId-FK, message, datetime)
Reaction (id, type, userId-FK, postId-FK, storyId-FK, commentId-FK, datetime)
Story (id, userId-FK, datetime, media, mediaId, visibility)
Message (id, senderId-FK, receiverId-FK, message, image, datetime, deliveredAt, readAt, status)
Friendship (id, userId-FK, friendId-FK, status, createdAt)
Conversation (id, title, isGroup, createdAt, ownerId-FK)
ConversationMember (id, userId-FK, conversationId-FK, joinedAt, lastSeenAt, lastSeenMessageId)
GroupMessage (id, conversationId-FK, senderId-FK, message, image, sentAt, eventId-FK, deliveredAt, readAt, status)
GroupInvitation (id, groupId-FK, inviterId-FK, invitedId-FK, status, createdAt)
GroupJoinRequest (id, groupId-FK, seeker-FK, status, createdAt)
GroupMember (id, groupId-FK, userId-FK, joinedAt)
Event (id, title, description, datetime, groupId-FK, ownerId-FK, createdAt)
Rsvp (id, userId-FK, eventId-FK, status, createdAt)
UserSettings (id, userId-FK, theme, language, notificationsEnabled, createdAt)
Account (id, userId-FK, provider, providerAccountId, refresh_token, access_token, expires_at, token_type, scope, id_token, session_state)
Notification (id, userId-FK, type, message, isRead, createdAt)
```

---

## 💾 Cardinalités Principales

| Relation                    | Type | Description                           |
| --------------------------- | ---- | ------------------------------------- |
| User → Post                 | 1:N  | Un user crée plusieurs posts          |
| User → Comment              | 1:N  | Un user crée plusieurs commentaires   |
| User → Reaction             | 1:N  | Un user crée plusieurs réactions      |
| Post → Comment              | 1:N  | Un post a plusieurs commentaires      |
| Post → Reaction             | 1:N  | Un post a plusieurs réactions         |
| User → Friendship           | 1:N  | Un user a plusieurs amitiés           |
| User → Conversation         | 1:N  | Un user crée plusieurs conversations  |
| Conversation → GroupMessage | 1:N  | Une conversation a plusieurs messages |
| User → Event                | 1:N  | Un user crée plusieurs événements     |
| Event → Rsvp                | 1:N  | Un événement a plusieurs RSVPs        |
| Event → GroupMessage        | 1:N  | Un événement a plusieurs messages     |

---

## ✅ Checklist Modélisation

- [x] Dictionnaire de données complet
- [x] Relations documentées
- [x] Enums identifiés
- [x] Unique constraints listés
- [x] MCD diagramme
- [x] MLD relations
- [x] Cardinalités définies
- [ ] Tests de cohérence

---

## 📎 Code Complet des Diagrammes (MCD / MLD / MPD)

Pour la soutenance, les versions détaillées et directement réutilisables des diagrammes sont disponibles ici:

- [diagrammes-uml.md](./diagrammes-uml.md)

Ce fichier contient:

- le **MCD** en format DBML (import direct dans dbdiagram.io),
- le **MLD** en format DBML détaillé,
- le **MPD** en SQL PostgreSQL (tables, index, contraintes, triggers).

Utilisation recommandée:

1. Copier le bloc **MCD** ou **MLD** dans dbdiagram.io pour générer le diagramme visuel.
2. Utiliser le bloc **MPD** pour illustrer la traduction physique du modèle dans PostgreSQL.
3. Conserver ce fichier en annexe technique comme preuve de modélisation complète pour le jury.
