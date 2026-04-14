# Portfolio TODO

Track outstanding content, features, and fixes. Add new items under the relevant section.
Format: `- [ ] Description` for open, `- [x] Description _(done: Mon YYYY)_` for completed.

---

## Content — Resume

- [ ] **MathWorks work details** — Replace placeholder responsibilities/achievements in `resume.json` (`workExperience[0]`) with real work done at MathWorks (Feb 2023 – Present). The wizard framework is already captured under Projects; this should cover other day-to-day contributions, shipped features, and impact.

---

## Content — Music Events

- [ ] **Past events backfill (up to Mar 2026)** — `musicEvents.json` currently has dummy past events only. Replace with real attended concerts/festivals up to March 26, 2026. For each event, minimum needed: `title`, `date`, `venue`, `location`, `type`, `rating`, `review`. Optional: `highlights`, `setlistId` (from setlist.fm).

---

## Features — Music Events

- [ ] **Setlist.fm integration** — Script + GitHub Actions step to auto-enrich past events that have a `setlistId` with venue details and setlist (songs played). API key stored as `SETLIST_FM_API_KEY` GitHub secret. See conversation notes for design: build-time fetch, never exposed to browser.
- [ ] **Flatten events to single array** — Merge `upcomingEvents` and `pastEvents` into one `events` array with an `attended: boolean` field. Simplifies adding new entries and moving upcoming → past.
- [ ] **Drop fake image collage** — `images` array in past events is rendered as placeholder emoji, not real images. Either wire up real image URLs or remove the collage component from `MusicTimeline.js`.
- [ ] **Fix `settings` binding in JSX** — `favoriteGenre` and `bestConcertEver` are hardcoded strings in `MusicEvents.js` instead of reading from `musicEvents.json > settings`. Fix the component to consume the JSON values.

---

## Content — General

- [ ] **Update phone number** — `resume.json > personalInfo.phone` is a placeholder (`+1 (555) 123-4567`). Update with real number or remove the field.

---

## Features — Architecture Diagram

- [x] **Phase 1: Kroki-based diagram generation** _(done: Apr 2026)_ — `architecture.json` defines all nodes, edges, layers and secrets. `scripts/generate-diagram.js` converts it to Mermaid syntax and POSTs to the free Kroki.io render API. GitHub Actions runs the script on every push, writes the SVG to `portfolio/public/images/architecture.svg`, and includes it in the React build. No API key required. New "Architecture" tab in the portfolio displays the diagram alongside feature highlights and the security model.
- [ ] **Phase 2: Claude API diagram generation** — Replace deterministic Mermaid builder in `generate-diagram.js` with a Claude API call. `architecture.json` becomes the prompt context; Claude produces the Mermaid code. `ANTHROPIC_API_KEY` stored as GitHub secret — same security pattern as Stats.fm. Adds an AI-augmented CI/CD story to the portfolio.
- [ ] **Phase 3: MCP server wrapper (optional)** — Wrap diagram generation behind a lightweight MCP server (e.g., Cloudflare Worker). GitHub Action calls the MCP server instead of Claude directly. Adds infrastructure showcase; requires hosting and maintenance.

---

## Done

<!-- Move completed items here with done date -->

