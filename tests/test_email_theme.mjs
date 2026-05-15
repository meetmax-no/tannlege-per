// Test theme-resolver + generer HTML-preview for alle 3 fargetemaer
import { writeFile } from 'node:fs/promises';
import { getEmailPalette } from '../api/_lib/theme.mjs';

let pass = 0, fail = 0;
function expect(label, cond) {
  if (cond) { console.log(`✅ ${label}`); pass++; }
  else { console.error(`❌ ${label}`); fail++; }
}

// Test 1: Default colorScheme=0 → brun (palette 1)
const p = await getEmailPalette();
expect('default colorScheme=0 → brun palett', p.name === 'brown');
expect('brun primary = #B45309', p.primary === '#B45309');

console.log('\n--- Genererer HTML-preview for alle 3 temaer ---');

// Importer rendering-funksjonen via re-eksport
import { Resend } from 'resend';

// Vi vil kalle buildHtml direkte, men den er ikke eksportert. Vi simulerer
// hele e-post-generering ved å stub'e Resend og fange opp HTML-en.
const palettes = [
  { name: 'brun', primary: '#B45309', primaryDark: '#92400E', accent: '#D97706', bg: '#FFFBEB', bgSoft: '#FEF3C7', text: '#1a1a1a', textMuted: '#666' },
  { name: 'lysblå', primary: '#0369A1', primaryDark: '#075985', accent: '#0284C7', bg: '#F0F9FF', bgSoft: '#E0F2FE', text: '#1a1a1a', textMuted: '#666' },
  { name: 'lysgrønn', primary: '#047857', primaryDark: '#065F46', accent: '#059669', bg: '#ECFDF5', bgSoft: '#D1FAE5', text: '#1a1a1a', textMuted: '#666' },
];

// Hent buildHtml ved å lese filen direkte og eval'e (eller bare bruk Resend mock)
// Enklere: importer dynamisk og monkey-patch Resend
const sample = {
  name: 'Michael Leo Aagreen',
  phone: '92060612',
  email: 'firma@meetmax.no',
  message: 'Jeg vil gjerne ha kaffe og en tannpuss',
  source: 'hovedside',
  utm: { source: 'qr', medium: 'poster', campaign: 'studenttilbud-akp' },
  createdAt: '2026-05-15T11:00:00.000Z',
};

// Importer resend-modulen og bytt ut Resend-klassen midlertidig
import('../api/_lib/resend.mjs').then(async ({ sendEmailNotification }) => {
  for (const palette of palettes) {
    // Vi kan ikke direkte forby Resend SDK fra å nettverkskalle.
    // Bruker captured HTML i stedet ved å importere buildHtml — men det er
    // ikke eksportert. La oss heller bare gjenskape HTML her med kjent layout.
    // For å unngå duplisering: les resend.mjs og hent ut buildHtml-funksjonen.
  }

  // Enklere: lag previews ved å bare generere HTML inline med palette-data
  const { readFile } = await import('node:fs/promises');
  const src = await readFile('/app/api/_lib/resend.mjs', 'utf-8');

  // Eval buildHtml ved å rendre filen i en lokal scope
  // Lager en wrapper-fil som eksporterer buildHtml
  const previewSrc = src.replace(
    /function buildHtml\(payload, p\) \{/,
    'export function buildHtml(payload, p) {'
  );
  await writeFile('/app/api/_lib/.resend_preview.mjs', previewSrc);
  const { buildHtml } = await import('/app/api/_lib/.resend_preview.mjs');

  for (const palette of palettes) {
    const html = buildHtml(sample, palette);
    const path = `/app/tests/email_preview_${palette.name}.html`;
    await writeFile(path, html);
    console.log(`📧 ${palette.name.padEnd(10)} → ${path}`);
  }

  // Rydd
  const { unlink } = await import('node:fs/promises');
  await unlink('/app/api/_lib/.resend_preview.mjs');

  console.log(`\n${pass} passert, ${fail} feilet`);
  process.exit(fail ? 1 : 0);
});
