# Tannlegene Måreid - Product Requirements Document

## Original Problem Statement
Bygge en moderne og minimalistisk one-page nettside for tannlege Per Eivind Måreid.

**Referanse:** https://www.tannlegemaareid.no/
**Repo:** github.com/meetmax-no/tannlege-per (main branch)
**Produksjon:** https://per-tannlege.vercel.app

## User Personas
- **Primær (hovedsiden):** Voksne pasienter i Oslo
- **Sekundær (studentsiden):** Studenter — Alexander Kiellands plass, OsloMet/UiO/BI i nærheten
- **Tertiær:** Akutt-pasienter, eksisterende pasienter

---

## Architecture

### Frontend
- **Framework:** React 19 + React Router v7
- **Styling:** Tailwind CSS + Shadcn UI + CSS-variabler
- **Sider:**
  - `/` — Hovedsiden (HomePage)
  - `/student` — Student-landingsside (StudentLanding)
  - `/student/plakat` — QR-plakat for utskrift (StudentPoster)
- **Statisk preview:**
  - `/farger-preview.html` — Tuner for Hero-overlays
  - `/student-stilvalg.html` — Stilbibliotek (4 student-varianter)

### Backend (implementert via Vercel Serverless Functions)
- **Plattform:** Vercel Serverless (Node.js 20, ESM)
- **Filer:** `/api/contact.mjs` + `/api/_lib/` (config, telegram, resend, mongo)
- **Endpoints:**
  - POST /api/contact — Validering + honeypot → MongoDB + Telegram + Resend (parallelt)
- **Kanaler styres av env-vars i Vercel:**
  - Telegram: `TELEGRAM_BOT_TOKEN` + `TELEGRAM_CHAT_ID`
  - E-post: `RESEND_API_KEY` + `RESEND_TO_EMAIL` + `EMAIL_ENABLED=true`
  - Mongo: `MONGODB_URI`

### Theming Systems (to uavhengige)

#### Hovedside (3 temaer)
- `default.json` → `colorScheme`: 0=preview, 1=brun, 2=lysblå, 3=lysgrønn
- CSS-variabler `--brand-X` overstyrer Tailwind `amber.*` klasser
- Hero-overlay egne variabler `--hero-gradient-desktop/mobile` per tema
- ThemeProvider + ThemeSwitcher (dropdown med "Tilpass overlay"-lenke)

#### Studentside (4 temaer)
- `default.json` → `studentColorScheme`: 0=preview, 1=Bubblegum, 2=Voltage, 3=Honey, 4=Emerald
- Egne `--st-*` CSS-variabler (uavhengig av hovedsidens palett)
- StudentThemePicker (4 sirkler) i mini-header
- Hver palett har egne bg/text/accent/card/deal-farger

---

## What's Been Implemented

### ✅ Fase 1: Frontend MVP (Des 2025)
- mockData.js, alle hovedseksjoner, responsive design, Inter font

### ✅ Fase 2: Dynamisk innhold via JSON (Des 2025)
- `/public/data/`: priser.json, priser-student.json, tjenester.json, apningstider.json

### ✅ Fase 3: Repo + Favicon (14. mai 2026)
- Klonet repo til /app, dependencies installert
- Ny favicon-pakke (svg + ico + png + apple-touch + manifest)
- site.webmanifest oppdatert med klinikknavn + theme-color

### ✅ Fase 4: Color Scheme System hovedsiden (14. mai 2026)
- 3 fargetemaer via CSS-variabler (brun/lysblå/lysgrønn)
- `default.json` med `colorScheme`-felt
- ThemeProvider + ThemeSwitcher (dropdown m/ swatches)
- Tema-color meta-tag oppdateres dynamisk
- localStorage husker valg i preview-modus
- Tailwind `amber.*` overrides så ingen kodeendringer per palett

### ✅ Fase 5: Hero-overlay tuner (14. mai 2026)
- `/farger-preview.html` — interaktiv slider-tuner
- Glidebrytere for from/via/to opacity + shade per farge
- Live preview på ekte Hero-bilde
- Kopier rgba → committet i index.css for alle 3:
  - Brun: `rgba(180, 83, 9, 0.75 → 0.55 → 0.00)`
  - Lysblå: `rgba(3, 105, 161, 0.80 → 0.50 → 0.00)`
  - Lysgrønn: `rgba(4, 120, 87, 0.71 → 0.45 → 0.00)`
- Mobil-overlays med proporsjonalt lettere verdier

### ✅ Fase 6: Studentside (14. mai 2026)
- `/student` route med React Router
- Innhold styres av `priser-student.json` (kan oppdateres uten kode)
- Seksjoner: Hero, Pris-kort, CTA, Slik gjør du, Venn-deal (25%), Akutt, Bestill-skjema, Praktisk, Footer
- Sticky CTA på mobil
- "Mer om studenttilbud →"-lenke fra hovedsidens Pricing-seksjon

### ✅ Fase 7: 4 Bold Student-temaer (14. mai 2026)
- Helt eget palett-system uavhengig av hovedsiden
- **Bubblegum**: pink (#FF2E93) + lime (#C0FF00) + svart pris-kort
- **Voltage**: elektrisk blå (#2563EB) + lime + navy pris-kort
- **Honey**: amber + oransje, varmt monokromt
- **Emerald**: klassisk grønn (samme palett som hovedsiden)
- StudentThemePicker: 4 sirkler i mini-header (kun preview-modus)
- Stilbibliotek `/student-stilvalg.html` for fremvisning/sammenligning

### ✅ Fase 8: Venn-rabatt copy (14. mai 2026)
- Tydelig insentiv-fokus: "15% alene. 25% med en venn."
- "+10% bonus"-tag i seksjonen
- Forklaring synliggjør gevinsten

### ✅ Fase 9: QR-plakat (14. mai 2026)
- `/student/plakat` route
- Dynamisk QR-kode (qrserver.com API) m/ UTM-parametere
- Print-CSS for A2 portrett (420 × 594 mm)
- Tema-velger i toolbar (samme 4 som studentsiden)
- "Skriv ut / Lagre som PDF"-knapp
- QR peker til: `per-tannlege.vercel.app/student?utm_source=qr&utm_medium=poster&utm_campaign=studenttilbud-akp`

### ✅ Fase 10: SEO + Sporing (14. mai 2026)
- Open Graph + Twitter Card meta-tags i index.html
- Dynamiske meta-tag overstyringer via `use-meta-tags`-hook
- UTM-parametere fanges på student-siden → pre-fylles inn i form-melding
- Hovedside-lenke: `?utm_source=hovedside&utm_medium=link&utm_campaign=studenttilbud-akp`
- Vercel Analytics integrert (`@vercel/analytics/react` + `<Analytics />` i App.js)

### ✅ Fase 11: Småplukk (14. mai 2026)
- Team-bilder: `object-top` (fikset Suzana-klipping på mobil)
- Hero-headline: redusert til `text-[10vw]` så "Studentbudsjett." og "Done." ikke klippes
- Akutt-knapp: midtjustert på mobil (`mx-auto sm:mx-0`)
- Form-bunn: stor klikkbar `<Phone /> 22 35 57 00` i stedet for liten tekst
- Steg 3-tekst: "Vi tar oss av tennene. Du tar med smilet hjem."

---

## Files of Interest

| Fil | Formål |
|-----|--------|
| `frontend/public/data/default.json` | Aktive temaer (hovedside + student) |
| `frontend/public/data/priser-student.json` | Studentside-innhold + venn-deal copy |
| `frontend/src/index.css` | Alle CSS-variabler (3 hoved + 4 student-temaer + Hero overlays) |
| `frontend/tailwind.config.js` | `amber.*` mappet til `--brand-X` |
| `frontend/src/context/ThemeContext.jsx` | Theme provider for begge systemer |
| `frontend/src/components/ThemeSwitcher.jsx` | Tema-velger hovedside |
| `frontend/src/components/StudentThemePicker.jsx` | 4-sirkler velger student |
| `frontend/src/pages/StudentLanding.jsx` | Studentside med `--st-*` vars |
| `frontend/src/pages/StudentPoster.jsx` | QR-plakat for utskrift |
| `frontend/src/hooks/use-meta-tags.js` | Dynamisk OG-tag oppdatering |

### ✅ Fase 12: Kontaktskjema-backend via Vercel Serverless (15. mai 2026)
- `/api/contact.mjs` + `/api/_lib/` (config, telegram, resend, mongo)
- POST endpoint med validering, honeypot, og parallell varsling
- Telegram-varsel med HTML-format + Ring/SMS-knapper i meldingen
- Resend-integrasjon (basert på bankboks-page-mønster) med duplicate-handling
- MongoDB Atlas-lagring med connection caching for serverless
- `Contact.jsx` + `StudentLanding.jsx` koblet på ekte API (mocks fjernet)
- Honeypot-felt i begge skjemaer for spam-beskyttelse
- 17/17 lokale validerings-tester passert (`tests/test_contact_api.mjs`)
- `vercel.json` rewrite oppdatert til å ekskludere `/api/*` fra SPA-fallback

---

## Prioritized Backlog

### P0 — Ventende klient-beslutninger
- [ ] **Hovedside-farge**: Per velger 1/2/3 i `default.json`
- [ ] **Studentside-tema**: Per velger 1/2/3/4 i `default.json` (etter at datteren har testet på mobil)
- [ ] **Plakat-godkjenning**: Per ser på `/student/plakat` og bekrefter

### P1 — Klart for deploy (krever env-vars i Vercel)
- [x] Backend-kode lagd og testet lokalt (15. mai 2026)
- [ ] Telegram Bot opprettet av bruker (BotFather) + Group Chat-ID hentet
- [ ] MongoDB Atlas M0 opprettet + connection string lagt i Vercel
- [ ] Resend-konto opprettet med Per sin e-post + API-key
- [ ] Env-vars lagt inn i Vercel Settings → Environment Variables
- [ ] Deploy + E2E-test via produksjons-URL

### P1 — Future Enhancements
- [ ] Tannlegeper.no DNS-verifisering hos Resend → bytte `RESEND_FROM_EMAIL`
- [ ] Aktivere E-post-kanal når DNS er klart (`EMAIL_ENABLED=true`)
- [ ] Telegram `/liste`-kommando i boten (hvis Per spør om historikk)
- [ ] Timebestillingssystem
- [ ] Tidsbegrenset student-kampanje med utløpsdato

### P2 — Nice to Have
- [ ] Multi-language support (norsk/engelsk)
- [ ] Blog/artikkel-seksjon
- [ ] Ekte teambilder (avhenger av Per)
- [ ] Self-served `/student/plakat`-generator for flere lokasjoner (utm_campaign per plakat)
- [ ] Chat-bot
- [ ] WhatsApp/SMS direct-link

---

## Next Action Items
1. **E-post til Per** med lenker (utkast klar i conversation)
2. **Vente på tilbakemelding** + valg av farge/student-tema
3. **MongoDB Atlas-oppsett** (5–7 min jobb for Per)
4. **SendGrid-integrasjon** når API-key er tilgjengelig
5. **Deploy & dashboard-aktivering**: Vercel Analytics blir synlig når events kommer inn (1–24t etter første)
