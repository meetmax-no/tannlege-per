import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Printer, Palette } from 'lucide-react';
import { useTheme, STUDENT_THEMES } from '../context/ThemeContext';

const POSTER_URL = 'per-tannlege.vercel.app/student';
const POSTER_URL_FULL = 'https://per-tannlege.vercel.app/student';

const QR_API = 'https://api.qrserver.com/v1/create-qr-code/';

const c = (v) => `var(--st-${v})`;

export const StudentPoster = () => {
  const { studentScheme, setStudentScheme, isStudentPreviewMode } = useTheme();
  const [localTheme, setLocalTheme] = useState(studentScheme);

  useEffect(() => {
    setLocalTheme(studentScheme);
  }, [studentScheme]);

  useEffect(() => {
    document.title = 'Plakat · Studenttilbud — Tannlegene Måreid';
  }, []);

  // QR-kode med stor størrelse og høy feilkorreksjon for plakat
  const qrSrc = `${QR_API}?data=${encodeURIComponent(POSTER_URL_FULL)}&size=800x800&ecc=H&margin=2`;

  const handlePrint = () => window.print();
  const pickTheme = (id) => {
    setLocalTheme(id);
    if (isStudentPreviewMode) setStudentScheme(id);
  };

  return (
    <div className="min-h-screen bg-stone-100">
      {/* TOOLBAR — vises ikke ved utskrift */}
      <div className="poster-toolbar bg-white border-b border-stone-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between gap-3 flex-wrap">
          <div className="flex items-center gap-3">
            <Link
              to="/student"
              className="flex items-center gap-2 text-sm font-medium text-stone-600 hover:text-stone-900"
            >
              <ArrowLeft size={16} /> Tilbake
            </Link>
            <span className="text-stone-300">|</span>
            <span className="text-sm font-bold text-stone-900">Plakat — Studenttilbud</span>
          </div>

          <div className="flex items-center gap-3 flex-wrap">
            <div className="flex items-center gap-2 text-xs text-stone-600">
              <Palette size={14} /> Tema:
              <div className="flex gap-1.5">
                {[1, 2, 3, 4].map((id) => (
                  <button
                    key={id}
                    type="button"
                    onClick={() => pickTheme(id)}
                    aria-label={STUDENT_THEMES[id].name}
                    title={STUDENT_THEMES[id].name}
                    className={`w-6 h-6 rounded-full transition-transform border ${
                      localTheme === id
                        ? 'border-stone-900 scale-110 ring-2 ring-stone-900/10'
                        : 'border-stone-300 hover:scale-105'
                    }`}
                    style={{ backgroundColor: STUDENT_THEMES[id].accent }}
                    data-testid={`poster-theme-${id}`}
                  />
                ))}
              </div>
            </div>
            <button
              onClick={handlePrint}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-stone-900 text-white text-sm font-bold hover:bg-stone-800 transition-colors"
              data-testid="poster-print-btn"
            >
              <Printer size={16} /> Skriv ut / Lagre som PDF
            </button>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-4 pb-3 text-xs text-stone-500">
          Skrives ut i <strong>A2 portrett</strong> (420 × 594 mm). I utskriftsdialogen — velg «Bakgrunnsgrafikk: På» og «Marginer: Ingen».
        </div>
      </div>

      {/* POSTER SCROLL CONTAINER */}
      <div className="poster-stage py-10 px-4 flex justify-center">
        <div
          className="poster"
          data-student-theme={String(localTheme)}
          style={{ backgroundColor: c('bg'), color: c('text') }}
          data-testid="poster"
        >
          {/* Decorative blobs */}
          <div
            aria-hidden
            className="poster-blob poster-blob-a"
            style={{ background: `radial-gradient(circle, ${c('blob-a')} 0%, transparent 70%)` }}
          />
          <div
            aria-hidden
            className="poster-blob poster-blob-b"
            style={{ background: `radial-gradient(circle, ${c('blob-b')} 0%, transparent 70%)` }}
          />

          {/* TOP — Logo */}
          <div className="poster-top">
            <div className="poster-logo">Tannlegene Måreid</div>
            <div className="poster-kicker">Studenttilbud</div>
          </div>

          {/* HEADLINE */}
          <div className="poster-headline">
            <span className="poster-h-line">Tenner.</span>
            <span className="poster-h-line">Studentbudsjett.</span>
            <span className="poster-h-line" style={{ color: c('accent') }}>Done.</span>
          </div>

          {/* PRICE BLOCK */}
          <div
            className="poster-price-block"
            style={{ backgroundColor: c('card-bg'), color: c('card-text') }}
          >
            <div className="poster-price-sub">Sjekk + røntgen + puss</div>
            <div className="poster-price-num" style={{ color: c('card-pop') }}>950,–</div>
            <div className="poster-price-meta">for studenter med gyldig studentbevis</div>
            <div className="poster-bonus">
              <span className="poster-bonus-tag" style={{ backgroundColor: c('deal-tag-bg'), color: c('deal-tag-text') }}>
                +10% BONUS
              </span>
              <span style={{ color: c('card-muted') }}>Ta med en venn → 25% rabatt på øvrig behandling — for dere begge</span>
            </div>
          </div>

          {/* QR + URL */}
          <div className="poster-qr-block">
            <div className="poster-qr-wrap">
              <img src={qrSrc} alt="QR-kode til studenttilbud" className="poster-qr" />
            </div>
            <div className="poster-qr-text">
              <div className="poster-qr-cta">Scan og bestill →</div>
              <div className="poster-url">{POSTER_URL}</div>
            </div>
          </div>

          {/* FOOTER LOCATION */}
          <div className="poster-location" style={{ borderTopColor: c('accent') }}>
            <div className="poster-location-pin" style={{ color: c('accent') }}>↗</div>
            <div className="poster-location-text">
              <div className="poster-loc-title">Du står utenfor klinikken</div>
              <div className="poster-loc-sub">Waldemar Thranes gate 68 · Alexander Kiellands plass</div>
            </div>
          </div>
        </div>
      </div>

      {/* INLINE STYLES for the poster (keeps logic in one file) */}
      <style>{`
        .poster-stage { background: linear-gradient(180deg, #FAFAF7 0%, #F5F5F4 100%); }

        .poster {
          position: relative;
          width: 100%;
          max-width: 600px;
          aspect-ratio: 420 / 594; /* A2 ratio */
          padding: 40px 36px;
          border-radius: 12px;
          box-shadow: 0 20px 60px rgba(0,0,0,0.18);
          overflow: hidden;
          display: flex;
          flex-direction: column;
          gap: 20px;
          font-family: 'Inter', system-ui, sans-serif;
          line-height: 1;
        }

        .poster-blob {
          position: absolute;
          border-radius: 50%;
          filter: blur(60px);
          pointer-events: none;
          z-index: 0;
        }
        .poster-blob-a { width: 360px; height: 360px; top: -100px; right: -100px; }
        .poster-blob-b { width: 280px; height: 280px; bottom: 20%; left: -100px; }

        .poster > *:not(.poster-blob) { position: relative; z-index: 1; }

        .poster-top {
          display: flex;
          align-items: center;
          justify-content: space-between;
        }
        .poster-logo {
          font-size: 16px;
          font-weight: 800;
          letter-spacing: -0.01em;
        }
        .poster-kicker {
          font-size: 10px;
          font-weight: 800;
          letter-spacing: 0.15em;
          text-transform: uppercase;
          padding: 4px 10px;
          border-radius: 999px;
          background: ${`var(--st-badge-bg)`};
          color: ${`var(--st-badge-text)`};
        }

        .poster-headline {
          display: flex;
          flex-direction: column;
        }
        .poster-h-line {
          font-family: 'Archivo Black', sans-serif;
          font-size: 56px;
          line-height: 0.92;
          letter-spacing: -0.03em;
          display: block;
        }

        .poster-price-block {
          border-radius: 22px;
          padding: 22px 24px 20px;
        }
        .poster-price-sub {
          font-size: 12px;
          font-weight: 600;
          opacity: 0.85;
          margin-bottom: 4px;
        }
        .poster-price-num {
          font-family: 'Archivo Black', sans-serif;
          font-size: 96px;
          line-height: 0.95;
          letter-spacing: -0.03em;
          margin-bottom: 6px;
        }
        .poster-price-meta {
          font-size: 11px;
          font-weight: 500;
          opacity: 0.7;
          margin-bottom: 14px;
        }
        .poster-bonus {
          display: flex;
          align-items: center;
          gap: 10px;
          font-size: 12px;
          font-weight: 500;
          line-height: 1.35;
          padding-top: 12px;
          border-top: 1px solid rgba(255,255,255,0.15);
        }
        .poster-bonus-tag {
          flex-shrink: 0;
          padding: 5px 9px;
          border-radius: 999px;
          font-size: 9px;
          font-weight: 800;
          letter-spacing: 0.1em;
          text-transform: uppercase;
        }

        .poster-qr-block {
          display: flex;
          align-items: center;
          gap: 18px;
        }
        .poster-qr-wrap {
          flex-shrink: 0;
          background: white;
          padding: 10px;
          border-radius: 14px;
          box-shadow: 0 4px 18px rgba(0,0,0,0.08);
        }
        .poster-qr {
          display: block;
          width: 130px;
          height: 130px;
        }
        .poster-qr-text { flex: 1; }
        .poster-qr-cta {
          font-family: 'Archivo Black', sans-serif;
          font-size: 26px;
          line-height: 1;
          letter-spacing: -0.02em;
        }
        .poster-url {
          margin-top: 6px;
          font-size: 11px;
          font-weight: 700;
          font-family: 'SF Mono', Menlo, monospace;
          opacity: 0.65;
        }

        .poster-location {
          display: flex;
          align-items: flex-start;
          gap: 12px;
          padding-top: 16px;
          border-top: 2px dashed;
          margin-top: auto;
        }
        .poster-location-pin {
          font-size: 22px;
          font-weight: 900;
          flex-shrink: 0;
        }
        .poster-loc-title {
          font-size: 14px;
          font-weight: 800;
          letter-spacing: -0.01em;
        }
        .poster-loc-sub {
          margin-top: 3px;
          font-size: 11px;
          font-weight: 500;
          opacity: 0.7;
        }

        /* PRINT — A2 portrait, ingen marg */
        @page {
          size: A2 portrait;
          margin: 0;
        }
        @media print {
          body { background: white !important; }
          .poster-toolbar { display: none !important; }
          .poster-stage { padding: 0 !important; background: white !important; }
          .poster {
            width: 420mm !important;
            height: 594mm !important;
            max-width: none !important;
            aspect-ratio: auto !important;
            border-radius: 0 !important;
            box-shadow: none !important;
            padding: 28mm 24mm !important;
            gap: 14mm !important;
          }
          .poster-h-line { font-size: 140px !important; }
          .poster-price-num { font-size: 240px !important; }
          .poster-qr { width: 280px !important; height: 280px !important; }
          .poster-qr-cta { font-size: 54px !important; }
          .poster-logo { font-size: 28px !important; }
          .poster-kicker { font-size: 16px !important; }
          .poster-price-sub { font-size: 20px !important; }
          .poster-price-meta { font-size: 18px !important; }
          .poster-bonus { font-size: 18px !important; }
          .poster-bonus-tag { font-size: 14px !important; }
          .poster-url { font-size: 16px !important; }
          .poster-loc-title { font-size: 22px !important; }
          .poster-loc-sub { font-size: 16px !important; }
        }
      `}</style>
    </div>
  );
};
