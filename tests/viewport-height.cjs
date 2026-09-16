const fs = require('node:fs');
const path = require('node:path');
const http = require('node:http');
const assert = require('node:assert/strict');
const { chromium } = require('C:/Users/auror/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const root = path.resolve(__dirname, '..');
const manifest = JSON.parse(fs.readFileSync(path.join(root, 'work/pages-manifest.json')));
const sizes = [[1280,600], [1366,600], [1440,700], [1024,600], [768,600], [390,667], [375,600], [320,568]];
(async () => {
 const server = http.createServer((req,res) => {
  const url = new URL(req.url, 'http://local');
  const file = path.join(root,'public-site',url.pathname + (url.pathname.endsWith('/') ? 'index.html' : ''));
  fs.readFile(file,(err,data) => {if(err){res.writeHead(404);return res.end();}res.setHeader('Content-Type',({'.html':'text/html; charset=utf-8','.css':'text/css','.js':'text/javascript','.woff2':'font/woff2','.webp':'image/webp','.png':'image/png','.svg':'image/svg+xml'})[path.extname(file)] || 'application/octet-stream');res.end(data);});
 });
 await new Promise(r => server.listen(0,'127.0.0.1',r));
 const base = 'http://127.0.0.1:' + server.address().port;
 const browser = await chromium.launch({executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe',headless:true});
 const context = await browser.newContext({reducedMotion:'reduce'});
 await context.route('**/*',route => new URL(route.request().url()).hostname === '127.0.0.1' ? route.continue() : route.abort());
 const page = await context.newPage();
 const errors = [], rows = [];
 page.on('pageerror',e => errors.push(e.message));
 try {
  for (const slug of ['root',...manifest.map(p=>p.slug)]) for (const [width,height] of sizes) {
   await page.setViewportSize({width,height});
   await page.goto(base + (slug === 'root' ? '/' : '/' + slug + '/index.html'));
   await page.evaluate(() => document.fonts.ready);
   const trust = page.locator('#seguranca');
   await trust.evaluate(el => el.scrollIntoView({block:'start',behavior:'instant'}));
   const measurements = await page.evaluate(() => {
    const header = document.querySelector('.header').getBoundingClientRect();
    const section = document.querySelector('#seguranca');
    const r = section.getBoundingClientRect();
    const units = [...section.querySelectorAll('.trust-heading,.brand-placeholder,.s-team-placeholder,.trust-points>li,.s-trust-list>li')];
    return {available: innerHeight-header.bottom-24,sectionHeight:r.height,sectionTop:r.top,headerBottom:header.bottom,units:units.map(el=>({type:el.className||el.tagName,height:el.getBoundingClientRect().height,hidden:el.scrollHeight>el.clientHeight+1&&['hidden','clip','scroll','auto'].includes(getComputedStyle(el).overflowY)})),overflow:document.documentElement.scrollWidth>innerWidth+1};
   });
   assert(!measurements.overflow,slug+' '+width+' horizontal overflow');
   if (width >= 1280) assert(measurements.sectionHeight <= measurements.available, `${slug} ${width}x${height}: complete trust block ${measurements.sectionHeight}px must fit ${measurements.available}px`);
   else {
    const panels=trust.locator('[data-reading-panel]');
    assert.equal(await panels.count(),3,'Three mobile topics');
    assert.equal(await trust.locator('[data-reading-panel][open]').count(),0,'Mobile topics initially collapsed');
    for(let i=0;i<3;i++){
     await panels.nth(i).locator('summary').click();
     await page.waitForTimeout(80);
     assert.equal(await trust.locator('[data-reading-panel][open]').count(),1,'One topic expanded at a time');
     const b=await panels.nth(i).boundingBox();
     assert(b.y>=measurements.headerBottom-1&&b.y+b.height<=height, 'Expanded topic visible without further scrolling');
     const group=await trust.locator('.trust-points,.s-trust-list').boundingBox();
     assert(group.height<=measurements.available&&group.y>=measurements.headerBottom-1&&group.y+group.height<=height,'Complete topic group fits after expansion');
     if(slug==='root'&&width===390&&i===0)await page.screenshot({path:path.join(root,'tests/screenshots/viewport-mobile-topics-open.png')});
    }
    await panels.last().locator('summary').focus();
    await page.keyboard.press('Enter');
    assert.equal(await trust.locator('[data-reading-panel][open]').count(),0,'Keyboard closes topic');
    assert(measurements.units.length >= 5, 'Mobile content must be split into meaningful complete blocks');
    for(const unit of measurements.units) assert(unit.height <= measurements.available&&!unit.hidden, `${slug} ${width}x${height}: ${unit.type} ${unit.height}px must fit ${measurements.available}px without clipping`);
   }
   assert(measurements.sectionTop>=measurements.headerBottom, 'Anchor below navigation');
   for(const selector of ['.trust-heading','.brand-placeholder','.s-team-placeholder','.trust-points>li','.s-trust-list>li']) {
    const units=page.locator('#seguranca '+selector);
    for(let i=0;i<await units.count();i++) {
     await units.nth(i).evaluate(el=>el.scrollIntoView({block:'start',behavior:'instant'}));
     const b=await units.nth(i).boundingBox();
     assert(b.y>=measurements.headerBottom-1&&b.y+b.height<=height, `${slug} ${width}x${height}: ${selector} completely visible when aligned`);
    }
   }
   rows.push({slug,width,height,...measurements});
   if(['root','lp-venda-carta-contemplada'].includes(slug)&&[1280,390,320].includes(width)) {
    await trust.evaluate(el=>el.scrollIntoView({block:'start',behavior:'instant'}));
    await page.screenshot({path:path.join(root,'tests/screenshots',`viewport-${slug}-${width}x${height}.png`)});
   }
  }
  assert.deepEqual(errors,[]);
  const report={result:'PASS',viewports:sizes,pages:manifest.length+1,checks:rows.length,desktop:'Complete trust section fits below navigation',mobile:'Native touch/keyboard disclosure; one topic expanded; whole topic group fits below navigation',errors};
  fs.writeFileSync(path.join(root,'tests/viewport-height-results.json'),JSON.stringify(report,null,2));
  console.log(JSON.stringify(report,null,2));
 } finally {await browser.close();await new Promise(r=>server.close(r));}
})().catch(e=>{console.error(e);process.exit(1);});
