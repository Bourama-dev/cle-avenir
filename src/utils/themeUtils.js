export const applyTheme = (themeMode, customColors = null) => {
  const root = document.documentElement;

  // Handle Theme Mode
  if (themeMode === 'auto') {
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    root.setAttribute('data-theme', systemPrefersDark ? 'dark' : 'light');
    root.classList.toggle('dark', systemPrefersDark);
  } else {
    root.setAttribute('data-theme', themeMode);
    root.classList.toggle('dark', themeMode === 'dark');
  }

  // Handle Custom Colors
  if (customColors) {
    if (customColors.primary) root.style.setProperty('--color-primary', customColors.primary);
    if (customColors.secondary) root.style.setProperty('--color-secondary', customColors.secondary);
    if (customColors.accent) root.style.setProperty('--color-accent', customColors.accent);
  }

  // Optional: localStorage persistence if needed outside of context
  localStorage.setItem('theme-preference', themeMode);
};