import React, { createContext, useContext, useEffect, useState } from 'react';
import { themeManager, type Theme } from '../lib/theme';

interface ThemeContextType {
  theme: Theme;
  isDark: boolean;
  toggleTheme: () => void;
  setTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

interface ThemeProviderProps {
  children: React.ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const [theme, setThemeState] = useState<Theme>('light');
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    // Initialize theme from theme manager
    const currentTheme = themeManager.getTheme();
    setThemeState(currentTheme);
    setIsDark(currentTheme === 'dark');

    // Listen for theme changes
    const handleThemeChange = () => {
      const newTheme = themeManager.getTheme();
      setThemeState(newTheme);
      setIsDark(newTheme === 'dark');
    };

    // Add event listener for theme changes
    window.addEventListener('theme-changed', handleThemeChange);

    return () => {
      window.removeEventListener('theme-changed', handleThemeChange);
    };
  }, []);

  const toggleTheme = () => {
    themeManager.toggleTheme();
    const newTheme = themeManager.getTheme();
    setThemeState(newTheme);
    setIsDark(newTheme === 'dark');
    
    // Dispatch custom event for other components to listen to
    window.dispatchEvent(new CustomEvent('theme-changed'));
  };

  const setTheme = (newTheme: Theme) => {
    themeManager.setTheme(newTheme);
    setThemeState(newTheme);
    setIsDark(newTheme === 'dark');
    
    // Dispatch custom event for other components to listen to
    window.dispatchEvent(new CustomEvent('theme-changed'));
  };

  return (
    <ThemeContext.Provider value={{ theme, isDark, toggleTheme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}; 