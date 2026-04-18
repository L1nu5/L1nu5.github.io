import dataService from '../services/dataService';

// ── palette ──────────────────────────────────────
const G = '#00ff41';   // bright green
const W = '#c9d1d9';   // near-white
const M = '#444444';   // muted
const A = '#777777';   // accent

// ── line primitives ──────────────────────────────
const blank  = ()         => ({ text: '' });
const hdr    = (t)        => ({ text: t, color: G });
const rule   = (n = 44)   => ({ text: '─'.repeat(n), color: '#1a3a1a' });
const ln     = (t, c = W) => ({ text: t, color: c });
const dim    = (t)        => ({ text: t, color: M });
const acc    = (t)        => ({ text: t, color: A });
const pad    = (s, n)     => String(s).padEnd(n);
const trunc  = (s, n)     => s.length > n ? s.slice(0, n - 1) + '…' : s;
const stars  = (r)        => '★'.repeat(r) + '☆'.repeat(5 - r);

function wrapText(text, width, indent = '') {
  const words = text.split(' ');
  const out = [];
  let cur = indent;
  for (const word of words) {
    if (cur.length + word.length + 1 > width && cur.trim()) {
      out.push(ln(cur));
      cur = indent + word;
    } else {
      cur = cur === indent ? indent + word : cur + ' ' + word;
    }
  }
  if (cur.trim()) out.push(ln(cur));
  return out;
}

// ── help ─────────────────────────────────────────
function buildHelp() {
  const cmds = [
    ['whoami',       'About me and my current role'],
    ['resume',       'Full work history and skills'],
    ['projects',     'Engineering projects'],
    ['education',    'Academic background'],
    ['music',        'Concert history and stats'],
    ['contact',      'Social links and contact info'],
    ['architecture', 'How this portfolio is built'],
    ['clear',        'Clear the terminal'],
    ['exit',         'Return to mode selector'],
  ];
  return [
    blank(),
    hdr('AVAILABLE COMMANDS'),
    rule(44),
    ...cmds.map(([cmd, desc]) => ln(`  ${pad(cmd, 16)}${desc}`)),
    blank(),
    dim('  Aliases: about  experience  socials  arch  concerts'),
    dim('  Tip: ↑ / ↓ to navigate command history'),
    blank(),
  ];
}

// ── whoami ───────────────────────────────────────
function buildWhoami() {
  const info    = dataService.getResumePersonalInfo();
  const summary = dataService.getSummary();
  return [
    blank(),
    hdr(info.name),
    rule(info.name.length),
    ln(`  ${info.title}  ·  ${info.location}`),
    acc(`  ${info.website}`),
    blank(),
    ...wrapText(summary, 72, '  '),
    blank(),
    dim("  type 'resume' for full work history"),
    blank(),
  ];
}

// ── resume ───────────────────────────────────────
function buildResume() {
  const work   = dataService.getWorkExperience();
  const skills = dataService.getSkills();

  const lines = [blank(), hdr('WORK EXPERIENCE'), rule(60)];

  for (const job of work) {
    lines.push(blank());
    lines.push(ln(`  ${pad(job.company, 36)}${job.period}`, G));
    lines.push(acc(`  ${job.position}  ·  ${job.type}  ·  ${job.location}`));
    for (const r of job.responsibilities) {
      lines.push(ln(`    · ${trunc(r, 72)}`));
    }
    lines.push(dim(`  Stack: ${job.technologies.join(' · ')}`));
  }

  // Group skills by category
  const grouped = {};
  for (const s of skills) {
    if (!grouped[s.category]) grouped[s.category] = [];
    grouped[s.category].push(s.name);
  }

  lines.push(blank(), hdr('SKILLS'), rule(44));
  for (const [cat, names] of Object.entries(grouped)) {
    lines.push(ln(`  ${pad(cat, 24)}${names.join(' · ')}`));
  }
  lines.push(blank());
  return lines;
}

// ── projects ─────────────────────────────────────
function buildProjects() {
  const projects = dataService.getProjects();
  const lines = [blank(), hdr('PROJECTS'), rule(44)];

  for (const p of projects) {
    lines.push(blank());
    lines.push(ln(`  [${p.id}] ${p.name}`, G));
    lines.push(acc(`      ${p.tagline}`));
    lines.push(dim(`      ${p.context}  ·  ${p.period}  ·  ${p.role}`));
    lines.push(dim(`      Stack: ${p.technologies.join(' · ')}`));

    if (p.architecture?.patterns?.length) {
      lines.push(blank());
      lines.push(acc('      Design patterns:'));
      for (const pattern of p.architecture.patterns) {
        const name = pattern.split(' — ')[0];
        const desc = pattern.split(' — ').slice(1).join(' — ');
        lines.push(dim(`        ${pad(name, 22)}${trunc(desc, 52)}`));
      }
    }

    if (p.keyFeatures?.length) {
      lines.push(blank());
      lines.push(acc('      Key features:'));
      for (const f of p.keyFeatures.slice(0, 4)) {
        lines.push(dim(`        · ${trunc(f, 68)}`));
      }
    }

    if (p.liveUrl) {
      lines.push(blank());
      lines.push(dim(`      Live: ${p.liveUrl}`));
      lines.push(dim(`      Code: ${p.githubUrl}`));
    }
  }

  lines.push(blank());
  return lines;
}

// ── music ────────────────────────────────────────
function buildMusic() {
  const past     = dataService.getPastEvents();
  const settings = dataService.getMusicSettings();
  const sorted   = [...past].sort((a, b) => new Date(a.date) - new Date(b.date));
  const avg      = (past.reduce((s, e) => s + e.rating, 0) / past.length).toFixed(1);

  const lines = [
    blank(),
    hdr(`CONCERTS ATTENDED  (${past.length})`),
    rule(60),
    blank(),
  ];

  for (const ev of sorted) {
    const title = pad(trunc(ev.title, 24), 25);
    const loc   = pad(trunc(ev.location, 18), 19);
    lines.push(ln(`  ${ev.date}  ${title}${loc}${stars(ev.rating)}`));
  }

  lines.push(
    blank(),
    dim(`  ${past.length} concerts  ·  avg rating ${avg}/5  ·  favorite genre: ${settings.favoriteGenre}`),
    blank(),
  );
  return lines;
}

// ── education ────────────────────────────────────
function buildEducation() {
  const institutions = dataService.getInstitutions();
  const philosophy   = dataService.getEducationPhilosophy();
  const lines = [blank(), hdr('EDUCATION'), rule(44)];

  for (const inst of institutions) {
    lines.push(blank());
    lines.push(ln(`  ${inst.institution}`, G));
    lines.push(ln(`  ${inst.degree}`));
    lines.push(dim(`  ${inst.period}  ·  GPA ${inst.gpa}  ·  ${inst.location}`));
    lines.push(blank());
    lines.push(acc('  Achievements:'));
    for (const a of inst.achievements) {
      lines.push(dim(`    · ${a}`));
    }
    lines.push(acc('  Coursework highlights:'));
    lines.push(dim(`    ${inst.highlights.slice(0, 5).join('  ·  ')}`));
  }

  lines.push(blank(), ...wrapText(`"${philosophy}"`, 72, '  '), blank());
  return lines;
}

// ── contact ──────────────────────────────────────
function buildContact() {
  const links = dataService.getSocialLinks();
  const info  = dataService.getContactInfo();
  const lines = [blank(), hdr('CONTACT'), rule(44), blank()];

  for (const l of links) {
    lines.push(ln(`  ${pad(l.platform, 14)}${pad(l.username, 20)}${l.url}`));
  }

  lines.push(
    blank(),
    dim(`  Email       ${info.email}`),
    dim(`  Location    ${info.location}  ·  ${info.timezone}`),
    dim(`  Available   ${info.availability}`),
    dim(`  Response    ${info.responseTime}`),
    blank(),
  );
  return lines;
}

// ── architecture ─────────────────────────────────
function buildArchitecture() {
  const arch = dataService.getArchitecture();
  const lines = [blank(), hdr('PORTFOLIO ARCHITECTURE'), rule(44), blank()];

  lines.push(acc('  CI/CD Pipeline:'));
  lines.push(ln('  Trigger → Stats.fm → Enrich Events → Generate Diagram → Build → Deploy'));
  lines.push(blank());
  lines.push(acc('  Layers:'));

  for (const layer of arch.layers) {
    lines.push(ln(`  ${pad(layer.label, 12)}${layer.sublabel}`));
    for (const node of layer.nodes) {
      const sub   = node.sublabel ? `  —  ${node.sublabel}` : '';
      const secret = node.secret  ? `  [${node.secret}]`   : '';
      lines.push(dim(`    · ${node.label}${sub}${secret}`));
    }
  }

  lines.push(blank(), acc('  External APIs:'));
  const apis = [
    ['Stats.fm',     'Music listening stats · weekly refresh'],
    ['Setlist.fm',   'Concert setlists and venue data'],
    ['Ticketmaster', 'Event images and ticket URLs'],
    ['Deezer',       'Artist photos · no key required'],
    ['Kroki.io',     'Diagram rendering · no key required'],
  ];
  for (const [api, desc] of apis) {
    lines.push(dim(`    ${pad(api, 16)}${desc}`));
  }

  const info = dataService.getResumePersonalInfo();
  lines.push(blank(), dim(`  Source: ${info.github}`), blank());
  return lines;
}

// ── command registry ─────────────────────────────
export const COMMANDS = {
  help:         buildHelp,
  whoami:       buildWhoami,
  about:        buildWhoami,
  resume:       buildResume,
  experience:   buildResume,
  projects:     buildProjects,
  music:        buildMusic,
  concerts:     buildMusic,
  education:    buildEducation,
  contact:      buildContact,
  socials:      buildContact,
  architecture: buildArchitecture,
  arch:         buildArchitecture,
};
