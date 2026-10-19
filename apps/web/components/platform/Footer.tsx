/**
 * @file Footer.tsx
 * @description Pied de page principal de la plateforme Hi! Platform.
 *
 * Architecture & Disposition :
 *   - Pleine largeur (`w-full px-6 lg:px-12 xl:px-16 2xl:px-20`) pour s'étendre sur tout l'écran
 *     sans tasser le contenu au centre.
 *   - Fond sombre contrasté `bg-navy` (#0B1D3A, charte officielle Hi! PARIS).
 *   - Logo officiel avec son positionnement d'origine (hauteur 240/280px et compensation de marge négative).
 *   - Répartition équilibrée sur toute la largeur :
 *       * Gauche : Branding officiel, mission Hi! PARIS, lien direct éditable et contact email.
 *       * Droite (répartie en 4 colonnes aérées) :
 *           1. Formations & Programmes (Hi! Databootcamp, Cours, Vidéos, MOOCs, Apps).
 *           2. Recherche & Événements (Inside & Insights, Conférence AIStuCon, Soumissions, NeuriPP).
 *           3. Écosystème & Outils (À propos, Hi! Studio Enseignant, PDF → Cours, LMS Cohortes).
 *           4. Compte & Cadre Légal (Mon parcours, Profil, Politique RGPD, CGU).
 *   - Barre inférieure étendue : Copyright dynamique, partenaires (IP Paris, HEC Paris, Inria)
 *     et mentions d'accessibilité / conformité RGPD (WCAG 2.2 AA).
 */

"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { clsx } from "clsx";
import { useLanguage } from "@/lib/i18n";
import EditableLink from "@/components/platform/EditableLink";

/* ------------------------------------------------------------ tokens -- */

const FOCUS_RING =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-secondary focus-visible:ring-offset-2 focus-visible:ring-offset-navy rounded-sm";

const SECTION_TITLE =
  "text-[11px] font-bold uppercase tracking-[0.14em] text-white/90 mb-4 select-none flex items-center gap-2";

const LINK_BASE =
  "group inline-flex items-center gap-2 text-[13.5px] text-gray-300 hover:text-white transition-colors duration-150 py-1 leading-normal";

const LINK_ACTIVE =
  "text-secondary font-semibold";

const BADGE_BOOTCAMP =
  "text-[10px] font-bold tracking-wider uppercase px-1.5 py-0.5 rounded bg-secondary/15 text-secondary border border-secondary/30";

const BADGE_EVENT =
  "text-[10px] font-semibold tracking-wider uppercase px-1.5 py-0.5 rounded bg-white/10 text-white/90 border border-white/20";

const BADGE_CALL =
  "text-[10px] font-semibold tracking-wider uppercase px-1.5 py-0.5 rounded bg-primary-light/20 text-blue-200 border border-primary-light/30";

const BADGE_FACULTY =
  "text-[10px] font-semibold tracking-wider uppercase px-1.5 py-0.5 rounded bg-purple-500/20 text-purple-200 border border-purple-400/30";

/* ------------------------------------------------------------- types -- */

interface FooterLink {
  label: string;
  href: string;
  badge?: {
    text: string;
    className: string;
  };
}

interface FooterColumn {
  id: string;
  title: string;
  links: FooterLink[];
}

/* -------------------------------------------------------- components -- */

/**
 * Lien individuel de colonne avec détection active, badge optionnel et accessibilité.
 */
function FooterLinkItem({ item, currentPath }: { item: FooterLink; currentPath: string }) {
  const isActive = currentPath === item.href || (item.href !== "/" && currentPath.startsWith(item.href));

  return (
    <li>
      <Link
        href={item.href}
        className={clsx(LINK_BASE, FOCUS_RING, isActive && LINK_ACTIVE)}
        aria-current={isActive ? "page" : undefined}
      >
        <span className="transition-transform duration-150 group-hover:translate-x-0.5">
          {item.label}
        </span>
        {item.badge && (
          <span className={item.badge.className}>
            {item.badge.text}
          </span>
        )}
      </Link>
    </li>
  );
}

/**
 * Pied de page global de Hi! Platform.
 */
export function Footer() {
  const pathname = usePathname();
  const { t } = useLanguage();

  /* ---------------------------------------------------- link structure -- */

  const columns: FooterColumn[] = [
    {
      id: "programs",
      title: t.footer.sections.programs,
      links: [
        {
          label: t.footer.links.databootcamp,
          href: "/databootcamp",
          badge: { text: t.footer.badges.bootcamp, className: BADGE_BOOTCAMP },
        },
        { label: t.footer.links.courses, href: "/courses" },
        { label: t.footer.links.videos, href: "/tube" },
        { label: t.footer.links.moocs, href: "/moocs" },
        { label: t.footer.links.apps, href: "/apps" },
      ],
    },
    {
      id: "research",
      title: t.footer.sections.research,
      links: [
        { label: t.footer.links.insights, href: "/insights" },
        {
          label: t.footer.links.conference,
          href: "/conference",
          badge: { text: t.footer.badges.event, className: BADGE_EVENT },
        },
        { label: t.footer.links.submission, href: "/conference/submission" },
        {
          label: t.footer.links.neuripp,
          href: "/neuripp",
          badge: { text: t.footer.badges.call, className: BADGE_CALL },
        },
      ],
    },
    {
      id: "ecosystem",
      title: t.footer.sections.ecosystem,
      links: [
        { label: t.footer.links.about, href: "/about" },
        {
          label: t.footer.links.studio,
          href: "/studio",
          badge: { text: t.footer.badges.faculty, className: BADGE_FACULTY },
        },
        { label: t.footer.links.pdfCourse, href: "/studio/pdf-course" },
        { label: t.footer.links.lms, href: "/lms" },
      ],
    },
    {
      id: "legal",
      title: t.footer.sections.legal,
      links: [
        { label: t.footer.links.myLearning, href: "/my-learning" },
        { label: t.footer.links.account, href: "/profile" },
        { label: t.footer.links.privacy, href: "/privacy" },
        { label: t.footer.links.cgu, href: "/cgu" },
      ],
    },
  ];

  return (
    <footer
      role="contentinfo"
      aria-label="Pied de page Hi! PARIS"
      className="bg-navy text-white mt-auto border-t border-white/10 w-full"
    >
      {/* ── Grille principale pleine largeur (étalée sur l'écran, pas centrée/serrée) ── */}
      <div className="w-full px-6 lg:px-12 xl:px-16 2xl:px-20 pt-10 pb-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 xl:gap-14">

          {/* ── Branding avec disposition d'origine du grand logo (occupe 4 colonnes sur lg) ── */}
          <div className="lg:col-span-4 flex flex-col items-start">
            {/* Logo officiel d'origine avec compensation de ses marges transparentes */}
            <div className="ml-[-20%] xl:ml-[-10%] transition-all block mb-6">
              <img
                src="/icons/hi-paris-logo-bleu-bg.png"
                alt="Hi! PARIS Logo"
                className="h-[240px] lg:h-[280px] w-auto max-w-full object-contain"
              />
            </div>

            {/* Texte et Liens alignés avec la grille du site (pl-8 lg:pl-16 d'origine) */}
            <div className="flex flex-col items-start gap-4 pl-8 lg:pl-16">
              <p className="text-sm text-gray-300 leading-relaxed max-w-sm">
                {t.footer.description}
              </p>
              <p className="text-xs text-gray-400 leading-relaxed max-w-sm -mt-2">
                {t.footer.tagline}
              </p>

              {/* Liens d'action rapide : site institutionnel éditable et contact email */}
              <div className="flex flex-wrap items-center gap-3 mt-1">
                <EditableLink
                  labelKey="footer.hiparis.label"
                  urlKey="footer.hiparis.url"
                  fallbackLabel="hi-paris.fr ↗"
                  fallbackUrl="https://hi-paris.fr"
                  className="text-sm font-medium text-gray-300 hover:text-white transition-colors flex items-center gap-2"
                />
                <span className="text-white/20 select-none" aria-hidden="true">·</span>
                <a
                  href="mailto:contact@hi-paris.fr"
                  className="text-sm font-medium text-gray-300 hover:text-white transition-colors flex items-center gap-2"
                >
                  <svg
                    className="w-4 h-4 text-secondary shrink-0"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                    />
                  </svg>
                  {t.footer.contact}
                </a>
              </div>
            </div>
          </div>

          {/* ── Les 4 colonnes de navigation réparties aérées sur les 8 colonnes restantes ── */}
          <div className="lg:col-span-8 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 xl:gap-10 pt-2 lg:pt-10">
            {columns.map((col) => (
              <nav
                key={col.id}
                aria-label={col.title}
                className="flex flex-col"
              >
                <h3 className={SECTION_TITLE}>
                  <span className="w-1.5 h-1.5 rounded-full bg-secondary shrink-0" aria-hidden="true" />
                  {col.title}
                </h3>
                <ul className="space-y-2">
                  {col.links.map((link) => (
                    <FooterLinkItem
                      key={link.href}
                      item={link}
                      currentPath={pathname}
                    />
                  ))}
                </ul>
              </nav>
            ))}
          </div>

        </div>
      </div>

      {/* ── Barre de bas de page (Copyright, Partenaires & Accessibilité) ── */}
      <div className="border-t border-white/10 bg-navy-dark/40">
        <div className="w-full px-6 lg:px-12 xl:px-16 2xl:px-20 py-5 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-gray-400">

          {/* Copyright dynamique */}
          <p className="text-center sm:text-left text-gray-300">
            © {new Date().getFullYear()} <strong className="font-semibold text-white">Hi! PARIS</strong> — HEC Paris & Institut Polytechnique de Paris. {t.footer.copyright}
          </p>

          {/* Institutions fondatrices & conformité */}
          <div className="flex flex-wrap items-center justify-center sm:justify-end gap-x-4 gap-y-2">
            <span className="text-gray-300 font-medium">IP Paris</span>
            <span className="text-white/20 select-none" aria-hidden="true">·</span>
            <span className="text-gray-300 font-medium">HEC Paris</span>
            <span className="text-white/20 select-none" aria-hidden="true">·</span>
            <span className="text-gray-300 font-medium">Inria</span>
            <span className="text-white/20 select-none hidden md:inline" aria-hidden="true">·</span>
            <span className="text-[11px] text-gray-400 bg-white/5 border border-white/10 px-2 py-0.5 rounded-full">
              {t.footer.compliance}
            </span>
          </div>

        </div>
      </div>
    </footer>
  );
}
