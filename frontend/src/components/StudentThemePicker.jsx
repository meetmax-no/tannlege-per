import React from 'react';
import { useTheme, STUDENT_THEMES } from '../context/ThemeContext';

/**
 * Minimal 4-temavelger for student-siden.
 * Vises kun når studentColorScheme = 0 (preview-modus).
 */
export const StudentThemePicker = () => {
  const { studentScheme, setStudentScheme, isStudentPreviewMode } = useTheme();

  if (!isStudentPreviewMode) return null;

  return (
    <div className="flex items-center gap-1.5" data-testid="student-theme-picker">
      {[1, 2, 3, 4].map((id) => {
        const active = studentScheme === id;
        const theme = STUDENT_THEMES[id];
        return (
          <button
            key={id}
            type="button"
            onClick={() => setStudentScheme(id)}
            aria-label={theme.name}
            title={theme.name}
            className={`w-6 h-6 rounded-full transition-transform border ${
              active
                ? 'border-stone-900 scale-110 shadow-md ring-2 ring-stone-900/10'
                : 'border-stone-300 hover:scale-105'
            }`}
            style={{ backgroundColor: theme.accent }}
            data-testid={`student-theme-option-${id}`}
          />
        );
      })}
    </div>
  );
};
