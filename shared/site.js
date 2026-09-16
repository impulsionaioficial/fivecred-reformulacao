/* Shared navigation and contact entry points. Form modules own their submissions. */
(() => {
 'use strict';
 function init(){
  const header=document.querySelector('.header');
  if(!header||header.dataset.navigationReady==='true')return;
  header.dataset.navigationReady='true';
  function openWhatsApp(message,options={}){return window.FivecredWhatsApp?.open({...options,message:message||options.message,trigger:options.trigger||document.activeElement});}
  window.Fivecred={...(window.Fivecred||{}),openWhatsApp};
  window.addEventListener('fivecred:whatsapp',event=>openWhatsApp(event.detail?.message,event.detail||{}));
  document.querySelectorAll('[data-whatsapp]').forEach(button=>button.addEventListener('click',()=>openWhatsApp(button.dataset.message,{trigger:button})));
  const nav=document.getElementById('main-nav'),menu=document.querySelector('.menu-toggle');
  function closeMenu(){if(!menu||!nav)return;nav.classList.remove('is-open');menu.setAttribute('aria-expanded','false');menu.setAttribute('aria-label','Abrir menu');}
  menu?.addEventListener('click',()=>{const open=menu.getAttribute('aria-expanded')!=='true';nav.classList.toggle('is-open',open);menu.setAttribute('aria-expanded',String(open));menu.setAttribute('aria-label',open?'Fechar menu':'Abrir menu');});
  document.addEventListener('keydown',event=>{if(event.key==='Escape'&&menu?.getAttribute('aria-expanded')==='true'){closeMenu();menu.focus();}});
  document.addEventListener('click',event=>{if(!event.target.closest('.header'))closeMenu();});
  nav?.querySelectorAll('a').forEach(link=>link.addEventListener('click',closeMenu));
  document.querySelectorAll('[data-start-profile]').forEach(button=>button.addEventListener('click',()=>{
   if(window.FivecredJourney&&document.querySelector('[data-journey]'))window.FivecredJourney.start(button.dataset.startProfile,button.dataset.startGoal||'credito');
   else{const form=document.getElementById('simulacao');form?.scrollIntoView({behavior:window.matchMedia('(prefers-reduced-motion: reduce)').matches?'auto':'smooth',block:'start'});form?.querySelector('input,select,button')?.focus({preventScroll:true});}
  }));
 }
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});else init();
})();
