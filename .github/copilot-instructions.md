# AI coding assistance: Developer World

**Mandatory:** read [\`AGENTS.md\`](../AGENTS.md) and [\`docs/AGENT_HANDOVER.md\`](../docs/AGENT_HANDOVER.md) before writing or reviewing code. They contain the canonical operating requirements and up-to-date priorities.

## Scope

This is the canonical public \`AdityaSreevatsaK/Developer-World\` repository. Do not edit the older \`GitHub-Activity-Studio\` project, unrelated experiments, or anyone's GitHub profile without explicit instructions.

## Source fidelity

Use GitHub's **GraphQL contributionCalendar** for real daily contributions and GitHub's quartile levels. **Never** create a year-long calendar from the partial \`/users/:login/events/public\` REST feed, and never add REST event counts to GraphQL totals. Do not guess unknown dates, fabricate commits or rename event types. Explicit demo data must always be labelled synthetic.

## Maintainability

- Renderer: \`renderer.js\`, pure and deterministic.
- Collector: \`collect-github.cjs\`, authenticated, source-backstopped and token-safe.
- Browser: \`index.html\` + \`gif.js\`, local-only with no credential storage.
- Generated real assets: \`real-activity.json\` and \`previews/real-*\`.
- Public automation: \`.github/workflows/ci.yml\` (read-only fixture tests) and \`refresh.yml\` (trusted generated assets, scoped write).
- Node 22+, no mandatory npm dependencies, Windows PowerShell friendly.

## Visual acceptance

The major outstanding problem is weak visible separation between low- and high-contribution days. Keep the 53×7 date grid and both archipelago/village, light/dark and motion-free alternatives. Make intensity obviously legible at half-size GitHub README width. Do not imply an event occurred merely because a tile has decorative objects.

## Before completion

Run \`npm test\`, \`npm run export\`, \`node tests/verify-exports.cjs\`, and the relevant Chrome smoke test. Inspect the real screenshots or GIF in GitHub. Report the actual verification outcomes and limitations, never unrun tests. Keep source documentation and the data contract consistent.
