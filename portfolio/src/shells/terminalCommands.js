import dataService from '../services/dataService';

// ── palette ──────────────────────────────────────
const G  = '#00ff41';
const DG = '#008f11';
const W  = '#c9d1d9';
const M  = '#444444';
const A  = '#777777';

// ── primitives ───────────────────────────────────
const blank  = ()          => ({ text: '' });
const hdr    = (t)         => ({ text: t,              color: G  });
const rule   = (n = 44)    => ({ text: '─'.repeat(n),  color: '#1a3a1a' });
const ln     = (t, c = W)  => ({ text: t,              color: c  });
const dim    = (t)         => ({ text: t,              color: M  });
const acc    = (t)         => ({ text: t,              color: A  });
const tip    = (t)         => ({ text: `  ${t}`,       color: DG });
const pad    = (s, n)      => String(s).padEnd(n);
const trunc  = (s, n)      => s.length > n ? s.slice(0, n - 1) + '…' : s;
const stars  = (r)         => '★'.repeat(r) + '☆'.repeat(5 - r);
const bar    = (lvl, w=20) => '█'.repeat(Math.round(lvl/100*w)) + '░'.repeat(w - Math.round(lvl/100*w));

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

// ─────────────────────────────────────────────────
// help
// ─────────────────────────────────────────────────
function buildHelp() {
  return [
    blank(),
    ln('  ┌─────────────────────────────────────────────┐'),
    ln('  │  PORTFOLIO TERMINAL  ·  ABHISHEK DEORE      │'),
    ln('  └─────────────────────────────────────────────┘'),
    blank(),
    hdr('  NAVIGATION'),
    rule(46),
    ln(`  ${pad('whoami', 16)}About me and current role`),
    ln(`  ${pad('resume', 16)}Work history and skills`),
    ln(`  ${pad('projects', 16)}Engineering projects`),
    ln(`  ${pad('education', 16)}Academic background`),
    ln(`  ${pad('music', 16)}Concert history and stats`),
    ln(`  ${pad('contact', 16)}Social links and contact info`),
    ln(`  ${pad('architecture', 16)}How this portfolio is built`),
    blank(),
    hdr('  TERMINAL'),
    rule(46),
    ln(`  ${pad('ls', 16)}Browse all sections and flags`),
    ln(`  ${pad('neofetch', 16)}System information`),
    ln(`  ${pad('grep [term]', 16)}Search across all content`),
    ln(`  ${pad('history', 16)}Command history`),
    ln(`  ${pad('clear', 16)}Clear the terminal`),
    ln(`  ${pad('exit', 16)}Return to mode selector`),
    blank(),
    hdr('  FLAGS'),
    rule(46),
    dim(`  resume    -timeline  -skills  -exp  -full`),
    dim(`  music     -concerts  -reviews  -best`),
    dim(`  projects  -wizard  -portfolio`),
    dim(`  contact   -all        education  -full`),
    blank(),
    tip('plain command = summary view · add a flag for detail'),
    tip('↑ / ↓ to navigate command history'),
    blank(),
  ];
}

// ─────────────────────────────────────────────────
// ls
// ─────────────────────────────────────────────────
function buildLs() {
  const past = dataService.getPastEvents();
  return [
    blank(),
    hdr('  SECTIONS'),
    rule(54),
    blank(),
    ln('  whoami/           About me · current role'),
    blank(),
    ln('  resume/'),
    acc('  ├── -timeline     Career arc at a glance'),
    acc('  ├── -skills       Proficiency bars for every skill'),
    acc('  ├── -exp          Work experience only'),
    acc('  └── -full         Complete history and skills'),
    blank(),
    ln('  projects/'),
    acc('  ├── -wizard       Deep dive: wizard framework'),
    acc('  └── -portfolio    Deep dive: this website'),
    blank(),
    ln(`  music/            ${past.length} concerts attended`),
    acc('  ├── -concerts     Full chronological table'),
    acc('  ├── -reviews      Personal concert reviews'),
    acc('  └── -best         5-star shows only'),
    blank(),
    ln('  education/'),
    acc('  └── -full         Degrees · coursework · achievements'),
    blank(),
    ln('  contact/'),
    acc('  └── -all          All platforms and contact info'),
    blank(),
    ln('  architecture/'),
    blank(),
    tip("type 'help' for full command reference"),
    blank(),
  ];
}

// ─────────────────────────────────────────────────
// whoami
// ─────────────────────────────────────────────────
function buildWhoami(args) {
  const info    = dataService.getResumePersonalInfo();
  const summary = dataService.getSummary();
  const links   = dataService.getSocialLinks();
  const past    = dataService.getPastEvents();

  if (args.includes('-interests')) {
    const lichess = links.find(l => l.platform === 'Lichess');
    const avg     = (past.reduce((s, e) => s + e.rating, 0) / past.length).toFixed(1);
    const faves   = [...past].sort((a,b) => b.rating - a.rating).slice(0, 3).map(e => e.title);
    return [
      blank(),
      hdr(info.name),
      rule(info.name.length),
      ln(`  ${info.title}  ·  ${info.location}`),
      blank(),
      ...wrapText(summary, 72, '  '),
      blank(),
      hdr('  INTERESTS'),
      rule(44),
      blank(),
      ln('  ♟  Chess', G),
      dim(`     ${lichess ? lichess.url : 'Lichess: @Abhish3k'}`),
      dim('     Active player · enjoy classical and rapid formats'),
      blank(),
      ln('  ♫  Music', G),
      dim(`     ${past.length} concerts · avg rating ${avg}★`),
      dim(`     Favorites: ${faves.join(' · ')}`),
      blank(),
      ln('  🎮  Gaming', G),
      dim('     PC gamer · shipped AAA titles at Ubisoft'),
      dim('     Far Cry 5 · Starlink · Prince of Persia'),
      blank(),
    ];
  }

  return [
    blank(),
    hdr(info.name),
    rule(info.name.length),
    ln(`  ${info.title}  ·  ${info.location}`),
    acc(`  ${info.website}`),
    blank(),
    ...wrapText(summary, 72, '  '),
    blank(),
    tip("type 'whoami -interests' for chess · music · gaming details"),
    blank(),
  ];
}

// ─────────────────────────────────────────────────
// resume
// ─────────────────────────────────────────────────
function buildResume(args) {
  const work = dataService.getWorkExperience();
  const edu  = dataService.getInstitutions();

  if (args.includes('-timeline')) {
    const lines = [blank(), hdr('  CAREER TIMELINE'), rule(64), blank()];
    for (const job of [...work].reverse()) {
      const year    = job.period.slice(0, 4);
      const current = job.period.includes('Present');
      const bullet  = current ? '══' : '──';
      const marker  = current ? ln : dim;
      lines.push(marker(`  ${year}  ${bullet}  ${pad(job.position, 28)}${pad(job.company, 22)}${current ? '← present' : ''}`, current ? G : W));
    }
    lines.push(blank());
    // Show education in timeline
    for (const inst of [...edu].reverse()) {
      const year = inst.period.slice(0, 4);
      lines.push(dim(`  ${year}  ░░  [${inst.degree.split(',')[0]}  ·  GPA ${inst.gpa}]`));
    }
    lines.push(blank(), dim(`  ${work.length} roles · game dev → startup → enterprise`), blank());
    return lines;
  }

  if (args.includes('-skills')) {
    const skills  = dataService.getSkills();
    const grouped = {};
    for (const s of skills) {
      if (!grouped[s.category]) grouped[s.category] = [];
      grouped[s.category].push(s);
    }
    const lines = [blank(), hdr('  SKILLS'), rule(52), blank()];
    for (const [cat, items] of Object.entries(grouped)) {
      lines.push(acc(`  ${cat.toUpperCase()}`));
      for (const s of items) {
        lines.push(ln(`  ${pad(s.name, 20)} ${bar(s.level)}  ${s.level}`));
      }
      lines.push(blank());
    }
    return lines;
  }

  if (args.includes('-exp') || args.includes('-full')) {
    const lines = [blank(), hdr('  WORK EXPERIENCE'), rule(60)];
    for (const job of work) {
      lines.push(blank());
      lines.push(ln(`  ${pad(job.company, 36)}${job.period}`, G));
      lines.push(acc(`  ${job.position}  ·  ${job.type}  ·  ${job.location}`));
      for (const r of job.responsibilities) {
        lines.push(ln(`    · ${trunc(r, 72)}`));
      }
      lines.push(dim(`  Stack: ${job.technologies.join(' · ')}`));
    }
    if (args.includes('-full')) {
      lines.push(...buildResume(['-skills']).slice(1));
    } else {
      lines.push(blank());
    }
    return lines;
  }

  // Default: summary (current role + brief)
  const current = work[0];
  return [
    blank(),
    hdr('  RESUME'),
    rule(44),
    blank(),
    ln(`  ${current.company}`, G),
    ln(`  ${current.position}  ·  ${current.period}`),
    dim(`  ${current.location}`),
    blank(),
    ...wrapText(dataService.getSummary(), 72, '  '),
    blank(),
    tip('resume -timeline  · -skills  · -exp  · -full'),
    blank(),
  ];
}

// ─────────────────────────────────────────────────
// projects
// ─────────────────────────────────────────────────
function buildProjects(args) {
  const projects = dataService.getProjects();
  const wizard   = projects.find(p => p.id === 1);
  const site     = projects.find(p => p.id === 2);

  if (args.includes('-wizard') || args.includes('-1')) {
    const lines = [
      blank(),
      hdr(`  ${wizard.name.toUpperCase()}`),
      rule(60),
      acc(`  ${wizard.tagline}`),
      dim(`  ${wizard.context}  ·  ${wizard.period}  ·  ${wizard.role}`),
      dim(`  Stack: ${wizard.technologies.join(' · ')}`),
      blank(),
      ...wrapText(wizard.description, 72, '  '),
      blank(),
      hdr('  ARCHITECTURE LAYERS'),
      rule(60),
    ];
    for (const layer of wizard.architecture.layers) {
      lines.push(dim(`  ├─ ${layer.split(' — ')[0]}`));
      const desc = layer.split(' — ')[1];
      if (desc) lines.push(dim(`  │  ${trunc(desc, 64)}`));
    }
    lines.push(blank(), hdr('  DESIGN PATTERNS'), rule(60));
    for (const p of wizard.architecture.patterns) {
      const [name, ...rest] = p.split(' — ');
      lines.push(ln(`  ${pad(name, 18)}`, A));
      lines.push(dim(`    ${trunc(rest.join(' — '), 66)}`));
    }
    lines.push(blank(), hdr('  KEY FEATURES'), rule(60));
    for (const f of wizard.keyFeatures) {
      lines.push(dim(`  · ${trunc(f, 70)}`));
    }
    lines.push(blank(), hdr('  ROADMAP'), rule(60));
    for (const i of wizard.improvements) {
      lines.push(dim(`  · ${trunc(i, 70)}`));
    }
    lines.push(
      blank(),
      acc(`  Impact: ${wizard.impact.teams} · ${wizard.impact.products} · ${wizard.impact.note.slice(0,60)}…`),
      blank(),
    );
    return lines;
  }

  if (args.includes('-portfolio') || args.includes('-2')) {
    const lines = [
      blank(),
      hdr(`  ${site.name.toUpperCase()}`),
      rule(60),
      acc(`  ${site.tagline}`),
      dim(`  ${site.context}  ·  ${site.period}  ·  ${site.role}`),
      dim(`  Stack: ${site.technologies.join(' · ')}`),
      blank(),
      ...wrapText(site.description, 72, '  '),
      blank(),
      hdr('  FEATURES'),
      rule(44),
    ];
    for (const f of site.features) {
      lines.push(dim(`  · ${f}`));
    }
    lines.push(
      blank(),
      dim(`  Live:   ${site.liveUrl}`),
      dim(`  Source: ${site.githubUrl}`),
      blank(),
    );
    return lines;
  }

  // Default: brief summary of both
  return [
    blank(),
    hdr('  PROJECTS'),
    rule(44),
    blank(),
    ln(`  [1] ${wizard.name}`, G),
    acc(`      ${wizard.tagline}`),
    dim(`      ${wizard.context}  ·  ${wizard.period}`),
    dim(`      Stack: ${wizard.technologies.join(' · ')}`),
    blank(),
    ln(`  [2] ${site.name}`, G),
    acc(`      ${site.tagline}`),
    dim(`      ${site.context}  ·  ${site.period}`),
    dim(`      ${site.liveUrl}`),
    blank(),
    tip('projects -wizard  · -portfolio'),
    blank(),
  ];
}

// ─────────────────────────────────────────────────
// music
// ─────────────────────────────────────────────────
function buildMusic(args) {
  const past     = dataService.getPastEvents();
  const settings = dataService.getMusicSettings();
  const sorted   = [...past].sort((a, b) => new Date(a.date) - new Date(b.date));
  const avg      = (past.reduce((s, e) => s + e.rating, 0) / past.length).toFixed(1);

  const COL_DATE  = 12;
  const COL_ART   = 26;
  const COL_LOC   = 20;
  const TABLE_W   = COL_DATE + COL_ART + COL_LOC + 5 + 2;

  if (args.includes('-concerts')) {
    return [
      blank(),
      hdr(`  CONCERTS ATTENDED  (${past.length})`),
      rule(TABLE_W),
      acc(`  ${pad('DATE', COL_DATE)}${pad('ARTIST', COL_ART)}${pad('LOCATION', COL_LOC)}RATING`),
      rule(TABLE_W),
      ...sorted.map(ev =>
        ln(`  ${pad(ev.date, COL_DATE)}${pad(trunc(ev.title, COL_ART-1), COL_ART)}${pad(trunc(ev.location, COL_LOC-1), COL_LOC)}${stars(ev.rating)}`)
      ),
      rule(TABLE_W),
      dim(`  ${past.length} concerts  ·  avg ${avg}/5  ·  ${settings.favoriteGenre}`),
      blank(),
    ];
  }

  if (args.includes('-reviews')) {
    const lines = [blank(), hdr('  CONCERT REVIEWS'), rule(64), blank()];
    for (const ev of [...sorted].reverse()) {
      lines.push(ln(`  ${stars(ev.rating)}  ${pad(ev.title, 28)}${ev.date}`, ev.rating === 5 ? G : W));
      lines.push(dim(`  ${ev.location}`));
      lines.push(...wrapText(`"${ev.review}"`, 68, '  '));
      lines.push(blank());
    }
    return lines;
  }

  if (args.includes('-best')) {
    const best = sorted.filter(e => e.rating === 5);
    const lines = [blank(), hdr(`  5-STAR CONCERTS  (${best.length})`), rule(TABLE_W), blank()];
    for (const ev of best) {
      lines.push(ln(`  ${pad(ev.date, COL_DATE)}${pad(trunc(ev.title, COL_ART-1), COL_ART)}${ev.location}`, G));
    }
    lines.push(blank());
    return lines;
  }

  if (args.includes('-stats')) {
    return fetchMusicStats();
  }

  // Default summary
  const recent = [...sorted].reverse().slice(0, 3);
  return [
    blank(),
    hdr('  MUSIC'),
    rule(44),
    blank(),
    ln(`  ${past.length} concerts attended  ·  avg rating ${avg}/5`),
    dim(`  favorite genre: ${settings.favoriteGenre}`),
    blank(),
    acc('  RECENT SHOWS'),
    rule(44),
    acc(`  ${pad('ARTIST', 28)}${pad('LOCATION', 20)}DATE`),
    rule(44),
    ...recent.map(ev =>
      ln(`  ${pad(trunc(ev.title, 27), 28)}${pad(trunc(ev.location, 19), 20)}${ev.date}`)
    ),
    blank(),
    tip('music -concerts  · -reviews  · -best  · -stats'),
    blank(),
  ];
}

async function fetchMusicStats() {
  try {
    const [artistsRes, tracksRes, genresRes] = await Promise.allSettled([
      fetch('/data/music/lifetime/latest/top-artists.json'),
      fetch('/data/music/lifetime/latest/top-tracks.json'),
      fetch('/data/music/lifetime/latest/top-genres.json'),
    ]);

    const artists = artistsRes.status === 'fulfilled' && artistsRes.value.ok ? await artistsRes.value.json() : null;
    const tracks  = tracksRes.status  === 'fulfilled' && tracksRes.value.ok  ? await tracksRes.value.json()  : null;
    const genres  = genresRes.status  === 'fulfilled' && genresRes.value.ok  ? await genresRes.value.json()  : null;

    const lines = [blank(), hdr('  STATS.FM — ALL TIME'), rule(44), blank()];

    if (artists?.items?.length) {
      lines.push(acc('  TOP ARTISTS'));
      artists.items.slice(0, 5).forEach((a, i) =>
        lines.push(ln(`  ${i+1}.  ${a.artist?.name ?? a.name ?? '?'}`))
      );
      lines.push(blank());
    }

    if (tracks?.items?.length) {
      lines.push(acc('  TOP TRACKS'));
      tracks.items.slice(0, 5).forEach((t, i) =>
        lines.push(ln(`  ${i+1}.  ${t.track?.name ?? t.name ?? '?'}`))
      );
      lines.push(blank());
    }

    if (genres?.items?.length) {
      lines.push(acc('  TOP GENRES'));
      genres.items.slice(0, 5).forEach((g, i) =>
        lines.push(ln(`  ${i+1}.  ${g.genre?.tag ?? g.tag ?? g.name ?? '?'}`))
      );
      lines.push(blank());
    }

    if (!artists && !tracks && !genres) {
      lines.push(dim('  Stats not yet generated — push to main to trigger the CI pipeline.'), blank());
    }

    return lines;
  } catch {
    return [blank(), dim('  Could not load stats data.'), blank()];
  }
}

// ─────────────────────────────────────────────────
// education
// ─────────────────────────────────────────────────
function buildEducation(args) {
  const institutions = dataService.getInstitutions();

  if (args.includes('-full')) {
    const lines = [blank(), hdr('  EDUCATION'), rule(44)];
    for (const inst of institutions) {
      lines.push(blank());
      lines.push(ln(`  ${inst.institution}`, G));
      lines.push(ln(`  ${inst.degree}`));
      lines.push(dim(`  ${inst.period}  ·  GPA ${inst.gpa}  ·  ${inst.location}`));
      lines.push(blank(), acc('  Achievements:'));
      for (const a of inst.achievements) lines.push(dim(`    · ${a}`));
      lines.push(acc('  Coursework:'));
      lines.push(dim(`    ${inst.highlights.slice(0,5).join('  ·  ')}`));
    }
    lines.push(blank());
    return lines;
  }

  // Default: degrees only
  return [
    blank(),
    hdr('  EDUCATION'),
    rule(44),
    blank(),
    ...institutions.map(inst => [
      ln(`  ${inst.institution}`, G),
      ln(`  ${inst.degree}`),
      dim(`  ${inst.period}  ·  GPA ${inst.gpa}  ·  ${inst.location}`),
      blank(),
    ]).flat(),
    tip('education -full  for coursework and achievements'),
    blank(),
  ];
}

// ─────────────────────────────────────────────────
// contact
// ─────────────────────────────────────────────────
function buildContact(args) {
  const links = dataService.getSocialLinks();
  const info  = dataService.getContactInfo();

  if (args.includes('-all')) {
    const lines = [blank(), hdr('  CONTACT'), rule(44), blank()];
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

  // Default: key links only
  const key = links.filter(l => ['LinkedIn', 'GitHub', 'Lichess'].includes(l.platform));
  return [
    blank(),
    hdr('  CONTACT'),
    rule(44),
    blank(),
    dim(`  Email       ${info.email}`),
    blank(),
    ...key.map(l => ln(`  ${pad(l.platform, 14)}${l.url}`)),
    blank(),
    tip('contact -all  for all platforms'),
    blank(),
  ];
}

// ─────────────────────────────────────────────────
// architecture
// ─────────────────────────────────────────────────
function buildArchitecture() {
  const arch = dataService.getArchitecture();
  const info = dataService.getResumePersonalInfo();
  const lines = [blank(), hdr('  PORTFOLIO ARCHITECTURE'), rule(54), blank()];

  lines.push(acc('  CI/CD Pipeline'));
  lines.push(ln('  Trigger → Stats.fm → Enrich Events → Generate Diagram → Build → Deploy'));
  lines.push(blank(), acc('  Layers'));

  for (const layer of arch.layers) {
    lines.push(ln(`  ${pad(layer.label, 12)}${layer.sublabel}`));
    for (const node of layer.nodes) {
      const sub    = node.sublabel ? `  —  ${node.sublabel}` : '';
      const secret = node.secret   ? `  [${node.secret}]`   : '';
      lines.push(dim(`    · ${node.label}${sub}${secret}`));
    }
  }

  lines.push(blank(), acc('  External APIs'));
  [
    ['Stats.fm',     'music stats · weekly'],
    ['Setlist.fm',   'concert setlists + venues'],
    ['Ticketmaster', 'event images + ticket URLs'],
    ['Deezer',       'artist photos · no key required'],
    ['Kroki.io',     'diagram rendering · no key required'],
  ].forEach(([api, desc]) => lines.push(dim(`    ${pad(api, 16)}${desc}`)));

  lines.push(blank(), dim(`  Source: ${info.github}`), blank());
  return lines;
}

// ─────────────────────────────────────────────────
// neofetch
// ─────────────────────────────────────────────────
function buildNeofetch() {
  const info    = dataService.getResumePersonalInfo();
  const work    = dataService.getWorkExperience();
  const past    = dataService.getPastEvents();
  const links   = dataService.getSocialLinks();
  const current = work[0];
  const lichess = links.find(l => l.platform === 'Lichess');
  const avg     = (past.reduce((s, e) => s + e.rating, 0) / past.length).toFixed(1);
  const user    = `${info.name.toLowerCase().replace(' ', '')}@portfolio`;
  const sep     = '─'.repeat(user.length);

  const logo = [
    '  ┌─────────┐',
    '  │  ██ ██  │',
    '  │  █████  │',
    '  │  ██ ██  │',
    '  └─────────┘',
    '             ',
    '             ',
  ];

  const iLines = [
    { text: user,                                      color: G  },
    { text: sep,                                       color: DG },
    { text: `OS        GitHub Pages CDN`,              color: W  },
    { text: `Shell     React Terminal v1.0`,           color: W  },
    { text: `Runtime   React 19.1 + Bootstrap 5`,      color: W  },
    { text: `Stack     C++ · MATLAB · JS · React`,     color: W  },
    { text: `Role      ${current.position} @ ${current.company}`, color: W },
    { text: `Location  ${info.location}`,              color: W  },
    { text: `Chess     ♟  ${lichess?.username ?? '@Abhish3k'} on Lichess`, color: W },
    { text: `Music     ♫  ${past.length} concerts · ${avg}★ avg`, color: W },
    { text: `Uptime    Since Sep 2024`,                color: W  },
    { text: `Source    ${info.github}`,                color: A  },
  ];

  const maxLen = Math.max(logo.length, iLines.length);
  const lines  = [blank()];
  for (let i = 0; i < maxLen; i++) {
    const l = logo[i] ?? '             ';
    const r = iLines[i];
    if (r) {
      lines.push({ text: `${l}   ${r.text}`, color: i === 0 ? G : i === 1 ? DG : r.color });
    } else {
      lines.push(dim(l));
    }
  }
  lines.push(blank());
  return lines;
}

// ─────────────────────────────────────────────────
// grep
// ─────────────────────────────────────────────────
function buildGrep(args) {
  const term = args[0];
  if (!term) {
    return [blank(), dim('  usage: grep [term]'), blank()];
  }

  const q       = term.toLowerCase();
  const results = [];

  const hit = (source, label, text) => {
    if (text.toLowerCase().includes(q)) {
      const idx = text.toLowerCase().indexOf(q);
      const pre = trunc(text.slice(0, idx), 20);
      const mid = text.slice(idx, idx + term.length);
      const post = trunc(text.slice(idx + term.length), 40);
      results.push({ source, label, pre, mid, post });
    }
  };

  for (const job of dataService.getWorkExperience()) {
    hit('resume', `${job.company} · ${job.position}`, job.company);
    hit('resume', `${job.company} · ${job.position}`, job.position);
    for (const r of job.responsibilities) hit('resume', job.company, r);
    for (const t of job.technologies)     hit('resume', job.company, t);
  }
  for (const p of dataService.getProjects()) {
    hit('projects', p.name, p.description);
    hit('projects', p.name, p.name);
    for (const t of p.technologies) hit('projects', p.name, t);
  }
  for (const ev of dataService.getPastEvents()) {
    hit('music', ev.date, ev.title);
    hit('music', ev.title, ev.location);
    if (ev.review) hit('music', ev.title, ev.review);
  }
  for (const inst of dataService.getInstitutions()) {
    hit('education', inst.institution, inst.degree);
    for (const h of inst.highlights) hit('education', inst.institution, h);
  }
  for (const s of dataService.getSkills()) {
    hit('skills', s.category, s.name);
  }

  if (results.length === 0) {
    return [blank(), dim(`  no results for '${term}'`), blank()];
  }

  const lines = [blank(), hdr(`  GREP: '${term}'  (${results.length} match${results.length === 1 ? '' : 'es'})`), rule(54), blank()];
  for (const r of results) {
    lines.push(acc(`  [${r.source}]  ${r.label}`));
    lines.push(dim(`    …${r.pre}`) );
    lines.push(ln(`    ${r.pre}${r.mid}${r.post}…`));
  }
  lines.push(blank());
  return lines;
}

// ─────────────────────────────────────────────────
// command registry
// ─────────────────────────────────────────────────
export const COMMANDS = {
  help:         ()     => buildHelp(),
  ls:           ()     => buildLs(),
  whoami:       (args) => buildWhoami(args),
  about:        (args) => buildWhoami(args),
  resume:       (args) => buildResume(args),
  experience:   (args) => buildResume(args),
  projects:     (args) => buildProjects(args),
  music:        (args) => buildMusic(args),
  concerts:     (args) => buildMusic(['-concerts', ...args]),
  education:    (args) => buildEducation(args),
  contact:      (args) => buildContact(args),
  socials:      (args) => buildContact(args),
  architecture: ()     => buildArchitecture(),
  arch:         ()     => buildArchitecture(),
  neofetch:     ()     => buildNeofetch(),
  grep:         (args) => buildGrep(args),
};
