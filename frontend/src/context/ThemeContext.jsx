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

const STUDENT_THEMES = {
  1: { name: 'Bubblegum', accent: '#FF2E93' },
  2: { name: 'Voltage',   accent: '#2563EB' },
  3: { name: 'Honey',     accent: '#EA580C' },
  4: { name: 'Emerald',   accent: '#059669' },
};

const STORAGE_KEY = 'tannlege-color-scheme';
const STUDENT_STORAGE_KEY = 'tannlege-student-color-scheme';

const ThemeContext = createContext({
  scheme: 1,
  setScheme: () => {},
  isPreviewMode: false,
  studentScheme: 1,
  setStudentScheme: () => {},
  isStudentPreviewMode: false,
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
  const [studentScheme, setStudentSchemeState] = useState(1);
  const [isStudentPreviewMode, setIsStudentPreviewMode] = useState(false);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    let mounted = true;

    const init = async () => {
      let configured = 1;
      let configuredStudent = 0;
      try {
        const res = await fetch('/data/default.json', { cache: 'no-store' });
        if (res.ok) {
          const data = await res.json();
          if (typeof data.colorScheme === 'number') configured = data.colorScheme;
          if (typeof data.studentColorScheme === 'number') configuredStudent = data.studentColorScheme;
        }
      } catch (e) {
        // fall back
      }

      if (!mounted) return;

      // --- Main scheme ---
      if (configured === 0) {
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

      // --- Student scheme (4 themes: 1=Bubblegum, 2=Voltage, 3=Honey, 4=Emerald) ---
      if (configuredStudent === 0) {
        const saved = parseInt(localStorage.getItem(STUDENT_STORAGE_KEY) || '1', 10);
        const initial = [1, 2, 3, 4].includes(saved) ? saved : 1;
        setIsStudentPreviewMode(true);
        setStudentSchemeState(initial);
      } else {
        const final = [1, 2, 3, 4].includes(configuredStudent) ? configuredStudent : 1;
        setIsStudentPreviewMode(false);
        setStudentSchemeState(final);
      }

      setLoaded(true);
    };

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
    if (isPreviewMode) localStorage.setItem(STORAGE_KEY, String(next));
  };

  const setStudentScheme = (next) => {
    if (![1, 2, 3, 4].includes(next)) return;
    setStudentSchemeState(next);
    if (isStudentPreviewMode) localStorage.setItem(STUDENT_STORAGE_KEY, String(next));
  };

  return (
    <ThemeContext.Provider
      value={{
        scheme,
        setScheme,
        isPreviewMode,
        studentScheme,
        setStudentScheme,
        isStudentPreviewMode,
        loaded,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);

export { SCHEME_NAMES, THEME_COLORS, STUDENT_THEMES };
