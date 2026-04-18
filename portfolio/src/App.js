import React, { useState } from 'react';
import { ThemeProvider } from './contexts/ThemeContext';
import ModeSelector from './components/ModeSelector';
import GUIShell from './shells/GUIShell';
import TerminalShell from './shells/TerminalShell';
import MinimalShell from './shells/MinimalShell';

const STORAGE_KEY = 'portfolio-mode';

function App() {
  const [mode, setMode] = useState(() => localStorage.getItem(STORAGE_KEY));

  const handleSelect = (selected) => {
    localStorage.setItem(STORAGE_KEY, selected);
    setMode(selected);
  };

  const handleExit = () => {
    localStorage.removeItem(STORAGE_KEY);
    setMode(null);
  };

  if (!mode)               return <ModeSelector   onSelect={handleSelect} />;
  if (mode === 'terminal') return <TerminalShell  onExit={handleExit} />;
  if (mode === 'minimal')  return <MinimalShell   onExit={handleExit} />;

  return (
    <ThemeProvider>
      <GUIShell onExit={handleExit} />
    </ThemeProvider>
  );
}

export default App;
