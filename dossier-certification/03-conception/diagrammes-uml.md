#  Diagrammes UML - Social Network (Conforme Prisma)

## Objectif

Ce document fournit des versions exploitables du modèle de données à partir de la source de vérité du projet: `prisma/schema.prisma`.

- **MCD**: vision conceptuelle (entités et relations)
- **MLD**: vision logique (tables, colonnes, contraintes)
- **MPD**: vision physique PostgreSQL (DDL)

---

## 1. MCD (Modèle Conceptuel de Données)

Copie le code suivant dans [dbdiagram.io](https://dbdiagram.io):

```dbml
// MCD - aligné avec prisma/schema.prisma

Table User {
  id string [pk]
  firstName string
  lastName string
  email string [unique, not null]
  username string [unique]
  password string
  birthDate datetime
  biography text
  avatar string
  avatarId string
  banner string
  bannerId string
  visibility enum [default: 'PUBLIC']
}

Table Account {
  id string [pk]
  userId string [not null]
  provider string [not null]
  providerAccountId string [not null]
  refresh_token string
  access_token string
  expires_at bigint
  token_type string
  scope string
  id_token string
  session_state string
}

Table Post {
  id string [pk]
  userId string [not null]
  message text [not null]
  datetime datetime
  image string
  mediaId string
  visibility enum [default: 'PUBLIC']
}

Table Story {
  id string [pk]
  userId string [not null]
  datetime datetime
  media string
  mediaId string
  visibility enum [default: 'PUBLIC']
}

Table Comment {
  id string [pk]
  postId string [not null]
  userId string [not null]
  message text [not null]
  datetime datetime
}

Table Reaction {
  id string [pk]
  type enum [not null]
  userId string [not null]
  postId string
  storyId string
  commentId string
  datetime datetime
}

Table Message {
  id string [pk]
  senderId string [not null]
  receiverId string [not null]
  message text [not null]
  image string
  datetime datetime
  deliveredAt datetime
  readAt datetime
  status enum [default: 'SENT']
}

Table Friendship {
  id string [pk]
  userId string [not null]
  friendId string [not null]
  status enum [not null]
  createdAt datetime
}

Table Conversation {
  id string [pk]
  title string
  isGroup boolean [default: false]
  createdAt datetime
  ownerId string
}

Table ConversationMember {
  id string [pk]
  userId string [not null]
  conversationId string [not null]
  joinedAt datetime
  lastSeenAt datetime
  lastSeenMessageId string
}

Table GroupMessage {
  id string [pk]
  conversationId string [not null]
  senderId string [not null]
  message text [not null]
  image string
  sentAt datetime
  eventId string
  deliveredAt datetime
  readAt datetime
  status enum [default: 'SENT']
}

Table Event {
  id string [pk]
  title string [not null]
  description text [not null]
  datetime datetime [not null]
  groupId string [not null]
  ownerId string [not null]
  createdAt datetime
}

Table Rsvp {
  id string [pk]
  userId string [not null]
  eventId string [not null]
  status enum [not null]
  createdAt datetime
}

Table GroupInvitation {
  id string [pk]
  groupId string [not null]
  inviterId string [not null]
  invitedId string [not null]
  status enum [default: 'PENDING']
  createdAt datetime
}

Table GroupJoinRequest {
  id string [pk]
  groupId string [not null]
  seeker string [not null]
  status enum [default: 'PENDING']
  createdAt datetime
}

Table GroupMember {
  id string [pk]
  groupId string [not null]
  userId string [not null]
  joinedAt datetime
}

Table Notification {
  id string [pk]
  userId string [not null]
  type string [not null]
  message text [not null]
  isRead boolean [default: false]
  createdAt datetime
}

Table UserSettings {
  id string [pk]
  userId string [not null, unique]
  theme string [default: 'light']
  language string [default: 'en']
  notificationsEnabled boolean [default: true]
  createdAt datetime
}

// Relations
Ref: Account.userId > User.id
Ref: Post.userId > User.id
Ref: Story.userId > User.id
Ref: Comment.postId > Post.id
Ref: Comment.userId > User.id
Ref: Reaction.userId > User.id
Ref: Reaction.postId > Post.id
Ref: Reaction.storyId > Story.id
Ref: Reaction.commentId > Comment.id
Ref: Message.senderId > User.id
Ref: Message.receiverId > User.id
Ref: Friendship.userId > User.id
Ref: Friendship.friendId > User.id
Ref: Conversation.ownerId > User.id
Ref: ConversationMember.userId > User.id
Ref: ConversationMember.conversationId > Conversation.id
Ref: GroupMessage.conversationId > Conversation.id
Ref: GroupMessage.senderId > User.id
Ref: GroupMessage.eventId > Event.id
Ref: Event.groupId > Conversation.id
Ref: Event.ownerId > User.id
Ref: Rsvp.userId > User.id
Ref: Rsvp.eventId > Event.id
Ref: GroupInvitation.groupId > Conversation.id
Ref: GroupInvitation.inviterId > User.id
Ref: GroupInvitation.invitedId > User.id
Ref: GroupJoinRequest.groupId > Conversation.id
Ref: GroupJoinRequest.seeker > User.id
Ref: GroupMember.groupId > Conversation.id
Ref: GroupMember.userId > User.id
Ref: Notification.userId > User.id
Ref: UserSettings.userId > User.id
```

---

## 2. MLD (Modèle Logique de Données)

Version logique en DBML (naming SQL-like) compatible dbdiagram.io.

```dbml
Table users {
  id text [pk]
  first_name varchar(100)
  last_name varchar(100)
  email varchar(255) [unique, not null]
  username varchar(100) [unique]
  password_hash varchar(255)
  birth_date timestamptz
  biography text
  avatar varchar(500)
  avatar_id varchar(255)
  banner varchar(500)
  banner_id varchar(255)
  visibility varchar(20) [default: 'PUBLIC']
}

Table accounts {
  id text [pk]
  user_id text [not null]
  provider varchar(100) [not null]
  provider_account_id varchar(255) [not null]
  refresh_token text
  access_token text
  expires_at bigint
  token_type varchar(50)
  scope text
  id_token text
  session_state text
}

Table posts {
  id text [pk]
  user_id text [not null]
  message text [not null]
  datetime timestamptz [default: `now()`]
  image varchar(500)
  media_id varchar(255)
  visibility varchar(20) [default: 'PUBLIC']
}

Table stories {
  id text [pk]
  user_id text [not null]
  datetime timestamptz [default: `now()`]
  media varchar(500)
  media_id varchar(255)
  visibility varchar(20) [default: 'PUBLIC']
}

Table comments {
  id text [pk]
  post_id text [not null]
  user_id text [not null]
  message text [not null]
  datetime timestamptz [default: `now()`]
}

Table reactions {
  id text [pk]
  type varchar(20) [not null]
  user_id text [not null]
  post_id text
  story_id text
  comment_id text
  datetime timestamptz [default: `now()`]

  indexes {
    (user_id, post_id) [unique]
    (user_id, story_id) [unique]
    (user_id, comment_id) [unique]
  }
}

Table messages {
  id text [pk]
  sender_id text [not null]
  receiver_id text [not null]
  message text [not null]
  image varchar(500)
  datetime timestamptz [default: `now()`]
  delivered_at timestamptz
  read_at timestamptz
  status varchar(20) [default: 'SENT']
}

Table friendships {
  id text [pk]
  user_id text [not null]
  friend_id text [not null]
  status varchar(20) [not null]
  created_at timestamptz [default: `now()`]

  indexes {
    (user_id, friend_id) [unique]
  }
}

Table conversations {
  id text [pk]
  title varchar(255)
  is_group boolean [default: false]
  created_at timestamptz [default: `now()`]
  owner_id text
}

Table conversation_members {
  id text [pk]
  user_id text [not null]
  conversation_id text [not null]
  joined_at timestamptz [default: `now()`]
  last_seen_at timestamptz
  last_seen_message_id text

  indexes {
    (user_id, conversation_id) [unique]
  }
}

Table group_messages {
  id text [pk]
  conversation_id text [not null]
  sender_id text [not null]
  message text [not null]
  image varchar(500)
  sent_at timestamptz [default: `now()`]
  event_id text
  delivered_at timestamptz
  read_at timestamptz
  status varchar(20) [default: 'SENT']
}

Table events {
  id text [pk]
  title varchar(255) [not null]
  description text [not null]
  datetime timestamptz [not null]
  group_id text [not null]
  owner_id text [not null]
  created_at timestamptz [default: `now()`]
}

Table rsvps {
  id text [pk]
  user_id text [not null]
  event_id text [not null]
  status varchar(20) [not null]
  created_at timestamptz [default: `now()`]

  indexes {
    (user_id, event_id) [unique]
  }
}

Table group_invitations {
  id text [pk]
  group_id text [not null]
  inviter_id text [not null]
  invited_id text [not null]
  status varchar(20) [default: 'PENDING']
  created_at timestamptz [default: `now()`]

  indexes {
    (group_id, invited_id) [unique]
  }
}

Table group_join_requests {
  id text [pk]
  group_id text [not null]
  seeker text [not null]
  status varchar(20) [default: 'PENDING']
  created_at timestamptz [default: `now()`]

  indexes {
    (group_id, seeker) [unique]
  }
}

Table group_members {
  id text [pk]
  group_id text [not null]
  user_id text [not null]
  joined_at timestamptz [default: `now()`]

  indexes {
    (group_id, user_id) [unique]
  }
}

Table notifications {
  id text [pk]
  user_id text [not null]
  type varchar(100) [not null]
  message text [not null]
  is_read boolean [default: false]
  created_at timestamptz [default: `now()`]

  indexes {
    (user_id)
  }
}

Table user_settings {
  id text [pk]
  user_id text [not null, unique]
  theme varchar(20) [default: 'light']
  language varchar(10) [default: 'en']
  notifications_enabled boolean [default: true]
  created_at timestamptz [default: `now()`]
}

Ref: accounts.user_id > users.id
Ref: posts.user_id > users.id
Ref: stories.user_id > users.id
Ref: comments.post_id > posts.id
Ref: comments.user_id > users.id
Ref: reactions.user_id > users.id
Ref: reactions.post_id > posts.id
Ref: reactions.story_id > stories.id
Ref: reactions.comment_id > comments.id
Ref: messages.sender_id > users.id
Ref: messages.receiver_id > users.id
Ref: friendships.user_id > users.id
Ref: friendships.friend_id > users.id
Ref: conversations.owner_id > users.id
Ref: conversation_members.user_id > users.id
Ref: conversation_members.conversation_id > conversations.id
Ref: group_messages.conversation_id > conversations.id
Ref: group_messages.sender_id > users.id
Ref: group_messages.event_id > events.id
Ref: events.group_id > conversations.id
Ref: events.owner_id > users.id
Ref: rsvps.user_id > users.id
Ref: rsvps.event_id > events.id
Ref: group_invitations.group_id > conversations.id
Ref: group_invitations.inviter_id > users.id
Ref: group_invitations.invited_id > users.id
Ref: group_join_requests.group_id > conversations.id
Ref: group_join_requests.seeker > users.id
Ref: group_members.group_id > conversations.id
Ref: group_members.user_id > users.id
Ref: notifications.user_id > users.id
Ref: user_settings.user_id > users.id
```

---

## 3. MPD (Modèle Physique de Données - PostgreSQL)

> Remarque: Prisma génère des identifiants `cuid()` côté application, donc les PK sont stockées en `TEXT`.

```sql
-- MPD PostgreSQL aligné sur prisma/schema.prisma

CREATE TABLE users (
  id TEXT PRIMARY KEY,
  first_name VARCHAR(100),
  last_name VARCHAR(100),
  email VARCHAR(255) UNIQUE NOT NULL,
  username VARCHAR(100) UNIQUE,
  password_hash VARCHAR(255),
  birth_date TIMESTAMPTZ,
  biography TEXT,
  avatar VARCHAR(500),
  avatar_id VARCHAR(255),
  banner VARCHAR(500),
  banner_id VARCHAR(255),
  visibility VARCHAR(20) NOT NULL DEFAULT 'PUBLIC'
);

CREATE TABLE accounts (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  provider VARCHAR(100) NOT NULL,
  provider_account_id VARCHAR(255) NOT NULL,
  refresh_token TEXT,
  access_token TEXT,
  expires_at BIGINT,
  token_type VARCHAR(50),
  scope TEXT,
  id_token TEXT,
  session_state TEXT,
  CONSTRAINT accounts_provider_account_unique UNIQUE (provider, provider_account_id)
);

CREATE TABLE posts (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES users(id),
  message TEXT NOT NULL,
  datetime TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  image VARCHAR(500),
  media_id VARCHAR(255),
  visibility VARCHAR(20) NOT NULL DEFAULT 'PUBLIC'
);

CREATE TABLE stories (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES users(id),
  datetime TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  media VARCHAR(500),
  media_id VARCHAR(255),
  visibility VARCHAR(20) NOT NULL DEFAULT 'PUBLIC'
);

CREATE TABLE comments (
  id TEXT PRIMARY KEY,
  post_id TEXT NOT NULL REFERENCES posts(id),
  user_id TEXT NOT NULL REFERENCES users(id),
  message TEXT NOT NULL,
  datetime TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE reactions (
  id TEXT PRIMARY KEY,
  type VARCHAR(20) NOT NULL,
  user_id TEXT NOT NULL REFERENCES users(id),
  post_id TEXT REFERENCES posts(id),
  story_id TEXT REFERENCES stories(id),
  comment_id TEXT REFERENCES comments(id),
  datetime TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT reactions_user_post_unique UNIQUE (user_id, post_id),
  CONSTRAINT reactions_user_story_unique UNIQUE (user_id, story_id),
  CONSTRAINT reactions_user_comment_unique UNIQUE (user_id, comment_id),
  CONSTRAINT reactions_single_target CHECK (
    (post_id IS NOT NULL AND story_id IS NULL AND comment_id IS NULL) OR
    (post_id IS NULL AND story_id IS NOT NULL AND comment_id IS NULL) OR
    (post_id IS NULL AND story_id IS NULL AND comment_id IS NOT NULL)
  )
);

CREATE TABLE messages (
  id TEXT PRIMARY KEY,
  sender_id TEXT NOT NULL REFERENCES users(id),
  receiver_id TEXT NOT NULL REFERENCES users(id),
  message TEXT NOT NULL,
  image VARCHAR(500),
  datetime TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  delivered_at TIMESTAMPTZ,
  read_at TIMESTAMPTZ,
  status VARCHAR(20) NOT NULL DEFAULT 'SENT'
);

CREATE TABLE friendships (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES users(id),
  friend_id TEXT NOT NULL REFERENCES users(id),
  status VARCHAR(20) NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT friendships_user_friend_unique UNIQUE (user_id, friend_id)
);

CREATE TABLE conversations (
  id TEXT PRIMARY KEY,
  title VARCHAR(255),
  is_group BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  owner_id TEXT REFERENCES users(id)
);

CREATE TABLE conversation_members (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES users(id),
  conversation_id TEXT NOT NULL REFERENCES conversations(id),
  joined_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  last_seen_at TIMESTAMPTZ,
  last_seen_message_id TEXT,
  CONSTRAINT conversation_members_user_conversation_unique UNIQUE (user_id, conversation_id)
);

CREATE TABLE events (
  id TEXT PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  datetime TIMESTAMPTZ NOT NULL,
  group_id TEXT NOT NULL REFERENCES conversations(id),
  owner_id TEXT NOT NULL REFERENCES users(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE group_messages (
  id TEXT PRIMARY KEY,
  conversation_id TEXT NOT NULL REFERENCES conversations(id),
  sender_id TEXT NOT NULL REFERENCES users(id),
  message TEXT NOT NULL,
  image VARCHAR(500),
  sent_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  event_id TEXT REFERENCES events(id) ON DELETE CASCADE,
  delivered_at TIMESTAMPTZ,
  read_at TIMESTAMPTZ,
  status VARCHAR(20) NOT NULL DEFAULT 'SENT'
);

CREATE TABLE rsvps (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES users(id),
  event_id TEXT NOT NULL REFERENCES events(id),
  status VARCHAR(20) NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT rsvps_user_event_unique UNIQUE (user_id, event_id)
);

CREATE TABLE group_invitations (
  id TEXT PRIMARY KEY,
  group_id TEXT NOT NULL REFERENCES conversations(id),
  inviter_id TEXT NOT NULL REFERENCES users(id),
  invited_id TEXT NOT NULL REFERENCES users(id),
  status VARCHAR(20) NOT NULL DEFAULT 'PENDING',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT group_invitations_group_invited_unique UNIQUE (group_id, invited_id)
);

CREATE TABLE group_join_requests (
  id TEXT PRIMARY KEY,
  group_id TEXT NOT NULL REFERENCES conversations(id),
  seeker TEXT NOT NULL REFERENCES users(id),
  status VARCHAR(20) NOT NULL DEFAULT 'PENDING',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT group_join_requests_group_seeker_unique UNIQUE (group_id, seeker)
);

CREATE TABLE group_members (
  id TEXT PRIMARY KEY,
  group_id TEXT NOT NULL REFERENCES conversations(id),
  user_id TEXT NOT NULL REFERENCES users(id),
  joined_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT group_members_group_user_unique UNIQUE (group_id, user_id)
);

CREATE TABLE notifications (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES users(id),
  type VARCHAR(100) NOT NULL,
  message TEXT NOT NULL,
  is_read BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE user_settings (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL UNIQUE REFERENCES users(id),
  theme VARCHAR(20) NOT NULL DEFAULT 'light',
  language VARCHAR(10) NOT NULL DEFAULT 'en',
  notifications_enabled BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_notifications_user_id ON notifications(user_id);
```

---

## Utilisation

- **MCD / MLD**: coller dans dbdiagram.io pour visualiser les relations.
- **MPD**: utiliser comme base SQL de référence pour expliquer la structure physique pendant la soutenance.
- **Conformité**: ce document suit les noms de modèles, champs et contraintes de `prisma/schema.prisma`.
