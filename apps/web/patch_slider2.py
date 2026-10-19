import re

with open('components/platform/Nav.tsx', 'r') as f:
    content = f.read()

pattern = r"(const userMenuRef = useRef<HTMLDivElement>\(null\);)"
replacement = r"""\1

  // --- Logique du slider (barre rouge animée) ---
  const navRef = useRef<HTMLElement>(null);
  const [indicator, setIndicator] = useState({ left: 0, width: 0, opacity: 0 });
  const [activeEl, setActiveEl] = useState<HTMLElement | null>(null);

  useEffect(() => {
    // Petit délai pour laisser le rendu DOM se faire
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

content = re.sub(pattern, replacement, content)

with open('components/platform/Nav.tsx', 'w') as f:
    f.write(content)
