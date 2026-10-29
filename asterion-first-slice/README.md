# Asterion: Living Labyrinth, first playable slice

**Status:** Prototype, not the existing full game and not a replacement for it. The full-game files remain untouched.

## Included

- An HTML page that runs on mobile browsers and desktop without external assets, libraries, or connectivity after loading.
- Asterion can act on one of three opening approaches, then make a second consequential choice. This slice contains eight tested two-action routes.
- Choice-dependent, real elapsed-time departures (30 seconds to 5 minutes in this slice, never above the planned 30-minute cap).
- Absolute return deadlines saved locally; reopening the page completes overdue returns once, without changing the original deadline.
- A reactive labyrinth background that reflects the current environment and persists through reloads.
- Optional Daedalus/origin questions, never forced into the plot.
- Separate isolated localStorage key, so this does not overwrite saves from the full game.

## Test / development

Run `node test.js`. It checks timing boundaries, idempotent return, separate outcomes, world state consistency, and optional lore. A mobile Chromium smoke test was performed at 320×568, 390×844, and 430×932 with zero page errors. Physical iPhone Safari testing is outstanding.

For QA only, append `?qa=1` to the browser URL. This shows a **TEST ONLY: SIMULATE RETURN** button so testers can check all branches without actually waiting. Normal play has no skip control.

This is a *foundation*, not a complete narrative expansion. Remaining work: integrate with existing full-game Asterion engine, broaden path depth, maintain chapter-spanning memory/world map, connect the full environmental effects, native/mobile notification delivery where available, and conduct editorial continuity review.