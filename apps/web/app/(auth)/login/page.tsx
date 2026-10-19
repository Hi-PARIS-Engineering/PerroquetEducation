/**
 * @file (auth)/login/page.tsx
 * @description Page de connexion "/login" inspirée des standards shadcn & 21st.dev :
 *   - Split screen minimaliste, purifié de tout élément non-essentiel (pas de surcharge ni de saturation).
 *   - Arrière-plan panoramique (Paris Skyline, Campus IP Paris/HEC, Laboratoire IA) en fondu enchaîné doux.
 *   - Logo Hi! PARIS officiel intégré en format géant au centre du panorama.
 *   - Formulaire d'authentification sans mot de passe (Magic Link / Code OTP à 6 chiffres) clair et direct.
 *   - Contrôles d'accessibilité (Dark/Light mode, commutateur FR/EN).
 */

"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, FormEvent, useRef, useEffect } from "react";
import { clsx } from "clsx";
import { authApi, ApiError } from "@/lib/api";
import { useAuth } from "@/lib/auth";
import { useLanguage } from "@/lib/i18n";
import { ThemeSwitcher } from "@/components/theme/ThemeSwitcher";

/** Étapes du flux de connexion. */
type Step = "email" | "code";

/** Vues panoramiques pour le panneau de gauche. */
const PANORAMA_VIEWS = [
  {
    id: "paris",
    alt: "Vue panoramique de Paris",
    src: "/images/panorama/paris-skyline.jpg",
  },
  {
    id: "campus",
    alt: "Campus de l'Institut Polytechnique de Paris à Palaiseau",
    src: "/images/panorama/campus-polytechnique.jpg",
  },
  {
    id: "tech",
    alt: "Laboratoire de recherche en IA et Science des Données",
    src: "/images/panorama/tech-ai.jpg",
  },
];

/**
 * Sélecteur de langue compact et discret.
 */
function LangPill() {
  const { locale, setLocale } = useLanguage();

  return (
    <div className="flex items-center gap-0.5 border border-gray-200 dark:border-white/10 rounded-lg p-0.5 bg-gray-100/70 dark:bg-white/5 text-xs font-semibold">
      <button
        type="button"
        onClick={() => setLocale("fr")}
        className={clsx(
          "px-2 py-1 rounded transition-colors",
          locale === "fr"
            ? "bg-white dark:bg-white/15 text-gray-900 dark:text-white shadow-xs font-bold"
            : "text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
        )}
      >
        FR
      </button>
      <button
        type="button"
        onClick={() => setLocale("en")}
        className={clsx(
          "px-2 py-1 rounded transition-colors",
          locale === "en"
            ? "bg-white dark:bg-white/15 text-gray-900 dark:text-white shadow-xs font-bold"
            : "text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
        )}
      >
        EN
      </button>
    </div>
  );
}

/**
 * Page de connexion épurée avec panorama photographique et logo géant.
 */
export default function LoginPage() {
  const router = useRouter();
  const { setUser } = useAuth();
  const { t, locale } = useLanguage();

  /** Étape courante : saisie d'email ou vérification du code à 6 chiffres. */
  const [step, setStep] = useState<Step>("email");

  /** Email institutionnel saisi. */
  const [email, setEmail] = useState("");

  /** Tableau des 6 chiffres du code OTP. */
  const [code, setCode] = useState(["", "", "", "", "", ""]);

  /** Message d'erreur contextuel. */
  const [error, setError] = useState("");

  /** Indicateur de chargement réseau. */
  const [loading, setLoading] = useState(false);

  /** Notification temporaire de renvoi de code. */
  const [resendNotice, setResendNotice] = useState(false);

  /** Vue panoramique active (index de 0 à 2). */
  const [activePanorama, setActivePanorama] = useState(0);

  /** Références aux 6 champs de saisie pour gérer le focus. */
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Défilement automatique très doux des panoramas toutes les 10 secondes
  useEffect(() => {
    const timer = setInterval(() => {
      setActivePanorama((prev) => (prev + 1) % PANORAMA_VIEWS.length);
    }, 10000);
    return () => clearInterval(timer);
  }, []);

  /**
   * Envoi de l'email pour générer le code OTP.
   */
  async function handleRequestCode(e?: FormEvent) {
    if (e) e.preventDefault();
    if (!email.trim()) return;

    setError("");
    setLoading(true);
    try {
      await authApi.requestCode(email.trim());
      setStep("code");
      setResendNotice(true);
      setTimeout(() => setResendNotice(false), 4000);
      setTimeout(() => inputRefs.current[0]?.focus(), 100);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : t.login.errorDefault);
    } finally {
      setLoading(false);
    }
  }

  /**
   * Vérification du code à 6 chiffres et redirection.
   */
  async function handleVerifyCode(e: FormEvent) {
    e.preventDefault();
    const fullCode = code.join("");
    if (fullCode.length < 6) return;

    setError("");
    setLoading(true);
    try {
      const data = await authApi.verifyCode(email.trim(), fullCode);
      setUser(data.user);
      router.push(data.is_new || !data.user.is_profile_complete ? "/complete-profile" : "/dashboard");
    } catch (err) {
      setError(err instanceof ApiError ? err.message : t.login.errorCode);
      setCode(["", "", "", "", "", ""]);
      setTimeout(() => inputRefs.current[0]?.focus(), 50);
    } finally {
      setLoading(false);
    }
  }

  /**
   * Saisie d'un chiffre dans une case individuelle.
   */
  function handleCodeInput(index: number, value: string) {
    const digit = value.replace(/\D/g, "").slice(-1);
    const next = [...code];
    next[index] = digit;
    setCode(next);

    // Focus automatique vers la case suivante
    if (digit && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }

    // Soumission automatique si tous les 6 chiffres sont renseignés
    if (next.every((d) => d !== "")) {
      const form = document.getElementById("code-form") as HTMLFormElement;
      form?.requestSubmit();
    }
  }

  /**
   * Recul avec la touche Backspace sur case vide.
   */
  function handleCodeKeyDown(index: number, e: React.KeyboardEvent) {
    if (e.key === "Backspace" && !code[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  }

  /**
   * Prise en charge du copier-coller de 6 chiffres d'un coup.
   */
  function handleCodePaste(e: React.ClipboardEvent) {
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    if (pasted.length === 6) {
      const digits = pasted.split("");
      setCode(digits);
      inputRefs.current[5]?.focus();
      const form = document.getElementById("code-form") as HTMLFormElement;
      form?.requestSubmit();
    }
  }

  return (
    <div className="min-h-screen bg-white dark:bg-navy-dark flex flex-col lg:flex-row relative">

      {/* ── PANNEAU GAUCHE : PANORAMA PHOTOGRAPHIQUE & LOGO GÉANT (DESKTOP) ── */}
      <div className="hidden lg:relative lg:flex lg:w-1/2 xl:w-7/12 flex-col justify-between p-10 xl:p-14 overflow-hidden select-none bg-navy-dark text-white">

        {/* Couches d'images panoramiques avec fondu enchaîné ultra-fluide */}
        <div className="absolute inset-0 z-0">
          {PANORAMA_VIEWS.map((pano, idx) => (
            <div
              key={pano.id}
              className={clsx(
                "absolute inset-0 transition-opacity duration-[2500ms] ease-in-out",
                idx === activePanorama ? "opacity-100" : "opacity-0"
              )}
            >
              <Image
                src={pano.src}
                alt={pano.alt}
                fill
                priority={idx === 0}
                className="object-cover object-center"
                sizes="60vw"
              />
            </div>
          ))}

          {/* Dégradé sobre et élégant pour lisibilité du logo sans saturer */}
          <div className="absolute inset-0 bg-gradient-to-t from-navy-dark/95 via-navy/60 to-navy-dark/75 backdrop-blur-[0.5px]" />
        </div>

        {/* Haut du panneau gauche : retour discret */}
        <div className="relative z-10 flex items-center justify-between">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-xs font-medium text-white/80 hover:text-white transition-colors py-1.5 px-3 rounded-lg bg-black/25 hover:bg-black/40 border border-white/10 backdrop-blur-md"
          >
            <span aria-hidden="true">←</span>
            <span>{locale === "en" ? "Back to website" : "Retour à l'accueil"}</span>
          </Link>
        </div>

        {/* Centre du panneau gauche : LE LOGO GÉANT ÉPURÉ */}
        <div className="relative z-10 my-auto flex flex-col items-center justify-center text-center py-8">
          <Link href="/" className="inline-block group" title="Hi! PARIS Education">
            <Image
              src="/icons/hi-paris-logo-bleu-bg.png"
              alt="Hi! PARIS Logo Géant"
              width={720}
              height={410}
              priority
              className="h-[260px] xl:h-[340px] 2xl:h-[390px] w-auto max-w-full object-contain filter drop-shadow-[0_20px_35px_rgba(0,0,0,0.55)] transition-transform duration-500 group-hover:scale-[1.02]"
            />
          </Link>

          {/* Sous-titre sobre et raffiné (sans surcharge) */}
          <p className="mt-4 text-sm xl:text-base text-white/80 font-normal tracking-wide max-w-sm">
            Center for AI & Data Science for Science, Business & Society
          </p>
        </div>

        {/* Pied du panneau gauche : Signature sobre des institutions */}
        <div className="relative z-10 flex items-center justify-between pt-6 border-t border-white/10 text-xs text-white/50">
          <span>Institut Polytechnique de Paris · HEC Paris · Inria</span>
          <span>© {new Date().getFullYear()} Hi! PARIS</span>
        </div>

      </div>

      {/* ── PANNEAU DROIT : AUTHENTIFICATION MINIMALISTE & RAFFINÉE ── */}
      <div className="flex-1 flex flex-col justify-between p-6 sm:p-12 lg:p-16 xl:p-20 relative bg-white dark:bg-navy-dark">

        {/* En-tête supérieur : retour mobile + theme + langue */}
        <div className="w-full flex items-center justify-between mb-8">
          <Link
            href="/"
            className="lg:hidden inline-flex items-center gap-1 text-xs font-semibold text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
          >
            ← {locale === "en" ? "Home" : "Accueil"}
          </Link>
          <div className="hidden lg:block" />

          {/* Contrôles de thème et de langue */}
          <div className="flex items-center gap-2">
            <ThemeSwitcher />
            <LangPill />
          </div>
        </div>

        {/* Contenu principal centré */}
        <div className="w-full max-w-md mx-auto my-auto">

          {/* Logo mobile uniquement */}
          <div className="lg:hidden text-center mb-8">
            <Link href="/" className="inline-block">
              <Image
                src="/icons/hi-paris-logo-bleu-bg.png"
                alt="Hi! PARIS Logo"
                width={200}
                height={114}
                priority
                className="h-20 w-auto mx-auto object-contain"
              />
            </Link>
          </div>

          {/* ── Étape 1 : Saisie de l'email institutionnel ── */}
          {step === "email" ? (
            <div className="space-y-6">
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
                  {t.login.title}
                </h1>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-2 leading-relaxed">
                  {t.login.subtitle}
                </p>
              </div>

              {/* Message d'erreur épuré */}
              {error && (
                <div
                  role="alert"
                  className="bg-danger/10 border border-danger/20 text-danger text-sm rounded-xl p-3.5 flex items-start gap-2.5 animate-fadeIn"
                >
                  <span className="text-base leading-none">⚠️</span>
                  <span>{error}</span>
                </div>
              )}

              <form onSubmit={handleRequestCode} className="space-y-4">
                <div className="space-y-2">
                  <label className="text-xs font-semibold uppercase tracking-wider text-gray-600 dark:text-gray-300 block">
                    {t.login.emailLabel}
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder={t.login.emailPlaceholder}
                    required
                    autoComplete="email"
                    autoFocus
                    className="w-full h-12 px-4 rounded-xl border border-gray-300 dark:border-white/15 bg-white dark:bg-white/5 text-gray-900 dark:text-white text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/25 focus:border-primary transition-all"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading || !email.trim()}
                  className="w-full h-12 rounded-xl bg-primary hover:bg-primary-dark text-white font-semibold text-sm transition-all duration-150 shadow-sm hover:shadow flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer active:scale-[0.99]"
                >
                  {loading ? (
                    <span className="inline-block w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <>
                      <span>{t.login.sendCode}</span>
                      <span aria-hidden="true">→</span>
                    </>
                  )}
                </button>
              </form>
            </div>
          ) : (
            /* ── Étape 2 : Saisie du code OTP (6 chiffres) ── */
            <div className="space-y-6">
              <div>
                <button
                  type="button"
                  onClick={() => {
                    setStep("email");
                    setCode(["", "", "", "", "", ""]);
                    setError("");
                  }}
                  className="inline-flex items-center gap-1 text-xs font-semibold text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white mb-3 cursor-pointer transition-colors"
                >
                  ← {locale === "en" ? "Change email" : "Modifier l'adresse email"}
                </button>

                <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
                  {t.login.codeSentTitle}
                </h1>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1.5">
                  {t.login.codeSentTo} <strong className="text-gray-900 dark:text-white font-semibold">{email}</strong>
                </p>
              </div>

              {/* Notice d'envoi */}
              {resendNotice && (
                <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs rounded-xl p-3 flex items-center gap-2">
                  <span>✓</span> Un code à 6 chiffres a été envoyé par email.
                </div>
              )}

              {/* Message d'erreur */}
              {error && (
                <div
                  role="alert"
                  className="bg-danger/10 border border-danger/20 text-danger text-sm rounded-xl p-3.5 flex items-start gap-2.5 animate-fadeIn"
                >
                  <span className="text-base leading-none">⚠️</span>
                  <span>{error}</span>
                </div>
              )}

              <form id="code-form" onSubmit={handleVerifyCode} className="space-y-6">
                {/* Grille 3 + 3 épurée */}
                <div
                  className="flex items-center justify-center gap-2 sm:gap-2.5"
                  onPaste={handleCodePaste}
                >
                  {/* Première moitié (3 chiffres) */}
                  {code.slice(0, 3).map((digit, i) => (
                    <input
                      key={i}
                      ref={(el) => { inputRefs.current[i] = el; }}
                      type="text"
                      inputMode="numeric"
                      maxLength={1}
                      value={digit}
                      onChange={(e) => handleCodeInput(i, e.target.value)}
                      onKeyDown={(e) => handleCodeKeyDown(i, e)}
                      className={clsx(
                        "w-11 h-14 sm:w-12 sm:h-16 text-center text-2xl font-bold rounded-xl",
                        "bg-white dark:bg-white/5 border text-gray-900 dark:text-white",
                        "focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/25 transition-all shadow-xs",
                        digit ? "border-primary dark:border-primary" : "border-gray-300 dark:border-white/15"
                      )}
                      aria-label={`Chiffre ${i + 1}`}
                    />
                  ))}

                  {/* Séparateur discret */}
                  <span className="w-2 h-0.5 bg-gray-300 dark:bg-white/20 rounded-full mx-1 select-none" aria-hidden="true" />

                  {/* Seconde moitié (3 chiffres) */}
                  {code.slice(3, 6).map((digit, i) => {
                    const actualIndex = i + 3;
                    return (
                      <input
                        key={actualIndex}
                        ref={(el) => { inputRefs.current[actualIndex] = el; }}
                        type="text"
                        inputMode="numeric"
                        maxLength={1}
                        value={digit}
                        onChange={(e) => handleCodeInput(actualIndex, e.target.value)}
                        onKeyDown={(e) => handleCodeKeyDown(actualIndex, e)}
                        className={clsx(
                          "w-11 h-14 sm:w-12 sm:h-16 text-center text-2xl font-bold rounded-xl",
                          "bg-white dark:bg-white/5 border text-gray-900 dark:text-white",
                          "focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/25 transition-all shadow-xs",
                          digit ? "border-primary dark:border-primary" : "border-gray-300 dark:border-white/15"
                        )}
                        aria-label={`Chiffre ${actualIndex + 1}`}
                      />
                    );
                  })}
                </div>

                {/* Bouton de confirmation */}
                <button
                  type="submit"
                  disabled={loading || code.join("").length < 6}
                  className="w-full h-12 rounded-xl bg-primary hover:bg-primary-dark text-white font-semibold text-sm transition-all duration-150 shadow-sm hover:shadow flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer active:scale-[0.99]"
                >
                  {loading ? (
                    <span className="inline-block w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <span>{t.login.verify}</span>
                  )}
                </button>
              </form>

              {/* Renvoi de code */}
              <div className="text-center">
                <button
                  type="button"
                  onClick={() => handleRequestCode()}
                  disabled={loading}
                  className="text-xs font-semibold text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-colors cursor-pointer"
                >
                  {t.login.resend}
                </button>
              </div>
            </div>
          )}

        </div>

        {/* Pied de page épuré : Mentions légales sans surcharge */}
        <div className="mt-8 text-center text-xs text-gray-400 dark:text-gray-500 space-x-3">
          <Link href="/cgu" className="hover:text-gray-700 dark:hover:text-gray-300 transition-colors">
            CGU
          </Link>
          <span>·</span>
          <Link href="/privacy" className="hover:text-gray-700 dark:hover:text-gray-300 transition-colors">
            Confidentialité
          </Link>
          <span>·</span>
          <a href="mailto:contact@hi-paris.fr" className="hover:text-gray-700 dark:hover:text-gray-300 transition-colors">
            Support
          </a>
        </div>

      </div>

    </div>
  );
}
