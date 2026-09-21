"use strict";
// Presentation and navigation only. The original form renderers own every field and submission.
const messages={
 'clt-fivecred':['Planeje sua simulação de crédito CLT.','Conte sobre seu vínculo e salário. Veja uma estimativa e leve suas dúvidas para a equipe.','Simule aqui','Simulação de consignado CLT'],
 'fgts-fivecred':['Conheça as possibilidades do seu FGTS.','Informe o saldo aproximado e a situação do saque-aniversário para começar a consulta.','Simule aqui','Consulta de antecipação FGTS'],
 'fivecred-next':['Simule seu crédito com a Fivecred.','Escolha seu objetivo, seu perfil e o valor desejado. Conheça um caminho antes de informar seus dados.','Simule aqui','Simulação de crédito'],
 'fivecred-landing-page':['Seu próximo plano começa aqui.','Conte seu objetivo, escolha seu perfil e confira um caminho para começar.','Simule aqui','Solicitação de crédito'],
 'bolsa-fivecred':['Veja as possibilidades para você.','Informe seus dados e as informações do benefício para iniciar sua simulação.','Simule aqui','Crédito para quem recebe Bolsa Família'],
 'consignado-fivecred':['Comece sua simulação de consignado.','Informe os dados do seu benefício e consulte uma estimativa para o seu momento.','Simule aqui','Simulação de consignado INSS'],
 'luz-fivecred':['Simule o crédito na conta de luz.','Conte sobre você e sua conta de energia. A disponibilidade depende da sua região e distribuidora.','Simule aqui','Simulação de crédito na conta de luz'],
 'imovel-fivecred':['Dê o primeiro passo com seu imóvel.','Conte sobre você e o imóvel que pretende usar como garantia. Conheça uma estimativa antes de decidir.','Simule aqui','Crédito com garantia de imóvel'],
 'veiculo-fivecred':['Seu veículo pode abrir possibilidades.','Informe seus dados e as características do veículo para iniciar sua simulação.','Simule aqui','Crédito com garantia de veículo'],
 'contemplada.fivecred.com.br':['Encontre uma carta para seus planos.','Conte qual bem você procura. A equipe orienta sobre as cartas disponíveis e as condições da compra.','Simule aqui','Consulta de cartas contempladas'],
 'lp-venda-carta-contemplada':['Quanto pode valer a sua carta?','Informe modalidade, administradora e valor do crédito para solicitar uma avaliação de compra à Fivecred.','Solicitar avaliação','Avaliação da sua carta contemplada'],
 'fivecred-afiliados':['Faça parte dos parceiros Fivecred.','Conte sobre você e como pretende indicar clientes. Comece seu cadastro no programa de afiliados.','Quero me cadastrar','Cadastro de afiliado']
};

// Selection scales only: these are not approved credit limits or calculated offers.
const amountOptions=require('../shared/credit-routing.js').amountOptions;
const money=value=>new Intl.NumberFormat('pt-BR',{style:'currency',currency:'BRL',maximumFractionDigits:0}).format(value);
function amountAttributes(page){const values=amountOptions[page.slug];if(!values)return '';const [min,max,step,initial]=values;return `data-amount-min="${min}" data-amount-max="${max}" data-amount-step="${step}" data-amount-initial="${initial}"`;}
function amountControl(page,esc){
 const values=amountOptions[page.slug];if(!values)return '';
 const [min,max,step,initial]=values;
 return `<div class="simulation-amount" data-simulation-amount ${amountAttributes(page)} hidden><label for="simulation-amount-range">Qual valor você quer simular?</label><output class="simulation-amount-value" data-amount-value for="simulation-amount-range" aria-live="off">${esc(money(initial))}</output><div class="simulation-amount-controls"><button type="button" data-amount-decrease aria-label="Diminuir valor em ${esc(money(step))}">−</button><input type="range" id="simulation-amount-range" data-simulation-range min="${min}" max="${max}" step="${step}" value="${initial}" aria-valuetext="${esc(money(initial))}" aria-describedby="simulation-amount-hint"><button type="button" data-amount-increase aria-label="Aumentar valor em ${esc(money(step))}">+</button></div><div class="simulation-amount-limits" aria-hidden="true"><span>${esc(money(min))}</span><span>${esc(money(max))}</span></div><p id="simulation-amount-hint" class="simulation-amount-hint">Valor de interesse. A disponibilidade depende da análise.</p></div>`;
}
function selection(page,prefix){
 if(!amountOptions[page.slug])return '';
 const destination=page.slug==='fivecred-next'?prefix+'index.html':prefix+page.slug+'/index.html';
 return `<aside class="simulation-selection" data-simulation-selection ${amountAttributes(page)} hidden aria-label="Valor escolhido para a simulação"><div><span>Valor que você quer simular</span><strong data-selected-amount></strong><p>Referência para sua consulta. As condições dependem da análise.</p></div><a href="${destination}" data-edit-amount>Alterar valor</a></aside>`;
}

function settings(page){const [title,description,action,heading]=messages[page.slug];return {title,description,action,heading,note:page.type==='seller'?'Sem compromisso. Você decide se deseja vender.':page.type==='affiliate'?'Conheça as regras e as condições da parceria.':'Sem compromisso. Sujeito à análise e às condições da proposta.'};}
function href(page,prefix='../'){return ['fivecred-next','fivecred-landing-page'].includes(page.slug)?prefix+'orientacao/index.html?origem='+page.slug:prefix+page.slug+'/simulacao.html';}
function card(page,prefix,icon,esc){const c=settings(page);return `<aside class="simulation-cta" id="simulacao" aria-labelledby="simulation-call-title"><span class="simulation-cta-icon">${icon(page.type==='affiliate'?'people':'document')}</span><h2 id="simulation-call-title">${esc(c.title)}</h2><p class="simulation-cta-description">${esc(c.description)}</p>${amountControl(page,esc)}<a class="button simulation-cta-button${c.action==='Simule aqui'?' button-simulate':''}" data-simulation-link href="${href(page,prefix)}">${esc(c.action)}${icon('arrow')}</a><p class="simulation-cta-note">${icon('shield')}<span>${esc(c.note)}</span></p></aside>`;}
function sectionAction(page,prefix,icon,esc,message=''){
 const c=settings(page),label=c.action;
 const text=message||(page.type==='seller'?'Conheça uma proposta para a sua carta.':page.type==='affiliate'?'Dê o próximo passo para conhecer a parceria.':'Veja o próximo passo para o seu momento.');
 return `<div class="section-action"><p>${esc(text)}</p><a class="button button-simulate" data-simulation-link href="${href(page,prefix)}">${esc(label)}${icon('arrow')}</a></div>`;
}
module.exports={settings,href,card,selection,amountControl,sectionAction};
