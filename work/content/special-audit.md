# Auditoria editorial — páginas especializadas Fivecred

Data: 14 de setembro de 2026. Escopo exclusivamente local.

## Entrega e contrato

Arquivo de conteúdo: `work/content/special-pages.json`, array com quatro páginas. Cada página tem três benefícios, três etapas e ao menos sete perguntas frequentes. Os dois marketplaces têm nove exemplos cada. Os preços são números em reais, `details` é texto, `heroAsset` é `null` e `aliases` é um array vazio.

Apenas `work/content/special-pages.json` e este relatório foram escritos nesta subtarefa. Não foram alterados HTML, CSS, JavaScript, Next.js ou arquivos de origem. Nenhum site foi publicado e nenhuma mensagem, formulário ou webhook foi enviado.

## Fontes e critério de leitura

- [Briefing extraído](C:/Users/auror/Downloads/fivecred-sites/reformulacoes/work/briefing-extraido.txt).
- [Direção de reformulação](C:/Users/auror/Downloads/fivecred-sites/reformulacoes/docs/superpowers/specs/2026-09-14-reformulacao-design.md).
- HTML dos dois marketplaces e componentes das páginas de carta contemplada e afiliados dentro de `reformulacoes`.
- As referências de catálogo abaixo apontam às cópias originais preservadas fora de `reformulacoes`, para continuarem rastreáveis após a geração das novas páginas. Foi verificada a igualdade de SHA-256 entre origem e cópia para os dois `index.html`, o rodapé de cartas e o `HowItWorks.tsx` de afiliados antes da elaboração.

A auditoria comprova que um dado existe no material local; não comprova oferta atual, estoque, vistoria, autoria de fotografia, certificação ou vínculo comercial. Não houve consulta a anúncios externos ou atualização de preços.

## Decisões por página

| Pasta | Intenção | Jornada editorial |
| --- | --- | --- |
| `fivecred-marketplace-imoveis` | Procurar imóvel | Filtrar tipo e valor, selecionar um exemplo e consultar disponibilidade/documentação/forma de compra. |
| `fivecred-marketplace-veiculos` | Procurar veículo | Filtrar tipo e valor, comparar os dados do exemplo e conversar sobre a compra. |
| `contemplada.fivecred.com.br` | Cliente compra uma carta contemplada | Informar o bem e o crédito pretendidos, conhecer valores e obrigações, entender a transferência. |
| `fivecred-afiliados` | Conhecer uma parceria para indicar clientes | Informar atuação/canais, consultar regras do programa e iniciar cadastro orientado. |

A página compradora não deve receber a jornada de avaliação da carta de um vendedor. O FAQ direciona quem deseja vender para a nova página “Vender minha carta contemplada”. O renderizador deve oferecer esse caminho na navegação para a pasta `lp-venda-carta-contemplada`.

Afiliados não usa quiz de empréstimo, valor de crédito, margem, benefício ou CPF na primeira abordagem. Os dados úteis ao contato são nome, cidade, experiência de atuação e canais de indicação. Recomenda-se formulário de interesse com nome e meio de contato, além do WhatsApp compartilhado do projeto.

## Catálogos: uso permitido na prévia

Todos os 18 itens são **exemplos**, sem confirmação de disponibilidade. O texto das páginas e o FAQ dizem isso expressamente. O renderizador deve também colocar “Exemplo de catálogo” próximo à listagem e identificar o preço como referência da prévia. Selecionar um item indica interesse; não reserva nem compra.

Os títulos foram abreviados e acentuados para legibilidade, sem criar características. `type` é uma classificação editorial para filtros. Os valores, as localizações, as quilometragens e as imagens vieram dos respectivos registros de origem. Nos imóveis, as características foram retiradas do título e de `features`; não se reinterpretaram cegamente os campos herdados `year` e `km`.

As fotos continuam nos caminhos locais `assets/...`, relativos a cada pasta. Nenhuma imagem remota foi baixada. Um nome de arquivo contendo “phone” ou um campo `isAI: false` não comprova origem fotográfica; não descrevemos essas imagens como fotos verificadas. Imagens devem ser tratadas como ilustrativas nesta demonstração.

Não foram reaproveitados campos `cautelar: Aprovado`, FIPE, descontos calculados contra FIPE, alegações de vistoria ou os códigos sintéticos desses cadastros. A verificação de estoque e estado dos bens fica pendente para qualquer uso comercial futuro.

### Imóveis — origem exata dos preços e das imagens

Fonte principal: [index.html original](C:/Users/auror/Downloads/fivecred-sites/fivecred-marketplace-imoveis/index.html:1125), array `vehicles`. Não se usou `script4.js`: ele contém um conjunto anterior de imóveis, imagens repetidas e preços divergentes, como o studio de R$ 420.000 contra R$ 320.000 no HTML.

| ID do JSON / ID fonte | Título editorial | Preço extraído (BRL) | Imagem relativa | Registro original |
| --- | --- | ---: | --- | --- |
| imovel-1 / 1 | Apartamento com 2 quartos e varanda gourmet | 850000 | `assets/imoveis/apt_varanda.png` | [linha 1126](C:/Users/auror/Downloads/fivecred-sites/fivecred-marketplace-imoveis/index.html:1126) |
| imovel-2 / 2 | Casa em condomínio com 4 suítes | 1550000 | `assets/imoveis/casa_condominio.png` | [linha 1127](C:/Users/auror/Downloads/fivecred-sites/fivecred-marketplace-imoveis/index.html:1127) |
| imovel-3 / 3 | Sobrado reformado com 3 quartos | 620000 | `assets/imoveis/casa_colonial.png` | [linha 1128](C:/Users/auror/Downloads/fivecred-sites/fivecred-marketplace-imoveis/index.html:1128) |
| imovel-4 / 4 | Studio compacto mobiliado | 320000 | `assets/imoveis/apt_kitnet.png` | [linha 1129](C:/Users/auror/Downloads/fivecred-sites/fivecred-marketplace-imoveis/index.html:1129) |
| imovel-7 / 7 | Lote residencial de 300 m² | 180000 | `assets/imoveis/terreno_lote.png` | [linha 1132](C:/Users/auror/Downloads/fivecred-sites/fivecred-marketplace-imoveis/index.html:1132) |
| imovel-8 / 8 | Sala comercial de 45 m² | 350000 | `assets/imoveis/sala_comercial.png` | [linha 1133](C:/Users/auror/Downloads/fivecred-sites/fivecred-marketplace-imoveis/index.html:1133) |
| imovel-9 / 9 | Cobertura duplex com terraço e piscina | 2100000 | `assets/imoveis/apt_cobertura_terraco.png` | [linha 1134](C:/Users/auror/Downloads/fivecred-sites/fivecred-marketplace-imoveis/index.html:1134) |
| imovel-12 / 12 | Chácara com casa e pomar | 950000 | `assets/imoveis/casa_chacara.png` | [linha 1137](C:/Users/auror/Downloads/fivecred-sites/fivecred-marketplace-imoveis/index.html:1137) |
| imovel-16 / 16 | Lote comercial de esquina | 550000 | `assets/imoveis/terreno_urbano.png` | [linha 1141](C:/Users/auror/Downloads/fivecred-sites/fivecred-marketplace-imoveis/index.html:1141) |

### Veículos — origem exata dos preços e das imagens

Fonte principal: [index.html original](C:/Users/auror/Downloads/fivecred-sites/fivecred-marketplace-veiculos/index.html:1123), array `vehicles`. Foram selecionados registros que já apontavam para imagens locais da mesma pasta; os 60 primeiros registros com imagens externas não foram reutilizados.

| ID do JSON / ID fonte | Título editorial | Preço extraído (BRL) | Imagem relativa | Registro original |
| --- | --- | ---: | --- | --- |
| veiculo-61 / 61 | Fiat Pulse Drive 2024 | 94990 | `assets/cars/fiat_pulse_phone_1779904321320.png` | [linha 2865](C:/Users/auror/Downloads/fivecred-sites/fivecred-marketplace-veiculos/index.html:2865) |
| veiculo-62 / 62 | Jeep Compass Longitude 2024 | 159900 | `assets/cars/jeep_compass_phone_1779904335455.png` | [linha 2884](C:/Users/auror/Downloads/fivecred-sites/fivecred-marketplace-veiculos/index.html:2884) |
| veiculo-64 / 64 | Toyota Corolla Cross XRE 2024 | 169900 | `assets/cars/corolla_cross_phone_1779904368278.png` | [linha 2922](C:/Users/auror/Downloads/fivecred-sites/fivecred-marketplace-veiculos/index.html:2922) |
| veiculo-67 / 67 | Ford Ranger 2024 | 329900 | `assets/cars/ford_ranger_phone_1779904438955.png` | [linha 2979](C:/Users/auror/Downloads/fivecred-sites/fivecred-marketplace-veiculos/index.html:2979) |
| veiculo-68 / 68 | Toyota Corolla XEI 2024 | 149900 | `assets/cars/toyota_corolla_phone_1779904453992.png` | [linha 2998](C:/Users/auror/Downloads/fivecred-sites/fivecred-marketplace-veiculos/index.html:2998) |
| veiculo-69 / 69 | Hyundai Creta Limited 2024 | 139900 | `assets/cars/hyundai_creta_phone_1779904477731.png` | [linha 3017](C:/Users/auror/Downloads/fivecred-sites/fivecred-marketplace-veiculos/index.html:3017) |
| veiculo-71 / 71 | Fiat Argo Trekking 2023 | 79990 | `assets/cars/fiat_argo_phone_1779904507449.png` | [linha 3055](C:/Users/auror/Downloads/fivecred-sites/fivecred-marketplace-veiculos/index.html:3055) |
| veiculo-73 / 73 | Nissan Kicks Exclusive 2024 | 119900 | `assets/cars/nissan_kicks_phone_1779904545727.png` | [linha 3093](C:/Users/auror/Downloads/fivecred-sites/fivecred-marketplace-veiculos/index.html:3093) |
| veiculo-74 / 74 | Chevrolet Tracker Premier 2024 | 134900 | `assets/cars/chevrolet_tracker_phone_1779904561224.png` | [linha 3112](C:/Users/auror/Downloads/fivecred-sites/fivecred-marketplace-veiculos/index.html:3112) |

A tipologia foi simplificada para SUV, Picape, Sedã e Hatch. Foram omitidos motorizações e combustíveis para não propagar inconsistências das fichas. Entre os exemplos não selecionados, o Civic híbrido estava marcado como Flex e o Volvo híbrido como Elétrico; o T-Cross apontava para arquivo chamado “taigun”. Isso reforça a necessidade de revisão cadastral antes de uma publicação real.

## Carta contemplada: mudanças de linguagem

Os componentes originais divulgam entrada de 30%, disponibilidade em tempo real, análise jurídica inclusa e “Ambiente 100% Seguro”, sem evidência independente nos arquivos. Essas afirmações não foram transportadas.

O novo conteúdo explica a diferença entre valor do crédito, valor para assumir a cota, saldo restante e custos contratuais. Não define entrada mínima, taxa, prestação, aprovação ou prazo. A regra de que a transferência depende da aprovação da administradora segue a fonte ABAC já registrada na especificação do projeto; a página deve permitir consulta de condições de cada carta.

Não há catálogo de cartas no JSON: os arquivos originais apresentam faixas por categoria, mas não fichas individuais verificáveis. Repetir essas faixas como estoque atual induziria a uma disponibilidade que esta auditoria não confirma.

## Afiliados: mudanças de linguagem

As peças originais incluem notificações simuladas de comissões, pessoas identificadas por prenome/inicial, aprovação de 96%, crescimento de 41% e uma sequência de ganhos de R$ 120 a R$ 2.100+. Nenhuma evidência de dados reais acompanhava esses elementos. Eles foram omitidos, assim como “sem teto de ganho”, renda recorrente e comissão automática garantida.

O programa é apresentado como uma parceria a conhecer. Remuneração, critérios de atribuição e pagamento devem ser explicados antes da adesão. O FAQ informa que o material de origem apresenta o cadastro como gratuito, pedindo confirmação das condições vigentes; não cria taxas nem promete gratuidade contratual eterna. Não se estabeleceu CNPJ como requisito universal.

Fonte editorial principal: [HowItWorks original](C:/Users/auror/Downloads/fivecred-sites/fivecred-afiliados/app/components/HowItWorks.tsx), além de `Hero.tsx`, `Benefits.tsx`, `Stats.tsx`, `Testimonials.tsx`, `CTA.tsx` e `Footer.tsx`.

## Redes sociais e contatos encontrados

A busca por URLs de Instagram, Facebook, LinkedIn, YouTube, TikTok, Twitter/X e variações nos quatro projetos encontrou apenas este perfil social concreto:

| Canal | URL encontrada | Origem |
| --- | --- | --- |
| Instagram | [@_fivecred](https://instagram.com/_fivecred) | [Rodapé original de cartas, linha 39](C:/Users/auror/Downloads/fivecred-sites/contemplada.fivecred.com.br/components/footer.tsx:39), repetido na linha 85. |

Não foram encontrados URLs concretos de perfis de Facebook, LinkedIn, YouTube, TikTok ou Twitter/X nesses quatro fontes. Os nomes de redes no seletor de canais dos afiliados representam canais de divulgação do interessado, não perfis oficiais da Fivecred. Não se inventaram links. A existência do perfil no código foi verificada; a titularidade e o estado atual da conta não foram verificados externamente.

Contatos WhatsApp encontrados:

| Canal/uso | URL ou número no material | Origem |
| --- | --- | --- |
| Marketplaces e cabeçalhos | [WhatsApp 11 98165-5768](https://wa.me/5511981655768) | Marketplaces `index.html:408`; cabeçalhos das páginas Next. |
| Carta contemplada | [WhatsApp 11 96161-4215](https://wa.me/5511961614215) | [Rodapé original, linha 43](C:/Users/auror/Downloads/fivecred-sites/contemplada.fivecred.com.br/components/footer.tsx:43), hero, CTA e botão flutuante. |
| Briefing da reformulação | 11 98079-7255 | `work/briefing-extraido.txt`, página 3, item 3.4. |

O responsável pela geração confirmou que a prévia local padronizará o contato pelo número do briefing: 5511980797255. Os textos entregues não embutem telefone. Nenhuma conversa foi aberta ou enviada.

## Integração e elementos de confiança

Os componentes originais de carta e afiliados contêm POSTs para webhooks; a prévia local deve usar o fluxo local compartilhado definido na especificação. Não reutilizar esses handlers de rede para demonstrar o formulário.

`partnerGroup` organiza a apresentação conforme o briefing: imóveis usa `secured`; veículos, compradora e afiliados usam `banks`. O agrupamento não comprova que um banco fornece as cartas ou administra o programa de afiliados. A apresentação deve evitar essa associação direta; nomes de parceiros continuam dependentes do contexto institucional geral.

Não foram incluídos selos BACEN/ANEPS, depoimentos, estatísticas comerciais, certificações técnicas, números de clientes, estrelas ou promessas de segurança absoluta. Informações institucionais e legais comuns devem vir da camada compartilhada auditada pelo projeto.

## Verificação realizada

- JSON lido como UTF-8 e analisado sem erro.
- Quatro slugs exclusivos e tipos corretos.
- Três benefícios e três etapas por página; 7, 7, 8 e 8 perguntas frequentes.
- Nove exemplos em cada marketplace, com IDs exclusivos.
- Dezoito caminhos de imagem relativos confirmados existentes nas respectivas pastas.
- Preços do JSON comparados aos campos `price` dos registros originais; todos iguais.
- Imagens do JSON comparadas aos campos `img` ou `image` dos registros originais; todas iguais.
