import React, { createContext, useContext, useEffect, useState } from 'react';

const THEME_COLORS = {
  1: '#D97706', // Brun / Amber
  2: '#0284C7', // Lysblå / Sky
  3: '#059669', // Lysgrønn / Emerald
};

const SCHEME_NAMES = {
  1: 'Brun',
  2: 'Lysblå',
  3: 'Lysgrønn',
};

const STORAGE_KEY = 'tannlege-color-scheme';

const ThemeContext = createContext({
  scheme: 1,
  setScheme: () => {},
  isPreviewMode: false,
  loaded: false,
});

const applyScheme = (scheme) => {
  const value = String(scheme);
  document.documentElement.setAttribute('data-color-scheme', value);
  const meta = document.querySelector('meta[name="theme-color"]');
  if (meta) {
    meta.setAttribute('content', THEME_COLORS[scheme] || THEME_COLORS[1]);
  }
};

export const ThemeProvider = ({ children }) => {
  const [scheme, setSchemeState] = useState(1);
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    let mounted = true;

    const init = async () => {
      let configured = 1;
      try {
        const res = await fetch('/data/default.json', { cache: 'no-store' });
        if (res.ok) {
          const data = await res.json();
          if (typeof data.colorScheme === 'number') {
            configured = data.colorScheme;
          }
        }
      } catch (e) {
        // fall back to default
      }

      if (!mounted) return;

      if (configured === 0) {
        // Preview mode — read localStorage, fallback to 1
        const saved = parseInt(localStorage.getItem(STORAGE_KEY) || '1', 10);
        const initial = [1, 2, 3].includes(saved) ? saved : 1;
        setIsPreviewMode(true);
        setSchemeState(initial);
        applyScheme(initial);
      } else {
        const final = [1, 2, 3].includes(configured) ? configured : 1;
        setIsPreviewMode(false);
        setSchemeState(final);
        applyScheme(final);
      }
      setLoaded(true);
    };

    // Apply default immediately to avoid FOUC
    applyScheme(1);
    init();

    return () => {
      mounted = false;
    };
  }, []);

  const setScheme = (next) => {
    if (![1, 2, 3].includes(next)) return;
    setSchemeState(next);
    applyScheme(next);
    if (isPreviewMode) {
      localStorage.setItem(STORAGE_KEY, String(next));
    }
  };

  return (
    <ThemeContext.Provider value={{ scheme, setScheme, isPreviewMode, loaded }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);

export { SCHEME_NAMES, THEME_COLORS };
