const staticSlugs = new Set(['bolsa-fivecred','consignado-fivecred','luz-fivecred','imovel-fivecred','veiculo-fivecred','fivecred-landing-page']);
const connectedSlugs = new Set(['fivecred-next','fivecred-afiliados','contemplada.fivecred.com.br']);
function assetsFor(page,prefix='../') {
 const styles=[prefix+'shared/site.css',prefix+'shared/lp-design.css?v=20260915',prefix+'shared/whatsapp-contact.css?v=20260915-1'];
 const scripts=[prefix+'shared/whatsapp-contact.js?v=20260915-1',prefix+'shared/site.js?v=20260915-wa'];
 if(page.type==='seller'){styles.push(prefix+'shared/seller.css?v=20260915');scripts.push(prefix+'shared/journey.js');}
 if(staticSlugs.has(page.slug)){const a=require('./original-static-forms.cjs').originalStaticFormAssets(page.slug,prefix);styles.push(a.css);scripts.push(a.script);}
 if(connectedSlugs.has(page.slug)){styles.push(prefix+'shared/connected-forms.css');scripts.push(prefix+'shared/connected-forms.js?v=20260915-wa');}
 return {styles,scripts};
}
function formFor(page,prefix='../',placement='hero'){
 if(staticSlugs.has(page.slug))return require('./original-static-forms.cjs').renderOriginalStaticForm(page.slug,prefix);
 if(connectedSlugs.has(page.slug))return (placement==='hero'?'<div id="simulacao">':'<div>')+require('./connected-forms.cjs').renderConnectedForm(page.slug,placement)+'</div>';
 throw new Error('Original form not mapped: '+page.slug);
}
function connectionsFor(page){
 if(connectedSlugs.has(page.slug))return 'https://hook.us1.make.celonis.com';
 return "'none'";
}
module.exports={assetsFor,formFor,connectionsFor};
