import React, { useState, useEffect } from 'react';
import { ThemeProvider } from './contexts/ThemeContext';
import ModeSelector from './components/ModeSelector';
import GUIShell from './shells/GUIShell';
import TerminalShell from './shells/TerminalShell';
import MinimalShell from './shells/MinimalShell';
import { setFavicon } from './utils/favicon';

function App() {
  const [mode, setMode] = useState(null);

  useEffect(() => { setFavicon(mode); }, [mode]);

  // Back button → return to mode selector
  useEffect(() => {
    const onPop = (e) => setMode(e.state?.mode ?? null);
    window.addEventListener('popstate', onPop);
    return () => window.removeEventListener('popstate', onPop);
  }, []);

  const handleSelect = (selected) => {
    window.history.pushState({ mode: selected }, '');
    setMode(selected);
  };

  // Exit button uses history.back() so the pushed entry is consumed,
  // keeping the history stack clean rather than growing it.
  const handleExit = () => window.history.back();

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
