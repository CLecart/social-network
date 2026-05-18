# 📡 API Specification

## Vue d'Ensemble

Tous les endpoints requièrent une authentification JWT via cookie HTTP-only (sauf `/auth/login` et `/auth/register`).

### Response Format Standard

```json
{
  "data": {
    /* payload */
  },
  "message": "Optional message",
  "error": null,
  "success": true
}
```

### Erreurs Standard

| Code | Erreur                | Description                             |
| ---- | --------------------- | --------------------------------------- |
| 400  | Bad Request           | Données manquantes ou invalides         |
| 401  | Unauthorized          | JWT absent ou expiré                    |
| 403  | Forbidden             | Accès refusé (ex: pas membre du groupe) |
| 404  | Not Found             | Ressource inexistante                   |
| 500  | Internal Server Error | Erreur serveur                          |

---

## 🔐 Authentification

### POST /api/auth/login

Connexion utilisateur.

**Request:**

```json
{
  "email": "user@example.com",
  "password": "SecurePassword123"
}
```

**Response 200:**

```json
{
  "data": {
    "id": "cuid-123",
    "email": "user@example.com",
    "username": "john_doe"
  },
  "message": "Login successful",
  "success": true
}
```

**Response 401:**

```json
{
  "data": null,
  "error": "Invalid credentials",
  "success": false
}
```

**Notes:**

- JWT stocké en cookie HTTP-only sécurisé
- Session Redis créée côté serveur

---

### POST /api/auth/register

Inscription nouvel utilisateur.

**Request:**

```json
{
  "email": "new@example.com",
  "password": "SecurePassword123",
  "firstName": "John",
  "lastName": "Doe"
}
```

**Response 201:**

```json
{
  "data": {
    "id": "cuid-456",
    "email": "new@example.com",
    "username": null,
    "firstName": "John",
    "lastName": "Doe"
  },
  "message": "User registered successfully",
  "success": true
}
```

**Response 400:**

```json
{
  "data": null,
  "error": "Email already exists",
  "success": false
}
```

---

### POST /api/auth/logout

Déconnexion utilisateur.

**Response 200:**

```json
{
  "data": null,
  "message": "Logged out successfully",
  "success": true
}
```

**Notes:**

- Invalide la session Redis
- Supprime le cookie JWT

---

## 👤 Utilisateurs

### GET /api/user/me

Récupère l'ID de l'utilisateur connecté (endpoint simple).

**Auth:** Requis

**Response 200:**

```json
{
  "data": {
    "id": "cuid-123"
  },
  "success": true
}
```

**Response 401:**

```json
{
  "data": null,
  "error": "Unauthorized",
  "success": false
}
```

---

### GET /api/private/me

Récupère le profil complet de l'utilisateur connecté.

**Auth:** Requis

**Response 200:**

```json
{
  "data": {
    "id": "cuid-123",
    "email": "user@example.com",
    "username": "john_doe",
    "firstName": "John",
    "lastName": "Doe",
    "biography": "Software developer",
    "avatar": "https://cloudinary.com/avatar.jpg",
    "avatarId": "cloudinary-id",
    "banner": "https://cloudinary.com/banner.jpg",
    "bannerId": "cloudinary-id",
    "visibility": "PUBLIC"
  },
  "success": true
}
```

**Response 404:**

```json
{
  "data": null,
  "error": "User not found",
  "success": false
}
```

---

### PUT /api/private/me

Met à jour le profil de l'utilisateur.

**Auth:** Requis

**Request (multipart/form-data):**

```
firstName: "John"
lastName: "Doe"
username: "john_doe"
biography: "Software engineer"
avatar: <File>
banner: <File>
```

**Response 200:**

```json
{
  "data": null,
  "message": "User updated successfully",
  "success": true
}
```

**Response 400:**

```json
{
  "data": { "username": "Username already taken" },
  "error": "Validation error",
  "success": false
}
```

---

### GET /api/private/user

Récupère le profil public de l'utilisateur connecté.

**Auth:** Requis

**Response 200:**

```json
{
  "data": {
    "id": "cuid-123",
    "username": "john_doe",
    "firstName": "John",
    "lastName": "Doe",
    "avatar": "https://cloudinary.com/avatar.jpg",
    "banner": "https://cloudinary.com/banner.jpg",
    "biography": "Software engineer"
  },
  "success": true
}
```

---

## 📱 Posts

### GET /api/private/post

Récupère tous les posts de l'utilisateur connecté.

**Auth:** Requis

**Query Params:**

- `limit` (optionnel): Nombre de posts (default: 20)
- `cursor` (optionnel): Pour pagination infinité

**Response 200:**

```json
{
  "data": [
    {
      "id": "post-123",
      "userId": "user-123",
      "message": "Hello world!",
      "datetime": "2025-05-04T10:30:00Z",
      "image": "https://cloudinary.com/post.jpg",
      "mediaId": "cloudinary-id",
      "visibility": "PUBLIC",
      "reactions": 5,
      "comments": 2
    }
  ],
  "message": "No posts available yet",
  "success": true
}
```

---

### POST /api/private/post

Crée un nouveau post.

**Auth:** Requis

**Request (multipart/form-data):**

```
message: "Hello world!"
image: <File>
visibility: "PUBLIC"
```

**Response 201:**

```json
{
  "data": {
    "id": "post-456",
    "userId": "user-123",
    "message": "Hello world!",
    "datetime": "2025-05-04T10:35:00Z",
    "image": "https://cloudinary.com/post.jpg",
    "mediaId": "cloudinary-id",
    "visibility": "PUBLIC"
  },
  "success": true
}
```

**Response 400:**

```json
{
  "data": null,
  "error": "Message is required",
  "success": false
}
```

---

## 🎬 Stories

### GET /api/private/stories

Récupère les stories disponibles.

**Auth:** Requis

**Query Params:**

- `userId` (optionnel): Stories d'un utilisateur spécifique
- `publicOnly` (optionnel): Seulement stories publiques (default: false)

**Response 200:**

```json
{
  "data": [
    {
      "user": {
        "id": "user-123",
        "username": "john_doe",
        "avatar": "https://cloudinary.com/avatar.jpg"
      },
      "stories": [
        {
          "id": "story-123",
          "datetime": "2025-05-04T10:00:00Z",
          "media": "https://cloudinary.com/story.jpg",
          "visibility": "PUBLIC",
          "likesCount": 3
        }
      ],
      "hasUnviewed": true
    }
  ],
  "success": true
}
```

---

### POST /api/private/stories

Crée une nouvelle story.

**Auth:** Requis

**Request (multipart/form-data):**

```
media: <File>
visibility: "PUBLIC"
```

**Response 201:**

```json
{
  "data": {
    "id": "story-456",
    "userId": "user-123",
    "datetime": "2025-05-04T11:00:00Z",
    "media": "https://cloudinary.com/story.jpg",
    "mediaId": "cloudinary-id",
    "visibility": "PUBLIC"
  },
  "success": true
}
```

---

## 💬 Messages & Conversations

### GET /api/private/messages

Récupère les messages entre deux utilisateurs.

**Auth:** Requis

**Query Params:**

- `senderId` (requis): ID de l'expéditeur
- `unreadOnly` (optionnel): Seulement messages non lus

**Response 200:**

```json
{
  "data": {
    "messages": [
      {
        "id": "msg-123",
        "message": "Hello!",
        "status": "READ",
        "datetime": "2025-05-04T10:00:00Z",
        "readAt": "2025-05-04T10:01:00Z"
      }
    ]
  },
  "success": true
}
```

**Response 400:**

```json
{
  "data": null,
  "error": "senderId is required",
  "success": false
}
```

---

### GET /api/private/conversations

Liste toutes les conversations de l'utilisateur.

**Auth:** Requis

**Response 200:**

```json
{
  "data": {
    "conversations": [
      {
        "id": "conv-123",
        "title": "Group Chat 1",
        "isGroup": true,
        "memberCount": 5,
        "members": [
          {
            "id": "user-1",
            "username": "john_doe",
            "avatar": "https://cloudinary.com/avatar.jpg"
          }
        ],
        "lastMessage": {
          "message": "See you later!",
          "sender": "jane_doe",
          "timestamp": "2025-05-04T10:30:00Z"
        },
        "createdAt": "2025-05-01T00:00:00Z"
      }
    ]
  },
  "success": true
}
```

---

## 👥 Groupes

### GET /api/private/groups

Récupère tous les groupes de l'utilisateur.

**Auth:** Requis

**Response 200:**

```json
{
  "data": {
    "groups": [
      {
        "id": "group-123",
        "title": "Developers Club",
        "memberCount": 12,
        "members": [
          {
            "id": "user-1",
            "username": "alice",
            "avatar": "https://cloudinary.com/avatar1.jpg"
          }
        ],
        "lastMessage": {
          "message": "New feature deployed!",
          "sender": "bob",
          "timestamp": "2025-05-04T09:00:00Z"
        },
        "createdAt": "2025-04-01T00:00:00Z"
      }
    ]
  },
  "success": true
}
```

---

### POST /api/private/groups

Crée un nouveau groupe.

**Auth:** Requis

**Request:**

```json
{
  "title": "Developers Club",
  "memberIds": ["user-1", "user-2"]
}
```

**Response 201:**

```json
{
  "data": {
    "id": "group-456",
    "title": "Developers Club",
    "memberCount": 3,
    "members": [
      {
        "id": "user-123",
        "username": "creator",
        "avatar": "https://cloudinary.com/avatar.jpg"
      }
    ],
    "createdAt": "2025-05-04T12:00:00Z"
  },
  "success": true
}
```

**Response 400:**

```json
{
  "data": null,
  "error": "Title is required",
  "success": false
}
```

---

## 📅 Événements

### GET /api/private/events

Récupère les événements.

**Auth:** Requis

**Query Params:**

- `groupId` (optionnel): Événements d'un groupe spécifique

**Response 200:**

```json
{
  "data": {
    "events": [
      {
        "id": "event-123",
        "title": "Team Meetup",
        "description": "Monthly team sync",
        "datetime": "2025-05-15T14:00:00Z",
        "owner": {
          "id": "user-123",
          "username": "organizer",
          "avatar": "https://cloudinary.com/avatar.jpg"
        },
        "group": {
          "id": "group-123",
          "title": "Tech Team"
        },
        "rsvpCounts": {
          "yes": 5,
          "no": 1,
          "maybe": 2
        },
        "userRsvp": "YES",
        "createdAt": "2025-05-04T10:00:00Z"
      }
    ]
  },
  "success": true
}
```

---

### POST /api/private/events

Crée un nouvel événement.

**Auth:** Requis

**Request:**

```json
{
  "title": "Team Meetup",
  "description": "Monthly team sync",
  "datetime": "2025-05-15T14:00:00Z",
  "groupId": "group-123"
}
```

**Response 201:**

```json
{
  "data": {
    "id": "event-456",
    "title": "Team Meetup",
    "description": "Monthly team sync",
    "datetime": "2025-05-15T14:00:00Z",
    "owner": {
      "id": "user-123",
      "username": "organizer"
    },
    "group": {
      "id": "group-123",
      "title": "Tech Team"
    },
    "createdAt": "2025-05-04T12:30:00Z"
  },
  "success": true
}
```

**Response 400:**

```json
{
  "data": null,
  "error": "Event date must be in the future",
  "success": false
}
```

---

## 👫 Amitié

### GET /api/private/friend-requests

Récupère les demandes d'amitié reçues.

**Auth:** Requis

**Response 200:**

```json
{
  "data": [
    {
      "id": "friendship-123",
      "user": {
        "id": "user-456",
        "username": "alice",
        "firstName": "Alice",
        "lastName": "Smith",
        "avatar": "https://cloudinary.com/avatar.jpg"
      },
      "createdAt": "2025-05-03T10:00:00Z"
    }
  ],
  "success": true
}
```

---

### POST /api/private/friend-requests

Crée une demande d'amitié ou annule une relation existante.

**Auth:** Requis

**Request:**

```json
{
  "friendId": "user-456"
}
```

**Response 201 (Nouvelle demande):**

```json
{
  "data": {
    "status": "PENDING"
  },
  "message": "Friend request sent",
  "success": true
}
```

**Response 200 (Amitié supprimée):**

```json
{
  "data": null,
  "message": "Friendship removed",
  "success": true
}
```

**Response 400:**

```json
{
  "data": null,
  "error": "Cannot send friend request to yourself",
  "success": false
}
```

---

## 🔍 Recherche

### GET /api/private/search

Recherche utilisateurs et posts.

**Auth:** Requis

**Query Params:**

- `q` (requis): Terme de recherche

**Response 200:**

```json
{
  "data": [
    {
      "id": "user-123",
      "type": "accounts",
      "username": "john_doe",
      "displayName": "John Doe",
      "image": "https://cloudinary.com/avatar.jpg"
    },
    {
      "id": "post-456",
      "type": "posts",
      "content": "Hello world!",
      "createdAt": "2025-05-04T10:00:00Z",
      "images": "https://cloudinary.com/post.jpg",
      "user": {
        "id": "user-123",
        "username": "john_doe",
        "displayName": "John Doe",
        "image": "https://cloudinary.com/avatar.jpg"
      },
      "stats": {
        "likes": 5,
        "comments": 2
      }
    }
  ],
  "success": true
}
```

---

## 📬 Invitations

### GET /api/private/invitations

Récupère les invitations de groupe en attente.

**Auth:** Requis

**Response 200:**

```json
{
  "data": [
    {
      "id": "invite-123",
      "groupId": "group-456",
      "group": {
        "id": "group-456",
        "title": "Tech Team"
      },
      "inviter": {
        "id": "user-789",
        "username": "bob",
        "firstName": "Bob",
        "lastName": "Smith",
        "avatar": "https://cloudinary.com/avatar.jpg"
      },
      "status": "PENDING",
      "createdAt": "2025-05-03T15:00:00Z"
    }
  ],
  "success": true
}
```

---

## 🔄 Temps Réel (SSE / Redis)

### Événements Temps Réel (SSE / Redis)

Les mises à jour temps réel sont gérées côté client et serveur via des endpoints SSE et des clés Redis. Le système repose sur des lectures périodiques côté client (polling) des données mises à jour en Redis.

**Principaux événements:**

#### `message:create`

Nouveau message direct ou groupe.

**Payload:**

```json
{
  "id": "msg-123",
  "conversationId": "conv-456",
  "senderId": "user-789",
  "message": "Hello!",
  "timestamp": "2025-05-04T10:00:00Z",
  "status": "SENT"
}
```

#### `message:status`

Mise à jour statut (DELIVERED / READ).

**Payload:**

```json
{
  "messageId": "msg-123",
  "status": "READ",
  "timestamp": "2025-05-04T10:01:00Z"
}
```

#### `notification:new`

Nouvelle notification (like, comment, follow, etc).

**Payload:**

```json
{
  "id": "notif-123",
  "userId": "user-456",
  "type": "like",
  "message": "John Doe liked your post",
  "timestamp": "2025-05-04T10:05:00Z"
}
```

#### `typing`

Indicateur de saisie.

**Payload:**

```json
{
  "conversationId": "conv-123",
  "userId": "user-456",
  "isTyping": true
}
```

#### `presence`

Statut en ligne/hors ligne.

**Payload:**

```json
{
  "userId": "user-456",
  "isOnline": true,
  "lastSeen": "2025-05-04T10:00:00Z"
}
```

---

## 📊 Résumé Endpoints

| Verb | Endpoint                       | Description          | Auth |
| ---- | ------------------------------ | -------------------- | ---- |
| POST | `/api/auth/login`              | Connexion            | ❌   |
| POST | `/api/auth/register`           | Inscription          | ❌   |
| POST | `/api/auth/logout`             | Déconnexion          | ✅   |
| GET  | `/api/user/me`                 | ID utilisateur       | ✅   |
| GET  | `/api/private/me`              | Profil complet       | ✅   |
| PUT  | `/api/private/me`              | Modifier profil      | ✅   |
| GET  | `/api/private/user`            | Profil public        | ✅   |
| GET  | `/api/private/post`            | Lister posts         | ✅   |
| POST | `/api/private/post`            | Créer post           | ✅   |
| GET  | `/api/private/stories`         | Lister stories       | ✅   |
| POST | `/api/private/stories`         | Créer story          | ✅   |
| GET  | `/api/private/messages`        | Lister messages      | ✅   |
| GET  | `/api/private/conversations`   | Lister conversations | ✅   |
| GET  | `/api/private/groups`          | Lister groupes       | ✅   |
| POST | `/api/private/groups`          | Créer groupe         | ✅   |
| GET  | `/api/private/events`          | Lister événements    | ✅   |
| POST | `/api/private/events`          | Créer événement      | ✅   |
| GET  | `/api/private/friend-requests` | Demandes d'amitié    | ✅   |
| POST | `/api/private/friend-requests` | Envoyer demande      | ✅   |
| GET  | `/api/private/search`          | Rechercher           | ✅   |
| GET  | `/api/private/invitations`     | Invitations groupe   | ✅   |

---

## ✅ Validation & Erreurs

- Tous les endpoints valident les données entrantes (Zod schemas).
- Les erreurs de validation retournent 400 avec détails des champs.
- Les ressources non trouvées retournent 404.
- Les accès non autorisés retournent 401 (JWT) ou 403 (permissions).
- Les erreurs serveur retournent 500 avec message.

---

## 🔗 Implémentation

- **Stack:** Next.js API Routes + Prisma + PostgreSQL
- **Auth:** JWT + Redis sessions
- **Real-time:** SSE + Upstash Redis
- **Storage:** Cloudinary
- **Validation:** Zod schemas

---

**Last Updated:** 2026-05-04
