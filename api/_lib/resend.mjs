// Resend-integrasjon — sender e-postvarsel til klinikken.
// Når domene ikke er verifisert: bruk RESEND_FROM_EMAIL=onboarding@resend.dev
// og send kun til adressen som eier Resend-kontoen (RESEND_TO_EMAIL).
//
// Mail-stil følger valgt fargetema (colorScheme i default.json) for å være
// konsistent med nettsiden. Brun (1) er default.

import { Resend } from 'resend';
import { getEmailPalette } from './theme.mjs';

function escapeHtml(text) {
  if (!text) return '';
  return String(text)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/\n/g, '<br/>');
}

function formatPhoneDisplay(input) {
  if (!input) return '';
  let digits = String(input).trim().replace(/[^\d+]/g, '');
  if (digits.startsWith('00')) digits = '+' + digits.slice(2);
  if (/^\d{8}$/.test(digits)) digits = '+47' + digits;
  if (/^\+47\d{8}$/.test(digits)) {
    const n = digits.slice(3);
    return `+47 ${n.slice(0, 2)} ${n.slice(2, 4)} ${n.slice(4, 6)} ${n.slice(6, 8)}`;
  }
  return digits || String(input);
}

function phoneHref(input) {
  if (!input) return '';
  let d = String(input).trim().replace(/[^\d+]/g, '');
  if (d.startsWith('00')) d = '+' + d.slice(2);
  if (/^\d{8}$/.test(d)) d = '+47' + d;
  return d;
}

function buildHtml(payload, p) {
  const { name, phone, email, message, source, utm, createdAt } = payload;
  const utmLine = utm && (utm.source || utm.medium || utm.campaign)
    ? [utm.source, utm.medium, utm.campaign].filter(Boolean).join(' · ')
    : '';
  const tel = phoneHref(phone);
  const phoneDisplay = formatPhoneDisplay(phone);

  return `<!doctype html>
<html lang="nb">
<body style="margin:0;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;background:${p.bg};padding:24px;color:${p.text};">
  <div style="max-width:560px;margin:0 auto;background:white;border-radius:12px;overflow:hidden;box-shadow:0 4px 16px rgba(0,0,0,0.08);">
    <div style="background:${p.primary};color:white;padding:24px 28px;">
      <h1 style="margin:0;font-size:22px;font-weight:700;letter-spacing:-0.01em;">🦷 Ny henvendelse</h1>
      ${source ? `<p style="margin:6px 0 0;opacity:0.9;font-size:14px;">Fra: ${escapeHtml(source)}</p>` : ''}
    </div>
    <div style="padding:28px;">
      <table style="width:100%;border-collapse:collapse;font-size:15px;line-height:1.5;">
        <tr>
          <td style="padding:10px 0;color:${p.textMuted};width:110px;vertical-align:top;">Navn</td>
          <td style="padding:10px 0;"><strong>${escapeHtml(name)}</strong></td>
        </tr>
        ${phone ? `<tr>
          <td style="padding:10px 0;color:${p.textMuted};vertical-align:top;">Telefon</td>
          <td style="padding:10px 0;"><a href="tel:${escapeHtml(tel)}" style="color:${p.accent};text-decoration:none;font-weight:600;">${escapeHtml(phoneDisplay)}</a></td>
        </tr>` : ''}
        ${email ? `<tr>
          <td style="padding:10px 0;color:${p.textMuted};vertical-align:top;">E-post</td>
          <td style="padding:10px 0;"><a href="mailto:${escapeHtml(email)}" style="color:${p.accent};text-decoration:none;">${escapeHtml(email)}</a></td>
        </tr>` : ''}
      </table>
      ${message ? `
        <div style="margin-top:24px;padding:18px 20px;background:${p.bgSoft};border-left:3px solid ${p.accent};border-radius:6px;">
          <div style="color:${p.textMuted};font-size:13px;margin-bottom:8px;font-weight:600;text-transform:uppercase;letter-spacing:0.04em;">Melding</div>
          <div style="white-space:pre-wrap;color:${p.text};">${escapeHtml(message)}</div>
        </div>` : ''}
      ${phone ? `
        <div style="margin-top:24px;text-align:center;">
          <a href="tel:${escapeHtml(tel)}" style="display:inline-block;padding:14px 28px;background:${p.primary};color:white;text-decoration:none;border-radius:8px;font-weight:600;font-size:15px;">📞 Ring tilbake</a>
        </div>` : ''}
      ${utmLine ? `<p style="margin-top:24px;color:${p.textMuted};font-size:13px;border-top:1px solid ${p.bgSoft};padding-top:16px;">📊 Kilde: ${escapeHtml(utmLine)}</p>` : ''}
      ${createdAt ? `<p style="margin-top:8px;color:#bbb;font-size:12px;">Mottatt: ${escapeHtml(createdAt)}</p>` : ''}
    </div>
    <div style="background:${p.bgSoft};padding:16px 28px;text-align:center;font-size:12px;color:${p.textMuted};">
      Sendt fra kontaktskjema på tannlegeper.no
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
  if (phone) lines.push(`Telefon: ${formatPhoneDisplay(phone)}`);
  if (email) lines.push(`E-post: ${email}`);
  if (message) { lines.push('', 'Melding:', message); }
  if (utm && (utm.source || utm.medium || utm.campaign)) {
    lines.push('', `Kilde: ${[utm.source, utm.medium, utm.campaign].filter(Boolean).join(' · ')}`);
  }
  return lines.join('\n');
}

export async function sendEmailNotification(config, payload) {
  const resend = new Resend(config.apiKey);
  const palette = await getEmailPalette();

  const subject = payload.source
    ? `🦷 Ny henvendelse (${payload.source}) — ${payload.name}`
    : `🦷 Ny henvendelse — ${payload.name}`;

  const result = await resend.emails.send({
    from: config.from,
    to: [config.to],
    subject,
    html: buildHtml(payload, palette),
    text: buildText(payload),
    replyTo: payload.email || undefined,
  });

  if (result.error) {
    throw new Error(`Resend: ${result.error.message || 'unknown error'}`);
  }
  return result.data;
}
