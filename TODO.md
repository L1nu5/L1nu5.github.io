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

## Done

<!-- Move completed items here with done date -->

