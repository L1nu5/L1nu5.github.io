const fs = require('fs');
const path = require('path');
const https = require('https');

const MUSIC_EVENTS_JSON = path.join(__dirname, '..', 'portfolio', 'src', 'data', 'musicEvents.json');
const CACHE_FILE        = path.join(__dirname, '..', 'data', 'events-cache.json');
const OUTPUT_FILE       = path.join(__dirname, '..', 'portfolio', 'public', 'data', 'events-enriched.json');

const CACHE_VERSION    = 1;
const MISS_RETRY_DAYS  = 30;

// ─────────────────────────────────────────────
// HTTP
// ─────────────────────────────────────────────
function makeRequest(url, headers = {}) {
  return new Promise((resolve, reject) => {
    const req = https.request(url, {
      method: 'GET',
      headers: { Accept: 'application/json', ...headers }
    }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        if (res.statusCode === 404) { resolve(null); return; }
        if (res.statusCode >= 200 && res.statusCode < 300) {
          try { resolve(JSON.parse(data)); }
          catch (e) { reject(new Error(`JSON parse failed: ${e.message}`)); }
        } else {
          reject(new Error(`HTTP ${res.statusCode}: ${data.slice(0, 300)}`));
        }
      });
    });
    req.on('error', reject);
    req.setTimeout(30000, () => { req.destroy(); reject(new Error('Request timed out')); });
    req.end();
  });
}

const delay = ms => new Promise(r => setTimeout(r, ms));

// ─────────────────────────────────────────────
// Unified enrichment shape
// Every source must return this or null.
// ─────────────────────────────────────────────
function makeEnrichment(source, overrides = {}) {
  return {
    source,
    found: false,
    venue:      null,   // { name, city, state, country, address }
    setlist:    [],     // [ { name, encore } ]  — setlist.fm only
    images:     [],     // [ url ]               — ticketmaster only
    ticketUrl:  null,   //                         ticketmaster only
    setlistUrl: null,   //                         setlist.fm only
    externalIds: { setlistfm: null, ticketmaster: null },
    ...overrides
  };
}

// ─────────────────────────────────────────────
// Source: Setlist.fm
// ─────────────────────────────────────────────
const SFM_BASE = 'https://api.setlist.fm/rest/1.0';

function toSfmDate(iso) {
  const [y, m, d] = iso.split('-');
  return `${d}-${m}-${y}`;
}

async function querySetlistFm(apiKey, event) {
  const artist = encodeURIComponent((event.artists && event.artists[0]) || event.title);
  const url = `${SFM_BASE}/search/setlists?artistName=${artist}&date=${toSfmDate(event.date)}&p=1`;

  const data = await makeRequest(url, {
    'x-api-key': apiKey,
    'Accept': 'application/json'
  });

  const list = data?.setlist;
  if (!list || list.length === 0) return null;

  const hit = list[0];
  const city = hit.venue?.city;

  const setlist = (hit.sets?.set || []).flatMap(set =>
    (set.song || []).map(song => ({
      name: song.name,
      encore: !!set.encore
    }))
  ).filter(s => s.name);

  return makeEnrichment('setlist.fm', {
    found: true,
    venue: {
      name:    hit.venue?.name    || null,
      city:    city?.name         || null,
      state:   city?.state        || null,
      country: city?.country?.code || null,
      address: null
    },
    setlist,
    setlistUrl: hit.url || null,
    externalIds: { setlistfm: hit.id || null, ticketmaster: null }
  });
}

// ─────────────────────────────────────────────
// Source: Ticketmaster
// ─────────────────────────────────────────────
const TM_BASE = 'https://app.ticketmaster.com/discovery/v2/events.json';

async function queryTicketmaster(apiKey, event) {
  const keyword = encodeURIComponent((event.artists && event.artists[0]) || event.title);
  const next = new Date(event.date);
  next.setDate(next.getDate() + 1);

  const params = new URLSearchParams({
    apikey: apiKey,
    keyword,
    startDateTime: `${event.date}T00:00:00Z`,
    endDateTime:   `${next.toISOString().split('T')[0]}T23:59:59Z`,
    size: 5,
    sort: 'relevance,desc'
  });

  const data = await makeRequest(`${TM_BASE}?${params}`);
  const events = data?._embedded?.events;
  if (!events || events.length === 0) return null;

  const hit   = events[0];
  const venue = hit._embedded?.venues?.[0];

  return makeEnrichment('ticketmaster', {
    found: true,
    venue: venue ? {
      name:    venue.name               || null,
      city:    venue.city?.name         || null,
      state:   venue.state?.name        || null,
      country: venue.country?.countryCode || null,
      address: venue.address?.line1     || null
    } : null,
    images:    selectImages(hit.images),
    ticketUrl: hit.url || null,
    externalIds: { setlistfm: null, ticketmaster: hit.id || null }
  });
}

function selectImages(images) {
  if (!images || !images.length) return [];
  const out = [];
  for (const ratio of ['16_9', '4_3', '3_2']) {
    const pick = images
      .filter(i => i.ratio === ratio && !i.fallback)
      .sort((a, b) => (b.width || 0) - (a.width || 0))[0];
    if (pick) out.push(pick.url);
  }
  if (!out.length && images[0]) out.push(images[0].url);
  return out;
}

// ─────────────────────────────────────────────
// Cache
// ─────────────────────────────────────────────
function loadCache() {
  if (fs.existsSync(CACHE_FILE)) {
    try {
      const raw = JSON.parse(fs.readFileSync(CACHE_FILE, 'utf8'));
      if (raw.version === CACHE_VERSION) return raw;
      console.log('  Cache version mismatch — rebuilding.');
    } catch (e) {
      console.warn(`  Cache unreadable (${e.message}) — rebuilding.`);
    }
  }
  return { version: CACHE_VERSION, entries: {} };
}

function saveCache(cache) {
  ensureDir(CACHE_FILE);
  fs.writeFileSync(CACHE_FILE, JSON.stringify(cache, null, 2));
}

function cacheKey(event) {
  const slug = event.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
  return `${slug}-${event.date}`;
}

function shouldFetch(entry) {
  if (!entry) return true;
  if (entry.found) return false;   // permanent hit — never re-fetch
  const ageDays = (Date.now() - new Date(entry.cachedAt).getTime()) / 86_400_000;
  return ageDays > MISS_RETRY_DAYS;
}

// ─────────────────────────────────────────────
// Pipeline: cache → Setlist.fm → Ticketmaster
// ─────────────────────────────────────────────
async function enrichEvent(event, cache, sfmKey, tmKey) {
  const key    = cacheKey(event);
  const cached = cache.entries[key];

  if (!shouldFetch(cached)) {
    const label = cached.found ? `cache [${cached.source}]` : 'cached miss';
    console.log(`  [${label}] ${event.title} (${event.date})`);
    return cached.found ? cached : null;
  }

  console.log(`  [fetching]  ${event.title} (${event.date})`);

  // 1 — Setlist.fm
  if (sfmKey) {
    try {
      const result = await querySetlistFm(sfmKey, event);
      if (result) {
        console.log(`    ✓ Setlist.fm — ${result.setlist.length} songs`);
        cache.entries[key] = { ...result, cachedAt: new Date().toISOString() };
        return cache.entries[key];
      }
      console.log('    – Setlist.fm: no match');
    } catch (e) { console.warn(`    ⚠ Setlist.fm error: ${e.message}`); }
    await delay(300);
  }

  // 2 — Ticketmaster
  if (tmKey) {
    try {
      const result = await queryTicketmaster(tmKey, event);
      if (result) {
        console.log('    ✓ Ticketmaster');
        cache.entries[key] = { ...result, cachedAt: new Date().toISOString() };
        return cache.entries[key];
      }
      console.log('    – Ticketmaster: no match');
    } catch (e) { console.warn(`    ⚠ Ticketmaster error: ${e.message}`); }
    await delay(250);
  }

  // 3 — Not found anywhere
  console.log('    ✗ Not found — manual entry only');
  cache.entries[key] = { ...makeEnrichment('not-found'), cachedAt: new Date().toISOString() };
  return null;
}

// ─────────────────────────────────────────────
// Output builder
// ─────────────────────────────────────────────
function buildOutput(pastPairs, upcomingPairs) {
  const shape = ([event, enrichment]) => ({
    ...event,
    enrichment: enrichment
      ? {
          source:      enrichment.source,
          venue:       enrichment.venue,
          setlist:     enrichment.setlist,
          images:      enrichment.images,
          ticketUrl:   enrichment.ticketUrl,
          setlistUrl:  enrichment.setlistUrl,
          externalIds: enrichment.externalIds
        }
      : null
  });

  return {
    enrichedAt:     new Date().toISOString(),
    pastEvents:     pastPairs.map(shape),
    upcomingEvents: upcomingPairs.map(shape)
  };
}

function ensureDir(p) {
  const d = path.dirname(p);
  if (!fs.existsSync(d)) fs.mkdirSync(d, { recursive: true });
}

// ─────────────────────────────────────────────
// Main
// ─────────────────────────────────────────────
async function main() {
  const sfmKey = process.env.SETLIST_FM_API_KEY;
  const tmKey  = process.env.TICKETMASTER_API_KEY;

  if (!sfmKey && !tmKey) {
    console.error('Error: SETLIST_FM_API_KEY and/or TICKETMASTER_API_KEY required');
    process.exit(1);
  }

  const activeOrder = [sfmKey && 'Setlist.fm', tmKey && 'Ticketmaster']
    .filter(Boolean).join(' → ');

  console.log('Event Enrichment Pipeline');
  console.log('==========================');
  console.log(`Order: cache → ${activeOrder} → manual\n`);

  const musicEvents   = JSON.parse(fs.readFileSync(MUSIC_EVENTS_JSON, 'utf8'));
  const pastEvents    = musicEvents.pastEvents    || [];
  const upcomingEvents = musicEvents.upcomingEvents || [];

  const cache    = loadCache();
  const hitCount = Object.values(cache.entries).filter(e => e.found).length;
  console.log(`Cache: ${Object.keys(cache.entries).length} entries, ${hitCount} with data\n`);

  console.log(`Past events (${pastEvents.length}):`);
  const pastPairs = [];
  for (const ev of pastEvents) {
    pastPairs.push([ev, await enrichEvent(ev, cache, sfmKey, tmKey)]);
  }

  console.log(`\nUpcoming events (${upcomingEvents.length}):`);
  const upcomingPairs = [];
  for (const ev of upcomingEvents) {
    upcomingPairs.push([ev, await enrichEvent(ev, cache, sfmKey, tmKey)]);
  }

  saveCache(cache);
  console.log(`\n✓ Cache saved   → ${CACHE_FILE}`);

  ensureDir(OUTPUT_FILE);
  fs.writeFileSync(OUTPUT_FILE, JSON.stringify(buildOutput(pastPairs, upcomingPairs), null, 2));
  console.log(`✓ Output saved  → ${OUTPUT_FILE}`);

  const total = pastPairs.length + upcomingPairs.length;
  const found = [...pastPairs, ...upcomingPairs].filter(([, e]) => e).length;
  const bySource = {};
  Object.values(cache.entries)
    .filter(e => e.found)
    .forEach(e => { bySource[e.source] = (bySource[e.source] || 0) + 1; });

  console.log(`\nResult: ${found}/${total} enriched — by source: ${JSON.stringify(bySource)}`);

  const missed = [...pastPairs, ...upcomingPairs].filter(([, e]) => !e);
  if (missed.length) {
    console.log(`\nNot found (${missed.length}):`);
    missed.forEach(([ev]) => console.log(`  ✗ ${ev.title} (${ev.date})`));
  }
}

if (require.main === module) {
  main().catch(err => { console.error(`Fatal: ${err.message}`); process.exit(1); });
}

module.exports = { cacheKey, shouldFetch, makeEnrichment };
