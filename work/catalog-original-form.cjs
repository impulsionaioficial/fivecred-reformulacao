const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const esc = value => String(value ?? '').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const inventoryCache = new Map();
function originalInventory(slug) {
  if(inventoryCache.has(slug)) return inventoryCache.get(slug);
  if(!['fivecred-marketplace-veiculos','fivecred-marketplace-imoveis'].includes(slug)) throw new Error('Unsupported original catalog: '+slug);
  const source=fs.readFileSync(path.resolve(__dirname,'../..',slug,'index.html'),'utf8');
  const literal=source.match(/const\s+vehicles\s*=\s*(\[[\s\S]*?\n\s*\]);/);
  if(!literal) throw new Error('Original catalog data missing: '+slug);
  const originals=vm.runInNewContext('('+literal[1]+')',Object.create(null),{timeout:1000});
  const items=Array.from(originals,item=>({id:String(item.id),brand:item.brand,model:item.model,year:item.year,price:Number(item.price),fipe:Number(item.fipe),fipe_code:item.fipe_code}));
  inventoryCache.set(slug,items);
  return items;
}
function renderCatalogOriginalForm(page,prefix='../') {
  const property=page.slug.includes('imoveis');
  const noun=property?'imóvel':'veículo';
  const items=originalInventory(page.slug);
  const field=(id,label,type,extra='')=>`<div class="cf-field${id==='nome'?' cf-wide':''}"><label for="hero-${id}">${label}</label><input id="hero-${id}" name="${id}" type="${type}" ${extra} required aria-describedby="err-hero-${id}"><p class="cf-error" id="err-hero-${id}" hidden></p></div>`;
  return `<section class="catalog-original-panel" id="simulacao" aria-labelledby="catalog-form-title"><form id="hero-sim-form" class="catalog-original-form" data-catalog-original-form data-form-mode="catalog-original" data-catalog-kind="${property?'property':'vehicle'}" data-catalog-items="${esc(JSON.stringify(items))}" data-endpoint="https://api.fivecred.online/leads" novalidate>
    <p class="cf-kicker">Planeje sua compra</p><h2 id="catalog-form-title">Simule o seu ${noun}.</h2><p class="cf-intro">Informe seus dados, escolha uma opção e confira uma estimativa antes de enviar.</p>
    <ol class="cf-progress" aria-label="Etapas da simulação"><li data-catalog-progress="1" aria-current="step"><span>1</span>Seus dados</li><li data-catalog-progress="2"><span>2</span>Sua escolha</li><li data-catalog-progress="3"><span>3</span>Estimativa</li></ol>
    <p class="cf-selected" data-catalog-selection hidden></p>
    <div id="hero-step-1" data-catalog-step="1"><h3 class="cf-step-title" tabindex="-1">1. Seus dados</h3><div class="cf-fields">
      ${field('nome','Nome completo','text','autocomplete="name" maxlength="120" placeholder="Seu nome completo"')}
      ${field('whatsapp','WhatsApp com DDD','tel','autocomplete="tel-national" inputmode="tel" maxlength="15" placeholder="(11) 99999-9999"')}
      ${field('email','E-mail','email','autocomplete="email" maxlength="180" placeholder="seu@email.com"')}
      ${field('cpf','CPF','text','inputmode="numeric" maxlength="14" placeholder="000.000.000-00"')}
      ${field('nascimento','Data de nascimento','text','autocomplete="bday" inputmode="numeric" maxlength="10" placeholder="DD/MM/AAAA"')}
      <div class="cf-field"><label for="hero-uf">Estado (UF)</label><select id="hero-uf" name="uf" autocomplete="address-level1" required><option value="SP">São Paulo (SP)</option><option value="RJ">Rio de Janeiro (RJ)</option><option value="MG">Minas Gerais (MG)</option><option value="PR">Paraná (PR)</option><option value="SC">Santa Catarina (SC)</option><option value="RS">Rio Grande do Sul (RS)</option></select></div>
    </div><p class="cf-note">Seus dados serão enviados à Fivecred quando você confirmar na última etapa. <a href="politica-de-privacidade.html">Leia a política de privacidade.</a></p><div class="cf-actions"><button class="cf-primary" type="button" data-catalog-next="2">Continuar simulação <span aria-hidden="true">→</span></button></div></div>
    <div id="hero-step-2" data-catalog-step="2" hidden><h3 class="cf-step-title" tabindex="-1">2. ${property?'Imóvel':'Veículo'} e entrada</h3>
      <div class="cf-field"><label for="hero-car-select">Selecione o ${noun} desejado</label><select id="hero-car-select" name="vehicle" aria-describedby="err-hero-car-select"><option value="">Selecione uma opção</option>${items.map(item=>`<option value="${esc(item.id)}">${esc(item.model+(property?'':' ('+item.year+')'))}</option>`).join('')}${property?'':'<option value="custom">Outro veículo — consultar FIPE</option>'}</select><p class="cf-error" id="err-hero-car-select" hidden></p></div>
      ${property?'':`<div class="cf-fipe" id="custom-fipe-selectors" hidden><p>Consulte outro veículo por marca, modelo e ano.</p><div class="cf-fields"><div class="cf-field"><label for="hero-fipe-marca">Marca FIPE</label><select id="hero-fipe-marca" name="fipe_marca" disabled><option value="">Selecione a marca</option></select></div><div class="cf-field"><label for="hero-fipe-modelo">Modelo FIPE</label><select id="hero-fipe-modelo" name="fipe_modelo" disabled><option value="">Selecione a marca primeiro</option></select></div><div class="cf-field cf-wide"><label for="hero-fipe-ano">Ano do modelo</label><select id="hero-fipe-ano" name="fipe_ano" disabled><option value="">Selecione o modelo primeiro</option></select></div></div><p class="cf-note" data-fipe-status role="status"></p><button class="cf-text-button" type="button" data-fipe-retry hidden>Tentar consulta novamente</button></div>`}
      <div class="cf-value"><span>Valor do ${noun}</span><strong id="hero-fipe-price-label">Selecione uma opção</strong><small id="hero-fipe-status">Valor de referência do catálogo</small></div>
      <div class="cf-field cf-range-field"><div class="cf-range-label"><label for="hero-entrada">Valor de entrada</label><output id="hero-entrada-label" for="hero-entrada">R$ 0,00</output></div><input id="hero-entrada" name="entrada" type="range" min="0" max="100000" step="1000" value="0" disabled aria-describedby="catalog-entrada-note"><p class="cf-note" id="catalog-entrada-note">Ajuste a entrada para comparar as parcelas.</p></div>
      <div class="cf-field"><label for="hero-parcelas">Prazo de pagamento</label><select id="hero-parcelas" name="prazo"><option value="24">24 meses · referência de 1,29% a.m.</option><option value="36">36 meses · referência de 1,35% a.m.</option><option value="48" selected>48 meses · referência de 1,39% a.m.</option><option value="60">60 meses · referência de 1,45% a.m.</option></select></div><p class="cf-note">Valores ilustrativos. A equipe confirma taxas, custos, prazos e disponibilidade na proposta.</p>
      <div class="cf-actions"><button class="cf-secondary" type="button" data-catalog-back="1">Voltar</button><button class="cf-primary" type="button" data-catalog-next="3">Ver estimativa <span aria-hidden="true">→</span></button></div>
    </div>
    <div id="hero-step-3" data-catalog-step="3" hidden><h3 class="cf-step-title" tabindex="-1">3. Confira sua estimativa</h3><p class="cf-result-item" data-catalog-result-item></p><dl class="cf-summary"><div><dt>Valor do ${noun}</dt><dd id="hero-res-fipe"></dd></div><div><dt>Sua entrada</dt><dd id="hero-res-entrada"></dd></div><div><dt>Valor financiado</dt><dd id="hero-res-financiado"></dd></div></dl><div class="cf-installment"><span>Prestação mensal estimada</span><strong><span id="hero-res-meses"></span> × <span id="hero-res-prestacao"></span></strong></div><p class="cf-note">Esta estimativa não representa aprovação de crédito. As condições dependem de análise e da proposta da instituição responsável.</p><p class="cf-note">Ao enviar, você solicita o contato da Fivecred sobre esta simulação.</p><div class="cf-actions"><button class="cf-secondary" type="button" data-catalog-back="2">Ajustar simulação</button><button class="cf-primary" type="submit" data-catalog-submit>Enviar simulação</button></div><p class="cf-send-status" data-catalog-send-status role="status" aria-live="polite" tabindex="-1" hidden></p><a class="cf-whatsapp" id="hero-whatsapp-sim-btn" href="https://wa.me/5511981655768" target="_blank" rel="noopener noreferrer">Continuar com a simulação no WhatsApp <span aria-hidden="true">↗</span></a></div>
    <noscript><p>Ative o JavaScript para usar o formulário ou entre em contato pelo WhatsApp (11) 98165-5768.</p></noscript>
  </form></section>`;
}
module.exports={renderCatalogOriginalForm};

