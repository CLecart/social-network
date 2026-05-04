# 05 - Déploiement

## 🐳 Docker & Containerization

### Dockerfile

```dockerfile
# Voir Dockerfile à la racine
```

### Docker Compose

```yaml
# Voir docker-compose.yml à la racine
```

### Services

- **app:** Application Next.js
- **db:** PostgreSQL
- **redis:** Cache et sessions

---

## 📦 Bases de Données

### PostgreSQL

**Neon (Serverless PostgreSQL)**

- Connexion: `DATABASE_URL` env variable
- Migrations: Prisma Migrate
- Backups: Automatiques via Neon

### Redis

**Configuration**

- Cache: Sessions utilisateur
- Queue: Jobs asynchrones
- Real-time: Pub/Sub WebSocket

---

## 🚀 Déploiement en Production

### Vercel (Recommandé)

1. **Push sur GitHub**

```bash
git push origin main
```

2. **Vercel détecte automatiquement Next.js**
   - Build: `npm run build`
   - Start: `npm start`

3. **Variables d'environnement**

```
DATABASE_URL=postgresql://...
REDIS_URL=redis://...
JWT_SECRET=...
NEXTAUTH_SECRET=...
```

4. **Domains & SSL**
   - SSL automatique via Vercel
   - Custom domain configuration

---

## 🔄 CI/CD Pipeline

### GitHub Actions

**Workflows:**

- `lint.yml` - ESLint/Prettier
- `test.yml` - Tests unitaires
- `build.yml` - Build Next.js
- `deploy.yml` - Déploiement Vercel

---

## 📊 Monitoring

### Vercel Analytics

- Page Performance
- Core Web Vitals
- User Interaction

### Sentry

- Error tracking
- Performance monitoring
- Release tracking

### Custom Logging

- Console logs en dev
- Structured logs en prod

---

## 🔄 Processes

### Pre-deployment Checklist

- [ ] Tests passent (npm run test)
- [ ] Build sans erreur (npm run build)
- [ ] Lint sans warning (npm run lint)
- [ ] Env variables configurées
- [ ] DB migrations appliquées
- [ ] Cache invalidé si nécessaire

### Post-deployment

- [ ] Smoke tests
- [ ] Monitoring alerts
- [ ] Performance checks
- [ ] User feedback

---

## 🆘 Rollback

```bash
# Vercel UI ou CLI
vercel rollback
```

---

## 📈 Scaling

- [ ] CDN global (Vercel Edge)
- [ ] Database replication
- [ ] Redis clustering
- [ ] Load balancing
