import re

with open('scratch_nav.tsx', 'r') as f:
    content = f.read()

# 1. Update props signature
content = content.replace('onToggle:    (slug: string) => void;', 'onOpen: (slug: string) => void; onClose: () => void;')
content = content.replace('isOpen, onToggle', 'isOpen, onOpen, onClose')

# 2. Replace handleToggle logic in NavDropdown
old_handle_toggle = """  function handleToggle() {
    if (!isOpen && buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      // Aligne le bord gauche du panneau sur le bord gauche du bouton,
      // 6px en dessous du bas du bouton pour un petit espace visuel.
      setDropPos({ top: rect.bottom + 6, left: rect.left });
    }
    onToggle(slug);
  }

  return (
    <>"""

new_handle_toggle = """  function handleMouseEnter() {
    if (buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      setDropPos({ top: rect.bottom, left: rect.left });
    }
    onOpen(slug);
  }

  return (
    <div onMouseEnter={handleMouseEnter} onMouseLeave={onClose} className="h-full flex items-center">"""
content = content.replace(old_handle_toggle, new_handle_toggle)

# 3. Remove onClick from button
content = content.replace('onClick={handleToggle}\n        aria-expanded={isOpen}', 'aria-expanded={isOpen}')

# 4. Change closing tag from </> to </div>
content = content.replace('      )}\n    </>\n  );\n}\n\n// ─── LangSwitcher', '      )}\n    </div>\n  );\n}\n\n// ─── LangSwitcher')

# 5. Fix onClick in NavDropdown links
content = content.replace('onClick={() => onToggle(slug)}', 'onClick={onClose}')

# 6. Update parent Nav component
old_parent_toggle = """  function handleDropdownToggle(slug: string) {
    setOpenDropdown((prev) => (prev === slug ? null : slug));
  }"""
new_parent_toggle = """  function handleDropdownOpen(slug: string) {
    setOpenDropdown(slug);
  }
  function handleDropdownClose() {
    setOpenDropdown(null);
  }"""
content = content.replace(old_parent_toggle, new_parent_toggle)

# 7. Update NavDropdown instances
content = content.replace('onToggle={handleDropdownToggle}', 'onOpen={handleDropdownOpen} onClose={handleDropdownClose}')

with open('scratch_nav.tsx', 'w') as f:
    f.write(content)
