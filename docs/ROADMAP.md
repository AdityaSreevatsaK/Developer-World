# Product roadmap and development decisions

## Vision

A distinctive open-source alternative to generic GitHub statistic cards. Users can enter a GitHub username, fetch authentic GitHub-visible contribution counts, choose an original miniature world and embed a genuinely animated or still wide result into a profile README.

## Current working baseline

- GitHub 53×7 UTC grid, archipelago and village.
- Original procedural SVG scenery, dark/light palettes and a motion-free SVG.
- GraphQL contribution calendar as the source for real daily totals and quartile levels.
- Partial recent public REST events for repository markers and optional motifs.
- Local HTML preview with timeline/date inspection, JSON upload, SVG and GIF exports.
- Headless Chromium real-account GIF generation.
- Windows and Ubuntu test support; Node 22+, no runtime npm dependencies.
- Public, standalone codebase with reusable account configuration and GitHub Actions refresh.

**Do not confuse a public repository with a completed production release.**

## P0: visual intensity (user-reported)

The primary open issue is that days with low versus high contribution counts look too alike. The solution should be an unmistakable progression of silhouette and mass, not only a slight colour change:

| GitHub tier | Archipelago direction | Village direction |
| --- | --- | --- |
| NONE | Empty water with small quiet texture | Empty undeveloped plot |
| FIRST_QUARTILE | Deliberately tiny sandbar/sprout | Small garden or shed |
| SECOND_QUARTILE | Compact island, vegetation and low shelter | Single cottage |
| THIRD_QUARTILE | Large developed island + workshop/dock | Multi-storey workshop or row of buildings |
| FOURTH_QUARTILE | Tower/banner/major development, strong light and multi-object structure | Civic-sized hall or tower with distinct footprint |

Use exact real-day counts only for subtle **within-tier** detail. The official contribution quartiles remain the main ranking: never assert that a certain number is universally level 4 for every account. Validate at approximately 50% displayed width and with non-colour cues.

## P1: public user experience

- Readable first-run tutorial, clear real vs synthetic source choice.
- Helpful messages for unset tokens, invalid usernames, inaccessible GraphQL or incomplete coverage.
- Cross-account fork test and no hard-coded maintainer identity in logic.
- Viewport/contrast, keyboard controls, larger device/browser matrix and reduced-motion GIF pairing.
- Optional user-friendly CLI wrapper or composite Action if real demand exists.

## P2: release engineering

- Full security review and provenance audit.
- GitHub README image proxy verification for SVG/GIF.
- Consistent versioning, change notes, release checklist, checksum or reproducibility note.
- Action permissions, schedule and API rate limit robustness.
- Decide whether to distribute GitHub Action and/or npm CLI; neither is currently published.

## Deliberately out of scope

- Paid API services, hosted accounts, login system or database.
- Guessing complete year-long repository events from REST activity pagination.
- AI-generated invented achievements or productivity scores.
- Collecting private repository names or logs without explicit review.
- Other GitHub Activity Studio concepts.
- Automatically editing a user's personal GitHub profile README.

## Review process

Propose focused PRs with before/after screenshots at real profile scale, provenance notes, tests run and a backout plan. Keep low/high visual contrast changes separate from GraphQL collector changes to simplify debugging and acceptance.
