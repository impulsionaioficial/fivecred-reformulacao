const fs=require('node:fs');
const path=require('node:path');
const http=require('node:http');
const assert=require('node:assert/strict');
const {chromium}=require('C:/Users/auror/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const root=path.resolve(__dirname,'..');
const pages=JSON.parse(fs.readFileSync(path.join(root,'work/pages-manifest.json')));
(async()=>{
const server=http.createServer((req,res)=>{const f=path.resolve(root,'.'+decodeURIComponent(req.url.split('?')[0]));if(!f.startsWith(root+path.sep)){res.writeHead(403);return res.end();}fs.readFile(f,(err,data)=>{if(err){res.writeHead(404);return res.end();}const ext=path.extname(f);res.setHeader('Content-Type',({'.html':'text/html; charset=utf-8','.css':'text/css','.js':'text/javascript','.png':'image/png','.jpg':'image/jpeg','.jpeg':'image/jpeg','.webp':'image/webp','.svg':'image/svg+xml','.woff2':'font/woff2'})[ext]||'application/octet-stream');res.end(data);});});
await new Promise(r=>server.listen(0,'127.0.0.1',r));const base='http://127.0.0.1:'+server.address().port;
const browser=await chromium.launch({executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe',headless:true});
const ctx=await browser.newContext();let blocked=[];const rows=[];
await ctx.route('**/*',r=>{const u=new URL(r.request().url());if(u.hostname==='127.0.0.1')return r.continue();blocked.push({url:u.href,method:r.request().method()});return r.abort();});
await ctx.addInitScript(()=>{window.open=(url)=>{window.__opened=url;return null;};});
try{
for(const info of pages){const page=await ctx.newPage();const errors=[];page.on('pageerror',e=>errors.push(e.message));page.on('console',m=>{if(m.type()==='error')errors.push(m.text());});
for(const width of [320,390,768,1440]){await page.setViewportSize({width,height:960});await page.goto(base+'/'+info.slug+'/index.html?v=standardization-qa',{waitUntil:'networkidle'});await page.evaluate(()=>document.fonts.ready);if(['fivecred-next','fivecred-afiliados','contemplada.fivecred.com.br'].includes(info.slug))await page.waitForFunction(()=>document.querySelector('[data-connected-form]')?.dataset.formReady==='true');
const row=await page.evaluate(()=>{const logo=document.querySelector('.header .logo img'),nav=document.querySelector('.header'),form=document.querySelector('#simulacao');return{width:innerWidth,scrollWidth:document.documentElement.scrollWidth,navHeight:nav.getBoundingClientRect().height,logoSrc:logo.getAttribute('src'),logoWidth:logo.getBoundingClientRect().width,logoLoaded:logo.complete&&logo.naturalWidth===672,formWidth:form?.getBoundingClientRect().width,forms:document.querySelectorAll('form').length,missingImages:[...document.images].filter(i=>i.loading!=='lazy'&&(!i.complete||!i.naturalWidth)).map(i=>i.src),overflow:[...document.querySelectorAll('main *')].filter(e=>{const r=e.getBoundingClientRect();return r.width>0&&(r.right>innerWidth+1||r.left < -1)&&getComputedStyle(e).position!=='absolute';}).slice(0,12).map(e=>[e.tagName,e.className,e.getBoundingClientRect().width])};});
row.slug=info.slug;rows.push(row);assert(row.scrollWidth<=width+1,JSON.stringify(row));assert(row.logoLoaded,info.slug+' official logo');assert.equal(row.navHeight,width<600?75:width<960?83:91,info.slug+' navbar height');assert.equal(row.missingImages.length,0,info.slug+' images '+row.missingImages.join(','));
if([390,1440].includes(width)){await page.screenshot({path:path.join(root,'tests/screenshots',`standard-${info.slug}-${width}.png`)});if(width===390){await page.locator('#simulacao').scrollIntoViewIfNeeded();await page.screenshot({path:path.join(root,'tests/screenshots',`standard-${info.slug}-form-${width}.png`)});}}
}
assert.equal(errors.length,0,info.slug+': '+errors.join('\n'));await page.close();console.log('PASS '+info.slug);}
assert.equal(blocked.length,0,'Unexpected outgoing requests on page load');
fs.writeFileSync(path.join(root,'tests/standardization-browser-results.json'),JSON.stringify({result:'PASS',count:rows.length,blocked,rows},null,2));
}finally{await browser.close();await new Promise(r=>server.close(r));}
})().catch(e=>{console.error(e);process.exit(1)});
