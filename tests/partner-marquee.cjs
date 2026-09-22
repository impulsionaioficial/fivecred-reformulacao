const fs=require('node:fs'),path=require('node:path'),http=require('node:http'),assert=require('node:assert/strict');
const {chromium}=require('C:/Users/auror/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const root=path.resolve(__dirname,'..'),output=path.join(root,'public-site');
const names=['Banco BV','PAN','Daycoval','BMG','C6 Bank','Creditas','CashMe','Crefisa','CREFAZ','ICred','Nossa Fintech','Grandino'];
(async()=>{
 const server=http.createServer((req,res)=>{const u=new URL(req.url,'http://local'),file=path.join(output,u.pathname+(u.pathname.endsWith('/')?'index.html':''));fs.readFile(file,(error,data)=>{if(error){res.writeHead(404);return res.end();}res.setHeader('Content-Type',({'.html':'text/html; charset=utf-8','.css':'text/css','.js':'text/javascript','.woff2':'font/woff2','.png':'image/png','.svg':'image/svg+xml'})[path.extname(file)]||'application/octet-stream');res.end(data);});});
 await new Promise(r=>server.listen(0,'127.0.0.1',r));const base='http://127.0.0.1:'+server.address().port;
 const browser=await chromium.launch({executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe',headless:true});
 const context=await browser.newContext({reducedMotion:'no-preference'}),page=await context.newPage(),errors=[];let checks=0;
 await context.route('**/*',r=>new URL(r.request().url()).hostname==='127.0.0.1'?r.continue():r.abort());page.on('pageerror',e=>errors.push(e.message));
 const state=()=>page.locator('.partner-marquee-track').evaluate(e=>getComputedStyle(e).animationPlayState);
 try{
  for(const width of [320,390,768,1440]){
   await page.setViewportSize({width,height:900});await page.goto(base+'/');const marquee=page.locator('[data-partner-marquee]');assert.equal(await marquee.count(),1,'Partner marquee exists');
   await marquee.scrollIntoViewIfNeeded();await page.mouse.move(0,0);await page.waitForFunction(()=>document.querySelector('[data-partner-marquee]').dataset.visible==='true');
   assert.deepEqual(await marquee.locator('[data-partner-original] li').evaluateAll(es=>es.map(e=>e.querySelector('img')?.alt||e.querySelector('strong').textContent)),names);
   assert.equal(await marquee.locator('[data-partner-copy] li').count(),12);assert.equal(await state(),'running');
   const before=await page.locator('.partner-marquee-track').evaluate(e=>getComputedStyle(e).transform);await page.waitForTimeout(200);assert.notEqual(await page.locator('.partner-marquee-track').evaluate(e=>getComputedStyle(e).transform),before);
   const geometry=await marquee.evaluate(e=>{const lists=e.querySelectorAll('ul');return{track:e.querySelector('.partner-marquee-track').getBoundingClientRect().width,first:lists[0].getBoundingClientRect().width,second:lists[1].getBoundingClientRect().width}});assert(Math.abs(geometry.first-geometry.second)<1);assert(Math.abs(geometry.track-geometry.first*2)<1);
   assert.equal(await marquee.locator('[data-partner-toggle]').count(),0,'No pause control');
   await page.locator('.partner-marquee-viewport').hover();assert.equal(await state(),'running');
   const hovered=await page.locator('.partner-marquee-track').evaluate(e=>getComputedStyle(e).transform);await page.waitForTimeout(200);assert.notEqual(await page.locator('.partner-marquee-track').evaluate(e=>getComputedStyle(e).transform),hovered,'Motion continues under pointer');await page.mouse.move(0,0);
   await page.emulateMedia({reducedMotion:'reduce'});assert.equal(await page.locator('.partner-marquee-track').evaluate(e=>getComputedStyle(e).animationName),'none');assert(!await marquee.locator('[data-partner-copy]').isVisible());
   assert(await marquee.locator('[data-partner-original]').evaluate(e=>[...e.children].every(li=>{const a=li.getBoundingClientRect(),b=e.getBoundingClientRect();return a.left>=b.left-1&&a.right<=b.right+1})));assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1));
   await page.emulateMedia({reducedMotion:'no-preference'});await page.evaluate(()=>scrollTo(0,0));await page.waitForFunction(()=>document.querySelector('[data-partner-marquee]').dataset.visible==='false');assert.equal(await state(),'paused');checks++;
  }
  const pages=JSON.parse(fs.readFileSync(path.join(root,'work/pages-manifest.json')));let lps=0;
  for(const item of pages){await page.goto(base+'/'+item.slug+'/index.html');assert.equal(await page.locator('[data-partner-marquee]').count(),item.type==='seller'?0:1);const photo=page.locator('[data-image-slot=context] img');if(await photo.count()){await photo.scrollIntoViewIfNeeded();await photo.evaluate(e=>e.decode());assert(await photo.evaluate(e=>e.naturalWidth>0));}assert.equal(await page.locator('[data-image-slot=team] img').count(),0);assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1));lps++;}
  const fallback=await browser.newContext({javaScriptEnabled:false});const plain=await fallback.newPage();await plain.goto(base+'/');assert.equal(await plain.locator('.partner-marquee-track').evaluate(e=>getComputedStyle(e).animationName),'none');assert(!await plain.locator('[data-partner-toggle]').isVisible());assert(!await plain.locator('[data-partner-copy]').isVisible());await fallback.close();
  assert.deepEqual(errors,[]);console.log(JSON.stringify({result:'PASS',viewports:checks,landingPages:lps,brands:12,continuousMotion:true,pauseControlRemoved:true,continuesOnHover:true,reducedMotion:true,noJavaScriptFallback:true,offscreenPause:true,errors},null,2));
 }finally{await browser.close();await new Promise(r=>server.close(r));}
})().catch(e=>{console.error(e);process.exit(1)});
