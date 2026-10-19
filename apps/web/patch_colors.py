with open('tailwind.config.ts', 'r') as f:
    content = f.read()

old_danger = """        // ── Couleur danger / alerte (rouge) ──
        danger: {
          DEFAULT: "#D72638", // Rouge principal
          dark:    "#B5202F", // Hover danger
        },"""

new_danger = """        // ── Couleur danger / alerte (remplacé par le rose Hi! PARIS) ──
        danger: {
          DEFAULT: "#FF034D", // Rose officiel Hi! PARIS
          dark:    "#cc023e", // Hover
        },"""

content = content.replace(old_danger, new_danger)

with open('tailwind.config.ts', 'w') as f:
    f.write(content)
