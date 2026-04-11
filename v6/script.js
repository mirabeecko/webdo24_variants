/* ============================================================
   webdo24.cz V6 — JavaScript
   ============================================================ */

/* ── KONFIGURACE ─────────────────────────────────────────────
   Sem vlož URL svého webhooků před nasazením na produkci.
   Podporované služby: n8n, Make.com, Zapier, vlastní backend.
   Příklad: 'https://hook.eu1.make.com/abc123xyz'
─────────────────────────────────────────────────────────── */
const WEBHOOK_URL = '';


/* ── COUNTDOWN TIMER ────────────────────────────────────────── */
function updateCountdown() {
  const now      = new Date();
  const deadline = new Date();
  deadline.setHours(18, 0, 0, 0);
  if (now >= deadline) deadline.setDate(deadline.getDate() + 1);

  const diff = deadline - now;
  const h    = Math.floor(diff / 3_600_000);
  const m    = Math.floor((diff % 3_600_000) / 60_000);
  const s    = Math.floor((diff % 60_000) / 1_000);
  const pad  = (n) => String(n).padStart(2, '0');
  const str  = `${pad(h)}:${pad(m)}:${pad(s)}`;

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


/* ── HAMBURGER MENU ─────────────────────────────────────────── */
const navBurger = document.getElementById('navBurger');
const navLinks  = document.getElementById('navLinks');

if (navBurger && navLinks) {
  navBurger.addEventListener('click', () => {
    const isOpen = navLinks.classList.toggle('open');
    navBurger.setAttribute('aria-expanded', isOpen);
  });

  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('open');
      navBurger.setAttribute('aria-expanded', 'false');
    });
  });

  document.addEventListener('click', (e) => {
    if (!nav.contains(e.target)) {
      navLinks.classList.remove('open');
      navBurger.setAttribute('aria-expanded', 'false');
    }
  });
}


/* ── SCROLL ANIMATIONS ──────────────────────────────────────── */
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });

document.querySelectorAll('.fade-up, .reveal').forEach(el => {
  const rect = el.getBoundingClientRect();
  if (rect.top < window.innerHeight) {
    el.classList.add('visible');
  } else {
    revealObserver.observe(el);
  }
});


/* ── FAQ ACCORDION ──────────────────────────────────────────── */
document.querySelectorAll('.faq-q').forEach(btn => {
  btn.addEventListener('click', () => {
    const item   = btn.closest('.faq-item');
    const isOpen = item.classList.contains('open');
    document.querySelectorAll('.faq-item').forEach(i => {
      i.classList.remove('open');
      i.querySelector('.faq-q')?.setAttribute('aria-expanded', 'false');
    });
    if (!isOpen) {
      item.classList.add('open');
      btn.setAttribute('aria-expanded', 'true');
    }
  });
});


/* ── ANIMOVANÝ COUNTER (hero stats) ─────────────────────────── */
function animateCounter(el, target, duration = 1600) {
  const start  = performance.now();
  const isFloat = !Number.isInteger(target);
  const update = (now) => {
    const progress = Math.min((now - start) / duration, 1);
    const eased    = 1 - Math.pow(1 - progress, 3);
    const value    = eased * target;
    el.textContent = isFloat ? value.toFixed(1) : Math.round(value);
    if (progress < 1) requestAnimationFrame(update);
  };
  requestAnimationFrame(update);
}

const heroCounterObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    heroCounterObserver.unobserve(entry.target);
    entry.target.querySelectorAll('.counter[data-target]').forEach(el => {
      animateCounter(el, parseFloat(el.dataset.target));
    });
  });
}, { threshold: 0.4 });

const heroStats = document.querySelector('.hero-stats');
if (heroStats) heroCounterObserver.observe(heroStats);


/* ── ROI KALKULÁTOR ─────────────────────────────────────────── */
const calcValue   = document.getElementById('calcValue');
const calcClients = document.getElementById('calcClients');

function updateCalc() {
  if (!calcValue || !calcClients) return;

  const value   = parseInt(calcValue.value, 10);
  const clients = parseInt(calcClients.value, 10);
  const annual  = value * clients * 12;
  const invest  = 12_900 + 1_990 * 12; // základ + Růst/rok
  const roi     = Math.round((annual - invest) / invest * 100);

  const fmt = (n) => n.toLocaleString('cs-CZ') + ' Kč';

  const valOut     = document.getElementById('calcValueOut');
  const clientsOut = document.getElementById('calcClientsOut');
  const revenue    = document.getElementById('calcRevenue');
  const roiEl      = document.getElementById('calcRoi');

  if (valOut)     valOut.textContent     = value.toLocaleString('cs-CZ');
  if (clientsOut) clientsOut.textContent = clients;
  if (revenue)    revenue.textContent    = fmt(annual);
  if (roiEl)      roiEl.textContent      = roi.toLocaleString('cs-CZ') + ' %';
}

if (calcValue)   calcValue.addEventListener('input', updateCalc);
if (calcClients) calcClients.addEventListener('input', updateCalc);
updateCalc();


/* ── SOCIAL PROOF TOAST ─────────────────────────────────────── */
const toastData = [
  { name: 'Tomáš N.', msg: 'Právě objednal revenue machine', avatar: 'TN' },
  { name: 'Markéta K.', msg: 'Spustila Growth balíček dnes', avatar: 'MK' },
  { name: 'Pavel S.', msg: 'Web schválen — spouštíme za hodinu', avatar: 'PS' },
  { name: 'Jana H.', msg: 'Přišla první poptávka přes nový web', avatar: 'JH' },
  { name: 'Radek M.', msg: 'Scale balíček — aktivován', avatar: 'RM' },
];

function showToast() {
  const toast    = document.getElementById('spToast');
  const nameEl   = document.getElementById('spName');
  const msgEl    = document.getElementById('spMsg');
  const avatarEl = document.getElementById('spAvatar');
  const closeBtn = document.getElementById('spClose');
  if (!toast) return;

  const item = toastData[Math.floor(Math.random() * toastData.length)];
  if (nameEl)   nameEl.textContent   = item.name;
  if (msgEl)    msgEl.textContent    = item.msg;
  if (avatarEl) avatarEl.textContent = item.avatar;

  toast.classList.add('visible');

  let hideTimer = setTimeout(() => toast.classList.remove('visible'), 4000);

  if (closeBtn) {
    closeBtn.onclick = () => {
      clearTimeout(hideTimer);
      toast.classList.remove('visible');
    };
  }
}

// Zobrazit po 6 s, pak každých 25 s
setTimeout(() => {
  showToast();
  setInterval(showToast, 25_000);
}, 6_000);


/* ── KONTAKTNÍ FORMULÁŘ ─────────────────────────────────────── */
const form      = document.getElementById('contactForm');
const submitBtn = document.getElementById('submitBtn');
const successEl = document.getElementById('formSuccess');

if (form) {
  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    // Validace povinných polí
    const requiredFields = form.querySelectorAll('[required]');
    let valid = true;
    requiredFields.forEach(field => {
      if (!field.value.trim()) {
        valid = false;
        field.style.borderColor = '#f87171';
        field.addEventListener('input', () => { field.style.borderColor = ''; }, { once: true });
      }
    });
    if (!valid) return;

    submitBtn.textContent = 'Odesílám…';
    submitBtn.disabled    = true;

    const data = Object.fromEntries(new FormData(form));

    try {
      if (WEBHOOK_URL) {
        await fetch(WEBHOOK_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ...data, variant: 'v6', timestamp: new Date().toISOString() }),
        });
      } else {
        // Fallback: přesměrování na mailto (dokud není webhook nastaven)
        const subject = encodeURIComponent('Nová poptávka – webdo24 V6');
        const body    = encodeURIComponent(
          Object.entries(data).map(([k, v]) => `${k}: ${v}`).join('\n')
        );
        window.location.href = `mailto:info@webdo24.cz?subject=${subject}&body=${body}`;
        return;
      }

      submitBtn.style.display = 'none';
      if (successEl) {
        successEl.removeAttribute('hidden');
        successEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      form.reset();

    } catch (err) {
      submitBtn.textContent = 'Chyba — zkuste znovu';
      submitBtn.disabled    = false;
      console.error('Form submission error:', err);
    }
  });
}


/* ── SMOOTH SCROLL ──────────────────────────────────────────── */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const href   = this.getAttribute('href');
    if (href === '#') return;
    const target = document.querySelector(href);
    if (!target) return;
    e.preventDefault();
    const offset = nav.offsetHeight + 12;
    const top    = target.getBoundingClientRect().top + window.scrollY - offset;
    window.scrollTo({ top, behavior: 'smooth' });
  });
});
