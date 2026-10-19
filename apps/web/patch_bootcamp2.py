import re

with open('app/(platform)/databootcamp/courses/page.tsx', 'r') as f:
    content = f.read()

pattern = r'<div className="max-w-4xl mx-auto px-6 py-12">\s*\{\/\* En-tête de page \*\/\}\s*<div className="mb-10">\s*<nav className="text-sm text-gray-400 mb-2">\s*<Link href="/databootcamp" className="hover:text-primary transition-colors">\s*Hi! Databootcamp\s*</Link>\{" "\}\s*<span className="mx-1">/</span> Liste des cours\s*</nav>\s*<h1 className="text-3xl font-extrabold text-gray-900">Liste des cours</h1>\s*<p className="text-gray-500 mt-1">Les cours du Data Bootcamp seront bientôt disponibles ici.</p>\s*</div>'

new_header = """<div className="bg-white w-full">
      {/* Bannière de titre */}
      <div className="bg-primary/5 border-b border-primary/10 py-12 mb-8">
        <div className="max-w-4xl mx-auto px-6">
          <nav className="text-sm text-primary/60 mb-3 flex items-center font-medium">
            <Link href="/databootcamp" className="hover:text-secondary transition-colors">
              Hi! Databootcamp
            </Link>{" "}
            <span className="mx-2">/</span> Liste des cours
          </nav>
          <h1 className="text-3xl font-extrabold text-primary">Liste des cours</h1>
          <p className="text-primary/70 mt-2 font-medium">Les cours du Data Bootcamp seront bientôt disponibles ici.</p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 pb-12">"""

content = re.sub(pattern, new_header, content)

with open('app/(platform)/databootcamp/courses/page.tsx', 'w') as f:
    f.write(content)
