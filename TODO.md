# Portfolio TODO

Track outstanding content, features, and fixes. Add new items under the relevant section.
Format: `- [ ] Description` for open, `- [x] Description _(done: Mon YYYY)_` for completed.

---

## Content — Resume

- [ ] **MathWorks work details** — Replace placeholder responsibilities/achievements in `resume.json` (`workExperience[0]`) with real work done at MathWorks (Feb 2023 – Present). The wizard framework is already captured under Projects; this should cover other day-to-day contributions, shipped features, and impact.
- [ ] **Update phone number** — `resume.json > personalInfo.phone` is a placeholder (`+1 (555) 123-4567`). Update with real number or remove the field.

---

## Content — Music Events

- [ ] **Past events backfill (up to Mar 2026)** — Real attended concerts/festivals up to March 26, 2026. Minimum per entry: `title`, `date`, `venue`, `location`, `type`, `rating`, `review`.
- [ ] **Fix `settings` binding in JSX** — `favoriteGenre` and `bestConcertEver` are hardcoded strings in `MusicEvents.js` instead of reading from `musicEvents.json > settings`.

---

## Features — Music Events

- [x] **Unified enrichment pipeline** _(done: Apr 2026)_ — `scripts/enrich-events.js` runs cache → Setlist.fm → Ticketmaster → manual fallback. Outputs `events-enriched.json` with venue, setlist, images, artist photos, and external links. Artist images sourced from Deezer (no key required) and propagated across events sharing the same headliner.
- [x] **Drop fake image collage** _(done: Apr 2026)_ — `MusicTimeline.js` now only renders real images from enrichment; collage is hidden when none exist.
- [x] **Chronological timeline + collapsible setlist** _(done: Apr 2026)_ — Timeline ordered oldest → newest; setlist renders as a numbered collapsible list with encore badges and a setlist.fm link.
- [ ] **Concert venue map** — Plot all attended concerts on an interactive map (react-simple-maps or Leaflet). Enriched venue data already has city/state/country. Clicking a pin shows the event card. High visual impact, unique to music fans.
- [ ] **Concert stats charts** — Year-by-year concert count, breakdown by city/type/rating. Use Recharts (already a likely dep or small install). Pairs well with the Stats.fm data already shown.
- [ ] **Flatten events to single array** — Merge `upcomingEvents` and `pastEvents` into one `events` array with an `attended: boolean` field. Simplifies adding new entries and moving upcoming → past.

---

## Features — Chess Section

- [ ] **Chess tab** — chess.com has a public API (no auth). Fetch current rating, recent game history, win/loss record. Add a "Chess" tab alongside Music. Authentic to your identity as a chess enthusiast and differentiates the portfolio significantly.
- [ ] **Automated chess stats** — Add a `scripts/fetch-chess-data.js` step in CI (same pattern as Stats.fm). Pulls and caches stats weekly; no API key needed.

---

## Features — Developer Personality

- [ ] **Keyboard navigation** — Press `1`–`6` to jump to tabs, `j`/`k` to move between them. Zero-setup, very dev-native UX that signals you think about keyboard users. Add a `?` tooltip or `⌨` hint in the nav.
- [ ] **Live deploy badge in footer** — Show last deploy timestamp + short git commit SHA. Data baked in at build time (`process.env.REACT_APP_DEPLOY_TIME`, `REACT_APP_COMMIT_SHA`). Subtle but signals that the site is a living CI/CD artifact.
- [ ] **"Now Playing" widget** — Stats.fm last-played endpoint already in use. Surface current/last track with album art as a small persistent widget (bottom corner or footer). Makes the site feel live.
- [ ] **Easter egg** — Konami code (↑↑↓↓←→←→BA) or a chess move sequence triggers something fun. Classic developer calling card.

---

## Features — Visual Polish

- [ ] **Smooth tab transitions** — CSS enter/exit animations (fade + slight slide) when switching tabs. React's `CSSTransition` or a simple `useEffect`-driven class toggle. High perceived quality improvement for minimal effort.
- [ ] **Interactive architecture diagram** — Replace the static Kroki SVG with a react-flow or D3 canvas where nodes are clickable, show detail panels, and edges animate on hover. Biggest technical showcase upgrade available.
- [ ] **Mobile responsiveness audit** — Walk through every tab on a 390px viewport. Timeline and architecture tabs likely have overflow issues.

---

## Features — Architecture Diagram

- [x] **Phase 1: Kroki-based diagram generation** _(done: Apr 2026)_ — `architecture.json` → Mermaid → Kroki.io → SVG committed to repo and served as a static asset.
- [ ] **Phase 2: Claude API diagram generation** — Replace deterministic Mermaid builder with a Claude API call. `architecture.json` becomes the prompt context; Claude produces the Mermaid code. `ANTHROPIC_API_KEY` as a repo secret.
- [ ] **Phase 3: MCP server wrapper (optional)** — Wrap diagram generation behind a lightweight MCP server (e.g., Cloudflare Worker). GitHub Action calls the MCP endpoint instead of Claude directly.

---

## Done

- [x] **Ticketmaster + Setlist.fm integration** _(done: Apr 2026)_
- [x] **Phase 1: Kroki-based diagram generation** _(done: Apr 2026)_
- [x] **Artist images via Deezer** _(done: Apr 2026)_
- [x] **Chronological timeline ordering** _(done: Apr 2026)_
- [x] **Collapsible setlist** _(done: Apr 2026)_
- [x] **Drop fake image collage** _(done: Apr 2026)_
