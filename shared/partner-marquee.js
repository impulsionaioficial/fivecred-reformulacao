/* Partner ribbon controls only; no form, storage or network interaction. */
(() => {
 'use strict';
 function initialize(){
  const preference=matchMedia('(prefers-reduced-motion: reduce)');
  document.querySelectorAll('[data-partner-marquee]').forEach(ribbon=>{
   const viewport=ribbon.querySelector('.partner-marquee-viewport');
   const button=ribbon.querySelector('[data-partner-toggle]');
   const label=button.querySelector('[data-partner-toggle-label]');
   const symbol=button.querySelector('.partner-motion-symbol');
   let paused=false;
   function updatePause(){ribbon.dataset.paused=String(paused);button.setAttribute('aria-pressed',String(paused));label.textContent=paused?'Retomar movimento':'Pausar movimento';symbol.textContent=paused?'▶':'Ⅱ';}
   function visibility(){ribbon.dataset.pageVisible=String(!document.hidden);}
   function motion(){ribbon.dataset.motion=preference.matches?'reduced':'enabled';button.hidden=preference.matches;if(preference.matches)viewport.removeAttribute('tabindex');else viewport.tabIndex=0;}
   button.addEventListener('click',()=>{paused=!paused;updatePause();});
   preference.addEventListener('change',motion);document.addEventListener('visibilitychange',visibility);
   updatePause();visibility();motion();
   if('IntersectionObserver' in window){const observer=new IntersectionObserver(entries=>{ribbon.dataset.visible=String(entries[0].isIntersecting);},{threshold:0.02});observer.observe(ribbon);}else ribbon.dataset.visible='true';
  });
 }
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',initialize,{once:true});else initialize();
})();
