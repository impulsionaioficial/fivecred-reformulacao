/* Fivecred local demo. No requests, tracking or persistent storage. */
(() => {
  'use strict';
  const byId = id => document.getElementById(id);
  const form = byId('lead-form');
  const credit = byId('credit-value');
  const administrator = byId('administrator');
  const contactName = byId('contact-name');
  const phone = byId('contact-phone');
  const consent = byId('contact-consent');
  const currency = new Intl.NumberFormat('pt-BR', {style:'currency',currency:'BRL'});
  const number = new Intl.NumberFormat('pt-BR', {minimumFractionDigits:2,maximumFractionDigits:2});
  let currentStep = 1;
  let lastDialogTrigger = null;

  function parseCredit(value) {
    const cleaned = value.replace(/R\$/gi,'').replace(/\s/g,'');
    if (!/^(?:\d{1,3}(?:\.\d{3})+|\d+)(?:,\d{1,2})?$/.test(cleaned)) return null;
    const amount = Number(cleaned.replace(/\./g,'').replace(',','.'));
    return Number.isFinite(amount) && amount > 0 ? amount : null;
  }
  function phoneDigits(value) {
    let digits = value.replace(/\D/g,'');
    if ((digits.length === 12 || digits.length === 13) && digits.startsWith('55')) digits = digits.slice(2);
    return digits;
  }
  function validPhone(value) {
    return /^[1-9]{2}(?:9\d{8}|[2-9]\d{7})$/.test(phoneDigits(value));
  }
  function formatPhone(value) {
    const digits = phoneDigits(value);
    if (!validPhone(value)) return value;
    const subscriber = digits.slice(2);
    return '(' + digits.slice(0,2) + ') ' + subscriber.slice(0,-4) + '-' + subscriber.slice(-4);
  }
  function category() {
    return form.querySelector('input[name="modalidade"]:checked').value;
  }
  function setError(input,errorId,message) {
    byId(errorId).textContent = message;
    if (message) input.setAttribute('aria-invalid','true');
    else input.removeAttribute('aria-invalid');
  }
  function focusInvalid(inputs) {
    const invalid = inputs.find(input => input.getAttribute('aria-invalid') === 'true');
    if (invalid) invalid.focus();
    return !invalid;
  }
  function showStep(step) {
    currentStep = step;
    byId('form-step-one').hidden = step !== 1;
    byId('form-step-two').hidden = step !== 2;
    const one = byId('progress-one'), two = byId('progress-two');
    one.classList.toggle('active',step === 1);
    one.classList.toggle('done',step === 2);
    two.classList.toggle('active',step === 2);
    one.removeAttribute('aria-current');
    two.removeAttribute('aria-current');
    (step === 1 ? one : two).setAttribute('aria-current','step');
  }
  function validateCarta() {
    setError(credit,'value-error',parseCredit(credit.value) === null ? 'Informe o valor do crédito, por exemplo 150.000,00.' : '');
    setError(administrator,'admin-error',administrator.value ? '' : 'Selecione a administradora. Você também pode escolher “Não sei informar”.');
    return focusInvalid([credit,administrator]);
  }
  function advance() {
    if (!validateCarta()) return;
    credit.value = number.format(parseCredit(credit.value));
    byId('quote-summary').textContent = category() + ' · Crédito de ' + currency.format(parseCredit(credit.value)) + ' · ' + administrator.value;
    showStep(2);
    contactName.focus();
  }
  byId('next-step').addEventListener('click',advance);
  byId('previous-step').addEventListener('click',() => { showStep(1); credit.focus(); });
  credit.addEventListener('blur',() => {
    const amount = parseCredit(credit.value);
    if (amount !== null) credit.value = number.format(amount);
  });
  phone.addEventListener('blur',() => { phone.value = formatPhone(phone.value); });
  for (const [input,errorId] of [[credit,'value-error'],[administrator,'admin-error'],[contactName,'name-error'],[phone,'phone-error'],[consent,'consent-error']]) {
    input.addEventListener('input',() => setError(input,errorId,''));
    input.addEventListener('change',() => setError(input,errorId,''));
  }
  form.addEventListener('submit',event => {
    event.preventDefault();
    if (currentStep === 1) { advance(); return; }
    const name = contactName.value.trim().replace(/\s+/g,' ');
    setError(contactName,'name-error',name.length >= 2 ? '' : 'Informe seu nome para a equipe saber como chamar você.');
    setError(phone,'phone-error',validPhone(phone.value) ? '' : 'Informe um WhatsApp válido com DDD, como (11) 99999-9999.');
    setError(consent,'consent-error',consent.checked ? '' : 'Autorize o contato para concluir a avaliação de demonstração.');
    if (!focusInvalid([contactName,phone,consent])) return;
    contactName.value = name;
    phone.value = formatPhone(phone.value);
    byId('success-message').textContent = name + ', você informou uma carta de ' + category().toLocaleLowerCase('pt-BR') + ' com crédito de ' + currency.format(parseCredit(credit.value)) + ', da administradora ' + administrator.value + '.';
    form.hidden = true;
    byId('form-introduction').hidden = true;
    byId('form-success').hidden = false;
    byId('form-success').focus();
  });
  byId('reset-form').addEventListener('click',() => {
    form.reset();
    for (const input of form.querySelectorAll('[aria-invalid]')) input.removeAttribute('aria-invalid');
    for (const error of form.querySelectorAll('.field-error')) error.textContent = '';
    byId('success-message').textContent = '';
    byId('quote-summary').textContent = '';
    byId('whatsapp-message').textContent = 'Olá, equipe Fivecred! Tenho uma carta contemplada e gostaria de conhecer uma proposta de compra.';
    byId('form-success').hidden = true;
    byId('form-introduction').hidden = false;
    form.hidden = false;
    showStep(1);
    credit.focus();
  });
  function openDialog(dialog) {
    lastDialogTrigger = document.activeElement;
    if (!dialog.open) dialog.showModal();
  }
  function buildWhatsAppPreview() {
    const lines = ['Olá, equipe Fivecred! Gostaria de vender minha carta contemplada e conhecer uma proposta de compra.'];
    const amount = parseCredit(credit.value);
    if (amount !== null || administrator.value) {
      lines.push('','Modalidade: ' + category());
      if (amount !== null) lines.push('Crédito: ' + currency.format(amount));
      if (administrator.value) lines.push('Administradora: ' + administrator.value);
    }
    const name = contactName.value.trim();
    if (name) lines.push('','Meu nome é ' + name + '.');
    return lines.join('\n');
  }
  for (const button of document.querySelectorAll('[data-whatsapp]')) {
    button.addEventListener('click',() => {
      byId('whatsapp-message').textContent = buildWhatsAppPreview();
      openDialog(byId('whatsapp-dialog'));
    });
  }
  for (const button of document.querySelectorAll('[data-privacy]')) button.addEventListener('click',() => openDialog(byId('privacy-dialog')));
  for (const button of document.querySelectorAll('[data-close-dialog]')) button.addEventListener('click',() => button.closest('dialog').close());
  for (const dialog of document.querySelectorAll('dialog')) {
    dialog.addEventListener('click',event => { if (event.target === dialog) dialog.close(); });
    dialog.addEventListener('close',() => { if (lastDialogTrigger && lastDialogTrigger.isConnected) lastDialogTrigger.focus({preventScroll:true}); });
  }
  const menuToggle = document.querySelector('.menu-toggle');
  const navigation = byId('main-nav');
  function closeMenu() {
    menuToggle.setAttribute('aria-expanded','false');
    menuToggle.setAttribute('aria-label','Abrir menu');
    navigation.classList.remove('is-open');
  }
  menuToggle.addEventListener('click',() => {
    const expanded = menuToggle.getAttribute('aria-expanded') !== 'true';
    menuToggle.setAttribute('aria-expanded',String(expanded));
    menuToggle.setAttribute('aria-label',expanded ? 'Fechar menu' : 'Abrir menu');
    navigation.classList.toggle('is-open',expanded);
  });
  for (const link of navigation.querySelectorAll('a')) link.addEventListener('click',closeMenu);
  document.addEventListener('keydown',event => {
    if (event.key === 'Escape' && menuToggle.getAttribute('aria-expanded') === 'true') { closeMenu(); menuToggle.focus(); }
  });
  document.addEventListener('click',event => { if (!event.target.closest('.site-header')) closeMenu(); });
  if ('IntersectionObserver' in window) {
    const mobileActions = document.querySelector('.mobile-actions');
    const observer = new IntersectionObserver(([entry]) => {
      mobileActions.classList.toggle('is-hidden',entry.isIntersecting);
      mobileActions.inert = entry.isIntersecting;
    },{rootMargin:'-90px 0px -80px 0px',threshold:0});
    observer.observe(document.querySelector('.form-card'));
  }
})();

