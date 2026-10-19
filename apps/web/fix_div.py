import re

with open('app/(platform)/databootcamp/courses/page.tsx', 'r') as f:
    content = f.read()

content = content.replace('</section>\n    </div>\n  );\n}', '</section>\n      </div>\n    </div>\n  );\n}')

with open('app/(platform)/databootcamp/courses/page.tsx', 'w') as f:
    f.write(content)
