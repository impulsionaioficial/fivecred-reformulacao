const fs = require('fs');
const {JSDOM}=require('C:/Users/auror/Downloads/fivecred.com.br-main/node_modules/jsdom');
const root='C:/Users/auror/Downloads/fivecred-sites';
for(const slug of ['bolsa-fivecred','consignado-fivecred','luz-fivecred','imovel-fivecred','veiculo-fivecred','fivecred-landing-page']){
 const html=fs.readFileSync(root+'/'+slug+'/index.html','utf8');
 const doc=new JSDOM(html).window.document;
 const f=doc.querySelector('form');
 const script=[...doc.scripts].map(s=>s.textContent).find(s=>s.includes('function clearErrors')||s.includes('const maskCPF'));
 fs.writeFileSync(root+'/reformulacoes/work/'+slug+'-source-form.txt',f.outerHTML);
 fs.writeFileSync(root+'/reformulacoes/work/'+slug+'-source-script.txt',script||'');
 console.log(JSON.stringify({slug,formId:f.id,parentClass:f.parentElement.className,fields:[...f.querySelectorAll('input,select')].map(e=>({id:e.id,name:e.name,type:e.type,required:e.required,options:e.options?[...e.options].map(x=>({value:x.value,label:x.textContent})):null})),inlineEvents:[...f.querySelectorAll('*')].flatMap(e=>[...e.attributes].filter(a=>a.name.startsWith('on')).map(a=>[e.tagName,e.id,a.name,a.value])),scriptLength:script?.length}));
}
