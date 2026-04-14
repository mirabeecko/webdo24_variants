/* ============================================================
   webdo24.cz v2 — JavaScript
   Multi-step form → n8n webhook
   ============================================================

   ⚙️  KONFIGURACE — POUZE TOTO POTŘEBUJEŠ ZMĚNIT:
   Nastav URL svého n8n webhoku níže.
   V n8n: Workflow → Add node → Webhook → Method: POST
   Zkopíruj "Webhook URL" a vlož sem.
   ============================================================ */

const N8N_WEBHOOK_URL = 'https://mirabeecko.app.n8n.cloud/webhook-test/web-intake';

/* ── COUNTDOWN TIMER ────────────────────────────────────────── */
function updateCountdown() {
  const now = new Date();
  const deadline = new Date();
  deadline.setHours(18, 0, 0, 0);
  if (now >= deadline) deadline.setDate(deadline.getDate() + 1);

  const diff = deadline - now;
  const h = Math.floor(diff / 3_600_000);
  const m = Math.floor((diff % 3_600_000) / 60_000);
  const s = Math.floor((diff % 60_000) / 1_000);
  const pad = n => String(n).padStart(2, '0');
  const str = `${pad(h)}:${pad(m)}:${pad(s)}`;

  ['countdown', 'countdownMini'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.textContent = str;
  });
}
setInterval(updateCountdown, 1000);
updateCountdown();

/* ── STICKY NAV ─────────────────────────────────────────────── */
const nav = document.getElementById('nav');
window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 60);
}, { passive: true });

/* ── HAMBURGER ──────────────────────────────────────────────── */
const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('navLinks');

hamburger.addEventListener('click', () => {
  const open = navLinks.classList.toggle('open');
  hamburger.setAttribute('aria-expanded', open);
});
navLinks.querySelectorAll('a').forEach(a => {
  a.addEventListener('click', () => navLinks.classList.remove('open'));
});
document.addEventListener('click', e => {
  if (!nav.contains(e.target)) navLinks.classList.remove('open');
});

/* ── SCROLL ANIMATIONS ──────────────────────────────────────── */
const fadeObs = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      fadeObs.unobserve(entry.target);
    }
  });
}, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });

document.querySelectorAll('.fade-up').forEach(el => {
  const rect = el.getBoundingClientRect();
  if (rect.top < window.innerHeight) el.classList.add('visible');
  else fadeObs.observe(el);
});

/* ── FAQ ACCORDION ──────────────────────────────────────────── */
document.querySelectorAll('.faq-q').forEach(btn => {
  btn.addEventListener('click', () => {
    const item = btn.closest('.faq-item');
    const isOpen = item.classList.contains('open');
    document.querySelectorAll('.faq-item').forEach(i => i.classList.remove('open'));
    if (!isOpen) item.classList.add('open');
  });
});

/* ══════════════════════════════════════════════════════════════
   MULTI-STEP FORM
══════════════════════════════════════════════════════════════ */

const steps = Array.from(document.querySelectorAll('.msf-step'));
const totalSteps = steps.length;
let current = 0; // 0-indexed

const msfBar = document.getElementById('msfBar');
const msfCurrent = document.getElementById('msfCurrent');
const msfTotal = document.getElementById('msfTotal');
const msfLabel = document.getElementById('msfStepLabel');
const msfPrev = document.getElementById('msfPrev');
const msfNext = document.getElementById('msfNext');
const msfSubmit = document.getElementById('msfSubmit');
const msfForm = document.getElementById('msfForm');
const msfWrap = document.getElementById('msfWrap');
const msfSuccess = document.getElementById('msfSuccess');

if (msfTotal) msfTotal.textContent = totalSteps;

/* Update UI for current step */
function goToStep(index) {
  steps.forEach((s, i) => s.classList.toggle('active', i === index));

  // Progress bar
  const pct = totalSteps > 1 ? (index / (totalSteps - 1)) * 100 : 100;
  if (msfBar) msfBar.style.width = `${pct}%`;
  if (msfCurrent) msfCurrent.textContent = index + 1;
  if (msfLabel) msfLabel.textContent = steps[index].dataset.label || '';

  // Buttons
  msfPrev.style.visibility = index === 0 ? 'hidden' : 'visible';

  if (index === totalSteps - 1) {
    msfNext.style.display = 'none';
    msfSubmit.style.display = 'flex';
  } else {
    msfNext.style.display = 'flex';
    msfSubmit.style.display = 'none';
  }

  current = index;
}

/* Validate current step before advancing */
function validateStep(index) {
  const step = steps[index];
  let valid = true;

  // Clear previous errors
  step.querySelectorAll('.error-msg').forEach(el => el.remove());
  step.querySelectorAll('.field-error').forEach(el => el.classList.remove('field-error'));

  // Required text/email/tel inputs
  step.querySelectorAll('input[required], textarea[required]').forEach(input => {
    if (!input.value.trim()) {
      markError(input);
      valid = false;
    }
    if (input.type === 'email' && input.value && !input.value.includes('@')) {
      markError(input, 'Zadejte platný e-mail');
      valid = false;
    }
  });

  // Required pill groups (at least one checked)
  step.querySelectorAll('.pill-group[data-required]').forEach(group => {
    const checked = group.querySelector('input:checked');
    if (!checked) {
      showGroupError(group, 'Vyberte alespoň jednu možnost');
      valid = false;
    }
  });

  // Step-specific required checks
  const stepNum = parseInt(step.dataset.step);

  if (stepNum === 1) {
    const firma = step.querySelector('[name=firma]');
    if (!firma.value.trim()) { markError(firma); valid = false; }
  }

  if (stepNum === 2) {
    const p1 = step.querySelector('[name=prodej_1]');
    if (!p1.value.trim()) { markError(p1, 'Zadejte alespoň první položku'); valid = false; }
  }

  if (stepNum === 5) {
    const d1 = step.querySelector('[name=duvod_1]');
    if (!d1.value.trim()) { markError(d1, 'Zadejte alespoň první důvod'); valid = false; }
  }

  if (stepNum === 6) {
    const udaje = step.querySelector('[name=kontakt_udaje]');
    if (!udaje.value.trim()) { markError(udaje); valid = false; }
  }

  if (stepNum === 9) {
    const name = step.querySelector('[name=kontakt_jmeno]');
    const email = step.querySelector('[name=kontakt_email]');
    if (!name.value.trim()) { markError(name); valid = false; }
    if (!email.value.trim()) { markError(email); valid = false; }
    else if (!email.value.includes('@')) { markError(email, 'Zadejte platný e-mail'); valid = false; }
  }

  return valid;
}

function markError(input, msg = 'Toto pole je povinné') {
  const wrap = input.closest('.msf-field') || input.parentElement;
  if (wrap) wrap.classList.add('field-error');
  const err = document.createElement('p');
  err.className = 'error-msg';
  err.textContent = msg;
  input.after(err);
  input.addEventListener('input', () => {
    wrap.classList.remove('field-error');
    err.remove();
  }, { once: true });
}

function showGroupError(group, msg) {
  const err = document.createElement('p');
  err.className = 'error-msg';
  err.textContent = msg;
  group.after(err);
  group.addEventListener('change', () => err.remove(), { once: true });
}

/* Navigation */
msfNext.addEventListener('click', () => {
  if (!validateStep(current)) return;
  if (current < totalSteps - 1) goToStep(current + 1);
});

msfPrev.addEventListener('click', () => {
  if (current > 0) goToStep(current - 1);
});

/* Collect all form data */
function collectFormData() {
  const data = {
    odeslano: new Date().toISOString(),
    zdroj: window.location.href,
  };

  const fd = new FormData(msfForm);

  // Multi-value fields (checkboxes)
  const multiFields = ['nabidka_typ', 'kontakt_typ'];
  multiFields.forEach(name => {
    const values = fd.getAll(name);
    data[name] = values.length ? values.join(', ') : '';
  });

  // Single-value fields
  for (const [key, value] of fd.entries()) {
    if (!multiFields.includes(key)) {
      data[key] = value;
    }
  }

  // Resolve "__custom__" radio for cíl webu
  if (data.cil === '__custom__') {
    data.cil = data.cil_custom || 'vlastní (nevyplněno)';
  }
  delete data.cil_custom;

  return data;
}

/* Submit to n8n */
msfForm.addEventListener('submit', async e => {
  e.preventDefault();
  if (!validateStep(current)) return;

  msfSubmit.textContent = 'Odesílám…';
  msfSubmit.disabled = true;

  const payload = collectFormData();

  try {
    const res = await fetch(N8N_WEBHOOK_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    if (res.ok || res.status === 0) {
      // status 0 = no-cors mode, assume success
      showSuccess();
    } else {
      throw new Error(`HTTP ${res.status}`);
    }
  } catch (err) {
    console.error('n8n webhook error:', err);
    // Fallback: still show success to user, log error
    // In production you might want to store locally or try again
    showSuccess();
  }
});

function showSuccess() {
  msfForm.style.display = 'none';
  msfSuccess.style.display = 'block';
  msfWrap.querySelector('.msf-header').style.display = 'none';

  // Scroll to success
  msfWrap.scrollIntoView({ behavior: 'smooth', block: 'center' });
}

/* Init */
goToStep(0);

/* ── SMOOTH SCROLL ──────────────────────────────────────────── */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const href = this.getAttribute('href');
    if (href === '#') return;
    const target = document.querySelector(href);
    if (!target) return;
    e.preventDefault();
    const offset = nav.offsetHeight + 12;
    const top = target.getBoundingClientRect().top + window.scrollY - offset;
    window.scrollTo({ top, behavior: 'smooth' });
  });
});
