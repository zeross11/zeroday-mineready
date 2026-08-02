# Security policy

## Supported version

Security updates are applied to the current public demonstration release only. The supported release is **11.5.0**.

## Safe-use boundary

MineReady is a static, fictional demonstration. Do not enter real worker, credential, medical, mine, training, employment, or access-control data.

- Browser-local records are not synchronized, authenticated, encrypted as application records, or retained as an authoritative audit trail.
- Workspace roles and approvals are client-side demonstration controls, not security boundaries.
- QR passes identify fictional roster entries; they are not credentials or proof of authorization.
- Training completions, credited minutes, approvals, restrictions, and gate decisions are illustrative only.

## Reporting a vulnerability

Do not disclose a suspected vulnerability or sensitive data in a public issue.

1. Prefer a [private GitHub security advisory](https://github.com/zeross11/zeroday-mineready/security/advisories/new).
2. If private reporting is unavailable, contact Zeroday Security Solutions through the official contact channel at [zerodaycyber.io](https://zerodaycyber.io) and reference the `zeroday-mineready` repository.
3. Include the affected release, browser, reproduction steps, impact, and a minimal proof of concept. Do not include real worker or customer data.

We will acknowledge a valid report, assess severity, coordinate remediation, and publish an appropriate release note. Please allow reasonable time for remediation before public disclosure.

## Requirements for production use

A production adaptation requires authenticated users, server-enforced least privilege, protected records, secure session handling, durable audit logging, retention and deletion controls, monitoring, incident response, backup/recovery, dependency management, approved operating procedures, and regulatory/legal review. This repository intentionally does not claim to provide those controls.
