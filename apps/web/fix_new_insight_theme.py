import re

with open('app/(platform)/insights/new/page.tsx', 'r') as f:
    content = f.read()

# Fix duplicates from previous scripts
content = content.replace("dark:text-gray-400 dark:text-gray-500", "dark:text-gray-400")

# Backgrounds
content = content.replace('bg-navy', 'bg-surface dark:bg-navy-dark')
content = content.replace('bg-gray-900', 'bg-white dark:bg-gray-900')
content = content.replace('bg-gray-950', 'bg-white dark:bg-gray-950')
content = content.replace('bg-gray-800', 'bg-gray-100 dark:bg-gray-800')
content = content.replace('hover:bg-gray-700', 'hover:bg-gray-200 dark:hover:bg-gray-700')

# Text colors
content = content.replace('text-white', 'text-gray-900 dark:text-white')
# Fix buttons that should keep white text
content = content.replace('bg-gray-100 dark:bg-gray-800 border-gray-200 dark:border-white/10 text-gray-900 dark:text-white px-4 py-2', 'bg-gray-100 dark:bg-gray-800 border-gray-200 dark:border-white/10 text-gray-900 dark:text-white px-4 py-2')
content = content.replace('bg-danger text-gray-900 dark:text-white', 'bg-danger text-white')
content = content.replace('text-gray-400', 'text-gray-600 dark:text-gray-400')
content = content.replace('text-gray-600 dark:text-gray-600 dark:text-gray-400', 'text-gray-600 dark:text-gray-400') # Fix double apply
content = content.replace('placeholder-gray-700', 'placeholder-gray-400 dark:placeholder-gray-700')

# Borders
content = content.replace('border-white/10', 'border-gray-200 dark:border-white/10')
content = content.replace('hover:border-white/20', 'hover:border-gray-300 dark:hover:border-white/20')
content = content.replace('hover:border-white/30', 'hover:border-gray-400 dark:hover:border-white/30')
content = content.replace('focus:border-white/30', 'focus:border-gray-400 dark:focus:border-white/30')

# Translucent backgrounds
content = content.replace('bg-white/5', 'bg-gray-100 dark:bg-white/5')
content = content.replace('bg-white/10', 'bg-gray-200 dark:bg-white/10')

with open('app/(platform)/insights/new/page.tsx', 'w') as f:
    f.write(content)
