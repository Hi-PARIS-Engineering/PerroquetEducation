# État des Lieux – Hi! Platform (POC)

**Date de mise à jour :** 19 Octobre 2026  
**Branche Git :** `parrot` (commit `20fc8f5` : *Hi! studio upgrade*)  
**Auteurs & Maintenance :** Équipe Hi! PARIS Engineering · Prince-Junior Moughiama  

---

## 1. Résumé Exécutif

Ce document dresse un état des lieux complet et actualisé du projet **Plateform-POC-main**.  
Depuis la précédente version du 3 Octobre 2026, des travaux majeurs de refonte UX/UI et d'architecture front-end ont été menés sur le module **Hi! Studio** (`/studio`), transformant l'outil d'édition de cours en un véritable environnement de travail professionnel inspiré du **ruban Microsoft Word / Office 365**, pleinement intégré à l'identité visuelle de **Hi! PARIS** (`#0B2F5E` bleu nuit et `#FF034D` rouge vif).

---

## 2. Architecture & Stack Technique

Le projet repose sur un monorepo moderne articulé autour des briques suivantes :

* **Frontend (`apps/web`)** :
  * **Framework** : Next.js 14 (App Router) en TypeScript strict.
  * **Styling** : Tailwind CSS v3 avec design tokens Hi! PARIS, support complet mode clair/sombre (`dark:bg-navy`, `dark:bg-navy-dark`).
  * **Icônes & UI** : Intégration de `lucide-react` complétant les icônes SVG natives, composant `dock.tsx`, utilitaires `.hover-halo` et `.tooltip`.
  * **Hébergement cible** : Vercel.
* **Backend (`apps/api`)** :
  * **Framework** : FastAPI (Python 3.12).
  * **ORM & Migrations** : SQLAlchemy 2.0 et Alembic.
  * **Hébergement cible** : Render.
* **Base de données & Stockage** :
  * **PostgreSQL 16** managé via **Supabase**.
  * **Supabase Storage** pour les pièces jointes, fichiers médias et soumissions d'appels à projets.
* **Services Tiers & IA** :
  * **Anthropic Claude API** (moteur de génération de contenus pédagogiques du Studio IA).
  * **OpenAI Whisper API** (transcription automatisée audio/vidéo).
  * **Resend** (distribution des emails transactionnels et codes OTP).
* **Package Partagé (`packages/shared`)** : Définition des types TypeScript partagés entre couches.
* **Environnement Local** : Configuration complète via `docker-compose.yml` (PostgreSQL, API, Web).

---

## 3. Évolutions Majeures : Refonte Complète de Hi! Studio

Le module **Hi! Studio** (`apps/web/app/(platform)/studio/page.tsx`) a fait l'objet d'une harmonisation graphique et fonctionnelle approfondie répondant aux exigences d'ergonomie bureautique moderne.

### 3.1. Remplacement de l'Ancien Dock par un Ruban Type Word
* **Conception claire & bureautique** : Abandon de la capsule sombre flottante au profit d'un ruban plat, clair (`bg-white/95 dark:bg-navy/95`), structuré et sans ombres portées encombrantes.
* **5 Onglets thématiques & Groupes labellisés** :
  1. **Accueil** :
     * *Structure* : Titre de section (`Alt+1`), Sous-titre H2 (`Alt+2`), Sous-titre H3 (`Alt+3`).
     * *Rédaction* : Texte Markdown (`Alt+T`), Citation (`Alt+M`).
     * *Pédagogie* : Encadré / Astuce (`Alt+N`), Ligne de séparation.
     * *Organisation & Presse-papiers* : Monter (`Alt+↑`), Descendre (`Alt+↓`), Dupliquer (`Ctrl+D`), et Supprimer (`Suppr`).
  2. **Insertion** :
     * *Code & Calculs* : Code interactif (`Alt+C`), Formule mathématique LaTeX (`Alt+F`), Tableau interactif, Dataset CSV / Pandas.
     * *Médias riches* : Vidéo YouTube (`Alt+V`), Illustration / Schéma (`Alt+I`), Enregistrement audio (`Alt+A`), Application embarquée.
  3. **Évaluation** :
     * *Quiz & Questions* : Question QCM (`Alt+Q`), Question Vrai / Faux.
     * *Pratique* : Exercice d'application, Mémo / Flashcard interactif.
  4. **Synthèse** :
     * *Ressources & Références* : Marque-page / Favori, Bibliothèque & Liens utiles, Document téléchargeable.
  5. **Affichage** :
     * *Vues & Métriques* : Bascule vers l'Aperçu Étudiant, compteur de blocs en temps réel et estimation du temps de lecture.
* **Boutons hiérarchisés** : Grands boutons (`RibbonLargeButton`, icône + libellé + raccourci) pour les actions majeures, et boutons empilés compacts (`RibbonSmallButton`) pour les actions secondaires.

### 3.2. Barre d'Accès Rapide & Commandes Intelligentes
* **Menu déroulant `[Fichier ▾]`** : Actions rapides pour Nouveau cours, Sauvegarder & Publier, Exporter en JSON, Importer un fichier JSON.
* **Palette de commandes universelle *"Que souhaitez-vous faire ?"*** : Champ de recherche accessible avec raccourci `Alt+Q`, permettant d'exécuter instantanément n'importe quelle action d'édition ou d'insertion de bloc sans chercher dans les onglets.
* **Réduction dynamique du ruban** : Chevron `▲ / ▼` (et raccourci double-clic sur l'onglet actif) permettant de replier le ruban à une seule ligne pour maximiser l'espace d'écriture.

### 3.3. Ergonomie au Défilement : Ruban Ancré (Sticky Dock)
* **Positionnement sticky** : Le ruban intègre la classe `sticky top-[150px] z-40`.
* **Ancrage sous la barre de navigation** : Lors du défilement, le ruban reste automatiquement fixé immédiatement sous le header principal de la plateforme (hauteur 150px), avec un effet de flou de verre dépoli (`backdrop-blur-md`) et une ombre discrète (`shadow-md`). Les outils d'insertion et de gestion de bloc restent accessibles à tout instant.

### 3.4. Élargissement du Canevas & Suppression du Cloisonnement
* **Élargissement pleine largeur (`w-full`)** : Suppression de la contrainte étroite `max-w-4xl` (896px) qui confinait le contenu au centre. Les blocs de cours s'étendent désormais sur toute la largeur du canevas (canevas global porté à `max-w-[1440px]`).
* **Design aéré "Sans bordure en plus"** :
  * Suppression des cadres superflus (`border border-gray-200 shadow-card`) sur la prévisualisation étudiante.
  * Allégement des bordures des blocs en mode édition : liseré très fin et discret (`border-gray-100 dark:border-white/5`) pour les blocs inactifs.
* **Mise en valeur du Bloc Actif** : Cliquer sur une carte la met en surbrillance avec un anneau bleu Hi! PARIS (`ring-2 ring-[#0B2F5E]`) et un badge *"Bloc actif"*.
* **Insertion contextuelle** : L'ajout d'un bloc depuis le ruban s'insère immédiatement sous le bloc actuellement sélectionné.
* **Protection du scroll (`scroll-mt-48`)** : Assure que le saut ou le focus sur un bloc ne soit jamais caché sous le ruban sticky.

### 3.5. Prise en Charge Exhaustive des 21 Types de Blocs Pédagogiques
Le studio prend en charge l'ensemble des 21 typologies de contenu avec édition et rendu direct :
1. Titre de section (`heading`)
2. Sous-titre H2 (`subheading`)
3. Sous-titre H3 (`h3`)
4. Paragraphe Markdown (`text`)
5. Citation d'expert (`quote`)
6. Encadré pédagogique (`callout`)
7. Séparateur horizontal (`divider`)
8. **Point d'histoire avec portrait (`history`)** : Accordéon déroulant interactif avec portrait/photo de profil restant toujours visible dans l'en-tête cliquable (`summary`), dates, citation et récit historique détaillé.
9. Bloc de code interactif (`code`)
10. Formule mathématique LaTeX (`math`)
11. Tableau de données interactif (`table`)
12. Dataset CSV / Dataframe (`dataset`)
13. Vidéo YouTube intégrée (`video`)
14. Illustration / Schéma graphique (`image`)
15. Enregistrement audio / Podcast (`audio`)
16. Application web embarquée (`embed`)
17. Question QCM interactive (`quiz`)
18. Question Vrai / Faux (`truefalse`)
19. Exercice avec indice et solution révélable (`exercise`)
20. Mémo / Flashcard réversible (`flashcard`) + Synthèse (`summary`) + Bibliothèque (`resources`).
21. **Fiche Auteur(s) & Équipe Enseignante (`author`)** : Intégrée directement dans le flux normal du cours (feed), fidèle aux classes HTML (`.bk-authors-list`, `.bk-author-infos`, avatar rond `.img-circle`, badge « Meet the Author », titre académique, lien « More About the Author ») avec disposition adaptative : **flanc droit** (se positionne en colonne latérale droite sticky `lg:w-80 lg:sticky lg:top-[220px]` sur grand écran), **flanc gauche** (colonne latérale gauche sticky), ou **dans le cours** (corps de lecture standard pleine largeur), avec empilement fluide naturel sur mobile sans déborder.

### 3.6. Quadrillage Multicolore de Test & Repérage de Placement (12 Colonnes & Zones A-B-C)
Pour faciliter les tests d'agencement visuel et vous permettre de m'indiquer avec une clarté absolue l'emplacement exact souhaité pour chaque bloc ou élément `<div>` :
* **12 Colonnes à couleurs distinctes (`C1` à `C12`)** :
  * `C1` : Rouge | `C2` : Orange | `C3` : Ambre *(Zone A)*
  * `C4` : Jaune | `C5` : Lime | `C6` : Émeraude | `C7` : Sarcelle | `C8` : Cyan | `C9` : Ciel *(Zone B)*
  * `C10` : Indigo | `C11` : Violet | `C12` : Rose *(Zone C)*
* **Découpage en 3 macro-zones de placement** :
  * **Zone A (Flanc Gauche)** : Colonnes `C1 à C3` (~320px).
  * **Zone B (Feed Central / Corps du cours)** : Colonnes `C4 à C9`.
  * **Zone C (Flanc Droit)** : Colonnes `C10 à C12` (~320px).
* **Badges de repérage et d'indexation sur chaque bloc** :
  * En mode **Édition** comme en mode **Aperçu Étudiant**, chaque bloc affiche un badge d'identification : `DIV #1`, `DIV #2`... avec son type et ses coordonnées exactes (ex : `ZONE B [C4 à C9]` ou `ZONE C [C10 à C12]`).
* **Triple contrôle d'accès** :
  * Bouton rapide `[📐 Quadrillage : ACTIF/INACTIF]` directement dans la barre d'accès rapide du Ruban sticky.
  * Groupe dédié **Repérage & Grille** dans l'onglet **Affichage** du Ruban.
  * **Inspecteur flottant** fixé en bas à droite (`fixed bottom-5 right-5 z-50`) permettant d'activer/désactiver la grille en un clic, de basculer entre les filtres (`Tout`, `12 Colonnes`, `Zones A-B-C`) et de consulter la légende des couleurs.
* **Non-bloquant & Interactif** : L'overlay en colonnes utilise `pointer-events-none` pour préserver 100 % de l'interactivité des boutons, quiz et champs de formulaire.

---

## 4. État des Modules Fonctionnels de la Plateforme

| Module | Fonctionnalités Clés | Statut |
|---|---|---|
| **Authentification & Droits** | Connexion sans mot de passe par code OTP par email, sessions JWT, gestion des 5 rôles (`public`, `student`, `teacher`, `admin`, `super_admin`), conformité RGPD (anonymisation, export). | ✅ Opérationnel |
| **LMS & Catalogue** | Navigation par cours, MOOCs à modules linéaires, progression apprenant, filtres par école et niveau, génération de certificats PDF avec QR code. | ✅ Opérationnel |
| **Hi! Studio (Créateur)** | Ruban Word clarifié, 21 types de blocs pédagogiques (dont Point d'histoire et Fiche Auteur intégrée au feed en flanc latéral sticky), bascule Édition / Aperçu Étudiant instantané, recherche de commandes `Alt+Q`, sauvegarde et publication API. | ✅ Opérationnel (V2 enrichie) |
| **Studio IA** | Génération de cours et quiz via Claude 3.5 + Whisper (fichiers audio/vidéo + slides PPTX, extraction Excel). | ✅ Opérationnel |
| **Cohortes & Suivi** | Groupes d'étudiants, affectation de parcours, tableau de bord analytique basé sur des métriques réelles. | ✅ Opérationnel |
| **Hi! Tube & Médias** | Lecteur vidéo enrichi avec commentaires synchronisés et chapitrage. | ✅ Opérationnel |
| **Catalogue d'Applications** | Présentation d'applications EdTech et Data connectées via GitHub API. | ✅ Opérationnel |
| **NeuriPP** | Plateforme d'appels à soumissions avec formulaire multi-champs et téléversement sécurisé de fichiers. | ✅ Opérationnel |
| **CMS Interne & Admin** | Gestion des pages institutionnelles, gestion des utilisateurs, audit log des actions sensibles. | ✅ Opérationnel |

---

## 5. Qualité du Code, Nettoyage & CI/CD

* **Rigueur TypeScript** : Validation `npx tsc --noEmit` passée avec succès (0 erreur).
* **Règles de linting ESLint** : Validation `npx eslint` validée (0 erreur, 0 avertissement).
* **Nettoyage des artefacts système** : Suppression des fichiers parasites `Zone.Identifier` issus des environnements Windows/WSL, mise à jour du `.gitignore`.
* **CI/CD GitHub Actions** :
  * Build et linting Next.js automatisés sur chaque push.
  * Exécution de la suite de tests backend `pytest`.
  * Déploiement continu vers Vercel (Frontend) et Render (Backend).

---

## 6. Dettes Techniques & Points de Vigilance

1. **Cold Start Backend (Render - Plan Gratuit/Starter)** :
   * Une période d'inactivité entraîne la mise en veille de l'API FastAPI, occasionnant un délai de réveil de 30 à 50 secondes sur la première requête.
   * *Recommandation* : Mise en place d'un ping régulier (cron / uptime monitoring) ou passage à une instance toujours active.
2. **Mise en pause BDD (Supabase - Plan Gratuit)** :
   * Risque de mise en pause automatique de l'instance PostgreSQL après 7 jours consécutifs sans requête.
   * *Recommandation* : Automatisation d'un keep-alive quotidien via GitHub Actions ou cronjob externe.
3. **Sauvegardes Automatiques de Base de Données** :
   * Absence actuelle d'un script automatisé de dump périodique (`pg_dump`) vers un stockage froid (S3 / GCP Cloud Storage).
4. **Navigation Mobile sur les Profils** :
   * Le menu latéral `WorkspaceSidebar` de l'espace « Mon profil » doit être adapté pour les terminaux mobiles de petite taille.

---

## 7. Prochaines Étapes de la Feuille de Route (Roadmap)

Conformément à la feuille de route du projet, les chantiers prioritaires à venir sont :

1. **Socle RAG & Base Vectorielle (Prérequis P2)** :
   * Ingestion des contenus de cours créés dans le Studio → découpage en chunks → embeddings vectoriels via `pgvector` sur PostgreSQL/Supabase.
   * Fourniture d'une API de recherche sémantique pour alimenter le futur tuteur IA et l'assistance aux étudiants.
2. **Broker LLM & Gouvernance des Coûts (Phase 8)** :
   * Passerelle interne pour contrôler les consommations d'API IA (plafonds de crédits par enseignant et par cohorte).
3. **Intégration JupyterLite (WASM)** :
   * Intégration de notebooks Python interactifs exécutés directement dans le navigateur côté client, sans nécessiter de serveur backend lourd.
4. **Authentification Mobile-Ready (Prérequis P3)** :
   * Adaptation des endpoints d'authentification pour fournir des tokens refresh/access en JSON compatibles avec un futur enrobage mobile (Capacitor).
5. **Signalement & Modération Étendue** :
   * Connexion finale de l'interface utilisateur pour le signalement de contenus vers l'API `/reports` déjà opérationnelle.
