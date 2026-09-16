# Mapa de imagens Fivecred

Os espaços aparecem identificados nas páginas até que a foto ou arte seja fornecida. Há um espaço de contexto por LP e um espaço compartilhado para a equipe. Não são necessários banners nem fotos no formulário.

## Pasta e formato

- Pasta: `shared/assets/lps/`.
- Preferência: WebP; também são aceitos JPG e PNG com o mesmo nome-base.
- Contexto: 1200 × 900 px (4:3).
- Equipe: 1600 × 1000 px; mantenha rostos e detalhes importantes no centro para acomodar os recortes no celular.
- Evite textos pequenos gravados na imagem. Títulos, explicações e botões já estão no HTML.

## Imagens de contexto

| LP | Nome do arquivo | Orientação |
|---|---|---|
| Crédito para o seu momento | `fivecred-next-contexto.webp` | foto de um adulto ou casal maduro planejando um projeto em casa, com expressão tranquila e ambiente acolhedor. |
| Sua próxima conquista | `fivecred-landing-page-contexto.webp` | foto oficial de um atendimento Fivecred ou arte da marca mostrando uma conversa sobre projetos pessoais. |
| Orçamento da família | `bolsa-fivecred-contexto.webp` | foto acolhedora de uma pessoa adulta organizando o orçamento da casa. Evitar imagens de dinheiro, urgência ou vulnerabilidade. |
| Consignado INSS | `consignado-fivecred-contexto.webp` | foto de uma pessoa ou casal maduro, em situação cotidiana. Expressão natural, boa iluminação e representação respeitosa. |
| Crédito na conta de luz | `luz-fivecred-contexto.webp` | foto de uma pessoa adulta em uma casa iluminada, conferindo a conta de energia, ou arte Fivecred sobre a modalidade. |
| Crédito com garantia de imóvel | `imovel-fivecred-contexto.webp` | foto de um casal maduro em casa ou de um empresário em seu negócio. Composição natural, com espaço ao redor das pessoas. |
| Crédito com garantia de veículo | `veiculo-fivecred-contexto.webp` | foto de um adulto com seu veículo em um contexto cotidiano. Evitar imagens de carro de luxo ou de entrega de prêmio. |
| Comprar uma carta contemplada | `contemplada.fivecred.com.br-contexto.webp` | foto de uma família adulta em frente a um imóvel, ou arte Fivecred que represente a compra de imóvel e veículo. |
| Parceria Fivecred | `fivecred-afiliados-contexto.webp` | foto oficial de uma reunião da equipe Fivecred com um parceiro, ou arte institucional sobre conexão e atendimento. |
| Venda da própria carta | `lp-venda-carta-contemplada-contexto.webp` | foto de um empresário maduro planejando seu negócio ou de um casal avaliando novos projetos. Não representar a cena como cliente real. |

## Equipe — utilizada em todas as LPs

`equipe-fivecred.webp`: foto oficial da equipe Fivecred em atendimento no escritório, ou arte institucional da marca. Use material autorizado. Não inclua números, certificações, avaliações ou depoimentos sem comprovação.

## Como aplicar

1. Adicione os arquivos à pasta, usando os nomes acima.
2. Execute `node work/build-sites.cjs` no ambiente de desenvolvimento para gerar o HTML com as imagens. Esse gerador usa as dependências locais documentadas no README.
3. Execute `node work/build-production.cjs` e confira o resultado.
4. Envie as imagens e o HTML gerado ao Git. O build de produção da Vercel copia apenas os recursos referenciados.

As orientações ficam em `work/content/visual-direction.json`. O layout substitui automaticamente o espaço reservado durante a geração quando encontra o arquivo correspondente.
