# CLAUDE.md — project context for AI sessions

**The Descent of Light** — an interactive explorer of the autotrophs that live on sunlight
(and the few that don't), and where each group's solar energy leaks away on the road to
biomass. It's a **static site, no build step, no framework, no bundler**.

- Repo: `github.com/unverged/light` · deploys to **GitHub Pages** via Actions on push to `main`.
- Live at `https://light.unverged.com` (custom domain via `CNAME`); also `unverged.github.io/light/`.
- Deployment + the manual GitHub/DNS steps live in `DEPLOY-GITHUB-PAGES.md`.

## File map

```
index.html               page shell + view markup (loads the assets below)
assets/css/styles.css     ALL styling + theme tokens (:root vars)
assets/js/data.js         CONTENT — CAT, STEP, GROUPS, TREE.  Edit here.
assets/js/app.js          rendering + hash routing.  Rarely needs edits.
images/organisms/<slug>.jpg   local, freely-licensed organism photos
images/logo/             site logo
images/manifest.json      provenance of the downloaded images (build artifact)
CREDITS.md               image attributions + licences
README.md · DEPLOY-GITHUB-PAGES.md
```

`data.js` is where nearly all edits go. `GROUPS` = one energy-flow page each; `TREE` = the map.

## Invariants — do not break these

1. **Relative asset paths only** (never a leading `/`). The site must work both at the
   custom-domain root *and* at the `/light/` project subpath. `index.html`, `data.js`
   (`'images/organisms/'+slug+'.jpg'`) and `styles.css` (`../../images/...`) all rely on this.
2. **Classic `<script>` tags, not ES modules; no `fetch()` of local files.** The owner opens
   the page from `file://` (WSL), where modules and local `fetch` are CORS-blocked. Keep JS as
   plain globals loaded via `<script src>`. (Wikipedia `fetch` is fine — it's cross-origin HTTPS
   and only powers optional drawer images that degrade gracefully.)
3. **Organism images are LOCAL committed files**, `images/organisms/<slug>.jpg`; a leaf's `img:`
   is the slug. Loader order (`fillOrganism` in app.js): local file → live Wikipedia → emoji.
   When adding/replacing one: download a **freely-licensed** Wikimedia Commons image and record
   its licence + author in `CREDITS.md`. `ORG` (slug→article) in app.js is the fallback map.
   `heliobacteria` has no free photo on purpose — it falls back to the ☀️ emoji.
4. **Concept/drawer diagram images stay live-fetched from Wikipedia** (by article title), not
   localised — they hide silently offline. That's intentional.
5. **Energy-flow numbers**: `remain`/`lost` in each stage are % of the *original* incident
   sunlight. Keep `remain` monotonically decreasing down `stages`; the last stage's `remain`
   must equal the group's headline `max`. Endpoints follow Zhu, Long & Ort (2008/2010).
6. **Per-species `mixo:true`** prints the `*` marker (map chip + the flow-page species panel).
7. **The map tree**: every group is collapsed by default (root open); each split (grouping node)
   is auto-assigned its own colour from `BRANCH_PALETTE` in DFS order; connectors are painted
   per-`.twig` so the rail starts at the split and stops at the last leaf.
8. **Hash routing**: `#/map` and `#/flow/<groupId>`. Deep links must keep working.

## Groups

16 groups in `GROUPS`. Every leaf on the map has its **own** distinct page — none are shared.
The seven eukaryotic algae: `greenalgae`, `redalgae`, `diatoms`, `brownalgae`, `dinoflagellates`,
`coccolithophores`, `euglenids`. The land plants: `mosses`, `ferns`, `gymnosperms` (the three
non-flowering grades) plus `c3`, `c4`, `cam` under Angiosperms. Then `cyanobacteria`,
`anox` (qualitative), `chemo` (donor grid).

`mosses`/`ferns`/`gymnosperms` run the same C₃ biochemistry as `c3` — they share the
`calvinC3()` and `photorespC3()` stage builders — and differ only in the group-specific stage
each one adds (desiccation downtime, shade saturation, needle self-shading + winter shutdown).

## Verifying a change (no browser needed)

```bash
node --check assets/js/data.js && node --check assets/js/app.js   # syntax
python3 -m http.server 8000                                       # preview at :8000
```
For logic checks, the JS defines plain globals, so you can `eval(data.js + app.js)` in Node with
small DOM stubs (`document`, `Image`, `fetch`, `location`) and call `nodeHTML(TREE,null,0)` /
`renderFlow(id)` to assert structure without a real browser.

## Conventions

- Keep everything self-contained and relative; don't introduce a build step or a framework.
- Match the existing terse, comment-headed style in each file.
- Don't push without the owner's OK. `main` deploys on push.
