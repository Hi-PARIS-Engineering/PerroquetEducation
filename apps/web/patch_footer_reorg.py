import re

with open('components/platform/Footer.tsx', 'r') as f:
    footer = f.read()

# 1. Change container to full width to push everything to the edges
footer = footer.replace(
    'className="max-w-7xl mx-auto px-6 pt-12 pb-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8"',
    'className="w-full px-6 lg:px-12 pt-12 pb-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-8"'
)

# 2. Update the Branding column to shift the text left as well
old_branding = """        {/* ── Branding (occupe 2 colonnes sur lg) ── */}
        <div className="sm:col-span-2 lg:col-span-2">
          {/* Logo officiel Hi! PARIS */}
          <div className="block mb-6 ml-[-75%]">
            <img src="/icons/hi-paris-logo-bleu-bg.png" alt="Hi! PARIS Logo" className="h-[320px] w-auto max-w-full object-contain" />
          </div>
          <p className="text-sm text-gray-400 leading-relaxed max-w-xs">
            {t.footer.description}
          </p>
          {/* Liens externes hi-paris.fr et contact email */}
          <div className="flex items-center gap-3 mt-5">"""

new_branding = """        {/* ── Branding (occupe 3 colonnes sur lg) ── */}
        <div className="sm:col-span-2 lg:col-span-3 flex flex-col items-start">
          {/* Le logo avait une marge très négative, on l'applique au conteneur complet pour tout décaler */}
          <div className="ml-[-40%] sm:ml-[-20%] lg:ml-[-15%] xl:ml-[-10%] 2xl:ml-[-5%] transition-all">
            {/* Logo officiel Hi! PARIS */}
            <div className="block mb-6">
              <img src="/icons/hi-paris-logo-bleu-bg.png" alt="Hi! PARIS Logo" className="h-[320px] w-auto max-w-full object-contain" />
            </div>
            {/* Texte et liens décalés avec le logo */}
            <div className="pl-8 lg:pl-16">
              <p className="text-sm text-gray-400 leading-relaxed max-w-xs">
                {t.footer.description}
              </p>
              {/* Liens externes hi-paris.fr et contact email */}
              <div className="flex items-center gap-3 mt-5">"""

footer = footer.replace(old_branding, new_branding)

# 3. Add closing divs for the new wrapper
old_closing = """            </a>
          </div>
        </div>

        {/* ── Colonne Plateforme — liens vers les modules de contenu ── */}"""

new_closing = """            </a>
          </div>
            </div>
          </div>
        </div>

        {/* ── Colonne Plateforme — liens vers les modules de contenu ── */}"""

footer = footer.replace(old_closing, new_closing)


# 4. Also update the bottom bar container to full width
footer = footer.replace(
    'className="max-w-7xl mx-auto px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-gray-600"',
    'className="w-full px-6 lg:px-12 py-4 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-gray-600"'
)

with open('components/platform/Footer.tsx', 'w') as f:
    f.write(footer)

