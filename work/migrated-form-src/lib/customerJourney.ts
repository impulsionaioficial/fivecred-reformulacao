import { readConsent } from './consent.ts';

export const ATTRIBUTION_KEYS = [
  'utm_source',
  'utm_medium',
  'utm_campaign',
  'utm_term',
  'gclid',
  'gbraid',
  'wbraid',
  'fbclid',
  'msclkid',
] as const;

export type AttributionKey = (typeof ATTRIBUTION_KEYS)[number];
export type AttributionData = Partial<Record<AttributionKey, string>>;

export type CustomerTouchpoint = {
  url: string;
  path: string;
  visited_at: string;
  channel: 'google_ads' | 'meta_ads' | 'microsoft_ads' | 'utm' | 'referral' | 'direct';
  attribution: AttributionData;
  referrer?: string;
};

export type CustomerJourneyPage = {
  url: string;
  path: string;
  visited_at: string;
};

export type CustomerJourneySnapshot = {
  schema_version: 'fivecred.customer_journey.v2';
  visitor_id: string;
  session_id: string;
  session_started_at: string;
  first_touch: CustomerTouchpoint;
  last_touch: CustomerTouchpoint;
  conversion_page: CustomerJourneyPage;
  journey: CustomerJourneyPage[];
};

type CustomerProfile = Pick<CustomerJourneySnapshot, 'visitor_id' | 'first_touch' | 'last_touch'>;
type CustomerSession = Pick<CustomerJourneySnapshot, 'session_id' | 'session_started_at' | 'journey'>;

const PROFILE_STORAGE_KEY = 'fivecred_customer_profile_v2';
const SESSION_STORAGE_KEY = 'fivecred_customer_session_v2';
const LEGACY_ATTRIBUTION_KEY = 'fivecred_attribution_v1';
const MAX_JOURNEY_PAGES = 25;

export const CUSTOMER_JOURNEY_CHANGE_EVENT = 'fivecred-customer-journey-change';

function identifier(prefix: 'visitor' | 'session') {
  const value =
    typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function'
      ? crypto.randomUUID()
      : `${Date.now()}-${Math.random().toString(16).slice(2)}`;
  return `fivecred-${prefix}-${value}`;
}

function hasMarketingConsent() {
  return typeof window !== 'undefined' && readConsent()?.status === 'granted';
}

function locationHref() {
  if (typeof window === 'undefined') return '/';
  if (typeof window.location.href === 'string' && window.location.href) return window.location.href;
  return `${window.location.pathname || '/'}${window.location.search || ''}`;
}

export function extractAttribution(value: string): AttributionData {
  try {
    const url = new URL(value, 'https://www.fivecred.com.br');
    return Object.fromEntries(
      ATTRIBUTION_KEYS.flatMap((key) => {
        const parameter = url.searchParams.get(key)?.trim();
        return parameter ? [[key, parameter.slice(0, 250)]] : [];
      }),
    ) as AttributionData;
  } catch {
    return {};
  }
}

export function sanitizeMarketingUrl(value: string): string {
  try {
    const isAbsolute = /^[a-z][a-z\d+.-]*:/i.test(value);
    const url = new URL(value, 'https://www.fivecred.com.br');
    const safeSearch = new URLSearchParams();
    ATTRIBUTION_KEYS.forEach((key) => {
      const parameter = url.searchParams.get(key)?.trim();
      if (parameter) safeSearch.set(key, parameter.slice(0, 250));
    });
    const suffix = safeSearch.size ? `?${safeSearch.toString()}` : '';
    return `${isAbsolute ? url.origin : ''}${url.pathname || '/'}${suffix}`;
  } catch {
    return '/';
  }
}

export function sanitizeReferrer(value: string): string {
  if (!value) return '';
  try {
    const url = new URL(value);
    if (url.hostname === 'fivecred.com.br' || url.hostname.endsWith('.fivecred.com.br')) return '';
    return `${url.origin}${url.pathname || '/'}`;
  } catch {
    return '';
  }
}

function pathFromUrl(value: string) {
  try {
    const url = new URL(value, 'https://www.fivecred.com.br');
    return url.pathname || '/';
  } catch {
    return '/';
  }
}

function channelFor(attribution: AttributionData, referrer: string): CustomerTouchpoint['channel'] {
  if (attribution.gclid || attribution.gbraid || attribution.wbraid) return 'google_ads';
  if (attribution.fbclid) return 'meta_ads';
  if (attribution.msclkid) return 'microsoft_ads';
  if (attribution.utm_source) return 'utm';
  return referrer ? 'referral' : 'direct';
}

function buildTouchpoint(value: string, referrer: string, visitedAt: string): CustomerTouchpoint {
  const url = sanitizeMarketingUrl(value);
  const safeReferrer = sanitizeReferrer(referrer);
  const attribution = extractAttribution(url);
  return {
    url,
    path: pathFromUrl(url),
    visited_at: visitedAt,
    channel: channelFor(attribution, safeReferrer),
    attribution,
    ...(safeReferrer ? { referrer: safeReferrer } : {}),
  };
}

function readJson<T>(storage: Storage, key: string): T | undefined {
  try {
    const value = storage.getItem(key);
    return value ? (JSON.parse(value) as T) : undefined;
  } catch {
    return undefined;
  }
}

function writeJson(storage: Storage, key: string, value: unknown) {
  try {
    storage.setItem(key, JSON.stringify(value));
  } catch {
    // The current conversion can still use the in-memory snapshot.
  }
}

function legacyAttribution(): AttributionData {
  if (typeof window === 'undefined') return {};
  const stored = readJson<Record<string, unknown>>(window.localStorage, LEGACY_ATTRIBUTION_KEY) ?? {};
  return Object.fromEntries(
    ATTRIBUTION_KEYS.flatMap((key) => {
      const value = stored[key];
      return typeof value === 'string' && value ? [[key, value]] : [];
    }),
  ) as AttributionData;
}

function withLegacyAttribution(touchpoint: CustomerTouchpoint): CustomerTouchpoint {
  if (Object.keys(touchpoint.attribution).length) return touchpoint;
  const attribution = legacyAttribution();
  if (!Object.keys(attribution).length) return touchpoint;
  return {
    ...touchpoint,
    channel: channelFor(attribution, touchpoint.referrer ?? ''),
    attribution,
  };
}

function pageFromTouchpoint(touchpoint: CustomerTouchpoint): CustomerJourneyPage {
  return {
    url: touchpoint.url,
    path: touchpoint.path,
    visited_at: touchpoint.visited_at,
  };
}

function appendPage(journey: CustomerJourneyPage[], page: CustomerJourneyPage) {
  const previous = journey.at(-1);
  if (previous?.url === page.url) return journey;
  return [...journey, page].slice(-MAX_JOURNEY_PAGES);
}

export function recordCustomerJourneyPage(options: {
  url?: string;
  referrer?: string;
  visitedAt?: Date;
  notify?: boolean;
} = {}): CustomerJourneySnapshot | undefined {
  if (!hasMarketingConsent()) return undefined;

  const visitedAt = (options.visitedAt ?? new Date()).toISOString();
  const touchpoint = withLegacyAttribution(
    buildTouchpoint(
      options.url ?? locationHref(),
      options.referrer ?? (typeof document === 'undefined' ? '' : document.referrer),
      visitedAt,
    ),
  );
  const storedProfile = readJson<CustomerProfile>(window.localStorage, PROFILE_STORAGE_KEY);
  const profile: CustomerProfile = {
    visitor_id: storedProfile?.visitor_id ?? identifier('visitor'),
    first_touch: storedProfile?.first_touch ?? touchpoint,
    last_touch:
      Object.keys(touchpoint.attribution).length || !storedProfile?.last_touch
        ? touchpoint
        : storedProfile.last_touch,
  };
  const storedSession = readJson<CustomerSession>(window.sessionStorage, SESSION_STORAGE_KEY);
  const page = pageFromTouchpoint(touchpoint);
  const session: CustomerSession = {
    session_id: storedSession?.session_id ?? identifier('session'),
    session_started_at: storedSession?.session_started_at ?? visitedAt,
    journey: appendPage(storedSession?.journey ?? [], page),
  };

  writeJson(window.localStorage, PROFILE_STORAGE_KEY, profile);
  writeJson(window.localStorage, LEGACY_ATTRIBUTION_KEY, profile.last_touch.attribution);
  writeJson(window.sessionStorage, SESSION_STORAGE_KEY, session);

  const snapshot: CustomerJourneySnapshot = {
    schema_version: 'fivecred.customer_journey.v2',
    ...profile,
    ...session,
    conversion_page: page,
  };
  if (options.notify !== false) {
    window.dispatchEvent(new CustomEvent(CUSTOMER_JOURNEY_CHANGE_EVENT, { detail: snapshot }));
  }
  return snapshot;
}

export function getCustomerJourneySnapshot() {
  return recordCustomerJourneyPage({ notify: false });
}

export function getLeadAttributionFields(
  snapshot: CustomerJourneySnapshot | undefined = getCustomerJourneySnapshot(),
): Record<string, string> {
  if (!snapshot) return {};
  const fields: Record<string, string> = {
    visitor_id: snapshot.visitor_id,
    session_id: snapshot.session_id,
    first_touch_url: snapshot.first_touch.url,
    first_touch_at: snapshot.first_touch.visited_at,
    first_touch_channel: snapshot.first_touch.channel,
    last_touch_url: snapshot.last_touch.url,
    last_touch_at: snapshot.last_touch.visited_at,
    last_touch_channel: snapshot.last_touch.channel,
    conversion_url: snapshot.conversion_page.url,
    journey_paths: snapshot.journey.map((page) => page.path).join(' > '),
    journey_count: String(snapshot.journey.length),
  };
  ATTRIBUTION_KEYS.forEach((key) => {
    const first = snapshot.first_touch.attribution[key];
    const last = snapshot.last_touch.attribution[key];
    if (last) fields[key] = last;
    if (first) fields[`first_${key}`] = first;
    if (last) fields[`last_${key}`] = last;
  });
  if (snapshot.first_touch.referrer) fields.first_referrer = snapshot.first_touch.referrer;
  if (snapshot.last_touch.referrer) fields.last_referrer = snapshot.last_touch.referrer;
  return fields;
}

/**
 * Mantém intacta a mensagem original enviada ao WhatsApp.
 * A jornada do cliente continua disponível separadamente para a webhook.
 */
export function enrichWhatsAppUrlWithJourney(value: string): string {
  return value;
}

export function clearCustomerJourney() {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.removeItem(PROFILE_STORAGE_KEY);
    window.localStorage.removeItem(LEGACY_ATTRIBUTION_KEY);
    window.sessionStorage.removeItem(SESSION_STORAGE_KEY);
  } catch {
    // Consent denial still applies when storage access is unavailable.
  }
}
