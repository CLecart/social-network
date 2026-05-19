# Audit du dossier-certification — Social Network

**Candidat :** Christophe Lecart
**Titre visé :** RNCP 37873 — Concepteur Développeur d'Applications (CDA)
**Établissement :** Zone01 Rouen Normandie
**Auditeur :** revue technique externe (Damien)
**Date :** mai 2026

---

## Résumé exécutif

Le dossier écrit est **structurellement complet** (8 sections + plan détaillé + annexes solides : exemples PDF, wireframes, mockups, dossier professionnel template). Le candidat a une bonne contribution sur le repo (≈57 commits sous `Christophe Lecart` / `CLecart` / `clecart`, 2ᵉ contributeur de l'équipe).

**Mais trois problèmes bloquants doivent être corrigés avant la soutenance :**

1. **Le support visuel de soutenance n'existe pas** — c'est pourtant le livrable principal de l'épreuve (40 min de présentation diaporama sur 2h15).
2. **Plusieurs sections du dossier décrivent une stack qui n'est pas celle du code** (Socket.io, NextAuth, npm…). Le jury va comparer avec le repo et poser des questions.
3. **Plusieurs compétences du référentiel RNCP ne sont pas adressées explicitement** : pas de diagramme de cas d'utilisation, pas de diagramme de classes, pas de section sécurité/RGPD dédiée, pas de veille technique.

Sont détaillés ci-dessous :
- A. Le constat (ce qui est, ce qui manque)
- B. Les incohérences dossier ↔ code (priorité haute, à corriger)
- C. Les lacunes par rapport au référentiel RNCP 37873
- D. La qualité rédactionnelle (corrections ponctuelles)
- E. Le plan d'action proposé

---

## A. Constat

### Ce qui existe et est de bonne qualité

| Élément | Évaluation |
|---|---|
| Structure du dossier (00 → 07 + PLAN_RNCP_COMPLET) | Très claire, hiérarchie cohérente |
| Présentation candidat (`00-presentation`) | Complète, mais trop "CV" |
| Cahier des charges (`02`) | Fonctionnalités, user stories synthétiques, contraintes, timeline |
| Conception (`03`) | 18 modèles Prisma documentés, 43 user stories, MCD/MLD/MPD complets en DBML et SQL |
| Développement (`04`) | Architecture, schémas Mermaid, API spec, code samples |
| Déploiement (`05`) | Docker, Vercel, Neon, CI/CD documentés |
| Bilan (`06`) | RETEX honnête, accomplissements + limites |
| Annexes (`07`) | Exemples PDF (très utiles : `Exemple_Presentation_certification.pdf` = CodeQuarry), wireframes, mockups, dossier pro AFPA template, .env, diagrammes |
| Preuves GitHub | Liens directs vers issues #13, #24, #30, #37, #39, #40, #45, #46, #51, #66, #76, #111 + PR #118 |

### Ce qui manque

| Élément | Statut |
|---|---|
| **Support visuel de soutenance (diaporama)** | **ABSENT** — pourtant exigé par l'épreuve RNCP |
| Diagramme de cas d'utilisation (UML) | Absent — exigé par le bloc 2 du référentiel |
| Diagramme de classes (UML) | Absent — exigé par le bloc 2 du référentiel |
| Section sécurité / RGPD dédiée | Absent — pourtant les 3 blocs s'intitulent "application sécurisée" |
| Veille technique / recherche personnelle | Absent — attendu en CDA |
| Mapping explicite des 11 compétences → preuves | Présent dans `PLAN_RNCP_COMPLET.md` mais pas mis en avant dans les README de sections |
| Stratégie de tests complète | Un seul test d'intégration (auth/register), pas de tests unitaires front, pas de E2E |
| Éco-conception | Mentionnée dans le référentiel officiel, jamais abordée |
| Métriques réelles (Lighthouse, coverage) | Cibles annoncées mais aucun relevé |
| Dossier Professionnel rempli (`Dossier_Professionnel_Social_Network.docx`) | À vérifier — actuellement template |

---

## B. Incohérences dossier ↔ code (à corriger en priorité)

Le jury RNCP croisera systématiquement les affirmations du dossier avec le code du dépôt. Les écarts ci-dessous sont **factuellement faux** ou **trompeurs**.

### B.1 — Socket.io n'existe PAS dans le code (CRITIQUE)

**Affirmé dans le dossier :**
- `04-developpement/README.md` lignes 25-94 : schéma Mermaid avec "Socket.io Server"
- `04-developpement/README.md` lignes 259-282 : code sample `import { Server } from "socket.io"` + `@socket.io/redis-adapter`
- `04-developpement/README.md` lignes 120-130 : "Socket.io côté serveur utilise Redis adapter pour scalabilité multi-instance"
- `05-deploiement/README.md` ligne 87 : "diffusion des événements Socket.io entre instances"
- `06-bilan/README.md` ligne 41 : "Temps réel Socket.io documenté avec Redis adapter"
- `PLAN_RNCP_COMPLET.md` mention "Socket.io + Redis" plusieurs fois
- `01-introduction/README.md` ligne 27 : "Stack Technologique: ... Socket.io"
- `07-annexes/README.md` ligne 121 : `Socket[Socket.io]`

**Réalité du code :**
- Aucune dépendance `socket.io` ou `socket.io-client` dans `package.json`.
- `src/lib/server/websocket/redis.ts` utilise `@upstash/redis` (REST API, pas TCP).
- `src/app/api/private/chat/listen/route.ts` implémente du **Server-Sent Events (SSE)** via `ReadableStream` + polling Redis (`setInterval`-style). Voir lignes 22-49.
- Le dossier `lib/server/websocket/` est mal nommé : il n'y a pas de WebSocket.

**Conséquence :** si le jury demande "montrez-moi votre serveur Socket.io", il n'y en a pas. C'est très probable car c'est explicitement valorisé dans le dossier.

**Correction nécessaire :** réécrire toutes les mentions Socket.io en :
> "Temps réel via Server-Sent Events (SSE) + polling Upstash Redis"

Et corriger le schéma Mermaid en conséquence. Ce choix technique est tout à fait défendable (SSE est standard, suffisant pour le besoin, plus simple qu'un WebSocket persistant) — il faut juste le présenter pour ce qu'il est.

### B.2 — NextAuth n'est pas utilisé (IMPORTANT)

**Affirmé :**
- `PLAN_RNCP_COMPLET.md` ligne 221 : "Auth: NextAuth v5 / JWT"
- `04-developpement/README.md` ligne 503 : "NextAuth.js (optionnel)"
- `02-cahier-des-charges/README.md` : "Auth OAuth"

**Réalité :**
- Pas de dépendance `next-auth` dans `package.json`.
- Auth = JWT custom via `jose` + `jsonwebtoken` + `bcrypt`, vérifié dans `src/middleware.ts` (lignes 1-30) avec un `verifyJwt` maison.
- Le `Account` model Prisma est conçu pour le pattern NextAuth mais NextAuth lui-même n'est pas branché ; le sign-in Google passe par `googleapis` directement (voir `src/app/api/public/auth/callback/`).

**Correction :** retirer toutes les mentions NextAuth ou les présenter comme "modèle de données compatible NextAuth, implémentation custom JWT".

### B.3 — Routes API : préfixe et noms erronés (CRITIQUE)

**Affirmé dans `04-developpement/README.md` lignes 142-191 :**
- `POST /api/auth/login`
- `POST /api/auth/register`
- `POST /api/auth/logout`

**Réalité (constaté avec `ls src/app/api/public/auth/`) :**
- `/api/public/auth/login`
- `/api/public/auth/register`
- `/api/public/auth/logout`
- + `/api/public/auth/callback` et `/api/public/auth/redirect` pour OAuth Google

Le préfixe `/api/public/` est obligatoire car le middleware (`src/middleware.ts` ligne 9-10) protège tout ce qui ne commence pas par `/api/public/`.

**Correction :** mettre à jour `04-developpement/README.md`, `04-developpement/api-spec.md` et `__tests__/integrations/authentification.test.ts` (qui d'ailleurs utilise déjà le bon chemin dans son `import`).

### B.4 — Nom du cookie d'auth erroné (mineur mais visible)

**Affirmé `04-developpement/README.md` ligne 207 :** `const token = request.cookies.get("auth_token")?.value;`

**Réalité `src/middleware.ts` ligne 21 :** `const token = req.cookies.get("authToken")?.value;`

**Correction :** harmoniser sur `authToken` (camelCase) dans le dossier.

### B.5 — Middleware matcher différent

**Affirmé `04-developpement/README.md` ligne 217-219 :**
```ts
matcher: ["/api/private/:path*", "/(feed)/:path*"]
```

**Réalité `src/middleware.ts` :**
```ts
matcher: ['/((?!_next/static|_next/image|favicon.ico).*)']
```

Le code réel **protège tout par défaut** et exclut les routes publiques par logique applicative, ce qui est plus défensif. À refléter dans le dossier.

### B.6 — Package manager : Bun, pas npm (IMPORTANT)

**Affirmé `04-developpement/README.md` lignes 329-336 et `05-deploiement/README.md` lignes 144-159 :**
```yaml
- run: npm install
- run: npm run lint
- run: npm run test
- run: npm run build
```

**Réalité :**
- `bun.lock` à la racine (365 ko) — Bun est le package manager principal
- `Dockerfile` utilise `oven/bun:1` comme image de base, `bun install`, `bun run build`, `bun run start`
- Un `package-lock.json` existe aussi (350 ko) mais c'est un artefact secondaire

**Correction :** soit harmoniser sur Bun dans le CI (recommandé : c'est ce qui est utilisé en build), soit expliciter pourquoi le CI utilise npm alors que Docker utilise Bun. Une justification claire suffit ; un mensonge sera détecté.

### B.7 — Sentry mentionné comme acquis, en réalité absent

**Affirmé `04-developpement/README.md` ligne 449 :** "Monitoring: Sentry" dans la stack.

**Réalité :** pas de dépendance `@sentry/nextjs`. La section `05-deploiement/README.md` lignes 192-208 (que tu as ajoutée) le présente correctement comme "option recommandée" — c'est mieux. Mais l'autre fichier le contredit.

**Correction :** retirer Sentry de la "stack" (`04-developpement/README.md` ligne 449), ne le laisser que dans `05-deploiement` comme axe d'amélioration.

### B.8 — `04-developpement/README.md` contient deux versions concaténées (BUG ÉDITORIAL)

À partir de la ligne **423**, le fichier redémarre par un second `# 04 - Développement` et reprend tout depuis le début, avec une stack légèrement différente (mentionne React Query, Zustand/Jotai, Sentry — non utilisés dans le code).

**Correction :** supprimer purement et simplement les lignes 423 à 543. C'est probablement le résultat d'un copier-coller raté. À traiter en premier car ça décrédibilise tout le reste.

### B.9 — Réelle stack temps réel à présenter au jury

À mettre à jour partout (mermaid + texte) :

```
Browser  ──── fetch SSE (text/event-stream) ────►  Next.js API Route (/api/private/chat/listen)
                                                            │
                                                            │ polling
                                                            ▼
                                                     Upstash Redis (REST)
                                                            ▲
                                                            │ SET
Browser  ──── POST /api/private/chat/send ─────►  Next.js API Route
                                                            │ persist
                                                            ▼
                                                     PostgreSQL via Prisma
```

C'est défendable : SSE est une API web standard, suffisante pour push serveur → client, et compatible Vercel serverless. Le seul vrai compromis (à assumer devant le jury) est l'absence de pub/sub vrai → polling.

---

## C. Lacunes par rapport au référentiel RNCP 37873

### Rappel : déroulé de l'épreuve (source : `Atelier_Vivien_Notions_Certification.pdf`)

| Étape | Durée |
|---|---|
| Questionnaire professionnel | 0h30 |
| **Présentation d'un projet (diaporama)** | **0h40** |
| Entretien technique | 0h40 |
| Entretien final | 0h20 |
| **Total** | **2h10** |

### Les 11 compétences à couvrir explicitement

| # | Bloc | Compétence | Couverture dans le dossier actuel |
|---|---|---|---|
| 1 | B1 | Installer et configurer son environnement de travail | ⚠️ Implicite (Docker, .env). Peut être valorisé davantage. |
| 2 | B1 | Développer des composants métier (POO/API REST/refacto/tests/crypto) | ✅ API documentée, code samples |
| 3 | B1 | Développer des interfaces utilisateur (sécurisées, ergonomiques) | ✅ Pages documentées, design system, responsive |
| 4 | B1 | Contribuer à la gestion d'un projet informatique | ⚠️ Issues GitHub mentionnées, mais pas de chapitre méthodo (Agile ? Kanban ? Notion ?) |
| 5 | B2 | Analyser les besoins et maquetter une application | ✅ Wireframes + mockups en annexes, user stories |
| 6 | B2 | Définir l'architecture logicielle (multicouche + sécurité + UML) | ⚠️ Architecture OK, **manque diag cas d'utilisation + diag classes** |
| 7 | B2 | Concevoir et mettre en place une BDD relationnelle | ✅ MCD/MLD/MPD complets |
| 8 | B2 | Développer des composants d'accès aux données SQL/NoSQL | ✅ Prisma queries, mais aucune mention NoSQL (Redis ≠ NoSQL au sens BDD ; on peut le présenter comme cache key-value) |
| 9 | B3 | Préparer et exécuter les plans de tests | ❌ **Un seul test d'intégration**. À étoffer fortement. |
| 10 | B3 | Préparer et documenter le déploiement | ✅ Section 05 solide |
| 11 | B3 | Contribuer à la mise en production DevOps | ✅ CI/CD, Docker, Vercel |

### Ce qu'attend Zone01 / AFPA spécifiquement

Plan type du diaporama (constaté sur l'exemple CodeQuarry, 57 slides) :

1. Page de garde — Titre projet + Candidat + RNCP CDA
2. Introduction (présentation projet, remerciements)
3. Concevoir une application (analyse besoins + user stories) + slide user stories
4. Diagramme de cas d'utilisation
5. Diagramme de séquence (light, puis avec alt/async)
6. Collaborer à la gestion d'un projet (méthodo Agile, Notion, Git)
7. Maquetter une application (Figma, wireframes, prototypage)
8. Concevoir une BDD (Méthode Merise — MCD/MLD/MPD, dictionnaire)
9. Développer composants langage BDD (requêtes SQL)
10. Développer composants d'accès aux données (choix techno, sécu, requêtes préparées)
11. Front-end (organisation fichiers, composants, responsive)
12. Interface desktop (technos, composants, rendu)
13. Application mobile (adaptation responsive)
14. Architecture en couches (modularité)
15. Back-end (routes, TLS, sessions, sockets/SSE)
16. Composants métier (vote, modération, sécu)
17. Plans de tests (unitaires, doc)
18. Déploiement (Docker, CI/CD, VPS/Vercel)
19. Conclusion (bilan + améliorations)
20. QR codes (site + repo)

→ Le candidat doit pouvoir **parler 2 minutes sur chacun** de ces 20 thèmes.

### Sécurité / RGPD — section dédiée à créer

Le bloc 1 du RNCP s'intitule littéralement "Développer une application **sécurisée**". À ce stade, le dossier mentionne la sécurité de façon dispersée. À regrouper dans une nouvelle section ou sous-section avec :

- Authentification : JWT signé par `jose`, cookie HTTP-only, expiration, secret en env
- Mot de passe : `bcrypt` (à vérifier coût ≥ 10), validation Zod
- SQLi : prévenue par Prisma (queries paramétrées par défaut)
- XSS : React échappe le DOM par défaut ; vérifier les usages de `dangerouslySetInnerHTML` (à grep)
- CSRF : SameSite=Lax sur cookies (à vérifier)
- CORS : configuration Next.js
- Rate limiting : statut actuel, plan futur
- Validation : schémas Zod côté API
- HTTPS : forcé par Vercel
- RGPD : minimisation, droit d'accès (page settings), droit à l'oubli (suppression compte), consentement, mentions légales
- Logs : ce qui est loggé, ce qui ne l'est pas

---

## D. Qualité rédactionnelle — corrections ponctuelles

### Style

- Le candidat **alterne 1ʳᵉ personne du singulier et 3ᵉ personne** ("Christophe Lecart est en reconversion" puis "je vise une alternance"). Choisir **un seul registre** — recommandé : 1ʳᵉ personne, plus naturel à l'oral.
- `03-conception/user-stories.md` ligne 5 utilise "nous" (équipe). C'est cohérent là, mais à harmoniser avec les autres sections.
- Anglais/français mélangés ("As a", "I want to", "So that") dans les user stories — acceptable car format standard, à mentionner.

### Cohérence factuelle

- `00-presentation/README.md` ligne 22 : "Concepteur Développeur d'**Application**" → singulier, le titre officiel est "**d'Applications**" (pluriel).
- `01-introduction/README.md` ligne 27 : stack mentionne Socket.io (à corriger, voir B.1).
- `04-developpement/README.md` ligne 432 : "Next.js 14+" alors que le `package.json` indique `next ^15.5.15` → mettre 15.
- `04-developpement/README.md` ligne 32 : "Next.js (App Router)" → ✅ OK
- `06-bilan/README.md` : très bien. Garder.
- `02-cahier-des-charges/README.md` ligne 105-108 : métriques annoncées (99.5% uptime, < 2s, TTFB < 600ms, CLS < 0.1) → soit on **mesure** réellement, soit on retire (le jury demandera "comment vous le savez ?").

### Hyperliens et preuves

- Tous les liens GitHub pointent vers `arocchet/social-network` — c'est le repo d'**Adrien Roc**, pas de Christophe. À expliquer clairement dans le dossier : "Le repo central est celui d'un membre de l'équipe ; ma contribution personnelle est traçable via les commits signés `Christophe Lecart` / `CLecart` (57 commits, 2ᵉ contributeur)."
- Vérifier que `Dossier_Professionnel_Social_Network.docx` est **rempli** et pas seulement le template vierge.

### Section 00 — Présentation candidat

Trop "CV", trop sec. À enrichir avec :
- 1 paragraphe **pourquoi la reconversion** (déclic, frustration, projet de vie)
- 1 paragraphe **ce que Zone01 a apporté** (autonomie, projets, équipe)
- 1 paragraphe **vision du dev** (ce qui plaît, ce qui ne plaît pas, type d'entreprise visée)
- 1 paragraphe **alternance** : créneau visé, type de poste

C'est la base de la **« Présentation du candidat »** orale (5-10 min en début de soutenance).

---

## E. Plan d'action proposé

### Phase 1 — corrections critiques (≈ 1 jour de travail)

1. Supprimer le doublon `04-developpement/README.md` lignes 423-543.
2. Réécrire toutes les mentions Socket.io → SSE + Upstash Redis (5 endroits).
3. Corriger les routes API : `/api/auth/*` → `/api/public/auth/*`.
4. Corriger le nom du cookie (`auth_token` → `authToken`), le matcher du middleware, la version Next.js.
5. Retirer NextAuth, retirer Sentry de la stack acquise.
6. Harmoniser npm/bun.

### Phase 2 — création du support visuel (≈ 2-3 jours)

Construire le `.pptx` calqué sur le modèle CodeQuarry (≈ 40-50 slides) :
- Page de garde + sommaire mappé sur les 11 compétences
- 1 slide narratif par compétence + 1 slide preuve (capture / extrait code / diag)
- Slides UML manquants (cas d'utilisation, classes) à produire avec Mermaid/PlantUML/draw.io
- Slide bilan + slide QR codes

### Phase 3 — solidification du dossier (≈ 2 jours)

7. Créer la section **Sécurité / RGPD** dédiée.
8. Créer/intégrer **diagramme de cas d'utilisation** et **diagramme de classes**.
9. Ajouter une section **Veille technique / recherche personnelle**.
10. Tableau **mapping 11 compétences → preuves** visible dès le sommaire.
11. Étoffer la **stratégie de tests** (au moins un plan, même si l'implémentation reste partielle).
12. Enrichir `00-presentation` (récit de reconversion).
13. Vérifier / remplir le `Dossier_Professionnel_Social_Network.docx`.

### Phase 4 — répétition orale (≈ 2 jours)

- Présentation à blanc devant un proche / un dev senior
- Chronométrage des 40 min de soutenance
- Anticipation des questions probables :
  - "Pourquoi SSE et pas WebSocket ?"
  - "Comment vous gérez la scalabilité du polling ?"
  - "Qu'est-ce que VOUS avez fait dans cette équipe ?"
  - "Quels sont les risques de sécurité que vous avez identifiés ?"
  - "Comment fonctionne JWT exactement ?"
  - "Pourquoi Prisma plutôt que Drizzle ou TypeORM ?"

---

## F. Récapitulatif des priorités

| Priorité | Action | Section concernée |
|---|---|---|
| 🔴 Bloquant | Créer le support visuel diaporama | (nouveau) |
| 🔴 Bloquant | Supprimer le doublon `04-developpement/README.md` l.423-543 | 04 |
| 🔴 Bloquant | Corriger Socket.io → SSE partout | 01, 04, 05, 06, 07, PLAN |
| 🔴 Bloquant | Corriger routes API et cookie auth | 04, api-spec |
| 🔴 Bloquant | Diagramme de cas d'utilisation + de classes | 03 |
| 🟠 Important | Section Sécurité / RGPD dédiée | (nouveau ou 04) |
| 🟠 Important | Retirer NextAuth, Sentry, harmoniser package manager | 04, 05 |
| 🟠 Important | Mapping 11 compétences → preuves visible | 00 ou README racine |
| 🟠 Important | Étoffer la stratégie de tests | 04, 06 |
| 🟠 Important | Clarifier la contribution personnelle de Christophe | 00, 02 |
| 🟡 Bonus | Section Veille technique / recherche perso | (nouveau) |
| 🟡 Bonus | Éco-conception | (mention courte dans 06) |
| 🟡 Bonus | Métriques Lighthouse réelles | 06 |
| 🟡 Bonus | Enrichir le récit de reconversion (00) | 00 |
| 🟡 Bonus | Vérifier le Dossier Professionnel docx | 07 |

---

## G. Forces du dossier — à conserver

- Le découpage en 8 sections est lisible et standard.
- Le mapping issues GitHub → fonctionnalités est une bonne idée et facilite la défense.
- Le MCD/MLD/MPD est complet et exploitable en l'état pour le diaporama.
- Le bilan (`06-bilan`) est honnête, équilibré entre accomplissements et limites — c'est rare et apprécié par les jurys.
- Les wireframes / mockups en annexes sont déjà présents → réutilisables tels quels dans le diaporama.
- L'exemple CodeQuarry en annexe est un guide précieux pour la mise en forme.

---

**Conclusion :** le dossier est sur de **bonnes bases**, mais il faut absolument (1) créer le diaporama, (2) corriger les incohérences avec le code réel, (3) compléter les compétences RNCP non couvertes. Avec 5-7 jours de travail ciblé, ce dossier peut passer en certification.

