"use strict";
// Existing partner names; no extra institution or unverified logo is introduced.
const groups=[
 {category:'Bancos',names:['Banco BV','PAN','Daycoval','BMG','C6 Bank']},
 {category:'Crédito estruturado',names:['Creditas','CashMe','Crefisa']},
 {category:'Soluções especializadas',names:['CREFAZ','ICred','Nossa Fintech','Grandino']}
];
module.exports=function renderPartnerMarquee(esc){
 const items=groups.flatMap(group=>group.names.map(name=>`<li><strong>${esc(name)}</strong><span>${esc(group.category)}</span></li>`)).join('');
 return `<div class="partner-marquee" data-partner-marquee><div class="partner-marquee-viewport" aria-label="Instituições parceiras"><div class="partner-marquee-track"><ul class="partner-marquee-list" data-partner-original role="list">${items}</ul><ul class="partner-marquee-list" data-partner-copy aria-hidden="true" inert>${items}</ul></div></div></div>`;
};
