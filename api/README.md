# Kontaktskjema — Vercel-oppsett

Dette dokumentet beskriver hvordan kontaktskjemaet på tannlegeper.no er koblet
opp mot Telegram, Resend (e-post) og MongoDB Atlas — alt via Vercel Serverless
Functions, ingen ekstern backend nødvendig.

## Arkitektur

```
[Pasient sender skjema]
        ↓
[POST /api/contact]   ← Vercel Serverless Function (Node.js, ESM)
        ↓
   ┌────┼────────┬─────────┐
   ↓    ↓        ↓         ↓
[Mongo] [Telegram] [Resend]  (alle valgfri — styrt av env-vars)
```

Filer:
- `/api/contact.mjs` — POST handler + validering + honeypot
- `/api/_lib/config.mjs` — Leser env-vars, avgjør hvilke kanaler som er på
- `/api/_lib/telegram.mjs` — Bot API call, HTML-formatert melding + Ring/SMS-knapper
- `/api/_lib/resend.mjs` — Resend SDK v4, HTML + text e-post
- `/api/_lib/mongo.mjs` — MongoDB driver med connection caching for serverless

## Env-variabler (Vercel Dashboard → Settings → Environment Variables)

| Variabel | Påkrevd for | Eksempel |
|---|---|---|
| `TELEGRAM_BOT_TOKEN` | Telegram | `7891234567:AAH...` |
| `TELEGRAM_CHAT_ID` | Telegram | `-100123456789` |
| `TELEGRAM_ENABLED` | (valgfritt overstyring) | `true` / `false` |
| `RESEND_API_KEY` | E-post | `re_xxx...` |
| `RESEND_FROM_EMAIL` | E-post | `onboarding@resend.dev` (eller verifisert domene) |
| `RESEND_TO_EMAIL` | E-post | `per@tannlegeper.no` |
| `EMAIL_ENABLED` | E-post på/av | `true` (default = false) |
| `MONGODB_URI` | Lagring | `mongodb+srv://user:pwd@cluster.mongodb.net/` |
| `MONGODB_DB` | Lagring (valgfritt) | `tannlege-per` (default) |
| `MONGODB_ENABLED` | (valgfritt overstyring) | `true` / `false` |

**Regel:** En kanal er aktiv hvis credentials finnes OG enabled-flag ikke er
`false`. Email er som standard `false` til DNS er klart — sett `EMAIL_ENABLED=true`
for å aktivere.

## Test lokalt

```bash
cd /app
node tests/test_contact_api.mjs
```

## E2E-test etter Vercel deploy

```bash
curl -X POST https://din-app.vercel.app/api/contact \
  -H 'Content-Type: application/json' \
  -d '{"name":"Test Testesen","phone":"12345678","message":"Hei!","source":"manuell-test"}'
```

Skal returnere `{"ok":true}` og du skal se varsel i Telegram + (om aktivert)
e-post + (om aktivert) ny rad i Atlas → Collections → tannlege-per → contacts.

## Se henvendelser

**Atlas innebygd UI** (anbefalt for sjelden bruk):
1. Logg inn på cloud.mongodb.com
2. Database → Browse Collections → tannlege-per → contacts
3. Søk, filtrer, eksporter til JSON/CSV direkte

**Telegram** (de-facto logg): Alle henvendelser sendes som meldinger i gruppen.
Telegram beholder chat-historikk permanent.

## Endre / skru av en kanal

Vercel Dashboard → Settings → Environment Variables → endre verdi → Redeploy.
F.eks. for å skru på e-post midlertidig: sett `EMAIL_ENABLED=true` og redeploy.
