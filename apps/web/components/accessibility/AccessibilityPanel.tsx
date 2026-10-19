"use client";

import React, { useState, useRef, useEffect } from "react";
import { usePathname } from "next/navigation";
import { useAccessibility } from "@/lib/accessibility";

export function AccessibilityPanel() {
  const [isOpen, setIsOpen] = useState(false);
  const [isOverFooter, setIsOverFooter] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  
  const {
    highContrast, setHighContrast,
    dyslexicFont, setDyslexicFont,
    readMode, setReadMode,
    readModeNarrow, setReadModeNarrow,
    readModeTemp, setReadModeTemp,
    readModeTexture, setReadModeTexture,
    reducedMotion, setReducedMotion,
    keyboardNav, setKeyboardNav,
    largeText, setLargeText,
    highlightLinks, setHighlightLinks,
    lineSpacing, setLineSpacing,
    monochrome, setMonochrome,
    screenReader, setScreenReader,
    resetAll
  } = useAccessibility();

  const pathname = usePathname();

  // Fermer quand on clique à l'extérieur
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (panelRef.current && !panelRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  // Détection de chevauchement avec le footer (scroll, resize, mutation, navigation)
  useEffect(() => {
    const handlePositionCheck = () => {
      const footer = document.querySelector('footer');
      const button = triggerRef.current;
      if (!footer || !button) {
        setIsOverFooter(false);
        return;
      }

      const footerRect = footer.getBoundingClientRect();
      const buttonRect = button.getBoundingClientRect();

      // Buffer de 10px pour anticiper le changement juste avant de toucher
      if (footerRect.top <= buttonRect.bottom + 10) {
        setIsOverFooter(true);
      } else {
        setIsOverFooter(false);
      }
    };

    // Écouteurs classiques
    window.addEventListener('scroll', handlePositionCheck, { passive: true });
    window.addEventListener('resize', handlePositionCheck, { passive: true });

    // Observateur de redimensionnement du body pour capter le chargement d'images/contenu
    const resizeObserver = new ResizeObserver(() => {
      handlePositionCheck();
    });
    resizeObserver.observe(document.body);

    // Vérification initiale (très utile lors d'un changement de page via Next.js)
    handlePositionCheck();
    // Double vérification un peu après au cas où le DOM s'ajuste
    const timeoutId = setTimeout(handlePositionCheck, 100);

    return () => {
      window.removeEventListener('scroll', handlePositionCheck);
      window.removeEventListener('resize', handlePositionCheck);
      resizeObserver.disconnect();
      clearTimeout(timeoutId);
    };
  }, [pathname]); // Re-déclenché à chaque changement d'URL

  return (
    <div className="fixed bottom-6 right-6 z-[100]" ref={panelRef}>
      {/* Panneau Modal Flottant (Carré aux bords arrondis) */}
      <div
        className={`absolute bottom-16 right-0 w-[350px] sm:w-[400px] bg-white dark:bg-navy border border-gray-200 dark:border-gray-700 shadow-2xl rounded-2xl transform transition-all duration-300 origin-bottom-right ${isOpen ? "scale-100 opacity-100 visible" : "scale-95 opacity-0 invisible"}`}
        role="dialog"
        aria-label="Paramètres d'accessibilité"
      >
        <div className="p-5 max-h-[70vh] overflow-y-auto">
          <div className="flex justify-between items-center mb-5 pb-3 border-b border-gray-100 dark:border-gray-800">
            <h2 className="text-xl font-heading font-bold text-primary dark:text-white flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" />
                <path d="M12 16v-4" />
                <path d="M12 8h.01" />
              </svg>
              Accessibilité
            </h2>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1.5 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors focus-visible:ring-2 focus-visible:ring-primary"
              aria-label="Fermer le panneau"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </div>

          <div className="grid grid-cols-1 gap-1">
            <ToggleRow label="Contraste élevé" desc="Noir profond et blanc pur" checked={highContrast} onChange={setHighContrast} />
            <ToggleRow label="Nuances de gris" desc="Supprime toutes les couleurs" checked={monochrome} onChange={setMonochrome} />
            <ToggleRow label="Police pour Dyslexie" desc="Typographie adaptée et lisible" checked={dyslexicFont} onChange={setDyslexicFont} />
            <ToggleRow label="Agrandir le texte" desc="Augmente la taille des caractères" checked={largeText} onChange={setLargeText} />
            <ToggleRow label="Interligne augmenté" desc="Plus d'espace entre les lignes" checked={lineSpacing} onChange={setLineSpacing} />
            <ToggleRow label="Mettre en évidence les liens" desc="Souligne tous les liens" checked={highlightLinks} onChange={setHighlightLinks} />
            <ToggleRow label="Mode Lecture" desc="Supprime les distractions" checked={readMode} onChange={setReadMode} />
            
            {readMode && (
              <div className="ml-4 pl-3 border-l-2 border-primary/20 flex flex-col gap-3 py-2 mb-1 mt-1">
                <ToggleRow 
                  label="Réduire la largeur" 
                  desc="Limite et centre le contenu" 
                  checked={readModeNarrow} 
                  onChange={setReadModeNarrow} 
                />
                
                <div className="flex flex-col gap-1 pr-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-semibold text-text-muted dark:text-gray-100">Fatigue visuelle (Température)</span>
                    <span className="text-xs text-gray-500 dark:text-gray-400">{readModeTemp}%</span>
                  </div>
                  <input 
                    type="range" min="0" max="100" 
                    value={readModeTemp} 
                    onChange={(e) => setReadModeTemp(Number(e.target.value))}
                    className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-primary"
                    aria-label="Température de couleur"
                  />
                </div>

                <div className="flex flex-col gap-1 pr-3 pb-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-semibold text-text-muted dark:text-gray-100">Effet Papier (Texture)</span>
                    <span className="text-xs text-gray-500 dark:text-gray-400">{readModeTexture}%</span>
                  </div>
                  <input 
                    type="range" min="0" max="100" 
                    value={readModeTexture} 
                    onChange={(e) => setReadModeTexture(Number(e.target.value))}
                    className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-primary"
                    aria-label="Texture papier"
                  />
                </div>
              </div>
            )}

            <ToggleRow label="Réduction des animations" desc="Désactive les mouvements" checked={reducedMotion} onChange={setReducedMotion} />
            <ToggleRow label="Navigation clavier" desc="Améliore l'indicateur de focus" checked={keyboardNav} onChange={setKeyboardNav} />
            <ToggleRow label="Lecture à voix haute" desc="Survolez un texte pour l'entendre" checked={screenReader} onChange={setScreenReader} />
          </div>

          <div className="mt-6 pt-4 border-t border-gray-100 dark:border-gray-800">
            <button
              onClick={resetAll}
              className="w-full py-2.5 px-4 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 font-semibold rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 focus-visible:ring-2 focus-visible:ring-primary transition-colors flex items-center justify-center gap-2"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
                <path d="M3 3v5h5" />
              </svg>
              Réinitialiser
            </button>
          </div>
        </div>
      </div>

      {/* Bouton d'ouverture (fixé en bas à droite) */}
      <button
        ref={triggerRef}
        onClick={() => setIsOpen(!isOpen)}
        className={`p-3 text-white rounded-full shadow-lg focus-visible:ring-4 focus-visible:ring-secondary transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] hover:scale-110 ${isOverFooter ? "bg-secondary hover:bg-secondary/90" : "bg-primary hover:bg-primary-dark"}`}
        aria-label="Ouvrir le panneau d'accessibilité"
        aria-expanded={isOpen}
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10" />
          <path d="M12 16v-4" />
          <path d="M12 8h.01" />
        </svg>
      </button>
    </div>
  );
}

function ToggleRow({ label, desc, checked, onChange }: { label: string; desc: string; checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <label className="flex items-center justify-between cursor-pointer p-3 hover:bg-surface dark:hover:bg-navy-dark rounded-xl transition-colors group">
      <div className="flex flex-col pr-4">
        <span className="text-sm font-semibold text-text-muted dark:text-gray-100">{label}</span>
        <span className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{desc}</span>
      </div>
      <div className="relative shrink-0">
        <input
          type="checkbox"
          className="sr-only focus-visible:ring"
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
        />
        <div className={`toggle-track block w-11 h-6 rounded-full transition-colors border border-transparent ${checked ? 'bg-primary' : 'bg-gray-300 dark:bg-gray-600'}`}></div>
        <div className={`toggle-thumb absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform ${checked ? 'transform translate-x-5' : ''} shadow-sm`}></div>
      </div>
    </label>
  );
}
