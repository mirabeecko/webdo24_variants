/* ============================================================
   webdo24.cz — JavaScript
   ============================================================ */

/* ── COUNTDOWN TIMER ────────────────────────────────────────── */
function updateCountdown() {
  const now      = new Date();
  const deadline = new Date();
  deadline.setHours(18, 0, 0, 0);

  // Pokud je již po 18:00, ukazuj do zítřejší 18:00
  if (now >= deadline) {
    deadline.setDate(deadline.getDate() + 1);
  }

  const diff = deadline - now;
  const h = Math.floor(diff / 3_600_000);
  const m = Math.floor((diff % 3_600_000) / 60_000);
  const s = Math.floor((diff % 60_000) / 1_000);
  const pad = (n) => String(n).padStart(2, '0');
  const str = `${pad(h)}:${pad(m)}:${pad(s)}`;

  const el1 = document.getElementById('countdown');
  const el2 = document.getElementById('countdownMini');
  if (el1) el1.textContent = str;
  if (el2) el2.textContent = str;
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

hamburger.addEventListener('click', () => {
  const isOpen = navLinks.classList.toggle('open');
  hamburger.setAttribute('aria-expanded', isOpen);
});

// Zavřít po kliknutí na odkaz
navLinks.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    navLinks.classList.remove('open');
    hamburger.setAttribute('aria-expanded', 'false');
  });
});

// Zavřít při kliknutí mimo
document.addEventListener('click', (e) => {
  if (!nav.contains(e.target)) {
    navLinks.classList.remove('open');
  }
});


/* ── SCROLL ANIMATIONS (IntersectionObserver) ───────────────── */
const fadeObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      fadeObserver.unobserve(entry.target); // stačí jednou
    }
  });
}, {
  threshold: 0.08,
  rootMargin: '0px 0px -40px 0px'
});

// Registruj hned po načtení
document.querySelectorAll('.fade-up').forEach(el => fadeObserver.observe(el));

// Pokud je element nad foldem při načtení, zobraz ho hned
document.querySelectorAll('.fade-up').forEach(el => {
  const rect = el.getBoundingClientRect();
  if (rect.top < window.innerHeight) {
    el.classList.add('visible');
  }
});


/* ── FAQ ACCORDION ──────────────────────────────────────────── */
document.querySelectorAll('.faq-q').forEach(btn => {
  btn.addEventListener('click', () => {
    const item   = btn.closest('.faq-item');
    const isOpen = item.classList.contains('open');

    // Zavři všechny
    document.querySelectorAll('.faq-item').forEach(i => i.classList.remove('open'));

    // Otevři kliknutý (pokud byl zavřený)
    if (!isOpen) item.classList.add('open');
  });
});


/* ── KONTAKTNÍ FORMULÁŘ ─────────────────────────────────────── */
const form      = document.getElementById('contactForm');
const submitBtn = document.getElementById('submitBtn');
const successEl = document.getElementById('formSuccess');

form.addEventListener('submit', (e) => {
  e.preventDefault();

  // Jednoduchá validace
  const name  = form.querySelector('[name=name]').value.trim();
  const email = form.querySelector('[name=email]').value.trim();
  const about = form.querySelector('[name=about]').value.trim();

  if (!name || !email || !about) {
    // Highlight chybějících polí
    [form.querySelector('[name=name]'), form.querySelector('[name=email]'), form.querySelector('[name=about]')]
      .forEach(field => {
        if (!field.value.trim()) {
          field.style.borderColor = '#f87171';
          field.addEventListener('input', () => { field.style.borderColor = ''; }, { once: true });
        }
      });
    return;
  }

  submitBtn.textContent = 'Odesílám…';
  submitBtn.disabled    = true;

  // Simulace odeslání (zde by byl fetch na backend)
  setTimeout(() => {
    submitBtn.style.display = 'none';
    successEl.style.display = 'block';
    form.reset();

    // Scroll na potvrzení
    successEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }, 900);
});


/* ── SMOOTH SCROLL pro kotvy ────────────────────────────────── */
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


/* ── ČÍSLA — animovaný counter ──────────────────────────────── */
function animateCounter(el, target, suffix, duration = 1400) {
  const start = performance.now();
  const update = (now) => {
    const progress = Math.min((now - start) / duration, 1);
    const eased    = 1 - Math.pow(1 - progress, 3); // ease-out cubic
    const value    = Math.round(eased * target);
    el.textContent = value + suffix;
    if (progress < 1) requestAnimationFrame(update);
  };
  requestAnimationFrame(update);
}

const statsObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    statsObserver.unobserve(entry.target);

    entry.target.querySelectorAll('[data-count]').forEach(el => {
      const target = parseFloat(el.dataset.count);
      const suffix = el.dataset.suffix || '';
      animateCounter(el, target, suffix);
    });
  });
}, { threshold: 0.3 });

const statsSection = document.querySelector('.stats-grid');
if (statsSection) statsObserver.observe(statsSection);


/* ── DATA ATRIBUTY pro counter ───────────────────────────────── */
// Nastav data-count a data-suffix na .stat-num span dynamicky
document.addEventListener('DOMContentLoaded', () => {
  const counters = [
    { selector: '.stats-grid .stat-item:nth-child(1) .stat-num', count: 200, suffix: '+' },
    { selector: '.stats-grid .stat-item:nth-child(3) .stat-num', count: 24,  suffix: 'h' },
    { selector: '.stats-grid .stat-item:nth-child(7) .stat-num', count: 100, suffix: '%' },
  ];
  // Poznámka: animace čísla 4,9 je vynechána záměrně — desetinné číslo by blikalo
});
