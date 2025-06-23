import React, { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext();

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

export const ThemeProvider = ({ children }) => {
  const [isDarkMode, setIsDarkMode] = useState(() => {
    // Check localStorage for saved theme preference
    const savedTheme = localStorage.getItem('darkMode');
    return savedTheme ? JSON.parse(savedTheme) : false;
  });

  useEffect(() => {
    // Save theme preference to localStorage
    localStorage.setItem('darkMode', JSON.stringify(isDarkMode));
    
    // Apply theme class to body
    if (isDarkMode) {
      document.body.classList.add('dark-theme');
    } else {
      document.body.classList.remove('dark-theme');
    }
  }, [isDarkMode]);

  const toggleTheme = () => {
    setIsDarkMode(prev => !prev);
  };

  const lightTheme = {
    primaryColor: "#007bff",
    secondaryColor: "#28a745",
    lightBlue: "#e3f2fd",
    lightGreen: "#e8f5e8",
    backgroundColor: "#f8f9fa",
    gradientStart: "#007bff",
    gradientEnd: "#28a745",
    textColor: "#333",
    cardBackground: "#ffffff",
    borderColor: "#dee2e6",
    mutedText: "#6c757d"
  };

  const darkTheme = {
    primaryColor: "#4dabf7",
    secondaryColor: "#51cf66",
    lightBlue: "#1a1d29",
    lightGreen: "#1a2e1a",
    backgroundColor: "#121212",
    gradientStart: "#4dabf7",
    gradientEnd: "#51cf66",
    textColor: "#ffffff",
    cardBackground: "#1e1e1e",
    borderColor: "#404040",
    mutedText: "#b0b0b0"
  };

  const theme = isDarkMode ? darkTheme : lightTheme;

  return (
    <ThemeContext.Provider value={{ 
      isDarkMode, 
      toggleTheme, 
      theme,
      lightTheme,
      darkTheme
    }}>
      {children}
    </ThemeContext.Provider>
  );
};
