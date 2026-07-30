(() => {
  'use strict';

  const STATE_KEY = 'mineready-recovery-v1';
  const BOOT_SCHEMA_KEY = 'mineready-bootstrap-schema';
  const BOOT_SCHEMA = '9.3.3';

  function stateLooksUsable(value) {
    return Boolean(
      value &&
      typeof value === 'object' &&
      ['en', 'es'].includes(value.lang) &&
      ['mine', 'employer', 'worker'].includes(value.role) &&
      Array.isArray(value.workers) &&
      value.workers.length > 0 &&
      value.workers.every((worker) => worker && typeof worker.id === 'string' && typeof worker.name === 'string') &&
      Array.isArray(value.assignments)
    );
  }

  function resetIncompatibleDemoState() {
    try {
      const storedSchema = localStorage.getItem(BOOT_SCHEMA_KEY);
      const raw = localStorage.getItem(STATE_KEY);
      let valid = false;
      if (raw) {
        try {
          valid = stateLooksUsable(JSON.parse(raw));
        } catch {
          valid = false;
        }
      }
      if (storedSchema !== BOOT_SCHEMA || (raw && !valid)) {
        localStorage.removeItem(STATE_KEY);
      }
      localStorage.setItem(BOOT_SCHEMA_KEY, BOOT_SCHEMA);
    } catch {
      // The demo can still run when storage is unavailable.
    }
  }

  function showBootProblem(detail) {
    const app = document.getElementById('app');
    if (!app || app.querySelector('.shell')) return;
    const safeDetail = String(detail || '').replace(/[<>]/g, '').slice(0, 240);
    app.innerHTML = `
      <main class="boot-screen boot-error" role="alert">
        <div class="boot-mark">09</div>
        <h1>MineReady could not start</h1>
        <p>Refresh this page once. If the issue continues, reset the local demo data.</p>
        <button type="button" id="bootReset">Reset demo and reload</button>
        ${safeDetail ? `<small>${safeDetail}</small>` : ''}
      </main>`;
    document.getElementById('bootReset')?.addEventListener('click', async () => {
      try {
        localStorage.removeItem(STATE_KEY);
        localStorage.removeItem(BOOT_SCHEMA_KEY);
        if ('caches' in window) {
          const names = await caches.keys();
          await Promise.all(names.filter((name) => name.startsWith('mineready-')).map((name) => caches.delete(name)));
        }
        const registrations = await navigator.serviceWorker?.getRegistrations?.();
        await Promise.all((registrations || []).map((registration) => registration.unregister()));
      } catch {
        // Reload regardless of cleanup result.
      }
      location.replace(`${location.pathname}?reset=${Date.now()}`);
    }, { once: true });
  }

  resetIncompatibleDemoState();

  window.addEventListener('error', (event) => {
    showBootProblem(event?.error?.message || event?.message || 'Application script error');
  });
  window.addEventListener('unhandledrejection', (event) => {
    showBootProblem(event?.reason?.message || event?.reason || 'Application startup error');
  });

  window.setTimeout(() => {
    if (!document.querySelector('.shell')) showBootProblem('The application did not finish loading.');
  }, 5000);

  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.getRegistration().then((registration) => registration?.update()).catch(() => {});
  }
})();
