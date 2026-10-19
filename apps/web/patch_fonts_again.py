import re

# 1. Update globals.css to restore Nunito import and apply it to headings
with open('app/globals.css', 'r') as f:
    css_content = f.read()

nunito_import = '@import url("https://fonts.googleapis.com/css2?family=Nunito:ital,wght@0,300..800;1,300..800&display=swap");\n\n'

# If it doesn't already have an import, prepend it
if '@import url("https://fonts.googleapis.com' not in css_content:
    css_content = nunito_import + css_content

# Apply font-heading to headings
heading_apply = """
  h1, h2, h3, h4, h5, h6 {
    @apply font-heading;
  }
"""

# Insert heading apply after body { ... }
css_content = re.sub(
    r'(body\s*\{\s*@apply[^}]+\s*\})',
    r'\1\n' + heading_apply,
    css_content
)

with open('app/globals.css', 'w') as f:
    f.write(css_content)

# 2. Update tailwind.config.ts to define font-heading
with open('tailwind.config.ts', 'r') as f:
    tw_content = f.read()

# Add heading font inside fontFamily
if 'heading: ["Nunito"' not in tw_content:
    tw_content = re.sub(
        r'sans: \["Cera Pro", "system-ui", "sans-serif"\],',
        r'sans: ["Cera Pro", "system-ui", "sans-serif"],\n        heading: ["Nunito", "sans-serif"],',
        tw_content
    )

with open('tailwind.config.ts', 'w') as f:
    f.write(tw_content)

