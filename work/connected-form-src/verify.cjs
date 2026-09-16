// Behavioral contract test. External webhook calls and WhatsApp opens are intercepted.
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const http = require('node:http');
const { chromium } = require('C:/Users/auror/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const root = path.resolve(__dirname, '../..');
const renderer = path.join(root, 'work/connected-forms.cjs');
assert.ok(fs.existsSync(renderer), 'Native original forms must be available to the static page renderer');
const {renderConnectedForm} = require(renderer);
const slugs = ['fivecred-next', 'fivecred-afiliados', 'contemplada.fivecred.com.br'];
const pages = Object.fromEntries(slugs.map(s => [s, renderConnectedForm(s)]));
pages.buyercta = renderConnectedForm('contemplada.fivecred.com.br', 'cta');
for (const [slug, html] of Object.entries(pages)) {
  assert.match(html, /<form/,'Server rendering must contain a native form: '+slug);
  assert.doesNotMatch(html, /<iframe|<script/,'No frames or inline scripts: '+slug);
}
const server = http.createServer((req,res)=>{
  if (req.url.startsWith('/shared/')) {
    const file = path.join(root, req.url.split('?')[0]);
    res.setHeader('Content-Type',file.endsWith('.css')?'text/css':'text/javascript');
    return res.end(fs.readFileSync(file));
  }
  res.setHeader('Content-Type','text/html; charset=utf-8');
  const slug = req.url.slice(1).split('?')[0];
  res.end(`<!doctype html><html lang="pt-BR"><meta name="viewport" content="width=device-width, initial-scale=1"><link rel="stylesheet" href="/shared/connected-forms.css"><body style="margin:0;background:#f4e9dc;padding:20px"><main style="max-width:580px;margin:auto">${pages[slug] || pages[slugs[0]]}</main><script defer src="/shared/connected-forms.js"></script></body></html>`);
});
(async()=>{
  await new Promise(r=>server.listen(0,'127.0.0.1',r));
  const port=server.address().port;
  const browser=await chromium.launch({executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe',headless:true});
  const context=await browser.newContext();
  let mode='ok', requests=[], consoleErrors=[];
  await context.route('https://hook.us1.make.celonis.com/**',async route=>{
    requests.push({url:route.request().url(),body:route.request().postDataJSON(),method:route.request().method(),headers:route.request().headers()});
    if(mode==='slow') await new Promise(r=>setTimeout(r,250));
    if(mode==='network') return route.abort('failed');
    await route.fulfill({status:mode==='error'?500:200,contentType:'text/plain',body:mode==='error'?'Error':'Accepted'});
  });
  const page=await context.newPage();
  page.on('pageerror',e=>consoleErrors.push(e.message));
  await page.addInitScript(()=>{window.__contactRequests=[];window.addEventListener('fivecred:whatsapp',e=>window.__contactRequests.push(e.detail));window.__opens=[];window.open=(url)=>{window.__opens.push(url);return null;};});
  async function visit(slug){requests=[];await page.goto(`http://127.0.0.1:${port}/${slug}`);await page.waitForFunction(()=>document.querySelector('[data-connected-form]')?.dataset.formReady==='true');}
  async function submitTwice(){await page.locator('form').evaluate(f=>{f.requestSubmit();f.requestSubmit();});}
  async function fillHome(){
    await page.getByLabel('Nome completo',{exact:true}).fill('Teste Fivecred');
    await page.getByLabel('WhatsApp (com DDD)',{exact:true}).fill('11987654321');
    await page.getByLabel('CPF',{exact:true}).fill('12345678900');
    await page.getByLabel('Data de nascimento',{exact:true}).fill('01011990');
    await page.getByRole('button',{name:'Continuar →',exact:true}).click();
    await page.getByRole('radio',{name:'Trabalhador CLT',exact:true}).check();
    await page.getByRole('radio',{name:'Não',exact:true}).check();
    await page.getByRole('button',{name:'Continuar →',exact:true}).click();
    await page.getByLabel('Recebe benefício/salário em qual banco?',{exact:true}).fill('Banco teste');
    await page.getByRole('radio',{name:'R$ 1.000 a R$ 5.000',exact:true}).check();
    await page.getByRole('radio',{name:'Tarde',exact:true}).check();
    await page.getByRole('checkbox').nth(0).check();await page.getByRole('checkbox').nth(1).check();
  }
  async function fillAffiliate(){
    await page.getByLabel('Nome completo',{exact:true}).fill('Teste Afiliado');
    await page.getByLabel('WhatsApp (com DDD)',{exact:true}).fill('11987654321');
    await page.getByLabel('E-mail',{exact:true}).fill('teste@example.com');
    await page.getByLabel('Cidade / Estado',{exact:true}).fill('São Paulo / SP');
    await page.locator('input[name="trabalhaVendas"][value="Sim"]').check();
    await page.getByRole('checkbox',{name:'WhatsApp',exact:true}).check();
    await page.getByRole('checkbox',{name:'Instagram',exact:true}).check();
    await page.locator('input[name="cnpj"][value="Não"]').check();
    await page.getByRole('radio',{name:'5 a 10',exact:true}).check();
    await page.getByLabel('Como conheceu o Programa de Afiliados Fivecred?',{exact:true}).fill('Indicação');
    await page.getByRole('checkbox',{name:/Declaro que li/}).check();
  }
  async function fillBuyer(){await page.getByLabel('Nome',{exact:true}).fill('Teste Carta');await page.getByLabel('WhatsApp',{exact:true}).fill('(11) 98765-4321');await page.locator('select').selectOption('Imóvel');}
  try {
    await visit(slugs[0]);assert.equal(await page.getByRole('button',{name:'Continuar →'}).isDisabled(),true);await fillHome();
    mode='error';await submitTwice();await page.getByRole('alert').waitFor();assert.equal(requests.length,1);assert.equal(await page.getByText('Solicitação enviada!',{exact:true}).count(),0);
    mode='slow';await submitTwice();await page.getByRole('heading',{name:'Solicitação enviada!'}).waitFor();assert.equal(requests.length,2);
    assert.equal(requests[1].url,'https://hook.us1.make.celonis.com/a1niutnubcy8miisowdia8geyha1187u');
    const home=requests[1].body;assert.deepEqual({...home,data:undefined},{nome:'Teste Fivecred',whatsapp:'(11) 98765-4321',cpf:'123.456.789-00',nascimento:'01/01/1990',perfil:'Trabalhador CLT',emprestimo_ativo:'Não',banco:'Banco teste',valor_desejado:'R$ 1.000 a R$ 5.000',horario_contato:'Tarde',origem:'consignado-fivecred',data:undefined});assert.ok(!isNaN(Date.parse(home.data)));assert.deepEqual(await page.evaluate(()=>window.__opens),[]);
    console.log('PASS home: 3 steps, masks, exact webhook payload, HTTP failure, retry, duplicate prevention, no placeholder WhatsApp');
    await visit(slugs[1]);await fillAffiliate();mode='error';await submitTwice();await page.getByRole('alert').waitFor();assert.equal(requests.length,1);
    mode='slow';await submitTwice();await page.getByRole('heading',{name:'Cadastro realizado!'}).waitFor();assert.equal(requests.length,2);
    assert.equal(requests[1].url,'https://hook.us1.make.celonis.com/m4ln9sg12wotrfm5nejxgtge8qfpg2kd');const affiliate=requests[1].body;
    assert.deepEqual({...affiliate,data:undefined,pagina:undefined},{nome:'Teste Afiliado',whatsapp:'(11) 98765-4321',email:'teste@example.com',cidade:'São Paulo / SP',trabalhaVendas:'Sim',canais:'WhatsApp, Instagram',cnpj:'Não',volume:'5 a 10',comoConheceu:'Indicação',aceite:true,origem:'landing-afiliados',data:undefined,pagina:undefined});assert.equal(affiliate.pagina,`http://127.0.0.1:${port}/${slugs[1]}`);
    console.log('PASS affiliate: all original fields and choices, exact webhook payload, HTTP failure/retry, duplicates');
    for (const [slug,source] of [[slugs[2],'FiveCred Contemplada - Hero'],['buyercta','FiveCred Contemplada - CTA']]){
      await visit(slug);await fillBuyer();mode='network';await submitTwice();await page.getByRole('alert').waitFor();assert.equal(requests.length,1);assert.deepEqual(await page.evaluate(()=>window.__opens),[]);
      mode='slow';await submitTwice();await page.getByRole('link',{name:'Continuar no WhatsApp'}).waitFor();assert.equal(requests.length,2);
      assert.equal(requests[1].url,'https://hook.us1.make.celonis.com/0b1d6blfvvj1ay2qkf3yi62v7w7e04uk');const buyer=requests[1].body;assert.deepEqual({...buyer,timestamp:undefined},{name:'Teste Carta',phone:'(11) 98765-4321',type:'Imóvel',source,timestamp:undefined});
      const contact=await page.evaluate(()=>window.__contactRequests);assert.equal(contact.length,1);assert.equal(contact[0].name,'Teste Carta');assert.match(contact[0].url,/^https:\/\/wa\.me\/5511961614215\?text=/);assert.equal(await page.getByRole('link',{name:'Continuar no WhatsApp'}).getAttribute('href'),contact[0].url);assert.deepEqual(await page.evaluate(()=>window.__opens),[]);console.log('PASS '+source+': exact fields/source/webhook, network failure/retry, duplicate prevention, original WhatsApp');
    }
    mode='ok';
    for (const slug of slugs){await visit(slug);for(const width of [360,390,1280]){await page.setViewportSize({width,height:900});assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false,slug+' must not overflow '+width);if(width===390)await page.screenshot({path:path.join(__dirname,slug.replace(/\./g,'-')+'-mobile.png'),fullPage:true});}}
    assert.deepEqual(consoleErrors,[]);console.log('PASS responsive 360/390/1280, hydration without runtime errors. All webhook requests intercepted; no real POST.');
  } finally {await browser.close();server.close();}
})().catch(e=>{console.error(e);server.close();process.exitCode=1;});
