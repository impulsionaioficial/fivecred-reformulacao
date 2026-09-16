'use strict';
const forms=require('./original-static-forms.html.json');
const staticFormSlugs=Object.freeze(Object.keys(forms));
function renderOriginalStaticForm(slug,prefix='../'){let markup=forms[slug]||'';
 if(slug==='fivecred-landing-page'&&!markup.includes('form-unavailable')){
  markup=markup.replace(/Prévia local: este formulário não envia dados\./g,'Envio temporariamente indisponível.');
  markup=markup.replace(/(<form[^>]*>)/,'$1<p class="form-unavailable" role="status">O envio deste formulário está temporariamente indisponível. Você pode falar com a equipe pelos canais de atendimento da página.</p><fieldset disabled>').replace('</form>','</fieldset></form>');
 }
 return markup;}
function originalStaticFormAssets(slug,prefix='../'){return forms[slug]?{css:prefix+'shared/original-forms/forms.css',script:prefix+'shared/original-forms/'+slug+'.js'}:null;}
module.exports={renderOriginalStaticForm,originalStaticFormAssets,staticFormSlugs};
