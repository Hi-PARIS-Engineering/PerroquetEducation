# Compte-rendu de la Plateforme & Audit d'Accessibilité Numérique

## 1. État des lieux de la plateforme (POC)
La plateforme pédagogique mutualisée "Hi! PARIS" est une application web moderne construite avec **Next.js**, **React**, et **Tailwind CSS**. Elle sert de portail unifié pour divers types de contenus éducatifs :
- **Insights** : Articles interactifs et actualités de la recherche.
- **Hi! Tube** : Vidéothèque pédagogique.
- **Hi! Course** : Cours interactifs et documents (PDF, Excel).
- **Hi! MOOC** : Parcours structurés.
- **Hi! App** : Applications interactives (Streamlit/Gradio).

L'interface gère nativement l'internationalisation (i18n) et propose un système de thème dynamique (Clair / Sombre / Système) basé sur la charte graphique de Hi! PARIS (notamment le rose secondaire `#FF034D` et des bleus marins profonds). L'expérience utilisateur (UX) privilégie les composants de type "cartes", des effets de survol texturés par des images et une navigation fluide.

---

## 2. Zones à adapter pour l'Accessibilité Numérique (RGAA / WCAG)

Afin de rendre cette plateforme inclusive et conforme aux standards d'accessibilité légaux, plusieurs zones et composants nécessitent une passe d'adaptation technique et sémantique :

### A. Textes alternatifs (Attributs Alt & ARIA)
- **Cartes du Tableau de bord (Dashboard)** : Les images de fond ajoutées récemment (`fondamentaux.jpg`, `insigh.webp`, etc.) utilisent actuellement `alt=""`. Si elles sont purement décoratives, il faut leur ajouter explicitement l'attribut `aria-hidden="true"`.
- **Émojis et Icônes visuelles** : Les icônes textuelles (ex: 🔬, 📖, ⚡) utilisées dans les "Highlight Banners" et les accès rapides sont lues littéralement par les lecteurs d'écran (qui liront "Microscope" ou "Éclair"). Il faut les envelopper dans un `<span aria-hidden="true">` pour éviter qu'elles polluent la lecture vocale.

### B. Contrastes et Couleurs
- **Textes sur images** : Bien que des dégradés sombres aient été ajoutés (`bg-gradient-to-t from-black/80`), les textes blancs superposés aux images avec mix-blend doivent être audités pour garantir un ratio de contraste minimal de **4.5:1** sur l'ensemble des résolutions.
- **Textes secondaires (Gris)** : Les classes Tailwind comme `text-gray-400` et `text-gray-500` (très utilisées dans le *Footer* et les descriptions des cartes) doivent être testées contre leurs fonds respectifs (blanc en Light mode, `bg-navy` en Dark mode) pour garantir leur parfaite lisibilité.

### C. Navigation au clavier et Gestion du Focus
- **États de Focus (`focus-visible`)** : Actuellement, l'UI repose beaucoup sur des interactions à la souris (effets `group-hover`). Il est indispensable de définir des styles visibles pour les utilisateurs naviguant avec la touche `Tab` du clavier (ex: `focus-visible:ring-2 focus-visible:outline-none`) sur tous les `<Link>`, boutons et champs de formulaires de l'application.
- **Lien d'évitement** : Ajouter un lien caché (qui apparaît au focus clavier) tout en haut de la page ("Aller au contenu principal") pour permettre aux utilisateurs de sauter le bloc de navigation `Nav`.
- **Menus déroulants (Dropdowns)** : Le sélecteur de thème, le bouton de profil et les menus de navigation de l'en-tête doivent pouvoir s'ouvrir avec la touche `Espace` ou `Entrée`, et pouvoir être parcourus via les flèches directionnelles du clavier.

### D. Sémantique HTML et ARIA
- **Boutons vs Liens** : S'assurer que les éléments interactifs ne déclenchant pas de changement d'URL (comme l'icône de bascule Clair/Sombre) utilisent strictement la balise `<button>` et possèdent un `aria-label="Basculer le thème"`.
- **Formulaires** : Les barres de recherche éventuelles ou les champs de l'éditeur d'Insights (WYSIWYG) doivent avoir des balises `<label>` (même masquées visuellement via la classe `.sr-only`) associées via un identifiant `id`.
- **Balises de régions (Landmarks)** : Bien valider l'utilisation continue et logique des balises `<header>`, `<main>`, `<nav>` et `<footer>` pour structurer le document pour les lecteurs d'écran.

### E. Contenu Multimédia
- **Lecteur Vidéo (Hi! Tube)** : À l'avenir, le lecteur vidéo devra offrir le support des sous-titres fermés (`.vtt`) et éventuellement une transcription textuelle complète située sous la vidéo.
- **Support PDF (Hi! Course)** : Veiller à ce que les cours PDF distribués soient exportés en format "PDF Tagué" (PDF/UA) pour que leur contenu soit structuré et lisible par les aides techniques externes.

---

## 3. Plan d'Action Recommandé
1. **Quick Wins (Rapide à implémenter)** :
   - Ajouter globalement un état de focus harmonisé dans `tailwind.config.ts` ou via un plugin.
   - Ajouter les `aria-label` manquants sur les composants de navigation clés.
   - Désactiver la lecture des émojis décoratifs par les lecteurs d'écran.
2. **Audit Automatisé** :
   - Utiliser des outils de développement comme "Lighthouse" (Chrome) ou l'extension "Axe DevTools" sur les pages principales (Accueil, Dashboard, Insights) pour valider mathématiquement les ratios de contraste.
3. **Passe Fonctionnelle Clavier** :
   - Faire le test de débrancher la souris et de naviguer de la page d'accueil jusqu'à la lecture d'un article "Insight" uniquement avec le clavier.
