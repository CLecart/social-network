# 07 - Annexes

## Objectif

Rassembler les éléments de référence qui soutiennent le dossier: configuration, tests, diagrammes et ressources, avec des liens directement exploitables pour la soutenance.

---

## 📚 Ressources du Projet

### Code Source

- Repository: https://github.com/arocchet/social-network

### 🔎 Preuves GitHub

Liens directs vers les issues et PRs utilisées comme preuves dans le dossier:

- Follow / friendship: https://github.com/arocchet/social-network/issues/13
- Groups & Events: https://github.com/arocchet/social-network/issues/24
- Group feed: https://github.com/arocchet/social-network/issues/30
- Chat system: https://github.com/arocchet/social-network/issues/37
- Notifications: https://github.com/arocchet/social-network/issues/39
- DevOps / Docker / CI: https://github.com/arocchet/social-network/issues/40
- CI pipeline: https://github.com/arocchet/social-network/issues/45
- Seed script: https://github.com/arocchet/social-network/issues/46
- Mark notification as read: https://github.com/arocchet/social-network/issues/51
- OAuth (Google): https://github.com/arocchet/social-network/issues/66
- Internationalization: https://github.com/arocchet/social-network/issues/76
- Settings: https://github.com/arocchet/social-network/issues/111
- PR stabilisation (Docker/Neon/Prisma/Redis): https://github.com/arocchet/social-network/pull/118

### Fichiers utiles

- [README racine](../README.md)
- [Section conception](../03-conception/README.md)
- [Section développement](../04-developpement/README.md)
- [API specification](../04-developpement/api-spec.md)
- [Section déploiement](../05-deploiement/README.md)
- [Section bilan](../06-bilan/README.md)
- Modèle Word du dossier professionnel: `Dossier_Professionnel_Social_Network.docx`

---

## ⚙️ Configuration d'Environnement

### .env.example

```bash
# Database
DATABASE_URL=postgresql://user:password@localhost:5432/social-network
DATABASE_TEST_URL=file:./test.db

# Auth
JWT_SECRET=change-me
OAUTH_TOKEN_ENCRYPTION_KEY=change-me-too

# Redis (Upstash)
UPSTASH_REDIS_REST_URL=https://...
UPSTASH_REDIS_REST_TOKEN=...

# Cloudinary
CLOUDINARY_CLOUD_NAME=demo
CLOUDINARY_API_KEY=demo
CLOUDINARY_API_SECRET=demo

# External APIs
NEXT_PUBLIC_GIPHY_API_KEY=demo

# Google OAuth
CLIENT_ID=...
CLIENT_SECRET=...
REDIRECT_URL=http://localhost:3000/api/auth/google/callback

# Optional test/fallback values
DISABLE_CLOUDINARY=true
FALLBACK_AVATAR_URL=https://example.com/avatar.png
FALLBACK_COVER_URL=https://example.com/cover.png
```

### Docker

- `Dockerfile`: build multi-stage pour Next.js.
- `docker-compose.yml`: app, PostgreSQL, Redis.

---

## 🧪 Tests

### Tests disponibles

- `__tests__/integrations/authentification.test.ts` pour la logique d'authentification.
- Tests d'intégration sur les routes API avec Jest.
- Tests UI à prévoir si la couverture front doit être renforcée.

### Test d'authentification du projet

```typescript
import { POST } from "@/app/api/public/auth/register/route";
import { db } from "@/lib/db";
import { hashPassword } from "@/lib/security/hash";
import { NextRequest } from "next/server";

beforeAll(async () => {
  await db.user.create({
    data: {
      username: "testuser",
      email: "test@example.com",
      password: await hashPassword("password123"),
      firstName: "Test",
      lastName: "User",
      birthDate: new Date("1990-01-01"),
    },
  });
});

describe("POST /api/public/auth/register", () => {
  it("should register user and return success", async () => {
    const formData = new FormData();
    formData.append("username", `testuser_${Date.now()}`);
    formData.append("email", `testuser_${Date.now()}@example.com`);
    formData.append("password", "password123");
    formData.append("firstname", "Test");
    formData.append("lastname", "User");
    formData.append("dateOfBirth", "1990-01-01");

    const req = { formData: async () => formData } as unknown as NextRequest;
    const res = await POST(req);

    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json.success).toBe(true);
  });
});
```

---

## 📊 Diagrammes Synthétiques

### Architecture Générale

```mermaid
flowchart LR
    Client[Browser] --> Next[Next.js App]
    Next --> API[API Routes]
    API --> DB[(PostgreSQL - Neon)]
    API --> Redis[(Upstash Redis)]
    API --> Cloudinary[(Cloudinary)]
    Client -- "EventSource / fetch stream" --> SSE[SSE Endpoints]
    SSE --> Redis
```

### Flux de Données

```mermaid
sequenceDiagram
    participant U as User
    participant A as API Route
    participant V as Validation
    participant D as Database

    U->>A: Submit form
    A->>V: Zod validation
    V-->>A: Valid data
    A->>D: Prisma query
    D-->>A: Persisted entity
    A-->>U: JSON response
```

---

## 🔗 Ressources Utilisées

### Documentation Officielle

- [Next.js Docs](https://nextjs.org/docs)
- [Prisma Docs](https://www.prisma.io/docs)
- [TypeScript Handbook](https://www.typescriptlang.org/docs)
- [PostgreSQL Docs](https://www.postgresql.org/docs)
- [Docker Docs](https://docs.docker.com)
- [Vercel Docs](https://vercel.com/docs)

### Bibliothèques Principales

- Next.js 15 (App Router)
- React 19
- Prisma 6
- TypeScript
- Tailwind CSS + Radix UI / shadcn
- `@upstash/redis` (REST)
- `jose` + `jsonwebtoken` (JWT)
- `googleapis` (OAuth Google)
- Cloudinary (`next-cloudinary`)
- Jest + `ts-jest`
- Zod
- `bcrypt`
- Bun (runtime + package manager)

---

## 📋 Checklist de Remise

- [x] Structure du dossier complète.
- [x] Conception documentée.
- [x] Développement documenté.
- [x] Déploiement documenté.
- [x] Bilan documenté.
- [x] Annexes structurées.
- [ ] Captures d'écran finales à ajouter si demandées par le jury.
- [ ] Export PDF final à générer si nécessaire.
- [ ] Vérification orthographique finale recommandée avant impression.

---

## Conclusion

Les annexes servent de preuve de cohérence: elles relient les sections du dossier aux fichiers techniques du dépôt et donnent au jury des points d'appui concrets pour vérifier l'implémentation.
