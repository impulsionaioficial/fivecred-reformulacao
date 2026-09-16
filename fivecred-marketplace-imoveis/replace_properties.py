import re
import random

file_path = "index.html"

with open(file_path, 'r', encoding='utf-8') as f:
    html = f.read()

# Replace vehicles array with properties array
new_array_str = """const vehicles = [
    { id: 1, brand: 'Apartamento', model: 'Apto Padrão Moema', year: 2, km: 1, price: 850000, fipe: 860000, img: 'assets/imoveis/real_apartment_sp_1779906813709.png', fipe_code: '0', isAI: false, status: 'Pronto', features: ['Piscina'] },
    { id: 2, brand: 'Casa', model: 'Casa Condomínio Fechado', year: 4, km: 3, price: 1550000, fipe: 1600000, img: 'assets/imoveis/real_condo_house_1779906858070.png', fipe_code: '0', isAI: false, status: 'Pronto', features: ['Piscina', 'Varanda Gourmet'] },
    { id: 3, brand: 'Casa', model: 'Sobrado Rua Tranquila', year: 3, km: 2, price: 620000, fipe: 635000, img: 'assets/imoveis/real_house_street_1779906828695.png', fipe_code: '0', isAI: false, status: 'Pronto', features: ['Churrasqueira'] },
    { id: 4, brand: 'Apartamento', model: 'Apto Studio Moderno', year: 1, km: 1, price: 420000, fipe: 430000, img: 'assets/imoveis/real_kitchen_tile_1779906841637.png', fipe_code: '0', isAI: false, status: 'Pronto', features: ['Academia'] },
    { id: 5, brand: 'Apartamento', model: 'Apto Reformado Pinheiros', year: 2, km: 1, price: 920000, fipe: 940000, img: 'assets/imoveis/real_apartment_sp_1779906813709.png', fipe_code: '0', isAI: false, status: 'Pronto', features: ['Varanda Gourmet', 'Academia'] },
    { id: 6, brand: 'Casa', model: 'Mansão Alphaville', year: 5, km: 4, price: 3200000, fipe: 3350000, img: 'assets/imoveis/real_condo_house_1779906858070.png', fipe_code: '0', isAI: false, status: 'Na Planta', features: ['Piscina', 'Churrasqueira', 'Academia'] },
    { id: 7, brand: 'Terreno', model: 'Loteamento Litoral', year: 0, km: 0, price: 180000, fipe: 185000, img: 'assets/imoveis/real_house_street_1779906828695.png', fipe_code: '0', isAI: false, status: 'Pronto', features: [] },
    { id: 8, brand: 'Comercial', model: 'Sala Comercial Centro', year: 0, km: 1, price: 350000, fipe: 360000, img: 'assets/imoveis/real_kitchen_tile_1779906841637.png', fipe_code: '0', isAI: false, status: 'Pronto', features: [] },
    { id: 9, brand: 'Apartamento', model: 'Cobertura Duplex', year: 4, km: 3, price: 2100000, fipe: 2150000, img: 'assets/imoveis/real_apartment_sp_1779906813709.png', fipe_code: '0', isAI: false, status: 'Pronto', features: ['Piscina', 'Varanda Gourmet', 'Churrasqueira'] },
    { id: 10, brand: 'Casa', model: 'Casa Geminada', year: 2, km: 1, price: 450000, fipe: 465000, img: 'assets/imoveis/real_house_street_1779906828695.png', fipe_code: '0', isAI: false, status: 'Na Planta', features: [] },
    { id: 11, brand: 'Apartamento', model: 'Apto 3 Suites Vila Nova', year: 3, km: 2, price: 1800000, fipe: 1850000, img: 'assets/imoveis/real_kitchen_tile_1779906841637.png', fipe_code: '0', isAI: false, status: 'Pronto', features: ['Piscina', 'Academia', 'Varanda Gourmet'] },
    { id: 12, brand: 'Casa', model: 'Casa de Campo Interior', year: 4, km: 4, price: 950000, fipe: 980000, img: 'assets/imoveis/real_condo_house_1779906858070.png', fipe_code: '0', isAI: false, status: 'Pronto', features: ['Piscina', 'Churrasqueira'] },
    { id: 13, brand: 'Apartamento', model: 'Apto 1 Quarto Centro', year: 1, km: 0, price: 280000, fipe: 290000, img: 'assets/imoveis/real_apartment_sp_1779906813709.png', fipe_code: '0', isAI: false, status: 'Pronto', features: [] },
    { id: 14, brand: 'Apartamento', model: 'Apto Vista Mar', year: 2, km: 1, price: 750000, fipe: 780000, img: 'assets/imoveis/real_kitchen_tile_1779906841637.png', fipe_code: '0', isAI: false, status: 'Pronto', features: ['Varanda Gourmet'] },
    { id: 15, brand: 'Casa', model: 'Sobrado Novo Alto Padrão', year: 3, km: 2, price: 1250000, fipe: 1300000, img: 'assets/imoveis/real_house_street_1779906828695.png', fipe_code: '0', isAI: false, status: 'Na Planta', features: ['Churrasqueira'] },
    { id: 16, brand: 'Terreno', model: 'Lote Comercial', year: 0, km: 0, price: 550000, fipe: 560000, img: 'assets/imoveis/real_condo_house_1779906858070.png', fipe_code: '0', isAI: false, status: 'Pronto', features: [] },
    { id: 17, brand: 'Apartamento', model: 'Loft Alto Padrão', year: 1, km: 2, price: 680000, fipe: 690000, img: 'assets/imoveis/real_apartment_sp_1779906813709.png', fipe_code: '0', isAI: false, status: 'Pronto', features: ['Academia', 'Piscina'] },
    { id: 18, brand: 'Casa', model: 'Casa Térrea Bairro Planejado', year: 3, km: 2, price: 780000, fipe: 800000, img: 'assets/imoveis/real_house_street_1779906828695.png', fipe_code: '0', isAI: false, status: 'Na Planta', features: ['Churrasqueira'] },
    { id: 19, brand: 'Apartamento', model: 'Apto Garden', year: 2, km: 2, price: 890000, fipe: 920000, img: 'assets/imoveis/real_kitchen_tile_1779906841637.png', fipe_code: '0', isAI: false, status: 'Pronto', features: ['Churrasqueira', 'Piscina'] },
    { id: 20, brand: 'Comercial', model: 'Andar Corporativo', year: 0, km: 5, price: 1500000, fipe: 1550000, img: 'assets/imoveis/real_condo_house_1779906858070.png', fipe_code: '0', isAI: false, status: 'Pronto', features: [] }
];"""

# We'll use a regex to replace the old vehicles array
html = re.sub(r'const vehicles = \[\s*\{.*?\];', new_array_str, html, flags=re.DOTALL)

# Update rendering logic
html = html.replace('${car.year}', '${car.year} Quartos')
html = html.replace('${car.km.toLocaleString(\'pt-BR\')} KM', '${car.km} Vagas')
html = html.replace('Aut.', 'Na Planta') # Was 'Aut.' but now we mapped features differently.
html = html.replace('Man.', 'Pronto')
html = html.replace('${car.transmission === \'Aut\' ? \'Aut.\' : \'Man.\'}', '${car.status}')
html = html.replace('${car.fuel}', '${car.features.length > 0 ? car.features[0] : "Padrão"}')
html = html.replace('ANO', 'QUARTOS')
html = html.replace('KM', 'VAGAS')

# In the renderVehicleCard, there's a `<div class="bg-gray-100 rounded px-2 py-1">${car.year}</div>`
# And `<div class="bg-gray-100 rounded px-2 py-1">${car.km.toLocaleString('pt-BR')} KM</div>`
# We'll let the replacements above handle it.

# But wait, there are other places where `car.transmission` and `car.fuel` are used.
# Let's fix the HTML structure for the car tags inside `renderVehicleCard`.

with open(file_path, 'w', encoding='utf-8') as f:
    f.write(html)

print("Properties array injected.")
