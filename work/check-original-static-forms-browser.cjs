'use strict';
const fs=require('node:fs');const path=require('node:path');const http=require('node:http');
const {chromium}=require('C:/Users/auror/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const {renderOriginalStaticForm,staticFormSlugs}=require('./original-static-forms.cjs');
const root=path.resolve(__dirname,'..');const out=path.join(__dirname,'original-form-preview');fs.mkdirSync(out,{recursive:true});
for(const slug of staticFormSlugs)fs.writeFileSync(path.join(out,slug+'.html'),`<!doctype html><html lang="pt-BR"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta http-equiv="Content-Security-Policy" content="default-src 'self';script-src 'self';style-src 'self' 'unsafe-inline';font-src 'self';connect-src 'none';form-action 'none';object-src 'none'"><link rel="stylesheet" href="../../shared/site.css"><link rel="stylesheet" href="../../shared/original-forms/forms.css"><script defer src="../../shared/original-forms/${slug}.js"></script></head><body style="background:#fff4ea"><main class="container" style="max-width:620px;padding-block:30px">${renderOriginalStaticForm(slug)}</main></body></html>`);
(async()=>{
const server=http.createServer((req,res)=>{const file=path.resolve(root,'.'+decodeURIComponent(req.url.split('?')[0]));if(!file.startsWith(root+path.sep)){res.writeHead(403);return res.end();}fs.readFile(file,(err,data)=>{if(err){res.writeHead(404);return res.end();}res.setHeader('Content-Type',file.endsWith('.css')?'text/css':file.endsWith('.js')?'application/javascript':file.endsWith('.woff2')?'font/woff2':'text/html');res.end(data);});});
await new Promise(r=>server.listen(0,'127.0.0.1',r));
const base='http://127.0.0.1:'+server.address().port;
const browser=await chromium.launch({executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe',headless:true});
try{
 const report=[];
 for(const slug of staticFormSlugs){
  const page=await browser.newPage({viewport:{width:390,height:844}});const errors=[];
  page.on('pageerror',e=>errors.push(e.message));page.on('console',m=>{if(m.type()==='error'&&!m.text().includes('favicon'))errors.push(m.text());});
  await page.route('**/*',route=>route.request().url().startsWith(base)?route.continue():route.abort());
  await page.goto(base+'/work/original-form-preview/'+slug+'.html');
  await page.evaluate(()=>document.fonts.ready);
  await page.screenshot({path:path.join(out,slug+'-mobile.png'),fullPage:true});
  const measure=await page.evaluate(()=>({scrollWidth:document.documentElement.scrollWidth,viewport:innerWidth,fields:[...document.querySelectorAll('.of-field input,.of-field select')].filter(e=>e.checkVisibility()).map(e=>({id:e.id,width:e.getBoundingClientRect().width,font:getComputedStyle(e).fontSize})),initialized:document.querySelector('.original-form').dataset.initialized}));
  if(measure.scrollWidth>390||measure.initialized!=='true'||measure.fields.some(f=>parseFloat(f.font)<18)||errors.length)throw Error(slug+': '+JSON.stringify({measure,errors}));
  await page.setViewportSize({width:1280,height:900});await page.screenshot({path:path.join(out,slug+'-desktop.png'),fullPage:true});
    const desktop=await page.evaluate(()=>[...document.querySelectorAll('.of-field input,.of-field select')].filter(e=>e.checkVisibility()).map(e=>e.getBoundingClientRect().width));
  if(desktop.some(width=>width<180))throw Error(slug+' desktop fields too narrow: '+desktop);
  if(slug!=='fivecred-landing-page'){
   await page.evaluate(slug=>{
    const input=(id,value)=>{const el=document.getElementById(id);if(el){el.value=value;el.dispatchEvent(new Event('input',{bubbles:true}));}};
    input('nome','Pessoa Teste');input('whatsapp','11912345678');input('cpf','52998224725');input('email','teste@example.invalid');input('nascimento','01011980');input('cep','01001000');input('endereco','Rua de Teste, 123');
    document.querySelector('form button').click();
    input('valor_beneficio',slug==='bolsa-fivecred'?'60000':'200000');input('nis','12345678901');input('codigo_cliente','123456');input('valor_conta','30000');input('valor_imovel','50000000');input('localidade','São Paulo / SP');input('modelo','Onix 1.0');input('ano','2020');input('placa','ABC1D23');input('valor_estimado','5000000');input('uf_cidade','SP / São Paulo');
    const profile=document.getElementById('tipo_beneficio');if(profile)profile.dispatchEvent(new Event('change',{bubbles:true}));
    document.querySelector('form').querySelectorAll('button')[2].click();
   },slug);
   if(!await page.locator('#step-3').isVisible())throw Error(slug+' real browser result failed');
   await page.screenshot({path:path.join(out,slug+'-result-desktop.png'),fullPage:true});
   await page.setViewportSize({width:390,height:844});await page.screenshot({path:path.join(out,slug+'-result-mobile.png'),fullPage:true});
   if(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth))throw Error(slug+' result horizontal overflow');
  }
  report.push({slug,passed:true,mobile:measure,desktopFieldWidths:desktop,resultFlow:slug!=='fivecred-landing-page',errors});await page.close();
 }
 fs.writeFileSync(path.join(__dirname,'original-static-form-visual-results.json'),JSON.stringify(report,null,2));console.log(JSON.stringify(report,null,2));
}finally{await browser.close();server.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});

