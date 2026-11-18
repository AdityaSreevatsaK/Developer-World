# AI-agent handover, maintenance and outstanding work

## Canonical location

- Repository: https://github.com/AdityaSreevatsaK/Developer-World
- Default branch: \`master\`
- Public, standalone, MIT-licensed project.
- Previous prototype: https://github.com/AdityaSreevatsaK/GitHub-Activity-Studio, branch \`concept/developer-world\`, draft PR #2. Only Developer World was migrated. The other Studio concepts remain outside this repository.
- Maintainer example username: \`AdityaSreevatsaK\`. **Do not bake it into project logic.**
- Source data: \`real-activity.json\` (real/public), \`fixtures/demo-activity.json\` and \`showcase-activity.json\` (synthetic).

## Product scope

One GitHub account, a year-long visible contribution calendar, two original wide miniature-world visualisations, dark/light palettes, dated and event-informed landmark growth, local browser preview, SVG and animated GIF outputs. No paid service, mandatory install, private account scraping, or GitHub profile modification.

## Current implementation

\`renderer.js\`: self-contained rendering, UTC bucketing, strict snapshot normalisation and GitHub GraphQL quartile interpretation, visual history cutoff, deterministic anchors. Output size 1120×350 SVG.

\`collect-github.cjs\`: GitHub GraphQL visible contribution calendar and optional partial public REST event log. Must be provided a username and token; the repo owner is used as the default in GitHub Actions, not as a hard-coded universal user.

\`publish-real.cjs\`: source validation plus five SVG outputs, with optional account mismatch rejection.

\`index.html\`: local date inspector, scene switches, upload, moving timeline, GIF export.

\`gif.js\`: dependency-free GIF89a encoding with limited RGB332 palette, LZW and animation loop.

\`server.cjs\`: loopback-only preview.

\`.github/workflows/ci.yml\`: cross-platform offline and Chromium tests. \`.github/workflows/refresh.yml\`: actual account GraphQL plus browser GIF, scoped commit, daily and manual trigger.

## Near-term roadmap, in order

1. **Visual fidelity issue (user-reported):** low- and high-numbered contributions look similar. Dramatically separate size, density, height, texture and lighting across GitHub's official levels. Preserve real counts, map exact counts to optional within-tier details, and use contrast beyond colour. Validate both layouts and GitHub README width.
2. **Cross-account validation:** test real refresh in a second public fork with a different username, confirm no maintenance account assumptions survive.
3. **Profile embedding:** render SVG and GIF in an actual GitHub README, verify GitHub's image proxy and motion-free accessibility fallback. Test mobile.
4. **Refresh operational hardening:** daily schedule, write-permission guidance, skip unchanged files where reasonable, GitHub API quotas and failure reporting.
5. **Release:** review code/security/licences, changelog, version tag and optional GitHub Marketplace or composite Action only after explicit product decision.

## Rules for the next agent

- Read root \`AGENTS.md\`, \`docs/ARCHITECTURE.md\`, \`docs/DATA_CONTRACT.md\`, \`docs/AUTOMATION.md\` and \`SECURITY.md\`.
- Never replace authentic data with invented fixture values. Never add public REST event counts to GraphQL totals.
- Never copy Studio's unrelated concepts or cross-edit its PR/branches unless explicitly asked.
- Ensure the project works at repo root with \`npm test\`, \`npm run preview\`, \`npm run export\`, \`npm run collect-real -- --login ...\`, and \`npm run publish-real -- --login ...\`.
- Never commit secrets, private repository metadata or tokens; do not remove provenance labels.
- Verify dates, source classifications, browser fallback and account identity before claiming completion.
- Use actual GitHub PR/CI checks, not only local syntax checks. Record tests executed and limitations.
- **Do not edit \`AdityaSreevatsaK/AdityaSreevatsaK\` or publish an npm package/release without explicit approval.**

## Verification commands

~~~sh
npm test
npm run export
node tests/verify-exports.cjs
npm run preview
~~~

For real data (requires token in local environment):

~~~sh
node collect-github.cjs --login YOUR_USERNAME
node publish-real.cjs --login YOUR_USERNAME
DW_SAMPLE=real node tests/browser-gif-smoke.cjs
~~~

## Definition of done for public readiness

A clean default branch that any user can clone, good public README, original and licensed art/code, complete agent and human documentation, reproducible tests, real maintainer examples, configurable account collection, safe CI/refresh, and verified hosted GitHub image rendering. The high/low intensity redesign is deliberately **still pending** until implemented and reviewed.

**Avoid false assertions:** The repo being public does not imply it has a release. Committed GIFs do not imply GitHub proxies preserve CSS-based SVG motion. A 365-day GitHub contribution count never proves all private activities were accessible.
