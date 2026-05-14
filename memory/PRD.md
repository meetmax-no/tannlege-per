# Tannlegene Måreid - Product Requirements Document

## Original Problem Statement
Bygge en moderne og minimalistisk one-page nettside for tannlege Per Eivind Måreid.

**Referanse:** https://www.tannlegemaareid.no/

## User Persona
- **Primary:** Potensielle pasienter i Oslo som søker tannlegetjenester
- **Secondary:** Eksisterende pasienter som trenger informasjon om tjenester, åpningstider og kontakt

## Core Requirements

### Design Stil
- Moderne og minimalistisk design
- Varm og inviterende fargepalett (amber/beige toner)
- Responsive design
- Smooth scroll navigation
- Moderne typografi (Inter font)

### Seksjoner
1. **Hero Section** - Hovedbanner med CTA-knapper
2. **Tjenester** - 6 tjenestekort + Helfo-informasjon
3. **Team** - Presentasjon av tannlegene + pasientomtaler
4. **Priser** - Accordion med prisliste
5. **Åpningstider** - Oversikt over ukens åpningstider
6. **Kontakt** - Kontaktskjema + kontaktinformasjon + kart

### Kontaktfunksjonalitet
- Kontaktskjema med backend lagring
- Validering av skjemafelt
- Toast notifikasjoner for tilbakemelding

## Architecture

### Frontend
- **Framework:** React 19
- **Styling:** Tailwind CSS + Shadcn UI components
- **Components:**
  - Header (sticky navigation)
  - Hero
  - Services
  - Team (inkl. testimonials)
  - Pricing (accordion)
  - OpeningHours
  - Contact (form + map)
  - Footer
  - ThemeSwitcher (preview-modus knapp)

### Backend (Planlagt)
- **Framework:** FastAPI
- **Database:** MongoDB
- **Endpoints:**
  - POST /api/contact - Lagre kontaktskjema + sende e-post via SendGrid (kommer)

### Theming System (NYTT — 14. mai 2026)
- **Konfigfil:** `/frontend/public/data/default.json` med `colorScheme`-felt
  - `0` = preview-modus (tema-knapp synlig i header)
  - `1` = Brun / Amber (default)
  - `2` = Lysblå / Sky
  - `3` = Lysgrønn / Emerald
- **Implementasjon:**
  - CSS-variabler i `index.css` med tre `[data-color-scheme]`-paletter (channels)
  - Tailwind `amber.*`-klasser bruker `rgb(var(--brand-X) / <alpha-value>)` så alle eksisterende klasser fortsetter å fungere
  - `ThemeProvider` (`/src/context/ThemeContext.jsx`) henter JSON, leser localStorage, setter `data-color-scheme` på `<html>`, oppdaterer `theme-color` meta-tag
  - `ThemeSwitcher` (`/src/components/ThemeSwitcher.jsx`) vises kun når `colorScheme === 0`. Plassert i header etter "Kontakt oss" (desktop) og nederst i mobil-meny
  - localStorage-nøkkel: `tannlege-color-scheme`

## What's Been Implemented

### ✅ Fase 1: Frontend med Mock Data (Des 2025)
- [x] mockData.js med all data
- [x] Header med sticky navigation
- [x] Hero med varm gradient
- [x] Services med 6 tjenestekort
- [x] Team med 3 ansatte
- [x] Pricing med accordion (leser JSON)
- [x] OpeningHours (leser JSON)
- [x] Contact med skjema (mock), kontaktinfo, kart
- [x] Footer
- [x] Toast notifications, responsive, Inter font, warm color scheme

### ✅ Fase 2: Dynamisk innhold via JSON (Des 2025)
- [x] Priser/åpningstider/tjenester i `/public/data/`
- [x] OPPDATERING_GUIDE.md

### ✅ Fase 3: Pull av repo & favicon (14. mai 2026)
- [x] Klonet `github.com/meetmax-no/tannlege-per` til /app
- [x] Installert avhengigheter, restartet services
- [x] Erstattet favicon med ny favicon-pakke (svg + ico + png + apple-touch + manifest)
- [x] Oppdatert `site.webmanifest` med "Tannlegene Måreid" + theme-color

### ✅ Fase 4: Color Scheme Switcher (14. mai 2026)
- [x] Opprettet `/public/data/default.json`
- [x] Definert 3 paletter via CSS-variabler i `index.css`
- [x] Tailwind config: `amber.*` peker mot CSS-variabler
- [x] `ThemeProvider` (context + hook) som leser JSON + localStorage
- [x] `ThemeSwitcher` (knapp + dropdown) i header (desktop + mobil)
- [x] Dynamisk oppdatering av `<meta name="theme-color">`
- [x] Verifisert at alle seksjoner (Hero, Services, Pricing, Contact, Footer) bytter farge korrekt

## Prioritized Backlog

### P0 - Innholdsvalg
- [ ] Klienten velger endelig fargetema (1, 2 eller 3) → sette i `default.json`
- [ ] Eventuelle finjusteringer av fargetonene basert på live-test

### P1 - SendGrid e-post-integrasjon (NEXT)
- [ ] Implementere POST /api/contact backend
- [ ] Sende e-post via SendGrid når noen sender kontaktskjema
- [ ] Verifisert avsender + mottaker
- [ ] Koble Contact.jsx mot backend (erstatte mock)

### P1 - Future Enhancements
- [ ] Admin panel for kontaktforespørsler
- [ ] Timebestillingssystem
- [ ] Integrere med eksisterende booking system

### P2 - Nice to Have
- [ ] Multi-language support (norsk/engelsk)
- [ ] Blog/artikkel seksjon
- [ ] Chat-bot
- [ ] Analytics tracking

## Next Action Items
1. Klienten ser live og velger fargetema (sett `colorScheme` til 1/2/3 i `default.json`)
2. Skaffe SendGrid API key, verifisert avsender og mottaker-e-post
3. Implementere SendGrid kontaktskjema-integrasjon
4. Få ekte teambilder
