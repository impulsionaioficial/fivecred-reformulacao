'use client';

import { useEffect, useMemo, useState } from 'react';
import { ArrowRight, Info, WhatsappLogo, XCircle } from '@phosphor-icons/react';

import {
  BOLSA_BENEFICIO_MINIMO,
  LUZ_FATURA_MINIMA,
  funnelFor,
  type SiteProduct,
} from '../lib/fivecredFunnel';
import {
  brl,
  isSimulableProduct,
  maxRequestedForAnchor,
  pct,
  referenceRates,
  simulate,
  type SimulableProduct,
} from '../lib/creditMath';
import {
  adultBirthDateBounds,
  formatBrazilianCep,
  formatBrazilianPhone,
  formatCpf,
  isValidAdultBirthDate,
  isValidBrazilianCep,
  isValidBrazilianWhatsapp,
  isValidCpf,
  isValidEmail,
} from '../lib/leadValidation';
import {
  buildAtendimentoUrl,
  buildCltLocationAnswers,
  buildAtendimentoLeadUrl,
  ESTADO_CIVIL_OPTIONS,
  prepareProductQualification,
} from '../lib/whatsapp';
import {
  trackFormStart,
  trackFormStepComplete,
  trackFormStepView,
  trackLeadSubmitAttempt,
  trackLeadSubmitError,
  trackLeadSubmitSuccess,
  trackValidationError,
  trackWhatsAppClick,
} from '../lib/attribution';
import {
  buildLeadWebhookPayload,
  submitLeadToWebhook,
  type LeadFields,
} from '../lib/leadWebhook';

type Product = SiteProduct | 'home';

const labels: Record<Product, { question: string; options: string[] }> = {
  veiculo: { question: 'Qual é a situação do veículo?', options: ['Quitado', 'Financiado', 'Ainda estou avaliando'] },
  imovel: { question: 'Qual é a situação do imóvel?', options: ['Quitado', 'Financiado', 'Ainda estou avaliando'] },
  inss: { question: 'Você já consultou sua margem?', options: ['Sim', 'Não', 'Não sei como consultar'] },
  clt: { question: 'Como está seu vínculo?', options: ['Ativo', 'Em atualização', 'Quero entender os critérios'] },
  fgts: { question: 'O saque-aniversário está ativo?', options: ['Sim', 'Não', 'Não sei'] },
  luz: {
    question: 'Qual é a sua classificação?',
    options: [
      'Assalariado',
      'Funcionário público',
      'Aposentado',
      'Pensionista',
      'Autônomo / Sem vínculo empregatício',
      'Profissional liberal',
      'Empresário / Proprietário',
      'Outros',
    ],
  },
  agro: {
    question: 'O que você quer fazer?',
    options: ['Comprar uma carta contemplada', 'Vender a minha carta contemplada'],
  },
  bolsa: {
    question: 'Você recebe o benefício pelo aplicativo Caixa Tem?',
    options: ['Sim', 'Não', 'Não sei'],
  },
  siape: {
    question: 'Você atualmente é servidor público?',
    options: ['Sim', 'Não'],
  },
  bpc: {
    question: 'Você atualmente recebe o benefício BPC/LOAS?',
    options: ['Sim', 'Não'],
  },
  financiamento: {
    question: 'Em que etapa da compra você está?',
    options: ['Já escolhi o imóvel', 'Estou procurando um imóvel', 'Quero construir ou reformar', 'Ainda estou planejando'],
  },
  pessoal: {
    question: 'Como você recebe sua renda hoje?',
    options: ['Registrado CLT', 'Servidor público', 'Aposentado ou pensionista', 'Autônomo ou profissional liberal', 'Empresário', 'Outra situação'],
  },
  home: { question: 'Qual modalidade quer conhecer?', options: ['Consignado', 'Garantia de veículo', 'Ainda não sei'] },
};

/** Campo âncora por produto — espelha a pergunta que o bot também faz. */
const anchorField: Partial<Record<Product, { label: string; hint: string; min: number }>> = {
  clt: { label: 'Seu salário líquido mensal', hint: 'Usamos para estimar a margem consignável de 30%.', min: 500 },
  inss: { label: 'Valor do seu benefício mensal', hint: 'Usamos para estimar a margem consignável de 30%.', min: 500 },
  fgts: { label: 'Saldo aproximado no FGTS', hint: 'Considera contas ativas e inativas.', min: 200 },
  veiculo: { label: 'Valor FIPE do veículo', hint: 'O crédito costuma chegar a até 70% desse valor.', min: 5000 },
  imovel: { label: 'Valor aproximado do imóvel', hint: 'O crédito costuma chegar a até 60% desse valor.', min: 50000 },
  luz: { label: 'Valor médio da sua conta de luz', hint: `A fatura precisa ser de no mínimo ${brl(LUZ_FATURA_MINIMA)}.`, min: LUZ_FATURA_MINIMA },
  agro: {
    label: 'Valor do crédito da carta',
    hint: 'Se você vai vender, informe o valor da carta que já é sua.',
    min: 20000,
  },
  bolsa: {
    label: 'Valor mensal do seu Bolsa Família',
    hint: `O benefício precisa vir acima de ${brl(BOLSA_BENEFICIO_MINIMO)} por mês.`,
    min: BOLSA_BENEFICIO_MINIMO,
  },
  financiamento: {
    label: 'Valor aproximado que deseja financiar',
    hint: 'A instituição parceira confirma o valor disponível após analisar renda, entrada e imóvel.',
    min: 10000,
  },
  pessoal: {
    label: 'Valor aproximado que precisa',
    hint: 'A proposta final depende da análise de crédito e da sua capacidade de pagamento.',
    min: 500,
  },
};

/**
 * Segmento da carta contemplada. A página trata compra e venda de carta em
 * geral; é este campo que diz de que tipo de carta se está falando.
 */
const AREAS_CARTA = [
  'Imóvel',
  'Automóvel',
  'Caminhão ou veículo pesado',
  'Máquinas e implementos agrícolas',
  'Serviços',
  'Ainda estou avaliando',
];

const COMPANHIAS_LUZ = ['CPFL', 'RGE', 'CELPE', 'COELBA', 'COSERN', 'ELEKTRO', 'ENEL', 'OUTROS'];
const COMPANHIA_LUZ_DESQUALIFICADA = 'OUTROS';
const EMPRESTIMO_LUZ_RECENTE_DESQUALIFICADO = 'Sim';
const TEMPOS_CARTEIRA = [
  'Menos de 3 meses',
  'De 3 a 6 meses',
  'De 6 meses a 1 ano',
  'De 1 a 2 anos',
  'Mais de 2 anos',
];

const onlyDigits = (value: string) => value.replace(/\D/g, '');
const BIRTH_DATE_BOUNDS = adultBirthDateBounds();

export default function LeadForm({ product }: { product: Product }) {
  const content = labels[product];
  const formName = `formulario_${product}`;
  const anchor = anchorField[product];
  const isSimulable = product !== 'home' && isSimulableProduct(product);
  const rates = isSimulable ? referenceRates[product as SimulableProduct] : undefined;

  const [step, setStep] = useState<1 | 2>(1);
  const [nome, setNome] = useState('');
  const [telefone, setTelefone] = useState('');
  const [email, setEmail] = useState('');
  const [cpf, setCpf] = useState('');
  const [nascimento, setNascimento] = useState('');
  const [choice, setChoice] = useState('');
  const [cep, setCep] = useState('');
  const [endereco, setEndereco] = useState('');
  const [tempoCarteira, setTempoCarteira] = useState('');
  const [distribuidora, setDistribuidora] = useState('');
  const [estadoCivil, setEstadoCivil] = useState('');
  const [emprestimoContaLuz, setEmprestimoContaLuz] = useState('');
  const [areaCarta, setAreaCarta] = useState('');
  const [orgaoConvenio, setOrgaoConvenio] = useState('');
  const [situacaoOrgao, setSituacaoOrgao] = useState('');
  const [margemDisponivel, setMargemDisponivel] = useState('');
  const [relacaoBeneficio, setRelacaoBeneficio] = useState('');
  const [beneficioAtivo, setBeneficioAtivo] = useState('');
  const [bancoBeneficio, setBancoBeneficio] = useState('');
  const [urgencia, setUrgencia] = useState('');
  const [cidadeEstado, setCidadeEstado] = useState('');
  const [valorImovel, setValorImovel] = useState('');
  const [entradaImovel, setEntradaImovel] = useState('');
  const [rendaMensal, setRendaMensal] = useState('');
  const [usoFgts, setUsoFgts] = useState('');
  const [comprovacaoRenda, setComprovacaoRenda] = useState('');
  const [finalidadeCredito, setFinalidadeCredito] = useState('');
  const [parcelaPossivel, setParcelaPossivel] = useState('');
  const [anchorValue, setAnchorValue] = useState('');
  const [requested, setRequested] = useState('');
  const [months, setMonths] = useState(rates ? String(rates.defaultTerm) : '');
  const [consent, setConsent] = useState(false);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    trackFormStepView({ formName, product, step });
  }, [formName, product, step]);

  const isClt = product === 'clt';
  const isLuz = product === 'luz';
  const isCarta = product === 'agro';
  const isSiape = product === 'siape';
  const isBpc = product === 'bpc';
  const isFinanciamento = product === 'financiamento';
  const isPessoal = product === 'pessoal';
  const distribuidoraBloqueada = isLuz && distribuidora === COMPANHIA_LUZ_DESQUALIFICADA;
  const emprestimoLuzBloqueado = isLuz && emprestimoContaLuz === EMPRESTIMO_LUZ_RECENTE_DESQUALIFICADO;

  // O bot encerra o atendimento de quem não recebe o benefício pelo Caixa Tem (etapa 791).
  const caixaTemBloqueada = product === 'bolsa' && choice === 'Não';
  const modalidadeNaoElegivel = (isSiape || isBpc) && choice === 'Não';

  const bloqueado = distribuidoraBloqueada || emprestimoLuzBloqueado || caixaTemBloqueada || modalidadeNaoElegivel;

  const requestedNumber = Number(onlyDigits(requested));
  const anchorNumber = Number(onlyDigits(anchorValue));
  const maximumRequested = useMemo(() => {
    if (!isSimulable || !anchorNumber || !months) return undefined;
    return maxRequestedForAnchor(product as SimulableProduct, anchorNumber, Number(months));
  }, [anchorNumber, isSimulable, months, product]);

  const simulation = useMemo(() => {
    if (!isSimulable || !requestedNumber || !months) return null;
    return simulate({
      product: product as SimulableProduct,
      requested: requestedNumber,
      months: Number(months),
    });
  }, [isSimulable, product, requestedNumber, months]);

  function failValidation(field: string, message: string) {
    trackValidationError({
      formName,
      product,
      step,
      field,
      errorCode: 'invalid_or_missing',
    });
    setError(message);
  }

  async function deliverLead(whatsappUrl: string, fields: LeadFields) {
    const payload = buildLeadWebhookPayload({
      product,
      formName,
      stage: 'qualified',
      fields,
      consent: {
        accepted: consent,
        source: 'form_checkbox',
        policy_url: 'https://www.fivecred.com.br/politica-de-privacidade',
      },
    });
    const whatsappWindow = window.open('about:blank', '_blank');
    if (whatsappWindow) whatsappWindow.opener = null;

    setSubmitting(true);
    trackFormStepComplete({ formName, product, step: 2 });
    trackLeadSubmitAttempt({ formName, product, eventId: payload.event_id });
    try {
      await submitLeadToWebhook(payload);
    } catch {
      whatsappWindow?.close();
      setSubmitting(false);
      setError('Não foi possível registrar seus dados agora. Revise sua conexão e tente novamente.');
      trackLeadSubmitError({
        formName,
        product,
        eventId: payload.event_id,
        errorCode: 'webhook_failed',
      });
      return false;
    }

    trackLeadSubmitSuccess({ formName, product, eventId: payload.event_id });
    trackWhatsAppClick({ placement: `${formName}_sucesso`, product });
    setSubmitting(false);
    if (whatsappWindow) whatsappWindow.location.replace(whatsappUrl);
    else window.location.assign(whatsappUrl);
    return true;
  }

  function continueToQualification() {
    if (nome.trim().length < 3) return failValidation('nome', 'Informe seu nome completo.');
    if (!isValidBrazilianWhatsapp(telefone)) return failValidation('whatsapp', 'Informe um WhatsApp válido com DDD.');
    if (!isValidEmail(email)) return failValidation('email', 'Informe um e-mail válido.');
    setError('');
    trackFormStepComplete({ formName, product, step: 1 });
    setStep(2);
    window.requestAnimationFrame(() => {
      document.getElementById(`lf-cpf-${product}`)?.focus();
    });
  }

  async function continueToResult() {
    if (nome.trim().length < 3) return failValidation('nome', 'Informe seu nome completo.');
    if (!isValidBrazilianWhatsapp(telefone)) return failValidation('whatsapp', 'Informe um WhatsApp válido com DDD.');
    if (!isValidEmail(email)) return failValidation('email', 'Informe um e-mail válido.');
    if (!isValidCpf(cpf)) return failValidation('cpf', 'Informe um CPF válido.');
    if (!isValidAdultBirthDate(nascimento)) {
      return failValidation('nascimento', 'Informe uma data válida para uma pessoa maior de 18 anos.');
    }
    if (!choice) return failValidation('choice', 'Escolha uma opção para continuar.');
    if (isClt && !isValidBrazilianCep(cep)) return failValidation('cep', 'Informe um CEP válido com 8 dígitos.');
    if (isClt && endereco.trim().length < 8) return failValidation('endereco', 'Informe seu endereço completo.');
    if (isClt && !tempoCarteira) return failValidation('tempo_carteira', 'Informe há quanto tempo sua carteira está registrada.');
    const productQualification = prepareProductQualification({
      product,
      cep,
      estadoCivil,
    });
    if (!productQualification.ok) {
      return failValidation(productQualification.field, productQualification.message);
    }
    if (isLuz && !distribuidora) return failValidation('distribuidora', 'Selecione a distribuidora da sua conta de luz.');
    if (isLuz && !emprestimoContaLuz) {
      return failValidation('emprestimo_conta_luz', 'Informe se já fez empréstimo na conta de luz recentemente.');
    }
    if (isCarta && !areaCarta) return failValidation('area_carta', 'Selecione a área da carta contemplada.');
    if (bloqueado) return setError('');
    if (isSiape && orgaoConvenio.trim().length < 2) return failValidation('orgao_convenio', 'Informe o órgão ou convênio.');
    if (isSiape && !situacaoOrgao) return failValidation('situacao_orgao', 'Informe sua situação atual no órgão.');
    if (isSiape && margemDisponivel === '') return failValidation('margem_disponivel', 'Informe a margem disponível ou digite 0 se não souber.');
    if (isBpc && !relacaoBeneficio) return failValidation('relacao_beneficio', 'Informe se você é titular ou representante.');
    if (isBpc && !beneficioAtivo) return failValidation('beneficio_ativo', 'Informe se o benefício está ativo.');
    if (isBpc && bancoBeneficio.trim().length < 2) return failValidation('banco_beneficio', 'Informe o banco em que recebe o benefício.');
    if ((isSiape || isBpc) && !requestedNumber) return failValidation('valor_desejado', 'Informe o valor que deseja liberar.');
    if ((isSiape || isBpc) && !urgencia) return failValidation('urgencia', 'Informe a urgência para ter o crédito liberado.');
    if (isFinanciamento && cidadeEstado.trim().length < 4) return failValidation('cidade_estado', 'Informe a cidade e o estado do imóvel.');
    if (isFinanciamento && Number(valorImovel) < 50000) return failValidation('valor_imovel', 'Informe o valor aproximado do imóvel.');
    if (isFinanciamento && entradaImovel === '') return failValidation('entrada_imovel', 'Informe a entrada disponível, mesmo que seja zero.');
    if ((isFinanciamento || isPessoal) && Number(rendaMensal) < 500) return failValidation('renda_mensal', 'Informe sua renda mensal aproximada.');
    if (isFinanciamento && !usoFgts) return failValidation('uso_fgts', 'Informe se pretende usar o FGTS.');
    if (isPessoal && !comprovacaoRenda) return failValidation('comprovacao_renda', 'Informe se consegue comprovar sua renda.');
    if (isPessoal && !finalidadeCredito) return failValidation('finalidade_credito', 'Informe para que precisa do crédito.');
    if (isPessoal && Number(parcelaPossivel) < 1) return failValidation('parcela_possivel', 'Informe a parcela aproximada que cabe no orçamento.');
    if ((isFinanciamento || isPessoal) && !urgencia) return failValidation('urgencia', 'Informe quando pretende contratar o crédito.');
    if (anchor && (!anchorNumber || anchorNumber < anchor.min)) {
      return failValidation('valor_ancora', `Informe ${anchor.label.toLowerCase()} — mínimo de ${brl(anchor.min)}.`);
    }
    if (isSimulable && !requestedNumber) {
      return failValidation('valor_desejado', 'Informe quanto você precisa levantar.');
    }
    if (maximumRequested && requestedNumber > maximumRequested + 1) {
      return failValidation('valor_desejado', `Com os dados informados, simule até ${brl(maximumRequested)}.`);
    }
    if (!consent) return failValidation('consentimento', 'Confirme o envio das respostas para continuar.');
    setError('');

    if (!isSimulable && product !== 'home') {
      const details = [
        `${content.question.replace(/[?:]/g, '')}: ${choice}`,
        isCarta && areaCarta ? `Área da carta: ${areaCarta}` : undefined,
        anchor ? `${anchor.label}: ${brl(anchorNumber)}` : undefined,
        ...productQualification.answers.map(({ label, value }) => `${label}: ${value}`),
        isLuz && distribuidora ? `Distribuidora: ${distribuidora}` : undefined,
        isLuz && emprestimoContaLuz ? `Empréstimo recente na conta de luz: ${emprestimoContaLuz}` : undefined,
        isSiape && orgaoConvenio ? `Órgão / Convênio: ${orgaoConvenio.trim()}` : undefined,
        isSiape && situacaoOrgao ? `Situação no órgão: ${situacaoOrgao}` : undefined,
        isSiape ? `Margem disponível informada: ${margemDisponivel === '0' ? 'Não sabe informar' : brl(Number(margemDisponivel))}` : undefined,
        isBpc && relacaoBeneficio ? `Relação com o benefício: ${relacaoBeneficio}` : undefined,
        isBpc && beneficioAtivo ? `Benefício ativo e pago mensalmente: ${beneficioAtivo}` : undefined,
        isBpc && bancoBeneficio ? `Banco de recebimento: ${bancoBeneficio.trim()}` : undefined,
        (isSiape || isBpc) ? `Valor desejado: ${brl(requestedNumber)}` : undefined,
        (isSiape || isBpc) ? `Urgência: ${urgencia}` : undefined,
        isFinanciamento && cidadeEstado ? `Cidade / UF do imóvel: ${cidadeEstado.trim()}` : undefined,
        isFinanciamento ? `Valor aproximado do imóvel: ${brl(Number(valorImovel))}` : undefined,
        isFinanciamento ? `Entrada disponível: ${brl(Number(entradaImovel))}` : undefined,
        (isFinanciamento || isPessoal) ? `Renda mensal aproximada: ${brl(Number(rendaMensal))}` : undefined,
        isFinanciamento && usoFgts ? `Pretende usar FGTS: ${usoFgts}` : undefined,
        isPessoal && comprovacaoRenda ? `Comprovação de renda: ${comprovacaoRenda}` : undefined,
        isPessoal && finalidadeCredito ? `Finalidade do crédito: ${finalidadeCredito}` : undefined,
        isPessoal ? `Parcela que cabe no orçamento: ${brl(Number(parcelaPossivel))}` : undefined,
        (isFinanciamento || isPessoal) ? `Quando pretende contratar: ${urgencia}` : undefined,
      ].filter(Boolean) as string[];

      const whatsappUrl = buildAtendimentoLeadUrl({
        nome: nome.trim(),
        telefone,
        email: email.trim(),
        cpf,
        nascimento,
        interesse: funnelFor(product).label,
        // O roteamento do bot depende deste campo, não do rótulo comercial acima.
        product,
        details,
      });
      await deliverLead(whatsappUrl, {
        nome,
        whatsapp: telefone,
        email,
        cpf,
        nascimento,
        resposta_qualificacao: choice,
        detalhes: details,
        ...productQualification.fields,
        cep: isClt ? cep : undefined,
        endereco: isClt ? endereco : undefined,
        tempoCarteira: isClt ? tempoCarteira : undefined,
        valor_ancora: anchor ? anchorNumber : undefined,
        distribuidora: isLuz ? distribuidora : undefined,
        emprestimo_conta_luz: isLuz ? emprestimoContaLuz : undefined,
        area_carta: isCarta ? areaCarta : undefined,
        orgao_convenio: isSiape ? orgaoConvenio : undefined,
        situacao_orgao: isSiape ? situacaoOrgao : undefined,
        margem_disponivel: isSiape ? margemDisponivel : undefined,
        relacao_beneficio: isBpc ? relacaoBeneficio : undefined,
        beneficio_ativo: isBpc ? beneficioAtivo : undefined,
        banco_beneficio: isBpc ? bancoBeneficio : undefined,
        valor_desejado: (isSiape || isBpc) ? requestedNumber : undefined,
        urgencia: (isSiape || isBpc || isFinanciamento || isPessoal) ? urgencia : undefined,
        cidade_estado: isFinanciamento ? cidadeEstado : undefined,
        valor_imovel: isFinanciamento ? Number(valorImovel) : undefined,
        entrada_imovel: isFinanciamento ? Number(entradaImovel) : undefined,
        renda_mensal: (isFinanciamento || isPessoal) ? Number(rendaMensal) : undefined,
        uso_fgts: isFinanciamento ? usoFgts : undefined,
        comprovacao_renda: isPessoal ? comprovacaoRenda : undefined,
        finalidade_credito: isPessoal ? finalidadeCredito : undefined,
        parcela_possivel: isPessoal ? Number(parcelaPossivel) : undefined,
      });
      return;
    }

    if (!simulation || product === 'home') return setError('Não foi possível concluir esta simulação.');

    const answers = [
      { label: content.question.replace(/[?:]/g, ''), value: choice },
      ...(isClt ? buildCltLocationAnswers({ cep, endereco, tempoCarteira }) : []),
      ...productQualification.answers,
      isLuz ? { label: 'Empréstimo recente na conta de luz', value: emprestimoContaLuz } : null,
      anchor ? { label: anchor.label, value: brl(anchorNumber) } : null,
    ].filter(Boolean) as Array<{ label: string; value: string }>;

    const whatsappUrl = buildAtendimentoUrl({
      product,
      simulation,
      lead: { nome: nome.trim(), telefone, email: email.trim(), cpf, nascimento },
      answers,
      distribuidora: isLuz ? distribuidora : undefined,
    });

    await deliverLead(whatsappUrl, {
      nome,
      whatsapp: telefone,
      email,
      cpf,
      nascimento,
      ...productQualification.fields,
      cep: isClt ? cep : undefined,
      endereco: isClt ? endereco : undefined,
      tempoCarteira: isClt ? tempoCarteira : undefined,
      vinculo: choice,
      salarioLiquido: anchorNumber,
      valorDesejado: simulation.requested,
      prazoMeses: simulation.months,
      parcelaEstimada: simulation.installment,
      totalEstimado: simulation.totalPaid,
      iofEstimado: simulation.iof,
      cetAnual: simulation.cetAnnual,
      cetMensal: simulation.cetMonthly,
      distribuidora: isLuz ? distribuidora : undefined,
      emprestimo_conta_luz: isLuz ? emprestimoContaLuz : undefined,
    });
  }

  return (
    <div
      className="double-bezel"
      onFocusCapture={() => trackFormStart({ formName, product })}
    >
      <div className="double-bezel-inner p-6 sm:p-8">
        <div className="flex items-start gap-3 rounded-xl bg-brand-50 p-4 text-sm leading-relaxed text-slate-700">
          <Info size={22} weight="duotone" className="shrink-0 text-brand-650" aria-hidden="true" />
          <p>
            {isSimulable
              ? 'Preencha seus dados e monte a estimativa no mesmo formulário.'
              : 'Preencha seus dados para continuar o atendimento desta modalidade.'}
          </p>
        </div>

        <div className="mt-6" aria-label={`Etapa ${step} de 2`}>
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="font-mono text-xs font-extrabold uppercase tracking-[0.14em] text-brand-650">
                Etapa {step} de 2
              </p>
              <h3 className="mt-1 text-xl font-extrabold text-slate-950">
                {step === 1 ? 'Seus dados' : isSimulable ? 'Qualificação e simulação' : 'Qualificação'}
              </h3>
            </div>
            <span className="text-sm font-bold text-slate-500">{step === 1 ? '50%' : '100%'}</span>
          </div>
          <div className="mt-3 grid grid-cols-2 gap-2" aria-hidden="true">
            <span className="h-1.5 rounded-full bg-brand-600" />
            <span className={`h-1.5 rounded-full ${step === 2 ? 'bg-brand-600' : 'bg-slate-200'}`} />
          </div>
        </div>

        {step === 1 ? (
          <>
            <div className="mt-6 grid gap-4 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <label htmlFor={`lf-nome-${product}`} className="text-sm font-extrabold text-slate-900">
              Nome completo
            </label>
            <input
              id={`lf-nome-${product}`}
              type="text"
              autoComplete="name"
              placeholder="Como podemos chamar você?"
              value={nome}
              onChange={(event) => {
                setNome(event.target.value);
                setError('');
              }}
              className="mt-2 flex min-h-12 w-full rounded-xl border border-slate-200 bg-white px-4 font-semibold text-slate-700 focus:ring-4 focus:ring-brand-100"
            />
          </div>
          <div>
            <label htmlFor={`lf-telefone-${product}`} className="text-sm font-extrabold text-slate-900">
              Telefone / WhatsApp
            </label>
            <input
              id={`lf-telefone-${product}`}
              type="tel"
              inputMode="tel"
              autoComplete="tel"
              placeholder="(11) 99999-9999"
              value={telefone}
              onChange={(event) => {
                setTelefone(formatBrazilianPhone(event.target.value));
                setError('');
              }}
              className="mt-2 flex min-h-12 w-full rounded-xl border border-slate-200 bg-white px-4 font-semibold text-slate-700 focus:ring-4 focus:ring-brand-100"
            />
          </div>
          <div>
            <label htmlFor={`lf-email-${product}`} className="text-sm font-extrabold text-slate-900">
              E-mail
            </label>
            <input
              id={`lf-email-${product}`}
              type="email"
              inputMode="email"
              autoComplete="email"
              placeholder="voce@email.com"
              value={email}
              onChange={(event) => {
                setEmail(event.target.value);
                setError('');
              }}
              className="mt-2 flex min-h-12 w-full rounded-xl border border-slate-200 bg-white px-4 font-semibold text-slate-700 focus:ring-4 focus:ring-brand-100"
            />
          </div>
            </div>

            {error ? (
              <p role="alert" className="mt-4 font-semibold text-red-655">
                {error}
              </p>
            ) : null}

            <button
              type="button"
              onClick={continueToQualification}
              className="mt-6 flex min-h-14 w-full items-center justify-center gap-2 rounded-2xl bg-brand-600 px-6 font-extrabold text-white transition hover:bg-brand-700 active:scale-[0.98]"
            >
              Continuar para a etapa 2
              <ArrowRight weight="bold" aria-hidden="true" />
            </button>
          </>
        ) : (
          <>
            <div className="mt-6 grid gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor={`lf-cpf-${product}`} className="text-sm font-extrabold text-slate-900">
              CPF
            </label>
            <input
              id={`lf-cpf-${product}`}
              type="text"
              inputMode="numeric"
              autoComplete="off"
              placeholder="000.000.000-00"
              value={cpf}
              onChange={(event) => {
                setCpf(formatCpf(event.target.value));
                setError('');
              }}
              className="mt-2 flex min-h-12 w-full rounded-xl border border-slate-200 bg-white px-4 font-semibold text-slate-700 focus:ring-4 focus:ring-brand-100"
            />
            {cpf.length === 14 && isValidCpf(cpf) ? (
              <p className="mt-2 text-sm font-bold text-emerald-600">CPF válido</p>
            ) : null}
          </div>
          <div>
            <label htmlFor={`lf-nascimento-${product}`} className="text-sm font-extrabold text-slate-900">
              Data de nascimento
            </label>
            <input
              id={`lf-nascimento-${product}`}
              type="date"
              autoComplete="bday"
              min={BIRTH_DATE_BOUNDS.min}
              max={BIRTH_DATE_BOUNDS.max}
              value={nascimento}
              onChange={(event) => {
                setNascimento(event.target.value);
                setError('');
              }}
              onInput={(event) => {
                setNascimento(event.currentTarget.value);
                setError('');
              }}
              className="mt-2 flex min-h-12 w-full rounded-xl border border-slate-200 bg-white px-4 font-semibold text-slate-700 focus:ring-4 focus:ring-brand-100"
            />
          </div>
            </div>
            {isLuz ? (
              <div className="mt-6">
                <label htmlFor="lf-classificacao-luz" className="text-lg font-extrabold text-slate-900">
                  {content.question}
                </label>
                <select
                  id="lf-classificacao-luz"
                  value={choice}
                  onChange={(event) => {
                    setChoice(event.target.value);
                    setError('');
                  }}
                  className="mt-3 flex min-h-12 w-full cursor-pointer rounded-xl border border-slate-200 bg-white px-4 font-semibold text-slate-700 focus:ring-4 focus:ring-brand-100"
                >
                  <option value="">Selecione uma classificação</option>
                  {content.options.map((option) => (
                    <option key={option} value={option}>{option}</option>
                  ))}
                </select>
              </div>
            ) : (
              <fieldset className="mt-6">
                <legend className="text-lg font-extrabold text-slate-900">{content.question}</legend>
                <div className="mt-4 grid gap-3">
                  {content.options.map((option, index) => (
                    <label
                      key={option}
                      className="flex min-h-12 cursor-pointer items-center gap-3 rounded-xl border border-slate-200 bg-white px-4 font-semibold text-slate-700 focus-within:ring-4 focus-within:ring-brand-100"
                    >
                      <input
                        id={index === 0 ? `lf-choice-${product}` : undefined}
                        type="radio"
                        className="h-5 w-5 shrink-0 accent-brand-600"
                        name={`${product}-scenario`}
                        value={option}
                        checked={choice === option}
                        onChange={(event) => {
                          setChoice(event.target.value);
                          setError('');
                        }}
                      />
                      {option}
                    </label>
                  ))}
                </div>
              </fieldset>
            )}

        {isClt ? (
          <div className="mt-6 grid gap-6 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <label htmlFor="lf-cep-clt" className="text-lg font-extrabold text-slate-900">
                CEP
              </label>
              <input
                id="lf-cep-clt"
                type="text"
                inputMode="numeric"
                autoComplete="postal-code"
                placeholder="00000-000"
                maxLength={9}
                value={cep}
                onChange={(event) => {
                  setCep(formatBrazilianCep(event.target.value));
                  setError('');
                }}
                required
                className="mt-3 flex min-h-12 w-full rounded-xl border border-slate-200 bg-white px-4 font-semibold text-slate-700 focus:ring-4 focus:ring-brand-100"
              />
            </div>

            <div className="sm:col-span-2">
              <label htmlFor="lf-endereco-clt" className="text-lg font-extrabold text-slate-900">
                Endereço completo
              </label>
              <input
                id="lf-endereco-clt"
                type="text"
                autoComplete="street-address"
                placeholder="Rua, número, bairro, cidade/UF"
                value={endereco}
                onChange={(event) => {
                  setEndereco(event.target.value);
                  setError('');
                }}
                required
                className="mt-3 flex min-h-12 w-full rounded-xl border border-slate-200 bg-white px-4 font-semibold text-slate-700 focus:ring-4 focus:ring-brand-100"
              />
            </div>

            <div className="sm:col-span-2">
              <label htmlFor="lf-tempo-carteira-clt" className="text-lg font-extrabold text-slate-900">
                Tempo de registro em carteira
              </label>
              <select
                id="lf-tempo-carteira-clt"
                value={tempoCarteira}
                onChange={(event) => {
                  setTempoCarteira(event.target.value);
                  setError('');
                }}
                className="mt-3 flex min-h-12 w-full cursor-pointer rounded-xl border border-slate-200 bg-white px-4 font-semibold text-slate-700 focus:ring-4 focus:ring-brand-100"
              >
                <option value="">Selecione uma opção</option>
                {TEMPOS_CARTEIRA.map((tempo) => (
                  <option key={tempo} value={tempo}>{tempo}</option>
                ))}
              </select>
            </div>
          </div>
        ) : null}

        {isCarta ? (
          <div className="mt-6">
            <label htmlFor="lf-area-carta" className="text-lg font-extrabold text-slate-900">
              Qual é a área da carta?
            </label>
            <select
              id="lf-area-carta"
              value={areaCarta}
              onChange={(event) => {
                setAreaCarta(event.target.value);
                setError('');
              }}
              className="mt-3 flex min-h-12 w-full cursor-pointer rounded-xl border border-slate-200 bg-white px-4 font-semibold text-slate-700 focus:ring-4 focus:ring-brand-100"
            >
              <option value="">Selecione a área da carta</option>
              {AREAS_CARTA.map((area) => (
                <option key={area} value={area}>
                  {area}
                </option>
              ))}
            </select>
            <p className="mt-2 text-sm text-slate-500">
              {choice === 'Vender a minha carta contemplada'
                ? 'A área ajuda a equipe a encontrar quem procura uma carta como a sua.'
                : 'Cada área tem cartas com valores e regras de transferência diferentes.'}
            </p>
          </div>
        ) : null}

        {isLuz ? (
          <div className="mt-6 grid gap-6">
            <div>
              <label htmlFor="lf-cep-luz" className="text-lg font-extrabold text-slate-900">
                CEP
              </label>
              <input
                id="lf-cep-luz"
                type="text"
                inputMode="numeric"
                autoComplete="postal-code"
                placeholder="00000-000"
                maxLength={9}
                value={cep}
                onChange={(event) => {
                  setCep(formatBrazilianCep(event.target.value));
                  setError('');
                }}
                required
                className="mt-3 flex min-h-12 w-full rounded-xl border border-slate-200 bg-white px-4 font-semibold text-slate-700 focus:ring-4 focus:ring-brand-100"
              />
            </div>

            <div>
              <label htmlFor="lf-distribuidora" className="text-lg font-extrabold text-slate-900">
                Companhia de energia
              </label>
              <select
                id="lf-distribuidora"
                value={distribuidora}
                onChange={(event) => {
                  setDistribuidora(event.target.value);
                  setError('');
                }}
                className="mt-3 flex min-h-12 w-full cursor-pointer rounded-xl border border-slate-200 bg-white px-4 font-semibold text-slate-700 focus:ring-4 focus:ring-brand-100"
              >
                <option value="">Selecione sua companhia</option>
                {COMPANHIAS_LUZ.map((companhia) => (
                  <option key={companhia} value={companhia}>{companhia}</option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="lf-emprestimo-luz" className="text-lg font-extrabold text-slate-900">
                Fez empréstimo na conta de luz recentemente?
              </label>
              <select
                id="lf-emprestimo-luz"
                value={emprestimoContaLuz}
                onChange={(event) => {
                  setEmprestimoContaLuz(event.target.value);
                  setError('');
                }}
                className="mt-3 flex min-h-12 w-full cursor-pointer rounded-xl border border-slate-200 bg-white px-4 font-semibold text-slate-700 focus:ring-4 focus:ring-brand-100"
              >
                <option value="">Selecione uma resposta</option>
                <option value="Não">Não</option>
                <option value="Sim">Sim</option>
              </select>
            </div>

            {distribuidoraBloqueada || emprestimoLuzBloqueado ? (
              <div className="mt-4 flex items-start gap-3 rounded-xl bg-red-50 p-4 text-sm leading-relaxed text-red-700" role="alert">
                <XCircle size={22} weight="duotone" className="mt-0.5 shrink-0" aria-hidden="true" />
                <p>
                  {distribuidoraBloqueada
                    ? 'A companhia informada não está entre as atendidas nesta modalidade.'
                    : 'Quem já contratou empréstimo na conta de luz recentemente não pode seguir com uma nova simulação agora.'}
                </p>
              </div>
            ) : null}
          </div>
        ) : null}

        {isSiape && !bloqueado ? (
          <div className="mt-6 grid gap-6">
            <div>
              <label htmlFor="lf-orgao-siape" className="text-lg font-extrabold text-slate-900">Órgão ou convênio</label>
              <input
                id="lf-orgao-siape"
                type="text"
                placeholder="Ex.: Federal/SIAPE, estado, prefeitura ou tribunal"
                value={orgaoConvenio}
                onChange={(event) => { setOrgaoConvenio(event.target.value); setError(''); }}
                className="mt-3 flex min-h-12 w-full rounded-xl border border-slate-200 bg-white px-4 font-semibold text-slate-700 focus:ring-4 focus:ring-brand-100"
              />
            </div>
            <div>
              <label htmlFor="lf-situacao-siape" className="text-lg font-extrabold text-slate-900">Situação atual no órgão</label>
              <select
                id="lf-situacao-siape"
                value={situacaoOrgao}
                onChange={(event) => { setSituacaoOrgao(event.target.value); setError(''); }}
                className="mt-3 flex min-h-12 w-full cursor-pointer rounded-xl border border-slate-200 bg-white px-4 font-semibold text-slate-700 focus:ring-4 focus:ring-brand-100"
              >
                <option value="">Selecione sua situação</option>
                <option value="Ativo">Ativo</option>
                <option value="Aposentado">Aposentado</option>
                <option value="Pensionista">Pensionista</option>
              </select>
            </div>
            <div>
              <label htmlFor="lf-margem-siape" className="text-lg font-extrabold text-slate-900">Margem disponível para novos empréstimos</label>
              <input
                id="lf-margem-siape"
                inputMode="numeric"
                placeholder="Digite apenas números ou 0 se não souber"
                value={margemDisponivel}
                onChange={(event) => { setMargemDisponivel(onlyDigits(event.target.value)); setError(''); }}
                className="mt-3 flex min-h-12 w-full rounded-xl border border-slate-200 bg-white px-4 font-semibold text-slate-700 focus:ring-4 focus:ring-brand-100"
              />
            </div>
          </div>
        ) : null}

        {isBpc && !bloqueado ? (
          <div className="mt-6 grid gap-6">
            <div>
              <label htmlFor="lf-relacao-bpc" className="text-lg font-extrabold text-slate-900">Você é titular ou representante?</label>
              <select
                id="lf-relacao-bpc"
                value={relacaoBeneficio}
                onChange={(event) => { setRelacaoBeneficio(event.target.value); setError(''); }}
                className="mt-3 flex min-h-12 w-full cursor-pointer rounded-xl border border-slate-200 bg-white px-4 font-semibold text-slate-700 focus:ring-4 focus:ring-brand-100"
              >
                <option value="">Selecione uma opção</option>
                <option value="Titular">Titular</option>
                <option value="Representante">Representante</option>
              </select>
            </div>
            <div>
              <label htmlFor="lf-ativo-bpc" className="text-lg font-extrabold text-slate-900">O benefício está ativo e sendo pago todo mês?</label>
              <select
                id="lf-ativo-bpc"
                value={beneficioAtivo}
                onChange={(event) => { setBeneficioAtivo(event.target.value); setError(''); }}
                className="mt-3 flex min-h-12 w-full cursor-pointer rounded-xl border border-slate-200 bg-white px-4 font-semibold text-slate-700 focus:ring-4 focus:ring-brand-100"
              >
                <option value="">Selecione uma resposta</option>
                <option value="Sim">Sim</option>
                <option value="Não">Não</option>
              </select>
            </div>
            <div>
              <label htmlFor="lf-banco-bpc" className="text-lg font-extrabold text-slate-900">Banco em que recebe o benefício</label>
              <input
                id="lf-banco-bpc"
                type="text"
                placeholder="Ex.: Caixa, Mercantil, Itaú ou Bradesco"
                value={bancoBeneficio}
                onChange={(event) => { setBancoBeneficio(event.target.value); setError(''); }}
                className="mt-3 flex min-h-12 w-full rounded-xl border border-slate-200 bg-white px-4 font-semibold text-slate-700 focus:ring-4 focus:ring-brand-100"
              />
            </div>
          </div>
        ) : null}

        {isFinanciamento ? (
          <div className="mt-6 grid gap-6 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <label htmlFor="lf-cidade-financiamento" className="text-lg font-extrabold text-slate-900">Cidade e estado do imóvel</label>
              <input
                id="lf-cidade-financiamento"
                type="text"
                autoComplete="address-level2"
                placeholder="Ex.: Campinas/SP"
                value={cidadeEstado}
                onChange={(event) => { setCidadeEstado(event.target.value); setError(''); }}
                className="mt-3 flex min-h-12 w-full rounded-xl border border-slate-200 bg-white px-4 font-semibold text-slate-700 focus:ring-4 focus:ring-brand-100"
              />
            </div>
            <div>
              <label htmlFor="lf-valor-imovel" className="text-lg font-extrabold text-slate-900">Valor aproximado do imóvel</label>
              <input
                id="lf-valor-imovel"
                inputMode="numeric"
                placeholder="Digite apenas números"
                value={valorImovel}
                onChange={(event) => { setValorImovel(onlyDigits(event.target.value)); setError(''); }}
                className="mt-3 flex min-h-12 w-full rounded-xl border border-slate-200 bg-white px-4 font-semibold text-slate-700 focus:ring-4 focus:ring-brand-100"
              />
            </div>
            <div>
              <label htmlFor="lf-entrada-imovel" className="text-lg font-extrabold text-slate-900">Entrada disponível</label>
              <input
                id="lf-entrada-imovel"
                inputMode="numeric"
                placeholder="Digite 0 se ainda não tiver entrada"
                value={entradaImovel}
                onChange={(event) => { setEntradaImovel(onlyDigits(event.target.value)); setError(''); }}
                className="mt-3 flex min-h-12 w-full rounded-xl border border-slate-200 bg-white px-4 font-semibold text-slate-700 focus:ring-4 focus:ring-brand-100"
              />
            </div>
            <div>
              <label htmlFor="lf-renda-financiamento" className="text-lg font-extrabold text-slate-900">Renda familiar mensal</label>
              <input
                id="lf-renda-financiamento"
                inputMode="numeric"
                placeholder="Digite apenas números"
                value={rendaMensal}
                onChange={(event) => { setRendaMensal(onlyDigits(event.target.value)); setError(''); }}
                className="mt-3 flex min-h-12 w-full rounded-xl border border-slate-200 bg-white px-4 font-semibold text-slate-700 focus:ring-4 focus:ring-brand-100"
              />
            </div>
            <div>
              <label htmlFor="lf-fgts-financiamento" className="text-lg font-extrabold text-slate-900">Pretende usar o FGTS?</label>
              <select
                id="lf-fgts-financiamento"
                value={usoFgts}
                onChange={(event) => { setUsoFgts(event.target.value); setError(''); }}
                className="mt-3 flex min-h-12 w-full cursor-pointer rounded-xl border border-slate-200 bg-white px-4 font-semibold text-slate-700 focus:ring-4 focus:ring-brand-100"
              >
                <option value="">Selecione uma resposta</option>
                <option value="Sim">Sim</option>
                <option value="Não">Não</option>
                <option value="Ainda não sei">Ainda não sei</option>
              </select>
            </div>
          </div>
        ) : null}

        {isPessoal ? (
          <div className="mt-6 grid gap-6 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <label htmlFor="lf-estado-civil-pessoal" className="text-lg font-extrabold text-slate-900">Estado civil</label>
              <select
                id="lf-estado-civil-pessoal"
                value={estadoCivil}
                onChange={(event) => { setEstadoCivil(event.target.value); setError(''); }}
                required
                className="mt-3 flex min-h-12 w-full cursor-pointer rounded-xl border border-slate-200 bg-white px-4 font-semibold text-slate-700 focus:ring-4 focus:ring-brand-100"
              >
                <option value="">Selecione seu estado civil</option>
                {ESTADO_CIVIL_OPTIONS.map((option) => (
                  <option key={option} value={option}>{option}</option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="lf-renda-pessoal" className="text-lg font-extrabold text-slate-900">Renda líquida mensal</label>
              <input
                id="lf-renda-pessoal"
                inputMode="numeric"
                placeholder="Digite apenas números"
                value={rendaMensal}
                onChange={(event) => { setRendaMensal(onlyDigits(event.target.value)); setError(''); }}
                className="mt-3 flex min-h-12 w-full rounded-xl border border-slate-200 bg-white px-4 font-semibold text-slate-700 focus:ring-4 focus:ring-brand-100"
              />
            </div>
            <div>
              <label htmlFor="lf-comprovacao-pessoal" className="text-lg font-extrabold text-slate-900">Consegue comprovar renda?</label>
              <select
                id="lf-comprovacao-pessoal"
                value={comprovacaoRenda}
                onChange={(event) => { setComprovacaoRenda(event.target.value); setError(''); }}
                className="mt-3 flex min-h-12 w-full cursor-pointer rounded-xl border border-slate-200 bg-white px-4 font-semibold text-slate-700 focus:ring-4 focus:ring-brand-100"
              >
                <option value="">Selecione uma resposta</option>
                <option value="Sim">Sim</option>
                <option value="Não">Não</option>
                <option value="Não sei quais documentos servem">Não sei quais documentos servem</option>
              </select>
            </div>
            <div>
              <label htmlFor="lf-finalidade-pessoal" className="text-lg font-extrabold text-slate-900">Para que você precisa do crédito?</label>
              <select
                id="lf-finalidade-pessoal"
                value={finalidadeCredito}
                onChange={(event) => { setFinalidadeCredito(event.target.value); setError(''); }}
                className="mt-3 flex min-h-12 w-full cursor-pointer rounded-xl border border-slate-200 bg-white px-4 font-semibold text-slate-700 focus:ring-4 focus:ring-brand-100"
              >
                <option value="">Selecione uma finalidade</option>
                <option value="Organizar contas">Organizar contas</option>
                <option value="Realizar um projeto">Realizar um projeto</option>
                <option value="Cobrir um imprevisto">Cobrir um imprevisto</option>
                <option value="Outra finalidade">Outra finalidade</option>
              </select>
            </div>
            <div>
              <label htmlFor="lf-parcela-pessoal" className="text-lg font-extrabold text-slate-900">Parcela que cabe no orçamento</label>
              <input
                id="lf-parcela-pessoal"
                inputMode="numeric"
                placeholder="Digite apenas números"
                value={parcelaPossivel}
                onChange={(event) => { setParcelaPossivel(onlyDigits(event.target.value)); setError(''); }}
                className="mt-3 flex min-h-12 w-full rounded-xl border border-slate-200 bg-white px-4 font-semibold text-slate-700 focus:ring-4 focus:ring-brand-100"
              />
            </div>
          </div>
        ) : null}

        {(isSiape || isBpc) && !bloqueado ? (
          <div className="mt-6 grid gap-6">
            <div>
              <label htmlFor={`lf-requested-${product}`} className="text-lg font-extrabold text-slate-900">Valor aproximado que deseja liberar</label>
              <input
                id={`lf-requested-${product}`}
                inputMode="numeric"
                placeholder="Digite apenas números"
                value={requested}
                onChange={(event) => { setRequested(onlyDigits(event.target.value)); setError(''); }}
                className="mt-3 flex min-h-12 w-full rounded-xl border border-slate-200 bg-white px-4 font-semibold text-slate-700 focus:ring-4 focus:ring-brand-100"
              />
            </div>
            <div>
              <label htmlFor={`lf-urgencia-${product}`} className="text-lg font-extrabold text-slate-900">Urgência para ter o crédito liberado</label>
              <select
                id={`lf-urgencia-${product}`}
                value={urgencia}
                onChange={(event) => { setUrgencia(event.target.value); setError(''); }}
                className="mt-3 flex min-h-12 w-full cursor-pointer rounded-xl border border-slate-200 bg-white px-4 font-semibold text-slate-700 focus:ring-4 focus:ring-brand-100"
              >
                <option value="">Selecione uma opção</option>
                <option value="Imediato">Imediato</option>
                <option value="Em até 3 meses">Em até 3 meses</option>
                <option value="Apenas planejando">Apenas planejando</option>
              </select>
            </div>
          </div>
        ) : null}

        {(isFinanciamento || isPessoal) ? (
          <div className="mt-6">
            <label htmlFor={`lf-urgencia-${product}`} className="text-lg font-extrabold text-slate-900">Quando pretende contratar?</label>
            <select
              id={`lf-urgencia-${product}`}
              value={urgencia}
              onChange={(event) => { setUrgencia(event.target.value); setError(''); }}
              className="mt-3 flex min-h-12 w-full cursor-pointer rounded-xl border border-slate-200 bg-white px-4 font-semibold text-slate-700 focus:ring-4 focus:ring-brand-100"
            >
              <option value="">Selecione uma opção</option>
              <option value="O quanto antes">O quanto antes</option>
              <option value="Nos próximos 3 meses">Nos próximos 3 meses</option>
              <option value="Entre 3 e 12 meses">Entre 3 e 12 meses</option>
              <option value="Ainda estou planejando">Ainda estou planejando</option>
            </select>
          </div>
        ) : null}

        {caixaTemBloqueada ? (
          <div className="mt-6 flex items-start gap-3 rounded-xl bg-red-50 p-4 text-sm leading-relaxed text-red-700" role="alert">
            <XCircle size={22} weight="duotone" className="mt-0.5 shrink-0" aria-hidden="true" />
            <p>
              Esta modalidade exige que o benefício seja recebido na conta do Caixa Tem, então não é possível
              seguir por aqui. Se você passar a receber por lá, é só voltar e continuar.
            </p>
          </div>
        ) : null}

        {modalidadeNaoElegivel ? (
          <div className="mt-6 flex items-start gap-3 rounded-xl bg-red-50 p-4 text-sm leading-relaxed text-red-700" role="alert">
            <XCircle size={22} weight="duotone" className="mt-0.5 shrink-0" aria-hidden="true" />
            <p>
              {isSiape
                ? 'Esta modalidade é destinada a servidores públicos. A equipe pode orientar você sobre outras opções disponíveis.'
                : 'Esta modalidade é destinada a quem recebe o benefício BPC/LOAS. A equipe pode orientar você sobre outras opções disponíveis.'}
            </p>
          </div>
        ) : null}

        {anchor && !bloqueado ? (
          <div className="mt-6">
            <label htmlFor="lf-anchor" className="text-lg font-extrabold text-slate-900">
              {anchor.label}
            </label>
            <input
              id="lf-anchor"
              inputMode="numeric"
              placeholder="Digite apenas números"
              value={anchorValue}
              onChange={(event) => {
                setAnchorValue(onlyDigits(event.target.value));
                setError('');
              }}
              onBlur={() => {
                if (!requested && maximumRequested) {
                  setRequested(String(Math.floor(maximumRequested)));
                }
              }}
              className="mt-3 flex min-h-12 w-full rounded-xl border border-slate-200 bg-white px-4 font-semibold text-slate-700 focus:ring-4 focus:ring-brand-100"
            />
            <p className="mt-2 text-sm text-slate-500">{anchor.hint}</p>
          </div>
        ) : null}

        {isSimulable && !bloqueado ? (
          <>
            <div className="mt-6">
              <label htmlFor="lf-requested" className="text-lg font-extrabold text-slate-900">
                Quanto você precisa levantar?
              </label>
              <input
                id="lf-requested"
                inputMode="numeric"
                placeholder="Digite apenas números"
                value={requested}
                onChange={(event) => {
                  setRequested(onlyDigits(event.target.value));
                  setError('');
                }}
                className="mt-3 flex min-h-12 w-full rounded-xl border border-slate-200 bg-white px-4 font-semibold text-slate-700 focus:ring-4 focus:ring-brand-100"
              />
              {maximumRequested ? (
                <p className="mt-2 text-sm font-semibold text-brand-700">
                  Referência pelos dados acima: até {brl(maximumRequested)}.
                </p>
              ) : null}
            </div>

            <div className="mt-6">
              <label htmlFor="lf-months" className="text-lg font-extrabold text-slate-900">
                Em quantas parcelas?
              </label>
              <select
                id="lf-months"
                value={months}
                onChange={(event) => {
                  setMonths(event.target.value);
                  setError('');
                }}
                className="mt-3 flex min-h-12 w-full cursor-pointer rounded-xl border border-slate-200 bg-white px-4 font-semibold text-slate-700 focus:ring-4 focus:ring-brand-100"
              >
                {rates?.terms.map((term) => (
                  <option key={term} value={term}>
                    {term} meses
                  </option>
                ))}
              </select>
            </div>
          </>
        ) : null}

        {isSimulable && !bloqueado && simulation ? (
          <section
            className="mt-6 overflow-hidden rounded-3xl bg-slate-950 text-white shadow-[0_22px_55px_rgba(15,23,42,0.18)]"
            aria-labelledby={`lf-preview-title-${product}`}
            aria-live="polite"
          >
            <div className="flex items-start justify-between gap-4 border-b border-white/10 px-5 py-5 sm:px-6">
              <div>
                <p className="font-mono text-xs font-bold uppercase tracking-[0.14em] text-brand-400">
                  Simulação atual
                </p>
                <h3 id={`lf-preview-title-${product}`} className="mt-1 text-xl font-extrabold tracking-tight">
                  Veja o cenário enquanto preenche
                </h3>
              </div>
              <span className="shrink-0 rounded-xl border border-white/10 bg-white/5 px-3 py-2 font-mono text-xs font-bold text-white/75">
                {simulation.months}x
              </span>
            </div>

            <dl className="grid grid-cols-2 gap-px bg-white/10">
              <div className="bg-slate-950 px-5 py-5 sm:px-6">
                <dt className="text-xs font-bold uppercase tracking-wide text-white/55">Valor solicitado</dt>
                <dd className="mt-2 font-mono text-lg font-bold tabular-nums text-white sm:text-xl">
                  {brl(simulation.requested)}
                </dd>
              </div>
              <div className="bg-slate-950 px-5 py-5 sm:px-6">
                <dt className="text-xs font-bold uppercase tracking-wide text-brand-400">Parcela estimada</dt>
                <dd className="mt-2 font-mono text-xl font-black tabular-nums text-brand-400 sm:text-2xl">
                  {brl(simulation.installment)}
                </dd>
              </div>
            </dl>

            <dl className="grid gap-3 px-5 py-5 text-sm sm:grid-cols-2 sm:px-6">
              <div className="flex items-baseline justify-between gap-3 sm:block">
                <dt className="text-white/55">Total estimado</dt>
                <dd className="font-mono font-bold tabular-nums text-white sm:mt-1">
                  {brl(simulation.totalPaid)}
                </dd>
              </div>
              <div className="flex items-baseline justify-between gap-3 sm:block">
                <dt className="text-white/55">IOF estimado</dt>
                <dd className="font-mono font-bold tabular-nums text-white sm:mt-1">
                  {brl(simulation.iof)}
                </dd>
              </div>
              <div className="flex items-baseline justify-between gap-3 sm:block">
                <dt className="text-white/55">CET estimado</dt>
                <dd className="font-mono font-bold tabular-nums text-white sm:mt-1">
                  {pct(simulation.cetAnnual)} a.a.
                </dd>
                <dd className="font-mono text-xs tabular-nums text-white/55 sm:mt-0.5">
                  {pct(simulation.cetMonthly)} a.m.
                </dd>
              </div>
            </dl>
          </section>
        ) : null}

        <label className="mt-6 flex cursor-pointer items-start gap-3 text-sm leading-relaxed text-slate-600">
          <input
            type="checkbox"
            checked={consent}
            onChange={(event) => {
              setConsent(event.target.checked);
              setError('');
            }}
            className="mt-0.5 h-5 w-5 shrink-0 accent-brand-600"
          />
          Concordo em enviar estas respostas à equipe da FiveCred
          {isSimulable ? ' e entendo que o resultado é uma estimativa.' : '.'}
        </label>

        {error ? (
          <p role="alert" className="mt-3 font-semibold text-red-655">
            {error}
          </p>
        ) : null}

            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              <button
                type="button"
                onClick={() => {
                  setError('');
                  setStep(1);
                }}
                className="flex min-h-14 w-full items-center justify-center rounded-2xl border border-brand-600 bg-brand-600 px-6 font-extrabold text-white transition hover:border-brand-700 hover:bg-brand-700 active:scale-[0.98]"
              >
                Voltar
              </button>
              <button
                type="button"
                onClick={continueToResult}
                disabled={bloqueado || submitting}
                className="flex min-h-14 w-full items-center justify-center gap-2 rounded-2xl bg-brand-600 px-6 font-extrabold text-white transition hover:bg-brand-700 active:scale-[0.98] disabled:cursor-not-allowed disabled:bg-slate-300"
              >
                {submitting ? 'Registrando dados...' : isSimulable ? 'Enviar simulação no WhatsApp' : 'Continuar no WhatsApp'}{' '}
                {isSimulable ? (
                  <WhatsappLogo size={21} weight="fill" aria-hidden="true" />
                ) : (
                  <ArrowRight weight="bold" aria-hidden="true" />
                )}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
