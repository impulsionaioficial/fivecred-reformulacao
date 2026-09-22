/* Shared routing vocabulary. No personal data, network calls or storage. */
((root,factory)=>{if(typeof module==='object'&&module.exports)module.exports=factory();else root.FivecredCredit=factory();})(typeof window==='undefined'?globalThis:window,()=>{
 'use strict';
 const amountOptions={
 'fivecred-next':[500,50000,500,10000],
 'fivecred-landing-page':[500,50000,500,10000],
 'bolsa-fivecred':[100,750,50,750],
 'consignado-fivecred':[1000,100000,1000,15000],
 'luz-fivecred':[500,2500,50,1500],
 'imovel-fivecred':[50000,1000000,5000,150000],
 'veiculo-fivecred':[5000,150000,1000,30000],
 'clt-fivecred':[1000,50000,500,10000],
 'fgts-fivecred':[100,1500,100,1000],
 'contemplada.fivecred.com.br':[50000,1000000,10000,150000]
};
 const goals={organizar:'Organizar minhas contas',projeto:'Realizar um projeto',negocio:'Investir no meu negócio',conhecer:'Entender minhas opções'};
 const profiles={
  clt:{label:'Trabalho de carteira assinada',slug:'clt-fivecred',title:'Conheça as possibilidades de crédito CLT',description:'Seu vínculo de trabalho é um ponto de partida para consultar as opções e condições dessa modalidade.'},
  beneficio:{label:'Recebo aposentadoria ou benefício',slug:'consignado-fivecred',title:'Conheça as opções para o seu benefício',description:'A equipe pode orientar a consulta conforme o tipo de benefício e as condições da instituição responsável.'},
  fgts:{label:'Tenho saldo no FGTS',slug:'fgts-fivecred',title:'Entenda a antecipação do FGTS',description:'Consulte as possibilidades conforme o saque-aniversário, seu saldo e as condições aplicáveis.'},
  veiculo:{label:'Tenho veículo no meu nome',slug:'veiculo-fivecred',title:'Conheça o crédito com garantia de veículo',description:'Converse sobre a avaliação do veículo, os custos e as condições de uma operação com garantia.'},
  imovel:{label:'Tenho imóvel no meu nome',slug:'imovel-fivecred',title:'Conheça o crédito com garantia de imóvel',description:'Entenda a avaliação, os custos e as condições antes de decidir sobre uma operação com garantia.'},
  luz:{label:'A conta de luz está no meu nome',slug:'luz-fivecred',title:'Consulte o crédito na conta de luz',description:'A disponibilidade depende da sua região, distribuidora e análise da instituição responsável.'},
  bolsa:{label:'Recebo Bolsa Família',slug:'bolsa-fivecred',title:'Converse sobre as opções para o seu perfil',description:'Receber o benefício não garante crédito. A equipe explica quais possibilidades podem ser analisadas para você.'},
  outro:{label:'Minha situação é outra',slug:null,title:'Vamos entender seu momento',description:'Conte sua situação para a equipe Fivecred. A conversa ajuda a esclarecer por onde começar.'}
 };
 const origins=['fivecred-next','fivecred-landing-page'];
 const own=(object,key)=>Object.prototype.hasOwnProperty.call(object,key);
 const money=value=>new Intl.NumberFormat('pt-BR',{style:'currency',currency:'BRL',maximumFractionDigits:0}).format(value);
 function destination(profile,origin='fivecred-next'){return own(profiles,profile)&&origins.includes(origin)?profiles[profile].slug||origin:null;}
 function options(profile,origin){return amountOptions[destination(profile,origin)]||null;}
 function validAmount(value,range){return Number.isSafeInteger(value)&&range&&value>=range[0]&&value<=range[1]&&(value-range[0])%range[2]===0;}
 function decode(search){
  const params=new URLSearchParams(search);
  if(['objetivo','perfil','valor_simulacao','origem'].some(key=>params.getAll(key).length>1))return null;
  const goal=params.get('objetivo'),profile=params.get('perfil'),origin=params.get('origem')||'fivecred-next',raw=params.get('valor_simulacao')||'';
  if(!own(goals,goal)||!own(profiles,profile)||!origins.includes(origin)||!/^\d{1,7}$/.test(raw))return null;
  const amount=Number(raw);return validAmount(amount,options(profile,origin))?{goal,profile,origin,amount}:null;
 }
 function encode(state){return new URLSearchParams({objetivo:state.goal,perfil:state.profile,origem:state.origin,valor_simulacao:String(state.amount)}).toString();}
 function pageSlug(pathname){if(pathname==='/'||pathname==='/index.html')return 'fivecred-next';return pathname.split('/').filter(Boolean)[0]||'';}
 function forPage(pathname,search){const state=decode(search);if(!state)return null;const slug=pageSlug(pathname);return slug==='orientacao'||slug===destination(state.profile,state.origin)||slug===state.origin?state:null;}
 function message(state){return 'Olá, Fivecred! Gostaria de conhecer as opções para meu momento.\nObjetivo: '+goals[state.goal]+'\nPerfil: '+profiles[state.profile].label+'\nValor de interesse: '+money(state.amount);}
 return {amountOptions,goals,profiles,origins,money,destination,options,validAmount,decode,encode,pageSlug,forPage,message};
});
