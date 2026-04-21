import { useState, useEffect } from 'react';

export function useTheme() {
  const [theme, setThemeState] = useState(() => {
    // Try to get from localStorage, otherwise use system preference
    const stored = localStorage.getItem('theme-preference');
    if (stored) return stored;

    if (typeof window !== 'undefined') {
      return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }
    return 'light';
  });

  useEffect(() => {
    const html = document.documentElement;

    // Add transition class to prevent flashing
    html.classList.add('theme-transitioning');

    // Update DOM
    html.setAttribute('data-theme', theme);
    if (theme === 'dark') {
      html.classList.add('dark');
    } else {
      html.classList.remove('dark');
    }

    // Persist preference
    localStorage.setItem('theme-preference', theme);

    // Remove transition class after theme change
    requestAnimationFrame(() => {
      html.classList.remove('theme-transitioning');
    });
  }, [theme]);

  const toggleTheme = () => {
    setThemeState((prevTheme) => (prevTheme === 'light' ? 'dark' : 'light'));
  };

  const setTheme = (newTheme) => {
    if (newTheme === 'light' || newTheme === 'dark') {
      setThemeState(newTheme);
    }
  };

  const getTheme = () => theme;

  return { theme, setTheme, toggleTheme, getTheme };
}