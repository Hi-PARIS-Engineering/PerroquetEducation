/* eslint-disable @next/next/no-img-element */
/**
 * @file (platform)/studio/page.tsx
 * @description Hi! Studio — Espace enseignant & créateur de contenus pédagogiques.
 *
 * Catalogue étendu de 19 blocs pédagogiques disponibles pour les cours interactifs :
 *   - Structure & Contenu : Titre, Texte/Markdown, Encadré (Callout), Citation, Séparateur.
 *   - Code, Maths & Données : Code interactif (Python, SQL, R), Formule LaTeX, Tableau, Dataset téléchargeable.
 *   - Médias & Web : Vidéo YouTube, Schéma/Illustration, Capsule Audio, Intégration Iframe/Outil.
 *   - Évaluation & Pratique : Quiz QCM, Question Vrai/Faux, Exercice avec indice & solution, Carte mémoire (Flashcard).
 *   - Synthèse : Points clés récapitulatifs, Bibliographie & Ressources complémentaires.
 */

"use client";

import { useState, useEffect, useMemo, useRef, useCallback } from "react";
import Link from "next/link";
import { coursesApi } from "@/lib/api";
import type { CourseResponse } from "@/lib/api";
import {
  Heading as IconHeading,
  FileText as IconFileText,
  Lightbulb as IconLightbulb,
  Quote as IconQuote,
  Minus as IconMinus,
  Code2 as IconCode2,
  Sigma as IconSigma,
  Table as IconTable,
  Database as IconDatabase,
  Play as IconPlay,
  Image as ImageIcon,
  Mic as IconMic,
  ExternalLink as IconExternalLink,
  HelpCircle as IconHelpCircle,
  CheckCheck as IconCheckCheck,
  CheckSquare as IconCheckSquare,
  Sparkles as LucideSparkles,
  Star as IconStar,
  Library as IconLibrary,
  Search,
  ChevronUp,
  ChevronDown,
  ArrowUp,
  ArrowDown,
  Copy,
  Trash2,
  Save,
  Undo,
  Redo,
  Eye,
  Edit3,
  FileDown,
  FileUp,
  Printer,
  ListTree,
  Plus,
  X as IconX,
  History as IconHistory,
  UserCheck as IconAuthor,
  Users as IconUsers,
  ChevronRight,
  LayoutGrid,
  Square,
  SquareDashed,
  AlertTriangle,
  Info,
  BookOpen,
  Check,
  KeyRound,
  RotateCw,
  AlertCircle,
  Mail,
  Bold as IconBold,
  Italic as IconItalic,
  Underline as IconUnderline,
  Type as IconType,
  Highlighter as IconHighlighter,
  Sliders as IconSliders,
  Wand2 as IconWand,
  RefreshCw as IconRefreshCw,
  Layers as IconLayers,
  CheckCircle2 as IconCheckCircle2,
  AlignLeft as IconAlignLeft,
  type LucideIcon,
} from "lucide-react";

// ─── Types & constantes ───────────────────────────────────────────────────────

type Mode = "course" | "mooc" | "video" | "app" | "ai";

const SCHOOLS = ["Polytechnique", "Télécom Paris", "ENSAE", "HEC", "Hi! PARIS"];
const CATEGORIES = ["IA & Data", "Mathématiques", "Finance", "Programmation", "Statistiques", "DevOps"];
const LEVELS = ["Débutant", "Intermédiaire", "Avancé"];
const LEVEL_MAP: Record<string, string> = {
  Débutant: "beginner",
  Intermédiaire: "intermediate",
  Avancé: "advanced",
};

// ─── Typographie & Polices de texte ──────────────────────────────────────────

type FontFamilyKey = "sans" | "serif" | "mono" | "rounded" | "accessible";

const FONT_FAMILIES: {
  key: FontFamilyKey;
  label: string;
  cssClass: string;
  fontStyle: string;
}[] = [
  { key: "sans", label: "Sans-Serif (Inter)", cssClass: "font-sans", fontStyle: "Inter, -apple-system, BlinkMacSystemFont, sans-serif" },
  { key: "serif", label: "Serif (Classique)", cssClass: "font-serif", fontStyle: "Georgia, Cambria, 'Times New Roman', serif" },
  { key: "mono", label: "Monospace (Code)", cssClass: "font-mono", fontStyle: "'Fira Code', 'JetBrains Mono', Consolas, monospace" },
  { key: "rounded", label: "Arrondie (Pédagogique)", cssClass: "font-sans tracking-wide", fontStyle: "'Outfit', 'Quicksand', 'Nunito', sans-serif" },
  { key: "accessible", label: "Accessible (Lisible)", cssClass: "font-sans tracking-wider", fontStyle: "'Atkinson Hyperlegible', Verdana, Tahoma, sans-serif" },
];

const FONT_SIZES = [12, 13, 14, 15, 16, 18, 20, 22, 24, 28];

/**
 * Moteur de rendu inline rapide et sécurisé pour le formatage riche :
 * **gras**, *italique*, <u>souligné</u>, `code`, <mark>surligné</mark>, ==surligné==
 */
function renderFormattedText(text: string): React.ReactNode {
  if (!text) return null;

  const lines = text.split("\n");
  return lines.map((line, lIdx) => {
    const regex = /(\*\*[^*]+\*\*|\*[^*]+\*|<u>.*?<\/u>|`[^`]+`|<mark>.*?<\/mark>|==[^=]+==)/g;
    const parts: React.ReactNode[] = [];
    let lastIndex = 0;
    let match: RegExpExecArray | null;

    while ((match = regex.exec(line)) !== null) {
      if (match.index > lastIndex) {
        parts.push(line.slice(lastIndex, match.index));
      }

      const token = match[0];
      const key = `${lIdx}-${match.index}`;

      if (token.startsWith("**") && token.endsWith("**")) {
        parts.push(<strong key={key} className="font-bold text-gray-900 dark:text-white">{token.slice(2, -2)}</strong>);
      } else if (token.startsWith("*") && token.endsWith("*")) {
        parts.push(<em key={key} className="italic text-gray-800 dark:text-gray-200">{token.slice(1, -1)}</em>);
      } else if (token.startsWith("<u>") && token.endsWith("</u>")) {
        parts.push(<span key={key} className="underline decoration-[#FF034D] decoration-2 underline-offset-2">{token.slice(3, -4)}</span>);
      } else if (token.startsWith("`") && token.endsWith("`")) {
        parts.push(<code key={key} className="px-1.5 py-0.5 rounded bg-gray-100 dark:bg-white/10 font-mono text-[12px] text-primary dark:text-blue-300">{token.slice(1, -1)}</code>);
      } else if ((token.startsWith("<mark>") && token.endsWith("</mark>")) || (token.startsWith("==") && token.endsWith("=="))) {
        const inner = token.startsWith("<mark>") ? token.slice(6, -7) : token.slice(2, -2);
        parts.push(<mark key={key} className="bg-amber-200 dark:bg-amber-900/60 text-gray-900 dark:text-white px-1 py-0.5 rounded font-medium">{inner}</mark>);
      }

      lastIndex = regex.lastIndex;
    }

    if (lastIndex < line.length) {
      parts.push(line.slice(lastIndex));
    }

    return (
      <span key={lIdx}>
        {parts}
        {lIdx < lines.length - 1 && <br />}
      </span>
    );
  });
}

/**
 * Convertit une chaîne formatée (markdown / tokens) en HTML riche sécurisé pour l'éditeur Word WYSIWYG
 */
function formattedTextToHtml(text: string): string {
  if (!text) return "";
  let html = text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");

  html = html
    .replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>")
    .replace(/\*([^*]+)\*/g, "<em>$1</em>")
    .replace(/&lt;u&gt;(.*?)&lt;\/u&gt;/gi, "<u>$1</u>")
    .replace(/`([^`]+)`/g, "<code>$1</code>")
    .replace(/==([^=]+)==/g, "<mark>$1</mark>")
    .replace(/\n/g, "<br>");

  return html;
}

/**
 * Normalise et convertit le HTML produit par contentEditable en format texte structuré (Markdown standard)
 */
function htmlToFormattedText(html: string): string {
  if (!html) return "";
  if (typeof window === "undefined") return html;

  const temp = document.createElement("div");
  temp.innerHTML = html;

  function walk(node: Node): string {
    if (node.nodeType === Node.TEXT_NODE) {
      return node.textContent || "";
    }
    if (node.nodeType === Node.ELEMENT_NODE) {
      const el = node as HTMLElement;
      const tag = el.tagName.toLowerCase();
      const inner = Array.from(el.childNodes).map(walk).join("");

      if (tag === "b" || tag === "strong") return `**${inner}**`;
      if (tag === "i" || tag === "em") return `*${inner}*`;
      if (tag === "u") return `<u>${inner}</u>`;
      if (tag === "code") return `\`${inner}\``;
      if (tag === "mark") return `==${inner}==`;
      if (tag === "br") return "\n";
      if (tag === "div" || tag === "p") return inner ? `\n${inner}` : "\n";
      if (el.style.fontWeight === "bold" || Number(el.style.fontWeight) >= 700) return `**${inner}**`;
      if (el.style.fontStyle === "italic") return `*${inner}*`;
      if (el.style.textDecoration && el.style.textDecoration.includes("underline")) return `<u>${inner}</u>`;
      if (el.style.backgroundColor && el.style.backgroundColor !== "transparent") return `==${inner}==`;

      return inner;
    }
    return "";
  }

  const res = Array.from(temp.childNodes).map(walk).join("");
  return res.replace(/\n{3,}/g, "\n\n").trim();
}

/**
 * Composant d'édition de texte in-situ de type Microsoft Word
 * Garantit l'absence de saut de curseur, la synchronisation temps réel et le support des raccourcis.
 */
function WordEditableText({
  value,
  onChange,
  onFocus,
  onContextMenu,
  className = "",
  as: Tag = "div",
  blockId,
  isWordMode = true,
  placeholder = "Cliquez pour taper...",
}: {
  value: string;
  onChange: (val: string) => void;
  onFocus?: () => void;
  onContextMenu?: (e: React.MouseEvent) => void;
  className?: string;
  as?: any;
  blockId?: number;
  isWordMode?: boolean;
  placeholder?: string;
}) {
  const ref = useRef<HTMLElement>(null);
  const isEditingRef = useRef(false);

  useEffect(() => {
    if (ref.current && !isEditingRef.current) {
      const html = formattedTextToHtml(value);
      if (ref.current.innerHTML !== html) {
        ref.current.innerHTML = html;
      }
    }
  }, [value]);

  return (
    <Tag
      ref={ref}
      contentEditable={isWordMode}
      suppressContentEditableWarning
      data-block-id={blockId}
      onFocus={() => {
        isEditingRef.current = true;
        onFocus?.();
      }}
      onBlur={() => {
        isEditingRef.current = false;
        if (ref.current) {
          const newVal = htmlToFormattedText(ref.current.innerHTML);
          onChange(newVal);
        }
      }}
      onInput={() => {
        if (ref.current) {
          const newVal = htmlToFormattedText(ref.current.innerHTML);
          onChange(newVal);
        }
      }}
      onContextMenu={onContextMenu}
      className={`outline-none transition-all ${
        isWordMode
          ? "hover:ring-1 hover:ring-primary/30 focus:ring-2 focus:ring-primary/50 focus:bg-primary/[0.02] rounded px-1 -mx-1 cursor-text"
          : ""
      } ${className}`}
      data-placeholder={placeholder}
    />
  );
}

/**
 * Extraction intelligente d'ID YouTube à partir d'un ID brut ou d'une URL complète.
 */
function extractYoutubeId(input: string): string {
  if (!input) return "";
  const trimmed = input.trim();
  if (/^[a-zA-Z0-9_-]{11}$/.test(trimmed)) return trimmed;
  const match = trimmed.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|v\/|shorts\/))([\w-]{11})/);
  return match ? match[1] : trimmed;
}

// ─── Icônes SVG ───────────────────────────────────────────────────────────────

function IconBook({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
    </svg>
  );
}

function IconGraduation({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14zm-4 6v-7.5" />
    </svg>
  );
}

function IconVideo({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
    </svg>
  );
}

function IconApp({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
    </svg>
  );
}

function IconSparkles({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.286L13 21l-2.286-6.857L5 12l5.714-2.286L13 3z" />
    </svg>
  );
}

const MODE_TABS: { key: Mode; label: string; icon: React.ReactNode; desc: string; badge?: string }[] = [
  { key: "course", label: "Cours interactif", icon: <IconBook />, desc: "Composez un cours structuré par blocs (texte, code, vidéo, quiz, maths...)" },
  { key: "mooc", label: "Parcours MOOC", icon: <IconGraduation />, desc: "Agencez une séquence ordonnée de cours en un parcours certifiant" },
  { key: "video", label: "Capsule Vidéo", icon: <IconVideo />, desc: "Enrichissez Hi! Tube avec une vidéo YouTube et ses métadonnées" },
  { key: "app", label: "Application Web", icon: <IconApp />, desc: "Intégrez une app interactive externe (Streamlit, Gradio, Observable)" },
  { key: "ai", label: "Génération IA", icon: <IconSparkles />, desc: "Générez automatiquement des cours et quiz depuis vos fichiers", badge: "Assistant IA" },
];

// ─── Classes CSS harmonisées ──────────────────────────────────────────────────

const INP = "w-full bg-white dark:bg-navy-dark border border-gray-200 dark:border-white/10 rounded-xl px-3.5 py-2.5 text-sm text-gray-900 dark:text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all";
const SEL = "w-full bg-white dark:bg-navy-dark border border-gray-200 dark:border-white/10 rounded-xl px-3.5 py-2.5 text-sm text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all";
const TXA = `${INP} resize-none`;

function Field({ label, children, hint }: { label: string; children: React.ReactNode; hint?: string }) {
  return (
    <div>
      <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-1.5">
        {label}
      </label>
      {children}
      {hint && <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{hint}</p>}
    </div>
  );
}

function TagInput({ tags, onChange }: { tags: string[]; onChange: (t: string[]) => void }) {
  const [input, setInput] = useState("");

  function add(e: React.KeyboardEvent) {
    if ((e.key === "Enter" || e.key === ",") && input.trim()) {
      e.preventDefault();
      if (!tags.includes(input.trim())) onChange([...tags, input.trim()]);
      setInput("");
    }
  }

  return (
    <div className="flex flex-wrap gap-1.5 bg-white dark:bg-navy-dark border border-gray-200 dark:border-white/10 rounded-xl p-2.5 min-h-[44px] items-center">
      {tags.map((t) => (
        <span key={t} className="flex items-center gap-1 text-xs bg-primary/10 text-primary dark:text-white dark:bg-white/10 border border-primary/20 dark:border-white/15 px-2.5 py-1 rounded-full font-medium">
          {t}
          <button type="button" onClick={() => onChange(tags.filter((x) => x !== t))} className="opacity-60 hover:opacity-100 ml-1 font-bold">×</button>
        </span>
      ))}
      <input
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={add}
        placeholder={tags.length === 0 ? "Ajoutez des tags (Appuyez sur Entrée)..." : ""}
        className="text-sm text-gray-900 dark:text-white placeholder:text-gray-400 bg-transparent outline-none flex-1 min-w-[120px] px-1"
      />
    </div>
  );
}

// ─── Catalogue exhaustif des 19 blocs pédagogiques ────────────────────────────

type BlockCategory = "all" | "content" | "tech" | "media" | "eval" | "summary";

interface BlockDefinition {
  type: string;
  label: string;
  icon: string;
  category: "content" | "tech" | "media" | "eval" | "summary";
  desc: string;
  defaultContent: () => Record<string, unknown>;
}

const ALL_BLOCK_TYPES: BlockDefinition[] = [
  // 1. Structure & Contenu
  {
    type: "heading",
    label: "Titre de section",
    icon: "H",
    category: "content",
    desc: "Titre principal H2 ou sous-titre H3",
    defaultContent: () => ({ content: "Nouveau titre de section", level: "h2" }),
  },
  {
    type: "text",
    label: "Texte & Markdown",
    icon: "¶",
    category: "content",
    desc: "Paragraphe de cours avec mise en forme",
    defaultContent: () => ({ content: "Rédigez ici le contenu théorique et explicatif..." }),
  },
  {
    type: "callout",
    label: "Encadré pédagogique",
    icon: "!",
    category: "content",
    desc: "Info, Attention, Astuce ou Définition",
    defaultContent: () => ({ variant: "tip", title: "À retenir", content: "Point clé essentiel pour comprendre la suite." }),
  },
  {
    type: "quote",
    label: "Citation & Référence",
    icon: "\"",
    category: "content",
    desc: "Citation d'expert ou papier de recherche",
    defaultContent: () => ({ quote: "L'apprentissage profond extrait automatiquement des représentations hiérarchiques.", author: "Yann LeCun", source: "Nature (2015)" }),
  },
  {
    type: "divider",
    label: "Séparateur visuel",
    icon: "—",
    category: "content",
    desc: "Ligne de démarcation élégante",
    defaultContent: () => ({ label: "Section suivante" }),
  },
  {
    type: "history",
    label: "Point d'histoire",
    icon: "H",
    category: "content",
    desc: "Récit & portrait historique déroulant avec image toujours visible",
    defaultContent: () => ({
      title: "George Edward Pelham Box (1919-2013)",
      subtitle: "Point d'histoire — Fondements statistiques",
      era: "1919-2013",
      imageUrl: "https://upload.wikimedia.org/wikipedia/commons/a/a2/George_EP_Box.jpg",
      caption: "Portrait de George Edward Pelham Box",
      quote: "« Tous les modèles sont faux, mais certains sont utiles. » — George Box (1976)",
      content: "Statisticien britannique de renom, George Box a révolutionné l'analyse des séries temporelles (méthode de Box-Jenkins) et la modélisation statistique moderne.\n\nDurant la Seconde Guerre mondiale, affecté au centre de recherche de Porton Down, il s'est tourné vers les statistiques pour interpréter les résultats d'essais biochimiques. Ses travaux pionniers à Princeton puis à l'Université du Wisconsin ont posé les fondements des plans d'expérience et de l'approche itérative en science des données.",
      defaultOpen: false,
    }),
  },

  // 2. Code, Maths & Données
  {
    type: "code",
    label: "Code interactif",
    icon: "</>",
    category: "tech",
    desc: "Script Python, SQL, R avec coloration",
    defaultContent: () => ({ language: "python", content: "# Exemple de code\nimport numpy as np\n\nx = np.linspace(0, 10, 100)\nprint('Prêt pour l\\'analyse')" }),
  },
  {
    type: "math",
    label: "Formule LaTeX",
    icon: "∑",
    category: "tech",
    desc: "Équations mathématiques & optimisation",
    defaultContent: () => ({ formula: "\\mathcal{L}(\\theta) = - \\frac{1}{N} \\sum_{i=1}^N \\log P(y_i \\mid x_i; \\theta)", explanation: "Fonction de perte par log-vraisemblance" }),
  },
  {
    type: "table",
    label: "Tableau comparatif",
    icon: "▦",
    category: "tech",
    desc: "Matrice de données ou tableau de comparaison",
    defaultContent: () => ({
      headers: ["Modèle", "Type", "Avantages"],
      rows: [
        ["Régression Logistique", "Linéaire", "Interprétable, rapide"],
        ["Forêt Aléatoire", "Ensemble", "Robuste aux valeurs extrêmes"],
        ["Transformeur", "Attention", "Capture les dépendances longues"],
      ],
    }),
  },
  {
    type: "dataset",
    label: "Dataset & Fichier",
    icon: "D",
    category: "tech",
    desc: "Jeu de données CSV, Kaggle ou Notebook",
    defaultContent: () => ({ title: "Jeu de données d'entraînement", url: "https://huggingface.co/datasets/...", format: "CSV / Parquet", description: "Contient 10 000 lignes annotées pour l'exercice pratique." }),
  },

  // 3. Médias & Web
  {
    type: "video",
    label: "Vidéo YouTube",
    icon: "▶",
    category: "media",
    desc: "Lecteur vidéo intégré avec chapitrage",
    defaultContent: () => ({ content: "https://www.youtube.com/watch?v=aircAruvnKk", title: "Introduction visuelle au module" }),
  },
  {
    type: "image",
    label: "Schéma & Illustration",
    icon: "IMG",
    category: "media",
    desc: "Schéma explicatif ou graphique",
    defaultContent: () => ({ content: "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1200&q=80", caption: "Architecture réseau de neurones multicouches", alt: "Schéma d'architecture" }),
  },
  {
    type: "audio",
    label: "Capsule Audio / Podcast",
    icon: "AUD",
    category: "media",
    desc: "Explication audio courte ou interview",
    defaultContent: () => ({ title: "Point de vue du chercheur", duration: "03:45", url: "" }),
  },
  {
    type: "embed",
    label: "Outil externe / Iframe",
    icon: "WEB",
    category: "media",
    desc: "Démonstrateur Streamlit, Colab, HuggingFace",
    defaultContent: () => ({ url: "https://streamlit.io", title: "Application de test interactif" }),
  },

  // 4. Évaluation & Pratique
  {
    type: "quiz",
    label: "Question QCM",
    icon: "?",
    category: "eval",
    desc: "Quiz interactif avec explication",
    defaultContent: () => ({
      question: "Quelle méthode permet de régulariser un réseau de neurones pour éviter l'overfitting ?",
      options: ["Augmenter le Learning Rate", "Le Dropout et la régularisation L2", "Supprimer les fonctions d'activation", "Réduire la taille du batch à 1"],
      answer: 1,
      explanation: "Le Dropout désactive aléatoirement des neurones pour forcer la redondance des représentations.",
    }),
  },
  {
    type: "truefalse",
    label: "Question Vrai / Faux",
    icon: "V/F",
    category: "eval",
    desc: "Test de compréhension binaire rapide",
    defaultContent: () => ({
      statement: "La normalisation des données accélère la convergence de la descente de gradient.",
      isTrue: true,
      explanation: "Vrai : elle uniformise la courbure de la surface de coût pour des mises à jour équilibrées.",
    }),
  },
  {
    type: "exercise",
    label: "Exercice & Solution",
    icon: "EX",
    category: "eval",
    desc: "Énoncé pratique avec indice et solution masquée",
    defaultContent: () => ({
      title: "Calcul de la dimension de sortie d'une couche convolutive",
      instruction: "Soit une image 32x32 traitée par un filtre 5x5 avec un stride de 1 et sans padding (valid). Quelle est la dimension de sortie ?",
      hint: "Formule : (W - F + 2P)/S + 1",
      solution: "Dimension = (32 - 5 + 0)/1 + 1 = 28x28.",
    }),
  },
  {
    type: "flashcard",
    label: "Carte mémoire (Flashcard)",
    icon: "FC",
    category: "eval",
    desc: "Recto / Verso pour mémoriser les définitions",
    defaultContent: () => ({
      front: "Qu'est-ce que le compromis Biais-Variance ?",
      back: "Un modèle avec trop de biais sous-apprend ; un modèle avec trop de variance mémorise le bruit et surapprend (overfitting).",
      category: "Théorie ML",
    }),
  },

  // 5. Synthèse & Clôture
  {
    type: "summary",
    label: "Points clés à retenir",
    icon: "SUM",
    category: "summary",
    desc: "Fiche récapitulative des acquis du cours",
    defaultContent: () => ({
      title: "Points clés du module",
      points: [
        "L'optimiseur Adam combine momentum et adaptation par coordonnée.",
        "Le jeu de validation doit rester strictement isolé de l'entraînement.",
        "L'early stopping prévient la dégradation des performances en test.",
      ],
    }),
  },
  {
    type: "resources",
    label: "Ressources & Références",
    icon: "RES",
    category: "summary",
    desc: "Liens vers articles ArXiv, livres et documentation",
    defaultContent: () => ({
      links: [
        { title: "Deep Learning Book (Goodfellow, Bengio, Courville)", url: "https://www.deeplearningbook.org", type: "Livre" },
        { title: "Attention Is All You Need (Vaswani et al., 2017)", url: "https://arxiv.org/abs/1706.03762", type: "Paper ArXiv" },
      ],
    }),
  },
  {
    type: "author",
    label: "Auteurs du cours",
    icon: "AUT",
    category: "summary",
    desc: "Fiche enseignant / chercheur avec photo, biographie et flanc latéral",
    defaultContent: () => ({
      badgeTitle: "Meet the Author",
      layout: "sidebar-right", // "sidebar-right" | "sidebar-left" | "inline"
      authors: [
        {
          name: "Emmanuel Coblence",
          role: "Professor (Education Track) and Associate Dean for Pedagogy at HEC Paris",
          institution: "HEC Paris",
          photo: "https://hec-prod-drupalfiles.oos.cloudgouv-eu-west-1.outscale.com/s3fs-public/styles/knowledge_profile_vignette/public/2025-06/emmanuel%20coblence.jpg?itok=DviurG82",
          bio: "Emmanuel Coblence is Professor (Education Track) and Associate Dean for Pedagogy at HEC Paris. His teaching areas are leadership, organizational theories, change management, and political skills in organizations. He teaches in the Executive MBA program for which he coordinates the leadership course.",
          linkText: "More About the Author",
          linkUrl: "https://www.hec.edu/en/faculty-research/faculty-directory/faculty-member/coblence-emmanuel",
          socialLinkedin: "https://linkedin.com",
          socialEmail: "coblence@hec.fr",
        },
      ],
    }),
  },
];

const CATEGORY_TABS: { key: BlockCategory; label: string }[] = [
  { key: "all", label: "Tous (21)" },
  { key: "content", label: "Contenu (6)" },
  { key: "tech", label: "Code & Maths (4)" },
  { key: "media", label: "Médias (4)" },
  { key: "eval", label: "Évaluation (4)" },
  { key: "summary", label: "Synthèse (3)" },
];

// ─── Configuration Ruban de type Word & Outils Studio ─────────────────────────

type RibbonTab = "home" | "insert" | "eval" | "summary" | "equalizer" | "view";

const RIBBON_TABS: { key: RibbonTab; label: string }[] = [
  { key: "home", label: "Accueil" },
  { key: "insert", label: "Insertion" },
  { key: "eval", label: "Évaluation" },
  { key: "summary", label: "Synthèse" },
  { key: "equalizer", label: "Égaliseur & Interprétation" },
  { key: "view", label: "Affichage" },
];

const BLOCK_SHORTCUTS: Record<string, string> = {
  heading: "Alt + 1",
  text: "Alt + 2",
  quote: "Alt + 3",
  callout: "Alt + 4",
  divider: "Alt + 5",
  history: "Alt + H",
  code: "Alt + C",
  math: "Alt + M",
  table: "Alt + T",
  dataset: "Alt + D",
  video: "Alt + V",
  image: "Alt + I",
  audio: "Alt + A",
  embed: "Alt + E",
  quiz: "Alt + Q",
  truefalse: "Alt + F",
  exercise: "Alt + X",
  flashcard: "Alt + K",
  summary: "Alt + S",
  resources: "Alt + R",
  author: "Alt + U",
};

const BLOCK_ICONS: Record<string, LucideIcon> = {
  heading: IconHeading,
  text: IconFileText,
  quote: IconQuote,
  callout: IconLightbulb,
  divider: IconMinus,
  history: IconHistory,
  code: IconCode2,
  math: IconSigma,
  table: IconTable,
  dataset: IconDatabase,
  video: IconPlay,
  image: ImageIcon,
  audio: IconMic,
  embed: IconExternalLink,
  quiz: IconHelpCircle,
  truefalse: IconCheckCheck,
  exercise: IconCheckSquare,
  flashcard: LucideSparkles,
  summary: IconStar,
  resources: IconLibrary,
  author: IconAuthor,
};

// ─── Configuration du Quadrillage de Test (12 Colonnes Multicolores & Zones) ───

const DEBUG_GRID_COLUMNS = [
  { id: 1,  name: "C1",  zone: "A (Gauche)", bg: "bg-red-500/20",     border: "border-red-500",     text: "text-red-700 dark:text-red-300",     badge: "bg-red-500 text-white" },
  { id: 2,  name: "C2",  zone: "A (Gauche)", bg: "bg-orange-500/20",  border: "border-orange-500",  text: "text-orange-700 dark:text-orange-300",  badge: "bg-orange-500 text-white" },
  { id: 3,  name: "C3",  zone: "A (Gauche)", bg: "bg-amber-500/20",   border: "border-amber-500",   text: "text-amber-700 dark:text-amber-300",   badge: "bg-amber-500 text-white" },
  { id: 4,  name: "C4",  zone: "B (Centre)", bg: "bg-yellow-500/20",  border: "border-yellow-500",  text: "text-yellow-800 dark:text-yellow-200", badge: "bg-yellow-500 text-black" },
  { id: 5,  name: "C5",  zone: "B (Centre)", bg: "bg-lime-500/20",    border: "border-lime-500",    text: "text-lime-700 dark:text-lime-300",    badge: "bg-lime-500 text-black" },
  { id: 6,  name: "C6",  zone: "B (Centre)", bg: "bg-emerald-500/20", border: "border-emerald-500", text: "text-emerald-700 dark:text-emerald-300", badge: "bg-emerald-500 text-white" },
  { id: 7,  name: "C7",  zone: "B (Centre)", bg: "bg-teal-500/20",    border: "border-teal-500",    text: "text-teal-700 dark:text-teal-300",    badge: "bg-teal-500 text-white" },
  { id: 8,  name: "C8",  zone: "B (Centre)", bg: "bg-cyan-500/20",    border: "border-cyan-500",    text: "text-cyan-700 dark:text-cyan-300",    badge: "bg-cyan-500 text-white" },
  { id: 9,  name: "C9",  zone: "B (Centre)", bg: "bg-sky-500/20",     border: "border-sky-500",     text: "text-sky-700 dark:text-sky-300",     badge: "bg-sky-500 text-white" },
  { id: 10, name: "C10", zone: "C (Droite)", bg: "bg-indigo-500/20",  border: "border-indigo-500",  text: "text-indigo-700 dark:text-indigo-300",  badge: "bg-indigo-500 text-white" },
  { id: 11, name: "C11", zone: "C (Droite)", bg: "bg-purple-500/20",  border: "border-purple-500",  text: "text-purple-700 dark:text-purple-300",  badge: "bg-purple-500 text-white" },
  { id: 12, name: "C12", zone: "C (Droite)", bg: "bg-pink-500/20",    border: "border-pink-500",    text: "text-pink-700 dark:text-pink-300",    badge: "bg-pink-500 text-white" },
];

function RibbonLargeButton({
  icon: Icon,
  label,
  shortcut,
  onClick,
  isActive,
  disabled,
  destructive,
  iconColor,
}: {
  icon: LucideIcon;
  label: string;
  shortcut?: string;
  onClick: () => void;
  isActive?: boolean;
  disabled?: boolean;
  destructive?: boolean;
  iconColor?: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      title={shortcut ? `${label} (${shortcut})` : label}
      aria-label={label}
      className={`flex flex-col items-center justify-between p-2 rounded-lg border transition-all cursor-pointer min-w-[66px] sm:min-w-[74px] h-[72px] group focus-visible:ring-2 select-none shrink-0 ${
        disabled
          ? "opacity-35 cursor-not-allowed border-transparent"
          : destructive
          ? "border-transparent hover:border-danger/30 hover:bg-danger/10 text-gray-700 dark:text-gray-300 hover:text-danger focus-visible:ring-danger"
          : isActive
          ? "bg-[#0B2F5E]/10 dark:bg-white/15 border-[#0B2F5E]/30 text-[#0B2F5E] dark:text-white font-bold"
          : "border-transparent hover:border-gray-200 dark:hover:border-white/10 hover:bg-gray-100/70 dark:hover:bg-white/5 text-gray-700 dark:text-gray-200 hover:text-[#0B2F5E] dark:hover:text-white focus-visible:ring-primary"
      }`}
    >
      <div className="flex-1 flex items-center justify-center">
        <Icon
          className={`w-5 h-5 transition-transform group-hover:scale-105 ${
            destructive
              ? "text-gray-500 group-hover:text-danger"
              : isActive
              ? "text-[#0B2F5E] dark:text-white"
              : iconColor || "text-[#0B2F5E] dark:text-blue-300"
          }`}
          strokeWidth={1.75}
        />
      </div>
      <span className="text-[11px] font-medium leading-tight text-center line-clamp-2">
        {label}
      </span>
    </button>
  );
}

function RibbonSmallButton({
  icon: Icon,
  label,
  shortcut,
  onClick,
  disabled,
  iconColor,
}: {
  icon: LucideIcon;
  label: string;
  shortcut?: string;
  onClick: () => void;
  disabled?: boolean;
  iconColor?: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      title={shortcut ? `${label} (${shortcut})` : label}
      className={`flex items-center gap-1.5 px-2 py-1 rounded-md border border-transparent transition-all cursor-pointer text-[11px] font-medium focus-visible:ring-2 focus-visible:ring-primary select-none whitespace-nowrap ${
        disabled
          ? "opacity-35 cursor-not-allowed"
          : "hover:border-gray-200 dark:hover:border-white/10 hover:bg-gray-100/70 dark:hover:bg-white/5 text-gray-700 dark:text-gray-300 hover:text-[#0B2F5E] dark:hover:text-white"
      }`}
    >
      <Icon className={`w-3.5 h-3.5 shrink-0 ${iconColor || "text-gray-500 dark:text-gray-400"}`} strokeWidth={1.75} />
      <span>{label}</span>
    </button>
  );
}

function RibbonGroup({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col justify-between border-r border-gray-200 dark:border-white/10 px-2 sm:px-3 min-h-[82px] shrink-0">
      <div className="flex items-center gap-1 sm:gap-1.5 flex-1">
        {children}
      </div>
      <div className="text-[10px] font-medium text-gray-400 dark:text-gray-400 text-center tracking-tight border-t border-gray-100 dark:border-white/5 pt-0.5 mt-1 select-none">
        {label}
      </div>
    </div>
  );
}

// ─── Utilitaires de typage ───────────────────────────────────────────────────

type EditorBlock = { id: number; type: string; content: Record<string, unknown> };

interface HistorySnapshot {
  blocks: EditorBlock[];
  title: string;
  courseFont?: FontFamilyKey;
  courseFontSize?: number;
}

const cstr = (c: Record<string, unknown>, k: string) => (typeof c[k] === "string" ? (c[k] as string) : "");
const carr = (c: Record<string, unknown>, k: string) => (Array.isArray(c[k]) ? (c[k] as string[]) : []);
const cnum = (c: Record<string, unknown>, k: string) => (typeof c[k] === "number" ? (c[k] as number) : 0);

// ─── Composant Éditeur de Cours ───────────────────────────────────────────────

function CourseEditor() {
  const [blocks, setBlocks] = useState<EditorBlock[]>([
    { id: 1, type: "heading", content: { content: "1. Introduction aux Réseaux de Neurones", level: "h2" } },
    { id: 2, type: "callout", content: { variant: "tip", title: "Objectif pédagogique", content: "À la fin de ce cours, vous maîtriserez les architectures denses et la rétropropagation du gradient." } },
    { id: 3, type: "text", content: { content: "Les réseaux de neurones artificiels sont des modèles d'apprentissage statistique inspirés du fonctionnement des neurones biologiques. Ils permettent d'approximer des fonctions non-linéaires complexes." } },
    { id: 4, type: "history", content: {
      title: "George Edward Pelham Box (1919-2013)",
      subtitle: "Point d'histoire — Fondements statistiques",
      era: "1919-2013",
      imageUrl: "https://upload.wikimedia.org/wikipedia/commons/a/a2/George_EP_Box.jpg",
      caption: "Portrait de George Edward Pelham Box",
      quote: "« Tous les modèles sont faux, mais certains sont utiles. » — George Box (1976)",
      content: "Statisticien britannique de renom, George Box a révolutionné l'analyse des séries temporelles (méthode de Box-Jenkins) et la modélisation statistique.\n\nSes contributions majeures démontrent qu'un modèle mathématique n'a pas vocation à être une réplique parfaite de la réalité physique, mais une approximation pragmatique capable de guider l'analyse et la prédiction avec rigueur.",
      defaultOpen: true,
    } },
    { id: 5, type: "divider", content: { label: "Partie II : Implémentation & Architecture" } },
    { id: 6, type: "heading", content: { content: "2. Architecture d'un Perceptron Multicouche", level: "h2" } },
    { id: 7, type: "heading", content: { content: "Fonction d'activation et non-linéarité", level: "h3" } },
    { id: 8, type: "code", content: { language: "python", content: "import torch\nimport torch.nn as nn\n\n# Définition d'un perceptron multicouche\nmodel = nn.Sequential(\n    nn.Linear(784, 128),\n    nn.ReLU(),\n    nn.Linear(128, 10)\n)\nprint(model)" } },
    { id: 9, type: "quiz", content: {
      question: "Pourquoi applique-t-on une fonction d'activation non-linéaire (ex: ReLU) entre chaque couche ?",
      options: ["Pour réduire le temps d'entraînement", "Pour permettre au réseau d'apprendre des relations non-linéaires", "Pour forcer les poids à être positifs", "Pour diviser par deux la taille des paramètres"],
      answer: 1,
      explanation: "Sans fonction non-linéaire, l'empilement de couches linéaires reste strictement équivalent à une seule transformation linéaire.",
    } },
    { id: 10, type: "author", content: {
      badgeTitle: "Meet the Author",
      layout: "sidebar-right",
      authors: [
        {
          name: "Emmanuel Coblence",
          role: "Professor (Education Track) and Associate Dean for Pedagogy at HEC Paris",
          institution: "HEC Paris",
          photo: "https://hec-prod-drupalfiles.oos.cloudgouv-eu-west-1.outscale.com/s3fs-public/styles/knowledge_profile_vignette/public/2025-06/emmanuel%20coblence.jpg?itok=DviurG82",
          bio: "Emmanuel Coblence is Professor (Education Track) and Associate Dean for Pedagogy at HEC Paris. His teaching areas are leadership, organizational theories, change management, and political skills in organizations. He teaches in the Executive MBA program for which he coordinates the leadership course.",
          linkText: "More About the Author",
          linkUrl: "https://www.hec.edu/en/faculty-research/faculty-directory/faculty-member/coblence-emmanuel",
          socialLinkedin: "https://linkedin.com",
          socialEmail: "coblence@hec.fr",
        },
      ],
    } },
  ]);

  const [title, setTitle] = useState("Fondamentaux du Deep Learning & Architectures Modernes");
  const [category, setCategory] = useState("IA & Data");
  const [level, setLevel] = useState("Intermédiaire");
  const [school, setSchool] = useState("Polytechnique");
  const [access, setAccess] = useState("public");

  const [viewMode, setViewMode] = useState<"edit" | "preview">("edit");
  const [activeRibbonTab, setActiveRibbonTab] = useState<RibbonTab>("home");
  const [ribbonCollapsed, setRibbonCollapsed] = useState(false);
  const [ribbonSearch, setRibbonSearch] = useState("");
  const [fileMenuOpen, setFileMenuOpen] = useState(false);
  const [selectedBlockId, setSelectedBlockId] = useState<number | null>(1);

  const [saving, setSaving] = useState(false);
  const [savedId, setSavedId] = useState<string | null>(null);
  const [error, setError] = useState("");

  // Option pour retirer ou afficher les contours du feed (par défaut sans contours pour un feed épuré)
  const [showFeedBorders, setShowFeedBorders] = useState(false);

  // Option pour afficher un Sommaire Dynamique ("left" = haut gauche, "right" = haut droit, "none" = masqué)
  type TocPlacement = "left" | "right" | "none";
  const [tocPlacement, setTocPlacement] = useState<TocPlacement>("left");

  // Typographie & Polices du cours (style Word / Office)
  const [courseFont, setCourseFont] = useState<FontFamilyKey>("sans");
  const [courseFontSize, setCourseFontSize] = useState<number>(16);
  const [equalizerMessage, setEqualizerMessage] = useState<string | null>(null);

  // ─── Historique Annuler / Rétablir (Undo / Redo) ───
  const [undoStack, setUndoStack] = useState<HistorySnapshot[]>([]);
  const [redoStack, setRedoStack] = useState<HistorySnapshot[]>([]);
  const isUndoRedoActionRef = useRef(false);
  const isTypingRef = useRef(false);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const pushHistoryState = useCallback((_description?: string) => {
    if (isUndoRedoActionRef.current) return;
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
      typingTimeoutRef.current = null;
    }
    isTypingRef.current = false;

    setUndoStack((prev) => {
      const snap: HistorySnapshot = {
        blocks: JSON.parse(JSON.stringify(blocks)),
        title,
        courseFont,
        courseFontSize,
      };
      const next = [...prev, snap];
      if (next.length > 50) next.shift();
      return next;
    });
    setRedoStack([]);
  }, [blocks, title, courseFont, courseFontSize]);

  const handleUndo = useCallback(() => {
    if (undoStack.length === 0) return;
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
      typingTimeoutRef.current = null;
    }
    isTypingRef.current = false;

    if (typeof document !== "undefined" && document.activeElement instanceof HTMLElement) {
      if (document.activeElement.getAttribute("contenteditable") === "true") {
        document.activeElement.blur();
      }
    }

    const previousSnapshot = undoStack[undoStack.length - 1];
    const newUndoStack = undoStack.slice(0, -1);

    const currentSnapshot: HistorySnapshot = {
      blocks: JSON.parse(JSON.stringify(blocks)),
      title,
      courseFont,
      courseFontSize,
    };

    isUndoRedoActionRef.current = true;
    setRedoStack((prev) => [...prev, currentSnapshot]);
    setUndoStack(newUndoStack);
    setBlocks(previousSnapshot.blocks);
    setTitle(previousSnapshot.title);
    if (previousSnapshot.courseFont) setCourseFont(previousSnapshot.courseFont);
    if (previousSnapshot.courseFontSize) setCourseFontSize(previousSnapshot.courseFontSize);
    setEqualizerMessage("↶ Action annulée (Ctrl+Z)");

    setTimeout(() => {
      isUndoRedoActionRef.current = false;
    }, 60);
  }, [undoStack, blocks, title, courseFont, courseFontSize]);

  const handleRedo = useCallback(() => {
    if (redoStack.length === 0) return;
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
      typingTimeoutRef.current = null;
    }
    isTypingRef.current = false;

    if (typeof document !== "undefined" && document.activeElement instanceof HTMLElement) {
      if (document.activeElement.getAttribute("contenteditable") === "true") {
        document.activeElement.blur();
      }
    }

    const nextSnapshot = redoStack[redoStack.length - 1];
    const newRedoStack = redoStack.slice(0, -1);

    const currentSnapshot: HistorySnapshot = {
      blocks: JSON.parse(JSON.stringify(blocks)),
      title,
      courseFont,
      courseFontSize,
    };

    isUndoRedoActionRef.current = true;
    setUndoStack((prev) => [...prev, currentSnapshot]);
    setRedoStack(newRedoStack);
    setBlocks(nextSnapshot.blocks);
    setTitle(nextSnapshot.title);
    if (nextSnapshot.courseFont) setCourseFont(nextSnapshot.courseFont);
    if (nextSnapshot.courseFontSize) setCourseFontSize(nextSnapshot.courseFontSize);
    setEqualizerMessage("↷ Action rétablie (Ctrl+Y)");

    setTimeout(() => {
      isUndoRedoActionRef.current = false;
    }, 60);
  }, [redoStack, blocks, title, courseFont, courseFontSize]);

  function handleTitleChange(newTitle: string) {
    if (!isUndoRedoActionRef.current && !isTypingRef.current) {
      pushHistoryState("Modification du titre");
      isTypingRef.current = true;
    }
    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    typingTimeoutRef.current = setTimeout(() => {
      isTypingRef.current = false;
    }, 800);
    setTitle(newTitle);
  }

  function exportCourseJson() {
    try {
      const data = {
        version: "1.0",
        exportedAt: new Date().toISOString(),
        title,
        category,
        level,
        school,
        access,
        courseFont,
        courseFontSize,
        blocks,
      };
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      const sanitized = (title || "cours")
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .slice(0, 40);
      a.download = `cours-${sanitized || "sans-titre"}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      setEqualizerMessage("✓ Structure du cours exportée en JSON");
    } catch {
      setError("Erreur lors de l'export JSON");
    }
  }

  function triggerImportCourseJson() {
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
      fileInputRef.current.click();
    }
  }

  function handleImportJsonFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const text = event.target?.result as string;
        const parsed = JSON.parse(text);
        if (parsed && Array.isArray(parsed.blocks)) {
          pushHistoryState("Import de cours");
          if (parsed.title) setTitle(parsed.title);
          if (parsed.category) setCategory(parsed.category);
          if (parsed.level) setLevel(parsed.level);
          if (parsed.school) setSchool(parsed.school);
          if (parsed.courseFont) setCourseFont(parsed.courseFont);
          if (parsed.courseFontSize) setCourseFontSize(parsed.courseFontSize);
          setBlocks(parsed.blocks);
          setEqualizerMessage(`✓ Cours importé avec succès (${parsed.blocks.length} blocs)`);
        } else {
          setError("Fichier JSON invalide pour un cours.");
        }
      } catch {
        setError("Erreur lors de la lecture du fichier JSON.");
      }
    };
    reader.readAsText(file);
  }

  function resetEditor() {
    pushHistoryState("Nouveau cours");
    setTitle("");
    setBlocks([{ id: Date.now(), type: "heading", content: { content: "1. Nouveau chapitre", level: "h2" } }]);
    setSelectedBlockId(null);
    setEqualizerMessage("✓ Nouvel éditeur initialisé (Annulable avec Ctrl+Z)");
  }

  const activeFontConfig = useMemo(() => {
    return FONT_FAMILIES.find((f) => f.key === courseFont) || FONT_FAMILIES[0];
  }, [courseFont]);

  // État du menu contextuel flottant Word en mode aperçu
  const [floatingToolbar, setFloatingToolbar] = useState<{
    isOpen: boolean;
    x: number;
    y: number;
    selectedText: string;
    blockId: number | null;
  }>({
    isOpen: false,
    x: 0,
    y: 0,
    selectedText: "",
    blockId: null,
  });

  // État du quadrillage de repérage (désactivé)
  const [showDebugGrid, setShowDebugGrid] = useState(false);
  const [gridOverlayMode, setGridOverlayMode] = useState<"all" | "columns" | "zones">("all");
  const [gridLegendOpen, setGridLegendOpen] = useState(false);

  // Repères du Sommaire dynamique générés à partir des titres, sous-titres et découpes de sections
  const tocItems = useMemo(() => {
    const list: {
      id: number;
      type: "heading" | "divider";
      level?: "h1" | "h2" | "h3";
      title: string;
      blockIndex: number;
    }[] = [];

    blocks.forEach((b, idx) => {
      if (b.type === "heading") {
        const txt = cstr(b.content, "content").trim();
        const lvl = (cstr(b.content, "level") || "h2") as "h1" | "h2" | "h3";
        list.push({
          id: b.id,
          type: "heading",
          level: lvl,
          title: txt || `Titre (${lvl.toUpperCase()}) sans nom`,
          blockIndex: idx,
        });
      } else if (b.type === "divider") {
        const lbl = cstr(b.content, "label").trim();
        list.push({
          id: b.id,
          type: "divider",
          title: lbl || "Découpe de section",
          blockIndex: idx,
        });
      }
    });

    return list;
  }, [blocks]);

  // Section active du cours détectée dynamiquement au défilement
  const [activeSectionBlockId, setActiveSectionBlockId] = useState<number | null>(null);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    if (tocItems.length === 0) return;

    function handleScroll() {
      setIsScrolled(window.scrollY > 80);

      const offset = 220; // Dégagement sous le ruban/dock sticky
      let currentId = tocItems[0]?.id ?? null;

      for (let i = 0; i < tocItems.length; i++) {
        const item = tocItems[i];
        const el = document.getElementById(`block-${item.id}`);
        if (!el) continue;
        const rect = el.getBoundingClientRect();
        if (rect.top <= offset) {
          currentId = item.id;
        } else {
          break;
        }
      }

      setActiveSectionBlockId(currentId);
    }

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [tocItems]);

  function scrollToBlock(blockId: number) {
    setSelectedBlockId(blockId);
    setActiveSectionBlockId(blockId);
    const el = document.getElementById(`block-${blockId}`);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }

  // Fermer le menu flottant si on clique en dehors
  useEffect(() => {
    function handleGlobalClick(e: MouseEvent) {
      const target = e.target as HTMLElement;
      if (target.closest(".word-floating-toolbar")) return;
      setFloatingToolbar((prev) => (prev.isOpen ? { ...prev, isOpen: false } : prev));
    }

    window.addEventListener("mousedown", handleGlobalClick);
    return () => window.removeEventListener("mousedown", handleGlobalClick);
  }, []);

  // Détection de la sélection de texte dans le mode aperçu
  function handlePreviewMouseUp() {
    setTimeout(() => {
      const selection = window.getSelection();
      if (!selection || selection.isCollapsed) return;

      const text = selection.toString().trim();
      if (text.length === 0) return;

      try {
        const range = selection.getRangeAt(0);
        const rect = range.getBoundingClientRect();

        let node: Node | null = range.commonAncestorContainer;
        let bId: number | null = null;
        while (node && node !== document.body) {
          if (node instanceof HTMLElement && node.dataset.blockId) {
            bId = Number(node.dataset.blockId);
            break;
          }
          node = node.parentNode;
        }

        const toolbarWidth = 330;
        const x = Math.min(window.innerWidth - toolbarWidth - 16, Math.max(16, rect.left + rect.width / 2 - toolbarWidth / 2));
        const y = Math.max(16, rect.top - 55);

        setFloatingToolbar({
          isOpen: true,
          x,
          y,
          selectedText: text,
          blockId: bId,
        });
      } catch {
        // Fallback
      }
    }, 20);
  }

  // Clic droit dans le mode aperçu (ouvre le menu contextuel flottant Word)
  function handlePreviewContextMenu(e: React.MouseEvent, bId: number) {
    e.preventDefault();
    const selection = window.getSelection();
    const text = selection && !selection.isCollapsed ? selection.toString().trim() : "";

    const toolbarWidth = 330;
    const x = Math.min(window.innerWidth - toolbarWidth - 16, Math.max(16, e.clientX - 100));
    const y = Math.max(16, e.clientY - 60);

    setFloatingToolbar({
      isOpen: true,
      x,
      y,
      selectedText: text,
      blockId: bId,
    });
  }

  // ─── Espace d'Interprétation & Égaliseur de Modifications Word (Intégré au Dock) ───
  const [isWordPageMode, setIsWordPageMode] = useState(true);
  const [showRawInspector, setShowRawInspector] = useState(false);

  // Auto-dismiss equalizer message after 3.5s
  useEffect(() => {
    if (!equalizerMessage) return;
    const t = setTimeout(() => setEqualizerMessage(null), 3500);
    return () => clearTimeout(t);
  }, [equalizerMessage]);

  // Statistiques en direct du cours (Mots, Caractères, Blocs, Temps de lecture)
  const courseStats = useMemo(() => {
    let words = 0;
    let chars = 0;
    blocks.forEach((b) => {
      const texts: string[] = [];
      Object.values(b.content).forEach((v) => {
        if (typeof v === "string") texts.push(v);
        else if (Array.isArray(v)) {
          v.forEach((item) => {
            if (typeof item === "string") texts.push(item);
            else if (typeof item === "object" && item) {
              Object.values(item).forEach((iv) => {
                if (typeof iv === "string") texts.push(iv);
              });
            }
          });
        }
      });
      const combined = texts.join(" ");
      chars += combined.length;
      words += combined.trim().split(/\s+/).filter(Boolean).length;
    });

    const readingTime = Math.max(1, Math.ceil(words / 200));
    return { words, chars, readingTime };
  }, [blocks]);

  // Conversion rapide d'un bloc en un autre type (Modulation Word facile)
  function convertBlockType(blockId: number, newType: string) {
    pushHistoryState(`Conversion du bloc #${blockId} vers ${newType}`);
    setBlocks((prev) =>
      prev.map((b) => {
        if (b.id !== blockId) return b;
        const text = cstr(b.content, "content") || cstr(b.content, "quote") || cstr(b.content, "title") || "";
        if (newType === "heading") {
          return { ...b, type: "heading", content: { content: text || "Nouveau titre de section", level: "h2" } };
        }
        if (newType === "heading-h3") {
          return { ...b, type: "heading", content: { content: text || "Nouveau sous-titre", level: "h3" } };
        }
        if (newType === "text") {
          return { ...b, type: "text", content: { content: text || "Nouveau paragraphe explicatif..." } };
        }
        if (newType === "callout") {
          return { ...b, type: "callout", content: { variant: "tip", title: "Point clé à retenir", content: text || "Détail de l'astuce pédagogique" } };
        }
        if (newType === "quote") {
          return { ...b, type: "quote", content: { quote: text || "Citation clé", author: "Auteur / Référence" } };
        }
        return b;
      })
    );
    setSelectedBlockId(blockId);
    setEqualizerMessage(`✓ Bloc #${blockId} converti en ${newType}`);
  }

  // Égalisation 1 : Typographie globale
  function equalizeTypography(fontKey?: FontFamilyKey) {
    pushHistoryState("Égalisation de la typographie");
    const chosen = fontKey || courseFont;
    setCourseFont(chosen);
    setEqualizerMessage(`✓ Typographie égalisée sur « ${FONT_FAMILIES.find((f) => f.key === chosen)?.label} » (${courseFontSize}px)`);
  }

  // Égalisation 2 : Harmonisation des espacements & sauts de ligne
  function equalizeSpacing() {
    pushHistoryState("Égalisation des espacements");
    setBlocks((prev) =>
      prev.map((b) => {
        const updated = { ...b.content };
        let changed = false;
        Object.keys(updated).forEach((k) => {
          if (typeof updated[k] === "string") {
            const raw = updated[k] as string;
            const cleaned = raw.replace(/\n{3,}/g, "\n\n").replace(/[ \t]{2,}/g, " ").trim();
            if (cleaned !== raw) {
              updated[k] = cleaned;
              changed = true;
            }
          }
        });
        return changed ? { ...b, content: updated } : b;
      })
    );
    setEqualizerMessage("✓ Espacements et retours à la ligne égalisés sur l'ensemble du cours");
  }

  // Égalisation 3 : Nettoyage et normalisation du balisage
  function equalizeMarkup() {
    pushHistoryState("Nettoyage du balisage");
    setBlocks((prev) =>
      prev.map((b) => {
        const updated = { ...b.content };
        let changed = false;
        Object.keys(updated).forEach((k) => {
          if (typeof updated[k] === "string") {
            let raw = updated[k] as string;
            raw = raw.replace(/\*\*\s*\*\*/g, "");
            raw = raw.replace(/\*\s*\*/g, "");
            raw = raw.replace(/<u>\s*<\/u>/gi, "");
            raw = raw.replace(/==\s*==/g, "");
            raw = raw.replace(/`\s*`/g, "");
            if (raw !== updated[k]) {
              updated[k] = raw;
              changed = true;
            }
          }
        });
        return changed ? { ...b, content: updated } : b;
      })
    );
    setEqualizerMessage("✓ Balisage et formatages orphelins nettoyés et égalisés");
  }

  // Égalisation 4 : Numérotation séquentielle des chapitres et titres
  function equalizeHeadings() {
    pushHistoryState("Numérotation des titres");
    let h2Counter = 1;
    let h3Counter = 1;
    setBlocks((prev) =>
      prev.map((b) => {
        if (b.type !== "heading") return b;
        const lvl = cstr(b.content, "level") || "h2";
        const rawContent = cstr(b.content, "content").replace(/^(\d+(\.\d+)*\.\s*)+/, "").trim();
        let numbered = rawContent;
        if (lvl === "h2") {
          numbered = `${h2Counter}. ${rawContent}`;
          h2Counter++;
          h3Counter = 1;
        } else if (lvl === "h3") {
          numbered = `${Math.max(1, h2Counter - 1)}.${h3Counter} ${rawContent}`;
          h3Counter++;
        }
        return { ...b, content: { ...b.content, content: numbered } };
      })
    );
    setEqualizerMessage("✓ Numérotation séquentielle des titres et chapitres égalisée");
  }

  // Bloc actuellement ciblé pour l'espace d'interprétation
  const activeBlockForInspection = useMemo(() => {
    return blocks.find((b) => b.id === (selectedBlockId || floatingToolbar.blockId)) || blocks[0] || null;
  }, [blocks, selectedBlockId, floatingToolbar.blockId]);

  // Application du formatage de type Word (Gras, Italique, Souligné, Code, Surlignage)
  function applyFormatting(formatType: "bold" | "italic" | "underline" | "code" | "highlight", targetBlockId?: number | null) {
    pushHistoryState(`Formatage ${formatType}`);
    const bId = targetBlockId ?? floatingToolbar.blockId ?? selectedBlockId;

    // 1. Essai de formatage natif execCommand si du texte est sélectionné dans un élément contentEditable
    if (typeof document !== "undefined") {
      let executed = false;
      try {
        if (formatType === "bold") {
          executed = document.execCommand("bold", false);
        } else if (formatType === "italic") {
          executed = document.execCommand("italic", false);
        } else if (formatType === "underline") {
          executed = document.execCommand("underline", false);
        } else if (formatType === "highlight") {
          executed = document.execCommand("hiliteColor", false, "#fef08a") || document.execCommand("backColor", false, "#fef08a");
        }

        if (executed && bId) {
          const activeEl = document.activeElement;
          const targetEl = (activeEl && (activeEl as HTMLElement).dataset.blockId === String(bId))
            ? (activeEl as HTMLElement)
            : (document.querySelector(`[data-block-id="${bId}"]`) as HTMLElement | null);

          if (targetEl) {
            const block = blocks.find((b) => b.id === bId);
            if (block) {
              let fieldKey = "content";
              if (block.type === "quote" && cstr(block.content, "quote")) fieldKey = "quote";
              const updatedText = htmlToFormattedText(targetEl.innerHTML);
              setContent(bId, { ...block.content, [fieldKey]: updatedText });
              setEqualizerMessage(`✓ Formatage ${formatType} synchronisé en direct`);
              return;
            }
          }
        }
      } catch {
        // Fallback
      }
    }

    // 2. Fallback de remplacement textuel par jetons Markdown
    if (!bId) return;
    const block = blocks.find((b) => b.id === bId);
    if (!block) return;

    let fieldKey = "content";
    if (block.type === "quote" && cstr(block.content, "quote")) fieldKey = "quote";
    else if (block.type === "heading") fieldKey = "content";

    const currentText = cstr(block.content, fieldKey);
    const selected = (floatingToolbar.selectedText || "").trim();

    if (selected && currentText.includes(selected)) {
      let wrapped = "";
      if (formatType === "bold") {
        wrapped = selected.startsWith("**") && selected.endsWith("**") ? selected.slice(2, -2) : `**${selected}**`;
      } else if (formatType === "italic") {
        wrapped = selected.startsWith("*") && selected.endsWith("*") ? selected.slice(1, -1) : `*${selected}*`;
      } else if (formatType === "underline") {
        wrapped = selected.startsWith("<u>") && selected.endsWith("</u>") ? selected.slice(3, -4) : `<u>${selected}</u>`;
      } else if (formatType === "code") {
        wrapped = selected.startsWith("`") && selected.endsWith("`") ? selected.slice(1, -1) : `\`${selected}\``;
      } else if (formatType === "highlight") {
        wrapped = selected.startsWith("==") && selected.endsWith("==") ? selected.slice(2, -2) : `==${selected}==`;
      }

      const newText = currentText.replace(selected, wrapped);
      setContent(bId, { ...block.content, [fieldKey]: newText });
      setFloatingToolbar((prev) => ({ ...prev, selectedText: wrapped }));
      setEqualizerMessage(`✓ Formatage ${formatType} synchronisé sur le bloc #${bId}`);
    } else {
      if (!currentText) return;
      let wrapped = "";
      if (formatType === "bold") {
        wrapped = currentText.startsWith("**") && currentText.endsWith("**") ? currentText.slice(2, -2) : `**${currentText}**`;
      } else if (formatType === "italic") {
        wrapped = currentText.startsWith("*") && currentText.endsWith("*") ? currentText.slice(1, -1) : `*${currentText}*`;
      } else if (formatType === "underline") {
        wrapped = currentText.startsWith("<u>") && currentText.endsWith("</u>") ? currentText.slice(3, -4) : `<u>${currentText}</u>`;
      } else if (formatType === "code") {
        wrapped = currentText.startsWith("`") && currentText.endsWith("`") ? currentText.slice(1, -1) : `\`${currentText}\``;
      } else if (formatType === "highlight") {
        wrapped = currentText.startsWith("==") && currentText.endsWith("==") ? currentText.slice(2, -2) : `==${currentText}==`;
      }
      setContent(bId, { ...block.content, [fieldKey]: wrapped });
      setEqualizerMessage(`✓ Formatage ${formatType} appliqué à tout le bloc #${bId}`);
    }
  }

  // Rendu enveloppant pour chaque bloc en mode Word avec barre d'outils de modulation rapide
  function renderModulatedBlock(block: EditorBlock, bIdx: number, children: React.ReactNode) {
    return (
      <div
        key={block.id}
        id={`block-${block.id}`}
        className="group/block relative transition-all rounded-xl p-1 -m-1 hover:ring-1 hover:ring-primary/20"
      >
        {isWordPageMode && (
          <div className="absolute right-2 -top-3 z-30 opacity-0 group-hover/block:opacity-100 focus-within:opacity-100 transition-opacity bg-white/95 dark:bg-navy/95 backdrop-blur-md border border-gray-200 dark:border-white/15 rounded-lg shadow-md px-1.5 py-0.5 flex items-center gap-1 text-[11px] text-gray-600 dark:text-gray-300 select-none pointer-events-auto">
            <span className="text-[10px] font-mono text-gray-400 px-1">
              #{bIdx + 1}
            </span>
            <button
              type="button"
              onClick={() => move(block.id, "up")}
              disabled={bIdx === 0}
              title="Monter le bloc"
              className="p-1 hover:bg-gray-100 dark:hover:bg-white/10 rounded disabled:opacity-30 cursor-pointer"
            >
              <ArrowUp className="w-3 h-3" />
            </button>
            <button
              type="button"
              onClick={() => move(block.id, "down")}
              disabled={bIdx === blocks.length - 1}
              title="Descendre le bloc"
              className="p-1 hover:bg-gray-100 dark:hover:bg-white/10 rounded disabled:opacity-30 cursor-pointer"
            >
              <ArrowDown className="w-3 h-3" />
            </button>
            <button
              type="button"
              onClick={() => duplicateBlock(block.id)}
              title="Dupliquer ce bloc"
              className="p-1 hover:bg-gray-100 dark:hover:bg-white/10 rounded cursor-pointer"
            >
              <Copy className="w-3 h-3" />
            </button>
            <button
              type="button"
              onClick={() => addBlock("text", block.id)}
              title="Ajouter un paragraphe en dessous"
              className="p-1 hover:bg-gray-100 dark:hover:bg-white/10 rounded cursor-pointer text-primary"
            >
              <Plus className="w-3 h-3" />
            </button>
            <select
              value={block.type === "heading" ? (cstr(block.content, "level") === "h3" ? "heading-h3" : "heading") : block.type}
              onChange={(e) => convertBlockType(block.id, e.target.value)}
              className="text-[10px] font-semibold bg-transparent border-0 text-gray-600 dark:text-gray-300 cursor-pointer hover:text-primary focus:outline-none"
              title="Convertir le type de bloc"
            >
              <option value="text">Texte</option>
              <option value="heading">Titre H2</option>
              <option value="heading-h3">Sous-titre H3</option>
              <option value="callout">Astuce</option>
              <option value="quote">Citation</option>
            </select>
            <button
              type="button"
              onClick={() => removeBlock(block.id)}
              title="Supprimer ce bloc"
              className="p-1 hover:bg-danger/10 hover:text-danger rounded cursor-pointer text-gray-400"
            >
              <Trash2 className="w-3 h-3" />
            </button>
          </div>
        )}
        {children}
      </div>
    );
  }

  // Auteurs configurés pour les flancs latéraux extérieurs (gauche / droit) ou dans le cours
  const leftAuthorBlocks = blocks.filter(
    (b) => b.type === "author" && cstr(b.content, "layout") === "sidebar-left"
  );
  const rightAuthorBlocks = blocks.filter(
    (b) => b.type === "author" && (cstr(b.content, "layout") === "sidebar-right" || !cstr(b.content, "layout"))
  );
  const flankAuthorBlocks = [...leftAuthorBlocks, ...rightAuthorBlocks];

  // États pour les composants interactifs en mode prévisualisation
  const [previewQuizAnswer, setPreviewQuizAnswer] = useState<Record<number, number>>({});
  const [previewTfAnswer, setPreviewTfAnswer] = useState<Record<number, boolean>>({});
  const [previewRevealedExercises, setPreviewRevealedExercises] = useState<Record<number, { hint: boolean; solution: boolean }>>({});
  const [previewFlippedCards, setPreviewFlippedCards] = useState<Record<number, boolean>>({});
  const [copiedCodeId, setCopiedCodeId] = useState<number | null>(null);

  function addBlock(type: string, afterId?: number | null, customContent?: Record<string, unknown>) {
    pushHistoryState(`Ajout du bloc ${type}`);
    let actualType = type;
    let initialContent: Record<string, unknown>;

    if (type === "heading-h3") {
      actualType = "heading";
      initialContent = customContent || { content: "Sous-titre H3", level: "h3" };
    } else {
      const def = ALL_BLOCK_TYPES.find((b) => b.type === type);
      initialContent = customContent || (def ? def.defaultContent() : { content: "" });
    }

    const newId = Date.now();
    const newBlock: EditorBlock = { id: newId, type: actualType, content: initialContent };

    setBlocks((prev) => {
      const targetId = afterId ?? selectedBlockId;
      if (!targetId) return [...prev, newBlock];
      const idx = prev.findIndex((b) => b.id === targetId);
      if (idx === -1) return [...prev, newBlock];
      const copy = [...prev];
      copy.splice(idx + 1, 0, newBlock);
      return copy;
    });

    setSelectedBlockId(newId);
    if (viewMode !== "edit") setViewMode("edit");
  }

  function removeBlock(id: number) {
    pushHistoryState("Suppression de bloc");
    setBlocks((b) => b.filter((bl) => bl.id !== id));
    if (selectedBlockId === id) setSelectedBlockId(null);
  }

  function duplicateBlock(id: number) {
    const target = blocks.find((b) => b.id === id);
    if (!target) return;
    pushHistoryState("Duplication de bloc");
    const clonedId = Date.now();
    const cloned = { ...target, id: clonedId, content: JSON.parse(JSON.stringify(target.content)) };
    setBlocks((b) => {
      const idx = b.findIndex((bl) => bl.id === id);
      const copy = [...b];
      copy.splice(idx + 1, 0, cloned);
      return copy;
    });
    setSelectedBlockId(clonedId);
  }

  function duplicateSelected() {
    if (selectedBlockId) duplicateBlock(selectedBlockId);
  }

  function removeSelected() {
    if (!selectedBlockId) return;
    const currentId = selectedBlockId;
    const idx = blocks.findIndex((b) => b.id === currentId);
    removeBlock(currentId);
    if (blocks.length > 1) {
      const nextIdx = idx > 0 ? idx - 1 : 1;
      const nextBlock = blocks[nextIdx];
      setSelectedBlockId(nextBlock ? nextBlock.id : null);
    } else {
      setSelectedBlockId(null);
    }
  }

  function moveSelected(dir: "up" | "down") {
    if (selectedBlockId) move(selectedBlockId, dir);
  }

  // Barre de recherche de commandes « Que souhaitez-vous faire ? »
  const searchedCommands = useMemo(() => {
    if (!ribbonSearch.trim()) return [];
    const q = ribbonSearch.toLowerCase();
    const matches: { id: string; label: string; desc: string; icon: LucideIcon; action: () => void }[] = [];

    // Recherche dans les blocs
    ALL_BLOCK_TYPES.forEach((b) => {
      if (b.label.toLowerCase().includes(q) || b.desc.toLowerCase().includes(q) || b.type.toLowerCase().includes(q)) {
        matches.push({
          id: `block-${b.type}`,
          label: `Insérer : ${b.label}`,
          desc: b.desc,
          icon: BLOCK_ICONS[b.type] ?? IconFileText,
          action: () => {
            addBlock(b.type);
            setRibbonSearch("");
          },
        });
      }
    });

    // Recherche dans les actions rapides
    if ("annuler".includes(q) || "undo".includes(q) || "revenir".includes(q)) {
      matches.push({
        id: "act-undo",
        label: "Annuler la dernière action",
        desc: "Rétablir l'état antérieur du cours (Ctrl + Z)",
        icon: Undo,
        action: () => { handleUndo(); setRibbonSearch(""); },
      });
    }
    if ("retablir".includes(q) || "redo".includes(q) || "avancer".includes(q)) {
      matches.push({
        id: "act-redo",
        label: "Rétablir l'action",
        desc: "Réappliquer la dernière action annulée (Ctrl + Y)",
        icon: Redo,
        action: () => { handleRedo(); setRibbonSearch(""); },
      });
    }
    if ("exporter".includes(q) || "sauvegarde".includes(q) || "json".includes(q) || "telecharger".includes(q)) {
      matches.push({
        id: "act-export-json",
        label: "Exporter en JSON",
        desc: "Télécharger la structure du cours en fichier .json",
        icon: FileDown,
        action: () => { exportCourseJson(); setRibbonSearch(""); },
      });
    }
    if ("importer".includes(q) || "charger".includes(q) || "ouvrir".includes(q)) {
      matches.push({
        id: "act-import-json",
        label: "Importer un cours (JSON)",
        desc: "Charger un cours depuis un fichier .json",
        icon: FileUp,
        action: () => { triggerImportCourseJson(); setRibbonSearch(""); },
      });
    }
    if ("imprimer".includes(q) || "pdf".includes(q) || "print".includes(q)) {
      matches.push({
        id: "act-print",
        label: "Imprimer / Exporter PDF",
        desc: "Générer la version imprimable ou PDF (Ctrl + P)",
        icon: Printer,
        action: () => { window.print(); setRibbonSearch(""); },
      });
    }
    if ("nouveau".includes(q) || "reinitialiser".includes(q) || "reset".includes(q)) {
      matches.push({
        id: "act-reset",
        label: "Nouveau cours",
        desc: "Réinitialiser l'éditeur avec un nouveau chapitre",
        icon: Plus,
        action: () => { resetEditor(); setRibbonSearch(""); },
      });
    }
    if ("dupliquer".includes(q) || "copier".includes(q)) {
      matches.push({
        id: "act-dup",
        label: "Dupliquer le bloc actif",
        desc: "Créer une copie immédiate du bloc sélectionné",
        icon: Copy,
        action: () => { duplicateSelected(); setRibbonSearch(""); },
      });
    }
    if ("supprimer".includes(q) || "effacer".includes(q)) {
      matches.push({
        id: "act-del",
        label: "Supprimer le bloc actif",
        desc: "Supprimer le bloc sélectionné du cours",
        icon: Trash2,
        action: () => { removeSelected(); setRibbonSearch(""); },
      });
    }
    if ("apercu".includes(q) || "étudiant".includes(q) || "voir".includes(q)) {
      matches.push({
        id: "act-prev",
        label: "Mode Aperçu Étudiant",
        desc: "Afficher le rendu direct étudiant",
        icon: Eye,
        action: () => { setViewMode("preview"); setRibbonSearch(""); },
      });
    }
    if ("edition".includes(q) || "éditer".includes(q) || "modifier".includes(q)) {
      matches.push({
        id: "act-edit",
        label: "Mode Édition",
        desc: "Revenir à l'édition des blocs",
        icon: Edit3,
        action: () => { setViewMode("edit"); setRibbonSearch(""); },
      });
    }
    if ("publier".includes(q) || "sauvegarder".includes(q) || "enregistrer".includes(q)) {
      matches.push({
        id: "act-pub",
        label: "Publier le cours",
        desc: "Enregistrer et publier le cours dans la base",
        icon: Save,
        action: () => { publish(); setRibbonSearch(""); },
      });
    }
    if ("histoire".includes(q) || "box".includes(q) || "biographie".includes(q) || "récit".includes(q) || "portrait".includes(q)) {
      if (!matches.some((m) => m.id === "block-history")) {
        matches.push({
          id: "block-history",
          label: "Insérer : Point d'histoire",
          desc: "Accordéon déroulant avec portrait visible et récit",
          icon: IconHistory,
          action: () => { addBlock("history"); setRibbonSearch(""); },
        });
      }
    }
    if ("auteur".includes(q) || "coblence".includes(q) || "professeur".includes(q) || "flan".includes(q) || "sidebar".includes(q) || "meet".includes(q) || "enseignant".includes(q)) {
      if (!matches.some((m) => m.id === "block-author")) {
        matches.push({
          id: "block-author",
          label: "Insérer : Fiche Auteur(s)",
          desc: "Fiche enseignant avec photo, bio et flanc latéral",
          icon: IconAuthor,
          action: () => { addBlock("author"); setRibbonSearch(""); },
        });
      }
    }
    if ("contour".includes(q) || "bordure".includes(q) || "cadre".includes(q) || "border".includes(q)) {
      matches.push({
        id: "toggle-feed-borders",
        label: showFeedBorders ? "Retirer les contours du feed" : "Afficher les contours du feed",
        desc: "Active ou désactive les bordures et ombres du flux de cours",
        icon: showFeedBorders ? SquareDashed : Square,
        action: () => {
          setShowFeedBorders((v) => !v);
          setRibbonSearch("");
        },
      });
    }
    if ("sommaire".includes(q) || "table".includes(q) || "matiere".includes(q) || "plan".includes(q) || "section".includes(q) || "toc".includes(q)) {
      matches.push({
        id: "toc-left",
        label: "Sommaire : Flanc gauche (haut gauche)",
        desc: "Afficher le sommaire dynamique sur le flanc extérieur gauche",
        icon: ListTree,
        action: () => { setTocPlacement("left"); setRibbonSearch(""); },
      });
      matches.push({
        id: "toc-right",
        label: "Sommaire : Flanc droit (haut droit)",
        desc: "Afficher le sommaire dynamique sur le flanc extérieur droit",
        icon: ListTree,
        action: () => { setTocPlacement("right"); setRibbonSearch(""); },
      });
      matches.push({
        id: "toc-none",
        label: "Sommaire : Masquer",
        desc: "Masquer le sommaire dynamique des flancs",
        icon: IconX,
        action: () => { setTocPlacement("none"); setRibbonSearch(""); },
      });
    }
    if ("egaliser".includes(q) || "egaliseur".includes(q) || "harmoniser".includes(q) || "police".includes(q) || "saut".includes(q) || "titre".includes(q)) {
      matches.push({
        id: "equalize-typo",
        label: "Égaliser la police",
        desc: `Harmoniser la typographie (${activeFontConfig.label}) sur tout le cours`,
        icon: IconType,
        action: () => { equalizeTypography(); setRibbonSearch(""); },
      });
      matches.push({
        id: "equalize-spacing",
        label: "Égaliser les espacements",
        desc: "Nettoyer les sauts de ligne triples et espaces superflus",
        icon: IconAlignLeft,
        action: () => { equalizeSpacing(); setRibbonSearch(""); },
      });
      matches.push({
        id: "equalize-headings",
        label: "Égaliser les titres",
        desc: "Numéroter automatiquement les sections (1., 2., 2.1...)",
        icon: IconHeading,
        action: () => { equalizeHeadings(); setRibbonSearch(""); },
      });
      matches.push({
        id: "equalize-markup",
        label: "Nettoyer le balisage",
        desc: "Purger les balises orphelines ou incomplètes",
        icon: IconWand,
        action: () => { equalizeMarkup(); setRibbonSearch(""); },
      });
      matches.push({
        id: "open-equalizer-tab",
        label: "Ouvrir l'Égaliseur Word",
        desc: "Afficher l'onglet complet Égaliseur & Interprétation dans le ruban",
        icon: IconWand,
        action: () => { setActiveRibbonTab("equalizer"); if (ribbonCollapsed) setRibbonCollapsed(false); setRibbonSearch(""); },
      });
    }

    return matches;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ribbonSearch, blocks, selectedBlockId, showFeedBorders, tocPlacement, courseFont, ribbonCollapsed]);

  function setContent(id: number, content: Record<string, unknown>) {
    if (!isUndoRedoActionRef.current && !isTypingRef.current) {
      pushHistoryState("Modification de contenu");
      isTypingRef.current = true;
    }
    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    typingTimeoutRef.current = setTimeout(() => {
      isTypingRef.current = false;
    }, 800);

    setBlocks((b) => b.map((bl) => (bl.id === id ? { ...bl, content } : bl)));
  }

  function move(id: number, dir: "up" | "down") {
    pushHistoryState(`Déplacement de bloc ${dir}`);
    setBlocks((b) => {
      const i = b.findIndex((bl) => bl.id === id);
      if (dir === "up" && i === 0) return b;
      if (dir === "down" && i === b.length - 1) return b;
      const n = [...b];
      const j = dir === "up" ? i - 1 : i + 1;
      [n[i], n[j]] = [n[j], n[i]];
      return n;
    });
  }

  async function publish() {
    if (!title.trim()) { setError("Le titre du cours est requis."); return; }
    setSaving(true);
    setError("");

    // Conversion harmonieuse de chaque type vers le schéma base de données
    const dbBlocks = blocks.map((b) => {
      if (b.type === "quiz") {
        return {
          type: "quiz",
          content: {
            question: cstr(b.content, "question"),
            options: carr(b.content, "options"),
            answer: cnum(b.content, "answer"),
            explanation: cstr(b.content, "explanation"),
          },
        };
      }
      if (b.type === "truefalse") {
        return {
          type: "quiz",
          content: {
            question: cstr(b.content, "statement"),
            options: ["Vrai", "Faux"],
            answer: b.content.isTrue ? 0 : 1,
            explanation: cstr(b.content, "explanation"),
          },
        };
      }
      if (b.type === "callout") {
        const v = cstr(b.content, "variant").toUpperCase() || "NOTE";
        return {
          type: "markdown",
          content: { content: `> **[${v}] ${cstr(b.content, "title")}**\n>\n> ${cstr(b.content, "content")}` },
        };
      }
      if (b.type === "quote") {
        const src = cstr(b.content, "source");
        return {
          type: "markdown",
          content: { content: `> « ${cstr(b.content, "quote")} »\n>\n> — **${cstr(b.content, "author")}**${src ? ` (${src})` : ""}` },
        };
      }
      if (b.type === "math") {
        return {
          type: "markdown",
          content: { content: `$$\n${cstr(b.content, "formula")}\n$$\n*${cstr(b.content, "explanation")}*` },
        };
      }
      if (b.type === "exercise") {
        return {
          type: "markdown",
          content: {
            content: `### Exercice : ${cstr(b.content, "title")}\n\n${cstr(b.content, "instruction")}\n\n> **Indice :** ${cstr(b.content, "hint")}\n\n**Solution :** ${cstr(b.content, "solution")}`,
          },
        };
      }
      if (b.type === "summary") {
        const points = carr(b.content, "points").map((p) => `- ${p}`).join("\n");
        return {
          type: "markdown",
          content: { content: `### ${cstr(b.content, "title") || "Points clés à retenir"}\n\n${points}` },
        };
      }
      if (b.type === "dataset") {
        return {
          type: "markdown",
          content: {
            content: `**Jeu de données : [${cstr(b.content, "title")}](${cstr(b.content, "url")})** (${cstr(b.content, "format")})\n\n${cstr(b.content, "description")}`,
          },
        };
      }
      if (b.type === "flashcard") {
        return {
          type: "markdown",
          content: {
            content: `**Concept [${cstr(b.content, "category")}] :** ${cstr(b.content, "front")}\n\n**Définition :** ${cstr(b.content, "back")}`,
          },
        };
      }
      if (b.type === "code") {
        return {
          type: "code",
          content: { content: cstr(b.content, "content"), language: cstr(b.content, "language") || "python" },
        };
      }
      if (b.type === "video") {
        return { type: "markdown", content: { content: cstr(b.content, "content") } };
      }
      if (b.type === "image") {
        return {
          type: "markdown",
          content: { content: `![${cstr(b.content, "alt") || "illustration"}](${cstr(b.content, "content")})\n*${cstr(b.content, "caption")}*` },
        };
      }
      if (b.type === "divider") {
        return { type: "divider", content: {} };
      }
      if (b.type === "history") {
        const sub = cstr(b.content, "subtitle") || "Point d'histoire";
        const tit = cstr(b.content, "title");
        const img = cstr(b.content, "imageUrl");
        const qte = cstr(b.content, "quote");
        const txt = cstr(b.content, "content");
        return {
          type: "markdown",
          content: {
            content: `### ${sub} : ${tit}\n\n${img ? `![${tit}](${img})\n\n` : ""}${qte ? `> ${qte}\n\n` : ""}${txt}`,
          },
        };
      }
      if (b.type === "author") {
        const badge = cstr(b.content, "badgeTitle") || "Meet the Author";
        const authorsArr = Array.isArray(b.content.authors)
          ? (b.content.authors as { name?: string; role?: string; institution?: string; bio?: string; linkUrl?: string; linkText?: string }[])
          : [];
        const authorDesc = authorsArr
          .map((a) => `**${a.name || "Auteur"}** — *${a.role || ""}* (${a.institution || ""})\n\n${a.bio || ""}\n\n[${a.linkText || "En savoir plus"}](${a.linkUrl || "#"})`)
          .join("\n\n---\n\n");
        return {
          type: "markdown",
          content: { content: `### ${badge}\n\n${authorDesc}` },
        };
      }

      // Par défaut : heading ou text
      const text = cstr(b.content, "content");
      if (b.type === "heading") return { type: "heading", content: { content: text } };
      return { type: "text", content: { content: text } };
    });

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000"}/api/v1/studio/save-course`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: title.trim(),
          level: LEVEL_MAP[level] ?? "intermediate",
          language: "fr",
          blocks: dbBlocks,
          category,
          school,
          access_level: access,
        }),
      });
      if (!res.ok) {
        const b = await res.json().catch(() => ({}));
        throw new Error(b.detail ?? "Échec de la publication.");
      }
      const data = await res.json();
      setSavedId(data.course_id ?? "demo-saved");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Échec de la publication.");
    } finally {
      setSaving(false);
    }
  }

  function copyCodeToClipboard(blockId: number, codeText: string) {
    navigator.clipboard.writeText(codeText);
    setCopiedCodeId(blockId);
    setTimeout(() => setCopiedCodeId(null), 2000);
  }

  // ─── Raccourcis clavier globaux Word / Office ───
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      const isCtrlOrMeta = e.ctrlKey || e.metaKey;
      const target = e.target as HTMLElement | null;
      const isNativeInput = target && (target.tagName === "INPUT" || target.tagName === "TEXTAREA");

      // Sauvegarde & Publication : Ctrl+S / Cmd+S
      if (isCtrlOrMeta && (e.key === "s" || e.key === "S")) {
        e.preventDefault();
        publish();
        return;
      }

      // Réduire / Déplier le ruban : Ctrl+F1
      if (isCtrlOrMeta && e.key === "F1") {
        e.preventDefault();
        setRibbonCollapsed((prev) => !prev);
        return;
      }

      // Annuler : Ctrl+Z / Cmd+Z (sans Maj)
      if (isCtrlOrMeta && !e.shiftKey && (e.key === "z" || e.key === "Z")) {
        if (!isNativeInput) {
          e.preventDefault();
          handleUndo();
          return;
        }
      }

      // Rétablir : Ctrl+Y / Cmd+Y OU Ctrl+Shift+Z / Cmd+Shift+Z
      if (
        (isCtrlOrMeta && (e.key === "y" || e.key === "Y")) ||
        (isCtrlOrMeta && e.shiftKey && (e.key === "z" || e.key === "Z"))
      ) {
        if (!isNativeInput) {
          e.preventDefault();
          handleRedo();
          return;
        }
      }

      // Raccourcis de composition de blocs si on n'est pas dans un champ de texte
      if (!isNativeInput && !target?.isContentEditable) {
        if (e.altKey && e.key === "1") {
          e.preventDefault();
          addBlock("heading");
        } else if (e.altKey && e.key === "2") {
          e.preventDefault();
          addBlock("text");
        } else if (e.altKey && (e.key === "c" || e.key === "C")) {
          e.preventDefault();
          addBlock("code");
        } else if (e.altKey && (e.key === "q" || e.key === "Q")) {
          e.preventDefault();
          addBlock("quiz");
        } else if (e.altKey && (e.key === "b" || e.key === "B")) {
          e.preventDefault();
          setShowFeedBorders((prev) => !prev);
        } else if (e.altKey && (e.key === "o" || e.key === "O")) {
          e.preventDefault();
          setTocPlacement((curr) => (curr === "none" ? "left" : "none"));
        } else if (isCtrlOrMeta && (e.key === "d" || e.key === "D")) {
          e.preventDefault();
          duplicateSelected();
        } else if (e.key === "Delete" && selectedBlockId) {
          removeSelected();
        }
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleUndo, handleRedo, publish, addBlock, duplicateSelected, removeSelected, selectedBlockId]);

  function renderTableOfContents() {
    if (tocItems.length === 0) return null;

    return (
      <nav aria-label="Sommaire du cours" className="text-xs py-1 pr-2 select-none">
        {/* En-tête sobre en texte seul */}
        <div className="flex items-center justify-between text-[11px] font-bold uppercase tracking-wider text-gray-400 dark:text-gray-500 mb-2 pb-1 border-b border-gray-200/50 dark:border-white/5">
          <span>Sommaire</span>
          <div className="flex items-center gap-1.5 lowercase font-normal opacity-0 hover:opacity-100 transition-opacity text-[10px]">
            <button
              type="button"
              onClick={() => setTocPlacement(tocPlacement === "left" ? "right" : "left")}
              className="hover:text-gray-900 dark:hover:text-white cursor-pointer"
              title={tocPlacement === "left" ? "Déplacer sur le flanc droit" : "Déplacer sur le flanc gauche"}
            >
              {tocPlacement === "left" ? "→ droite" : "← gauche"}
            </button>
            <span>•</span>
            <button
              type="button"
              onClick={() => setTocPlacement("none")}
              className="hover:text-danger cursor-pointer"
              title="Masquer le sommaire"
            >
              masquer
            </button>
          </div>
        </div>

        {/* Liste des sections : texte seul & changement de couleur à la section active */}
        <div className="space-y-1 max-h-[calc(100vh-220px)] overflow-y-auto pr-1 scrollbar-none">
          {tocItems.map((item) => {
            const isActive = activeSectionBlockId === item.id;
            const isH1 = item.level === "h1";
            const isH3 = item.level === "h3";

            if (item.type === "divider") {
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => scrollToBlock(item.id)}
                  className={`w-full text-left py-0.5 text-[11px] transition-colors cursor-pointer block truncate ${
                    isActive
                      ? "text-primary dark:text-blue-400 font-bold"
                      : "text-gray-400 dark:text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 italic"
                  }`}
                  title={item.title}
                >
                  — {item.title}
                </button>
              );
            }

            return (
              <button
                key={item.id}
                type="button"
                onClick={() => scrollToBlock(item.id)}
                className={`w-full text-left py-0.5 transition-colors cursor-pointer block truncate leading-snug ${
                  isH3
                    ? "pl-4 text-[11px]"
                    : isH1
                    ? "text-xs font-medium"
                    : "pl-2 text-xs"
                } ${
                  isActive
                    ? "text-primary dark:text-blue-400 font-bold"
                    : "text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                }`}
                title={item.title}
              >
                {item.title}
              </button>
            );
          })}
        </div>
      </nav>
    );
  }

  function renderAuthorCard(b: EditorBlock) {
    type AuthorItem = {
      name: string;
      role: string;
      institution: string;
      photo: string;
      bio: string;
      linkText: string;
      linkUrl: string;
      socialLinkedin?: string;
      socialEmail?: string;
    };
    const rawAuthors = (Array.isArray(b.content.authors)
      ? b.content.authors
      : []) as AuthorItem[];
    const badge = cstr(b.content, "badgeTitle") || "Meet the Author";

    return (
      <div key={b.id} className="bk-authors-list w-full space-y-4 my-2">
        {rawAuthors.map((author, aIdx) => (
          <div
            key={aIdx}
            className={`bk-author-infos bg-white dark:bg-navy rounded-2xl p-5 sm:p-6 transition-all relative overflow-hidden ${
              showFeedBorders
                ? "border border-gray-200 dark:border-white/10 shadow-sm hover:shadow-md"
                : "border-0 shadow-none"
            }`}
          >
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#0B2F5E] via-primary to-[#FF034D]" />

            <div className="bk-author-infos__header space-y-3">
              <div className="flex items-center justify-between gap-2">
                <div className="bk-author-infos__title text-[10px] font-extrabold uppercase tracking-widest px-2.5 py-0.5 rounded-full bg-primary/10 text-primary dark:text-blue-300 border border-primary/20 w-fit">
                  {badge}
                </div>
                {author.institution && (
                  <span className="text-xs font-semibold text-gray-500 dark:text-gray-400 truncate">
                    {author.institution}
                  </span>
                )}
              </div>

              <div className="flex items-start gap-4">
                <div className="bk-author-infos__photo-wrapper shrink-0">
                  <div className="bk-author-infos__photo-profile relative">
                    <img
                      loading="lazy"
                      className="picture-item img-circle w-16 h-16 sm:w-20 sm:h-20 rounded-full object-cover border-2 border-white dark:border-navy shadow-md ring-2 ring-[#0B2F5E]/20"
                      src={author.photo || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80"}
                      alt={author.name}
                      onError={(e) => { (e.target as HTMLElement).style.display = "none"; }}
                    />
                  </div>
                </div>

                <div className="flex-1 min-w-0">
                  <h4 className="bk-author-infos__author-name rs_read_this_class text-base sm:text-lg font-bold text-gray-900 dark:text-white leading-tight">
                    {author.name}
                  </h4>
                  <p className="bk-author-infos__author-title text-xs text-primary dark:text-blue-400 font-semibold mt-1 leading-snug">
                    {author.role}
                  </p>
                </div>
              </div>
            </div>

            <div className="bk-author-infos__content mt-4 pt-3 border-t border-gray-100 dark:border-white/5 space-y-3">
              {author.bio && (
                <div className="bk-author-infos__description text-xs text-gray-600 dark:text-gray-300 leading-relaxed">
                  <div className="rte media-hub-font whitespace-pre-wrap">
                    {author.bio}
                  </div>
                </div>
              )}

              <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
                {author.linkUrl ? (
                  <a
                    href={author.linkUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-[#0B2F5E] dark:text-white hover:text-primary transition-colors bg-[#0B2F5E]/5 dark:bg-white/10 hover:bg-[#0B2F5E]/10 px-3.5 py-1.5 rounded-xl cursor-pointer"
                  >
                    <span>{author.linkText || "More About the Author"}</span>
                    <span>→</span>
                  </a>
                ) : <div />}

                <div className="bk-author-infos__social-links">
                  <ul className="flex items-center gap-2 list-none p-0 m-0">
                    {author.socialLinkedin && (
                      <li>
                        <a
                          href={author.socialLinkedin}
                          target="_blank"
                          rel="noreferrer"
                          title="Profil LinkedIn"
                          className="inline-flex items-center justify-center w-7 h-7 rounded-lg text-xs font-bold text-gray-500 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-white/10 transition-colors"
                        >
                          in
                        </a>
                      </li>
                    )}
                    {author.socialEmail && (
                      <li>
                        <a
                          href={`mailto:${author.socialEmail}`}
                          title="Contacter par email"
                          className="inline-flex items-center justify-center w-7 h-7 rounded-lg text-xs text-gray-500 hover:text-primary hover:bg-primary/10 transition-colors"
                        >
                          <Mail className="w-3.5 h-3.5" strokeWidth={1.8} />
                        </a>
                      </li>
                    )}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (savedId) {
    return (
      <div className="bg-white dark:bg-navy border border-gray-200 dark:border-white/10 rounded-2xl p-10 text-center max-w-xl mx-auto shadow-card">
        <div className="w-16 h-16 mx-auto bg-emerald-500/10 text-emerald-500 rounded-2xl flex items-center justify-center mb-4">
          <Check className="w-8 h-8" strokeWidth={2.5} />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Cours enregistré avec succès !</h2>
        <p className="text-gray-500 dark:text-gray-400 text-sm mb-6">
          « {title} » a été publié avec {blocks.length} blocs de contenu pédagogique.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href={`/courses/${savedId}`}
            className="bg-primary hover:bg-primary-dark text-white px-5 py-2.5 rounded-xl text-sm font-semibold transition-all shadow-sm flex items-center justify-center gap-2"
          >
            <span>Consulter le cours</span>
            <span>→</span>
          </Link>
          <button
            onClick={() => {
              setSavedId(null);
              setTitle("");
              setBlocks([{ id: 1, type: "heading", content: { content: "1. Introduction", level: "h2" } }]);
            }}
            className="border border-gray-200 dark:border-white/10 text-gray-700 dark:text-gray-300 px-5 py-2.5 rounded-xl text-sm hover:bg-gray-50 dark:hover:bg-white/5 transition-colors font-medium"
          >
            Créer un autre cours
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">

      {/* ═════════════════════════════════════════════════════════════════════════ */}
      {/* RUBAN CLAIR DE TYPE WORD (MICROSOFT OFFICE RIBBON - STICKY AU SCROLL)     */}
      {/* ═════════════════════════════════════════════════════════════════════════ */}
      <div className="sticky top-[150px] z-40 w-full bg-white/95 dark:bg-navy/95 backdrop-blur-md border border-gray-200 dark:border-white/10 rounded-xl shadow-md overflow-visible transition-all">
        
        {/* BARRE D'ACCÈS RAPIDE & RECHERCHE « QUE SOUHAITEZ-VOUS FAIRE ? » */}
        <div className="flex flex-wrap items-center justify-between gap-2 px-3 py-2 border-b border-gray-200 dark:border-white/10 bg-gray-50/70 dark:bg-white/5 rounded-t-xl text-xs">
          
          {/* Gauche : Bouton [Fichier ▾] + Raccourcis accès rapide */}
          <div className="flex items-center gap-1 sm:gap-1.5 relative">
            <div className="relative">
              <button
                type="button"
                onClick={() => setFileMenuOpen((prev) => !prev)}
                className="bg-[#0B2F5E] hover:bg-[#0B2F5E]/90 text-white font-bold px-3 py-1.5 rounded-md flex items-center gap-1.5 shadow-2xs transition-colors cursor-pointer text-xs"
                title="Menu Fichier"
              >
                <span>Fichier</span>
                <ChevronDown className="w-3.5 h-3.5" />
              </button>

              {/* Menu déroulant Fichier */}
              {fileMenuOpen && (
                <>
                  <div
                    className="fixed inset-0 z-40"
                    onClick={() => setFileMenuOpen(false)}
                  />
                  <div className="absolute left-0 top-full mt-1.5 w-64 bg-white dark:bg-navy border border-gray-200 dark:border-white/10 rounded-xl shadow-xl z-50 p-1.5 space-y-1">
                    <button
                      type="button"
                      onClick={() => {
                        publish();
                        setFileMenuOpen(false);
                      }}
                      className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-left text-xs font-semibold text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-white/10 transition-colors cursor-pointer"
                    >
                      <Save className="w-4 h-4 text-[#0B2F5E] dark:text-blue-400 shrink-0" />
                      <div className="flex-1">
                        <p className="font-bold">Sauvegarder & Publier</p>
                        <p className="text-[10px] text-gray-400">Enregistrer dans la base (Ctrl+S)</p>
                      </div>
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setViewMode("preview");
                        setFileMenuOpen(false);
                      }}
                      className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-left text-xs font-semibold text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-white/10 transition-colors cursor-pointer"
                    >
                      <Eye className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                      <div className="flex-1">
                        <p className="font-bold">Aperçu Étudiant</p>
                        <p className="text-[10px] text-gray-400">Rendu final du cours</p>
                      </div>
                    </button>

                    <div className="h-px bg-gray-100 dark:bg-white/10 my-1" />

                    <button
                      type="button"
                      onClick={() => {
                        exportCourseJson();
                        setFileMenuOpen(false);
                      }}
                      className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-left text-xs font-semibold text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-white/10 transition-colors cursor-pointer"
                    >
                      <FileDown className="w-4 h-4 text-indigo-600 dark:text-indigo-400 shrink-0" />
                      <div className="flex-1">
                        <p className="font-bold">Exporter en JSON</p>
                        <p className="text-[10px] text-gray-400">Télécharger la structure du cours</p>
                      </div>
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        triggerImportCourseJson();
                        setFileMenuOpen(false);
                      }}
                      className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-left text-xs font-semibold text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-white/10 transition-colors cursor-pointer"
                    >
                      <FileUp className="w-4 h-4 text-teal-600 dark:text-teal-400 shrink-0" />
                      <div className="flex-1">
                        <p className="font-bold">Importer un cours (JSON)</p>
                        <p className="text-[10px] text-gray-400">Charger depuis un fichier .json</p>
                      </div>
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        window.print();
                        setFileMenuOpen(false);
                      }}
                      className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-left text-xs font-semibold text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-white/10 transition-colors cursor-pointer"
                    >
                      <Printer className="w-4 h-4 text-slate-600 dark:text-slate-400 shrink-0" />
                      <div className="flex-1">
                        <p className="font-bold">Imprimer / PDF</p>
                        <p className="text-[10px] text-gray-400">Export papier ou PDF (Ctrl+P)</p>
                      </div>
                    </button>

                    <div className="h-px bg-gray-100 dark:bg-white/10 my-1" />

                    <button
                      type="button"
                      onClick={() => {
                        resetEditor();
                        setFileMenuOpen(false);
                      }}
                      className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-left text-xs font-semibold text-danger hover:bg-danger/10 transition-colors cursor-pointer"
                    >
                      <Plus className="w-4 h-4 text-danger shrink-0" />
                      <div className="flex-1">
                        <p className="font-bold">Nouveau cours</p>
                        <p className="text-[10px] text-gray-400">Réinitialiser l'éditeur</p>
                      </div>
                    </button>
                  </div>
                </>
              )}
              {/* Input fichier caché pour l'import de cours JSON */}
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleImportJsonFile}
                accept=".json"
                className="hidden"
              />
            </div>

            {/* Icônes de la barre d'accès rapide */}
            <button
              type="button"
              onClick={publish}
              title="Sauvegarder et publier (Ctrl + S)"
              className="p-1.5 rounded-md hover:bg-gray-200/60 dark:hover:bg-white/10 text-gray-700 dark:text-gray-300 transition-colors cursor-pointer"
            >
              <Save className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={handleUndo}
              disabled={undoStack.length === 0}
              title={undoStack.length > 0 ? "Annuler la dernière action (Ctrl + Z)" : "Rien à annuler (Ctrl + Z)"}
              className={`p-1.5 rounded-md transition-colors ${
                undoStack.length > 0
                  ? "hover:bg-gray-200/60 dark:hover:bg-white/10 text-gray-700 dark:text-gray-300 cursor-pointer opacity-100"
                  : "text-gray-400 dark:text-gray-600 opacity-40 cursor-not-allowed"
              }`}
            >
              <Undo className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={handleRedo}
              disabled={redoStack.length === 0}
              title={redoStack.length > 0 ? "Rétablir l'action (Ctrl + Y / Ctrl + Maj + Z)" : "Rien à rétablir (Ctrl + Y)"}
              className={`p-1.5 rounded-md transition-colors ${
                redoStack.length > 0
                  ? "hover:bg-gray-200/60 dark:hover:bg-white/10 text-gray-700 dark:text-gray-300 cursor-pointer opacity-100"
                  : "text-gray-400 dark:text-gray-600 opacity-40 cursor-not-allowed"
              }`}
            >
              <Redo className="w-4 h-4" />
            </button>

            <span className="h-4 w-px bg-gray-300 dark:bg-white/15 mx-0.5 hidden sm:block" />

            {/* Raccourcis permanents d'accès rapide des 4 blocs les plus utilisés */}
            <div className="hidden md:flex items-center gap-1">
              <button
                type="button"
                onClick={() => addBlock("heading")}
                title="Insérer un Titre de section (Alt + 1)"
                className="flex items-center gap-1.5 px-2 py-1 rounded-md text-[11px] font-semibold text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/10 hover:text-[#0B2F5E] dark:hover:text-white transition-colors cursor-pointer"
              >
                <IconHeading className="w-3.5 h-3.5 text-blue-700 dark:text-blue-400" strokeWidth={1.75} />
                <span>+ Titre</span>
              </button>
              <button
                type="button"
                onClick={() => addBlock("text")}
                title="Insérer un Paragraphe Markdown (Alt + 2)"
                className="flex items-center gap-1.5 px-2 py-1 rounded-md text-[11px] font-semibold text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/10 hover:text-[#0B2F5E] dark:hover:text-white transition-colors cursor-pointer"
              >
                <IconFileText className="w-3.5 h-3.5 text-slate-600 dark:text-slate-300" strokeWidth={1.75} />
                <span>+ Texte</span>
              </button>
              <button
                type="button"
                onClick={() => addBlock("code")}
                title="Insérer un Bloc de code (Alt + C)"
                className="flex items-center gap-1.5 px-2 py-1 rounded-md text-[11px] font-semibold text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/10 hover:text-[#0B2F5E] dark:hover:text-white transition-colors cursor-pointer"
              >
                <IconCode2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" strokeWidth={1.75} />
                <span>+ Code</span>
              </button>
              <button
                type="button"
                onClick={() => addBlock("quiz")}
                title="Insérer un Quiz QCM (Alt + Q)"
                className="flex items-center gap-1.5 px-2 py-1 rounded-md text-[11px] font-semibold text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/10 hover:text-[#0B2F5E] dark:hover:text-white transition-colors cursor-pointer"
              >
                <IconHelpCircle className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400" strokeWidth={1.75} />
                <span>+ Quiz</span>
              </button>
            </div>
          </div>

          {/* Centre : Recherche « Que souhaitez-vous faire ? » */}
          <div className="relative flex-1 max-w-xs sm:max-w-md mx-2">
            <div className="relative">
              <input
                value={ribbonSearch}
                onChange={(e) => setRibbonSearch(e.target.value)}
                placeholder="Que souhaitez-vous faire ? (ex : quiz, code...)"
                className="w-full text-xs px-2.5 py-1.5 pl-8 rounded-lg bg-white dark:bg-navy-dark border border-gray-200 dark:border-white/10 text-gray-900 dark:text-white placeholder:text-gray-400 focus:outline-none focus:border-[#0B2F5E] dark:focus:border-blue-400 transition-all"
              />
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400 dark:text-gray-500 pointer-events-none" strokeWidth={1.75} />
              {ribbonSearch && (
                <button
                  type="button"
                  onClick={() => setRibbonSearch("")}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 p-0.5"
                  title="Effacer la recherche"
                >
                  <IconX className="w-3 h-3" />
                </button>
              )}
            </div>

            {/* Menu flottant des résultats de commande */}
            {ribbonSearch.trim() && (
              <div className="absolute left-0 top-full mt-1.5 w-full bg-white dark:bg-navy border border-gray-200 dark:border-white/10 rounded-xl shadow-xl z-50 p-1.5 max-h-64 overflow-y-auto space-y-1">
                {searchedCommands.length === 0 ? (
                  <div className="p-3 text-center text-xs text-gray-400">
                    Aucune commande trouvée pour « {ribbonSearch} »
                  </div>
                ) : (
                  searchedCommands.map((cmd) => (
                    <button
                      key={cmd.id}
                      type="button"
                      onClick={cmd.action}
                      className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-left text-xs hover:bg-[#0B2F5E]/5 dark:hover:bg-white/10 transition-colors group cursor-pointer"
                    >
                      <cmd.icon className="w-4 h-4 text-[#0B2F5E] dark:text-blue-300 group-hover:scale-110 shrink-0" strokeWidth={1.75} />
                      <div className="flex-1 min-w-0">
                        <p className="font-bold text-gray-800 dark:text-gray-200 group-hover:text-[#0B2F5E] dark:group-hover:text-blue-300 truncate">
                          {cmd.label}
                        </p>
                        <p className="text-[10px] text-gray-400 truncate">{cmd.desc}</p>
                      </div>
                      <span className="text-[10px] font-semibold text-[#0B2F5E] dark:text-blue-300 opacity-0 group-hover:opacity-100">
                        Exécuter ↵
                      </span>
                    </button>
                  ))
                )}
              </div>
            )}
          </div>

          {/* Droite : Toggle Mode, Bouton Publier & Réduire */}
          <div className="flex items-center gap-2 shrink-0">
            <div className="flex items-center gap-1 bg-gray-200/70 dark:bg-white/10 p-0.5 rounded-lg">
              <button
                type="button"
                onClick={() => setViewMode("edit")}
                className={`px-2.5 py-1 rounded-md text-[11px] font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                  viewMode === "edit"
                    ? "bg-white dark:bg-navy text-[#0B2F5E] dark:text-blue-300 shadow-2xs"
                    : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                }`}
              >
                <Edit3 className={`w-3.5 h-3.5 shrink-0 ${viewMode === "edit" ? "text-[#0B2F5E] dark:text-blue-300" : "text-gray-500 dark:text-gray-400"}`} strokeWidth={1.75} />
                <span className="hidden sm:inline">Édition ({blocks.length})</span>
              </button>
              <button
                type="button"
                onClick={() => setViewMode("preview")}
                className={`px-2.5 py-1 rounded-md text-[11px] font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                  viewMode === "preview"
                    ? "bg-white dark:bg-navy text-[#0B2F5E] dark:text-blue-300 shadow-2xs"
                    : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                }`}
              >
                <Eye className={`w-3.5 h-3.5 shrink-0 ${viewMode === "preview" ? "text-[#0B2F5E] dark:text-blue-300" : "text-gray-500 dark:text-gray-400"}`} strokeWidth={1.75} />
                <span className="hidden sm:inline">Aperçu</span>
              </button>
            </div>

            {/* Option pour retirer ou afficher les contours du feed */}
            <button
              type="button"
              onClick={() => setShowFeedBorders((prev) => !prev)}
              title={showFeedBorders ? "Retirer les contours du feed" : "Afficher les contours du feed"}
              className={`px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 border ${
                !showFeedBorders
                  ? "bg-[#0B2F5E]/10 dark:bg-white/10 text-[#0B2F5E] dark:text-blue-300 border-[#0B2F5E]/30 dark:border-blue-400/30 shadow-2xs"
                  : "bg-white dark:bg-navy text-gray-700 dark:text-gray-300 border-gray-200 dark:border-white/10 hover:border-gray-300"
              }`}
            >
              {showFeedBorders ? (
                <>
                  <Square className="w-3.5 h-3.5 text-gray-500" />
                  <span className="hidden sm:inline">Avec contours</span>
                </>
              ) : (
                <>
                  <SquareDashed className="w-3.5 h-3.5 text-[#0B2F5E] dark:text-blue-300" />
                  <span className="hidden sm:inline font-extrabold">Sans contours</span>
                </>
              )}
            </button>

            {/* Option Sommaire Dynamique (Flanc Gauche / Droit / Masqué) */}
            <div className="flex items-center rounded-lg border border-gray-200 dark:border-white/10 bg-white dark:bg-navy p-0.5">
              <button
                type="button"
                onClick={() => setTocPlacement((curr) => curr === "left" ? "none" : "left")}
                title={tocPlacement === "left" ? "Masquer le sommaire" : "Afficher le Sommaire en Haut à Gauche"}
                className={`px-2 py-1 rounded-md text-xs font-bold transition-all cursor-pointer flex items-center gap-1 ${
                  tocPlacement === "left"
                    ? "bg-[#0B2F5E] text-white shadow-2xs"
                    : "text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
                }`}
              >
                <ListTree className="w-3.5 h-3.5" strokeWidth={1.8} />
                <span className="hidden md:inline">Sommaire</span>
                <span className="text-[10px] hidden sm:inline">(G)</span>
              </button>
              <button
                type="button"
                onClick={() => setTocPlacement((curr) => curr === "right" ? "none" : "right")}
                title={tocPlacement === "right" ? "Masquer le sommaire" : "Afficher le Sommaire en Haut à Droite"}
                className={`px-1.5 py-1 rounded-md text-[11px] font-bold transition-all cursor-pointer ${
                  tocPlacement === "right"
                    ? "bg-[#0B2F5E] text-white shadow-2xs"
                    : "text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-white"
                }`}
              >
                (D)
              </button>
            </div>

            {/* Bouton d'accès direct Égaliseur Word dans le Dock */}
            <button
              type="button"
              onClick={() => {
                setActiveRibbonTab("equalizer");
                if (ribbonCollapsed) setRibbonCollapsed(false);
              }}
              title="Ouvrir l'Espace d'Interprétation & Égaliseur Word dans le ruban"
              className={`px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 border ${
                activeRibbonTab === "equalizer" && !ribbonCollapsed
                  ? "bg-[#0B2F5E] text-white border-[#0B2F5E] shadow-2xs"
                  : "bg-white dark:bg-navy text-[#0B2F5E] dark:text-blue-300 border-gray-200 dark:border-white/10 hover:border-primary/40 hover:bg-gray-50 dark:hover:bg-white/5"
              }`}
            >
              <IconWand className="w-3.5 h-3.5 text-amber-500" />
              <span className="hidden sm:inline font-bold">Égaliseur</span>
            </button>

            <button
              type="button"
              onClick={publish}
              disabled={saving || !title.trim()}
              className="bg-primary hover:bg-primary-dark text-white px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all shadow-2xs flex items-center gap-1.5 disabled:opacity-50 cursor-pointer"
            >
              {saving ? (
                <>
                  <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Publication...</span>
                </>
              ) : (
                <>
                  <span>Publier</span>
                  <span>→</span>
                </>
              )}
            </button>

            {/* Chevron de réduction du ruban */}
            <button
              type="button"
              onClick={() => setRibbonCollapsed((prev) => !prev)}
              title={ribbonCollapsed ? "Déplier le ruban (Ctrl + F1)" : "Réduire le ruban (Ctrl + F1)"}
              className="p-1.5 rounded-md hover:bg-gray-200/60 dark:hover:bg-white/10 text-gray-500 hover:text-gray-900 dark:hover:text-white transition-colors cursor-pointer"
            >
              {ribbonCollapsed ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Notification d'égalisation intégrée au Dock */}
        {equalizerMessage && (
          <div className="mx-3 mt-1.5 px-3 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-800 dark:text-emerald-300 text-xs font-bold flex items-center justify-between animate-in fade-in slide-in-from-top-1 duration-200">
            <div className="flex items-center gap-2">
              <IconCheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
              <span>{equalizerMessage}</span>
            </div>
            <button
              type="button"
              onClick={() => setEqualizerMessage(null)}
              className="text-emerald-700 hover:text-emerald-900 dark:hover:text-white p-0.5"
            >
              <IconX className="w-3 h-3" />
            </button>
          </div>
        )}

        {/* LIGNE DES ONGLETS WORD (ACCUEIL, INSERTION, ÉVALUATION, SYNTHÈSE, ÉGALISEUR, AFFICHAGE) */}
        <div className="flex items-center gap-1 px-3 pt-1 border-b border-gray-200 dark:border-white/10 bg-gray-100/60 dark:bg-white/5 overflow-x-auto scrollbar-none select-none">
          {RIBBON_TABS.map((tab) => {
            const isActive = activeRibbonTab === tab.key;
            return (
              <button
                key={tab.key}
                type="button"
                onClick={() => {
                  setActiveRibbonTab(tab.key);
                  if (ribbonCollapsed) setRibbonCollapsed(false);
                }}
                onDoubleClick={() => setRibbonCollapsed((prev) => !prev)}
                className={`px-4 py-2 text-xs font-semibold rounded-t-lg transition-all shrink-0 cursor-pointer border-b-2 ${
                  isActive
                    ? "bg-white dark:bg-navy text-[#0B2F5E] dark:text-white border-[#0B2F5E] dark:border-blue-400 font-bold -mb-[1px]"
                    : "border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-white/50 dark:hover:bg-white/5"
                }`}
                title="Double-cliquez pour réduire/déplier le ruban"
              >
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* CORPS DU RUBAN : GROUPES LIBELLÉS & BOUTONS ACTION (SI DÉPLIÉ) */}
        {!ribbonCollapsed && (
          <div className="p-2 sm:p-2.5 bg-white dark:bg-navy flex items-stretch gap-1 overflow-x-auto scrollbar-thin">
            
            {/* ── ONGLET 1 : ACCUEIL ── */}
            {activeRibbonTab === "home" && (
              <>
                {/* Groupe Presse-papiers / Organisation */}
                <RibbonGroup label="Organisation">
                  <RibbonLargeButton
                    icon={Copy}
                    iconColor="text-slate-600 dark:text-slate-300"
                    label="Dupliquer"
                    shortcut="Ctrl+D"
                    onClick={duplicateSelected}
                    disabled={!selectedBlockId}
                  />
                  <div className="flex flex-col justify-center gap-1">
                    <RibbonSmallButton
                      icon={ArrowUp}
                      iconColor="text-slate-500 dark:text-slate-400"
                      label="Monter"
                      shortcut="Alt+↑"
                      onClick={() => moveSelected("up")}
                      disabled={!selectedBlockId}
                    />
                    <RibbonSmallButton
                      icon={ArrowDown}
                      iconColor="text-slate-500 dark:text-slate-400"
                      label="Descendre"
                      shortcut="Alt+↓"
                      onClick={() => moveSelected("down")}
                      disabled={!selectedBlockId}
                    />
                  </div>
                  <RibbonLargeButton
                    icon={Trash2}
                    label="Supprimer"
                    shortcut="Suppr"
                    onClick={removeSelected}
                    disabled={!selectedBlockId}
                    destructive
                  />
                </RibbonGroup>

                {/* Groupe Police & Typographie (Style Microsoft Word) */}
                <RibbonGroup label="Police">
                  <div className="flex flex-col justify-center gap-1.5 min-w-[210px]">
                    {/* Ligne 1 : Sélecteur de Police & Sélecteur de Taille */}
                    <div className="flex items-center gap-1.5">
                      <select
                        value={courseFont}
                        onChange={(e) => setCourseFont(e.target.value as FontFamilyKey)}
                        className="text-xs font-medium px-2 py-1 rounded-md border border-gray-200 dark:border-white/10 bg-white dark:bg-navy-dark text-gray-800 dark:text-gray-100 hover:border-gray-300 dark:hover:border-white/20 focus:outline-none focus:ring-1 focus:ring-primary h-7 flex-1 min-w-[125px] cursor-pointer"
                        title="Police de texte du cours"
                      >
                        {FONT_FAMILIES.map((f) => (
                          <option key={f.key} value={f.key}>
                            {f.label}
                          </option>
                        ))}
                      </select>

                      <select
                        value={courseFontSize}
                        onChange={(e) => setCourseFontSize(Number(e.target.value))}
                        className="text-xs font-semibold px-1 py-1 rounded-md border border-gray-200 dark:border-white/10 bg-white dark:bg-navy-dark text-gray-800 dark:text-gray-100 hover:border-gray-300 dark:hover:border-white/20 focus:outline-none focus:ring-1 focus:ring-primary h-7 w-14 text-center shrink-0 cursor-pointer"
                        title="Taille de police (px)"
                      >
                        {FONT_SIZES.map((sz) => (
                          <option key={sz} value={sz}>
                            {sz}
                          </option>
                        ))}
                      </select>

                      <button
                        type="button"
                        onMouseDown={(e) => e.preventDefault()}
                        onClick={() => setCourseFontSize((prev) => Math.min(28, prev + 1))}
                        title="Agrandir la taille de police (A+)"
                        className="p-1 h-7 w-7 rounded-md border border-gray-200 dark:border-white/10 hover:bg-gray-100 dark:hover:bg-white/10 text-gray-700 dark:text-gray-200 font-bold text-xs flex items-center justify-center cursor-pointer transition-colors"
                      >
                        <span className="text-[11px] font-extrabold flex items-center">A<span className="text-[9px] font-black leading-none text-primary dark:text-blue-400">▲</span></span>
                      </button>

                      <button
                        type="button"
                        onMouseDown={(e) => e.preventDefault()}
                        onClick={() => setCourseFontSize((prev) => Math.max(12, prev - 1))}
                        title="Réduire la taille de police (A-)"
                        className="p-1 h-7 w-7 rounded-md border border-gray-200 dark:border-white/10 hover:bg-gray-100 dark:hover:bg-white/10 text-gray-700 dark:text-gray-200 font-bold text-xs flex items-center justify-center cursor-pointer transition-colors"
                      >
                        <span className="text-[11px] font-extrabold flex items-center">A<span className="text-[9px] font-black leading-none text-gray-500">▼</span></span>
                      </button>
                    </div>

                    {/* Ligne 2 : Boutons rapides Gras, Italique, Souligné, Code, Surlignage */}
                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onMouseDown={(e) => e.preventDefault()}
                        onClick={() => applyFormatting("bold")}
                        title="Mettre en gras (Ctrl + B / **texte**)"
                        className="p-1 rounded-md hover:bg-gray-100 dark:hover:bg-white/10 text-gray-700 dark:text-gray-200 transition-colors cursor-pointer w-6 h-6 flex items-center justify-center hover:text-primary"
                      >
                        <IconBold className="w-3.5 h-3.5" strokeWidth={2.5} />
                      </button>
                      <button
                        type="button"
                        onMouseDown={(e) => e.preventDefault()}
                        onClick={() => applyFormatting("italic")}
                        title="Mettre en italique (Ctrl + I / *texte*)"
                        className="p-1 rounded-md hover:bg-gray-100 dark:hover:bg-white/10 text-gray-700 dark:text-gray-200 transition-colors cursor-pointer w-6 h-6 flex items-center justify-center hover:text-primary"
                      >
                        <IconItalic className="w-3.5 h-3.5" strokeWidth={2} />
                      </button>
                      <button
                        type="button"
                        onMouseDown={(e) => e.preventDefault()}
                        onClick={() => applyFormatting("underline")}
                        title="Souligner (Ctrl + U / <u>texte</u>)"
                        className="p-1 rounded-md hover:bg-gray-100 dark:hover:bg-white/10 text-gray-700 dark:text-gray-200 transition-colors cursor-pointer w-6 h-6 flex items-center justify-center hover:text-primary"
                      >
                        <IconUnderline className="w-3.5 h-3.5" strokeWidth={2} />
                      </button>
                      <div className="w-[1px] h-3.5 bg-gray-200 dark:bg-white/10 mx-0.5" />
                      <button
                        type="button"
                        onMouseDown={(e) => e.preventDefault()}
                        onClick={() => applyFormatting("code")}
                        title="Code inline (`code`)"
                        className="p-1 rounded-md hover:bg-gray-100 dark:hover:bg-white/10 text-gray-700 dark:text-gray-200 transition-colors cursor-pointer w-6 h-6 flex items-center justify-center hover:text-primary"
                      >
                        <IconCode2 className="w-3.5 h-3.5" strokeWidth={2} />
                      </button>
                      <button
                        type="button"
                        onMouseDown={(e) => e.preventDefault()}
                        onClick={() => applyFormatting("highlight")}
                        title="Surligner en jaune (==texte==)"
                        className="p-1 rounded-md hover:bg-gray-100 dark:hover:bg-white/10 text-gray-700 dark:text-gray-200 transition-colors cursor-pointer w-6 h-6 flex items-center justify-center hover:text-amber-500"
                      >
                        <IconHighlighter className="w-3.5 h-3.5" strokeWidth={2} />
                      </button>
                    </div>
                  </div>
                </RibbonGroup>

                {/* Groupe Blocs de texte */}
                <RibbonGroup label="Blocs de texte">
                  <RibbonLargeButton
                    icon={IconHeading}
                    iconColor="text-blue-700 dark:text-blue-400"
                    label="Titre section"
                    shortcut="Alt+1"
                    onClick={() => addBlock("heading")}
                  />
                  <RibbonLargeButton
                    icon={IconFileText}
                    iconColor="text-slate-600 dark:text-slate-300"
                    label="Texte Markdown"
                    shortcut="Alt+2"
                    onClick={() => addBlock("text")}
                  />
                  <RibbonLargeButton
                    icon={IconQuote}
                    iconColor="text-amber-700 dark:text-amber-400"
                    label="Citation"
                    shortcut="Alt+3"
                    onClick={() => addBlock("quote")}
                  />
                </RibbonGroup>

                {/* Groupe Pédagogie */}
                <RibbonGroup label="Pédagogie">
                  <RibbonLargeButton
                    icon={IconLightbulb}
                    iconColor="text-amber-500 dark:text-amber-400"
                    label="Encadré astuce"
                    shortcut="Alt+4"
                    onClick={() => addBlock("callout")}
                  />
                  <RibbonLargeButton
                    icon={IconHistory}
                    iconColor="text-amber-700 dark:text-amber-300"
                    label="Point d'histoire"
                    shortcut="Alt+H"
                    onClick={() => addBlock("history")}
                  />
                  <RibbonLargeButton
                    icon={IconMinus}
                    iconColor="text-gray-400 dark:text-gray-500"
                    label="Séparateur"
                    shortcut="Alt+5"
                    onClick={() => addBlock("divider")}
                  />
                </RibbonGroup>

                {/* Groupe Styles & Niveaux */}
                <RibbonGroup label="Styles rapides">
                  <div className="flex flex-col justify-center gap-1">
                    <RibbonSmallButton
                      icon={IconHeading}
                      iconColor="text-blue-700 dark:text-blue-400"
                      label="Titre H2 (Section)"
                      onClick={() => addBlock("heading")}
                    />
                    <RibbonSmallButton
                      icon={IconHeading}
                      iconColor="text-blue-600 dark:text-blue-400"
                      label="Sous-titre H3"
                      onClick={() => addBlock("heading-h3")}
                    />
                  </div>
                </RibbonGroup>

                {/* Groupe Égaliseur rapide */}
                <RibbonGroup label="Égaliseur">
                  <div className="flex flex-col justify-center gap-1">
                    <RibbonSmallButton
                      icon={IconType}
                      iconColor="text-primary dark:text-blue-400"
                      label="Égaliser police"
                      onClick={() => equalizeTypography()}
                    />
                    <RibbonSmallButton
                      icon={IconAlignLeft}
                      iconColor="text-emerald-600 dark:text-emerald-400"
                      label="Égaliser sauts"
                      onClick={equalizeSpacing}
                    />
                  </div>
                  <div className="flex flex-col justify-center gap-1">
                    <RibbonSmallButton
                      icon={IconHeading}
                      iconColor="text-indigo-600 dark:text-indigo-400"
                      label="Numéroter titres"
                      onClick={equalizeHeadings}
                    />
                    <RibbonSmallButton
                      icon={IconWand}
                      iconColor="text-amber-600 dark:text-amber-400"
                      label="Nettoyer balises"
                      onClick={equalizeMarkup}
                    />
                  </div>
                </RibbonGroup>
              </>
            )}

            {/* ── ONGLET 2 : INSERTION ── */}
            {activeRibbonTab === "insert" && (
              <>
                {/* Groupe Code & Données */}
                <RibbonGroup label="Code & Données">
                  <RibbonLargeButton
                    icon={IconCode2}
                    iconColor="text-emerald-600 dark:text-emerald-400"
                    label="Code interactif"
                    shortcut="Alt+C"
                    onClick={() => addBlock("code")}
                  />
                  <RibbonLargeButton
                    icon={IconSigma}
                    iconColor="text-indigo-600 dark:text-indigo-400"
                    label="Formule LaTeX"
                    shortcut="Alt+M"
                    onClick={() => addBlock("math")}
                  />
                  <RibbonLargeButton
                    icon={IconTable}
                    iconColor="text-sky-600 dark:text-sky-400"
                    label="Tableau"
                    shortcut="Alt+T"
                    onClick={() => addBlock("table")}
                  />
                  <RibbonLargeButton
                    icon={IconDatabase}
                    iconColor="text-teal-600 dark:text-teal-400"
                    label="Dataset"
                    shortcut="Alt+D"
                    onClick={() => addBlock("dataset")}
                  />
                </RibbonGroup>

                {/* Groupe Médias & Web */}
                <RibbonGroup label="Médias & Web">
                  <RibbonLargeButton
                    icon={IconPlay}
                    iconColor="text-rose-600 dark:text-rose-400"
                    label="Vidéo YouTube"
                    shortcut="Alt+V"
                    onClick={() => addBlock("video")}
                  />
                  <RibbonLargeButton
                    icon={ImageIcon}
                    iconColor="text-amber-600 dark:text-amber-400"
                    label="Schéma / Image"
                    shortcut="Alt+I"
                    onClick={() => addBlock("image")}
                  />
                  <RibbonLargeButton
                    icon={IconMic}
                    iconColor="text-violet-600 dark:text-violet-400"
                    label="Capsule Audio"
                    shortcut="Alt+A"
                    onClick={() => addBlock("audio")}
                  />
                  <RibbonLargeButton
                    icon={IconExternalLink}
                    iconColor="text-blue-600 dark:text-blue-400"
                    label="App / Iframe"
                    shortcut="Alt+E"
                    onClick={() => addBlock("embed")}
                  />
                </RibbonGroup>

                {/* Groupe Récits & Équipe */}
                <RibbonGroup label="Récits & Auteurs">
                  <RibbonLargeButton
                    icon={IconHistory}
                    iconColor="text-amber-700 dark:text-amber-300"
                    label="Point d'histoire"
                    shortcut="Alt+H"
                    onClick={() => addBlock("history")}
                  />
                  <RibbonLargeButton
                    icon={IconAuthor}
                    iconColor="text-[#0B2F5E] dark:text-blue-300"
                    label="Fiche Auteurs"
                    shortcut="Alt+U"
                    onClick={() => addBlock("author")}
                  />
                </RibbonGroup>
              </>
            )}

            {/* ── ONGLET 3 : ÉVALUATION ── */}
            {activeRibbonTab === "eval" && (
              <>
                {/* Groupe Questions & Quiz */}
                <RibbonGroup label="Questions & Quiz">
                  <RibbonLargeButton
                    icon={IconHelpCircle}
                    iconColor="text-purple-600 dark:text-purple-400"
                    label="Question QCM"
                    shortcut="Alt+Q"
                    onClick={() => addBlock("quiz")}
                  />
                  <RibbonLargeButton
                    icon={IconCheckCheck}
                    iconColor="text-teal-600 dark:text-teal-400"
                    label="Question V/F"
                    shortcut="Alt+F"
                    onClick={() => addBlock("truefalse")}
                  />
                </RibbonGroup>

                {/* Groupe Pratique & Mémorisation */}
                <RibbonGroup label="Pratique & Mémorisation">
                  <RibbonLargeButton
                    icon={IconCheckSquare}
                    iconColor="text-blue-600 dark:text-blue-400"
                    label="Exercice & Sol."
                    shortcut="Alt+X"
                    onClick={() => addBlock("exercise")}
                  />
                  <RibbonLargeButton
                    icon={LucideSparkles}
                    iconColor="text-amber-500 dark:text-amber-400"
                    label="Flashcard"
                    shortcut="Alt+K"
                    onClick={() => addBlock("flashcard")}
                  />
                </RibbonGroup>
              </>
            )}

            {/* ── ONGLET 4 : SYNTHÈSE ── */}
            {activeRibbonTab === "summary" && (
              <>
                {/* Groupe Récapitulatif */}
                <RibbonGroup label="Récapitulatif">
                  <RibbonLargeButton
                    icon={IconStar}
                    iconColor="text-amber-500 dark:text-amber-400"
                    label="Points clés"
                    shortcut="Alt+S"
                    onClick={() => addBlock("summary")}
                  />
                  <RibbonLargeButton
                    icon={IconLibrary}
                    iconColor="text-sky-600 dark:text-sky-400"
                    label="Ressources"
                    shortcut="Alt+R"
                    onClick={() => addBlock("resources")}
                  />
                </RibbonGroup>

                {/* Groupe Équipe enseignante */}
                <RibbonGroup label="Équipe enseignante">
                  <RibbonLargeButton
                    icon={IconAuthor}
                    iconColor="text-[#0B2F5E] dark:text-blue-300"
                    label="Auteurs cours"
                    shortcut="Alt+U"
                    onClick={() => addBlock("author")}
                  />
                </RibbonGroup>

                {/* Groupe Document */}
                <RibbonGroup label="Document">
                  <RibbonLargeButton
                    icon={Save}
                    iconColor="text-emerald-600 dark:text-emerald-400"
                    label="Publier cours"
                    shortcut="Ctrl+S"
                    onClick={publish}
                  />
                  <RibbonLargeButton
                    icon={FileDown}
                    iconColor="text-slate-600 dark:text-slate-400"
                    label="Fiche synthétique"
                    shortcut="Ctrl+P"
                    onClick={() => window.print()}
                  />
                </RibbonGroup>
              </>
            )}

            {/* ── ONGLET 5 : ÉGALISEUR & INTERPRÉTATION DANS LE DOCK ── */}
            {activeRibbonTab === "equalizer" && (
              <>
                {/* Groupe 1 : Égaliseurs en 1 clic */}
                <RibbonGroup label="Égaliseurs en 1 clic">
                  <RibbonLargeButton
                    icon={IconType}
                    iconColor="text-primary dark:text-blue-400"
                    label="Égaliser police"
                    shortcut="Tout le cours"
                    onClick={() => equalizeTypography()}
                  />
                  <RibbonLargeButton
                    icon={IconAlignLeft}
                    iconColor="text-emerald-600 dark:text-emerald-400"
                    label="Égaliser sauts"
                    shortcut="Harmoniser"
                    onClick={equalizeSpacing}
                  />
                  <div className="flex flex-col justify-center gap-1">
                    <RibbonSmallButton
                      icon={IconHeading}
                      iconColor="text-indigo-600 dark:text-indigo-400"
                      label="Numéroter les titres"
                      onClick={equalizeHeadings}
                    />
                    <RibbonSmallButton
                      icon={IconWand}
                      iconColor="text-amber-600 dark:text-amber-400"
                      label="Purger balises orphelines"
                      onClick={equalizeMarkup}
                    />
                  </div>
                </RibbonGroup>

                {/* Groupe 2 : Interprétation & Conversion du bloc actif */}
                <RibbonGroup label="Bloc Actif">
                  <div className="flex flex-col justify-center gap-1 min-w-[220px] px-1">
                    <div className="flex items-center justify-between text-[11px] font-semibold">
                      <span className="text-gray-700 dark:text-gray-300 font-bold">
                        {activeBlockForInspection
                          ? `Bloc #${blocks.findIndex((b) => b.id === activeBlockForInspection.id) + 1} (${activeBlockForInspection.type})`
                          : "Sélectionnez un bloc"}
                      </span>
                      {activeBlockForInspection && (
                        <button
                          type="button"
                          onClick={() => setShowRawInspector((v) => !v)}
                          className={`text-[10px] font-bold px-2 py-0.5 rounded transition-colors cursor-pointer ${
                            showRawInspector
                              ? "bg-[#0B2F5E] text-white"
                              : "bg-gray-100 dark:bg-white/10 text-gray-700 dark:text-gray-300 hover:bg-gray-200"
                          }`}
                        >
                          {showRawInspector ? "Masquer code" : "Inspecter code"}
                        </button>
                      )}
                    </div>
                    {activeBlockForInspection ? (
                      <div className="flex items-center gap-1 pt-0.5">
                        <span className="text-[10px] text-gray-400 font-semibold mr-0.5">Convertir :</span>
                        <button
                          type="button"
                          onClick={() => convertBlockType(activeBlockForInspection.id, "heading")}
                          className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-gray-100 dark:bg-white/10 hover:bg-primary hover:text-white transition-colors cursor-pointer"
                          title="Convertir en Titre H2"
                        >
                          H2
                        </button>
                        <button
                          type="button"
                          onClick={() => convertBlockType(activeBlockForInspection.id, "heading-h3")}
                          className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-gray-100 dark:bg-white/10 hover:bg-primary hover:text-white transition-colors cursor-pointer"
                          title="Convertir en Sous-titre H3"
                        >
                          H3
                        </button>
                        <button
                          type="button"
                          onClick={() => convertBlockType(activeBlockForInspection.id, "text")}
                          className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-gray-100 dark:bg-white/10 hover:bg-primary hover:text-white transition-colors cursor-pointer"
                          title="Convertir en Texte Markdown"
                        >
                          Texte
                        </button>
                        <button
                          type="button"
                          onClick={() => convertBlockType(activeBlockForInspection.id, "callout")}
                          className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-gray-100 dark:bg-white/10 hover:bg-primary hover:text-white transition-colors cursor-pointer"
                          title="Convertir en Encadré Astuce"
                        >
                          Astuce
                        </button>
                        <button
                          type="button"
                          onClick={() => convertBlockType(activeBlockForInspection.id, "quote")}
                          className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-gray-100 dark:bg-white/10 hover:bg-primary hover:text-white transition-colors cursor-pointer"
                          title="Convertir en Citation"
                        >
                          Citation
                        </button>
                      </div>
                    ) : (
                      <p className="text-[10px] text-gray-400 italic">Cliquez sur un bloc pour l'interpréter</p>
                    )}
                  </div>
                </RibbonGroup>

                {/* Groupe 3 : Typographie Word */}
                <RibbonGroup label="Police & Taille">
                  <div className="flex flex-col justify-center gap-1.5 min-w-[200px]">
                    <div className="flex items-center gap-1.5">
                      <select
                        value={courseFont}
                        onChange={(e) => setCourseFont(e.target.value as FontFamilyKey)}
                        className="text-xs font-medium px-2 py-1 rounded-md border border-gray-200 dark:border-white/10 bg-white dark:bg-navy-dark text-gray-800 dark:text-gray-100 hover:border-gray-300 focus:outline-none focus:ring-1 focus:ring-primary h-7 flex-1 cursor-pointer"
                        title="Police globale du cours"
                      >
                        {FONT_FAMILIES.map((f) => (
                          <option key={f.key} value={f.key}>
                            {f.label}
                          </option>
                        ))}
                      </select>
                      <select
                        value={courseFontSize}
                        onChange={(e) => setCourseFontSize(Number(e.target.value))}
                        className="text-xs font-semibold px-1 py-1 rounded-md border border-gray-200 dark:border-white/10 bg-white dark:bg-navy-dark text-gray-800 dark:text-gray-100 hover:border-gray-300 focus:outline-none focus:ring-1 focus:ring-primary h-7 w-14 text-center shrink-0 cursor-pointer"
                        title="Taille de police (px)"
                      >
                        {FONT_SIZES.map((sz) => (
                          <option key={sz} value={sz}>
                            {sz}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onMouseDown={(e) => e.preventDefault()}
                        onClick={() => setCourseFontSize((prev) => Math.min(28, prev + 1))}
                        className="flex-1 py-1 px-2 rounded bg-gray-100 dark:bg-white/10 hover:bg-gray-200 text-xs font-bold text-gray-700 dark:text-gray-200 transition-colors cursor-pointer text-center"
                      >
                        A+ Agrandir
                      </button>
                      <button
                        type="button"
                        onMouseDown={(e) => e.preventDefault()}
                        onClick={() => setCourseFontSize((prev) => Math.max(12, prev - 1))}
                        className="flex-1 py-1 px-2 rounded bg-gray-100 dark:bg-white/10 hover:bg-gray-200 text-xs font-bold text-gray-700 dark:text-gray-200 transition-colors cursor-pointer text-center"
                      >
                        A- Réduire
                      </button>
                    </div>
                  </div>
                </RibbonGroup>

                {/* Groupe 4 : Mode Document Word & Métriques */}
                <RibbonGroup label="Mode Word">
                  <RibbonLargeButton
                    icon={IconFileText}
                    iconColor={isWordPageMode ? "text-emerald-600 dark:text-emerald-400" : "text-gray-400"}
                    label={isWordPageMode ? "Word Actif" : "Word Inactif"}
                    shortcut="Frappe directe"
                    isActive={isWordPageMode}
                    onClick={() => setIsWordPageMode((v) => !v)}
                  />
                  <div className="flex flex-col justify-center gap-1 px-1.5 text-[11px] font-semibold text-gray-600 dark:text-gray-300">
                    <div className="flex items-center gap-1.5">
                      <span className="text-[#0B2F5E] dark:text-blue-400 font-bold">{courseStats.words}</span>
                      <span>mots</span>
                      <span>•</span>
                      <span className="font-bold">{blocks.length}</span>
                      <span>blocs</span>
                    </div>
                    <div className="text-[10px] text-gray-400">
                      Temps de lecture : ~{courseStats.readingTime} min
                    </div>
                  </div>
                </RibbonGroup>
              </>
            )}

            {/* ── ONGLET 6 : AFFICHAGE ── */}
            {activeRibbonTab === "view" && (
              <>
                {/* Groupe Mode de vue */}
                <RibbonGroup label="Mode de vue">
                  <RibbonLargeButton
                    icon={Edit3}
                    iconColor="text-blue-700 dark:text-blue-400"
                    label="Mode Édition"
                    onClick={() => setViewMode("edit")}
                    isActive={viewMode === "edit"}
                  />
                  <RibbonLargeButton
                    icon={Eye}
                    iconColor="text-emerald-600 dark:text-emerald-400"
                    label="Aperçu Étudiant"
                    onClick={() => setViewMode("preview")}
                    isActive={viewMode === "preview"}
                  />
                </RibbonGroup>

                {/* Groupe Contours du feed */}
                <RibbonGroup label="Contours du feed">
                  <RibbonLargeButton
                    icon={showFeedBorders ? Square : SquareDashed}
                    iconColor="text-slate-600 dark:text-slate-300"
                    label={showFeedBorders ? "Avec contours" : "Sans contours"}
                    shortcut="Alt+B"
                    isActive={!showFeedBorders}
                    onClick={() => setShowFeedBorders((v) => !v)}
                  />
                  <div className="flex flex-col justify-center gap-1 px-1">
                    <button
                      type="button"
                      onClick={() => setShowFeedBorders(false)}
                      className={`text-[10px] font-bold px-2.5 py-1 rounded transition-colors ${!showFeedBorders ? "bg-[#0B2F5E] text-white shadow-2xs" : "bg-gray-100 dark:bg-white/10 text-gray-700 dark:text-gray-300 hover:bg-gray-200"}`}
                    >
                      Sans contours
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowFeedBorders(true)}
                      className={`text-[10px] font-bold px-2.5 py-1 rounded transition-colors ${showFeedBorders ? "bg-[#0B2F5E] text-white shadow-2xs" : "bg-gray-100 dark:bg-white/10 text-gray-700 dark:text-gray-300 hover:bg-gray-200"}`}
                    >
                      Avec contours
                    </button>
                  </div>
                </RibbonGroup>

                {/* Groupe Sommaire dynamique */}
                <RibbonGroup label="Sommaire dynamique">
                  <RibbonLargeButton
                    icon={ListTree}
                    iconColor="text-[#0B2F5E] dark:text-blue-300"
                    label={tocPlacement === "left" ? "Flanc Gauche" : tocPlacement === "right" ? "Flanc Droit" : "Sommaire Masqué"}
                    shortcut="Alt+O"
                    isActive={tocPlacement !== "none"}
                    onClick={() => setTocPlacement((curr) => curr === "none" ? "left" : "none")}
                  />
                  <div className="flex flex-col justify-center gap-1 px-1">
                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => setTocPlacement("left")}
                        className={`text-[10px] font-bold px-2 py-1 rounded transition-colors cursor-pointer ${
                          tocPlacement === "left"
                            ? "bg-[#0B2F5E] text-white shadow-2xs"
                            : "bg-gray-100 dark:bg-white/10 text-gray-700 dark:text-gray-300 hover:bg-gray-200"
                        }`}
                        title="Positionner en haut à gauche (Flanc extérieur gauche)"
                      >
                        Haut Gauche
                      </button>
                      <button
                        type="button"
                        onClick={() => setTocPlacement("right")}
                        className={`text-[10px] font-bold px-2 py-1 rounded transition-colors cursor-pointer ${
                          tocPlacement === "right"
                            ? "bg-[#0B2F5E] text-white shadow-2xs"
                            : "bg-gray-100 dark:bg-white/10 text-gray-700 dark:text-gray-300 hover:bg-gray-200"
                        }`}
                        title="Positionner en haut à droite (Flanc extérieur droit)"
                      >
                        Haut Droit
                      </button>
                    </div>
                    <button
                      type="button"
                      onClick={() => setTocPlacement("none")}
                      className={`text-[10px] font-bold px-2 py-1 rounded transition-colors cursor-pointer ${
                        tocPlacement === "none"
                          ? "bg-gray-200 dark:bg-white/20 text-gray-800 dark:text-gray-200"
                          : "bg-gray-50 dark:bg-white/5 text-gray-500 hover:bg-gray-100 hover:text-danger"
                      }`}
                      title="Masquer le sommaire"
                    >
                      {tocPlacement === "none" ? "Masqué" : "Masquer"} ({tocItems.length} repères)
                    </button>
                  </div>
                </RibbonGroup>

                {/* Groupe Structure du cours */}
                <RibbonGroup label="Structure du cours">
                  <div className="flex flex-col justify-center gap-1.5 px-2">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-gray-700 dark:text-gray-300">
                      <ListTree className="w-4 h-4 text-[#0B2F5E] dark:text-blue-400" strokeWidth={1.75} />
                      <span>{blocks.length} blocs au total</span>
                    </div>
                    <span className="text-[10px] text-gray-400">
                      {selectedBlockId ? `Bloc actif : #${blocks.findIndex((b) => b.id === selectedBlockId) + 1}` : "Aucun bloc sélectionné"}
                    </span>
                  </div>
                </RibbonGroup>
              </>
            )}

          </div>
        )}

        {/* Tiroir d'inspection du balisage brut du bloc actif dans le dock */}
        {showRawInspector && activeBlockForInspection && (
          <div className="border-t border-gray-200 dark:border-white/10 bg-gray-900 p-3 text-xs text-gray-200 space-y-2 animate-in fade-in duration-150 rounded-b-xl">
            <div className="flex items-center justify-between">
              <span className="font-bold text-emerald-400 flex items-center gap-1.5 font-mono">
                <IconCode2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>Balisage structuré du bloc #{activeBlockForInspection.id} ({activeBlockForInspection.type})</span>
              </span>
              <button
                type="button"
                onClick={() => setShowRawInspector(false)}
                className="text-gray-400 hover:text-white text-[11px] font-semibold cursor-pointer p-0.5"
              >
                Fermer ✕
              </button>
            </div>
            <pre className="font-mono text-[11px] p-2 bg-gray-950 rounded-lg overflow-x-auto whitespace-pre-wrap max-h-40 leading-relaxed text-emerald-400 border border-gray-800">
              {JSON.stringify(activeBlockForInspection.content, null, 2)}
            </pre>
          </div>
        )}
      </div>

      {/* Titre & métadonnées du cours */}
      <div className={`w-full bg-white dark:bg-navy rounded-xl p-5 sm:p-6 space-y-5 transition-all ${
        showFeedBorders
          ? "border border-gray-200/60 dark:border-white/5 shadow-2xs"
          : "border-0 shadow-none"
      }`}>
        <div>
          <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
            Titre principal du cours *
          </label>
          <input
            value={title}
            onChange={(e) => handleTitleChange(e.target.value)}
            placeholder="Ex : Apprentissage Profond & Réseaux de Neurones..."
            className="w-full text-xl sm:text-2xl font-extrabold text-gray-900 dark:text-white bg-transparent border-b-2 border-gray-200/80 dark:border-white/10 focus:border-[#0B2F5E] focus:outline-none py-1.5 transition-colors placeholder:text-gray-300 dark:placeholder:text-gray-600"
          />
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-2">
          <Field label="Catégorie">
            <select value={category} onChange={(e) => setCategory(e.target.value)} className={SEL}>
              {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
            </select>
          </Field>
          <Field label="Niveau">
            <select value={level} onChange={(e) => setLevel(e.target.value)} className={SEL}>
              {LEVELS.map((l) => <option key={l}>{l}</option>)}
            </select>
          </Field>
          <Field label="Établissement">
            <select value={school} onChange={(e) => setSchool(e.target.value)} className={SEL}>
              {SCHOOLS.map((s) => <option key={s}>{s}</option>)}
            </select>
          </Field>
          <Field label="Niveau d'accès">
            <select value={access} onChange={(e) => setAccess(e.target.value)} className={SEL}>
              <option value="public">Ouvert à tous</option>
              <option value="hiparis">Étudiants Hi! PARIS</option>
              <option value="cohort">Cohorte restreinte</option>
            </select>
          </Field>
        </div>
      </div>

      {error && (
        <div className="bg-danger/10 border border-danger/30 text-danger text-sm rounded-xl p-4 flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" strokeWidth={1.8} />
          <span>{error}</span>
        </div>
      )}

      {/* ── MODE 1 : ÉDITION ── */}
      {viewMode === "edit" ? (
        <div className="w-full relative space-y-6">
          {/* FLANC EXTÉRIEUR GAUCHE EN MODE ÉDITION (Positionné à l'extérieur des limites du dock, toujours visible) */}
          {tocPlacement === "left" && (
            <aside className="hidden min-[1540px]:block absolute right-[calc(100%+1.5rem)] top-0 bottom-0 w-72 2xl:w-80 z-20 pointer-events-none">
              <div className="sticky top-[160px] pointer-events-auto">
                {renderTableOfContents()}
              </div>
            </aside>
          )}

          {/* Sommaire responsive sur écrans compacts (< 1540px) */}
          {tocPlacement !== "none" && (
            <div className="block min-[1540px]:hidden">
              {renderTableOfContents()}
            </div>
          )}

          {/* LISTE PLEINE LARGEUR DES BLOCS DU COURS (OUVERTE & SANS BORDURES ENCOMBRANTES) */}
          <div className="w-full space-y-4">
            {blocks.map((block, index) => {
              const def = ALL_BLOCK_TYPES.find((b) => b.type === block.type);
              return (
                <div
                  key={block.id}
                  id={`block-${block.id}`}
                  onClick={() => setSelectedBlockId(block.id)}
                  className={`w-full bg-white dark:bg-navy rounded-xl p-5 sm:p-6 transition-all group scroll-mt-48 ${
                    selectedBlockId === block.id
                      ? "ring-2 ring-[#0B2F5E] dark:ring-blue-400 shadow-md border border-[#0B2F5E]/20"
                      : showFeedBorders
                      ? "border border-gray-100 dark:border-white/5 hover:border-gray-200 dark:hover:border-white/15 shadow-2xs"
                      : "border-0 shadow-none hover:bg-gray-50/50 dark:hover:bg-white/5"
                  }`}
                >
                  {/* Header du bloc */}
                  <div className={`flex items-center justify-between gap-2 mb-3 pb-2.5 ${
                    showFeedBorders ? "border-b border-gray-100 dark:border-white/5" : ""
                  }`}>
                    <div className="flex items-center gap-2">
                      <span
                        className={`w-5 h-5 rounded-full text-[11px] font-bold flex items-center justify-center ${
                          selectedBlockId === block.id
                            ? "bg-[#0B2F5E] text-white"
                            : "bg-primary/10 text-primary"
                        }`}
                      >
                        {index + 1}
                      </span>
                      {(() => {
                        const BIcon = BLOCK_ICONS[block.type] ?? IconFileText;
                        return (
                          <span className="w-6 h-6 rounded-md bg-gray-100 dark:bg-white/10 flex items-center justify-center text-gray-700 dark:text-gray-300 shrink-0">
                            <BIcon className="w-3.5 h-3.5" strokeWidth={1.75} />
                          </span>
                        );
                      })()}
                      <span className="text-xs font-bold text-gray-800 dark:text-gray-200 uppercase tracking-wide">
                        {def?.label ?? block.type}
                      </span>
                      {selectedBlockId === block.id && (
                        <span className="text-[10px] font-semibold bg-[#0B2F5E]/10 text-[#0B2F5E] dark:bg-white/10 dark:text-blue-300 px-2 py-0.5 rounded-full">
                          Bloc actif
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => move(block.id, "up")}
                        title="Monter le bloc"
                        disabled={index === 0}
                        className="p-1.5 text-xs text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-white/10 rounded-lg transition-colors disabled:opacity-20 cursor-pointer"
                      >
                        <ChevronUp className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => move(block.id, "down")}
                        title="Descendre le bloc"
                        disabled={index === blocks.length - 1}
                        className="p-1.5 text-xs text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-white/10 rounded-lg transition-colors disabled:opacity-20 cursor-pointer"
                      >
                        <ChevronDown className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => duplicateBlock(block.id)}
                        className="inline-flex items-center gap-1 px-2 py-1 text-xs text-gray-500 hover:text-primary hover:bg-primary/5 rounded-lg transition-colors cursor-pointer"
                      >
                        <Copy className="w-3 h-3" />
                        <span>Dupliquer</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => removeBlock(block.id)}
                        className="inline-flex items-center gap-1 px-2 py-1 text-xs text-danger hover:bg-danger/10 rounded-lg transition-colors font-medium ml-1 cursor-pointer"
                      >
                        <Trash2 className="w-3 h-3" />
                        <span>Supprimer</span>
                      </button>
                    </div>
                  </div>

                  {/* Badge de repérage et quadrillage de la div */}
                  {showDebugGrid && (
                    <div className="flex flex-wrap items-center justify-between gap-1 text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-md bg-indigo-500/10 dark:bg-white/10 text-indigo-900 dark:text-indigo-300 border border-indigo-400/30 mb-3 select-none">
                      <div className="flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-indigo-600 animate-pulse" />
                        <LayoutGrid className="w-3 h-3 text-indigo-600 dark:text-indigo-400 shrink-0" />
                        <span>DIV #{index + 1} : {def?.label || block.type}</span>
                      </div>
                      <span className="font-mono bg-white dark:bg-navy px-1.5 py-0.5 rounded border border-indigo-200 dark:border-white/10">
                        {block.type === "author"
                          ? (cstr(block.content, "layout") === "inline"
                              ? "Zone B (Feed Pleine Largeur : C1 à C12)"
                              : cstr(block.content, "layout") === "sidebar-left"
                              ? "Zone A (Flanc Gauche : C1 à C3)"
                              : "Zone C (Flanc Droit : C10 à C12)")
                          : "Zone B (Feed Central : C4 à C9)"}
                      </span>
                    </div>
                  )}

                  {/* FORMULAIRE SPÉCIFIQUE PAR BLOC */}

                  {/* 1. Titre */}
                  {block.type === "heading" && (
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <div className="flex items-center gap-1.5 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-lg px-2.5 py-1.5">
                          <IconHeading className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400 shrink-0" strokeWidth={1.8} />
                          <select
                            value={cstr(block.content, "level") || "h2"}
                            onChange={(e) => setContent(block.id, { ...block.content, level: e.target.value })}
                            className="bg-transparent text-xs font-bold text-gray-800 dark:text-gray-200 focus:outline-none cursor-pointer"
                          >
                            <option value="h1">Niveau H1</option>
                            <option value="h2">Niveau H2</option>
                            <option value="h3">Niveau H3</option>
                          </select>
                        </div>
                        <input
                          value={cstr(block.content, "content")}
                          onChange={(e) => setContent(block.id, { ...block.content, content: e.target.value })}
                          placeholder="Titre de la section..."
                          className="flex-1 text-lg font-bold text-gray-900 dark:text-white bg-transparent border-b border-gray-200 dark:border-white/10 focus:border-primary focus:outline-none pb-1 transition-colors"
                        />
                      </div>
                    </div>
                  )}

                  {/* 2. Texte Markdown */}
                  {block.type === "text" && (
                    <textarea
                      value={cstr(block.content, "content")}
                      onChange={(e) => setContent(block.id, { ...block.content, content: e.target.value })}
                      rows={4}
                      placeholder="Saisissez votre contenu pédagogique en texte ou Markdown..."
                      className={TXA}
                    />
                  )}

                  {/* 3. Callout / Encadré */}
                  {block.type === "callout" && (
                    <div className="space-y-3">
                      <div className="flex items-center gap-2.5">
                        <div className="flex items-center gap-1.5 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-lg px-2.5 py-1.5">
                          {(() => {
                            const curV = cstr(block.content, "variant") || "tip";
                            if (curV === "warning") return <AlertTriangle className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400 shrink-0" strokeWidth={1.8} />;
                            if (curV === "info") return <Info className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400 shrink-0" strokeWidth={1.8} />;
                            if (curV === "definition") return <BookOpen className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400 shrink-0" strokeWidth={1.8} />;
                            return <IconLightbulb className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" strokeWidth={1.8} />;
                          })()}
                          <select
                            value={cstr(block.content, "variant") || "tip"}
                            onChange={(e) => setContent(block.id, { ...block.content, variant: e.target.value })}
                            className="bg-transparent text-xs font-bold text-gray-800 dark:text-gray-200 focus:outline-none cursor-pointer"
                          >
                            <option value="tip">Astuce / Bonnes pratiques</option>
                            <option value="info">Information clé</option>
                            <option value="warning">Attention / Piège</option>
                            <option value="definition">Définition & Concept</option>
                          </select>
                        </div>
                        <input
                          value={cstr(block.content, "title")}
                          onChange={(e) => setContent(block.id, { ...block.content, title: e.target.value })}
                          placeholder="Titre de l'encadré..."
                          className="flex-1 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 text-xs rounded-lg px-3 py-1.5 font-bold text-gray-900 dark:text-white"
                        />
                      </div>
                      <textarea
                        value={cstr(block.content, "content")}
                        onChange={(e) => setContent(block.id, { ...block.content, content: e.target.value })}
                        rows={3}
                        placeholder="Texte de l'encadré..."
                        className={TXA}
                      />
                    </div>
                  )}

                  {/* 4. Citation */}
                  {block.type === "quote" && (
                    <div className="space-y-3">
                      <textarea
                        value={cstr(block.content, "quote")}
                        onChange={(e) => setContent(block.id, { ...block.content, quote: e.target.value })}
                        rows={2}
                        placeholder="Citation ou formule forte..."
                        className={TXA}
                      />
                      <div className="grid grid-cols-2 gap-3">
                        <input
                          value={cstr(block.content, "author")}
                          onChange={(e) => setContent(block.id, { ...block.content, author: e.target.value })}
                          placeholder="Auteur (ex : Alan Turing)"
                          className={INP}
                        />
                        <input
                          value={cstr(block.content, "source")}
                          onChange={(e) => setContent(block.id, { ...block.content, source: e.target.value })}
                          placeholder="Source / Ouvrage (ex : Mind, 1950)"
                          className={INP}
                        />
                      </div>
                    </div>
                  )}

                  {/* 5. Séparateur */}
                  {block.type === "divider" && (
                    <div className="flex items-center gap-3 py-2 text-xs text-gray-400">
                      <span className="flex-1 border-t border-gray-200 dark:border-white/10" />
                      <input
                        value={cstr(block.content, "label")}
                        onChange={(e) => setContent(block.id, { ...block.content, label: e.target.value })}
                        placeholder="Texte du séparateur (optionnel)..."
                        className="bg-transparent text-center font-semibold text-gray-500 focus:outline-none"
                      />
                      <span className="flex-1 border-t border-gray-200 dark:border-white/10" />
                    </div>
                  )}

                  {/* 6. Code */}
                  {block.type === "code" && (
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-xs text-gray-400">
                        <div className="flex items-center gap-1.5 bg-gray-100 dark:bg-white/10 rounded-md px-2.5 py-1">
                          <IconCode2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" strokeWidth={1.8} />
                          <select
                            value={cstr(block.content, "language") || "python"}
                            onChange={(e) => setContent(block.id, { ...block.content, language: e.target.value })}
                            className="bg-transparent text-xs font-mono font-bold text-gray-800 dark:text-gray-200 focus:outline-none cursor-pointer"
                          >
                            <option value="python">Python</option>
                            <option value="sql">SQL</option>
                            <option value="r">R</option>
                            <option value="bash">Bash</option>
                            <option value="javascript">JavaScript</option>
                          </select>
                        </div>
                        <span className="font-mono text-[11px]">Coloration syntaxique</span>
                      </div>
                      <textarea
                        value={cstr(block.content, "content")}
                        onChange={(e) => setContent(block.id, { ...block.content, content: e.target.value })}
                        rows={6}
                        placeholder={"# Saisissez votre code...\nimport numpy as np"}
                        className="w-full text-xs font-mono text-emerald-400 bg-gray-950 border border-gray-800 rounded-xl p-4 focus:outline-none focus:ring-1 focus:ring-emerald-500/50 resize-none"
                      />
                    </div>
                  )}

                  {/* 7. Maths LaTeX */}
                  {block.type === "math" && (
                    <div className="space-y-2.5">
                      <div className="space-y-1">
                        <label className="text-[11px] font-bold text-gray-500 uppercase flex items-center gap-1.5">
                          <IconSigma className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400 shrink-0" strokeWidth={1.8} />
                          <span>Équation LaTeX :</span>
                        </label>
                        <textarea
                          value={cstr(block.content, "formula")}
                          onChange={(e) => setContent(block.id, { ...block.content, formula: e.target.value })}
                          rows={2}
                          placeholder={"\\mathcal{L}(\\theta) = - \\sum_{i=1}^N y_i \\log(\\hat{y}_i)"}
                          className="w-full text-xs font-mono bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl p-3 focus:outline-none text-gray-900 dark:text-white"
                        />
                      </div>
                      <input
                        value={cstr(block.content, "explanation")}
                        onChange={(e) => setContent(block.id, { ...block.content, explanation: e.target.value })}
                        placeholder="Explication ou nom de la formule..."
                        className={INP}
                      />
                    </div>
                  )}

                  {/* 8. Tableau */}
                  {block.type === "table" && (
                    <div className="space-y-2">
                      <p className="text-xs text-gray-500 flex items-center gap-1.5">
                        <IconTable className="w-3.5 h-3.5 text-sky-600 dark:text-sky-400 shrink-0" strokeWidth={1.8} />
                        <span>Tableau de comparaison ou métriques. Les colonnes sont séparées par des virgules :</span>
                      </p>
                      <input
                        value={carr(block.content, "headers").join(", ")}
                        onChange={(e) => {
                          const headers = e.target.value.split(",").map((s) => s.trim());
                          setContent(block.id, { ...block.content, headers });
                        }}
                        placeholder="En-têtes : Modèle, Précision, Vitesse"
                        className={INP}
                      />
                    </div>
                  )}

                  {/* 9. Dataset */}
                  {block.type === "dataset" && (
                    <div className="space-y-3">
                      <div className="grid grid-cols-2 gap-3">
                        <input
                          value={cstr(block.content, "title")}
                          onChange={(e) => setContent(block.id, { ...block.content, title: e.target.value })}
                          placeholder="Nom du Dataset (ex : MNIST Fashion)"
                          className={INP}
                        />
                        <input
                          value={cstr(block.content, "format")}
                          onChange={(e) => setContent(block.id, { ...block.content, format: e.target.value })}
                          placeholder="Format (ex : CSV, Parquet, JSON)"
                          className={INP}
                        />
                      </div>
                      <input
                        value={cstr(block.content, "url")}
                        onChange={(e) => setContent(block.id, { ...block.content, url: e.target.value })}
                        placeholder="URL de téléchargement ou lien Kaggle/HuggingFace..."
                        className={INP}
                      />
                      <textarea
                        value={cstr(block.content, "description")}
                        onChange={(e) => setContent(block.id, { ...block.content, description: e.target.value })}
                        rows={2}
                        placeholder="Description du jeu de données..."
                        className={TXA}
                      />
                    </div>
                  )}

                  {/* 10. Vidéo */}
                  {block.type === "video" && (
                    <div className="space-y-3">
                      <input
                        value={cstr(block.content, "content")}
                        onChange={(e) => setContent(block.id, { ...block.content, content: extractYoutubeId(e.target.value) })}
                        placeholder="Collez l'URL de la vidéo YouTube ou l'identifiant..."
                        className={INP}
                      />
                      {cstr(block.content, "content") && (
                        <div className="aspect-video max-w-md rounded-xl overflow-hidden border border-gray-200 dark:border-white/10">
                          <iframe
                            src={`https://www.youtube.com/embed/${extractYoutubeId(cstr(block.content, "content"))}`}
                            className="w-full h-full"
                            title="Aperçu vidéo"
                            allowFullScreen
                          />
                        </div>
                      )}
                    </div>
                  )}

                  {/* 11. Image */}
                  {block.type === "image" && (
                    <div className="space-y-3">
                      <input
                        value={cstr(block.content, "content")}
                        onChange={(e) => setContent(block.id, { ...block.content, content: e.target.value })}
                        placeholder="URL de l'image (https://...)"
                        className={INP}
                      />
                      <input
                        value={cstr(block.content, "caption")}
                        onChange={(e) => setContent(block.id, { ...block.content, caption: e.target.value })}
                        placeholder="Légende de l'image..."
                        className={INP}
                      />
                      {cstr(block.content, "content") && (
                        <div className="max-h-56 max-w-md overflow-hidden rounded-xl border border-gray-200 dark:border-white/10">
                          <img
                            src={cstr(block.content, "content")}
                            alt="Illustration"
                            className="w-full h-auto object-cover"
                            onError={(e) => (e.currentTarget.style.display = "none")}
                          />
                        </div>
                      )}
                    </div>
                  )}

                  {/* 12. Audio */}
                  {block.type === "audio" && (
                    <div className="grid grid-cols-2 gap-3">
                      <input
                        value={cstr(block.content, "title")}
                        onChange={(e) => setContent(block.id, { ...block.content, title: e.target.value })}
                        placeholder="Titre de la capsule audio..."
                        className={INP}
                      />
                      <input
                        value={cstr(block.content, "duration")}
                        onChange={(e) => setContent(block.id, { ...block.content, duration: e.target.value })}
                        placeholder="Durée (ex: 04:30)"
                        className={INP}
                      />
                    </div>
                  )}

                  {/* 13. Embed */}
                  {block.type === "embed" && (
                    <div className="space-y-3">
                      <input
                        value={cstr(block.content, "title")}
                        onChange={(e) => setContent(block.id, { ...block.content, title: e.target.value })}
                        placeholder="Nom de l'application interactive..."
                        className={INP}
                      />
                      <input
                        value={cstr(block.content, "url")}
                        onChange={(e) => setContent(block.id, { ...block.content, url: e.target.value })}
                        placeholder="URL publique sécurisée (https://...)"
                        className={INP}
                      />
                    </div>
                  )}

                  {/* 14. Quiz QCM */}
                  {block.type === "quiz" && (
                    <div className="space-y-3 bg-gray-50 dark:bg-white/5 p-4 rounded-xl border border-gray-200 dark:border-white/10">
                      <input
                        value={cstr(block.content, "question")}
                        onChange={(e) => setContent(block.id, { ...block.content, question: e.target.value })}
                        placeholder="Question du QCM..."
                        className="w-full text-sm font-bold text-gray-900 dark:text-white bg-transparent border-b border-gray-300 dark:border-white/20 focus:border-primary focus:outline-none pb-1"
                      />
                      <div className="space-y-2">
                        <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wide">
                          Options (Cochez la bonne réponse) :
                        </p>
                        {carr(block.content, "options").map((opt, j) => (
                          <div key={j} className="flex items-center gap-2.5">
                            <input
                              type="radio"
                              name={`quiz-answer-${block.id}`}
                              checked={cnum(block.content, "answer") === j}
                              onChange={() => setContent(block.id, { ...block.content, answer: j })}
                              className="w-4 h-4 accent-primary cursor-pointer"
                              title="Définir comme réponse correcte"
                            />
                            <input
                              value={opt}
                              onChange={(e) => {
                                const o = [...carr(block.content, "options")];
                                o[j] = e.target.value;
                                setContent(block.id, { ...block.content, options: o });
                              }}
                              placeholder={`Option ${String.fromCharCode(65 + j)}`}
                              className="flex-1 bg-white dark:bg-navy border border-gray-200 dark:border-white/10 rounded-lg px-3 py-1.5 text-xs text-gray-900 dark:text-white focus:outline-none focus:border-primary"
                            />
                          </div>
                        ))}
                      </div>
                      <textarea
                        value={cstr(block.content, "explanation")}
                        onChange={(e) => setContent(block.id, { ...block.content, explanation: e.target.value })}
                        rows={2}
                        placeholder="Explication pédagogique affichée à l'étudiant..."
                        className="w-full text-xs text-gray-800 dark:text-gray-200 bg-white dark:bg-navy border border-gray-200 dark:border-white/10 rounded-lg p-2.5 focus:outline-none focus:border-primary resize-none"
                      />
                    </div>
                  )}

                  {/* 15. Vrai / Faux */}
                  {block.type === "truefalse" && (
                    <div className="space-y-3 bg-gray-50 dark:bg-white/5 p-4 rounded-xl border border-gray-200 dark:border-white/10">
                      <input
                        value={cstr(block.content, "statement")}
                        onChange={(e) => setContent(block.id, { ...block.content, statement: e.target.value })}
                        placeholder="Affirmation à évaluer..."
                        className="w-full text-sm font-bold text-gray-900 dark:text-white bg-transparent border-b border-gray-300 dark:border-white/20 focus:border-primary focus:outline-none pb-1"
                      />
                      <div className="flex items-center gap-6 text-xs font-bold">
                        <span>Réponse attendue :</span>
                        <label className="flex items-center gap-1.5 cursor-pointer">
                          <input
                            type="radio"
                            name={`tf-${block.id}`}
                            checked={Boolean(block.content.isTrue)}
                            onChange={() => setContent(block.id, { ...block.content, isTrue: true })}
                            className="accent-primary"
                          />
                          <span className="text-emerald-600 font-bold flex items-center gap-1">
                            <Check className="w-3.5 h-3.5" strokeWidth={2.5} />
                            <span>VRAI</span>
                          </span>
                        </label>
                        <label className="flex items-center gap-1.5 cursor-pointer">
                          <input
                            type="radio"
                            name={`tf-${block.id}`}
                            checked={!block.content.isTrue}
                            onChange={() => setContent(block.id, { ...block.content, isTrue: false })}
                            className="accent-primary"
                          />
                          <span className="text-danger font-bold flex items-center gap-1">
                            <IconX className="w-3.5 h-3.5" strokeWidth={2.5} />
                            <span>FAUX</span>
                          </span>
                        </label>
                      </div>
                      <textarea
                        value={cstr(block.content, "explanation")}
                        onChange={(e) => setContent(block.id, { ...block.content, explanation: e.target.value })}
                        rows={2}
                        placeholder="Justification de la réponse..."
                        className="w-full text-xs text-gray-800 dark:text-gray-200 bg-white dark:bg-navy border border-gray-200 dark:border-white/10 rounded-lg p-2.5 focus:outline-none resize-none"
                      />
                    </div>
                  )}

                  {/* 16. Exercice & Solution */}
                  {block.type === "exercise" && (
                    <div className="space-y-3">
                      <input
                        value={cstr(block.content, "title")}
                        onChange={(e) => setContent(block.id, { ...block.content, title: e.target.value })}
                        placeholder="Titre de l'exercice..."
                        className={INP}
                      />
                      <textarea
                        value={cstr(block.content, "instruction")}
                        onChange={(e) => setContent(block.id, { ...block.content, instruction: e.target.value })}
                        rows={3}
                        placeholder="Énoncé et consignes de l'exercice..."
                        className={TXA}
                      />
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div className="space-y-1">
                          <label className="text-[10px] font-bold text-gray-500 uppercase flex items-center gap-1">
                            <IconLightbulb className="w-3 h-3 text-purple-600 dark:text-purple-400" />
                            <span>Indice pédagogique</span>
                          </label>
                          <textarea
                            value={cstr(block.content, "hint")}
                            onChange={(e) => setContent(block.id, { ...block.content, hint: e.target.value })}
                            rows={2}
                            placeholder="Indice pédagogique (dépliable par l'étudiant)..."
                            className={TXA}
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[10px] font-bold text-gray-500 uppercase flex items-center gap-1">
                            <KeyRound className="w-3 h-3 text-purple-600 dark:text-purple-400" />
                            <span>Solution détaillée</span>
                          </label>
                          <textarea
                            value={cstr(block.content, "solution")}
                            onChange={(e) => setContent(block.id, { ...block.content, solution: e.target.value })}
                            rows={2}
                            placeholder="Solution détaillée et calculs..."
                            className={TXA}
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {/* 17. Flashcard */}
                  {block.type === "flashcard" && (
                    <div className="space-y-3">
                      <input
                        value={cstr(block.content, "category")}
                        onChange={(e) => setContent(block.id, { ...block.content, category: e.target.value })}
                        placeholder="Catégorie ou tag (ex: Théorie ML)"
                        className={INP}
                      />
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div className="space-y-1">
                          <label className="text-[10px] font-bold text-gray-500 uppercase flex items-center gap-1">
                            <RotateCw className="w-3 h-3 text-amber-500" />
                            <span>Recto (Question / Notion)</span>
                          </label>
                          <textarea
                            value={cstr(block.content, "front")}
                            onChange={(e) => setContent(block.id, { ...block.content, front: e.target.value })}
                            rows={3}
                            placeholder="Recto : Notion, question ou acronyme..."
                            className={TXA}
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[10px] font-bold text-gray-500 uppercase flex items-center gap-1">
                            <LucideSparkles className="w-3 h-3 text-amber-500" />
                            <span>Verso (Réponse / Définition)</span>
                          </label>
                          <textarea
                            value={cstr(block.content, "back")}
                            onChange={(e) => setContent(block.id, { ...block.content, back: e.target.value })}
                            rows={3}
                            placeholder="Verso : Définition complète et réponse..."
                            className={TXA}
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {/* 18. Points clés */}
                  {block.type === "summary" && (
                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-lg bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0">
                          <IconStar className="w-4 h-4" strokeWidth={2} />
                        </div>
                        <input
                          value={cstr(block.content, "title")}
                          onChange={(e) => setContent(block.id, { ...block.content, title: e.target.value })}
                          placeholder="Titre de la synthèse (ex: Points clés du module)..."
                          className={INP}
                        />
                      </div>
                      <textarea
                        value={carr(block.content, "points").join("\n")}
                        onChange={(e) => {
                          const points = e.target.value.split("\n").filter((s) => s.trim().length > 0);
                          setContent(block.id, { ...block.content, points });
                        }}
                        rows={4}
                        placeholder={"Entrez un point clé par ligne :\nPoint 1\nPoint 2\nPoint 3"}
                        className={TXA}
                      />
                    </div>
                  )}

                  {/* 19. Ressources */}
                  {block.type === "resources" && (
                    <div className="space-y-2">
                      <p className="text-xs text-gray-500 flex items-center gap-1.5">
                        <IconLibrary className="w-3.5 h-3.5 text-sky-600 dark:text-sky-400 shrink-0" strokeWidth={1.8} />
                        <span>Entrez les liens sous la forme : Titre | URL | Type (ex: Deep Learning Book | https://... | Livre)</span>
                      </p>
                      <textarea
                        value={((block.content.links as { title: string; url: string; type: string }[]) || [])
                          .map((l) => `${l.title} | ${l.url} | ${l.type || "Lien"}`)
                          .join("\n")}
                        onChange={(e) => {
                          const lines = e.target.value.split("\n").filter((l) => l.trim().length > 0);
                          const links = lines.map((l) => {
                            const [title = "", url = "", type = "Lien"] = l.split("|").map((s) => s.trim());
                            return { title, url, type };
                          });
                          setContent(block.id, { ...block.content, links });
                        }}
                        rows={3}
                        className={TXA}
                        placeholder={"Deep Learning Book | https://www.deeplearningbook.org | Livre\nPaper Attention Is All You Need | https://arxiv.org | ArXiv"}
                      />
                    </div>
                  )}

                  {/* 20. Point d'histoire */}
                  {block.type === "history" && (
                    <div className="space-y-4 bg-amber-50/30 dark:bg-amber-950/10 border border-amber-200/60 dark:border-amber-700/20 rounded-xl p-4">
                      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-amber-200/40 dark:border-amber-700/20 pb-3">
                        <div className="flex items-center gap-2">
                          <IconHistory className="w-4 h-4 text-amber-700 dark:text-amber-300" strokeWidth={1.75} />
                          <span className="text-xs font-bold uppercase tracking-wider text-amber-800 dark:text-amber-300">
                            Point d'histoire & Contexte biographique
                          </span>
                        </div>
                        <label className="flex items-center gap-2 text-xs font-medium text-gray-600 dark:text-gray-300 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={Boolean(block.content.defaultOpen)}
                            onChange={(e) => setContent(block.id, { ...block.content, defaultOpen: e.target.checked })}
                            className="rounded text-amber-600 focus:ring-amber-500"
                          />
                          <span>Déroulé par défaut dans l'aperçu</span>
                        </label>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                        <div className="md:col-span-2 space-y-1">
                          <label className="text-[11px] font-bold text-gray-600 dark:text-gray-400">
                            Titre / Personnalité / Événement *
                          </label>
                          <input
                            value={cstr(block.content, "title")}
                            onChange={(e) => setContent(block.id, { ...block.content, title: e.target.value })}
                            placeholder="Ex: George Edward Pelham Box (1919-2013)"
                            className={INP}
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[11px] font-bold text-gray-600 dark:text-gray-400">
                            Libellé du badge
                          </label>
                          <input
                            value={cstr(block.content, "subtitle") || "Point d'histoire"}
                            onChange={(e) => setContent(block.id, { ...block.content, subtitle: e.target.value })}
                            placeholder="Point d'histoire"
                            className={INP}
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                        <div className="md:col-span-2 space-y-1">
                          <label className="text-[11px] font-bold text-gray-600 dark:text-gray-400">
                            URL de la photo / portrait (toujours visible) *
                          </label>
                          <input
                            value={cstr(block.content, "imageUrl")}
                            onChange={(e) => setContent(block.id, { ...block.content, imageUrl: e.target.value })}
                            placeholder="https://.../photo.jpg"
                            className={INP}
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[11px] font-bold text-gray-600 dark:text-gray-400">
                            Dates / Période
                          </label>
                          <input
                            value={cstr(block.content, "era")}
                            onChange={(e) => setContent(block.id, { ...block.content, era: e.target.value })}
                            placeholder="Ex: 1919-2013"
                            className={INP}
                          />
                        </div>
                      </div>

                      {cstr(block.content, "imageUrl") && (
                        <div className="flex items-center gap-3 p-2.5 bg-white dark:bg-navy rounded-xl border border-amber-200/50 w-fit">
                          <img
                            src={cstr(block.content, "imageUrl")}
                            alt="Aperçu miniature"
                            className="w-12 h-12 rounded-lg object-cover border border-amber-300"
                            onError={(e) => { (e.target as HTMLElement).style.display = 'none'; }}
                          />
                          <div className="text-[11px] text-gray-500">
                            <p className="font-semibold text-gray-800 dark:text-gray-200">Portrait sélectionné</p>
                            <p className="text-[10px] text-gray-400">Reste affiché en permanence dans le summary déroulant</p>
                          </div>
                        </div>
                      )}

                      <div className="space-y-1">
                        <label className="text-[11px] font-bold text-gray-600 dark:text-gray-400">
                          Citation emblématique (optionnel)
                        </label>
                        <input
                          value={cstr(block.content, "quote")}
                          onChange={(e) => setContent(block.id, { ...block.content, quote: e.target.value })}
                          placeholder="Ex: « Tous les modèles sont faux, mais certains sont utiles. » — George Box (1976)"
                          className={INP}
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-[11px] font-bold text-gray-600 dark:text-gray-400">
                          Récit historique & contexte scientifique (déroulé au clic)
                        </label>
                        <textarea
                          value={cstr(block.content, "content")}
                          onChange={(e) => setContent(block.id, { ...block.content, content: e.target.value })}
                          rows={4}
                          placeholder="Rédigez le contexte historique et l'apport fondamental de la découverte..."
                          className={TXA}
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-[11px] font-bold text-gray-600 dark:text-gray-400">
                          Légende / Crédit du portrait (optionnel)
                        </label>
                        <input
                          value={cstr(block.content, "caption")}
                          onChange={(e) => setContent(block.id, { ...block.content, caption: e.target.value })}
                          placeholder="Ex: Portrait officiel de George Edward Pelham Box"
                          className={INP}
                        />
                      </div>
                    </div>
                  )}

                  {/* 21. Auteurs du cours */}
                  {block.type === "author" && (() => {
                    type AuthorItem = {
                      name: string;
                      role: string;
                      institution: string;
                      photo: string;
                      bio: string;
                      linkText: string;
                      linkUrl: string;
                      socialLinkedin?: string;
                      socialEmail?: string;
                    };
                    const authorsList = (Array.isArray(block.content.authors)
                      ? block.content.authors
                      : []) as AuthorItem[];

                    function updateAuthor(idx: number, patch: Partial<AuthorItem>) {
                      const next = [...authorsList];
                      next[idx] = { ...next[idx], ...patch };
                      setContent(block.id, { ...block.content, authors: next });
                    }

                    function addAuthorItem() {
                      const next = [
                        ...authorsList,
                        {
                          name: "Nouvel Enseignant",
                          role: "Professeur / Chercheur",
                          institution: "Hi! PARIS",
                          photo: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80",
                          bio: "Biographie académique et domaines d'expertise...",
                          linkText: "More About the Author",
                          linkUrl: "https://www.hiparis.fr",
                          socialLinkedin: "",
                          socialEmail: "",
                        },
                      ];
                      setContent(block.id, { ...block.content, authors: next });
                    }

                    function removeAuthorItem(idx: number) {
                      const next = authorsList.filter((_, i) => i !== idx);
                      setContent(block.id, { ...block.content, authors: next });
                    }

                    return (
                      <div className="space-y-4 bg-blue-50/30 dark:bg-navy-dark/40 border border-blue-200/60 dark:border-white/10 rounded-xl p-4">
                        {/* En-tête du bloc Auteur */}
                        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-gray-200 dark:border-white/10 pb-3">
                          <div className="flex items-center gap-2">
                            <IconAuthor className="w-4 h-4 text-[#0B2F5E] dark:text-blue-400" strokeWidth={1.75} />
                            <span className="text-xs font-bold uppercase tracking-wider text-[#0B2F5E] dark:text-blue-400">
                              Fiche Auteur(s) & Équipe Enseignante
                            </span>
                          </div>

                          {/* Sélecteur de disposition : Flanc droit / Flanc gauche / Flux principal */}
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="text-xs font-semibold text-gray-600 dark:text-gray-300">Placement :</span>
                            <select
                              value={cstr(block.content, "layout") || "sidebar-right"}
                              onChange={(e) => setContent(block.id, { ...block.content, layout: e.target.value })}
                              className="text-xs bg-white dark:bg-navy border border-gray-200 dark:border-white/10 rounded-lg px-2.5 py-1.5 font-bold text-[#0B2F5E] dark:text-white"
                            >
                              <option value="sidebar-right">Flanc droit (extérieur aux limites du cours)</option>
                              <option value="sidebar-left">Flanc gauche (extérieur aux limites du cours)</option>
                              <option value="inline">Dans le cours (corps de lecture standard pleine largeur)</option>
                            </select>
                          </div>
                        </div>

                        <div className="space-y-1 max-w-sm">
                          <label className="text-[11px] font-bold text-gray-600 dark:text-gray-400">
                            Titre du badge / En-tête
                          </label>
                          <input
                            value={cstr(block.content, "badgeTitle") || "Meet the Author"}
                            onChange={(e) => setContent(block.id, { ...block.content, badgeTitle: e.target.value })}
                            placeholder="Meet the Author"
                            className={INP}
                          />
                        </div>

                        {/* Liste des auteurs éditables */}
                        <div className="space-y-4">
                          {authorsList.map((author, aIdx) => (
                            <div
                              key={aIdx}
                              className="p-4 bg-white dark:bg-navy border border-gray-200 dark:border-white/10 rounded-xl space-y-3 relative group shadow-2xs"
                            >
                              <div className="flex items-center justify-between">
                                <span className="text-xs font-bold text-gray-700 dark:text-gray-300">
                                  Auteur #{aIdx + 1}
                                </span>
                                {authorsList.length > 1 && (
                                  <button
                                    type="button"
                                    onClick={() => removeAuthorItem(aIdx)}
                                    className="text-xs text-danger hover:underline font-semibold cursor-pointer"
                                  >
                                    Supprimer cet auteur
                                  </button>
                                )}
                              </div>

                              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                                <div>
                                  <label className="text-[10px] font-bold text-gray-500 uppercase">
                                    Nom & Prénom *
                                  </label>
                                  <input
                                    value={author.name}
                                    onChange={(e) => updateAuthor(aIdx, { name: e.target.value })}
                                    placeholder="Ex: Emmanuel Coblence"
                                    className={INP}
                                  />
                                </div>
                                <div>
                                  <label className="text-[10px] font-bold text-gray-500 uppercase">
                                    Rôle / Titre académique *
                                  </label>
                                  <input
                                    value={author.role}
                                    onChange={(e) => updateAuthor(aIdx, { role: e.target.value })}
                                    placeholder="Ex: Professor and Associate Dean..."
                                    className={INP}
                                  />
                                </div>
                                <div>
                                  <label className="text-[10px] font-bold text-gray-500 uppercase">
                                    Établissement / École
                                  </label>
                                  <input
                                    value={author.institution}
                                    onChange={(e) => updateAuthor(aIdx, { institution: e.target.value })}
                                    placeholder="Ex: HEC Paris"
                                    className={INP}
                                  />
                                </div>
                              </div>

                              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 items-center">
                                <div className="md:col-span-2">
                                  <label className="text-[10px] font-bold text-gray-500 uppercase">
                                    URL Photo de profil (avatar rond) *
                                  </label>
                                  <input
                                    value={author.photo}
                                    onChange={(e) => updateAuthor(aIdx, { photo: e.target.value })}
                                    placeholder="https://.../photo.jpg"
                                    className={INP}
                                  />
                                </div>
                                <div className="flex items-center gap-2 pt-3">
                                  <img
                                    src={author.photo}
                                    alt={author.name}
                                    className="w-12 h-12 rounded-full object-cover border-2 border-[#0B2F5E]/30"
                                    onError={(e) => { (e.target as HTMLElement).style.display = 'none'; }}
                                  />
                                  <span className="text-[11px] text-gray-400">Aperçu avatar rond</span>
                                </div>
                              </div>

                              <div>
                                <label className="text-[10px] font-bold text-gray-500 uppercase">
                                  Biographie / Description académique
                                </label>
                                <textarea
                                  value={author.bio}
                                  onChange={(e) => updateAuthor(aIdx, { bio: e.target.value })}
                                  rows={3}
                                  placeholder="Rédigez la biographie, chaires de recherche et cours dispensés..."
                                  className={TXA}
                                />
                              </div>

                              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                <div>
                                  <label className="text-[10px] font-bold text-gray-500 uppercase">
                                    Texte du lien de contact / profil
                                  </label>
                                  <input
                                    value={author.linkText || "More About the Author"}
                                    onChange={(e) => updateAuthor(aIdx, { linkText: e.target.value })}
                                    placeholder="More About the Author"
                                    className={INP}
                                  />
                                </div>
                                <div>
                                  <label className="text-[10px] font-bold text-gray-500 uppercase">
                                    URL du lien de contact / profil
                                  </label>
                                  <input
                                    value={author.linkUrl}
                                    onChange={(e) => updateAuthor(aIdx, { linkUrl: e.target.value })}
                                    placeholder="https://www.hec.edu/..."
                                    className={INP}
                                  />
                                </div>
                              </div>

                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                <div>
                                  <label className="text-[10px] font-bold text-gray-500 uppercase">
                                    Lien LinkedIn (optionnel)
                                  </label>
                                  <input
                                    value={author.socialLinkedin || ""}
                                    onChange={(e) => updateAuthor(aIdx, { socialLinkedin: e.target.value })}
                                    placeholder="https://linkedin.com/in/..."
                                    className={INP}
                                  />
                                </div>
                                <div>
                                  <label className="text-[10px] font-bold text-gray-500 uppercase">
                                    Email professionnel (optionnel)
                                  </label>
                                  <input
                                    value={author.socialEmail || ""}
                                    onChange={(e) => updateAuthor(aIdx, { socialEmail: e.target.value })}
                                    placeholder="contact@etablissement.fr"
                                    className={INP}
                                  />
                                </div>
                              </div>
                            </div>
                          ))}

                          <button
                            type="button"
                            onClick={addAuthorItem}
                            className="text-xs font-bold text-[#0B2F5E] dark:text-blue-400 hover:underline inline-flex items-center gap-1.5 cursor-pointer"
                          >
                            <Plus className="w-3.5 h-3.5" />
                            <span>Ajouter un autre enseignant / auteur</span>
                          </button>
                        </div>

                        {/* Aperçu direct du rendu dans le feed */}
                        <div className="pt-4 border-t border-blue-200/50 dark:border-white/10 space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-[10px] font-bold uppercase tracking-wider text-gray-500">
                              Aperçu du rendu dans le feed :
                            </span>
                            <span className="text-[10px] font-semibold text-primary dark:text-blue-300">
                              {cstr(block.content, "layout") === "inline"
                                ? "Mode dans le cours (pleine largeur)"
                                : cstr(block.content, "layout") === "sidebar-left"
                                ? "Mode flanc gauche (sticky 320px sur grand écran)"
                                : "Mode flanc droit (sticky 320px sur grand écran)"}
                            </span>
                          </div>
                          <div className="max-w-md">
                            {renderAuthorCard(block)}
                          </div>
                        </div>
                      </div>
                    );
                  })()}

                </div>
              );
            })}

            {/* Barre rapide d'ajout au bas de la page */}
            <div className="flex flex-wrap items-center gap-2 pt-2">
              <button
                type="button"
                onClick={() => addBlock("text")}
                className="flex-1 min-w-[130px] border-2 border-dashed border-gray-300 dark:border-white/15 rounded-xl p-3 text-xs font-bold text-gray-500 hover:text-primary hover:border-primary transition-all text-center cursor-pointer"
              >
                + Texte
              </button>
              <button
                type="button"
                onClick={() => addBlock("code")}
                className="flex-1 min-w-[130px] border-2 border-dashed border-gray-300 dark:border-white/15 rounded-xl p-3 text-xs font-bold text-gray-500 hover:text-emerald-500 hover:border-emerald-500 transition-all text-center cursor-pointer"
              >
                + Code
              </button>
              <button
                type="button"
                onClick={() => addBlock("quiz")}
                className="flex-1 min-w-[130px] border-2 border-dashed border-gray-300 dark:border-white/15 rounded-xl p-3 text-xs font-bold text-gray-500 hover:text-purple-500 hover:border-purple-500 transition-all text-center cursor-pointer"
              >
                + QCM
              </button>
              <button
                type="button"
                onClick={() => addBlock("callout")}
                className="flex-1 min-w-[130px] border-2 border-dashed border-gray-300 dark:border-white/15 rounded-xl p-3 text-xs font-bold text-gray-500 hover:text-amber-500 hover:border-amber-500 transition-all text-center cursor-pointer"
              >
                + Astuce
              </button>
              <button
                type="button"
                onClick={() => addBlock("history")}
                className="flex-1 min-w-[130px] border-2 border-dashed border-amber-300 dark:border-amber-600/40 rounded-xl p-3 text-xs font-bold text-amber-700 dark:text-amber-300 hover:bg-amber-500/10 transition-all text-center cursor-pointer"
              >
                + Histoire
              </button>
              <button
                type="button"
                onClick={() => addBlock("author")}
                className="flex-1 min-w-[130px] border-2 border-dashed border-blue-300 dark:border-blue-600/40 rounded-xl p-3 text-xs font-bold text-[#0B2F5E] dark:text-blue-300 hover:bg-[#0B2F5E]/10 transition-all text-center cursor-pointer"
              >
                + Auteurs
              </button>
            </div>
          </div>

          {/* FLANC EXTÉRIEUR DROIT EN MODE ÉDITION (Positionné à l'extérieur des limites du dock, toujours visible) */}
          {tocPlacement === "right" && (
            <aside className="hidden min-[1540px]:block absolute left-[calc(100%+1.5rem)] top-0 bottom-0 w-72 2xl:w-80 z-20 pointer-events-none">
              <div className="sticky top-[160px] pointer-events-auto">
                {renderTableOfContents()}
              </div>
            </aside>
          )}
        </div>
      ) : (
        /* ── MODE 2 : APERÇU ÉTUDIANT DIRECT (PLEINE LARGEUR DU DOCK SANS RÉDUCTION DE LARGEUR) ── */
        <div className="w-full relative">

          {/* FLANC EXTÉRIEUR GAUCHE (Positionné à l'extérieur des limites du dock) */}
          {(tocPlacement === "left" || leftAuthorBlocks.length > 0) && (
            <aside className="hidden min-[1540px]:block absolute right-[calc(100%+1.5rem)] top-0 bottom-0 w-72 2xl:w-80 z-20 pointer-events-none">
              {/* Sommaire : Prioritaire & Toujours visible */}
              {tocPlacement === "left" && (
                <div className="sticky top-[160px] pointer-events-auto">
                  {renderTableOfContents()}
                </div>
              )}

              {/* Fiche auteur flanc gauche : au début du cours, disparaît au scroll si sommaire présent */}
              {leftAuthorBlocks.length > 0 && (
                <div className={`pointer-events-auto space-y-4 ${
                  tocPlacement === "left"
                    ? isScrolled
                      ? "opacity-0 pointer-events-none max-h-0 overflow-hidden transition-all duration-300"
                      : "mt-4 transition-all duration-300"
                    : "mt-0"
                }`}>
                  {leftAuthorBlocks.map((b) => renderAuthorCard(b))}
                </div>
              )}
            </aside>
          )}

          {/* CORPS PRINCIPAL DU COURS : PLEINE LARGEUR DU DOCK */}
          <div
            className={`w-full bg-white dark:bg-navy rounded-2xl p-6 sm:p-12 space-y-8 transition-all ${
              showFeedBorders
                ? "border border-gray-100 dark:border-white/5 shadow-sm"
                : "border-0 shadow-none"
            }`}
            onMouseUp={handlePreviewMouseUp}
            style={{
              fontFamily: activeFontConfig.fontStyle,
              fontSize: `${courseFontSize}px`,
            }}
          >

            {/* Notification temporaire d'égalisation */}
            {equalizerMessage && (
              <div className="bg-emerald-500/10 border border-emerald-500/30 text-emerald-800 dark:text-emerald-300 px-4 py-2 rounded-xl text-xs font-bold flex items-center justify-between animate-in fade-in slide-in-from-top-2 duration-200">
                <div className="flex items-center gap-2">
                  <IconCheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                  <span>{equalizerMessage}</span>
                </div>
                <button
                  type="button"
                  onClick={() => setEqualizerMessage(null)}
                  className="text-emerald-700 hover:text-emerald-900 p-0.5"
                >
                  <IconX className="w-3 h-3" />
                </button>
              </div>
            )}

            {/* En-tête cours */}
            <div className={`pb-6 ${showFeedBorders ? "border-b border-gray-100 dark:border-white/10" : ""}`}>
              <div className="flex flex-wrap items-center gap-2 mb-3">
                <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-primary/10 text-primary dark:text-white">
                  {category}
                </span>
                <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-gray-100 dark:bg-white/10 text-gray-700 dark:text-gray-300">
                  {school}
                </span>
                <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400">
                  Niveau : {level}
                </span>
              </div>
              <WordEditableText
                value={title}
                onChange={handleTitleChange}
                as="h1"
                className="text-3xl font-extrabold text-gray-900 dark:text-white"
                placeholder="Titre du cours..."
                isWordMode={isWordPageMode}
              />
            </div>

            {/* Sommaire & Fiche Auteur(s) responsive sur écrans compacts (< 1540px) */}
            {(tocPlacement !== "none" || flankAuthorBlocks.length > 0) && (
              <div className={`block min-[1540px]:hidden space-y-4 pb-6 ${showFeedBorders ? "border-b border-gray-100 dark:border-white/10" : ""}`}>
                {tocPlacement !== "none" && renderTableOfContents()}
                {flankAuthorBlocks.map((b) => renderAuthorCard(b))}
              </div>
            )}

            {/* Rendu des blocs pédagogiques du cours */}
            <div className="w-full space-y-6 flow-root">
              {blocks.map((block, bIdx) => {
                // Si l'auteur est positionné sur un flanc extérieur, il est déjà affiché dans l'aside sticky extérieur
                if (block.type === "author") {
                  const layout = cstr(block.content, "layout") || "sidebar-right";
                  if (layout === "sidebar-right" || layout === "sidebar-left") {
                    return null;
                  }
                  // Si l'auteur est positionné "dans le cours" (inline)
                  return (
                    <div key={block.id} className="w-full my-6 clear-both">
                      {renderAuthorCard(block)}
                    </div>
                  );
                }

                // 1. Heading
              if (block.type === "heading") {
                const lvl = cstr(block.content, "level");
                return renderModulatedBlock(
                  block,
                  bIdx,
                  <WordEditableText
                    value={cstr(block.content, "content")}
                    onChange={(val) => setContent(block.id, { ...block.content, content: val })}
                    as={lvl === "h1" ? "h1" : lvl === "h3" ? "h3" : "h2"}
                    blockId={block.id}
                    onFocus={() => setSelectedBlockId(block.id)}
                    onContextMenu={(e) => handlePreviewContextMenu(e, block.id)}
                    className={
                      lvl === "h1"
                        ? "text-3xl font-extrabold text-gray-900 dark:text-white pt-4 pb-2 border-b border-gray-100 dark:border-white/10 scroll-mt-48 select-text"
                        : lvl === "h3"
                        ? "text-lg font-bold text-gray-900 dark:text-white pt-2 scroll-mt-48 select-text"
                        : "text-2xl font-bold text-gray-900 dark:text-white pt-4 pb-2 border-b border-gray-100 dark:border-white/10 scroll-mt-48 select-text"
                    }
                    isWordMode={isWordPageMode}
                    placeholder="Titre de section..."
                  />
                );
              }

              // 2. Text
              if (block.type === "text") {
                return renderModulatedBlock(
                  block,
                  bIdx,
                  <WordEditableText
                    value={cstr(block.content, "content")}
                    onChange={(val) => setContent(block.id, { ...block.content, content: val })}
                    as="div"
                    blockId={block.id}
                    onFocus={() => setSelectedBlockId(block.id)}
                    onContextMenu={(e) => handlePreviewContextMenu(e, block.id)}
                    className="text-base text-gray-700 dark:text-gray-200 leading-relaxed whitespace-pre-wrap select-text"
                    isWordMode={isWordPageMode}
                    placeholder="Tapez votre paragraphe de cours..."
                  />
                );
              }

              // 3. Callout
              if (block.type === "callout") {
                const v = cstr(block.content, "variant");
                const style =
                  v === "warning" ? "border-amber-500 bg-amber-500/10 text-amber-900 dark:text-amber-200" :
                  v === "info" ? "border-blue-500 bg-blue-500/10 text-blue-900 dark:text-blue-200" :
                  v === "definition" ? "border-purple-500 bg-purple-500/10 text-purple-900 dark:text-purple-200" :
                  "border-emerald-500 bg-emerald-500/10 text-emerald-900 dark:text-emerald-200";
                return renderModulatedBlock(
                  block,
                  bIdx,
                  <div
                    data-block-id={block.id}
                    onContextMenu={(e) => handlePreviewContextMenu(e, block.id)}
                    className={`border-l-4 p-4 rounded-r-2xl my-4 space-y-1.5 select-text ${style}`}
                  >
                    <h4 className="text-sm font-bold flex items-center gap-2">
                      {v === "warning" ? (
                        <AlertTriangle className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0" strokeWidth={1.8} />
                      ) : v === "info" ? (
                        <Info className="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0" strokeWidth={1.8} />
                      ) : v === "definition" ? (
                        <BookOpen className="w-4 h-4 text-purple-600 dark:text-purple-400 shrink-0" strokeWidth={1.8} />
                      ) : (
                        <IconLightbulb className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" strokeWidth={1.8} />
                      )}
                      <WordEditableText
                        value={cstr(block.content, "title")}
                        onChange={(val) => setContent(block.id, { ...block.content, title: val })}
                        as="span"
                        blockId={block.id}
                        onFocus={() => setSelectedBlockId(block.id)}
                        isWordMode={isWordPageMode}
                        placeholder="Titre de l'astuce..."
                      />
                    </h4>
                    <WordEditableText
                      value={cstr(block.content, "content")}
                      onChange={(val) => setContent(block.id, { ...block.content, content: val })}
                      as="div"
                      blockId={block.id}
                      onFocus={() => setSelectedBlockId(block.id)}
                      className="text-xs leading-relaxed opacity-90"
                      isWordMode={isWordPageMode}
                      placeholder="Détail du point clé..."
                    />
                  </div>
                );
              }

              // 4. Quote
              if (block.type === "quote") {
                return renderModulatedBlock(
                  block,
                  bIdx,
                  <blockquote
                    data-block-id={block.id}
                    onContextMenu={(e) => handlePreviewContextMenu(e, block.id)}
                    className="border-l-4 border-primary pl-4 py-2 italic text-gray-700 dark:text-gray-300 my-4 space-y-1 select-text"
                  >
                    <div className="text-base flex items-start gap-1">
                      <span>«</span>
                      <WordEditableText
                        value={cstr(block.content, "quote")}
                        onChange={(val) => setContent(block.id, { ...block.content, quote: val })}
                        as="span"
                        blockId={block.id}
                        onFocus={() => setSelectedBlockId(block.id)}
                        className="flex-1 not-italic font-serif"
                        isWordMode={isWordPageMode}
                        placeholder="Citation inspirante..."
                      />
                      <span>»</span>
                    </div>
                    <div className="text-xs not-italic text-gray-500 dark:text-gray-400 font-semibold flex items-center gap-1">
                      <span>—</span>
                      <WordEditableText
                        value={cstr(block.content, "author")}
                        onChange={(val) => setContent(block.id, { ...block.content, author: val })}
                        as="span"
                        blockId={block.id}
                        onFocus={() => setSelectedBlockId(block.id)}
                        isWordMode={isWordPageMode}
                        placeholder="Nom de l'auteur..."
                      />
                      {cstr(block.content, "source") && <span className="opacity-70 font-normal">({cstr(block.content, "source")})</span>}
                    </div>
                  </blockquote>
                );
              }

              // 5. Divider
              if (block.type === "divider") {
                return renderModulatedBlock(
                  block,
                  bIdx,
                  <div id={`block-${block.id}`} className="relative py-4 scroll-mt-48">
                    <div className="absolute inset-0 flex items-center"><span className="w-full border-t border-gray-200 dark:border-white/10" /></div>
                    {cstr(block.content, "label") && (
                      <div className="relative flex justify-center"><span className="bg-white dark:bg-navy px-3 text-xs font-semibold text-gray-400">{cstr(block.content, "label")}</span></div>
                    )}
                  </div>
                );
              }

              // 6. Code
              if (block.type === "code") {
                return renderModulatedBlock(
                  block,
                  bIdx,
                  <div className="rounded-2xl overflow-hidden border border-gray-800 bg-gray-950 my-4 shadow-sm">
                    <div className="flex items-center justify-between px-4 py-2 bg-gray-900 border-b border-gray-800 text-xs text-gray-400">
                      <span className="font-mono font-bold uppercase">{cstr(block.content, "language") || "python"}</span>
                      <button
                        type="button"
                        onClick={() => copyCodeToClipboard(block.id, cstr(block.content, "content"))}
                        className="hover:text-white transition-colors cursor-pointer text-[11px] flex items-center gap-1.5"
                      >
                        {copiedCodeId === block.id ? (
                          <>
                            <Check className="w-3.5 h-3.5 text-emerald-400" strokeWidth={2} />
                            <span>Copié !</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3.5 h-3.5 text-gray-400" strokeWidth={1.75} />
                            <span>Copier le code</span>
                          </>
                        )}
                      </button>
                    </div>
                    <pre className="p-4 text-xs font-mono text-emerald-400 overflow-x-auto leading-relaxed">
                      <code>{cstr(block.content, "content")}</code>
                    </pre>
                  </div>
                );
              }

              // 7. Math
              if (block.type === "math") {
                return renderModulatedBlock(
                  block,
                  bIdx,
                  <div className="bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-2xl p-6 text-center my-4 space-y-2">
                    <div className="text-base sm:text-lg font-mono text-primary dark:text-white font-bold tracking-wider py-1">
                      {cstr(block.content, "formula")}
                    </div>
                    {cstr(block.content, "explanation") && (
                      <p className="text-xs text-gray-500 dark:text-gray-400 italic">{cstr(block.content, "explanation")}</p>
                    )}
                  </div>
                );
              }

              // 8. Table
              if (block.type === "table") {
                return renderModulatedBlock(
                  block,
                  bIdx,
                  <div className="overflow-x-auto my-4 rounded-xl border border-gray-200 dark:border-white/10">
                    <table className="w-full text-left text-xs text-gray-700 dark:text-gray-200">
                      <thead className="bg-gray-100 dark:bg-white/10 font-bold text-gray-900 dark:text-white">
                        <tr>
                          {carr(block.content, "headers").map((h, idx) => (
                            <th key={idx} className="p-3 border-b border-gray-200 dark:border-white/10">{h}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {((block.content.rows as string[][]) || []).map((row, rIdx) => (
                          <tr key={rIdx} className="border-b border-gray-100 dark:border-white/5 hover:bg-gray-50/50 dark:hover:bg-white/5">
                            {row.map((cell, cIdx) => (
                              <td key={cIdx} className="p-3">{cell}</td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                );
              }

              // 9. Dataset
              if (block.type === "dataset") {
                return renderModulatedBlock(
                  block,
                  bIdx,
                  <div className="border border-teal-500/20 bg-teal-500/5 rounded-2xl p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 my-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2.5">
                        <IconDatabase className="w-5 h-5 text-teal-600 dark:text-teal-400 shrink-0" strokeWidth={1.75} />
                        <h4 className="text-sm font-bold text-gray-900 dark:text-white">{cstr(block.content, "title")}</h4>
                        <span className="text-[10px] bg-teal-500/10 text-teal-700 dark:text-teal-300 px-2 py-0.5 rounded font-mono font-bold">
                          {cstr(block.content, "format")}
                        </span>
                      </div>
                      <p className="text-xs text-gray-600 dark:text-gray-300">{cstr(block.content, "description")}</p>
                    </div>
                    {cstr(block.content, "url") && (
                      <a
                        href={cstr(block.content, "url")}
                        target="_blank"
                        rel="noreferrer"
                        className="px-4 py-2 bg-[#0B2F5E] hover:bg-[#0B2F5E]/90 text-white text-xs font-semibold rounded-xl transition-all shrink-0"
                      >
                        Télécharger ↗
                      </a>
                    )}
                  </div>
                );
              }

              // 10. Video
              if (block.type === "video") {
                const vidId = extractYoutubeId(cstr(block.content, "content"));
                return renderModulatedBlock(
                  block,
                  bIdx,
                  <div className="aspect-video rounded-2xl overflow-hidden border border-gray-200 dark:border-white/10 my-4 shadow-sm">
                    <iframe
                      src={`https://www.youtube.com/embed/${vidId}`}
                      className="w-full h-full"
                      title="Vidéo du cours"
                      allowFullScreen
                    />
                  </div>
                );
              }

              // 11. Image
              if (block.type === "image") {
                return renderModulatedBlock(
                  block,
                  bIdx,
                  <div className="rounded-2xl overflow-hidden border border-gray-200 dark:border-white/10 my-4">
                    <img src={cstr(block.content, "content")} alt={cstr(block.content, "alt") || "Illustration"} className="w-full h-auto object-cover max-h-96" />
                    {cstr(block.content, "caption") && (
                      <p className="p-3 text-center text-xs text-gray-500 italic bg-gray-50 dark:bg-white/5">{cstr(block.content, "caption")}</p>
                    )}
                  </div>
                );
              }

              // 12. Audio
              if (block.type === "audio") {
                return renderModulatedBlock(
                  block,
                  bIdx,
                  <div className="border border-gray-200 dark:border-white/10 rounded-2xl p-4 flex items-center justify-between gap-4 my-4 bg-gray-50 dark:bg-white/5">
                    <div className="flex items-center gap-3">
                      <span className="w-10 h-10 rounded-xl bg-violet-500/10 dark:bg-violet-400/10 text-violet-600 dark:text-violet-400 flex items-center justify-center shrink-0">
                        <IconMic className="w-5 h-5" strokeWidth={1.75} />
                      </span>
                      <div>
                        <p className="text-xs font-bold text-gray-900 dark:text-white">{cstr(block.content, "title")}</p>
                        <p className="text-[11px] text-gray-400">Durée : {cstr(block.content, "duration") || "Non spécifiée"}</p>
                      </div>
                    </div>
                    <button type="button" className="px-3 py-1.5 rounded-lg bg-primary/10 hover:bg-primary/20 text-primary text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer">
                      <IconPlay className="w-3.5 h-3.5 fill-current" />
                      <span>Écouter</span>
                    </button>
                  </div>
                );
              }

              // 13. Embed
              if (block.type === "embed") {
                return renderModulatedBlock(
                  block,
                  bIdx,
                  <div className="border border-gray-200 dark:border-white/10 rounded-2xl p-5 my-4 bg-gray-50 dark:bg-white/5 flex items-center justify-between">
                    <div>
                      <h4 className="text-xs font-bold text-gray-900 dark:text-white flex items-center gap-1.5">
                        <IconExternalLink className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400 shrink-0" strokeWidth={1.75} />
                        <span>{cstr(block.content, "title")}</span>
                      </h4>
                      <p className="text-[11px] text-gray-400">{cstr(block.content, "url")}</p>
                    </div>
                    <a href={cstr(block.content, "url")} target="_blank" rel="noreferrer" className="px-3.5 py-1.5 bg-primary text-white text-xs font-semibold rounded-lg">
                      Ouvrir ↗
                    </a>
                  </div>
                );
              }

              // 14. Quiz QCM
              if (block.type === "quiz") {
                const userSelected = previewQuizAnswer[block.id];
                const correctAnswer = cnum(block.content, "answer");
                const hasAnswered = typeof userSelected === "number";

                return renderModulatedBlock(
                  block,
                  bIdx,
                  <div className="bg-primary/5 dark:bg-white/5 border border-primary/20 rounded-2xl p-6 space-y-4 my-6">
                    <span className="text-xs font-bold text-primary dark:text-secondary uppercase tracking-wider">
                      Question QCM interactive
                    </span>
                    <h3 className="text-base font-bold text-gray-900 dark:text-white">
                      {cstr(block.content, "question")}
                    </h3>
                    <div className="space-y-2">
                      {carr(block.content, "options").map((opt, idx) => {
                        const isCorrect = idx === correctAnswer;
                        const isChosen = userSelected === idx;

                        let style = "border-gray-200 dark:border-white/10 bg-white dark:bg-navy hover:border-primary";
                        if (hasAnswered) {
                          if (isCorrect) style = "border-emerald-500 bg-emerald-500/10 text-emerald-800 dark:text-emerald-300";
                          else if (isChosen) style = "border-danger bg-danger/10 text-danger";
                        }

                        return (
                          <button
                            key={idx}
                            type="button"
                            onClick={() => setPreviewQuizAnswer((prev) => ({ ...prev, [block.id]: idx }))}
                            className={`w-full text-left flex items-center gap-3 p-3 rounded-xl border transition-all cursor-pointer ${style}`}
                          >
                            <span className="w-6 h-6 rounded-full border border-current flex items-center justify-center text-xs font-bold">
                              {String.fromCharCode(65 + idx)}
                            </span>
                            <span className="text-sm font-medium flex-1">{opt}</span>
                            {hasAnswered && isCorrect && (
                              <span className="text-emerald-500 font-bold flex items-center gap-1 text-xs">
                                <Check className="w-3.5 h-3.5" strokeWidth={2.5} />
                                <span>Bonne réponse</span>
                              </span>
                            )}
                            {hasAnswered && isChosen && !isCorrect && (
                              <span className="text-danger font-bold flex items-center gap-1 text-xs">
                                <IconX className="w-3.5 h-3.5" strokeWidth={2.5} />
                                <span>Incorrect</span>
                              </span>
                            )}
                          </button>
                        );
                      })}
                    </div>
                    {hasAnswered && cstr(block.content, "explanation") && (
                      <div className="p-3 bg-white dark:bg-navy border border-gray-200 dark:border-white/10 rounded-xl text-xs text-gray-600 dark:text-gray-300 animate-fadeIn">
                        <strong className="text-primary font-bold">Explication : </strong>
                        {cstr(block.content, "explanation")}
                      </div>
                    )}
                  </div>
                );
              }

              // 15. Vrai / Faux
              if (block.type === "truefalse") {
                const userChoice = previewTfAnswer[block.id];
                const expected = Boolean(block.content.isTrue);
                const hasAnswered = typeof userChoice === "boolean";

                return renderModulatedBlock(
                  block,
                  bIdx,
                  <div className="border border-gray-200 dark:border-white/10 rounded-2xl p-5 my-4 bg-gray-50 dark:bg-white/5 space-y-3">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-primary">Test Rapide : Vrai ou Faux ?</span>
                    <p className="text-sm font-bold text-gray-900 dark:text-white">{cstr(block.content, "statement")}</p>
                    <div className="flex items-center gap-3">
                      <button
                        type="button"
                        onClick={() => setPreviewTfAnswer((prev) => ({ ...prev, [block.id]: true }))}
                        className={`px-4 py-2 rounded-xl text-xs font-bold border transition-all cursor-pointer inline-flex items-center gap-1.5 ${
                          hasAnswered && expected === true ? "bg-emerald-500 text-white border-emerald-500" :
                          hasAnswered && userChoice === true && !expected ? "bg-danger text-white border-danger" :
                          "bg-white dark:bg-navy border-gray-200 dark:border-white/10 hover:border-emerald-500 text-emerald-600"
                        }`}
                      >
                        <Check className="w-3.5 h-3.5" strokeWidth={2.5} />
                        <span>VRAI</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setPreviewTfAnswer((prev) => ({ ...prev, [block.id]: false }))}
                        className={`px-4 py-2 rounded-xl text-xs font-bold border transition-all cursor-pointer inline-flex items-center gap-1.5 ${
                          hasAnswered && expected === false ? "bg-emerald-500 text-white border-emerald-500" :
                          hasAnswered && userChoice === false && expected ? "bg-danger text-white border-danger" :
                          "bg-white dark:bg-navy border-gray-200 dark:border-white/10 hover:border-danger text-danger"
                        }`}
                      >
                        <IconX className="w-3.5 h-3.5" strokeWidth={2.5} />
                        <span>FAUX</span>
                      </button>
                    </div>
                    {hasAnswered && (
                      <p className="text-xs text-gray-600 dark:text-gray-300 pt-1">
                        <strong>{userChoice === expected ? "Bravo !" : "Attention :"} </strong>
                        {cstr(block.content, "explanation")}
                      </p>
                    )}
                  </div>
                );
              }

              // 16. Exercice pratique
              if (block.type === "exercise") {
                const state = previewRevealedExercises[block.id] || { hint: false, solution: false };
                return renderModulatedBlock(
                  block,
                  bIdx,
                  <div className="border border-purple-500/20 bg-purple-500/5 rounded-2xl p-6 space-y-3 my-6">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold uppercase tracking-wider text-purple-600 flex items-center gap-1.5">
                        <IconCheckSquare className="w-3.5 h-3.5" strokeWidth={1.8} />
                        <span>Exercice Pratique</span>
                      </span>
                      <span className="text-xs text-gray-400">À faire en autonomie</span>
                    </div>
                    <h3 className="text-base font-bold text-gray-900 dark:text-white">{cstr(block.content, "title")}</h3>
                    <p className="text-sm text-gray-700 dark:text-gray-200 whitespace-pre-wrap">{cstr(block.content, "instruction")}</p>
                    <div className="flex items-center gap-2 pt-2">
                      {cstr(block.content, "hint") && (
                        <button
                          type="button"
                          onClick={() => setPreviewRevealedExercises((prev) => ({ ...prev, [block.id]: { ...state, hint: !state.hint } }))}
                          className="text-xs font-semibold px-3 py-1.5 rounded-lg border border-purple-300 text-purple-700 dark:text-purple-300 bg-white dark:bg-navy inline-flex items-center gap-1.5 cursor-pointer hover:bg-purple-50 transition-colors"
                        >
                          <IconLightbulb className="w-3.5 h-3.5 text-purple-600" strokeWidth={1.8} />
                          <span>{state.hint ? "Masquer l'indice" : "Voir l'indice"}</span>
                        </button>
                      )}
                      {cstr(block.content, "solution") && (
                        <button
                          type="button"
                          onClick={() => setPreviewRevealedExercises((prev) => ({ ...prev, [block.id]: { ...state, solution: !state.solution } }))}
                          className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-purple-600 hover:bg-purple-700 text-white inline-flex items-center gap-1.5 cursor-pointer transition-colors"
                        >
                          <KeyRound className="w-3.5 h-3.5 text-white" strokeWidth={1.8} />
                          <span>{state.solution ? "Masquer la solution" : "Découvrir la solution"}</span>
                        </button>
                      )}
                    </div>
                    {state.hint && (
                      <div className="p-3 bg-white dark:bg-navy rounded-xl border border-purple-200 text-xs text-gray-600 dark:text-gray-300 flex items-start gap-2">
                        <IconLightbulb className="w-3.5 h-3.5 text-purple-600 shrink-0 mt-0.5" strokeWidth={1.8} />
                        <div>
                          <strong className="text-purple-700 dark:text-purple-300 font-bold">Indice : </strong>
                          {cstr(block.content, "hint")}
                        </div>
                      </div>
                    )}
                    {state.solution && (
                      <div className="p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-xs text-emerald-900 dark:text-emerald-200 flex items-start gap-2">
                        <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" strokeWidth={2.5} />
                        <div>
                          <strong className="text-emerald-700 dark:text-emerald-300 font-bold">Solution détaillée : </strong>
                          {cstr(block.content, "solution")}
                        </div>
                      </div>
                    )}
                  </div>
                );
              }

              // 17. Flashcard
              if (block.type === "flashcard") {
                const isFlipped = Boolean(previewFlippedCards[block.id]);
                return renderModulatedBlock(
                  block,
                  bIdx,
                  <div className="max-w-md mx-auto my-6">
                    <div
                      onClick={() => setPreviewFlippedCards((prev) => ({ ...prev, [block.id]: !isFlipped }))}
                      className="border-2 border-primary/30 rounded-2xl p-8 text-center bg-white dark:bg-navy shadow-sm cursor-pointer hover:border-primary transition-all min-h-[160px] flex flex-col justify-between"
                    >
                      <span className="text-[10px] uppercase font-bold text-primary tracking-wider">
                        {cstr(block.content, "category") || "Flashcard"} • {isFlipped ? "Verso (Réponse)" : "Recto (Question)"}
                      </span>
                      <p className="text-base font-bold text-gray-900 dark:text-white py-3">
                        {isFlipped ? cstr(block.content, "back") : cstr(block.content, "front")}
                      </p>
                      <span className="text-[11px] text-gray-400 font-semibold inline-flex items-center justify-center gap-1.5">
                        <span>Cliquez pour {isFlipped ? "revenir à la question" : "révéler la réponse"}</span>
                        <RotateCw className="w-3 h-3 text-gray-400 shrink-0" strokeWidth={1.8} />
                      </span>
                    </div>
                  </div>
                );
              }

              // 18. Summary
              if (block.type === "summary") {
                return renderModulatedBlock(
                  block,
                  bIdx,
                  <div className="bg-gradient-to-br from-amber-500/10 to-amber-500/5 border border-amber-500/30 rounded-2xl p-6 space-y-3 my-6">
                    <h3 className="text-base font-bold text-amber-900 dark:text-amber-300 flex items-center gap-2">
                      <IconStar className="w-4 h-4 text-amber-500 shrink-0" strokeWidth={2} />
                      <span>{cstr(block.content, "title") || "Points clés à retenir"}</span>
                    </h3>
                    <ul className="space-y-1.5 text-xs text-gray-700 dark:text-gray-200">
                      {carr(block.content, "points").map((p, pIdx) => (
                        <li key={pIdx} className="flex items-start gap-2">
                          <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 font-bold shrink-0 mt-0.5" strokeWidth={2.5} />
                          <span>{p}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                );
              }

              // 19. Resources
              if (block.type === "resources") {
                const links = (block.content.links as { title: string; url: string; type: string }[]) || [];
                return renderModulatedBlock(
                  block,
                  bIdx,
                  <div className="border border-gray-200 dark:border-white/10 rounded-2xl p-6 space-y-3 my-6 bg-gray-50 dark:bg-white/5">
                    <h3 className="text-sm font-bold uppercase tracking-wider text-gray-900 dark:text-white flex items-center gap-2">
                      <IconLibrary className="w-4 h-4 text-sky-600 dark:text-sky-400 shrink-0" strokeWidth={1.8} />
                      <span>Ressources recommandées & Bibliographie</span>
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                      {links.map((lnk, lIdx) => (
                        <a
                          key={lIdx}
                          href={lnk.url}
                          target="_blank"
                          rel="noreferrer"
                          className="flex items-center justify-between p-3 rounded-xl border border-gray-200 dark:border-white/10 bg-white dark:bg-navy hover:border-primary transition-all text-xs"
                        >
                          <div>
                            <p className="font-bold text-gray-900 dark:text-white">{lnk.title}</p>
                            <span className="text-[10px] text-primary">{lnk.type || "Lien"}</span>
                          </div>
                          <IconExternalLink className="w-3.5 h-3.5 text-gray-400 shrink-0" strokeWidth={1.8} />
                        </a>
                      ))}
                    </div>
                  </div>
                );
              }

              // 20. Point d'histoire (accordéon déroulant avec photo toujours visible)
              if (block.type === "history") {
                const sub = cstr(block.content, "subtitle") || "Point d'histoire";
                const era = cstr(block.content, "era");
                const tit = cstr(block.content, "title") || "Point d'histoire";
                const img = cstr(block.content, "imageUrl") || "https://upload.wikimedia.org/wikipedia/commons/a/a2/George_EP_Box.jpg";
                const cap = cstr(block.content, "caption");
                const qte = cstr(block.content, "quote");
                const txt = cstr(block.content, "content");
                const defOpen = Boolean(block.content.defaultOpen);

                return renderModulatedBlock(
                  block,
                  bIdx,
                  <details
                    className="group border border-amber-200/80 dark:border-amber-700/30 bg-amber-50/40 dark:bg-amber-950/20 rounded-2xl overflow-hidden transition-all shadow-xs my-6"
                    open={defOpen ? true : undefined}
                  >
                    <summary className="flex items-center justify-between gap-4 p-4 sm:p-5 cursor-pointer list-none select-none hover:bg-amber-100/50 dark:hover:bg-amber-900/30 transition-colors">
                      <div className="flex items-center gap-4 min-w-0">
                        {/* Photo / Portrait toujours visible */}
                        <div className="relative shrink-0">
                          <img
                            src={img}
                            alt={cap || tit}
                            className="w-14 h-14 sm:w-16 sm:h-16 rounded-xl object-cover shadow-sm border-2 border-amber-300 dark:border-amber-600/50"
                            loading="lazy"
                            onError={(e) => { (e.target as HTMLElement).style.display = "none"; }}
                          />
                          <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-amber-600 text-white flex items-center justify-center text-[10px] shadow-xs">
                            <IconHistory className="w-3 h-3 text-white" strokeWidth={2} />
                          </div>
                        </div>

                        {/* Textes du summary */}
                        <div className="flex-1 min-w-0">
                          <div className="flex flex-wrap items-center gap-2 mb-1">
                            <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-amber-600/15 text-amber-900 dark:text-amber-200 border border-amber-300/50 dark:border-amber-700/50">
                              {sub}
                            </span>
                            {era && (
                              <span className="text-xs text-amber-800/80 dark:text-amber-400 font-medium">
                                ({era})
                              </span>
                            )}
                          </div>
                          <WordEditableText
                            value={tit}
                            onChange={(val) => setContent(block.id, { ...block.content, title: val })}
                            as="h4"
                            blockId={block.id}
                            className="text-base sm:text-lg font-bold text-gray-900 dark:text-white truncate select-text"
                            isWordMode={isWordPageMode}
                            placeholder="Titre du point d'histoire..."
                          />
                        </div>
                      </div>

                      {/* Indicateur déplier / replier */}
                      <div className="flex items-center gap-1.5 text-xs font-semibold text-amber-800 dark:text-amber-300 shrink-0">
                        <span className="hidden sm:inline text-[11px] font-medium opacity-80 group-open:hidden">
                          Dérouler le récit
                        </span>
                        <span className="hidden sm:inline text-[11px] font-medium opacity-80 hidden group-open:inline">
                          Replier
                        </span>
                        <ChevronDown className="w-4 h-4 transition-transform duration-200 group-open:rotate-180" />
                      </div>
                    </summary>

                    {/* Récit historique déroulé */}
                    <div className="border-t border-amber-200/60 dark:border-amber-800/30 p-5 sm:p-6 space-y-4 bg-white/70 dark:bg-navy/50">
                      {qte && (
                        <blockquote className="border-l-4 border-amber-500 pl-4 py-2 italic text-sm text-amber-950 dark:text-amber-200 bg-amber-100/40 dark:bg-amber-900/20 rounded-r-xl">
                          <WordEditableText
                            value={qte}
                            onChange={(val) => setContent(block.id, { ...block.content, quote: val })}
                            as="span"
                            blockId={block.id}
                            className="select-text"
                            isWordMode={isWordPageMode}
                            placeholder="Citation historique..."
                          />
                        </blockquote>
                      )}
                      <WordEditableText
                        value={txt}
                        onChange={(val) => setContent(block.id, { ...block.content, content: val })}
                        as="div"
                        blockId={block.id}
                        className="text-sm leading-relaxed text-gray-800 dark:text-gray-200 whitespace-pre-wrap font-serif select-text"
                        isWordMode={isWordPageMode}
                        placeholder="Récit historique..."
                      />
                      {cap && (
                        <p className="text-[11px] text-gray-500 dark:text-gray-400 italic pt-1 flex items-center gap-1.5">
                          <ImageIcon className="w-3.5 h-3.5 text-gray-400 shrink-0" strokeWidth={1.8} />
                          <span>{cap}</span>
                        </p>
                      )}
                    </div>
                  </details>
                );
              }

              return null;
            })}

            {/* Décompte sobre de fin de document (mots et blocs) */}
            <div className="pt-8 mt-6 border-t border-gray-100 dark:border-white/5 flex flex-wrap items-center justify-between gap-3 text-xs text-gray-400 dark:text-gray-500 select-none">
              <div className="flex items-center gap-2">
                <span>{courseStats.words.toLocaleString("fr-FR")} mots</span>
                <span>•</span>
                <span>{blocks.length} blocs</span>
                <span>•</span>
                <span>~{courseStats.readingTime} min de lecture</span>
              </div>
              <span className="text-[11px] opacity-60">
                Hi! Platform • Document de cours
              </span>
            </div>

            <div className="clear-both" />
          </div>
        </div>

        {/* FLANC EXTÉRIEUR DROIT (Positionné à l'extérieur des limites du dock) */}
        {(tocPlacement === "right" || rightAuthorBlocks.length > 0) && (
          <aside className="hidden min-[1540px]:block absolute left-[calc(100%+1.5rem)] top-0 bottom-0 w-72 2xl:w-80 z-20 pointer-events-none">
            {/* Sommaire : Prioritaire & Toujours visible */}
            {tocPlacement === "right" && (
              <div className="sticky top-[160px] pointer-events-auto">
                {renderTableOfContents()}
              </div>
            )}

            {/* Fiche auteur flanc droit : au début du cours, disparaît au scroll si sommaire présent */}
            {rightAuthorBlocks.length > 0 && (
              <div className={`pointer-events-auto space-y-4 ${
                tocPlacement === "right"
                  ? isScrolled
                    ? "opacity-0 pointer-events-none max-h-0 overflow-hidden transition-all duration-300"
                    : "mt-4 transition-all duration-300"
                  : "mt-0"
              }`}>
                {rightAuthorBlocks.map((b) => renderAuthorCard(b))}
              </div>
            )}
          </aside>
        )}

      </div>
    )}

      {/* ═════════════════════════════════════════════════════════════════════════ */}
      {/* MENU CONTEXTUEL FLOTTANT STYLE MICROSOFT WORD (SÉLECTION OU CLIC DROIT)   */}
      {/* ═════════════════════════════════════════════════════════════════════════ */}
      {viewMode === "preview" && floatingToolbar.isOpen && (
        <div
          className="word-floating-toolbar fixed z-50 bg-white/95 dark:bg-navy/95 backdrop-blur-md border border-gray-200/90 dark:border-white/15 rounded-xl shadow-2xl p-1.5 flex items-center gap-1 select-none text-xs animate-in fade-in zoom-in-95 duration-150 transition-all ring-1 ring-black/5"
          style={{
            left: `${floatingToolbar.x}px`,
            top: `${floatingToolbar.y}px`,
          }}
          onMouseDown={(e) => e.stopPropagation()}
        >
          {/* Sélecteur de Police */}
          <select
            value={courseFont}
            onChange={(e) => setCourseFont(e.target.value as FontFamilyKey)}
            className="text-[11px] font-medium px-1.5 py-1 rounded-md border border-gray-200 dark:border-white/10 bg-white dark:bg-navy-dark text-gray-800 dark:text-gray-200 hover:border-gray-300 focus:outline-none focus:ring-1 focus:ring-primary h-7 max-w-[110px] cursor-pointer"
            title="Police de texte"
          >
            {FONT_FAMILIES.map((f) => (
              <option key={f.key} value={f.key}>
                {f.label}
              </option>
            ))}
          </select>

          {/* Sélecteur de Taille */}
          <select
            value={courseFontSize}
            onChange={(e) => setCourseFontSize(Number(e.target.value))}
            className="text-[11px] font-semibold px-1 py-1 rounded-md border border-gray-200 dark:border-white/10 bg-white dark:bg-navy-dark text-gray-800 dark:text-gray-200 hover:border-gray-300 focus:outline-none focus:ring-1 focus:ring-primary h-7 w-12 text-center cursor-pointer"
            title="Taille de police (px)"
          >
            {FONT_SIZES.map((sz) => (
              <option key={sz} value={sz}>
                {sz}
              </option>
            ))}
          </select>

          {/* Boutons A+ / A- */}
          <div className="flex items-center">
            <button
              type="button"
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => setCourseFontSize((prev) => Math.min(28, prev + 1))}
              title="Agrandir la police (A+)"
              className="p-1 h-7 w-6 rounded-md hover:bg-gray-100 dark:hover:bg-white/10 text-gray-700 dark:text-gray-200 font-bold text-[11px] flex items-center justify-center cursor-pointer transition-colors"
            >
              <span className="font-extrabold flex items-center">A<span className="text-[8px] text-primary dark:text-blue-400">▲</span></span>
            </button>
            <button
              type="button"
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => setCourseFontSize((prev) => Math.max(12, prev - 1))}
              title="Réduire la police (A-)"
              className="p-1 h-7 w-6 rounded-md hover:bg-gray-100 dark:hover:bg-white/10 text-gray-700 dark:text-gray-200 font-bold text-[11px] flex items-center justify-center cursor-pointer transition-colors"
            >
              <span className="font-extrabold flex items-center">A<span className="text-[8px] text-gray-500">▼</span></span>
            </button>
          </div>

          <div className="w-[1px] h-4 bg-gray-200 dark:bg-white/10 mx-0.5" />

          {/* Formatage : Gras, Italique, Souligné */}
          <button
            type="button"
            onMouseDown={(e) => e.preventDefault()}
            onClick={() => applyFormatting("bold")}
            title="Gras (**texte**)"
            className="p-1 h-7 w-7 rounded-md hover:bg-gray-100 dark:hover:bg-white/10 text-gray-700 dark:text-gray-200 transition-colors cursor-pointer flex items-center justify-center hover:text-primary font-bold"
          >
            <IconBold className="w-3.5 h-3.5" strokeWidth={2.5} />
          </button>
          <button
            type="button"
            onMouseDown={(e) => e.preventDefault()}
            onClick={() => applyFormatting("italic")}
            title="Italique (*texte*)"
            className="p-1 h-7 w-7 rounded-md hover:bg-gray-100 dark:hover:bg-white/10 text-gray-700 dark:text-gray-200 transition-colors cursor-pointer flex items-center justify-center hover:text-primary italic"
          >
            <IconItalic className="w-3.5 h-3.5" strokeWidth={2} />
          </button>
          <button
            type="button"
            onMouseDown={(e) => e.preventDefault()}
            onClick={() => applyFormatting("underline")}
            title="Souligné (<u>texte</u>)"
            className="p-1 h-7 w-7 rounded-md hover:bg-gray-100 dark:hover:bg-white/10 text-gray-700 dark:text-gray-200 transition-colors cursor-pointer flex items-center justify-center hover:text-primary underline"
          >
            <IconUnderline className="w-3.5 h-3.5" strokeWidth={2} />
          </button>

          <div className="w-[1px] h-4 bg-gray-200 dark:bg-white/10 mx-0.5" />

          {/* Formatage : Code, Surlignage */}
          <button
            type="button"
            onMouseDown={(e) => e.preventDefault()}
            onClick={() => applyFormatting("code")}
            title="Code inline (`code`)"
            className="p-1 h-7 w-7 rounded-md hover:bg-gray-100 dark:hover:bg-white/10 text-gray-700 dark:text-gray-200 transition-colors cursor-pointer flex items-center justify-center hover:text-primary"
          >
            <IconCode2 className="w-3.5 h-3.5" strokeWidth={2} />
          </button>
          <button
            type="button"
            onMouseDown={(e) => e.preventDefault()}
            onClick={() => applyFormatting("highlight")}
            title="Surligner (==texte==)"
            className="p-1 h-7 w-7 rounded-md hover:bg-amber-100 dark:hover:bg-amber-900/40 text-amber-600 dark:text-amber-400 transition-colors cursor-pointer flex items-center justify-center"
          >
            <IconHighlighter className="w-3.5 h-3.5" strokeWidth={2} />
          </button>

          {/* Action Modifier le bloc & Fermer */}
          {floatingToolbar.blockId && (
            <>
              <div className="w-[1px] h-4 bg-gray-200 dark:bg-white/10 mx-0.5" />
              <button
                type="button"
                onClick={() => {
                  setSelectedBlockId(floatingToolbar.blockId);
                  setViewMode("edit");
                  setFloatingToolbar((prev) => ({ ...prev, isOpen: false }));
                }}
                title="Modifier ce bloc en mode Édition"
                className="px-2 py-1 h-7 rounded-md bg-[#0B2F5E]/10 dark:bg-white/10 hover:bg-[#0B2F5E] dark:hover:bg-primary text-[#0B2F5E] dark:text-blue-300 hover:text-white transition-colors cursor-pointer font-bold text-[10px] flex items-center gap-1"
              >
                <Edit3 className="w-3 h-3" strokeWidth={2} />
                <span>Éditer</span>
              </button>
            </>
          )}

          <button
            type="button"
            onClick={() => setFloatingToolbar((prev) => ({ ...prev, isOpen: false }))}
            title="Fermer le menu"
            className="p-1 h-7 w-6 rounded-md hover:bg-gray-100 dark:hover:bg-white/10 text-gray-400 hover:text-gray-700 dark:hover:text-white transition-colors cursor-pointer flex items-center justify-center"
          >
            <IconX className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

    </div>
  );
}

// ─── Éditeur de Parcours MOOC ─────────────────────────────────────────────────

function MOOCEditor() {
  const [title, setTitle] = useState("Parcours Certifiant en IA & Data");
  const [description, setDescription] = useState("");
  const [school, setSchool] = useState("Hi! PARIS");
  const [search, setSearch] = useState("");
  const [selectedCourses, setSelectedCourses] = useState<string[]>([]);
  const [courses, setCourses] = useState<CourseResponse[]>([]);

  useEffect(() => {
    coursesApi.list().then(setCourses).catch(() => setCourses([]));
  }, []);

  function toggle(id: string) {
    setSelectedCourses((prev) =>
      prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id]
    );
  }

  function move(id: string, dir: "up" | "down") {
    setSelectedCourses((prev) => {
      const i = prev.indexOf(id);
      if (dir === "up" && i === 0) return prev;
      if (dir === "down" && i === prev.length - 1) return prev;
      const n = [...prev];
      const j = dir === "up" ? i - 1 : i + 1;
      [n[i], n[j]] = [n[j], n[i]];
      return n;
    });
  }

  const filteredCourses = useMemo(() => {
    if (!search.trim()) return courses;
    const q = search.toLowerCase();
    return courses.filter((c) => c.title.toLowerCase().includes(q) || (c.school?.toLowerCase().includes(q) ?? false));
  }, [courses, search]);

  const ordered = selectedCourses.map((id) => courses.find((c) => c.id === id)).filter(Boolean) as CourseResponse[];
  const totalMin = ordered.reduce((acc, c) => acc + c.estimated_duration_minutes, 0);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

      {/* Colonne gauche : Sélecteur de cours */}
      <div className="lg:col-span-5 space-y-4">
        <div className="bg-white dark:bg-navy border border-gray-200 dark:border-white/10 rounded-2xl p-5 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-wider">
              Cours du catalogue
            </h3>
            <span className="text-xs bg-primary/10 text-primary px-2.5 py-0.5 rounded-full font-bold">
              {selectedCourses.length} sélectionnés
            </span>
          </div>

          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Filtrer par mot-clé, école..."
            className={INP}
          />

          <div className="flex flex-col gap-2 max-h-[60vh] overflow-y-auto pr-1">
            {filteredCourses.length === 0 ? (
              <p className="text-xs text-gray-400 py-6 text-center">Aucun cours trouvé.</p>
            ) : (
              filteredCourses.map((c) => {
                const isSelected = selectedCourses.includes(c.id);
                return (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => toggle(c.id)}
                    className={`text-left p-3.5 rounded-xl border transition-all flex items-start gap-3 cursor-pointer ${
                      isSelected
                        ? "bg-primary/5 dark:bg-white/10 border-primary text-gray-900 dark:text-white shadow-xs"
                        : "border-gray-200 dark:border-white/10 hover:border-gray-300 dark:hover:border-white/20"
                    }`}
                  >
                    <span
                      className={`w-5 h-5 rounded-md flex items-center justify-center text-xs font-bold shrink-0 mt-0.5 ${
                        isSelected ? "bg-primary text-white" : "border border-gray-300 dark:border-white/20"
                      }`}
                    >
                      {isSelected ? <Check className="w-3.5 h-3.5 text-white" strokeWidth={2.5} /> : null}
                    </span>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-bold leading-snug line-clamp-2">{c.title}</p>
                      <div className="flex items-center gap-2 mt-1 text-[11px] text-gray-400">
                        <span>{c.school ?? "Hi! PARIS"}</span>
                        <span>•</span>
                        <span>{Math.floor(c.estimated_duration_minutes / 60)}h</span>
                        <span>•</span>
                        <span className="capitalize">{c.level}</span>
                      </div>
                    </div>
                  </button>
                );
              })
            )}
          </div>
        </div>
      </div>

      {/* Colonne droite : Métadonnées du MOOC & séquence ordonnée */}
      <div className="lg:col-span-7 space-y-5">
        <div className="bg-white dark:bg-navy border border-gray-200 dark:border-white/10 rounded-2xl p-6 shadow-sm space-y-4">
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Titre du parcours MOOC..."
            className="w-full text-xl sm:text-2xl font-extrabold text-gray-900 dark:text-white bg-transparent border-b-2 border-gray-200 dark:border-white/10 focus:border-primary focus:outline-none pb-2 transition-colors"
          />

          <div className="grid grid-cols-2 gap-4">
            <Field label="Établissement référent">
              <select value={school} onChange={(e) => setSchool(e.target.value)} className={SEL}>
                {SCHOOLS.map((s) => <option key={s}>{s}</option>)}
              </select>
            </Field>

            <Field label="Volume horaire calculé">
              <div className="bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl px-4 py-2.5 text-xs text-gray-700 dark:text-gray-300 font-semibold flex items-center justify-between">
                <span>Total estimé :</span>
                <span className="text-primary font-bold">
                  {Math.floor(totalMin / 60)}h {totalMin % 60 > 0 ? `${totalMin % 60}m` : ""} ({ordered.length} cours)
                </span>
              </div>
            </Field>
          </div>

          <Field label="Description pédagogique du parcours">
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Détaillez les compétences clés acquises par l'étudiant à l'issue de ce parcours..."
              rows={3}
              className={TXA}
            />
          </Field>
        </div>

        {/* Séquence ordonnée */}
        <div className="bg-white dark:bg-navy border border-gray-200 dark:border-white/10 rounded-2xl p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-wider">
              Ordre de progression des cours
            </h3>
            <span className="text-xs text-gray-400">
              Glissez ou cliquez sur les flèches pour réordonner
            </span>
          </div>

          {ordered.length === 0 ? (
            <div className="border-2 border-dashed border-gray-200 dark:border-white/10 rounded-xl p-8 text-center text-xs text-gray-400">
              Cochez des cours dans la liste de gauche pour bâtir la séquence de votre parcours.
            </div>
          ) : (
            <div className="space-y-2.5">
              {ordered.map((c, i) => (
                <div
                  key={c.id}
                  className="flex items-center justify-between gap-3 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl p-3.5 hover:border-primary/40 transition-colors"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <span className="w-6 h-6 rounded-lg bg-primary/10 text-primary font-bold text-xs flex items-center justify-center shrink-0">
                      {i + 1}
                    </span>
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-gray-900 dark:text-white truncate">{c.title}</p>
                      <p className="text-[11px] text-gray-400">{c.school ?? "Hi! PARIS"} · {Math.floor(c.estimated_duration_minutes / 60)}h</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-1 shrink-0">
                    <button
                      type="button"
                      onClick={() => move(c.id, "up")}
                      disabled={i === 0}
                      className="p-1 text-xs text-gray-400 hover:text-gray-900 dark:hover:text-white disabled:opacity-20 cursor-pointer"
                      title="Monter"
                    >
                      <ChevronUp className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => move(c.id, "down")}
                      disabled={i === ordered.length - 1}
                      className="p-1 text-xs text-gray-400 hover:text-gray-900 dark:hover:text-white disabled:opacity-20 cursor-pointer"
                      title="Descendre"
                    >
                      <ChevronDown className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => toggle(c.id)}
                      className="p-1 text-xs text-danger hover:bg-danger/10 rounded ml-1 cursor-pointer"
                      title="Retirer"
                    >
                      <IconX className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="pt-3 flex justify-end">
            <button
              disabled={ordered.length === 0 || !title.trim()}
              className="bg-primary hover:bg-primary-dark text-white px-5 py-2.5 rounded-xl text-sm font-semibold transition-all shadow-sm disabled:opacity-40 cursor-pointer"
            >
              Enregistrer le parcours MOOC →
            </button>
          </div>
        </div>
      </div>

    </div>
  );
}

// ─── Éditeur de Vidéo ─────────────────────────────────────────────────────────

function VideoEditor() {
  const [title, setTitle] = useState("Comprendre les Transformers et l'Attention en 15 minutes");
  const [videoInput, setVideoInput] = useState("https://www.youtube.com/watch?v=aircAruvnKk");
  const [thumbnailUrl, setThumbnailUrl] = useState("");
  const [category, setCategory] = useState("IA & Data");
  const [school, setSchool] = useState("Polytechnique");
  const [duration, setDuration] = useState("14:32");
  const [tags, setTags] = useState<string[]>(["Deep Learning", "Transformers", "NLP"]);
  const [description, setDescription] = useState("Une explication claire et visuelle du mécanisme d'attention (Scaled Dot-Product) introduit dans le papier Attention Is All You Need.");

  const youtubeId = extractYoutubeId(videoInput);

  const thumbSrc = youtubeId
    ? `https://img.youtube.com/vi/${youtubeId}/maxresdefault.jpg`
    : thumbnailUrl || null;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

      {/* Prévisualisation Hi! Tube */}
      <div className="lg:col-span-5">
        <div className="bg-white dark:bg-navy border border-gray-200 dark:border-white/10 rounded-2xl overflow-hidden shadow-sm sticky top-24">
          <div className="p-4 border-b border-gray-100 dark:border-white/10 flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-gray-500">
              Aperçu Hi! Tube
            </span>
            <span className="text-[11px] bg-red-600/10 text-red-600 px-2 py-0.5 rounded font-bold">
              Vidéo
            </span>
          </div>

          <div className="aspect-video bg-gray-900 relative overflow-hidden flex items-center justify-center">
            {thumbSrc ? (
              <img src={thumbSrc} alt="Miniature vidéo" className="w-full h-full object-cover" />
            ) : (
              <div className="text-center text-gray-400 p-6">
                <span className="text-4xl block mb-2">▶</span>
                <span className="text-xs">Renseignez une URL YouTube</span>
              </div>
            )}
            {duration && (
              <span className="absolute bottom-2.5 right-2.5 bg-black/80 backdrop-blur-sm text-white text-[11px] font-mono px-2 py-0.5 rounded-md font-semibold">
                {duration}
              </span>
            )}
          </div>

          <div className="p-5 space-y-2">
            <div className="flex items-center gap-2 text-xs text-primary font-bold">
              <span>{school}</span>
              <span>•</span>
              <span>{category}</span>
            </div>
            <h4 className="text-sm font-bold text-gray-900 dark:text-white line-clamp-2 leading-snug">
              {title || "Titre de la capsule vidéo"}
            </h4>
            <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2">
              {description || "Description sommaire du contenu..."}
            </p>

            {tags.length > 0 && (
              <div className="flex flex-wrap gap-1 pt-2">
                {tags.slice(0, 3).map((t) => (
                  <span key={t} className="text-[10px] bg-gray-100 dark:bg-white/10 text-gray-600 dark:text-gray-300 px-2 py-0.5 rounded-full">
                    #{t}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Formulaire */}
      <div className="lg:col-span-7">
        <div className="bg-white dark:bg-navy border border-gray-200 dark:border-white/10 rounded-2xl p-6 shadow-sm space-y-4">
          <Field label="Titre de la vidéo *">
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Ex : Réseaux Récurrents (LSTM & GRU)..."
              className={INP}
            />
          </Field>

          <div className="grid grid-cols-2 gap-4">
            <Field label="Lien YouTube ou ID *" hint="Ex : https://youtube.com/watch?v=... ou aircAruvnKk">
              <input
                value={videoInput}
                onChange={(e) => setVideoInput(e.target.value)}
                placeholder="https://youtube.com/watch?v=..."
                className={INP}
              />
            </Field>

            <Field label="Durée estimée" hint="Format : mm:ss">
              <input
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                placeholder="15:00"
                className={INP}
              />
            </Field>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Field label="Catégorie">
              <select value={category} onChange={(e) => setCategory(e.target.value)} className={SEL}>
                {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
              </select>
            </Field>
            <Field label="Établissement">
              <select value={school} onChange={(e) => setSchool(e.target.value)} className={SEL}>
                {SCHOOLS.map((s) => <option key={s}>{s}</option>)}
              </select>
            </Field>
          </div>

          <Field label="Tags clés">
            <TagInput tags={tags} onChange={setTags} />
          </Field>

          <Field label="Description détaillée">
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              placeholder="Expliquez brièvement le sujet abordé dans la vidéo..."
              className={TXA}
            />
          </Field>

          <div className="pt-2 flex justify-end">
            <button
              disabled={!title.trim() || !youtubeId}
              className="bg-primary hover:bg-primary-dark text-white px-5 py-2.5 rounded-xl text-sm font-semibold transition-all shadow-sm disabled:opacity-40 cursor-pointer"
            >
              Publier la vidéo sur Hi! Tube →
            </button>
          </div>
        </div>
      </div>

    </div>
  );
}

// ─── Éditeur d'Application ────────────────────────────────────────────────────

function AppEditor() {
  const [title, setTitle] = useState("Visualiseur de Détecteur d'Objets YOLO");
  const [url, setUrl] = useState("https://yolo-object-detection.streamlit.app");
  const [description, setDescription] = useState("Une application Streamlit interactive pour tester en temps réel les inférences de YOLOv8 sur vos propres images.");
  const [school, setSchool] = useState("Télécom Paris");
  const [tags, setTags] = useState<string[]>(["Computer Vision", "YOLO", "Streamlit"]);

  const validUrl = url.startsWith("http://") || url.startsWith("https://");

  const techType = useMemo(() => {
    if (url.includes("streamlit")) return "Streamlit";
    if (url.includes("gradio") || url.includes("hf.space")) return "Gradio";
    if (url.includes("observable")) return "Observable";
    if (url.includes("colab")) return "Google Colab";
    return "Application Web";
  }, [url]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

      {/* Aperçu de la carte Application */}
      <div className="lg:col-span-5">
        <div className="bg-white dark:bg-navy border border-gray-200 dark:border-white/10 rounded-2xl p-5 shadow-sm sticky top-24 space-y-4">
          <div className="flex items-center justify-between border-b border-gray-100 dark:border-white/10 pb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-gray-500">
              Aperçu dans le catalogue Apps
            </span>
            <span className="text-xs font-bold bg-purple-500/10 text-purple-600 px-2.5 py-0.5 rounded-full">
              {techType}
            </span>
          </div>

          <div className="border border-gray-200 dark:border-white/10 rounded-xl p-4 bg-gray-50 dark:bg-white/5 space-y-3">
            <h4 className="font-bold text-gray-900 dark:text-white text-base">
              {title || "Nom de l'application"}
            </h4>
            <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-3 leading-relaxed">
              {description || "Description des fonctionnalités de l'outil interactif..."}
            </p>

            <div className="flex flex-wrap gap-1">
              {tags.map((t) => (
                <span key={t} className="text-[11px] bg-white dark:bg-white/10 text-gray-600 dark:text-gray-300 px-2 py-0.5 rounded-md border border-gray-200 dark:border-white/10">
                  {t}
                </span>
              ))}
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-gray-200 dark:border-white/10 text-xs text-gray-500">
              <span>{school}</span>
              <span className={validUrl ? "text-primary font-bold" : "text-gray-400"}>
                {validUrl ? "Lancer l'app →" : "URL manquante"}
              </span>
            </div>
          </div>

          {validUrl && (
            <a
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full flex items-center justify-center gap-2 text-xs font-semibold text-primary hover:text-white border border-primary hover:bg-primary rounded-xl py-2.5 transition-all"
            >
              <span>Tester l&apos;application en direct</span>
              <span>↗</span>
            </a>
          )}
        </div>
      </div>

      {/* Formulaire */}
      <div className="lg:col-span-7">
        <div className="bg-white dark:bg-navy border border-gray-200 dark:border-white/10 rounded-2xl p-6 shadow-sm space-y-4">
          <Field label="Nom de l'application *">
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Ex : Simulateur de Marché de Prédiction..."
              className={INP}
            />
          </Field>

          <Field label="URL publique sécurisée *" hint="Streamlit Cloud, Hugging Face Spaces, Gradio, Observable, etc.">
            <input
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://mon-app.streamlit.app"
              className={`${INP} ${validUrl ? "border-emerald-500/40" : url ? "border-danger/40" : ""}`}
            />
          </Field>

          <Field label="Établissement rattaché">
            <select value={school} onChange={(e) => setSchool(e.target.value)} className={SEL}>
              {SCHOOLS.map((s) => <option key={s}>{s}</option>)}
            </select>
          </Field>

          <Field label="Mots-clés & Technologies">
            <TagInput tags={tags} onChange={setTags} />
          </Field>

          <Field label="Description détaillée">
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              placeholder="Décrivez les cas d'usage pédagogiques et la façon dont les étudiants doivent manipuler l'application..."
              className={TXA}
            />
          </Field>

          <div className="pt-2 flex justify-end">
            <button
              disabled={!title.trim() || !validUrl}
              className="bg-primary hover:bg-primary-dark text-white px-5 py-2.5 rounded-xl text-sm font-semibold transition-all shadow-sm disabled:opacity-40 cursor-pointer"
            >
              Enregistrer l&apos;application →
            </button>
          </div>
        </div>
      </div>

    </div>
  );
}

// ─── Studio IA (Pipelines automatisés) ────────────────────────────────────────

function AIStudio() {
  const pipelines: {
    href: string;
    icon: React.ReactNode;
    title: string;
    desc: string;
    badge: string;
    tag: string;
    cta: string;
  }[] = [
    {
      href: "/studio/excel-quiz",
      icon: <IconTable className="w-6 h-6 text-emerald-600 dark:text-emerald-400" strokeWidth={1.8} />,
      title: "Excel → Quiz QCM",
      desc: "Transformez vos tableaux Excel et grilles pédagogiques en quiz interactifs calibrés avec explications détaillées.",
      badge: "Génération QCM",
      tag: "Claude 3.5",
      cta: "Générer un quiz",
    },
    {
      href: "/studio/pdf-course",
      icon: <IconFileText className="w-6 h-6 text-blue-600 dark:text-blue-400" strokeWidth={1.8} />,
      title: "PDF → Cours structuré",
      desc: "Uploadez vos polycopiés, articles ou supports de cours pour générer automatiquement un plan de cours Markdown complet.",
      badge: "Extraction Documentaire",
      tag: "Mistral Large",
      cta: "Convertir un PDF",
    },
    {
      href: "/studio/video-course",
      icon: <IconPlay className="w-6 h-6 text-rose-600 dark:text-rose-400" strokeWidth={1.8} />,
      title: "Vidéo + Slides → Cours complet",
      desc: "Synchronisez une vidéo de cours et votre diaporama PPTX/PDF pour synthétiser les concepts clés et les quiz associés.",
      badge: "Multimodalité",
      tag: "Whisper + Claude",
      cta: "Générer depuis vidéo",
    },
    {
      href: "/studio/ai-tools",
      icon: <LucideSparkles className="w-6 h-6 text-purple-600 dark:text-purple-400" strokeWidth={1.8} />,
      title: "Boîte à Outils Pédagogiques",
      desc: "À partir de n'importe quel texte de cours, créez instantanément des fiches de révision, flashcards, cartes mentales et FAQ.",
      badge: "Synthèse IA",
      tag: "Outils rapides",
      cta: "Explorer les outils",
    },
  ];

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-primary/10 via-primary/5 to-secondary/10 border border-primary/20 rounded-2xl p-6 sm:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-primary dark:text-secondary mb-2">
            <LucideSparkles className="w-4 h-4 text-primary shrink-0" strokeWidth={2} />
            <span>Intelligence Artificielle Hi! PARIS</span>
          </span>
          <h2 className="text-xl sm:text-2xl font-extrabold text-gray-900 dark:text-white">
            Studio d&apos;Accélération Pédagogique IA
          </h2>
          <p className="text-sm text-gray-600 dark:text-gray-300 mt-1 max-w-2xl leading-relaxed">
            Convertissez vos ressources existantes (vidéos, PDF, fichiers Excel) en modules d&apos;apprentissage interactifs prêts pour le catalogue.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {pipelines.map((p) => (
          <div
            key={p.href}
            className="bg-white dark:bg-navy border border-gray-200 dark:border-white/10 rounded-2xl p-6 shadow-sm hover:shadow-md hover:border-primary/40 transition-all flex flex-col justify-between space-y-4 group"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="w-12 h-12 rounded-xl bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/10 flex items-center justify-center">
                  {p.icon}
                </span>
                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-mono px-2 py-0.5 rounded-full bg-gray-100 dark:bg-white/10 text-gray-600 dark:text-gray-300">
                    {p.tag}
                  </span>
                  <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-primary/10 text-primary dark:text-white border border-primary/20 dark:border-white/10">
                    {p.badge}
                  </span>
                </div>
              </div>

              <h3 className="text-base font-bold text-gray-900 dark:text-white group-hover:text-primary transition-colors">
                {p.title}
              </h3>
              <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed">
                {p.desc}
              </p>
            </div>

            <Link
              href={p.href}
              className="w-full bg-primary hover:bg-primary-dark text-white text-xs font-bold py-2.5 px-4 rounded-xl transition-all shadow-xs flex items-center justify-center gap-2"
            >
              <span>{p.cta}</span>
              <span>→</span>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Composant Principal StudioPage ───────────────────────────────────────────

export default function StudioPage() {
  const [mode, setMode] = useState<Mode>("course");

  const currentTab = useMemo(() => {
    return MODE_TABS.find((t) => t.key === mode) ?? MODE_TABS[0];
  }, [mode]);

  return (
    <div className="w-full max-w-[1600px] 2xl:max-w-[1720px] mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6">

      {/* En-tête harmonisé avec le Design System Hi! PARIS */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-gray-200 dark:border-white/10 pb-6">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight">
                <span className="text-[#FF034D]">Hi!</span> Studio
              </h1>
              <span className="text-xs font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-primary text-white shadow-xs">
                Espace Créateur
              </span>
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {currentTab.desc}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Link
              href="/courses"
              className="text-xs font-semibold px-3.5 py-2 rounded-xl border border-gray-200 dark:border-white/10 hover:border-gray-300 dark:border-white/20 text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
            >
              Catalogue public
            </Link>
            <Link
              href="/dashboard"
              className="text-xs font-semibold px-3.5 py-2 rounded-xl bg-gray-100 dark:bg-white/10 hover:bg-gray-200 dark:hover:bg-white/15 text-gray-800 dark:text-gray-200 transition-colors"
            >
              Tableau de bord
            </Link>
          </div>
        </div>

        {/* Barre d'onglets moderne (Segmented Control) */}
        <div className="overflow-x-auto pb-1 scrollbar-none">
          <div className="flex gap-2 bg-gray-100 dark:bg-navy-dark border border-gray-200 dark:border-white/10 rounded-2xl p-1.5 w-fit min-w-full sm:min-w-0">
            {MODE_TABS.map((tab) => {
              const isActive = mode === tab.key;
              return (
                <button
                  key={tab.key}
                  type="button"
                  onClick={() => setMode(tab.key)}
                  className={`flex items-center gap-2.5 px-4 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                    isActive
                      ? "bg-primary text-white shadow-md shadow-primary/20 scale-[1.01]"
                      : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-white/70 dark:hover:bg-white/5"
                  }`}
                >
                  <span className={isActive ? "text-white" : "text-gray-500"}>
                    {tab.icon}
                  </span>
                  <span>{tab.label}</span>
                  {tab.badge && (
                    <span
                      className={`text-[10px] px-2 py-0.2 rounded-full font-semibold ${
                        isActive ? "bg-white/20 text-white" : "bg-primary/10 text-primary dark:text-white"
                      }`}
                    >
                      {tab.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Contenu de l'éditeur selon le mode sélectionné */}
        <div>
          {mode === "course" && <CourseEditor />}
          {mode === "mooc"   && <MOOCEditor />}
          {mode === "video"  && <VideoEditor />}
          {mode === "app"    && <AppEditor />}
          {mode === "ai"     && <AIStudio />}
        </div>

      </div>
    );
  }
