import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Phone, MapPin, ArrowLeft, Sparkles, Check, Clock, Users, Send, AlertCircle
} from 'lucide-react';
import { toast } from 'sonner';
import { useTheme } from '../context/ThemeContext';
import { StudentThemePicker } from '../components/StudentThemePicker';

const fallback = {
  headline: ['Tenner.', 'Studentbudsjett.', 'Done.'],
  tagline: 'Sjekka. Røntga. Pussa.',
  pris: '950,–',
  pakke_inkluderer: ['Undersøkelse hos tannlege', 'Røntgen', 'Profesjonell puss og rens'],
  rabatt_ovrig_kort: '15% rabatt på øvrig behandling',
  venn_deal: {
    tittel: 'Ta med en venn',
    kort: '15% alene. 25% med en venn.',
    forklaring: ''
  },
  slik_gjor_du: [],
  akutt: { tittel: '', tekst: '', telefon: '22 35 57 00' },
  klinikk: { adresse: 'Waldemar Thranes gate 68, 0173 Oslo', geo_tekst: '', bilde: '' }
};

const PHONE = '22 35 57 00';
const PHONE_TEL = PHONE.replace(/\s/g, '');

export const StudentLanding = () => {
  const [data, setData] = useState(fallback);
  const [form, setForm] = useState({
    navn: '',
    telefon: '',
    melding: 'Studenttilbud (950,–) — ønsker å bestille time.'
  });
  const { studentScheme } = useTheme();

  useEffect(() => {
    document.title = 'Studenttilbud 950,– | Tannlegene Måreid';
    fetch('/data/priser-student.json', { cache: 'no-store' })
      .then((r) => r.json())
      .then((d) => { if (d && d.landing) setData({ ...fallback, ...d.landing }); })
      .catch(() => {});
    document.documentElement.style.scrollBehavior = 'smooth';
    return () => { document.documentElement.style.scrollBehavior = ''; };
  }, []);

  const scrollTo = (id) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const onSubmit = (e) => {
    e.preventDefault();
    if (!form.navn || !form.telefon) {
      toast.error('Fyll inn navn og telefon, så ringer vi deg.');
      return;
    }
    toast.success('Takk! Vi tar kontakt så snart vi kan.', {
      description: 'Husk å ha studentbevis klart når du kommer.'
    });
    setForm({ navn: '', telefon: '', melding: 'Studenttilbud (950,–) — ønsker å bestille time.' });
  };

  // Inline-style shorthand
  const c = (varName) => `var(--st-${varName})`;

  return (
    <div
      data-student-theme={String(studentScheme)}
      style={{ backgroundColor: c('bg'), color: c('text') }}
      className="min-h-screen"
    >
      {/* Mini header */}
      <header className="sticky top-0 z-40 backdrop-blur-md bg-white/80 border-b border-stone-200">
        <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between gap-3">
          <Link
            to="/"
            className="flex items-center gap-2 text-sm font-medium text-stone-600 transition-colors hover:opacity-70"
            data-testid="back-home-link"
          >
            <ArrowLeft size={16} /> <span>Hovedsiden</span>
          </Link>
          <div className="flex items-center gap-4">
            <StudentThemePicker />
            <span className="text-sm font-bold text-stone-900 hidden sm:inline">Tannlegene Måreid</span>
          </div>
        </div>
      </header>

      {/* HERO */}
      <section className="relative overflow-hidden">
        {/* Decorative blobs */}
        <div
          aria-hidden
          className="absolute -top-20 -right-32 w-[480px] h-[480px] rounded-full blur-3xl pointer-events-none"
          style={{ background: `radial-gradient(circle, ${c('blob-a')} 0%, transparent 70%)` }}
        />
        <div
          aria-hidden
          className="absolute -bottom-40 -left-40 w-[520px] h-[520px] rounded-full blur-3xl pointer-events-none"
          style={{ background: `radial-gradient(circle, ${c('blob-b')} 0%, transparent 70%)` }}
        />

        <div className="relative max-w-5xl mx-auto px-4 pt-12 pb-16 sm:pt-20 sm:pb-24">
          <div
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold tracking-wider uppercase mb-6 student-fade-in"
            style={{ backgroundColor: c('badge-bg'), color: c('badge-text') }}
            data-testid="student-badge"
          >
            <Sparkles size={12} /> Studenttilbud
          </div>

          <h1 className="text-[10vw] sm:text-7xl md:text-8xl font-black leading-[0.95] tracking-tight">
            {data.headline.map((line, i) => (
              <span
                key={i}
                className="block student-line"
                style={{
                  animationDelay: `${i * 120}ms`,
                  color: i === data.headline.length - 1 ? c('accent') : c('text')
                }}
              >
                {line}
              </span>
            ))}
          </h1>

          <p
            className="mt-6 text-lg sm:text-xl font-medium student-fade-in"
            style={{ animationDelay: '500ms', color: c('text-muted') }}
          >
            {data.tagline}
          </p>

          {/* Price card */}
          <div
            className="mt-8 inline-flex flex-col rounded-3xl px-7 py-6 shadow-xl student-fade-in"
            style={{
              animationDelay: '650ms',
              backgroundColor: c('card-bg'),
              color: c('card-text')
            }}
            data-testid="price-card"
          >
            <div className="flex items-baseline gap-2">
              <span
                className="text-6xl sm:text-7xl font-black tracking-tight"
                style={{ color: c('card-pop') }}
              >
                {data.pris}
              </span>
              <span style={{ color: c('card-muted') }} className="font-medium">for studenter</span>
            </div>
            <ul className="mt-4 space-y-1.5">
              {data.pakke_inkluderer.map((item, i) => (
                <li key={i} className="flex items-center gap-2 text-sm">
                  <Check size={16} style={{ color: c('card-pop') }} className="flex-shrink-0" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
            <p className="mt-3 text-xs" style={{ color: c('card-muted') }}>
              + {data.rabatt_ovrig_kort} (med gyldig studentbevis)
            </p>
          </div>

          {/* CTA row */}
          <div className="mt-8 flex flex-col sm:flex-row gap-3 student-fade-in" style={{ animationDelay: '800ms' }}>
            <button
              onClick={() => scrollTo('bestill')}
              className="inline-flex items-center justify-center gap-2 px-6 py-4 rounded-2xl font-bold text-base transition-all hover:scale-[1.02] shadow-lg"
              style={{ backgroundColor: c('accent'), color: c('accent-text') }}
              data-testid="cta-bestill"
            >
              Bestill din time <span aria-hidden>→</span>
            </button>
            <a
              href={`tel:${PHONE_TEL}`}
              className="inline-flex items-center justify-center gap-2 px-6 py-4 rounded-2xl font-bold text-base transition-all border-2 hover:opacity-80"
              style={{ borderColor: c('text'), color: c('text') }}
              data-testid="cta-ring"
            >
              <Phone size={18} /> Ring oss
            </a>
          </div>
        </div>
      </section>

      {/* SLIK GJØR DU */}
      <section className="bg-white border-y border-stone-200">
        <div className="max-w-5xl mx-auto px-4 py-14 sm:py-20">
          <h2 className="text-3xl sm:text-4xl font-black mb-2 text-stone-900">Slik gjør du</h2>
          <p className="text-stone-500 mb-10">Tre steg. Det er det.</p>
          <div className="grid sm:grid-cols-3 gap-5">
            {data.slik_gjor_du.map((s) => (
              <div
                key={s.steg}
                className="relative bg-stone-50 rounded-2xl p-6 border border-stone-100"
              >
                <div
                  className="absolute -top-4 -left-2 text-8xl font-black opacity-15 leading-none select-none"
                  style={{ color: c('accent') }}
                  aria-hidden
                >
                  {s.steg}
                </div>
                <div className="relative">
                  <div className="font-bold text-lg mb-1 text-stone-900">{s.tittel}</div>
                  <div className="text-sm text-stone-600 leading-relaxed">{s.tekst}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* VENN-DEAL */}
      <section
        className="relative overflow-hidden"
        style={{ backgroundColor: c('deal-bg'), color: c('deal-text') }}
      >
        <div className="max-w-5xl mx-auto px-4 py-16 sm:py-24 relative">
          <div
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold tracking-wider uppercase mb-6"
            style={{ backgroundColor: c('deal-tag-bg'), color: c('deal-tag-text') }}
          >
            <Users size={12} /> +10% bonus
          </div>
          <h2 className="text-4xl sm:text-6xl font-black tracking-tight leading-[0.95] mb-6">
            {data.venn_deal.tittel}.<br />
            <span style={{ color: c('deal-accent') }}>Begge sparer mer.</span>
          </h2>
          <p className="text-xl sm:text-2xl font-semibold mb-4 max-w-2xl">
            {data.venn_deal.kort}
          </p>
          <p className="text-base opacity-90 max-w-2xl leading-relaxed">
            {data.venn_deal.forklaring}
          </p>
        </div>
      </section>

      {/* AKUTT */}
      <section className="bg-amber-50 border-y border-amber-100">
        <div className="max-w-5xl mx-auto px-4 py-10 flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0 w-12 h-12 rounded-full bg-amber-100 flex items-center justify-center text-amber-700">
              <AlertCircle size={24} />
            </div>
            <div>
              <div className="font-bold text-lg text-amber-900">{data.akutt.tittel}</div>
              <div className="text-sm text-amber-800/80 mt-0.5">{data.akutt.tekst}</div>
            </div>
          </div>
          <a
            href={`tel:${PHONE_TEL}`}
            className="flex-shrink-0 inline-flex items-center gap-2 px-5 py-3 rounded-full bg-amber-700 text-white font-bold hover:bg-amber-800 transition-colors mx-auto sm:mx-0"
            data-testid="cta-akutt-ring"
          >
            <Phone size={16} /> Ring {data.akutt.telefon}
          </a>
        </div>
      </section>

      {/* BESTILL FORM */}
      <section id="bestill" className="bg-stone-50">
        <div className="max-w-2xl mx-auto px-4 py-16 sm:py-20">
          <h2 className="text-3xl sm:text-4xl font-black mb-2 text-stone-900">Bestill din studenttime</h2>
          <p className="text-stone-500 mb-8">Fyll inn navn og telefon. Vi ringer deg tilbake.</p>

          <form onSubmit={onSubmit} className="space-y-4" data-testid="student-form">
            <div>
              <label className="block text-sm font-bold mb-1.5 text-stone-900">Navn *</label>
              <input
                type="text"
                required
                value={form.navn}
                onChange={(e) => setForm({ ...form, navn: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border border-stone-300 bg-white focus:outline-none focus:ring-2 transition-all"
                style={{ '--tw-ring-color': c('accent') }}
                placeholder="Hva heter du?"
                data-testid="form-navn"
              />
            </div>
            <div>
              <label className="block text-sm font-bold mb-1.5 text-stone-900">Telefon *</label>
              <input
                type="tel"
                required
                value={form.telefon}
                onChange={(e) => setForm({ ...form, telefon: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border border-stone-300 bg-white focus:outline-none focus:ring-2 transition-all"
                style={{ '--tw-ring-color': c('accent') }}
                placeholder="Telefonnummeret ditt"
                data-testid="form-telefon"
              />
            </div>
            <div>
              <label className="block text-sm font-bold mb-1.5 text-stone-900">Melding (valgfritt)</label>
              <textarea
                rows={3}
                value={form.melding}
                onChange={(e) => setForm({ ...form, melding: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border border-stone-300 bg-white focus:outline-none focus:ring-2 transition-all resize-none"
                data-testid="form-melding"
              />
            </div>
            <button
              type="submit"
              className="w-full inline-flex items-center justify-center gap-2 px-6 py-4 rounded-xl font-bold text-base transition-all hover:scale-[1.01] shadow-lg"
              style={{ backgroundColor: c('accent'), color: c('accent-text') }}
              data-testid="form-submit"
            >
              <Send size={18} /> Send forespørsel
            </button>
            <a
              href={`tel:${PHONE_TEL}`}
              className="flex items-center justify-center gap-3 mt-2 text-stone-900 font-bold text-2xl hover:opacity-70 transition-opacity"
              data-testid="form-call-link"
            >
              <Phone size={22} /> {PHONE}
            </a>
          </form>
        </div>
      </section>

      {/* PRAKTISK */}
      <section className="bg-white border-t border-stone-200">
        <div className="max-w-5xl mx-auto px-4 py-14 sm:py-20 grid md:grid-cols-2 gap-10 items-center">
          <div>
            <h2 className="text-3xl sm:text-4xl font-black mb-3 text-stone-900">Vi ligger her</h2>
            <div className="flex items-start gap-3 text-stone-700 mb-2">
              <MapPin size={20} style={{ color: c('accent') }} className="flex-shrink-0 mt-0.5" />
              <div>
                <div className="font-semibold">{data.klinikk.adresse}</div>
                <div className="text-sm text-stone-500 mt-1">{data.klinikk.geo_tekst}</div>
              </div>
            </div>
            <div className="flex items-center gap-3 text-stone-700 mt-4">
              <Clock size={20} style={{ color: c('accent') }} className="flex-shrink-0" />
              <span className="text-sm">Man–tor 08–16 · Fre 08–15</span>
            </div>
            <div className="flex items-center gap-3 text-stone-700 mt-2">
              <Phone size={20} style={{ color: c('accent') }} className="flex-shrink-0" />
              <a href={`tel:${PHONE_TEL}`} className="text-sm font-semibold underline">{PHONE}</a>
            </div>
          </div>
          {data.klinikk.bilde && (
            <div className="rounded-3xl overflow-hidden shadow-xl">
              <img src={data.klinikk.bilde} alt="Klinikken" className="w-full h-64 object-cover" />
            </div>
          )}
        </div>
      </section>

      {/* FOOTER mini */}
      <footer className="bg-stone-900 text-stone-400 text-sm">
        <div className="max-w-5xl mx-auto px-4 py-8 flex flex-col sm:flex-row gap-3 justify-between items-center">
          <div>© {new Date().getFullYear()} Tannlegene Måreid</div>
          <Link to="/" className="hover:text-white transition-colors underline">
            Tilbake til hovedsiden
          </Link>
        </div>
      </footer>

      {/* STICKY MOBILE CTA */}
      <div className="md:hidden fixed bottom-3 left-3 right-3 z-30">
        <button
          onClick={() => scrollTo('bestill')}
          className="w-full inline-flex items-center justify-center gap-2 px-6 py-4 rounded-2xl font-bold text-base shadow-2xl active:scale-[0.98] transition-all"
          style={{ backgroundColor: c('accent'), color: c('accent-text') }}
          data-testid="sticky-cta"
        >
          Bestill din time <span aria-hidden>→</span>
        </button>
      </div>

      <div className="h-20 md:hidden" aria-hidden />
    </div>
  );
};
