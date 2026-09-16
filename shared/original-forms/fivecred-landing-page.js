/* Form functions extracted from fivecred-landing-page/index.html. See work/original-static-form-contracts.json. */
(() => {
'use strict';
function initOriginalForm(){
const formRoot=document.querySelector('[data-original-form="fivecred-landing-page"]');
if(!formRoot||formRoot.dataset.initialized==='true')return;
formRoot.dataset.initialized='true';
const readyCallbacks=[];const onReady=(callback)=>readyCallbacks.push(callback);

 function syncAccessibility() {
  formRoot.querySelectorAll('input,select,textarea').forEach(field => {
   const error=field.id&&formRoot.querySelector('#error-'+field.id.replace('_','-'));
   if(error)field.setAttribute('aria-invalid',String(!error.classList.contains('hidden')));
  });
  formRoot.querySelectorAll('.of-step').forEach(step=>{
   const inactive=step.classList.contains('hidden')||step.classList.contains('opacity-0');
   step.setAttribute('aria-hidden',String(inactive));step.inert=inactive;
  });
 }

const maskCPF = (value) => {
            return value.replace(/\D/g, '')
                .replace(/(\d{3})(\d)/, '$1.$2')
                .replace(/(\d{3})(\d)/, '$1.$2')
                .replace(/(\d{3})(\d{1,2})/, '$1-$2')
                .replace(/(-\d{2})\d+?$/, '$1');
        };

        const maskPhone = (value) => {
            return value.replace(/\D/g, '')
                .replace(/(\d{2})(\d)/, '($1) $2')
                .replace(/(\d{5})(\d)/, '$1-$2')
                .replace(/(-\d{4})\d+?$/, '$1');
        };

        const cpfInput = document.getElementById('cpf');
        if(cpfInput) {
            cpfInput.addEventListener('input', (e) => {
                e.target.value = maskCPF(e.target.value);
            });
        }

        const phoneInput = document.getElementById('whatsapp');
        if(phoneInput) {
            phoneInput.addEventListener('input', (e) => {
                e.target.value = maskPhone(e.target.value);
            });
        }

        // No request is accepted until the dedicated campaign webhook is configured.
        document.getElementById('leadForm').addEventListener('submit', (event) => {
            event.preventDefault();
            const notice = formRoot.querySelector('.form-unavailable');
            if (notice) { notice.tabIndex = -1; notice.focus(); }
        });

readyCallbacks.forEach(callback=>callback());
syncAccessibility();
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',initOriginalForm,{once:true});else initOriginalForm();
})();
