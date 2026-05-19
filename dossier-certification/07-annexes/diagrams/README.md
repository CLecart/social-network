# Diagrammes UML — Assets pour soutenance

Ce dossier contient les 5 diagrammes UML du projet sous forme de **sources Mermaid** (`.mmd`) + un **outil de rendu local** (`rendu-diagrammes.html`).

## Contenu

| Fichier | Contenu | Destination |
|---|---|---|
| `classes-simplifie.mmd` | Diagramme de classes — 7 entités cœur | **Slide de soutenance** |
| `classes-complet.mmd` | Diagramme de classes — 18 entités Prisma + relations | Dossier écrit + annexe |
| `enums.mmd` | Les 6 enums du modèle | Référence technique |
| `use-case-complet.mmd` | Diagramme de cas d'utilisation — 5 acteurs, 60+ cas | Dossier écrit + annexe |
| `use-case-simplifie.mmd` | Diagramme de cas d'utilisation — vue d'ensemble | **Slide de soutenance** |
| `rendu-diagrammes.html` | Page HTML qui rend les 5 diagrammes via Mermaid CDN | Outil de visualisation / export |

## Comment visualiser et exporter

### Option A — Le plus simple : ouvrir `rendu-diagrammes.html`

1. Double-clic sur `rendu-diagrammes.html`
2. La page s'ouvre dans ton navigateur par défaut (Chrome, Edge, Firefox, Safari…)
3. Les 5 diagrammes se rendent automatiquement
4. Pour chaque diagramme, tu peux cliquer sur :
   - **⬇️ Télécharger en SVG** → fichier vectoriel (idéal pour pptx, scalable sans perte)
   - **⬇️ Télécharger en PNG (2× HD)** → image bitmap haute résolution (compatible partout)
   - **📋 Copier le source Mermaid** → pour le coller ailleurs
   - **↗️ Ouvrir mermaid.live** → éditeur en ligne (utile pour ajuster avant export)

> ⚠️ La page utilise le CDN `cdn.jsdelivr.net` pour charger Mermaid. Connexion internet requise.

### Option B — mermaid.live (manuel)

1. Va sur [https://mermaid.live](https://mermaid.live)
2. Ouvre un `.mmd` au choix, copie son contenu
3. Colle-le dans l'éditeur
4. Bouton « Actions » en haut à droite → « PNG » ou « SVG »

### Option C — VSCode

1. Installe l'extension « Markdown Preview Mermaid Support »
2. Ouvre `../../03-conception/diagrammes-uml.md`
3. Aperçu (Ctrl+Shift+V) → rendu intégré

## Intégration dans le pptx de soutenance

Pour la slide RNCP — **versions simplifiées recommandées** :

- Slide « Concevoir une base de données » → `classes-simplifie.png`
- Slide « Diagramme de cas d'utilisation » → `use-case-simplifie.png`

Les versions **complètes** restent dans le dossier écrit pour montrer l'exhaustivité, mais sont peu lisibles projetées. Si le jury demande à voir la version complète, ouvre l'annexe ou affiche `rendu-diagrammes.html` en partage d'écran.

## Source de vérité

Les fichiers `.mmd` de ce dossier sont identiques aux blocs Mermaid de [`../../03-conception/diagrammes-uml.md`](../../03-conception/diagrammes-uml.md). Le mapping :

- `classes-simplifie.mmd` ↔ section 4.1
- `classes-complet.mmd` ↔ section 4.2
- `enums.mmd` ↔ section 4.3
- `use-case-complet.mmd` ↔ section 5.2
- `use-case-simplifie.mmd` ↔ section 5.3

En cas de modification, éditer **diagrammes-uml.md** d'abord (source canonique) puis régénérer les `.mmd` ici si besoin.

## Pourquoi pas de PNG dans le repo dès maintenant ?

Le rendu propre des diagrammes Mermaid nécessite un moteur de rendu type Chromium / Puppeteer / mermaid-cli. Pour garder le repo léger et éviter les binaires Chrome dans le sandbox, on fournit ici les sources `.mmd` + l'outil de rendu HTML local. Tu génères les PNG une fois et tu les copies à côté avec un nom du type `classes-simplifie.png`, etc.
