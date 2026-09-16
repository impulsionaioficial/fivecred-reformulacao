const fs=require('node:fs');
const path=require('node:path');
const assert=require('node:assert/strict');
const {JSDOM}=require('C:/Users/auror/Downloads/fivecred.com.br-main/node_modules/jsdom');
const postcss=require('C:/Users/auror/Downloads/fivecred.com.br-main/node_modules/postcss');
const root=path.resolve(__dirname,'..');
const manifest=JSON.parse(fs.readFileSync(path.join(root,'work/pages-manifest.json'),'utf8'));
const read=(file)=>fs.readFileSync(path.join(root,file),'utf8');
const files=['index.html','conteudos/index.html',...manifest.flatMap(p=>[p.slug+'/index.html',p.slug+'/politica-de-privacidade.html',p.slug+'/termos-de-uso.html',...p.aliases.map(a=>p.slug+'/'+a)])];
let anchors=0,assets=0;
for(const file of files){
 const d=new JSDOM(read(file),{url:'http://127.0.0.1:4174/'+file}).window.document;
 assert.equal(d.querySelectorAll('h1').length,1,file+' h1');
 assert(d.querySelector('meta[name=description]')?.content,file+' description');
 assert(d.querySelector('meta[name=robots]')?.content.includes('noindex'));
 const ids=[...d.querySelectorAll('[id]')].map(el=>el.id);assert.equal(new Set(ids).size,ids.length,file+' ids');
 for(const el of d.querySelectorAll('[aria-controls],[aria-labelledby],[aria-describedby]'))for(const attr of ['aria-controls','aria-labelledby','aria-describedby'])for(const id of (el.getAttribute(attr)||'').split(/\s+/).filter(Boolean))assert(d.getElementById(id),file+' missing '+id);
 for(const el of d.querySelectorAll('label[for]'))assert(d.getElementById(el.htmlFor));
 for(const el of d.querySelectorAll('a[href]')){
  const href=el.getAttribute('href');if(/^[a-z]+:/i.test(href))continue;
  const url=new URL(href,'http://127.0.0.1:4174/'+file);const target=path.join(root,decodeURIComponent(url.pathname));
  assert(fs.existsSync(target),file+' missing link '+href);
  if(url.hash){const td=new JSDOM(fs.readFileSync(target,'utf8')).window.document;assert(td.getElementById(url.hash.slice(1)),file+' missing anchor '+href);}
  anchors++;
 }
 for(const el of d.querySelectorAll('[src],link[href]')){
  const src=el.getAttribute('src')||el.getAttribute('href');assert(!/^https?:/i.test(src),file+' external asset '+src);
  const target=path.join(root,decodeURIComponent(new URL(src,'http://127.0.0.1:4174/'+file).pathname));assert(fs.existsSync(target),file+' missing asset '+src);assets++;
 }
 assert(d.querySelector('.floating-whatsapp')?.getAttribute('aria-label'));
}
const css=postcss.parse(read('shared/site.css'));let rules=0;css.walkRules(()=>rules++);
for(const script of ['shared/site.js','shared/journey.js']){new Function(read(script));assert(!/\bfetch\s*\(|XMLHttpRequest|sendBeacon|localStorage|sessionStorage|window\.open\s*\(/.test(read(script)),script+' network/persistence');}
const market=manifest.find(p=>p.type==='marketplace');
const dom=new JSDOM(read(market.slug+'/index.html'),{url:'http://127.0.0.1:4174/'+market.slug+'/index.html',runScripts:'outside-only',pretendToBeVisual:true});const w=dom.window,d=w.document;
w.HTMLDialogElement.prototype.showModal=function(){this.open=true;};w.HTMLDialogElement.prototype.close=function(){this.open=false;this.dispatchEvent(new w.Event('close'));};w.eval(read('shared/whatsapp-contact.js'));w.eval(read('shared/site.js'));d.dispatchEvent(new w.Event('DOMContentLoaded'));
const search=d.querySelector('[name=busca]');search.value='zzzz-nao-existe';search.dispatchEvent(new w.Event('input'));assert.equal(d.querySelectorAll('.listing:not([hidden])').length,0);assert(!d.querySelector('[data-catalog-empty]').hidden);d.querySelector('[data-clear-filters]').click();assert.equal(d.querySelectorAll('.listing:not([hidden])').length,9);
const type=d.querySelector('[name=tipo]');type.value='Apartamento';type.dispatchEvent(new w.Event('input'));assert([...d.querySelectorAll('.listing:not([hidden])')].every(c=>c.dataset.type==='Apartamento'));
d.querySelector('[data-listing]').click();assert(d.getElementById('shared-dialog').open);assert(d.getElementById('dialog-note').textContent.includes('exemplo'));d.getElementById('dialog-whatsapp').click();assert(d.getElementById('whatsapp-contact-dialog').open);assert(d.getElementById('wa-contact-name').required);assert(d.getElementById('wa-contact-email').required);d.querySelector('[data-wa-close]').click();
d.querySelector('[data-close-dialog]').click();assert(!d.getElementById('shared-dialog').open);d.querySelector('.menu-toggle').click();assert(d.getElementById('main-nav').classList.contains('is-open'));d.dispatchEvent(new w.KeyboardEvent('keydown',{key:'Escape'}));assert(!d.getElementById('main-nav').classList.contains('is-open'));dom.window.close();
console.log(JSON.stringify({result:'PASS',pages:files.length,siteCount:manifest.length,localLinks:anchors,assets,cssRules:rules,catalog:'filter, empty state, reset, item detail and WhatsApp contact step passed',navigation:'menu, Escape and dialog passed'},null,2));
