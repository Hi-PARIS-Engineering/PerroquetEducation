with open('components/platform/Footer.tsx', 'r') as f:
    footer = f.read()

old_logo_section = """          {/* Logo texte "Hi! Platform" */}
          <div className="flex items-center gap-3 mb-3">
            <img src="/icons/hi-paris-logo-bleu-bg.png" alt="Hi! PARIS Logo" className="h-[160px] w-auto" />
            <div className="flex items-baseline gap-0">
              <span className="text-2xl font-extrabold text-primary-light tracking-tight">Hi!</span>
              <span className="text-2xl font-extrabold text-white tracking-tight"> PARIS Education</span>
            </div>
          </div>"""

new_logo_section = """          {/* Logo officiel Hi! PARIS */}
          <div className="block mb-6 -ml-4">
            <img src="/icons/hi-paris-logo-bleu-bg.png" alt="Hi! PARIS Logo" className="h-[320px] w-auto max-w-full object-contain" />
          </div>"""

footer = footer.replace(old_logo_section, new_logo_section)

with open('components/platform/Footer.tsx', 'w') as f:
    f.write(footer)
