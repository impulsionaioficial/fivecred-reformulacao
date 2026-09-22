# Contact-first form stages

Requested change: retain every existing question and field requirement, but start with the existing name/phone/email fields. Forms without email still do not ask for email.

- Five static product forms: move CPF/birth date/address groups and their original validation rules to step 2.
- CLT/FGTS: move CPF/birth date to qualification; preserve all final submission guards and the eight original business/integration modules.
- General: contact in step 1, CPF/birth date alongside profile in step 2.
- Affiliates and carta buyer: split existing fields into contact and product/profile stages; payloads and destinations unchanged.
- Campaign: two local stages, final send still disabled pending its webhook.
- Seller: contact first, optional identification next, then existing carta questions; final send still unavailable pending its webhook. No data is persisted or posted.

Verification (all network submissions intercepted):

```
node tests/contact-first-contract.cjs
node tests/contact-first-browser.cjs
node tests/migrated-products.cjs
node tests/simulation-pages.cjs
node tests/simulation-pages-browser.cjs
```

The old byte-for-byte UI hashes in design-preservation-baseline.json predate this intentionally authorized sequencing change. Static question/attribute/option parity is now checked independently of field order. Original integration/library hashes and browser submission assertions remain in place.

`work/build-original-static-forms.cjs` is the historical import tool, not part of the production build: do not rerun it to build this version, because it imports the pre-reorganization forms. Production uses the committed form fragments and bundles, then `work/build-sites.cjs` and `work/build-production.cjs`.
