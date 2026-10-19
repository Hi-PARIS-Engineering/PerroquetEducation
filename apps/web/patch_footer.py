import re

with open('components/platform/Footer.tsx', 'r') as f:
    content = f.read()

old_branding = """        {/* ── Branding (occupe 3 colonnes sur lg) ── */}
        <div className="sm:col-span-2 lg:col-span-3 flex flex-col items-start">
          {/* Le logo avait une marge très négative, on l'applique au conteneur complet pour tout décaler */}
          <div className="ml-[-40%] sm:ml-[-20%] lg:ml-[-15%] xl:ml-[-10%] 2xl:ml-[-5%] transition-all">
            {/* Logo officiel Hi! PARIS */}
            <div className="block mb-6">
              <img src="/icons/hi-paris-logo-bleu-bg.png" alt="Hi! PARIS Logo" className="h-[320px] w-auto max-w-full object-contain" />
            </div>
            {/* Texte et liens décalés avec le logo */}
            <div className="pl-8 lg:pl-16">
              <p className="text-sm text-gray-400 dark:text-gray-500 leading-relaxed max-w-xs">
                {t.footer.description}
              </p>
              {/* Liens externes hi-paris.fr et contact email */}
              <div className="flex items-center gap-3 mt-5">
            <EditableLink
              labelKey="footer.hiparis.label"
              urlKey="footer.hiparis.url"
              fallbackLabel="hi-paris.fr ↗"
              fallbackUrl="https://hi-paris.fr"
              className="text-xs font-medium text-gray-400 dark:text-gray-500 hover:text-white transition-colors border border-white/10 px-3 py-1.5 rounded-sm hover:border-white/30"
            />
            <a
              href="mailto:contact@hi-paris.fr"
              className="text-xs font-medium text-gray-400 dark:text-gray-500 hover:text-white transition-colors border border-white/10 px-3 py-1.5 rounded-sm hover:border-white/30"
            >
              {t.footer.contact}
            </a>
          </div>
            </div>
          </div>
        </div>"""

new_branding = """        {/* ── Logo ── */}
        <div className="sm:col-span-2 lg:col-span-2 flex justify-start items-start ml-[-20%] xl:ml-[-10%]">
          <img src="/icons/hi-paris-logo-bleu-bg.png" alt="Hi! PARIS Logo" className="h-[240px] lg:h-[280px] w-auto max-w-full object-contain" />
        </div>

        {/* ── Texte et Liens (Décalés dans leur propre colonne pour s'aligner avec le reste) ── */}
        <div className="sm:col-span-2 lg:col-span-2 flex flex-col items-start justify-start pt-4 lg:pt-8">
          <p className="text-sm text-gray-400 dark:text-gray-500 leading-relaxed max-w-xs mb-6">
            {t.footer.description}
          </p>
          <div className="flex flex-col items-start gap-3">
            <EditableLink
              labelKey="footer.hiparis.label"
              urlKey="footer.hiparis.url"
              fallbackLabel="hi-paris.fr ↗"
              fallbackUrl="https://hi-paris.fr"
              className="text-sm font-medium text-gray-400 dark:text-gray-500 hover:text-white transition-colors flex items-center gap-2"
            />
            <a
              href="mailto:contact@hi-paris.fr"
              className="text-sm font-medium text-gray-400 dark:text-gray-500 hover:text-white transition-colors flex items-center gap-2"
            >
              {t.footer.contact}
            </a>
          </div>
        </div>"""

content = content.replace(old_branding, new_branding)

with open('components/platform/Footer.tsx', 'w') as f:
    f.write(content)
