# LP de venda de carta: público e direção visual

Revisão de 14/09/2026. A Fivecred compra a carta contemplada de quem já é titular. O trabalho continua local.

## Hipóteses de público

Não há dados de CRM ou entrevistas nesta análise. Os perfis abaixo são hipóteses de design baseadas no produto e no público indicado pelo cliente; não são uma segmentação estatística confirmada.

- **Empresários e profissionais experientes:** podem ter mudado a destinação do patrimônio ou estar considerando outro projeto. Precisam entender valor líquido, obrigações, prazo de pagamento e quem compra.
- **Pessoas e casais maduros:** podem ter revisto a compra do imóvel ou do carro. Valorizam leitura confortável, atendimento identificado, informação por escrito e controle da decisão.
- **Titulares de diferentes idades com planos alterados:** querem saber se a carta se enquadra e qual será o próximo passo, sem um cadastro longo logo no começo.

A idade não determina capacidade digital. Usar controles grandes, hierarquia clara e linguagem direta beneficia todo o público. Evitar representar pessoas maduras como frágeis ou sem autonomia.

## Referências consultadas

- [Crefaz](https://site.crefaz.com.br/): inspecionada visualmente. Uso marcante de laranja/azul, fotografias e recursos visuais por produto. Aproveitar a presença da marca; usar a composição de banner amplo como referência, sem reproduzir artes ou promessas comerciais.
- [Crefisa](https://www.crefisa.com.br/): conteúdo público consultado; inspeção visual bloqueada pelo site. Benefícios e ações explícitos e canais de atendimento identificados. Não afirmar comparação visual que não foi possível realizar.
- [Credbens / Investy Brasil](https://www.credbensinvest.com.br/): o endereço encontrado apresenta hoje a marca Investy Brasil e a chamada Conheça a Credbens. Inspecionado visualmente: fotografia contextual ampla e hierarquia simples. As avaliações exibidas pertencem à referência, não à Fivecred.
- [Creditas](https://www.creditas.com/emprestimo/garantia-imovel): inspecionada visualmente. Solicitação inicial em destaque, benefícios explicados e dúvidas por produto. Não reproduzir taxas, avaliações ou condições.

## Decisões para a Fivecred

1. Abertura bege, seções alternadas entre bege suave e branco, formulário branco e laranja concentrado nas ações, no progresso e em pequenos detalhes. Fotografias dão presença e calor, sem grandes fundos saturados. Superfícies próximas em luminosidade reduzem mudanças bruscas entre as seções.
2. Abertura diretamente com título, descrição e formulário. O banner foi removido a pedido do cliente. Manter a fotografia ilustrativa de planejamento empresarial na seção seguinte; ela não representa colaboradora ou cliente real da Fivecred.
3. Ilustrações próprias de casa e veículo para explicar a modalidade; não sugerem bens à venda.
4. Etapas visuais e quadro de condições que precisam ser conhecidas antes de vender. O crédito da carta e o preço de venda são distintos.
5. Fontes locais Outfit, corpo de 18px, contraste e controles confortáveis, responsividade e movimento reduzido respeitado.
6. Manter campos, validações e etapas do formulário; resultado do vendedor continua apenas pelo formulário.
7. Foto oficial da equipe e depoimento verdadeiro continuam como placeholders explícitos. Sem certificados, avaliações ou números inventados.

## Tokens

- Laranja da marca e ação: #FF6B00.
- Bege da abertura: #F4E9DC.
- Laranja suave para pequenos apoios: #FFF0E4.
- Bordas neutras: #E1E6EB.
- Azul-marinho para textos e contraste: #1C2D40.
- Texto secundário: #526071.
- Bege das seções alternadas: #F6EDE1.
- Bege da seção sobre valores: #F3E8DB.
- Branco: #FFFFFF.

## Materiais

Fotografias ilustrativas geradas pela ferramenta integrada image_gen. Prompts completos arquivados junto ao registro dos ativos em work/seller-image-prompts.md. Fotos oficiais não foram substituídas por pessoas artificiais.

## Registro da verificação anterior de cores

- Revisão de cor restrita ao CSS específico da LP. HTML, conteúdo, CSS compartilhado e código de jornada preservados por comparação de hashes.
- Telas de 320, 390, 768 e 1440 pixels, sem rolagem horizontal.
- 82 a 83 textos por tela com contraste verificado, sem falhas nas combinações renderizadas.
- Ação de continuar a solicitação em laranja, sem botão de WhatsApp dentro do formulário do vendedor. Etapa de contato conferida com os mesmos campos.
- Fotografias e ilustrações mantidas, assim como os placeholders de materiais oficiais.
- Inspeção visual do topo, seções internas e versão móvel. Nenhum erro de JavaScript.
- Tudo permanece local, sem publicação ou envio de dados.

Resultado detalhado: tests/seller-color-browser-results.json. As verificações de contraste se limitam aos textos e fundos renderizados; conforto visual também depende da percepção do público e deverá ser confirmado com usuários reais.

## Registro anterior — banner da abertura sem controles

Banner em toda a largura, imediatamente abaixo do cabeçalho, conforme a referência enviada pelo cliente. Sem moldura, setas, bolinhas, contador ou botão de pausa. Título, texto e formulário ficam abaixo do banner; no desktop, título e formulário ocupam duas colunas. No celular, a ordem é banner, texto e formulário.

- Três espaços configurados: institucional, carta de imóvel e carta de veículo. Os placeholders estão identificados enquanto não há artes oficiais.
- Troca automática a cada oito segundos, sem controles manuais.
- Suspende a rotação enquanto o mouse está sobre a arte, quando a página ou o banner saem de vista, com preferência por movimento reduzido ou quando o visitante começa a usar o formulário.
- Com uma única arte, o banner é fixo.
- Imagem principal recomendada: 1920 x 600. Versão móvel opcional: 750 x 540. Imagens exibidas inteiras; outras proporções podem deixar margens.
- Configuração: work/seller-banners.json. Imagens e instruções: shared/assets/banners/.

Verificação desta revisão: 37 testes aprovados (8 do banner e 29 da jornada), 42 páginas e referências locais verificadas. Navegador em 320, 390, 534, 768 e 1440 pixels: banner em toda a largura abaixo do cabeçalho, nenhum controle, sem rolagem horizontal e formulário estável durante a rotação. Movimento reduzido e pausa ao entrar no formulário conferidos. Scripts compartilhados, CSS compartilhado e páginas dos outros sites preservados por comparação de hashes. Nenhum erro de JavaScript ou pedido externo registrado. Tudo local, sem publicação.

Resultado: tests/seller-wide-banner-browser-results.json.

## Revisão de 15/09/2026 — abertura sem banner e logo maior

Banner removido da abertura e script de rotação retirado do carregamento da LP. O conteúdo começa logo abaixo da navbar. Arquivos de artes e configuração anteriores não são utilizados pela página.

Logo da navbar ampliada com compensação das margens transparentes do PNG via CSS. Altura da barra preservada: 75 px no celular, 83 px no tablet e 91 px no desktop, incluindo bordas. Logo do rodapé, campos, etapas, scripts compartilhados e páginas dos outros sites preservados.

Conferência em nove larguras, de 320 a 1440 px: sem cortes na logo, sobreposição com botões ou rolagem horizontal. Menu móvel, página principal e entrada dist conferidos. Resultado em tests/seller-header-results.json.

### Nova imagem oficial da logo

Imagem enviada pelo cliente (`FiveCred - Copia.png`, 672 × 130 px) copiada sem alteração para `shared/assets/logo-navbar.png` e aplicada somente à navbar da LP. Removida a compensação de margens da imagem anterior. Largura de até 230 px no desktop e 220 px no celular, adaptada às telas menores para caber ao lado dos botões. Altura da navbar preservada em todas as nove larguras verificadas. Resultado: tests/seller-new-logo-results.json.
