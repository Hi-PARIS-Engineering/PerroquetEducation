# Audit d'Accessibilité (WCAG 2.2) & Modes Inclusifs

Cet audit est basé sur les normes **WCAG 2.2** du W3C et appliqué à l'architecture de la plateforme pédagogique (Next.js, Tailwind CSS, composants React). Il définit les axes d'amélioration techniques et propose la création de "Modes d'accessibilité" pour couvrir un large spectre de handicaps.

---

## 1. Audit d'Accessibilité (Basé sur les 4 piliers des WCAG 2.2)

### A. Rendre le contenu "Perceptible" (Handicaps visuels et auditifs)
- **Contrastes des couleurs (Nouvelles recommandations)** : 
  - La charte utilise des couleurs très fortes comme le rose (`#FF034D`) et le `navy` (`#0B1D3A`). Le ratio de contraste des textes ou des icônes sur ces fonds doit être d'au moins **4.5:1** (ou 3:1 pour les gros textes).
  - **Textes superposés aux images** (ex: cartes "Insights") : un dégradé ou une couche d'opacité (overlay) doit garantir la lisibilité du texte, même si l'image en arrière-plan est très claire.
- **Médias (Hi! Tube)** : Les vidéos doivent systématiquement offrir des sous-titres fermés (Captions) et une transcription textuelle (bénéfique pour les personnes sourdes, malentendantes, ou aveugles utilisant un lecteur d'écran).
- **Images et icônes (Alt/ARIA)** : Les icônes (ex: 🔬, 📖) et les images décoratives des cartes de cours doivent être masquées pour les lecteurs d'écran via l'attribut `aria-hidden="true"`. Les images porteuses d'information doivent posséder une balise `alt` descriptive.

### B. Rendre l'interface "Utilisable" (Handicaps moteurs et physiques)
- **Navigation au clavier et Focus (Critère renforcé)** : 
  - L'interface doit exploiter les états de focus. Utiliser des classes Tailwind telles que `focus-visible:ring-2 focus-visible:ring-primary` sur tous les liens (`<Link>`), boutons et champs de saisie pour orienter les utilisateurs naviguant avec la touche `Tab`.
  - **Focus Non Masqué (Nouveauté WCAG 2.2)** : La barre de navigation flottante (Sticky Header) ne doit pas cacher l'élément qui reçoit le focus clavier lors du défilement de la page.
- **Cibles de clic (Target Size - Nouveauté WCAG 2.2)** : Tous les boutons interactifs (fermeture de modale, icônes de réseaux sociaux) doivent mesurer au minimum **24x24 pixels** pour faciliter l'interaction des personnes souffrant de troubles moteurs ou de tremblements.
- **Lien d'évitement (Skip Link)** : Ajouter un lien invisible en haut de page, qui n'apparaît que lors du premier focus clavier : *"Aller directement au contenu principal"*, pour éviter de parcourir tout le menu à chaque chargement de page.

### C. Rendre l'interface "Compréhensible" (Handicaps cognitifs et d'apprentissage)
- **Structure et Titraille** : L'arborescence des titres (`<h1>`, puis `<h2>`, `<h3>`) doit s'enchaîner logiquement, particulièrement dans les sections textuelles comme *Hi! Course* ou *Insights*.
- **Prévention des erreurs** : Dans les formulaires, utiliser des instructions claires. **(Nouveauté WCAG 2.2 - Redundant Entry)** : Si une information a déjà été saisie par l'utilisateur, le système ne doit pas lui demander de la saisir à nouveau.

### D. Rendre la plateforme "Robuste" (Compatibilité technologique)
- **Sémantique React et ARIA** : Les composants interactifs complexes (Menus déroulants, Modales, Sliders) doivent utiliser les attributs ARIA adéquats (`aria-expanded`, `aria-controls`, `role="dialog"`). L'utilisation des balises HTML doit être stricte : un `<button>` pour une action sur la page, une balise `<a>` pour une navigation vers une autre URL.

---

## 2. Modes d'Accessibilité (Panneau Inclusif)

Pour répondre aux différents besoins de manière ciblée sans altérer le design par défaut, il est recommandé de mettre en place un **Panneau d'Accessibilité** (accessible via un bouton global) permettant d'activer les modes suivants (gérés via React Context et LocalStorage) :

### 👁️ Mode Contraste Élevé (High Contrast)
* **Cible** : Malvoyance, cataracte, daltonisme.
* **Effet** : 
  - Remplace les nuances subtiles par des noirs profonds et des blancs purs.
  - Ajoute des bordures épaisses autour des éléments interactifs pour bien délimiter les blocs.

### 🧠 Mode Dyslexie (Dyslexia Friendly)
* **Cible** : Troubles "Dys" (Dyslexie, dysorthographie).
* **Effet** :
  - Remplace la police actuelle par une typographie spécifique (ex: OpenDyslexic, Comic Sans MS).
  - Augmente l'espacement entre les lettres (tracking) et l'interligne (line-height).
  - Force l'alignement du texte à gauche (supprime toute justification de texte).

### 🎯 Mode Lecture / Concentration (Read Mode)
* **Cible** : TDAH, autisme, difficultés de concentration.
* **Effet** :
  - Masque les éléments périphériques : barres latérales, pied de page, suggestions.
  - Centre le texte principal sur une colonne plus étroite pour faciliter la lecture.
  - Adoucit la couleur de fond (teinte sépia/crème) pour réduire la fatigue visuelle.

### 🎬 Mode Réduction des Animations (Reduced Motion)
* **Cible** : Troubles vestibulaires, épilepsie, nausées visuelles.
* **Effet** :
  - Désactive les transitions de pages, le défilement fluide (smooth scroll) et les effets d'animation au survol (scale, translations).
  - *(Supporte la préférence système `prefers-reduced-motion`)*.

### 🔊 Mode Synthèse Vocale (Text-to-Speech)
* **Cible** : Cécité, malvoyance sévère, difficultés de lecture, analphabétisme.
* **Effet** :
  - Utilise l'API `SpeechSynthesis` du navigateur pour lire le texte à voix haute.
  - Met en surbrillance les mots au fur et à mesure de leur prononciation.

### ⌨️ Mode Navigation Clavier Renforcée
* **Cible** : Handicaps moteurs (impossibilité d'utiliser une souris).
* **Effet** :
  - Affiche un indicateur de focus surdimensionné et très contrasté (ex: contour jaune fluo).
  - Active des raccourcis clavier globaux pour faciliter la navigation rapide entre les sections.
