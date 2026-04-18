import dataService from '../services/dataService';

// ── ANSI helpers ──────────────────────────────────
const R  = '\x1b[0m';                                   // reset
const g  = s => `\x1b[38;2;0;255;65m${s}${R}`;         // green  #00ff41
const dg = s => `\x1b[38;2;0;143;17m${s}${R}`;         // dark green #008f11
const w  = s => `\x1b[38;2;201;209;217m${s}${R}`;      // white  #c9d1d9
const d  = s => `\x1b[2m${s}${R}`;                     // dim
const a  = s => `\x1b[38;2;119;119;119m${s}${R}`;      // accent #777
const b  = s => `\x1b[1m${s}${R}`;                     // bold
const rd = s => `\x1b[31m${s}${R}`;                    // red (errors)

// ── Layout helpers ────────────────────────────────
const pad   = (s, n)   => String(s).padEnd(n);
const trunc = (s, n)   => s.length > n ? s.slice(0, n - 1) + '…' : s;
const stars = r        => '★'.repeat(r) + '☆'.repeat(5 - r);
const rule  = (n = 58) => d('  ' + '─'.repeat(n));
const blank = ()       => '';

// Progress bar
const bar = (lvl, w = 20) => {
  const filled = Math.round(lvl / 100 * w);
  return g('█'.repeat(filled)) + d('░'.repeat(w - filled));
};

// Two-column row: left is green, right is white
const row = (left, leftW, right) =>
  `  ${g(pad(left, leftW))}  ${w(right)}`;

// Command + optional flag signature + description
const cmd  = (c, sig, desc, cw = 22) =>
  `  ${g(pad(c + (sig ? ` ${sig}` : ''), cw))}  ${w(desc)}`;

// Flag row (indented under its parent command)
const flag = (f, desc, cw = 22, fw = 14) =>
  `  ${pad('', cw)}  ${a(pad(f, fw))}  ${d(desc)}`;

// Word wrap — returns string[]
function wrapText(text, width, indent = '  ') {
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

// ─────────────────────────────────────────────────
// help
// ─────────────────────────────────────────────────
function buildHelp() {
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

// ─────────────────────────────────────────────────
// ls
// ─────────────────────────────────────────────────
function buildLs() {
  const past = dataService.getPastEvents();
  const e = (prefix, f, desc) =>
    `  ${d(prefix)}${a(pad(f, 14))}  ${d(desc)}`;

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
    e('  ├── ', '-setlist',   'Artist lineups for festivals'),
    e('  └── ', '-stats',     'Stats.fm lifetime data'),
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
    const faves   = [...past].sort((a, b) => b.rating - a.rating).slice(0, 3).map(e => e.title);
    return [
      blank(),
      g(`  ${info.name}`),
      rule(info.name.length + 2),
      w(`  ${info.title}  ·  ${info.location}`),
      blank(),
      ...wrapText(summary, 72),
      blank(),
      g('  INTERESTS'),
      rule(),
      blank(),
      `  ${g('♟')}  ${w('Chess')}`,
      d(`     ${lichess ? lichess.url : 'lichess.org/@Abhish3k'}`),
      d('     Active player · enjoy classical and rapid formats'),
      blank(),
      `  ${g('♫')}  ${w('Music')}`,
      d(`     ${past.length} concerts · avg rating ${avg}★`),
      d(`     Favorites: ${faves.join(' · ')}`),
      blank(),
      `  ${g('🎮')}  ${w('Gaming')}`,
      d('     PC gamer · shipped AAA titles at Ubisoft'),
      d('     Far Cry 5 · Starlink · Prince of Persia'),
      blank(),
    ];
  }

  return [
    blank(),
    g(`  ${info.name}`),
    rule(info.name.length + 2),
    w(`  ${info.title}  ·  ${info.location}`),
    a(`  ${info.website}`),
    blank(),
    ...wrapText(summary, 72),
    blank(),
    dg("  type 'whoami -interests' for chess · music · gaming details"),
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
    const lines = [blank(), g('  CAREER TIMELINE'), rule(), blank()];
    for (const job of [...work].reverse()) {
      const year    = job.period.slice(0, 4);
      const current = job.period.includes('Present');
      const bullet  = current ? '══' : '──';
      const company = pad(job.company, 22);
      const pos     = pad(job.position, 28);
      lines.push(current
        ? `  ${g(year)}  ${g(bullet)}  ${g(pos)}${g(company)}${dg('← present')}`
        : `  ${d(year)}  ${d(bullet)}  ${d(pos)}${d(company)}`
      );
    }
    lines.push(blank());
    for (const inst of [...edu].reverse()) {
      const year = inst.period.slice(0, 4);
      lines.push(d(`  ${year}  ░░  [${inst.degree.split(',')[0]}  ·  GPA ${inst.gpa}]`));
    }
    lines.push(blank(), d(`  ${work.length} roles · game dev → startup → enterprise`), blank());
    return lines;
  }

  if (args.includes('-skills')) {
    const skills  = dataService.getSkills();
    const grouped = {};
    for (const s of skills) {
      if (!grouped[s.category]) grouped[s.category] = [];
      grouped[s.category].push(s);
    }
    const lines = [blank(), g('  SKILLS'), rule(), blank()];
    for (const [cat, items] of Object.entries(grouped)) {
      lines.push(a(`  ${cat.toUpperCase()}`));
      for (const s of items) {
        lines.push(`  ${w(pad(s.name, 20))} ${bar(s.level)}  ${d(String(s.level))}`);
      }
      lines.push(blank());
    }
    return lines;
  }

  if (args.includes('-exp') || args.includes('-full')) {
    const lines = [blank(), g('  WORK EXPERIENCE'), rule()];
    for (const job of work) {
      lines.push(blank());
      lines.push(`  ${g(pad(job.company, 36))}${d(job.period)}`);
      lines.push(a(`  ${job.position}  ·  ${job.type}  ·  ${job.location}`));
      for (const r of job.responsibilities) lines.push(w(`    · ${trunc(r, 72)}`));
      lines.push(d(`  Stack: ${job.technologies.join(' · ')}`));
    }
    if (args.includes('-full')) {
      lines.push(...buildResume(['-skills']).slice(1));
    } else {
      lines.push(blank());
    }
    return lines;
  }

  const current = work[0];
  return [
    blank(),
    g('  RESUME'),
    rule(),
    blank(),
    g(`  ${current.company}`),
    w(`  ${current.position}  ·  ${current.period}`),
    d(`  ${current.location}`),
    blank(),
    ...wrapText(dataService.getSummary(), 72),
    blank(),
    dg('  resume -timeline  · -skills  · -exp  · -full'),
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
      g(`  ${wizard.name.toUpperCase()}`),
      rule(),
      a(`  ${wizard.tagline}`),
      d(`  ${wizard.context}  ·  ${wizard.period}  ·  ${wizard.role}`),
      d(`  Stack: ${wizard.technologies.join(' · ')}`),
      blank(),
      ...wrapText(wizard.description, 72),
      blank(),
      g('  ARCHITECTURE LAYERS'), rule(),
    ];
    for (const layer of wizard.architecture.layers) {
      const [name, desc] = layer.split(' — ');
      lines.push(d(`  ├─ ${name}`));
      if (desc) lines.push(d(`  │  ${trunc(desc, 64)}`));
    }
    lines.push(blank(), g('  DESIGN PATTERNS'), rule());
    for (const p of wizard.architecture.patterns) {
      const [name, ...rest] = p.split(' — ');
      lines.push(`  ${a(pad(name, 18))}`);
      lines.push(d(`    ${trunc(rest.join(' — '), 66)}`));
    }
    lines.push(blank(), g('  KEY FEATURES'), rule());
    for (const f of wizard.keyFeatures) lines.push(d(`  · ${trunc(f, 70)}`));
    lines.push(blank(), g('  ROADMAP'), rule());
    for (const i of wizard.improvements) lines.push(d(`  · ${trunc(i, 70)}`));
    lines.push(blank(), a(`  Impact: ${wizard.impact.teams} · ${wizard.impact.products}`), blank());
    return lines;
  }

  if (args.includes('-portfolio') || args.includes('-2')) {
    const lines = [
      blank(),
      g(`  ${site.name.toUpperCase()}`),
      rule(),
      a(`  ${site.tagline}`),
      d(`  ${site.context}  ·  ${site.period}  ·  ${site.role}`),
      d(`  Stack: ${site.technologies.join(' · ')}`),
      blank(),
      ...wrapText(site.description, 72),
      blank(),
      g('  FEATURES'), rule(),
    ];
    for (const f of site.features) lines.push(d(`  · ${f}`));
    lines.push(blank(), d(`  Live:   ${site.liveUrl}`), d(`  Source: ${site.githubUrl}`), blank());
    return lines;
  }

  return [
    blank(),
    g('  PROJECTS'),
    rule(),
    blank(),
    row('[1]', 4, wizard.name),
    a(`      ${wizard.tagline}`),
    d(`      ${wizard.context}  ·  ${wizard.period}`),
    d(`      Stack: ${wizard.technologies.join(' · ')}`),
    blank(),
    row('[2]', 4, site.name),
    a(`      ${site.tagline}`),
    d(`      ${site.context}  ·  ${site.period}`),
    d(`      ${site.liveUrl}`),
    blank(),
    dg('  projects -wizard  · -portfolio'),
    blank(),
  ];
}

// ── Arg parser: -key value or bare -flag ─────────
function parseArgs(args) {
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

// ─────────────────────────────────────────────────
// music
// ─────────────────────────────────────────────────
function renderSetlist(ev) {
  const lines = [];
  lines.push(`  ${g(ev.title)}  ${d('id:' + ev.id)}`);
  lines.push(`  ${d(ev.date)}  ·  ${a(ev.venue || ev.location)}  ·  ${d(ev.location)}`);
  lines.push(d('  ' + '═'.repeat(54)));
  lines.push(blank());

  if (ev.type === 'Festival' && ev.artists?.length) {
    // Festival: artist → setlist tree
    ev.artists.forEach((artist, ai) => {
      const isLastArtist = ai === ev.artists.length - 1;
      const branch = isLastArtist ? '└─' : '├─';
      lines.push(`  ${d(branch)}  ${g(artist.name)}`);
      if (artist.setlist?.length) {
        artist.setlist.forEach((track, ti) => {
          const pipe = isLastArtist ? '   ' : '│  ';
          lines.push(`  ${d(pipe)}  ${d(String(ti + 1).padStart(2) + '.')}  ${w(track)}`);
        });
        if (!isLastArtist) lines.push(`  ${d('│')}`);
      }
    });
  } else if (ev.setlist?.length) {
    // Regular event: flat song list
    ev.setlist.forEach((track, i) =>
      lines.push(`  ${d(String(i + 1).padStart(2) + '.')}  ${w(track)}`)
    );
  } else {
    lines.push(d('  No setlist data for this event.'));
  }

  lines.push(blank());
  return lines;
}

function buildMusic(args) {
  const past     = dataService.getPastEvents();
  const settings = dataService.getMusicSettings();
  const sorted   = [...past].sort((a, b) => new Date(a.date) - new Date(b.date));
  const avg      = (past.reduce((s, e) => s + e.rating, 0) / past.length).toFixed(1);
  const { flags, opts } = parseArgs(args);

  const CD = 12, CA = 26, CL = 20;
  const TW = CD + CA + CL + 8;
  const tableRule = d('  ' + '─'.repeat(TW));
  const tableRow  = ev =>
    `  ${d(pad(ev.id.toString(), 4))}${d(pad(ev.date, CD))}${w(pad(trunc(ev.title, CA - 1), CA))}${a(pad(trunc(ev.location, CL - 1), CL))}${g(stars(ev.rating))}`;

  // ── -eventid selector ──────────────────────────
  if (opts.eventid) {
    const ev = past.find(e => e.id === parseInt(opts.eventid));
    if (!ev) return [blank(), rd(`  No event found with id ${opts.eventid}`), blank()];

    if (flags.has('setlist')) {
      return fetch('/data/events-enriched.json')
        .then(r => r.json())
        .then(enriched => {
          const enrichedEv = [...(enriched.pastEvents || []), ...(enriched.upcomingEvents || [])]
            .find(e => e.id === ev.id);
          // Merge enrichment artistSetlists into artists array if available
          const merged = { ...ev };
          const artistSetlists = enrichedEv?.enrichment?.artistSetlists;
          if (artistSetlists && merged.artists) {
            merged.artists = merged.artists.map(artist => ({
              ...artist,
              setlist: artistSetlists[artist.name]?.map(t => t.name ?? t) ?? artist.setlist ?? []
            }));
          }
          return [blank(), g('  SETLIST'), rule(), ...renderSetlist(merged)];
        })
        .catch(() => [blank(), g('  SETLIST'), rule(), ...renderSetlist(ev)]);
    }

    if (flags.has('date')) {
      return [
        blank(),
        g(`  ${ev.title}`),
        rule(),
        blank(),
        `  ${a(pad('ID', 12))}${w(ev.id)}`,
        `  ${a(pad('Date', 12))}${w(ev.date)}`,
        `  ${a(pad('Venue', 12))}${w(ev.venue || '—')}`,
        `  ${a(pad('Location', 12))}${w(ev.location)}`,
        `  ${a(pad('Type', 12))}${w(ev.type)}`,
        blank(),
      ];
    }

    // Default: full event detail
    return [
      blank(),
      g(`  ${ev.title}`),
      rule(),
      blank(),
      `  ${a(pad('ID', 12))}${w(ev.id)}`,
      `  ${a(pad('Date', 12))}${w(ev.date)}`,
      `  ${a(pad('Venue', 12))}${w(ev.venue || '—')}`,
      `  ${a(pad('Location', 12))}${w(ev.location)}`,
      `  ${a(pad('Type', 12))}${w(ev.type)}`,
      `  ${a(pad('Rating', 12))}${w(stars(ev.rating))}`,
      blank(),
      ...(ev.review ? wrapText(`"${ev.review}"`, 68) : []),
      blank(),
      ...(ev.setlist?.length || ev.artists?.length
        ? [dg("  type 'music -eventid " + ev.id + " -setlist' to view setlist"), blank()]
        : []),
    ];
  }

  // ── Global flags ───────────────────────────────
  if (flags.has('concerts')) {
    return [
      blank(),
      g(`  CONCERTS ATTENDED  (${past.length})`),
      tableRule,
      `  ${a(pad('ID', 4))}${a(pad('DATE', CD))}${a(pad('ARTIST', CA))}${a(pad('LOCATION', CL))}${a('RATING')}`,
      tableRule,
      ...sorted.map(tableRow),
      tableRule,
      d(`  ${past.length} concerts  ·  avg ${avg}/5  ·  ${settings.favoriteGenre}`),
      d(`  use 'music -eventid <id>' for event details`),
      blank(),
    ];
  }

  if (flags.has('reviews')) {
    const lines = [blank(), g('  CONCERT REVIEWS'), rule(), blank()];
    for (const ev of [...sorted].reverse()) {
      lines.push(`  ${g(stars(ev.rating))}  ${ev.rating === 5 ? g(pad(ev.title, 28)) : w(pad(ev.title, 28))}${d(ev.date)}`);
      lines.push(d(`  ${ev.location}`));
      lines.push(...wrapText(`"${ev.review}"`, 68));
      lines.push(blank());
    }
    return lines;
  }

  if (flags.has('best')) {
    const best = sorted.filter(e => e.rating === 5);
    return [
      blank(),
      g(`  5-STAR CONCERTS  (${best.length})`),
      tableRule,
      blank(),
      ...best.map(ev => `  ${d(pad(ev.date, CD))}${g(pad(trunc(ev.title, CA - 1), CA))}${a(ev.location)}`),
      blank(),
    ];
  }

  if (flags.has('setlist')) {
    const withData = sorted.filter(ev => ev.setlist?.length || ev.artists?.length);
    if (withData.length === 0) return [blank(), d('  No setlist data available for any event.'), blank()];
    const lines = [blank(), g('  SETLISTS'), rule(), blank()];
    for (const ev of [...withData].reverse()) lines.push(...renderSetlist(ev));
    return lines;
  }

  if (flags.has('stats')) return fetchMusicStats();

  // Default summary
  const recent = [...sorted].reverse().slice(0, 3);
  return [
    blank(),
    g('  MUSIC'),
    rule(),
    blank(),
    w(`  ${past.length} concerts attended  ·  avg rating ${avg}/5`),
    d(`  favorite genre: ${settings.favoriteGenre}`),
    d(`  favorites: ${settings.favoriteArtists?.join(' · ') ?? '—'}`),
    blank(),
    a('  RECENT SHOWS'),
    d('  ' + '─'.repeat(58)),
    `  ${a(pad('ARTIST', 28))}${a(pad('LOCATION', 20))}${a('DATE')}`,
    d('  ' + '─'.repeat(58)),
    ...recent.map(ev =>
      `  ${w(pad(trunc(ev.title, 27), 28))}${d(pad(trunc(ev.location, 19), 20))}${d(ev.date)}`
    ),
    blank(),
    dg('  music -concerts  · -reviews  · -best  · -setlist  · -stats'),
    dg('  music -eventid <id> [-setlist | -date]'),
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

    const lines = [blank(), g('  STATS.FM — ALL TIME'), rule(), blank()];

    if (artists?.items?.length) {
      lines.push(a('  TOP ARTISTS'));
      artists.items.slice(0, 5).forEach((item, i) =>
        lines.push(w(`  ${i + 1}.  ${item.artist?.name ?? item.name ?? '?'}`))
      );
      lines.push(blank());
    }
    if (tracks?.items?.length) {
      lines.push(a('  TOP TRACKS'));
      tracks.items.slice(0, 5).forEach((item, i) =>
        lines.push(w(`  ${i + 1}.  ${item.track?.name ?? item.name ?? '?'}`))
      );
      lines.push(blank());
    }
    if (genres?.items?.length) {
      lines.push(a('  TOP GENRES'));
      genres.items.slice(0, 5).forEach((item, i) =>
        lines.push(w(`  ${i + 1}.  ${item.genre?.tag ?? item.tag ?? item.name ?? '?'}`))
      );
      lines.push(blank());
    }
    if (!artists && !tracks && !genres) {
      lines.push(d('  Stats not yet generated — push to main to trigger CI.'), blank());
    }
    return lines;
  } catch {
    return [blank(), rd('  Could not load stats data.'), blank()];
  }
}

// ─────────────────────────────────────────────────
// education
// ─────────────────────────────────────────────────
function buildEducation(args) {
  const institutions = dataService.getInstitutions();

  if (args.includes('-full')) {
    const lines = [blank(), g('  EDUCATION'), rule()];
    for (const inst of institutions) {
      lines.push(blank());
      lines.push(g(`  ${inst.institution}`));
      lines.push(w(`  ${inst.degree}`));
      lines.push(d(`  ${inst.period}  ·  GPA ${inst.gpa}  ·  ${inst.location}`));
      lines.push(blank(), a('  Achievements:'));
      for (const achievement of inst.achievements) lines.push(d(`    · ${achievement}`));
      lines.push(a('  Coursework:'));
      lines.push(d(`    ${inst.highlights.slice(0, 5).join('  ·  ')}`));
    }
    lines.push(blank());
    return lines;
  }

  return [
    blank(),
    g('  EDUCATION'),
    rule(),
    blank(),
    ...institutions.flatMap(inst => [
      g(`  ${inst.institution}`),
      w(`  ${inst.degree}`),
      d(`  ${inst.period}  ·  GPA ${inst.gpa}  ·  ${inst.location}`),
      blank(),
    ]),
    dg('  education -full  for coursework and achievements'),
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
    const lines = [blank(), g('  CONTACT'), rule(), blank()];
    for (const l of links) {
      lines.push(`  ${w(pad(l.platform, 14))}${a(pad(l.username, 20))}${d(l.url)}`);
    }
    lines.push(
      blank(),
      `  ${d(pad('Email', 14))}${w(info.email)}`,
      `  ${d(pad('Location', 14))}${w(info.location)}  ·  ${d(info.timezone)}`,
      `  ${d(pad('Available', 14))}${w(info.availability)}`,
      `  ${d(pad('Response', 14))}${w(info.responseTime)}`,
      blank(),
    );
    return lines;
  }

  const key = links.filter(l => ['LinkedIn', 'GitHub', 'Lichess'].includes(l.platform));
  return [
    blank(),
    g('  CONTACT'),
    rule(),
    blank(),
    `  ${d(pad('Email', 14))}${w(info.email)}`,
    blank(),
    ...key.map(l => `  ${w(pad(l.platform, 14))}${a(l.url)}`),
    blank(),
    dg('  contact -all  for all platforms'),
    blank(),
  ];
}

// ─────────────────────────────────────────────────
// architecture
// ─────────────────────────────────────────────────
function buildArchitecture() {
  const arch = dataService.getArchitecture();
  const info = dataService.getResumePersonalInfo();
  const lines = [blank(), g('  PORTFOLIO ARCHITECTURE'), rule(), blank()];

  lines.push(a('  CI/CD Pipeline'));
  lines.push(w('  Trigger → Stats.fm → Enrich Events → Generate Diagram → Build → Deploy'));
  lines.push(blank(), a('  Layers'));

  for (const layer of arch.layers) {
    lines.push(`  ${w(pad(layer.label, 12))}${d(layer.sublabel)}`);
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
  ].forEach(([api, desc]) => lines.push(`  ${w(pad(api, 16))}${d(desc)}`));

  lines.push(blank(), d(`  Source: ${info.github}`), blank());
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

  const logo = [
    g('  ┌─────────┐'),
    g('  │  ██ ██  │'),
    g('  │  █████  │'),
    g('  │  ██ ██  │'),
    g('  └─────────┘'),
    '',
    '',
  ];

  const info_lines = [
    `${g(user)}`,
    `${d('─'.repeat(user.length))}`,
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

  const maxLen = Math.max(logo.length, info_lines.length);
  const lines  = [blank()];
  for (let i = 0; i < maxLen; i++) {
    const l = logo[i] ?? '             ';
    const r = info_lines[i] ?? '';
    lines.push(`${l}   ${r}`);
  }
  lines.push(blank());
  return lines;
}

// ─────────────────────────────────────────────────
// grep
// ─────────────────────────────────────────────────
function buildGrep(args) {
  const term = args[0];
  if (!term) return [blank(), d('  usage: grep <term>'), blank()];

  const q       = term.toLowerCase();
  const results = [];

  const hit = (source, label, text) => {
    if (text.toLowerCase().includes(q)) {
      const idx  = text.toLowerCase().indexOf(q);
      const pre  = trunc(text.slice(0, idx), 20);
      const mid  = text.slice(idx, idx + term.length);
      const post = trunc(text.slice(idx + term.length), 40);
      results.push({ source, label, pre, mid, post });
    }
  };

  for (const job of dataService.getWorkExperience()) {
    hit('resume',   `${job.company} · ${job.position}`, job.company);
    hit('resume',   `${job.company} · ${job.position}`, job.position);
    for (const r of job.responsibilities) hit('resume',   job.company, r);
    for (const t of job.technologies)     hit('resume',   job.company, t);
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

  if (results.length === 0) {
    return [blank(), d(`  no results for '${term}'`), blank()];
  }

  const lines = [blank(), g(`  GREP: '${term}'  (${results.length} match${results.length === 1 ? '' : 'es'})`), rule(), blank()];
  for (const r of results) {
    lines.push(`  ${a(`[${r.source}]`)}  ${d(r.label)}`);
    lines.push(`    ${d(r.pre)}${g(r.mid)}${d(r.post)}`);
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
