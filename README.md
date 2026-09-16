# Fivecred — sites reformulados

As 10 páginas usam a identidade aprovada: logo oficial maior, navbar na mesma altura, seções brancas e beges, laranja nas ações e texto azul-marinho. Sem banner no topo. Os 11 projetos originais permanecem intactos na pasta superior; a LP de venda da própria carta mantém o fluxo local aprovado.

## Abrir as versões locais

Nesta pasta, execute `python -m http.server 4174 --bind 127.0.0.1 --directory .` e abra http://127.0.0.1:4174/. O índice reúne as 10 páginas. Não houve deploy.

## Formulários e destinos preservados

| Páginas | Formulário e envio |
|---|---|
| fivecred-next | Três etapas originais: dados pessoais, perfil e solicitação. POST JSON para o webhook Make original. |
| fivecred-afiliados | Cadastro original completo de parceiros e webhook Make original. |
| contemplada.fivecred.com.br | Formulários de compra de carta no topo e no CTA, mantendo campos, webhook, source de cada posição e WhatsApp original. |
| bolsa / consignado / luz / imovel / veiculo-fivecred | Campos, três etapas, máscaras, opções e cálculos originais. Os cinco arquivos anteriores enviavam pelo WhatsApp; não continham webhook. |
| fivecred-landing-page | Nome, CPF, WhatsApp e perfil. O original apenas exibia alerta local e limpava os campos; continua sem integração de envio. |
| lp-venda-carta-contemplada | Fluxo aprovado para vender a própria carta à Fivecred. Continua demonstrativo, com continuação pelo formulário e sem WhatsApp dentro dele. |

A hospedagem é local, mas confirmar um formulário conectado pode transmitir dados aos destinos originais. Todos os botões e links de WhatsApp passam por uma janela que exige nome e e-mail. Esses dados são incluídos na mensagem antes de abrir o WhatsApp; não são enviados a um webhook separado. Os botões gerais usam o contato do briefing, enquanto os botões dos formulários preservam os destinatários e o resumo originais. Campos já preenchidos no formulário são aproveitados. O visitante confirma o envio da mensagem dentro do WhatsApp.

Não há armazenamento de leads no navegador. Estados de erro de envio são visíveis e permitem tentar novamente; o clique repetido durante uma requisição não duplica o POST. Na home, o redirecionamento para o número fictício 5500000000000 não foi reativado. Foi corrigida uma máscara de nascimento que impedia o preenchimento do ano completo.

As estimativas preservam fórmulas de referência antigas, sem fabricar score ou aprovação. Os testes interceptam as requisições e não criam leads nem enviam mensagens.

## Edição e geração

- Conteúdo: work/content/credit-pages.json e special-pages.json; home e templates em work/build-sites.cjs. work/form-copy.cjs ajusta a descrição dos passos aos formulários originais restaurados.
- Visual comum: shared/site.css e shared/lp-design.css. Logo fornecida: shared/assets/logo-navbar.png.
- Formulários estáticos: work/build-original-static-forms.cjs e shared/original-forms/.
- Formulários React: work/connected-form-src/; gerar assets com `node work/connected-form-src/build.cjs`.
- Contato antes do WhatsApp: shared/whatsapp-contact.js/.css e markup comum em work/build-sites.cjs. Validação, fechamento com Escape, foco de volta ao botão, captura dos links dinâmicos e mensagens com contexto.
- Integração de assets: work/form-assets.cjs. Nova LP vendedora: work/seller-page.cjs, shared/seller.css e shared/journey.js.

Após editar conteúdo/templates ou gerar os formulários, execute `node work/build-sites.cjs`. Isso atualiza HTML, aliases, páginas auxiliares e entradas dos três projetos Next. Mudanças somente em CSS/JS compartilhado não precisam regenerar HTML.

## Next.js

fivecred-next, fivecred-afiliados e contemplada.fivecred.com.br preservam execução Next nativa. Os três usam as dependências já instaladas por junção local para fivecred.com.br-main/node_modules. O adaptador serve recursos compartilhados, sem iframe, e impede acesso a arquivos privados. Regenere o projeto depois de mover esta pasta, pois o adaptador registra seu caminho absoluto. Nenhuma dependência ou serviço de hospedagem foi instalado nesta etapa.

## Verificação e contratos

- Estrutura e navegação: `node tests/verify-sites.cjs`.
- Cinco produtos e campanha: `node work/test-original-static-forms.cjs` e `node work/check-original-static-forms-browser.cjs`.
- Home, parceiros e compra de carta: `node work/connected-form-src/verify.cjs`.
- Layout conjunto: `node tests/standardization-browser.cjs`.
- Etapa de contato WhatsApp: `node tests/whatsapp-contact.test.cjs` e `node tests/whatsapp-contact-browser.cjs`.
- Integração nas páginas completas e Next: `node tests/standardization-integration.cjs` (requer a prévia na porta 4174 e builds Next prontos).
- LP vendedora: `node tests/journey.test.cjs`.



## Rodapé completo e retirada dos marketplaces — 16/09/2026

Todos os rodapés dão acesso às dez LPs: home, campanha, Bolsa Família, consignado INSS, conta de luz, garantia de imóvel, garantia de veículo, compra de carta, venda da própria carta e afiliados. Os dois marketplaces foram retirados do índice, dos links, dos dados do gerador e das rotas locais Next. Suas pastas foram excluídas do controle de versão e da publicação, permanecendo como cópias locais. As páginas de garantia de imóvel e de veículo continuam ativas. Os formulários e webhooks das LPs restantes não foram alterados.
