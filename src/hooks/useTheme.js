import { useState, useEffect } from 'react';

export function useTheme() {
  const [theme, setThemeState] = useState(() => {
    return localStorage.getItem('theme-preference') || 'light';
  });

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('theme-preference', theme);
  }, [theme]);

  const toggleTheme = () => {
    setThemeState((prevTheme) => (prevTheme === 'light' ? 'dark' : 'light'));
  };

  const setTheme = (newTheme) => {
    setThemeState(newTheme);
  };

  const getTheme = () => theme;

  return { theme, setTheme, toggleTheme, getTheme };
}