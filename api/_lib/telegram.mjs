// Telegram-varsel via Bot API. Bruker fetch direkte — ingen SDK nødvendig.

function escapeHtml(text) {
  if (!text) return '';
  return String(text)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

// Normalisér norsk telefonnummer til internasjonalt format slik at
// Telegram-mobilappen auto-detekterer det som et klikkbart telefonnummer.
//   "92060612"        → "+47 92 06 06 12"
//   "+47 92 06 06 12" → "+47 92 06 06 12"  (uendret)
//   "004792060612"    → "+47 92 06 06 12"
//   "+15551234567"    → "+15551234567"      (ikke-norsk, returneres uten formatering)
export function formatPhone(input) {
  if (!input) return '';
  const raw = String(input).trim();
  // Behold kun + og siffer
  let digits = raw.replace(/[^\d+]/g, '');

  // Konverter 00XX-prefix til +XX
  if (digits.startsWith('00')) {
    digits = '+' + digits.slice(2);
  }

  // 8 siffer uten landskode → anta norsk
  if (/^\d{8}$/.test(digits)) {
    digits = '+47' + digits;
  }

  // Format norske numre pent: +47 XX XX XX XX
  if (/^\+47\d{8}$/.test(digits)) {
    const n = digits.slice(3);
    return `+47 ${n.slice(0, 2)} ${n.slice(2, 4)} ${n.slice(4, 6)} ${n.slice(6, 8)}`;
  }

  // Andre internasjonale numre — returner som de er (med +)
  return digits;
}

function buildMessage(payload) {
  const { name, phone, email, message, source, utm } = payload;
  const lines = [];
  lines.push(`<b>🦷 Ny henvendelse</b>`);
  if (source) lines.push(`<i>Fra: ${escapeHtml(source)}</i>`);
  lines.push('');
  lines.push(`<b>Navn:</b> ${escapeHtml(name)}`);
  if (phone) {
    // Format med +47-prefix → Telegram-mobil gjør tallet klikkbart for ringing/SMS
    lines.push(`<b>Telefon:</b> ${escapeHtml(formatPhone(phone))}`);
  }
  if (email) lines.push(`<b>E-post:</b> ${escapeHtml(email)}`);
  if (message) {
    lines.push('');
    lines.push(`<b>Melding:</b>`);
    lines.push(escapeHtml(message));
  }
  if (utm && (utm.source || utm.medium || utm.campaign)) {
    lines.push('');
    const parts = [utm.source, utm.medium, utm.campaign].filter(Boolean);
    lines.push(`<i>📊 Kilde: ${escapeHtml(parts.join(' · '))}</i>`);
  }
  return lines.join('\n');
}

export async function sendTelegramNotification(config, payload) {
  const text = buildMessage(payload);

  const body = {
    chat_id: config.chatId,
    text,
    parse_mode: 'HTML',
    disable_web_page_preview: true,
  };

  const url = `https://api.telegram.org/bot${config.token}/sendMessage`;
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const errText = await res.text().catch(() => '');
    throw new Error(`Telegram API ${res.status}: ${errText}`);
  }
  return res.json();
}
