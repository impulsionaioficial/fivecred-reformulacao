"use strict";
// Existing partner names; SVG assets supplied via the repository selected by the user.
const groups=[
 {category:'Bancos',names:['Banco BV','PAN','Daycoval','BMG','C6 Bank']},
 {category:'Crédito estruturado',names:['Creditas','CashMe','Crefisa']},
 {category:'Soluções especializadas',names:['CREFAZ','ICred','Nossa Fintech','Grandino']}
];
const logos={'Banco BV':'bv','PAN':'pan','Daycoval':'daycoval','BMG':'bmg','C6 Bank':'c6'};
function brand(name,esc,prefix='../'){return logos[name]?`<img class="partner-logo" src="${prefix}shared/assets/partners/${logos[name]}.svg" width="160" height="48" loading="lazy" alt="${esc(name)}">`:`<strong>${esc(name)}</strong>`;}
module.exports=function renderPartnerMarquee(esc,prefix='../'){
 const items=groups.flatMap(group=>group.names.map(name=>`<li>${brand(name,esc,prefix)}<span>${esc(group.category)}</span></li>`)).join('');
 return `<div class="partner-marquee" data-partner-marquee><div class="partner-marquee-viewport" aria-label="Instituições parceiras"><div class="partner-marquee-track"><ul class="partner-marquee-list" data-partner-original role="list">${items}</ul><ul class="partner-marquee-list" data-partner-copy aria-hidden="true" inert>${items}</ul></div></div></div>`;
};

module.exports.brand=brand;
