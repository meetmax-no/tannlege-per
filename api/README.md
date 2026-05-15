# Kontaktskjema — Vercel-oppsett

Dette dokumentet beskriver hvordan kontaktskjemaet på tannlegeper.no er koblet
opp mot Telegram, Resend (e-post) og MongoDB Atlas — alt via Vercel Serverless
Functions, ingen ekstern backend nødvendig.

## Status (15. mai 2026)

- 🟢 Telegram — **AKTIV i produksjon**
- ⚪ MongoDB — kode klar, venter på Atlas-oppsett + env-vars
- ⚪ E-post (Resend) — kode klar, venter på Resend-konto + DNS-verifisering

## Arkitektur

```
[Pasient sender skjema]
        ↓
[POST /api/contact]   ← Vercel Serverless Function (Node.js 20, ESM)
        ↓
   ┌────┼────────┬─────────┐
   ↓    ↓        ↓         ↓
[Mongo] [Telegram] [Resend]  (alle valgfri — styrt av env-vars)
```

Filer:
- `/api/contact.mjs` — POST handler + validering + honeypot + per-kanal feilrapportering
- `/api/_lib/config.mjs` — Leser env-vars, eksplisitt `*_ENABLED=true`-regel
- `/api/_lib/telegram.mjs` — Bot API call, HTML-format + norsk-tlf-auto-formattering
- `/api/_lib/resend.mjs` — Resend SDK v4, HTML + text e-post
- `/api/_lib/mongo.mjs` — MongoDB driver med connection caching for serverless

## Aktiveringsregel

Hver kanal aktiveres KUN når begge betingelser er oppfylt:
1. Credentials (token/api-key/uri) finnes
2. `*_ENABLED=true` er satt eksplisitt

Mangler en av delene, er kanalen AV. Ingen skjulte fallbacks.

## Env-variabler (Vercel Dashboard → Settings → Environment Variables)

| Variabel | Påkrevd for | Eksempel |
|---|---|---|
| `TELEGRAM_BOT_TOKEN` | Telegram | `7891234567:AAH...` |
| `TELEGRAM_CHAT_ID` | Telegram | `-5218791898` |
| `TELEGRAM_ENABLED` | Telegram | `true` (obligatorisk for å aktivere) |
| `RESEND_API_KEY` | E-post | `re_xxx...` |
| `RESEND_FROM_EMAIL` | E-post | `onboarding@resend.dev` (eller verifisert domene) |
| `RESEND_TO_EMAIL` | E-post | `per@tannlegeper.no` |
| `EMAIL_ENABLED` | E-post | `true` (obligatorisk for å aktivere) |
| `MONGODB_URI` | Lagring | `mongodb+srv://user:pwd@cluster.mongodb.net/` |
| `MONGODB_DB` | Lagring (valgfritt) | `tannlege-per` (default) |
| `MONGODB_ENABLED` | Lagring | `true` (obligatorisk for å aktivere) |

⚠️ **Etter endring av env-vars må du redeploye** (Deployments → ⋯ → Redeploy).
Vercel bruker ikke nye env-vars på eksisterende deploys automatisk.

## Test lokalt

```bash
cd /app
node tests/test_contact_api.mjs    # 20 tester
node tests/test_phone_format.mjs   # 8 tester
```

## E2E-test etter Vercel deploy

Send et POST-kall til API-et (kan gjøres fra Postman/Insomnia/Bruno hvis du
ikke bruker terminal):

```
POST https://per-tannlege.vercel.app/api/contact
Content-Type: application/json

{
  "name": "Test Testesen",
  "phone": "92060612",
  "message": "Hei!",
  "source": "manuell-test"
}
```

Forventet: `{"ok":true}` og Telegram-varsel i gruppen innen 1-2 sek.

## Feilsøking

Hvis API-kallet feiler med 502 og `code: "ALL_CHANNELS_FAILED"`, sjekk
`channels`-feltet i responsen. Det viser per-kanal-status:

```json
{
  "channels": {
    "telegram": { "ok": false, "error": "Telegram API 400: ..." },
    "email": { "skipped": true },
    "mongo": { "skipped": true }
  }
}
```

Vanlige Telegram-feil:
- `chat not found` → feil `TELEGRAM_CHAT_ID` (husk minus-tegn for grupper)
- `Unauthorized` → feil `TELEGRAM_BOT_TOKEN`
- `bot was kicked` → boten er fjernet fra gruppen

## Se henvendelser (når Mongo er aktivert)

**Atlas innebygd UI** (anbefalt for sjelden bruk):
1. Logg inn på cloud.mongodb.com
2. Database → Browse Collections → tannlege-per → contacts
3. Søk, filtrer, eksporter til JSON/CSV direkte

**Telegram** (de-facto logg): Alle henvendelser sendes som meldinger i gruppen.
Telegram beholder chat-historikk permanent.

## Endre / skru av en kanal

Vercel Dashboard → Settings → Environment Variables → endre verdi → Redeploy.

- Skru AV en kanal midlertidig: sett `*_ENABLED=false` (token/key kan ligge igjen)
- Skru PÅ en kanal: sett `*_ENABLED=true` (credentials må også være satt)
