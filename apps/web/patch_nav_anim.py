import re

with open('components/platform/Nav.tsx', 'r') as f:
    content = f.read()

# 1. Update the Dropdown Panel for smooth animation
old_panel = """      {/* ── Panneau déroulant (rendu uniquement si isOpen) ── */}
      {isOpen && (
        <div
          style={{ position: "fixed", top: dropPos.top, left: dropPos.left }}
          className="w-72 bg-white border-t-2 border-primary shadow-lg overflow-hidden z-[200]"
          // Stoppe la propagation du clic vers le backdrop parent,
          // ce qui empêcherait la fermeture involontaire lors d'un clic dans le panneau.
          onClick={(e) => e.stopPropagation()}
        >"""

new_panel = """      {/* ── Panneau déroulant ── */}
      <div
        style={{ position: "fixed", top: dropPos.top, left: dropPos.left }}
        className={clsx(
          "w-72 bg-white border-t-2 border-primary shadow-lg overflow-hidden z-[200] transition-all duration-300 ease-out origin-top",
          isOpen ? "opacity-100 translate-y-0 pointer-events-auto" : "opacity-0 -translate-y-2 pointer-events-none"
        )}
        // Stoppe la propagation du clic vers le backdrop parent
        onClick={(e) => e.stopPropagation()}
      >"""
content = content.replace(old_panel, new_panel)

# Remove the closing bracket of {isOpen && ( ... )}
old_closing = """          </div>
        </div>
      )}
    </div>"""
new_closing = """          </div>
        </div>
    </div>"""
content = content.replace(old_closing, new_closing)


# 2. Update the Links inside the dropdown for the ... animation
old_link = """                <Link
                  key={item.href}
                  href={item.href}
                  onClick={onClose} // ferme le dropdown au clic sur un lien
                  className={clsx(
                    "flex items-center gap-3 px-3 py-2.5 transition-colors",
                    // Branche actif : surbrillance si l'URL commence par ce chemin
                    pathname.startsWith(item.href)
                      ? "text-secondary font-bold"
                      : "text-gray-700 hover:text-secondary font-semibold"
                  )}
                >
                
                <div>
                  <p className="text-sm font-semibold leading-none mb-0.5">{item.label}</p>
                  <p className="text-xs text-gray-400">{item.desc}</p>
                </div>
              </Link>"""

new_link = """                <Link
                  key={item.href}
                  href={item.href}
                  onClick={onClose}
                  className={clsx(
                    "group relative flex items-center px-3 py-2.5 transition-all duration-300 overflow-hidden rounded-sm",
                    pathname.startsWith(item.href)
                      ? "text-secondary font-bold bg-secondary/5"
                      : "text-gray-700 hover:text-secondary font-semibold hover:bg-gray-50"
                  )}
                >
                  <span className="absolute left-3 font-extrabold text-secondary opacity-0 -translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300">
                    ...
                  </span>
                  <div className="transform group-hover:translate-x-6 transition-transform duration-300">
                    <p className="text-sm leading-none mb-0.5">{item.label}</p>
                    <p className="text-xs text-gray-400 group-hover:text-gray-500 transition-colors">{item.desc}</p>
                  </div>
                </Link>"""
content = content.replace(old_link, new_link)

with open('components/platform/Nav.tsx', 'w') as f:
    f.write(content)
