// Telegram-varsel via Bot API. Bruker fetch direkte — ingen SDK nødvendig.

function escapeHtml(text) {
  if (!text) return '';
  return String(text)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

function buildMessage(payload) {
  const { name, phone, email, message, source, utm } = payload;
  const lines = [];
  lines.push(`<b>🦷 Ny henvendelse</b>`);
  if (source) lines.push(`<i>Fra: ${escapeHtml(source)}</i>`);
  lines.push('');
  lines.push(`<b>Navn:</b> ${escapeHtml(name)}`);
  if (phone) lines.push(`<b>Telefon:</b> ${escapeHtml(phone)}`);
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

function buildKeyboard(phone) {
  if (!phone) return undefined;
  const tel = String(phone).replace(/\s/g, '');
  return {
    inline_keyboard: [
      [
        { text: '📞 Ring tilbake', url: `tel:${tel}` },
        { text: '💬 Send SMS', url: `sms:${tel}` },
      ],
    ],
  };
}

export async function sendTelegramNotification(config, payload) {
  const text = buildMessage(payload);
  const reply_markup = buildKeyboard(payload.phone);

  const body = {
    chat_id: config.chatId,
    text,
    parse_mode: 'HTML',
    disable_web_page_preview: true,
  };
  if (reply_markup) body.reply_markup = reply_markup;

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
