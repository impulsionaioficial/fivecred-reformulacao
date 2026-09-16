/* Original marketplace form contract. Network calls occur only on explicit actions. */
(() => {
  'use strict';
  const money=value=>new Intl.NumberFormat('pt-BR',{style:'currency',currency:'BRL'}).format(value);
  function validCpf(value){
    const digits=value.replace(/\D/g,'');
    if(digits.length!==11||/^(\d)\1{10}$/.test(digits))return false;
    for(let length=9;length<=10;length++){
      let sum=0;
      for(let i=0;i<length;i++)sum+=Number(digits[i])*(length+1-i);
      const check=(sum*10)%11;
      if((check===10?0:check)!==Number(digits[length]))return false;
    }
    return true;
  }
  function validBirthdate(value){
    const match=/^(\d{2})\/(\d{2})\/(\d{4})$/.exec(value);
    if(!match)return false;
    const [,day,month,year]=match.map(Number);
    const date=new Date(year,month-1,day);
    return year>=1900&&date.getFullYear()===year&&date.getMonth()===month-1&&date.getDate()===day&&date<=new Date();
  }
  function init(){
    const form=document.querySelector('[data-catalog-original-form]');
    if(!form||form.dataset.ready)return;
    form.dataset.ready='true';
    const get=id=>form.querySelector('#'+id);
    const pick=selector=>form.querySelector(selector);
    const property=form.dataset.catalogKind==='property';
    const items=JSON.parse(form.dataset.catalogItems);
    const itemMap=new Map(items.map(item=>[String(item.id),item]));
    const itemSelect=get('hero-car-select'),slider=get('hero-entrada'),term=get('hero-parcelas');
    const submit=pick('[data-catalog-submit]'),status=pick('[data-catalog-send-status]');
    const fipeBox=get('custom-fipe-selectors'),brand=get('hero-fipe-marca'),model=get('hero-fipe-modelo'),year=get('hero-fipe-ano');
    const fipeStatus=pick('[data-fipe-status]'),retry=pick('[data-fipe-retry]');
    let selected=null,referencePrice=0,step=1,sending=false,lookupVersion=0,retryLookup=null;
    const pendingLookups=new Set(),sentPayloads=new Set();
    function setError(id,text){
      const input=get(id),error=get('err-'+id);
      if(text){input.setAttribute('aria-invalid','true');if(error){error.textContent=text;error.hidden=false;}}
      else{input.removeAttribute('aria-invalid');if(error){error.textContent='';error.hidden=true;}}
    }
    function validateIdentity(){
      const checks=[
        ['hero-nome',get('hero-nome').value.trim().length>=4,'Informe seu nome completo.'],
        ['hero-whatsapp',/^[1-9]\d9\d{8}$/.test(get('hero-whatsapp').value.replace(/\D/g,'')),'Informe um celular com DDD e 11 dígitos.'],
        ['hero-email',/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(get('hero-email').value.trim()),'Confira o e-mail informado.'],
        ['hero-cpf',validCpf(get('hero-cpf').value),'Confira o CPF informado.'],
        ['hero-nascimento',validBirthdate(get('hero-nascimento').value),'Informe uma data de nascimento válida.']
      ];
      checks.forEach(([id,valid,message])=>setError(id,valid?'':message));
      return !checks.some(([,valid])=>!valid);
    }
    function validateSelection(){
      const valid=selected&&selected.price>0&&referencePrice>0&&!slider.disabled&&Number(slider.value)<selected.price;
      setError('hero-car-select',valid?'':itemSelect.value==='custom'?'Conclua a consulta de marca, modelo e ano antes de continuar.':'Selecione uma opção com valor para simular.');
      return Boolean(valid);
    }
    function showStep(next,focus=true){
      step=next;
      form.querySelectorAll('[data-catalog-step]').forEach(panel=>panel.hidden=Number(panel.dataset.catalogStep)!==step);
      form.querySelectorAll('[data-catalog-progress]').forEach(item=>{if(Number(item.dataset.catalogProgress)===step)item.setAttribute('aria-current','step');else item.removeAttribute('aria-current');});
      if(focus)pick('[data-catalog-step="'+step+'"] .cf-step-title').focus({preventScroll:true});
    }
    function showIdentityErrors(){showStep(1,false);pick('[aria-invalid=true]')?.focus();}
    const masks={
      'hero-whatsapp':value=>{let d=value.replace(/\D/g,'');if(d.length===13&&d.startsWith('55'))d=d.slice(2);const x=d.slice(0,11).match(/(\d{0,2})(\d{0,5})(\d{0,4})/);return !x[2]?x[1]:'('+x[1]+') '+x[2]+(x[3]?'-'+x[3]:'');},
      'hero-cpf':value=>{const x=value.replace(/\D/g,'').slice(0,11).match(/(\d{0,3})(\d{0,3})(\d{0,3})(\d{0,2})/);return !x[2]?x[1]:x[1]+'.'+x[2]+(x[3]?'.'+x[3]:'')+(x[4]?'-'+x[4]:'');},
      'hero-nascimento':value=>{const x=value.replace(/\D/g,'').slice(0,8).match(/(\d{0,2})(\d{0,2})(\d{0,4})/);return !x[2]?x[1]:x[1]+'/'+x[2]+(x[3]?'/'+x[3]:'');}
    };
    Object.entries(masks).forEach(([id,mask])=>get(id).addEventListener('input',event=>{event.target.value=mask(event.target.value);setError(id,'');}));
    ['hero-nome','hero-email'].forEach(id=>get(id).addEventListener('input',()=>setError(id,'')));
    function cancelLookups(){lookupVersion++;pendingLookups.forEach(controller=>controller.abort());pendingLookups.clear();if(retry)retry.hidden=true;return lookupVersion;}
    async function fetchFipe(suffix){
      const controller=new AbortController();pendingLookups.add(controller);
      const timeout=setTimeout(()=>controller.abort(),12000);
      try{const result=await fetch('https://parallelum.com.br/fipe/api/v1/'+suffix,{signal:controller.signal});if(!result.ok)throw new Error('lookup');return await result.json();}
      finally{clearTimeout(timeout);pendingLookups.delete(controller);}
    }
    function updateEntrada(){get('hero-entrada-label').textContent=money(Number(slider.value));slider.setAttribute('aria-valuetext',money(Number(slider.value)));}
    function configureEntrada(value){
      referencePrice=value;
      const minimum=Math.round(value*.2),maximum=Math.min(Math.round(value*.8),Math.floor(selected.price)-1);
      slider.min=String(minimum);slider.max=String(Math.max(minimum,maximum));slider.value=String(minimum);slider.disabled=false;updateEntrada();
      get('hero-fipe-price-label').textContent=money(selected.price);
      get('catalog-entrada-note').textContent='Ajuste entre '+money(minimum)+' e '+money(maximum)+'.';
    }
    function resetValue(){referencePrice=0;selected=null;slider.disabled=true;slider.min='0';slider.max='100000';slider.value='0';updateEntrada();get('hero-fipe-price-label').textContent='Selecione uma opção';get('catalog-entrada-note').textContent='Ajuste a entrada para comparar as parcelas.';}
    function setOptions(select,values,placeholder){select.replaceChildren(new Option(placeholder,''));values.forEach(item=>select.add(new Option(item.nome,String(item.codigo))));select.disabled=values.length===0;}
    function fipeFailure(action){fipeStatus.textContent='Não foi possível consultar a FIPE. Tente novamente.';retryLookup=action;retry.hidden=false;}
    async function loadBrands(){
      const version=lookupVersion;fipeStatus.textContent='Consultando marcas na FIPE…';setOptions(brand,[],'Carregando marcas…');
      try{const data=await fetchFipe('carros/marcas');if(version!==lookupVersion)return;if(!Array.isArray(data)||!data.length)throw new Error('empty');setOptions(brand,data,'Selecione a marca');fipeStatus.textContent='Selecione marca, modelo e ano para consultar o valor.';}
      catch{if(version===lookupVersion){setOptions(brand,[],'Consulta indisponível');fipeFailure(loadBrands);}}
    }
    async function loadModels(){
      const version=cancelLookups();resetValue();setOptions(model,[],'Selecione a marca primeiro');setOptions(year,[],'Selecione o modelo primeiro');
      if(!brand.value)return;
      fipeStatus.textContent='Consultando modelos…';
      try{const data=await fetchFipe('carros/marcas/'+encodeURIComponent(brand.value)+'/modelos');if(version!==lookupVersion)return;if(!data.modelos?.length)throw new Error('empty');setOptions(model,data.modelos,'Selecione o modelo');fipeStatus.textContent='Escolha o modelo e o ano.';}
      catch{if(version===lookupVersion)fipeFailure(loadModels);}
    }
    async function loadYears(){
      const version=cancelLookups();resetValue();setOptions(year,[],'Selecione o modelo primeiro');if(!brand.value||!model.value)return;
      fipeStatus.textContent='Consultando anos…';
      try{const data=await fetchFipe('carros/marcas/'+encodeURIComponent(brand.value)+'/modelos/'+encodeURIComponent(model.value)+'/anos');if(version!==lookupVersion)return;if(!Array.isArray(data)||!data.length)throw new Error('empty');setOptions(year,data,'Selecione o ano');fipeStatus.textContent='Escolha o ano do modelo.';}
      catch{if(version===lookupVersion)fipeFailure(loadYears);}
    }
    async function loadCustomPrice(){
      const version=cancelLookups();resetValue();if(!brand.value||!model.value||!year.value)return;fipeStatus.textContent='Consultando valor…';
      try{
        const suffix='carros/marcas/'+encodeURIComponent(brand.value)+'/modelos/'+encodeURIComponent(model.value)+'/anos/'+encodeURIComponent(year.value);
        const data=await fetchFipe(suffix);if(version!==lookupVersion)return;
        const value=Number(String(data.Valor||'').replace(/\D/g,''))/100;if(!Number.isFinite(value)||value<=0)throw new Error('value');
        selected={id:'custom',brand:brand.selectedOptions[0].text,model:model.selectedOptions[0].text,year:Number(year.selectedOptions[0].text.slice(0,4)),price:value,fipe:value};
        configureEntrada(value);get('hero-fipe-status').textContent='Valor consultado na FIPE';fipeStatus.textContent='Consulta concluída. Ajuste a entrada e o prazo.';
        setError('hero-car-select','');
      }catch{if(version===lookupVersion)fipeFailure(loadCustomPrice);}
    }
    async function chooseSelected(){
      const version=cancelLookups();setError('hero-car-select','');resetValue();status.hidden=true;submit.disabled=false;submit.textContent='Enviar simulação';
      if(fipeBox)fipeBox.hidden=itemSelect.value!=='custom';
      const selection=pick('[data-catalog-selection]');selection.hidden=!itemSelect.value;selection.textContent='Sua escolha: '+itemSelect.selectedOptions[0].text;
      if(itemSelect.value==='custom'){
        setOptions(model,[],'Selecione a marca primeiro');setOptions(year,[],'Selecione o modelo primeiro');await loadBrands();return;
      }
      const item=itemMap.get(itemSelect.value);if(!item)return;
      selected={...item};const cached=Number(item.fipe)||Number(item.price);
      get('hero-fipe-status').textContent='Valor de referência do catálogo';
      // Property files contained car FIPE lookups. Retain their numeric reference without querying a vehicle API for a property.
      if(property||!item.fipe_code||Number(item.fipe_code.replace(/\D/g,''))===0){configureEntrada(cached);return;}
      get('hero-fipe-price-label').textContent=money(item.price);get('hero-fipe-status').textContent='Consultando referência FIPE…';
      try{
        const years=await fetchFipe('carros/codigoFipe/'+encodeURIComponent(item.fipe_code)+'/anos');if(version!==lookupVersion)return;
        const matched=years.find(entry=>String(entry.nome).startsWith(String(item.year)));if(!matched)throw new Error('year');
        const data=await fetchFipe('carros/codigoFipe/'+encodeURIComponent(item.fipe_code)+'/anos/'+encodeURIComponent(matched.codigo));if(version!==lookupVersion)return;
        const value=Number(String(data.Valor||'').replace(/\D/g,''))/100;if(!Number.isFinite(value)||value<=0)throw new Error('price');
        configureEntrada(value);get('hero-fipe-status').textContent='Entrada calculada sobre referência FIPE de '+money(value);
      }catch{if(version===lookupVersion){configureEntrada(cached);get('hero-fipe-status').textContent='Referência do arquivo original; consulta FIPE indisponível.';}}
    }
    function payload(){
      const prazo=Number(term.value),entrada=Number(slider.value),price=Number(selected.price);
      const rate={24:.0129,36:.0135,48:.0139,60:.0145}[prazo];
      const power=Math.pow(1+rate,prazo),prestacao=Math.round((price-entrada)*(rate*power)/(power-1));
      return {name:get('hero-nome').value.trim(),phone:get('hero-whatsapp').value,cpf:get('hero-cpf').value,email:get('hero-email').value.trim(),birthdate:get('hero-nascimento').value,state:get('hero-uf').value,vehicle:selected.backendName||[selected.brand,selected.model].filter(Boolean).join(' '),price,entrada,prazo,prestacao};
    }
    function updateResult(){
      const lead=payload();
      pick('[data-catalog-result-item]').textContent=lead.vehicle;
      get('hero-res-fipe').textContent=money(lead.price);get('hero-res-entrada').textContent=money(lead.entrada);get('hero-res-financiado').textContent=money(lead.price-lead.entrada);get('hero-res-meses').textContent=lead.prazo;get('hero-res-prestacao').textContent=money(lead.prestacao);
      const message=['Olá! Realizei uma simulação '+(property?'de financiamento imobiliário':'de financiamento')+' no Marketplace Fivecred:','', (property?'Imóvel: ':'Veículo: ')+lead.vehicle,'Valor de referência: '+money(lead.price),'Entrada: '+money(lead.entrada),'Prazo: '+lead.prazo+' meses','Prestação estimada: '+money(lead.prestacao),'','Nome: '+lead.name,'WhatsApp: '+lead.phone,'CPF: '+lead.cpf,'Nascimento: '+lead.birthdate,'E-mail: '+lead.email,'Estado: '+lead.state,'','Gostaria de confirmar a disponibilidade e conhecer as condições da proposta.'].join('\n');
      get('hero-whatsapp-sim-btn').href='https://wa.me/5511981655768?text='+encodeURIComponent(message);
      const alreadySent=sentPayloads.has(JSON.stringify(lead));submit.disabled=alreadySent;submit.textContent=alreadySent?'Simulação enviada':'Enviar simulação';status.hidden=!alreadySent;if(alreadySent){status.dataset.state='success';status.textContent='Simulação enviada. A equipe da Fivecred poderá entrar em contato.';}
    }
    function nextStep(next){
      if(sending)return;
      if(!validateIdentity()){showIdentityErrors();return;}
      if(next===3){if(!validateSelection()){showStep(2,false);itemSelect.focus();return;}updateResult();}
      showStep(next);
    }
    form.querySelectorAll('[data-catalog-next]').forEach(button=>button.addEventListener('click',()=>nextStep(Number(button.dataset.catalogNext))));
    form.querySelectorAll('[data-catalog-back]').forEach(button=>button.addEventListener('click',()=>{if(!sending)showStep(Number(button.dataset.catalogBack));}));
    itemSelect.addEventListener('change',chooseSelected);slider.addEventListener('input',updateEntrada);
    brand?.addEventListener('change',loadModels);model?.addEventListener('change',loadYears);year?.addEventListener('change',loadCustomPrice);retry?.addEventListener('click',()=>{retry.hidden=true;retryLookup?.();});
    form.addEventListener('submit',async event=>{
      event.preventDefault();if(sending)return;
      if(step!==3){nextStep(step+1);return;}
      if(!validateIdentity()){showIdentityErrors();return;}
      if(!validateSelection()){showStep(2,false);itemSelect.focus();return;}
      const body=JSON.stringify(payload());if(sentPayloads.has(body))return;
      sending=true;submit.disabled=true;submit.textContent='Enviando…';status.hidden=false;status.dataset.state='pending';status.textContent='Enviando sua simulação…';form.setAttribute('aria-busy','true');
      form.querySelectorAll('[data-catalog-back]').forEach(button=>button.disabled=true);
      const controller=new AbortController(),timeout=setTimeout(()=>controller.abort(),20000);
      try{
        const result=await fetch(form.dataset.endpoint,{method:'POST',headers:{'Content-Type':'application/json'},body,signal:controller.signal});
        if(!result.ok)throw new Error('transport');
        sentPayloads.add(body);status.dataset.state='success';status.textContent='Simulação enviada. A equipe da Fivecred poderá entrar em contato.';submit.textContent='Simulação enviada';
      }catch{status.dataset.state='error';status.textContent='Não foi possível confirmar o envio. Seus dados continuam neste formulário. Tente novamente ou continue pelo WhatsApp.';submit.disabled=false;submit.textContent='Tentar enviar novamente';}
      finally{clearTimeout(timeout);sending=false;form.removeAttribute('aria-busy');form.querySelectorAll('[data-catalog-back]').forEach(button=>button.disabled=false);status.focus({preventScroll:true});}
    });
    async function select(item){
      if(!item||sending)return false;
      const requestedId=String(item.id??'');
      let selectedId=itemMap.has(requestedId)?requestedId:'';
      if(!selectedId&&/^(imovel|veiculo)-\d+$/.test(requestedId)){const id=requestedId.split('-').at(-1);if(itemMap.has(id))selectedId=id;}
      if(!selectedId){
        const title=item.title||item.name||item.nome||[item.brand,item.model].filter(Boolean).join(' ');
        const value=Number(item.price??item.preco);
        if(!title||!Number.isFinite(value)||value<=0)return false;
        selectedId='catalog-selection';
        itemMap.set(selectedId,{id:selectedId,model:title,brand:'',backendName:item.brand&&item.model?item.brand+' '+item.model:title,price:value,fipe:Number(item.fipe)||value,year:item.year,fipe_code:item.fipe_code});
        let option=[...itemSelect.options].find(entry=>entry.value===selectedId);if(!option){option=new Option(title,selectedId);itemSelect.add(option);}else option.text=title;
      }
      itemSelect.value=selectedId;await chooseSelected();
      const identityComplete=validateIdentity();
      if(identityComplete)showStep(2);else{form.querySelectorAll('[aria-invalid]').forEach(input=>setError(input.id,''));showStep(1,false);get('hero-nome').focus({preventScroll:true});}
      form.closest('.catalog-original-panel').scrollIntoView({behavior:window.matchMedia('(prefers-reduced-motion: reduce)').matches?'auto':'smooth',block:'start'});
      return true;
    }
    window.FivecredCatalogForm={select};
    window.addEventListener('fivecred:catalog-select',event=>select(event.detail?.item||event.detail));
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});else init();
})();
