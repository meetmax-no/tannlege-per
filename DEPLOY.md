# DEPLOY.md — Tannlege Per

Komplett oppsett for å rulle ut prosjektet på en ny Vercel-konto eller flytte til
ny kunde. Alt du trenger på ett sted.

**Sist oppdatert:** 15. mai 2026

---

## 📦 Stack-oversikt

| Lag | Tjeneste | Plan | Pris |
|---|---|---|---|
| Frontend hosting | Vercel | Hobby/Pro | Gratis* |
| Serverless backend | Vercel Functions | (samme deploy) | Gratis* |
| Database | MongoDB Atlas | M0 Free | Gratis (512 MB) |
| Push-varsel | Telegram Bot | — | Gratis |
| E-post | Resend | Free | Gratis (3000/mnd) |
| Analytics | Vercel Analytics | Free | Gratis (50k events/mnd) |

\* Hobby-plan dekker dette prosjektet med god margin.

---

## 🔑 Vercel Environment Variables — komplett liste

Sett alle disse i **Vercel Dashboard → Settings → Environment Variables**.
Husk å krysse av **Production**, **Preview** og **Development** for hver.

### Telegram (obligatorisk for varsler)
| Variabel | Verdi | Hvor finner du den |
|---|---|---|
| `TELEGRAM_BOT_TOKEN` | `8720004396:AAH...` | Fra @BotFather når boten ble laget |
| `TELEGRAM_CHAT_ID` | `-5218791898` | Hentes via `https://api.telegram.org/bot<TOKEN>/getUpdates` etter å ha sendt en melding i gruppen |
| `TELEGRAM_ENABLED` | `true` | Krever eksplisitt `true` for å aktivere |

### MongoDB (obligatorisk for lagring)
| Variabel | Verdi | Hvor finner du den |
|---|---|---|
| `MONGODB_URI` | `mongodb+srv://kodo_pm_app:<password>@kodo-pm.0qorlm2.mongodb.net/?appName=KoDo-PM` | Atlas → Connect → Drivers → Node.js |
| `MONGODB_DB` | `tannlege-per` | (valgfritt, default) |
| `MONGODB_ENABLED` | `true` | Krever eksplisitt `true` |

### Resend (obligatorisk for e-post)
| Variabel | Verdi | Hvor finner du den |
|---|---|---|
| `RESEND_API_KEY` | `re_xxx...` | Resend → API Keys → Create |
| `RESEND_FROM_EMAIL` | `onboarding@resend.dev` (test) eller `noreply@kodoconsult.no` (verifisert) | Hardkodes etter DNS-verifisering |
| `RESEND_TO_EMAIL` | `firma@kodoconsult.no` | Per sin eller din mottaker — må matche Resend-konto før DNS er verifisert |
| `EMAIL_ENABLED` | `true` | Krever eksplisitt `true` |

### Generelle regler
- Alle kanaler krever `*_ENABLED=true` **i tillegg til** credentials. Ingen skjulte fallbacks.
- Etter env-var-endring: **redeploy** (Deployments → ⋯ → Redeploy). Vercel bruker ikke nye env-vars på eksisterende deploys automatisk.

---

## 🎨 default.json — hva som styrer hva

Fil: `frontend/public/data/default.json`

```json
{
  "_meta": { "...": "intern dokumentasjon" },
  "colorScheme": 0,
  "studentColorScheme": 0
}
```

### `colorScheme` (hovedside)
| Verdi | Effekt |
|---|---|
| `0` | Viser preview-knapp i header → besøkende kan velge farge (kun for demo) |
| `1` | 🟤 Brun (Pebble Brown) — låst |
| `2` | 🔵 Lysblå (Pebble Blue) — låst |
| `3` | 🟢 Lysgrønn (Pebble Green) — låst |

### `studentColorScheme` (student-siden `/student`)
Samme prinsipp som over, men styrer kun student-landingen uavhengig.

### Hvordan endre tema
1. Rediger `default.json` i GitHub eller lokalt
2. Commit + push → Vercel auto-deployer
3. Endring synlig innen 1-2 min
4. **Bonus:** Mail-mal følger automatisk samme tema (cached 1 min i serverless)

---

## 🚀 Førstegangs-deploy (ny Vercel-konto)

### Steg 1: Vercel-prosjekt
1. Vercel Dashboard → Add New → Project
2. Import GitHub-repoet
3. Framework Preset: **Create React App**
4. Root Directory: `frontend/` (KUN frontend mappes — Vercel finner `api/` automatisk på root)
5. **Ikke** deploy ennå — legg inn env-vars først (se neste steg)

### Steg 2: Legg inn alle env-vars (se tabell over)

### Steg 3: Deploy
- Trykk **Deploy**
- Vent ~2 min

### Steg 4: E2E-verifisering
- Åpne prod-URL → send en testhenvendelse
- Sjekk:
  - 🟢 Telegram-gruppen → tekstmelding + kontaktkort
  - 🟢 MongoDB Atlas → Browse Collections → tannlege-per → contacts (1 ny rad)
  - 🟢 Resend → Emails → Sending (mail listed, status `delivered` etter DNS-verifisering)

---

## 🌐 Etter at DNS for `kodoconsult.no` er verifisert hos Resend

1. Resend → Domains → bekreft at `kodoconsult.no` står som **Verified**
2. Vercel → Settings → Environment Variables → endre:
   ```
   RESEND_FROM_EMAIL = noreply@kodoconsult.no
   ```
   (Valgfritt pent format: `Tannlegene Måreid <noreply@kodoconsult.no>`)
3. Vercel → Deployments → ⋯ → Redeploy
4. Send test-skjema → sjekk at mail kommer fram uten å gå i spam

---

## 🔐 Sikkerhets-rotering (anbefalt etter hver felles setup-økt)

### Roter MongoDB-passord
1. Atlas → Database Access → `kodo_pm_app` → Edit
2. Edit Password → Autogenerate Secure Password → kopier nytt passord
3. Update User
4. Bygg ny `MONGODB_URI` med nytt passord
5. Vercel → Settings → Environment Variables → oppdater `MONGODB_URI`
6. Redeploy

### Roter Telegram-token (hvis kompromittert)
1. @BotFather → `/mybots` → din bot → API Token → **Revoke current token**
2. Kopier ny token
3. Vercel → oppdater `TELEGRAM_BOT_TOKEN` → Redeploy

### Roter Resend API-key
1. Resend → API Keys → din key → **Revoke**
2. Create new key → kopier
3. Vercel → oppdater `RESEND_API_KEY` → Redeploy

---

## 🌍 Network Access (Atlas)

Vercel serverless har dynamiske IP-er. Atlas Network Access må derfor være satt
til **`0.0.0.0/0`** (Allow Access from Anywhere).

Sikkerhet ivaretas av:
- TLS-kryptering (tvunget)
- Sterkt autogenerert passord
- Database-bruker har kun rettigheter til `tannlege-per`-DB
- Innebygd brute-force-beskyttelse

---

## 📈 Hvor finner Per henvendelsene?

### Telegram-gruppen (primær)
- Push-varsel umiddelbart
- Trykk på kontaktkortet → Ring eller Add Contact (vCard lagrer pasient + melding i NOTE-felt)
- Historikk: alle meldinger ligger i chatten permanent

### MongoDB Atlas (historikk)
- cloud.mongodb.com → Database → Browse Collections → `tannlege-per` → `contacts`
- Filter-eksempler:
  - Alle fra QR-plakat: `{ "utm.source": "qr" }`
  - Studentkampanjen: `{ "utm.campaign": "studenttilbud-akp" }`
  - Denne uka: `{ "createdAt": { "$gte": "2026-05-12" } }`
- Eksporter til JSON/CSV med Export-knappen

### Resend (e-post-arkiv, etter DNS)
- resend.com → Emails → søk/filtrer

---

## 🧪 Lokale tester

```bash
cd /app
node tests/test_contact_api.mjs     # 20 cases — validering + config
node tests/test_phone_format.mjs    # 8 cases — E.164-formattering
node tests/test_email_theme.mjs     # 2 cases + genererer HTML-preview
```

Alle skal returnere `0 feilet`.

---

## 🆘 Feilsøking

| Symptom | Sjekk |
|---|---|
| Skjema returnerer 502 `ALL_CHANNELS_FAILED` | Åpne nettverksfanen i devtools → response viser `channels`-objekt med detaljer per kanal |
| Telegram-varsel kommer ikke | Bot fjernet fra gruppen? Token rotert? Test direkte: `https://api.telegram.org/bot<TOKEN>/sendMessage?chat_id=<ID>&text=test` |
| MongoDB timeout | Atlas Network Access har `0.0.0.0/0`? IP-listen vises i Atlas → Security → Network Access |
| Resend bouncer | Klikk Bounced-raden i Resend → SMTP response viser eksakt grunn (typisk DNS/spam/content-filter) |
| Endring i env-var ingen effekt | Glemt å redeploye? Vercel → Deployments → ⋯ → Redeploy |

---

## 📂 Filstruktur (referanse)

```
/app/
├── api/                          # Vercel Serverless Functions
│   ├── contact.mjs               # POST handler
│   ├── README.md                 # Teknisk env-referanse
│   └── _lib/
│       ├── config.mjs            # Env-var-styring
│       ├── telegram.mjs          # Bot API + kontaktkort
│       ├── resend.mjs            # E-post m/ tema
│       ├── mongo.mjs             # Atlas-tilkobling
│       └── theme.mjs             # Tema-paletter
├── frontend/
│   ├── public/
│   │   └── data/
│   │       └── default.json      # ColorScheme-styring
│   └── src/
│       ├── components/Contact.jsx
│       ├── pages/StudentLanding.jsx
│       └── lib/contactApi.js     # Klient-side fetch-helper
├── tests/                        # Lokale tester
├── package.json                  # Root deps (mongodb + resend)
├── vercel.json                   # Build + rewrite-regler
├── DEPLOY.md                     # ← du er her
└── memory/PRD.md                 # Produkt-historikk
```

---

## ⚙️ Et siste lite triks

For å skru av en kanal **midlertidig** uten å slette credentials:
```
TELEGRAM_ENABLED=false
```
Verdiene blir værende, men kanalen er av. Veldig praktisk under vedlikehold.
