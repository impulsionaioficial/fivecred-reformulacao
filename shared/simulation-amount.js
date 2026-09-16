/* Value selection and navigation only. Original forms and submission payloads stay intact. */
(() => {
 'use strict';
 const parameter='valor_simulacao';
 const money=value=>new Intl.NumberFormat('pt-BR',{style:'currency',currency:'BRL',maximumFractionDigits:0}).format(value);
 function options(element){return {min:Number(element.dataset.amountMin),max:Number(element.dataset.amountMax),step:Number(element.dataset.amountStep),initial:Number(element.dataset.amountInitial)};}
 function queryValue(config){
  const values=new URL(location.href).searchParams.getAll(parameter);
  if(values.length!==1||!/^\d{1,7}$/.test(values[0]))return null;
  const value=Number(values[0]);
  return Number.isSafeInteger(value)&&value>=config.min&&value<=config.max&&(value-config.min)%config.step===0?value:null;
 }
 function setLinkValue(link,value){const url=new URL(link.getAttribute('href'),location.href);url.searchParams.set(parameter,String(value));link.href=url.pathname+url.search+url.hash;}
 function init(){
  const control=document.querySelector('[data-simulation-amount]');
  if(control){
   const config=options(control),range=control.querySelector('[data-simulation-range]'),output=control.querySelector('[data-amount-value]');
   const decrease=control.querySelector('[data-amount-decrease]'),increase=control.querySelector('[data-amount-increase]');
   range.value=String(queryValue(config)??config.initial);
   function refresh(){
    const value=Number(range.value),formatted=money(value);
    output.value=formatted;range.setAttribute('aria-valuetext',formatted);
    range.style.setProperty('--amount-progress',((value-config.min)/(config.max-config.min)*100)+'%');
    decrease.disabled=value<=config.min;increase.disabled=value>=config.max;
    document.querySelectorAll('[data-simulation-link]').forEach(link=>setLinkValue(link,value));
   }
   range.addEventListener('input',refresh);range.addEventListener('change',refresh);
   decrease.addEventListener('click',()=>{range.stepDown();refresh();});
   increase.addEventListener('click',()=>{range.stepUp();refresh();});
   window.addEventListener('pageshow',refresh);refresh();control.hidden=false;
  }
  const selection=document.querySelector('[data-simulation-selection]');
  if(selection){
   const value=queryValue(options(selection));
   if(value!==null){
    selection.querySelector('[data-selected-amount]').textContent=money(value);
    setLinkValue(selection.querySelector('[data-edit-amount]'),value);
    const back=document.querySelector('.simulation-back');if(back)setLinkValue(back,value);
    selection.hidden=false;
   }
  }
 }
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});else init();
})();
