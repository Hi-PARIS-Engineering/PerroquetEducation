import re

# 1. Update Footer logo to move left by 75%
with open('components/platform/Footer.tsx', 'r') as f:
    footer = f.read()

footer = footer.replace(
    'className="block mb-6 -ml-4"',
    'className="block mb-6 ml-[-75%]"'
)

with open('components/platform/Footer.tsx', 'w') as f:
    f.write(footer)


# 2. Update Nav container to use full width
with open('components/platform/Nav.tsx', 'r') as f:
    nav = f.read()

nav = nav.replace(
    'className="max-w-7xl mx-auto px-6 h-[150px] flex items-center gap-2"',
    'className="w-full px-6 lg:px-12 h-[150px] flex items-center gap-2"'
)

with open('components/platform/Nav.tsx', 'w') as f:
    f.write(nav)

