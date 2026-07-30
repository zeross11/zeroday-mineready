(() => {
  'use strict';

  const APP_VERSION = '9.3.0';
  const MAX_CSV_BYTES = 1024 * 1024;
  const MAX_IMPORT_ROWS = 500;
  const M = window.MR;
  const V = window.MR_VIEW;
  if (!M || !V) return;

  const S = () => M.state;
  const byId = (id) => document.getElementById(id);
  const nowIso = () => new Date().toISOString();
  const bilingual = (en, es) => S().lang === 'es' ? es : en;
  const cleanText = (value, max = 160) => String(value ?? '')
    .replace(/[\u0000-\u001F\u007F]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, max);

  function toast(message) {
    const node = byId('toast');
    if (!node) return;
    node.textContent = message;
    node.classList.add('show');
    clearTimeout(node._mrTimer);
    node._mrTimer = setTimeout(() => node.classList.remove('show'), 2200);
  }

  function approvalKey(worker) {
    return [M.tx('site'), worker.employer, worker.workOrder, worker.role, worker.crew]
      .map((value) => String(value || '').trim().toLowerCase())
      .join('|');
  }

  function hardenedBlocker(worker) {
    if (worker.hold) return 'held';
    if (!worker.identity) return 'identity';
    if (!worker.refresher) return 'expired';
    if (!worker.task) return 'task';
    if (!worker.orientation) return 'orientationMissing';
    if (worker.notice !== S().noticeVersion) return 'noticeMissing';
    if (!worker.approved || worker.approvalKey !== approvalKey(worker)) return 'approvalMissing';
    return null;
  }

  M.blocker = hardenedBlocker;
  M.status = (worker) => {
    if (worker.hold) return 'hold';
    const blocker = hardenedBlocker(worker);
    if (!blocker) return 'ready';
    return ['approvalMissing', 'orientationMissing', 'noticeMissing'].includes(blocker)
      ? 'pending'
      : 'blocked';
  };

  function saveAndRender(message) {
    M.save();
    V.render();
    enhance();
    syncUrl();
    if (message) toast(message);
  }

  function normalizeState() {
    const state = S();
    state.workers.forEach((worker) => {
      worker.approvalKey ||= worker.approved ? approvalKey(worker) : '';
      worker.approvedAt ||= worker.approved ? nowIso() : '';
      worker.checked = Boolean(worker.checked && M.status(worker) === 'ready');
    });
    state.assignments.forEach((assignment) => {
      assignment.awaitingReview = Boolean(assignment.awaitingReview);
      assignment.certified = Boolean(assignment.certified);
    });
    localStorage.setItem('mineready-demo-schema', APP_VERSION);
    M.save();
  }

  function applyUrlState() {
    const params = new URLSearchParams(location.search);
    const workspace = params.get('workspace');
    const language = params.get('lang');
    const workerId = params.get('worker');
    if (['mine', 'employer', 'worker'].includes(workspace)) {
      S().role = workspace;
      S().page = workspace === 'worker' ? 'home' : (workerId ? 'gate' : 'today');
    }
    if (['en', 'es'].includes(language)) S().lang = language;
    if (workerId && M.W(workerId)) S().active = workerId;
  }

  function syncUrl() {
    const params = new URLSearchParams();
    params.set('workspace', S().role);
    params.set('lang', S().lang);
    if (S().active) params.set('worker', S().active);
    history.replaceState(null, '', `${location.pathname}?${params.toString()}`);
  }

  function csvCell(value) {
    let text = String(value ?? '');
    if (/^[=+\-@]/.test(text)) text = `'${text}`;
    return `"${text.replaceAll('"', '""')}"`;
  }

  function exportCsv() {
    const headers = ['worker_id', 'name', 'employer', 'role', 'work_order', 'crew', 'status', 'checked_in'];
    const rows = S().workers.map((worker) => [
      worker.id, worker.name, worker.employer, worker.role, worker.workOrder,
      worker.crew, M.status(worker), worker.checked ? 'yes' : 'no'
    ]);
    const csv = [headers, ...rows].map((row) => row.map(csvCell).join(',')).join('\r\n');
    const blob = new Blob(['\ufeff', csv], { type: 'text/csv;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `mineready-workforce-${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    setTimeout(() => URL.revokeObjectURL(url), 0);
    toast(bilingual('CSV exported safely', 'CSV exportado de forma segura'));
  }

  function parseCsv(text) {
    const rows = [];
    let row = [];
    let field = '';
    let quoted = false;
    for (let i = 0; i < text.length; i += 1) {
      const char = text[i];
      const next = text[i + 1];
      if (quoted) {
        if (char === '"' && next === '"') { field += '"'; i += 1; }
        else if (char === '"') quoted = false;
        else field += char;
      } else if (char === '"') quoted = true;
      else if (char === ',') { row.push(field); field = ''; }
      else if (char === '\n') { row.push(field.replace(/\r$/, '')); rows.push(row); row = []; field = ''; }
      else field += char;
    }
    if (field || row.length) { row.push(field.replace(/\r$/, '')); rows.push(row); }
    return rows.filter((values) => values.some((value) => value.trim()));
  }

  function avatarData(name) {
    const initials = cleanText(name, 80).split(' ').filter(Boolean).slice(0, 2)
      .map((part) => part[0]?.toUpperCase() || '').join('') || 'MR';
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 160 160"><rect width="160" height="160" rx="32" fill="#1b2817"/><circle cx="80" cy="57" r="31" fill="#91ed27"/><path d="M24 150c5-38 26-56 56-56s51 18 56 56" fill="#91ed27"/><text x="80" y="90" text-anchor="middle" font-family="system-ui" font-size="0">${initials}</text></svg>`;
    return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
  }

  async function importCsv(file) {
    if (!file) return;
    if (file.size > MAX_CSV_BYTES) {
      toast(bilingual('CSV must be 1 MB or smaller', 'El CSV debe ser de 1 MB o menos'));
      return;
    }
    const text = await file.text();
    const rows = parseCsv(text.replace(/^\uFEFF/, ''));
    if (rows.length < 2) {
      toast(bilingual('CSV has no worker rows', 'El CSV no contiene trabajadores'));
      return;
    }
    if (rows.length - 1 > MAX_IMPORT_ROWS) {
      toast(bilingual(`Import is limited to ${MAX_IMPORT_ROWS} workers`, `La importación está limitada a ${MAX_IMPORT_ROWS} trabajadores`));
      return;
    }
    const aliases = {
      worker_id: ['worker_id', 'id', 'id_trabajador', 'identificador'],
      name: ['name', 'nombre'], employer: ['employer', 'empleador', 'empresa'],
      role: ['role', 'puesto', 'cargo'], crew: ['crew', 'cuadrilla', 'equipo'],
      work_order: ['work_order', 'orden_de_trabajo', 'orden trabajo']
    };
    const normalized = rows.shift().map((header) => cleanText(header, 60).toLowerCase().replace(/\s+/g, '_'));
    const index = {};
    Object.entries(aliases).forEach(([key, choices]) => {
      index[key] = normalized.findIndex((header) => choices.includes(header));
    });
    if (index.worker_id < 0 || index.name < 0) {
      toast(bilingual('CSV needs worker_id and name columns', 'El CSV necesita las columnas worker_id y nombre'));
      return;
    }
    let added = 0;
    rows.forEach((values) => {
      const value = (key, max) => index[key] >= 0 ? cleanText(values[index[key]], max) : '';
      const id = value('worker_id', 40);
      const name = value('name', 100);
      if (!/^[A-Za-z0-9_-]{2,40}$/.test(id) || !name || M.W(id)) return;
      S().workers.push({
        id, name, face: avatarData(name), employer: value('employer', 120) || bilingual('Imported contractor', 'Contratista importado'),
        role: value('role', 100) || bilingual('Worker', 'Trabajador'), crew: value('crew', 80) || bilingual('Unassigned', 'Sin asignar'),
        workOrder: value('work_order', 80) || bilingual('Pending', 'Pendiente'), identity: false, refresher: false,
        task: false, orientation: false, notice: 0, approved: false, approvalKey: '', hold: false, checked: false
      });
      added += 1;
    });
    saveAndRender(bilingual(`${added} worker${added === 1 ? '' : 's'} imported`, `${added} trabajador${added === 1 ? '' : 'es'} importado${added === 1 ? '' : 's'}`));
  }

  function completeCourseSafely() {
    const assignment = S().assignments.find((item) => item.id === S().courseAssignment);
    if (!assignment) return;
    const answersCorrect = [0, 1, 2].every((index) =>
      document.querySelector(`input[name=q${index}]:checked`)?.value === 'ok');
    const acknowledged = Boolean(byId('ack')?.checked);
    const signature = cleanText(byId('signature')?.value, 120);
    const passed = answersCorrect && acknowledged && signature.length >= 2;
    assignment.quiz = passed ? 'passed' : 'failed';
    if (!passed) {
      saveAndRender(bilingual('Review the lesson and try again', 'Revise la lección e intente de nuevo'));
      return;
    }
    assignment.done = true;
    assignment.progress = 100;
    assignment.awaitingReview = true;
    assignment.certified = false;
    assignment.completedAt = nowIso();
    assignment.workerSignature = signature;
    const worker = M.W(assignment.worker);
    if (worker) {
      worker.approved = false;
      worker.approvalKey = '';
      worker.checked = false;
    }
    S().page = 'home';
    saveAndRender(bilingual('Completed — authorized review is required', 'Completado — se requiere revisión autorizada'));
  }

  function certifyAssignment(id) {
    const assignment = S().assignments.find((item) => item.id === id);
    const worker = assignment && M.W(assignment.worker);
    if (!assignment || !worker || !assignment.awaitingReview) return;
    const requiredRole = assignment.title === 'course1' ? 'mine' : 'employer';
    if (S().role !== requiredRole) {
      toast(requiredRole === 'mine'
        ? bilingual('Mine Safety must certify this completion', 'Seguridad de la mina debe certificar esta finalización')
        : bilingual('The employer must certify this completion', 'El empleador debe certificar esta finalización'));
      return;
    }
    if (assignment.title === 'course1') {
      worker.orientation = true;
      worker.notice = S().noticeVersion;
    } else if (assignment.title === 'course2') worker.refresher = true;
    else if (assignment.title === 'course3') worker.task = true;
    assignment.awaitingReview = false;
    assignment.certified = true;
    assignment.certifiedAt = nowIso();
    assignment.certifiedBy = S().role === 'mine' ? 'Mine Safety Demo' : 'Employer Admin Demo';
    worker.approved = false;
    worker.approvalKey = '';
    worker.checked = false;
    saveAndRender(bilingual('Training record certified', 'Registro de capacitación certificado'));
  }

  function approveWorker(worker) {
    if (S().role !== 'mine') {
      toast(bilingual('Only Mine Safety can approve site access', 'Solo Seguridad de la mina puede aprobar el acceso'));
      return;
    }
    if (worker.hold || !worker.identity || !worker.refresher || !worker.task || !worker.orientation || worker.notice !== S().noticeVersion) {
      toast(bilingual('Resolve every requirement before approval', 'Resuelva todos los requisitos antes de aprobar'));
      return;
    }
    worker.approved = true;
    worker.approvalKey = approvalKey(worker);
    worker.approvedAt = nowIso();
    worker.approvedBy = 'Mine Safety Demo';
    saveAndRender(bilingual('Site access approved for this assignment', 'Acceso al sitio aprobado para esta asignación'));
  }

  function checkInWorker(worker) {
    if (S().role !== 'mine' || M.status(worker) !== 'ready') {
      toast(bilingual('Worker is not ready for check-in', 'El trabajador no está listo para registrar entrada'));
      return;
    }
    worker.checked = true;
    worker.checkedAt = nowIso();
    saveAndRender(bilingual('Worker checked in', 'Entrada del trabajador registrada'));
  }

  function parseWorkerFromQr(raw) {
    const value = String(raw || '').trim();
    if (/^ZMR-[A-Za-z0-9_-]+$/i.test(value)) return value;
    try {
      const url = new URL(value);
      return url.searchParams.get('worker') || '';
    } catch { return ''; }
  }

  async function startScanner() {
    if (!window.isSecureContext || !navigator.mediaDevices?.getUserMedia || !('BarcodeDetector' in window)) {
      toast(bilingual('Camera scanning is unavailable here; use worker lookup', 'El escaneo con cámara no está disponible; use la búsqueda'));
      return;
    }
    const overlay = document.createElement('div');
    overlay.className = 'mr-scanner';
    overlay.innerHTML = `<div class="mr-scanner-card"><div class="section-head"><h2>${bilingual('Scan worker pass', 'Escanear pase del trabajador')}</h2><button class="btn" data-hard-action="close-scan">${bilingual('Close', 'Cerrar')}</button></div><video playsinline autoplay muted></video><p>${bilingual('Center the QR code in the camera view.', 'Centre el código QR en la vista de la cámara.')}</p></div>`;
    document.body.appendChild(overlay);
    let stream;
    let stopped = false;
    const stop = () => {
      stopped = true;
      stream?.getTracks().forEach((track) => track.stop());
      overlay.remove();
    };
    overlay.addEventListener('click', (event) => {
      if (event.target === overlay || event.target.closest('[data-hard-action="close-scan"]')) stop();
    });
    try {
      stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: { ideal: 'environment' } }, audio: false });
      const video = overlay.querySelector('video');
      video.srcObject = stream;
      await video.play();
      const detector = new BarcodeDetector({ formats: ['qr_code'] });
      const scan = async () => {
        if (stopped) return;
        try {
          const codes = await detector.detect(video);
          const id = codes.map((code) => parseWorkerFromQr(code.rawValue)).find((candidate) => M.W(candidate));
          if (id) {
            S().active = id;
            S().role = 'mine';
            S().page = 'gate';
            stop();
            saveAndRender(bilingual('Worker pass found', 'Pase del trabajador encontrado'));
            return;
          }
        } catch { }
        requestAnimationFrame(scan);
      };
      scan();
    } catch {
      stop();
      toast(bilingual('Camera permission was not granted', 'No se concedió permiso para la cámara'));
    }
  }

  function assignmentReviewMessage(assignment) {
    const mineOwned = assignment.title === 'course1';
    if (mineOwned) return bilingual('Awaiting Mine Safety review', 'Pendiente de revisión de Seguridad de la mina');
    return bilingual('Awaiting employer review', 'Pendiente de revisión del empleador');
  }

  function enhanceAssignments() {
    if (S().page !== 'training' || S().role === 'worker') return;
    const cards = [...document.querySelectorAll('.card.course')];
    cards.forEach((card, index) => {
      const assignment = S().assignments[index];
      if (!assignment?.awaitingReview) return;
      const status = card.querySelector('.status');
      if (status) {
        status.classList.remove('ready', 'blocked');
        status.classList.add('pending');
        status.textContent = assignmentReviewMessage(assignment);
      }
      const requiredRole = assignment.title === 'course1' ? 'mine' : 'employer';
      if (requiredRole === S().role && !card.querySelector('[data-hard-action="certify"]')) {
        const button = document.createElement('button');
        button.className = 'btn primary';
        button.dataset.hardAction = 'certify';
        button.dataset.assignment = assignment.id;
        button.textContent = bilingual('Review & certify', 'Revisar y certificar');
        card.appendChild(button);
      }
    });
  }

  function addReviewPanel() {
    if (!['mine', 'employer'].includes(S().role) || S().page !== 'today') return;
    const allowed = S().assignments.filter((assignment) => assignment.awaitingReview &&
      (assignment.title === 'course1' ? S().role === 'mine' : S().role === 'employer'));
    if (!allowed.length || byId('mrReviewPanel')) return;
    const panel = document.createElement('section');
    panel.id = 'mrReviewPanel';
    panel.className = 'card mr-review-panel';
    panel.innerHTML = `<div class="section-head"><div><h2>${bilingual('Training reviews', 'Revisiones de capacitación')}</h2><p>${allowed.length} ${bilingual('completion(s) require authorization', 'finalización(es) requieren autorización')}</p></div><button class="btn" data-page="training">${bilingual('Open training', 'Abrir capacitación')}</button></div>`;
    document.querySelector('.layout')?.appendChild(panel);
  }

  function enhanceBrand() {
    const mark = document.querySelector('.mark');
    if (mark && !mark.querySelector('img')) {
      mark.textContent = '';
      const image = document.createElement('img');
      image.src = './assets/icon.svg';
      image.alt = 'Zeroday';
      image.className = 'brand-logo';
      mark.appendChild(image);
    }
    document.querySelectorAll('img.avatar').forEach((image) => {
      if (!image.alt) image.alt = image.closest('.worker-row, .gate-card, .pass')?.querySelector('h2,h3')?.textContent?.trim() || bilingual('Worker portrait', 'Foto del trabajador');
    });
  }

  function enhanceWorkspaceSelector() {
    const topbar = document.querySelector('.topbar');
    if (!topbar || byId('mobileWorkspace')) return;
    const select = document.createElement('select');
    select.id = 'mobileWorkspace';
    select.className = 'mobile-workspace';
    select.setAttribute('aria-label', bilingual('Workspace', 'Espacio de trabajo'));
    select.innerHTML = `<option value="mine">${M.tx('mine')}</option><option value="employer">${M.tx('employer')}</option><option value="worker">${M.tx('worker')}</option>`;
    select.value = S().role;
    topbar.querySelector('.top-spacer')?.after(select);
  }

  function enhanceGate() {
    if (S().page !== 'gate' || S().role !== 'mine') return;
    const actions = document.querySelector('.gate-card .actions');
    if (actions && !actions.querySelector('[data-hard-action="scan"]')) {
      const button = document.createElement('button');
      button.className = 'btn';
      button.dataset.hardAction = 'scan';
      button.textContent = bilingual('Scan QR', 'Escanear QR');
      actions.prepend(button);
    }
  }

  function enhanceQr() {
    if (S().page !== 'pass' || S().role !== 'worker') return;
    const qr = document.querySelector('.qr');
    const worker = M.W(S().active);
    if (!qr || !worker || qr.dataset.real === 'true') return;
    qr.dataset.real = 'true';
    qr.innerHTML = '';
    const image = document.createElement('img');
    image.src = `./assets/qr/${encodeURIComponent(worker.id)}.png`;
    image.alt = bilingual(`QR pass for ${worker.name}`, `Pase QR de ${worker.name}`);
    image.width = 256;
    image.height = 256;
    qr.appendChild(image);
  }

  function filterAssignmentModal() {
    const select = byId('ac');
    if (!select || select.dataset.filtered === S().role) return;
    [...select.options].forEach((option) => {
      const allowed = S().role === 'mine' ? option.value === 'course1' : option.value !== 'course1';
      option.hidden = !allowed;
      option.disabled = !allowed;
    });
    const first = [...select.options].find((option) => !option.disabled);
    if (first && select.selectedOptions[0]?.disabled) select.value = first.value;
    select.dataset.filtered = S().role;
    const due = byId('ad');
    if (due) due.min = new Date().toISOString().slice(0, 10);
  }

  function enhance() {
    enhanceBrand();
    enhanceWorkspaceSelector();
    enhanceAssignments();
    addReviewPanel();
    enhanceGate();
    enhanceQr();
    filterAssignmentModal();
  }

  document.addEventListener('click', (event) => {
    const button = event.target.closest('button');
    if (!button) return;
    const originalAction = button.dataset.action;
    const hardAction = button.dataset.hardAction;

    if (originalAction === 'course-submit') {
      event.preventDefault(); event.stopImmediatePropagation(); completeCourseSafely(); return;
    }
    if (originalAction === 'approve') {
      event.preventDefault(); event.stopImmediatePropagation(); approveWorker(M.W(button.dataset.id)); return;
    }
    if (originalAction === 'checkin') {
      event.preventDefault(); event.stopImmediatePropagation(); checkInWorker(M.W(button.dataset.id)); return;
    }
    if (originalAction === 'export') {
      event.preventDefault(); event.stopImmediatePropagation(); exportCsv(); return;
    }
    if (hardAction === 'certify') {
      event.preventDefault(); event.stopImmediatePropagation(); certifyAssignment(button.dataset.assignment); return;
    }
    if (hardAction === 'scan') {
      event.preventDefault(); event.stopImmediatePropagation(); startScanner(); return;
    }
    if (button.dataset.role || button.dataset.lang || button.dataset.page || button.dataset.gate) {
      setTimeout(() => { enhance(); syncUrl(); }, 0);
    }
  }, true);

  document.addEventListener('change', (event) => {
    if (event.target.id === 'csvFile') {
      event.stopImmediatePropagation();
      const file = event.target.files?.[0];
      event.target.value = '';
      importCsv(file).catch(() => toast(bilingual('CSV import failed', 'Falló la importación del CSV')));
      return;
    }
    if (event.target.id === 'mobileWorkspace') {
      S().role = event.target.value;
      S().page = S().role === 'worker' ? 'home' : 'today';
      saveAndRender();
    }
  }, true);

  const observer = new MutationObserver(() => enhance());
  observer.observe(document.documentElement, { childList: true, subtree: true });

  normalizeState();
  applyUrlState();
  saveAndRender();
})();
