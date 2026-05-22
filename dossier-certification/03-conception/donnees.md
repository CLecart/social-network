# Modélisation de Données

## Dictionnaire de Données

Source : `prisma/schema.prisma` — traduit en types SQL PostgreSQL.

**Conventions de types :**

| Type SQL | Description |
|---|---|
| `CHAR(25)` | Identifiant CUID (chaîne fixe 25 caractères) |
| `VARCHAR(255)` | Chaîne courte (nom, URL, token) |
| `TEXT` | Chaîne longue (message, biographie) |
| `TIMESTAMP` | Date et heure |
| `BOOLEAN` | Vrai / Faux |
| `BIGINT` | Entier 64 bits (timestamp OAuth) |
| `ENUM(...)` | Valeur parmi un ensemble fini |

---

## Model: User

**Description :** Entité centrale représentant un utilisateur du réseau social.

### Attributs

| Attribut   | Type SQL           | Contraintes                    | Description              |
|------------|--------------------|-------------------------------|--------------------------|
| id         | CHAR(25)           | PRIMARY KEY, NOT NULL          | Identifiant CUID         |
| firstName  | VARCHAR(255)       | NULL                           | Prénom                   |
| lastName   | VARCHAR(255)       | NULL                           | Nom de famille           |
| password   | VARCHAR(255)       | NULL                           | Hash bcrypt du mot de passe |
| email      | VARCHAR(255)       | UNIQUE, NOT NULL               | Adresse email            |
| birthDate  | TIMESTAMP          | NULL                           | Date de naissance        |
| username   | VARCHAR(50)        | UNIQUE, NULL                   | Pseudonyme               |
| biography  | TEXT               | NULL                           | Biographie               |
| avatar     | TEXT               | NULL                           | URL avatar (Cloudinary)  |
| avatarId   | VARCHAR(255)       | NULL                           | ID asset Cloudinary      |
| banner     | TEXT               | NULL                           | URL bannière (Cloudinary)|
| bannerId   | VARCHAR(255)       | NULL                           | ID asset Cloudinary      |
| visibility | ENUM('PUBLIC','PRIVATE') | DEFAULT 'PUBLIC', NOT NULL | Visibilité du profil |

### Relations

- `posts` : Post[] — Posts créés
- `comments` : Comment[] — Commentaires
- `friendships` : Friendship[] — Amitiés initiées
- `friendsWithMe` : Friendship[] — Amitiés reçues
- `conversations` : Conversation[] — Conversations créées
- `conversationMembers` : ConversationMember[] — Participations aux conversations
- `messages` : Message[] (SentMessages) — Messages envoyés
- `receivedMessages` : Message[] — Messages reçus
- `notifications` : Notification[] — Notifications reçues
- `reactions` : Reaction[] — Réactions publiées
- `stories` : Story[] — Stories publiées
- `rsvps` : Rsvp[] — Réponses aux événements
- `groupInvitations` : GroupInvitation[] (invitant + invité)
- `groupMembers` : GroupMember[] — Adhésions aux groupes
- `groupMessages` : GroupMessage[] — Messages de groupe
- `eventsCreated` : Event[] — Événements créés
- `userSettings` : UserSettings — Préférences
- `accounts` : Account[] — Comptes OAuth (Google)

---

## Model: Post

**Description :** Publication sur le fil d'actualité (texte, image, vidéo).

### Attributs

| Attribut   | Type SQL                           | Contraintes                    | Description                 |
|------------|------------------------------------|-------------------------------|-----------------------------|
| id         | CHAR(25)                           | PRIMARY KEY, NOT NULL          | Identifiant CUID            |
| userId     | CHAR(25)                           | FOREIGN KEY (User), NOT NULL   | Auteur du post              |
| message    | TEXT                               | NOT NULL                       | Contenu textuel             |
| datetime   | TIMESTAMP                          | DEFAULT NOW(), NOT NULL        | Date de publication         |
| image      | TEXT                               | NULL                           | URL image (Cloudinary)      |
| mediaId    | VARCHAR(255)                       | NULL                           | ID asset Cloudinary         |
| visibility | ENUM('PUBLIC','PRIVATE','FRIENDS') | DEFAULT 'PUBLIC', NOT NULL     | Visibilité du post          |

### Enum

- `Visibility` : PUBLIC, PRIVATE, FRIENDS

### Relations

- `user` : User — Auteur
- `comments` : Comment[] — Commentaires
- `reactions` : Reaction[] — Réactions

---

## Model: Comment

**Description :** Commentaire posté sur un Post.

### Attributs

| Attribut | Type SQL     | Contraintes                    | Description        |
|----------|--------------|-------------------------------|--------------------|
| id       | CHAR(25)     | PRIMARY KEY, NOT NULL          | Identifiant CUID   |
| postId   | CHAR(25)     | FOREIGN KEY (Post), NOT NULL   | Post parent        |
| userId   | CHAR(25)     | FOREIGN KEY (User), NOT NULL   | Auteur             |
| message  | TEXT         | NOT NULL                       | Contenu            |
| datetime | TIMESTAMP    | DEFAULT NOW(), NOT NULL        | Date de création   |

### Relations

- `post` : Post
- `user` : User
- `reactions` : Reaction[]

---

## Model: Reaction

**Description :** Réaction d'un utilisateur sur un Post, une Story ou un Comment.

### Attributs

| Attribut  | Type SQL                                          | Contraintes                    | Description          |
|-----------|---------------------------------------------------|-------------------------------|----------------------|
| id        | CHAR(25)                                          | PRIMARY KEY, NOT NULL          | Identifiant CUID     |
| type      | ENUM('LIKE','DISLIKE','LOVE','LAUGH','SAD','ANGRY','WOW') | NOT NULL              | Type de réaction     |
| userId    | CHAR(25)                                          | FOREIGN KEY (User), NOT NULL   | Auteur               |
| postId    | CHAR(25)                                          | FOREIGN KEY (Post), NULL       | Post ciblé           |
| storyId   | CHAR(25)                                          | FOREIGN KEY (Story), NULL      | Story ciblée         |
| commentId | CHAR(25)                                          | FOREIGN KEY (Comment), NULL    | Commentaire ciblé    |
| datetime  | TIMESTAMP                                         | DEFAULT NOW(), NOT NULL        | Date                 |

### Contraintes d'unicité

- `(userId, postId)` — une réaction par utilisateur par post
- `(userId, storyId)` — une réaction par utilisateur par story
- `(userId, commentId)` — une réaction par utilisateur par commentaire

### Relations

- `user` : User
- `post` : Post (nullable)
- `story` : Story (nullable)
- `comment` : Comment (nullable)

---

## Model: Message

**Description :** Message privé direct entre deux utilisateurs (1-to-1).

### Attributs

| Attribut    | Type SQL                            | Contraintes                       | Description              |
|-------------|-------------------------------------|----------------------------------|--------------------------|
| id          | CHAR(25)                            | PRIMARY KEY, NOT NULL             | Identifiant CUID         |
| senderId    | CHAR(25)                            | FOREIGN KEY (User), NOT NULL      | Expéditeur               |
| receiverId  | CHAR(25)                            | FOREIGN KEY (User), NOT NULL      | Destinataire             |
| message     | TEXT                                | NOT NULL                          | Contenu                  |
| image       | TEXT                                | NULL                              | URL image attachée       |
| datetime    | TIMESTAMP                           | DEFAULT NOW(), NOT NULL           | Date d'envoi             |
| deliveredAt | TIMESTAMP                           | NULL                              | Date de livraison        |
| readAt      | TIMESTAMP                           | NULL                              | Date de lecture          |
| status      | ENUM('SENT','DELIVERED','READ')     | DEFAULT 'SENT', NOT NULL          | Statut du message        |

### Relations

- `sender` : User
- `receiver` : User

---

## Model: Friendship

**Description :** Relation d'amitié entre deux utilisateurs.

### Attributs

| Attribut  | Type SQL                      | Contraintes                    | Description             |
|-----------|-------------------------------|-------------------------------|-------------------------|
| id        | CHAR(25)                      | PRIMARY KEY, NOT NULL          | Identifiant CUID        |
| userId    | CHAR(25)                      | FOREIGN KEY (User), NOT NULL   | Demandeur               |
| friendId  | CHAR(25)                      | FOREIGN KEY (User), NOT NULL   | Destinataire            |
| status    | ENUM('PENDING','ACCEPTED')    | NOT NULL                       | Statut de la demande    |
| createdAt | TIMESTAMP                     | DEFAULT NOW(), NOT NULL        | Date de création        |

### Contrainte d'unicité

- `(userId, friendId)` — pas de doublon de relation

### Relations

- `user` : User (demandeur)
- `friend` : User (ami)

---

## Model: Story

**Description :** Contenu éphémère publié par un utilisateur.

### Attributs

| Attribut   | Type SQL                           | Contraintes                    | Description                  |
|------------|------------------------------------|-------------------------------|------------------------------|
| id         | CHAR(25)                           | PRIMARY KEY, NOT NULL          | Identifiant CUID             |
| userId     | CHAR(25)                           | FOREIGN KEY (User), NOT NULL   | Créateur                     |
| datetime   | TIMESTAMP                          | DEFAULT NOW(), NOT NULL        | Date de publication          |
| media      | TEXT                               | NULL                           | URL média (Cloudinary)       |
| mediaId    | VARCHAR(255)                       | NULL                           | ID asset Cloudinary          |
| visibility | ENUM('PUBLIC','PRIVATE','FRIENDS') | DEFAULT 'PUBLIC', NOT NULL     | Visibilité                   |

### Relations

- `user` : User
- `reactions` : Reaction[]

---

## Model: Conversation

**Description :** Conversation de groupe ou wrapper DM. Dans le MCD conceptuel (`mcd-social-network.drawio`), cette entité est représentée sous le nom **GROUPE** lorsque `isGroup = true` — c'est un choix de modélisation Prisma (une seule table, pas de modèle `Group` dédié). Le MCD draw.io matérialise la distinction conceptuelle avec une entité GROUPE reliée à EVENEMENT (APPARTIENT) et à UTILISATEUR (MEMBRE).

### Attributs

| Attribut  | Type SQL     | Contraintes                    | Description                |
|-----------|--------------|-------------------------------|----------------------------|
| id        | CHAR(25)     | PRIMARY KEY, NOT NULL          | Identifiant CUID           |
| title     | VARCHAR(255) | NULL                           | Nom du groupe              |
| isGroup   | BOOLEAN      | DEFAULT FALSE, NOT NULL        | Est un groupe              |
| createdAt | TIMESTAMP    | DEFAULT NOW(), NOT NULL        | Date de création           |
| ownerId   | CHAR(25)     | FOREIGN KEY (User), NULL       | Propriétaire du groupe     |

### Relations

- `owner` : User (nullable)
- `members` : ConversationMember[]
- `messages` : GroupMessage[]
- `events` : Event[]
- `groupInvitations` : GroupInvitation[]
- `groupMembers` : GroupMember[]
- `groupJoinRequests` : GroupJoinRequest[]

---

## Model: ConversationMember

**Description :** Participant à une conversation.

### Attributs

| Attribut          | Type SQL  | Contraintes                             | Description              |
|-------------------|-----------|----------------------------------------|--------------------------|
| id                | CHAR(25)  | PRIMARY KEY, NOT NULL                   | Identifiant CUID         |
| userId            | CHAR(25)  | FOREIGN KEY (User), NOT NULL            | Utilisateur              |
| conversationId    | CHAR(25)  | FOREIGN KEY (Conversation), NOT NULL    | Conversation             |
| joinedAt          | TIMESTAMP | DEFAULT NOW(), NOT NULL                 | Date d'adhésion          |
| lastSeenAt        | TIMESTAMP | NULL                                    | Dernier accès            |
| lastSeenMessageId | CHAR(25)  | NULL                                    | Dernier message vu       |

### Contrainte d'unicité

- `(userId, conversationId)` — pas de doublon

---

## Model: GroupMessage

**Description :** Message dans une conversation de groupe.

### Attributs

| Attribut       | Type SQL                        | Contraintes                             | Description              |
|----------------|---------------------------------|----------------------------------------|--------------------------|
| id             | CHAR(25)                        | PRIMARY KEY, NOT NULL                   | Identifiant CUID         |
| conversationId | CHAR(25)                        | FOREIGN KEY (Conversation), NOT NULL    | Conversation parente     |
| senderId       | CHAR(25)                        | FOREIGN KEY (User), NOT NULL            | Expéditeur               |
| message        | TEXT                            | NOT NULL                                | Contenu                  |
| image          | TEXT                            | NULL                                    | URL image                |
| sentAt         | TIMESTAMP                       | DEFAULT NOW(), NOT NULL                 | Date d'envoi             |
| eventId        | CHAR(25)                        | FOREIGN KEY (Event), NULL               | Événement associé        |
| deliveredAt    | TIMESTAMP                       | NULL                                    | Date de livraison        |
| readAt         | TIMESTAMP                       | NULL                                    | Date de lecture          |
| status         | ENUM('SENT','DELIVERED','READ') | DEFAULT 'SENT', NOT NULL                | Statut                   |

---

## Model: GroupInvitation

**Description :** Invitation d'un utilisateur à rejoindre un groupe.

### Attributs

| Attribut  | Type SQL                   | Contraintes                             | Description         |
|-----------|----------------------------|-----------------------------------------|---------------------|
| id        | CHAR(25)                   | PRIMARY KEY, NOT NULL                   | Identifiant CUID    |
| groupId   | CHAR(25)                   | FOREIGN KEY (Conversation), NOT NULL    | Groupe cible        |
| inviterId | CHAR(25)                   | FOREIGN KEY (User), NOT NULL            | Invitant            |
| invitedId | CHAR(25)                   | FOREIGN KEY (User), NOT NULL            | Invité              |
| status    | ENUM('PENDING','ACCEPTED') | DEFAULT 'PENDING', NOT NULL             | Statut              |
| createdAt | TIMESTAMP                  | DEFAULT NOW(), NOT NULL                 | Date de création    |

### Contrainte d'unicité

- `(groupId, invitedId)` — pas de doublon

---

## Model: GroupJoinRequest

**Description :** Demande spontanée d'adhésion à un groupe.

### Attributs

| Attribut  | Type SQL                   | Contraintes                             | Description         |
|-----------|----------------------------|-----------------------------------------|---------------------|
| id        | CHAR(25)                   | PRIMARY KEY, NOT NULL                   | Identifiant CUID    |
| groupId   | CHAR(25)                   | FOREIGN KEY (Conversation), NOT NULL    | Groupe cible        |
| seeker    | CHAR(25)                   | FOREIGN KEY (User), NOT NULL            | Demandeur           |
| status    | ENUM('PENDING','ACCEPTED') | DEFAULT 'PENDING', NOT NULL             | Statut              |
| createdAt | TIMESTAMP                  | DEFAULT NOW(), NOT NULL                 | Date de création    |

### Contrainte d'unicité

- `(groupId, seeker)` — pas de doublon

---

## Model: GroupMember

**Description :** Adhésion confirmée d'un utilisateur à un groupe.

### Attributs

| Attribut | Type SQL  | Contraintes                             | Description         |
|----------|-----------|-----------------------------------------|---------------------|
| id       | CHAR(25)  | PRIMARY KEY, NOT NULL                   | Identifiant CUID    |
| groupId  | CHAR(25)  | FOREIGN KEY (Conversation), NOT NULL    | Groupe              |
| userId   | CHAR(25)  | FOREIGN KEY (User), NOT NULL            | Membre              |
| joinedAt | TIMESTAMP | DEFAULT NOW(), NOT NULL                 | Date d'adhésion     |

### Contrainte d'unicité

- `(groupId, userId)` — pas de doublon

---

## Model: Event

**Description :** Événement créé dans un groupe, avec RSVP.

### Attributs

| Attribut    | Type SQL  | Contraintes                             | Description         |
|-------------|-----------|-----------------------------------------|---------------------|
| id          | CHAR(25)  | PRIMARY KEY, NOT NULL                   | Identifiant CUID    |
| title       | VARCHAR(255) | NOT NULL                             | Titre               |
| description | TEXT      | NOT NULL                                | Description         |
| datetime    | TIMESTAMP | NOT NULL                                | Date/heure          |
| groupId     | CHAR(25)  | FOREIGN KEY (Conversation), NOT NULL    | Groupe hôte         |
| ownerId     | CHAR(25)  | FOREIGN KEY (User), NOT NULL            | Créateur            |
| createdAt   | TIMESTAMP | DEFAULT NOW(), NOT NULL                 | Date de création    |

### Relations

- `group` : Conversation
- `owner` : User
- `messages` : GroupMessage[]
- `rsvps` : Rsvp[]

---

## Model: Rsvp

**Description :** Réponse d'un utilisateur à un événement.

### Attributs

| Attribut  | Type SQL                  | Contraintes                    | Description        |
|-----------|---------------------------|-------------------------------|--------------------|
| id        | CHAR(25)                  | PRIMARY KEY, NOT NULL          | Identifiant CUID   |
| userId    | CHAR(25)                  | FOREIGN KEY (User), NOT NULL   | Utilisateur        |
| eventId   | CHAR(25)                  | FOREIGN KEY (Event), NOT NULL  | Événement          |
| status    | ENUM('YES','NO','MAYBE')  | NOT NULL                       | Réponse            |
| createdAt | TIMESTAMP                 | DEFAULT NOW(), NOT NULL        | Date de réponse    |

### Contrainte d'unicité

- `(userId, eventId)` — un RSVP par utilisateur par événement

---

## Model: UserSettings

**Description :** Préférences de l'utilisateur (thème, langue, notifications).

### Attributs

| Attribut             | Type SQL     | Contraintes                          | Description               |
|----------------------|--------------|--------------------------------------|---------------------------|
| id                   | CHAR(25)     | PRIMARY KEY, NOT NULL                 | Identifiant CUID          |
| userId               | CHAR(25)     | UNIQUE, FOREIGN KEY (User), NOT NULL  | Utilisateur (1-to-1)      |
| theme                | VARCHAR(10)  | DEFAULT 'light', NOT NULL             | Thème (light / dark)      |
| language             | VARCHAR(10)  | DEFAULT 'en', NOT NULL                | Code langue (en, fr)      |
| notificationsEnabled | BOOLEAN      | DEFAULT TRUE, NOT NULL                | Notifications actives     |
| createdAt            | TIMESTAMP    | DEFAULT NOW(), NOT NULL               | Date de création          |

---

## Model: Notification

**Description :** Notification système envoyée à un utilisateur.

### Attributs

| Attribut  | Type SQL     | Contraintes                    | Description           |
|-----------|--------------|-------------------------------|-----------------------|
| id        | CHAR(25)     | PRIMARY KEY, NOT NULL          | Identifiant CUID      |
| userId    | CHAR(25)     | FOREIGN KEY (User), NOT NULL   | Destinataire          |
| type      | VARCHAR(50)  | NOT NULL                       | Type d'événement      |
| message   | TEXT         | NOT NULL                       | Contenu               |
| isRead    | BOOLEAN      | DEFAULT FALSE, NOT NULL        | Lue ou non            |
| createdAt | TIMESTAMP    | DEFAULT NOW(), NOT NULL        | Date de création      |

### Index

- `userId` — accès rapide aux notifications par utilisateur

---

## Model: Account

**Description :** Compte OAuth Google lié à un utilisateur (modèle compatible NextAuth, mais l'implémentation utilise `googleapis` côté `/api/public/auth/callback` ; NextAuth n'est pas branché).

### Attributs

| Attribut          | Type SQL     | Contraintes                    | Description              |
|-------------------|--------------|-------------------------------|--------------------------|
| id                | CHAR(25)     | PRIMARY KEY, NOT NULL          | Identifiant CUID         |
| userId            | CHAR(25)     | FOREIGN KEY (User), NOT NULL   | Utilisateur propriétaire |
| provider          | VARCHAR(50)  | NOT NULL                       | Fournisseur (google…)    |
| providerAccountId | VARCHAR(255) | NOT NULL                       | ID chez le fournisseur   |
| refresh_token     | TEXT         | NULL                           | Token de rafraîchissement|
| access_token      | TEXT         | NULL                           | Token d'accès            |
| expires_at        | BIGINT       | NULL                           | Expiration (epoch ms)    |
| token_type        | VARCHAR(50)  | NULL                           | Type de token            |
| scope             | TEXT         | NULL                           | Permissions accordées    |
| id_token          | TEXT         | NULL                           | ID token JWT             |
| session_state     | VARCHAR(255) | NULL                           | État de session          |

### Contrainte d'unicité

- `(provider, providerAccountId)` — un compte par fournisseur

---

## MLD — Modèle Logique de Données

```
User          (id, firstName, lastName, password, email, birthDate, username, biography, avatar, avatarId, banner, bannerId, visibility)
Account       (id, userId#, provider, providerAccountId, refresh_token, access_token, expires_at, token_type, scope, id_token, session_state)
Post          (id, userId#, message, datetime, image, mediaId, visibility)
Comment       (id, postId#, userId#, message, datetime)
Reaction      (id, type, userId#, postId#, storyId#, commentId#, datetime)
Story         (id, userId#, datetime, media, mediaId, visibility)
Message       (id, senderId#, receiverId#, message, image, datetime, deliveredAt, readAt, status)
Friendship    (id, userId#, friendId#, status, createdAt)
Conversation  (id, title, isGroup, createdAt, ownerId#)
ConversationMember  (id, userId#, conversationId#, joinedAt, lastSeenAt, lastSeenMessageId)
GroupMessage  (id, conversationId#, senderId#, message, image, sentAt, eventId#, deliveredAt, readAt, status)
GroupInvitation     (id, groupId#, inviterId#, invitedId#, status, createdAt)
GroupJoinRequest    (id, groupId#, seeker#, status, createdAt)
GroupMember   (id, groupId#, userId#, joinedAt)
Event         (id, title, description, datetime, groupId#, ownerId#, createdAt)
Rsvp          (id, userId#, eventId#, status, createdAt)
UserSettings  (id, userId#, theme, language, notificationsEnabled, createdAt)
Notification  (id, userId#, type, message, isRead, createdAt)
```

> `#` désigne une clé étrangère (FOREIGN KEY).

---

## Cardinalités

| Relation                          | Type  | Description                                      |
|-----------------------------------|-------|--------------------------------------------------|
| User → Post                       | 1,N   | Un utilisateur publie plusieurs posts            |
| User → Comment                    | 1,N   | Un utilisateur écrit plusieurs commentaires      |
| User → Reaction                   | 1,N   | Un utilisateur crée plusieurs réactions          |
| Post → Comment                    | 1,N   | Un post reçoit plusieurs commentaires            |
| Post / Story / Comment → Reaction | 1,N   | Chaque entité reçoit plusieurs réactions         |
| User → Friendship                 | 1,N   | Un utilisateur a plusieurs relations d'amitié    |
| Conversation → GroupMessage       | 1,N   | Une conversation contient plusieurs messages     |
| Conversation → ConversationMember | 1,N   | Une conversation a plusieurs participants        |
| User → Event                      | 1,N   | Un utilisateur crée plusieurs événements         |
| Event → Rsvp                      | 1,N   | Un événement reçoit plusieurs réponses           |
| User → UserSettings               | 1,1   | Un utilisateur a exactement un paramétrage       |
| User → Account                    | 1,N   | Un utilisateur peut avoir plusieurs comptes OAuth|

---

## Checklist Modélisation

- [x] Dictionnaire de données — types SQL PostgreSQL
- [x] Relations et clés étrangères documentées
- [x] Enums PostgreSQL définis
- [x] Contraintes d'unicité listées
- [x] MLD avec notation clés étrangères
- [x] Cardinalités définies
- [x] Tests de cohérence (contraintes vérifiées via `prisma validate`)

---

## Diagrammes Complets

Les diagrammes MCD, MLD et MPD en format DBML et SQL sont disponibles dans [diagrammes-uml.md](./diagrammes-uml.md).
