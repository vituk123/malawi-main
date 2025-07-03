import { useState, useEffect } from 'react';

// This will be used in a Context Provider later
import React from 'react';

type Theme = 'dark' | 'light';

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
}

export const ThemeContext = React.createContext<ThemeContextType | undefined>(undefined);

export const useTheme = () => {
  const [theme, setTheme] = useState<Theme>(() => {
    // Initialize theme from localStorage or default to 'dark'
    const savedTheme = localStorage.getItem('theme');
    return (savedTheme as Theme) || 'dark';
  });

  useEffect(() => {
    const root = window.document.documentElement;
    // Remove existing theme classes
    root.classList.remove('theme-dark', 'theme-light');
    // Add the current theme class
    root.classList.add(`theme-${theme}`);
    // Save theme preference to localStorage
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === 'dark' ? 'light' : 'dark'));
  };

  return { theme, toggleTheme };
};
