const fs=require('node:fs');
const path=require('node:path');
const directions=require('./content/visual-direction.json');
const root=path.resolve(__dirname,'..');
function apply(pages){for(const page of pages){const d=directions[page.slug];if(d){page.headline=d.headline;page.intro=d.intro;page.description=d.intro;page.label=d.name;}}}
function imageSlot(page,prefix,kind,icon,esc){
 const d=directions[page.slug];
 const team=kind==='team';
 const stem=team?'equipe-fivecred':page.slug+'-contexto';
 const filename=(team?d.teamImageFile:d.imageFile)||['webp','jpg','png'].map(ext=>stem+'.'+ext).find(name=>fs.existsSync(path.join(root,'shared/assets/lps',name)));
 const cls=team?(page.type==='seller'?'s-team-placeholder':'brand-placeholder'):'context-placeholder';
 const title=team?'A equipe que atende você':d.imageTitle;
 const description=team?'Inserir foto oficial da equipe Fivecred em atendimento no escritório, ou uma arte institucional da marca.':d.imageDescription;
 if(filename)return `<figure class="media-slot ${cls} has-image" data-image-slot="${kind}"><img src="${prefix}shared/assets/lps/${filename}" width="1200" height="900" loading="lazy" style="object-position:${esc(team?d.teamImagePosition||'center':d.imagePosition||'center')}" alt="${esc(team?d.teamImageAlt||'Atendimento Fivecred':d.imageAlt||d.imageTitle)}"></figure>`;
 return `<figure class="media-slot ${cls}" data-image-slot="${kind}" aria-label="Espaço reservado para foto ou design da Fivecred"><span class="media-label">Imagem a inserir</span><div class="media-direction">${icon('photo')}<strong>${esc(title)}</strong><p>${esc(description)}</p></div><span class="media-signature" aria-hidden="true">Fivecred</span></figure>`;
}
function story(page,prefix,icon,esc){
 const d=directions[page.slug];
 return `<section class="section product-story" id="sobre"><div class="container product-story-grid">${imageSlot(page,prefix,'context',icon,esc)}<div class="story-copy"><p class="section-label">${esc(d.name)}</p><h2>${esc(d.storyTitle)}</h2><p class="story-intro">${esc(d.storyIntro)}</p><ul class="product-facts">${d.facts.map(([name,title,text])=>`<li><details data-reading-panel open><summary>${icon(name)}<strong>${esc(title)}</strong><span class="reading-toggle" aria-hidden="true">${icon('plus')}</span></summary><div class="reading-panel-body"><p>${esc(text)}</p></div></details></li>`).join('')}</ul><p class="product-note">${esc(d.note)}</p>${require('./simulation-pages.cjs').sectionAction(page,prefix,icon,esc)}</div></div></section>`;
}
function highlights(page,icon,esc){const d=directions[page.slug];return `<ul class="hero-highlights">${d.facts.map(([name,title])=>`<li>${icon(name)}<span>${esc(title)}</span></li>`).join('')}</ul>`;}
module.exports={apply,imageSlot,story,highlights,directions};
