const FAVICONS = {
  // Mode selector — three muted dots
  null: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32">
    <rect width="32" height="32" rx="6" fill="#0c0c0c"/>
    <circle cx="8"  cy="16" r="2.5" fill="#333"/>
    <circle cx="16" cy="16" r="2.5" fill="#333"/>
    <circle cx="24" cy="16" r="2.5" fill="#333"/>
  </svg>`,

  // Terminal — green >_
  terminal: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32">
    <rect width="32" height="32" rx="6" fill="#0c0c0c"/>
    <text x="3" y="22" font-family="monospace" font-size="16" font-weight="bold" fill="#00ff41">&gt;_</text>
  </svg>`,

  // Classic GUI — blue window chrome
  gui: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32">
    <rect width="32" height="32" rx="6" fill="#0c0c0c"/>
    <rect x="4" y="7" width="24" height="18" rx="3" fill="none" stroke="#4dabf7" stroke-width="1.5"/>
    <line x1="4" y1="13" x2="28" y2="13" stroke="#4dabf7" stroke-width="1.5"/>
    <circle cx="8"  cy="10" r="1.5" fill="#4dabf7" opacity="0.6"/>
    <circle cx="13" cy="10" r="1.5" fill="#4dabf7" opacity="0.6"/>
    <circle cx="18" cy="10" r="1.5" fill="#4dabf7" opacity="0.6"/>
  </svg>`,

  // Minimal — single white em-dash
  minimal: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32">
    <rect width="32" height="32" rx="6" fill="#0f0f0f"/>
    <line x1="7" y1="16" x2="25" y2="16" stroke="#ffffff" stroke-width="2" stroke-linecap="round"/>
  </svg>`,
};

export function setFavicon(mode) {
  const svg     = FAVICONS[mode] ?? FAVICONS[null];
  const dataUrl = `data:image/svg+xml,${encodeURIComponent(svg)}`;
  const link    = document.querySelector("link[rel~='icon']");
  if (link) link.href = dataUrl;
}
