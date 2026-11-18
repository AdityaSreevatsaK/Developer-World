# Tests, verification and visual quality gates

## Test policy

**No external calls, tokens or paid services** in normal tests. All ordinary unit and integration checks use synthetic or controlled mock data. A separate trusted refresh job tests real GraphQL collection and generated account outputs.

### On every change

~~~sh
npm test
npm run export
node tests/verify-exports.cjs
~~~

Requires Node.js 22+. Standard library only. The npm test command covers snapshot validation, 53×7 date placement, event semantics, real-calendar fidelity, source provenance, deterministic art, SVG escaping, GIF89a encoding, CLI export and loopback HTTP restrictions.

### Chromium browser smoke

On an Ubuntu system with headless Chrome/Chromium installed:

~~~sh
node tests/browser-gif-smoke.cjs
~~~

This opens the **synthetic showcase** in an isolated temporary Chrome profile, checks 371 date cells, verifies the expected activity, clicks the real GIF export button, inspects the GIF89a header/size/frame count and saves a test GIF under \`exports/\`. No GitHub token.

For an authenticated, freshly collected snapshot:

~~~sh
DW_SAMPLE=real node tests/browser-gif-smoke.cjs
~~~

Use this only in a trusted local/refresh context. The test expects a valid real snapshot in \`real-activity.json\`.

### GitHub Actions

\`ci.yml\` tests on Windows and Ubuntu with Node 22, exports eight sample SVGs and verifies content/provenance. Ubuntu additionally captures actual browser screenshots and runs the GIF browser smoke, uploading the generated outputs as short-lived artifacts.

\`refresh.yml\` validates the real source and reruns the real-browser GIF smoke on the protected default branch, then commits only generated public data/images.

## Fixtures

- \`fixtures/demo-activity.json\`: five invented repositories, 10 synthetic events, 20 synthetic event units.
- \`showcase-activity.json\`: deterministic denser art fixture for calendar readability, explicitly synthetic.
- \`real-activity.json\`: a generated public maintainer snapshot. Never use it as evidence that an arbitrary contributor's account behaves identically.

When adding tests, create clearly labelled synthetic fixture data or mock fetch responses. A real network call in \`npm test\` is a regression. Do not assert fixed totals from the maintainer's live account; those will naturally change.

## Required scenarios

- Empty repo and zero contribution days; one repository; more than five repositories and overflow.
- Multiple counts on one date; duplicate event IDs; inconsistent calendar sum; impossible Gregorian dates.
- Real GitHub \`NONE\` and FIRST/SECOND/THIRD/FOURTH_QUARTILE levels.
- Current-week future cells; 365-day API coverage inside a 371-slot visual grid; known/unknown dates.
- UTC and fractional-second ordering; events after \`generated_at\`.
- Dirty SVG names, invalid URLs, hostile JSON fields, invalid progress/reveal date.
- Both worlds, both themes, static/reduced-motion fallbacks, responsive sizing.
- Chrome-generated 16-frame GIF with valid header and frame count, independent LZW codec test.
- CLI and server never read \`.git/\`, \`.env\` or arbitrary paths; browser never sends GitHub credentials.

## Manual visual acceptance

At minimum inspect **two layouts × two themes × full-size and 50% README width**, plus one mobile-width screenshot. Low and high activity levels must be distinguishable *without relying solely on colour*. Audit contrast on dark/light backgrounds. Day labels must not be clipped; the latest day and long repository names must remain interpretable. Verify animated GIF and still SVG on GitHub's proxied rendering, not solely direct/raw SVG previews.

## CI failure policy

Treat a failing job as real until diagnosed. Preserve the generated artefacts and log excerpts where possible, fix the cause, and rerun. Do not silence a failing assertion or replace real data with synthetic data to make a workflow green. Declare browser or platform skips explicitly; do not report unrun tests as passed.

## Release checklist

- All tests green on both target OSs.
- Real-account collection succeeds without leaked secrets.
- GIF and SVG viewed through GitHub's rendered README, including still fallback.
- User documentation, AGENTS instructions and provenance still accurate.
- MIT licence and third-party code review complete.
- No user credentials, .env files, private repo names or unapproved tracking.
- Count-contrast bug fixed and reviewed at narrow profile scale.
