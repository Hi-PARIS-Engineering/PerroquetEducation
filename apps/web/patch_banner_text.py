import os

files_to_patch = [
    'app/(platform)/admin/page.tsx',
    'app/(platform)/databootcamp/courses/page.tsx',
    'app/(platform)/insights/page.tsx'
]

for filepath in files_to_patch:
    if os.path.exists(filepath):
        with open(filepath, 'r') as f:
            content = f.read()
        
        # Patch the h1 title
        content = content.replace(
            'className="text-3xl font-extrabold text-primary"',
            'className="text-3xl font-extrabold text-primary dark:text-white"'
        )
        
        # Patch the paragraph subtitle
        content = content.replace(
            'className="text-primary/70 mt-2 font-medium"',
            'className="text-primary/70 dark:text-white/80 mt-2 font-medium"'
        )

        # Patch the breadcrumb in databootcamp courses if any
        content = content.replace(
            'className="text-sm text-primary/60 mb-3 flex items-center font-medium"',
            'className="text-sm text-primary/60 dark:text-white/60 mb-3 flex items-center font-medium"'
        )
        
        with open(filepath, 'w') as f:
            f.write(content)
        print(f"Patched {filepath}")
