# Fivecred — site e landing pages

A página inicial (`/`) abre a LP geral da Fivecred com o formulário original conectado. As outras soluções ficam disponíveis pelo menu e pelos links do rodapé. Não há portal de apresentação das LPs. Os espaços reservados para fotos ou designs oficiais permanecem por solicitação da Fivecred.

## Publicação na Vercel

Importe a raiz deste repositório. `vercel.json` configura o preset **Other**, sem instalação de dependências, com `node work/build-production.cjs` e saída `public-site`. O build copia apenas HTML e recursos públicos referenciados; fontes Next, testes, documentação e marketplaces ficam fora da publicação. Não é necessário subir a pasta `public-site` no Git.

O caminho antigo `/fivecred-next/index.html` redireciona para `/` na Vercel. Os arquivos dessa LP permanecem para compatibilidade e execução local.

Referência da configuração: https://vercel.com/docs/project-configuration/vercel-json

## Formulários

- **LP geral (`/`) e `fivecred-next`:** campos, etapas e webhook Make originais preservados.
- **Afiliados e compra de carta:** formulários, payloads e webhooks originais preservados.
- **Bolsa Família, consignado, luz, garantia de imóvel e garantia de veículo:** formulários e destinos originais no WhatsApp preservados. Valores simulados são estimativas.
- **Campanha (`fivecred-landing-page`) e venda da própria carta (`lp-venda-carta-contemplada`):** aguardam os webhooks específicos que a Fivecred informou que irá fornecer. Não simulam confirmação de envio. Na campanha, o formulário fica desabilitado; na venda da carta, as etapas de características continuam disponíveis, mas a continuação para os dados de contato fica indisponível.
- **Botões de WhatsApp:** nome e e-mail obrigatórios antes de abrir a conversa; incluídos na mensagem para conferência pelo visitante. Essa etapa não altera os webhooks.

Nenhum teste deve enviar leads reais. Os testes de navegador interceptam webhooks e abertura do WhatsApp.

## Telas menores

Abaixo de 1280 px, o menu fica compacto e os blocos principais passam a uma coluna. O layout amplia o espaço dos formulários, permite rolagem no menu em telas baixas e mantém a altura original da barra de navegação. O botão de WhatsApp permanece no cabeçalho e no fim da página, sem sobrepor os campos. Os links legais do rodapé têm área de toque de pelo menos 44 px.

Os ajustes compartilhados ficam em `shared/responsive.css`, carregado depois dos estilos das LPs. Os formulários e seus destinos de envio não são alterados por essa camada.

## Desenvolvimento

1. Edite conteúdo em `work/content/`, textos de formulário em `work/form-copy.cjs`, templates em `work/build-sites.cjs`, `work/seller-page.cjs` e `work/legal-pages.cjs`.
2. Execute `node work/build-sites.cjs` para atualizar as páginas e entradas Next. A geração local usa as dependências já instaladas.
3. Execute `node work/build-production.cjs` para montar a saída estática de publicação, sem dependências externas.
4. Para conferir a mesma saída publicada: `python -m http.server 4175 --bind 127.0.0.1 --directory public-site`.

As páginas usam os estilos de `shared/`. Formulários React ficam em `work/connected-form-src/`; os formulários anteriores de produtos ficam em `shared/original-forms/`. A logo oficial é `shared/assets/logo-navbar.png`.

Os três projetos Next mantêm entradas para execução local. Após mover a pasta, regenere as páginas para atualizar o caminho do adaptador local. A publicação deste repositório usa HTML estático.

## Verificações

- Layout responsivo: `node tests/responsive-layout.cjs` (110 combinações de página/largura, menus em telas baixas, ancoragem e ausência de sobreposição do WhatsApp; rode o build estático antes).
- Estrutura, links e acessibilidade básica: `node tests/verify-sites.cjs`.
- Saída de produção, raiz, versões mobile/desktop, erro e nova tentativa do webhook geral: `node tests/production-browser.cjs` (rode o build estático antes).
- Contato WhatsApp e destinos originais: `node tests/whatsapp-contact-browser.cjs`.
- Formulários estáticos e Next: `node tests/standardization-integration.cjs` (porta 4174 e builds Next preparados).

## Marketplaces

Os marketplaces de imóveis e veículos não fazem parte do site nem do Git atual. Cópias anteriores podem permanecer localmente e estão ignoradas. As LPs de crédito com garantia de imóvel e de veículo continuam ativas.
