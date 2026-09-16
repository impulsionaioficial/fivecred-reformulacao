# Formulários originais dos marketplaces

Implementação local isolada: `work/catalog-original-form.cjs`, `shared/catalog-original-form.js` e `shared/catalog-original-form.css`.

## Integração

```js
const { renderCatalogOriginalForm } = require('./catalog-original-form.cjs');
renderCatalogOriginalForm(page, '../');
```

Carregar os dois assets `shared/catalog-original-form.css` e `shared/catalog-original-form.js` nas páginas de marketplace. Liberar `https://api.fivecred.online` e `https://parallelum.com.br` em `connect-src` da CSP.

Para selecionar um card:

```js
window.FivecredCatalogForm.select({id: 'imovel-1', title: 'Título do card', price: 850000});
window.dispatchEvent(new CustomEvent('fivecred:catalog-select', {detail: {id: 'veiculo-1', title: 'Título', price: 68490}}));
```

`select` retorna `Promise<boolean>`. IDs originais numéricos, `imovel-N` e `veiculo-N` localizam o registro original; `title`/`name`/`nome` e `price`/`preco` permitem uma seleção adicional com preço. IDs devem acompanhar os cards para preservar a identidade original. O formulário abre na etapa dos dados se ainda estiver incompleta, ou na escolha quando já estiver válida. A seleção é ignorada enquanto um envio estiver em andamento.

## Contrato preservado

Os dois originais usam `POST https://api.fivecred.online/leads`, `Content-Type: application/json`, com exatamente estas chaves:

```text
name, phone, cpf, email, birthdate, state, vehicle, price, entrada, prazo, prestacao
```

- Nome completo, WhatsApp, e-mail, CPF, nascimento e UF, com máscaras brasileiras.
- CPF com dígitos verificadores, nome mínimo de quatro caracteres, e-mail e telefone com DDD. Nascimento agora exige uma data existente e não futura.
- UFs originais: SP, RJ, MG, PR, SC e RS. Padrão SP.
- Inventário integral extraído dos arquivos originais em build: 76 veículos e 20 imóveis. Os arquivos de origem não são alterados.
- Chave `vehicle` mantida inclusive para imóveis, usando `brand + " " + model` do original. A repetição da marca em alguns registros originais é preservada no payload.
- Entrada entre 20% e 80% da referência FIPE/valor de referência presente no arquivo, em passos de R$ 1.000, iniciando em 20% (com limite superior menor que o preço).
- Prazos 24, 36, 48 e 60 meses; padrão 48. Taxas ilustrativas mensais originais: 1,29%, 1,35%, 1,39% e 1,45%. Fórmula Price e arredondamento da prestação ao real mais próximo preservados.
- Preço efetivo do item, e não sua referência FIPE, compõe `price` e o valor financiado, como no original.
- WhatsApp `5511981655768`, com dados e parâmetros da simulação no texto, aberto somente por ação explícita do visitante.
- FIPE de veículo conhecido por código/ano com fallback para a referência do arquivo; custom por marca/modelo/ano via API pública Parallelum já existente como fallback no original.

## Correções deliberadas

- A estimativa não fabrica score de CPF, aprovação, limite ou proposta financeira.
- Calcular a estimativa não envia dados. O visitante confirma pelo botão final `Enviar simulação`.
- Falha HTTP ou de rede é visível; preserva os campos na página e permite nova tentativa explícita.
- Cliques concorrentes e repetição do mesmo payload concluído não geram outro POST durante a sessão.
- Não há localStorage, persistência de leads, logs de dados pessoais ou simulação de campanha SMS.
- A integração FIPE utiliza o endpoint público; não republica o token hardcoded exposto no arquivo original.
- O original de imóveis continha seletores e chamadas FIPE de carros. Esse caminho não representa uma busca de outro imóvel: foi omitido, sem inventar novos campos ou um contrato imobiliário. Seus 20 imóveis, valores, prazos e schema original continuam preservados.

## Verificação

Executar `node tests/catalog-original-form-contract.cjs` a partir de qualquer diretório. Testes Chrome/Playwright interceptam todos os endpoints externos; nenhum lead real é enviado.

Cobertura: inventário completo, campos e máscaras, CPF e datas inválidos, valores de referência e cálculo original, envio somente por confirmação, schema e tipos, tratamento de HTTP 503 e retry, proteção contra duplicação, WhatsApp original, seleção externa, consulta FIPE custom, ausência de persistência e overflow, labels com pelo menos 16 px em viewport de 320 px. Screenshots de formulário vazio em `tests/artifacts/catalog-original/`.

O endpoint foi encontrado nos originais com o comentário `mock API endpoint`. A disponibilidade e aceitação do backend real não foram verificadas; os testes validam o contrato do cliente com respostas interceptadas.
