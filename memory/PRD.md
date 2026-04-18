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

### Backend (Planlagt)
- **Framework:** FastAPI
- **Database:** MongoDB
- **Endpoints:**
  - POST /api/contact - Lagre kontaktskjema

### Images
- Hero: https://images.unsplash.com/photo-1629909613654-28e377c37b09
- Team images: Placeholder images fra Unsplash

## What's Been Implemented (Dato: 18. desember 2025)

### ✅ Fase 1: Frontend med Mock Data
- [x] Opprettet mockData.js med all data (tjenester, team, priser, åpningstider, testimonials)
- [x] Header med sticky navigation og smooth scroll
- [x] Hero section med varm gradient overlay og CTA-knapper
- [x] Services section med 6 tjenestekort og Helfo-informasjon
- [x] Team section med 2 tannleger og 3 pasientomtaler
- [x] Pricing section med accordion for priskategorier
- [x] Opening Hours section med ukeoversikt
- [x] Contact section med kontaktskjema (frontend-only), kontaktinfo og Google Maps
- [x] Footer med navigasjon og kontaktinformasjon
- [x] Toast notifications (Sonner) integrert
- [x] Responsive design for mobil, tablet og desktop
- [x] Inter font integrert
- [x] Warm color scheme (amber/beige)

**Status:** Frontend ferdig med mock data. Klar for visning.

## Prioritized Backlog

### P0 - Neste Sprint
- [ ] Backend implementasjon
  - [ ] MongoDB schema for kontaktskjema
  - [ ] POST /api/contact endpoint
  - [ ] Validering og error handling
  - [ ] Integrere backend med frontend kontaktskjema

### P1 - Future Enhancements
- [ ] E-post notifikasjon ved nye kontaktforespørsler
- [ ] Admin panel for å se kontaktforespørsler
- [ ] Timebestillingssystem
- [ ] Integrere med eksisterende booking system

### P2 - Nice to Have
- [ ] Multi-language support (norsk/engelsk)
- [ ] Blog/artikkel seksjon
- [ ] Chat-bot for spørsmål
- [ ] Analytics tracking

## Next Action Items
1. Vise frontend til klient for godkjenning
2. Planlegge backend implementasjon
3. Teste kontaktskjema funksjonalitet
4. Få ekte bilder av teamet for å erstatte placeholders
