with open('components/platform/Nav.tsx', 'r') as f:
    content = f.read()

# Fix the duplicated dark:bg-navy
content = content.replace('bg-white dark:bg-navy dark:bg-navy', 'bg-white dark:bg-navy')
content = content.replace('dark:border-primary/20 dark:border-white/10', 'dark:border-white/10')

# Make the logo dynamic
old_logo_block = """          <Link href="/" className="shrink-0 mr-4 flex items-center gap-3 select-none">
            <img src="/icons/hi-paris-logo-bleu-bg.png" alt="Hi! PARIS Logo" className="h-[140px] w-auto" />
            <div className="flex items-baseline gap-0">
              <span className="text-xl font-extrabold text-primary tracking-tight">Hi!</span>
              <span className="text-xl font-extrabold text-gray-900 dark:text-white tracking-tight"> PARIS Education</span>
            </div>
          </Link>"""

new_logo_block = """          <Link href="/" className="shrink-0 mr-4 flex items-center gap-3 select-none">
            <img src="/icons/hi-paris-logo-blanc-bg.png" alt="Hi! PARIS Logo" className="h-[140px] w-auto dark:hidden" />
            <img src="/icons/hi-paris-logo-bleu-bg.png" alt="Hi! PARIS Logo" className="h-[140px] w-auto hidden dark:block" />
            <div className="flex items-baseline gap-0">
              <span className="text-xl font-extrabold text-primary dark:text-white tracking-tight">Hi!</span>
              <span className="text-xl font-extrabold text-gray-900 dark:text-white tracking-tight"> PARIS Education</span>
            </div>
          </Link>"""

content = content.replace(old_logo_block, new_logo_block)

with open('components/platform/Nav.tsx', 'w') as f:
    f.write(content)
