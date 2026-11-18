# Account collection and GitHub Actions automation

Developer World can collect, render and publish a user's **GitHub-visible contribution calendar** without a server or paid API. This document describes the two workflows, credentials, fork setup, schedule, troubleshooting and non-goals.

## Workflows

| Workflow | Trigger | Token | Writes |
| --- | --- | --- | --- |
| \`ci.yml\` | Pull request, push, manual | None | No repository writes; may upload ephemeral test artifacts |
| \`refresh.yml\` | Daily schedule, manual dispatch, initial source/config push | GitHub-provided token | Only \`real-activity.json\` and \`previews/real-*\` on the default branch |

**Security boundary:** CI never runs untrusted PR code with a write token. The refresh job runs only from the trusted default branch and uses the built-in \`GITHUB_TOKEN\` with \`contents: write\`.

## 1. Using a fork

1. Fork https://github.com/AdityaSreevatsaK/Developer-World.
2. Confirm your fork's default branch is the one containing \`.github/workflows/refresh.yml\` (currently \`master\`).
3. In the fork's **Settings → Actions → General**, enable Actions and make sure the default workflow token can write repository contents, subject to the fork owner's policies.
4. The workflow uses \`github.repository_owner\` by default. To render another public username, add **Settings → Secrets and variables → Actions → Variables**: \`DEVELOPER_WORLD_USERNAME\` = \`the-user\`. Do **not** create a token variable.
5. Run **Actions → Refresh real contribution previews → Run workflow**, using the default branch. An optional \`username\` dispatch input overrides the variable.
6. Check the job logs and inspect \`real-activity.json\`, \`previews/real-archipelago-dark.svg\`, \`previews/real-village-light.svg\` and \`previews/real-archipelago.gif\`.
7. Add a link to a specific exported image from your fork to your profile README only if you choose to publish it.

The workflow commits generated public source-backed assets to the same repository. A GitHub workflow-triggered push by \`GITHUB_TOKEN\` does not normally start an endless second workflow run. There is also concurrency control to prevent conflicting refresh commits.

## 2. Authentication and visibility

GitHub GraphQL requires authentication; the workflow uses \`secrets.GITHUB_TOKEN\`. In a local shell, set \`GITHUB_TOKEN\` or \`GH_TOKEN\` as an environment variable (not a source file). The token is used only by \`collect-github.cjs\`, is never written to the snapshot, and must not appear in logs. The local browser never asks for or sends tokens.

The collector requests \`user(login).contributionsCollection(from, to).contributionCalendar\`; the result contains GitHub-visible date/count/level records. Visibility depends on the API token and account's privacy settings. Do not claim to include private activity by default.

It also requests up to 3 pages × 100 public recent REST events to decorate top repositories. This data is incomplete by design and **not** an alternate source for contribution totals. If REST events fail, retain the verified GraphQL calendar and report the warning; if GraphQL fails or is implausibly short, fail closed instead of publishing fake data.

## 3. Scheduled refreshing

\`refresh.yml\` schedules a daily UTC refresh. Scheduled jobs can be delayed by GitHub and may be disabled on new forks or inactive public repositories; manual \`workflow_dispatch\` is the fallback. The workflow is intentionally not a perpetual server or a real-time subscription.

Do not schedule every few minutes; this creates unnecessary commits, may hit rate limits and offers little benefit to annual calendar artwork.

## 4. Output files

The refresh action generates:

- \`real-activity.json\`: real snapshot, user, UTC generated date, verified contribution days, partial public event log and source coverage.
- \`previews/real-archipelago-dark.svg\`
- \`previews/real-archipelago-light.svg\`
- \`previews/real-archipelago-still.svg\`
- \`previews/real-village-dark.svg\`
- \`previews/real-village-light.svg\`
- \`previews/real-archipelago.gif\` generated and checked through headless Chromium.

It stages **only** these account-specific files. Code, tests, fixtures and other previews cannot be overwritten by a refresh.

## 5. Local Windows PowerShell

~~~powershell
$env:GITHUB_TOKEN = "YOUR_GITHUB_TOKEN"
node collect-github.cjs --login YOUR_USERNAME
node publish-real.cjs --login YOUR_USERNAME
npm run preview
~~~

After using the token, close the PowerShell session or run \`Remove-Item Env:GITHUB_TOKEN\` to clear that variable in the current session. Do not paste token-containing terminal logs into issues or chats.

## 6. Operational failures

| Symptom | Meaning | What to do |
| --- | --- | --- |
| GraphQL 401/403 | No auth / token or account scope problem | Check built-in token and Actions permissions; never commit the token |
| No user / insufficient calendar dates | Wrong username or unavailable calendar | Check username; leave old verified outputs intact |
| \`Resource not accessible by integration\` on push | Workflow \`contents: write\` disallowed by repository policy | Enable workflow write permissions in repository settings or use a local/manual export |
| Browser test times out | Headless Chrome failure | Inspect step logs; verify Chromium availability; use SVG fallback |
| Daily schedule did not start | Schedule disabled/delayed | Run manual workflow; GitHub schedule is best-effort |
| Images show the wrong person | \`username\` input/variable not configured as intended | Correct username and rerun; check \`user.login\` before publishing |
| Demo label appears in a real image | Provenance regression | Stop publishing, fix renderer and test, regenerate verified outputs |
| REST event log is sparse | Normal REST coverage limitation | Do not invent missing events; GraphQL calendar still authoritative |

## 7. Release and fork considerations

The example images in this repository show the maintainer's GitHub-visible data. Forking does not automatically replace them until a successful refresh run. GitHub profile READMEs cannot embed the interactive HTML app; use the generated GIF or static SVG. CSS-based SVG animations may be filtered by GitHub, so keep a motion-free alternative.

Do not add deployment, package publication, secrets access, unrestricted PR execution or cross-repository pushes without a separate design and threat-model review.
