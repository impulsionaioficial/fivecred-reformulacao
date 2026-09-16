# Páginas próprias dos formulários

As LPs apresentam uma caixa branca com chamada e botão laranja. O botão abre o formulário do produto na mesma aba. As chamadas finais também levam ao formulário da respectiva LP. Os cartões da seção “Comece pelo que você tem” abrem a LP do produto escolhido.

| LP | Formulário |
| --- | --- |
| `fivecred-next` | `fivecred-next/simulacao.html` |
| `bolsa-fivecred` | `bolsa-fivecred/simulacao.html` |
| `consignado-fivecred` | `consignado-fivecred/simulacao.html` |
| `luz-fivecred` | `luz-fivecred/simulacao.html` |
| `imovel-fivecred` | `imovel-fivecred/simulacao.html` |
| `veiculo-fivecred` | `veiculo-fivecred/simulacao.html` |
| `fivecred-landing-page` | `fivecred-landing-page/simulacao.html` |
| `contemplada.fivecred.com.br` | `contemplada.fivecred.com.br/simulacao.html` |
| `fivecred-afiliados` | `fivecred-afiliados/simulacao.html` |
| `lp-venda-carta-contemplada` | `lp-venda-carta-contemplada/simulacao.html` |

A raiz `/` e a LP geral compartilham `fivecred-next/simulacao.html`. Os redirecionamentos antigos da LP geral não afetam a nova página.

## Preservação

- Campos, IDs, etapas, validações, destinatários, payloads e webhooks mantidos. Os testes comparam os formulários e dez arquivos de comportamento com os hashes anteriores.
- A compra de carta tinha duas cópias do mesmo fluxo. A página própria usa o formulário principal, conservando sua identificação original no payload.
- Campanha de crédito e venda da carta continuam aguardando webhooks específicos. Nenhum destino foi inventado e nenhuma confirmação de envio é simulada.
- Os botões externos de WhatsApp continuam pedindo nome e e-mail. Não há botão de WhatsApp no formulário da venda da carta.
- Página própria com logo, link de retorno, formulário e links de privacidade. A navegação principal das LPs e todos os links do rodapé permanecem.

## Edição

Chamadas e destinos: `work/simulation-pages.cjs`. Composição: `work/build-sites.cjs`. Estilos: `shared/simulation-pages.css`. As páginas publicadas são HTML estático; não dependem de uma aplicação Node em produção.

Rode `node work/build-sites.cjs` para regenerar os documentos e `node work/build-production.cjs` para preparar a publicação. O build público inclui explicitamente as dez páginas de formulário.

## Validação desta alteração

Verificação estrutural: dez formulários, links de conversão, dez arquivos de comportamento intactos e 22 espaços de imagem preservados. Navegador: 50 combinações de página de formulário/tamanho e 110 combinações de LP/largura. Testes dos três webhooks originais (geral, afiliados, compra de carta) e dos cinco resultados de WhatsApp com requisições interceptadas. Nenhum lead real enviado.

## Navegação por produto

A seção de perfis da página inicial, da LP geral e da campanha usa links para cada produto. Aposentadoria/benefício abre `consignado-fivecred/index.html`; conta de luz abre `luz-fivecred/index.html`; Bolsa Família abre `bolsa-fivecred/index.html`. O cartão de garantia oferece escolhas independentes para `veiculo-fivecred/index.html` e `imovel-fivecred/index.html`.

As páginas CLT e FGTS já existem no site principal e não fazem parte das dez LPs desta pasta. Os cartões usam seus endereços oficiais publicados, na mesma aba: `https://www.fivecred.com.br/emprestimo-consignado-clt` e `https://www.fivecred.com.br/emprestimo-fgts`. As páginas originais e seus formulários não são alterados por esses links.
