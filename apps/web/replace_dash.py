import os

directories = ['app', 'components', 'lib']

for d in directories:
    for root, _, files in os.walk(d):
        for file in files:
            if file.endswith('.tsx') or file.endswith('.ts'):
                filepath = os.path.join(root, file)
                with open(filepath, 'r', encoding='utf-8') as f:
                    content = f.read()
                
                if '—' in content:
                    # Replace em dash with a standard hyphen
                    new_content = content.replace('—', '-')
                    with open(filepath, 'w', encoding='utf-8') as f:
                        f.write(new_content)
                    print(f"Replaced in {filepath}")
