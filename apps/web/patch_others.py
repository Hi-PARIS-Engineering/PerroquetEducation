import re, glob, os

pages = [
    'app/(platform)/lms/page.tsx',
    'app/(platform)/admin/page.tsx',
    'app/(platform)/my-learning/page.tsx',
    'app/(platform)/profile/page.tsx'
]

for p in pages:
    if not os.path.exists(p): continue
    with open(p, 'r') as f: content = f.read()
    
    # We look for <h1 className="text-2xl font-extrabold text-gray-900...">{title}</h1>
    # and replace its container. This is tricky with regex. Let's just do it manually for admin.
