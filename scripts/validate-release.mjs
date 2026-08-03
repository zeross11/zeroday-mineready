import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const read = (file) => readFileSync(resolve(root, file), 'utf8');
const assert = (condition, message) => {
  if (!condition) throw new Error(message);
};

const version = '11.7.0';
const html = read('index.html');
const core = read('mineready-v111.js');
const enhancements = read('mineready-v112.js');
const boot = read('mineready-boot.js');
const health = JSON.parse(read('health.json'));

assert(html.includes(`data-app-version="${version}"`), 'index.html version is inconsistent');
assert(core.includes(`VERSION='${version}'`), 'core version is inconsistent');
assert(enhancements.includes(`RELEASE='${version}'`), 'enhancement version is inconsistent');
assert(health.version === version, 'health.json version is inconsistent');
assert(boot.includes(`RELEASE='${version}'`), 'boot version is inconsistent');
assert(html.includes('rel="manifest"'), 'web app manifest is not linked');
assert(html.includes('mineready-boot.js'), 'external startup guard is missing');
assert(!/<script(?![^>]+src=)[^>]*>/i.test(html), 'inline executable scripts must not be published');
assert(!/\son[a-z]+=/i.test(html), 'inline event handlers must not be published');
assert(!/script-src[^;]*'unsafe-inline'/i.test(html), 'CSP must not allow inline executable scripts');
assert(html.indexOf('mr-pass-code.js') < html.indexOf('mineready-v111.js'), 'Worker pass generator must load before the app');
assert(!core.includes('function fakeQr'), 'decorative QR fallback must not be used');
assert(core.includes('annualCreditedMinutes!=null'), 'annual ledger must use certified credited minutes');
assert(core.includes("titleEs=clean($('#asTitleEs')"), 'assignment translations are missing');
assert(core.includes("subjectEs=clean($('#asSubjectEs')"), 'assignment subject translations are missing');
assert(core.includes('data-readiness='), 'context-aware readiness evidence actions are missing');
assert(core.includes('data-mr-template='), 'context-aware training remediation actions are missing');
assert(enhancements.includes('pendingWorker'), 'readiness assignments must preserve the selected worker');
assert(core.includes("seedWorker('ZMR-1120'"), 'populated 24-worker demonstration roster is missing');
assert(core.includes("data-action=\"worker-add-open\""), 'single-worker intake action is missing');
assert(core.includes('function filterPeople'), 'roster search implementation is missing');
assert(core.includes('function filterGateRoster'), 'gate roster search implementation is missing');
assert(core.includes('function showWelcome'), 'first-visit welcome is missing');
assert(core.includes('function showTourStep'), 'guided product tour is missing');
assert(core.includes('data-action="tour-open"'), 'reopenable demo guide action is missing');
assert(core.includes("p.get('tour')==='1'"), 'forced tour URL support is missing');
assert(core.includes('!deepLinkRequested&&!welcomeSeen()'), 'worker deep links must bypass automatic onboarding');
assert(core.includes('validStoredState'), 'stored demo state validation is missing');
assert(core.includes('MAX_WORKERS=500'), 'demo collection limits are missing');
assert(core.includes('available=MAX_WORKERS-state.workers.length'), 'CSV imports must respect the roster limit');
assert(core.includes("val('id',40).toUpperCase()"), 'CSV worker IDs must be normalized');
assert(core.includes("/^\\s*[=+\\-@]/.test(s)"), 'CSV exports must neutralize spreadsheet formulas');
assert(core.includes('window.MineReadySecurity=Object.freeze'), 'security diagnostics contract is missing');
assert(enhancements.includes('MAX_QR_PHOTO_BYTES'), 'QR photo size validation is missing');
assert(enhancements.includes('MAX_QR_PHOTO_PIXELS'), 'QR photo dimension validation is missing');
assert(readdirSync(resolve(root, 'assets/workers')).filter((name) => name.endsWith('.webp')).length === 24, '24 local worker portraits are required');
assert(!html.includes('serviceWorker.register'), 'application shell service worker must remain disabled');
assert(!existsSync(resolve(root, 'service-worker.js')), 'retired service worker source must not be published');
assert(!existsSync(resolve(root, 'app.js')), 'legacy application source must not be published');
assert(existsSync(resolve(root, 'vendor/qrcode-generator-LICENSE')), 'QR generator license notice is missing');
assert(existsSync(resolve(root, 'vendor/qr-scanner-LICENSE')), 'QR scanner license notice is missing');
assert(existsSync(resolve(root, 'vendor/mr-pass-code.js')), 'Worker pass generator is missing');
assert(existsSync(resolve(root, 'vendor/mr-gate-reader.min.js')), 'Gate reader is missing');

const pinnedFiles = {
  'vendor/mr-pass-code.js': '79ec86f82856005b1c887905cfccfcfbec3821ca61c7fd5a952faa5f778f791c',
  'vendor/mr-gate-reader.min.js': '2221f18d95b340c6a1dae741b67ac3c6d76bf411621b897979a4fd1f6b01efae',
  'vendor/qrcode-generator-LICENSE': '3a850fa5f08101db6f40676c2786e10bd2cd5fff7b12ffdf1e0c434d4e49d90c',
  'vendor/qr-scanner-LICENSE': 'f9e6b44d80d0eb44442c7e66af8a756709a61e4d9adf0a54b8951a92ece734e2'
};
for (const [file, expected] of Object.entries(pinnedFiles)) {
  const actual = createHash('sha256').update(readFileSync(resolve(root, file))).digest('hex');
  assert(actual === expected, `Pinned dependency integrity failed: ${file}`);
}

const publicDocs = [
  'README.md',
  'ARCHITECTURE.md',
  'CHANGELOG.md',
  'CONTRIBUTING.md',
  'DEMO_GUIDE.md',
  'DEPLOYMENT.md',
  'DNS_SETUP.md',
  'SECURITY.md',
  'SUPPORT.md',
  'THIRD_PARTY_NOTICES.md',
  'LICENSE'
];
for (const file of publicDocs) {
  assert(existsSync(resolve(root, file)), `Required public documentation is missing: ${file}`);
}

const repositoryHygiene = [
  '.editorconfig',
  '.gitattributes',
  '.gitignore',
  '.github/ISSUE_TEMPLATE/bug_report.yml',
  '.github/ISSUE_TEMPLATE/config.yml',
  '.github/pull_request_template.md'
];
for (const file of repositoryHygiene) {
  assert(existsSync(resolve(root, file)), `Required public repository file is missing: ${file}`);
}

const gitignore = read('.gitignore');
for (const pattern of ['.env', 'node_modules/', 'dist/', 'coverage/', '*.log']) {
  assert(gitignore.includes(pattern), `.gitignore must protect ${pattern}`);
}

const readme = read('README.md');
for (const file of publicDocs.filter((file) => file !== 'README.md')) {
  assert(readme.includes(`](${file})`), `README documentation link is missing: ${file}`);
}
assert(readme.includes(`Release **${version}**`), 'README release status is inconsistent');
assert(read('404.html').includes(`release=${version}`), '404 redirect release is stale');
assert(read('SECURITY.md').includes(`**${version}**`), 'Security supported version is stale');
assert(read('SECURITY.md').includes('/security/advisories/new'), 'Private vulnerability reporting link is missing');

const forbiddenArtifacts = [
  '.env',
  'node_modules',
  'dist',
  'build',
  'coverage',
  '.cache',
  '.parcel-cache',
  '.vite',
  '__pycache__'
];
for (const artifact of forbiddenArtifacts) {
  assert(!existsSync(resolve(root, artifact)), `Local or generated artifact must not be published: ${artifact}`);
}

const workflow = read('.github/workflows/qa.yml');
assert(workflow.includes('contents: read'), 'quality workflow must use read-only repository permissions');
assert(!/force|write-all|contents:\s*write/i.test(workflow), 'quality workflow must not rewrite repository content');
assert(!/uses:\s+[^\s]+@v\d+/i.test(workflow), 'workflow actions must be pinned to immutable commit SHAs');
assert(workflow.includes('persist-credentials: false'), 'checkout credentials must not persist');

for (const match of html.matchAll(/(?:src|href)="(\.\/[^"?#]+)(?:[?#][^"]*)?"/g)) {
  assert(existsSync(resolve(root, match[1])), `Missing local asset: ${match[1]}`);
}

for (const match of html.matchAll(/<(?:script|link)[^>]+(?:src|href)="([^"]+)"/g)) {
  assert(!/^https?:\/\//i.test(match[1]), `Runtime dependency must be local: ${match[1]}`);
}

for (const file of publicDocs.filter((file) => file.endsWith('.md'))) {
  const markdown = read(file);
  for (const match of markdown.matchAll(/\[[^\]]+\]\(([^)]+)\)/g)) {
    const target = match[1].split('#')[0];
    if (!target || /^(?:https?:|mailto:)/i.test(target)) continue;
    assert(existsSync(resolve(root, target)), `Broken local documentation link in ${file}: ${target}`);
  }
}

console.log(`MineReady ${version} release validation passed.`);
