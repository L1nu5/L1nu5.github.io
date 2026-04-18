import React from 'react';
import dataService from '../services/dataService';

function MinimalShell({ onExit }) {
  const { name, tagline } = dataService.getPersonalInfo();

  return (
    <div style={{
      background: '#0f0f0f',
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: 'Georgia, "Times New Roman", serif',
      padding: '2rem',
      textAlign: 'center'
    }}>
      <div>
        <h1 style={{
          color: '#ffffff',
          fontSize: 'clamp(2rem, 6vw, 3.5rem)',
          fontWeight: 400,
          letterSpacing: '0.04em',
          margin: '0 0 1rem 0'
        }}>
          {name}
        </h1>
        <div style={{ width: '40px', height: '1px', background: '#2a2a2a', margin: '0 auto 1.5rem' }} />
        <p style={{ color: '#3a3a3a', fontSize: '0.85rem', letterSpacing: '0.15em', margin: '0 0 3rem 0' }}>
          {tagline.toUpperCase()}
        </p>
        <p style={{ color: '#252525', fontSize: '0.78rem', letterSpacing: '0.08em', margin: '0 0 2.5rem 0' }}>
          Minimal view — coming soon
        </p>
        <button
          onClick={onExit}
          style={{
            background: 'none',
            border: '1px solid #252525',
            color: '#3a3a3a',
            padding: '8px 28px',
            fontFamily: 'inherit',
            fontSize: '0.72rem',
            letterSpacing: '0.22em',
            cursor: 'pointer',
            textTransform: 'uppercase',
            transition: 'border-color 0.2s, color 0.2s'
          }}
          onMouseEnter={e => { e.target.style.borderColor = '#555'; e.target.style.color = '#888'; }}
          onMouseLeave={e => { e.target.style.borderColor = '#252525'; e.target.style.color = '#3a3a3a'; }}
        >
          Back
        </button>
      </div>
    </div>
  );
}

export default MinimalShell;
