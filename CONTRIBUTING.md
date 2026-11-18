# Contributing to Developer World

Thanks for helping improve this small open-source project. Contributions are welcome across SVG art, rendering, data correctness, accessibility, documentation, tests and onboarding.

## Start here

Read [README](README.md), [Agent instructions](AGENTS.md), [Architecture](docs/ARCHITECTURE.md), [Data contract](docs/DATA_CONTRACT.md), [Testing](docs/TESTING.md), [Security](SECURITY.md), [Roadmap](docs/ROADMAP.md) and [Code of conduct](CODE_OF_CONDUCT.md).

This is a public source project in early access. We have not declared a stable API or a versioned production release. Avoid introducing breaking changes without documenting a migration.

## Local setup

You need Git, Node.js 22+ and any modern browser. There are no mandatory npm package installations.

~~~sh
git clone https://github.com/AdityaSreevatsaK/Developer-World.git
cd Developer-World
npm test
npm run preview
~~~

Visit http://127.0.0.1:8787. For SVG exports run \`npm run export\`. To test Chromium GIF generation, have Chrome/Chromium installed and run \`node tests/browser-gif-smoke.cjs\`. No token is needed for normal development.

## How to contribute

1. Search open Issues for duplicates, existing design discussion or decisions.
2. For significant architecture/API changes, file a short proposal first. For focused fixes, a PR is fine.
3. Fork and branch with a descriptive name such as \`fix/intensity-contrast\` or \`docs/fork-setup\`.
4. Keep PRs focused and include tests or screenshots that prove the change.
5. Run \`npm test\` and relevant exports locally, then check the Windows/Linux CI.
6. Open a PR against \`master\`. Explain provenance impact, any changed data semantics, browser/README verification, and remaining risks.
7. Respond to reviews constructively. Maintainers may adjust scope or request alternatives.

## Visual contributions

Artwork is **original and procedurally generated**. Maintain the recognisable contribution grid in both layouts. Every visible structure must map to real source-backed daily counts or be clearly non-data atmospheric decoration. Provide comparison images at full resolution and approximately 50% GitHub profile width, across dark/light and both layouts. Respect reduced motion and non-colour differentiation of levels.

**Open issue:** Low and high contributions currently look too similar. Improving meaningful silhouette contrast is a priority. Do not add decorative objects that imply events that never happened.

## Data correctness

- The verified GraphQL \`contributionCalendar\` governs real daily totals and quartile levels.
- Public REST events are partial decorations, not the full GitHub history or a substitute for GraphQL counts.
- Keep the source \`demo\` or \`github\` label accurate.
- Do not forge GitHub contribution events, infer missing day values, or merge opened PRs with merged PRs.
- Handle UTC cut-offs, duplicates, missing/long names, invalid dates, empty calendars and overflow.
- Reject malformed untrusted inputs, escape SVG content and validate any external URLs.

## Security and licensing

Never commit \`GITHUB_TOKEN\`, \`GH_TOKEN\`, \`.env\` files, private repository names or credential-containing logs. Do not add fetch calls to browser code that send tokens anywhere. Report sensitive issues using the [Security policy](SECURITY.md), not a public issue.

All new source and generated artwork should be original or have clear licence documentation compatible with MIT. Do not paste closed-source or copyright-protected code/assets. Contributors agree their contributions will be distributed under the project's MIT licence.

## Tests expected

- Renderer changes: tests for matching real count and level semantics, both worlds, weird inputs, deterministic output and output dimensions.
- Collector changes: mock GraphQL/REST tests, authentication failure, incomplete coverage, distinct event kinds and no secret exposure.
- Browser changes: event/date inspection and, where applicable, Chromium GIF smoke.
- Security changes: regression test for the vulnerable input or endpoint.
- Documentation: validate all paths/commands from a clean root checkout.

CI must remain fixture-only for untrusted PRs; do not request write tokens for external contributors.

## PR checklist

- [ ] Scope and user-visible impact described
- [ ] \`npm test\` passed or clear explanation provided
- [ ] Relevant SVG/GIF or browser images reviewed if visual
- [ ] Source provenance and GraphQL/REST distinction preserved
- [ ] README/AGENTS/docs updated for altered workflow or contract
- [ ] No credentials or private data committed
- [ ] Windows considerations and accessibility checked
- [ ] Remaining limitations clearly stated

There is no requirement to mention AI usage in PRs; authors are accountable for the accuracy and licence of submitted changes.
