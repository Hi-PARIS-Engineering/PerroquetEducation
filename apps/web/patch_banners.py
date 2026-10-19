import re

with open('app/(platform)/dashboard/page.tsx', 'r') as f:
    content = f.read()

old_block = """          {highlightBanners.map((b) => (
            <Link
              key={b.href}
              href={b.href}
              className={`group relative overflow-hidden rounded-2xl ${b.bg} p-6 hover:scale-[1.02] transition-all shadow-lg`}
            >
              <div className="text-3xl mb-3">{b.icon}</div>
              <h3 className="text-base font-bold text-white mb-2 leading-snug">{b.title}</h3>
              <p className="text-sm text-white/70 mb-4">{b.desc}</p>
              <span className="text-sm font-semibold text-white/80 group-hover:text-white transition-colors">
                {b.cta} →
              </span>
            </Link>
          ))}"""

new_block = """          {highlightBanners.map((b) => (
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

content = content.replace(old_block, new_block)

with open('app/(platform)/dashboard/page.tsx', 'w') as f:
    f.write(content)
