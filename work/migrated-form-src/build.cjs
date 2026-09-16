const path=require('node:path'),fs=require('node:fs');
const deps='C:/Users/auror/Downloads/fivecred.com.br-main';
const esbuild=require(path.join(deps,'node_modules/esbuild'));
const postcss=require(path.join(deps,'node_modules/postcss'));
const tailwind=require(require.resolve('@tailwindcss/postcss',{paths:[deps]}));
const root=path.resolve(__dirname,'../..');
const common={bundle:true,nodePaths:[path.join(deps,'node_modules')],jsx:'automatic',minify:true,define:{'process.env.NODE_ENV':'"production"'},logLevel:'info'};
esbuild.buildSync({...common,entryPoints:[path.join(__dirname,'browser.tsx')],platform:'browser',format:'iife',target:['es2020'],outfile:path.join(root,'shared/migrated-forms.js')});
esbuild.buildSync({...common,entryPoints:[path.join(__dirname,'server.tsx')],platform:'node',format:'cjs',outfile:path.join(root,'work/migrated-forms.cjs')});
(async()=>{
 const source=path.join(__dirname,'components/LeadForm.tsx').replaceAll('\\','/');
 const input=`@import "tailwindcss" source(none);
@source "${source}";
@theme {--color-brand-50:#fff3eb;--color-brand-100:#ffe4c6;--color-brand-400:#ffba84;--color-brand-600:#ff6b00;--color-brand-650:#a84000;--color-brand-700:#ad4800;--color-red-655:#b42318;}`;
 const result=await postcss([tailwind({base:__dirname,optimize:false})]).process(input,{from:path.join(deps,'migrated-form.css')});
 const css=postcss.parse(result.css);
 css.walkAtRules('layer',rule=>{if(rule.nodes)rule.replaceWith(...rule.nodes);else rule.remove();});
 css.walkAtRules('font-face',rule=>rule.remove());
 css.walkRules(rule=>{
  let parent=rule.parent;while(parent){if(parent.type==='rule'||(parent.type==='atrule'&&/keyframes$/.test(parent.name)))return;parent=parent.parent;}
  if(rule.selector.includes(':root')||rule.selector.includes(':host'))rule.selector='.legacy-product-form';
  else rule.selector='.legacy-product-form :is('+rule.selector+')';
 });
 css.append(fs.readFileSync(path.join(__dirname,'form-overrides.css'),'utf8'));
 fs.writeFileSync(path.join(root,'shared/migrated-forms.css'),css.toString());
 console.log('Scoped original form utilities compiled.');
})().catch(e=>{console.error(e);process.exitCode=1;});
