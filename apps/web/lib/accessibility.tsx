"use client";

import React, { createContext, useContext, useEffect, useState } from "react";

interface AccessibilityContextType {
  highContrast: boolean;
  setHighContrast: (val: boolean) => void;
  dyslexicFont: boolean;
  setDyslexicFont: (val: boolean) => void;
  readMode: boolean;
  setReadMode: (val: boolean) => void;
  readModeNarrow: boolean;
  setReadModeNarrow: (val: boolean) => void;
  readModeTemp: number;
  setReadModeTemp: (val: number) => void;
  readModeTexture: number;
  setReadModeTexture: (val: number) => void;
  reducedMotion: boolean;
  setReducedMotion: (val: boolean) => void;
  keyboardNav: boolean;
  setKeyboardNav: (val: boolean) => void;
  largeText: boolean;
  setLargeText: (val: boolean) => void;
  highlightLinks: boolean;
  setHighlightLinks: (val: boolean) => void;
  lineSpacing: boolean;
  setLineSpacing: (val: boolean) => void;
  monochrome: boolean;
  setMonochrome: (val: boolean) => void;
  screenReader: boolean;
  setScreenReader: (val: boolean) => void;
  resetAll: () => void;
}

const AccessibilityContext = createContext<AccessibilityContextType | undefined>(undefined);

export function AccessibilityProvider({ children }: { children: React.ReactNode }) {
  const [highContrast, setHighContrast] = useState(false);
  const [dyslexicFont, setDyslexicFont] = useState(false);
  const [readMode, setReadMode] = useState(false);
  const [readModeNarrow, setReadModeNarrow] = useState(true);
  const [readModeTemp, setReadModeTemp] = useState(50);
  const [readModeTexture, setReadModeTexture] = useState(30);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [keyboardNav, setKeyboardNav] = useState(false);
  const [largeText, setLargeText] = useState(false);
  const [highlightLinks, setHighlightLinks] = useState(false);
  const [lineSpacing, setLineSpacing] = useState(false);
  const [monochrome, setMonochrome] = useState(false);
  const [screenReader, setScreenReader] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    const savedPrefs = localStorage.getItem("a11y-prefs");
    if (savedPrefs) {
      try {
        const prefs = JSON.parse(savedPrefs);
        setHighContrast(prefs.highContrast || false);
        setDyslexicFont(prefs.dyslexicFont || false);
        setReadMode(prefs.readMode || false);
        if (prefs.readModeNarrow !== undefined) setReadModeNarrow(prefs.readModeNarrow);
        if (prefs.readModeTemp !== undefined) setReadModeTemp(prefs.readModeTemp);
        if (prefs.readModeTexture !== undefined) setReadModeTexture(prefs.readModeTexture);
        setReducedMotion(prefs.reducedMotion || false);
        setKeyboardNav(prefs.keyboardNav || false);
        setLargeText(prefs.largeText || false);
        setHighlightLinks(prefs.highlightLinks || false);
        setLineSpacing(prefs.lineSpacing || false);
        setMonochrome(prefs.monochrome || false);
        setScreenReader(prefs.screenReader || false);
      } catch (e) {
        console.error("Failed to parse a11y prefs");
      }
    }
  }, []);

  // Save to localStorage and apply classes to HTML whenever they change
  useEffect(() => {
    const prefs = { 
      highContrast, dyslexicFont, readMode, 
      readModeNarrow, readModeTemp, readModeTexture,
      reducedMotion, keyboardNav, largeText, highlightLinks, lineSpacing, monochrome, screenReader
    };
    localStorage.setItem("a11y-prefs", JSON.stringify(prefs));

    const html = document.documentElement;
    html.classList.toggle("a11y-high-contrast", highContrast);
    html.classList.toggle("a11y-dyslexic", dyslexicFont);
    html.classList.toggle("a11y-read-mode", readMode);
    html.classList.toggle("a11y-read-mode-narrow", readMode && readModeNarrow);
    html.classList.toggle("a11y-reduced-motion", reducedMotion);
    html.classList.toggle("a11y-keyboard-nav", keyboardNav);
    html.classList.toggle("a11y-large-text", largeText);
    html.classList.toggle("a11y-highlight-links", highlightLinks);
    html.classList.toggle("a11y-line-spacing", lineSpacing);
    html.classList.toggle("a11y-monochrome", monochrome);
    html.classList.toggle("a11y-screen-reader", screenReader);

    // Set variables for read mode
    html.style.setProperty("--read-mode-temp", (readModeTemp / 100).toString());
    html.style.setProperty("--read-mode-texture", (readModeTexture / 100).toString());

  }, [highContrast, dyslexicFont, readMode, readModeNarrow, readModeTemp, readModeTexture, reducedMotion, keyboardNav, largeText, highlightLinks, lineSpacing, monochrome, screenReader]);

  // Screen Reader logic (Text-to-Speech)
  useEffect(() => {
    if (typeof window === "undefined" || !('speechSynthesis' in window)) return;

    if (!screenReader) {
      window.speechSynthesis.cancel();
      document.querySelectorAll('.a11y-reading-focus').forEach(el => el.classList.remove('a11y-reading-focus'));
      return;
    }

    let timeoutId: NodeJS.Timeout;
    let lastElement: HTMLElement | null = null;

    const handleFocusOrHover = (e: Event) => {
      const target = e.target as HTMLElement;
      if (!target || !target.tagName) return;

      // Uniquement lire les textes et éléments interactifs importants
      const closestValid = target.closest('p, h1, h2, h3, h4, h5, h6, a, button, li, label, figcaption') as HTMLElement;
      if (!closestValid || closestValid === lastElement) return;

      lastElement = closestValid;
      clearTimeout(timeoutId);

      timeoutId = setTimeout(() => {
        // Enlève l'ancien focus
        document.querySelectorAll('.a11y-reading-focus').forEach(el => el.classList.remove('a11y-reading-focus'));
        closestValid.classList.add('a11y-reading-focus');

        // Récupère le texte pertinent
        const textToRead = closestValid.getAttribute('aria-label') || closestValid.innerText || closestValid.textContent;
        
        if (textToRead && textToRead.trim()) {
          window.speechSynthesis.cancel(); // Stoppe la lecture précédente
          const utterance = new SpeechSynthesisUtterance(textToRead.trim());
          utterance.lang = document.documentElement.lang || 'fr-FR';
          utterance.rate = 0.95; // Légèrement plus lent pour la clarté
          window.speechSynthesis.speak(utterance);
        }
      }, 300); // 300ms de debounce pour éviter la cacophonie si on passe la souris vite
    };

    document.addEventListener('mouseover', handleFocusOrHover);
    document.addEventListener('focusin', handleFocusOrHover);

    return () => {
      document.removeEventListener('mouseover', handleFocusOrHover);
      document.removeEventListener('focusin', handleFocusOrHover);
      clearTimeout(timeoutId);
      window.speechSynthesis.cancel();
      document.querySelectorAll('.a11y-reading-focus').forEach(el => el.classList.remove('a11y-reading-focus'));
    };
  }, [screenReader]);

  const resetAll = () => {
    setHighContrast(false);
    setDyslexicFont(false);
    setReadMode(false);
    setReadModeNarrow(true);
    setReadModeTemp(50);
    setReadModeTexture(30);
    setReducedMotion(false);
    setKeyboardNav(false);
    setLargeText(false);
    setHighlightLinks(false);
    setLineSpacing(false);
    setMonochrome(false);
    setScreenReader(false);
  };

  return (
    <AccessibilityContext.Provider
      value={{
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
      }}
    >
      {children}
    </AccessibilityContext.Provider>
  );
}

export function useAccessibility() {
  const context = useContext(AccessibilityContext);
  if (context === undefined) {
    throw new Error("useAccessibility must be used within an AccessibilityProvider");
  }
  return context;
}
