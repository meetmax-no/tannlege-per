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
- POST endpoint med validering, honeypot, og parallell varsling til alle aktive kanaler
- **Telegram-varsel sender TO meldinger per henvendelse:**
  1. Tekstmelding (HTML) med navn, telefon, e-post, melding, UTM-kilde
  2. `sendContact`-kontaktkort med klikkbar Ring/Lagre-knapp + vCard
- Norsk telefonnummer auto-formattert til `+47 XX XX XX XX` i tekst + E.164 (`+4792060612`) i kontaktkort
- vCard inkluderer melding i NOTE-feltet → lagres automatisk når Per trykker «Add Contact»
- Kontaktkort-navn holdes rent (kun ekte for-/etternavn) → konsekvente avatar-initialer på tvers av Telegram-klienter
- Resend-integrasjon (basert på bankboks-page-mønster) — klar, men aktiveres først når DNS er verifisert
- MongoDB Atlas-lagring med connection caching for serverless — klar, ikke aktivert ennå
- `Contact.jsx` + `StudentLanding.jsx` koblet på ekte API (mocks fjernet)
- Honeypot-felt i begge skjemaer for spam-beskyttelse
- Feilmelding-UI i hovedside-skjema med fallback til telefonnummer
- 20/20 + 8/8 lokale tester passert (`tests/test_contact_api.mjs`, `tests/test_phone_format.mjs`)
- `vercel.json` rewrite oppdatert til å ekskludere `/api/*` fra SPA-fallback
- **LIVE i produksjon** (15. mai 2026) — Telegram-varsler virker både fra `/` og `/student`

### 🔍 Tekniske oppdagelser (Telegram Bot API)
- Telegram avviser `tel:`/`sms:`-URLer i `inline_keyboard`-knapper (400 Bad Request)
- Telegram fjerner stille `<a href="tel:...">`-lenker i meldingstekst (godtas men strippes)
- Telegram auto-detekterer KUN internasjonale numre med + og fungerer kun på mobil-klienter
- Eneste pålitelige løsning for ett-trykks-oppringing: `sendContact` API med E.164-format
- Avatar-initialer hentes fra `first_name` + `last_name` — alt annet (emoji, tags) i disse feltene gir uforutsigbare resultater på tvers av klienter

### ✅ Fase 13: Eksplisitt env-var-styring (15. mai 2026)
- Fjernet skjult fallback-logikk i `config.mjs` — alle kanaler krever nå eksplisitt `*_ENABLED=true`
- Tre uavhengige toggles: `TELEGRAM_ENABLED`, `EMAIL_ENABLED`, `MONGODB_ENABLED`
- Kanal aktiveres KUN hvis credentials finnes OG `*_ENABLED=true`
- Ryddet `default.json` — fjernet ikke-funksjonell `notifications`-seksjon
- Bedre feildiagnose: 502-svar inkluderer per-kanal-detaljer i `channels`-feltet

### ✅ Fase 14: Telegram kontaktkort via sendContact (15. mai 2026)
- Oppdaget at Telegram Bot API avviser `tel:`/`sms:`-URLer i `inline_keyboard` (400 Bad Request)
- Oppdaget at Telegram fjerner stille `<a href="tel:...">`-lenker i meldingstekst
- Løsning: bruk `sendContact` API som sender et ekte kontaktkort med vCard
- Per henvendelse sendes TO meldinger:
  1. HTML-tekstmelding med alle detaljer + UTM-kilde
  2. Kontaktkort med klikkbar Ring-knapp og «Add Contact» som lagrer pasienten med melding i NOTE-feltet på Per sin mobil
- Avatar-initialer fra `first_name` + `last_name` (rene navn, ingen emoji/tags) for konsekvent visning på tvers av iOS/Android/Mac/Windows-klienter
- Norsk telefonnummer auto-konverteres til E.164 (`+4792060612`) før kontaktkort sendes

### ✅ Fase 15: Tema-styrt e-post (15. mai 2026)
- Ny `/api/_lib/theme.mjs` — leser `colorScheme` fra `default.json` (1-min cache)
- 3 paletter som matcher CSS-variablene (`--brand-*`) i `index.css`: brun, lysblå, lysgrønn
- Mail-mal bygd opp pent: pen header, accent-bordered melding-boks, Ring tilbake-knapp, footer
- 3 forhåndsvisning-filer i `frontend/public/`: `email-preview-{brun,lysbla,lysgronn}.html`
- Brun (1) er default når `colorScheme=0` eller filen ikke kan leses

### ✅ Fase 16: Resend live (15. mai 2026)
- Resend-konto opprettet (eier: `firma@kodoconsult.no`)
- API-key generert, satt som `RESEND_API_KEY` i Vercel
- Beslutning: bruk `kodoconsult.no` som permanent send-domene (Per slipper DNS-tilgang)
- Domene-verifisering hos Resend planlagt etter at Webhuset DNS-sperre utløper (3t)
- Avslørt blocker: `onboarding@resend.dev` blokkeres av Webhusets spam-filter (resend.dev står på spamrl.com blocklist)
- Mail-koden 100% klar — sender umiddelbart når `kodoconsult.no` er verifisert i Resend

### ✅ Fase 17: MongoDB Atlas live (15. mai 2026)
- M0 Free cluster opprettet («KoDo-PM» på AWS Frankfurt)
- Database-user `kodo_pm_app` med autogenerert passord
- Network Access: `0.0.0.0/0` (Vercel serverless IPs)
- Env-vars i Vercel: `MONGODB_URI`, `MONGODB_DB=tannlege-per`, `MONGODB_ENABLED=true`
- **VERIFISERT** — første henvendelse lagret kl. 11:52:12.465Z med alle felter:
  `name`, `phone`, `email`, `message`, `source`, `utm` (nested), `createdAt`, `userAgent`

---

## Prioritized Backlog

### P0 — Ventende klient-beslutninger
- [ ] **Hovedside-farge**: Per velger 1/2/3 i `default.json`
- [ ] **Studentside-tema**: Per velger 1/2/3/4 i `default.json` (etter at datteren har testet på mobil)
- [ ] **Plakat-godkjenning**: Per ser på `/student/plakat` og bekrefter

### P1 — Klart for deploy (krever env-vars i Vercel)
- [x] Backend-kode lagd og testet lokalt (15. mai 2026)
- [x] Telegram Bot opprettet (BotFather) + Group Chat-ID `-5218791898` hentet (15. mai 2026)
- [x] Env-vars `TELEGRAM_BOT_TOKEN`, `TELEGRAM_CHAT_ID`, `TELEGRAM_ENABLED=true` satt i Vercel (15. mai 2026)
- [x] Telegram E2E-test mot produksjon — varsel mottatt på 1 sek (15. mai 2026)
- [x] Telegram-kontaktkort via `sendContact` API m/ vCard (15. mai 2026)
- [x] MongoDB Atlas M0 opprettet «KoDo-PM» (Frankfurt) (15. mai 2026)
- [x] `MONGODB_URI`, `MONGODB_DB`, `MONGODB_ENABLED=true` satt i Vercel (15. mai 2026)
- [x] MongoDB E2E-test — første henvendelse lagret med alle felter (15. mai 2026 kl. 11:52)
- [x] Resend-konto opprettet med `firma@kodoconsult.no` (15. mai 2026)
- [x] `RESEND_API_KEY`, `RESEND_TO_EMAIL`, `EMAIL_ENABLED=true` satt i Vercel (15. mai 2026)
- [ ] Verifisere `kodoconsult.no` hos Resend (blokkert: Webhuset DNS-sperre 3t)
- [ ] Bytte `RESEND_FROM_EMAIL=noreply@kodoconsult.no` etter verifisering
- [ ] E-post E2E-test etter DNS-verifisering

### P1 — Sikkerhets-rotering
- [ ] **Roter MongoDB-passordet** — connection string ble eksponert i chat-historikk under setup
  - Atlas → Database Access → kodo_pm_app → Edit Password → Autogenerate
  - Oppdater `MONGODB_URI` i Vercel med ny streng → Redeploy

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
1. **Webhuset DNS-sperre utløper** (3t) → logg inn → legg til Resend DNS-records for kodoconsult.no
2. **Verifiser kodoconsult.no hos Resend** → bytte `RESEND_FROM_EMAIL=noreply@kodoconsult.no` i Vercel → Redeploy → E2E-test e-post
3. **Roter MongoDB-passord** (sikkerhet — connection string ble eksponert under oppsett)
4. **(Optional)** Pent fra-navn: `Tannlegene Måreid <noreply@kodoconsult.no>`
5. **Vente på tilbakemelding** fra Per + valg av farge/student-tema
6. **(Optional)** Telegram `/liste`-kommando hvis Per spør om historikk-eksport

---

## Current Production Status (15. mai 2026 — kveld)

| Komponent | Status |
|---|---|
| Frontend on Vercel | 🟢 LIVE |
| Telegram-varsler | 🟢 AKTIV — tekstmelding + kontaktkort m/ Ring-knapp |
| MongoDB-lagring | 🟢 AKTIV — alle henvendelser lagres med navn/tlf/melding/UTM/userAgent/timestamp |
| E-post (Resend) | 🟡 KODE LIVE — venter på `kodoconsult.no` DNS-verifisering hos Resend |
| Spam-beskyttelse | 🟢 Honeypot aktiv på begge skjemaer |
| Vercel Analytics | 🟢 AKTIV |

**E2E-flow bekreftet:** Kontaktskjema (`/` og `/student`) → POST `/api/contact` → (1) lagring til Atlas `tannlege-per.contacts` (2) Telegram-tekstmelding + kontaktkort i klinikkgruppen — alt innen 1-2 sek.

**Verifisert henvendelse 15. mai 11:52:** Document `_id: 6a0708ede779024fdec385cf` i contacts-collection inneholder navn, telefon, e-post, melding, source, utm (nested object), createdAt og userAgent. Telegram-meldingene kom samtidig.

### Arkitektur-beslutning: send-domene
Vi bruker **`kodoconsult.no`** som permanent send-domene istedet for å verifisere `tannlegeper.no`. Fordeler:
- Per trenger ikke gi DNS-tilgang
- Sentralt forvaltet send-oppsett kan brukes for flere klienter senere
- `replyTo` settes til pasientens e-post → Per kan svare direkte
- Hvis ønskelig senere: enkelt å legge til verifisering av tannlegeper.no i tillegg
