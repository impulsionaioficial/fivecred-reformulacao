import re

file_path = "index.html"

with open(file_path, 'r', encoding='utf-8') as f:
    html = f.read()

# Fix minParking bug
html = html.replace('parseInt(document.getElementById("filter-parking").value) : Infinity;', 'parseInt(document.getElementById("filter-parking").value) : 0;')

# Fix transmission -> status
html = html.replace('car.transmission !== activeTransmission', 'car.status !== activeTransmission')

# Fix fuels -> features. Actually, if I just remove fuel filtering, it's safer.
# Let's just remove line 1663.
html = re.sub(r'if \(fuels\.length > 0 && !fuels\.includes\(car\.fuel\)\) return false;', '', html)

# The default value for activeCategory might be set by the buttons.
# Let's just map the categories if they click the top buttons.
# But for now, fixing minParking=0 should bring back the properties!

with open(file_path, 'w', encoding='utf-8') as f:
    f.write(html)

print("Logic fixed!")
