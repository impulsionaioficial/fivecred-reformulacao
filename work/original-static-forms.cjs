'use strict';
const forms=require('./original-static-forms.html.json');
const staticFormSlugs=Object.freeze(Object.keys(forms));
function renderOriginalStaticForm(slug,prefix='../'){return forms[slug]||'';}
function originalStaticFormAssets(slug,prefix='../'){return forms[slug]?{css:prefix+'shared/original-forms/forms.css',script:prefix+'shared/original-forms/'+slug+'.js'}:null;}
module.exports={renderOriginalStaticForm,originalStaticFormAssets,staticFormSlugs};
