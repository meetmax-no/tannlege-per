// Resend-integrasjon — sender e-postvarsel til klinikken.
// Når domene ikke er verifisert: bruk RESEND_FROM_EMAIL=onboarding@resend.dev
// og send kun til adressen som eier Resend-kontoen (RESEND_TO_EMAIL).

import { Resend } from 'resend';

function escapeHtml(text) {
  if (!text) return '';
  return String(text)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/\n/g, '<br/>');
}

function buildHtml(payload) {
  const { name, phone, email, message, source, utm, createdAt } = payload;
  const utmLine = utm && (utm.source || utm.medium || utm.campaign)
    ? [utm.source, utm.medium, utm.campaign].filter(Boolean).join(' · ')
    : '';
  return `<!doctype html>
<html lang="nb">
<body style="font-family:-apple-system,BlinkMacSystemFont,sans-serif;background:#f6f5f1;padding:24px;color:#1a1a1a;">
  <div style="max-width:560px;margin:0 auto;background:white;border-radius:12px;overflow:hidden;box-shadow:0 2px 8px rgba(0,0,0,0.06);">
    <div style="background:#8b6f47;color:white;padding:20px 24px;">
      <h1 style="margin:0;font-size:20px;">🦷 Ny henvendelse</h1>
      ${source ? `<p style="margin:4px 0 0;opacity:0.9;font-size:14px;">Fra: ${escapeHtml(source)}</p>` : ''}
    </div>
    <div style="padding:24px;">
      <table style="width:100%;border-collapse:collapse;font-size:15px;">
        <tr><td style="padding:8px 0;color:#666;width:100px;">Navn</td><td style="padding:8px 0;"><strong>${escapeHtml(name)}</strong></td></tr>
        ${phone ? `<tr><td style="padding:8px 0;color:#666;">Telefon</td><td style="padding:8px 0;"><a href="tel:${escapeHtml(String(phone).replace(/\s/g,''))}" style="color:#8b6f47;">${escapeHtml(phone)}</a></td></tr>` : ''}
        ${email ? `<tr><td style="padding:8px 0;color:#666;">E-post</td><td style="padding:8px 0;"><a href="mailto:${escapeHtml(email)}" style="color:#8b6f47;">${escapeHtml(email)}</a></td></tr>` : ''}
      </table>
      ${message ? `
        <div style="margin-top:20px;padding:16px;background:#f9f7f2;border-radius:8px;">
          <div style="color:#666;font-size:13px;margin-bottom:6px;">Melding</div>
          <div style="white-space:pre-wrap;">${escapeHtml(message)}</div>
        </div>` : ''}
      ${utmLine ? `<p style="margin-top:20px;color:#999;font-size:13px;">📊 Kilde: ${escapeHtml(utmLine)}</p>` : ''}
      ${createdAt ? `<p style="margin-top:8px;color:#bbb;font-size:12px;">${escapeHtml(createdAt)}</p>` : ''}
    </div>
  </div>
</body>
</html>`;
}

function buildText(payload) {
  const { name, phone, email, message, source, utm } = payload;
  const lines = ['Ny henvendelse', ''];
  if (source) lines.push(`Fra: ${source}`);
  lines.push(`Navn: ${name}`);
  if (phone) lines.push(`Telefon: ${phone}`);
  if (email) lines.push(`E-post: ${email}`);
  if (message) { lines.push('', 'Melding:', message); }
  if (utm && (utm.source || utm.medium || utm.campaign)) {
    lines.push('', `Kilde: ${[utm.source, utm.medium, utm.campaign].filter(Boolean).join(' · ')}`);
  }
  return lines.join('\n');
}

export async function sendEmailNotification(config, payload) {
  const resend = new Resend(config.apiKey);
  const subject = payload.source
    ? `🦷 Ny henvendelse (${payload.source}) — ${payload.name}`
    : `🦷 Ny henvendelse — ${payload.name}`;

  const result = await resend.emails.send({
    from: config.from,
    to: [config.to],
    subject,
    html: buildHtml(payload),
    text: buildText(payload),
    replyTo: payload.email || undefined,
  });

  if (result.error) {
    throw new Error(`Resend: ${result.error.message || 'unknown error'}`);
  }
  return result.data;
}
