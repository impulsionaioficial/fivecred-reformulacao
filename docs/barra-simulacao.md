# Seleção do valor nas chamadas de simulação

A caixa "Simule aqui" das dez LPs de crédito/compra de carta permite escolher um valor de interesse com uma barra nativa, teclado e botões de aumentar/diminuir. Os valores são formatados em reais. As páginas de afiliados e de venda da própria carta mantêm suas chamadas específicas.

As faixas e os valores iniciais ficam em `work/simulation-pages.cjs`, no mapa `amountOptions`. São escalas para a seleção inicial, não ofertas ou limites aprovados. O FGTS usa uma faixa conservadora de R$ 100 a R$ 1.500; referência consultada em 16/09/2026: [regras oficiais do FGTS](https://www.fgts.gov.br/Paginas/trabalhador/saque/saque-aniversario.aspx). Não são calculadas taxas, parcelas ou disponibilidade nesta barra.

O parâmetro `valor_simulacao` mantém a seleção ao abrir o formulário e voltar à LP. O valor aparece como referência acima do questionário, com link para alterá-lo. Não substitui renda, benefício, saldo FGTS ou valor de garantia; não preenche campos desses tipos. Os campos, cálculos, validações, contratos de payload e webhooks originais permanecem intactos. Na LP geral, o usuário continua confirmando a faixa desejada na etapa original do formulário.

Valores inválidos, repetidos, fracionários ou fora da escala são ignorados. Sem JavaScript, a barra fica oculta e o link original para o formulário continua disponível. Não há armazenamento adicional de dados nem novas requisições externas.

Verificações: `node tests/simulation-amount.cjs`, `node tests/simulation-pages.cjs`, `node tests/simulation-pages-browser.cjs` e `node tests/migrated-products.cjs`. A validação nova cobre dez produtos em quatro larguras, controles de toque e teclado, navegação de ida e volta, parâmetros inválidos e fallback sem JavaScript.
