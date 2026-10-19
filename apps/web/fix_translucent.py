import os
import re

directories = ['app', 'components']

def process_file(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Revert bg-white dark:bg-navy/X to bg-white/X
    # Same for hover:bg-white dark:bg-navy/X to hover:bg-white/X
    new_content = re.sub(r'bg-white dark:bg-navy/(\d+)', r'bg-white/\1', content)
    
    if new_content != content:
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(new_content)
        print(f"Fixed {filepath}")

for d in directories:
    for root, dirs, files in os.walk(d):
        for file in files:
            if file.endswith('.tsx') or file.endswith('.ts'):
                process_file(os.path.join(root, file))

