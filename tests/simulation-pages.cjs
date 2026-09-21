const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict'),crypto=require('node:crypto');
const {JSDOM}=require('C:/Users/auror/Downloads/fivecred.com.br-main/node_modules/jsdom');
const root=path.resolve(__dirname,'..'),manifest=JSON.parse(fs.readFileSync(path.join(root,'work/pages-manifest.json'))),baseline=JSON.parse(fs.readFileSync(path.join(__dirname,'design-preservation-baseline.json')));
const read=file=>new JSDOM(fs.readFileSync(path.join(root,file),'utf8'),{url:'http://local/'+file}).window.document;
const hash=s=>crypto.createHash('sha256').update(s.replaceAll('\r\n','\n')).digest('hex');
let links=0;
for(const item of manifest){
 for(const landing of [item.slug+'/index.html',...(item.slug==='fivecred-next'?['index.html']:[]),...(item.aliases||[]).map(a=>item.slug+'/'+a),...(item.type==='seller'?[item.slug+'/dist/index.html']:[])]){
  const d=read(landing);
  assert.equal(d.querySelectorAll('main form,.original-form,.connected-form-mount,[data-journey],[data-migrated-form]').length,0,landing+' must lead to a dedicated page');
  const card=d.querySelector('.simulation-cta');assert(card,landing+' CTA card');
  assert(card.querySelector('h2')&&card.querySelector('p')&&card.querySelector('a[data-simulation-link]'),landing+' clear simulation call');
  const targets=[...d.querySelectorAll('[data-simulation-link]')];assert(targets.length>=2,landing+' hero and closing');
  for(const a of targets){assert.equal(new URL(a.href).pathname,['fivecred-next','fivecred-landing-page'].includes(item.slug)?'/orientacao/index.html':'/'+item.slug+'/simulacao.html');links++;}
  assert(!d.querySelector('[data-start-profile]'),'Profile actions must navigate');
  assert(![...d.scripts].some(s=>/connected-forms|journey|original-forms|migrated-forms/.test(s.src)),landing+' should not load form code');
 }
 const d=read(item.slug+'/simulacao.html'),forms=[...d.querySelectorAll('.original-form,.connected-form-mount,.j-card,.migrated-form-mount')];
 assert.equal(forms.length,1,item.slug+' one questionnaire');
 if(baseline.forms[item.slug+'/index.html'])assert.equal(hash(forms[0].outerHTML),baseline.forms[item.slug+'/index.html'][0],item.slug+' original form unchanged');
 else assert(d.querySelector('[data-migrated-form]'),'Additional product uses preserved legacy form');
 assert.equal(d.querySelectorAll('h1').length,1);
 assert(d.querySelector('.simulation-back'),'Return navigation');
 assert.equal(new URL(d.querySelector('.simulation-back').href).pathname,item.slug==='fivecred-next'?'/index.html':'/'+item.slug+'/index.html');
 assert(!d.querySelector('.floating-whatsapp'),'No floating interruption on form page');
}
for(const [file,expected] of Object.entries(baseline.scripts))assert.equal(hash(fs.readFileSync(path.join(root,file),'utf8')),expected,file+' submission behavior preserved');
console.log(JSON.stringify({result:'PASS',dedicatedForms:manifest.length,ctaLinks:links,unchangedBehaviorFiles:Object.keys(baseline.scripts).length},null,2));
