# UNIVERZÁLNÍ PROMPT ŠABLONA — webdo24.cz

Šablona pro generování AI promptu z dat zákazníka.
Proměnné v `{{složených závorkách}}` se nahrazují daty z formuláře.

---

## JAK POUŽÍVAT

1. Zákazník vyplní intake formulář na webdo24.cz
2. Systém automaticky vyplní tuto šablonu jeho daty
3. Výsledný prompt pošleš AI (Claude, GPT-4 atd.)
4. AI vytvoří kompletní web přesně pro tohoto zákazníka

---

# PROMPT:

Jsi senior webový copywriter, UX designer a front-end developer v jednom.
Vytvoř maximálně konverzní landing page pro firmu níže.

## PRAVIDLO #1: Piš z pohledu zákazníka

Každá věta musí odpovídat na otázku "co z toho MÁM JÁ?"
Nikdy nepište "jsme profesionální firma s dlouholetou praxí."
Vždy pište "Opravíme váš kotel ještě dnes, i o víkendu."

## PRAVIDLO #2: Konkrétnost vítězí nad obecností

- ❌ "Rychlá dodávka" → ✅ "Doručíme do 24 hodin"
- ❌ "Skvělé ceny" → ✅ "Od 9 900 Kč, platíte až po schválení"
- ❌ "Spokojení zákazníci" → ✅ "847 spokojených zákazníků za 6 let"

## PRAVIDLO #3: Každá sekce má jeden cíl

- Hero → zájem
- Social proof → důvěra
- Nabídka → touha
- CTA → akce
- FAQ → odstranění námitek

---

## DATA ZÁKAZNÍKA

### FIRMA
Název: {{firma}}
Popis (jednou větou): {{cinnost}}
Působnost: {{pusobnost}}

### UVP
Důvod výběru: {{uvp}}
Jedinečná pozice: {{jedini_kdo}}

### ZÁKAZNÍK
Popis: {{zakaznik_popis}}
Problém před: {{problem_pred}}
Výsledek po: {{vysledek_po}}

### NABÍDKA
1. {{nabidka_1}}
2. {{nabidka_2}}
3. {{nabidka_3}}
Hero offer: {{hero_offer}}
Cenové rozpětí: {{cena}}

### SOCIAL PROOF
Čísla: {{duvera_cisla}}
Reference: {{duvera_reference}}

### KONVERZE
CTA: {{cil}}
Kontakt: {{kontakt_udaje}}
Vstupní nabídka: {{vstupni_nabidka}}

### BRAND
Tón: {{ton}}
Brand slova: {{brand_slova}}
Vyhnout se: {{vyhnout_se}}

### DESIGN
Styl: {{styl}}
Vzor: {{vzor_web}}
Materiály: {{logo_fotky}}

---

## POVINNÁ STRUKTURA WEBU

(Dodržuj toto pořadí — je otestováno pro maximální konverzi)

1. **URGENCY BAR** — scarcity nebo omezená nabídka
2. **NAVIGACE** — logo + jeden CTA button
3. **HERO SEKCE**
   - Headline: outcome zákazníka (ne co firma dělá)
   - Subheadline: jak a pro koho
   - 3 bullet UVP (z dat výše)
   - 2 CTA: primární (akce) + sekundární (dozvědět se více)
   - Trust strip: klíčová čísla
4. **SOCIAL PROOF NUMBERS** — čísla z {{duvera_cisla}}
5. **PROBLÉM → ŘEŠENÍ** — before/after z {{problem_pred}} a {{vysledek_po}}
6. **NABÍDKA** — 3 varianty, střední zvýrazněná, z dat výše
7. **JAK TO FUNGUJE** — max 3 kroky, jednoduché
8. **PROČ MY** — diferenciace z {{uvp}} a {{jedini_kdo}}
9. **TESTIMONIALY** — z {{duvera_reference}}, doplň nebo vymysli konzistentní s brandem
10. **GARANCE** — risk reversal, z {{vstupni_nabidka}}
11. **FAQ** — 5 námitek typického zákazníka {{zakaznik_popis}}
12. **ZÁVĚREČNÉ CTA** — opakování nabídky + urgency + {{cil}}
13. **FOOTER** — kontakt {{kontakt_udaje}}, navigace

---

## TECHNICKÉ POŽADAVKY

```html
<!-- Výstup musí být: -->
- Jeden HTML soubor (embedded CSS + JS)
- Nebo: index.html + style.css + script.js
- Mobile-first responzivní
- CSS custom properties (--primary, --bg, atd.)
- Bez externích frameworků (jen Google Fonts povoleno)
- Smooth scroll, sticky nav
- Kontaktní formulář s validací
- Loading time < 2s
```

---

## KONTROLNÍ SEZNAM PŘED ODEVZDÁNÍM

- [ ] Headline říká OUTCOME, ne proces
- [ ] CTA je aktivní ("Chci X" ne "Odeslat")
- [ ] Čísla jsou konkrétní (ne "mnoho zákazníků")
- [ ] Každá sekce má jeden cíl
- [ ] Mobile verze je čitelná a funkční
- [ ] Formulář funguje a validuje
- [ ] Žádný generický text ("komplexní řešení", "individuální přístup")
- [ ] Brand voice odpovídá: {{ton}}
- [ ] Design odpovídá: {{styl}}
