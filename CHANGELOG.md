# Changelog

All notable public demonstration changes are summarized here.

## 11.7.0 — 2026-08-02

- Removed inline executable scripts and tightened the content-security policy.
- Added a framed-execution guard to reduce UI-redressing and clickjacking exposure on static hosting.
- Added strict size, shape, uniqueness, and relationship validation for browser-local demo state with safe recovery.
- Bounded workers, assignments, records, CSV growth, and uploaded QR photo size/dimensions to resist local resource exhaustion.
- Normalized imported worker IDs and strengthened assignment input allowlists.
- Pinned GitHub Actions to immutable commits, disabled persisted checkout credentials, and verified vendored dependency hashes during every release check.
- Improved QR scanner focus containment and restoration.

## 11.6.0 — 2026-08-02

- Added a concise welcome for first-time visitors without putting a marketing splash in front of returning users.
- Added an optional four-step tour that moves through the real Mine Safety and Employer Admin screens.
- Added a permanent Demo guide control so the walkthrough can be restarted during a prospect conversation.
- Added English and Spanish onboarding copy, keyboard-accessible controls, responsive layouts, and a `?tour=1` presentation link.
- Reset now restores both the fictional data and the first-visit welcome.

## 11.5.0 — 2026-08-02

- Expanded the fictional population to 24 workers with varied readiness and on-site states.
- Added 24 locally hosted fictional worker portraits.
- Added working People search across worker and assignment context.
- Added Gate search with direct worker selection.
- Added one-at-a-time Employer Admin worker intake alongside CSV import.
- Preserved context-aware readiness remediation and added production QA coverage.
- Verified the custom-domain release on phone and desktop layouts.

## 11.4.1 — 2026-08-02

- Made every readiness row a semantic, keyboard-accessible action.
- Added concise evidence dialogs for completed checks.
- Added reason and owner explanations for identity, training-record, approval, restriction, and hold exceptions.
- Opened prefilled, bilingual, plan-mapped assignments directly from missing-training checks.
- Added direct eligible mine approval and access-hold removal.

## 11.3.0 — 2026-08-02

- Added clearer role-guided Mine Safety, Employer Admin, and Worker walkthroughs.
- Added aligned English/Spanish assignment content and fallback behavior.
- Added standards-style QR generation for built-in and imported workers.
- Separated actual training time from authorized credited minutes.
- Improved modal focus, current-page semantics, responsive summaries, and reset safety.
- Removed obsolete deployment automation, legacy application copies, and retired service-worker source.

## 11.2.0 — 2026-08-01

- Added selectable training catalogs and Part 46-oriented program templates.
- Added single-worker, multi-worker, select-all, and custom assignment flows.
- Added worker lesson, knowledge-check, acknowledgment, authorized review, and certification demonstrations.
- Added live camera, photo, and manual QR lookup paths.
- Added program milestones, annual-refresher ledger behavior, task training, and assignment-specific gate approval.

Earlier iterations were internal prototypes and are not supported public releases.
