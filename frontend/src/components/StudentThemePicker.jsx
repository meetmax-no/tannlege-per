import React from 'react';
import { useTheme, THEME_COLORS, SCHEME_NAMES } from '../context/ThemeContext';

/**
 * Minimal 3-farger-velger for student-siden.
 * Vises kun når studentColorScheme = 0 (preview-modus).
 * Bare 3 sirkler. Ingenting mer.
 */
export const StudentThemePicker = () => {
  const { studentScheme, setStudentScheme, isStudentPreviewMode } = useTheme();

  if (!isStudentPreviewMode) return null;

  return (
    <div className="flex items-center gap-2" data-testid="student-theme-picker">
      {[1, 2, 3].map((id) => {
        const active = studentScheme === id;
        return (
          <button
            key={id}
            type="button"
            onClick={() => setStudentScheme(id)}
            aria-label={SCHEME_NAMES[id]}
            title={SCHEME_NAMES[id]}
            className={`w-7 h-7 rounded-full transition-transform border ${
              active
                ? 'border-stone-900 scale-110 shadow-md ring-2 ring-stone-900/10'
                : 'border-stone-300 hover:scale-105'
            }`}
            style={{ backgroundColor: THEME_COLORS[id] }}
            data-testid={`student-theme-option-${id}`}
          />
        );
      })}
    </div>
  );
};
