import re

with open('components/platform/Nav.tsx', 'r') as f:
    content = f.read()

content = content.replace(
    'import Link from "next/link";',
    'import Link from "next/link";\nimport { ThemeSwitcher } from "@/components/theme/ThemeSwitcher";'
)

content = content.replace(
    '<LangSwitcher />',
    '<ThemeSwitcher />\n            <LangSwitcher />'
)

# Dark mode adaptation for Nav header
content = content.replace(
    'className="bg-white border-b border-gray-200"',
    'className="bg-white dark:bg-navy border-b border-gray-200 dark:border-white/10"'
)
# Dark mode text for navigation items
content = content.replace(
    'className="font-extrabold text-gray-900',
    'className="font-extrabold text-gray-900 dark:text-white'
)
# Make text-gray-900 into dark:text-white for the main sections
content = re.sub(r'text-gray-900', r'text-gray-900 dark:text-white', content)
content = re.sub(r'bg-white', r'bg-white dark:bg-navy', content)
content = re.sub(r'bg-gray-100', r'bg-gray-100 dark:bg-navy-dark', content)
content = re.sub(r'text-gray-700', r'text-gray-700 dark:text-gray-200', content)
content = re.sub(r'text-gray-500', r'text-gray-500 dark:text-gray-400', content)
content = re.sub(r'text-gray-600', r'text-gray-600 dark:text-gray-300', content)
content = re.sub(r'border-gray-200', r'border-gray-200 dark:border-primary/20', content)


with open('components/platform/Nav.tsx', 'w') as f:
    f.write(content)
