import re

with open('tailwind.config.ts', 'r') as f:
    content = f.read()

content = re.sub(
    r'sans: \["Nunito", "system-ui", "sans-serif"\],\s*roboto: \["Roboto", "sans-serif"\],',
    r'sans: ["Cera Pro", "system-ui", "sans-serif"],\n        roboto: ["Cera Pro", "sans-serif"],',
    content
)

with open('tailwind.config.ts', 'w') as f:
    f.write(content)
