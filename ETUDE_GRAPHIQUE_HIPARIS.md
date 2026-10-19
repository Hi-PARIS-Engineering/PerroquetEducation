# 🎨 Étude Graphique & UI/UX : Hi! PARIS

Ce document référence l'ensemble des choix graphiques, des couleurs, et des spécificités techniques utilisés sur le site vitrine officiel [hi-paris.fr](https://hi-paris.fr/). 

## 1. Stack Technique Design
- **CMS & Constructeur** : WordPress avec **Elementor** (et *Essential Addons for Elementor*).
- **Thème utilisé** : Thème **Engitech** (avec un thème enfant *Engitech-child* pour les surcharges personnalisées).
- **Système de personnalisation** : Kirki Customizer.

---

## 2. Palette de Couleurs (Charte Graphique)

L'identité du site repose sur un contraste fort entre un bleu institutionnel très sombre et un rose/rouge vif pour dynamiser le tout.

| Rôle | Couleur (HEX) | Aperçu visuel | Utilisation |
|---|---|---|---|
| **Couleur Primaire (Bleu Hi! PARIS)** | `#004676` | 🟦 Bleu Marine Profond | Barre supérieure du header (topbar), éléments de navigation par défaut, fonds d'événements, boutons primaires. |
| **Couleur Secondaire / Action** | `#FF034D` | 🟥 Rose/Rouge Vif | Au survol (hover) des liens, éléments de navigation actifs, fil d'Ariane, flèches, bouton "Retour en haut". |
| **Couleur de Texte** | `#303030` | ⬛ Gris Anthracite | Texte de base, paragraphes, descriptions. |
| **Couleur de Transition (Accent 2)** | `#FFBC7D` | 🟧 Orange Pâle | Utilisé pour certaines transitions de page (*page-transition*). |
| **Fonds & Bordures** | `#E0E0E0` | ⬜ Gris Clair | Séparateurs, fonds de sections légères. |
| **Succès / Accent 3** | `#61CE70` | 🟩 Vert clair | Définie dans les couleurs globales d'Elementor. |
| **Texte sur fond sombre** | `#FFFFFF` | ⬜ Blanc | Textes dans le footer, topbar, et menus déroulants sur fond sombre. |

---

## 3. Typographie

Le site mélange deux familles de polices, privilégiant la rondeur et la lisibilité :

*   **Police Principale (Titres & Textes) : `Nunito`** (sans-serif)
    *   Utilisée de manière agressive (parfois avec `!important` dans le thème enfant) pour presque tout : `body`, `p`, `button`, `input`, `h2`, `h3`, `h4`, `h5`, `h6`.
    *   Poids principal : `400` (Regular) pour les textes, poids variable pour les titres.
*   **Polices Secondaires (Héritage Elementor) : `Roboto` & `Roboto Slab`**
    *   Conservées dans le kit global Elementor pour des accents spécifiques ou des éléments secondaires (poids 400 à 600).

---

## 4. Agencement (Layout) & Grille

La structure de la page suit les standards modernes d'Elementor pour un affichage "Boxed" (contenu centré).

*   **Largeur maximale du conteneur (Desktop)** : `1140px`
*   **Tablette (Breakpoint <= 1024px)** : `1024px`
*   **Mobile (Breakpoint <= 767px)** : `767px`
*   **Espacement (Gutter / Widgets spacing)** : Par défaut `20px` entre les widgets Elementor (lignes et colonnes).

---

## 5. Spécificités des Composants (UI)

*   **Header (En-tête)** :
    *   **Topbar** : Bandeau tout en haut avec un fond `#004676` et du texte blanc `#ffffff`.
    *   **Navigation** : Les liens normaux sont bleus (`#004676`), et deviennent instantanément roses (`#FF034D`) au survol (`:hover`) et lorsqu'ils sont actifs (`current-menu-item`).
*   **Page Header (Bannière de titre de page)** :
    *   Utilise souvent une image de fond globale (`background-header-post-page-scaled.jpg`).
    *   **Fil d'Ariane (Breadcrumbs)** : Le séparateur (`:before`) prend la couleur rose (`#FF034D`), le texte est blanc.
*   **Footer (Pied de page)** :
    *   Liens en blanc (`#fff`) sur fond très sombre.
    *   Au survol (`:hover`), les liens passent en rose (`#FF034D`).
*   **Bouton "Retour en haut" (Back to top)** :
    *   Couleur d'icône rose (`#FF034D`).
*   **Composants tiers (Plugins)** :
    *   **Événements (The Events Calendar)** : Les étiquettes de date (`.ect-grid-date`) sont en bleu primaire, et le pied de carte de l'événement a un léger fond bleuté (`#00467603`). Les boutons "Load more" s'illuminent en rose au survol.
