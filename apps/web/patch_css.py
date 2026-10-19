import re

with open('app/globals.css', 'r') as f:
    content = f.read()

# Remove the google fonts import
content = re.sub(r'@import url\("https://fonts.googleapis.com[^"]+"\);\n*', '', content)

font_face = """
@font-face {
  font-family: 'Cera Pro';
  src: url('/fonts/CeraPro-Light.woff2') format('woff2');
  font-weight: 300;
  font-style: normal;
  font-display: swap;
}

@font-face {
  font-family: 'Cera Pro';
  src: url('/fonts/CeraPro-Regular.woff2') format('woff2');
  font-weight: 400;
  font-style: normal;
  font-display: swap;
}

@font-face {
  font-family: 'Cera Pro';
  src: url('/fonts/CeraPro-Bold.woff2') format('woff2');
  font-weight: 700;
  font-style: normal;
  font-display: swap;
}

"""

content = font_face + content

with open('app/globals.css', 'w') as f:
    f.write(content)
