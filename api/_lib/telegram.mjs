// Telegram-varsel via Bot API. Sender to meldinger per henvendelse:
//   1) Tekstmelding med alle detaljer (HTML-format)
//   2) Kontaktkort med klikkbar Ring/Lagre-knapp (kun hvis telefon er gitt)
// Bot API godtar ikke tel:-lenker i tekst/knapper, så kontaktkort er eneste vei
// til ett-trykks-oppringing.

function escapeHtml(text) {
  if (!text) return '';
  return String(text)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

// Normalisér norsk telefonnummer til E.164-format (+4792060612).
// Returnerer null hvis input ikke ser ut som et gyldig nummer.
export function toE164(input) {
  if (!input) return null;
  let digits = String(input).trim().replace(/[^\d+]/g, '');
  if (digits.startsWith('00')) digits = '+' + digits.slice(2);
  if (/^\d{8}$/.test(digits)) digits = '+47' + digits;   // norsk uten landskode
  if (!/^\+\d{7,15}$/.test(digits)) return null;
  return digits;
}

// Pent visningsformat for norske numre: "+47 92 06 06 12"
export function formatPhone(input) {
  const e164 = toE164(input);
  if (!e164) return input ? String(input) : '';
  if (/^\+47\d{8}$/.test(e164)) {
    const n = e164.slice(3);
    return `+47 ${n.slice(0, 2)} ${n.slice(2, 4)} ${n.slice(4, 6)} ${n.slice(6, 8)}`;
  }
  return e164;
}

function splitName(fullName) {
  const parts = String(fullName || '').trim().split(/\s+/);
  if (parts.length === 0) return { first: '', last: '' };
  if (parts.length === 1) return { first: parts[0], last: '' };
  return { first: parts[0], last: parts.slice(1).join(' ') };
}

function buildTextMessage(payload) {
  const { name, phone, email, message, source, utm } = payload;
  const lines = [];
  lines.push(`<b>🦷 Ny henvendelse</b>`);
  if (source) lines.push(`<i>Fra: ${escapeHtml(source)}</i>`);
  lines.push('');
  lines.push(`<b>Navn:</b> ${escapeHtml(name)}`);
  if (phone) lines.push(`<b>Telefon:</b> ${escapeHtml(formatPhone(phone))}`);
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
  if (phone) {
    lines.push('');
    lines.push(`<i>👇 Trykk på kontaktkortet under for å ringe</i>`);
  }
  return lines.join('\n');
}

async function telegramRequest(token, method, body) {
  const url = `https://api.telegram.org/bot${token}/${method}`;
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const errText = await res.text().catch(() => '');
    throw new Error(`Telegram ${method} ${res.status}: ${errText}`);
  }
  return res.json();
}

export async function sendTelegramNotification(config, payload) {
  // 1) Tekstmelding med alle detaljer
  await telegramRequest(config.token, 'sendMessage', {
    chat_id: config.chatId,
    text: buildTextMessage(payload),
    parse_mode: 'HTML',
    disable_web_page_preview: true,
  });

  // 2) Kontaktkort — kun hvis vi har et gyldig telefonnummer (E.164)
  const e164 = toE164(payload.phone);
  if (e164) {
    const { first, last } = splitName(payload.name);
    const tagParts = [];
    if (payload.source) tagParts.push(payload.source);
    const tag = tagParts.length ? ` (${tagParts.join(' · ')})` : '';

    // vCard med melding i NOTE-feltet (lagres når Per legger til kontakten)
    const vcardLines = [
      'BEGIN:VCARD',
      'VERSION:3.0',
      `N:${last};${first};;;`,
      `FN:${first}${last ? ' ' + last : ''}`,
      `TEL;TYPE=CELL:${e164}`,
    ];
    if (payload.email) vcardLines.push(`EMAIL:${payload.email}`);
    if (payload.message) {
      // vCard NOTE: bytt linjeskift med \n (literal) for vCard-spec
      const note = String(payload.message).replace(/\r?\n/g, '\\n');
      vcardLines.push(`NOTE:${note}`);
    }
    vcardLines.push('END:VCARD');

    await telegramRequest(config.token, 'sendContact', {
      chat_id: config.chatId,
      phone_number: e164,
      first_name: first || 'Pasient',
      last_name: last ? `${last}${tag}` : tag.trim() || undefined,
      vcard: vcardLines.join('\n'),
    });
  }

  return { ok: true };
}
