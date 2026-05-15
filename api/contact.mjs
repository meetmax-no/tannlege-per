// POST /api/contact — tar imot kontaktskjema, lagrer i Mongo + sender varsler.
//
// Kanaler (aktiveres ved tilstedeværelse av env-vars):
//   • Telegram  → TELEGRAM_BOT_TOKEN + TELEGRAM_CHAT_ID
//   • E-post    → RESEND_API_KEY + RESEND_TO_EMAIL  (+ EMAIL_ENABLED=true)
//   • MongoDB   → MONGODB_URI
//
// Returnerer alltid 200 til frontend hvis innsendingen er gyldig, selv om
// individuelle kanaler feiler — vi logger feil men avslører dem ikke til pasient.

import { getNotificationConfig } from './_lib/config.mjs';
import { sendTelegramNotification } from './_lib/telegram.mjs';
import { sendEmailNotification } from './_lib/resend.mjs';
import { saveContact } from './_lib/mongo.mjs';

const NAME_MAX = 120;
const PHONE_MAX = 40;
const EMAIL_MAX = 254;
const MESSAGE_MAX = 4000;
const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

function cleanStr(v, max) {
  if (typeof v !== 'string') return '';
  const trimmed = v.trim();
  if (!trimmed) return '';
  return trimmed.length > max ? trimmed.slice(0, max) : trimmed;
}

function validate(body) {
  const name = cleanStr(body.name, NAME_MAX);
  const phone = cleanStr(body.phone, PHONE_MAX);
  const email = cleanStr(body.email, EMAIL_MAX);
  const message = cleanStr(body.message, MESSAGE_MAX);
  const source = cleanStr(body.source, 60);

  if (!name) return { error: 'Navn er påkrevd', code: 'MISSING_NAME' };
  if (!phone && !email) {
    return { error: 'Telefon eller e-post må fylles ut', code: 'MISSING_CONTACT' };
  }
  if (email && !EMAIL_REGEX.test(email)) {
    return { error: 'Ugyldig e-postadresse', code: 'INVALID_EMAIL' };
  }

  const utm = body.utm && typeof body.utm === 'object' ? {
    source: cleanStr(body.utm.source, 60),
    medium: cleanStr(body.utm.medium, 60),
    campaign: cleanStr(body.utm.campaign, 60),
  } : {};

  return {
    payload: { name, phone, email, message, source, utm },
  };
}

export default async function handler(req, res) {
  // CORS — tillat preflight og POST fra samme origin (Vercel håndterer same-origin
  // automatisk, men dette gjør lokal utvikling og evt. annet domene enklere).
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') {
    return res.status(204).end();
  }
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ ok: false, error: 'Method not allowed' });
  }

  let body = req.body;
  if (typeof body === 'string') {
    try { body = JSON.parse(body); } catch { body = {}; }
  }
  body = body || {};

  // Honeypot — bots fyller usynlige felter, ekte brukere ikke.
  if (typeof body.hp === 'string' && body.hp.trim() !== '') {
    // Lat som om alt gikk bra
    return res.status(200).json({ ok: true });
  }

  const v = validate(body);
  if (v.error) {
    return res.status(400).json({ ok: false, error: v.error, code: v.code });
  }

  const cfg = getNotificationConfig();
  const createdAt = new Date().toISOString();
  const payload = { ...v.payload, createdAt };

  // 1) Lagre til Mongo (fire-and-acknowledge — vi venter på den, men feil stopper ikke varsler)
  const channels = { mongo: null, telegram: null, email: null };

  if (cfg.mongo.enabled) {
    try {
      const id = await saveContact(cfg.mongo, {
        ...payload,
        userAgent: cleanStr(req.headers['user-agent'], 300),
      });
      channels.mongo = { ok: true, id: id?.toString?.() };
    } catch (err) {
      console.error('[contact] mongo save failed:', err.message);
      channels.mongo = { ok: false, error: err.message };
    }
  } else {
    channels.mongo = { skipped: true };
  }

  // 2) Telegram + Resend parallelt
  const tasks = [];
  if (cfg.telegram.enabled) {
    tasks.push(
      sendTelegramNotification(cfg.telegram, payload)
        .then(() => { channels.telegram = { ok: true }; })
        .catch((err) => {
          console.error('[contact] telegram failed:', err.message);
          channels.telegram = { ok: false, error: err.message };
        })
    );
  } else {
    channels.telegram = { skipped: true };
  }

  if (cfg.email.enabled) {
    tasks.push(
      sendEmailNotification(cfg.email, payload)
        .then(() => { channels.email = { ok: true }; })
        .catch((err) => {
          console.error('[contact] email failed:', err.message);
          channels.email = { ok: false, error: err.message };
        })
    );
  } else {
    channels.email = { skipped: true };
  }

  await Promise.all(tasks);

  const enabled = {
    mongo: cfg.mongo.enabled,
    telegram: cfg.telegram.enabled,
    email: cfg.email.enabled,
  };
  const anyEnabled = enabled.mongo || enabled.telegram || enabled.email;
  const anySuccess = !!(channels.mongo?.ok || channels.telegram?.ok || channels.email?.ok);

  // Hvis ingen kanaler er aktivert i det hele tatt → returner OK (ingen feil i å ikke ha noen aktiv kanal)
  // Hvis minst én er aktivert, men ingen lyktes → 502
  if (anyEnabled && !anySuccess) {
    console.error('[contact] all enabled channels failed:', JSON.stringify(channels));
    return res.status(502).json({
      ok: false,
      error: 'Kunne ikke levere henvendelsen. Prøv igjen eller ring oss.',
      code: 'ALL_CHANNELS_FAILED',
      channels, // hjelper feilsøking — vises ikke i frontend men kan ses i nettverksfanen
    });
  }

  return res.status(200).json({ ok: true });
}
