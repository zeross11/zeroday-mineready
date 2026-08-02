# Zeroday MineReady

[![MineReady quality checks](https://github.com/zeross11/zeroday-mineready/actions/workflows/qa.yml/badge.svg)](https://github.com/zeross11/zeroday-mineready/actions/workflows/qa.yml)

MineReady is a mobile-first, English/Spanish demonstration of contractor readiness, Part 46 training workflows, mine approval, and gate check-in/check-out for aggregate and mining operations.

**Live demo:** [mineready.zerodaycyber.io](https://mineready.zerodaycyber.io)

> This is a fictional, browser-local product demonstration. It is not an authoritative training record, approved curriculum, legal certification service, identity system, or production access-control system. Do not enter real worker or mine data.

## What the demo shows

- A 24-worker fictional roster with clear, restricted, expired, pending, action-required, and on-site examples
- Local fictional worker portraits with no remote image or personal-data dependency
- Search by worker name, ID, employer, role, crew, work order, or training program
- Mine Safety, Employer Admin, and Worker views with English/Spanish switching
- Context-aware readiness checks that explain the status and open the appropriate next action
- Prefilled site-orientation and training assignments without forcing users through unrelated menus
- One-at-a-time worker entry and CSV roster intake
- Part 46-oriented program, task-training, annual-refresher, review, and credited-time demonstrations
- QR pass generation, camera/photo scanning where supported, and manual roster lookup
- Assignment-specific mine approval, holds, check-in, and check-out

## Recommended prospect walkthrough

Use the [five-minute demo guide](DEMO_GUIDE.md) for a repeatable presentation. The strongest path is:

1. Open **Mine Safety → Today** to show the populated readiness picture.
2. Open **People** and search for `Carlos Martinez` or `WO-4821`.
3. Open Carlos at **Gate**, then select **Site orientation current** to show the prefilled remediation flow.
4. Search for `Mei Chen` at Gate to show a worker who is clear for the assignment.
5. Switch to **Employer Admin → People → Add one worker** to show direct roster intake.

Use **Reset demo** before a presentation when you want the original fictional state.

## Workspaces

| Workspace | Demonstrates |
| --- | --- |
| Mine Safety | Site readiness, exceptions, authorized review, approval, holds, and gate decisions |
| Employer Admin | Worker intake, training assignment, completion progress, and employer-owned actions |
| Worker | Mobile training, knowledge checks, acknowledgment, progress, and QR pass presentation |

Workspace selection changes the demonstration perspective; it is not authentication or server-enforced authorization.

## Run locally

No build step or package installation is required. Serve the repository root with any static HTTP server; opening the files directly with `file://` is not supported reliably by browser security controls.

```powershell
python -m http.server 4174 --bind 127.0.0.1
```

Then open `http://127.0.0.1:4174/`.

Run the release checks with Node.js 22 or newer:

```powershell
node scripts/validate-release.mjs
node --check mineready-v111.js
node --check mineready-v112.js
node --check vendor/mr-pass-code.js
```

## Data and privacy

- Built-in names, companies, work orders, training records, QR identifiers, and portraits are fictional.
- Demo changes are stored in the current browser's local storage and are not synchronized.
- The static site has no account database, analytics SDK, server API, or remote runtime dependency.
- Clearing site data or using **Reset demo** removes browser-local changes.
- Worker QR codes identify fictional demo records; they are not credentials or proof of authorization.

## Technical profile

- Static HTML, CSS, and JavaScript deployed through GitHub Pages
- No build pipeline, package manager, backend, service worker, or production identity provider
- Locally vendored QR generation and decoding libraries with license notices
- Cache-busted release assets and a restrictive browser content-security policy
- Read-only GitHub Actions validation on `main`

See [ARCHITECTURE.md](ARCHITECTURE.md) for trust boundaries and design details.

## Repository map

| Path | Purpose |
| --- | --- |
| `index.html` | Application shell, security policy, and release asset loading |
| `mineready-v111.js` | Core fictional data and MineReady workflows |
| `mineready-v112.js` | Training, QR scanning, and camera enhancements |
| `mineready-v111.css`, `mineready-v112.css` | Responsive application styling |
| `assets/workers/` | Local fictional worker portraits |
| `vendor/` | Pinned QR libraries and their license notices |
| `scripts/validate-release.mjs` | Release-integrity and public-repository checks |
| `QA_*.json`, `QA_REPORT.md` | Latest recorded static, browser, and production QA evidence |

## Documentation

- [Demo guide](DEMO_GUIDE.md)
- [Architecture and trust boundaries](ARCHITECTURE.md)
- [Deployment and rollback](DEPLOYMENT.md)
- [DNS setup](DNS_SETUP.md)
- [Security policy](SECURITY.md)
- [Support boundaries](SUPPORT.md)
- [Contributing](CONTRIBUTING.md)
- [Changelog](CHANGELOG.md)
- [Third-party notices](THIRD_PARTY_NOTICES.md)
- [QA report](QA_REPORT.md)

## Release status

Release **11.5.0** passed static release validation and targeted browser testing at 320×800 and 1280×720. The public custom domain was verified with the populated roster, local portraits, People and Gate search, one-worker intake, context-aware remediation, responsive layout, accessibility baseline, and zero runtime console errors. GitHub quality checks and Pages deployment completed successfully.

## Production adaptation

Before using this concept with real operational data, implement authenticated identities, server-enforced permissions, encrypted protected records, durable audit history, retention and deletion rules, approved training content, authoritative certification, incident response, monitoring, backup/recovery, and a documented mine operating process. A qualified mine-safety and legal review is required.

## License

Copyright (c) 2026 Zeroday Security Solutions LLC. This repository is public for viewing and evaluation but remains proprietary. See [LICENSE](LICENSE).
