'use strict';
// Extract only the original form DOM and its functional script. Originals are read-only.
const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');
const {JSDOM} = require('C:/Users/auror/Downloads/fivecred.com.br-main/node_modules/jsdom');
const sourceRoot = path.resolve(__dirname,'../..');
const root = path.resolve(__dirname,'..');
const assetsRoot = path.join(root,'shared/original-forms');
fs.mkdirSync(assetsRoot,{recursive:true});
const slugs=['bolsa-fivecred','consignado-fivecred','luz-fivecred','imovel-fivecred','veiculo-fivecred','fivecred-landing-page'];
const forms={};
const contracts=[];
const iconPaths={
 'arrow-right':'M4 12h16m-6-6 6 6-6 6',
 'arrow-left':'M20 12H4m6-6-6 6 6 6',
 'check':'m5 12 4 4L19 6',
 'shield-check':'M12 3 4 6v6c0 5 8 9 8 9s8-4 8-9V6l-8-3Zm-4 9 3 3 5-6',
 'chart-bar-horizontal':'M5 4v16h15M8 7h8M8 12h12M8 17h5',
 'whatsapp-logo':'M20.5 11.6a8.5 8.5 0 0 1-12.4 7.5L3 21l1.8-5.2a8.5 8.5 0 1 1 15.7-4.2ZM8 8c.5 3.8 2.2 5.6 6 7l2-2-2-1-1 1-2-2 1-1-1-2Z',
 'info':'M12 11v6m0-10v.1M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z',
 'warning':'m12 3 10 18H2L12 3Zm0 6v5m0 3v.1',
 'paper-plane-right':'m3 3 18 9-18 9 3-9-3-9Zm3 9h15',
 'caret-down':'m6 9 6 6 6-6'
};
function iconHTML(className){
 const key=Object.keys(iconPaths).find(k=>className.split(/\s+/).includes('ph-'+k))||'info';
 return `<svg class="of-icon" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="${iconPaths[key]}"></path></svg>`;
}
function fieldContract(el){return {tag:el.tagName.toLowerCase(),id:el.getAttribute('id'),name:el.getAttribute('name'),type:el.type,required:el.required,min:el.getAttribute('min'),max:el.getAttribute('max'),maxLength:el.getAttribute('maxlength'),value:el.getAttribute('value'),options:el.options?[...el.options].map(o=>({value:o.value,label:o.textContent})):undefined};}
for(const slug of slugs){
 const sourcePath=path.join(sourceRoot,slug,'index.html');
 const source=fs.readFileSync(sourcePath,'utf8');
 const doc=new JSDOM(source).window.document;
 const form=doc.querySelector('form');
 const originalFields=[...form.querySelectorAll('input,select,textarea')].map(fieldContract);
 const campaign=slug==='fivecred-landing-page';
 const sourceScript=[...doc.scripts].map(s=>s.textContent).find(s=>campaign?s.includes('const maskCPF'):s.includes('function clearErrors'));
 let script;
 if(campaign){script=sourceScript.slice(sourceScript.indexOf('const maskCPF'),sourceScript.indexOf('// Mobile Menu Toggle'));}
 else{
  const start=slug==='imovel-fivecred'?sourceScript.indexOf('const formFields'):sourceScript.indexOf('function clearErrors');
  const end=sourceScript.indexOf(slug==='veiculo-fivecred'?'// Intersection Observer':'// FAQ Toggle');
  if(start<0||end<0)throw new Error('Script boundaries missing: '+slug);
  script=sourceScript.slice(start,end);
 }
 const rootEl=doc.createElement('section');rootEl.id='simulacao';rootEl.className='original-form';rootEl.dataset.originalForm=slug;
 const heading=doc.createElement('div');heading.className='of-header';
 if(campaign){heading.innerHTML='<div><p class="of-eyebrow">Comece por aqui</p><h3 id="original-form-heading">Conte sobre você</h3><p>Preencha os dados e escolha o seu perfil.</p></div>';}
 else if(slug==='veiculo-fivecred'){heading.innerHTML='<div><p class="of-eyebrow">Simulação de crédito</p><h3 id="original-form-heading">Seu veículo, suas possibilidades</h3><p>Preencha os dados para uma estimativa.</p></div>';}
 else{
  heading.innerHTML='<div><p class="of-eyebrow">Simulação de crédito</p></div>';
  for(const id of ['step-title','step-subtitle'])heading.firstElementChild.appendChild(doc.getElementById(id).cloneNode(true));
  heading.appendChild(doc.getElementById('step-badge').cloneNode(true));
  heading.querySelector('#step-title').tabIndex=-1;
 }
 rootEl.setAttribute('aria-labelledby',campaign||slug==='veiculo-fivecred'?'original-form-heading':'step-title');
 rootEl.appendChild(heading);rootEl.appendChild(form);
 const listeners=[];
 for(const el of [form,...form.querySelectorAll('*')]){
  for(const attr of [...el.attributes])if(attr.name.startsWith('on')){
   const event=attr.name.slice(2);const action=attr.value;
   const actionId='of-event-'+listeners.length;el.setAttribute('data-of-event-'+event,actionId);
   listeners.push(`formRoot.querySelector('[data-of-event-${event}="${actionId}"]').addEventListener(${JSON.stringify(event)}, function(event) { ${action}; syncAccessibility(); });`);
   el.removeAttribute(attr.name);
   if(event==='click'&&action.startsWith('prevStep'))el.classList.add('of-secondary');
  }
 }
 form.classList.add('of-fields');
 // Turn layout-only utility classes into scoped semantic styles; preserve state classes used by original functions.
 for(const el of form.querySelectorAll('div')){
  if(el.classList.contains('grid')||el.style.display==='grid')el.classList.add('of-grid');
  if([...el.children].every(c=>c.matches('button,a[id^="btn-"]'))&&el.children.length>1)el.classList.add('of-actions');
 }
 for(const field of form.querySelectorAll('input,select,textarea')){
  if(field.type==='radio')continue;
  let group=field.parentElement;
  if(!group.querySelector('label'))group=group.parentElement;
  group.classList.add('of-field');
  const label=group.querySelector('label');
  if(label&&!label.htmlFor){
   // The campaign's name field intentionally retains its original absent id/name.
   const labelId='of-label-'+(field.id||'nome');label.id=labelId;field.setAttribute('aria-labelledby',labelId);
   if(field.id)label.htmlFor=field.id;
  }
  if(field.id){
   const error=form.querySelector('#error-'+field.id.replace('_','-'));
   if(error){error.setAttribute('aria-live','polite');field.setAttribute('aria-describedby',error.id);}
  }
  const modes={cpf:'numeric',whatsapp:'tel',nascimento:'numeric',cep:'numeric',nis:'numeric',valor_beneficio:'decimal',valor_conta:'decimal',valor_imovel:'decimal',saldo_devedor:'decimal',valor_margem:'decimal',valor_estimado:'decimal'};
  if(modes[field.id])field.setAttribute('inputmode',modes[field.id]);
 }
 for(const button of form.querySelectorAll('button,a[id^="btn-"]')){
  if(!button.classList.contains('of-secondary'))button.classList.add('of-primary');
  if(button.tagName==='A'){button.rel='noopener noreferrer';button.classList.add('of-whatsapp');}
  if(!button.textContent.trim()&&button.classList.contains('of-secondary'))button.setAttribute('aria-label','Voltar para seus dados');
 }
 for(const i of form.querySelectorAll('i')){
  const temp=doc.createElement('div');temp.innerHTML=iconHTML(i.className);const svg=temp.firstElementChild;if(i.id)svg.id=i.id;i.replaceWith(svg);
 }
 for(const el of form.querySelectorAll('[style]'))el.removeAttribute('style');
 // Remove unused visual-only gradients, which never carry fields or behavior.
 for(const el of form.querySelectorAll('div'))if(!el.textContent.trim()&&!el.children.length&&!el.id)el.remove();
 for(const step of form.querySelectorAll('[id^="step-"]'))step.classList.add('of-step');
 const result=form.querySelector('#step-3');
 if(result){
  for(const child of result.children){
   if(child.tagName==='DIV'&&!child.classList.contains('of-actions'))child.classList.add(child.className.includes('bg-brand-')?'of-result-highlight':'of-result-panel');
  }
  const note=doc.createElement('p');note.className='of-estimate-note';note.textContent='Simulação ilustrativa. Valores, taxas e prazos dependem da análise e da proposta da instituição financeira.';
  result.appendChild(note);
 }
 // Adapt unsupported approval claims only; field contracts, maths and routing remain the originals.
 const replacements=[
 ['O limite aprovado é calculado de acordo com o valor mensal recebido ativamente em seu benefício.','A estimativa considera o valor mensal informado para o seu benefício.'],
 ['Valor liberado via PIX em até 2 horas na sua conta após a aprovação.','Valor ilustrativo, sujeito à análise da instituição financeira.'],
 ['Elegibilidade Pré-Confirmada','Próximo passo: análise'],
 ['Benefício apto para solicitação. Clique abaixo para enviar a proposta ao WhatsApp e anexar o comprovante do seu Bolsa Família.','Envie a simulação pelo WhatsApp para conversar sobre a análise e os documentos necessários.'],
 ['Pré-aprovado!','Sua simulação ilustrativa'],
 ['Crédito Liberado','Crédito estimado'],
 ['Continuar para aprovação','Continuar pelo WhatsApp'],
 ['Ao continuar, nossa equipe entrará em contato para a liberação do crédito.','Ao continuar, você abre o WhatsApp com os dados desta simulação para falar com a equipe.'],
 ['Ambiente seguro. Sem consulta ao SPC/Serasa.','Envio temporariamente indisponível.'],
 ['Descobrir Meu Saldo','Conferir informações'],
 ['O limite aprovado é proporcional ao valor da sua conta mensal de energia.','A estimativa é proporcional ao valor informado para a sua conta mensal de energia.'],
 ['Pré-aprovação Qualificada','Próximo passo: análise'],
 ['Seus dados preenchem os requisitos preliminares de liberação. Envie a proposta ao WhatsApp para anexar o laudo prévio.','Envie a simulação pelo WhatsApp para conversar sobre a análise e os documentos necessários.'],
 ['Valor liberado via PIX em até 2 horas na sua conta após a averbação.','Valor ilustrativo, sujeito à análise da instituição financeira.'],
 ['Valor bruto sugerido com base na margem declarada e teto de juros legal.','Valor ilustrativo calculado com base na margem informada.'],
 ['1.66% a.m. (Regulamentada)','1,66% a.m. (Ilustrativa)'],
 ['Taxa Nominal','Taxa usada na estimativa'],
 ['O valor será enviado para análise extraordinária da mesa.','Converse com a equipe sobre os limites aplicáveis à proposta.']
 ];
 const walker=doc.createTreeWalker(form,4);let textNode;
 while((textNode=walker.nextNode()))for(const [before,after]of replacements)textNode.textContent=textNode.textContent.replaceAll(before,after);
 if(!campaign){
  // Result statuses must not assert underwriting happened in a local arithmetic calculator.
  for(const el of result?.querySelectorAll('.bg-emerald-50')||[]){
   if(/apto|confirmad|aprovad|elegib/i.test(el.textContent))el.innerHTML='<strong>Próximo passo: análise</strong><p>Envie a simulação pelo WhatsApp para conversar sobre as condições e os documentos necessários.</p>';
  }
 }
 if(campaign){
  form.querySelector('.radio-group').setAttribute('role','group');form.querySelector('.radio-group').setAttribute('aria-label','Qual o seu perfil?');
  script=script.slice(0,script.indexOf('// Form Submit'))+`document.getElementById('leadForm').addEventListener('submit',event=>{event.preventDefault();const notice=formRoot.querySelector('.form-unavailable');if(notice){notice.tabIndex=-1;notice.focus();}});`;
  form.insertAdjacentHTML('afterbegin','<p class="form-unavailable" role="status">O envio deste formulário está temporariamente indisponível. Você pode falar com a equipe pelos canais de atendimento da página.</p>');
  const fields=doc.createElement('fieldset');fields.disabled=true;
  for(const child of [...form.children])if(!child.classList.contains('form-unavailable'))fields.appendChild(child);
  form.appendChild(fields);
 }
 script=script.replaceAll('*Crédito Pré-Aprovado:*','*Crédito Estimado:*')
 .replaceAll('O benefício do INSS não pode ser menor que o salário mínimo (R$ 1.412,00).','O valor mínimo usado nesta simulação ilustrativa é R$ 1.412,00.')
 .replaceAll('excede o limite legal de','excede o limite usado nesta simulação de');
 // Keep original listener registration order (inline handlers ran before DOMContentLoaded mask listeners).
 script=script.replaceAll("document.addEventListener('DOMContentLoaded',",'onReady(');
 script=script.replaceAll("document.querySelectorAll(","formRoot.querySelectorAll(");
 const accessibility=`
 function syncAccessibility() {
  formRoot.querySelectorAll('input,select,textarea').forEach(field => {
   const error=field.id&&formRoot.querySelector('#error-'+field.id.replace('_','-'));
   if(error)field.setAttribute('aria-invalid',String(!error.classList.contains('hidden')));
  });
  formRoot.querySelectorAll('.of-step').forEach(step=>{
   const inactive=step.classList.contains('hidden')||step.classList.contains('opacity-0');
   step.setAttribute('aria-hidden',String(inactive));step.inert=inactive;
  });
 }
`;
 // This loader works with both a deferred static script and Next's afterInteractive script.
 const out=`/* Form functions extracted from ${slug}/index.html. See work/original-static-form-contracts.json. */\n(() => {\n'use strict';\nfunction initOriginalForm(){\nconst formRoot=document.querySelector('[data-original-form="${slug}"]');\nif(!formRoot||formRoot.dataset.initialized==='true')return;\nformRoot.dataset.initialized='true';\nconst readyCallbacks=[];const onReady=(callback)=>readyCallbacks.push(callback);\n${accessibility}\n${script.trim()}\n${listeners.join('\n')}\nreadyCallbacks.forEach(callback=>callback());\nsyncAccessibility();\n}\nif(document.readyState==='loading')document.addEventListener('DOMContentLoaded',initOriginalForm,{once:true});else initOriginalForm();\n})();\n`;
 forms[slug]=rootEl.outerHTML;
 fs.writeFileSync(path.join(assetsRoot,slug+'.js'),out);
 contracts.push({slug,sourcePath,sourceSHA256:crypto.createHash('sha256').update(source).digest('hex'),formId:form.id,steps:campaign?1:3,fields:originalFields,transport:campaign?{type:'local-alert-only',endpoint:null,webhookFound:false}:{type:'whatsapp-link',endpoint:'https://wa.me/5511989956521',webhookFound:false},preserved:'Original IDs/names/types/required/options, validation, masks, formulas and conditional fields. Original navigation; inline handlers compiled to external listeners.',adaptations:['Scoped CSS and inline SVG icons replace external Tailwind/Phosphor assets.','Approval/eligibility claims changed to illustrative estimates; campaign alert accurately states no data was sent.','Accessibility attributes and inactive-step inert state added.'],scriptPath:'shared/original-forms/'+slug+'.js'});
}
fs.writeFileSync(path.join(__dirname,'original-static-forms.html.json'),JSON.stringify(forms,null,2));
fs.writeFileSync(path.join(__dirname,'original-static-form-contracts.json'),JSON.stringify(contracts,null,2));
fs.writeFileSync(path.join(__dirname,'original-static-forms.cjs'),`'use strict';\nconst forms=require('./original-static-forms.html.json');\nconst staticFormSlugs=Object.freeze(Object.keys(forms));\nfunction renderOriginalStaticForm(slug,prefix='../'){return forms[slug]||'';}\nfunction originalStaticFormAssets(slug,prefix='../'){return forms[slug]?{css:prefix+'shared/original-forms/forms.css',script:prefix+'shared/original-forms/'+slug+'.js'}:null;}\nmodule.exports={renderOriginalStaticForm,originalStaticFormAssets,staticFormSlugs};\n`);
console.log('Extracted '+contracts.length+' original forms with external scripts and contracts.');



