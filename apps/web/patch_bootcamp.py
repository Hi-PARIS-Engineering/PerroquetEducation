import re

with open('app/(platform)/databootcamp/courses/page.tsx', 'r') as f:
    content = f.read()

old_header = """    <div className="max-w-7xl mx-auto px-6 py-10">

      {/* En-tête + Breadcrumbs (simulé) */}
      <div className="mb-10">
        <nav className="text-sm text-gray-500 mb-3 flex items-center">
          <Link href="/databootcamp" className="hover:text-primary transition-colors">
            {t.nav.databootcamp}
          </Link>{" "}
          <span className="mx-1">/</span> Liste des cours
        </nav>
        <h1 className="text-3xl font-extrabold text-gray-900">Liste des cours</h1>
        <p className="text-gray-500 mt-1">Les cours du Data Bootcamp seront bientôt disponibles ici.</p>
      </div>"""

new_header = """    <div className="bg-white">
      {/* Bannière de titre */}
      <div className="bg-primary/5 border-b border-primary/10 py-12 mb-8">
        <div className="max-w-7xl mx-auto px-6">
          <nav className="text-sm text-primary/60 mb-3 flex items-center font-medium">
            <Link href="/databootcamp" className="hover:text-secondary transition-colors">
              {t.nav.databootcamp}
            </Link>{" "}
            <span className="mx-2">/</span> Liste des cours
          </nav>
          <h1 className="text-3xl font-extrabold text-primary">Liste des cours</h1>
          <p className="text-primary/70 mt-2 font-medium">Les cours du Data Bootcamp seront bientôt disponibles ici.</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 pb-10">"""

content = content.replace(old_header, new_header)

with open('app/(platform)/databootcamp/courses/page.tsx', 'w') as f:
    f.write(content)
