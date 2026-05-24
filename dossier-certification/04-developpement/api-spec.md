# 📡 API Specification

## Vue d'Ensemble

Tous les endpoints requièrent une authentification JWT via cookie HTTP-only `authToken` (sauf les routes sous `/api/public/...`, notamment `/api/public/auth/login` et `/api/public/auth/register`). Le middleware (`src/middleware.ts`) protège tout par défaut.

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

### POST /api/public/auth/login

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

- JWT signé par `jose`, stocké dans un cookie `authToken` (HttpOnly, SameSite=Lax).
- Pas de session Redis : le JWT est auto-suffisant et validé à chaque requête par le middleware.

---

### POST /api/public/auth/register

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

### POST /api/public/auth/logout

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

- Supprime le cookie `authToken` côté client.
- Aucune session serveur à invalider (le JWT est stateless ; la révocation forcée n'est pas implémentée).

---

### GET /api/public/auth/redirect

Initie le flux OAuth Google (redirige vers `accounts.google.com`).

**Auth:** ❌

---

### GET /api/public/auth/callback

Callback OAuth Google : échange le `code` contre un token, crée/récupère l'utilisateur, signe un JWT et pose le cookie `authToken`.

**Auth:** ❌ (mais sécurisé par le `state` OAuth)

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

## 🔄 Temps Réel (Server-Sent Events / Redis)

Le projet n'utilise pas Socket.io ni de WebSocket persistant. Le push serveur → client passe par des endpoints **Server-Sent Events** qui pollent Upstash Redis pour détecter les nouveaux messages et statuts. Les mises à jour temps réel sont gérées côté client et serveur via ces endpoints SSE et des clés Redis (TTL court). C'est un compromis serverless-friendly (compatible Vercel), suffisant pour le volume cible.

### GET /api/private/chat/listen

Flux SSE des messages d'une conversation (direct ou groupe).

**Auth:** ✅ (cookie `authToken`)

**Query Params :**

- `conversationId` (requis)
- `type` : `direct` (défaut) ou `group`

**Response :**

- Header `Content-Type: text/event-stream`
- Premier event : `data: {"type":"connected"}\n\n`
- Events suivants à chaque nouveau message détecté dans Redis (`latest:chat:{from}:{to}` ou `latest:chat:group:{groupId}`) :

```
data: {"id":"msg-123","conversationId":"conv-456","senderId":"user-789","message":"Hello!","datetime":"2025-05-04T10:00:00Z","status":"SENT"}

```

### GET /api/private/chat/typing/listen

Flux SSE des indicateurs de saisie.

**Payload type :**

```json
{ "conversationId": "conv-123", "userId": "user-456", "isTyping": true }
```

### POST /api/private/chat/send

Envoie un message : persiste via Prisma puis met à jour la clé Redis lue par les flux SSE des destinataires.

**Auth:** ✅

### POST /api/private/chat/typing

Pousse un event `typing` dans Redis pour qu'il soit relayé par `/typing/listen`.

### Statuts (DELIVERED / READ)

Mis à jour via des endpoints REST classiques, pas via SSE :

- `POST /api/private/conversations/[id]/mark-seen` (groupe)
- `POST /api/private/direct-conversations/[id]/mark-seen` (DM)
- `PATCH /api/private/direct-messages/[id]/status`
- `PATCH /api/private/messages/[id]/status`

### Notifications

- `GET /api/private/notifications` — liste paginée
- `PATCH /api/private/notifications/[id]/read` — marquer comme lu

> Les notifications en quasi-temps réel reposent aujourd'hui sur le polling client + le rafraîchissement déclenché par les actions REST. Un flux SSE dédié `/notifications/listen` est un axe d'amélioration possible.

---

## 📊 Résumé Endpoints

| Verb  | Endpoint                              | Description                | Auth |
| ----- | ------------------------------------- | -------------------------- | ---- |
| POST  | `/api/public/auth/login`              | Connexion                  | ❌   |
| POST  | `/api/public/auth/register`           | Inscription                | ❌   |
| POST  | `/api/public/auth/logout`             | Déconnexion                | ✅   |
| GET   | `/api/public/auth/redirect`           | Init OAuth Google          | ❌   |
| GET   | `/api/public/auth/callback`           | Callback OAuth Google      | ❌   |
| GET   | `/api/user/me`                        | ID utilisateur             | ✅   |
| GET   | `/api/private/me`                     | Profil complet             | ✅   |
| PUT   | `/api/private/me`                     | Modifier profil            | ✅   |
| GET   | `/api/private/user`                   | Profil public              | ✅   |
| GET   | `/api/private/post`                   | Lister posts               | ✅   |
| POST  | `/api/private/post`                   | Créer post                 | ✅   |
| GET   | `/api/private/stories`                | Lister stories             | ✅   |
| POST  | `/api/private/stories`                | Créer story                | ✅   |
| GET   | `/api/private/messages`               | Lister messages            | ✅   |
| GET   | `/api/private/conversations`          | Lister conversations       | ✅   |
| GET   | `/api/private/groups`                 | Lister groupes             | ✅   |
| POST  | `/api/private/groups`                 | Créer groupe               | ✅   |
| GET   | `/api/private/events`                 | Lister événements          | ✅   |
| POST  | `/api/private/events`                 | Créer événement            | ✅   |
| GET   | `/api/private/friend-requests`        | Demandes d'amitié          | ✅   |
| POST  | `/api/private/friend-requests`        | Envoyer demande            | ✅   |
| GET   | `/api/private/search`                 | Rechercher                 | ✅   |
| GET   | `/api/private/invitations`            | Invitations groupe         | ✅   |
| GET   | `/api/private/chat/listen` *(SSE)*    | Flux temps réel messages   | ✅   |
| POST  | `/api/private/chat/send`              | Envoyer un message         | ✅   |
| GET   | `/api/private/chat/typing/listen` *(SSE)* | Flux typing indicator  | ✅   |
| POST  | `/api/private/chat/typing`            | Pousser un event typing    | ✅   |

---

## ✅ Validation & Erreurs

- Tous les endpoints valident les données entrantes (Zod schemas).
- Les erreurs de validation retournent 400 avec détails des champs.
- Les ressources non trouvées retournent 404.
- Les accès non autorisés retournent 401 (JWT) ou 403 (permissions).
- Les erreurs serveur retournent 500 avec message.

---

## 🔗 Implémentation

- **Stack:** Next.js 15 API Routes (App Router) + Prisma 6 + PostgreSQL (Neon)
- **Auth:** JWT custom (`jose` + `jsonwebtoken`) + bcrypt, cookie `authToken` (HttpOnly)
- **Real-time:** Server-Sent Events + Upstash Redis (polling REST)
- **Storage:** Cloudinary
- **Validation:** Zod schemas (`src/lib/schemas/`)
- **Runtime/Package manager:** Bun (`bun.lock`, image Docker `oven/bun:1`)

---

**Last Updated:** 2026-05-21
