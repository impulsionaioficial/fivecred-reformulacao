const fs=require('node:fs');
const path=require('node:path');
const assert=require('node:assert/strict');
const crypto=require('node:crypto');
const {chromium}=require('C:/Users/auror/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const root=path.resolve(__dirname,'..');
(async()=>{
 const browser=await chromium.launch({executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe',headless:true});
 const errors=[],external=[],failed=[];const url='http://127.0.0.1:4174/lp-venda-carta-contemplada/index.html';
 const watch=p=>{p.on('pageerror',e=>errors.push(e.message));p.on('request',r=>{if(!r.url().startsWith('http://127.0.0.1:4174/')&&!r.url().startsWith('data:'))external.push(r.url());});p.on('requestfailed',r=>failed.push(r.url()));};
 try{
  const layouts=[];
  for(const width of [320,390,534,768,1440]){
   const page=await browser.newPage({viewport:{width,height:1000}});watch(page);await page.goto(url);await page.evaluate(()=>document.fonts.ready);
   const result=await page.evaluate(()=>{
    const banner=document.querySelector('.s-banner'),form=document.querySelector('.s-hero-form'),header=document.querySelector('.header');
    const b=banner.getBoundingClientRect(),f=form.getBoundingClientRect(),h=header.getBoundingClientRect();
    return {width:innerWidth,bannerWidth:b.width,bannerX:b.x,belowHeader:Math.abs(b.top-h.bottom)<1,formBelow:f.top>=b.bottom,controls:banner.querySelectorAll('button,[data-banner-controls],[data-banner-count],[tabindex]').length,overflow:document.documentElement.scrollWidth>innerWidth,formY:f.y};
   });
   assert.equal(result.bannerWidth,width);assert.equal(result.bannerX,0);assert.ok(result.belowHeader);assert.ok(result.formBelow);assert.equal(result.controls,0);assert.equal(result.overflow,false);layouts.push(result);
   if(width===390||width===1440)await page.screenshot({path:path.join(root,`tests/seller-wide-banner-${width}.png`)});
   await page.close();
  }
  const page=await browser.newPage({viewport:{width:1440,height:1000}});watch(page);await page.goto(url);
  const reduced=await browser.newPage({viewport:{width:390,height:1000},reducedMotion:'reduce'});watch(reduced);await reduced.goto(url);
  const first=()=>page.locator('[data-banner-slide]:not([hidden])').getAttribute('aria-label');
  const formBefore=await page.locator('.s-hero-form').boundingBox();assert.equal(await first(),'1 de 3');
  await page.waitForFunction(()=>document.querySelector('[data-banner-slide]:not([hidden])').getAttribute('aria-label')==='2 de 3',null,{timeout:10000});
  const formAfter=await page.locator('.s-hero-form').boundingBox();assert.deepEqual(formAfter,formBefore);
  assert.equal(await reduced.locator('[data-banner-slide]:not([hidden])').getAttribute('aria-label'),'1 de 3');
  await page.locator('.j-option').first().focus();const atFocus=await first();await page.clock.install();await page.clock.fastForward(16000);assert.equal(await first(),atFocus);
  const snapshot=JSON.parse(fs.readFileSync(path.join(root,'work/seller-before-wide-banner.json'),'utf8'));
  const changed=Object.entries(snapshot).filter(([name,hash])=>crypto.createHash('sha256').update(fs.readFileSync(path.join(root,name))).digest('hex')!==hash).map(([name])=>name);
  assert.deepEqual(changed,[]);assert.deepEqual(errors,[]);assert.deepEqual(external,[]);assert.deepEqual(failed,[]);
  const report={result:'PASS',layouts,autoplay:true,noControls:true,formStableDuringRotation:true,reducedMotion:true,pauseOnFormFocus:true,sharedFilesAndOtherSitesUnchanged:changed.length===0,errors,external,failed};
  fs.writeFileSync(path.join(root,'tests/seller-wide-banner-browser-results.json'),JSON.stringify(report,null,2));console.log(JSON.stringify(report,null,2));
 }finally{await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});
