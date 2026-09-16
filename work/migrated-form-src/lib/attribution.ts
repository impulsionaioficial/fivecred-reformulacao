import { readConsent } from './consent.ts';
import {
  clearCustomerJourney,
  getCustomerJourneySnapshot,
  type AttributionData,
} from './customerJourney.ts';

export { ATTRIBUTION_KEYS, type AttributionData, type AttributionKey } from './customerJourney.ts';
const GOOGLE_ADS_ID = 'AW-18056576530';
const eventLedger = new Map<string, number>();

const SAFE_ANALYTICS_KEYS = new Set([
  'form_name',
  'placement',
  'product',
  'page_path',
  'page_title',
  'step',
  'field',
  'error_code',
  'target',
  'content_type',
  'content_name',
  'content_category',
  'event_id',
]);

type TrackingContext = {
  formName?: string;
  placement?: string;
  product?: string;
  eventId?: string;
};

type LeadEvent = Required<Pick<TrackingContext, 'formName'>> &
  Pick<TrackingContext, 'product' | 'eventId'>;

export type FormAnalyticsEvent = Required<Pick<TrackingContext, 'formName'>> &
  Pick<TrackingContext, 'product'> & { step?: number };

export function getAttribution(): AttributionData {
  return getCustomerJourneySnapshot()?.last_touch.attribution ?? {};
}

export function clearAttribution() {
  clearCustomerJourney();
}

function hasMarketingConsent() {
  return typeof window !== 'undefined' && readConsent()?.status === 'granted';
}

function sendWhenReady(provider: 'gtag' | 'fbq' | 'clarity', args: unknown[]) {
  let delivered = false;
  const attempt = () => {
    if (delivered || !hasMarketingConsent()) return;
    const handler = window[provider];
    if (!handler) return;
    handler(...args);
    delivered = true;
  };

  attempt();
  if (!delivered) {
    window.setTimeout(attempt, 250);
    window.setTimeout(attempt, 1_000);
    window.setTimeout(attempt, 3_000);
    window.setTimeout(attempt, 5_000);
  }
}

const sendGoogleEvent = (...args: unknown[]) => sendWhenReady('gtag', args);
const sendMetaEvent = (...args: unknown[]) => sendWhenReady('fbq', args);
const sendClarityEvent = (...args: unknown[]) => sendWhenReady('clarity', args);

function allowEvent(key: string, cooldownMs: number) {
  if (!hasMarketingConsent()) return false;
  const now = Date.now();
  const previous = eventLedger.get(key);
  if (previous !== undefined && now - previous < cooldownMs) return false;
  eventLedger.set(key, now);
  return true;
}

export function safeAnalyticsParameters(parameters: Record<string, unknown>) {
  return Object.fromEntries(
    Object.entries(parameters).flatMap(([key, value]) => {
      if (!SAFE_ANALYTICS_KEYS.has(key)) return [];
      if (!['string', 'number', 'boolean'].includes(typeof value)) return [];
      return [[key, value]];
    }),
  );
}

function eventParameters({ formName, placement, product, eventId }: TrackingContext) {
  return safeAnalyticsParameters({
    form_name: formName,
    placement,
    product: product ?? 'nao_informado',
    page_path: window.location.pathname,
    event_id: eventId,
  });
}

function emitCustom(eventName: string, parameters: Record<string, unknown>) {
  const safeParameters = safeAnalyticsParameters(parameters);
  sendGoogleEvent('event', eventName, safeParameters);
  sendMetaEvent('trackCustom', eventName, safeParameters);
  sendClarityEvent('event', eventName);
}

function googleAdsDestination(kind: 'lead' | 'affiliate') {
  const fullDestination =
    kind === 'lead'
      ? process.env.NEXT_PUBLIC_GOOGLE_ADS_LEAD_SEND_TO
      : process.env.NEXT_PUBLIC_GOOGLE_ADS_AFFILIATE_SEND_TO;
  if (fullDestination?.startsWith('AW-')) return fullDestination;
  const label =
    kind === 'lead'
      ? process.env.NEXT_PUBLIC_GOOGLE_ADS_LEAD_CONVERSION_LABEL
      : process.env.NEXT_PUBLIC_GOOGLE_ADS_AFFILIATE_CONVERSION_LABEL;
  return label ? `${GOOGLE_ADS_ID}/${label}` : undefined;
}

function trackGoogleAdsConversion(kind: 'lead' | 'affiliate') {
  const sendTo = googleAdsDestination(kind);
  if (!sendTo) return;
  sendGoogleEvent('event', 'conversion', { send_to: sendTo });
}

export function trackPageView() {
  const path = window.location.pathname;
  if (!allowEvent(`page_view:${path}`, 750)) return;
  const parameters = safeAnalyticsParameters({ page_path: path, page_title: document.title });
  sendGoogleEvent('event', 'page_view', parameters);
  sendMetaEvent('track', 'PageView');
  sendClarityEvent('event', 'page_view');
}

export const trackRouteChange = trackPageView;

export function trackFormStart({ formName, product }: LeadEvent) {
  const key = `form_start:${window.location.pathname}:${formName}`;
  if (!allowEvent(key, Number.POSITIVE_INFINITY)) return;
  emitCustom('form_start', eventParameters({ formName, product }));
}

export function trackFormStepView({ formName, product, step = 1 }: FormAnalyticsEvent) {
  const key = `form_step_view:${window.location.pathname}:${formName}:${step}`;
  if (!allowEvent(key, Number.POSITIVE_INFINITY)) return;
  emitCustom('form_step_view', { ...eventParameters({ formName, product }), step });
}

export function trackFormStepComplete({ formName, product, step = 1 }: FormAnalyticsEvent) {
  const key = `form_step_complete:${window.location.pathname}:${formName}:${step}`;
  if (!allowEvent(key, 750)) return;
  emitCustom('form_step_complete', { ...eventParameters({ formName, product }), step });
}

export function trackValidationError({
  formName,
  product,
  step,
  field,
  errorCode,
}: FormAnalyticsEvent & { field: string; errorCode: string }) {
  const key = `validation_error:${window.location.pathname}:${formName}:${step}:${field}:${errorCode}`;
  if (!allowEvent(key, 750)) return;
  emitCustom('validation_error', {
    ...eventParameters({ formName, product }),
    step,
    field,
    error_code: errorCode,
  });
}

export function trackLeadSubmitAttempt(event: LeadEvent) {
  const key = `lead_submit_attempt:${event.eventId ?? `${window.location.pathname}:${event.formName}`}`;
  if (!allowEvent(key, 750)) return;
  emitCustom('lead_submit_attempt', eventParameters(event));
}

export function trackLeadSubmitError(event: LeadEvent & { errorCode: string }) {
  const key = `lead_submit_error:${event.eventId ?? `${window.location.pathname}:${event.formName}`}:${event.errorCode}`;
  if (!allowEvent(key, 750)) return;
  emitCustom('lead_submit_error', {
    ...eventParameters(event),
    error_code: event.errorCode,
  });
}

export function trackLeadSubmitSuccess(event: LeadEvent, kind: 'lead' | 'affiliate' = 'lead') {
  const key = `lead_submit_success:${event.eventId ?? `${window.location.pathname}:${event.formName}:${event.product ?? 'credito'}`}`;
  if (!allowEvent(key, 2_000)) return;
  const parameters = eventParameters(event);
  emitCustom('lead_submit_success', parameters);
  sendGoogleEvent('event', kind === 'affiliate' ? 'affiliate_lead' : 'generate_lead', parameters);
  sendMetaEvent('track', 'Lead', {
    content_name: event.formName,
    content_category: event.product ?? (kind === 'affiliate' ? 'afiliados' : 'credito'),
  });
  trackGoogleAdsConversion(kind);
}

export function trackWhatsAppClick({ placement, product }: Required<Pick<TrackingContext, 'placement'>> & Pick<TrackingContext, 'product'>) {
  const key = `whatsapp_click:${window.location.pathname}:${placement}`;
  if (!allowEvent(key, 750)) return;
  const parameters = eventParameters({ placement, product });
  emitCustom('whatsapp_click', parameters);
  // Keep the historical GA4 name while dashboards migrate to the canonical taxonomy.
  sendGoogleEvent('event', 'click_whatsapp', parameters);
  sendMetaEvent('track', 'Contact', {
    content_name: placement,
    content_category: product ?? 'credito',
  });
}

export function trackCtaClick({ placement, target, product }: { placement: string; target: string; product?: string }) {
  const key = `cta_click:${window.location.pathname}:${placement}:${target}`;
  if (!allowEvent(key, 750)) return;
  emitCustom('cta_click', { ...eventParameters({ placement, product }), target });
}

export function trackProductClick({ placement, product, target }: { placement: string; product: string; target: string }) {
  const key = `product_click:${window.location.pathname}:${placement}:${product}`;
  if (!allowEvent(key, 750)) return;
  emitCustom('product_click', { ...eventParameters({ placement, product }), target });
}

export function trackBlogClick({ placement, target }: { placement: string; target: string }) {
  const key = `blog_click:${window.location.pathname}:${placement}:${target}`;
  if (!allowEvent(key, 750)) return;
  emitCustom('blog_click', {
    placement,
    target,
    content_type: 'article',
    page_path: window.location.pathname,
  });
}

export function trackLead(event: LeadEvent) {
  trackLeadSubmitSuccess(event);
}

export function trackAffiliateLead({ formName, eventId }: Pick<LeadEvent, 'formName' | 'eventId'>) {
  trackLeadSubmitSuccess({ formName, product: 'afiliados', eventId }, 'affiliate');
}

export function resetAnalyticsStateForTests() {
  eventLedger.clear();
}

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
    fbq?: (...args: unknown[]) => void;
    clarity?: (...args: unknown[]) => void;
  }
}
