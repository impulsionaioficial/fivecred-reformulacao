const assert=require('node:assert/strict');
const routing=require('../shared/credit-routing.js');
for(const origin of ['fivecred-next','fivecred-landing-page'])for(const profile of Object.keys(routing.profiles)){
 const state={goal:'organizar',profile,origin,amount:routing.options(profile,origin)[3]};
 const query=routing.encode(state);
 assert.deepEqual(routing.decode(query),state);
 const slug=routing.destination(profile,origin);
 assert(slug&&slug!=='lp-venda-carta-contemplada');
 assert.equal(routing.forPage('/'+slug+'/simulacao.html',query).profile,profile);
 assert.equal(routing.forPage('/fivecred-afiliados/index.html',query),null);
 assert.equal(routing.forPage('/lp-venda-carta-contemplada/index.html',query),null);
 assert(!routing.message(state).includes('aprovado'));
}
assert.equal(routing.destination('clt','fivecred-next'),'clt-fivecred');
assert.equal(routing.destination('fgts','fivecred-next'),'fgts-fivecred');
assert.equal(routing.destination('outro','fivecred-landing-page'),'fivecred-landing-page');
for(const query of ['objetivo=<script>&perfil=clt&valor_simulacao=10000','objetivo=organizar&perfil=clt&valor_simulacao=10000&perfil=fgts','objetivo=organizar&perfil=clt&valor_simulacao=-100','objetivo=organizar&perfil=clt&valor_simulacao=1250.5','objetivo=organizar&perfil=__proto__&valor_simulacao=1000','objetivo=organizar&perfil=clt&valor_simulacao=10000&origem=https://evil.example'])assert.equal(routing.decode(query),null,query);
const clt=routing.encode({goal:'organizar',profile:'clt',amount:10000,origin:'fivecred-next'});
assert.equal(routing.forPage('/fgts-fivecred/index.html',clt),null);
assert.equal(routing.forPage('/index.html',clt).profile,'clt');
console.log('PASS: 16 routing combinations, invalid inputs and product isolation');
