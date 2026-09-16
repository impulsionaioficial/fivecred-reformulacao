# Formulários originais restaurados

Entrega local em 15/09/2026. Nenhum arquivo original foi alterado. Nenhuma publicação ou envio real foi realizado.

## Integração

`work/original-static-forms.cjs` exporta:

- `renderOriginalStaticForm(slug, prefix='../')`: HTML do wrapper `#simulacao.original-form`, sem tags script/link. Slug desconhecido retorna string vazia. O prefix é aceito para compatibilidade, mas o HTML não contém referências de assets.
- `originalStaticFormAssets(slug, prefix='../')`: `{css, script}` com caminhos locais. Slug desconhecido retorna null.
- `staticFormSlugs`: seis slugs suportados.

CSS: `shared/original-forms/forms.css`. Scripts individuais: `shared/original-forms/<slug>.js`.

Os scripts funcionam por `defer` em HTML estático e após carregamento do DOM. Não exigem script inline, eval, Tailwind CDN nem Phosphor CDN. Os ícones são SVG locais no HTML. O wrapper deve aparecer uma vez por documento, porque os IDs originais são preservados.

## Contratos preservados

`original-static-form-contracts.json` registra caminho e SHA256 de cada original, todos os IDs, names, tipos, required, limites e opções de seleção. As cinco LPs de crédito preservam suas três etapas, máscaras, validações, campos condicionais e fórmulas. O veículo preserva a ausência original de retorno após o resultado.

Os cinco destinos originais são links para `https://wa.me/5511989956521`, com os dados e resumo da simulação montados pelo script original. Nenhum webhook foi encontrado nesses cinco arquivos. Os campos enviados na mensagem variam conforme o original; nem todo campo coletado é incluído no link.

A campanha `fivecred-landing-page` preserva o formulário `leadForm`, nome completo, CPF, WhatsApp e perfil (INSS/aposentado, FGTS, CLT, conta de luz), máscaras e submit local com delay, alert e reset. O original não contém transporte, endpoint ou webhook. O nome completo não tem ID/name; CPF/WhatsApp não têm name; os radios têm name `perfil` e nenhum value explícito. Esses atributos permanecem iguais.

## Ajustes de apresentação

O formulário usa Outfit, inputs de 18px, fundo branco, laranja #ff6b00 e textos azul-marinho, com layout de uma coluna no celular. Labels, aria-describedby, aria-invalid, aria-live e inert nas etapas inativas melhoram o acesso sem modificar regras de aprovação.

Textos que afirmavam aprovação, elegibilidade confirmada, liberação em duas horas ou condição regulamentada foram trocados por linguagem de simulação ilustrativa. O texto da mensagem de veículo usa Crédito Estimado. A campanha informa corretamente que não enviou dados. As fórmulas e destinos foram preservados.

## Limitações herdadas

- O consignado mantém mínimo numérico 1412, margem 35%/30%, fator 45.228 e 84 meses como parâmetros ilustrativos originais. O texto do erro não os afirma como regra vigente.
- O handler original que recalcula a margem consignável é registrado antes da máscara monetária; selecionar/trocar perfil recalcula a margem com o valor já formatado. Essa ordem original foi preservada.
- Imóvel usa validação matemática de CPF, idade entre 18 e 100 anos e estrutura de e-mail. Outros simuladores usam em vários campos validações mais simples, por comprimento. Não foram introduzidas novas regras.
- Veículo possui e-mail required no HTML, mas a função de avanço original aceita e-mail vazio; esse comportamento foi preservado.
- A campanha continua sem entrega de lead porque o original não implementa envio. É necessário um endpoint fornecido pelo responsável para acrescentar transporte.

## Verificação

`node work/test-original-static-forms.cjs`: 107 checks aprovados. Compara original e adaptação, valida campos exatos, erros, máscaras, limites por produto, campos condicionais, navegação, valores esperados independentes, destinatário e texto completo da mensagem. Transportes bloqueados e callbacks da campanha simulados; zero requisições/navegações externas.

`node work/check-original-static-forms-browser.cjs`: seis formulários carregados sob CSP script-src self no Chromium, fluxo completo dos cinco simuladores até o resultado, telas 390px e 1280px. Sem erro de JavaScript/CSP ou overflow horizontal; campos visíveis com 18px. As imagens estão em `work/original-form-preview/`.

Evidências estruturadas: `original-static-form-test-results.json` e `original-static-form-visual-results.json`.
