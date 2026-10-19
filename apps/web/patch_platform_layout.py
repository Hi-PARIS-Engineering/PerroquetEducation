import re

with open('app/(platform)/layout.tsx', 'r') as f:
    content = f.read()

content = content.replace(
    'className="min-h-screen bg-white flex flex-col"',
    'className="min-h-screen bg-white dark:bg-navy-dark flex flex-col"'
)

with open('app/(platform)/layout.tsx', 'w') as f:
    f.write(content)
