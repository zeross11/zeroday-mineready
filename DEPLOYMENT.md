# GitHub Pages deployment

The static site is published from the root of either `main` or `gh-pages`; both branches are kept on the same clean release commit.

- Custom domain: `mineready.zerodaycyber.io`
- DNS record: `mineready CNAME zeross11.github.io`
- HTTPS: enforce after GitHub completes certificate provisioning
- Build command: none

The repository contains no automated deployment or recovery workflow. GitHub Pages should publish the selected branch directly from `/(root)`. The only Actions workflow is a read-only quality check; it cannot commit, push, rewrite branches, or deploy the site.
