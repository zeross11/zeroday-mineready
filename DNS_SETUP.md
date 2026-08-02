# DNS setup

The custom domain uses a single DNS record at the authoritative provider:

| Field | Value |
| --- | --- |
| Type | `CNAME` |
| Host | `mineready` |
| Target | `zeross11.github.io` |
| Proxy | DNS-only until GitHub completes TLS provisioning |

The repository root must contain `CNAME` with exactly:

```text
mineready.zerodaycyber.io
```

After DNS resolves, configure GitHub Pages to publish `gh-pages` from `/(root)`, set the custom domain to `mineready.zerodaycyber.io`, and enable **Enforce HTTPS**.

Verify both the Pages workflow and [https://mineready.zerodaycyber.io/health.json](https://mineready.zerodaycyber.io/health.json) before considering a release complete. See [DEPLOYMENT.md](DEPLOYMENT.md) for the full runbook.
