# Dossier Professionnel - Social Network

## Identité du candidat

- Nom de naissance : Lecart
- Nom d’usage : Lecart
- Prénom : Christophe
- Adresse : Rouen, France
- Titre professionnel visé : Concepteur Développeur d'Applications (RNCP 37873)
- Modalité d'accès : Parcours de formation - Zone01 Rouen Normandie
- Période : 2024 - 2025

## Présentation du dossier

Ce dossier professionnel présente le projet Social Network réalisé dans le cadre de la formation RNCP 37873 à Zone01 Rouen Normandie.
Il démontre mes compétences techniques, mes choix d’architecture et les preuves de réalisation en lien avec le référentiel du titre.

Le projet est une application web sociale moderne, sécurisée et collaborative, incluant :

- l’authentification,
- la gestion des utilisateurs,
- la publication de contenus,
- les interactions sociales,
- le chat en temps réel,
- les groupes,
- les événements,
- les notifications,
- la préparation au déploiement.

## Sommaire

1. Exemples de pratique professionnelle
   - Développer une application sécurisée
   - Concevoir et développer une application organisée en couches
   - Préparer le déploiement d’une application sécurisée
2. Titres, diplômes, attestations
3. Déclaration sur l’honneur
4. Documents illustrant la pratique professionnelle
5. Annexes

## Exemples de pratique professionnelle

### Activité-type 1 : Développer une application sécurisée

#### Exemple n°1 : Mise en œuvre de l’authentification et gestion des sessions

1. Décrivez les tâches ou opérations que vous avez effectuées, et dans quelles conditions :

Dans le projet Social Network, j’ai conçu et développé le système d’authentification utilisateur. J’ai créé les écrans de connexion et d’inscription, la validation côté serveur des formulaires, le hachage sécurisé des mots de passe et la génération des jetons d’authentification.

J’ai mis en place les routes API publiques et privées dans Next.js App Router et développé le middleware de vérification de JWT pour protéger les routes. Le flux de connexion inclut la vérification du mot de passe, la génération du token JWT et l’utilisation d’un cookie HTTP-only pour la session.

2. Précisez les moyens utilisés :

- Next.js App Router
- TypeScript
- Prisma / PostgreSQL
- `bcrypt` pour le hachage des mots de passe
- `jose` pour la création et la vérification des JWT
- Zod pour la validation des schémas de données
- Tailwind CSS pour l’interface
- GitHub pour le suivi des issues et PR
- Cloudinary pour le stockage des médias utilisateur

3. Avec qui avez-vous travaillé ?

- Équipe projet avec des développeurs de la formation
- Validation des spécifications avec le tuteur Zone01
- Relecture de code et échanges techniques via GitHub

4. Contexte

- Projet Social Network, formation RNCP 37873
- Objectif : sécuriser l’accès utilisateur et protéger les données personnelles
- Période d’exercice : 2024 - 2025

5. Informations complémentaires :

Cette réalisation m’a permis d’appliquer les bonnes pratiques de sécurité web : gestion sécurisée des mots de passe, validation d’entrée, stockage minimal des données sensibles et protection des routes serveur.

#### Exemple n°2 : Conception modulaire front/back et modélisation de la base de données

1. Décrivez les tâches ou opérations que vous avez effectuées, et dans quelles conditions :

J’ai structuré l’application en séparant les responsabilités entre le front-end, l’API serveur et la base de données. J’ai modélisé les entités principales du réseau social dans Prisma : utilisateur, publication, commentaire, réaction, groupe, événement, invitation et notification.

J’ai implémenté les pages et composants React, les hooks de récupération de données, ainsi que les routes API privées. J’ai également produit des diagrammes et des maquettes pour clarifier les parcours utilisateur et les enchaînements de fonctionnalités.

2. Précisez les moyens utilisés :

- Next.js App Router et React
- Prisma pour la modélisation et les migrations
- PostgreSQL
- `@tanstack/react-query` pour la gestion des requêtes côté client
- `@radix-ui` pour des composants accessibles
- Upstash Redis pour la synchronisation en temps réel
- Figma / maquettes et diagrammes

3. Avec qui avez-vous travaillé ?

- Collaboration avec l’équipe projet pour définir les lots fonctionnels
- Validation des maquettes et des parcours avec le formateur
- Revues techniques sur l’architecture applicative

4. Contexte

- Projet Social Network en formation
- Phase de développement des fonctionnalités sociales et collaboratives
- Objectif : construire une application maintenable, évolutive et agréable à utiliser

5. Informations complémentaires :

Ce travail a renforcé mes compétences en conception logicielle, en séparation des couches applicatives et en intégration d’un backend API robuste avec une base de données relationnelle.

#### Exemple n°3 : Préparer le déploiement d’une application sécurisée

1. Décrivez les tâches ou opérations que vous avez effectuées, et dans quelles conditions :

J’ai préparé le déploiement en créant un `Dockerfile` multi-stage pour l’application Next.js et en définissant une configuration Docker Compose pour les environnements de développement et de production.

J’ai configuré les services nécessaires au fonctionnement de l’application : `app`, `PostgreSQL` et `Redis`. J’ai défini les variables d’environnement, les volumes et les ports, puis j’ai validé le démarrage et la connectivité des services.

2. Précisez les moyens utilisés :

- Docker et Docker Compose
- PostgreSQL
- Upstash Redis
- Next.js et Prisma
- Variables d’environnement sécurisées
- Cloudinary pour l’hébergement des médias
- GitHub pour le versioning et la traçabilité

3. Avec qui avez-vous travaillé ?

- Échanges avec le tuteur de formation sur la stratégie de déploiement
- Coordination avec l’équipe projet pour vérifier les configurations
- Validation conjointe du pipeline local et des services associés

4. Contexte

- Projet de certification Social Network
- Phase de préparation à la mise en production
- Objectif : rendre l’application stable, sécurisée et reproductible

5. Informations complémentaires :

Cette activité m’a fait comprendre les aspects DevOps : build multi-stage, isolation des services, gestion de la configuration et préparation à une exploitation sécurisée.

## Titres, diplômes et attestations

- Titre visé : Concepteur Développeur d’Applications (RNCP 37873)
- Formation : Zone01 Rouen Normandie
- Projet : Social Network
- Attestations : formation Zone01, compétences en développement web full stack, sécurité et déploiement

## Déclaration sur l’honneur

Je soussigné Christophe Lecart, certifie que les éléments présentés dans ce dossier professionnel sont issus de ma pratique personnelle dans le cadre de ma formation RNCP 37873 et du projet Social Network.
Je déclare que les informations fournies sont exactes et reflètent ma contribution réelle au projet.

## Documents illustrant la pratique professionnelle

- Capture d’écran du login
- Capture d’écran du feed principal
- Capture d’écran du chat en temps réel
- Capture d’écran de la page de groupe
- Diagrammes UML et maquettes
- Issues GitHub et PRs de preuves
- Extraits de code : `src/middleware.ts`, `src/lib/jwt/signJwt.ts`, `src/lib/jwt/verifyJwt.ts`, `src/lib/security/hash.ts`, `src/app/api/private/chat/listen/route.ts`, `src/lib/server/websocket/redis.ts`

## Annexes

- `Dossier_Professionnel_Social_Network.docx`
- `Exemple_Dossier_Professionnel.pdf`
- `Exemple_Dossier_Projet.pdf`
- `Exemple_Presentation_certification.pdf`
- `PLAN_RNCP_COMPLET.md`
- `03-conception/README.md`
- `04-developpement/README.md`
- `05-deploiement/README.md`
- `06-bilan/README.md`
