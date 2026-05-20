# Contribution personnelle de Christophe Lecart

## Pourquoi ce document

Le projet Social Network est **réalisé en équipe** (6 contributeurs) sur le repo [`arocchet/social-network`]([arocchet/social-network](https://github.com/arocchet/social-network)). Le repo central appartient à un membre de l'équipe (Adrien Roc, alias `arocchet`), pas au candidat.

Pour anticiper la question légitime du jury — **« qu'est-ce que VOUS avez fait dans cette équipe ? »** — ce document détaille la contribution personnelle de Christophe Lecart par domaine, avec hashs de commits vérifiables sur le dépôt.

---

## Vue d'ensemble

**57 commits** sous les identités `Christophe Lecart` (6) + `CLecart` (10) + `clecart` (41), ce qui fait de Christophe le **2ᵉ contributeur** sur 6.

Sortie de `git shortlog -sn` :

```
    68  Gabriel K
    57  Christophe Lecart (cumul des 3 identités git)
    48  Adrien roc (cumul)
    45  Pierre Caboor (cumul)
    28  Zanakan12 (cumul)
     3  Raftandjani
```

**Sources de vérité (commandes à reproduire devant le jury) :**

```bash
# Tous les commits Christophe
git log --author="lecart\|Lecart\|clecart\|CLecart" --pretty=format:"%h|%ad|%s" --date=short

# Statistiques globales équipe
git shortlog -sn
```

---

## Contribution par domaine

### 1⃣ Système de réactions universel (posts, stories, commentaires)

**Périmètre :** fonctionnalité métier complète. Conception du modèle, schémas Zod, queries Prisma, composants UI, intégration temps réel, contraintes d'unicité côté DB.

**Commits clés (ordre chronologique) :**

| Hash | Date | Message |
|---|---|---|
| `158d8ee` | 2025-07-08 |  feat: Universal likes system implementation - Part 1 |
| `b140030` | 2025-07-08 | add likesCaches.ts |
| `bd56f13` | 2025-07-09 | Reactions tracking par contentId/storyId/commentId dans useEffect |
| `98ba457` | 2025-07-10 | Remplacement likeCache par useState reactions + isLiked + likesCount |
| `ac9e7f8` | 2025-07-15 | like story, post, comment part 2 |
| `2356107` | 2025-07-21 | feat: add frontend reaction components and schemas (part 1) |
| `1553b17` | 2025-07-22 | feat: reactions et reaction counts pour comments dans getPostById query |
| `e28ff5a` | 2025-07-23 | feat: improve reaction menu positioning and code structure |
| `0ca9588` | 2025-07-23 | fix: implement real-time reaction counts for posts, stories, and comments |
| `f0371ae` | 2025-07-28 | feat: show reactions popup only on thumb hover for comments |
| `931065b` | 2025-07-28 | UX reactions popup hover |

**Compétences RNCP couvertes :**

- **C3 — Développer des composants métier** : logique complète d'un cas d'utilisation (réagir / retirer / compter / restreindre)
- **C7 — BDD relationnelle** : conception du modèle `Reaction` avec 3 contraintes d'unicité composite (`@@unique([userId, postId])`, `(userId, storyId)`, `(userId, commentId)`)
- **C8 — Composants d'accès aux données** : queries Prisma optimisées pour récupérer les reactions avec leurs counts

**À montrer en soutenance :** la table `Reaction` dans `prisma/schema.prisma` + un commit comme `158d8ee` qui pose les bases du système, puis `0ca9588` qui ajoute le temps réel.

---

### 2⃣ Design system et thème (palette, dark mode, layout)

**Périmètre :** mise en place de l'identité visuelle du projet — palette dark, theme provider, cohérence des composants.

**Commits clés :**

| Hash | Date | Message |
|---|---|---|
| `14f9b4a` | 2025-05-26 | theme provider added |
| `5399254` | 2025-05-26 | select colors palette added |
| `f3ba6c2` | 2025-05-27 | theme color login page |
| `9f83b23` | 2025-05-27 | better format code |
| `9c3110b` | 2025-06-03 | refine layout with theme colors and borders |
| `5218ef9` | 2025-06-27 | feat: add dark mode toggle to GIF picker |

**Compétences RNCP couvertes :**

- **C2 — Développer des interfaces utilisateur** : design system, cohérence visuelle, accessibilité par thème (clair/sombre)

**À montrer en soutenance :** la palette CSS dans `globals.css` (variables `--blue40`, `--bgLevel1` à `--bgLevel5`, etc.) + le switch dark/light en démo.

---

### 3⃣ Création de posts (dialog responsive, médias multiples)

**Périmètre :** composant dialog pour créer un post avec gif / photo / vidéo / emojis, prévisualisation médias, upload Cloudinary.

**Commits clés :**

| Hash | Date | Message |
|---|---|---|
| `ef58dc6` | 2025-06-05 | link createPost |
| `e8807ba` | 2025-06-05 | createPost gif photos videos smiles part 1 |
| `0533643` | 2025-06-05 | createPost apiKey .env part 2 |
| `1599ff1` | 2025-06-05 | createPost apiKey .env part 3 |
| `ce0c26a` | 2025-06-06 | feat(post): Implement style create post dialog with responsive media previews |
| `f7e9fb9` | 2025-06-18 | add GIF, AVIF format picture, realtime refech posts and stories |

**Compétences RNCP couvertes :**

- **C2 — Développer des interfaces utilisateur** : composant interactif responsive
- **C3 — Développer des composants métier** : flux d'upload média multi-types
- **Sécurité** : intégration `.env` (API key Cloudinary jamais committée)

---

### 4⃣ Stories (timer, background dominant, likes)

**Commits clés :**

| Hash | Date | Message |
|---|---|---|
| `313d1d8` | 2025-06-02 | feat: auto-detect background color and resize image for stories |
| `cc5e56a` | 2025-06-03 | fix: resolve story timer skipping issues with dominant color background |
| `14c3c33` | 2025-07-07 |  feat: Implement story likes system and remove GIF from post creation |
| `7ede4dd` | 2025-06-24 | create api endpoint for reaction stories |

**Compétences couvertes :** C2 + C3.

---

### 5⃣ Chat (bulles, emoji picker, layout)

**Commits clés :**

| Hash | Date | Message |
|---|---|---|
| `8c18881` | 2025-06-11 | fix(chat): emoji picker integration and adaptive message bubbles |
| `eb3434f` | 2025-06-11 | feat(chat): rotate chat bubble tail 65° for style message appearance |
| `d803363` | 2025-06-12 | fix messages display / api/post added |

**Compétences couvertes :** C2 + C3.

---

### 6⃣ Recherche stylée avec filtres

**Commits clés :**

| Hash | Date | Message |
|---|---|---|
| `03d4237` | 2025-06-10 | feat(search): implement style search page with filtering |

**Compétences couvertes :** C2.

---

### 7⃣ Commentaires (rework UX)

**Commits clés :**

| Hash | Date | Message |
|---|---|---|
| `3a399b2` | 2025-06-03 | rework comments part 1 |
| `bcae240` | 2025-06-03 | rework comment part 3 |
| `1553b17` | 2025-07-22 | reactions et counts dans getPostById (part 2 du système réactions) |

**Compétences couvertes :** C2 + C3.

---

### 8⃣ Profil et navigation

**Commits clés :**

| Hash | Date | Message |
|---|---|---|
| `c998eb5` | 2025-06-04 | reorganize profile page structure |
| `1b07caa` | 2025-06-17 | Add mobile navbar avatar and fix TS errors |
| `5baa12e` | 2025-06-06 | link settings icon laptop and mobile |

**Compétences couvertes :** C2.

---

### 9⃣ Sécurité et authentification (fix cookie JWT)

**Commits clés :**

| Hash | Date | Message |
|---|---|---|
| `f582882` | 2025-06-12 | fix(api): post authentication via cookie JWT and userId verification |

**Compétences couvertes :** C3 (cryptographie) + transverse sécurité.

---

### DevOps et stabilisation (Prisma, dépendances)

**Commits clés :**

| Hash | Date | Message |
|---|---|---|
| `7f8b206` | 2025-07-28 | pull db prisma |
| `c3748ea` | 2026-04-15 | fix: resolve dependency conflicts and update packages for compatibility |
| `06fe9e5` | 2026-05-04 | docs(conception): aligner UML sur prisma schema |

**Compétences couvertes :** C1 + C11.

---

### 1⃣1⃣ Dossier de certification (intégralité)

**Le dossier `dossier-certification/` est réalisé à 100 % par Christophe.** C'est lui qui a posé la structure, rédigé toutes les sections, créé les diagrammes UML, et organisé les preuves GitHub.

**Commits clés :**

| Hash | Date | Message |
|---|---|---|
| `537b482` | 2026-05-04 | docs: initialiser structure dossier de certification |
| `59f743a` | 2026-05-04 | docs(conception): ajouter pages, user stories et modélisation données |
| `877c81b` | 2026-05-04 | docs(developpement): ajouter architecture, spec API et code samples |
| `60dc01b` | 2026-05-04 | docs(certification): finaliser déploiement bilan et annexes |
| `62898bc` | 2026-05-04 | docs(certification): polir le dossier pour la soutenance |
| `7cd4aa3` | 2026-05-18 | certification |
| `0e4066d` | 2026-05-18 | certification pdf |

**Compétences couvertes :** transverses C4 (gestion de projet — formalisation, documentation, traçabilité) + C10 (documenter le déploiement).

---

## Synthèse — couverture personnelle des 11 compétences

| # | Bloc | Compétence | Contribution Christophe |
|---|---|---|---|
| 1 | B1 | Installer / configurer l'environnement |  Contribution équipe, j'ai participé aux migrations Prisma + résolution conflits deps |
| 2 | B1 | Développer des interfaces utilisateur |  **Forte** : design system, theme, créations de posts, chat, profil, recherche, commentaires |
| 3 | B1 | Développer des composants métier |  **Très forte** : système de réactions universel (cœur métier) + posts + stories |
| 4 | B1 | Contribuer à la gestion d'un projet |  **Forte** : organisation du dossier de certification, structuration du suivi |
| 5 | B2 | Analyser les besoins et maquetter |  Forte (rédaction user stories + relecture maquettes) |
| 6 | B2 | Définir l'architecture |  Contribution équipe sur l'archi, **forte** sur la rédaction (UML, diagrammes radial) |
| 7 | B2 | Concevoir une BDD relationnelle |  **Forte** : conception du modèle Reaction avec contraintes uniques, alignement Prisma↔dossier |
| 8 | B2 | Composants d'accès aux données |  **Forte** : queries Prisma pour reactions/posts/stories |
| 9 | B3 | Plans de tests |  Partiel équipe |
| 10 | B3 | Préparer/documenter le déploiement |  **Forte** : intégralité de la section 05-deploiement du dossier |
| 11 | B3 | Mise en production DevOps |  Contribution équipe, **forte** sur la documentation du flow |

**Lecture honnête :** Christophe a une **contribution forte sur 7 des 11 compétences**, et une contribution équipe sur les 4 autres (qu'il peut néanmoins expliquer car il en a rédigé la documentation).

---

## Phrase d'ancrage pour la soutenance

> « Le projet est porté par une équipe de 6 personnes. Je suis le 2ᵉ contributeur avec 57 commits, principalement sur le système de réactions universel (posts/stories/commentaires), la création de posts multi-médias, le design system, et l'intégralité de ce dossier de certification que vous lisez. Je peux pointer sur GitHub n'importe quel commit ou fichier dont je parle. »

---

## Liens directs vérifiables

- Repo : [arocchet/social-network]([arocchet/social-network](https://github.com/arocchet/social-network))
- Liste des commits Christophe :
  ```
  git log --author="Christophe Lecart" --pretty=format:"%h %s"
  git log --author="CLecart" --pretty=format:"%h %s"
  git log --author="clecart" --pretty=format:"%h %s"
  ```
- Statistiques équipe : `git shortlog -sn`
- Système de réactions (commit pivot) : [`158d8ee`](https://github.com/arocchet/social-network/commit/158d8ee)
- Refacto Prisma : [`06fe9e5`](https://github.com/arocchet/social-network/commit/06fe9e5)
- Fix JWT cookie auth : [`f582882`](https://github.com/arocchet/social-network/commit/f582882)
