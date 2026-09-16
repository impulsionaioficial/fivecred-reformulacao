"use strict";
// Publish only the generated customer pages and their referenced assets.
const fs=require('node:fs'),path=require('node:path');
const root=path.resolve(__dirname,'..'),output=path.join(root,'public-site');
const manifest=JSON.parse(fs.readFileSync(path.join(root,'work/pages-manifest.json'),'utf8'));
const pages=['index.html','politica-de-privacidade.html','termos-de-uso.html','conteudos/index.html','conteudos/politica-de-privacidade.html','conteudos/termos-de-uso.html'];
for(const page of manifest){for(const file of ['index.html','simulacao.html','politica-de-privacidade.html','termos-de-uso.html',...(page.aliases||[])])pages.push(page.slug+'/'+file);if(page.type==='seller')for(const file of ['index.html','politica-de-privacidade.html','termos-de-uso.html'])pages.push(page.slug+'/dist/'+file);}
const files=new Set(pages),queue=[...pages];
while(queue.length){
 const file=queue.shift(),source=fs.readFileSync(path.join(root,file),'utf8');
 const refs=file.endsWith('.html')?[...source.matchAll(/(?:src|href)="([^"#]+)"/g)].map(m=>m[1]):file.endsWith('.css')?[...source.matchAll(/url\(\s*['"]?([^'"\s)]+)['"]?\s*\)/g)].map(m=>m[1]):[];
 for(const ref of refs){
  if(/^(?:[a-z]+:|#|\/\/)/i.test(ref))continue;
  const relative=path.posix.normalize(path.posix.join(path.posix.dirname(file),ref.split(/[?#]/)[0]));
  if(!relative.startsWith('shared/'))continue;
  if(!/\.(?:css|js|png|jpe?g|svg|webp|woff2?)$/.test(relative))throw Error('Unexpected public asset: '+relative);
  if(!files.has(relative)){files.add(relative);if(/\.(css|html)$/.test(relative))queue.push(relative);}
 }
}
// Never recurse into an existing symlink, or publish untracked/private files.
if(fs.existsSync(output)&&fs.lstatSync(output).isSymbolicLink())throw Error('Output directory must not be a symlink');
fs.mkdirSync(output,{recursive:true});
for(const file of files){const dest=path.join(output,file);fs.mkdirSync(path.dirname(dest),{recursive:true});fs.copyFileSync(path.join(root,file),dest);}
fs.writeFileSync(path.join(output,'robots.txt'),'User-agent: *\nAllow: /\n');
// Deployment output contains no build bookkeeping or source files.
// The build is deterministic, and only this explicit file set is copied.
function verifyOutput(folder){for(const entry of fs.readdirSync(folder,{withFileTypes:true})){const file=path.join(folder,entry.name);if(entry.isSymbolicLink())throw Error('Unexpected symlink in public output');if(entry.isDirectory())verifyOutput(file);else{const relative=path.relative(output,file).split(path.sep).join('/');if(relative!=='robots.txt'&&!files.has(relative))throw Error('Unexpected file in public output: '+relative);}}}
verifyOutput(output);
console.log(JSON.stringify({result:'PASS',publicPages:pages.length,files:files.size+1,home:'General Fivecred LP',output},null,2));
