/* Form functions extracted from consignado-fivecred/index.html. See work/original-static-form-contracts.json. */
(() => {
'use strict';
function initOriginalForm(){
const formRoot=document.querySelector('[data-original-form="consignado-fivecred"]');
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

function clearErrors() {
            formRoot.querySelectorAll('input').forEach(input => {
                input.classList.remove('border-red-500', 'bg-red-50');
            });
            formRoot.querySelectorAll('p[id^="error-"]').forEach(p => {
                p.classList.add('hidden');
                p.innerText = '';
            });
        }

        function showFieldError(fieldId, message) {
            const input = document.getElementById(fieldId);
            if (input) {
                input.classList.add('border-red-500', 'bg-red-50');
            }
            const p = document.getElementById(`error-${fieldId.replace('_', '-')}`);
            if (p) {
                p.classList.remove('hidden');
                p.innerText = message;
            }
        }

        function nextStep(step) {
            clearErrors();
            if (step === 2) {
                const nome = document.getElementById('nome').value.trim();
                const whatsapp = document.getElementById('whatsapp').value.trim();
                const email = document.getElementById('email').value.trim();
                
                let hasError = false;

                if (nome.length < 3) {
                    showFieldError('nome', 'Por favor, insira seu nome completo.');
                    hasError = true;
                }
                if (whatsapp.length < 14) {
                    showFieldError('whatsapp', 'Insira seu número de celular com DDD válido.');
                    hasError = true;
                }
                if (email.length < 5 || !email.includes('@')) {
                    showFieldError('email', 'Por favor, insira um e-mail válido.');
                    hasError = true;
                }

                if (hasError) return;
                
                // Hide step 1, show step 2 with transition
                const s1 = document.getElementById('step-1');
                const s2 = document.getElementById('step-2');
                s1.classList.add('hidden');
                s2.classList.remove('hidden');
                s2.classList.add('animate-step-in');
                
                // Update Progress Header
                document.getElementById('step-title').innerText = 'Dados do Seu Benefício';
                document.getElementById('step-subtitle').innerText = 'Insira as informações do seu provento do INSS';
                document.getElementById('step-badge').innerText = 'Etapa 2/3';
                
                // Compute Default Margin if value exists
                calculateDefaultMargin();
            }
        }

        function prevStep(step) {
            clearErrors();
            if (step === 1) {
                const s1 = document.getElementById('step-1');
                const s2 = document.getElementById('step-2');
                s2.classList.add('hidden');
                s1.classList.remove('hidden');
                s1.classList.add('animate-step-in');
                
                document.getElementById('step-title').innerText = 'Seus Dados Pessoais';
                document.getElementById('step-subtitle').innerText = 'Preencha os campos básicos da solicitação';
                document.getElementById('step-badge').innerText = 'Etapa 1/3';
            } else if (step === 2) {
                const s2 = document.getElementById('step-2');
                const s3 = document.getElementById('step-3');
                s3.classList.add('hidden');
                s2.classList.remove('hidden');
                s2.classList.add('animate-step-in');
                
                document.getElementById('step-title').innerText = 'Dados do Seu Benefício';
                document.getElementById('step-subtitle').innerText = 'Insira as informações do seu provento do INSS';
                document.getElementById('step-badge').innerText = 'Etapa 2/3';
            }
        }

        function toggleMargemInput() {
            const opcao = document.getElementById('opcao_margem').value;
            const container = document.getElementById('margem_livre_container');
            const input = document.getElementById('valor_margem');

            if (opcao === 'margem_livre') {
                container.classList.remove('hidden');
                input.required = true;
                container.classList.add('animate-step-in');
                calculateDefaultMargin();
            } else {
                container.classList.add('hidden');
                input.required = false;
                input.value = '';
            }
        }

        function parseMoneyString(value) {
            return parseFloat(value.replace(/[^0-9,-]/g, '').replace(',', '.')) || 0;
        }

        function formatBRL(value) {
            return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
        }

        function updateMaxMarginPlaceholder() {
            calculateDefaultMargin();
        }

        function calculateDefaultMargin() {
            const valBeneficio = parseMoneyString(document.getElementById('valor_beneficio').value);
            const profile = document.getElementById('tipo_beneficio').value;
            const inputMargem = document.getElementById('valor_margem');

            if (valBeneficio > 0 && document.getElementById('opcao_margem').value === 'margem_livre') {
                // Loans margin: 35% for Retired/Pensioners, 30% for BPC
                const marginPercentage = (profile === 'bpc') ? 0.30 : 0.35;
                const defaultMargin = valBeneficio * marginPercentage;
                inputMargem.value = formatBRL(defaultMargin);
            }
        }

        function validateAdditionalData() {
                const cpf = document.getElementById('cpf').value.trim();
                const nascimento = document.getElementById('nascimento').value.trim();
                let hasError = false;
                if (cpf.length < 14) {
                    showFieldError('cpf', 'Por favor, insira um CPF válido.');
                    hasError = true;
                }
                if (nascimento.length < 10) {
                    showFieldError('nascimento', 'Insira sua data de nascimento.');
                    hasError = true;
                }
                return !hasError;
        }

        function calculateSimulation() {
            clearErrors();
            if (!validateAdditionalData()) return;
            const valBeneficioStr = document.getElementById('valor_beneficio').value;
            const valBeneficio = parseMoneyString(valBeneficioStr);

            let hasError = false;

            if (!valBeneficio || valBeneficio <= 0) {
                showFieldError('valor_beneficio', 'Por favor, insira o valor mensal do seu benefício.');
                hasError = true;
            } else if (valBeneficio < 1412) {
                showFieldError('valor_beneficio', 'O valor mínimo usado nesta simulação ilustrativa é R$ 1.412,00.');
                hasError = true;
            }

            const opcao = document.getElementById('opcao_margem').value;
            let valorMargem = 0;

            if (opcao === 'margem_livre') {
                const valMargemStr = document.getElementById('valor_margem').value;
                valorMargem = parseMoneyString(valMargemStr);

                if (!valorMargem || valorMargem <= 0) {
                    showFieldError('valor_margem', 'Por favor, preencha o valor da sua margem livre estimada.');
                    hasError = true;
                } else {
                    const profile = document.getElementById('tipo_beneficio').value;
                    const maxAllowedMargin = valBeneficio * ((profile === 'bpc') ? 0.30 : 0.35);
                    if (valorMargem > (maxAllowedMargin + 1)) {
                        showFieldError('valor_margem', `Margem declarada (R$ ${valorMargem.toLocaleString('pt-BR')}) excede o limite usado nesta simulação de ${profile === 'bpc' ? '30%' : '35%'} do benefício (R$ ${maxAllowedMargin.toLocaleString('pt-BR')}).`);
                        hasError = true;
                    }
                }
            } else {
                // For portabilidade, default margem simulation to 35% or 30% of benefit
                const profile = document.getElementById('tipo_beneficio').value;
                valorMargem = valBeneficio * ((profile === 'bpc') ? 0.30 : 0.35);
            }

            if (hasError) return;

            // Calculations: INSS consignado coefficient for 84 months at ~1.66% a.m.
            // Factor is approximately 45.228
            const coefficientFactor = 45.228;
            const estimatedCredit = valorMargem * coefficientFactor;

            // Display results
            document.getElementById('res-credito').innerText = formatBRL(estimatedCredit);
            
            const profileSelect = document.getElementById('tipo_beneficio');
            document.getElementById('res-perfil-info').innerText = profileSelect.options[profileSelect.selectedIndex].text;
            document.getElementById('res-parcela').innerText = formatBRL(valorMargem);

            // Configure WhatsApp proposals
            const nome = document.getElementById('nome').value;
            const whatsapp = document.getElementById('whatsapp').value;
            const cpf = document.getElementById('cpf').value;
            const perfil = profileSelect.options[profileSelect.selectedIndex].text;
            
            const message = `Olá! Acabei de realizar uma simulação de Empréstimo Consignado INSS no site.
*Nome:* ${nome}
*CPF:* ${cpf}
*WhatsApp:* ${whatsapp}
*Perfil:* ${perfil} (Benefício: ${valBeneficioStr})
*Opção:* ${opcao === 'margem_livre' ? 'Margem Livre' : 'Portabilidade/Refinanciar'}
*Margem Utilizada:* ${formatBRL(valorMargem)}/mês
*Crédito Estimado:* ${formatBRL(estimatedCredit)} em 84 parcelas fixas`;

            const encodedMessage = encodeURIComponent(message);
            const waLink = `https://wa.me/5511989956521?text=${encodedMessage}`;
            document.getElementById('btn-envio-whatsapp').href = waLink;

            // Show step 3, hide step 2 with animation
            const s2 = document.getElementById('step-2');
            const s3 = document.getElementById('step-3');
            s2.classList.add('hidden');
            s3.classList.remove('hidden');
            s3.classList.add('animate-step-in');

            // Update Progress Header
            document.getElementById('step-title').innerText = 'Simulação Concluída';
            document.getElementById('step-subtitle').innerText = 'Confira as condições estimadas para averbação';
            document.getElementById('step-badge').innerText = 'Etapa 3/3';
        }

        // Input Masking Helpers
        onReady( () => {
            const telInput = document.getElementById('whatsapp');
            telInput.addEventListener('input', (e) => {
                let v = e.target.value.replace(/\D/g, "");
                if (v.length > 11) v = v.slice(0, 11);
                
                if (v.length > 6) {
                    e.target.value = `(${v.slice(0, 2)}) ${v.slice(2, 7)}-${v.slice(7)}`;
                } else if (v.length > 2) {
                    e.target.value = `(${v.slice(0, 2)}) ${v.slice(2)}`;
                } else if (v.length > 0) {
                    e.target.value = `(${v}`;
                } else {
                    e.target.value = "";
                }
            });

            const cpfInput = document.getElementById('cpf');
            cpfInput.addEventListener('input', (e) => {
                let v = e.target.value.replace(/\D/g, "");
                if (v.length > 11) v = v.slice(0, 11);

                if (v.length > 9) {
                    e.target.value = `${v.slice(0, 3)}.${v.slice(3, 6)}.${v.slice(6, 9)}-${v.slice(9)}`;
                } else if (v.length > 6) {
                    e.target.value = `${v.slice(0, 3)}.${v.slice(3, 6)}.${v.slice(6)}`;
                } else if (v.length > 3) {
                    e.target.value = `${v.slice(0, 3)}.${v.slice(3)}`;
                } else {
                    e.target.value = v;
                }
            });

            const dateInput = document.getElementById('nascimento');
            dateInput.addEventListener('input', (e) => {
                let v = e.target.value.replace(/\D/g, "");
                if (v.length > 8) v = v.slice(0, 8);

                if (v.length > 4) {
                    e.target.value = `${v.slice(0, 2)}/${v.slice(2, 4)}/${v.slice(4)}`;
                } else if (v.length > 2) {
                    e.target.value = `${v.slice(0, 2)}/${v.slice(2)}`;
                } else {
                    e.target.value = v;
                }
            });

            const moneyMask = (e) => {
                let v = e.target.value.replace(/\D/g, "");
                if (!v) {
                    e.target.value = "";
                    return;
                }
                v = (parseFloat(v) / 100).toFixed(2) + "";
                v = v.replace(".", ",");
                v = v.replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1.");
                e.target.value = "R$ " + v;
            };
            document.getElementById('valor_beneficio').addEventListener('input', moneyMask);
            document.getElementById('valor_margem').addEventListener('input', moneyMask);
        });
formRoot.querySelector('[data-of-event-submit="of-event-0"]').addEventListener("submit", function(event) { event.preventDefault();; syncAccessibility(); });
formRoot.querySelector('[data-of-event-click="of-event-1"]').addEventListener("click", function(event) { nextStep(2); syncAccessibility(); });
formRoot.querySelector('[data-of-event-change="of-event-2"]').addEventListener("change", function(event) { updateMaxMarginPlaceholder(); syncAccessibility(); });
formRoot.querySelector('[data-of-event-input="of-event-3"]').addEventListener("input", function(event) { calculateDefaultMargin(); syncAccessibility(); });
formRoot.querySelector('[data-of-event-change="of-event-4"]').addEventListener("change", function(event) { toggleMargemInput(); syncAccessibility(); });
formRoot.querySelector('[data-of-event-click="of-event-5"]').addEventListener("click", function(event) { prevStep(1); syncAccessibility(); });
formRoot.querySelector('[data-of-event-click="of-event-6"]').addEventListener("click", function(event) { calculateSimulation(); syncAccessibility(); });
formRoot.querySelector('[data-of-event-click="of-event-7"]').addEventListener("click", function(event) { prevStep(2); syncAccessibility(); });
readyCallbacks.forEach(callback=>callback());
syncAccessibility();
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',initOriginalForm,{once:true});else initOriginalForm();
})();
