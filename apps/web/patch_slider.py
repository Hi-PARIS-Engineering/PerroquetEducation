import re

with open('scratch_nav_slider.tsx', 'r') as f:
    content = f.read()

# 1. Update NavDropdown trigger button
old_button = """        className={clsx(
          "flex items-center gap-1.5 px-3 py-5 text-base font-bold transition-all whitespace-nowrap border-b-[3px]",
          // Branche active : mise en avant si l'URL correspond à cette section
          isActive
            ? "text-secondary border-secondary"
            : "text-gray-900 border-transparent hover:text-secondary hover:border-secondary"
        )}"""
new_button = """        className={clsx(
          "nav-item flex items-center gap-1.5 px-3 py-5 text-base font-bold transition-colors whitespace-nowrap",
          isActive ? "is-active text-secondary" : "text-gray-900 hover:text-secondary"
        )}"""
content = content.replace(old_button, new_button)

# 2. Update Insights link
old_insights = """              className={clsx(
                "flex items-center px-3 py-5 text-base font-bold transition-all whitespace-nowrap border-b-[3px]",
                // Branche actif si URL commence par /insights
                pathname.startsWith("/insights")
                  ? "text-secondary border-secondary"
                  : "text-gray-900 border-transparent hover:text-secondary hover:border-secondary"
              )}"""
new_insights = """              className={clsx(
                "nav-item flex items-center px-3 py-5 text-base font-bold transition-colors whitespace-nowrap",
                pathname.startsWith("/insights")
                  ? "is-active text-secondary"
                  : "text-gray-900 hover:text-secondary"
              )}"""
content = content.replace(old_insights, new_insights)

# 3. Add logic to Nav component
old_nav_start = """  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);"""
new_nav_start = """  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);

  // --- Logique du slider (barre rouge animée) ---
  const navRef = useRef<HTMLElement>(null);
  const [indicator, setIndicator] = useState({ left: 0, width: 0, opacity: 0 });
  const [activeEl, setActiveEl] = useState<HTMLElement | null>(null);

  useEffect(() => {
    // Petit délai pour laisser le rendu DOM se faire (notamment les fontes)
    const timer = setTimeout(() => {
      if (navRef.current) {
        const active = navRef.current.querySelector('.nav-item.is-active') as HTMLElement;
        if (active) {
          setActiveEl(active);
          const navRect = navRef.current.getBoundingClientRect();
          const rect = active.getBoundingClientRect();
          setIndicator({ left: rect.left - navRect.left, width: rect.width, opacity: 1 });
        } else {
          setActiveEl(null);
          setIndicator({ left: 0, width: 0, opacity: 0 });
        }
      }
    }, 100);
    return () => clearTimeout(timer);
  }, [pathname]);

  const handleNavMouseOver = (e: React.MouseEvent) => {
    const target = (e.target as HTMLElement).closest('.nav-item') as HTMLElement;
    if (target && navRef.current) {
      const navRect = navRef.current.getBoundingClientRect();
      const rect = target.getBoundingClientRect();
      setIndicator({ left: rect.left - navRect.left, width: rect.width, opacity: 1 });
    }
  };

  const handleNavMouseLeave = () => {
    if (activeEl && navRef.current) {
      const navRect = navRef.current.getBoundingClientRect();
      const rect = activeEl.getBoundingClientRect();
      setIndicator({ left: rect.left - navRect.left, width: rect.width, opacity: 1 });
    } else {
      setIndicator(prev => ({ ...prev, opacity: 0 }));
    }
  };
"""
content = content.replace(old_nav_start, new_nav_start)

# 4. Update the `<nav>` tag in Nav component
old_nav_tag = """          <nav className="flex items-center gap-0.5 flex-1 min-w-0 overflow-x-auto h-full">"""
new_nav_tag = """          <nav
            ref={navRef}
            onMouseOver={handleNavMouseOver}
            onMouseLeave={handleNavMouseLeave}
            className="relative flex items-center gap-0.5 flex-1 min-w-0 overflow-x-auto h-full"
          >
            {/* Le Slider rouge animé */}
            <div
              className="absolute bottom-0 h-[3px] bg-secondary transition-all duration-300 ease-out"
              style={{ left: indicator.left, width: indicator.width, opacity: indicator.opacity }}
            />
"""
content = content.replace(old_nav_tag, new_nav_tag)

with open('scratch_nav_slider.tsx', 'w') as f:
    f.write(content)
