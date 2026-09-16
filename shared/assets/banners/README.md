# Artes dos banners Fivecred

O banner foi removido da LP em 15/09/2026. Esta pasta e as orientações abaixo ficam como arquivo; adicionar imagens aqui não altera a página atual.

Coloque aqui as imagens finais em JPG, PNG, WebP ou AVIF. Esta pasta é local e não publica nada.

- Desktop: recomendado 1920 x 600 px.
- Celular: recomendado 750 x 540 px, com texto maior e composição própria.
- A imagem é exibida inteira, sem recorte. Proporções diferentes deixam margens no fundo do banner.
- Use no máximo uma mensagem curta por arte. O título principal e o formulário continuam fora da rotação.

Configure os nomes dos arquivos em ../../../work/seller-banners.json. `image` é a imagem principal; `mobileImage` é opcional. Informe somente o nome, por exemplo `institucional-desktop.webp`. Os campos vazios mostram um placeholder identificado. `alt` descreve o conteúdo da arte para leitores de tela.

Após colocar as imagens e atualizar o JSON, execute a partir da raiz das reformulações:

    node work/build-sites.cjs

Recarregue a prévia local. O banner ocupa toda a largura logo abaixo do cabeçalho, sem setas, indicadores, contador ou botão de pausa. Com duas ou mais artes, a troca ocorre automaticamente a cada oito segundos. Para um banner fixo, mantenha apenas um item em `slides`.
