import re
import os

def process_file(filepath, replacement_map):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    new_content = content
    for pattern, replacement in replacement_map.items():
        new_content = re.sub(pattern, replacement, new_content)
        
    if new_content != content:
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(new_content)
        print(f"Updated {filepath}")


# Auth pages (main background) -> navy-dark
auth_files = [
    'app/(auth)/complete-profile/page.tsx',
    'app/(auth)/login/page.tsx',
    'app/verify-email/page.tsx'
]

for f in auth_files:
    if os.path.exists(f):
        process_file(f, {r'\bbg-surface(?!\s*dark:)': 'bg-surface dark:bg-navy-dark'})


# Databootcamp cards -> navy (elevated card color)
db_file = 'app/(platform)/databootcamp/page.tsx'
if os.path.exists(db_file):
    process_file(db_file, {r'\bbg-surface(?!\s*dark:)': 'bg-surface dark:bg-navy'})

