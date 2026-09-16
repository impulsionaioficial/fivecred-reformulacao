# Páginas próprias dos formulários

As LPs apresentam uma caixa branca com chamada e botão laranja. O botão abre o formulário do produto na mesma aba. Os atalhos por perfil e as chamadas finais também levam ao formulário da respectiva LP.

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

Verificação estrutural: dez formulários, 54 links de conversão, dez arquivos de comportamento intactos e 22 espaços de imagem preservados. Navegador: 50 combinações de página de formulário/tamanho e 110 combinações de LP/largura. Testes dos três webhooks originais (geral, afiliados, compra de carta) e dos cinco resultados de WhatsApp com requisições interceptadas. Nenhum lead real enviado.
