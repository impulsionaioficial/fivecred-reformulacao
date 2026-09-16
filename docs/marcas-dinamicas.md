# Faixa dinâmica de instituições

A seção `#parceiros` apresenta os mesmos 12 nomes de instituições já existentes, com a categoria abaixo de cada um. A lista fica em `work/partner-marquee.cjs`. Nenhuma nova instituição ou arte de logotipo foi acrescentada.

O movimento horizontal é contínuo e linear, com duas cópias de mesma largura para fechar o ciclo sem saltos. A segunda cópia é decorativa, oculta para leitores de tela e sem interação. A duração é de 80 segundos no desktop e 72 no celular.

O usuário pode pausar pelo botão, teclado ou ao passar o mouse sobre a faixa. A animação também pausa quando sai da tela ou a aba fica em segundo plano. Com a preferência de movimento reduzido ou JavaScript desativado, todas as instituições aparecem em uma grade estática, sem duplicação visual.

Estilos: `shared/partner-marquee.css`. Controle: `shared/partner-marquee.js`. Teste: `node tests/partner-marquee.cjs`, cobrindo quatro larguras, continuidade, pausa, fallback, integridade das 12 marcas e presença da seção nas LPs. Os formulários, webhooks e a faixa resumida do topo não foram alterados.
