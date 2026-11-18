# Snapshot data contract, version 1

This contract is shared by CLI export, browser preview, deterministic rendering and automated GitHub collection. Never silently change its meaning.

## Minimal synthetic snapshot

~~~json
{
  "schema_version": "1",
  "source": "demo",
  "generated_at": "2026-11-16T00:00:00Z",
  "user": {"login": "sample-dev", "url": "https://github.com/example"},
  "repositories": [
    {"full_name": "sample-dev/aurora", "name": "aurora", "url": "https://github.com/example"}
  ],
  "activity": [
    {"id": "demo-1", "kind": "commit", "repo_full_name": "sample-dev/aurora",
     "occurred_at": "2026-11-01T10:00:00Z", "count": 1}
  ]
}
~~~

\`source: "demo"\` MUST display **SYNTHETIC DEMO** or equivalent in exported output. Synthetic values are not allowed to masquerade as real contributions.

## Real GitHub contribution snapshot

~~~json
{
  "schema_version": "1",
  "source": "github",
  "generated_at": "2026-11-17T08:00:00Z",
  "user": {"login": "example-user", "url": "https://github.com/example-user"},
  "repositories": [],
  "activity": [],
  "contribution_calendar": {
    "from": "2025-11-18",
    "to": "2026-11-17",
    "total_contributions": 2,
    "days": [
      {"date": "2026-11-16", "count": 2, "level": "FIRST_QUARTILE"},
      {"date": "2026-11-17", "count": 0, "level": "NONE"}
    ]
  },
  "coverage": {
    "calendar": "GitHub GraphQL contributionsCollection",
    "events": "Public REST events only, recent and incomplete"
  }
}
~~~

This is a **schema illustration**, not a claim that two days are enough for publication. The production collector refuses incomplete calendars (fewer than 300 valid days). The renderer can accept partially covered calendars but must mark the uncovered days as unknown.

## Required fields and validation

| Field | Type | Meaning |
| --- | --- | --- |
| \`schema_version\` | literal \`"1"\` | Contract version |
| \`source\` | \`"demo"\` or \`"github"\` | Provenance |
| \`generated_at\` | ISO 8601 UTC timestamp | All events after this instant are excluded |
| \`user.login\` | string | Account identity; validated strictly in the collector |
| \`user.url\` | HTTPS GitHub URL | Public provenance |
| \`repositories[]\` | up to 500 repo descriptors | Partial named repository sample |
| \`activity[]\` | up to 20,000 events | Recent or fixture event log, never a complete GitHub calendar |
| \`contribution_calendar\` | optional on \`github\` only | Authoritative date counts and GitHub levels |
| \`coverage\` | optional metadata | Data collection limitations |

Each \`repositories[]\` object has a unique \`full_name\` in \`owner/name\` form. \`name\`, \`url\`, \`language\`, \`stars\` are optional metadata; do not invent values.

Each \`activity[]\` entry has \`id\`, \`kind\`, \`repo_full_name\`, \`occurred_at\`, \`count\`, optional \`url\`. IDs must be unique; duplicates are discarded. \`count\` is a strictly positive integer. Allowed kinds:

- \`commit\`
- \`pr_opened\`
- \`pr_merged\`
- \`issue_opened\`
- \`release\`

A public push event may represent multiple commits. A merged PR is distinguished from an opened PR, and unsupported API events are skipped instead of labelled as commits. Event counts across kinds must **not** be called commit totals.

\`contribution_calendar.days[]\`: unique strict Gregorian UTC \`YYYY-MM-DD\` dates, non-negative integer \`count\`, and one of \`NONE\`, \`FIRST_QUARTILE\`, \`SECOND_QUARTILE\`, \`THIRD_QUARTILE\`, \`FOURTH_QUARTILE\`. A non-zero count cannot have a NONE level, and zero must have NONE. \`total_contributions\` equals the sum of supplied day counts.

## Provenance and coverage semantics

1. **GraphQL:** \`contributionsCollection.contributionCalendar\` is authoritative for GitHub-visible daily totals and quartile levels.
2. **Public REST:** \`/users/:login/events/public\` is limited in pagination and recency; event details may be absent for substantial periods and repositories. Never fill the calendar with fake zeros based on it.
3. **Visibility:** private contributions not visible to the authenticated workflow are absent. The calendar is accurate for **GitHub-visible** data in that context, not guaranteed to contain every private action.
4. **Dates:** the output grid has 53 full Sunday-to-Saturday weeks (371 cells); the GraphQL collector requests approximately 365 days. 0–6 earlier dates may therefore be **unknown**. Current-week future cells are also muted.
5. **Timeline:** \`revealDate\` is a purely visual cutoff, not a change in collected data.
6. **Repository landmarks:** at most five repositories based on *recent recorded event* units receive labelled motifs. They are not a ranking of all repos that contributed to the GitHub GraphQL totals.
7. **Raw files:** \`real-activity.json\` can expose an account login, publicly visible repository names, event dates and counts. Treat it as public output and check it before publishing.

## Backwards compatibility

Do not rename \`source\`, \`kind\`, \`occurred_at\`, \`count\`, \`contribution_calendar\` or quartile values without explicit schema versioning and reader updates. Preserve \`source: "github"\` snapshots without \`contribution_calendar\` as **partial event-log mode**, with honest labelling.

## Validation and tests

\`renderer.normalise()\` rejects invalid timestamps, counts, duplicate repos, inconsistent calendar levels and impossible dates. \`collect-github.cjs\` rejects incomplete GraphQL results and missing auth. Run \`npm test\` and ensure separate sparse, dense, empty and actual-source cases before release.
