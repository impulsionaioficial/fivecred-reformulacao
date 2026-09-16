'use strict';
// Local-only behavioral regression tests. All outgoing transports are mocked/blocked.
require('./build-original-static-forms.cjs');
const assert=require('node:assert/strict');
const fs=require('node:fs');const path=require('node:path');const vm=require('node:vm');
const {JSDOM}=require('C:/Users/auror/Downloads/fivecred.com.br-main/node_modules/jsdom');
const {renderOriginalStaticForm,originalStaticFormAssets,staticFormSlugs}=require('./original-static-forms.cjs');
const root=path.resolve(__dirname,'..');const sourceRoot=path.resolve(root,'..');
let checks=0;const results=[];
const check=(condition,message)=>{assert.ok(condition,message);checks++;};
const getText=el=>el?.innerText??el?.textContent??'';
function descriptors(d){return [...d.querySelector('form').querySelectorAll('input,select,textarea')].map(el=>({tag:el.tagName,id:el.getAttribute('id'),name:el.getAttribute('name'),type:el.type,required:el.required,min:el.getAttribute('min'),max:el.getAttribute('max'),maxLength:el.getAttribute('maxlength'),value:el.getAttribute('value'),options:el.options?[...el.options].map(o=>({value:o.value,label:o.textContent})):null}));}
function snapshot(w){return {fields:[...w.document.querySelectorAll('input,select')].map(el=>({id:el.id,value:el.value,required:el.required})),steps:[...w.document.querySelectorAll('form [id^=step-]')].map(el=>({id:el.id,hidden:el.classList.contains('hidden')||el.classList.contains('opacity-0')})),errors:[...w.document.querySelectorAll('p[id^=error-]')].map(el=>({id:el.id,text:getText(el).replaceAll('O benefício do INSS não pode ser menor que o salário mínimo (R$ 1.412,00).','O valor mínimo usado nesta simulação ilustrativa é R$ 1.412,00.').replaceAll('excede o limite legal de','excede o limite usado nesta simulação de'),hidden:el.classList.contains('hidden')})),result:[...w.document.querySelectorAll('[id^=res-]')].map(el=>({id:el.id,text:getText(el)}))};}
async function build(slug,original){
 const source=fs.readFileSync(path.join(sourceRoot,slug,'index.html'),'utf8');
 const dom=new JSDOM(original?source:renderOriginalStaticForm(slug),{url:'http://localhost.invalid/',runScripts:'outside-only'});
 const w=dom.window;
 await new Promise(resolve=>w.document.readyState==='loading'?w.document.addEventListener('DOMContentLoaded',resolve,{once:true}):resolve());
 w.__alerts=[];w.__timers=[];w.alert=msg=>w.__alerts.push(msg);w.setTimeout=fn=>w.__timers.push(fn);
 w.open=()=>{throw new Error('External navigation attempted');};w.fetch=()=>{throw new Error('Network submission attempted');};w.XMLHttpRequest=function(){throw new Error('XHR attempted');};
 if(original){
  const campaign=slug==='fivecred-landing-page';
  let script=[...w.document.scripts].map(s=>s.textContent).find(s=>campaign?s.includes('const maskCPF'):s.includes('function clearErrors'));
  if(campaign)script=script.slice(script.indexOf('const maskCPF'),script.indexOf('// Mobile Menu Toggle'));
  else script=script.slice(script.indexOf(slug==='imovel-fivecred'?'const formFields':'function clearErrors'),script.indexOf(slug==='veiculo-fivecred'?'// Intersection Observer':'// FAQ Toggle'));
  w.__ready=[];w.__onReady=fn=>w.__ready.push(fn);
  script=script.replaceAll("document.addEventListener('DOMContentLoaded',",'window.__onReady(');
  vm.runInContext(script,dom.getInternalVMContext());
  for(const el of [w.document.querySelector('form'),...w.document.querySelector('form').querySelectorAll('*')])for(const a of [...el.attributes])if(a.name.startsWith('on')){
   const handler=vm.runInContext('(function(event){'+a.value+'})',dom.getInternalVMContext());
   el.addEventListener(a.name.slice(2),event=>handler.call(el,event));
  }
  w.__ready.forEach(fn=>fn());
 }else{
  const js=fs.readFileSync(path.join(root,originalStaticFormAssets(slug,'').script),'utf8');
  new vm.Script(js);checks++;
  vm.runInContext(js,dom.getInternalVMContext());
 }
 return dom;
}
(async()=>{
 for(const slug of staticFormSlugs){
  const original=await build(slug,true);const restored=await build(slug,false);const pair=[original.window,restored.window];const d=restored.window.document;
  assert.deepEqual(descriptors(d),descriptors(original.window.document),slug+' exact field contract');checks++;
  check(d.querySelectorAll('script,link').length===0,slug+' fragment contains no asset tags');
  check(![...d.querySelectorAll('*')].some(el=>[...el.attributes].some(a=>a.name.startsWith('on'))),slug+' no inline script handlers');
  const input=(id,value)=>pair.forEach(w=>{const el=w.document.getElementById(id);el.value=value;el.dispatchEvent(new w.Event('input',{bubbles:true}));});
  const change=(id,value)=>pair.forEach(w=>{const el=w.document.getElementById(id);el.value=value;el.dispatchEvent(new w.Event('change',{bubbles:true}));});
  const click=index=>pair.forEach(w=>w.document.querySelector('form').querySelectorAll('button')[index].click());
  const equal=label=>{assert.deepEqual(snapshot(pair[1]),snapshot(pair[0]),slug+': '+label);checks++;};
  if(slug==='fivecred-landing-page'){
   input('cpf','52998224725');input('whatsapp','11912345678');
   equal('campaign masks');
   pair.forEach(w=>{w.document.querySelector('form input').value='Pessoa Teste';w.document.getElementById('fgts').checked=true;w.document.querySelector('form').dispatchEvent(new w.Event('submit',{bubbles:true,cancelable:true}));});
   check(pair[1].__timers.length===1,'Campaign uses original local delay');
   pair.forEach(w=>w.__timers.forEach(fn=>fn()));
   check(pair[1].__alerts.length===1&&pair[1].__alerts[0].includes('não foram enviados'),'Campaign confirms local-only behavior');
   equal('campaign form reset');
   results.push({slug,passed:true,transport:'local alert; no requests',scenarios:['field parity','masks','submit delay','local-only feedback','reset']});
  }else{
   click(0);equal('empty personal data rejected');check(!d.getElementById('step-1').classList.contains('hidden'),'Empty cannot advance');
   input('nome','Pessoa Teste');input('whatsapp','11912345678');input('cpf','52998224725');input('email','teste@example.invalid');
   if(d.getElementById('nascimento'))input('nascimento','01011980');
   if(d.getElementById('cep')){input('cep','01001000');input('endereco','Rua de Teste, 123');}
   equal('personal masks match source');
   if(slug==='imovel-fivecred'){
    input('cpf','11111111111');click(0);equal('invalid CPF rejected');check(!d.getElementById('error-cpf').classList.contains('hidden'),'CPF algorithm retained');
    input('cpf','52998224725');input('nascimento','31022000');click(0);equal('invalid calendar date rejected');
    input('nascimento','01012020');click(0);equal('underage rejected');input('nascimento','01011980');
   }
   click(0);equal('advance to product fields');
   const calcIndex=slug==='veiculo-fivecred'?2:2;
   click(calcIndex);equal('empty product fields rejected');
   let expectedCredit;
   if(slug==='bolsa-fivecred'){
    input('nis','12345678901');input('valor_beneficio','59900');click(calcIndex);equal('benefit below 600 rejected');
    input('valor_beneficio','60000');click(calcIndex);expectedCredit=1500;
   }
   if(slug==='luz-fivecred'){
    input('codigo_cliente','123456');input('valor_conta','7900');click(calcIndex);equal('bill below 80 rejected');
    change('distribuidora','cemig');input('valor_conta','30000');click(calcIndex);expectedCredit=2500;
   }
   if(slug==='consignado-fivecred'){
    input('valor_beneficio','200000');change('tipo_beneficio','bpc');equal('BPC margin 30 percent');
    check(d.getElementById('valor_margem').value.includes('600,00'),'BPC margin amount');
    input('valor_margem','70000');click(calcIndex);equal('margin exceeds allowed fraction rejected');
    change('opcao_margem','portabilidade');equal('portability hides optional margin');check(!d.getElementById('valor_margem').required,'Portability margin optional');
    change('opcao_margem','margem_livre');change('tipo_beneficio','aposentado');equal('retired margin 35 percent');
    click(calcIndex);expectedCredit=700*45.228;
   }
   if(slug==='imovel-fivecred'){
    input('valor_imovel','50000000');input('localidade','São Paulo / SP');change('situacao_imovel','financiado');equal('financing reveals required debt');
    check(d.getElementById('saldo_devedor').required,'Financing debt required');
    input('saldo_devedor','35000000');click(calcIndex);equal('debt consumes collateral rejected');
    input('saldo_devedor','10000000');click(calcIndex);expectedCredit=200000;
   }
   if(slug==='veiculo-fivecred'){
    input('modelo','Onix 1.0');input('placa','ABC1D23');input('valor_estimado','5000000');input('uf_cidade','SP / São Paulo');input('ano','2004');
    click(calcIndex);equal('vehicle below year bound rejected');input('ano','2020');change('financiamento','sim');click(calcIndex);expectedCredit=35000;
   }
   equal('successful formula and navigation parity');
   const resultId=slug==='veiculo-fivecred'?'res-max-value':'res-credito';
   assert.equal(getText(d.getElementById(resultId)),expectedCredit.toLocaleString('pt-BR',{style:'currency',currency:'BRL'}),slug+' independent expected credit');checks++;
   const link=d.querySelector('#btn-envio-whatsapp,#btn-proposal');const baseLink=original.window.document.querySelector('#btn-envio-whatsapp,#btn-proposal');
   const url=new URL(link.href);check(url.origin==='https://wa.me'&&url.pathname==='/5511989956521','Exact source destination retained');
   const actual=url.searchParams.get('text');const expected=new URL(baseLink.href).searchParams.get('text').replaceAll('*Crédito Pré-Aprovado:*','*Crédito Estimado:*');
   assert.equal(actual,expected,slug+' original message fields');checks++;
   check(actual.includes('529.982.247-25')&&actual.includes('Pessoa Teste'),'Original contact payload included');
   check(d.querySelector('#step-3').getAttribute('aria-hidden')==='false','Result accessible after calculation');
   if(slug!=='veiculo-fivecred'){click(3);equal('adjust product data');click(1);equal('return personal data retained');}
   results.push({slug,passed:true,transport:'WhatsApp URL prepared only; never opened',expectedCredit,scenarios:['field parity','empty validations','input masks','product-specific boundaries','calculations','step navigation','exact destination/message','inactive step accessibility']});
  }
  original.window.close();restored.window.close();
 }
 const report={passed:true,checks,externalRequests:0,externalNavigations:0,results};
 fs.writeFileSync(path.join(__dirname,'original-static-form-test-results.json'),JSON.stringify(report,null,2));
 console.log(JSON.stringify(report,null,2));
})().catch(error=>{console.error(error);process.exitCode=1;});

