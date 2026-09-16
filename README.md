# Fivecred — site e landing pages

A página inicial (`/`) abre a LP geral da Fivecred com uma caixa de chamada para a simulação. O formulário original conectado fica em `fivecred-next/simulacao.html`. As outras soluções ficam disponíveis pelo menu e pelos links do rodapé. Não há portal de apresentação das LPs. Os espaços reservados para fotos ou designs oficiais permanecem por solicitação da Fivecred.

## Publicação na Vercel

Importe a raiz deste repositório. `vercel.json` configura o preset **Other**, sem instalação de dependências, com `node work/build-production.cjs` e saída `public-site`. O build copia apenas HTML e recursos públicos referenciados; fontes Next, testes, documentação e marketplaces ficam fora da publicação. Não é necessário subir a pasta `public-site` no Git.

O caminho antigo `/fivecred-next/index.html` redireciona para `/` na Vercel. Os arquivos dessa LP permanecem para compatibilidade e execução local.

Referência da configuração: https://vercel.com/docs/project-configuration/vercel-json

## Formulários

Cada LP leva a uma página própria em `<pasta-da-lp>/simulacao.html`. A abertura usa uma caixa com chamada e botão **Simule aqui**; venda de carta e afiliados usam chamadas específicas. Os campos, etapas e scripts de envio foram movidos sem alterações. A página de formulário tem navegação de retorno e não apresenta botão flutuante. O cadastro de nome e e-mail para WhatsApp permanece no diálogo de contato. Veja o [mapa dos formulários](docs/paginas-de-simulacao.md).

- **LP geral (`/`) e `fivecred-next`:** campos, etapas e webhook Make originais preservados.
- **CLT e FGTS:** LPs locais em `clt-fivecred/` e `fgts-fivecred/`, com formulários próprios em `simulacao.html`. Os nove módulos originais do site principal foram preservados, incluindo validações, cálculo, payload e webhook. Os cartões e o rodapé abrem essas páginas dentro desta versão.
- **Afiliados e compra de carta:** formulários, payloads e webhooks originais preservados.
- **Bolsa Família, consignado, luz, garantia de imóvel e garantia de veículo:** formulários e destinos originais no WhatsApp preservados. Valores simulados são estimativas.
- **Campanha (`fivecred-landing-page`) e venda da própria carta (`lp-venda-carta-contemplada`):** aguardam os webhooks específicos que a Fivecred informou que irá fornecer. Não simulam confirmação de envio. Na campanha, o formulário fica desabilitado; na venda da carta, as etapas de características continuam disponíveis, mas a continuação para os dados de contato fica indisponível.
- **Botões de WhatsApp:** nome e e-mail obrigatórios antes de abrir a conversa; incluídos na mensagem para conferência pelo visitante. Essa etapa não altera os webhooks.

Nenhum teste deve enviar leads reais. Os testes de navegador interceptam webhooks e abertura do WhatsApp.

## Telas menores

Abaixo de 1280 px, o menu fica compacto e os blocos principais passam a uma coluna. O layout amplia o espaço dos formulários, permite rolagem no menu em telas baixas e mantém a altura original da barra de navegação. O botão de WhatsApp permanece no cabeçalho e no fim da página, sem sobrepor os campos. Os links legais do rodapé têm área de toque de pelo menos 44 px.

A seção de confiança considera também a altura: em telas de computador de 1280 × 600, título, imagem, botão e três orientações cabem abaixo da navegação. Nas telas compactas, a introdução, os tópicos e a imagem são blocos separados. As orientações usam tópicos nativos que abrem ao toque ou pelo teclado, um por vez; ao abrir, o grupo é trazido para a área visível. A imagem oficial continua com espaço reservado. O aviso contra fraudes permanece logo após a seção.

Os ajustes compartilhados ficam em `shared/responsive.css`, carregado depois dos estilos das LPs. `shared/content-panels.js` controla somente os tópicos de conteúdo. Os formulários e seus destinos de envio não são alterados.

## Design e imagens

As doze LPs usam a mesma identidade Fivecred: abertura em bege, conteúdo e orientação de imagem específicos por produto, seção de confiança em azul-marinho e chamada final laranja. A logo e a altura da navegação foram preservadas. Benefícios, etapas e orientações usam tópicos que abrem ao toque nas telas compactas.

Os espaços de imagem estão identificados nas próprias páginas. O [mapa de imagens](docs/mapa-de-imagens.md) informa o material esperado, o nome do arquivo e a pasta `shared/assets/lps/`. Há doze imagens de contexto e uma imagem de equipe compartilhada. Os slots são substituídos pelas imagens durante a geração do HTML, quando o arquivo indicado estiver disponível. Não foram incluídos depoimentos ou indicadores sem comprovação.

O conteúdo está em `work/content/visual-direction.json`, a renderização dos blocos em `work/visual-direction.cjs` e a camada visual em `shared/brand-refresh.css`. A saída Vercel permanece estática e os formulários não foram alterados. A [direção visual](docs/direcao-visual-2026-09-16.md) registra os critérios aplicados.

## Desenvolvimento

1. Edite conteúdo em `work/content/`, textos de formulário em `work/form-copy.cjs`, chamadas e links em `work/simulation-pages.cjs`, templates em `work/build-sites.cjs`, `work/seller-page.cjs` e `work/legal-pages.cjs`.
2. Execute `node work/build-sites.cjs` para atualizar as páginas e entradas Next. A geração local usa as dependências já instaladas.
3. Execute `node work/build-production.cjs` para montar a saída estática de publicação, sem dependências externas.
4. Para conferir a mesma saída publicada: `python -m http.server 4175 --bind 127.0.0.1 --directory public-site`.

As páginas usam os estilos de `shared/`. Formulários React ficam em `work/connected-form-src/`; os formulários anteriores de produtos ficam em `shared/original-forms/`. A logo oficial é `shared/assets/logo-navbar.png`.

Para recompilar os formulários migrados de CLT e FGTS, execute `node work/migrated-form-src/build.cjs` antes de regenerar o site. O componente original e suas dependências ficam em `work/migrated-form-src/`; os estilos são isolados para não afetar as outras páginas. A publicação da Vercel usa os bundles já gerados, sem executar essa compilação.

Os três projetos Next mantêm entradas para execução local. Após mover a pasta, regenere as páginas para atualizar o caminho do adaptador local. A publicação deste repositório usa HTML estático.

## Verificações

- Migração CLT/FGTS, nove módulos originais, etapas, validações, falha/reenvio e destinos preservados: `node tests/migrated-products.cjs`.

- Formulários separados, rotas e preservação exata de campos/scripts: `node tests/simulation-pages.cjs`.
- Navegação, retorno, teclado e formulários em 60 combinações de tela: `node tests/simulation-pages-browser.cjs`.

- Preservação de formulários e espaços de imagem: `node tests/design-refresh.cjs`.
- Composição, contraste e tópicos no navegador: `node tests/brand-refresh-browser.cjs` (44 combinações e inserção de imagem simulada apenas durante o teste).
- Altura disponível e tópicos: `node tests/viewport-height.cjs` (88 combinações, seção completa no computador, tópicos por toque/teclado no celular, sem cortes ou rolagem interna).
- Layout responsivo: `node tests/responsive-layout.cjs` (110 combinações de página/largura, menus em telas baixas, acesso à simulação e ausência de sobreposição do WhatsApp; rode o build estático antes).
- Estrutura, links e acessibilidade básica: `node tests/verify-sites.cjs`.
- Saída de produção, raiz, versões mobile/desktop, erro e nova tentativa do webhook geral: `node tests/production-browser.cjs` (rode o build estático antes).
- Contato WhatsApp e destinos originais: `node tests/whatsapp-contact-browser.cjs`.
- Formulários estáticos e Next: `node tests/standardization-integration.cjs` (porta 4174 e builds Next preparados).

## Marketplaces

Os marketplaces de imóveis e veículos não fazem parte do site nem do Git atual. Cópias anteriores podem permanecer localmente e estão ignoradas. As LPs de crédito com garantia de imóvel e de veículo continuam ativas.
