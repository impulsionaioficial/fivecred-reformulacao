/**
 * Motor de simulação de crédito da FiveCred.
 *
 * Todos os números produzidos aqui são ESTIMATIVAS baseadas em taxas de referência
 * declaradas em `referenceRates`. Não representam oferta, pré-aprovação ou proposta.
 * A instituição financeira responsável apresenta as condições reais antes da contratação.
 *
 * Metodologia:
 * - Amortização pela Tabela Price (parcelas fixas).
 * - IOF de crédito para pessoa física: alíquota adicional fixa + alíquota diária sobre
 *   a parcela de principal de cada prestação, limitada a 365 dias.
 * - CET calculado como a taxa interna de retorno mensal que iguala o valor líquido
 *   recebido pelo cliente ao fluxo de parcelas, anualizada por capitalização composta.
 */

import type { SiteProduct } from "./fivecredFunnel.ts";

/** Alíquota adicional fixa do IOF de crédito para pessoa física. */
export const IOF_ALIQUOTA_FIXA = 0.0038;
/** Alíquota diária do IOF de crédito para pessoa física. */
export const IOF_ALIQUOTA_DIARIA = 0.000082;
/** Limite legal de dias para incidência da alíquota diária. */
export const IOF_DIAS_MAXIMOS = 365;

export type RateConfig = {
  /** Taxa de juros mensal de referência, em fração (0.0149 = 1,49% a.m.). */
  monthlyRate: number;
  /** Prazo padrão em meses. */
  defaultTerm: number;
  /** Prazos oferecidos na simulação. */
  terms: number[];
  /** Texto curto que explica a origem do valor solicitado. */
  basis: string;
};

export type SimulableProduct = Exclude<
  SiteProduct,
  'siape' | 'bpc' | 'financiamento' | 'pessoal'
>;

/**
 * Taxas de referência por produto.
 *
 * IMPORTANTE: estes valores alimentam tudo que o cliente vê e a tabela enviada ao
 * WhatsApp de atendimento. Devem refletir a tabela comercial vigente acordada com as
 * instituições parceiras. Alterar aqui altera o site inteiro.
 */
export const referenceRates: Record<SimulableProduct, RateConfig> = {
  clt: {
    monthlyRate: 0.0185,
    defaultTerm: 84,
    terms: [24, 36, 48, 60, 72, 84],
    basis: "Margem consignável estimada de 30% do salário líquido.",
  },
  inss: {
    monthlyRate: 0.0185,
    defaultTerm: 84,
    terms: [24, 36, 48, 60, 72, 84],
    basis: "Margem consignável estimada de 30% do benefício.",
  },
  fgts: {
    monthlyRate: 0.0179,
    defaultTerm: 12,
    terms: [12, 24, 36, 48, 60],
    basis: "Antecipação de parcelas futuras do saque-aniversário.",
  },
  veiculo: {
    monthlyRate: 0.0149,
    defaultTerm: 48,
    terms: [24, 36, 48, 60],
    basis: "Crédito estimado em até 70% do valor FIPE do veículo.",
  },
  imovel: {
    monthlyRate: 0.0119,
    defaultTerm: 120,
    terms: [60, 84, 120, 180, 240],
    basis: "Crédito estimado em até 60% do valor de avaliação do imóvel.",
  },
  luz: {
    monthlyRate: 0.0219,
    defaultTerm: 24,
    terms: [12, 18, 24, 36],
    basis: "Crédito vinculado ao histórico da fatura de energia.",
  },
  bolsa: {
    monthlyRate: 0.0219,
    defaultTerm: 12,
    terms: [12, 18, 24],
    basis: "Crédito avaliado a partir do benefício recebido pelo Caixa Tem.",
  },
  agro: {
    monthlyRate: 0.0129,
    defaultTerm: 120,
    terms: [60, 84, 120, 180],
    basis: "Parcelas da carta contemplada após a transferência.",
  },
};

/**
 * Produtos em que uma estimativa por parcelas fixas representa a mecânica da
 * operação. FGTS usa saques anuais futuros e carta contemplada depende dos
 * componentes da cota; por isso, essas duas modalidades ficam fora do motor Price.
 */
export const SIMULABLE_PRODUCTS = [
  "clt",
  "inss",
  "veiculo",
  "imovel",
  "luz",
  "bolsa",
] as const satisfies readonly SiteProduct[];

export function isSimulableProduct(product: SiteProduct): boolean {
  return (SIMULABLE_PRODUCTS as readonly SiteProduct[]).includes(product);
}

/** Parcela pela Tabela Price. */
export function pmt(principal: number, monthlyRate: number, months: number): number {
  if (months <= 0) return 0;
  if (monthlyRate === 0) return principal / months;
  const factor = Math.pow(1 + monthlyRate, -months);
  return (principal * monthlyRate) / (1 - factor);
}

export type AmortizationRow = {
  month: number;
  payment: number;
  interest: number;
  principal: number;
  balance: number;
};

/** Tabela de amortização completa pela Price. */
export function amortizationSchedule(
  financed: number,
  monthlyRate: number,
  months: number,
): AmortizationRow[] {
  const installment = pmt(financed, monthlyRate, months);
  const rows: AmortizationRow[] = [];
  let balance = financed;

  for (let month = 1; month <= months; month += 1) {
    const interest = balance * monthlyRate;
    const principalPaid = installment - interest;
    balance = Math.max(0, balance - principalPaid);
    rows.push({
      month,
      payment: installment,
      interest,
      principal: principalPaid,
      balance,
    });
  }

  return rows;
}

/**
 * IOF de crédito estimado.
 *
 * A alíquota diária incide sobre a parcela de principal de cada prestação, considerando
 * os dias decorridos até o vencimento e respeitando o teto de 365 dias.
 */
export function estimateIOF(
  requested: number,
  monthlyRate: number,
  months: number,
): number {
  const fixed = requested * IOF_ALIQUOTA_FIXA;
  const schedule = amortizationSchedule(requested, monthlyRate, months);

  const daily = schedule.reduce((acc, row) => {
    const days = Math.min(row.month * 30, IOF_DIAS_MAXIMOS);
    return acc + row.principal * days * IOF_ALIQUOTA_DIARIA;
  }, 0);

  return fixed + daily;
}

/**
 * Taxa interna de retorno mensal do fluxo, por bisseção.
 * `received` é o que entra no bolso do cliente; `installment` x `months` é o que sai.
 */
export function monthlyIRR(
  received: number,
  installment: number,
  months: number,
): number {
  if (received <= 0 || installment <= 0 || months <= 0) return 0;

  const npv = (rate: number) => {
    let total = -received;
    for (let k = 1; k <= months; k += 1) {
      total += installment / Math.pow(1 + rate, k);
    }
    return total;
  };

  // O VPL é decrescente na taxa: positivo em 0 (paga-se mais do que se recebeu) e
  // negativo para taxas altas. A raiz é o CET.
  if (npv(0) <= 0) return 0;

  let low = 0;
  let high = 1; // 100% ao mês.
  while (npv(high) > 0 && high < 100) high *= 2;

  for (let i = 0; i < 200; i += 1) {
    const mid = (low + high) / 2;
    if (npv(mid) > 0) low = mid;
    else high = mid;
  }

  return (low + high) / 2;
}

export type SimulationInput = {
  product: SimulableProduct;
  /** Valor que o cliente quer receber. */
  requested: number;
  /** Prazo em meses. */
  months: number;
  /** Sobrescreve a taxa de referência, quando houver tabela específica. */
  monthlyRateOverride?: number;
};

export type SimulationResult = {
  product: SiteProduct;
  requested: number;
  months: number;
  monthlyRate: number;
  iof: number;
  financed: number;
  installment: number;
  totalPaid: number;
  totalInterest: number;
  cetMonthly: number;
  cetAnnual: number;
  schedule: AmortizationRow[];
  basis: string;
};

export function simulate({
  product,
  requested,
  months,
  monthlyRateOverride,
}: SimulationInput): SimulationResult {
  const config = referenceRates[product];
  const monthlyRate = monthlyRateOverride ?? config.monthlyRate;

  const iof = estimateIOF(requested, monthlyRate, months);
  const financed = requested + iof;
  const installment = pmt(financed, monthlyRate, months);
  const totalPaid = installment * months;
  const cetMonthly = monthlyIRR(requested, installment, months);

  return {
    product,
    requested,
    months,
    monthlyRate,
    iof,
    financed,
    installment,
    totalPaid,
    totalInterest: totalPaid - financed,
    cetMonthly,
    cetAnnual: Math.pow(1 + cetMonthly, 12) - 1,
    schedule: amortizationSchedule(financed, monthlyRate, months),
    basis: config.basis,
  };
}

/**
 * Limite indicativo derivado do dado âncora informado no formulário.
 * Em consignado, resolve por busca binária o valor cuja parcela cabe na margem
 * estimada de 30%. Em garantias, aplica o percentual de referência do bem.
 */
export function maxRequestedForAnchor(
  product: SimulableProduct,
  anchorValue: number,
  months: number,
): number | undefined {
  if (anchorValue <= 0 || months <= 0) return undefined;

  if (product === "veiculo") return anchorValue * 0.7;
  if (product === "imovel") return anchorValue * 0.6;

  if (product === "clt" || product === "inss") {
    const margin = anchorValue * 0.3;
    let low = 0;
    let high = margin * months;

    for (let iteration = 0; iteration < 80; iteration += 1) {
      const midpoint = (low + high) / 2;
      const installment = simulate({ product, requested: midpoint, months }).installment;
      if (installment <= margin) low = midpoint;
      else high = midpoint;
    }

    return low;
  }

  return undefined;
}

/** Compara todos os prazos disponíveis para o produto. */
export function simulateAllTerms(
  product: SimulableProduct,
  requested: number,
): SimulationResult[] {
  return referenceRates[product].terms.map((months) =>
    simulate({ product, requested, months }),
  );
}

export const brl = (value: number) =>
  new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);

export const pct = (value: number, digits = 2) =>
  `${(value * 100).toLocaleString("pt-BR", {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  })}%`;
