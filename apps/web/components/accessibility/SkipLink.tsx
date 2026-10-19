"use client";

import React from "react";

export function SkipLink() {
  return (
    <a
      href="#main-content"
      className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 z-[100] px-6 py-3 bg-primary text-white font-bold rounded-md shadow-lg outline-none focus:ring-4 focus:ring-secondary transition-all"
    >
      Aller au contenu principal
    </a>
  );
}
