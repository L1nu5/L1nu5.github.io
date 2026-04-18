import React, { useEffect, useRef } from 'react';
import { Terminal } from '@xterm/xterm';
import { FitAddon } from '@xterm/addon-fit';
import { COMMANDS } from './terminalCommands';
import { startSnake } from './terminal/SnakeGame';
import '@xterm/xterm/css/xterm.css';
import './TerminalShell.css';

const BOOT_LINES = [
  'Initializing portfolio terminal v2.0...',
  'Loading data service..................\x1b[32mOK\x1b[0m',
  'Mounting filesystem...................\x1b[32mOK\x1b[0m',
  '\x1b[32mReady.\x1b[0m',
  '',
  "\x1b[2m  Type '\x1b[0m\x1b[32mhelp\x1b[0m\x1b[2m' to list available commands.\x1b[0m",
  '',
];

function TerminalShell({ onExit }) {
  const containerRef    = useRef(null);
  const termRef         = useRef(null);
  const inputRef        = useRef('');
  const historyRef      = useRef([]);
  const histIdxRef      = useRef(-1);
  const promptRef       = useRef(true);
  const gameHandlerRef  = useRef(null);

  useEffect(() => {
    const term = new Terminal({
      cursorBlink:     true,
      cursorStyle:     'block',
      cursorInactiveStyle: 'outline',
      fontFamily:      '"Courier New", Courier, monospace',
      fontSize:        14,
      lineHeight:      1.6,
      theme: {
        background:       '#0c0c0c',
        foreground:       '#c9d1d9',
        cursor:           '#00ff41',
        cursorAccent:     '#0c0c0c',
        selectionBackground: '#00ff4122',
        black:            '#0c0c0c',
        green:            '#00ff41',
        brightGreen:      '#008f11',
      },
      scrollback:      1000,
      convertEol:      true,
    });

    const fitAddon = new FitAddon();
    term.loadAddon(fitAddon);
    term.open(containerRef.current);
    fitAddon.fit();
    termRef.current = term;

    const onResize = () => fitAddon.fit();
    window.addEventListener('resize', onResize);

    // Boot sequence
    let i = 0;
    const bootInterval = setInterval(() => {
      if (i < BOOT_LINES.length) {
        term.writeln(BOOT_LINES[i++]);
      } else {
        clearInterval(bootInterval);
        writePrompt(term);
      }
    }, 120);

    // Input handling
    term.onKey(({ key, domEvent }) => {
      if (gameHandlerRef.current) { gameHandlerRef.current({ key, domEvent }); return; }
      if (!promptRef.current) return;

      const k = domEvent.key;

      if (k === 'Enter') {
        term.writeln('');
        const raw = inputRef.current;
        inputRef.current = '';
        histIdxRef.current = -1;
        processCommand(term, raw, onExit, historyRef, gameHandlerRef, promptRef);

      } else if (k === 'Backspace') {
        if (inputRef.current.length > 0) {
          inputRef.current = inputRef.current.slice(0, -1);
          term.write('\b \b');
        }

      } else if (k === 'ArrowUp') {
        domEvent.preventDefault();
        const h = historyRef.current;
        const next = Math.min(histIdxRef.current + 1, h.length - 1);
        if (h[next] !== undefined) {
          clearInput(term, inputRef.current);
          inputRef.current = h[next];
          histIdxRef.current = next;
          term.write(inputRef.current);
        }

      } else if (k === 'ArrowDown') {
        domEvent.preventDefault();
        const next = Math.max(histIdxRef.current - 1, -1);
        clearInput(term, inputRef.current);
        histIdxRef.current = next;
        inputRef.current = next === -1 ? '' : (historyRef.current[next] ?? '');
        term.write(inputRef.current);

      } else if (key && !domEvent.ctrlKey && !domEvent.altKey) {
        inputRef.current += key;
        term.write(key);
      }
    });

    return () => {
      clearInterval(bootInterval);
      window.removeEventListener('resize', onResize);
      term.dispose();
    };
  }, [onExit]);

  return (
    <div style={{ background: '#0c0c0c', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Header */}
      <div style={{
        padding: '0.6rem 1.2rem',
        borderBottom: '1px solid #008f1133',
        display: 'flex',
        justifyContent: 'space-between',
        fontFamily: '"Courier New", Courier, monospace',
        fontSize: '11px',
        letterSpacing: '0.15em',
      }}>
        <span style={{ color: '#008f11' }}>PORTFOLIO TERMINAL — ABHISHEK DEORE</span>
        <span style={{ color: '#2a2a2a' }}>type <span style={{ color: '#008f11' }}>exit</span> to switch view</span>
      </div>

      {/* xterm container */}
      <div
        ref={containerRef}
        style={{ flex: 1, padding: '1rem' }}
        onClick={() => termRef.current?.focus()}
      />
    </div>
  );
}

function writePrompt(term) {
  term.write('\x1b[32m$ \x1b[0m');
}

function clearInput(term, current) {
  term.write('\b \b'.repeat(current.length));
}

function processCommand(term, raw, onExit, historyRef, gameHandlerRef, promptRef) {
  const trimmed = raw.trim();

  if (trimmed) {
    historyRef.current = [trimmed, ...historyRef.current];
  }

  const [cmdRaw, ...args] = trimmed.split(/\s+/);
  const cmd = cmdRaw?.toLowerCase() ?? '';

  if (!cmd) {
    writePrompt(term);
    return;
  }

  if (cmd === 'exit') {
    term.writeln('\x1b[32m  Goodbye.\x1b[0m');
    setTimeout(onExit, 500);
    return;
  }

  if (cmd === 'clear') {
    term.clear();
    writePrompt(term);
    return;
  }

  if (cmd === 'snake') {
    promptRef.current = false;
    startSnake(
      term,
      (fn) => { gameHandlerRef.current = fn; },
      () => { promptRef.current = true; writePrompt(term); }
    );
    return;
  }

  if (cmd === 'history') {
    const h = historyRef.current;
    if (h.length === 0) {
      term.writeln('\x1b[2m  (no history)\x1b[0m');
    } else {
      [...h].reverse().forEach((c, i) =>
        term.writeln(`\x1b[2m  ${String(i + 1).padStart(3)}  \x1b[0m${c}`)
      );
    }
    term.writeln('');
    writePrompt(term);
    return;
  }

  const handler = COMMANDS[cmd];
  if (handler) {
    const result = handler(args);
    if (result && typeof result.then === 'function') {
      term.writeln('\x1b[2m  Fetching…\x1b[0m');
      result.then(lines => {
        // Move cursor up one line to overwrite "Fetching…"
        term.write('\x1b[1A\x1b[2K');
        lines.forEach(l => term.writeln(l));
        writePrompt(term);
      });
    } else {
      result.forEach(l => term.writeln(l));
      writePrompt(term);
    }
  } else {
    term.writeln(`\x1b[31m  command not found: '${cmd}'\x1b[0m`);
    term.writeln(`\x1b[2m  type 'help' for available commands\x1b[0m`);
    term.writeln('');
    writePrompt(term);
  }
}

export default TerminalShell;
