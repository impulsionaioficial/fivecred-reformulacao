import json
import re

file_path = "index.html"

with open(file_path, 'r', encoding='utf-8') as f:
    html = f.read()

# 1. Hero and Badges
replacements = {
    "Seu próximo carro": "A chave do seu próximo imóvel",
    "consulte a tabela FIPE oficial e simule seu financiamento com taxas a partir de 1,29% a.m.": "consulte a avaliação de mercado e simule seu financiamento imobiliário com taxas a partir de 0,89% a.m.",
    "Buscar marca, modelo (ex: Onix, BYD, Corolla)...": "Buscar bairro, cidade ou tipo (ex: Apartamento, Moema)...",
    "Laudo Cautelar Aprovado": "Documentação Regularizada",
    "Todos os carros com vistoria completa aprovada. Sem surpresas.": "Todos os imóveis com matrícula e documentação 100% regularizadas. Sem surpresas.",
    "Consulta FIPE Real": "Avaliação de Mercado",
    "Compare os preços diretamente com a tabela FIPE de referência.": "Compare os valores com avaliações reais de mercado da sua região.",
    "FINAL PLACA": "RENDA MENSAL (R$)",
    'id="final-placa"': 'id="renda-mensal"',
    'name="final-placa"': 'name="renda-mensal"',
    'placeholder="EX: 8A43"': 'placeholder="R$ 0,00"',
    "Simulação rápida e consulta live da tabela FIPE para você descobrir o crédito ideal para o seu perfil, sem burocracia.": "Simulação rápida para você descobrir as melhores condições de financiamento imobiliário, sem burocracia.",
    "Todos os Veículos": "Todos os Imóveis",
    "Convencionais": "Apartamentos",
    "Utilitários / SUVs": "Casas",
    "Superesportivos / Hyper": "Alto Padrão",
    "Elétricos": "Lançamentos",
    "76 veículos encontrados": "20 imóveis encontrados",
    "Exibindo <span id=\"visible-count\" class=\"font-bold text-fivecred-orange\">76</span> de <span id=\"total-count\">76</span> veículos encontrados": "Exibindo <span id=\"visible-count\" class=\"font-bold text-fivecred-orange\">20</span> de <span id=\"total-count\">20</span> imóveis encontrados",
}

for old, new in replacements.items():
    html = html.replace(old, new)

# 2. Filters Sidebar
html = html.replace('Marca</label>', 'Tipo de Imóvel</label>')
html = html.replace('id="filter-brand"', 'id="filter-type"')
html = html.replace('Todas as Marcas', 'Todos os Tipos')
html = html.replace('<option value="CHEVROLET">Chevrolet</option>', '<option value="Apartamento">Apartamento</option>')
html = html.replace('<option value="VOLKSWAGEN">Volkswagen</option>', '<option value="Casa">Casa</option>')
html = html.replace('<option value="FIAT">Fiat</option>', '<option value="Terreno">Terreno</option>')
html = html.replace('<option value="TOYOTA">Toyota</option>', '<option value="Comercial">Comercial</option>')
html = html.replace('<option value="HYUNDAI">Hyundai</option>', '')
html = html.replace('<option value="RENAULT">Renault</option>', '')
html = html.replace('<option value="HONDA">Honda</option>', '')
html = html.replace('<option value="NISSAN">Nissan</option>', '')
html = html.replace('<option value="FORD">Ford</option>', '')
html = html.replace('<option value="BYD">BYD</option>', '')

html = html.replace('Ano Mínimo</label>', 'Quartos Mínimos</label>')
html = html.replace('id="filter-year"', 'id="filter-bedrooms"')
html = html.replace('Qualquer Ano', 'Qualquer Quantidade')
html = html.replace('<option value="2024">2024 ou mais novo</option>', '<option value="1">1+ Quarto</option>')
html = html.replace('<option value="2022">2022 ou mais novo</option>', '<option value="2">2+ Quartos</option>')
html = html.replace('<option value="2020">2020 ou mais novo</option>', '<option value="3">3+ Quartos</option>')
html = html.replace('<option value="2018">2018 ou mais novo</option>', '<option value="4">4+ Quartos</option>')
html = html.replace('<option value="2015">2015 ou mais novo</option>', '')

html = html.replace('Quilometragem Máxima</label>', 'Vagas na Garagem</label>')
html = html.replace('id="filter-km"', 'id="filter-parking"')
html = html.replace('Qualquer KM', 'Qualquer')
html = html.replace('<option value="0">0 km (Zero)</option>', '<option value="1">1+ Vaga</option>')
html = html.replace('<option value="30000">Até 30.000 km</option>', '<option value="2">2+ Vagas</option>')
html = html.replace('<option value="60000">Até 60.000 km</option>', '<option value="3">3+ Vagas</option>')
html = html.replace('<option value="100000">Até 100.000 km</option>', '<option value="4">4+ Vagas</option>')

html = html.replace('Câmbio</label>', 'Estágio da Obra</label>')
html = html.replace('id="btn-auto"', 'id="btn-pronto"')
html = html.replace('Automático', 'Pronto')
html = html.replace('id="btn-manual"', 'id="btn-planta"')
html = html.replace('Manual', 'Na Planta')

html = html.replace('Combustível</label>', 'Características</label>')
html = re.sub(r'id="chk-flex"', 'id="chk-piscina"', html)
html = re.sub(r'Flex</span>', 'Piscina</span>', html)
html = re.sub(r'id="chk-gasolina"', 'id="chk-academia"', html)
html = re.sub(r'Gasolina</span>', 'Academia</span>', html)
html = re.sub(r'id="chk-diesel"', 'id="chk-varanda"', html)
html = re.sub(r'Diesel</span>', 'Varanda Gourmet</span>', html)
html = re.sub(r'id="chk-eletrico"', 'id="chk-churrasqueira"', html)
html = re.sub(r'Elétrico</span>', 'Churrasqueira</span>', html)

# 3. Form masks - disable placa mask
html = html.replace("IMask(document.getElementById('final-placa'), { mask: '****' });", "IMask(document.getElementById('renda-mensal'), { mask: Number, scale: 2, signed: false, thousandsSeparator: '.', padFractionalZeros: true, normalizeZeros: true, radix: ',' });")

with open(file_path, 'w', encoding='utf-8') as f:
    f.write(html)

print("HTML texts and forms replaced successfully.")
