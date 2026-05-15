// Tema-resolver for backend: leser valgt farge-scheme fra
// frontend/public/data/default.json og returnerer hex-verdier som matcher
// CSS-variablene i index.css. Holder e-post-design synkronisert med
// nettsidens fargevalg.
//
// Verdier matcher --brand-700/--brand-50/--brand-meta i index.css.

import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

const PALETTES = {
  1: {
    name: 'brown',
    primary: '#B45309',      // --brand-700
    primaryDark: '#92400E',  // --brand-800
    accent: '#D97706',       // --brand-meta / --brand-600
    bg: '#FFFBEB',           // --brand-50
    bgSoft: '#FEF3C7',       // --brand-100
    text: '#1a1a1a',
    textMuted: '#666',
  },
  2: {
    name: 'lightblue',
    primary: '#0369A1',      // --brand-700
    primaryDark: '#075985',  // --brand-800
    accent: '#0284C7',       // --brand-meta
    bg: '#F0F9FF',           // --brand-50
    bgSoft: '#E0F2FE',       // --brand-100
    text: '#1a1a1a',
    textMuted: '#666',
  },
  3: {
    name: 'lightgreen',
    primary: '#047857',      // --brand-700
    primaryDark: '#065F46',  // --brand-800
    accent: '#059669',       // --brand-meta
    bg: '#ECFDF5',           // --brand-50
    bgSoft: '#D1FAE5',       // --brand-100
    text: '#1a1a1a',
    textMuted: '#666',
  },
};

const DEFAULT_SCHEME = 1; // brun som fallback

let cachedScheme = null;
let cachedAt = 0;
const CACHE_TTL_MS = 60_000; // 1 min — endringer i default.json plukkes opp uten redeploy

async function readScheme() {
  // Bruk in-memory cache i serverless for å unngå disk-IO på hvert kall.
  const now = Date.now();
  if (cachedScheme !== null && now - cachedAt < CACHE_TTL_MS) {
    return cachedScheme;
  }

  try {
    const here = dirname(fileURLToPath(import.meta.url));
    // Filen ligger i /app/api/_lib/, default.json i /app/frontend/public/data/
    const path = resolve(here, '..', '..', 'frontend', 'public', 'data', 'default.json');
    const raw = await readFile(path, 'utf-8');
    const data = JSON.parse(raw);
    const s = Number(data.colorScheme);
    // colorScheme=0 betyr "preview" på frontend (bruker velger via UI) →
    // for e-post bruker vi brun som default da.
    const scheme = s >= 1 && s <= 3 ? s : DEFAULT_SCHEME;
    cachedScheme = scheme;
    cachedAt = now;
    return scheme;
  } catch (err) {
    console.warn('[theme] kunne ikke lese default.json, bruker brun:', err.message);
    cachedScheme = DEFAULT_SCHEME;
    cachedAt = now;
    return DEFAULT_SCHEME;
  }
}

export async function getEmailPalette() {
  const scheme = await readScheme();
  return PALETTES[scheme] || PALETTES[DEFAULT_SCHEME];
}
