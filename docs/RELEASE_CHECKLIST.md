# Release readiness checklist

Developer World is **public early-access source**, not yet a production-tagged release. Use this checklist before deciding to tag a version, publish npm packages, distribute a GitHub Action or install it on a public profile.

## Technical health

- [ ] All Node 22 Windows and Ubuntu CI jobs pass from a fresh checkout.
- [ ] SVG CLI outputs validated, reproducible, correct profile dimensions and provenance.
- [ ] Headless Chromium real-account GIF export passes and produces a valid 16-frame GIF89a file.
- [ ] The demo and real-data render paths never substitute for each other when API calls fail.
- [ ] GitHub account is configurable on the command line and in a fork's GitHub Actions variable.
- [ ] Refresh can safely write only the expected snapshot and generated files.
- [ ] Scheduled workflow does not recurse, leak credentials or modify other repositories.
- [ ] No npm runtime dependency needs an unreviewed licence or security exception.

## Visual quality

- [ ] Clear visual distinction at 0/1/2/3/4 activity levels at full, 50% and mobile widths.
- [ ] Both world layouts appear clearly distinct and retain all 371 chronological date slots.
- [ ] Light/dark palettes are readable with adequate contrast.
- [ ] Repository legends do not overflow on representative long names.
- [ ] SVG and animated GIF displayed through GitHub's README image proxy.
- [ ] Motion-free alternate image present and discoverable.
- [ ] Screenshot comparison with genuine real account and both labelled synthetic fixtures.

## Data integrity and privacy

- [ ] GraphQL contribution counts and GitHub levels preserved as received.
- [ ] Partial REST public events never claimed to be full history or official contribution totals.
- [ ] Generated account login, UTC timestamp and coverage clearly disclosed.
- [ ] Hidden dates/unknown contribution periods not displayed as proven zeros.
- [ ] No private repo metadata, authorisation token, token-like string, browser cookie or private dataset committed.
- [ ] Data from different users cannot be merged into a single unlabelled account calendar.

## Open-source documentation and contributor workflow

- [ ] Root README follows a clean Windows/Linux quick start and a real-account generation example.
- [ ] \`AGENTS.md\`, \`CONTRIBUTING.md\`, \`CODE_OF_CONDUCT.md\`, \`SECURITY.md\`, MIT licence and docs remain consistent.
- [ ] PR and issue templates are usable for new contributors.
- [ ] A second account/fork can refresh without hard-coded maintainer names.
- [ ] Known limitations and unsolved visual defects tracked with issues.
- [ ] Changelog updated and semver/compatibility decision recorded.
- [ ] No release or live GitHub profile update performed without maintainer approval.

## Rollback

If a source collector change breaks public previews, restore the last verified snapshot, regenerate from the matching renderer, and disable the scheduled refresh until the failure is diagnosed. Do **not** replace actual data with a synthetic fixture or silently alter source provenance.
