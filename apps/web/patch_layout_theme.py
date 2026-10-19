import re

with open('app/layout.tsx', 'r') as f:
    content = f.read()

import_statement = 'import { ThemeProvider } from "@/components/theme/ThemeProvider";\nimport { AuthProvider } from "@/lib/auth";'
content = content.replace('import { AuthProvider } from "@/lib/auth";', import_statement)

# Update body wrapping
old_body = """      <body>
        <LanguageProvider>
          <AuthProvider>
            {children}
            {/* CookieBanner est rendu ici pour être présent sur toutes les pages,
                position fixed en bas — il gère lui-même son affichage conditionnel
                selon le consentement déjà stocké en cookie. */}
            <CookieBanner />
          </AuthProvider>
        </LanguageProvider>
      </body>"""

new_body = """      <body>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <LanguageProvider>
            <AuthProvider>
              {children}
              {/* CookieBanner est rendu ici pour être présent sur toutes les pages,
                  position fixed en bas — il gère lui-même son affichage conditionnel
                  selon le consentement déjà stocké en cookie. */}
              <CookieBanner />
            </AuthProvider>
          </LanguageProvider>
        </ThemeProvider>
      </body>"""

content = content.replace(old_body, new_body)

with open('app/layout.tsx', 'w') as f:
    f.write(content)
