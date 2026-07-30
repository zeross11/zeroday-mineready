# Zeroday MineReady

Mobile-first English/Spanish contractor readiness, training, and gate-verification demonstration for aggregate and mining sites.

## GitHub Pages deployment

- Repository visibility: **Public**
- Publishing source: **Deploy from a branch**
- Branch: **gh-pages**
- Folder: **/(root)**
- Custom domain: `mineready.zerodaycyber.io`
- DNS: `mineready CNAME zeross11.github.io`

The complete static application lives on `main`. The `Publish MineReady to gh-pages` workflow validates the required files and JavaScript syntax, then publishes the current `main` commit to `gh-pages`. No build command is required.

Before adding DNS, enable GitHub Pages in **Settings → Pages** using `gh-pages` and `/(root)`, then save `mineready.zerodaycyber.io` as the custom domain. After that, create the DNS CNAME and enable **Enforce HTTPS** when GitHub finishes certificate provisioning.

This demo uses fictional data stored in the browser. It is not a production system of record and must not be used with real worker, training, or mine-access data.
