import { existsSync, readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const read = (file) => readFileSync(resolve(root, file), 'utf8');
const assert = (condition, message) => {
  if (!condition) throw new Error(message);
};

const version = '11.4.1';
const html = read('index.html');
const core = read('mineready-v111.js');
const enhancements = read('mineready-v112.js');
const health = JSON.parse(read('health.json'));

assert(html.includes(`data-app-version="${version}"`), 'index.html version is inconsistent');
assert(core.includes(`VERSION='${version}'`), 'core version is inconsistent');
assert(enhancements.includes(`RELEASE='${version}'`), 'enhancement version is inconsistent');
assert(health.version === version, 'health.json version is inconsistent');
assert(html.includes('rel="manifest"'), 'web app manifest is not linked');
assert(html.indexOf('mr-pass-code.js') < html.indexOf('mineready-v111.js'), 'Worker pass generator must load before the app');
assert(!core.includes('function fakeQr'), 'decorative QR fallback must not be used');
assert(core.includes('annualCreditedMinutes!=null'), 'annual ledger must use certified credited minutes');
assert(core.includes("titleEs=clean($('#asTitleEs')"), 'assignment translations are missing');
assert(core.includes("subjectEs=clean($('#asSubjectEs')"), 'assignment subject translations are missing');
assert(core.includes('data-readiness='), 'context-aware readiness evidence actions are missing');
assert(core.includes('data-mr-template='), 'context-aware training remediation actions are missing');
assert(enhancements.includes('pendingWorker'), 'readiness assignments must preserve the selected worker');
assert(!html.includes('serviceWorker.register'), 'application shell service worker must remain disabled');
assert(!existsSync(resolve(root, 'service-worker.js')), 'retired service worker source must not be published');
assert(!existsSync(resolve(root, 'app.js')), 'legacy application source must not be published');
assert(existsSync(resolve(root, 'vendor/qrcode-generator-LICENSE')), 'QR generator license notice is missing');
assert(existsSync(resolve(root, 'vendor/qr-scanner-LICENSE')), 'QR scanner license notice is missing');
assert(existsSync(resolve(root, 'vendor/mr-pass-code.js')), 'Worker pass generator is missing');
assert(existsSync(resolve(root, 'vendor/mr-gate-reader.min.js')), 'Gate reader is missing');

const workflow = read('.github/workflows/qa.yml');
assert(workflow.includes('contents: read'), 'quality workflow must use read-only repository permissions');
assert(!/force|write-all|contents:\s*write/i.test(workflow), 'quality workflow must not rewrite repository content');

for (const match of html.matchAll(/(?:src|href)="(\.\/[^"?#]+)(?:[?#][^"]*)?"/g)) {
  assert(existsSync(resolve(root, match[1])), `Missing local asset: ${match[1]}`);
}

for (const match of html.matchAll(/<(?:script|link)[^>]+(?:src|href)="([^"]+)"/g)) {
  assert(!/^https?:\/\//i.test(match[1]), `Runtime dependency must be local: ${match[1]}`);
}

console.log(`MineReady ${version} release validation passed.`);
