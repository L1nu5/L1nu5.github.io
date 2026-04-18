// ── ANSI color helpers ────────────────────────────
const R  = '\x1b[0m';
export const g  = s => `\x1b[38;2;0;255;65m${s}${R}`;    // green  #00ff41
export const dg = s => `\x1b[38;2;0;143;17m${s}${R}`;    // dark green #008f11
export const w  = s => `\x1b[38;2;201;209;217m${s}${R}`; // white  #c9d1d9
export const d  = s => `\x1b[2m${s}${R}`;                // dim
export const a  = s => `\x1b[38;2;119;119;119m${s}${R}`; // accent #777
export const b  = s => `\x1b[1m${s}${R}`;                // bold
export const rd = s => `\x1b[31m${s}${R}`;               // red

// ── Layout helpers ────────────────────────────────
export const pad   = (s, n)   => String(s).padEnd(n);
export const trunc = (s, n)   => s.length > n ? s.slice(0, n - 1) + '…' : s;
export const stars = r        => '★'.repeat(r) + '☆'.repeat(5 - r);
export const rule  = (n = 58) => d('  ' + '─'.repeat(n));
export const blank = ()       => '';

export const row = (left, leftW, right) =>
  `  ${g(pad(left, leftW))}  ${w(right)}`;

export const cmd = (c, sig, desc, cw = 22) =>
  `  ${g(pad(c + (sig ? ` ${sig}` : ''), cw))}  ${w(desc)}`;

export const flag = (f, desc, cw = 22, fw = 14) =>
  `  ${pad('', cw)}  ${a(pad(f, fw))}  ${d(desc)}`;

export function wrapText(text, width, indent = '  ') {
  const words = text.split(' ');
  const lines = [];
  let cur = indent;
  for (const word of words) {
    if (cur.length + word.length + 1 > width && cur.trim()) {
      lines.push(w(cur));
      cur = indent + word;
    } else {
      cur = cur === indent ? indent + word : cur + ' ' + word;
    }
  }
  if (cur.trim()) lines.push(w(cur));
  return lines;
}

// ── Arg parser: -key value or bare -flag ─────────
export function parseArgs(args) {
  const flags = new Set();
  const opts  = {};
  for (let i = 0; i < args.length; i++) {
    if (args[i].startsWith('-')) {
      const key  = args[i].slice(1).toLowerCase();
      const next = args[i + 1];
      if (next && !next.startsWith('-')) {
        opts[key] = next;
        i++;
      } else {
        flags.add(key);
      }
    }
  }
  return { flags, opts };
}
