const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const {JSDOM}=require('C:/Users/auror/Downloads/fivecred.com.br-main/node_modules/jsdom');
const sourcePath=path.join(__dirname,'../shared/seller-carousel.js');
const source=fs.existsSync(sourcePath)?fs.readFileSync(sourcePath,'utf8'):'';
function boot({reduced=false,count=3}={}){
 const dom=new JSDOM(`<section data-seller-carousel data-interval="8000"><div data-banner-viewport aria-live="off">${Array.from({length:count},(_,i)=>`<div data-banner-slide data-title="Arte ${i+1}" ${i?'hidden':''}>Arte ${i+1}</div>`).join('')}</div></section>`,{runScripts:'outside-only',url:'http://127.0.0.1:4174/'});
 const w=dom.window,root=w.document.querySelector('[data-seller-carousel]');
 let now=0,id=0,hidden=false,observer;const timers=new Map(),calls=[];
 w.setTimeout=(fn,ms)=>{timers.set(++id,{fn,due:now+ms});return id;};w.clearTimeout=id=>timers.delete(id);
 Object.defineProperty(w.document,'hidden',{get:()=>hidden});
 const media=new w.EventTarget();media.matches=reduced;w.matchMedia=()=>media;
 w.IntersectionObserver=class{constructor(callback){observer=callback;}observe(){}disconnect(){}};
 for(const name of ['fetch','XMLHttpRequest','open'])w[name]=()=>{calls.push(name);throw new Error('No external action');};
 w.eval(source);w.document.dispatchEvent(new w.Event('DOMContentLoaded'));
 const q=s=>root.querySelector(s),click=s=>q('[data-banner-'+s+']').click();
 return {dom,w,root,timers,calls,q,click,active:()=>[...root.querySelectorAll('[data-banner-slide]')].findIndex(el=>!el.hidden),
 tick(ms){const end=now+ms;for(let i=0;i<100;i++){const next=[...timers].sort((a,b)=>a[1].due-b[1].due)[0];if(!next||next[1].due>end)break;now=next[1].due;timers.delete(next[0]);next[1].fn();}now=end;},
 visible(value){hidden=!value;w.document.dispatchEvent(new w.Event('visibilitychange'));},
 intersect(value){observer?.([{isIntersecting:value}]);},
 reduce(value){media.matches=value;media.dispatchEvent(new w.Event('change'));},
 pointer(type,x,y,target=q('[data-banner-viewport]')){const e=new w.Event(type,{bubbles:true});Object.assign(e,{pointerType:'touch',clientX:x,clientY:y});target.dispatchEvent(e);}
 };
}
test('rotates automatically every eight seconds without rendering controls',()=>{
 const ui=boot();assert.equal(ui.root.querySelector('button'),null);assert.equal(ui.active(),0);ui.tick(7999);assert.equal(ui.active(),0);ui.tick(1);assert.equal(ui.active(),1);ui.tick(16000);assert.equal(ui.active(),0);assert.equal(ui.q('[data-banner-viewport]').getAttribute('aria-live'),'off');assert.equal(ui.timers.size,1);assert.deepEqual(ui.calls,[]);ui.dom.window.close();
});
test('hover, hidden tabs and off-screen banners suspend and resume the timer',()=>{
 const ui=boot();ui.root.dispatchEvent(new ui.w.Event('mouseenter'));assert.equal(ui.timers.size,0);ui.root.dispatchEvent(new ui.w.Event('mouseleave'));assert.equal(ui.timers.size,1);ui.visible(false);assert.equal(ui.timers.size,0);ui.visible(true);assert.equal(ui.timers.size,1);ui.intersect(false);assert.equal(ui.timers.size,0);ui.intersect(true);assert.equal(ui.timers.size,1);ui.tick(8000);assert.equal(ui.active(),1);ui.dom.window.close();
});
test('reduced motion keeps the banner static and responds to preference changes',()=>{
 const ui=boot({reduced:true});assert.equal(ui.timers.size,0);ui.tick(24000);assert.equal(ui.active(),0);ui.reduce(false);assert.equal(ui.timers.size,1);ui.tick(8000);assert.equal(ui.active(),1);ui.reduce(true);assert.equal(ui.timers.size,0);ui.dom.window.close();
});
test('a single banner remains static',()=>{
 const ui=boot({count:1});assert.equal(ui.active(),0);assert.equal(ui.timers.size,0);ui.dom.window.close();
});
test('empty banners do not start a timer',()=>{
 const ui=boot({count:0});assert.equal(ui.active(),-1);assert.equal(ui.timers.size,0);ui.dom.window.close();
});
test('initialization is idempotent',()=>{
 const ui=boot();ui.w.document.dispatchEvent(new ui.w.Event('DOMContentLoaded'));assert.equal(ui.timers.size,1);ui.tick(8000);assert.equal(ui.active(),1);ui.dom.window.close();
});
test('interacting with the lead form stops rotation even after visibility changes',()=>{
 const ui=boot();const form=ui.w.document.createElement('form');form.setAttribute('data-journey','');const input=ui.w.document.createElement('input');form.append(input);ui.w.document.body.append(form);input.focus();assert.equal(ui.timers.size,0);ui.visible(false);ui.visible(true);ui.reduce(false);ui.tick(16000);assert.equal(ui.active(),0);ui.dom.window.close();
});
test('generated banner markup contains artwork slots without interactive controls',()=>{
 const render=require('../work/seller-banner.cjs');const html=render({prefix:'../',icon:()=>'<svg></svg>',esc:s=>String(s)});const dom=new JSDOM(html);const banner=dom.window.document.querySelector('[data-seller-carousel]');assert.ok(banner);assert.equal(banner.querySelectorAll('button,[data-banner-controls],[data-banner-count],[tabindex]').length,0);assert.equal(banner.querySelectorAll('[data-banner-slide]').length,3);dom.window.close();
});
