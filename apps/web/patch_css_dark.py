with open('app/globals.css', 'r') as f:
    content = f.read()

content = content.replace(
    '@apply bg-white border border-gray-200 rounded-xl shadow-card;',
    '@apply bg-white dark:bg-navy border border-gray-200 dark:border-white/10 rounded-xl shadow-card;'
)
content = content.replace(
    '::-webkit-scrollbar-track { @apply bg-gray-100; }',
    '::-webkit-scrollbar-track { @apply bg-gray-100 dark:bg-navy-dark; }'
)
content = content.replace(
    '::-webkit-scrollbar-thumb { @apply bg-gray-300 rounded-full; }',
    '::-webkit-scrollbar-thumb { @apply bg-gray-300 dark:bg-white/20 rounded-full; }'
)

with open('app/globals.css', 'w') as f:
    f.write(content)
