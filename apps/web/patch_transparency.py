import re

with open('app/(platform)/dashboard/page.tsx', 'r') as f:
    content = f.read()

old_render = """          {modules.map((m) => (
            <Link
              key={m.href}
              href={m.href}
              className={`group relative overflow-hidden rounded-xl ${m.bg} p-5 hover:scale-[1.02] transition-transform duration-300 shadow-card hover:shadow-card-hover block`}
            >
              {/* Image en arrière-plan qui se fond dans la couleur de la div */}
              <div className="absolute inset-0 z-0">
                <img
                  src={m.image}
                  alt=""
                  className="w-full h-full object-cover opacity-20 group-hover:opacity-30 mix-blend-overlay transition-opacity duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
              </div>

              {/* Contenu textuel */}
              <div className="relative z-10 flex flex-col h-full">
                <div className={`w-10 h-10 bg-white/10 border-white/20 border rounded-lg flex items-center justify-center text-xl mb-3`}>
                  {m.icon}
                </div>
                <p className="text-sm font-semibold text-white transition-colors leading-tight">{m.name}</p>
                <p className="text-xs text-white/70 mt-1">{m.desc}</p>
              </div>
            </Link>
          ))}"""

new_render = """          {modules.map((m) => (
            <Link
              key={m.href}
              href={m.href}
              className="group relative overflow-hidden rounded-xl bg-gray-900 p-5 hover:scale-[1.02] transition-transform duration-300 shadow-card hover:shadow-card-hover block"
            >
              <div className="absolute inset-0 z-0">
                {/* L'image au premier plan, très visible */}
                <img
                  src={m.image}
                  alt=""
                  className="w-full h-full object-cover opacity-70 group-hover:opacity-90 transition-opacity duration-300"
                />
                {/* La couleur devient un filtre superposé très transparent */}
                <div className={`absolute inset-0 ${m.bg} opacity-20 group-hover:opacity-30 mix-blend-multiply transition-opacity duration-300`} />
                {/* Le dégradé sombre en bas pour que le texte blanc reste lisible */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
              </div>

              {/* Contenu textuel */}
              <div className="relative z-10 flex flex-col h-full">
                <div className={`w-10 h-10 bg-white/10 border-white/20 border rounded-lg flex items-center justify-center text-xl mb-3 shadow-sm`}>
                  {m.icon}
                </div>
                <p className="text-sm font-semibold text-white transition-colors leading-tight">{m.name}</p>
                <p className="text-xs text-white/80 mt-1">{m.desc}</p>
              </div>
            </Link>
          ))}"""

content = content.replace(old_render, new_render)

with open('app/(platform)/dashboard/page.tsx', 'w') as f:
    f.write(content)
