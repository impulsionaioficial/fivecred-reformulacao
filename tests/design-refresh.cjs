const fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto'),assert=require('node:assert/strict');
const {JSDOM}=require('C:/Users/auror/Downloads/fivecred.com.br-main/node_modules/jsdom');
const root=path.resolve(__dirname,'..');
const baseline=JSON.parse(fs.readFileSync(path.join(__dirname,'design-preservation-baseline.json')));
const hash=s=>crypto.createHash('sha256').update(s.replaceAll('\r\n','\n')).digest('hex');
let forms=0,slots=0;
for(const [file,expected] of Object.entries(baseline.forms)){
 const d=new JSDOM(fs.readFileSync(path.join(root,file),'utf8')).window.document;
 const actual=[...d.querySelectorAll('.original-form,.connected-form-mount,.j-card')].map(e=>hash(e.outerHTML));
 assert.deepEqual(actual,expected,'Original form preserved: '+file);forms+=actual.length;
 for(const kind of ['context','team']){
  const slot=d.querySelector('[data-image-slot="'+kind+'"]');
  assert(slot,file+' needs a marked '+kind+' image slot');
  assert(/inserir/i.test(slot.textContent)||slot.querySelector('img'),file+' image instructions');
  assert(slot.textContent.trim().length>50||slot.querySelector('img'),file+' image direction must be specific');
  slots++;
 }
 assert.equal(d.querySelectorAll('h1').length,1);
 assert.equal(d.querySelectorAll('#seguranca [data-reading-panel]').length,3);
 assert(d.querySelector('link[href*="brand-refresh.css"]'),'New visual layer loaded');
}
for(const [file,expected] of Object.entries(baseline.scripts))assert.equal(hash(fs.readFileSync(path.join(root,file),'utf8')),expected,'Original behavior preserved: '+file);
console.log(JSON.stringify({result:'PASS',pages:Object.keys(baseline.forms).length,formsPreserved:forms,submissionScriptsPreserved:Object.keys(baseline.scripts).length,markedImageSlots:slots},null,2));
