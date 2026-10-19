import re

with open('components/platform/Footer.tsx', 'r') as f:
    content = f.read()

old_block = """          {/* Texte et Liens alignés avec le reste du site (hors de la marge négative du logo) */}
          <div className="flex flex-col items-start gap-4 pl-2">"""

new_block = """          {/* Texte et Liens alignés avec le reste du site (hors de la marge négative du logo) */}
          <div className="flex flex-col items-start gap-4 pl-8 lg:pl-16">"""

content = content.replace(old_block, new_block)

with open('components/platform/Footer.tsx', 'w') as f:
    f.write(content)
