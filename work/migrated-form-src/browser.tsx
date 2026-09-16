import React from 'react';
import {hydrateRoot} from 'react-dom/client';
import {MigratedForm} from './Form';
for(const node of document.querySelectorAll<HTMLElement>('[data-migrated-form]')){
 const product=node.dataset.migratedForm;
 if((product==='clt'||product==='fgts')&&!node.dataset.mounted){node.dataset.mounted='true';hydrateRoot(node,<MigratedForm product={product}/>);}
}
