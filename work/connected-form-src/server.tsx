import React from 'react';
import { renderToString } from 'react-dom/server';
import { ConnectedForm, SLUGS } from './forms';
export function renderConnectedForm(slug: string,placement='hero') {
  const kind=SLUGS[slug];
  if(!kind)throw new Error(`No original connected form for ${slug}`);
  if(placement!=='hero'&&placement!=='cta')throw new Error(`Invalid form placement: ${placement}`);
  return `<div class="connected-form-mount" data-connected-form="${kind}" data-placement="${placement}">${renderToString(<ConnectedForm kind={kind} placement={placement}/>)}</div><noscript><p class="cf-noscript">Ative o JavaScript para preencher e enviar este formulário.</p></noscript>`;
}
