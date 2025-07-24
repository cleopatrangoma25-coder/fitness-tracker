import React, { useState, useEffect } from 'react';
import { themeManager, type Theme } from '../../lib/theme';

export const ThemeToggle: React.FC = () => {
  const [theme, setTheme] = useState<Theme>('light');
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    setTheme(themeManager.getTheme());
  }, []);

  const handleToggle = () => {
    setIsAnimating(true);
    themeManager.toggleTheme();
    setTheme(themeManager.getTheme());
    
    // Reset animation state after animation completes
    setTimeout(() => setIsAnimating(false), 300);
  };

  return (
    <button
      onClick={handleToggle}
      className={`
        relative w-14 h-8 rounded-full p-1 transition-all duration-300 ease-in-out
        ${theme === 'dark' 
          ? 'bg-gradient-to-r from-blue-600 to-purple-600' 
          : 'bg-gradient-to-r from-yellow-400 to-orange-500'
        }
        ${isAnimating ? 'scale-105' : 'scale-100'}
        hover:scale-110 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500
        dark:focus:ring-offset-gray-900
      `}
      aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
    >
      {/* Toggle Handle */}
      <div
        className={`
          w-6 h-6 bg-white rounded-full shadow-lg transition-all duration-300 ease-in-out
          ${theme === 'dark' ? 'translate-x-6' : 'translate-x-0'}
          ${isAnimating ? 'rotate-12' : 'rotate-0'}
        `}
      >
        {/* Sun Icon for Light Mode */}
        {theme === 'light' && (
          <div className="w-full h-full flex items-center justify-center">
            <div className="w-3 h-3 bg-yellow-500 rounded-full relative">
              <div className="absolute -top-1 -left-1 w-1 h-1 bg-yellow-500 rounded-full"></div>
              <div className="absolute -top-1 -right-1 w-1 h-1 bg-yellow-500 rounded-full"></div>
              <div className="absolute -bottom-1 -left-1 w-1 h-1 bg-yellow-500 rounded-full"></div>
              <div className="absolute -bottom-1 -right-1 w-1 h-1 bg-yellow-500 rounded-full"></div>
            </div>
          </div>
        )}
        
        {/* Moon Icon for Dark Mode */}
        {theme === 'dark' && (
          <div className="w-full h-full flex items-center justify-center">
            <div className="w-3 h-3 bg-gray-700 rounded-full relative">
              <div className="absolute top-0.5 right-0.5 w-1.5 h-1.5 bg-gray-700 rounded-full"></div>
            </div>
          </div>
        )}
      </div>
      
      {/* Background Pattern */}
      <div className="absolute inset-0 rounded-full opacity-20">
        {theme === 'light' ? (
          <div className="w-full h-full bg-gradient-to-br from-yellow-200 to-orange-200 rounded-full"></div>
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-blue-900 to-purple-900 rounded-full"></div>
        )}
      </div>
    </button>
  );
}; 