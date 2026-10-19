import os
import re

directories = ['app', 'components']

replacements = {
    r'\bbg-white(?!\s*dark:)': 'bg-white dark:bg-navy',
    r'\btext-gray-900(?!\s*dark:)': 'text-gray-900 dark:text-white',
    r'\btext-gray-800(?!\s*dark:)': 'text-gray-800 dark:text-gray-100',
    r'\btext-gray-700(?!\s*dark:)': 'text-gray-700 dark:text-gray-200',
    r'\btext-gray-600(?!\s*dark:)': 'text-gray-600 dark:text-gray-300',
    r'\btext-gray-500(?!\s*dark:)': 'text-gray-500 dark:text-gray-400',
    r'\btext-gray-400(?!\s*dark:)': 'text-gray-400 dark:text-gray-500',
    r'\bborder-gray-300(?!\s*dark:)': 'border-gray-300 dark:border-white/20',
    r'\bborder-gray-200(?!\s*dark:)': 'border-gray-200 dark:border-white/10',
    r'\bborder-gray-100(?!\s*dark:)': 'border-gray-100 dark:border-white/5',
    r'\bbg-gray-50(?!\s*dark:)': 'bg-gray-50 dark:bg-white/5',
    r'\bbg-gray-100(?!\s*dark:)': 'bg-gray-100 dark:bg-white/10',
}

def process_file(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    new_content = content
    for pattern, replacement in replacements.items():
        new_content = re.sub(pattern, replacement, new_content)
        
    if new_content != content:
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(new_content)
        print(f"Updated {filepath}")

for d in directories:
    for root, dirs, files in os.walk(d):
        for file in files:
            if file.endswith('.tsx') or file.endswith('.ts'):
                process_file(os.path.join(root, file))

