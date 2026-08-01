# Zeroday MineReady

Mobile-first English/Spanish contractor-readiness, Part 46 training, mine-approval, and gate-verification demonstration for aggregate and mining sites.

**Live demo:** `https://mineready.zerodaycyber.io`

## Release 11.2.0 — selectable training and QR gate scanning

- Selectable mine and employer training catalogs instead of an empty assignment form
- Plan-mapped templates for §46.5, §46.6, §46.7, §46.8, and §46.11
- Three operational categories: Changes at the Mine, Incident Prevention, and Incident Response
- Templates populate program, category, milestone, minutes, title, detailed subject, review owner, and requested annual credit
- Single-worker, multi-worker, select-all, and custom-training assignment flows
- Mobile worker lesson, knowledge check, acknowledgment, authorized review, and certification
- Live rear-camera QR scanning after an explicit user action
- Switch-camera and supported-device flashlight controls
- Phone-photo QR decoding and manual roster lookup as independent fallbacks
- Standards-style black-on-white worker QR passes linked to the custom-domain gate view
- Locally vendored and pinned QR decoder; no runtime CDN dependency
- §46.5 new-miner milestones: before-work progress, 60-day items, 24 total hours, 90-day deadline, and experienced-miner observation restriction
- §46.6 newly hired experienced-miner workflow: experience verification, before-work subjects, and applicable 60-day respiratory/self-rescue item
- §46.8 rolling annual-refresher ledger: certified short sessions accumulate toward eight hours
- Explicit primary program and optional additional §46.8 credit; no silent double counting
- Worker completion moves to authorized review; it does not self-certify training
- Assignment-specific mine approval and check-in
- Responsive phone, iPad, and desktop layouts
- Safe CSV import/export and spreadsheet-formula protection
- No active application-shell service worker; legacy MineReady caches are retired at startup

## Quality control

The 11.2.0 release passed Chromium and WebKit tests at 320-pixel phone, standard phone, iPad, and desktop widths. The test matrix covered English and Spanish, training-catalog selection, assignment, phone completion, authorized certification, direct QR decoding, phone-photo scanning, roster selection, camera permission, and camera stream initialization. See `QA_STATUS.json`, `QA_BROWSER.json`, and `QA_REPORT.md`.

## Deployment

GitHub Pages publishes the `gh-pages` branch from `/(root)`. The custom domain is `mineready.zerodaycyber.io`, with DNS `mineready CNAME zeross11.github.io`.

This public demonstration uses fictional data stored locally in each browser. It is not an authoritative production system, approved training curriculum, legal certification service, or live access-control system.
