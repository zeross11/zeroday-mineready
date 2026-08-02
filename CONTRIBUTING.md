# Contributing

Thank you for helping improve the MineReady demonstration.

## Before contributing

- Read [README.md](README.md), [ARCHITECTURE.md](ARCHITECTURE.md), and [SECURITY.md](SECURITY.md).
- Do not submit real worker, customer, mine, credential, medical, employment, training, or access-control data.
- Do not include secrets, environment files, logs, browser profiles, analytics identifiers, or generated build output.
- Use fictional names and records in examples, tests, screenshots, and fixtures.
- Report vulnerabilities privately as described in [SECURITY.md](SECURITY.md), not in a public issue.

## Change workflow

1. Open an issue describing the problem or proposed improvement when the scope is not obvious.
2. Create a focused branch and keep unrelated work out of the change.
3. Preserve the static, no-build release model unless the maintainers explicitly approve an architectural change.
4. Update documentation and QA artifacts when behavior, deployment, safety boundaries, or the prospect walkthrough changes.
5. Run the release and syntax checks documented in [README.md](README.md).
6. Describe what changed, why it changed, user impact, and verification in the pull request.

## Design expectations

- Keep the primary workflow obvious on mobile and desktop.
- Prefer context-aware actions over sending users to another menu.
- Every visible status should explain its meaning or open the appropriate next step.
- Maintain keyboard-accessible semantic controls, labels, focus handling, and status announcements.
- Keep English and Spanish workflow behavior aligned.
- Preserve fictional, browser-local data and manual fallbacks for device-dependent features.

## Legal note

This repository is proprietary, source-available demonstration software. Public visibility does not grant a general license to copy, host, distribute, or operate the software. By submitting a contribution, you represent that you have the right to submit it and authorize Zeroday Security Solutions LLC to use, modify, and include it in this repository and associated products. See [LICENSE](LICENSE).
