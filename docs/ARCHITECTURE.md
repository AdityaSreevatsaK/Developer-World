# Developer World architecture

## Goals

Create a public, local-first, deterministic visual representation of a user's **GitHub-visible contributions**. Reuse the same calendar data in two original worlds, export standard self-contained SVG and animated GIF, and allow any GitHub account to supply its data without modifying implementation code.

Out of scope: authentication in the HTML browser, hosting a token-bearing API server, comprehensive year-long GitHub repository event retrieval, ranking people's productivity, modifying other GitHub repos, claiming a complete private contribution graph, publishing to npm by default.

## System map

~~~text
                       GitHub GraphQL contributionCalendar
                       (daily verified count + level)
                                      |
                    GITHUB_TOKEN -> collect-github.cjs
                                      |
                       public REST /users/:login/events
                       (partial recent repo/event decorations)
                                      |
                              real-activity.json
                                      |
            +-------------------------+-----------------------+
            |                         |                       |
      renderer.js                index.html              publish-real.cjs
      normalise()                local preview           verified real assets
      calendarFor()              local JSON/slider       previews/real-*.svg
      render()                   SVG -> canvas -> GIF    tests/browser-gif-smoke
            |                         |                       |
          export.cjs                 gif.js             previews/real-*.gif
          exports/*.svg
~~~

Everything beyond the collector is offline. The HTML preview reads local JSON served by \`server.cjs\`; it does not accept or send any GitHub credential.

## Source model

\`source="demo"\`: supplied synthetic events, stage from source-backed event units. Always show a prominent synthetic label.

\`source="github"\` with \`contribution_calendar\`: absolute GitHub-visible daily integer counts plus quartile level. These daily values drive tile intensity. \`activity[]\` is optional and is **not** a source for full contribution totals.

\`source="github"\` without \`contribution_calendar\`: historical event-log-only compatibility mode. All unobserved dates remain explicitly unverified.

The schema and validation rules live in [DATA_CONTRACT.md](DATA_CONTRACT.md).

## Core renderer

The renderer rejects malformed inputs, normalises repository and event arrays, sorts events chronologically (including ISO fractional seconds), deduplicates by event ID, and keeps rendering pure.

\`calendarFor(normalised, progress)\` builds exactly 371 day cells: 53 Sunday-to-Saturday weeks anchored to \`generated_at\` (UTC). Each cell has a fixed date and coordinate. Future dates are muted. GraphQL calendar values populate verified cells; days not returned by the API are marked \`unknown\`, not zero. Source event contributions are separately grouped by kind and repository to drive optional decorations.

\`render(snapshot, options)\` emits a self-contained SVG with a grid, month labels, weekday labels, legend, accessible per-day descriptions, world artwork, and up to five recent event-backed repository landmarks. Supported options include \`layout\`, \`theme\`, \`animated\`, \`progress\`, \`frame\`, \`revealDate\` and \`focusDate\`.

\`revealDate\` hides future chronological activity **for animation only**. The raw snapshot and official date counts are never overwritten, and the final frame equals the complete available view.

## Two world designs

**Archipelago:** each day is a small sea tile. Higher contribution stages create increasingly developed miniature islands, vegetation, workshops and banners. Repository markers are distinct from contribution totals.

**Village:** the same date geometry forms miniature plots whose built environment becomes a denser street/cottage/tower arrangement. It is an independent view, not just a recolour of the islands.

**Known design debt:** small, medium and large contributions currently share silhouettes too closely. Prioritise count legibility, strong shapes and brightness separation at profile scale.

## GIF pipeline

Browser event -> deterministic SVG frames -> \`Image\` of SVG Blob -> Canvas rasterisation (896×280) -> \`gif.js\` GIF89a encoder (RGB332 palette + LZW) -> local file download. No external fonts, scripts or service. This pipeline requires a graphical browser; Node CLI exports SVG. The trusted refresh workflow can run Chromium to produce a real GIF and commit it.

## HTTP boundary

\`server.cjs\` binds to \`127.0.0.1\`, serves only allowed file types, prevents traversal and dotfile requests, rejects unsupported HTTP methods, preserves only allowlisted preview query arguments and uses a restrictive Content Security Policy.

It is a **developer preview**, not a multi-user production application or general-purpose file server. Do not expose it publicly.

## CI and scheduled update separation

- **CI workflow:** every supported unit, CLI, local HTTP, output, and fake-data browser test. No GitHub token. Run on Windows and Linux.
- **Real refresh workflow:** authenticated GitHub GraphQL/REST, snapshot validation, SVG output, Chromium GIF, and scoped commit of only public data/assets. Explicit \`contents: write\`. Runs on the default branch, supports schedule and manual dispatch.

A contributor PR must never run the real refresh workflow in a privileged context.

## Invariants and cross-platform support

- All 371 positions exist; an unobserved date remains unknown.
- Each contribution count is taken directly from GitHub GraphQL and never substituted from recent public events.
- Event fixtures are synthetic and labelled.
- Rendered text/XML is escaped; URLs are validated.
- Identical snapshot/options produce identical SVG output.
- No npm install needed for local library execution. Node 22+; Windows PowerShell and Ubuntu Actions.

See [testing](TESTING.md) and [security](../SECURITY.md) before modifying this architecture.
