# CLT e FGTS na reformulação

As LPs do site principal foram incorporadas ao mesmo layout das demais páginas, com chamada “Simule aqui” e formulário em página própria. São doze LPs no conjunto atual. Navegação e imagens pendentes seguem o padrão aprovado.

| Produto | LP | Formulário |
| --- | --- | --- |
| Consignado CLT | `clt-fivecred/index.html` | `clt-fivecred/simulacao.html` |
| Antecipação FGTS | `fgts-fivecred/index.html` | `fgts-fivecred/simulacao.html` |

O formulário CLT mantém os dados pessoais, vínculo, CEP, endereço, tempo de carteira, salário, valor e prazo. O formulário FGTS mantém os dados pessoais, situação do saque-aniversário e saldo aproximado. A continuação conserva o webhook e o WhatsApp de atendimento do site original.

As estimativas e regras dos formulários foram preservadas, sem apresentar o resultado como aprovação ou oferta. A página de FGTS trata a antecipação como operação de crédito com saldo em garantia.

Referências para os textos informativos: [Crédito do Trabalhador — MTE](https://www.gov.br/trabalho-e-emprego/pt-br/assuntos/credito-do-trabalhador/perguntas-frequentes) e [Antecipação do saque-aniversário — CAIXA](https://www.caixa.gov.br/voce/credito-financiamento/emprestimo/antecipacao-saque-aniversario-FGTS/Paginas/default.aspx). A cópia evita taxas, limites ou elegibilidade garantidos.

Verificação: nove módulos originais íntegros por hash; 10 fluxos de formulário em cinco tamanhos, incluindo falha e nova tentativa; 20 POSTs interceptados e nenhum lead real enviado. Navegação geral verificada em 60 combinações de página e tamanho.
