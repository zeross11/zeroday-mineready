# Deployment and rollback

MineReady is a static GitHub Pages site. There is no build command, package installation, backend service, or deployment secret.

## Production configuration

- Repository: `zeross11/zeroday-mineready`
- Published branch: `gh-pages`
- Published folder: `/(root)`
- Custom domain: `mineready.zerodaycyber.io`
- DNS: `mineready CNAME zeross11.github.io`
- HTTPS: enforced by GitHub Pages after certificate provisioning
- Release source: `main` and `gh-pages` point to the same reviewed release commit

The `CNAME` and `.nojekyll` files must remain in the published root.

## Release procedure

1. Update release files and cache-busting version references together.
2. Run `node scripts/validate-release.mjs` and JavaScript syntax checks.
3. Review the exact file set for secrets, environment files, logs, build output, and unrelated changes.
4. Publish the reviewed commit to `main` and `gh-pages` without force-updating either branch.
5. Confirm **MineReady quality checks** succeeds on `main`.
6. Confirm **pages build and deployment** succeeds on `gh-pages`.
7. Verify the custom domain, `health.json`, console errors, mobile layout, desktop layout, and the release's critical workflows.
8. Record the live result in `QA_STATUS.json`, `QA_BROWSER.json`, and `QA_REPORT.md`.

The Actions quality workflow is intentionally read-only and cannot commit, push, rewrite branches, or deploy repository content.

## Verification endpoints

- Application: `https://mineready.zerodaycyber.io`
- Health metadata: `https://mineready.zerodaycyber.io/health.json`
- GitHub Actions: `https://github.com/zeross11/zeroday-mineready/actions`

Expected health values include `status: "ok"`, the current release version, and `deployment: "github-pages-live"`.

## Rollback

1. Identify the last verified commit from the GitHub history and QA artifacts.
2. Create a new rollback commit that restores the verified file tree; do not rewrite public branch history.
3. Publish that commit to `main` and `gh-pages`.
4. Wait for both workflows to succeed and repeat production verification.
5. Record the rollback reason and resulting live version in the QA artifacts and changelog.

## Cache behavior

Release assets use query-string versioning. Every release must update `index.html`, the application version constants, and `health.json` consistently. The validation script rejects mismatched versions or missing local assets.

See [DNS_SETUP.md](DNS_SETUP.md) for the authoritative DNS record.
