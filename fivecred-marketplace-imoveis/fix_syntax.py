import re

file_path = "index.html"

with open(file_path, 'r', encoding='utf-8', errors='ignore') as f:
    lines = f.readlines()

for i in range(len(lines)):
    # Fix the messed up line 1080 (footer text)
    if 'CNPJ sob' in lines[i]:
        lines[i] = '                    <strong>FIVECRED SOLUÇÕES FINANCEIRAS LTDA</strong>, inscrita no CNPJ sob o nº 50.267.345/0001-84, com sede na Av. Brigadeiro Faria Lima, 1485, Pinheiros, São Paulo - SP, CEP 01452-002, é uma plataforma digital que atua como correspondente bancário de diversas instituições financeiras nos termos da Resolução nº 4.935, de 3 de dezembro de 2021, do Banco Central do Brasil.\n'
        continue

    if 'So Paulo, SP' in lines[i] or 'São Paulo, SP' in lines[i] or 'So Paulo (SP)' in lines[i]:
        # Keep it as São Paulo for valid location texts
        if 'ph-map-pin' in lines[i] or 'Localiza' in lines[i] or 'value="SP"' in lines[i]:
            lines[i] = lines[i].replace('So Paulo, SP', 'São Paulo, SP').replace('So Paulo (SP)', 'São Paulo (SP)')
        else:
            lines[i] = lines[i].replace('So Paulo, SP', ' - ').replace('São Paulo, SP', ' - ')

with open(file_path, 'w', encoding='utf-8') as f:
    f.writelines(lines)

print("Text replaced successfully!")
