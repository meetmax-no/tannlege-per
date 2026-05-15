// Lokal smoke-test for /api/contact validering og konfig.
// Tester KUN logikk uten ekte tilkoblinger til Telegram/Resend/Mongo.

import { getNotificationConfig } from '../api/_lib/config.mjs';

let pass = 0;
let fail = 0;
function expect(label, cond) {
  if (cond) { console.log(`✅ ${label}`); pass++; }
  else { console.error(`❌ ${label}`); fail++; }
}

// ---------- Config ----------
console.log('\n--- config.mjs ---');
delete process.env.TELEGRAM_BOT_TOKEN;
delete process.env.TELEGRAM_CHAT_ID;
delete process.env.RESEND_API_KEY;
delete process.env.MONGODB_URI;
delete process.env.TELEGRAM_ENABLED;
delete process.env.EMAIL_ENABLED;
delete process.env.MONGODB_ENABLED;

let cfg = getNotificationConfig();
expect('telegram disabled uten credentials', cfg.telegram.enabled === false);
expect('email disabled uten credentials', cfg.email.enabled === false);
expect('mongo disabled uten credentials', cfg.mongo.enabled === false);

// Bare credentials uten ENABLED=true → fortsatt av
process.env.TELEGRAM_BOT_TOKEN = 'test';
process.env.TELEGRAM_CHAT_ID = '-100';
cfg = getNotificationConfig();
expect('telegram disabled selv med credentials hvis ENABLED ikke satt', cfg.telegram.enabled === false);

process.env.TELEGRAM_ENABLED = 'true';
cfg = getNotificationConfig();
expect('telegram enabled når ENABLED=true + credentials', cfg.telegram.enabled === true);

process.env.TELEGRAM_ENABLED = 'false';
cfg = getNotificationConfig();
expect('telegram disabled når ENABLED=false', cfg.telegram.enabled === false);

process.env.TELEGRAM_ENABLED = 'TRUE'; // case insensitive
cfg = getNotificationConfig();
expect('telegram enabled case-insensitive (TRUE)', cfg.telegram.enabled === true);

// ENABLED=true men credentials mangler → fortsatt av
process.env.EMAIL_ENABLED = 'true';
cfg = getNotificationConfig();
expect('email disabled hvis ENABLED=true men api-key mangler', cfg.email.enabled === false);

process.env.RESEND_API_KEY = 're_xyz';
process.env.RESEND_TO_EMAIL = 'per@test.no';
cfg = getNotificationConfig();
expect('email enabled når ENABLED=true + credentials', cfg.email.enabled === true);

process.env.MONGODB_URI = 'mongodb+srv://test';
cfg = getNotificationConfig();
expect('mongo disabled selv med URI hvis ENABLED ikke satt', cfg.mongo.enabled === false);

process.env.MONGODB_ENABLED = 'true';
cfg = getNotificationConfig();
expect('mongo enabled når ENABLED=true + URI', cfg.mongo.enabled === true);
expect('mongo default db = tannlege-per', cfg.mongo.db === 'tannlege-per');

// ---------- Handler validation ----------
console.log('\n--- contact.mjs validering ---');

// Vi simulerer req/res for å teste handler-validering
async function callHandler(body, method = 'POST') {
  // Importer fresh hver gang for å unngå state
  const { default: handler } = await import('../api/contact.mjs?t=' + Date.now());
  let status = 200;
  let json = null;
  const headers = {};
  const req = {
    method,
    body,
    headers: { 'user-agent': 'test' },
  };
  const res = {
    status(c) { status = c; return res; },
    json(o) { json = o; return res; },
    setHeader(k, v) { headers[k] = v; },
    end() { return res; },
  };
  await handler(req, res);
  return { status, json };
}

// Disable alle kanaler så handleren ikke prøver ekte API-kall
delete process.env.TELEGRAM_BOT_TOKEN;
delete process.env.TELEGRAM_CHAT_ID;
delete process.env.RESEND_API_KEY;
delete process.env.MONGODB_URI;

let r = await callHandler({}, 'GET');
expect('GET returnerer 405', r.status === 405);

r = await callHandler({ name: '', phone: '' });
expect('Tom name = 400 MISSING_NAME', r.status === 400 && r.json.code === 'MISSING_NAME');

r = await callHandler({ name: 'Test' });
expect('Mangler telefon+email = 400 MISSING_CONTACT', r.status === 400 && r.json.code === 'MISSING_CONTACT');

r = await callHandler({ name: 'Test', email: 'ugyldig' });
expect('Ugyldig e-post = 400 INVALID_EMAIL', r.status === 400 && r.json.code === 'INVALID_EMAIL');

r = await callHandler({ name: 'Test', phone: '12345678', hp: 'spam' });
expect('Honeypot fylt = 200 (silent drop)', r.status === 200 && r.json.ok === true);

// Med alle kanaler skrudd av: skal returnere 200 (alt skipped)
r = await callHandler({ name: 'Ola', phone: '12345678', message: 'Hei' });
expect('Gyldig submit uten kanaler = 200 OK', r.status === 200 && r.json.ok === true);

r = await callHandler({ name: '  Lange Navnet  ', phone: '12345678' });
expect('Whitespace trimmes ok = 200', r.status === 200);

const longName = 'a'.repeat(500);
r = await callHandler({ name: longName, phone: '12345678' });
expect('Lange strings trunkeres uten feil = 200', r.status === 200);

console.log(`\n${pass} passert, ${fail} feilet`);
process.exit(fail ? 1 : 0);
