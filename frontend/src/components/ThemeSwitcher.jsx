import React, { useState, useRef, useEffect } from 'react';
import { Palette, Check, SlidersHorizontal } from 'lucide-react';
import { useTheme, SCHEME_NAMES, THEME_COLORS } from '../context/ThemeContext';

/**
 * ThemeSwitcher
 * Vises kun når default.json har colorScheme = 0 (preview-modus).
 * Tekst + ikon-knapp som åpner en liten meny med 3 fargevalg.
 */
export const ThemeSwitcher = ({ variant = 'header' }) => {
  const { scheme, setScheme, isPreviewMode } = useTheme();
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const onClickOutside = (e) => {
      if (ref.current && !ref.current.contains(e.target)) {
        setOpen(false);
      }
    };
    if (open) document.addEventListener('mousedown', onClickOutside);
    return () => document.removeEventListener('mousedown', onClickOutside);
  }, [open]);

  if (!isPreviewMode) return null;

  const isMobile = variant === 'mobile';

  const buttonBase = isMobile
    ? 'flex items-center gap-2 w-full text-left px-4 py-2 text-gray-700 hover:bg-amber-50 rounded-lg transition-colors'
    : 'flex items-center gap-1.5 px-3 py-2.5 rounded-full font-medium border border-amber-600 text-amber-700 hover:bg-amber-50 transition-all hover:scale-105 text-sm whitespace-nowrap';

  return (
    <div className={isMobile ? '' : 'relative'} ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className={buttonBase}
        aria-haspopup="menu"
        aria-expanded={open}
        data-testid="theme-switcher-button"
      >
        <Palette size={16} />
        <span>Tema</span>
        <span className="hidden lg:inline text-xs opacity-70">({SCHEME_NAMES[scheme]})</span>
      </button>

      {open && (
        <div
          className={
            isMobile
              ? 'mt-2 ml-4 mr-4 bg-white border border-gray-200 rounded-xl shadow-lg overflow-hidden'
              : 'absolute right-0 mt-2 w-56 bg-white border border-gray-200 rounded-xl shadow-xl overflow-hidden z-50'
          }
          role="menu"
          data-testid="theme-switcher-menu"
        >
          <div className="px-4 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wide border-b border-gray-100">
            Velg farge
          </div>
          {[1, 2, 3].map((id) => (
            <button
              key={id}
              type="button"
              onClick={() => {
                setScheme(id);
                setOpen(false);
              }}
              className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors text-left"
              role="menuitem"
              data-testid={`theme-option-${id}`}
            >
              <span
                className="w-6 h-6 rounded-full border border-black/10 shadow-sm flex-shrink-0"
                style={{ backgroundColor: THEME_COLORS[id] }}
              />
              <span className="flex-1 text-gray-800 font-medium">{SCHEME_NAMES[id]}</span>
              {scheme === id && <Check size={16} className="text-gray-600" />}
            </button>
          ))}
          <div className="px-4 py-2 text-[11px] text-gray-400 border-t border-gray-100">
            Valget lagres lokalt
          </div>
          <a
            href="/farger-preview.html"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-4 py-2.5 text-xs font-medium text-gray-600 hover:bg-gray-50 transition-colors border-t border-gray-100"
            data-testid="hero-tuner-link"
          >
            <SlidersHorizontal size={14} />
            <span>Tilpass Hero-overlay</span>
            <span className="ml-auto opacity-50">↗</span>
          </a>
        </div>
      )}
    </div>
  );
};
