with open('components/platform/Nav.tsx', 'r') as f:
    content = f.read()

old_h = '''                <span className="flex items-center">
                  <span>I</span>
                  <span className="text-[1.3em] mx-[-0.12em] leading-none mb-[0.1em]">·</span>
                  <span>I</span>
                </span>'''

new_h = '''                <span className="flex items-center">
                  <span>I</span>
                  <span className="text-[1.3em] mx-[3px] leading-none mb-[0.1em]">•</span>
                  <span>I</span>
                </span>'''

content = content.replace(old_h, new_h)

with open('components/platform/Nav.tsx', 'w') as f:
    f.write(content)
