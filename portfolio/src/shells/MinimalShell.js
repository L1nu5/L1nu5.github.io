import React, { useState, useEffect, useRef } from 'react';
import dataService from '../services/dataService';
import ExitButton from '../components/ExitButton';

const C = {
  bg:      '#0f0f0f',
  fg:      '#e8e8e8',
  muted:   '#555',
  dim:     '#333',
  rule:    '#1e1e1e',
  accent:  '#888',
};

const COLS = 90;
const ROWS = 36;
const CELL = 7;

function nextGen(grid) {
  return grid.map((row, r) =>
    row.map((cell, c) => {
      const n = [[-1,-1],[-1,0],[-1,1],[0,-1],[0,1],[1,-1],[1,0],[1,1]]
        .reduce((s, [dr, dc]) => s + (grid[r + dr]?.[c + dc] ?? 0), 0);
      return cell ? (n === 2 || n === 3 ? 1 : 0) : (n === 3 ? 1 : 0);
    })
  );
}

function makeGrid(random = false) {
  return Array.from({ length: ROWS }, () =>
    Array.from({ length: COLS }, () => (random ? (Math.random() > 0.78 ? 1 : 0) : 0))
  );
}

function drawGrid(canvas, grid) {
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  ctx.fillStyle = C.bg;
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  grid.forEach((row, r) =>
    row.forEach((cell, c) => {
      if (cell) {
        ctx.fillStyle = '#ffffff18';
        ctx.fillRect(c * CELL + 1, r * CELL + 1, CELL - 2, CELL - 2);
      }
    })
  );
}

function GameOfLife() {
  const canvasRef = useRef(null);
  const gridRef   = useRef(makeGrid(true));
  const [running, setRunning] = useState(false);
  const [gen,     setGen]     = useState(0);

  useEffect(() => {
    drawGrid(canvasRef.current, gridRef.current);
  }, []);

  useEffect(() => {
    if (!running) return;
    const id = setInterval(() => {
      gridRef.current = nextGen(gridRef.current);
      setGen(g => g + 1);
      drawGrid(canvasRef.current, gridRef.current);
    }, 80);
    return () => clearInterval(id);
  }, [running]);

  function randomize() {
    gridRef.current = makeGrid(true);
    setGen(0);
    drawGrid(canvasRef.current, gridRef.current);
  }

  function clear() {
    setRunning(false);
    gridRef.current = makeGrid(false);
    setGen(0);
    drawGrid(canvasRef.current, gridRef.current);
  }

  function handleCanvasClick(e) {
    const canvas = canvasRef.current;
    const rect   = canvas.getBoundingClientRect();
    const scaleX = (COLS * CELL) / rect.width;
    const scaleY = (ROWS * CELL) / rect.height;
    const c = Math.floor((e.clientX - rect.left) * scaleX / CELL);
    const r = Math.floor((e.clientY - rect.top) * scaleY / CELL);
    if (r >= 0 && r < ROWS && c >= 0 && c < COLS) {
      const g = gridRef.current.map(row => [...row]);
      g[r][c] = g[r][c] ? 0 : 1;
      gridRef.current = g;
      drawGrid(canvas, g);
    }
  }

  const btn = (label, onClick) => (
    <button
      onClick={onClick}
      style={{
        background: 'none', border: `1px solid ${C.dim}`, color: C.muted,
        fontSize: '0.68rem', letterSpacing: '0.1em', padding: '0.25rem 0.8rem',
        cursor: 'pointer', textTransform: 'uppercase',
      }}
      onMouseEnter={e => { e.currentTarget.style.color = C.fg; e.currentTarget.style.borderColor = C.accent; }}
      onMouseLeave={e => { e.currentTarget.style.color = C.muted; e.currentTarget.style.borderColor = C.dim; }}
    >
      {label}
    </button>
  );

  return (
    <div>
      <canvas
        ref={canvasRef}
        width={COLS * CELL}
        height={ROWS * CELL}
        style={{ display: 'block', width: '100%', cursor: 'crosshair', border: `1px solid ${C.rule}` }}
        onClick={handleCanvasClick}
      />
      <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.6rem', alignItems: 'center', flexWrap: 'wrap' }}>
        {btn(running ? 'Pause' : 'Run', () => setRunning(r => !r))}
        {btn('Randomize', randomize)}
        {btn('Clear', clear)}
        <span style={{ fontSize: '0.65rem', color: C.dim, marginLeft: 'auto' }}>
          gen {gen} · click to toggle cells
        </span>
      </div>
    </div>
  );
}

const Rule = () => (
  <div style={{ height: '1px', background: C.rule, margin: '3rem 0' }} />
);

const Section = ({ label, children }) => (
  <section>
    <p style={{ fontSize: '0.7rem', letterSpacing: '0.2em', color: C.muted, textTransform: 'uppercase', margin: '0 0 1.5rem 0' }}>
      {label}
    </p>
    {children}
  </section>
);

function MinimalShell({ onExit }) {
  const [showLife, setShowLife] = useState(false);
  const info       = dataService.getPersonalInfo();
  const resumeInfo = dataService.getResumePersonalInfo();
  const summary    = dataService.getSummary();
  const work       = dataService.getWorkExperience();
  const projects   = dataService.getProjects();
  const education  = dataService.getInstitutions();
  const skills     = dataService.getSkills();
  const links      = dataService.getSocialLinks();
  const contact    = dataService.getContactInfo();
  const past       = dataService.getPastEvents();
  const settings   = dataService.getMusicSettings();

  const avg        = (past.reduce((s, e) => s + e.rating, 0) / past.length).toFixed(1);
  const keyLinks   = links.filter(l => ['LinkedIn', 'GitHub', 'Lichess', 'Instagram'].includes(l.platform));

  const skillGroups = skills.reduce((acc, s) => {
    if (!acc[s.category]) acc[s.category] = [];
    acc[s.category].push(s.name);
    return acc;
  }, {});

  return (
    <>
      <div style={{ background: C.bg, minHeight: '100vh' }}>
      <div style={{
        fontFamily: 'Georgia, "Times New Roman", serif',
        color: C.fg,
        padding: 'clamp(2rem, 8vw, 5rem) clamp(1.5rem, 10vw, 12rem)',
        maxWidth: '860px',
        margin: '0 auto',
        boxSizing: 'border-box',
      }}>

        {/* Header */}
        <header style={{ marginBottom: '4rem' }}>
          <h1 style={{
            fontSize: 'clamp(2rem, 5vw, 3rem)',
            fontWeight: 400,
            letterSpacing: '0.02em',
            margin: '0 0 0.5rem 0',
            color: C.fg,
          }}>
            {info.name}
          </h1>
          <p style={{ fontSize: '0.9rem', color: C.accent, margin: '0 0 0.25rem 0', letterSpacing: '0.05em' }}>
            {resumeInfo.title}
          </p>
          <p style={{ fontSize: '0.8rem', color: C.muted, margin: 0, letterSpacing: '0.08em' }}>
            {resumeInfo.location}
          </p>
        </header>

        {/* Summary */}
        <Section label="About">
          <p style={{ fontSize: '1rem', lineHeight: 1.8, color: C.accent, margin: 0 }}>
            {summary}
          </p>
        </Section>

        <Rule />

        {/* Work */}
        <Section label="Experience">
          {work.map((job, i) => (
            <div key={job.id} style={{ marginBottom: i < work.length - 1 ? '2rem' : 0 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '0.25rem' }}>
                <span style={{ fontSize: '0.95rem', color: C.fg }}>{job.company}</span>
                <span style={{ fontSize: '0.75rem', color: C.muted, letterSpacing: '0.05em' }}>{job.period}</span>
              </div>
              <p style={{ fontSize: '0.8rem', color: C.accent, margin: '0 0 0.75rem 0', letterSpacing: '0.04em' }}>
                {job.position} · {job.location}
              </p>
              <ul style={{ margin: 0, padding: '0 0 0 1.1rem', listStyle: 'none' }}>
                {job.responsibilities.slice(0, 3).map((r, idx) => (
                  <li key={idx} style={{ fontSize: '0.85rem', color: C.muted, lineHeight: 1.7, position: 'relative' }}>
                    <span style={{ position: 'absolute', left: '-1.1rem', color: C.dim }}>—</span>
                    {r}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </Section>

        <Rule />

        {/* Projects */}
        <Section label="Projects">
          {projects.map((p, i) => (
            <div key={p.id} style={{ marginBottom: i < projects.length - 1 ? '1.75rem' : 0 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '0.25rem' }}>
                <span style={{ fontSize: '0.95rem', color: C.fg }}>{p.name}</span>
                <span style={{ fontSize: '0.75rem', color: C.muted }}>{p.period}</span>
              </div>
              <p style={{ fontSize: '0.8rem', color: C.accent, margin: '0 0 0.4rem 0' }}>{p.tagline}</p>
              <p style={{ fontSize: '0.82rem', color: C.muted, margin: '0 0 0.4rem 0', lineHeight: 1.6 }}>
                {p.description.slice(0, 160)}{p.description.length > 160 ? '…' : ''}
              </p>
              <p style={{ fontSize: '0.75rem', color: C.dim, margin: 0, letterSpacing: '0.03em' }}>
                {p.technologies.join(' · ')}
              </p>
            </div>
          ))}
        </Section>

        <Rule />

        {/* Skills */}
        <Section label="Skills">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '1.25rem' }}>
            {Object.entries(skillGroups).map(([cat, items]) => (
              <div key={cat}>
                <p style={{ fontSize: '0.7rem', color: C.muted, letterSpacing: '0.12em', textTransform: 'uppercase', margin: '0 0 0.5rem 0' }}>
                  {cat}
                </p>
                <p style={{ fontSize: '0.82rem', color: C.accent, margin: 0, lineHeight: 1.8 }}>
                  {items.join(', ')}
                </p>
              </div>
            ))}
          </div>
        </Section>

        <Rule />

        {/* Education */}
        <Section label="Education">
          {education.map((inst, i) => (
            <div key={inst.id} style={{ marginBottom: i < education.length - 1 ? '1.5rem' : 0 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '0.2rem' }}>
                <span style={{ fontSize: '0.95rem', color: C.fg }}>{inst.institution}</span>
                <span style={{ fontSize: '0.75rem', color: C.muted }}>{inst.period}</span>
              </div>
              <p style={{ fontSize: '0.82rem', color: C.accent, margin: 0 }}>
                {inst.degree} · GPA {inst.gpa}
              </p>
            </div>
          ))}
        </Section>

        <Rule />

        {/* Music */}
        <Section label="Music">
          <p style={{ fontSize: '0.85rem', color: C.accent, margin: '0 0 0.75rem 0', lineHeight: 1.7 }}>
            {past.length} concerts attended · {avg}★ average rating
          </p>
          <p style={{ fontSize: '0.82rem', color: C.muted, margin: '0 0 0.4rem 0' }}>
            Favorites — {settings.favoriteArtists?.join(', ')}
          </p>
          <p style={{ fontSize: '0.82rem', color: C.muted, margin: 0 }}>
            Genre — {settings.favoriteGenre}
          </p>
        </Section>

        <Rule />

        {/* Contact */}
        <Section label="Contact">
          <p style={{ fontSize: '0.85rem', color: C.accent, margin: '0 0 1rem 0' }}>
            {contact.email}
          </p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1.5rem' }}>
            {keyLinks.map(l => (
              <a key={l.platform} href={l.url} target="_blank" rel="noreferrer" style={{
                fontSize: '0.8rem',
                color: C.muted,
                textDecoration: 'none',
                letterSpacing: '0.05em',
                borderBottom: `1px solid ${C.dim}`,
                paddingBottom: '1px',
                transition: 'color 0.2s, border-color 0.2s',
              }}
                onMouseEnter={e => { e.target.style.color = C.fg; e.target.style.borderColor = C.accent; }}
                onMouseLeave={e => { e.target.style.color = C.muted; e.target.style.borderColor = C.dim; }}
              >
                {l.platform}
              </a>
            ))}
          </div>
        </Section>

        <Rule />

        {/* Game of Life */}
        <Section label="Conway's Game of Life">
          <p style={{ fontSize: '0.82rem', color: C.muted, margin: '0 0 1rem 0', lineHeight: 1.6 }}>
            A cellular automaton running in your browser. Click cells to draw, or randomize and watch it evolve.
          </p>
          {!showLife ? (
            <button
              onClick={() => setShowLife(true)}
              style={{
                background: 'none', border: `1px solid ${C.dim}`, color: C.muted,
                fontSize: '0.72rem', letterSpacing: '0.1em', padding: '0.35rem 1rem',
                cursor: 'pointer', textTransform: 'uppercase',
              }}
              onMouseEnter={e => { e.currentTarget.style.color = C.fg; e.currentTarget.style.borderColor = C.accent; }}
              onMouseLeave={e => { e.currentTarget.style.color = C.muted; e.currentTarget.style.borderColor = C.dim; }}
            >
              Launch
            </button>
          ) : (
            <GameOfLife />
          )}
        </Section>

        {/* Footer */}
        <div style={{ marginTop: '4rem', paddingTop: '2rem', borderTop: `1px solid ${C.rule}` }}>
          <p style={{ fontSize: '0.72rem', color: C.dim, margin: 0, letterSpacing: '0.08em' }}>
            {info.name.toUpperCase()} · {new Date().getFullYear()}
          </p>
        </div>

      </div>
      </div>

      <ExitButton onExit={onExit} />
    </>
  );
}

export default MinimalShell;
