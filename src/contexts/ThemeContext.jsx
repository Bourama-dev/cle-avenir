import React, { createContext, useContext, useEffect, useState, useCallback, useMemo } from 'react';

const ThemeContext = createContext(undefined);

export const ThemeProvider = ({ children }) => {
  const [theme, setThemeState] = useState(() => {
    // Try to get from localStorage first
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('theme-preference');
      if (stored) return stored;

      // Fall back to system preference
      return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }
    return 'light';
  });

  const [isInitialized, setIsInitialized] = useState(false);

  // Apply theme to DOM
  useEffect(() => {
    const html = document.documentElement;

    // Add transition class to prevent flashing on mount
    if (isInitialized) {
      html.classList.add('theme-transitioning');
    }

    // Update DOM
    html.setAttribute('data-theme', theme);
    html.style.colorScheme = theme;

    if (theme === 'dark') {
      html.classList.add('dark');
    } else {
      html.classList.remove('dark');
    }

    // Persist preference
    localStorage.setItem('theme-preference', theme);

    // Remove transition class after theme change
    if (isInitialized) {
      requestAnimationFrame(() => {
        html.classList.remove('theme-transitioning');
      });
    }

    // Mark as initialized after first render
    if (!isInitialized) {
      setIsInitialized(true);
    }
  }, [theme, isInitialized]);

  // Listen for system theme changes
  useEffect(() => {
    if (!localStorage.getItem('theme-preference')) {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      const handleChange = (e) => {
        setThemeState(e.matches ? 'dark' : 'light');
      };

      mediaQuery.addEventListener('change', handleChange);
      return () => mediaQuery.removeEventListener('change', handleChange);
    }
  }, []);

  const toggleTheme = useCallback(() => {
    setThemeState((prevTheme) => (prevTheme === 'light' ? 'dark' : 'light'));
  }, []);

  const setTheme = useCallback((newTheme) => {
    if (newTheme === 'light' || newTheme === 'dark' || newTheme === 'auto') {
      setThemeState(newTheme);
    }
  }, []);

  const isDark = theme === 'dark';

  const value = useMemo(() => ({
    theme,
    isDark,
    setTheme,
    toggleTheme,
    isInitialized
  }), [theme, isDark, setTheme, toggleTheme, isInitialized]);

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useThemeContext = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useThemeContext must be used within a ThemeProvider');
  }
  return context;
};
