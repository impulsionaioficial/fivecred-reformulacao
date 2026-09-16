/* Form functions extracted from luz-fivecred/index.html. See work/original-static-form-contracts.json. */
(() => {
'use strict';
function initOriginalForm(){
const formRoot=document.querySelector('[data-original-form="luz-fivecred"]');
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
                const cpf = document.getElementById('cpf').value.trim();
                const nascimento = document.getElementById('nascimento').value.trim();
                const cep = document.getElementById('cep').value.trim();
                const endereco = document.getElementById('endereco').value.trim();
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
                if (cpf.length < 14) {
                    showFieldError('cpf', 'Por favor, insira um CPF válido.');
                    hasError = true;
                }
                if (nascimento.length < 10) {
                    showFieldError('nascimento', 'Insira sua data de nascimento.');
                    hasError = true;
                }
                if (cep.length < 9) {
                    showFieldError('cep', 'Insira um CEP válido.');
                    hasError = true;
                }
                if (endereco.length < 5) {
                    showFieldError('endereco', 'Por favor, insira o seu endereço.');
                    hasError = true;
                }
                if (email.length > 0 && (email.length < 5 || !email.includes('@'))) {
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
                document.getElementById('step-title').innerText = 'Sua Conta de Luz';
                document.getElementById('step-subtitle').innerText = 'Insira as informações de vinculação da sua fatura';
                document.getElementById('step-badge').innerText = 'Etapa 2/3';
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
                
                document.getElementById('step-title').innerText = 'Sua Conta de Luz';
                document.getElementById('step-subtitle').innerText = 'Insira as informações de vinculação da sua fatura';
                document.getElementById('step-badge').innerText = 'Etapa 2/3';
            }
        }

        function parseMoneyString(value) {
            return parseFloat(value.replace(/[^0-9,-]/g, '').replace(',', '.')) || 0;
        }

        function formatBRL(value) {
            return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
        }

        function calculateSimulation() {
            clearErrors();
            const valContaStr = document.getElementById('valor_conta').value;
            const valConta = parseMoneyString(valContaStr);
            const codigoCliente = document.getElementById('codigo_cliente').value.trim();

            let hasError = false;

            if (!valConta || valConta <= 0) {
                showFieldError('valor_conta', 'Por favor, insira o valor médio da sua conta de luz.');
                hasError = true;
            } else if (valConta < 80) {
                showFieldError('valor_conta', 'O valor médio da conta de luz deve ser de pelo menos R$ 80,00.');
                hasError = true;
            }

            if (codigoCliente.length < 4) {
                showFieldError('codigo_cliente', 'Por favor, insira o código de cliente ou instalação.');
                hasError = true;
            }

            if (hasError) return;

            // Calculations: Max credit is up to 10x average bill value, capped at R$ 2.500,00
            let estimatedCredit = Math.min(valConta * 10, 2500);
            
            // Round credit to nearest 50 BRL
            estimatedCredit = Math.round(estimatedCredit / 50) * 50;

            // Monthly installment (over 18 months fixed)
            // Coefficient for 18 months in microcredit is approx 0.1158 (interest rate ~10% a.m.)
            // So if R$ 1.200 -> R$ 139 installment
            const coefficient = 0.1158;
            const installment = estimatedCredit * coefficient;

            // Display results
            document.getElementById('res-credito').innerText = formatBRL(estimatedCredit);
            
            const distSelect = document.getElementById('distribuidora');
            document.getElementById('res-dist-info').innerText = distSelect.options[distSelect.selectedIndex].text;
            document.getElementById('res-parcela').innerText = formatBRL(installment);

            // Configure WhatsApp proposals
            const nome = document.getElementById('nome').value;
            const whatsapp = document.getElementById('whatsapp').value;
            const cpf = document.getElementById('cpf').value;
            const cep = document.getElementById('cep').value;
            const endereco = document.getElementById('endereco').value;
            const dist = distSelect.options[distSelect.selectedIndex].text;
            
            const message = `Olá! Acabei de realizar uma simulação de Empréstimo na Conta de Luz no site.
*Nome:* ${nome}
*CPF:* ${cpf}
*WhatsApp:* ${whatsapp}
*CEP / Endereço:* ${cep} (${endereco})
*Distribuidora:* ${dist} (Nº Instalação: ${codigoCliente})
*Conta Média:* ${valContaStr}
*Crédito Estimado:* ${formatBRL(estimatedCredit)} em 18 parcelas
*Parcela Adicional na Luz:* ${formatBRL(installment)}`;

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
            document.getElementById('step-subtitle').innerText = 'Confira as condições calculadas para débito';
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

            const cepInput = document.getElementById('cep');
            cepInput.addEventListener('input', (e) => {
                let v = e.target.value.replace(/\D/g, "");
                if (v.length > 8) v = v.slice(0, 8);

                if (v.length > 5) {
                    e.target.value = `${v.slice(0, 5)}-${v.slice(5)}`;
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
            document.getElementById('valor_conta').addEventListener('input', moneyMask);
        });
formRoot.querySelector('[data-of-event-submit="of-event-0"]').addEventListener("submit", function(event) { event.preventDefault();; syncAccessibility(); });
formRoot.querySelector('[data-of-event-click="of-event-1"]').addEventListener("click", function(event) { nextStep(2); syncAccessibility(); });
formRoot.querySelector('[data-of-event-click="of-event-2"]').addEventListener("click", function(event) { prevStep(1); syncAccessibility(); });
formRoot.querySelector('[data-of-event-click="of-event-3"]').addEventListener("click", function(event) { calculateSimulation(); syncAccessibility(); });
formRoot.querySelector('[data-of-event-click="of-event-4"]').addEventListener("click", function(event) { prevStep(2); syncAccessibility(); });
readyCallbacks.forEach(callback=>callback());
syncAccessibility();
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',initOriginalForm,{once:true});else initOriginalForm();
})();
