export type ConsentStatus = "granted" | "denied";

const CONSENT_KEY = "fivecred_consent_v1";
const CONSENT_EVENT = "fivecred-consent-change";

export type ConsentRecord = {
  status: ConsentStatus;
  updatedAt: string;
};

function applyRuntimeConsent(status: ConsentStatus) {
  if (typeof window === "undefined") return;

  const storageValue = status === "granted" ? "granted" : "denied";
  window.gtag?.("consent", "update", {
    ad_storage: storageValue,
    ad_user_data: storageValue,
    ad_personalization: storageValue,
    analytics_storage: storageValue,
  });
  window.fbq?.("consent", status === "granted" ? "grant" : "revoke");
  window.clarity?.("consentv2", {
    ad_Storage: storageValue,
    analytics_Storage: storageValue,
  });
}

export function readConsent(): ConsentRecord | null {
  if (typeof window === "undefined") return null;

  try {
    const raw = window.localStorage.getItem(CONSENT_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Partial<ConsentRecord>;
    if (parsed.status !== "granted" && parsed.status !== "denied") return null;
    return { status: parsed.status, updatedAt: parsed.updatedAt ?? new Date().toISOString() };
  } catch {
    return null;
  }
}

export function setConsent(status: ConsentStatus) {
  if (typeof window === "undefined") return;

  const record: ConsentRecord = { status, updatedAt: new Date().toISOString() };

  try {
    window.localStorage.setItem(CONSENT_KEY, JSON.stringify(record));
  } catch {
    // Consent still applies for the current page even when storage is unavailable.
  }

  applyRuntimeConsent(status);
  window.dispatchEvent(new CustomEvent(CONSENT_EVENT, { detail: record }));
}

// Cada navegação em um site exportado estaticamente recarrega os scripts de tag do zero,
// então uma escolha já salva precisa ser reaplicada a cada carregamento de página.
export function reapplyStoredConsent(): ConsentRecord | null {
  const stored = readConsent();
  if (!stored) return null;

  applyRuntimeConsent(stored.status);
  return stored;
}

export function openConsentManager() {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new CustomEvent("fivecred-consent-open"));
}

export const CONSENT_CHANGE_EVENT = CONSENT_EVENT;
export const CONSENT_OPEN_EVENT = "fivecred-consent-open";
