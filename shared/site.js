/* Shared navigation and WhatsApp contact requests. Original forms own their webhooks. */
(() => {
  'use strict';
  let lastTrigger = null;
  let selectedMessage = '';
  let selectedCatalogItem = null;
  function init() {
    const dialog = document.getElementById('shared-dialog');
    if (!dialog || dialog.dataset.ready) return;
    dialog.dataset.ready = 'true';
    const title = document.getElementById('dialog-title');
    const message = document.getElementById('dialog-message');
    const note = document.getElementById('dialog-note');
    const phone = document.getElementById('dialog-contact');
    const continueButton = document.getElementById('dialog-whatsapp');
    const formButton = document.getElementById('dialog-form');
    const catalogForm = document.querySelector('[data-catalog-original-form]') || document.querySelector('[data-form-mode="catalog"]');
    function show(heading, text, explanation, isWhatsApp, followup) {
      if (!dialog.open) lastTrigger = document.activeElement;
      title.textContent = heading;
      message.textContent = text;
      note.textContent = explanation;
      phone.hidden = !isWhatsApp;
      continueButton.hidden = !followup;
      if (formButton) formButton.hidden = !followup || !catalogForm;
      selectedMessage = followup || '';
      if (!dialog.open) dialog.showModal();
      else { title.tabIndex = -1; title.focus(); }
    }
    function openWhatsApp(text, options={}) {
      return window.FivecredWhatsApp?.open({...options,message:text||options.message,trigger:options.trigger||document.activeElement});
    }
    window.Fivecred = { ...(window.Fivecred || {}), openWhatsApp };
    window.addEventListener('fivecred:whatsapp', event => openWhatsApp(event.detail?.message,event.detail||{}));
    continueButton.addEventListener('click', () => openWhatsApp(selectedMessage));
    formButton?.addEventListener('click', () => {
      if (!catalogForm) return;
      if (catalogForm.matches('[data-catalog-original-form]')) {
        dialog.close();
        if (selectedCatalogItem) window.FivecredCatalogForm?.select(selectedCatalogItem);
        return;
      }
      catalogForm.querySelector('[name=interesse]').value = selectedMessage;
      document.querySelector('[data-catalog-selection]').textContent = selectedMessage;
      lastTrigger = catalogForm.querySelector('[name=nome]');
      dialog.close();
      catalogForm.scrollIntoView({ behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth', block: 'start' });
      lastTrigger.focus({preventScroll:true});
    });
    dialog.querySelectorAll('[data-close-dialog]').forEach(button => button.addEventListener('click', () => dialog.close()));
    dialog.addEventListener('close', () => { if (lastTrigger?.isConnected) lastTrigger.focus(); });
    dialog.addEventListener('click', event => { if (event.target === dialog) dialog.close(); });
    document.querySelectorAll('[data-whatsapp]').forEach(button => button.addEventListener('click', () => openWhatsApp(button.dataset.message,{trigger:button})));
    document.querySelectorAll('[data-placeholder]').forEach(button => button.addEventListener('click', () => show('Espaço reservado na prévia', button.dataset.placeholder, 'Este espaço será preenchido com o material oficial da Fivecred.', false)));
    const nav = document.getElementById('main-nav');
    const menu = document.querySelector('.menu-toggle');
    function closeMenu() {
      if (!menu || !nav) return;
      nav.classList.remove('is-open');
      menu.setAttribute('aria-expanded', 'false');
      menu.setAttribute('aria-label', 'Abrir menu');
    }
    menu?.addEventListener('click', () => {
      const open = menu.getAttribute('aria-expanded') !== 'true';
      nav.classList.toggle('is-open', open);
      menu.setAttribute('aria-expanded', String(open));
      menu.setAttribute('aria-label', open ? 'Fechar menu' : 'Abrir menu');
    });
    document.addEventListener('keydown', event => { if (event.key === 'Escape' && menu?.getAttribute('aria-expanded') === 'true') { closeMenu(); menu.focus(); } });
    document.addEventListener('click', event => { if (!event.target.closest('.header')) closeMenu(); });
    nav?.querySelectorAll('a').forEach(link => link.addEventListener('click', closeMenu));
    document.querySelectorAll('[data-start-profile]').forEach(button => button.addEventListener('click', () => {
      if (window.FivecredJourney && document.querySelector('[data-journey]')) window.FivecredJourney.start(button.dataset.startProfile, button.dataset.startGoal || 'credito');
      else { const form = document.getElementById('simulacao'); form?.scrollIntoView({behavior:window.matchMedia('(prefers-reduced-motion: reduce)').matches?'auto':'smooth',block:'start'}); form?.querySelector('input,select,button')?.focus({preventScroll:true}); }
    }));
    document.querySelectorAll('[data-listing]').forEach(button => button.addEventListener('click', () => {
      const card = button.closest('.listing');
      selectedCatalogItem={id:card.dataset.itemId,title:card.dataset.title,price:Number(card.dataset.price)};
      show(card.dataset.title, card.dataset.description, 'Este item é um exemplo do catálogo local. Valor de referência da prévia; disponibilidade, preço e condições devem ser confirmados com a Fivecred.', false, 'Olá, Fivecred! Tenho interesse em ' + card.dataset.title + '. Vi o exemplo no site e gostaria de confirmar a disponibilidade e as condições.');
    }));
    const catalog = document.querySelector('[data-catalog]');
    if (catalog) {
      const search = catalog.querySelector('[name=busca]');
      const type = catalog.querySelector('[name=tipo]');
      const budget = catalog.querySelector('[name=valor-maximo]');
      const cards = [...catalog.querySelectorAll('.listing')];
      const normalize = value => value.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLocaleLowerCase('pt-BR');
      function filter() {
        const query = normalize(search.value.trim());
        const maximum = Number(budget.value) || Infinity;
        let count = 0;
        cards.forEach(card => {
          const matches = (!query || normalize(card.dataset.search).includes(query)) && (!type.value || card.dataset.type === type.value) && (!card.dataset.price || Number(card.dataset.price) <= maximum);
          card.hidden = !matches;
          if (matches) count++;
        });
        catalog.querySelector('[data-catalog-count]').textContent = count === 1 ? '1 exemplo encontrado' : count + ' exemplos encontrados';
        catalog.querySelector('[data-catalog-empty]').hidden = count !== 0;
      }
      [search, type, budget].forEach(input => input.addEventListener('input', filter));
      catalog.querySelector('[data-clear-filters]').addEventListener('click', () => { search.value = ''; type.value = ''; budget.value = ''; filter(); search.focus(); });
      filter();
    }
    document.querySelectorAll('[data-local-form]').forEach(form => {
      form.addEventListener('submit', event => {
        event.preventDefault();
        const name = form.querySelector('[name=nome]');
        const email = form.querySelector('[name=email]');
        const whatsapp = form.querySelector('[name=whatsapp]');
        const consent = form.querySelector('[name=consentimento]');
        const errors = [];
        form.querySelectorAll('[aria-invalid]').forEach(input => input.removeAttribute('aria-invalid'));
        function invalid(input, text) { errors.push(text); input.setAttribute('aria-invalid', 'true'); }
        if (name.value.trim().length < 3) invalid(name, 'Informe seu nome.');
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value.trim())) invalid(email, 'Confira o e-mail informado.');
        let digits = whatsapp.value.replace(/\D/g, '');
        if (digits.length >= 12 && digits.startsWith('55')) digits = digits.slice(2);
        if (!/^[1-9]{2}(?:9\d{8}|[2-9]\d{7})$/.test(digits)) invalid(whatsapp, 'Informe o WhatsApp com DDD.');
        if (!consent.checked) invalid(consent, 'Autorize o contato da Fivecred para concluir.');
        const error = form.querySelector('[data-form-error]');
        error.textContent = errors.join(' ');
        if (errors.length) { form.querySelector('[aria-invalid=true]').focus(); return; }
        const feedback = form.querySelector('[data-form-feedback]');
        feedback.textContent = name.value.trim() + (form.dataset.formMode === 'catalog' ? ', sua solicitação sobre a busca está preparada. Demonstração local: nenhum cadastro foi enviado. A equipe confirmará disponibilidade e condições antes de uma negociação.' : ', sua solicitação de parceria está preparada. Demonstração local: nenhum cadastro foi enviado. A equipe explicará as condições do programa antes da adesão.');
        feedback.hidden = false;
        feedback.focus();
      });
    });
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init, { once: true }); else init();
})();
