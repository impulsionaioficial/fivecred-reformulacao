import React, {useEffect, useRef, useState} from 'react';
import LeadForm from './components/LeadForm';
export function MigratedForm({product}:{product:'clt'|'fgts'}) {
 const fieldset=useRef<HTMLFieldSetElement>(null);
 const [ready,setReady]=useState(false);
 useEffect(()=>{setReady(true);const mount=fieldset.current?.closest<HTMLElement>('[data-migrated-form]');if(mount)mount.dataset.formReady='true';},[]);
 return <form noValidate aria-label={product==='clt'?'Simulação de crédito CLT':'Consulta de antecipação FGTS'} onSubmit={event=>event.preventDefault()}><fieldset ref={fieldset} disabled={!ready} className="migrated-form-fields"><LeadForm product={product}/></fieldset></form>;
}
