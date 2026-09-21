/* Three choices before the existing forms. No lead submission or persistence. */
(() => {
 'use strict';
 function init(){
  const root=document.querySelector('[data-credit-guide]'),rules=window.FivecredCredit;if(!root||!rules)return;
  const params=new URLSearchParams(location.search),single=key=>params.getAll(key).length===1?params.get(key):null;
  const origin=rules.origins.includes(single('origem'))?single('origem'):'fivecred-next';
  const validGoal=Object.hasOwn(rules.goals,single('objetivo'))?single('objetivo'):null;
  const validProfile=Object.hasOwn(rules.profiles,single('perfil'))?single('perfil'):null;
  const complete=rules.decode(location.search),raw=single('valor_simulacao');
  const initial=/^\d{1,7}$/.test(raw||'')&&Number(raw)>=100&&Number(raw)<=1000000?Number(raw):10000;
  const state={origin,goal:validGoal,profile:validGoal?validProfile:null,amount:complete?.amount??initial};
  let step=complete&&single('etapa')==='resultado'?4:complete&&single('etapa')==='3'?3:validGoal&&single('etapa')==='2'?2:1;
  const range=root.querySelector('[data-guide-range]'),value=root.querySelector('[data-guide-value]'),back=root.querySelector('[data-guide-back]'),heading=root.querySelector('#guide-title');
  const decrease=root.querySelector('[data-guide-decrease]'),increase=root.querySelector('[data-guide-increase]');
  const adjustment=root.querySelector('[data-guide-adjustment]');
  function current(){return state.goal&&state.profile?rules.decode(rules.encode(state)):null;}
  window.FivecredGuideState=current;
  function save(){const query=new URLSearchParams({origem:state.origin,valor_simulacao:String(state.amount),etapa:step===4?'resultado':String(step)});if(state.goal)query.set('objetivo',state.goal);if(state.profile)query.set('perfil',state.profile);history.replaceState(null,'',location.pathname+'?'+query);}
  function refreshAmount(){state.amount=Number(range.value);const text=rules.money(state.amount);value.value=text;range.setAttribute('aria-valuetext',text);range.style.setProperty('--amount-progress',((state.amount-Number(range.min))/(Number(range.max)-Number(range.min))*100)+'%');decrease.disabled=state.amount<=Number(range.min);increase.disabled=state.amount>=Number(range.max);save();}
  function configureAmount(){
   const [min,max,increment,fallback]=rules.options(state.profile,state.origin),previous=state.amount;
   state.amount=Math.min(max,Math.max(min,min+Math.round(((Number.isFinite(previous)?previous:fallback)-min)/increment)*increment));
   range.min=String(min);range.max=String(max);range.step=String(increment);range.value=String(state.amount);
   const limits=root.querySelector('.simulation-amount-limits');limits.firstElementChild.textContent=rules.money(min);limits.lastElementChild.textContent=rules.money(max);
   decrease.setAttribute('aria-label','Diminuir valor em '+rules.money(increment));increase.setAttribute('aria-label','Aumentar valor em '+rules.money(increment));
   adjustment.hidden=previous===state.amount;adjustment.textContent=previous===state.amount?'':'Você havia selecionado '+rules.money(previous)+'. Confira o valor de interesse para esta opção.';
   refreshAmount();
  }
  function show(next,focus=true){
   step=next;
   root.querySelectorAll('[data-guide-step]').forEach(panel=>{panel.hidden=Number(panel.dataset.guideStep)!==step;});root.querySelector('[data-guide-result]').hidden=step!==4;
   root.querySelectorAll('[data-guide-progress]').forEach(item=>{const index=Number(item.dataset.guideProgress);item.classList.toggle('is-current',index===step);item.classList.toggle('is-complete',index<step);if(index===step)item.setAttribute('aria-current','step');else item.removeAttribute('aria-current');});
   root.querySelectorAll('[data-guide-goal]').forEach(button=>button.setAttribute('aria-pressed',String(button.dataset.guideGoal===state.goal)));
   root.querySelectorAll('[data-guide-profile]').forEach(button=>button.setAttribute('aria-pressed',String(button.dataset.guideProfile===state.profile)));
   heading.textContent=step===1?'O que você quer resolver?':step===2?'O que faz parte da sua realidade?':step===3?'Qual valor faz sentido para você?':rules.profiles[state.profile].title;
   root.querySelector('[data-guide-description]').textContent=step===1?'Escolha o que mais combina com seu momento.':step===2?'Se mais de uma opção servir, escolha por onde prefere começar.':step===3?'Ajuste o valor de interesse antes de continuar.':'Com base nas suas escolhas, este é um caminho para conhecer.';
   back.hidden=step===1||step===4;
   if(step===3)configureAmount();
   if(step===4){
    const slug=rules.destination(state.profile,state.origin),query=rules.encode(state);
    root.querySelector('[data-guide-result-intro]').textContent=rules.profiles[state.profile].description;
    root.querySelector('[data-result-goal]').textContent=rules.goals[state.goal];root.querySelector('[data-result-profile]').textContent=rules.profiles[state.profile].label;root.querySelector('[data-result-amount]').textContent=rules.money(state.amount);
    root.querySelector('[data-guide-form]').href='../'+slug+'/simulacao.html?'+query;
    root.querySelector('[data-guide-product]').href='../'+(slug==='fivecred-next'?'index.html':slug+'/index.html')+'?'+query;
   }
   save();if(focus){heading.focus({preventScroll:true});heading.scrollIntoView({block:'start',behavior:'instant'});}
  }
  root.querySelectorAll('[data-guide-goal]').forEach(button=>button.addEventListener('click',()=>{state.goal=button.dataset.guideGoal;show(2);}));
  root.querySelectorAll('[data-guide-profile]').forEach(button=>button.addEventListener('click',()=>{state.profile=button.dataset.guideProfile;show(3);}));
  range.addEventListener('input',refreshAmount);range.addEventListener('change',refreshAmount);
  decrease.addEventListener('click',()=>{range.stepDown();refreshAmount();});increase.addEventListener('click',()=>{range.stepUp();refreshAmount();});
  root.querySelector('[data-guide-next]').addEventListener('click',()=>{if(current())show(4);});back.addEventListener('click',()=>show(Math.max(1,step-1)));root.querySelector('[data-guide-edit]').addEventListener('click',()=>show(1));
  const headerBack=document.querySelector('.simulation-back');if(headerBack)headerBack.href=state.origin==='fivecred-next'?'../index.html':'../fivecred-landing-page/index.html';
  root.hidden=false;document.querySelector('[data-guide-fallback]').hidden=true;show(step,false);
 }
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});else init();
})();
