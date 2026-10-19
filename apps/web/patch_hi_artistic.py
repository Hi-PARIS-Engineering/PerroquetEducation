with open('components/platform/Nav.tsx', 'r') as f:
    content = f.read()

old_logo = """            <div className="flex items-baseline gap-0">
              <span className="text-xl font-extrabold text-primary dark:text-white tracking-tight">Hi!</span>
              <span className="text-xl font-extrabold text-gray-900 dark:text-white tracking-tight"> PARIS Education</span>
            </div>"""

new_logo = """            <div className="flex items-baseline gap-0">
              {/* "Hi!" artistique en rose (text-danger = #FF034D) */}
              <span className="text-xl font-extrabold text-danger tracking-tight flex items-baseline">
                {/* H stylisé avec 2 I et un point médian */}
                <span className="flex items-center">
                  <span>I</span>
                  <span className="text-[1.3em] mx-[-0.12em] leading-none mb-[0.1em]">·</span>
                  <span>I</span>
                </span>
                <span className="ml-[0.05em]">i!</span>
              </span>
              <span className="text-xl font-extrabold text-gray-900 dark:text-white tracking-tight ml-1"> PARIS Education</span>
            </div>"""

content = content.replace(old_logo, new_logo)

with open('components/platform/Nav.tsx', 'w') as f:
    f.write(content)
