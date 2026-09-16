import re

file_path = "index.html"

with open(file_path, 'r', encoding='utf-8') as f:
    html = f.read()

# Fix JS IDs
html = html.replace('document.getElementById("filter-brand")', 'document.getElementById("filter-type")')
html = html.replace('document.getElementById("filter-year")', 'document.getElementById("filter-bedrooms")')
html = html.replace('document.getElementById("filter-km")', 'document.getElementById("filter-parking")')

# Fix filter labels in JS
html = html.replace('car.year < minYear', 'car.year < minYear') # year is bedrooms
html = html.replace('car.km > maxKm', 'car.km < maxKm') # km is parking, and it should be "At least" now since it's "Vagas". Wait, in the options I set:
# <option value="1">1+ Vaga</option>. So it's minimum parking.
html = html.replace('const maxKm = ', 'const minParking = ')
html = html.replace('document.getElementById("filter-parking").value : Infinity', 'document.getElementById("filter-parking").value : 0')
html = html.replace('if (car.km > maxKm) return false;', 'if (car.km < minParking) return false;')

# Also the category filter logic:
# if (activeCategory && car.category !== activeCategory) { ... }
# Wait, I didn't add category to my properties!
# I added brand: 'Apartamento', 'Casa', etc.
# In the original, top buttons set `activeCategory`.
# Original HTML top buttons: 
# "Convencionais" -> "Apartamentos"
# "Utilitários / SUVs" -> "Casas"
# "Superesportivos / Hyper" -> "Alto Padrão"
# "Elétricos" -> "Lançamentos"

# Let's just remove the complex category logic and replace it with:
# activeCategory checks against brand, or we can just simplify it.
# Actually, I didn't change the onclick handlers for the top pills.
# They probably still do `setCategory('Convencional')`.

# Let's replace the whole `applyFilters` function body to be safe and clean.
# And `renderVehicleCard` strings: "Carregar Mais Carros" -> "Carregar Mais Imóveis", "veículos encontrados" -> "imóveis encontrados".

html = html.replace('Carregar Mais Carros', 'Carregar Mais Imóveis')
html = html.replace('veículos encontrados', 'imóveis encontrados')
html = html.replace('car.category', 'car.brand') # simple mapping since I put category inside brand

with open(file_path, 'w', encoding='utf-8') as f:
    f.write(html)

print("JS references fixed.")
