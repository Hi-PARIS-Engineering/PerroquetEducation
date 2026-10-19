import re
import os

files_to_patch = {
    'app/(platform)/my-learning/page.tsx': (
        r'(<div className="max-w-7xl mx-auto px-6 py-10">\s*<div className="mb-8">\s*<h1 className="text-2xl font-extrabold text-gray-900 mb-1">\{t.myLearning.title\}</h1>\s*<p className="text-gray-500">\{t.myLearning.subtitle\}</p>\s*</div>)',
        r'''<div className="bg-white">
      <div className="bg-primary/5 border-b border-primary/10 py-12 mb-8">
        <div className="max-w-7xl mx-auto px-6">
          <h1 className="text-3xl font-extrabold text-primary">{t.myLearning.title}</h1>
          <p className="text-primary/70 mt-2 font-medium">{t.myLearning.subtitle}</p>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-6 pb-10">'''
    ),
    'app/(platform)/admin/page.tsx': (
        r'(<div className="max-w-7xl mx-auto px-6 py-10">\s*<div className="flex items-center justify-between mb-8">\s*<div>\s*<h1 className="text-3xl font-bold text-gray-900">Administration</h1>\s*<p className="text-gray-500 mt-1">Gérez les utilisateurs, les accès et les contenus de la plateforme.</p>\s*</div>\s*</div>)',
        r'''<div className="bg-white">
      <div className="bg-primary/5 border-b border-primary/10 py-12 mb-8">
        <div className="max-w-7xl mx-auto px-6">
          <h1 className="text-3xl font-extrabold text-primary">Administration</h1>
          <p className="text-primary/70 mt-2 font-medium">Gérez les utilisateurs, les accès et les contenus de la plateforme.</p>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-6 pb-10">'''
    ),
    'app/(platform)/lms/page.tsx': (
        r'(<div className="max-w-7xl mx-auto px-6 py-10">\s*<div className="flex items-center justify-between mb-8 flex-wrap gap-4">\s*<div>\s*<h1 className="text-3xl font-bold text-gray-900">LMS — Cohortes</h1>\s*<p className="text-gray-500 mt-1">Gestion des apprenants, cohortes et analyses des parcours.</p>\s*</div>\s*<button className="bg-primary text-white px-5 py-2.5 rounded-xl text-sm font-semibold hover:bg-primary-dark transition-colors shadow-lg shadow-primary/30">\s*\+ Nouvelle Cohorte\s*</button>\s*</div>)',
        r'''<div className="bg-white">
      <div className="bg-primary/5 border-b border-primary/10 py-12 mb-8">
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between flex-wrap gap-4">
          <div>
            <h1 className="text-3xl font-extrabold text-primary">LMS — Cohortes</h1>
            <p className="text-primary/70 mt-2 font-medium">Gestion des apprenants, cohortes et analyses des parcours.</p>
          </div>
          <button className="bg-primary text-white px-5 py-2.5 rounded-sm text-sm font-semibold hover:bg-primary-dark transition-colors shadow-md">
            + Nouvelle Cohorte
          </button>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-6 pb-10">'''
    )
}

for filepath, (pattern, replacement) in files_to_patch.items():
    if os.path.exists(filepath):
        with open(filepath, 'r') as f:
            content = f.read()
            
        new_content = re.sub(pattern, replacement, content)
        
        # Don't forget to close the new div at the end if we successfully replaced!
        if new_content != content:
            new_content = new_content.replace('    </div>\n  );\n}', '      </div>\n    </div>\n  );\n}')
            
            with open(filepath, 'w') as f:
                f.write(new_content)
            print(f"Patched {filepath}")

