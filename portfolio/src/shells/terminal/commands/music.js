import dataService from '../../../services/dataService';
import { g, dg, w, d, a, rd, blank, rule, stars, wrapText, parseArgs } from '../ansi';

export function renderSetlist(ev) {
  const lines = [];
  lines.push(`  ${g(ev.title)}  ${d('id:' + ev.id)}`);
  lines.push(`  ${d(ev.date)}  ·  ${a(ev.venue || ev.location)}  ·  ${d(ev.location)}`);
  lines.push(d('  ' + '═'.repeat(54)));
  lines.push(blank());

  if (ev.type === 'Festival' && ev.artists?.length) {
    ev.artists.forEach((artist, ai) => {
      const isLast = ai === ev.artists.length - 1;
      const branch = isLast ? '└─' : '├─';
      lines.push(`  ${d(branch)}  ${g(artist.name)}`);
      if (artist.setlist?.length) {
        artist.setlist.forEach((track, ti) => {
          const pipe = isLast ? '   ' : '│  ';
          lines.push(`  ${d(pipe)}  ${d(String(ti + 1).padStart(2) + '.')}  ${w(track)}`);
        });
        if (!isLast) lines.push(`  ${d('│')}`);
      }
    });
  } else if (ev.setlist?.length) {
    ev.setlist.forEach((track, i) =>
      lines.push(`  ${d(String(i + 1).padStart(2) + '.')}  ${w(track)}`)
    );
  } else {
    lines.push(d('  No setlist data for this event.'));
  }

  lines.push(blank());
  return lines;
}

export async function fetchMusicStats() {
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

export function buildMusic(args) {
  const past     = dataService.getPastEvents();
  const settings = dataService.getMusicSettings();
  const sorted   = [...past].sort((a, b) => new Date(a.date) - new Date(b.date));
  const avg      = (past.reduce((s, e) => s + e.rating, 0) / past.length).toFixed(1);
  const { flags, opts } = parseArgs(args);

  const CD = 12, CA = 26, CL = 20;
  const TW = CD + CA + CL + 8;
  const tableRule = d('  ' + '─'.repeat(TW));
  const tableRow  = ev =>
    `  ${d(ev.id.toString().padEnd(4))}${d(ev.date.padEnd(CD))}${w((ev.title.length > CA - 1 ? ev.title.slice(0, CA - 2) + '…' : ev.title).padEnd(CA))}${a((ev.location.length > CL - 1 ? ev.location.slice(0, CL - 2) + '…' : ev.location).padEnd(CL))}${g(stars(ev.rating))}`;

  // ── -eventid selector ────────────────────────────
  if (opts.eventid) {
    const ev = past.find(e => e.id === parseInt(opts.eventid));
    if (!ev) return [blank(), rd(`  No event found with id ${opts.eventid}`), blank()];

    if (flags.has('setlist')) {
      return fetch('/data/events-enriched.json')
        .then(r => r.json())
        .then(enriched => {
          const enrichedEv = [...(enriched.pastEvents || []), ...(enriched.upcomingEvents || [])]
            .find(e => e.id === ev.id);
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
        blank(), g(`  ${ev.title}`), rule(), blank(),
        `  ${a('ID'.padEnd(12))}${w(ev.id)}`,
        `  ${a('Date'.padEnd(12))}${w(ev.date)}`,
        `  ${a('Venue'.padEnd(12))}${w(ev.venue || '—')}`,
        `  ${a('Location'.padEnd(12))}${w(ev.location)}`,
        `  ${a('Type'.padEnd(12))}${w(ev.type)}`,
        blank(),
      ];
    }

    return [
      blank(), g(`  ${ev.title}`), rule(), blank(),
      `  ${a('ID'.padEnd(12))}${w(ev.id)}`,
      `  ${a('Date'.padEnd(12))}${w(ev.date)}`,
      `  ${a('Venue'.padEnd(12))}${w(ev.venue || '—')}`,
      `  ${a('Location'.padEnd(12))}${w(ev.location)}`,
      `  ${a('Type'.padEnd(12))}${w(ev.type)}`,
      `  ${a('Rating'.padEnd(12))}${w(stars(ev.rating))}`,
      blank(),
      ...(ev.review ? wrapText(`"${ev.review}"`, 68) : []),
      blank(),
      ...(ev.setlist?.length || ev.artists?.length
        ? [dg(`  type 'music -eventid ${ev.id} -setlist' to view setlist`), blank()]
        : []),
    ];
  }

  // ── Global flags ────────────────────────────────
  if (flags.has('concerts')) {
    return [
      blank(),
      g(`  CONCERTS ATTENDED  (${past.length})`),
      tableRule,
      `  ${a('ID'.padEnd(4))}${a('DATE'.padEnd(CD))}${a('ARTIST'.padEnd(CA))}${a('LOCATION'.padEnd(CL))}${a('RATING')}`,
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
      lines.push(`  ${g(stars(ev.rating))}  ${ev.rating === 5 ? g(ev.title.padEnd(28)) : w(ev.title.padEnd(28))}${d(ev.date)}`);
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
      tableRule, blank(),
      ...best.map(ev => `  ${d(ev.date.padEnd(CD))}${g(ev.title.padEnd(CA))}${a(ev.location)}`),
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
    `  ${a('ARTIST'.padEnd(28))}${a('LOCATION'.padEnd(20))}${a('DATE')}`,
    d('  ' + '─'.repeat(58)),
    ...recent.map(ev =>
      `  ${w(ev.title.slice(0, 27).padEnd(28))}${d(ev.location.slice(0, 19).padEnd(20))}${d(ev.date)}`
    ),
    blank(),
    dg('  music -concerts  · -reviews  · -best  · -setlist  · -stats'),
    dg('  music -eventid <id> [-setlist | -date]'),
    blank(),
  ];
}
