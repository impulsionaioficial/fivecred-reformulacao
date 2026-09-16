# Original connected forms

This folder preserves the native React field schemas and webhook payloads of the original Fivecred pages, with the approved white cards, beige accents and orange controls. Originals are untouched. No iframe or inline script is used.

## Integration

- `require('../connected-forms.cjs').renderConnectedForm(slug, placement = 'hero')` returns server-rendered native HTML, a `[data-connected-form]` mount, and a no-JavaScript notice. Accepted canonical slugs: `fivecred-next`, `fivecred-afiliados`, `contemplada.fivecred.com.br`. Placement: `hero` or `cta`.
- Include `/shared/connected-forms.css` after the base stylesheet and `/shared/connected-forms.js` as a deferred or Next afterInteractive script.
- The browser bundle hydrates automatically and observes mounts inserted during client navigation. It also exposes `window.FivecredConnectedForms.mount(scope = document)`.
- The parent page owns section anchors, layout wrappers and CSP. Webhook `connect-src`: `https://hook.us1.make.celonis.com`.
- Server-rendered fields are disabled until submit handlers are attached, preventing an accidental native GET containing personal fields.

## Preserved contracts

### `fivecred-next`

Original: `fivecred-next/app/components/SimulationForm.tsx`.

POST JSON to `https://hook.us1.make.celonis.com/a1niutnubcy8miisowdia8geyha1187u`.

Payload keys: `nome`, `whatsapp`, `cpf`, `nascimento`, `perfil`, `emprestimo_ativo`, `banco`, `valor_desejado`, `horario_contato`, `origem`, `data`. Origin: `consignado-fivecred`. Date: ISO timestamp.

Three original steps; six profile options; active-loan yes/no; four amount ranges; morning/afternoon/evening; both original consent checkboxes. Phone, CPF and birthdate format retained. The original date-mask regex accidentally changed a complete year into `19/90`; anchoring it fixes complete `DD/MM/AAAA` input without changing the outgoing contract.

The original WhatsApp redirect was `5500000000000`, a placeholder. It is intentionally not opened; successful webhook submission shows the contact confirmation. A verified destination was not invented.

### `fivecred-afiliados`

Original: `fivecred-afiliados/app/components/CTA.tsx`.

POST JSON to `https://hook.us1.make.celonis.com/m4ln9sg12wotrfm5nejxgtge8qfpg2kd`.

Payload keys: `nome`, `whatsapp`, `email`, `cidade`, `trabalhaVendas`, `canais`, `cnpj`, `volume`, `comoConheceu`, `aceite`, `origem`, `data`, `pagina`. Origin: `landing-afiliados`. `canais` joins selected strings with `, `. `pagina` is the current complete page URL. Date: ISO timestamp.

All original fields, seven channel choices, four volume choices, yes/no choices, phone mask and acceptance text are retained. Channels remain optional as in the original; acceptance is checked on submission.

### `contemplada.fivecred.com.br`

Originals: `components/hero-section.tsx` and `components/cta-section.tsx`.

POST JSON to `https://hook.us1.make.celonis.com/0b1d6blfvvj1ay2qkf3yi62v7w7e04uk`.

Payload keys: `name`, `phone`, `type`, `source`, `timestamp`. Sources: `FiveCred Contemplada - Hero` and `FiveCred Contemplada - CTA`, selected by placement. Type values: `Veículo`, `Imóvel`, `Caminhão/Frota`. Hero retains the original price ranges in option labels; CTA retains shorter labels. Original phone input has no mask, which is preserved.

After accepted submission, a fivecred:whatsapp event requests the shared name/email step, with the original WhatsApp destination 5511961614215 and message. The success link uses the same step and carries the previously entered name. Only its confirmation opens WhatsApp, adding the contact information to the message. The webhook payload remains unchanged. Failed submissions do not open the contact step.

## Verification

Rebuild: `node work/connected-form-src/build.cjs` from the redesign root. The builder uses the existing esbuild/React packages in the main Fivecred checkout and creates `shared/connected-forms.js` plus `work/connected-forms.cjs`.

Run: `node work/connected-form-src/verify.cjs`.

Passed on 2026-09-15:

- Home complete three-step interaction, all masks and exact emitted JSON contract.
- Affiliate complete interaction, acceptance, joined channels and current URL payload.
- Buyer hero and CTA separate source values, exact payloads, original WhatsApp and manual continuation link.
- HTTP 500 failures (home/affiliate), network failures (both buyer forms), visible error, no false success, successful retry.
- Synchronous repeated submit events produce only one request while in flight.
- Mobile widths 360/390 and desktop 1280 have no horizontal overflow.
- Zero browser runtime/hydration errors; mobile screenshots visually inspected.

Every external webhook POST was intercepted; no real lead or test data was submitted. Window opens were intercepted as well. The suite deliberately failed first while native form integration was absent, and then revealed and reproduced the inherited date-mask defect before the correction passed.
