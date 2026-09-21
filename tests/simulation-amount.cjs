const fs=require('node:fs'),path=require('node:path'),http=require('node:http'),assert=require('node:assert/strict');
const {chromium}=require('C:/Users/auror/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const root=path.resolve(__dirname,'..'),output=path.join(root,'public-site');
const pages=JSON.parse(fs.readFileSync(path.join(root,'work/pages-manifest.json')));
(async()=>{
 const server=http.createServer((req,res)=>{const u=new URL(req.url,'http://local'),file=path.join(output,u.pathname+(u.pathname.endsWith('/')?'index.html':''));fs.readFile(file,(err,data)=>{if(err){res.writeHead(404);return res.end();}res.setHeader('Content-Type',({'.html':'text/html; charset=utf-8','.css':'text/css','.js':'text/javascript','.woff2':'font/woff2','.png':'image/png','.svg':'image/svg+xml'})[path.extname(file)]||'application/octet-stream');res.end(data);});});
 await new Promise(r=>server.listen(0,'127.0.0.1',r));const base='http://127.0.0.1:'+server.address().port;
 const browser=await chromium.launch({executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe',headless:true});
 const context=await browser.newContext({reducedMotion:'reduce'}),page=await context.newPage(),errors=[];let checks=0;
 await context.route('**/*',r=>new URL(r.request().url()).hostname==='127.0.0.1'?r.continue():r.abort());
 page.on('pageerror',e=>errors.push(e.message));
 try{
  for(const item of pages){
   const eligible=!['seller','affiliate'].includes(item.type);
   for(const width of eligible?[320,390,768,1440]:[390]){
    await page.setViewportSize({width,height:900});await page.goto(base+'/'+item.slug+'/index.html');
    const range=page.locator('[data-simulation-range]');assert.equal(await range.count(),eligible?1:0,item.slug+' amount selector');if(!eligible)continue;
    const initial=Number(await range.inputValue()),step=Number(await range.getAttribute('step')),max=Number(await range.getAttribute('max'));
    await page.locator('[data-amount-increase]').click();assert.equal(Number(await range.inputValue()),initial+step);
    await page.locator('[data-amount-decrease]').click();assert.equal(Number(await range.inputValue()),initial);
    await range.focus();await page.keyboard.press('ArrowRight');assert.equal(Number(await range.inputValue()),initial+step);
    await page.keyboard.press('End');assert.equal(Number(await range.inputValue()),max);assert(await page.locator('[data-amount-increase]').isDisabled());
    assert((await range.getAttribute('aria-valuetext')).includes('R$'));
    assert.equal(await page.locator('[data-amount-value]').textContent(),await range.getAttribute('aria-valuetext'));
    const dimensions=await range.boundingBox();assert(dimensions.height>=44);
    assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1));
    for(const link of await page.locator('[data-simulation-link]').all())assert.equal(new URL(await link.getAttribute('href'),base).searchParams.get('valor_simulacao'),String(max));
    const guided=['fivecred-next','fivecred-landing-page'].includes(item.slug);await page.locator('.simulation-cta [data-simulation-link]').click();if(guided){await page.locator('[data-guide-goal=organizar]').click();await page.locator('[data-guide-profile=outro]').click();await page.locator('[data-guide-next]').click();await page.locator('[data-guide-form]').click();}await page.waitForURL('**/simulacao.html?*');
    assert.equal(new URL(page.url()).searchParams.get('valor_simulacao'),String(max));
    const summary=page.locator('[data-simulation-selection]');assert(await summary.isVisible());assert((await summary.textContent()).includes('R$'));
    assert.equal(await page.locator('main form').count(),1);
    await summary.locator('a').click();await page.waitForURL('**/index.html?*');
    assert.equal(Number(await page.locator(guided?'[data-guide-range]':'[data-simulation-range]').inputValue()),max);checks++;
   }
  }
  for(const amount of ['abc','NaN','0','-1','99999999999999999','1250.5','1000&valor_simulacao=2000']){
   await page.goto(base+'/fivecred-next/simulacao.html?valor_simulacao='+amount);assert(!await page.locator('[data-simulation-selection]').isVisible());
  }
  await page.goto(base+'/');assert.equal(await page.locator('[data-simulation-range]').count(),1);
  const nojs=await browser.newContext({javaScriptEnabled:false});const fallback=await nojs.newPage();await fallback.goto(base+'/');assert(!await fallback.locator('[data-simulation-amount]').isVisible());await fallback.locator('.simulation-cta [data-simulation-link]').click();await fallback.locator('[data-guide-fallback]').waitFor({state:'visible'});assert(new URL(fallback.url()).pathname.endsWith('/orientacao/index.html'));await nojs.close();
  assert.deepEqual(errors,[]);console.log(JSON.stringify({result:'PASS',productViewportFlows:checks,keyboardAndButtons:true,valueKeptOnNextPageAndReturn:true,invalidQueryValuesIgnored:true,noJavaScriptFallback:true,realExternalSubmissions:0},null,2));
 }finally{await browser.close();await new Promise(r=>server.close(r));}
})().catch(e=>{console.error(e);process.exit(1)});
