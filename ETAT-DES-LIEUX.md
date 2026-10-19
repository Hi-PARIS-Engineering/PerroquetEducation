# État des Lieux – Hi! Platform (POC)

Ce document dresse un état des lieux complet du projet **Plateform-POC-main** au 3 Octobre 2026.

## 1. Architecture & Stack Technique
Le projet adopte une architecture en monorepo standard et moderne :
* **Frontend (`apps/web`)** : Application Next.js 14 (App Router), TypeScript, Tailwind CSS. Déploiement prévu via Vercel.
* **Backend (`apps/api`)** : API REST développée en FastAPI (Python 3.12), SQLAlchemy 2.0 (ORM) et Alembic pour les migrations de base de données.
* **Base de données** : PostgreSQL 16 (hébergé sur Supabase), avec Supabase Storage pour le stockage des fichiers uploadés (ex: soumissions).
* **Services Tiers & IA** : Anthropic Claude API (pour le Studio IA), OpenAI Whisper API (transcription vidéo/audio), et Resend (pour l'envoi des emails).
* **Package partagé (`packages/shared`)** : Définition des types TypeScript transverses.
* **Docker** : Présence d'un `docker-compose.yml` complet pour instancier l'environnement local (PostgreSQL, API, Web).

## 2. Fonctionnalités Implémentées (V1 & V1.5 Terminées)
La plateforme a atteint une très bonne maturité fonctionnelle :
* **Authentification & RGPD** : Connexion par code OTP (email) et JWT. Intégration native des droits RGPD (export, suppression, anonymisation).
* **Gestion des Droits (RBAC)** : 5 niveaux de privilèges (`public` < `student` < `teacher` < `admin` < `super_admin`) incluant une logique de délégation de gestion hiérarchique.
* **LMS (Learning Management System)** : 
  * Création et gestion de cours, MOOCs linéaires, quiz et vidéos. 
  * Niveaux d'accès granulaires pour le contenu (`public`, `hiparis`, `cohort`). 
  * Génération automatique de certificats PDF avec QR Code.
* **Cohortes** : Création de groupes d'étudiants, attribution ciblée de cours, et suivi analytique sur de vraies données (fin de la dépendance aux données de test).
* **Studio IA** : Fonctionnalités avancées de génération pédagogique :
  * Création de quiz via un fichier Excel.
  * Création de cours complets à partir de MP4+PPTX (Whisper + Claude).
  * Génération dynamique de flashcards, cartes mentales, et FAQs à partir du texte.
* **CMS Interne** : Système de gestion de contenu éditable, avec logique de brouillon/publication directement intégrée dans l'interface admin.
* **NeuriPP** : Appels à soumissions EdTech avec formulaire et upload sécurisé de pièces jointes.
* **Modération & Sécurité** : Audit log (historique des actions sensibles) et traitement des signalements.

## 3. État de la Codebase
* **Nettoyage effectué** : La codebase est désormais propre. Les scripts de peuplement (seed) de démonstration, les fichiers de mock frontend, la documentation obsolète et les anciens livrables massifs ont été retirés. Les migrations Alembic ont été adaptées pour garantir la stabilité de la base.
* **Tests et Qualité** : Présence de tests backend (pytest) avec une bonne couverture (auth, RGPD, analytics) et de tests end-to-end frontend via Playwright.
* **CI/CD** : Workflows GitHub Actions configurés pour vérifier les builds frontend, jouer les tests backend et déployer sur Vercel.

## 4. Dettes Techniques & Points de Vigilance
* **Infrastructure** : 
  * **Render (Backend)** : Risque de "Cold Start" entrainant une latence (30-50s) à la première requête après une période d'inactivité.
  * **Supabase (Base de données)** : En mode gratuit, la base risque de se mettre en pause après une semaine sans trafic. Un mécanisme de "keep-alive" (ping régulier de la BDD) doit être envisagé.
* **Sécurité des données** : Bien que la persistance soit gérée par Supabase, il manque un dump (`pg_dump`) automatisé des données de production pour se prémunir contre des erreurs de manipulation lors des migrations destructives.
* **Navigation UI (Mobile)** : La navigation mobile sur l'espace privé "Mon profil" nécessite un correctif (le menu latéral `WorkspaceSidebar` est masqué sur petit écran).

## 5. Prochaines Étapes (Roadmap V2)
D'après la Roadmap et les fichiers de planification, voici les prochains chantiers :
1. **Application Mobile** : Étude de l'enrobage de l'export statique du frontend via Capacitor. Cela demandera de valider le système d'authentification et l'impact sur le SSR de Next.js.
2. **JupyterLite** : Intégration de notebooks Python fonctionnant de manière isolée directement dans le navigateur (WASM), idéale pour les travaux pratiques Data/IA.
3. **Administration Globale** : Gestion dynamique par le `super_admin` des domaines d'emails autorisés et de la liste des écoles partenaires (Lot 6).
4. **Finalisation UX** : Branchement de l'interface utilisateur pour le signalement de contenus (le backend `/reports` étant déjà prêt).
5. **Interopérabilité** : À plus long terme, la connexion SSO / SAML (ex: Renater) et la compatibilité Moodle/SCORM.
