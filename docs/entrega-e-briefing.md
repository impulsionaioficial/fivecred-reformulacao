# Entrega e atendimento ao briefing — atualização em 15/09/2026

Fonte: C:/Users/auror/Downloads/FiveCred.pdf, 7 páginas. Texto extraído em work/briefing-extraido.txt. O documento foi tratado como briefing editorial e funcional. A instrução posterior do usuário autorizou preservar os formulários e integrações anteriores. A versão continua sem publicação; os testes não enviaram dados reais.

| Requisito | Implementação |
|---|---|
| Formulários, após instrução posterior | Restaurados os campos, etapas e destinos dos originais. A jornada da nova LP vendedora continua em shared/journey.js. |
| Dados pessoais | Nas páginas anteriores, ordem e campos dos originais preservados, inclusive CPF inicial quando existente. Na nova LP vendedora, contato posterior e CPF opcional. |
| WhatsApp contextual | Mensagem com respostas, valores e perfil; nome/e-mail antes de abrir a conversa, mantendo o destinatário de cada fluxo |
| Mobile primeiro | Controles grandes, widget adiantado no celular, texto legível e navegação adaptada |
| Identidade Fivecred | Laranja #ff6b00, superfícies suaves, azul-marinho, fonte Outfit, logo oficial sem bordas e topo sem banner/modelo |
| Confiança e antifraude | CNPJ, endereço, equipe, aviso contra taxa antecipada e condições de análise |
| Parceiros em três níveis | Bancos, garantia/crédito estruturado e soluções especializadas com os nomes fornecidos |
| Provas sociais e selos | Áreas identificadas para depoimentos reais, fotos oficiais e documentos de certificação; sem selos inventados |
| SEO por intenção | Títulos e descrições próprios, conteúdo HTML no servidor, um H1, FAQ específico, aliases de produto e links internos |
| Blog posterior por Rafa | Área editorial e pautas em docs/pautas-editoriais.md |
| Quem somos, jurídico e redes | Rodapé comum; Resolução CMN 4.935/2021; Instagram encontrado no fonte e espaços para demais URLs |
| Reformulação de todos os sites | 12 entradas no índice, incluindo os 11 projetos copiados e a nova LP |
| Nova LP de compra da carta do vendedor | lp-venda-carta-contemplada, separada da página para quem quer comprar uma carta |
| Catálogos | 9 exemplos de imóveis e 9 veículos, filtros, detalhes, estado vazio, contato por formulário e WhatsApp |
| Parceiros comerciais | Formulário próprio, sem quiz de empréstimo nem promessa de renda |

## Materiais que ainda precisam ser fornecidos

- Fotografia real da equipe em atendimento no escritório.
- Depoimentos com autorização, identificação e origem.
- Logotipos oficiais dos parceiros e comprovação de certificações a apresentar.
- Endereços oficiais de Facebook, LinkedIn, X e outras redes que a Fivecred queira incluir. Instagram encontrado: https://instagram.com/_fivecred.
- Dados atuais do catálogo para substituir os exemplos, caso essas páginas sejam publicadas no futuro.
- Política de privacidade definitiva e validação operacional dos destinos de atendimento. As integrações anteriores foram restauradas, com contratos verificados por interceptação.

## Ajustes editoriais necessários

Não foram reproduzidas promessas antigas de PIX em prazo fixo, aprovação automática, dinheiro oculto ou consignado como se não fosse uma dívida. Na página Bolsa Família, não é oferecido consignado descontado do benefício. Nas garantias, o risco sobre o bem é explicado. A nova LP diferencia valor do crédito da carta e preço de venda da cota.

## Fontes oficiais consultadas

- Banco Central: [Resolução CMN 4.935/2021, versão vigente](https://www.bcb.gov.br/estabilidadefinanceira/exibenormativo?numero=4935&tipo=Resolu%C3%A7%C3%A3o+CMN).
- ABAC: [transferência de cota contemplada](https://abac.org.br/consumidor/consorcio/cota-contemplada-dicas/).
- MDS: [regras do Bolsa Família](https://www.gov.br/mds/pt-br/acoes-e-programas/bolsa-familia/conheca-as-regras).
- Auditorias específicas: work/content/credit-audit.md e work/content/special-audit.md.

## Validação inicial de 14/09/2026 (histórico)

- 27 verificações de jornada: escolhas, revisão, moeda, contato, CPF opcional, contexto, acessibilidade e ausência de envio/armazenamento.
- 42 HTML verificados, 900 links/âncoras locais e 328 referências de recursos.
- 48 combinações de layout em Chrome headless: 12 sites em 320, 390, 768 e 1440 pixels, sem rolagem horizontal; zero erros de execução, requisições externas ou recursos com erro.
- Filtros, vazio, limpeza, seleção, diálogo, retorno do foco, formulário de catálogo e menu móvel exercitados no navegador.
- Os três projetos Next compilaram com sucesso e passaram pela verificação TypeScript. Execução nativa da home conferida em navegador: hidratação, escolha de objetivo, WhatsApp, hub, páginas legais, recursos compartilhados e LP de venda responderam normalmente; rotas privadas retornaram 404.

Tudo permanece local, sem publicação, envio de mensagens ou alteração dos sites originais.


## Padronização e formulários — 15/09/2026

Prevalece a instrução posterior do usuário: manter os formulários anteriores e seus destinos. Os detalhes atuais estão no README.md e nos relatórios de cada família de formulário. Os cinco produtos usavam WhatsApp; a campanha era local sem transporte. Home, afiliados e comprador de carta usam Make, e os catálogos usam a API original. Não foram inventados webhooks. A LP vendedora mantém sua demonstração aprovada. As verificações atuais são registradas em tests/standardization-browser-results.json e nos relatórios de contratos.


## Contato antes do WhatsApp — 15/09/2026

Conforme pedido posterior, todos os botões gerais e links dos formulários agora solicitam nome e e-mail antes de abrir o WhatsApp. Os dados vão na mensagem, junto do contexto já existente, e não alteram os schemas nem os destinos dos webhooks. Os dados já presentes nos formulários são aproveitados, sem armazenamento persistente. A etapa também intercepta a continuação do comprador de carta após o sucesso do POST. O formulário da LP vendedora continua sem botão de WhatsApp.
