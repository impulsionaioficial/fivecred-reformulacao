const fs=require('node:fs'),path=require('node:path'),http=require('node:http'),assert=require('node:assert/strict');
const {chromium}=require('C:/Users/auror/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const root=path.resolve(__dirname,'..'),manifest=JSON.parse(fs.readFileSync(path.join(root,'work/pages-manifest.json')));
(async()=>{
 const server=http.createServer((req,res)=>{const u=new URL(req.url,'http://local'),f=path.join(root,'public-site',u.pathname+(u.pathname.endsWith('/')?'index.html':''));fs.readFile(f,(e,b)=>{if(e){res.writeHead(404);return res.end();}res.setHeader('Content-Type',({'.html':'text/html; charset=utf-8','.css':'text/css','.js':'text/javascript','.woff2':'font/woff2','.png':'image/png','.webp':'image/webp','.svg':'image/svg+xml'})[path.extname(f)]||'application/octet-stream');res.end(b);});});
 await new Promise(r=>server.listen(0,'127.0.0.1',r));const base='http://127.0.0.1:'+server.address().port;
 const browser=await chromium.launch({executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe',headless:true});
 const context=await browser.newContext({reducedMotion:'reduce'});await context.route('**/*',r=>new URL(r.request().url()).hostname==='127.0.0.1'?r.continue():r.abort());
 const page=await context.newPage(),errors=[],checks=[];
 page.on('pageerror',e=>errors.push(e.message));page.on('response',r=>{if(r.status()>=400&&r.url().startsWith(base))errors.push(r.status()+' '+r.url());});
 try{
  for(const slug of ['root',...manifest.map(p=>p.slug)])for(const [width,height] of [[1440,900],[1280,600],[390,844],[320,568]]){
   await page.setViewportSize({width,height});await page.goto(base+(slug==='root'?'/':'/'+slug+'/index.html'));await page.evaluate(()=>document.fonts.ready);
   const state=await page.evaluate(()=>{
    const header=document.querySelector('.header').getBoundingClientRect();const available=innerHeight-header.height-32;
    const slots=[...document.querySelectorAll('[data-image-slot]')].map(e=>({kind:e.dataset.imageSlot,height:e.getBoundingClientRect().height,width:e.getBoundingClientRect().width,clipped:e.scrollHeight>e.clientHeight+1}));
    const lum=color=>{const c=(color.match(/[\d.]+/g)||[]).slice(0,3).map(Number).map(x=>x/255).map(x=>x<=.04045?x/12.92:((x+.055)/1.055)**2.4);return c[0]*.2126+c[1]*.7152+c[2]*.0722;};
    const contrast=[...document.querySelectorAll('#seguranca h2,#seguranca .trust-intro,#seguranca .trust-heading>p,#seguranca .reading-panel-body p,#seguranca summary strong')].filter(e=>e.getBoundingClientRect().height).map(e=>{let a=e;while(a&&getComputedStyle(a).backgroundColor==='rgba(0, 0, 0, 0)')a=a.parentElement;const fg=lum(getComputedStyle(e).color),bg=lum(a?getComputedStyle(a).backgroundColor:'rgb(255,255,255)');return(Math.max(fg,bg)+.05)/(Math.min(fg,bg)+.05);});
    return{available,slots,contrast,overflow:document.documentElement.scrollWidth>innerWidth+1};
   });
   assert(!state.overflow,slug+' '+width+' overflow');assert.equal(state.slots.length,2);
   assert(state.contrast.every(r=>r>=4.5),slug+' dark section text contrast');
   if(width<700)for(const slot of state.slots)assert(slot.height<=state.available&&!slot.clipped,`${slug} ${width}: ${slot.kind} ${slot.height}px must fit ${state.available}px`);
   if(['root','imovel-fivecred','lp-venda-carta-contemplada'].includes(slug)&&width!==1280){
    const dir=path.join(root,'tests/screenshots');
    await page.screenshot({path:path.join(dir,`brand-${slug}-${width}-hero.png`)});
    for(const id of ['sobre','seguranca']){await page.locator('#'+id).evaluate(e=>e.scrollIntoView({block:'start',behavior:'instant'}));await page.screenshot({path:path.join(dir,`brand-${slug}-${width}-${id}.png`)});}
   }
   if(width<1280){
    const facts=page.locator('.product-facts [data-reading-panel]');assert.equal(await facts.count(),2);
    await facts.first().locator('summary').click();await page.waitForTimeout(60);
    assert.equal(await page.locator('.product-facts [open]').count(),1);
    await facts.last().locator('summary').click();await page.waitForTimeout(60);
    assert.equal(await page.locator('.product-facts [open]').count(),1);
    const b=await facts.last().boundingBox();const nav=await page.locator('.header').boundingBox();assert(b.y>=nav.height-1&&b.y+b.height<=height,'Opened benefit fits');
    const steps=page.locator('.process-list [data-reading-panel]');
    if(await steps.count()){await steps.first().locator('summary').click();await page.waitForTimeout(60);assert.equal(await page.locator('.product-facts [open]').count(),1,'Independent topic groups');assert.equal(await page.locator('.process-list [open]').count(),1);await steps.last().locator('summary').focus();await page.keyboard.press('Enter');await page.waitForTimeout(60);assert.equal(await page.locator('.process-list [open]').count(),1,'Keyboard and one open step');}
   }
   // Simulate a supplied image to check its allocated space; no fixture is saved or published.
   await page.locator('[data-image-slot="team"]').evaluate(e=>{e.classList.add('has-image');e.replaceChildren();const img=document.createElement('img');img.src='/shared/assets/logo-navbar.png';img.alt='Layout test';e.append(img);});
   const imageState=await page.evaluate(()=>({section:document.querySelector('#seguranca').getBoundingClientRect().height,slot:document.querySelector('[data-image-slot="team"]').getBoundingClientRect().height}));
   assert(imageState.slot>0,'Supplied image reserves space');
   if(width>=1280)assert(imageState.section<=state.available+8,'Photo must not stretch desktop trust section');
   else assert(imageState.slot<=state.available,'Photo fits compact screen');
   checks.push({slug,width,height});
  }
  assert.deepEqual(errors,[]);
  const report={result:'PASS',pages:manifest.length+1,viewportChecks:checks.length,markedSlots:22,forms:'Original markup and submission scripts verified separately',darkTextContrast:'At least 4.5:1',mobileTopics:'Touch, keyboard and independent groups',suppliedImages:'Reserved space preserved',errors};
  fs.writeFileSync(path.join(root,'tests/brand-refresh-browser-results.json'),JSON.stringify(report,null,2));console.log(JSON.stringify(report,null,2));
 }finally{await browser.close();await new Promise(r=>server.close(r));}
})().catch(e=>{console.error(e);process.exit(1)});
