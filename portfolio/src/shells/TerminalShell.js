import React, { useState, useEffect, useRef } from 'react';
import { COMMANDS } from './terminalCommands';

const GREEN  = '#00ff41';
const DGREEN = '#008f11';
const MUTED  = '#3a3a3a';

const BOOT_LINES = [
  { text: 'Initializing portfolio terminal v1.0...', color: MUTED  },
  { text: 'Loading data service..................OK',  color: MUTED  },
  { text: 'Mounting filesystem...................OK',  color: MUTED  },
  { text: 'Ready.',                                   color: DGREEN },
  { text: '' },
];

const WELCOME = [
  { text: "  Type 'help' to list available commands.", color: DGREEN },
  { text: '' },
];

function TerminalShell({ onExit }) {
  const [bootIndex,  setBootIndex]  = useState(0);
  const [bootDone,   setBootDone]   = useState(false);
  const [input,      setInput]      = useState('');
  const [output,     setOutput]     = useState([]);
  const [cmdHistory, setCmdHistory] = useState([]);
  const [historyIdx, setHistoryIdx] = useState(-1);
  const inputRef = useRef(null);
  const bottomRef = useRef(null);

  // Boot sequence — one line every 160 ms, then show welcome
  useEffect(() => {
    if (bootIndex < BOOT_LINES.length) {
      const delay = bootIndex === BOOT_LINES.length - 1 ? 280 : 160;
      const t = setTimeout(() => setBootIndex(i => i + 1), delay);
      return () => clearTimeout(t);
    } else {
      setBootDone(true);
      setOutput(WELCOME);
    }
  }, [bootIndex]);

  useEffect(() => { if (bootDone) inputRef.current?.focus(); }, [bootDone]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [output, bootIndex]);

  const run = (raw) => {
    const cmd = raw.trim().toLowerCase();

    if (raw.trim()) {
      setCmdHistory(h => [raw.trim(), ...h]);
      setHistoryIdx(-1);
    }

    const inputLine = { text: raw, type: 'input' };

    if (!cmd) {
      setOutput(prev => [...prev, inputLine]);
      return;
    }

    if (cmd === 'exit') {
      setOutput(prev => [...prev, inputLine, { text: '  Goodbye.', color: DGREEN }, { text: '' }]);
      setTimeout(onExit, 500);
      return;
    }

    if (cmd === 'clear') {
      setOutput([]);
      return;
    }

    const handler = COMMANDS[cmd];
    if (handler) {
      setOutput(prev => [...prev, inputLine, ...handler()]);
    } else {
      setOutput(prev => [...prev,
        inputLine,
        { text: `  command not found: '${cmd}'`, color: '#ff4444' },
        { text: "  type 'help' for available commands", color: MUTED },
        { text: '' },
      ]);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      run(input);
      setInput('');
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      const next = Math.min(historyIdx + 1, cmdHistory.length - 1);
      setHistoryIdx(next);
      setInput(cmdHistory[next] ?? '');
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      const next = Math.max(historyIdx - 1, -1);
      setHistoryIdx(next);
      setInput(next === -1 ? '' : (cmdHistory[next] ?? ''));
    }
  };

  return (
    <div
      onClick={() => inputRef.current?.focus()}
      style={{
        background: '#0c0c0c',
        minHeight: '100vh',
        padding: '2rem',
        fontFamily: '"Courier New", Courier, monospace',
        fontSize: '14px',
        lineHeight: 1.65,
        color: GREEN,
        cursor: 'text',
        boxSizing: 'border-box'
      }}
    >
      {/* Header bar */}
      <div style={{
        marginBottom: '1.5rem',
        paddingBottom: '0.75rem',
        borderBottom: `1px solid ${DGREEN}33`,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <span style={{ color: DGREEN, fontSize: '11px', letterSpacing: '0.2em' }}>
          PORTFOLIO TERMINAL — ABHISHEK DEORE
        </span>
        <span style={{ color: MUTED, fontSize: '11px', letterSpacing: '0.1em' }}>
          type <span style={{ color: DGREEN }}>exit</span> to switch view
        </span>
      </div>

      {/* Boot sequence */}
      {BOOT_LINES.slice(0, bootIndex).map((line, i) => (
        <div key={`boot-${i}`} style={{ color: line.color || MUTED, marginBottom: '1px' }}>
          {line.text && (
            <span style={{ color: DGREEN, marginRight: '8px', userSelect: 'none' }}>›</span>
          )}
          {line.text}
        </div>
      ))}

      {/* Command output */}
      {bootDone && output.map((line, i) => (
        <div
          key={`out-${i}`}
          style={{ color: line.color || (line.type === 'input' ? GREEN : '#c9d1d9'), marginBottom: '1px' }}
        >
          {line.type === 'input'
            ? <><span style={{ color: DGREEN, marginRight: '8px', userSelect: 'none' }}>$</span>{line.text}</>
            : line.text
          }
        </div>
      ))}

      {/* Input prompt */}
      {bootDone && (
        <div style={{ display: 'flex', alignItems: 'center', marginTop: '2px' }}>
          <span style={{ color: DGREEN, marginRight: '8px', userSelect: 'none' }}>$</span>
          <input
            ref={inputRef}
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            autoComplete="off"
            autoCorrect="off"
            spellCheck="false"
            style={{
              background: 'transparent',
              border: 'none',
              outline: 'none',
              color: GREEN,
              fontFamily: 'inherit',
              fontSize: 'inherit',
              caretColor: GREEN,
              flex: 1,
              width: '100%'
            }}
          />
        </div>
      )}

      <div ref={bottomRef} />
    </div>
  );
}

export default TerminalShell;
