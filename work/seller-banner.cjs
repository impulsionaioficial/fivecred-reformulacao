const fs = require('node:fs');
const path = require('node:path');
module.exports = function sellerBanner({prefix, icon, esc}) {
  const root = path.resolve(__dirname, '..');
  const config = JSON.parse(fs.readFileSync(path.join(__dirname, 'seller-banners.json'), 'utf8'));
  const slides = config.slides || [];
  if (!slides.length) return '';
  function imagePath(name) {
    if (!name) return '';
    if (path.basename(name) !== name || !/\.(png|jpe?g|webp|avif)$/i.test(name)) throw new Error('Use um nome de arquivo PNG, JPG, WebP ou AVIF na pasta shared/assets/banners.');
    if (!fs.existsSync(path.join(root, 'shared/assets/banners', name))) throw new Error('Banner não encontrado: ' + name);
    return prefix + 'shared/assets/banners/' + encodeURIComponent(name);
  }
  const interval = Math.max(5000, Number(config.intervalMs) || 8000);
  return `<section class="s-banner" data-seller-carousel data-interval="${interval}" role="region" aria-roledescription="carrossel" aria-label="Banners Fivecred"><div class="s-banner-viewport" data-banner-viewport aria-live="off">${slides.map((slide, i) => {
    const desktop = imagePath(slide.image), mobile = imagePath(slide.mobileImage);
    if (mobile && !desktop) throw new Error('Informe também a imagem principal do banner: ' + slide.title);
    const content = desktop ? `<picture>${mobile ? `<source media="(max-width:699px)" srcset="${esc(mobile)}">` : ''}<img class="s-banner-image" src="${esc(desktop)}" alt="${esc(slide.alt || slide.title)}" width="1920" height="600" ${i === 0 ? 'fetchpriority="high"' : 'loading="lazy"'}></picture>` : `<div class="s-banner-placeholder"><div class="container s-banner-placeholder-inner"><span class="s-banner-eyebrow">Arte oficial Fivecred a inserir</span><strong>${esc(slide.title)}</strong><p>Este espaço receberá a imagem da campanha.</p></div></div>`;
    return `<div class="s-banner-slide" data-banner-slide data-title="${esc(slide.title)}" role="group" aria-roledescription="slide" aria-label="${i + 1} de ${slides.length}"${i ? ' hidden' : ''}>${content}</div>`;
  }).join('')}</div></section>`;
};
