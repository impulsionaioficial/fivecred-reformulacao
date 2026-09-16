/* One contact step for every WhatsApp entry point. No lead API or persistent storage. */
(() => {
  'use strict';
  function init() {
    const dialog=document.getElementById('whatsapp-contact-dialog');
    if(!dialog||dialog.dataset.ready)return;
    dialog.dataset.ready='true';
    const form=dialog.querySelector('form'),name=form.elements.nome,email=form.elements.email;
    const submit=form.querySelector('[type=submit]');
    let pending=null,lastTrigger=null,returnScope=null,continuing=false;
    function destination(url) {
      try {
        const u=new URL(url||'https://wa.me/5511980797255');
        if(u.protocol!=='https:')return null;
        const phone=u.hostname==='wa.me'?u.pathname.slice(1):u.hostname==='api.whatsapp.com'&&u.pathname==='/send'?u.searchParams.get('phone'):'';
        if(!/^\d{10,15}$/.test(phone||''))return null;
        return {phone,message:u.searchParams.get('text')||''};
      } catch { return null; }
    }
    function clearErrors() {
      for(const field of [name,email]){field.removeAttribute('aria-invalid');document.getElementById(field.id+'-error').textContent='';}
    }
    function open(options={}) {
      const target=destination(options.url);
      if(!target)return false;
      if(dialog.open)return true;
      lastTrigger=options.trigger instanceof HTMLElement?options.trigger:document.activeElement;
      returnScope=options.scope instanceof HTMLElement?options.scope:lastTrigger?.closest('[data-connected-form]');
      const scope=lastTrigger?.closest('form,[data-connected-form]')||document.querySelector('#simulacao');
      const value=selector=>scope?.querySelector(selector)?.value?.trim()||'';
      form.reset();clearErrors();continuing=false;submit.disabled=false;
      const sourceName=value('input[name="nome"],input[name="name"],input#nome,input#hero-nome,input[autocomplete="name"]');
      name.value=options.name??sourceName;
      email.value=options.email??(!options.name||options.name.trim()===sourceName?value('input[type="email"]'):'');
      const heading=document.querySelector('.hero h1,.catalog-hero h1')?.textContent.trim();
      pending={phone:target.phone,message:options.message||target.message||('Olá, Fivecred! Gostaria de atendimento.'+(heading?'\nAssunto: '+heading:''))};
      const formatted=target.phone.replace(/^55(\d{2})(\d{4,5})(\d{4})$/,'($1) $2-$3');
      document.getElementById('wa-contact-destination').textContent='Atendimento Fivecred · '+formatted;
      dialog.showModal();name.focus({preventScroll:true});
      return true;
    }
    window.FivecredWhatsApp={open};
    function intercept(event) {
      const link=event.target instanceof Element?event.target.closest('a[href]'):null;
      if(!link||!destination(link.href))return;
      event.preventDefault();event.stopImmediatePropagation();
      open({url:link.href,trigger:link,name:link.dataset.contactName,email:link.dataset.contactEmail});
    }
    document.addEventListener('click',intercept,true);
    document.addEventListener('auxclick',event=>{if(event.button===1)intercept(event);},true);
    document.addEventListener('keydown',event=>{
      if(!dialog.open||event.key!=='Tab')return;
      const controls=[...dialog.querySelectorAll('button:not([disabled]),input:not([disabled]),a[href]')].filter(el=>el.getClientRects().length);
      const first=controls[0],last=controls.at(-1),active=document.activeElement;
      if(event.shiftKey&&(active===first||!dialog.contains(active))){event.preventDefault();last?.focus();}
      else if(!event.shiftKey&&(active===last||!dialog.contains(active))){event.preventDefault();first?.focus();}
    });
    dialog.querySelectorAll('[data-wa-close]').forEach(button=>button.addEventListener('click',()=>dialog.close()));
    dialog.addEventListener('click',event=>{const box=dialog.getBoundingClientRect();if(event.target===dialog&&(event.clientX<box.left||event.clientX>box.right||event.clientY<box.top||event.clientY>box.bottom))dialog.close();});
    dialog.addEventListener('close',()=>{
      const trigger=returnScope?.querySelector('.cf-success a[href],.cf-success button:not([disabled])')||(lastTrigger?.isConnected&&lastTrigger!==document.body?lastTrigger:document.querySelector('.header [data-whatsapp]'));
      pending=null;lastTrigger=null;returnScope=null;form.reset();clearErrors();continuing=false;submit.disabled=false;
      if(trigger?.isConnected)trigger.focus({preventScroll:true});
    });
    for(const field of [name,email])field.addEventListener('input',()=>{field.removeAttribute('aria-invalid');document.getElementById(field.id+'-error').textContent='';});
    form.addEventListener('submit',event=>{
      event.preventDefault();if(!pending||continuing)return;
      clearErrors();name.value=name.value.trim();email.value=email.value.trim();
      const errors=[];
      if(name.value.length<2||name.value.length>100)errors.push([name,'Informe seu nome.']);
      if(!email.value||email.value.length>254||email.validity.typeMismatch||!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value))errors.push([email,'Informe um e-mail válido, como nome@exemplo.com.']);
      if(errors.length){for(const [field,text] of errors){field.setAttribute('aria-invalid','true');document.getElementById(field.id+'-error').textContent=text;}errors[0][0].focus();return;}
      continuing=true;submit.disabled=true;
      const message=pending.message+'\n\nDados para atendimento:\nNome: '+name.value+'\nE-mail: '+email.value;
      const url='https://wa.me/'+pending.phone+'?text='+encodeURIComponent(message);
      // Synchronous with the visitor's confirmation, so popup blockers allow the new conversation.
      window.open(url,'_blank','noopener,noreferrer');
      dialog.close();
    });
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});else init();
})();
