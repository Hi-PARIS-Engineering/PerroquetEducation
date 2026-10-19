import re

with open('components/platform/Nav.tsx', 'r') as f:
    content = f.read()

# 1. Update dropdown position
old_enter = """  function handleMouseEnter() {
    if (buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      setDropPos({ top: rect.bottom, left: rect.left });
    }
    onOpen(slug);
  }"""
new_enter = """  function handleMouseEnter() {
    if (buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      const header = buttonRef.current.closest('header');
      // On place le menu exactement en dessous du header (et donc de la barre rouge)
      const topPos = header ? header.getBoundingClientRect().bottom : rect.bottom;
      setDropPos({ top: topPos, left: rect.left });
    }
    onOpen(slug);
  }"""
content = content.replace(old_enter, new_enter)

# 2. Remove the blue top border from the dropdown panel
old_panel_class = '"w-72 bg-white border-t-2 border-primary shadow-lg overflow-hidden z-[200] transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] origin-top"'
new_panel_class = '"w-72 bg-white shadow-lg border border-gray-100 overflow-hidden z-[200] transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] origin-top"'
content = content.replace(old_panel_class, new_panel_class)

with open('components/platform/Nav.tsx', 'w') as f:
    f.write(content)
