/* Partner ribbon motion only; no form, storage or network interaction. */
(() => {
 'use strict';
 function initialize(){
  const preference=matchMedia('(prefers-reduced-motion: reduce)');
  document.querySelectorAll('[data-partner-marquee]').forEach(ribbon=>{
   function visibility(){ribbon.dataset.pageVisible=String(!document.hidden);}
   function motion(){ribbon.dataset.motion=preference.matches?'reduced':'enabled';}
   preference.addEventListener('change',motion);document.addEventListener('visibilitychange',visibility);
   visibility();motion();
   if('IntersectionObserver' in window){const observer=new IntersectionObserver(entries=>{ribbon.dataset.visible=String(entries[0].isIntersecting);},{threshold:0.02});observer.observe(ribbon);}else ribbon.dataset.visible='true';
  });
 }
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',initialize,{once:true});else initialize();
})();
