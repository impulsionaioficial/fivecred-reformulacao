/**
 * Mapa de integração entre o site FiveCred e os bots do amoCRM/Kommo.
 *
 * Fonte: exports "five cred|BOT 00", "five cred|Low Ticket" e "five cred|high ticket".
 * BOT 00 é o roteador de entrada (pipeline 13988063): pede consentimento LGPD, qualifica
 * ocupação/bens/restrição e transfere para o bot de Low Ticket ou High Ticket.
 *
 * `botMenuOption` é o número que o cliente digitaria no menu inicial do bot de destino.
 * O `handoffCode` é o token que o site injeta na mensagem do WhatsApp para que o BOT 00
 * possa pular direto para a etapa correta (requer o roteador descrito em
 * docs/integracao-chatbot-amocrm.md, seção "Roteador de entrada").
 */

export type SiteProduct =
  | "clt"
  | "inss"
  | "fgts"
  | "veiculo"
  | "imovel"
  | "luz"
  | "bolsa"
  | "siape"
  | "bpc"
  | "agro"
  | "financiamento"
  | "pessoal";

export type Funnel = "low" | "high";

export type FunnelEntry = {
  /**
   * Rótulo comercial do produto, usado em texto voltado ao cliente e no amoCRM.
   *
   * NÃO use este campo para montar a mensagem do WhatsApp: o roteamento do bot
   * casa por `contém` com o nome natural definido em `whatsappRoutingProductNames`
   * (app/lib/whatsapp.ts), e vários rótulos comerciais não contêm esse nome.
   */
  label: string;
  /** Funil comercial de destino. */
  funnel: Funnel;
  /** Opção do menu inicial do bot de destino. `null` = produto sem caminho no bot. */
  botMenuOption: number | null;
  /** Pipeline amoCRM correspondente ao funil. */
  pipelineId: number;
  /** Token legível por máquina injetado na mensagem do WhatsApp. */
  handoffCode: string;
  /**
   * Produto sem rota equivalente no bot hoje. O site não deve prometer continuidade
   * automática no WhatsApp enquanto isso não for criado pela equipe do chatbot.
   */
  botGap?: string;
};

export const PIPELINE_ENTRADA = 13988063;
export const PIPELINE_LOW_TICKET = 13988155;
export const PIPELINE_HIGH_TICKET = 13988151;

export const funnelMap: Record<SiteProduct, FunnelEntry> = {
  luz: {
    label: "Crédito na conta de luz",
    funnel: "low",
    botMenuOption: 1,
    pipelineId: PIPELINE_LOW_TICKET,
    handoffCode: "FC-LOW-LUZ",
  },
  inss: {
    label: "Consignado INSS / benefício",
    funnel: "low",
    botMenuOption: 2,
    pipelineId: PIPELINE_LOW_TICKET,
    handoffCode: "FC-LOW-INSS",
  },
  clt: {
    label: "Consignado CLT",
    funnel: "low",
    botMenuOption: 3,
    pipelineId: PIPELINE_LOW_TICKET,
    handoffCode: "FC-LOW-CLT",
  },
  siape: {
    label: "Crédito para servidor público / SIAPE",
    funnel: "low",
    botMenuOption: 4,
    pipelineId: PIPELINE_LOW_TICKET,
    handoffCode: "FC-LOW-SIAPE",
  },
  bpc: {
    label: "Crédito para beneficiário BPC/LOAS",
    funnel: "low",
    botMenuOption: 5,
    pipelineId: PIPELINE_LOW_TICKET,
    handoffCode: "FC-LOW-BPC",
  },
  bolsa: {
    label: "Crédito Bolsa Família",
    funnel: "low",
    botMenuOption: 6,
    pipelineId: PIPELINE_LOW_TICKET,
    handoffCode: "FC-LOW-BOLSA",
  },
  imovel: {
    label: "Empréstimo com garantia de imóvel (CGI)",
    funnel: "high",
    botMenuOption: 1,
    pipelineId: PIPELINE_HIGH_TICKET,
    handoffCode: "FC-HIGH-IMOVEL",
  },
  veiculo: {
    label: "Refinanciamento veicular",
    funnel: "high",
    botMenuOption: 2,
    pipelineId: PIPELINE_HIGH_TICKET,
    handoffCode: "FC-HIGH-VEICULO",
  },
  agro: {
    label: "Carta contemplada (compra e venda)",
    funnel: "high",
    botMenuOption: 4,
    pipelineId: PIPELINE_HIGH_TICKET,
    handoffCode: "FC-HIGH-CONTEMPLADA",
  },
  financiamento: {
    label: "Financiamento imobiliário",
    funnel: "high",
    botMenuOption: 5,
    pipelineId: PIPELINE_HIGH_TICKET,
    handoffCode: "FC-HIGH-FINANCIAMENTO",
  },
  pessoal: {
    label: "Empréstimo pessoal",
    funnel: "low",
    botMenuOption: null,
    pipelineId: PIPELINE_LOW_TICKET,
    handoffCode: "FC-LOW-PESSOAL",
    botGap:
      "O empréstimo pessoal ainda não possui uma opção equivalente nos menus exportados. O site envia a modalidade e os dados completos para qualificação humana.",
  },
  fgts: {
    label: "Antecipação do saque-aniversário FGTS",
    funnel: "low",
    botMenuOption: null,
    pipelineId: PIPELINE_LOW_TICKET,
    handoffCode: "FC-LOW-FGTS",
    botGap:
      "A Geovanna criará o fluxo automático de Antecipação FGTS. O site já envia a modalidade e os dados completos no padrão necessário para o novo roteamento.",
  },
};

/**
 * Concessionárias conveniadas para o crédito na conta de luz.
 *
 * O bot Low Ticket (etapa 33) agrupa por holding: 1-ENEL, 2-CPFL, 3-Neoenergia, 4-Outros.
 * O site pergunta a distribuidora específica — mais claro para o cliente — e converte
 * para o grupo do bot no momento do encaminhamento.
 */
export type Distribuidora = {
  label: string;
  /** Grupo correspondente no menu do bot Low Ticket. */
  grupo: "ENEL" | "CPFL" | "Neoenergia";
  /** Opção numérica no menu do bot. */
  botOption: 1 | 2 | 3;
};

export const distribuidoras: Distribuidora[] = [
  { label: "CPFL Paulista (SP)", grupo: "CPFL", botOption: 2 },
  { label: "CPFL Piratininga (SP)", grupo: "CPFL", botOption: 2 },
  { label: "CPFL Santa Cruz (MG/PR/SP)", grupo: "CPFL", botOption: 2 },
  { label: "RGE (RS)", grupo: "CPFL", botOption: 2 },
  { label: "RGE Sul (RS)", grupo: "CPFL", botOption: 2 },
  { label: "Enel RJ", grupo: "ENEL", botOption: 1 },
  { label: "Enel CE", grupo: "ENEL", botOption: 1 },
  { label: "Enel SP", grupo: "ENEL", botOption: 1 },
  { label: "Celpe (PE)", grupo: "Neoenergia", botOption: 3 },
  { label: "Coelba (BA)", grupo: "Neoenergia", botOption: 3 },
  { label: "Cosern (RN)", grupo: "Neoenergia", botOption: 3 },
  { label: "Elektro (SP/MS)", grupo: "Neoenergia", botOption: 3 },
];

export const DISTRIBUIDORA_FORA_DA_LISTA = "Minha distribuidora não está na lista";

/** Valor mínimo de fatura aceito pelo bot Low Ticket (etapa 35). */
export const LUZ_FATURA_MINIMA = 40;

/** Valor mínimo do benefício aceito pelo bot Low Ticket (etapa 776). */
export const BOLSA_BENEFICIO_MINIMO = 400;

export function findDistribuidora(label: string): Distribuidora | undefined {
  return distribuidoras.find((d) => d.label === label);
}

export function funnelFor(product: SiteProduct): FunnelEntry {
  return funnelMap[product];
}
