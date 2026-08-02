# Zeroday MineReady

Mobile-first English/Spanish contractor-readiness, Part 46 training, mine-approval, and gate-verification demonstration for aggregate and mining sites.

**Live demo:** `https://mineready.zerodaycyber.io`

## Release 11.3.0 — client demo reliability and usability

- Role-guided Mine Safety, Employer Admin, and Worker walkthroughs with a clearer “View as” control
- Bilingual English/Spanish assignment titles and detailed subjects, with predictable English fallback for custom training
- Standards-compliant QR generation for every roster worker, including workers imported by CSV
- Explicit separation of actual training time from authorized §46.8 credited minutes
- Confirmed reset behavior; only `?reset=1` can request a reset, and it prompts before clearing browser-local data
- Accessible modal focus management, current-page navigation state, status announcements, responsive five-card summary, and improved small-screen controls
- Read-only GitHub quality workflow; obsolete branch-rewriting deployment automation removed
- Locally vendored and pinned QR encoder and decoder with no runtime CDN dependency
- Legacy application copies, deployment fragments, and retired service-worker source removed

### Included 11.2 capabilities

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

The 11.3.0 release passed static release checks and browser verification at 320-pixel phone and 1440-pixel desktop widths. The browser walkthrough covered bilingual catalog assignment, Spanish worker completion, authorized certification, real QR generation for built-in and imported workers, accurate credited-minute totals, non-destructive reset-link handling, accessibility basics, and console errors. See `QA_STATUS.json`, `QA_BROWSER.json`, and `QA_REPORT.md`.

## Deployment

GitHub Pages publishes the `gh-pages` branch from `/(root)`. The custom domain is `mineready.zerodaycyber.io`, with DNS `mineready CNAME zeross11.github.io`.

This public demonstration uses fictional data stored locally in each browser. It is not an authoritative production system, approved training curriculum, legal certification service, or live access-control system.
