/**
 * Montagem dos dois canais de WhatsApp da FiveCred.
 *
 * QUALIFICATÓRIO (11 98079-7255): recebe exclusivamente quem clica para falar
 * direto. A descrição natural da modalidade permite que o BOT 00 pule a etapa
 * de escolha de produto.
 *
 * Os dados do mini formulário dos botões são enviados somente ao webhook. A
 * mensagem original do link direto não recebe PII nem é alterada.
 *
 * ATENDIMENTO (11 94008-3152): recebe todos que concluem qualquer formulário.
 * Quando houver cálculo, a mensagem também carrega a simulação.
 */

import { type SiteProduct } from "./fivecredFunnel.ts";
import { brl, pct, type SimulationResult } from "./creditMath.ts";
import { formatBirthDate, isValidBrazilianCep } from "./leadValidation.ts";

export const WHATSAPP_QUALIFICATORIO = "5511980797255";
export const WHATSAPP_ATENDIMENTO = "5511940083152";

export const whatsappRoutingProductNames: Record<SiteProduct, string> = {
  clt: "Consignado CLT",
  inss: "Consignado INSS",
  fgts: "Antecipação FGTS",
  veiculo: "Garantia de veículo",
  imovel: "Garantia de imóvel",
  luz: "Crédito na conta de luz",
  bolsa: "Bolsa Família",
  siape: "Servidor / SIAPE",
  bpc: "BPC / LOAS",
  agro: "Carta contemplada",
  financiamento: "Financiamento imobiliário",
  pessoal: "Empréstimo pessoal",
};

export const ESTADO_CIVIL_OPTIONS = [
  "Solteiro(a)",
  "Casado(a)",
  "União estável",
  "Divorciado(a)",
  "Viúvo(a)",
  "Outro",
] as const;

type ProductQualificationInput = {
  product: SiteProduct | "home";
  cep?: string;
  estadoCivil?: string;
};

type ProductQualificationResult =
  | {
      ok: true;
      answers: Array<{ label: string; value: string }>;
      fields: Record<string, string>;
    }
  | { ok: false; field: string; message: string };

export function prepareProductQualification({
  product,
  cep = "",
  estadoCivil = "",
}: ProductQualificationInput): ProductQualificationResult {
  if (product === "luz") {
    const normalizedCep = cep.trim();
    if (!isValidBrazilianCep(normalizedCep)) {
      return { ok: false, field: "cep", message: "Informe um CEP válido com 8 dígitos." };
    }
    return {
      ok: true,
      answers: [{ label: "CEP", value: normalizedCep }],
      fields: { cep: normalizedCep, cep_endereco: normalizedCep },
    };
  }

  if (product === "pessoal") {
    const normalizedEstadoCivil = estadoCivil.trim();
    if (!ESTADO_CIVIL_OPTIONS.includes(normalizedEstadoCivil as (typeof ESTADO_CIVIL_OPTIONS)[number])) {
      return { ok: false, field: "estado_civil", message: "Informe seu estado civil." };
    }
    return {
      ok: true,
      answers: [{ label: "Estado civil", value: normalizedEstadoCivil }],
      fields: { estado_civil: normalizedEstadoCivil },
    };
  }

  return { ok: true, answers: [], fields: {} };
}

const waLink = (number: string, message: string) =>
  `https://wa.me/${number}?text=${encodeURIComponent(message)}`;

export const pageContinuationMessages: Record<SiteProduct, string> = {
  clt: "Olá! Vim da página Consignado CLT da FiveCred e quero continuar meu atendimento pelo WhatsApp.",
  inss: "Olá! Vim da página Consignado INSS da FiveCred e quero continuar meu atendimento pelo WhatsApp.",
  fgts: "Olá! Vim da página Antecipação FGTS da FiveCred e quero verificar quanto posso antecipar.",
  veiculo: "Olá! Vim da página Garantia de veículo da FiveCred e quero continuar minha análise pelo WhatsApp.",
  imovel: "Olá! Vim da página Garantia de imóvel da FiveCred e quero continuar minha análise pelo WhatsApp.",
  luz: "Olá! Vim da página Crédito na conta de luz da FiveCred e quero continuar meu atendimento pelo WhatsApp.",
  bolsa: "Olá! Vim da página Bolsa Família da FiveCred e quero continuar meu atendimento pelo WhatsApp.",
  siape: "Olá! Vim da página Servidor SIAPE da FiveCred e quero consultar uma opção de crédito consignado.",
  bpc: "Olá! Vim da página BPC/LOAS da FiveCred e quero consultar uma opção de crédito para o meu benefício.",
  agro: "Olá! Vim da página Carta contemplada da FiveCred e quero falar sobre compra ou venda de carta.",
  financiamento: "Olá! Vim da página Financiamento imobiliário da FiveCred e quero consultar minhas opções.",
  pessoal: "Olá! Vim da página Empréstimo pessoal da FiveCred e quero consultar minhas opções.",
};

/**
 * Link para o WhatsApp qualificatório.
 *
 * O roteamento usa o nome natural da modalidade presente na mensagem; códigos técnicos
 * não são exibidos ao cliente.
 */
export function buildQualificatorioUrl(
  product?: SiteProduct,
  extraMessage?: string,
): string {
  if (!product) {
    const lines = [
      "Olá! Vim pelo site da FiveCred.",
      extraMessage,
    ].filter(Boolean);
    return waLink(WHATSAPP_QUALIFICATORIO, lines.join("\n"));
  }

  const lines = [
    pageContinuationMessages[product],
    extraMessage,
  ].filter((line) => line !== undefined);

  return waLink(WHATSAPP_QUALIFICATORIO, lines.join("\n"));
}

export type AtendimentoLeadPayload = {
  nome: string;
  telefone: string;
  email: string;
  cpf: string;
  nascimento: string;
  interesse: string;
  product?: SiteProduct;
  details?: string[];
};

/**
 * Link de formulário completo para o atendimento direto.
 * Mantém os dados informados pelo cliente visíveis na mensagem.
 */
export function buildAtendimentoLeadUrl({
  nome,
  telefone,
  email,
  cpf,
  nascimento,
  interesse,
  product,
  details = [],
}: AtendimentoLeadPayload): string {
  const productName = product ? whatsappRoutingProductNames[product] : interesse;
  const qualificationLines = details.map((detail) =>
    detail.startsWith("• ") ? detail : `• ${detail}`,
  );
  const lines = [
    "Olá! Fiz uma simulação no site da FiveCred.",
    "",
    // O BOT 00 continua encontrando o nome natural da modalidade nesta linha.
    `*Produto:* ${productName}`,
    "",
    "*Cliente*",
    `Nome: ${nome}`,
    `CPF: ${cpf}`,
    `Nascimento: ${formatBirthDate(nascimento)}`,
    `WhatsApp: ${telefone}`,
    `E-mail: ${email}`,
    qualificationLines.length ? "" : undefined,
    qualificationLines.length ? "*Informações*" : undefined,
    ...qualificationLines,
    "",
    "_A condição final depende da análise da instituição parceira._",
  ].filter((line) => line !== undefined);

  return waLink(WHATSAPP_ATENDIMENTO, lines.join("\n"));
}

export function buildAtendimentoMessageUrl(message: string): string {
  return waLink(WHATSAPP_ATENDIMENTO, message);
}

export function buildCltLocationAnswers({
  cep,
  endereco,
  tempoCarteira,
}: {
  cep: string;
  endereco: string;
  tempoCarteira: string;
}): Array<{ label: string; value: string }> {
  return [
    { label: "CEP", value: cep.trim() },
    { label: "Endereço", value: endereco.trim() },
    { label: "Tempo de registro em carteira", value: tempoCarteira },
  ];
}

export type AtendimentoPayload = {
  product: SiteProduct;
  simulation: SimulationResult;
  lead: {
    nome: string;
    telefone: string;
    email: string;
    cpf: string;
    nascimento: string;
  };
  /** Respostas qualitativas coletadas no formulário. */
  answers: Array<{ label: string; value: string }>;
  /** Distribuidora escolhida, quando o produto é conta de luz. */
  distribuidora?: string;
};

/**
 * Mensagem curta para o WhatsApp com identificação, qualificação e resumo da simulação.
 */
export function buildAtendimentoMessage({
  product,
  simulation,
  lead,
  answers,
  distribuidora,
}: AtendimentoPayload): string {
  const qualificationLines = answers.map(({ label, value }) => `• ${label}: ${value}`);
  if (distribuidora) {
    qualificationLines.push(`• Companhia: ${distribuidora}`);
  }

  return [
    "Olá! Fiz uma simulação no site da FiveCred.",
    "",
    `*Produto:* ${whatsappRoutingProductNames[product]}`,
    "",
    "*Cliente*",
    `Nome: ${lead.nome}`,
    `CPF: ${lead.cpf}`,
    `Nascimento: ${formatBirthDate(lead.nascimento)}`,
    `WhatsApp: ${lead.telefone}`,
    `E-mail: ${lead.email}`,
    qualificationLines.length ? "" : undefined,
    qualificationLines.length ? "*Informações*" : undefined,
    ...qualificationLines,
    "",
    "*Simulação*",
    `Valor solicitado: ${brl(simulation.requested)}`,
    `Prazo: ${simulation.months}x`,
    `*Parcela estimada: ${brl(simulation.installment)}*`,
    `Total estimado: ${brl(simulation.totalPaid)}`,
    `IOF estimado: ${brl(simulation.iof)}`,
    `CET estimado: ${pct(simulation.cetAnnual)} a.a. (${pct(simulation.cetMonthly)} a.m.)`,
    "",
    "_A condição final depende da análise da instituição parceira._",
  ]
    .filter((line) => line !== undefined)
    .join("\n");
}

export function buildAtendimentoUrl(payload: AtendimentoPayload): string {
  return waLink(WHATSAPP_ATENDIMENTO, buildAtendimentoMessage(payload));
}
