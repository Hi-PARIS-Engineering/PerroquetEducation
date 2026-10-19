import re

with open('components/platform/Nav.tsx', 'r') as f:
    content = f.read()

old_list_start = "{items.map((item) => ("
old_list_end = "            ))} " # roughly where it ends

pattern = r"\{items\.map\(\(item\) => \(\s*<Link.*?</Link>\s*\)\)\}"

new_block = """{items.map((item) => (
              <Link
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
              </Link>
            ))}"""

content = re.sub(pattern, new_block, content, flags=re.DOTALL)

with open('components/platform/Nav.tsx', 'w') as f:
    f.write(content)
