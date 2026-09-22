const fs=require('node:fs'),path=require('node:path'),http=require('node:http'),assert=require('node:assert/strict');
const {chromium}=require('C:/Users/auror/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const root=path.resolve(__dirname,'..'),output=path.join(root,'public-site'),manifest=JSON.parse(fs.readFileSync(path.join(root,'work/pages-manifest.json')));
(async()=>{
 const server=http.createServer((req,res)=>{const u=new URL(req.url,'http://local'),f=path.join(output,u.pathname+(u.pathname.endsWith('/')?'index.html':''));fs.readFile(f,(e,b)=>{if(e){res.writeHead(404);return res.end();}res.setHeader('Content-Type',({'.html':'text/html; charset=utf-8','.css':'text/css','.js':'text/javascript','.woff2':'font/woff2','.png':'image/png','.webp':'image/webp','.svg':'image/svg+xml'})[path.extname(f)]||'application/octet-stream');res.end(b);});});
 await new Promise(r=>server.listen(0,'127.0.0.1',r));const base='http://127.0.0.1:'+server.address().port;
 const browser=await chromium.launch({executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe',headless:true}),ctx=await browser.newContext({reducedMotion:'reduce'}),page=await ctx.newPage(),errors=[],posts=[];let checks=0;
 await ctx.route('**/*',r=>{const u=new URL(r.request().url());if(u.hostname==='127.0.0.1')return r.continue();if(u.hostname==='hook.us1.make.celonis.com'){posts.push({url:u.href,payload:r.request().postDataJSON()});return r.fulfill({status:200,body:'Accepted'});}errors.push('Unexpected external request '+u.origin);return r.abort();});
 page.on('pageerror',e=>errors.push(e.message));page.on('response',r=>{if(new URL(r.url()).hostname==='127.0.0.1'&&r.status()>=400)errors.push(r.status()+' '+r.url());});


 try{
  for(const [slug,min,max]of [['bolsa-fivecred',100,750],['imovel-fivecred',50000,1000000]]){
   await page.goto(base+'/'+slug+'/index.html');const range=page.locator('[data-simulation-range]');assert.equal(await range.getAttribute('min'),String(min));assert.equal(await range.getAttribute('max'),String(max));assert((await page.locator('.footer-contact').innerText()).includes('Juscelino Kubitschek, 1327'));
  }
  const contact=async()=>{await page.locator('#nome').fill('Pessoa Teste');await page.locator('#whatsapp').fill('11912345678');await page.locator('#email').fill('teste@example.com');await page.locator('#step-1 button').last().click();await page.locator('#cpf').fill('52998224725');await page.locator('#nascimento').fill('01011980');};
  for(const amount of [100,750,800]){
   await page.goto(base+'/bolsa-fivecred/simulacao.html?valor_simulacao='+amount);await contact();await page.locator('#cep').fill('01001000');await page.locator('#endereco').fill('Rua Teste, 123');await page.locator('#valor_beneficio').fill('60000');await page.locator('#nis').fill('12345678901');await page.locator('#step-2 button.of-primary').click();await page.locator('#step-3').waitFor({state:'visible'});
   assert.equal((await page.locator('#res-credito').innerText()).replace(/\s/g,''),'R$'+(amount===100?'100,00':'750,00'));assert((await page.locator('#step-3').innerText()).includes('12 meses'));assert.equal((await page.locator('#res-parcela').innerText()).replace(/\s/g,''),'AtéR$159,00');const msg=new URL(await page.locator('#btn-envio-whatsapp').getAttribute('href')).searchParams.get('text');assert(msg.includes('em 12 parcelas'));assert(!msg.includes('24 parcelas'));checks++;
  }
  await page.goto(base+'/imovel-fivecred/simulacao.html');await contact();await page.locator('#valor_imovel').fill('15000000');await page.locator('#localidade').fill('São Paulo / SP');await page.locator('#situacao_imovel').selectOption('financiado');await page.locator('#saldo_devedor').fill('4000001');await page.locator('#step-2 button.of-primary').click();assert(await page.locator('#step-2').isVisible());assert((await page.locator('#error-saldo-devedor').innerText()).includes('50.000'));await page.locator('#saldo_devedor').fill('4000000');await page.locator('#step-2 button.of-primary').click();await page.locator('#step-3').waitFor({state:'visible'});assert.equal((await page.locator('#res-credito').innerText()).replace(/\s/g,''),'R$50.000,00');checks++;
  assert.deepEqual(errors,[]);assert.equal(posts.length,0);console.log(JSON.stringify({result:'PASS',checks,realSubmissions:0}));
 }finally{await browser.close();await new Promise(r=>server.close(r));}
})().catch(e=>{console.error(e);process.exit(1)});
