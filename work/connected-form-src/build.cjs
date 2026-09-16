const path=require('node:path');
const esbuild=require('C:/Users/auror/Downloads/fivecred.com.br-main/node_modules/esbuild');
const root=path.resolve(__dirname,'../..');
const common={bundle:true,nodePaths:['C:/Users/auror/Downloads/fivecred.com.br-main/node_modules'],jsx:'automatic',minify:true,define:{'process.env.NODE_ENV':'"production"'},logLevel:'info'};
esbuild.buildSync({...common,entryPoints:[path.join(__dirname,'browser.tsx')],platform:'browser',format:'iife',target:['es2020'],outfile:path.join(root,'shared/connected-forms.js')});
esbuild.buildSync({...common,entryPoints:[path.join(__dirname,'server.tsx')],platform:'node',format:'cjs',outfile:path.join(root,'work/connected-forms.cjs')});
