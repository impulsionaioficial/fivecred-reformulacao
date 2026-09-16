const staticSlugs = new Set(['bolsa-fivecred','consignado-fivecred','luz-fivecred','imovel-fivecred','veiculo-fivecred','fivecred-landing-page']);
const migratedSlugs = new Set(['clt-fivecred','fgts-fivecred']);
const connectedSlugs = new Set(['fivecred-next','fivecred-afiliados','contemplada.fivecred.com.br']);
function assetsFor(page,prefix='../') {
 const styles=[prefix+'shared/site.css',prefix+'shared/lp-design.css?v=20260916-products',prefix+'shared/whatsapp-contact.css?v=20260915-1'];
 const scripts=[prefix+'shared/content-panels.js?v=20260916-editorial',prefix+'shared/whatsapp-contact.js?v=20260915-1',prefix+'shared/site.js?v=20260916-production'];
 if(page.type==='seller'){styles.push(prefix+'shared/seller.css?v=20260915');if(page.formPage)scripts.push(prefix+'shared/journey.js');}
 if(page.formPage&&staticSlugs.has(page.slug)){const a=require('./original-static-forms.cjs').originalStaticFormAssets(page.slug,prefix);styles.push(a.css);scripts.push(a.script);}
 if(page.formPage&&connectedSlugs.has(page.slug)){styles.push(prefix+'shared/connected-forms.css');scripts.push(prefix+'shared/connected-forms.js?v=20260915-wa');}
 if(page.formPage&&migratedSlugs.has(page.slug)){styles.push(prefix+'shared/migrated-forms.css?v=20260916');scripts.push(prefix+'shared/migrated-forms.js?v=20260916');}
 styles.push(prefix+'shared/responsive.css?v=20260916-height');
 styles.push(prefix+'shared/brand-refresh.css?v=20260916-editorial');
 styles.push(prefix+'shared/simulation-pages.css?v=20260916-amount');
 scripts.push(prefix+'shared/simulation-amount.js?v=20260916');
 if(!page.formPage&&page.type!=='seller'){styles.push(prefix+'shared/partner-marquee.css?v=20260916-continuous');scripts.push(prefix+'shared/partner-marquee.js?v=20260916-continuous');}
 return {styles,scripts};
}
function formFor(page,prefix='../',placement='hero'){
 if(migratedSlugs.has(page.slug))return require('./migrated-forms.cjs').renderMigratedForm(page.slug);
 if(staticSlugs.has(page.slug))return require('./original-static-forms.cjs').renderOriginalStaticForm(page.slug,prefix);
 if(connectedSlugs.has(page.slug))return (placement==='hero'?'<div id="simulacao">':'<div>')+require('./connected-forms.cjs').renderConnectedForm(page.slug,placement)+'</div>';
 throw new Error('Original form not mapped: '+page.slug);
}
function connectionsFor(page){
 if(migratedSlugs.has(page.slug))return 'https://webhook.agenciaimpulsionai.com.br';
 if(connectedSlugs.has(page.slug))return 'https://hook.us1.make.celonis.com';
 return "'none'";
}
module.exports={assetsFor,formFor,connectionsFor};
