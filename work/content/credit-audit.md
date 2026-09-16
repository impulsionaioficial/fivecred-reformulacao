# Auditoria editorial das seis páginas de crédito Fivecred

Data: 14 de setembro de 2026. Escopo: conteúdo das cópias locais em `reformulacoes`.

O arquivo `credit-pages.json` contém um array de seis objetos pronto para o gerador local: cinco LPs de crédito e uma home de campanha. A intenção de cada página foi preservada, com substituição das promessas sem comprovação e das explicações financeiras incorretas. Este trabalho não alterou os HTML, os estilos, os scripts, os projetos originais, os arquivos legais ou qualquer serviço externo.

## Fontes do projeto e método

Foram lidos `work/briefing-extraido.txt`, `docs/superpowers/specs/2026-09-14-reformulacao-design.md`, os seis `index.html` e as quatro páginas alternativas de produto. Os quatro aliases foram conferidos por SHA-256 e eram cópias idênticas aos respectivos índices no momento da auditoria. Os nomes existentes constam no JSON.

A redação aplica as orientações de linguagem concreta, perspectiva do usuário e ações consistentes da skill frontend-design. Foi consultado o domínio UX da skill ui-ux-pro-max para instruções de formulário; os resultados reforçam rótulos associados aos campos e retorno explícito de estado. A direção visual já está definida na especificação do projeto e não foi reaberta nesta subtarefa.

O briefing orienta a jornada, os grupos de parceiros e o aviso antifraude. Ele não comprova uma taxa vigente, certificação, integração, avaliação pública ou aprovação de crédito.

## Diagnóstico e decisões por página

| Página | Intenção encontrada | Problemas observados no conteúdo anterior | Decisão editorial |
| --- | --- | --- | --- |
| bolsa-fivecred | Crédito dirigido a quem recebe Bolsa Família | Anunciava desconto automático no benefício, elegibilidade pelo NIS, liberação em duas horas, ausência de consulta, taxas menores e depoimentos verificados sem origem demonstrada. | Reposicionada como orientação de possibilidades para esse perfil. Explica que o benefício não garante crédito e que não se oferece novo consignado descontado no Bolsa Família. Sem NIS ou CPF no início. |
| consignado-fivecred | Consignado INSS para aposentados e pensionistas; também mencionava BPC | Fixava juros de 1,66% ao mês e prazo de 84 meses como regras atuais; tratava margem declarada como pré-aprovação; prometia ausência de consulta e melhores taxas. | Mantém consignado INSS, explica redução do benefício disponível e condiciona elegibilidade e termos à análise. BPC tratado como situação com requisitos próprios a confirmar. Portabilidade/refinanciamento sem promessa de economia. |
| luz-fivecred | Empréstimo com parcelas cobradas na fatura de energia | Dizia que bastava a conta no nome, calculava limite pelo valor da fatura e confirmava convênio ativo; prometia liberação em duas horas e análise automática. | Explica parcela adicional ao consumo. Confirmação de distribuidora, titularidade e condições ocorre no atendimento. Não afirma cobertura por cidade, convênio ativo ou limite automático. |
| imovel-fivecred | Empréstimo com garantia de imóvel, inclusive consulta para imóvel financiado | Prometia menor crédito do mercado, juros e percentuais fixos, pré-aprovação e prazos garantidos; destacava manutenção da posse sem explicar a possibilidade de perda do bem. | Mantém empréstimo com garantia e informa risco de perda já na introdução. Explica avaliação, documentos, possível registro, custos e eventual correção contratual, sem simular uma oferta. |
| veiculo-fivecred | Empréstimo com garantia de veículo já pertencente ao cliente | Prometia crédito em 24 horas, aceitação de carros de até 15 anos, vistoria digital universal e pré-aprovação automática; sem explicação útil do risco da garantia. | Preserva garantia de veículo. Não é página de compra de carro. Esclarece uso durante o contrato, critérios variáveis e risco de perda do veículo. |
| fivecred-landing-page | Campanha de captação para diferentes modalidades de crédito | Chamava empréstimo de resgate sem dívida, alegava saldo oculto e consulta ao Banco Central, aprovação algorítmica e PIX em 15 minutos; pedia CPF antes do perfil. | Home de campanha focada em uma pergunta: o que o cliente quer resolver. Jornada objetivo > perfil > valor > direcionamento > decisão de continuar. Consignado e antecipação do FGTS são identificados como crédito com obrigações. |

Problemas transversais removidos da nova copy: estatísticas de clientes sem fonte, avaliações de 4,9/5, nomes e depoimentos sem comprovação, selos ANEPS/BACEN sem evidência, garantias absolutas de segurança, promessa de integração automática com bancos ou órgãos públicos, melhores taxas universais e exemplos numéricos que poderiam parecer oferta.

## Contrato do JSON

Cada item possui somente os campos solicitados: `slug`, `type`, `title`, `description`, `label`, `headline`, `intro`, `profile`, `goal`, `heroAsset`, `benefits`, `how`, `faq`, `editorial`, `partnerGroup` e `aliases`.

- Seis slugs, todos iguais aos nomes das pastas.
- Cinco itens `credit` e um `home`.
- Três benefícios e três etapas por página; entre sete e nove perguntas específicas por página.
- Todos os objetivos iniciais são `credito`.
- Perfis iniciais: `bolsa`, `beneficio`, `luz`, `garantia`, `garantia` e `geral`.
- `heroAsset: null` deixa a seleção da fotografia existente a cargo do gerador.
- Parceiros `banks`: consignado e campanha; `secured`: imóvel e veículo; `popular`: conta de luz e Bolsa Família.
- Aliases: `emprestimo-bolsa-familia.html`, `emprestimo-consignado-inss.html`, `emprestimo-conta-de-luz.html`, `emprestimo-garantia-imovel.html`. Veículo e campanha não tinham aliases de produto.
- Textos armazenados em UTF-8, sem HTML embutido.

## Fontes primárias consultadas para a redação financeira

As fontes abaixo foram usadas para verificar conceitos e impedir afirmações incorretas. As taxas e os limites comerciais encontrados nelas não foram copiados para o JSON.

1. [MDS — Conheça as regras do Bolsa Família](https://www.gov.br/mds/pt-br/acoes-e-programas/bolsa-familia/conheca-as-regras): a seção sobre empréstimos informa a vedação de novos consignados descontados no benefício desde junho de 2023. Base da resposta específica da LP Bolsa Família.
2. [Banco Central — Informações que devem estar no contrato](https://www.bcb.gov.br/meubc/faqs/p/informacoes-que-devem-estar-no-contrato): referência para comparar juros, índices quando aplicáveis, despesas, CET e condições de atraso.
3. [Banco Central — Cuidados na hora de contratar uma operação de crédito](https://www.bcb.gov.br/meubc/faqs/p/cuidados-na-hora-de-contratar-uma-operacao-de-credito): orienta a olhar o conjunto de custos, além da taxa de juros.
4. [Banco Central — Diferenças entre financiamento, empréstimo e leasing](https://www.bcb.gov.br/detalhenoticia/223/noticia): base conceitual da distinção entre solicitar empréstimo e financiar uma compra.
5. [Banco Central — Ofertas de crédito com exigência de depósito prévio](https://bcb.gov.br/detalhenoticia/151/noticia): referência do alerta contra pedidos de pagamento para liberar empréstimo. A política de não cobrança da Fivecred vem do briefing.
6. [Creditas — O que acontece com o bem no empréstimo com garantia](https://www.creditas.com/exponencial/o-que-acontece-com-seu-bem-no-emprestimo-com-garantia/): fonte primária de uma instituição que opera a modalidade; esclarece vínculo do bem e possibilidade de perda por inadimplência. A referência não comprova uma oferta disponível pela Fivecred.
7. [Crefaz — Crédito com parcelamento na fatura de energia](https://site.crefaz.com.br/produto/energia): fonte primária para a forma de pagamento, titularidade e necessidade de análise. Critérios e números comerciais não foram generalizados para a Fivecred.
8. [CAIXA — Antecipação do saque-aniversário FGTS](https://www.caixa.gov.br/voce/credito-financiamento/emprestimo/antecipacao-saque-aniversario-FGTS/Paginas/default.aspx): confirma que a antecipação é crédito e envolve bloqueio de saldo como garantia.

## Orientações para a integração local

O resultado do widget deve permanecer orientativo, sem estados como “pré-aprovado”, “elegibilidade confirmada” ou “saldo liberado”. Escolher perfil e valor não realiza análise financeira. Não reintroduzir cálculos de taxa, parcela, margem ou limite sem fonte e implementação apropriadas.

Em `imovel-fivecred` e `veiculo-fivecred`, o perfil comum `garantia` deve preservar a modalidade da página no resumo. Caso o widget ofereça escolha entre imóvel e veículo, ela precisa ficar clara antes da continuação.

A campanha usa a mesma jornada de objetivos da institucional e pode ter apresentação mais direta. Não reutilizar seu antigo discurso de “varredura” de saldo oculto ou de operação sem nova dívida.

O agrupamento de parceiros reproduz a hierarquia do briefing. Ele não significa que todos os nomes daquela faixa ofertam cada modalidade, nem comprova homologação individual de uma proposta. Exibir os nomes fornecidos de modo informativo, sem inventar logos, selos ou credenciais.

A primeira fase não solicita CPF, NIS, placa, endereço ou documentos. O cadastro posterior e a etapa de CPF são demonstrações locais; nenhuma informação deve ser transmitida a terceiros durante a revisão.

Recomendado vincular a referência do MDS à explicação sobre Bolsa Família na renderização final. Os demais links podem integrar o registro editorial do projeto, sem sobrecarregar o fluxo de escolha.

## Dúvidas materiais e limites

Não há bloqueio para integrar esta redação local. Permanecem sem comprovação nesta auditoria: credenciais ANEPS, depoimentos, métricas públicas, condições comerciais vigentes por produto e convênios por distribuidora.

Os HTML antigos traziam números de WhatsApp divergentes. O briefing fornece `11 98079-7255`; o gerador deve usar a fonte definida pelo projeto, e não os contatos antigos dessas LPs.

Dados de empresa e textos legais são responsabilidade da camada compartilhada. Esta subtarefa não valida cadastro empresarial nem revisa termos de uso e política de privacidade. O conteúdo novo evita criar outra versão desses dados.

Esta entrega é exclusivamente editorial. Não afirma que os formulários, links, navegação, acessibilidade ou renderização final já foram testados; esses pontos precisam ser verificados no site gerado.