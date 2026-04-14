/* ============================================================
   webdo24.cz v3 — JavaScript
   ============================================================ */

const N8N_WEBHOOK_URL = 'https://mirabeecko.app.n8n.cloud/webhook/web-intake';

/* ── SCARCITY COUNTER ───────────────────────────────────────── */
function getSlotsLeft() {
  const day = new Date().getDay(); // 0=Sun, 1=Mon, ..., 6=Sat
  // Mon=3, Tue=2, Wed=2, Thu=1, Fri=1, Sat=3, Sun=3
  const slots = [3, 3, 2, 2, 1, 1, 3];
  return slots[day];
}

function updateScarcity() {
  const el = document.getElementById('slotsLeft');
  if (el) el.textContent = getSlotsLeft();
}
updateScarcity();


/* ── COUNTDOWN TIMER ────────────────────────────────────────── */
function updateCountdown() {
  const now = new Date();
  const deadline = new Date();
  deadline.setHours(18, 0, 0, 0);

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

  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
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
        const otherBtn = other.querySelector('.faq-q');
        if (otherBtn) otherBtn.setAttribute('aria-expanded', 'false');
      }
    });
  });
});


/* ── SCROLL ANIMATIONS ──────────────────────────────────────── */
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

document.querySelectorAll('.animate-on-scroll').forEach(el => observer.observe(el));


/* ── SOCIAL PROOF POPUP ─────────────────────────────────────── */
const spNotifications = [
  { name: 'Petr', city: 'Ostravy', action: 'si právě objednal web', color: 'linear-gradient(135deg,#3b82f6,#6366f1)' },
  { name: 'Jana', city: 'Brna', action: 'právě odeslala poptávku', color: 'linear-gradient(135deg,#8b5cf6,#c084fc)' },
  { name: 'Marek', city: 'Prahy', action: 'spustil web za 18 hodin', color: 'linear-gradient(135deg,#10b981,#22c55e)' },
  { name: 'Lucie', city: 'Plzně', action: 'dostala první poptávku do 2 hodin', color: 'linear-gradient(135deg,#f97316,#facc15)' },
];

let spIndex = 0;
let spDismissed = false;
let spAutoTimer = null;
let spHideTimer = null;

const spPopup = document.getElementById('spPopup');
const spClose = document.getElementById('spClose');
const spAvatar = document.getElementById('spAvatar');
const spName = document.getElementById('spName');
const spAction = document.getElementById('spAction');

function getInitials(name) {
  return name.slice(0, 2).toUpperCase();
}

function showSpNotification(idx) {
  if (spDismissed || !spPopup) return;
  const n = spNotifications[idx % spNotifications.length];

  spAvatar.textContent = getInitials(n.name);
  spAvatar.style.background = n.color;
  spName.textContent = `${n.name} z ${n.city}`;
  spAction.textContent = n.action;

  spPopup.classList.remove('sp-hiding');
  spPopup.classList.add('sp-visible');

  // Auto-hide after 5s
  clearTimeout(spHideTimer);
  spHideTimer = setTimeout(() => {
    hideSpPopup();
  }, 5000);
}

function hideSpPopup() {
  if (!spPopup) return;
  spPopup.classList.add('sp-hiding');
  setTimeout(() => {
    spPopup.classList.remove('sp-visible', 'sp-hiding');
  }, 400);
}

function cycleSpPopup() {
  spIndex = (spIndex + 1) % spNotifications.length;
  showSpNotification(spIndex);
}

if (spClose) {
  spClose.addEventListener('click', () => {
    spDismissed = true;
    clearTimeout(spHideTimer);
    clearInterval(spAutoTimer);
    hideSpPopup();
  });
}

// Show first notification after 8s, then cycle every 15s
setTimeout(() => {
  if (!spDismissed) {
    showSpNotification(spIndex);
    spAutoTimer = setInterval(cycleSpPopup, 15000);
  }
}, 8000);


/* ── MULTI-STEP FORM ────────────────────────────────────────── */
const TOTAL_STEPS = 9;
let currentStep = 1;

// Pill group interactions
function initPillGroups() {
  document.querySelectorAll('.pill-group').forEach(group => {
    const isSingle = group.dataset.single === 'true';
    const hiddenName = group.dataset.name;
    const autoAdvance = group.dataset.autoAdvance === 'true';
    const hiddenInput = document.querySelector(`input[name="${hiddenName}"]`);

    group.querySelectorAll('.pill').forEach(pill => {
      pill.addEventListener('click', () => {
        if (isSingle) {
          group.querySelectorAll('.pill').forEach(p => p.classList.remove('active'));
        }
        pill.classList.toggle('active');
        if (hiddenInput && isSingle) {
          hiddenInput.value = pill.classList.contains('active') ? pill.dataset.value : '';
        }

        // Auto-advance logic
        if (autoAdvance && isSingle && pill.classList.contains('active')) {
          const step = parseInt(group.closest('.form-step')?.dataset.step);
          if (step) {
            const hintId = `step${step}hint`;
            const hintEl = document.getElementById(hintId);

            // Show extra fields if any BEFORE auto-advancing (step 7 brand fields)
            if (step === 7) {
              const extraFields = document.getElementById('q17extraFields');
              if (extraFields) {
                extraFields.style.display = 'block';
                // Don't auto-advance step 7 — let user fill in extra text fields
                return;
              }
            }

            if (hintEl) hintEl.style.display = 'flex';
            setTimeout(() => {
              if (hintEl) hintEl.style.display = 'none';
              goToStep(step + 1);
            }, 700);
          }
        }
      });
    });
  });
}
initPillGroups();

function goToStep(n) {
  if (n < 1 || n > TOTAL_STEPS) return;

  // Validate required fields on current step before going forward
  if (n > currentStep) {
    const activeStep = document.querySelector(`.form-step[data-step="${currentStep}"]`);
    if (activeStep) {
      const required = activeStep.querySelectorAll('[required]');
      let valid = true;
      required.forEach(field => {
        field.classList.remove('invalid');
        if (!field.value.trim()) {
          field.classList.add('invalid');
          field.focus();
          valid = false;
        }
      });
      if (!valid) return;
    }
  }

  // Hide all steps
  document.querySelectorAll('.form-step').forEach(s => s.classList.remove('active'));
  // Show target step
  const target = document.querySelector(`.form-step[data-step="${n}"]`);
  if (target) {
    target.classList.add('active');
    currentStep = n;
    updateProgress();
    // Scroll to form
    const wrapper = document.getElementById('formWrapper');
    if (wrapper) wrapper.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
}

function updateProgress() {
  const bar = document.getElementById('progressBar');
  const num = document.getElementById('currentStepNum');
  if (bar) bar.style.width = `${(currentStep / TOTAL_STEPS) * 100}%`;
  if (num) num.textContent = currentStep;
}
updateProgress();

// Remove invalid class on input
document.querySelectorAll('.form-group input, .form-group textarea').forEach(el => {
  el.addEventListener('input', () => el.classList.remove('invalid'));
});


/* ── PROMPT GENERATOR ───────────────────────────────────────── */
function generateAIPrompt(data) {
  const val = (v) => (v && v.toString().trim()) ? v.toString().trim() : '—';
  const today = new Date().toLocaleDateString('cs-CZ', { day: 'numeric', month: 'long', year: 'numeric' });

  return `# BRIEF PRO VYTVOŘENÍ WEBU: ${val(data.q1)}
Vygenerováno: ${today}

## ZADÁNÍ
Vytvoř maximálně konverzní landing page. Piš z pohledu zákazníka. Každá sekce odpovídá na "co z toho mám já?".

## FIRMA & IDENTITA
Název: ${val(data.q1)}
Co dělají a pro koho: ${val(data.q2)}
Kde působí: ${val(data.q3)}

## UNIKÁTNÍ HODNOTA (UVP)
Proč si zákazníci vybírají tuto firmu: ${val(data.q4)}
Jedinečná pozice: "Jsme jediní, kdo ${val(data.q5)}"

## CÍLOVÝ ZÁKAZNÍK
Kdo je: ${val(data.q6)}
Problém před spoluprací: ${val(data.q7)}
Výsledek po spolupráci: ${val(data.q8)}

## NABÍDKA
Hlavní produkty/služby:
1. ${val(data.q9a)}
2. ${val(data.q9b)}
3. ${val(data.q9c)}
Hero offer: ${val(data.q10)}
Cenové rozpětí: ${val(data.q11)}

## DŮVĚRA & SOCIAL PROOF
Čísla a fakta: ${val(data.q12)}
Nejsilnější reference: ${val(data.q13)}

## KONVERZNÍ CÍL
Hlavní akce návštěvníka: ${val(data.q14)}${data.q14_custom ? ' — ' + val(data.q14_custom) : ''}
Kontakt na webu: ${val(data.q15)}
Vstupní nabídka pro nové zákazníky: ${val(data.q16)}

## BRAND VOICE
Tón komunikace: ${val(data.q17)}
Brand v 3 slovech: ${val(data.q18)}
Čeho se vyhnout: ${val(data.q19)}

## DESIGN
Vizuální styl: ${val(data.q20)}
Vzorový web: ${val(data.q21)}
Dostupné materiály: ${val(data.q22)}

## INSTRUKCE PRO AI

### Povinná struktura stránky:
1. URGENCY BAR — scarcity nebo časová nabídka
2. NAVIGACE — logo + CTA
3. HERO — outcome headline (ne "co děláme" ale "co zákazník získá"), 3 bullet UVP, 2 CTA, social proof čísla
4. SOCIAL PROOF STRIP — klíčová čísla z "Důvěra"
5. PROBLÉM/ŘEŠENÍ — before/after zákazníka (z dat zákazníka výše)
6. NABÍDKA — 3 varianty, střední zvýrazněná
7. JAK TO FUNGUJE — 3 jednoduché kroky
8. DIFERENCIACE — "Proč my" (z UVP a jedinečné pozice výše)
9. TESTIMONIALY — reálné citace ze sekce Důvěra
10. GARANCE — risk reversal
11. FAQ — 5 nejčastějších námitek zákazníka
12. ZÁVĚREČNÉ CTA + FORMULÁŘ — urgency + opakování hlavní nabídky
13. FOOTER

### Pravidla copywritingu:
- Headline: konkrétní outcome ("Získejte X za Y" ne "Jsme nejlepší v oboru")
- CTA: aktivní a urgentní ("Chci X →" ne "Odeslat")
- Sociální důkaz: čísla vždy konkrétní
- Eliminuj: "profesionální, komplexní, individuální přístup, moderní řešení"
- Piš slovy zákazníka, ne firmy

### Technické požadavky:
- Čistý HTML/CSS/JS (žádné frameworky)
- Mobile-first responzivní
- CSS custom properties
- Dark theme (pokud styl není jiný)
- Konverzní formulář s validací
- Smooth scroll, sticky nav`;
}


/* ── FORM SUBMISSION ────────────────────────────────────────── */
const intakeForm = document.getElementById('intakeForm');
const formWrapper = document.getElementById('formWrapper');
const formSuccess = document.getElementById('formSuccess');
const submitBtn = document.getElementById('submitBtn');
const submitText = document.getElementById('submitText');
const submitSpinner = document.getElementById('submitSpinner');
const copyPromptBtn = document.getElementById('copyPromptBtn');
const generatedPromptText = document.getElementById('generatedPromptText');

if (intakeForm) {
  intakeForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    // Validate last step
    const activeStep = document.querySelector(`.form-step[data-step="9"]`);
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

    // Collect all form data
    const fd = new FormData(intakeForm);
    const formData = {};
    fd.forEach((v, k) => { formData[k] = v; });

    // Generate AI prompt
    const generatedPrompt = generateAIPrompt(formData);

    // Encode uploaded files to base64
    const soubory = await encodeUploadedFiles();

    // Prepare payload
    const payload = {
      ...formData,
      generatedPrompt,
      soubory,                           // pole { nazev, typ, velikost_kb, data }
      soubory_pocet: soubory.length,
      odeslano: new Date().toISOString(),
      zdroj: window.location.href,
    };

    // Show spinner
    if (submitText) submitText.style.display = 'none';
    if (submitSpinner) submitSpinner.style.display = 'inline-block';
    if (submitBtn) submitBtn.disabled = true;

    try {
      await fetch(N8N_WEBHOOK_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
        mode: 'no-cors',
      });
    } catch (err) {
      // no-cors mode may throw — treat as success
      console.warn('n8n fetch note:', err);
    }

    // Show success
    if (formWrapper) formWrapper.style.display = 'none';
    if (formSuccess) formSuccess.style.display = 'block';

    // Populate generated prompt
    if (generatedPromptText) generatedPromptText.textContent = generatedPrompt;

    // Scroll to success
    if (formSuccess) formSuccess.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
}

/* Copy prompt button */
if (copyPromptBtn && generatedPromptText) {
  copyPromptBtn.addEventListener('click', () => {
    const text = generatedPromptText.textContent;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text).then(() => {
        copyPromptBtn.textContent = '✓ Zkopírováno!';
        setTimeout(() => { copyPromptBtn.textContent = 'Zkopírovat prompt'; }, 2000);
      }).catch(() => {
        fallbackCopy(text);
      });
    } else {
      fallbackCopy(text);
    }
  });
}

function fallbackCopy(text) {
  const ta = document.createElement('textarea');
  ta.value = text;
  ta.style.position = 'fixed';
  ta.style.opacity = '0';
  document.body.appendChild(ta);
  ta.focus();
  ta.select();
  try {
    document.execCommand('copy');
    if (copyPromptBtn) {
      copyPromptBtn.textContent = '✓ Zkopírováno!';
      setTimeout(() => { copyPromptBtn.textContent = 'Zkopírovat prompt'; }, 2000);
    }
  } catch (e) {
    console.error('Copy failed', e);
  }
  document.body.removeChild(ta);
}

/* ── EXPOSE goToStep GLOBALLY ───────────────────────────────── */
window.goToStep = goToStep;


/* ══════════════════════════════════════════════════════════════
   FILE UPLOAD
══════════════════════════════════════════════════════════════ */
const MAX_FILES = 5;
const MAX_SIZE_MB = 5;
const MAX_SIZE_B = MAX_SIZE_MB * 1024 * 1024;
const ACCEPTED = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml', 'application/pdf'];

// Mapa: File object → base64 string (naplní se postupně)
const uploadedFiles = new Map(); // key = File reference, value = { name, type, size, base64 }

const uploadZone = document.getElementById('uploadZone');
const fileInput = document.getElementById('fileInput');
const previewList = document.getElementById('filePreviewList');
const uploadError = document.getElementById('uploadError');
const uzIdle = document.getElementById('uzIdle');
const uzDragOver = document.getElementById('uzDragOver');

if (uploadZone && fileInput) {

  /* ── Klik na zónu ──────────────────────────────────────────── */
  uploadZone.addEventListener('click', () => fileInput.click());
  uploadZone.addEventListener('keydown', e => {
    if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); fileInput.click(); }
  });

  /* ── Input change ──────────────────────────────────────────── */
  fileInput.addEventListener('change', () => {
    handleNewFiles([...fileInput.files]);
    fileInput.value = ''; // reset, aby šlo nahrát stejný soubor znovu
  });

  /* ── Drag & Drop ───────────────────────────────────────────── */
  uploadZone.addEventListener('dragover', e => {
    e.preventDefault();
    uploadZone.classList.add('drag-over');
    if (uzIdle) uzIdle.style.display = 'none';
    if (uzDragOver) uzDragOver.style.display = 'block';
  });

  ['dragleave', 'dragend'].forEach(evt => {
    uploadZone.addEventListener(evt, () => {
      uploadZone.classList.remove('drag-over');
      syncIdleState();
    });
  });

  uploadZone.addEventListener('drop', e => {
    e.preventDefault();
    uploadZone.classList.remove('drag-over');
    syncIdleState();
    const files = [...e.dataTransfer.files];
    handleNewFiles(files);
  });
}

/* ── Zpracování nových souborů ─────────────────────────────── */
function handleNewFiles(newFiles) {
  hideError();

  const errors = [];
  const toAdd = [];

  for (const f of newFiles) {
    if (uploadedFiles.size + toAdd.length >= MAX_FILES) {
      errors.push(`Maximum ${MAX_FILES} souborů — zbývající přeskočeny.`);
      break;
    }
    if (!ACCEPTED.includes(f.type) && !f.name.endsWith('.svg')) {
      errors.push(`„${f.name}" — nepodporovaný formát.`);
      continue;
    }
    if (f.size > MAX_SIZE_B) {
      errors.push(`„${f.name}" — soubor je větší než ${MAX_SIZE_MB} MB.`);
      continue;
    }
    // Zkontroluj duplicitu (jméno + velikost)
    const isDupe = [...uploadedFiles.values()].some(u => u.name === f.name && u.size === f.size);
    if (isDupe) {
      errors.push(`„${f.name}" — soubor je již přidán.`);
      continue;
    }
    toAdd.push(f);
  }

  if (errors.length) showError(errors.join(' '));

  toAdd.forEach(f => {
    const entry = { name: f.name, type: f.type, size: f.size, base64: null };
    uploadedFiles.set(f, entry);
    addPreviewItem(f, entry);
    readFileBase64(f, entry);
  });

  syncZoneState();
}

/* ── Přidání položky do preview listu ─────────────────────── */
function addPreviewItem(file, entry) {
  if (!previewList) return;

  const li = document.createElement('li');
  li.className = 'file-preview-item';
  li.dataset.fileName = file.name;

  // Thumb
  const thumb = document.createElement('div');
  thumb.className = 'fpi-thumb icon';

  if (file.type.startsWith('image/') && file.type !== 'image/svg+xml') {
    const img = document.createElement('img');
    img.className = 'fpi-thumb';
    img.style.display = 'none';
    img.onload = () => { thumb.replaceWith(img); img.style.display = 'block'; };
    img.src = URL.createObjectURL(file);
    img.alt = file.name;
    li.appendChild(img);
  } else {
    thumb.textContent = file.type === 'application/pdf' ? '📄' : '🖼️';
    li.appendChild(thumb);
  }

  // Info
  const info = document.createElement('div');
  info.className = 'fpi-info';
  const name = document.createElement('span');
  name.className = 'fpi-name';
  name.textContent = file.name;
  const size = document.createElement('span');
  size.className = 'fpi-size';
  size.textContent = formatBytes(file.size);
  info.append(name, size);

  // Status
  const status = document.createElement('span');
  status.className = 'fpi-status loading';
  status.textContent = 'Načítám…';

  // Remove button
  const remove = document.createElement('button');
  remove.type = 'button';
  remove.className = 'fpi-remove';
  remove.title = 'Odstranit';
  remove.innerHTML = '×';
  remove.addEventListener('click', () => {
    uploadedFiles.delete(file);
    li.remove();
    syncZoneState();
    hideError();
  });

  // Ulož referenci na status do entry (pro aktualizaci po base64)
  entry._statusEl = status;

  li.append(info, status, remove);
  previewList.appendChild(li);
  previewList.style.display = 'flex';
}

/* ── Čtení souboru jako base64 ─────────────────────────────── */
function readFileBase64(file, entry) {
  const reader = new FileReader();
  reader.onload = () => {
    entry.base64 = reader.result; // data:mime;base64,...
    if (entry._statusEl) {
      entry._statusEl.className = 'fpi-status ok';
      entry._statusEl.textContent = '✓ Připraveno';
    }
  };
  reader.onerror = () => {
    if (entry._statusEl) {
      entry._statusEl.className = 'fpi-status error';
      entry._statusEl.textContent = '✕ Chyba čtení';
    }
  };
  reader.readAsDataURL(file);
}

/* ── Synchronizace stavu zóny ──────────────────────────────── */
function syncZoneState() {
  if (!uploadZone) return;
  const hasFiles = uploadedFiles.size > 0;
  uploadZone.classList.toggle('has-files', hasFiles);
  syncIdleState();

  // Přidat tlačítko „+ Přidat další" pokud je prostor
  let addMore = document.getElementById('uzAddMore');
  if (hasFiles && uploadedFiles.size < MAX_FILES) {
    if (!addMore) {
      addMore = document.createElement('button');
      addMore.type = 'button';
      addMore.id = 'uzAddMore';
      addMore.className = 'uz-add-more';
      addMore.textContent = `+ Přidat další soubor (${uploadedFiles.size}/${MAX_FILES})`;
      addMore.addEventListener('click', e => { e.stopPropagation(); fileInput.click(); });
      previewList && previewList.after(addMore);
    } else {
      addMore.textContent = `+ Přidat další soubor (${uploadedFiles.size}/${MAX_FILES})`;
    }
  } else if (addMore) {
    addMore.remove();
  }
}

function syncIdleState() {
  if (!uzIdle || !uzDragOver) return;
  const isDragOver = uploadZone && uploadZone.classList.contains('drag-over');
  uzIdle.style.display = isDragOver ? 'none' : 'block';
  uzDragOver.style.display = isDragOver ? 'block' : 'none';
}

/* ── Chybové hlášení ───────────────────────────────────────── */
function showError(msg) {
  if (!uploadError) return;
  uploadError.textContent = msg;
  uploadError.style.display = 'block';
}
function hideError() {
  if (uploadError) uploadError.style.display = 'none';
}

/* ── Formátování velikosti ─────────────────────────────────── */
function formatBytes(bytes) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

/* ── Export souborů pro webhook payload ────────────────────── */
async function encodeUploadedFiles() {
  // Počkáme, až jsou všechny soubory načteny (base64 !== null)
  // FileReader je async — pokud uživatel hned odešle formulář,
  // některé soubory ještě nemusí být připraveny.
  const MAX_WAIT_MS = 8000;
  const POLL_MS = 100;
  let waited = 0;

  while (waited < MAX_WAIT_MS) {
    const allReady = [...uploadedFiles.values()].every(e => e.base64 !== null);
    if (allReady) break;
    await new Promise(r => setTimeout(r, POLL_MS));
    waited += POLL_MS;
  }

  return [...uploadedFiles.values()].map(e => ({
    nazev: e.name,
    typ: e.type,
    velikost_kb: Math.round(e.size / 1024),
    data: e.base64 || null,   // data:mime;base64,… nebo null při chybě
  }));
}
