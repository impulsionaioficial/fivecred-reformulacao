/* Context for generic contact buttons only. Original form payloads are untouched. */
(() => {
 'use strict';
 function init(){
  const rules=window.FivecredCredit;if(!rules)return;
  function current(){
   if(window.FivecredGuideState)return window.FivecredGuideState();
   const state=rules.forPage(location.pathname,location.search);if(!state)return null;
   const range=document.querySelector('[data-simulation-range]');if(range){const amount=Number(range.value);return rules.validAmount(amount,rules.options(state.profile,state.origin))?{...state,amount}:null;}
   return state;
  }
  window.FivecredCreditContext={current};
  const slug=rules.pageSlug(location.pathname),initial=current();
  if(initial){
   const keys=new URLSearchParams(rules.encode(initial));
   document.querySelectorAll('[data-simulation-link]').forEach(link=>{const url=new URL(link.href,location.href);keys.forEach((v,k)=>url.searchParams.set(k,v));link.href=url.pathname+url.search;});
   const summary=document.querySelector('[data-simulation-selection]');
   if(summary){
    const dl=document.createElement('dl');dl.className='credit-context-summary';dl.dataset.creditSummary='';
    for(const [title,text] of [['Objetivo',rules.goals[initial.goal]],['Perfil',rules.profiles[initial.profile].label]]){const row=document.createElement('div'),dt=document.createElement('dt'),dd=document.createElement('dd');dt.textContent=title;dd.textContent=text;row.append(dt,dd);dl.append(row);}
    summary.firstElementChild.append(dl);const edit=summary.querySelector('[data-edit-amount]');edit.href='../orientacao/index.html?'+rules.encode(initial)+'&etapa=3';edit.textContent='Alterar escolhas';
    const back=document.querySelector('.simulation-back');if(back)back.href='../orientacao/index.html?'+rules.encode(initial)+'&etapa=resultado';
   }
  }
  const originalMessages=new WeakMap();
  document.addEventListener('click',event=>{
   const button=event.target instanceof Element?event.target.closest('[data-whatsapp]'):null;if(!button)return;
   if(!Object.hasOwn(rules.amountOptions,slug)&&slug!=='orientacao')return;
   if(!originalMessages.has(button))originalMessages.set(button,button.dataset.message||'');
   const original=originalMessages.get(button),state=current();
   if(state){const message=rules.message(state);button.dataset.message=original?original+'\n\n'+message.split('\n').slice(1).join('\n'):message;return;}
   const config=rules.amountOptions[slug];if(!config)return;
   const range=document.querySelector('[data-simulation-range]'),params=new URLSearchParams(location.search);
   const raw=range?.value||(params.getAll('valor_simulacao').length===1?params.get('valor_simulacao'):'');
   const amount=/^\d{1,7}$/.test(raw||'')?Number(raw):NaN;
   if(!rules.validAmount(amount,config)){button.dataset.message=original;return;}
   const heading=document.querySelector('.hero h1,.simulation-heading h1')?.textContent.trim();
   const profile=Object.values(rules.profiles).find(p=>p.slug===slug);
   button.dataset.message=(original||'Olá, Fivecred! Gostaria de atendimento.'+(heading?'\nAssunto: '+heading:''))+(profile?'\nPerfil: '+profile.label:'')+'\nValor de interesse: '+rules.money(amount);
  },true);
 }
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});else init();
})();
