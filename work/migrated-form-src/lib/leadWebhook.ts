import { getAttribution, type AttributionData } from './attribution.ts';
import { readConsent } from './consent.ts';
import {
  getCustomerJourneySnapshot,
  getLeadAttributionFields,
  sanitizeMarketingUrl,
  sanitizeReferrer,
  type CustomerJourneySnapshot,
} from './customerJourney.ts';

export const LEAD_WEBHOOK_URL =
  'https://webhook.agenciaimpulsionai.com.br/webhook/b1ce8c0e-50cf-4810-b3fb-d64378ae0201';
export const LEAD_PAYLOAD_VERSION = 'fivecred.lead.v2';
const inFlightSubmissions = new Map<string, Promise<LeadWebhookResult>>();
const completedSubmissions = new Set<string>();

export type LeadFieldValue = string | number | boolean | null | string[];
export type LeadFields = Record<string, LeadFieldValue | undefined>;

export type LeadConsent = {
  accepted: boolean;
  source: 'form_checkbox' | 'form_submit_notice' | 'qa';
  policy_url?: string;
  marketing_status?: 'granted' | 'denied' | 'not_set';
};

export type LeadWebhookInput = {
  product: string;
  formName: string;
  stage: 'qualified' | 'completed';
  fields: LeadFields;
  consent: LeadConsent;
  eventId?: string;
  pagePath?: string;
  attribution?: AttributionData;
  referrer?: string;
  landingPage?: string;
  customerJourney?: CustomerJourneySnapshot;
  submittedAt?: Date;
  testMode?: boolean;
};

export type LeadWebhookPayload = Record<string, unknown> & {
  schema_version: typeof LEAD_PAYLOAD_VERSION;
  event_id: string;
  event_name: 'lead_submit';
  page_path: string;
  product: string;
  form_name: string;
  stage: LeadWebhookInput['stage'];
  timestamp: string;
  attribution: AttributionData & { referrer?: string; landing_page?: string };
  customer_journey?: CustomerJourneySnapshot;
  consent: LeadConsent;
  test_mode: boolean;
};

export type LeadWebhookResult = {
  status: number;
  deduplicated: boolean;
  eventId: string;
};

export class LeadWebhookError extends Error {
  readonly kind: 'http' | 'network';
  readonly status?: number;

  constructor(
    message: string,
    kind: 'http' | 'network',
    status?: number,
  ) {
    super(message);
    this.name = 'LeadWebhookError';
    this.kind = kind;
    this.status = status;
  }
}

export function createLeadEventId(): string {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID();
  }
  return `fivecred-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function browserContext() {
  if (typeof window === 'undefined') {
    return { pagePath: '/', referrer: '', landingPage: '/' };
  }

  const currentPage = sanitizeMarketingUrl(
    typeof window.location.href === 'string'
      ? window.location.href
      : `${window.location.pathname}${window.location.search}`,
  );

  return {
    pagePath: window.location.pathname,
    referrer: sanitizeReferrer(document.referrer),
    landingPage: currentPage,
  };
}

function cleanFields(fields: LeadFields): Record<string, LeadFieldValue> {
  return Object.fromEntries(
    Object.entries(fields).flatMap(([key, value]) => {
      if (value === undefined) return [];
      return [[key, typeof value === 'string' ? value.trim() : value]];
    }),
  );
}

export function buildLeadWebhookPayload(input: LeadWebhookInput): LeadWebhookPayload {
  const context = browserContext();
  const timestamp = (input.submittedAt ?? new Date()).toISOString();
  const consent: LeadConsent = {
    ...input.consent,
    marketing_status:
      input.consent.marketing_status ?? readConsent()?.status ?? 'not_set',
  };
  const marketingDenied = consent.marketing_status === 'denied';
  const journey = marketingDenied
    ? undefined
    : input.customerJourney ?? getCustomerJourneySnapshot();
  const attribution = marketingDenied
    ? {}
    : input.attribution ?? journey?.last_touch.attribution ?? getAttribution();
  const referrer = marketingDenied
    ? ''
    : sanitizeReferrer(input.referrer ?? journey?.first_touch.referrer ?? context.referrer);
  const landingPage = marketingDenied
    ? input.pagePath ?? context.pagePath
    : sanitizeMarketingUrl(input.landingPage ?? journey?.first_touch.url ?? context.landingPage);
  const journeyFields = marketingDenied ? {} : getLeadAttributionFields(journey);

  return {
    ...cleanFields(input.fields),
    schema_version: LEAD_PAYLOAD_VERSION,
    event_id: input.eventId ?? createLeadEventId(),
    event_name: 'lead_submit',
    page_path: input.pagePath ?? context.pagePath,
    product: input.product,
    produto: input.product,
    form_name: input.formName,
    stage: input.stage,
    etapa: input.stage === 'qualified' ? 2 : 1,
    timestamp,
    data: timestamp,
    origem: 'consignado-fivecred',
    ...journeyFields,
    attribution: {
      ...attribution,
      ...(referrer ? { referrer } : {}),
      ...(landingPage ? { landing_page: landingPage } : {}),
    },
    ...attribution,
    ...(referrer ? { referrer } : {}),
    ...(landingPage ? { landing_page: landingPage } : {}),
    ...(journey ? { customer_journey: journey } : {}),
    consent,
    test_mode: input.testMode ?? false,
  };
}

export type WhatsAppButtonLeadInput = {
  nome: string;
  email: string;
  product?: string;
  placement?: string;
  pagePath?: string;
  submittedAt?: Date;
};

export function buildWhatsAppButtonLeadWebhookPayload({
  nome,
  email,
  product,
  placement,
  pagePath,
  submittedAt,
}: WhatsAppButtonLeadInput): LeadWebhookPayload {
  return buildLeadWebhookPayload({
    product: product ?? 'home',
    formName: 'botao_whatsapp',
    stage: 'completed',
    fields: {
      nome,
      email,
      origem_lead: 'botao_whatsapp',
      posicionamento_botao: placement ?? 'nao_informado',
    },
    consent: {
      accepted: true,
      source: 'form_submit_notice',
      policy_url: 'https://www.fivecred.com.br/politica-de-privacidade',
    },
    pagePath,
    submittedAt,
  });
}

export async function submitLeadToWebhook(
  payload: LeadWebhookPayload,
  fetcher: typeof fetch = fetch,
): Promise<LeadWebhookResult> {
  if (completedSubmissions.has(payload.event_id)) {
    return { status: 208, deduplicated: true, eventId: payload.event_id };
  }

  const existing = inFlightSubmissions.get(payload.event_id);
  if (existing) return existing;

  const request = (async () => {
    let response: Response;
    try {
      response = await fetcher(LEAD_WEBHOOK_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Idempotency-Key': payload.event_id,
        },
        body: JSON.stringify(payload),
        keepalive: true,
      });
    } catch (error) {
      throw new LeadWebhookError(
        error instanceof Error ? `Falha de rede ao registrar lead: ${error.message}` : 'Falha de rede ao registrar lead.',
        'network',
      );
    }

    if (!response.ok) {
      throw new LeadWebhookError(
        `Webhook de leads respondeu com status ${response.status}.`,
        'http',
        response.status,
      );
    }

    completedSubmissions.add(payload.event_id);
    return { status: response.status, deduplicated: false, eventId: payload.event_id };
  })();

  inFlightSubmissions.set(payload.event_id, request);
  try {
    return await request;
  } finally {
    inFlightSubmissions.delete(payload.event_id);
  }
}

export type CltLeadWebhookInput = {
  nome: string;
  whatsapp: string;
  email: string;
  cpf: string;
  nascimento: string;
  cep: string;
  endereco: string;
  tempoCarteira: string;
  vinculo: string;
  salarioLiquido: number;
  valorDesejado: number;
  prazoMeses: number;
  parcelaEstimada: number;
  totalEstimado: number;
  iofEstimado: number;
  cetAnual: number;
  cetMensal: number;
};

export function buildCltLeadWebhookPayload(
  input: CltLeadWebhookInput,
  attribution: AttributionData = {},
  submittedAt = new Date(),
) {
  return buildLeadWebhookPayload({
    product: 'clt',
    formName: 'formulario_clt',
    stage: 'qualified',
    fields: input,
    consent: {
      accepted: true,
      source: 'form_checkbox',
      policy_url: 'https://www.fivecred.com.br/politica-de-privacidade',
    },
    attribution,
    submittedAt,
  });
}

export async function submitCltLeadToWebhook(
  input: CltLeadWebhookInput,
  attribution: AttributionData = {},
  fetcher: typeof fetch = fetch,
): Promise<void> {
  await submitLeadToWebhook(buildCltLeadWebhookPayload(input, attribution), fetcher);
}

export function resetLeadWebhookStateForTests() {
  inFlightSubmissions.clear();
  completedSubmissions.clear();
}
