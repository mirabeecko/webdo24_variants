/* ============================================================
   webdo24.cz V7 — JavaScript
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
const hamburger = document.getElementById('hamburger');
const navLinks  = document.getElementById('navLinks');

if (hamburger && navLinks) {
  hamburger.addEventListener('click', () => {
    const isOpen = navLinks.classList.toggle('open');
    hamburger.setAttribute('aria-expanded', isOpen);
  });

  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('open');
      hamburger.setAttribute('aria-expanded', 'false');
    });
  });

  document.addEventListener('click', (e) => {
    if (!nav.contains(e.target)) {
      navLinks.classList.remove('open');
      hamburger.setAttribute('aria-expanded', 'false');
    }
  });
}


/* ── SCROLL ANIMATIONS ──────────────────────────────────────── */
const fadeObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      fadeObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });

document.querySelectorAll('.fade-up').forEach(el => {
  const rect = el.getBoundingClientRect();
  if (rect.top < window.innerHeight) {
    el.classList.add('visible');
  } else {
    fadeObserver.observe(el);
  }
});


/* ── FAQ ACCORDION ──────────────────────────────────────────── */
document.querySelectorAll('.faq-q').forEach(btn => {
  btn.addEventListener('click', () => {
    const item   = btn.closest('.faq-item');
    const isOpen = item.classList.contains('open');
    document.querySelectorAll('.faq-item').forEach(i => i.classList.remove('open'));
    if (!isOpen) item.classList.add('open');
  });
});


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
          body: JSON.stringify({ ...data, variant: 'v7', timestamp: new Date().toISOString() }),
        });
      } else {
        // Fallback: přesměrování na mailto (dokud není webhook nastaven)
        const subject = encodeURIComponent('Nová poptávka – webdo24');
        const body    = encodeURIComponent(
          Object.entries(data).map(([k, v]) => `${k}: ${v}`).join('\n')
        );
        window.location.href = `mailto:info@webdo24.cz?subject=${subject}&body=${body}`;
        return;
      }

      submitBtn.style.display = 'none';
      if (successEl) {
        successEl.style.display = 'block';
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
