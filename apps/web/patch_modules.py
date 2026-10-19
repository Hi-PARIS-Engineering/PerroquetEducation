import re

with open('app/(platform)/dashboard/page.tsx', 'r') as f:
    content = f.read()

# 1. Mettre à jour le tableau des modules
old_modules = """  const modules = [
    { name: t.dashboard.modules.insights.name, desc: t.dashboard.modules.insights.desc, icon: "🔬", href: "/insights", iconCls: "bg-danger/10 border-danger/20",   textCls: "text-danger"    },
    { name: t.dashboard.modules.tube.name,     desc: t.dashboard.modules.tube.desc,     icon: "▶",  href: "/tube",     iconCls: "bg-primary/10 border-primary/20", textCls: "text-primary"   },
    { name: t.dashboard.modules.course.name,   desc: t.dashboard.modules.course.desc,   icon: "📖", href: "/courses",  iconCls: "bg-primary/10 border-primary/20", textCls: "text-primary"   },
    { name: t.dashboard.modules.mooc.name,     desc: t.dashboard.modules.mooc.desc,     icon: "🎓", href: "/moocs",    iconCls: "bg-primary/10 border-primary/20", textCls: "text-primary"   },
    { name: t.dashboard.modules.app.name,      desc: t.dashboard.modules.app.desc,      icon: "⚡", href: "/apps",     iconCls: "bg-amber-50 border-amber-200",    textCls: "text-amber-700" },
  ];"""

new_modules = """  const modules = [
    { name: t.dashboard.modules.insights.name, desc: t.dashboard.modules.insights.desc, icon: "🔬", href: "/insights", image: "/images/insigh.webp",     bg: "bg-gradient-to-br from-danger to-[#A01E2A]" },
    { name: t.dashboard.modules.tube.name,     desc: t.dashboard.modules.tube.desc,     icon: "▶",  href: "/tube",     image: "/images/Hi! tube.png",  bg: "bg-gradient-to-br from-primary to-primary-dark" },
    { name: t.dashboard.modules.course.name,   desc: t.dashboard.modules.course.desc,   icon: "📖", href: "/courses",  image: "/images/Course.webp",     bg: "bg-gradient-to-br from-primary to-primary-dark" },
    { name: t.dashboard.modules.mooc.name,     desc: t.dashboard.modules.mooc.desc,     icon: "🎓", href: "/moocs",    image: "/images/Mooc.webp",       bg: "bg-gradient-to-br from-primary to-primary-dark" },
    { name: t.dashboard.modules.app.name,      desc: t.dashboard.modules.app.desc,      icon: "⚡", href: "/apps",     image: "/images/App.webp",        bg: "bg-gradient-to-br from-gray-700 to-gray-900" },
  ];"""

content = content.replace(old_modules, new_modules)

# 2. Mettre à jour le rendu des modules
old_render = """        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          {modules.map((m) => (
            <Link
              key={m.href}
              href={m.href}
              className="group bg-white dark:bg-navy border border-gray-200 dark:border-white/10 rounded-xl p-5 hover:border-primary/30 hover:shadow-card-hover transition-all shadow-card"
            >
              <div className={`w-10 h-10 ${m.iconCls} border rounded-lg flex items-center justify-center text-xl mb-3`}>
                {m.icon}
              </div>
              <p className="text-sm font-semibold text-gray-900 dark:text-white group-hover:text-primary transition-colors">{m.name}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400 dark:text-gray-500 mt-0.5">{m.desc}</p>
            </Link>
          ))}
        </div>"""

new_render = """        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          {modules.map((m) => (
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
          ))}
        </div>"""

content = content.replace(old_render, new_render)

with open('app/(platform)/dashboard/page.tsx', 'w') as f:
    f.write(content)
