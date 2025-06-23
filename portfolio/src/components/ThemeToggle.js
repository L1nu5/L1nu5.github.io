import React from 'react';
import { Button } from 'react-bootstrap';
import { useTheme } from '../contexts/ThemeContext';
import './ThemeToggle.css';

const ThemeToggle = () => {
  const { isDarkMode, toggleTheme } = useTheme();

  return (
    <Button
      variant="outline-secondary"
      size="sm"
      onClick={toggleTheme}
      className="theme-toggle-btn"
      title={isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
    >
      <span className="theme-icon">
        {isDarkMode ? '☀️' : '🌙'}
      </span>
      <span className="theme-text d-none d-sm-inline">
        {isDarkMode ? 'Light' : 'Dark'}
      </span>
    </Button>
  );
};

export default ThemeToggle;
