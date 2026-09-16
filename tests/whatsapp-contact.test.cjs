const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');
const {JSDOM}=require('C:/Users/auror/Downloads/fivecred.com.br-main/node_modules/jsdom');
const root=path.resolve(__dirname,'..');
(async()=>{
const dom=new JSDOM(fs.readFileSync(path.join(root,'fivecred-next/index.html'),'utf8'),{url:'http://127.0.0.1:4174/fivecred-next/index.html',runScripts:'outside-only',pretendToBeVisual:true});const w=dom.window,d=w.document;await new Promise(r=>d.readyState==='loading'?d.addEventListener('DOMContentLoaded',r,{once:true}):r());
w.HTMLDialogElement.prototype.showModal=function(){this.open=true;};w.HTMLDialogElement.prototype.close=function(){this.open=false;this.dispatchEvent(new w.Event('close'));};const opens=[];w.open=(...args)=>{opens.push(args);return null;};w.fetch=()=>{throw Error('Unexpected lead submission');};w.HTMLElement.prototype.scrollIntoView=function(){};
for(const file of ['shared/whatsapp-contact.js','shared/site.js'])if(fs.existsSync(path.join(root,file)))w.eval(fs.readFileSync(path.join(root,file),'utf8'));
const trigger=d.querySelector('.header [data-whatsapp]');trigger.focus();trigger.click();
const modal=d.querySelector('#whatsapp-contact-dialog');assert(modal?.open,'WhatsApp must request name and email before opening a conversation');
const form=modal.querySelector('form'),name=modal.querySelector('[name=nome]'),email=modal.querySelector('[name=email]');const submit=()=>form.dispatchEvent(new w.Event('submit',{bubbles:true,cancelable:true}));
assert.equal(opens.length,0);submit();assert.equal(name.getAttribute('aria-invalid'),'true');assert.equal(email.getAttribute('aria-invalid'),'true');assert.equal(opens.length,0);
name.value='Ana';email.value='invalid';submit();assert.equal(opens.length,0);email.value='ana@example.com';submit();assert.equal(opens.length,1);assert.match(opens[0][0],/^https:\/\/wa.me\/5511980797255\?text=/);const first=new URL(opens[0][0]).searchParams.get('text');assert(first.includes('Nome: Ana'));assert(first.includes('E-mail: ana@example.com'));assert(!modal.open);
assert.equal(w.localStorage.length,0);assert.equal(w.sessionStorage.length,0);
trigger.click();modal.querySelector('[data-wa-close]').click();assert(!modal.open);assert.equal(d.activeElement,trigger);assert.equal(opens.length,1);
const block=d.createElement('form');block.innerHTML='<input name="nome" value="Maria"><input type="email" value="maria@example.com"><a href="https://wa.me/5511989956521?text=Resumo%20da%20simula%C3%A7%C3%A3o" target="_blank">WhatsApp original</a>';d.body.append(block);const link=block.querySelector('a');link.click();assert(modal.open);assert.equal(name.value,'Maria');assert.equal(email.value,'maria@example.com');submit();assert.equal(opens.length,2);assert.match(opens[1][0],/^https:\/\/wa.me\/5511989956521\?/);assert(new URL(opens[1][0]).searchParams.get('text').includes('Resumo da simulação'));
w.dispatchEvent(new w.CustomEvent('fivecred:whatsapp',{detail:{url:'https://wa.me/5511961614215?text=Minha%20carta',name:'Carlos'}}));assert(modal.open);assert.equal(name.value,'Carlos');assert.equal(email.value,'');email.value='carlos@example.com';submit();assert.equal(opens.length,3);assert(new URL(opens[2][0]).searchParams.get('text').includes('Minha carta'));
assert(!w.FivecredWhatsApp.open({url:'https://example.com/?text=nao'}),'Only WhatsApp destinations are accepted');assert.equal(opens.length,3);
dom.window.close();console.log('PASS WhatsApp contact: required fields, validation, original destination/context, prefill, cancel/focus, dynamic links, event route, no persistence or webhook');
})().catch(e=>{console.error(e);process.exit(1)});
