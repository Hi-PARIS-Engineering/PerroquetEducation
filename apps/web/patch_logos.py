import re

# 1. Update Nav.tsx
with open('components/platform/Nav.tsx', 'r') as f:
    nav_content = f.read()

old_nav_logo = """          {/* ── Logo ── */}
          <Link href="/" className="shrink-0 mr-4 flex items-center gap-0 select-none">
            <span className="text-xl font-extrabold text-primary tracking-tight">Hi!</span>
            <span className="text-xl font-extrabold text-gray-900 tracking-tight"> PARIS Education</span>
          </Link>"""
new_nav_logo = """          {/* ── Logo ── */}
          <Link href="/" className="shrink-0 mr-4 flex items-center gap-3 select-none">
            <img src="/icons/hi-paris-logo-blanc-bg.png" alt="Hi! PARIS Logo" className="h-14 w-auto" />
            <div className="flex items-baseline gap-0">
              <span className="text-xl font-extrabold text-primary tracking-tight">Hi!</span>
              <span className="text-xl font-extrabold text-gray-900 tracking-tight"> PARIS Education</span>
            </div>
          </Link>"""

nav_content = nav_content.replace(old_nav_logo, new_nav_logo)

with open('components/platform/Nav.tsx', 'w') as f:
    f.write(nav_content)

# 2. Update Footer.tsx
with open('components/platform/Footer.tsx', 'r') as f:
    footer_content = f.read()

old_footer_logo = """        <div className="sm:col-span-2 lg:col-span-2">
          {/* Logo texte "Hi! Platform" */}
          <div className="flex items-baseline gap-0 mb-3">
            <span className="text-2xl font-extrabold text-primary-light tracking-tight">Hi!</span>
            <span className="text-2xl font-extrabold text-white tracking-tight"> PARIS Education</span>
          </div>"""
new_footer_logo = """        <div className="sm:col-span-2 lg:col-span-2">
          {/* Logo texte "Hi! Platform" */}
          <div className="flex items-center gap-3 mb-3">
            <img src="/icons/hi-paris-logo-bleu-bg.png" alt="Hi! PARIS Logo" className="h-16 w-auto" />
            <div className="flex items-baseline gap-0">
              <span className="text-2xl font-extrabold text-primary-light tracking-tight">Hi!</span>
              <span className="text-2xl font-extrabold text-white tracking-tight"> PARIS Education</span>
            </div>
          </div>"""

footer_content = footer_content.replace(old_footer_logo, new_footer_logo)

with open('components/platform/Footer.tsx', 'w') as f:
    f.write(footer_content)

