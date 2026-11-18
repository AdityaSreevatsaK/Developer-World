# User guide: generate a Developer World for any GitHub account

Developer World turns a verified GitHub-visible 365-day contribution calendar into two alternatives: a miniature **archipelago** and **village**. The same date always occupies the same position.

## Requirements

- Windows, macOS or Linux
- Git
- Node.js 22 or later
- A browser for the preview; Chrome/Chromium only for GIF export/testing
- A GitHub token for **collecting new data**, not for offline rendering

## 1. Clone and open

~~~powershell
git clone https://github.com/AdityaSreevatsaK/Developer-World.git
cd Developer-World
npm test
npm run preview
~~~

Open http://127.0.0.1:8787/. The first-run preview displays the **published public maintainer snapshot**, not the visitor's GitHub account. Choose the fake sparse/dense datasets to compare artwork without a token. Do not interpret the synthetic screenshots as actual GitHub activity.

## 2. Use your own username locally

GitHub GraphQL requires an authenticated token. Make a token with the minimum read-only permissions needed for the public profile data your account exposes; avoid unnecessarily broad scopes. Store it in an environment variable, never in the repository.

On Windows PowerShell:

~~~powershell
$env:GITHUB_TOKEN = "YOUR_GITHUB_TOKEN"
node collect-github.cjs --login YOUR_USERNAME
node publish-real.cjs --login YOUR_USERNAME
npm run preview
~~~

On macOS/Linux:

~~~sh
export GITHUB_TOKEN=YOUR_GITHUB_TOKEN
node collect-github.cjs --login YOUR_USERNAME
node publish-real.cjs --login YOUR_USERNAME
npm run preview
~~~

If GraphQL cannot return the calendar, the collector fails rather than silently substituting synthetic history. If the public REST event feed is incomplete, the core GraphQL day counts remain valid while repository decorations may be sparse.

The collector writes \`real-activity.json\`, and the publisher writes five real-account SVGs to \`previews/\`. The browser loads the local real snapshot by default. Always check the username and coverage before putting generated files into a public repository.

## 3. Export options

~~~sh
npm run export
node export.cjs --input real-activity.json --layout archipelago --theme dark
node export.cjs --input real-activity.json --layout village --theme light --still
node export.cjs --input fixtures/demo-activity.json --out exports --progress 4
~~~

The CLI exports deterministic self-contained SVGs. It does not require network access and does not currently render GIFs itself.

Use the browser's **Download animated GIF** button for an on-demand GIF, or allow the trusted GitHub Actions refresh workflow to create one using headless Chromium. The completed scene is held for **10 seconds** on every loop, allowing viewers to read the final world instead of watching it immediately reset to an empty chart.

## 4. Controls

- **World:** Archipelago or Village.
- **Palette:** Daybreak or Moonlit.
- **Activity dataset:** Real public GitHub snapshot, clearly synthetic sparse demo, synthetic dense art showcase, or user-uploaded compatible JSON.
- **Timeline:** For real snapshots, reveals historic *calendar days* chronologically. For demo event logs, reveals recorded events.
- **Inspect date:** Click a grid tile or use the UTC date selector; recent public event details are not guaranteed for every day.
- **Motion:** Pause atmospheric animation independently of the historical timeline.
- **Downloads:** Animated SVG, still SVG and a locally generated animated GIF.

## 5. Add artwork to your GitHub profile

Once you own a public fork or repository containing the generated assets, reference an image in your GitHub profile README. For example, replace \`YOUR_USERNAME\` and \`YOUR_REPO\`:

~~~markdown
![My Developer World](https://raw.githubusercontent.com/YOUR_USERNAME/YOUR_REPO/refs/heads/master/previews/real-archipelago.gif)
~~~

Alternatively use \`previews/real-archipelago-still.svg\` for reduced motion. GitHub's image proxy can filter SVG CSS animation, so prefer the GIF for autonomous animation and a linked still image for accessibility. Do **not** embed \`index.html\`; GitHub README Markdown does not execute interactive web apps.

## 6. Automate your personal world

See [AUTOMATION.md](AUTOMATION.md). Fork the project, enable GitHub Actions, configure write permissions and a username variable if needed, then run the refresh workflow. The workflow can refresh daily on its default branch, subject to GitHub scheduling behaviour.

## Troubleshooting

**The image shows the maintainer rather than me:** You are still viewing the bundled example. Run the collector and publisher with your username or configure your fork's refresh workflow.

**My day counts look smaller than expected:** Check GitHub's visible profile settings and whether the token can see relevant private contributions. Public REST events are not a year-long contribution history.

**Some dates are grey/unknown:** GitHub's GraphQL request may cover approximately 365 days while the visual grid reserves 371 day positions. Unknown is not zero.

**Cannot open the preview:** Use \`npm run preview\` and the loopback URL. Opening HTML using a \`file://\` URL may block the JSON fetch.

**GIF export fails:** Use a current Chromium-derived browser, ensure Canvas supports SVG rasterisation and try a static SVG fallback.

**Two different counts look similar:** This is a known visual-intensity issue on the roadmap, not a collector error. The exact daily counts remain available in the day inspector and JSON.

**I cannot push from a fork's workflow:** Check **Settings → Actions → General** for workflow token permission; see automation documentation.
