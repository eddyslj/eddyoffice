# Eddy Office

Eddy Sheet (Excel files) and Eddy Doc (Word files) as installable web apps, hosted together on one Cloudflare Pages site.

```
index.html             start page with links and install steps
sheet/                 Eddy Sheet  (index.html, manifest, offline helper, icons)
doc/                   Eddy Doc    (index.html, manifest, offline helper, icons)
_headers               tells Cloudflare not to cache the app files too long
```

## Put it online (once)

1. On GitHub, create a new repository, for example `eddy-office`.
2. Upload everything in this folder (keep the `sheet` and `doc` folders as they are) and commit.
3. In Cloudflare: **Workers & Pages → Create → Pages → Connect to Git**, pick the `eddy-office` repository.
4. Build settings: Framework preset **None**, Build command **empty**, Build output directory **/** (leave as root).
5. Click **Save and Deploy**. Your address will be something like `https://eddy-office.pages.dev`.

## Update later

Replace `sheet/index.html` or `doc/index.html` (and the matching `sw.js`) in GitHub and commit. Cloudflare redeploys automatically, and the installed apps pick up the new version the next time they open while online.

## Install and open files

See the start page (`index.html`): install each app from Chrome or Edge, then right-click a file → Open with → Eddy Sheet / Eddy Doc.
