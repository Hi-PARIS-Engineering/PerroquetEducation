import re

with open('app/(platform)/dashboard/page.tsx', 'r') as f:
    content = f.read()

old_array = """  const highlightBanners = [
    { title: t.dashboard.banners.insights.title, desc: t.dashboard.banners.insights.desc, href: "/insights", cta: t.dashboard.banners.insights.cta, image: "/images/research-process-journey.png", icon: "🔬" },
    { title: t.dashboard.banners.courses.title,  desc: t.dashboard.banners.courses.desc,  href: "/courses",  cta: t.dashboard.banners.courses.cta,  image: "/images/fondamentaux.jpg", icon: "📖" },
    { title: t.dashboard.banners.apps.title,     desc: t.dashboard.banners.apps.desc,     href: "/apps",     cta: t.dashboard.banners.apps.cta,     image: "/images/tracking-1024x576.png", icon: "⚡" },
  ];"""

new_array = """  const highlightBanners = [
    { title: t.dashboard.banners.insights.title, desc: t.dashboard.banners.insights.desc, href: "/insights", cta: t.dashboard.banners.insights.cta, image: "/images/research-process-journey.png", bg: "bg-gradient-to-br from-danger to-[#A01E2A]", icon: "🔬" },
    { title: t.dashboard.banners.courses.title,  desc: t.dashboard.banners.courses.desc,  href: "/courses",  cta: t.dashboard.banners.courses.cta,  image: "/images/fondamentaux.jpg", bg: "bg-gradient-to-br from-primary to-primary-dark", icon: "📖" },
    { title: t.dashboard.banners.apps.title,     desc: t.dashboard.banners.apps.desc,     href: "/apps",     cta: t.dashboard.banners.apps.cta,     image: "/images/tracking-1024x576.png", bg: "bg-gradient-to-br from-gray-700 to-gray-900", icon: "⚡" },
  ];"""

content = content.replace(old_array, new_array)

old_render = """          {highlightBanners.map((b) => (
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
              </div>"""

new_render = """          {highlightBanners.map((b) => (
            <Link
              key={b.href}
              href={b.href}
              className={`group relative overflow-hidden rounded-2xl ${b.bg} p-6 hover:scale-[1.02] transition-transform duration-300 shadow-lg block`}
            >
              {/* Image en arrière-plan qui se fond dans la couleur de la div */}
              <div className="absolute inset-0 z-0">
                <img
                  src={b.image}
                  alt=""
                  className="w-full h-full object-cover opacity-20 group-hover:opacity-30 mix-blend-overlay transition-opacity duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
              </div>"""

content = content.replace(old_render, new_render)

with open('app/(platform)/dashboard/page.tsx', 'w') as f:
    f.write(content)
