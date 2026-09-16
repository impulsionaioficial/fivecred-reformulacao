# Padronização das LPs e preservação dos formulários

Objetivo autorizado: aplicar o visual aprovado da LP de venda de carta às 11 páginas anteriores, mantendo seus formulários, campos e destinos de envio. Manter tudo em reformulacoes, sem deploy.

- [x] Recuperar formulários estáticos dos cinco produtos e campanha, com campos, máscaras, opções, etapas e destino original. Não inventar webhook nas páginas que só têm WhatsApp.
- [x] Recuperar formulários conectados da home, comprador de carta (hero e CTA) e afiliados, mantendo URLs, método POST, headers e nomes do payload. Validar sucesso/erro com interceptação, sem cadastro real.
- [x] Recuperar formulário dos dois catálogos, seleção de item e contrato POST original. Não restaurar score de CPF fictício ou armazenamento de dados pessoais no navegador.
- [x] Aplicar shared/lp-design.css: logo oficial sem bordas, altura da navbar preservada, bege/branco alternados, laranja em ações, legibilidade e espaçamentos iguais à referência aprovada. Sem banner, sem modelo recortada no hero.
- [x] Integrar os módulos no gerador e nos três adaptadores Next. Corrigir textos que descreviam o formulário demonstrativo substituído; atualizar aviso de prévia e informações de envio.
- [x] Conferir páginas e aliases, menu/CTAs, todos os contratos dos formulários, layouts móveis e desktop, erro/duplicação de envio. Apenas requisições interceptadas nos testes. Confirmar originais intactos.

Módulos separados: work/original-static-forms.cjs, work/connected-forms.cjs e work/catalog-original-form.cjs. Integração: work/form-assets.cjs + work/build-sites.cjs + work/next-adapters.cjs. A LP vendedora mantém shared/journey.js e seu fluxo aprovado, sem WhatsApp dentro do formulário.

Destinos encontrados: Make (home, carta compradora, afiliados); api.fivecred.online/leads (catálogos); WhatsApp (5 produtos); campanha original apenas local. O número 5500000000000 da home é um placeholder, não deve abrir uma conversa inválida. Solicitação opcional de confirmação sobre os 5 produtos enviada ao usuário.


Verificação concluída: 42 páginas e 914 links locais; 48 combinações de layout; contratos dos seis formulários estáticos (107 checks), três conectados e dois catálogos; 10 envios interceptados nas páginas completas (HTML e Next), zero POST real; três builds Next com TypeScript; 109 arquivos originais com hashes inalterados. O usuário não forneceu uma versão alternativa dos cinco produtos com webhook; foi preservado o transporte encontrado nos originais, conforme comunicado.
