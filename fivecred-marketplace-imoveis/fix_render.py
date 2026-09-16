import re

file_path = "index.html"

with open(file_path, 'r', encoding='utf-8', errors='ignore') as f:
    html = f.read()

# Fix messed up math
html = html.replace('(currentPageSo Paulo, SP1)', '(currentPage - 1)')
html = html.replace('(compoundSo Paulo, SP1)', '(compound - 1)')
html = html.replace('(currentPageSão Paulo, SP1)', '(currentPage - 1)')
html = html.replace('(compoundSão Paulo, SP1)', '(compound - 1)')

# Fix undefined tags
html = html.replace('Laudo ${car.cautelar}', 'Doc OK')
html = html.replace('${car.location}', 'São Paulo, SP')

with open(file_path, 'w', encoding='utf-8') as f:
    f.write(html)

print("Fixed")
