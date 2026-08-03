# Architecture and trust boundaries

## Overview

MineReady is a static browser demonstration. GitHub Pages serves versioned HTML, CSS, JavaScript, local images, and vendored QR libraries. There is no application server, database, account service, analytics SDK, or remote runtime API.

```text
GitHub Pages
  └─ Static release assets
       └─ Browser application
            ├─ Fictional seed data
            ├─ Browser-local changes
            ├─ Training and readiness workflows
            ├─ QR generation and decoding
            └─ Responsive Mine / Employer / Worker views
```

## Runtime components

| Component | Responsibility |
| --- | --- |
| `mineready-boot.js` | Startup failure handling, framed-execution guard, cache retirement, and release indicator |
| `index.html` | Application shell, content-security policy, failure handling, release asset ordering |
| `mineready-v111.js` | Fictional roster, readiness logic, assignments, reviews, approvals, holds, and gate state |
| `mineready-v112.js` | Training enhancements, QR scanning, photo decoding, and camera controls |
| `mineready-v111.css`, `mineready-v112.css` | Mobile-first responsive design and component presentation |
| `vendor/mr-pass-code.js` | Locally vendored QR pass generation |
| `vendor/mr-gate-reader.min.js` | Locally vendored QR camera/photo decoding |
| Browser local storage | Non-authoritative persistence for the current browser only |

## Data model

The seed contains 24 fictional workers and representative readiness states. Records include demo identifiers, employer, role, crew, work order, program, training progress, approvals, holds, and check-in state. Local generated portraits are mapped to built-in worker IDs.

Changes made during a demo remain in the current browser until site data is cleared or **Reset demo** is confirmed. No data is sent to Zeroday or GitHub by the application.

## Trust boundaries

### Browser-local controls

Workspace roles, readiness flags, reviews, approvals, holds, and QR identifiers are UI workflow demonstrations. A user with browser access can inspect or change client-side state. These controls must never be treated as production authorization.

### Static hosting

GitHub Pages provides public asset delivery and TLS for the custom domain. It does not provide application authentication, field-level authorization, record protection, or business audit history.

### Device capabilities

Camera access is requested only after an explicit scan action. Photo and camera decoding occur in the browser. Device/browser support varies, so manual roster lookup remains a first-class fallback.

### Vendored dependencies

QR libraries are stored in the repository to avoid runtime CDN dependency. Their upstream license notices are retained under `vendor/` and summarized in [THIRD_PARTY_NOTICES.md](THIRD_PARTY_NOTICES.md).

## Security posture

The demo reduces public attack surface by using no backend, no credentials, no cross-origin runtime dependency, a no-inline-script content-security policy, a framed-execution guard, validated and bounded browser state, spreadsheet-safe CSV handling, constrained QR photo uploads, explicit camera activation, immutable CI action pins, vendored dependency hashes, and read-only GitHub Actions permissions.

These choices do not make it a production security system. A real deployment requires the controls listed in [SECURITY.md](SECURITY.md), including authenticated identities, server-enforced least privilege, protected records, durable audit history, monitoring, incident response, and backup/recovery.

## Release integrity

`scripts/validate-release.mjs` checks aligned release versions, required assets, local-only runtime dependencies, dependency hashes, immutable workflow pins, CSP restrictions, license notices, documentation, public-repository hygiene, branch-safe workflow permissions, and retired artifact removal. GitHub Actions runs the validator and JavaScript syntax checks for pushes to `main` and pull requests.
