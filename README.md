# The Descent of Light

An interactive explorer of the autotrophs that live on sunlight (and the few that don't), and where each group's solar energy leaks away on the road to biomass.

Open `index.html` — no build step, no framework, no bundler. It's plain HTML + CSS + classic `<script>` files, so it runs identically as a local file, on a static host, or on GitHub Pages.

## Project layout

```
index.html                 page shell + view markup
assets/
  css/styles.css           all styling / theme tokens
  js/data.js               CONTENT: CAT, STEP, GROUPS, TREE (edit here)
  js/app.js                rendering + routing (rarely needs edits)
images/
  organisms/               local, licensed organism photos (see CREDITS.md)
  logo/                    site logo
CREDITS.md                 image attributions + licences
DEPLOY-GITHUB-PAGES.md     how to publish + the manual GitHub/DNS steps
```

## What it does

- **The map** — a collapsible taxonomy tree of autotrophs: phototrophs (oxygenic + anoxygenic) and the non-light chemolithoautotrophs. Every group starts collapsed; click a header (the `▾` caret) to expand it. Mixotroph groups and species are flagged with `*`. Each leaf carries a local organism photo.
- **The energy flow** — click any leaf for its own page: its share of incident sunlight thins from 100% down to the few percent that survives as biomass, each loss clickable for the mechanism and Wikipedia sources, plus an extended **species roster** linked to Wikipedia. Colour encodes the *kind* of loss.
- Each of the seven eukaryotic-algae groups (green, red, diatoms, brown, dinoflagellates, coccolithophores, euglenids) has its **own** distinct energy budget and story.

## The numbers

Theoretical maxima follow **Zhu, Long & Ort (2008 / 2010)** — 4.6% for C₃, 6.0% for C₄ — and the stage-by-stage cascade follows the **Hall & Rao** energy budget (via Wikipedia's *Photosynthetic efficiency*). Intermediate splits are illustrative and land on the published endpoints; realised field/ocean values are always lower.

## Editing the content

Everything you'd normally change lives in **`assets/js/data.js`**, in four commented blocks:

| Block | What it controls |
|---|---|
| `CAT` | Loss categories and their colours. |
| `STEP` | The shared light-physics stages reused by every oxygenic group. |
| `GROUPS` | **The main one.** Every energy-flow page: name, theoretical max, intro, `stages` (each `lost`/`remain` %, label, detail, Wikipedia `links`), and the `species` roster. |
| `TREE` | The taxonomy map: nested `children`, and `leaf` nodes with `species`, `img` (local slug), and `groupId`. |

### Add a species
Add to a `species` array (on a `TREE` leaf for the map, or on a `GROUPS` entry for the page):
```js
{ n:'Common name', s:'Genus species', wiki:'Wikipedia_Article_Title', mixo:true }
```
`mixo:true` prints the `*` marker.

### Images
Organism photos are **local files** in `images/organisms/<slug>.jpg`. A leaf's `img:` is that slug. On the rare miss the page falls back to a live Wikipedia fetch, then to an emoji icon. To add/replace an image, drop a freely-licensed file in that folder, point `img:` at its slug, and record the credit in `CREDITS.md`. (Concept/diagram images inside the loss drawers are still fetched live from Wikipedia and simply hide if offline.)

## Run it locally

Open `index.html` directly, or serve it:
```bash
python3 -m http.server 8000   # then visit http://localhost:8000
```

## Deploy

See **[DEPLOY-GITHUB-PAGES.md](DEPLOY-GITHUB-PAGES.md)** — a GitHub Actions workflow deploys on every push to `main`, with a custom domain via the `CNAME` file. Routing is hash-based (`#/map`, `#/flow/diatoms`), so deep links and the back button work with no server config.

## Credits

Organism photographs come from Wikimedia Commons under free licences (Public Domain, CC0, CC BY, CC BY-SA) — full attribution in **[CREDITS.md](CREDITS.md)**. Deep links and concept images: Wikipedia. Figures: Zhu, Long & Ort (2008/2010); Hall & Rao energy budget.
