import dataService from '../../../services/dataService';
import { g, dg, w, d, a, b, blank, rule, cmd, flag } from '../ansi';

export function buildHelp() {
  return [
    blank(),
    d('  ┌─────────────────────────────────────────────────┐'),
    `  │  ${b('PORTFOLIO TERMINAL')}  ·  ${g('ABHISHEK DEORE')}          │`,
    d('  └─────────────────────────────────────────────────┘'),
    blank(),
    g('  NAVIGATION'),
    rule(),
    cmd('whoami',       '',        'About me · current role'),
    flag('-interests',             'Chess · music · gaming details'),
    blank(),
    cmd('resume',       '',        'Work history summary'),
    flag('-timeline',              'Career arc at a glance'),
    flag('-skills',                'Skill proficiency bars'),
    flag('-exp',                   'Work experience only'),
    flag('-full',                  'Full history + skills'),
    blank(),
    cmd('projects',     '',        'Engineering projects'),
    flag('-wizard',                'Wizard framework deep dive'),
    flag('-portfolio',             'This website deep dive'),
    blank(),
    cmd('music',        '',        'Concert history and stats'),
    flag('-concerts',              'Full chronological table'),
    flag('-reviews',               'Personal concert reviews'),
    flag('-best',                  '5-star shows only'),
    flag('-setlist',               'Setlists for any event with data'),
    flag('-stats',                 'Stats.fm lifetime data'),
    flag('-eventid <id>',          'Scope to a specific event'),
    flag('-eventid <id> -setlist', 'Setlist for that event'),
    flag('-eventid <id> -date',    'Date + venue for that event'),
    blank(),
    cmd('education',    '',        'Academic background'),
    flag('-full',                  'Coursework · achievements'),
    blank(),
    cmd('contact',      '',        'Key links and email'),
    flag('-all',                   'All platforms and contact info'),
    blank(),
    cmd('architecture', '',        'How this portfolio is built'),
    blank(),
    g('  TERMINAL'),
    rule(),
    cmd('ls',           '',        'Browse all sections and flags'),
    cmd('neofetch',     '',        'System information'),
    cmd('grep',         '<term>',  'Search across all content'),
    cmd('history',      '',        'Command history'),
    cmd('clear',        '',        'Clear the terminal'),
    cmd('exit',         '',        'Return to mode selector'),
    blank(),
    d('  ─── no flags = summary view · add a flag for detail ───'),
    d('  ─── ↑ / ↓  navigate history                         ───'),
    blank(),
  ];
}

export function buildLs() {
  const past = dataService.getPastEvents();
  const e = (prefix, f, desc) => `  ${d(prefix)}${a(f.padEnd(14))}  ${d(desc)}`;

  return [
    blank(),
    g('  SECTIONS'),
    rule(),
    blank(),
    w('  whoami/'),
    e('  └── ', '-interests',  'Chess · music · gaming details'),
    blank(),
    w('  resume/'),
    e('  ├── ', '-timeline',   'Career arc at a glance'),
    e('  ├── ', '-skills',     'Proficiency bars for every skill'),
    e('  ├── ', '-exp',        'Work experience only'),
    e('  └── ', '-full',       'Complete history and skills'),
    blank(),
    w('  projects/'),
    e('  ├── ', '-wizard',     'Deep dive: wizard framework'),
    e('  └── ', '-portfolio',  'Deep dive: this website'),
    blank(),
    `  ${w('music/')}  ${d(`${past.length} concerts attended`)}`,
    e('  ├── ', '-concerts',   'Full chronological table'),
    e('  ├── ', '-reviews',    'Personal concert reviews'),
    e('  ├── ', '-best',       '5-star shows only'),
    e('  ├── ', '-setlist',    'Artist lineups for events'),
    e('  └── ', '-stats',      'Stats.fm lifetime data'),
    blank(),
    w('  education/'),
    e('  └── ', '-full',       'Degrees · coursework · achievements'),
    blank(),
    w('  contact/'),
    e('  └── ', '-all',        'All platforms and contact info'),
    blank(),
    w('  architecture/'),
    blank(),
    dg("  type 'help' for full command reference"),
    blank(),
  ];
}

export function buildNeofetch() {
  const info    = dataService.getResumePersonalInfo();
  const work    = dataService.getWorkExperience();
  const past    = dataService.getPastEvents();
  const links   = dataService.getSocialLinks();
  const current = work[0];
  const lichess = links.find(l => l.platform === 'Lichess');
  const avg     = (past.reduce((s, e) => s + e.rating, 0) / past.length).toFixed(1);
  const user    = `${info.name.toLowerCase().replace(' ', '')}@portfolio`;

  const logo = [
    g('  ┌─────────┐'),
    g('  │  ██ ██  │'),
    g('  │  █████  │'),
    g('  │  ██ ██  │'),
    g('  └─────────┘'),
    '', '',
  ];

  const infoLines = [
    g(user),
    d('─'.repeat(user.length)),
    `${a('OS')}        ${w('GitHub Pages CDN')}`,
    `${a('Shell')}     ${w('React Terminal v2.0 · xterm.js')}`,
    `${a('Runtime')}   ${w('React 19.1 + Bootstrap 5')}`,
    `${a('Stack')}     ${w('C++ · MATLAB · JS · React')}`,
    `${a('Role')}      ${w(`${current.position} @ ${current.company}`)}`,
    `${a('Location')}  ${w(info.location)}`,
    `${a('Chess')}     ${w(`♟  ${lichess?.username ?? '@Abhish3k'} on Lichess`)}`,
    `${a('Music')}     ${w(`♫  ${past.length} concerts · ${avg}★ avg`)}`,
    `${a('Uptime')}    ${w('Since Sep 2024')}`,
    `${a('Source')}    ${d(info.github)}`,
  ];

  const maxLen = Math.max(logo.length, infoLines.length);
  const lines  = [blank()];
  for (let i = 0; i < maxLen; i++) {
    lines.push(`${logo[i] ?? '             '}   ${infoLines[i] ?? ''}`);
  }
  lines.push(blank());
  return lines;
}

export function buildGrep(args) {
  const term = args[0];
  if (!term) return [blank(), d('  usage: grep <term>'), blank()];

  const q       = term.toLowerCase();
  const results = [];

  const hit = (source, label, text) => {
    if (text.toLowerCase().includes(q)) {
      const idx  = text.toLowerCase().indexOf(q);
      results.push({
        source, label,
        pre:  text.slice(0, idx),
        mid:  text.slice(idx, idx + term.length),
        post: text.slice(idx + term.length),
      });
    }
  };

  for (const job of dataService.getWorkExperience()) {
    hit('resume',    `${job.company} · ${job.position}`, job.company);
    hit('resume',    `${job.company} · ${job.position}`, job.position);
    for (const r of job.responsibilities) hit('resume',    job.company, r);
    for (const t of job.technologies)     hit('resume',    job.company, t);
  }
  for (const p of dataService.getProjects()) {
    hit('projects', p.name, p.description);
    hit('projects', p.name, p.name);
    for (const t of p.technologies) hit('projects', p.name, t);
  }
  for (const ev of dataService.getPastEvents()) {
    hit('music',     ev.date,  ev.title);
    hit('music',     ev.title, ev.location);
    if (ev.review) hit('music', ev.title, ev.review);
  }
  for (const inst of dataService.getInstitutions()) {
    hit('education', inst.institution, inst.degree);
    for (const h of inst.highlights) hit('education', inst.institution, h);
  }
  for (const s of dataService.getSkills()) {
    hit('skills', s.category, s.name);
  }

  if (results.length === 0) return [blank(), d(`  no results for '${term}'`), blank()];

  const lines = [blank(), g(`  GREP: '${term}'  (${results.length} match${results.length === 1 ? '' : 'es'})`), rule(), blank()];
  for (const r of results) {
    lines.push(`  ${a(`[${r.source}]`)}  ${d(r.label)}`);
    lines.push(`    ${d(r.pre)}${g(r.mid)}${d(r.post)}`);
  }
  lines.push(blank());
  return lines;
}

export function buildArchitecture() {
  const arch = dataService.getArchitecture();
  const info = dataService.getResumePersonalInfo();
  const lines = [blank(), g('  PORTFOLIO ARCHITECTURE'), rule(), blank()];

  lines.push(a('  CI/CD Pipeline'));
  lines.push(w('  Trigger → Stats.fm → Enrich Events → Generate Diagram → Build → Deploy'));
  lines.push(blank(), a('  Layers'));

  for (const layer of arch.layers) {
    lines.push(`  ${w(layer.label.padEnd(12))}${d(layer.sublabel)}`);
    for (const node of layer.nodes) {
      const sub    = node.sublabel ? `  —  ${node.sublabel}` : '';
      const secret = node.secret   ? `  [${node.secret}]`   : '';
      lines.push(d(`    · ${node.label}${sub}${secret}`));
    }
  }

  lines.push(blank(), a('  External APIs'));
  [
    ['Stats.fm',     'music stats · weekly'],
    ['Setlist.fm',   'concert setlists + venues'],
    ['Ticketmaster', 'event images + ticket URLs'],
    ['Deezer',       'artist photos · no key required'],
    ['Kroki.io',     'diagram rendering · no key required'],
  ].forEach(([api, desc]) => lines.push(`  ${w(api.padEnd(16))}${d(desc)}`));

  lines.push(blank(), d(`  Source: ${info.github}`), blank());
  return lines;
}
