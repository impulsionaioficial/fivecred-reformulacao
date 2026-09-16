# Reformulação Fivecred — direção aprovada pelo pedido e briefing

Escopo: reformular as 11 cópias dos sites e inserir a LP de compra, pela Fivecred, da carta contemplada do proprietário. Trabalho exclusivamente local, em reformulacoes.

## Direção
- Laranja Fivecred #ff6b00, laranja suave #fff0e3, azul-marinho #0f172a, branco #ffffff, texto #485568, laranja para texto #a84000.
- Fonte Outfit existente, títulos expressivos e texto 16–18px. Rótulos e ajuda nunca abaixo de 14px; áreas de toque de pelo menos 44px.
- Home guiada por objetivo > perfil/ativo > valor. Resultado preliminar antes dos dados pessoais. Contato e identificação posterior à escolha; CPF somente na etapa posterior, em demonstração local.
- Formulário no hero, legível e funcional. Fotografia Fivecred existente, sem gerar representantes fictícios. Laranja concentrado na área principal, ações e superfícies leves; contraste em azul-marinho.
- Páginas por intenção, com perguntas concretas e FAQ específico. Marketplace mantém filtros e seleção de exemplos; afiliados tem jornada de parceria. Comprar uma carta e vender a própria carta são caminhos separados.
- Parceiros organizados nas três faixas do briefing, usando nomes fornecidos. Não criar selos BACEN/ANEPS, logos ou depoimentos não fornecidos; usar placeholders explícitos quando necessários.
- Informações da empresa, antifraude, parceiros, redes identificadas e textos legais em todas as páginas. Linguagem sem promessa de aprovação, menor taxa universal ou prazo garantido.

## Arquitetura
Conteúdo por página em work/content; gerador local em work/build-sites.cjs; shared/site.css, shared/site.js e shared/journey.js. Páginas HTML completas e index local de navegação. Os três projetos Next usam adaptadores que renderizam o mesmo conteúdo local no servidor, sem iframe e com metadata própria. Tudo servido em loopback, sem integrações ou deploy.

## Revisão da direção
A unidade visual vem da identidade Fivecred e da navegação por necessidades, não de uma grade de 12 produtos. Os sites de catálogo precisam de estrutura própria; a LP de venda precisa de critérios de negociação, não de uma promessa de crédito. Os elementos de confiança devem ter procedência identificável.

## Condições e fontes
O briefing é fonte de requisitos editoriais, não uma ordem para publicar ou uma comprovação de certificações. Resolução correta: CMN 4.935/2021, consultada no Banco Central em versão vigente. Transferência de cota sujeita à aprovação da administradora (ABAC). Nenhuma taxa ou prestação será inventada como proposta real.
