with open('components/platform/Nav.tsx', 'r') as f:
    nav = f.read()

nav = nav.replace('h-14 w-auto', 'h-[140px] w-auto')
# Also adjust the header height so it doesn't overlap/clip
nav = nav.replace('px-6 h-24 flex', 'px-6 h-[150px] flex')

with open('components/platform/Nav.tsx', 'w') as f:
    f.write(nav)

with open('components/platform/Footer.tsx', 'r') as f:
    footer = f.read()

footer = footer.replace('h-16 w-auto', 'h-[160px] w-auto')

with open('components/platform/Footer.tsx', 'w') as f:
    f.write(footer)
