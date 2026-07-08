# Deploying to GitHub Pages — what you need to do by hand

I set up everything I could from the code side. The steps below are the ones that
can only be done in the GitHub web UI and at your domain registrar — I can't do those
for you. They take about 10 minutes of clicking plus DNS propagation time.

---

## Decisions I made for you (change any of them freely)

| Decision | What I picked | Why / how to change |
|---|---|---|
| **Subdomain** | `light.unverged.com` | Short, brandable, matches the title *The Descent of Light*. Your existing `https://unverged.com/` site is **not affected** — a subdomain is a separate DNS record. To change it, see *"Using a different subdomain"* at the bottom. |
| **Deploy method** | GitHub **Actions** workflow (not "deploy from a branch") | You asked for a workflow that deploys on push to `main`. It lives at `.github/workflows/deploy.yml`. |
| **What gets published** | The whole repo root | The site is one self-contained `index.html` + the logo PNG, so publishing the root is simplest. |

Alternative subdomains if you don't like `light`: `descent.unverged.com`,
`descent-of-light.unverged.com`, `photosynthesis.unverged.com`, `autotrophs.unverged.com`.

---

## Files I added / changed

- **`.github/workflows/deploy.yml`** — the deploy-on-push workflow (new).
- **`CNAME`** — contains `light.unverged.com`; GitHub reads this to bind the custom domain (new).
- **`index.html`** — the four content fixes (see *"Code changes"* at the bottom).
- **`DEPLOY-GITHUB-PAGES.md`** — this file.

---

## Step 1 — Push these changes to `main`

I did **not** commit or push (I don't push without your OK). From the repo:

```bash
git add -A
git commit -m "Map/flow fixes + GitHub Pages deploy workflow"
git push origin main
```

The push will trigger the workflow, but it will **fail or do nothing useful until you
do Step 2** (Pages has to be switched to the "GitHub Actions" source first).

## Step 2 — Turn on Pages via GitHub Actions

1. Go to **`https://github.com/unverged/light`** → **Settings** → **Pages**.
2. Under **Build and deployment → Source**, choose **GitHub Actions**.
   *(Do NOT pick "Deploy from a branch" — that's the other method.)*
3. That's it here; no branch/folder to pick with the Actions method.

## Step 3 — Add the DNS record at your domain registrar

Wherever `unverged.com`'s DNS is managed (Cloudflare, Namecheap, GoDaddy, etc.),
add **one** record. This does **not** touch your existing apex site.

| Type | Host / Name | Value / Target | TTL |
|---|---|---|---|
| `CNAME` | `light` | `unverged.github.io` | Auto / default |

Notes:
- Host is just `light` (some panels want the full `light.unverged.com` — either works).
- Value is `unverged.github.io` (**your GitHub account**, no repo, no `https://`, no path). A trailing dot is fine.
- **Cloudflare users:** set the record to **DNS only** (grey cloud), *not* proxied (orange cloud), at least until HTTPS is issued — the orange-cloud proxy can break GitHub's certificate check.

## Step 4 — Confirm the custom domain + enable HTTPS

1. Back in **Settings → Pages**, the **Custom domain** box should already show
   `light.unverged.com` (read from the `CNAME` file). If it's empty, type it and **Save**.
2. GitHub runs a **DNS check** — it goes green once Step 3 propagates (minutes, sometimes up to an hour).
3. Once green, tick **Enforce HTTPS**. The TLS certificate is issued automatically;
   it can take a few minutes to ~24h the first time (usually fast).

## Step 5 — Watch it deploy

- Go to the **Actions** tab → the **"Deploy to GitHub Pages"** run should be green.
- Every future `git push` to `main` re-deploys automatically. You can also trigger it
  manually from the Actions tab (**Run workflow**) thanks to `workflow_dispatch`.

**Your site will be live at → `https://light.unverged.com`**
(also reachable at `https://unverged.github.io/light/` until DNS is set).

---

## Using a different subdomain

If you want something other than `light`:

1. Edit **`CNAME`** — replace `light.unverged.com` with your choice, commit, push.
2. Redo **Step 3** DNS with the new host name.
3. Update **Settings → Pages → Custom domain** to match.

## Quick sanity check before pushing (optional)

The live Wikipedia images and Google Fonts only load over `http(s)://`, not `file://`.
To preview exactly what Pages will show:

```bash
python3 -m http.server 8000   # then open http://localhost:8000
```

---

## Code changes I made in this session (for your reference)

1. **Energy-flow labels** — the remaining-energy `%` now sits pinned to the column
   gutter beside each green beam, in a light colour with a dark halo, so it stays
   readable even when the beam is a sliver. (Was dark text centred on the beam →
   invisible on the black background when the beam got narrow.)
2. **Map icons** — leaves no longer show a capital-letter tile. Each shows an emoji
   that hints at the organism (🌳 🌽 🌵 🦠 💠 ☀️ …) as a fallback, with the live
   Wikipedia photo layered on top when it loads. I also fixed two image titles that
   had no photo on Wikipedia (`Rhodospirillum` → `Rhodospirillum rubrum`,
   `Methanogen` → `Cupriavidus necator`). **Heliobacteria** genuinely has no photo on
   Wikipedia, so it keeps the ☀️ icon.
3. **Tree connectors** — rebuilt. Each split now (a) starts its connector at the split
   point and (b) stops the vertical rail at the last leaf instead of overshooting.
   Every split level gets its **own colour** (Anoxygenic stays violet, Chemolithoautotrophs
   stays brown), and every group header is now **collapsible** — click the ▾ caret / header
   to fold or unfold its subgroups (keyboard: focus + Enter/Space).
4. **Deploy** — the workflow + CNAME above.
