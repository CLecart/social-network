# 07 - Annexes

## Objectif

Rassembler les éléments de référence qui soutiennent le dossier: configuration, tests, diagrammes et ressources.

---

## 📚 Références Projet

### Code Source

- Repository: https://github.com/arocchet/social-network
- Branche de travail: `docs/dossier-certification`
- Branche de référence: `main`

### Fichiers utiles

- [README racine](../README.md)
- [Section conception](../03-conception/README.md)
- [Section développement](../04-developpement/README.md)
- [API specification](../04-developpement/api-spec.md)
- [Section déploiement](../05-deploiement/README.md)
- [Section bilan](../06-bilan/README.md)

---

## ⚙️ Configuration d'Environnement

### .env.example

```bash
# Database
DATABASE_URL=postgresql://user:password@localhost:5432/social-network
DIRECT_URL=postgresql://user:password@localhost:5432/social-network

# Redis
REDIS_URL=redis://localhost:6379

# Auth
JWT_SECRET=change-me
NEXTAUTH_SECRET=change-me-too
NEXTAUTH_URL=http://localhost:3000

# App
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_API_URL=http://localhost:3000/api

# Media
CLOUDINARY_CLOUD_NAME=demo
CLOUDINARY_API_KEY=demo
CLOUDINARY_API_SECRET=demo
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

### Exemple de test

```typescript
import { POST } from "@/app/api/auth/login/route";

describe("POST /api/auth/login", () => {
  it("returns 200 for valid credentials", async () => {
    const request = new Request("http://localhost/api/auth/login", {
      method: "POST",
      body: JSON.stringify({
        email: "user@example.com",
        password: "password123",
      }),
    });

    const response = await POST(request as any);
    expect(response.status).toBe(200);
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
    API --> DB[(PostgreSQL)]
    API --> Redis[(Redis)]
    API --> Cloudinary[(Cloudinary)]
    Client <--> Socket[Socket.io]
    Socket <--> Redis
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

- Next.js
- Prisma
- TypeScript
- Tailwind CSS
- Redis
- Socket.io
- Cloudinary
- Jest
- Zod
- bcryptjs

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

---

## Conclusion

Les annexes servent de preuve de cohérence: elles relient les sections du dossier aux fichiers techniques du dépôt et donnent au jury des points d'appui concrets pour vérifier l'implémentation.
