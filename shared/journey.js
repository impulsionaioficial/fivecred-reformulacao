/* Fivecred local journey. No network, persistent storage or external navigation.
 * CSS contract: j-card, j-heading, j-progress, j-step, j-options, j-option,
 * j-option-icon, j-option-label, j-option-help, j-input, j-field, j-error,
 * j-actions, j-button, j-secondary, j-summary, j-help, j-back, j-success,
 * j-consent, j-kicker, j-note, j-suggestions, j-amount, j-review.
 * Integration: FivecredJourney.start(profile, goal); Fivecred.openWhatsApp(text)
 * or the window event fivecred:whatsapp with detail.message.
 */
(function () {
  'use strict';

  var icons = {
    briefcase: '<rect x="3" y="7" width="18" height="14" rx="2"/><path d="M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M3 12a22 22 0 0 0 18 0M10 12h4v3h-4z"/>',
    heart: '<path d="m12 21-8.2-8.2A5.5 5.5 0 0 1 12 5.5a5.5 5.5 0 0 1 8.2 7.3Z"/>',
    wallet: '<path d="M20 8V5a2 2 0 0 0-2-2H6a3 3 0 0 0 0 6h14v12H6a3 3 0 0 1-3-3V6M20 13h-5v4h5"/>',
    home: '<path d="m3 10 9-7 9 7M5 9v12h14V9M9 21v-8h6v8"/>',
    bolt: '<path d="m13 2-9 12h7l-1 8 10-13h-7z"/>',
    family: '<circle cx="9" cy="7" r="3"/><path d="M3 21v-3a6 6 0 0 1 12 0v3M16 4a3 3 0 0 1 0 6M17 13a5 5 0 0 1 4 5v3"/>',
    list: '<rect x="4" y="3" width="16" height="18" rx="2"/><path d="M8 8h8M8 12h8M8 16h5"/>',
    target: '<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1"/>',
    document: '<path d="M14 3H5v18h14V8zM14 3v5h5M8 12h8M8 16h5"/>',
    car: '<path d="m5 6-2 7v6h18v-6l-2-7zM3 13h18M6 19v2M18 19v2M7 16h1M16 16h1"/>',
    plus: '<rect x="3" y="3" width="18" height="18" rx="3"/><path d="M12 7v10M7 12h10"/>',
    arrow: '<path d="M4 12h16m-6-6 6 6-6 6"/>',
    back: '<path d="M20 12H4m6-6-6 6 6 6"/>',
    check: '<path d="m5 12 4 4L19 6"/>'
  };

  function iconSVG(name) {
    return '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">' +
      (owns(icons, name) ? icons[name] : icons.document) + '</svg>';
  }

  var profiles = {
    clt: {
      label: 'Trabalho de carteira assinada',
      help: 'Tenho vínculo de trabalho formal.',
      icon: 'briefcase',
      title: 'Sua carteira assinada é o ponto de partida',
      detail: 'A equipe pode avaliar as opções relacionadas ao seu vínculo de trabalho e explicar quais informações são necessárias para continuar.'
    },
    beneficio: {
      label: 'Recebo aposentadoria, pensão ou benefício',
      help: 'Vamos entender qual benefício você recebe.',
      icon: 'heart',
      title: 'Vamos começar pelo benefício que você recebe',
      detail: 'Aposentadorias, pensões e benefícios assistenciais têm critérios diferentes. A equipe precisa identificar o seu benefício antes de orientar o próximo passo.'
    },
    fgts: {
      label: 'Tenho saldo no FGTS',
      help: 'Quero entender as possibilidades com meu saldo.',
      icon: 'wallet',
      title: 'Seu saldo no FGTS pode orientar a conversa',
      detail: 'A equipe precisa verificar as regras vigentes e as autorizações aplicáveis antes de apresentar qualquer condição relacionada ao seu saldo.'
    },
    garantia: {
      label: 'Tenho carro ou imóvel no meu nome',
      help: 'Quero conversar sobre o uso do meu bem.',
      icon: 'home',
      title: 'Vamos entender o bem que está no seu nome',
      detail: 'O tipo de bem, suas características e a documentação ajudam a equipe a avaliar quais caminhos podem fazer sentido para você.'
    },
    luz: {
      label: 'Sou titular da conta de luz',
      help: 'A conta de energia está no meu nome.',
      icon: 'bolt',
      title: 'Sua conta de luz é o ponto de partida',
      detail: 'A titularidade da conta, a região atendida e os critérios da instituição precisam ser verificados antes de apresentar condições.'
    },
    bolsa: {
      label: 'Recebo Bolsa Família',
      help: 'Quero entender as opções para o meu contexto.',
      icon: 'family',
      title: 'Vamos entender seu contexto com cuidado',
      detail: 'Receber Bolsa Família não garante acesso a crédito. A equipe precisa avaliar as possibilidades para o seu contexto, sem presumir que o benefício pode ser usado na operação.'
    }
  };
  var goals = {
    contas: 'Organizar minhas contas',
    projeto: 'Realizar um projeto',
    comprar: 'Comprar um bem',
    vender: 'Vender minha própria carta',
    credito: 'Ver opções de crédito'
  };
  var modalities = {
    imovel: 'Imóvel',
    veiculo: 'Veículo',
    outra: 'Outra modalidade'
  };
  var instances = [];
  var initialized = new WeakMap();
  var currency = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' });

  function owns(object, key) {
    return Object.prototype.hasOwnProperty.call(object, key);
  }

  function escapeHTML(value) {
    return String(value == null ? '' : value).replace(/[&<>"']/g, function (character) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[character];
    });
  }

  function parseMoney(value, allowZero) {
    var clean = String(value).trim().replace(/^R\$\s*/i, '').replace(/\u00a0/g, '');
    // Brazilian notation only: 1000, 1.000 or 1.000,50. Never strip arbitrary text.
    if (!/^(?:\d+|\d{1,3}(?:\.\d{3})+)(?:,\d{1,2})?$/.test(clean)) return null;
    var parts = clean.replace(/\./g, '').split(',');
    var cents = Number(parts[0]) * 100 + Number((parts[1] || '').padEnd(2, '0'));
    if (!Number.isSafeInteger(cents) || cents > 10000000000 || cents < (allowZero ? 0 : 100)) return null;
    return cents / 100;
  }

  function validCPF(value) {
    var raw = value.trim();
    if (!raw) return true;
    if (!/^(?:\d{11}|\d{3}\.\d{3}\.\d{3}-\d{2})$/.test(raw)) return false;
    var digits = raw.replace(/\D/g, '');
    if (/^(\d)\1{10}$/.test(digits)) return false;
    for (var length = 9; length <= 10; length += 1) {
      var sum = 0;
      for (var index = 0; index < length; index += 1) {
        sum += Number(digits[index]) * (length + 1 - index);
      }
      var check = (sum * 10) % 11;
      if (check === 10) check = 0;
      if (check !== Number(digits[length])) return false;
    }
    return true;
  }

  function validPhone(value) {
    if (!/^[+\d\s().-]+$/.test(value)) return false;
    var digits = value.replace(/\D/g, '');
    if ((digits.length === 12 || digits.length === 13) && digits.indexOf('55') === 0) {
      digits = digits.slice(2);
    }
    return /^[1-9]\d(?:[2-9]\d{7}|9\d{8})$/.test(digits);
  }

  function createJourney(root, index) {
    var prefix = 'fivecred-journey-' + index;
    var mode = ['credit', 'seller', 'buyer'].indexOf(root.dataset.mode) >= 0 ? root.dataset.mode : 'credit';
    var initialProfile = owns(profiles, root.dataset.profile) ? root.dataset.profile : '';
    var state = {
      step: mode === 'credit' ? 'objective' : (mode === 'buyer' ? 'purpose' : 'modality'),
      goal: owns(goals, root.dataset.goal) ? root.dataset.goal : 'credito',
      profile: initialProfile,
      modality: '',
      administrator: '',
      entryAmount: '',
      entryUnknown: false,
      amount: '',
      fullName: '',
      email: '',
      phone: '',
      consent: false,
      contextNote: initialProfile ? 'Esta página destaca um perfil. Confirme abaixo ou escolha o que descreve melhor o seu momento.' : ''
    };
    var errors = {};
    // The optional identifier lives only while the identification step is open.
    var identityValue = '';

    function kind() {
      return mode === 'seller' || (mode === 'credit' && state.goal === 'vender') ? 'seller' : mode;
    }

    function steps() {
      if (mode === 'seller') return ['modality', 'administrator', 'amount'];
      if (mode === 'buyer') return ['purpose', 'entry', 'amount'];
      return ['objective', kind() === 'seller' ? 'modality' : 'profile', 'amount'];
    }

    function button(action, label, secondary, extraClass) {
      return '<button type="button" data-action="' + action + '" class="j-button' +
        (secondary ? ' j-secondary' : '') + (extraClass ? ' ' + extraClass : '') + '">' +
        label + '</button>';
    }

    function submitButton(label) {
      return '<button type="submit" class="j-button">' + label + ' ' + iconSVG('arrow') + '</button>';
    }

    function option(value, label, help, icon, selected) {
      return '<button type="button" class="j-option" data-choice="' + value +
        '" aria-pressed="' + (selected ? 'true' : 'false') + '">' +
        '<span class="j-option-icon" aria-hidden="true">' + iconSVG(icon) + '</span>' +
        '<span class="j-option-label">' + label +
        (help ? '<span class="j-option-help">' + help + '</span>' : '') +
        '</span><span aria-hidden="true">' + iconSVG('arrow') + '</span></button>';
    }

    function field(name, label, options) {
      options = options || {};
      var fieldId = prefix + '-' + name;
      var error = errors[name];
      var describedBy = (options.help ? fieldId + '-help ' : '') + (error ? fieldId + '-error' : '');
      var value = name === 'cpf' ? identityValue : state[name];
      return '<div class="j-field"><label for="' + fieldId + '">' + label + '</label>' +
        '<input class="j-input" id="' + fieldId + '" name="' + name +
        '" type="' + (options.type || 'text') + '" value="' + escapeHTML(value) +
        '" autocomplete="off"' +
        (options.inputMode ? ' inputmode="' + options.inputMode + '"' : '') +
        (options.maxLength ? ' maxlength="' + options.maxLength + '"' : '') +
        (options.placeholder ? ' placeholder="' + options.placeholder + '"' : '') +
        (describedBy.trim() ? ' aria-describedby="' + describedBy.trim() + '"' : '') +
        (error ? ' aria-invalid="true"' : '') +
        (options.required ? ' required' : '') + '>' +
        (options.help ? '<p class="j-help" id="' + fieldId + '-help">' + options.help + '</p>' : '') +
        (error ? '<p class="j-error" id="' + fieldId + '-error">' + error + '</p>' : '') + '</div>';
    }

    function progress() {
      var personal = ['contact', 'identity', 'success'].indexOf(state.step) >= 0;
      var ordered = personal ? ['contact', 'identity', 'success'] : steps();
      var labels = {
        objective: 'Objetivo', profile: 'Seu perfil', modality: 'Modalidade',
        administrator: 'Administradora', purpose: 'Finalidade', entry: 'Sua entrada',
        amount: 'Valor', contact: 'Contato', identity: 'Identificação', success: 'Conclusão'
      };
      var current = ordered.indexOf(state.step);
      if (state.step === 'result') current = ordered.length;
      return '<ol class="j-progress" aria-label="' + (personal ? 'Etapas do formulário' : 'Etapas da orientação') + '">' +
        ordered.map(function (step, stepIndex) {
          return '<li data-status="' + (stepIndex < current ? 'complete' : (stepIndex === current ? 'current' : 'upcoming')) + '"' +
            (stepIndex === current ? ' aria-current="step"' : '') + '>' +
            '<span aria-hidden="true">' + (stepIndex < current ? iconSVG('check') : stepIndex + 1) + '</span> ' + labels[step] + '</li>';
        }).join('') + '</ol>';
    }

    function navigation() {
      if (steps().indexOf(state.step) === 0) return '';
      return '<div class="j-actions">' +
        button('back', iconSVG('back') + ' Voltar', true, 'j-back') +
        button('restart', 'Recomeçar', true) + '</div>';
    }

    function heading(title, help) {
      return '<h2 class="j-heading" id="' + prefix + '-title" tabindex="-1">' + title + '</h2>' +
        (help ? '<p class="j-help">' + help + '</p>' : '');
    }

    function context() {
      if (kind() === 'seller') return 'a venda da minha própria carta de consórcio';
      if (kind() === 'buyer') return 'meu interesse em comprar uma carta de consórcio';
      return 'meu pedido para ' + goals[state.goal].toLocaleLowerCase('pt-BR');
    }

    function guaranteeContext() {
      if (kind() !== 'credit' || state.profile !== 'garantia') return '';
      if (root.dataset.site === 'imovel-fivecred') return 'crédito com garantia de imóvel';
      if (root.dataset.site === 'veiculo-fivecred') return 'crédito com garantia de veículo';
      return '';
    }

    function summaryRows() {
      if (kind() === 'seller') {
        var sellerRows = [
          ['Objetivo', 'Vender minha própria carta'],
          ['Modalidade', modalities[state.modality] || 'A identificar'],
          ['Crédito da carta informado', currency.format(parseMoney(state.amount))]
        ];
        if (mode === 'seller') sellerRows.push(['Administradora', state.administrator || 'Ainda não sei informar']);
        return sellerRows;
      }
      if (kind() === 'buyer') {
        return [
          ['Objetivo', 'Comprar uma carta para ' + modalities[state.modality].toLocaleLowerCase('pt-BR')],
          ['Entrada disponível informada', state.entryUnknown ? 'Ainda não defini' : currency.format(parseMoney(state.entryAmount, true))],
          ['Crédito desejado', currency.format(parseMoney(state.amount))]
        ];
      }
      var creditRows = [
        ['Objetivo', goals[state.goal]],
        ['Seu perfil', profiles[state.profile].label]
      ];
      if (guaranteeContext()) creditRows.push(['Página de origem', guaranteeContext()]);
      creditRows.push(['Valor desejado', currency.format(parseMoney(state.amount))]);
      return creditRows;
    }

    function fillSummary() {
      var list = root.querySelector('[data-summary]');
      if (!list) return;
      summaryRows().forEach(function (row) {
        var group = document.createElement('div');
        var term = document.createElement('dt');
        var definition = document.createElement('dd');
        term.textContent = row[0];
        definition.textContent = row[1];
        group.append(term, definition);
        list.append(group);
      });
    }

    function resultContent() {
      var intro;
      if (kind() === 'seller') {
        intro = heading('Sua carta pode seguir para uma avaliação', 'Veja o que você informou antes de solicitar uma proposta.') +
          '<p class="j-note">O crédito da carta não é o preço de venda. O valor de uma eventual proposta depende das características da cota, do saldo devedor, das parcelas e da documentação. A transferência depende da aprovação da administradora.</p>';
      } else if (kind() === 'buyer') {
        intro = heading('Seu interesse está organizado', 'Agora a equipe pode entender o que você procura em uma carta.') +
          '<p class="j-note">Este direcionamento não representa uma carta disponível ou uma oferta. A entrada informada serve para planejar a conversa. Disponibilidade, condições de compra e transferência dependem de verificação e da aprovação da administradora.</p>';
      } else {
        var profile = profiles[state.profile];
        intro = heading(profile.title, profile.detail) +
          (guaranteeContext() ? '<p class="j-help">Você veio da página de ' + guaranteeContext() + '. A equipe confirmará qual bem você pretende usar.</p>' : '') +
          '<p class="j-note">Esta é uma orientação preliminar. Perfil, valor, taxas e condições dependem de análise e da instituição responsável. Não há aprovação nem oferta nesta etapa.</p>';
      }
      var seller = kind() === 'seller';
      var whatsLabel = kind() === 'buyer' ? 'Consultar cartas no WhatsApp' : 'Conversar no WhatsApp';
      return intro + '<dl class="j-summary" data-summary></dl>' +
        button('review', 'Revisar minhas respostas', true, 'j-review') +
        '<div class="j-actions">' + (seller ? '' : button('whatsapp', whatsLabel, false)) +
        button('contact', seller ? 'Continuar solicitação pelo formulário' : 'Continuar pelo formulário', !seller) + '</div>' +
        '<p class="j-help">Sem compromisso. ' + (seller ? 'Continue para informar seus dados de contato.' : 'Você decide como continuar.') +
        ' Esta versão é uma demonstração local e não envia dados.</p>' +
        navigation();
    }

    function content() {
      if (state.step === 'objective') {
        return heading('O que você quer resolver hoje?', 'Escolha um objetivo. São 3 passos para orientar sua conversa, sem pedir seus dados pessoais.') +
          '<div class="j-options">' +
          option('contas', goals.contas, 'Reunir despesas e buscar um novo fôlego.', 'list', state.goal === 'contas') +
          option('projeto', goals.projeto, 'Tirar um plano do papel.', 'target', state.goal === 'projeto') +
          option('comprar', goals.comprar, 'Planejar a compra de um bem.', 'home', state.goal === 'comprar') +
          option('vender', goals.vender, 'Sou dono de uma carta de consórcio.', 'document', state.goal === 'vender') +
          '</div>';
      }
      if (state.step === 'profile') {
        return heading('O que faz parte do seu momento?', 'Escolha o perfil que descreve melhor você. Toque em uma opção para avançar.') +
          (state.contextNote ? '<p class="j-note">' + escapeHTML(state.contextNote) + '</p>' : '') +
          '<div class="j-options">' + Object.keys(profiles).map(function (key) {
            var profile = profiles[key];
            return option(key, profile.label, profile.help, profile.icon, state.profile === key);
          }).join('') + '</div>' + navigation();
      }
      if (state.step === 'modality' || state.step === 'purpose') {
        var buyer = kind() === 'buyer';
        return heading(buyer ? 'O que você quer comprar?' : 'Sua carta é de qual modalidade?',
          buyer ? 'Comece pela finalidade. A equipe verificará as possibilidades disponíveis.' : 'Este caminho é para quem quer vender a própria carta de consórcio.') +
          '<div class="j-options">' + Object.keys(modalities).filter(function (key) {
            return !buyer || key !== 'outra';
          }).map(function (key) {
            return option(key, modalities[key], '', key === 'imovel' ? 'home' : (key === 'veiculo' ? 'car' : 'plus'), state.modality === key);
          }).join('') + '</div>' + navigation();
      }
      if (state.step === 'administrator') {
        return heading('Qual é a administradora da sua carta?', 'É a empresa responsável pelo seu grupo de consórcio.') +
          field('administrator', 'Nome da administradora', {
            maxLength: 100, placeholder: 'Digite o nome da empresa',
            help: 'Você pode consultar essa informação no contrato ou no boleto da cota.'
          }) +
          '<div class="j-actions">' + submitButton('Continuar') +
          button('unknown-administrator', 'Ainda não sei informar', true) + '</div>' + navigation();
      }
      if (state.step === 'entry') {
        return heading('Quanto você planeja usar na entrada?', 'Uma estimativa ajuda a orientar a busca por uma carta. Você também pode deixar essa decisão para depois.') +
          field('entryAmount', 'Entrada disponível (R$)', {
            inputMode: 'decimal', maxLength: 20, placeholder: 'Ex.: 30.000,00',
            help: 'Valor de planejamento. Isso não representa o preço ou a entrada de uma carta anunciada.'
          }) +
          '<div class="j-actions">' + submitButton('Continuar') +
          button('unknown-entry', 'Ainda não defini a entrada', true) + '</div>' + navigation();
      }
      if (state.step === 'amount') {
        var seller = kind() === 'seller';
        var buyerAmount = kind() === 'buyer';
        var amounts = seller || buyerAmount ? [50000, 100000, 200000] : [2000, 5000, 10000];
        return heading(seller ? 'Qual é o crédito da sua carta?' : (buyerAmount ? 'Qual crédito você procura?' : 'De quanto você precisa?'),
          seller ? 'Informe o crédito indicado na sua carta. O preço de venda será avaliado em uma eventual proposta.' :
            (buyerAmount ? 'Informe quanto deseja de crédito para a compra. A disponibilidade será verificada depois.' :
              'Informe um valor para orientar a conversa. Isso não define um limite aprovado.')) +
          field('amount', seller ? 'Valor do crédito da carta (R$)' : (buyerAmount ? 'Crédito desejado (R$)' : 'Valor desejado (R$)'), {
            inputMode: 'decimal', maxLength: 20, placeholder: 'Ex.: ' + (seller || buyerAmount ? '100.000,00' : '5.000,00'),
            help: 'Digite o valor em reais, usando vírgula para os centavos.', required: true
          }) +
          '<div class="j-suggestions" aria-label="Sugestões de preenchimento">' + amounts.map(function (value) {
            return '<button type="button" class="j-button j-secondary" data-suggestion="' + value + '">' +
              escapeHTML(currency.format(value)) + '</button>';
          }).join('') + '</div><p class="j-help">Os exemplos acima ajudam a preencher o campo; não são ofertas.</p>' +
          '<div class="j-actions">' + submitButton('Ver meu direcionamento') + '</div>' + navigation();
      }
      if (state.step === 'result') return resultContent();
      if (state.step === 'contact') {
        var consentId = prefix + '-consent';
        return heading('Como podemos falar com você?', 'O direcionamento já está pronto. Se quiser, experimente a próxima etapa com dados fictícios.') +
          field('fullName', 'Nome completo', { maxLength: 100, required: true, placeholder: 'Ex.: Ana de Souza' }) +
          field('email', 'E-mail', { type: 'email', inputMode: 'email', maxLength: 120, required: true, placeholder: 'Ex.: ana@example.com' }) +
          field('phone', 'WhatsApp com DDD', { type: 'tel', inputMode: 'tel', maxLength: 22, required: true, placeholder: 'Ex.: (11) 99999-1234' }) +
          '<div class="j-consent"><input type="checkbox" id="' + consentId + '" name="consent"' +
          (state.consent ? ' checked' : '') + (errors.consent ? ' aria-invalid="true" aria-describedby="' + consentId + '-error"' : '') + '>' +
          '<label for="' + consentId + '">Autorizo a Fivecred a entrar em contato por WhatsApp ou e-mail sobre ' +
          escapeHTML(context()) + '.</label></div>' +
          (errors.consent ? '<p class="j-error" id="' + consentId + '-error">' + errors.consent + '</p>' : '') +
          '<p class="j-help">Demonstração local: os dados e essa autorização não são enviados. Use apenas dados fictícios.</p>' +
          '<div class="j-actions">' + submitButton('Continuar para identificação') + '</div>' + navigation();
      }
      if (state.step === 'identity') {
        return heading('Identificação, somente se você quiser testar', 'Esta etapa vem depois do contato. Na demonstração, você pode continuar sem preencher.') +
          '<p class="j-note">Use somente dados fictícios. Nenhuma consulta de crédito será realizada. O CPF é opcional nesta demonstração' +
          (kind() === 'seller' ? '.' : ' e não entra na mensagem de WhatsApp.') + '</p>' +
          field('cpf', 'CPF (opcional na demonstração)', {
            inputMode: 'numeric', maxLength: 14, placeholder: '000.000.000-00',
            help: 'Se preencher, os dígitos serão validados apenas neste navegador.'
          }) +
          '<div class="j-actions">' + submitButton('Concluir demonstração') +
          button('skip-identity', 'Continuar sem CPF', true) + '</div>' + navigation();
      }
      return '<div class="j-success">' + heading('Demonstração concluída', 'Você experimentou o caminho do objetivo ao atendimento.') +
        '<p class="j-note">Nenhum dado foi enviado. Não houve análise, aprovação, solicitação real ou registro de atendimento.</p>' +
        '<dl class="j-summary" data-summary></dl>' +
        '<p class="j-help">' + (kind() === 'seller' ? 'Suas respostas ficam disponíveis nesta página para revisão.' :
          'As respostas abaixo podem orientar uma conversa com a equipe. Seus dados de contato não entram na mensagem.') + '</p>' +
        '<div class="j-actions">' + (kind() === 'seller' ? '' : button('whatsapp', 'Ver mensagem para o WhatsApp', false)) +
        button('review', 'Revisar minhas respostas', true, 'j-review') +
        button('restart', 'Recomeçar', true) + '</div></div>';
    }

    function render(shouldFocus) {
      root.setAttribute('aria-labelledby', prefix + '-title');
      root.innerHTML = '<div class="j-card"><p class="j-kicker">' +
        (['contact', 'identity', 'success'].indexOf(state.step) >= 0 ? 'Demonstração do atendimento' : 'Seu próximo passo começa aqui') +
        '</p>' + progress() + '<form novalidate autocomplete="off"><section class="j-step" data-step="' + state.step + '">' +
        (Object.keys(errors).length ? '<p class="j-error" role="alert" aria-live="assertive">Confira os campos destacados para continuar.</p>' : '') +
        content() + '</section></form></div>';
      fillSummary();
      if (shouldFocus) {
        var target = root.querySelector('[aria-invalid="true"]') || root.querySelector('.j-heading');
        if (target) target.focus();
      }
    }

    function go(step) {
      if (state.step === 'identity' && step !== 'identity') identityValue = '';
      state.step = step;
      errors = {};
      render(true);
    }

    function back() {
      if (state.step === 'identity') return go('contact');
      if (state.step === 'contact') return go('result');
      if (state.step === 'result' || state.step === 'success') return go('amount');
      var ordered = steps();
      var stepIndex = ordered.indexOf(state.step);
      if (stepIndex > 0) go(ordered[stepIndex - 1]);
    }

    function whatsapp() {
      var amount = currency.format(parseMoney(state.amount));
      var message;
      if (kind() === 'seller') {
        message = 'Olá! Quero vender minha própria carta de consórcio para a Fivecred. Modalidade: ' +
          modalities[state.modality] + '. Crédito da carta informado: ' + amount + '. ' +
          (mode === 'seller' ? 'Administradora: ' + (state.administrator || 'a identificar') + '. ' : '') +
          'Entendo que o crédito da carta não é o preço de venda. Como posso solicitar uma proposta?';
      } else if (kind() === 'buyer') {
        message = 'Olá! Quero conversar sobre comprar uma carta de consórcio para ' +
          modalities[state.modality].toLocaleLowerCase('pt-BR') + '. Crédito desejado: ' + amount +
          '. Entrada disponível informada: ' + (state.entryUnknown ? 'ainda não defini' : currency.format(parseMoney(state.entryAmount, true))) +
          '. Entendo que disponibilidade e transferência dependem de verificação e aprovação da administradora. Como posso continuar?';
      } else {
        message = 'Olá! Fiz a orientação no site da Fivecred. Preciso de ' + amount + ' para ' +
          goals[state.goal].toLocaleLowerCase('pt-BR') + ' e meu perfil é: ' +
          profiles[state.profile].label + '.' +
          (guaranteeContext() ? ' Comecei pela página de ' + guaranteeContext() + '.' : '') +
          ' Como posso continuar?';
      }
      if (window.Fivecred && typeof window.Fivecred.openWhatsApp === 'function') {
        window.Fivecred.openWhatsApp(message);
      } else {
        window.dispatchEvent(new CustomEvent('fivecred:whatsapp', { detail: { message: message } }));
      }
    }

    function submit() {
      errors = {};
      if (state.step === 'administrator') {
        state.administrator = state.administrator.trim();
        if (state.administrator.length < 2) errors.administrator = 'Informe a administradora ou escolha “Ainda não sei informar”.';
        if (!Object.keys(errors).length) return go('amount');
      } else if (state.step === 'entry') {
        if (parseMoney(state.entryAmount, true) === null) errors.entryAmount = 'Informe uma entrada válida a partir de R$ 0,00 ou escolha “Ainda não defini”.';
        if (!Object.keys(errors).length) {
          state.entryUnknown = false;
          return go('amount');
        }
      } else if (state.step === 'amount') {
        if (parseMoney(state.amount) === null) errors.amount = 'Para testar, informe de R$ 1,00 a R$ 100.000.000,00. Exemplo: 5.000,00. Essa faixa não representa uma oferta.';
        if (!Object.keys(errors).length) return go('result');
      } else if (state.step === 'contact') {
        state.fullName = state.fullName.trim().replace(/\s+/g, ' ');
        state.email = state.email.trim();
        state.phone = state.phone.trim();
        if (!/^[\p{L}\p{M}.'’-]+(?: [\p{L}\p{M}.'’-]+)+$/u.test(state.fullName) ||
            state.fullName.replace(/[^\p{L}]/gu, '').length < 4) {
          errors.fullName = 'Informe seu nome e sobrenome. Use dados fictícios nesta demonstração.';
        }
        if (!/^[^\s@]+@[^\s@.]+(?:\.[^\s@.]+)+$/.test(state.email)) errors.email = 'Informe um e-mail válido, como ana@example.com.';
        if (!validPhone(state.phone)) errors.phone = 'Informe um WhatsApp válido com DDD, como (11) 99999-1234.';
        if (!state.consent) errors.consent = 'Marque a autorização de contato sobre este pedido para continuar.';
        if (!Object.keys(errors).length) return go('identity');
      } else if (state.step === 'identity') {
        if (!validCPF(identityValue)) errors.cpf = 'Confira os dígitos do CPF fictício ou continue sem preencher.';
        if (!Object.keys(errors).length) return go('success');
      }
      render(true);
    }

    function updateInput(event) {
      var input = event.target;
      if (!input.name || !root.contains(input)) return;
      if (input.name === 'cpf') {
        identityValue = input.value;
      } else if (Object.prototype.hasOwnProperty.call(state, input.name)) {
        state[input.name] = input.type === 'checkbox' ? input.checked : input.value;
      }
    }

    root.addEventListener('input', updateInput);
    root.addEventListener('change', updateInput);
    root.addEventListener('submit', function (event) {
      event.preventDefault();
      submit();
    });
    root.addEventListener('click', function (event) {
      var selected = event.target.closest('button');
      if (!selected || !root.contains(selected)) return;
      var choice = selected.dataset.choice;
      if (choice) {
        if (state.step === 'objective' && owns(goals, choice)) {
          if (state.goal !== choice) state.consent = false;
          state.goal = choice;
          return go(kind() === 'seller' ? 'modality' : 'profile');
        }
        if (state.step === 'profile' && owns(profiles, choice)) {
          if (state.profile !== choice) state.consent = false;
          state.profile = choice;
          return go('amount');
        }
        if ((state.step === 'modality' || state.step === 'purpose') && owns(modalities, choice)) {
          if (state.modality !== choice) state.consent = false;
          state.modality = choice;
          return go(mode === 'seller' ? 'administrator' : (mode === 'buyer' ? 'entry' : 'amount'));
        }
      }
      if (selected.dataset.suggestion) {
        state.amount = Number(selected.dataset.suggestion).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
        errors = {};
        render(false);
        root.querySelector('[name="amount"]').focus({ preventScroll: true });
        return;
      }
      switch (selected.dataset.action) {
        case 'back': back(); break;
        case 'restart': state.contextNote = initialProfile ? 'Suas respostas foram mantidas. Confirme seu perfil ou escolha outro.' : ''; go(steps()[0]); break;
        case 'review': go('amount'); break;
        case 'contact': go('contact'); break;
        case 'whatsapp': whatsapp(); break;
        case 'skip-identity': go('success'); break;
        case 'unknown-administrator': state.administrator = ''; go('amount'); break;
        case 'unknown-entry': state.entryUnknown = true; go('amount'); break;
        default: break;
      }
    });
    render(false);

    return {
      start: function (profile, goal) {
        if (mode === 'credit') {
          var nextGoal = owns(goals, goal) ? goal : 'credito';
          if (state.goal !== nextGoal || state.profile !== profile) state.consent = false;
          state.goal = nextGoal;
          if (owns(profiles, profile) && nextGoal !== 'vender') {
            state.profile = profile;
            state.contextNote = 'Você escolheu começar por este perfil para ' +
              goals[nextGoal].toLocaleLowerCase('pt-BR') + '. Confirme abaixo ou escolha outro perfil. Use “Voltar” para rever seu objetivo.';
            go('profile');
          } else if (nextGoal === 'vender') {
            go('modality');
          } else {
            go('objective');
          }
        } else {
          go(steps()[0]);
        }
        if (typeof root.scrollIntoView === 'function') {
          var reduceMotion = typeof window.matchMedia === 'function' &&
            window.matchMedia('(prefers-reduced-motion: reduce)').matches;
          root.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'start' });
        }
      }
    };
  }

  function initialize() {
    document.querySelectorAll('[data-journey]').forEach(function (root) {
      if (initialized.has(root)) return;
      var instance = createJourney(root, instances.length + 1);
      initialized.set(root, instance);
      instances.push(instance);
    });
  }

  window.FivecredJourney = {
    start: function (profile, goal) {
      initialize();
      if (instances[0]) instances[0].start(profile, goal);
    }
  };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', initialize, { once: true });
  else initialize();
}());
