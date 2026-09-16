# Nome e e-mail antes do WhatsApp

Aplicado em 15/09/2026 às 12 LPs, hub, aliases e páginas auxiliares.

Todos os botões gerais e links de WhatsApp dos resultados pedem nome e e-mail obrigatórios. Os campos aproveitam os dados já preenchidos quando pertencem ao mesmo contato. A confirmação abre o destinatário original com a mensagem anterior e os dados de atendimento adicionados. A mensagem só é enviada quando o visitante a envia no WhatsApp.

Os formulários e seus contratos de webhook foram preservados. A continuação automática do comprador de carta agora abre esta etapa após o sucesso do POST. Não foi criado outro webhook e não há armazenamento persistente desses dados. Na LP vendedora, o formulário segue sem opção de WhatsApp.

Implementação: shared/whatsapp-contact.js/.css, markup em work/build-sites.cjs, inclusão em work/form-assets.cjs, integração em shared/site.js e work/connected-form-src/forms.tsx.

Verificação: 62 botões gerais nas 12 LPs; cinco resultados de produto; dois formulários de carta; contexto do catálogo; links dinâmicos, preenchimento obrigatório, e-mail inválido, cancelamento, retorno de foco, teclado e telas 320/390/1440. Integração também validada nos três projetos Next e nos dois resultados de catálogo, mantendo seus destinos. As requisições de teste e aberturas do WhatsApp foram interceptadas; nenhuma mensagem ou lead real foi enviado. Os 109 arquivos originais conferidos continuam inalterados.

Testes: tests/whatsapp-contact.test.cjs, tests/whatsapp-contact-browser.cjs e tests/standardization-integration.cjs. Estrutura: 42 HTML, 914 links e 429 referências locais verificados. Os três builds Next e TypeScript passaram. Capturas: tests/screenshots/whatsapp-contact-320.png, whatsapp-contact-390.png e whatsapp-contact-1440.png.
