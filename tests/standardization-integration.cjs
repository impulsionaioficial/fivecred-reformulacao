const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict'),http=require('node:http');
const {spawn}=require('node:child_process');
const {chromium}=require('C:/Users/auror/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const root=path.resolve(__dirname,'..');
(async()=>{
const browser=await chromium.launch({executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe',headless:true});const ctx=await browser.newContext();const errors=[],records=[],results=[];const processes=[];let page;
await ctx.route('**/*',async route=>{const req=route.request(),u=new URL(req.url());if(u.hostname==='127.0.0.1')return route.continue();if(u.hostname==='hook.us1.make.celonis.com'||u.href==='https://api.fivecred.online/leads'){records.push({url:u.href,method:req.method(),payload:req.postDataJSON()});return route.fulfill({status:200,contentType:'application/json',body:'{}'});}if(u.hostname==='parallelum.com.br')return route.fulfill({status:404,body:'{}'});errors.push('Unexpected external request '+u.origin);return route.abort();});
await ctx.addInitScript(()=>{window.open=(url)=>{window.__opened=url;return null;};});
const browserPage=await ctx.newPage();browserPage.on('pageerror',e=>errors.push(e.message));browserPage.on('console',m=>{if(m.type()==='error'&&!m.text().includes('404 (Not Found)'))errors.push(m.text());});
async function startNext(slug){const temp=http.createServer();await new Promise(r=>temp.listen(0,'127.0.0.1',r));const port=temp.address().port;await new Promise(r=>temp.close(r));const proc=spawn(process.execPath,[path.join(root,slug,'node_modules/next/dist/bin/next'),'start','-H','127.0.0.1','-p',String(port)],{cwd:path.join(root,slug),windowsHide:true,stdio:['ignore','pipe','pipe']});processes.push(proc);let log='';await new Promise((resolve,reject)=>{const timeout=setTimeout(()=>reject(Error('Next start timeout '+log)),30000);const check=d=>{log+=d.toString();if(log.includes('Ready in')){clearTimeout(timeout);resolve();}};proc.stdout.on('data',check);proc.stderr.on('data',check);proc.on('exit',code=>{clearTimeout(timeout);reject(Error('Next exit '+code+log));});});return 'http://127.0.0.1:'+port;}
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

try{
for(const slug of ['fivecred-next','fivecred-afiliados','contemplada.fivecred.com.br']){
const nextBase=await startNext(slug);
for(const native of [false,true]){
const url=native?nextBase+'/':'http://127.0.0.1:4174/'+slug+'/index.html';await browserPage.goto(url);await browserPage.waitForFunction(()=>document.querySelector('[data-connected-form]')?.dataset.formReady==='true');
await browserPage.locator('.header [data-whatsapp]').click();const gate=browserPage.locator('#whatsapp-contact-dialog');await gate.waitFor({state:'visible'});await browserPage.keyboard.press('Escape');await gate.waitFor({state:'hidden'});
const n=slug==='contemplada.fivecred.com.br'?2:1;
for(let i=0;i<n;i++){
page=browserPage.locator('[data-connected-form]').nth(i);const before=records.length;
if(slug==='fivecred-next')await fillHome();else if(slug==='fivecred-afiliados')await fillAffiliate();else await fillBuyer();
await page.locator('form').evaluate(f=>f.requestSubmit());await page.locator('.cf-success').waitFor();assert.equal(records.length,before+1,'Exactly one original POST on full page');assert.equal(records.at(-1).method,'POST');if(n===2)assert.equal(records.at(-1).payload.source,i===0?'FiveCred Contemplada - Hero':'FiveCred Contemplada - CTA');
if(n===2){await gate.waitFor({state:'visible'});assert.equal(await gate.locator('[name=nome]').inputValue(),'Teste Carta');await gate.locator('[name=email]').fill('carta@example.com');await gate.locator('[type=submit]').click();await gate.waitFor({state:'hidden'});assert((await browserPage.evaluate(()=>window.__opened)).startsWith('https://wa.me/5511961614215?text='));assert(!Object.hasOwn(records.at(-1).payload,'email'));}
results.push({slug,native,form:i,endpoint:records.at(-1).url});
}
assert.equal(await browserPage.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);
}
for(const route of ['/shared/lp-design.css','/shared/connected-forms.js','/bolsa-fivecred/index.html'])assert.equal((await ctx.request.get(nextBase+route)).status(),200,route);
for(const route of ['/work/build-sites.cjs','/fivecred-next/app/page.tsx','/fivecred-next/package.json'])assert.equal((await ctx.request.get(nextBase+route)).status(),404,route);
console.log('PASS static and native Next '+slug);
}
for(const slug of ['fivecred-marketplace-imoveis','fivecred-marketplace-veiculos']){
await browserPage.goto('http://127.0.0.1:4174/'+slug+'/index.html');const f=browserPage.locator('[data-catalog-original-form]');
await browserPage.locator('[data-listing]').first().click();await browserPage.locator('#dialog-form').click();await browserPage.waitForFunction(()=>document.querySelector('#hero-car-select')?.value!=='');
await f.locator('#hero-nome').fill('Teste de integração');await f.locator('#hero-whatsapp').fill('11999999999');await f.locator('#hero-email').fill('teste@example.com');await f.locator('#hero-cpf').fill('52998224725');await f.locator('#hero-nascimento').fill('01011990');await f.locator('[data-catalog-next="2"]').click();await f.locator('#hero-entrada:not([disabled])').waitFor();await f.locator('[data-catalog-next="3"]').click();const before=records.length;await f.locator('[data-catalog-submit]').click();await f.locator('[data-catalog-send-status]').filter({hasText:'Simulação enviada'}).waitFor();assert.equal(records.length,before+1);assert.equal(records.at(-1).url,'https://api.fivecred.online/leads');await f.locator('#hero-whatsapp-sim-btn').click();const contact=browserPage.locator('#whatsapp-contact-dialog');await contact.waitFor({state:'visible'});assert.equal(await contact.locator('[name=nome]').inputValue(),'Teste de integração');assert.equal(await contact.locator('[name=email]').inputValue(),'teste@example.com');await contact.locator('[type=submit]').click();await contact.waitFor({state:'hidden'});assert((await browserPage.evaluate(()=>window.__opened)).startsWith('https://wa.me/5511981655768?text='));results.push({slug,native:false,endpoint:records.at(-1).url});console.log('PASS full catalog selection, POST and WhatsApp contact '+slug);
}
assert.deepEqual(errors,[]);fs.writeFileSync(path.join(root,'tests/standardization-integration-results.json'),JSON.stringify({result:'PASS',forms:results.length,results,errors,realExternalRequests:0,note:'All webhook/API requests fulfilled by Playwright; WhatsApp opens intercepted.'},null,2));
}finally{await browser.close();for(const proc of processes)proc.kill();}
})().catch(e=>{console.error(e);process.exit(1)});
