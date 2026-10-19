import re

with open('app/(platform)/dashboard/page.tsx', 'r') as f:
    content = f.read()

old_array = """  const highlightBanners = [
    { title: t.dashboard.banners.insights.title, desc: t.dashboard.banners.insights.desc, href: "/insights", cta: t.dashboard.banners.insights.cta, bg: "bg-gradient-to-br from-danger to-[#A01E2A]",        icon: "🔬" },
    { title: t.dashboard.banners.courses.title,  desc: t.dashboard.banners.courses.desc,  href: "/courses",  cta: t.dashboard.banners.courses.cta,  bg: "bg-gradient-to-br from-primary to-primary-dark",     icon: "📖" },
    { title: t.dashboard.banners.apps.title,     desc: t.dashboard.banners.apps.desc,     href: "/apps",     cta: t.dashboard.banners.apps.cta,     bg: "bg-gradient-to-br from-gray-700 to-gray-900",        icon: "⚡" },
  ];"""

new_array = """  const highlightBanners = [
    { title: t.dashboard.banners.insights.title, desc: t.dashboard.banners.insights.desc, href: "/insights", cta: t.dashboard.banners.insights.cta, image: "/images/research-process-journey.png", icon: "🔬" },
    { title: t.dashboard.banners.courses.title,  desc: t.dashboard.banners.courses.desc,  href: "/courses",  cta: t.dashboard.banners.courses.cta,  image: "/images/fondamentaux.jpg", icon: "📖" },
    { title: t.dashboard.banners.apps.title,     desc: t.dashboard.banners.apps.desc,     href: "/apps",     cta: t.dashboard.banners.apps.cta,     image: "/images/tracking-1024x576.png", icon: "⚡" },
  ];"""

content = content.replace(old_array, new_array)

old_render = """          {highlightBanners.map((b) => (
            <Link
              key={b.href}
              href={b.href}
              className="group relative overflow-hidden rounded-2xl bg-white dark:bg-navy p-6 hover:scale-[1.02] transition-transform duration-300 shadow-lg block"
            >
              {/* Bande de couleur à droite qui grandit au survol */}
              <div className={`absolute inset-y-0 right-0 w-2 group-hover:w-full transition-all duration-500 ease-out z-0 ${b.bg}`} />
              
              {/* Contenu (z-10 pour rester au dessus du fond) */}
              <div className="relative z-10 flex flex-col h-full">
                <div className="text-3xl mb-3">{b.icon}</div>
                <h3 className="text-base font-bold text-gray-900 dark:text-white group-hover:text-white transition-colors duration-500 leading-snug">{b.title}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-300 group-hover:text-white/80 transition-colors duration-500 mb-4">{b.desc}</p>
                <span className="text-sm font-semibold text-primary dark:text-gray-300 group-hover:text-white transition-colors duration-500 mt-auto">
                  {b.cta} →
                </span>
              </div>
            </Link>
          ))}"""

new_render = """          {highlightBanners.map((b) => (
            <Link
              key={b.href}
              href={b.href}
              className="group relative overflow-hidden rounded-2xl bg-gray-900 p-6 hover:scale-[1.02] transition-transform duration-300 shadow-lg block"
            >
              {/* Image en arrière-plan avec opacité */}
              <div className="absolute inset-0 z-0">
                <img
                  src={b.image}
                  alt=""
                  className="w-full h-full object-cover opacity-30 group-hover:opacity-40 transition-opacity duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-gray-900/80 to-transparent" />
              </div>
              
              {/* Contenu (z-10 pour rester au dessus du fond) - Rétabli avec l'ancien aspect statique en texte blanc */}
              <div className="relative z-10 flex flex-col h-full">
                <div className="text-3xl mb-3">{b.icon}</div>
                <h3 className="text-base font-bold text-white mb-2 leading-snug">{b.title}</h3>
                <p className="text-sm text-white/70 mb-4">{b.desc}</p>
                <span className="text-sm font-semibold text-white/80 group-hover:text-white transition-colors mt-auto">
                  {b.cta} →
                </span>
              </div>
            </Link>
          ))}"""

content = content.replace(old_render, new_render)

with open('app/(platform)/dashboard/page.tsx', 'w') as f:
    f.write(content)
