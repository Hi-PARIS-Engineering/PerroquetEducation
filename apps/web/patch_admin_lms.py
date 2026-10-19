with open('app/(platform)/admin/page.tsx', 'r') as f:
    content = f.read()
content = content.replace('<div className="max-w-7xl mx-auto px-6 py-10">', '<div className="bg-white"><div className="bg-primary/5 border-b border-primary/10 py-12 mb-8"><div className="max-w-7xl mx-auto px-6"><h1 className="text-3xl font-extrabold text-primary">Administration</h1><p className="text-primary/70 mt-2 font-medium">Gérez les utilisateurs, les accès et les contenus de la plateforme.</p></div></div><div className="max-w-7xl mx-auto px-6 pb-10">')
content = content.replace('<div className="flex items-center justify-between mb-8">\n            <div>\n              <h1 className="text-3xl font-bold text-gray-900">Administration</h1>\n              <p className="text-gray-500 mt-1">Gérez les utilisateurs, les accès et les contenus de la plateforme.</p>\n            </div>\n          </div>', '')
if 'Administration' in content and 'bg-primary/5' in content:
    content = content.replace('    </div>\n  );\n}', '      </div>\n    </div>\n  );\n}')
    with open('app/(platform)/admin/page.tsx', 'w') as f:
        f.write(content)

