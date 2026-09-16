# Formulários CLT e FGTS do site principal

`components/LeadForm.tsx` e os oito módulos em `lib/` são cópias sem alterações de `fivecred.com.br-main/app`. `original-contract.json` registra os hashes normalizando apenas finais de linha. Não substitua estes fluxos pelos formulários de outro produto.

`Form.tsx` acrescenta apenas o contêiner e bloqueia interação até a hidratação. `server.tsx` gera HTML; `browser.tsx` hidrata a cópia original. `build.cjs` usa as dependências locais já instaladas para gerar `shared/migrated-forms.js`, `shared/migrated-forms.css` e `work/migrated-forms.cjs`. CSS é limitado a `.legacy-product-form`.

Execute a compilação, depois `node work/build-sites.cjs` e `node work/build-production.cjs`. O build Vercel copia o resultado estático e não instala dependências.

Os dez arquivos de comportamento dos outros formulários permanecem intactos. Campanha e venda da carta continuam aguardando seus próprios webhooks.
