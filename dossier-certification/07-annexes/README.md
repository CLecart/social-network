# 07 - Annexes

## 📚 Documentation Technique

### Code Source Complet

- GitHub: https://github.com/arocchet/social-network
- Branch: `feat/docker` (développement)
- Branch: `main` (production)

### Configuration

#### .env.example

```bash
# Database
DATABASE_URL=postgresql://user:password@localhost:5432/social-network
DIRECT_URL=postgresql://... # Prisma specific

# Redis
REDIS_URL=redis://localhost:6379

# Auth
JWT_SECRET=your-secret-key-here
NEXTAUTH_SECRET=your-nextauth-secret
NEXTAUTH_URL=http://localhost:3000

# External APIs
NEXT_PUBLIC_API_URL=http://localhost:3000/api
```

#### docker-compose.yml

```yaml
# Voir fichier à la racine du projet
```

#### Dockerfile

```dockerfile
# Voir fichier à la racine du projet
```

---

## 🧪 Tests

### Jest Configuration

```javascript
// jest.config.js
```

### Test Examples

```typescript
// Exemples de tests unitaires
// À ajouter: __tests__/ directory screenshots
```

---

## 📊 Diagrammes

### Architecture Générale

```
[Client] <--HTTP/WebSocket--> [Next.js App] <--SQL--> [PostgreSQL]
                                    |
                                    +---> [Redis]
                                    |
                                    +---> [External APIs]
```

### Data Flow

```
User Input --> Validation --> API Route --> Database --> Response
```

---

## 🔗 Ressources Utilisées

### Documentation Officielle

- [Next.js Docs](https://nextjs.org/docs)
- [Prisma Docs](https://www.prisma.io/docs)
- [TypeScript Handbook](https://www.typescriptlang.org/docs)
- [PostgreSQL Docs](https://www.postgresql.org/docs)
- [Docker Docs](https://docs.docker.com)

### Libraries/Packages

- `next` - React framework
- `prisma` - Database ORM
- `typescript` - Type safety
- `tailwindcss` - Styling
- `redis` - Caching
- `socket.io` - Real-time communication
- `bcryptjs` - Password hashing
- `jsonwebtoken` - Auth tokens
- `dotenv` - Environment variables
- `sentry` - Error tracking

### Tools

- GitHub - Version control
- Vercel - Hosting/Deployment
- Neon - Serverless Database
- Docker - Containerization
- ESLint/Prettier - Code quality
- Jest - Testing
- Postman - API testing

---

## 📋 Checklist de Remise

- [ ] Code poussé sur GitHub
- [ ] README.md complet
- [ ] Tous les tests passent
- [ ] Dossier de certification complété
- [ ] Screenshots des différentes pages
- [ ] Documentation architecture
- [ ] Guide de déploiement
- [ ] Configuration d'environnement documentée
- [ ] Performance audité (Lighthouse)
- [ ] Security scan complété

---

## 📞 Support & Contact

**Repository:** https://github.com/arocchet/social-network  
**Branche développement:** feat/docker  
**Issues:** https://github.com/arocchet/social-network/issues

---

## 📄 Licence

[À spécifier: MIT, Apache 2.0, etc.]
