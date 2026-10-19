import re

with open('components/platform/Footer.tsx', 'r') as f:
    content = f.read()

old_block = """        {/* ── Logo ── */}
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

new_block = """        {/* ── Branding (occupe 3 colonnes sur lg) ── */}
        <div className="sm:col-span-2 lg:col-span-3 flex flex-col items-start">
          <div className="ml-[-20%] xl:ml-[-10%] transition-all">
            {/* Logo */}
            <div className="block mb-6">
              <img src="/icons/hi-paris-logo-bleu-bg.png" alt="Hi! PARIS Logo" className="h-[240px] lg:h-[280px] w-auto max-w-full object-contain" />
            </div>
            
            {/* Texte et Liens (en dessous du logo, mais alignés en colonne) */}
            <div className="pl-8 lg:pl-16 flex flex-col items-start gap-4">
              <p className="text-sm text-gray-400 dark:text-gray-500 leading-relaxed max-w-xs">
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
            </div>
          </div>
        </div>"""

content = content.replace(old_block, new_block)

with open('components/platform/Footer.tsx', 'w') as f:
    f.write(content)
