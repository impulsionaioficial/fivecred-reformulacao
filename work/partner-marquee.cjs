"use strict";
// Existing partner names; SVG assets supplied via the repository selected by the user.
const groups=[
 {category:'Bancos',names:['Banco BV','PAN','Daycoval','BMG','C6 Bank']},
 {category:'Crédito estruturado',names:['Creditas','CashMe','Crefisa']},
 {category:'Soluções especializadas',names:['CREFAZ','ICred','Nossa Fintech','Grandino']}
];
const logos={'Banco BV':'bv.svg','PAN':'pan.svg','Daycoval':'daycoval.svg','BMG':'bmg.svg','C6 Bank':'c6.svg','Creditas':'creditas.webp','CashMe':'cashme-transparent.webp','Crefisa':'crefisa.webp','CREFAZ':'crefaz.webp','ICred':'icred.webp','Nossa Fintech':'nossa-fintech.webp','Grandino':'grandino.webp'};
function brand(name,esc,prefix='../'){return logos[name]?`<img class="partner-logo" src="${prefix}shared/assets/partners/${logos[name]}" width="160" height="48" loading="lazy" alt="${esc(name)}">`:`<strong>${esc(name)}</strong>`;}
module.exports=function renderPartnerMarquee(esc,prefix='../'){
 const items=groups.flatMap(group=>group.names.map(name=>`<li>${brand(name,esc,prefix)}<span>${esc(group.category)}</span></li>`)).join('');
 return `<div class="partner-marquee" data-partner-marquee><div class="partner-marquee-viewport" aria-label="Instituições parceiras"><div class="partner-marquee-track"><ul class="partner-marquee-list" data-partner-original role="list">${items}</ul><ul class="partner-marquee-list" data-partner-copy aria-hidden="true" inert>${items}</ul></div></div></div>`;
};

module.exports.brand=brand;
