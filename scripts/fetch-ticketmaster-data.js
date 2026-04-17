const fs = require('fs');
const path = require('path');
const https = require('https');

const MUSIC_EVENTS_JSON = path.join(__dirname, '..', 'portfolio', 'src', 'data', 'musicEvents.json');
const OUTPUT_FILE = path.join(__dirname, '..', 'portfolio', 'public', 'data', 'events-enriched.json');
const BASE_URL = 'https://app.ticketmaster.com/discovery/v2/events.json';

function makeRequest(url) {
  return new Promise((resolve, reject) => {
    const req = https.request(url, { method: 'GET', headers: { 'Accept': 'application/json' } }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        if (res.statusCode >= 200 && res.statusCode < 300) {
          try { resolve(JSON.parse(data)); }
          catch (e) { reject(new Error(`Failed to parse JSON: ${e.message}`)); }
        } else {
          reject(new Error(`HTTP ${res.statusCode}: ${data.slice(0, 200)}`));
        }
      });
    });
    req.on('error', reject);
    req.setTimeout(30000, () => { req.destroy(); reject(new Error('Request timed out')); });
    req.end();
  });
}

// Search Ticketmaster for an event and return the best match or null
async function searchEvent(apiKey, event) {
  // Determine search keyword: prefer first artist, fall back to event title
  const keyword = (event.artists && event.artists[0]) || event.title;

  // Build date window: same day ±0 (exact date search)
  const date = new Date(event.date);
  const startDateTime = `${event.date}T00:00:00Z`;
  const nextDay = new Date(date);
  nextDay.setDate(nextDay.getDate() + 1);
  const endDateTime = nextDay.toISOString().split('T')[0] + 'T23:59:59Z';

  const params = new URLSearchParams({
    apikey: apiKey,
    keyword,
    startDateTime,
    endDateTime,
    size: 5,
    sort: 'relevance,desc'
  });

  const url = `${BASE_URL}?${params.toString()}`;
  console.log(`  Searching: "${keyword}" on ${event.date}...`);

  try {
    const data = await makeRequest(url);
    const events = data?._embedded?.events;

    if (!events || events.length === 0) {
      console.log(`  No results for "${keyword}" on ${event.date}`);
      return null;
    }

    // Pick the first result as best match
    const match = events[0];
    const venue = match._embedded?.venues?.[0];

    return {
      ticketmasterName: match.name,
      ticketUrl: match.url || null,
      images: selectImages(match.images),
      venue: venue ? {
        name: venue.name,
        city: venue.city?.name,
        country: venue.country?.name,
        address: venue.address?.line1
      } : null
    };
  } catch (err) {
    console.warn(`  Warning: Ticketmaster search failed for "${keyword}": ${err.message}`);
    return null;
  }
}

// Pick a small set of useful image sizes from the Ticketmaster images array
function selectImages(images) {
  if (!images || images.length === 0) return [];

  const preferred = ['16_9', '4_3', '3_2'];
  const selected = [];

  for (const ratio of preferred) {
    const match = images
      .filter(img => img.ratio === ratio && !img.fallback)
      .sort((a, b) => (b.width || 0) - (a.width || 0))[0];
    if (match) selected.push(match.url);
  }

  // Fall back to first image if nothing matched
  if (selected.length === 0 && images[0]) selected.push(images[0].url);
  return selected;
}

function ensureDir(filePath) {
  const dir = path.dirname(filePath);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
}

async function main() {
  const apiKey = process.env.TICKETMASTER_API_KEY;
  if (!apiKey) {
    console.error('Error: TICKETMASTER_API_KEY environment variable is required');
    process.exit(1);
  }

  console.log('Ticketmaster Event Enrichment');
  console.log('==============================');

  const musicEvents = JSON.parse(fs.readFileSync(MUSIC_EVENTS_JSON, 'utf8'));
  const upcomingEvents = musicEvents.upcomingEvents || [];

  if (upcomingEvents.length === 0) {
    console.log('No upcoming events to enrich.');
    ensureDir(OUTPUT_FILE);
    fs.writeFileSync(OUTPUT_FILE, JSON.stringify({ enrichedAt: new Date().toISOString(), events: [] }, null, 2));
    return;
  }

  console.log(`Enriching ${upcomingEvents.length} upcoming events...\n`);

  const enriched = [];
  for (const event of upcomingEvents) {
    console.log(`Event: ${event.title}`);
    const tmData = await searchEvent(apiKey, event);

    enriched.push({
      id: event.id,
      title: event.title,
      date: event.date,
      ticketmaster: tmData
    });

    // Respect API rate limits (5 req/s on free tier)
    await new Promise(resolve => setTimeout(resolve, 250));
  }

  const output = {
    enrichedAt: new Date().toISOString(),
    events: enriched
  };

  ensureDir(OUTPUT_FILE);
  fs.writeFileSync(OUTPUT_FILE, JSON.stringify(output, null, 2));
  console.log(`\n✓ Saved enriched data for ${enriched.length} events to: ${OUTPUT_FILE}`);

  const matched = enriched.filter(e => e.ticketmaster !== null).length;
  console.log(`✓ Ticketmaster matches: ${matched}/${enriched.length}`);
}

if (require.main === module) {
  main().catch(err => {
    console.error(`\nFatal error: ${err.message}`);
    process.exit(1);
  });
}

module.exports = { searchEvent, selectImages };
