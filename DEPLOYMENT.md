# GitHub Pages deployment

The static site is published from the root of either `main` or `gh-pages`; both branches are kept on the same clean release commit.

- Custom domain: `mineready.zerodaycyber.io`
- DNS record: `mineready CNAME zeross11.github.io`
- HTTPS: enforce after GitHub completes certificate provisioning
- Build command: none

The repository contains no deployment or recovery workflows. This avoids obsolete bootstrap jobs and recurring GitHub Actions failures.
