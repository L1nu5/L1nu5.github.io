import React, { useState } from 'react';
import './ModeSelector.css';
import dataService from '../services/dataService';

const GREEN  = '#00ff41';
const DGREEN = '#008f11';
const BLUE   = '#4dabf7';
const WHITE  = '#c9d1d9';

function TerminalPreview() {
  return (
    <div style={{ fontFamily: 'monospace', fontSize: '11px', color: GREEN, lineHeight: 1.7, padding: '4px' }}>
      <div><span style={{ color: '#444' }}>$ </span>whoami</div>
      <div style={{ color: '#777' }}>Abhishek Deore · MathWorks</div>
      <div><span style={{ color: '#444' }}>$ </span>help</div>
      <div style={{ color: '#666' }}>resume    projects  music</div>
      <div style={{ color: '#666' }}>education architecture</div>
      <div>
        <span style={{ color: '#444' }}>$ </span>
        <span className="cursor-blink" style={{ color: GREEN }}>█</span>
      </div>
    </div>
  );
}

function ClassicPreview() {
  return (
    <div style={{ padding: '4px' }}>
      <div style={{ display: 'flex', gap: '4px', marginBottom: '8px' }}>
        {['Home', 'Resume', 'Music', 'More'].map((t, i) => (
          <div key={t} style={{
            background: i === 0 ? `${BLUE}22` : '#1a1a1a',
            color: i === 0 ? BLUE : '#444',
            padding: '2px 7px',
            borderRadius: '4px',
            fontSize: '9px',
            border: `1px solid ${i === 0 ? BLUE + '55' : '#2a2a2a'}`
          }}>{t}</div>
        ))}
      </div>
      {[75, 55, 65].map((w, i) => (
        <div key={i} style={{
          background: '#151515',
          borderRadius: '6px',
          padding: '8px',
          marginBottom: '5px',
          borderLeft: `3px solid ${BLUE}44`
        }}>
          <div style={{ width: `${w}%`, height: '6px', background: `${BLUE}55`, borderRadius: '2px', marginBottom: '4px' }} />
          <div style={{ width: '90%', height: '4px', background: '#252525', borderRadius: '2px', marginBottom: '3px' }} />
          <div style={{ width: '60%', height: '4px', background: '#252525', borderRadius: '2px' }} />
        </div>
      ))}
    </div>
  );
}

function MinimalPreview() {
  return (
    <div style={{ padding: '4px', fontFamily: 'Georgia, serif' }}>
      <div style={{ color: '#fff', fontSize: '15px', fontWeight: 700, marginBottom: '6px', letterSpacing: '0.02em' }}>
        Abhishek Deore
      </div>
      <div style={{ width: '32px', height: '1px', background: WHITE, marginBottom: '12px', opacity: 0.3 }} />
      <div style={{ color: '#666', fontSize: '9px', marginBottom: '10px', letterSpacing: '0.15em' }}>
        SOFTWARE ENGINEER
      </div>
      {['Work Experience', 'Projects', 'Music', 'Contact'].map((s, i) => (
        <div key={i} style={{
          color: '#444',
          fontSize: '10px',
          padding: '4px 0',
          borderBottom: '1px solid #1c1c1c',
          letterSpacing: '0.05em'
        }}>{s}</div>
      ))}
    </div>
  );
}

function ModeSelector({ onSelect }) {
  const [hovered, setHovered] = useState(null);
  const personalInfo = dataService.getPersonalInfo();

  const modes = [
    {
      id: 'terminal',
      icon: '>_',
      label: 'TERMINAL',
      description: 'Navigate with keyboard commands. Strictly CLI — no GUI at any point. Type exit anytime to return.',
      accent: GREEN,
      preview: <TerminalPreview />
    },
    {
      id: 'classic',
      icon: '⊡',
      label: 'CLASSIC',
      description: 'Full-featured GUI with tabs, cards, and all portfolio sections.',
      accent: BLUE,
      preview: <ClassicPreview />
    },
    {
      id: 'minimal',
      icon: '—',
      label: 'MINIMAL',
      description: 'Clean typographic layout. Content first, no distractions.',
      accent: WHITE,
      preview: <MinimalPreview />
    }
  ];

  return (
    <div style={{
      background: '#0c0c0c',
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '2rem',
      fontFamily: '"Courier New", Courier, monospace'
    }}>
      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
        <div style={{ color: '#2e2e2e', fontSize: '0.68rem', letterSpacing: '0.4em', marginBottom: '1rem', textTransform: 'uppercase' }}>
          Choose your experience
        </div>
        <h1 style={{
          color: '#ffffff',
          fontSize: 'clamp(1.6rem, 4vw, 2.8rem)',
          fontWeight: 700,
          letterSpacing: '0.1em',
          margin: '0 0 0.6rem 0',
          textTransform: 'uppercase'
        }}>
          {personalInfo.name}
        </h1>
        <div style={{ color: '#383838', fontSize: '0.82rem', letterSpacing: '0.18em' }}>
          {personalInfo.tagline}
        </div>
      </div>

      {/* Mode cards */}
      <div style={{
        display: 'flex',
        gap: '1.25rem',
        flexWrap: 'wrap',
        justifyContent: 'center',
        maxWidth: '980px',
        width: '100%'
      }}>
        {modes.map(mode => {
          const active = hovered === mode.id;
          return (
            <div
              key={mode.id}
              onMouseEnter={() => setHovered(mode.id)}
              onMouseLeave={() => setHovered(null)}
              onClick={() => onSelect(mode.id)}
              style={{
                flex: '1',
                minWidth: '260px',
                maxWidth: '300px',
                background: '#0f0f0f',
                border: `1.5px solid ${active ? mode.accent : '#1e1e1e'}`,
                borderRadius: '10px',
                overflow: 'hidden',
                cursor: 'pointer',
                transform: active ? 'translateY(-6px) scale(1.02)' : 'translateY(0) scale(1)',
                transition: 'transform 0.2s ease, border-color 0.2s ease, box-shadow 0.2s ease',
                boxShadow: active ? `0 10px 36px ${mode.accent}18` : '0 2px 10px rgba(0,0,0,0.5)'
              }}
            >
              {/* Preview */}
              <div style={{
                height: '170px',
                background: '#080808',
                borderBottom: `1px solid ${active ? mode.accent + '28' : '#181818'}`,
                padding: '16px',
                overflow: 'hidden',
                transition: 'border-color 0.2s ease'
              }}>
                {mode.preview}
              </div>

              {/* Info */}
              <div style={{ padding: '16px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                  <span style={{ color: mode.accent, fontSize: '1rem', fontWeight: 700 }}>{mode.icon}</span>
                  <span style={{ color: mode.accent, fontSize: '0.78rem', fontWeight: 700, letterSpacing: '0.22em' }}>
                    {mode.label}
                  </span>
                </div>
                <p style={{ color: '#484848', fontSize: '0.76rem', margin: '0 0 16px 0', lineHeight: 1.55 }}>
                  {mode.description}
                </p>
                <div style={{
                  border: `1px solid ${active ? mode.accent : mode.accent + '55'}`,
                  color: mode.accent,
                  background: active ? `${mode.accent}12` : 'transparent',
                  padding: '6px 0',
                  borderRadius: '4px',
                  fontSize: '0.72rem',
                  fontWeight: 700,
                  letterSpacing: '0.25em',
                  textAlign: 'center',
                  transition: 'background 0.15s ease, border-color 0.2s ease'
                }}>
                  ENTER
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Footer hint */}
      <div style={{ marginTop: '3rem', color: '#1e1e1e', fontSize: '0.65rem', letterSpacing: '0.18em' }}>
        YOUR CHOICE IS REMEMBERED — TYPE exit ANYTIME TO RETURN
      </div>
    </div>
  );
}

export default ModeSelector;
