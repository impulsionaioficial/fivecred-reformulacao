const assert = require('node:assert/strict');
const fs = require('node:fs');
const http = require('node:http');
const path = require('node:path');
const root = path.resolve(__dirname, '..');
const rendererPath = path.join(root, 'work/catalog-original-form.cjs');
assert.ok(fs.existsSync(rendererPath), 'Original marketplace form renderer must exist');
const {renderCatalogOriginalForm} = require(rendererPath);
const {chromium} = require('C:/Users/auror/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const allPages = JSON.parse(fs.readFileSync(path.join(root, 'work/content/special-pages.json'), 'utf8').replace(/^\uFEFF/, ''));
const pages = allPages.filter(p => p.type === 'marketplace');
const synthetic = {name:'Teste Contrato',phone:'(11) 99999-9999',cpf:'529.982.247-25',email:'teste@example.invalid',birthdate:'01/01/1990',state:'SP'};
const expectedKeys = ['name','phone','cpf','email','birthdate','state','vehicle','price','entrada','prazo','prestacao'].sort();
async function run() {
  const server = http.createServer((req,res) => {
    const slug = req.url.split('/')[1];
    const model = pages.find(p => p.slug === slug);
    if (model) {
      res.setHeader('Content-Type','text/html; charset=utf-8');
      res.end('<!doctype html><html lang="pt-BR"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><link rel="stylesheet" href="/shared/catalog-original-form.css"><script src="/shared/catalog-original-form.js" defer></script></head><body>'+renderCatalogOriginalForm(model,'../')+'</body></html>');
    } else if (/^\/shared\/catalog-original-form\.(css|js)$/.test(req.url)) {
      res.setHeader('Content-Type',req.url.endsWith('.js')?'application/javascript':'text/css');
      res.end(fs.readFileSync(path.join(root,req.url)));
    } else {res.statusCode=404;res.end();}
  });
  await new Promise(resolve => server.listen(0,'127.0.0.1',resolve));
  const port = server.address().port;
  const browser = await chromium.launch({headless:true,executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe'});
  try {
    for (const model of pages) {
      const page=await browser.newPage({viewport:{width:390,height:844}});
      const errors=[], requests=[], fipeRequests=[];
      let responseStatus=503;
      page.on('pageerror', error => errors.push(error.message));
      await page.route('**/*', async route => {
        const url=route.request().url();
        if(url.startsWith('http://127.0.0.1:')) return route.continue();
        if(url==='https://api.fivecred.online/leads') {
          requests.push({method:route.request().method(),headers:route.request().headers(),body:route.request().postDataJSON()});
          await new Promise(resolve => setTimeout(resolve,80));
          return route.fulfill({status:responseStatus,contentType:'application/json',body:'{}'});
        }
        if(url.startsWith('https://parallelum.com.br/fipe/api/v1/')) {
          fipeRequests.push(url);
          const suffix=url.split('/api/v1/')[1];
          const responses={
            'carros/marcas':[{codigo:'1',nome:'Marca Teste'}],
            'carros/marcas/1/modelos':{modelos:[{codigo:'2',nome:'Modelo Teste'}]},
            'carros/marcas/1/modelos/2/anos':[{codigo:'2023-1',nome:'2023 Flex'}],
            'carros/marcas/1/modelos/2/anos/2023-1':{Valor:'R$ 100.000,00'}
          };
          return route.fulfill({status:responses[suffix]?200:404,contentType:'application/json',body:JSON.stringify(responses[suffix]||{})});
        }
        errors.push('Unexpected external request '+new URL(url).origin);
        return route.abort();
      });
      await page.goto(`http://127.0.0.1:${port}/${model.slug}/`);
      const form=page.locator('[data-catalog-original-form]');
      await form.waitFor();
      assert.equal(await form.locator('#hero-car-select option').count(),model.slug.includes('imoveis')?21:78,'Complete original selection inventory');
      assert.equal(fipeRequests.length,0,'No FIPE request until a visitor chooses an item');
      assert.equal(await form.locator('a').first().getAttribute('href'),'politica-de-privacidade.html','Link to sibling privacy policy');
      await page.setViewportSize({width:320,height:800});
      assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false,'No narrow mobile horizontal overflow');
      assert.ok(await form.locator('label').evaluateAll(labels=>labels.every(label=>parseFloat(getComputedStyle(label).fontSize)>=16)),'Readable labels at 320px');
      await page.setViewportSize({width:390,height:844});
      const artifactDir=path.join(root,'tests/artifacts/catalog-original');
      fs.mkdirSync(artifactDir,{recursive:true});
      await page.screenshot({path:path.join(artifactDir,model.slug+'-mobile.png'),fullPage:true});
      await form.locator('[data-catalog-next="2"]').click();
      assert.equal(await form.locator('#hero-nome').getAttribute('aria-invalid'),'true','Blank identity must not advance');
      assert.equal(requests.length,0);
      await form.locator('#hero-nome').fill(synthetic.name);
      await form.locator('#hero-whatsapp').fill('11999999999');
      await form.locator('#hero-email').fill(synthetic.email);
      await form.locator('#hero-cpf').fill('11111111111');
      await form.locator('#hero-nascimento').fill('31022000');
      await form.locator('[data-catalog-next="2"]').click();
      assert.equal(await form.locator('#hero-cpf').getAttribute('aria-invalid'),'true');
      assert.equal(await form.locator('#hero-nascimento').getAttribute('aria-invalid'),'true');
      await form.locator('#hero-cpf').fill('52998224725');
      await form.locator('#hero-nascimento').fill('01011990');
      assert.equal(await form.locator('#hero-whatsapp').inputValue(),synthetic.phone);
      assert.equal(await form.locator('#hero-cpf').inputValue(),synthetic.cpf);
      assert.equal(await form.locator('#hero-nascimento').inputValue(),synthetic.birthdate);
      await form.locator('[data-catalog-next="2"]').click();
      await form.locator('#hero-car-select').selectOption('1');
      await form.locator('#hero-entrada:not([disabled])').waitFor();
      const isProperty=model.slug.includes('imoveis');
      assert.equal(await form.locator('#hero-entrada').getAttribute('min'),isProperty?'176000':'13972');
      await form.locator('#hero-parcelas').selectOption('48');
      await form.locator('[data-catalog-next="3"]').click();
      await form.locator('#hero-step-3:not([hidden])').waitFor();
      assert.equal(requests.length,0,'Viewing estimate must not send a lead');
      const forbidden=/score para o cpf|crédito pré-aprovado|limite aprovado|liberar crédito/i;
      assert.ok(!forbidden.test(await form.innerText()),'No fabricated credit assessment');
      await form.locator('[data-catalog-submit]').click();
      await form.locator('[data-catalog-send-status]').filter({hasText:'Não foi possível'}).waitFor();
      assert.equal(requests.length,1,'One explicit failed attempt');
      assert.equal(requests[0].method,'POST');
      assert.ok(requests[0].headers['content-type'].includes('application/json'));
      const body=requests[0].body;
      assert.deepEqual(Object.keys(body).sort(),expectedKeys,'Keep original webhook keys');
      for(const key of Object.keys(synthetic)) assert.equal(body[key],synthetic[key]);
      assert.equal(body.vehicle,isProperty?'Apartamento Apto 2 Quartos com Varanda Gourmet':'Chevrolet Chevrolet Onix 2023 1.0 Plus Lt');
      assert.equal(body.price,isProperty?850000:68490);
      assert.equal(body.entrada,isProperty?176000:13972);
      assert.equal(body.prazo,48);
      assert.equal(body.prestacao,isProperty?19337:1564);
      responseStatus=200;
      await form.locator('[data-catalog-submit]').evaluate(button => {button.click();button.click();});
      await form.locator('[data-catalog-send-status]').filter({hasText:'Simulação enviada'}).waitFor();
      assert.equal(requests.length,2,'Double click cannot duplicate submission');
      await form.evaluate(node => node.dispatchEvent(new Event('submit',{bubbles:true,cancelable:true})));
      assert.equal(requests.length,2,'Completed submission cannot be repeated');
      const href=await form.locator('#hero-whatsapp-sim-btn').getAttribute('href');
      assert.ok(href.startsWith('https://wa.me/5511981655768?text='));
      const waText=new URL(href).searchParams.get('text');
      for(const key of ['name','phone','cpf','email','birthdate']) assert.ok(waText.includes(synthetic[key]));
      assert.equal(await page.evaluate(()=>localStorage.length),0,'No persistent sensitive data');
      assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false,'No mobile horizontal overflow');
      await page.evaluate(id=>window.FivecredCatalogForm.select({id,title:'Título editorial do card',price:1}),isProperty?'imovel-1':'veiculo-1');
      assert.equal(await form.locator('#hero-car-select').inputValue(),'1','Card ID maps to original inventory');
      await page.evaluate(()=>window.FivecredCatalogForm.select({id:'selection-test',title:'Item selecionado no catálogo',price:120000}));
      await form.locator('#hero-step-2:not([hidden])').waitFor();
      assert.equal(await form.locator('#hero-car-select option:checked').textContent(),'Item selecionado no catálogo');
      if(!isProperty){
        await form.locator('#hero-car-select').selectOption('custom');
        await form.locator('#hero-fipe-marca').selectOption('1');
        await form.locator('#hero-fipe-modelo').selectOption('2');
        await form.locator('#hero-fipe-ano').selectOption('2023-1');
        await form.locator('#hero-entrada:not([disabled])').waitFor();
        await form.locator('[data-catalog-next="3"]').click();
        await form.locator('[data-catalog-submit]').click();
        await form.locator('[data-catalog-send-status]').filter({hasText:'Simulação enviada'}).waitFor();
        const custom=requests.at(-1).body;
        assert.equal(custom.vehicle,'Marca Teste Modelo Teste');
        assert.equal(custom.price,100000);
        assert.equal(custom.entrada,20000);
      } else assert.equal(fipeRequests.length,0,'No vehicle FIPE lookup for property');
      assert.deepEqual(errors,[]);
      console.log(`PASS ${model.slug}: original fields, masks, CPF/date validation, reference calculation, explicit POST, HTTP failure/retry, duplicate protection, WhatsApp destination, selection, no storage, mobile fit${isProperty?'':', FIPE custom route'}`);
      await page.close();
    }
  } finally {await browser.close();await new Promise(resolve=>server.close(resolve));}
}
run().catch(error=>{console.error(error);process.exitCode=1;});



