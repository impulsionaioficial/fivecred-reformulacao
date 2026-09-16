'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { JSDOM } = require(require.resolve('jsdom', {
  paths: [process.cwd(), path.resolve(__dirname, '../../../fivecred.com.br-main')]
}));
const scriptPath = path.resolve(__dirname, '../shared/journey.js');
const source = fs.existsSync(scriptPath) ? fs.readFileSync(scriptPath, 'utf8') : '';

function boot({ mode = 'credit', profile = 'geral', multiple = false, site = '' } = {}) {
  const markup = '<div data-journey data-mode="' + mode + '" data-profile="' + profile +
    '" data-goal="credito" data-site="' + site + '"><p>Carregando orientação...</p></div>';
  const dom = new JSDOM('<!doctype html><html lang="pt-BR"><body>' + markup +
    (multiple ? markup : '') + '</body></html>', {
    url: 'http://127.0.0.1:4173/', runScripts: 'outside-only'
  });
  const { window } = dom;
  const calls = [];
  for (const name of ['fetch', 'XMLHttpRequest', 'WebSocket', 'EventSource', 'open']) {
    window[name] = function () { calls.push(name); throw new Error('Proibido: ' + name); };
  }
  window.navigator.sendBeacon = function () { calls.push('sendBeacon'); return false; };
  const storage = {};
  for (const name of ['getItem', 'setItem', 'removeItem', 'clear', 'key']) {
    storage[name] = function () { calls.push('storage.' + name); };
  }
  for (const name of ['localStorage', 'sessionStorage']) {
    Object.defineProperty(window, name, {
      configurable: true, get() { calls.push(name); return storage; }
    });
  }
  window.HTMLElement.prototype.scrollIntoView = function (options) {
    window.lastScroll = options;
  };
  window.matchMedia = () => ({ matches: true });
  window.eval(source);
  window.document.dispatchEvent(new window.Event('DOMContentLoaded'));
  const root = window.document.querySelector('[data-journey]');
  return {
    dom, window, root, calls,
    text: () => root.textContent.replace(/\s+/g, ' ').trim(),
    choose(value) {
      const option = root.querySelector('[data-choice="' + value + '"]');
      assert.ok(option, 'Opção disponível: ' + value);
      option.click();
    },
    action(value) {
      const button = root.querySelector('[data-action="' + value + '"]');
      assert.ok(button, 'Ação disponível: ' + value);
      button.click();
    },
    input(name, value) {
      const input = root.querySelector('[name="' + name + '"]');
      assert.ok(input, 'Campo disponível: ' + name);
      if (input.type === 'checkbox') input.checked = Boolean(value);
      else input.value = value;
      input.dispatchEvent(new window.Event('input', { bubbles: true }));
      input.dispatchEvent(new window.Event('change', { bubbles: true }));
    },
    submit() {
      const form = root.querySelector('form');
      assert.ok(form, 'Formulário disponível');
      form.dispatchEvent(new window.Event('submit', { bubbles: true, cancelable: true }));
    }
  };
}

function creditResult(ui, profile = 'clt', amount = '10.000,00', goal = 'contas') {
  ui.choose(goal);
  ui.choose(profile);
  ui.input('amount', amount);
  ui.submit();
  assert.ok(ui.root.querySelector('[data-step="result"]'), 'Resultado anterior aos dados pessoais');
}

function contact(ui) {
  ui.action('contact');
  ui.input('fullName', 'Ana de Souza');
  ui.input('email', 'ana@example.com');
  ui.input('phone', '(11) 99999-1234');
  ui.input('consent', true);
  ui.submit();
  assert.ok(ui.root.querySelector('[data-step="identity"]'), 'Identificação só após contato');
}

test('credit starts with a human objective and has no personal fields', () => {
  const ui = boot();
  assert.ok(ui.root.querySelector('[data-choice="contas"]'));
  assert.equal(ui.root.querySelector('input[name="cpf"]'), null);
  assert.equal(ui.root.querySelector('input[name="email"]'), null);
  ui.dom.window.close();
});

for (const [profile, label] of [
  ['clt', /carteira assinada/i],
  ['beneficio', /benefício|aposentad/i],
  ['fgts', /FGTS/],
  ['garantia', /carro ou imóvel/i],
  ['luz', /conta de luz/i],
  ['bolsa', /Bolsa Família/i]
]) {
  test('profile ' + profile + ' produces a distinct result before personal data', () => {
    const ui = boot();
    creditResult(ui, profile);
    assert.match(ui.text(), label);
    assert.match(ui.text(), /10\.000,00/);
    assert.match(ui.text(), /análise/i);
    assert.equal(ui.root.querySelector('input[name="fullName"]'), null);
    assert.ok(ui.root.querySelector('[data-action="whatsapp"]'));
    ui.dom.window.close();
  });
}

test('page profile is explained and still lets the visitor choose a different profile', () => {
  const ui = boot({ profile: 'fgts' });
  ui.choose('projeto');
  assert.match(ui.text(), /página|selecion|perfil/i);
  assert.equal(ui.root.querySelector('[data-choice="fgts"]').getAttribute('aria-pressed'), 'true');
  assert.equal(ui.root.querySelectorAll('[data-choice]').length, 6);
  ui.choose('luz');
  ui.input('amount', '2500');
  ui.submit();
  assert.match(ui.text(), /conta de luz/i);
  ui.dom.window.close();
});

test('invalid, negative, malformed and zero money values cannot advance', () => {
  const ui = boot();
  ui.choose('contas');
  ui.choose('clt');
  for (const value of ['', '0', '-1', '10abc', '1,2,3', '1.0000', '99999999999999999999']) {
    ui.input('amount', value);
    ui.submit();
    const input = ui.root.querySelector('[name="amount"]');
    assert.ok(input, 'Valor inválido continua na etapa: ' + value);
    assert.equal(input.getAttribute('aria-invalid'), 'true');
    assert.equal(ui.window.document.activeElement, input);
  }
  ui.input('amount', 'R$ 1.234,56');
  ui.submit();
  assert.match(ui.text(), /1\.234,56/);
  ui.dom.window.close();
});

test('back, review and restart retain selections and entered amount', () => {
  const ui = boot();
  creditResult(ui, 'fgts', '8.000,50');
  ui.action('review');
  assert.equal(ui.root.querySelector('[name="amount"]').value, '8.000,50');
  ui.action('back');
  assert.equal(ui.root.querySelector('[data-choice="fgts"]').getAttribute('aria-pressed'), 'true');
  ui.action('back');
  assert.equal(ui.root.querySelector('[data-choice="contas"]').getAttribute('aria-pressed'), 'true');
  ui.choose('contas');
  ui.choose('fgts');
  assert.equal(ui.root.querySelector('[name="amount"]').value, '8.000,50');
  ui.submit();
  ui.action('restart');
  assert.ok(ui.root.querySelector('[data-choice="contas"]'));
  ui.choose('contas');
  ui.choose('fgts');
  assert.equal(ui.root.querySelector('[name="amount"]').value, '8.000,50');
  ui.dom.window.close();
});

test('selling from the credit journey asks modality instead of financial profile', () => {
  const ui = boot();
  ui.choose('vender');
  assert.ok(ui.root.querySelector('[data-choice="imovel"]'));
  assert.equal(ui.root.querySelector('[data-choice="clt"]'), null);
  ui.choose('imovel');
  ui.input('amount', '250.000');
  ui.submit();
  assert.match(ui.text(), /crédito da carta/i);
  assert.match(ui.text(), /preço de venda/i);
  assert.match(ui.text(), /proposta/i);
  ui.dom.window.close();
});

test('seller separates the credit on the letter from a negotiated sale price', () => {
  const ui = boot({ mode: 'seller' });
  ui.choose('veiculo');
  ui.input('administrator', 'Administradora Exemplo');
  ui.submit();
  ui.input('amount', '80.000');
  ui.submit();
  assert.match(ui.text(), /Administradora Exemplo/);
  assert.match(ui.text(), /80\.000,00/);
  assert.match(ui.text(), /não é o preço de venda/i);
  assert.match(ui.text(), /aprovação da administradora/i);
  assert.equal(ui.root.querySelector('input[name="fullName"]'), null);
  ui.dom.window.close();
});

for (const mode of ['seller', 'credit']) {
  test('selling via ' + mode + ' continues only through the existing form', () => {
    const ui = boot({ mode });
    if (mode === 'credit') ui.choose('vender');
    ui.choose('imovel');
    if (mode === 'seller') {
      ui.input('administrator', 'Embracon');
      ui.submit();
    }
    ui.input('amount', '100.000');
    ui.submit();
    assert.equal(ui.root.querySelector('[data-action="whatsapp"]'), null);
    const next = ui.root.querySelector('[data-action="contact"]');
    assert.equal(next.textContent, 'Continuar solicitação pelo formulário');
    assert.equal(next.classList.contains('j-secondary'), false);
    contact(ui);
    assert.ok(ui.root.querySelector('[name="cpf"]'));
    ui.action('skip-identity');
    assert.ok(ui.root.querySelector('[data-step="success"]'));
    assert.equal(ui.root.querySelector('[data-action="whatsapp"]'), null);
    assert.match(ui.text(), /100\.000,00/);
    assert.deepEqual(ui.calls, []);
    ui.dom.window.close();
  });
}

test('seller requires administrator or an explicit unknown choice', () => {
  const ui = boot({ mode: 'seller' });
  ui.choose('outra');
  ui.submit();
  assert.ok(ui.root.querySelector('[name="administrator"][aria-invalid="true"]'));
  ui.action('unknown-administrator');
  assert.ok(ui.root.querySelector('[name="amount"]'));
  ui.dom.window.close();
});

test('buyer asks available entry and desired credit without inventing inventory', () => {
  const ui = boot({ mode: 'buyer' });
  ui.choose('imovel');
  ui.input('entryAmount', '30.000');
  ui.submit();
  ui.input('amount', '200.000');
  ui.submit();
  assert.match(ui.text(), /30\.000,00/);
  assert.match(ui.text(), /200\.000,00/);
  assert.match(ui.text(), /aprovação da administradora/i);
  assert.match(ui.text(), /disponibilidade/i);
  assert.doesNotMatch(ui.text(), /aprovado|garantido|taxa de \d/i);
  assert.ok(ui.root.querySelector('[data-action="whatsapp"]'));
  assert.ok(ui.root.querySelector('[data-action="contact"].j-secondary'));
  ui.dom.window.close();
});

test('buyer can say entry is not defined and cannot enter a negative entry', () => {
  const ui = boot({ mode: 'buyer' });
  ui.choose('veiculo');
  ui.input('entryAmount', '-100');
  ui.submit();
  assert.ok(ui.root.querySelector('[name="entryAmount"][aria-invalid="true"]'));
  ui.action('unknown-entry');
  ui.input('amount', '60.000');
  ui.submit();
  assert.match(ui.text(), /ainda não defini/i);
  ui.dom.window.close();
});

test('invalid contact and missing contextual consent cannot reach identification', () => {
  const ui = boot();
  creditResult(ui);
  ui.action('contact');
  ui.input('fullName', 'Ana');
  ui.input('email', 'nao-e-email');
  ui.input('phone', '1234');
  ui.submit();
  assert.equal(ui.root.querySelectorAll('[aria-invalid="true"]').length, 4);
  assert.equal(ui.window.document.activeElement.name, 'fullName');
  assert.equal(ui.root.querySelector('[name="cpf"]'), null);
  ui.input('fullName', 'Ana de Souza');
  ui.input('email', 'ana@example.com');
  ui.input('phone', '11999991234');
  ui.submit();
  assert.ok(ui.root.querySelector('[name="consent"][aria-invalid="true"]'));
  ui.input('consent', true);
  ui.submit();
  assert.ok(ui.root.querySelector('[name="cpf"]'));
  ui.dom.window.close();
});

test('optional CPF can be skipped and completion clearly says no data was sent', () => {
  const ui = boot();
  creditResult(ui);
  contact(ui);
  assert.match(ui.text(), /fictícios/i);
  assert.equal(ui.root.querySelector('[name="cpf"]').required, false);
  ui.action('skip-identity');
  assert.ok(ui.root.querySelector('[data-step="success"]'));
  assert.match(ui.text(), /demonstração/i);
  assert.match(ui.text(), /nenhum dado foi enviado/i);
  assert.doesNotMatch(ui.text(), /\bCPF\b/);
  ui.dom.window.close();
});

test('invalid CPF check digits block completion but blank CPF is accepted', () => {
  const ui = boot();
  creditResult(ui);
  contact(ui);
  for (const value of ['111.111.111-11', '529.982.247-24', '1234', '52998224725X']) {
    ui.input('cpf', value);
    ui.submit();
    assert.ok(ui.root.querySelector('[name="cpf"][aria-invalid="true"]'), value);
  }
  ui.input('cpf', '');
  ui.submit();
  assert.ok(ui.root.querySelector('[data-step="success"]'));
  ui.dom.window.close();
});

test('valid CPF never appears in result, WhatsApp payload or retained DOM', () => {
  const ui = boot();
  let message = '';
  ui.window.Fivecred = { openWhatsApp(value) { message = value; } };
  creditResult(ui, 'fgts', '8.000', 'projeto');
  contact(ui);
  ui.input('cpf', '529.982.247-25');
  ui.submit();
  assert.ok(ui.root.querySelector('[data-step="success"]'));
  assert.doesNotMatch(ui.root.innerHTML, /529|982|CPF/);
  ui.action('whatsapp');
  assert.match(message, /8\.000,00/);
  assert.match(message, /FGTS/);
  assert.match(message, /projeto/i);
  assert.doesNotMatch(message, /529|982|CPF|ana@example/);
  ui.dom.window.close();
});

test('WhatsApp fallback emits contextual event without opening a network destination', () => {
  const ui = boot();
  let detail;
  ui.window.addEventListener('fivecred:whatsapp', (event) => { detail = event.detail; });
  creditResult(ui, 'bolsa', '2.500', 'contas');
  ui.action('whatsapp');
  assert.match(detail.message, /2\.500,00/);
  assert.match(detail.message, /Bolsa Família/);
  assert.match(detail.message, /contas/i);
  assert.equal(ui.window.location.href, 'http://127.0.0.1:4173/');
  assert.deepEqual(ui.calls, []);
  ui.dom.window.close();
});

test('external start highlights and explains profile with focus and reduced-motion scroll', () => {
  const ui = boot({ multiple: true });
  assert.equal(typeof ui.window.FivecredJourney?.start, 'function');
  ui.window.FivecredJourney.start('garantia', 'credito');
  assert.equal(ui.root.querySelector('[data-choice="garantia"]').getAttribute('aria-pressed'), 'true');
  assert.equal(ui.window.document.activeElement.classList.contains('j-heading'), true);
  assert.equal(ui.window.lastScroll.behavior, 'auto');
  assert.equal(ui.window.document.querySelectorAll('[data-journey]')[1].querySelector('[data-step]').dataset.step, 'objective');
  ui.dom.window.close();
});

test('all widgets use unique input ids and associated labels', () => {
  const ui = boot({ multiple: true });
  const roots = Array.from(ui.window.document.querySelectorAll('[data-journey]'));
  roots.forEach((root) => {
    root.querySelector('[data-choice="contas"]').click();
    root.querySelector('[data-choice="clt"]').click();
  });
  const inputs = Array.from(ui.window.document.querySelectorAll('input'));
  assert.equal(inputs.length, 2);
  assert.equal(new Set(inputs.map((input) => input.id)).size, inputs.length);
  inputs.forEach((input) => assert.ok(ui.window.document.querySelector('label[for="' + input.id + '"]')));
  ui.dom.window.close();
});

test('user administrator text remains inert through results and review', () => {
  const ui = boot({ mode: 'seller' });
  const payload = '<img src=x onerror="window.pwned=1">';
  ui.choose('imovel');
  ui.input('administrator', payload);
  ui.submit();
  ui.input('amount', '150.000');
  ui.submit();
  assert.match(ui.text(), /<img src=x/);
  assert.equal(ui.root.querySelector('img'), null);
  assert.equal(ui.window.pwned, undefined);
  ui.action('review');
  ui.action('back');
  assert.equal(ui.root.querySelector('[name="administrator"]').value, payload);
  ui.dom.window.close();
});

test('complete local flow performs zero network, navigation or storage calls', () => {
  const ui = boot();
  creditResult(ui);
  contact(ui);
  ui.input('cpf', '529.982.247-25');
  ui.submit();
  ui.action('whatsapp');
  ui.action('restart');
  assert.deepEqual(ui.calls, []);
  assert.equal(ui.window.location.href, 'http://127.0.0.1:4173/');
  ui.dom.window.close();
});


test('external start ignores unknown and inherited object keys without breaking the journey', () => {
  const ui = boot({ profile: '__proto__' });
  assert.equal(typeof ui.window.FivecredJourney?.start, 'function');
  assert.doesNotThrow(() => ui.window.FivecredJourney.start('__proto__', '__proto__'));
  assert.ok(ui.root.querySelector('[data-step="objective"]'));
  ui.window.FivecredJourney.start('fgts', 'projeto');
  assert.equal(ui.root.querySelector('[data-choice="fgts"]').getAttribute('aria-pressed'), 'true');
  ui.dom.window.close();
});


for (const [site, context] of [
  ['imovel-fivecred', /garantia de imóvel/i],
  ['veiculo-fivecred', /garantia de veículo/i]
]) {
  test('guarantee retains ' + site + ' page context only while that profile is selected', () => {
    const ui = boot({ profile: 'garantia', site });
    let message = '';
    ui.window.Fivecred = { openWhatsApp(value) { message = value; } };
    creditResult(ui, 'garantia', '100.000', 'projeto');
    assert.match(ui.text(), context);
    ui.action('whatsapp');
    assert.match(message, context);
    ui.action('review');
    ui.action('back');
    assert.equal(ui.root.querySelectorAll('[data-choice]').length, 6);
    ui.choose('fgts');
    ui.submit();
    assert.doesNotMatch(ui.text(), context);
    ui.action('whatsapp');
    assert.match(message, /FGTS/);
    assert.doesNotMatch(message, context);
    ui.dom.window.close();
  });
}
