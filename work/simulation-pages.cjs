"use strict";
// Presentation and navigation only. The original form renderers own every field and submission.
const messages={
 'fivecred-next':['Simule seu crédito com a Fivecred.','Conte sobre o seu perfil e o valor que procura. Comece sua solicitação e conheça o próximo passo.','Simule aqui','Simulação de crédito'],
 'fivecred-landing-page':['Seu próximo plano começa aqui.','Preencha sua solicitação para conversar sobre as possibilidades de crédito para você.','Simule aqui','Solicitação de crédito'],
 'bolsa-fivecred':['Veja as possibilidades para você.','Informe seus dados e as informações do benefício para iniciar sua simulação.','Simule aqui','Crédito para quem recebe Bolsa Família'],
 'consignado-fivecred':['Comece sua simulação de consignado.','Informe os dados do seu benefício e consulte uma estimativa para o seu momento.','Simule aqui','Simulação de consignado INSS'],
 'luz-fivecred':['Simule o crédito na conta de luz.','Conte sobre você e sua conta de energia. A disponibilidade depende da sua região e distribuidora.','Simule aqui','Simulação de crédito na conta de luz'],
 'imovel-fivecred':['Dê o primeiro passo com seu imóvel.','Conte sobre você e o imóvel que pretende usar como garantia. Conheça uma estimativa antes de decidir.','Simule aqui','Crédito com garantia de imóvel'],
 'veiculo-fivecred':['Seu veículo pode abrir possibilidades.','Informe seus dados e as características do veículo para iniciar sua simulação.','Simule aqui','Crédito com garantia de veículo'],
 'contemplada.fivecred.com.br':['Encontre uma carta para seus planos.','Conte qual bem você procura. A equipe orienta sobre as cartas disponíveis e as condições da compra.','Simule aqui','Consulta de cartas contempladas'],
 'lp-venda-carta-contemplada':['Quanto pode valer a sua carta?','Informe modalidade, administradora e valor do crédito para solicitar uma avaliação de compra à Fivecred.','Solicitar avaliação','Avaliação da sua carta contemplada'],
 'fivecred-afiliados':['Faça parte dos parceiros Fivecred.','Conte sobre você e como pretende indicar clientes. Comece seu cadastro no programa de afiliados.','Quero me cadastrar','Cadastro de afiliado']
};
function settings(page){const [title,description,action,heading]=messages[page.slug];return {title,description,action,heading,note:page.type==='seller'?'Sem compromisso. Você decide se deseja vender.':page.type==='affiliate'?'Conheça as regras e as condições da parceria.':'Sem compromisso. Sujeito à análise e às condições da proposta.'};}
function href(page,prefix='../'){return prefix+page.slug+'/simulacao.html';}
function card(page,prefix,icon,esc){const c=settings(page);return `<aside class="simulation-cta" id="simulacao" aria-labelledby="simulation-call-title"><span class="simulation-cta-icon">${icon(page.type==='affiliate'?'people':'document')}</span><h2 id="simulation-call-title">${esc(c.title)}</h2><p class="simulation-cta-description">${esc(c.description)}</p><a class="button simulation-cta-button" data-simulation-link href="${href(page,prefix)}">${esc(c.action)}${icon('arrow')}</a><p class="simulation-cta-note">${icon('shield')}<span>${esc(c.note)}</span></p></aside>`;}
module.exports={settings,href,card};
