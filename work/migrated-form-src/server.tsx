import React from 'react';
import {renderToString} from 'react-dom/server';
import {MigratedForm} from './Form';
export function renderMigratedForm(slug:string){
 const product=slug==='clt-fivecred'?'clt':slug==='fgts-fivecred'?'fgts':null;
 if(!product)throw new Error('Unknown migrated form: '+slug);
 return `<div id="simulacao" class="legacy-product-form migrated-form-mount" data-migrated-form="${product}">${renderToString(<MigratedForm product={product}/>)}</div><noscript><p>Ative o JavaScript para preencher e enviar o formulário.</p></noscript>`;
}
