/* ============================================================
   webdo24.cz v4 — JavaScript
   Cílová skupina: startupy, founders, mladí zakladatelé
   ============================================================ */

/* ── CONFIG ─────────────────────────────────────────────────── */
const N8N_WEBHOOK_URL = 'https://mirabeecko.app.n8n.cloud/webhook/web-intake';
const TOTAL_STEPS = 9;


/* ── SCARCITY COUNTER ───────────────────────────────────────── */
(function initScarcity() {
  const day = new Date().getDay(); // 0=Sun..6=Sat
  const slots = [3, 3, 2, 2, 1, 1, 3];
  const el = document.getElementById('slotsLeft');
  if (el) el.textContent = slots[day];
})();


/* ── COUNTDOWN ──────────────────────────────────────────────── */
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
if (nav) {
  window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 60);
  }, { passive: true });
}


/* ── HAMBURGER MENU ─────────────────────────────────────────── */
const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('navLinks');
if (hamburger && navLinks) {
  hamburger.addEventListener('click', () => {
    const isOpen = navLinks.classList.toggle('open');
    hamburger.setAttribute('aria-expanded', isOpen);
  });
  navLinks.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => {
      navLinks.classList.remove('open');
      hamburger.setAttribute('aria-expanded', 'false');
    });
  });
}


/* ── FAQ ACCORDION ──────────────────────────────────────────── */
document.querySelectorAll('.faq-item').forEach(item => {
  const btn = item.querySelector('.faq-q');
  if (!btn) return;
  btn.addEventListener('click', () => {
    const isOpen = item.classList.toggle('open');
    btn.setAttribute('aria-expanded', isOpen);
    document.querySelectorAll('.faq-item').forEach(other => {
      if (other !== item) {
        other.classList.remove('open');
        const ob = other.querySelector('.faq-q');
        if (ob) ob.setAttribute('aria-expanded', 'false');
      }
    });
  });
});


/* ── SCROLL ANIMATIONS ──────────────────────────────────────── */
const scrollObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      scrollObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

// Only observe elements outside the hero (hero uses CSS animation)
document.querySelectorAll('.fade-up').forEach(el => {
  if (!el.closest('.hero')) scrollObserver.observe(el);
});


/* ── SOCIAL PROOF POPUP ─────────────────────────────────────── */
const spNotifications = [
  { name: 'Marek', city: 'Prahy', action: 'právě spustil startup landing page', color: 'linear-gradient(135deg,#7c3aed,#3b82f6)' },
  { name: 'Lucie', city: 'Brna', action: 'odeslala poptávku pro e-shop', color: 'linear-gradient(135deg,#ec4899,#f97316)' },
  { name: 'Tomáš', city: 'Ostravy', action: 'má web hotový za 19 hodin', color: 'linear-gradient(135deg,#22c55e,#3b82f6)' },
  { name: 'Eva', city: 'Plzně', action: 'dostala 3 poptávky v první den', color: 'linear-gradient(135deg,#f97316,#facc15)' },
];

let spIndex = 0;
let spDismissed = false;
let spHideTimer = null;
let spAutoTimer = null;

const spPopup = document.getElementById('spPopup');
const spClose = document.getElementById('spClose');
const spAvatar = document.getElementById('spAvatar');
const spName = document.getElementById('spName');
const spAction = document.getElementById('spAction');

function showSpNotification(idx) {
  if (spDismissed || !spPopup) return;
  const n = spNotifications[idx % spNotifications.length];
  spAvatar.textContent = n.name.slice(0, 2).toUpperCase();
  spAvatar.style.background = n.color;
  spName.textContent = `${n.name} z ${n.city}`;
  spAction.textContent = n.action;
  spPopup.classList.remove('sp-hiding');
  spPopup.classList.add('sp-visible');
  clearTimeout(spHideTimer);
  spHideTimer = setTimeout(hideSpPopup, 5000);
}

function hideSpPopup() {
  if (!spPopup) return;
  spPopup.classList.add('sp-hiding');
  setTimeout(() => spPopup.classList.remove('sp-visible', 'sp-hiding'), 400);
}

if (spClose) {
  spClose.addEventListener('click', () => {
    spDismissed = true;
    clearTimeout(spHideTimer);
    clearInterval(spAutoTimer);
    hideSpPopup();
  });
}

setTimeout(() => {
  if (!spDismissed) {
    showSpNotification(spIndex);
    spAutoTimer = setInterval(() => {
      spIndex = (spIndex + 1) % spNotifications.length;
      showSpNotification(spIndex);
    }, 15000);
  }
}, 8000);


/* ══════════════════════════════════════════════════════════════
   MULTI-STEP FORM
══════════════════════════════════════════════════════════════ */
let currentStep = 1;

/* ── Pill groups ───────────────────────────────────────────── */
function initPillGroups() {
  document.querySelectorAll('.pill-group').forEach(group => {
    const isSingle = group.dataset.single === 'true';
    const hiddenName = group.dataset.name;
    const hiddenInput = document.querySelector(`input[name="${hiddenName}"]`);

    group.querySelectorAll('.pill').forEach(pill => {
      pill.addEventListener('click', () => {
        if (isSingle) {
          group.querySelectorAll('.pill').forEach(p => p.classList.remove('active'));
        }
        pill.classList.toggle('active');

        // Update hidden input value
        if (hiddenInput) {
          if (isSingle) {
            hiddenInput.value = pill.classList.contains('active') ? pill.dataset.value : '';
          } else {
            // multi-select: collect all active pills
            const active = [...group.querySelectorAll('.pill.active')].map(p => p.dataset.value);
            hiddenInput.value = active.join(', ');
          }
        }

        // Show custom input when "Jiné" selected in CTA group
        if (group.id === 'ctaPillGroup' && isSingle) {
          const customInput = document.getElementById('q14custom');
          if (customInput) {
            customInput.style.display = pill.dataset.value === 'Jiné' && pill.classList.contains('active')
              ? 'block' : 'none';
          }
        }
      });
    });
  });
}
initPillGroups();


/* ── Step navigation ───────────────────────────────────────── */
function goToStep(n) {
  if (n < 1 || n > TOTAL_STEPS) return;

  // Validate required fields before moving forward
  if (n > currentStep) {
    const activeStep = document.querySelector(`.form-step[data-step="${currentStep}"]`);
    if (activeStep) {
      const required = activeStep.querySelectorAll('[required]');
      let valid = true;
      required.forEach(field => {
        field.classList.remove('invalid');
        if (!field.value.trim()) {
          field.classList.add('invalid');
          if (valid) field.focus();
          valid = false;
        }
      });
      if (!valid) return;
    }
  }

  document.querySelectorAll('.form-step').forEach(s => s.classList.remove('active'));
  const target = document.querySelector(`.form-step[data-step="${n}"]`);
  if (target) {
    target.classList.add('active');
    currentStep = n;
    updateStepper();
    const shell = document.getElementById('formWrapper');
    if (shell) shell.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
}

function updateStepper() {
  const pct = Math.round((currentStep / TOTAL_STEPS) * 100);
  const fill = document.getElementById('stepperFill');
  const num = document.getElementById('currentStepNum');
  const pctEl = document.getElementById('stepperPct');
  if (fill) fill.style.width = `${pct}%`;
  if (num) num.textContent = currentStep;
  if (pctEl) pctEl.textContent = `${pct} %`;
}
updateStepper();

// Clear invalid class on input
document.querySelectorAll('input, textarea').forEach(el => {
  el.addEventListener('input', () => el.classList.remove('invalid'));
});

window.goToStep = goToStep;


/* ── AI Prompt Generator ────────────────────────────────────── */
function generateAIPrompt(d) {
  const v = x => (x && String(x).trim()) ? String(x).trim() : '—';
  const today = new Date().toLocaleDateString('cs-CZ', { day: 'numeric', month: 'long', year: 'numeric' });

  return `# BRIEF PRO TVORBU WEBU: ${v(d.firma.nazev)}
Vygenerováno: ${today}

## ZADÁNÍ
Vytvoř maximálně konverzní landing page. Každá sekce odpovídá na "co z toho mám já?".
Piš z pohledu zákazníka, ne firmy. Cílová skupina: ${v(d.zakaznik.popis)}.

## FIRMA & IDENTITA
Název:     ${v(d.firma.nazev)}
Co dělají: ${v(d.firma.cinnost)}
Kde:       ${v(d.firma.pusobnost)}

## UNIKÁTNÍ HODNOTA (UVP)
Proč si vybírají právě tuto firmu: ${v(d.uvp.duvod_vyberu)}
Jedinečná pozice: "Jsme jediní, kdo ${v(d.uvp.jedinecnost)}"

## CÍLOVÝ ZÁKAZNÍK
Kdo je:                ${v(d.zakaznik.popis)}
Problém PŘED:          ${v(d.zakaznik.problem_pred)}
Výsledek PO:           ${v(d.zakaznik.vysledek_po)}

## NABÍDKA
Služby/produkty:
${d.nabidka.sluzby.filter(Boolean).map((s, i) => `  ${i + 1}. ${s}`).join('\n') || '  —'}
Hero offer: ${v(d.nabidka.hero_offer)}
Cena:       ${v(d.nabidka.cena)}

## SOCIAL PROOF
Čísla: ${v(d.social_proof.cisla)}
Reference: ${v(d.social_proof.reference)}

## KONVERZNÍ CÍL
Hlavní akce: ${v(d.konverze.hlavni_cta)}${d.konverze.cta_custom ? ' — ' + v(d.konverze.cta_custom) : ''}
Kontakt na webu: ${v(d.konverze.kontaktni_udaje)}
Lead magnet: ${v(d.konverze.vstupni_nabidka)}

## BRAND VOICE
Tón:          ${v(d.brand.ton)}
Brand slova:  ${v(d.brand.klic_slova)}
Vyhnout se:   ${v(d.brand.vyhnout_se)}

## DESIGN
Styl:        ${v(d.design.styl)}
Inspirace:   ${v(d.design.vzor_web)}
Podklady:    ${v(d.design.materialy)}

## INSTRUKCE PRO AI

### Povinná struktura stránky:
1.  URGENCY BAR — scarcity nebo časová nabídka
2.  NAVIGACE — logo + CTA tlačítko
3.  HERO — outcome headline, 3 bullet UVP, 2 CTA, social proof čísla
4.  SOCIAL PROOF STRIP — klíčová čísla z "Social proof"
5.  PROBLÉM/ŘEŠENÍ — before/after zákazníka
6.  NABÍDKA — 3 varianty, střední zvýrazněná
7.  JAK TO FUNGUJE — 3 jednoduché kroky
8.  DIFERENCIACE — "Proč my" (z UVP a jedinečné pozice)
9.  TESTIMONIALS — reálné citace
10. GARANCE — risk reversal
11. FAQ — 5 nejčastějších námitek
12. ZÁVĚREČNÉ CTA + FORMULÁŘ
13. FOOTER

### Copywriting:
- Headline: konkrétní outcome ("Získej X za Y" ne "Jsme nejlepší")
- CTA: aktivní ("Chci X →" ne "Odeslat")
- Eliminuj: "profesionální, komplexní, individuální přístup"
- Piš slovy zákazníka, ne firmy

### Tech:
- Čistý HTML/CSS/JS, žádné frameworky
- Mobile-first, dark theme (pokud styl není jiný)
- Konverzní formulář s validací`;
}


/* ── Webhook Payload Builder ────────────────────────────────── */
function buildPayload(formData) {
  /*
   * Strukturovaný payload — ne plochý objekt s q1..q22,
   * ale vnořené sekce odpovídající sémantice dat.
   * n8n přistupuje k hodnotám např. jako:
   *   {{ $json.firma.nazev }}
   *   {{ $json.kontakt.email }}
   *   {{ $json.nabidka.sluzby[0] }}
   */
  const get = key => (formData[key] || '').trim();

  const data = {
    kontakt: {
      jmeno: get('kontakt_jmeno'),
      email: get('kontakt_email'),
      telefon: get('kontakt_telefon'),
      urgence: get('urgence'),
    },
    firma: {
      nazev: get('q1'),
      cinnost: get('q2'),
      pusobnost: get('q3'),
    },
    uvp: {
      duvod_vyberu: get('q4'),
      jedinecnost: get('q5'),
    },
    zakaznik: {
      popis: get('q6'),
      problem_pred: get('q7'),
      vysledek_po: get('q8'),
    },
    nabidka: {
      sluzby: [get('q9a'), get('q9b'), get('q9c')].filter(Boolean),
      hero_offer: get('q10'),
      cena: get('q11'),
    },
    social_proof: {
      cisla: get('q12'),
      reference: get('q13'),
    },
    konverze: {
      hlavni_cta: get('q14'),
      cta_custom: get('q14_custom'),
      kontaktni_udaje: get('q15'),
      vstupni_nabidka: get('q16'),
    },
    brand: {
      ton: get('q17'),
      klic_slova: get('q18'),
      vyhnout_se: get('q19'),
    },
    design: {
      styl: get('q20'),
      vzor_web: get('q21'),
      materialy: get('q22'),
    },
    must_have: get('must_have'),
  };

  // ai_prompt generujeme z dat (předáme strukturovaný objekt)
  const ai_prompt = generateAIPrompt(data);

  return {
    ...data,
    ai_prompt,
    meta: {
      odeslano: new Date().toISOString(),
      zdroj: window.location.href,
      verze: 'v4',
    },
  };
}


/* ── Form Submission ────────────────────────────────────────── */
const intakeForm = document.getElementById('intakeForm');
const formWrapper = document.getElementById('formWrapper');
const formSuccess = document.getElementById('formSuccess');
const submitBtn = document.getElementById('submitBtn');
const submitText = document.getElementById('submitText');
const submitSpinner = document.getElementById('submitSpinner');
const copyBtn = document.getElementById('copyPromptBtn');
const promptText = document.getElementById('generatedPromptText');

if (intakeForm) {
  intakeForm.addEventListener('submit', async e => {
    e.preventDefault();

    // Validate last step
    const lastStep = document.querySelector('.form-step[data-step="9"]');
    if (lastStep) {
      const required = lastStep.querySelectorAll('[required]');
      let valid = true;
      required.forEach(field => {
        field.classList.remove('invalid');
        if (!field.value.trim()) {
          field.classList.add('invalid');
          if (valid) field.focus();
          valid = false;
        }
      });
      if (!valid) return;
    }

    // Collect form data
    const fd = new FormData(intakeForm);
    const raw = {};
    fd.forEach((v, k) => { raw[k] = v; });

    // Build structured payload
    const payload = buildPayload(raw);

    // Show loading state
    if (submitText) submitText.style.display = 'none';
    if (submitSpinner) submitSpinner.style.display = 'inline-block';
    if (submitBtn) submitBtn.disabled = true;

    // Send to n8n webhook
    try {
      await fetch(N8N_WEBHOOK_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
        mode: 'no-cors',    // webhook nepotřebuje CORS response
      });
    } catch (err) {
      // no-cors mode může vyhodit "TypeError: Failed to fetch" — je to OK,
      // data byla odeslána, response prostě nepřichází zpět
      console.info('Webhook sent (no-cors, expected):', err.message);
    }

    // Show success screen
    if (formWrapper) formWrapper.style.display = 'none';
    if (formSuccess) {
      formSuccess.style.display = 'block';
      formSuccess.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }

    // Populate prompt preview
    if (promptText) promptText.textContent = payload.ai_prompt;
  });
}


/* ── Copy Prompt Button ─────────────────────────────────────── */
if (copyBtn && promptText) {
  copyBtn.addEventListener('click', () => {
    const text = promptText.textContent;

    const done = () => {
      copyBtn.textContent = '✓ Zkopírováno!';
      setTimeout(() => { copyBtn.textContent = 'Zkopírovat'; }, 2000);
    };

    if (navigator.clipboard) {
      navigator.clipboard.writeText(text).then(done).catch(() => fallbackCopy(text, done));
    } else {
      fallbackCopy(text, done);
    }
  });
}

function fallbackCopy(text, onDone) {
  const ta = document.createElement('textarea');
  ta.value = text;
  Object.assign(ta.style, { position: 'fixed', opacity: '0', top: '0', left: '0' });
  document.body.appendChild(ta);
  ta.focus(); ta.select();
  try { document.execCommand('copy'); if (onDone) onDone(); }
  catch (e) { console.error('Copy failed', e); }
  document.body.removeChild(ta);
}
