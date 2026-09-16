const fs = require('fs');const {JSDOM}=require('C:/Users/auror/Downloads/fivecred.com.br-main/node_modules/jsdom');
for(const slug of ['bolsa-fivecred','consignado-fivecred','luz-fivecred','imovel-fivecred']){
 const doc=new JSDOM(fs.readFileSync('C:/Users/auror/Downloads/fivecred-sites/'+slug+'/index.html','utf8')).window.document;
 console.log(slug,doc.getElementById('step-3').textContent.replace(/\s+/g,' ').trim());
}
