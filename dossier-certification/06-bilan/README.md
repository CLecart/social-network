# 06 - Bilan

## Objectif

Présenter le retour d'expérience sur le projet, les acquis techniques, les limites constatées et les pistes d'évolution réalistes dans une logique de certification.

---

## 📊 Retour d'Expérience

### Défis Techniques

1. **Auth middleware et sécurité des routes**
   - Gérer les cookies HTTP-only côté serveur sans exposer de jetons au client.
   - Synchroniser middleware, sessions Redis et validations route handlers.

2. **Temps réel sans WebSocket persistant (SSE + Upstash Redis)**
   - Le choix Vercel serverless + Upstash REST a écarté Socket.io. Il a fallu construire un mécanisme push compatible serverless : endpoints `/api/private/chat/listen` (Server-Sent Events) qui pollent Upstash Redis sur des clés `latest:chat:*`.
   - Garantir la persistance Prisma avant la mise à jour de la clé Redis pour éviter les pertes ou les messages incohérents.
   - Gérer proprement la fermeture du flux SSE côté client (`request.signal.addEventListener("abort", ...)`) pour ne pas laisser de polling orphelin côté serveur.

3. **Modélisation Prisma**
   - Conserver une base cohérente malgré les nombreuses relations et contraintes d'unicité.
   - Documenter proprement les cascades et les dépendances entre entités.

### Défis d'Organisation

- Structurer un dossier de certification lisible pour un jury non technique et technique.
- Distinguer ce qui doit être démontré par la documentation de ce qui doit rester dans le code.
- Répartir le travail entre conception, développement, déploiement et bilan sans perdre le fil narratif.

---

## ✅ Accomplissements

### Résultats Obtenus

- **18 modèles Prisma** documentés.
- **20+ endpoints API** décrits avec payloads et réponses.
- **12+ pages principales** couvertes dans la conception.
- **43 user stories** organisées par rôle et priorité.
- **Temps réel via Server-Sent Events + Upstash Redis** documenté de bout en bout (endpoint `chat/listen`, clé Redis, ack côté API).
- **Architecture complète** du projet formalisée pour revue jury.

### Points Forts

- Architecture cohérente entre frontend, API, base de données et temps réel.
- Séparation claire entre documentation de conception et documentation d'implémentation.
- Choix techniques pragmatiques: Next.js, Prisma, PostgreSQL, Redis, Cloudinary.
- Dossier orienté preuve: sections reliées à des fichiers réels du dépôt.
- Rendu final lisible pour un jury, avec un niveau de détail adapté à une soutenance.

### Points à Améliorer

- Compléter les mesures de performance réelles avec des relevés Lighthouse.
- Ajouter une couverture de tests plus large sur les routes sensibles.
- Formaliser davantage la supervision de production et les alertes.
- Implémenter les **droits RGPD** manquants : suppression de compte (droit à l'oubli) et export des données (droit à la portabilité) — voir l'audit complet dans [04-developpement/securite-rgpd.md](../04-developpement/securite-rgpd.md).
- Corriger la vulnérabilité **XSS résiduelle** dans `ChatMessage.tsx` (sanitization du markdown via `DOMPurify` ou `react-markdown`).
- Ajouter **rate limiting** sur les endpoints sensibles (`/login`, `/register`, `/chat/send`) via `@upstash/ratelimit`.
- Ajouter les **headers HTTP de sécurité** (CSP, X-Frame-Options, Referrer-Policy) dans `next.config.ts`.

---

## 💡 Apprentissages

### Compétences Techniques

- Next.js App Router et logique server-side.
- TypeScript pour sécuriser les contrats de données.
- Prisma pour un modèle relationnel riche.
- PostgreSQL et gestion des relations complexes.
- Redis pour sessions, cache et pub/sub.
- Server-Sent Events + Upstash Redis pour le push temps réel sans WebSocket persistant.
- Docker et déploiement d'une stack full-stack.

### Compétences Transversales

- Structuration d'un dossier technique long.
- Justification de choix d'architecture.
- Rédaction orientée jury et preuve d'exécution.
- Capacité à documenter sans surcharger.

---

## 🚀 Améliorations Futures

### Court Terme

- Finaliser des tests d'intégration plus représentatifs.
- Mesurer les performances réelles de la home, du feed et du chat.
- Ajouter une page de monitoring minimaliste pour les erreurs critiques.

### Moyen Terme

- Ajouter des notifications push natives.
- Renforcer la modération et les signalements.
- Introduire des recommandations de contenu plus fines.

### Long Terme

- Séparer certains domaines en services indépendants si la charge augmente.
- Ajouter de l'analyse d'usage et des métriques produit.
- Préparer une version mobile dédiée si le besoin utilisateur le justifie.

---

## 📈 Métriques du Projet

| Indicateur               | Valeur                 |
| ------------------------ | ---------------------- |
| Modèles de données       | 18                     |
| Endpoints API documentés | 20+                    |
| Pages principales        | 12+                    |
| User stories             | 43                     |
| Événements temps réel    | 4 familles principales |
| Variables CSS thème      | 200+                   |

Ces métriques servent à montrer que le projet est suffisamment complet pour mon examen de certification.

---

## 🎓 Conclusion

Ce projet m'a permis de concevoir et documenter une application full-stack réaliste, avec des choix techniques justifiés et une architecture exploitable en production.

Pour le jury, l'essentiel est démontré: besoin métier compris, conception structurée, implémentation cohérente, capacité à aller jusqu'au déploiement, et recul sur les limites du projet.
