import re

with open('index.html', 'r', encoding='utf-8') as f:
    content = f.read()

# Replace within DOMContentLoaded
target = """        window.addEventListener("DOMContentLoaded", () => {
            applyFilters(true);"""

replacement = """        window.addEventListener("DOMContentLoaded", () => {
            // Shuffle the vehicles array so AI generated images are mixed in naturally
            for (let i = vehicles.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [vehicles[i], vehicles[j]] = [vehicles[j], vehicles[i]];
            }
            
            applyFilters(true);"""

content = content.replace(target, replacement)

with open('index.html', 'w', encoding='utf-8') as f:
    f.write(content)
