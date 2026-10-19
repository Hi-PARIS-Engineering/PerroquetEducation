with open('app/(platform)/conference/submission/page.tsx', 'r') as f:
    content = f.read()

# Fix IC constant
content = content.replace(
    'const IC = "bg-gray-100 dark:bg-white/10 text-primary px-1.5 py-0.5 rounded text-[0.85em] font-mono";',
    'const IC = "bg-gray-100 dark:bg-white/10 text-primary dark:text-[#6C9EF5] px-1.5 py-0.5 rounded text-[0.85em] font-mono";'
)

# Fix EXAMPLE_FILES list
content = content.replace(
    'text-primary">\n              {EXAMPLE_FILES.map',
    'text-primary dark:text-[#6C9EF5]">\n              {EXAMPLE_FILES.map'
)

# Fix FILE_ROWS code
content = content.replace(
    'text-primary break-all">{where}',
    'text-primary dark:text-[#6C9EF5] break-all">{where}'
)

# Fix FRONTMATTER_ROWS code
content = content.replace(
    'text-primary">{field}',
    'text-primary dark:text-[#6C9EF5]">{field}'
)

# Fix Do/Don't boxes
content = content.replace(
    'className="bg-emerald-50 border border-emerald-200 rounded-xl p-5"',
    'className="bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 rounded-xl p-5"'
)
content = content.replace(
    'className="font-bold text-emerald-800 mb-3"',
    'className="font-bold text-emerald-800 dark:text-emerald-300 mb-3"'
)
content = content.replace(
    'className="flex flex-col gap-2 text-sm text-emerald-900"',
    'className="flex flex-col gap-2 text-sm text-emerald-900 dark:text-emerald-100"'
)

with open('app/(platform)/conference/submission/page.tsx', 'w') as f:
    f.write(content)
