/* Form functions extracted from imovel-fivecred/index.html. See work/original-static-form-contracts.json. */
(() => {
'use strict';
function initOriginalForm(){
const formRoot=document.querySelector('[data-original-form="imovel-fivecred"]');
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

const formFields = ['nome', 'whatsapp', 'cpf', 'nascimento', 'email', 'valor_imovel', 'localidade', 'saldo_devedor'];

        function clearErrors() {
            formFields.forEach(field => {
                const errorEl = document.getElementById(`error-${field.replace('_', '-')}`);
                if (errorEl) {
                    errorEl.classList.add('hidden');
                    errorEl.innerText = '';
                }
                const inputEl = document.getElementById(field);
                if (inputEl) {
                    inputEl.classList.remove('border-red-500', 'focus:ring-red-500');
                    inputEl.classList.add('border-slate-200', 'focus:ring-brand-500');
                }
            });
        }

        function showFieldError(fieldId, message) {
            const errorEl = document.getElementById(`error-${fieldId.replace('_', '-')}`);
            if (errorEl) {
                errorEl.classList.remove('hidden');
                errorEl.innerText = message;
            }
            const inputEl = document.getElementById(fieldId);
            if (inputEl) {
                inputEl.classList.remove('border-slate-200', 'focus:ring-brand-500');
                inputEl.classList.add('border-red-500', 'focus:ring-red-500');
            }
        }

        // CPF Validation algorithm
        function validarCPF(cpf) {
            cpf = cpf.replace(/[^\d]+/g,'');
            if (cpf === '' || cpf.length !== 11) return false;
            if (/^(\d)\1{10}$/.test(cpf)) return false;
            
            let add = 0;
            for (let i = 0; i < 9; i++) {
                add += parseInt(cpf.charAt(i)) * (10 - i);
            }
            let rev = 11 - (add % 11);
            if (rev === 10 || rev === 11) rev = 0;
            if (rev !== parseInt(cpf.charAt(9))) return false;
            
            add = 0;
            for (let i = 0; i < 10; i++) {
                add += parseInt(cpf.charAt(i)) * (11 - i);
            }
            rev = 11 - (add % 11);
            if (rev === 10 || rev === 11) rev = 0;
            if (rev !== parseInt(cpf.charAt(10))) return false;
            
            return true;
        }

        // Age limits validation
        function validarDataNascimento(dataStr) {
            const parts = dataStr.split('/');
            if (parts.length !== 3) return false;
            const day = parseInt(parts[0], 10);
            const month = parseInt(parts[1], 10) - 1;
            const year = parseInt(parts[2], 10);
            
            const date = new Date(year, month, day);
            if (date.getFullYear() !== year || date.getMonth() !== month || date.getDate() !== day) {
                return false;
            }
            
            const today = new Date();
            let age = today.getFullYear() - year;
            const m = today.getMonth() - month;
            if (m < 0 || (m === 0 && today.getDate() < day)) {
                age--;
            }
            return age >= 18 && age <= 100;
        }

        // Email structure validation
        function validarEmail(email) {
            const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            return re.test(email);
        }

        // Multi-Step Form Navigation Logic
        function nextStep(step) {
            clearErrors();

            if (step === 2) {
                const nome = document.getElementById('nome').value.trim();
                const whatsapp = document.getElementById('whatsapp').value.trim();
                const email = document.getElementById('email').value.trim();
                
                let hasError = false;

                if (nome.length < 5 || !nome.includes(' ')) {
                    showFieldError('nome', 'Por favor, insira seu nome completo (Nome e Sobrenome).');
                    hasError = true;
                }
                if (whatsapp.length < 14) {
                    showFieldError('whatsapp', 'Por favor, insira um número de WhatsApp válido.');
                    hasError = true;
                }
                if (!validarEmail(email)) {
                    showFieldError('email', 'Por favor, insira um endereço de e-mail válido.');
                    hasError = true;
                }

                if (hasError) return;
                
                // Hide step 1, show step 2 with transition animation
                const s1 = document.getElementById('step-1');
                const s2 = document.getElementById('step-2');
                s1.classList.add('hidden');
                s2.classList.remove('hidden');
                s2.classList.add('animate-step-in');
                
                // Update Progress Header
                document.getElementById('step-title').innerText = 'Dados do Seu Imóvel';
                document.getElementById('step-subtitle').innerText = 'Insira os dados da propriedade desejada';
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
                document.getElementById('step-subtitle').innerText = 'Preencha os campos essenciais para a simulação';
                document.getElementById('step-badge').innerText = 'Etapa 1/3';
            } else if (step === 2) {
                const s2 = document.getElementById('step-2');
                const s3 = document.getElementById('step-3');
                s3.classList.add('hidden');
                s2.classList.remove('hidden');
                s2.classList.add('animate-step-in');
                
                document.getElementById('step-title').innerText = 'Dados do Seu Imóvel';
                document.getElementById('step-subtitle').innerText = 'Insira os dados da propriedade desejada';
                document.getElementById('step-badge').innerText = 'Etapa 2/3';
            }
        }

        function toggleFinanciamentoField() {
            const situacao = document.getElementById('situacao_imovel').value;
            const container = document.getElementById('saldo_devedor_container');
            const input = document.getElementById('saldo_devedor');

            if (situacao === 'financiado') {
                container.classList.remove('hidden');
                input.required = true;
                container.classList.add('animate-step-in');
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

        function validateAdditionalData() {
                const cpf = document.getElementById('cpf').value.trim();
                const nascimento = document.getElementById('nascimento').value.trim();
                let hasError = false;
                if (!validarCPF(cpf)) {
                    showFieldError('cpf', 'Por favor, insira um CPF válido e com todos os dígitos.');
                    hasError = true;
                }
                if (!validarDataNascimento(nascimento)) {
                    showFieldError('nascimento', 'Idade mínima 18 anos. Use o formato DD/MM/AAAA.');
                    hasError = true;
                }
                return !hasError;
        }

        function calculateSimulation() {
            clearErrors();
            if (!validateAdditionalData()) return;
            const valImovelStr = document.getElementById('valor_imovel').value;
            const valImovel = parseMoneyString(valImovelStr);
            const localidade = document.getElementById('localidade').value.trim();

            let hasError = false;

            if (!valImovel || valImovel <= 0) {
                showFieldError('valor_imovel', 'Por favor, insira o valor estimado do imóvel.');
                hasError = true;
            } else if (valImovel < 150000) {
                showFieldError('valor_imovel', 'O valor estimado do imóvel deve ser de no mínimo R$ 150.000,00 para esta modalidade.');
                hasError = true;
            }

            if (localidade.length < 4) {
                showFieldError('localidade', 'Por favor, preencha sua Cidade / UF.');
                hasError = true;
            }

            const situacao = document.getElementById('situacao_imovel').value;
            let saldoDevedor = 0;

            if (situacao === 'financiado') {
                saldoDevedor = parseMoneyString(document.getElementById('saldo_devedor').value);
                if (saldoDevedor <= 0) {
                    showFieldError('saldo_devedor', 'Por favor, preencha o saldo devedor do financiamento atual.');
                    hasError = true;
                }
            }

            if (hasError) return;

            // Calculations: Max credit is 60% of property value
            let maxCredit = valImovel * 0.60;
            
            if (situacao === 'financiado' && saldoDevedor >= maxCredit) {
                showFieldError('saldo_devedor', `O saldo devedor (R$ ${saldoDevedor.toLocaleString('pt-BR')}) consome toda a margem de 60% do imóvel (máx. R$ ${maxCredit.toLocaleString('pt-BR')}).`);
                return;
            }

            if (situacao === 'financiado') {
                maxCredit = maxCredit - saldoDevedor;
            }

            if (maxCredit > 5000000) maxCredit = 5000000;

            const warnBox = document.getElementById('simulation-warning');
            if (maxCredit < 50000) {
                warnBox.classList.remove('hidden');
            } else {
                warnBox.classList.add('hidden');
            }

            const rate = 0.0099;
            const months = 180;

            const compounding = Math.pow(1 + rate, months);
            const installment = maxCredit * (rate * compounding) / (compounding - 1);

            // Display results
            document.getElementById('res-credito').innerText = formatBRL(maxCredit);
            document.getElementById('res-imovel-info').innerText = document.getElementById('tipo_imovel').value;
            document.getElementById('res-parcela').innerText = formatBRL(installment);

            // Configure WhatsApp Send Link
            const nome = document.getElementById('nome').value;
            const whatsapp = document.getElementById('whatsapp').value;
            const cpf = document.getElementById('cpf').value;
            const tipo = document.getElementById('tipo_imovel').options[document.getElementById('tipo_imovel').selectedIndex].text;
            
            const message = `Olá! Acabei de realizar uma simulação de Crédito com Garantia de Imóvel no site.
*Nome:* ${nome}
*CPF:* ${cpf}
*WhatsApp:* ${whatsapp}
*Cidade/UF:* ${localidade}
*Imóvel:* ${tipo} (Avaliação: ${valImovelStr}) - Situação: ${situacao === 'quitado' ? 'Quitado' : 'Financiado'}
*Saldo Devedor:* ${situacao === 'financiado' ? formatBRL(saldoDevedor) : 'N/A'}
*Crédito Estimado:* ${formatBRL(maxCredit)} em 180 meses (Parcela Estimada: ${formatBRL(installment)})`;

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
            document.getElementById('step-subtitle').innerText = 'Confira as condições preliminares';
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
            document.getElementById('valor_imovel').addEventListener('input', moneyMask);
            document.getElementById('saldo_devedor').addEventListener('input', moneyMask);
        });
formRoot.querySelector('[data-of-event-submit="of-event-0"]').addEventListener("submit", function(event) { event.preventDefault();; syncAccessibility(); });
formRoot.querySelector('[data-of-event-click="of-event-1"]').addEventListener("click", function(event) { nextStep(2); syncAccessibility(); });
formRoot.querySelector('[data-of-event-change="of-event-2"]').addEventListener("change", function(event) { toggleFinanciamentoField(); syncAccessibility(); });
formRoot.querySelector('[data-of-event-click="of-event-3"]').addEventListener("click", function(event) { prevStep(1); syncAccessibility(); });
formRoot.querySelector('[data-of-event-click="of-event-4"]').addEventListener("click", function(event) { calculateSimulation(); syncAccessibility(); });
formRoot.querySelector('[data-of-event-click="of-event-5"]').addEventListener("click", function(event) { prevStep(2); syncAccessibility(); });
readyCallbacks.forEach(callback=>callback());
syncAccessibility();
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',initOriginalForm,{once:true});else initOriginalForm();
})();
