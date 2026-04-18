import React, { useState } from 'react';

function ExitButton({ onExit, label = 'switch view' }) {
  const [hovered, setHovered] = useState(false);

  return (
    <button
      onClick={onExit}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      title="Return to mode selector"
      style={{
        position: 'fixed',
        bottom: '1.25rem',
        left: '1.25rem',
        background: hovered ? 'rgba(255,255,255,0.08)' : 'rgba(255,255,255,0.03)',
        border: '1px solid rgba(255,255,255,0.1)',
        color: hovered ? 'rgba(255,255,255,0.55)' : 'rgba(255,255,255,0.2)',
        padding: '5px 12px',
        borderRadius: '20px',
        fontSize: '0.68rem',
        letterSpacing: '0.12em',
        cursor: 'pointer',
        fontFamily: '"Courier New", Courier, monospace',
        transition: 'background 0.2s, color 0.2s, border-color 0.2s',
        zIndex: 1000,
        backdropFilter: 'blur(4px)'
      }}
    >
      ⊞ {label}
    </button>
  );
}

export default ExitButton;
