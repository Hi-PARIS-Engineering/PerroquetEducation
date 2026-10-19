with open('app/(platform)/insights/page.tsx', 'r') as f:
    content = f.read()

content = content.replace('    </div>\n  );\n}', '      </div>\n    </div>\n  );\n}')

with open('app/(platform)/insights/page.tsx', 'w') as f:
    f.write(content)
