with open('app/globals.css', 'r') as f:
    content = f.read()

content = content.replace(
    '@apply bg-white text-[#303030] font-sans antialiased;',
    '@apply bg-white text-[#303030] dark:bg-navy dark:text-gray-100 font-sans antialiased;'
)

with open('app/globals.css', 'w') as f:
    f.write(content)
