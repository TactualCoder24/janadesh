<p><img src="logo/janadesh-logo.svg" alt="Janadesh" width="420"></p>

# Janadesh

A seat simulator for India's Lok Sabha (1951 to 2024, plus a 2029 projection mode) and every state assembly election in the dataset.

**Simulation only.** Nothing here is a real result, exit poll or forecast.

## Features

- Simulate any future election (up to four cycles ahead) for the Lok Sabha or any state, with a "continue the trend" option
- Home page with a live 2024 Lok Sabha chamber, ready-made scenarios and one-tap state picker
- Easy mode: one swing slider between any two sides, plus presets (wave, neck and neck, anti-incumbency, smaller parties rise, repeat last swing)
- Full English and Hindi interface, including state and major party names
- Lok Sabha 1951–2024 and 30+ state assemblies, with a "simulate next" option for each
- Charts: votes vs seats, seat change, seat curve, margin distribution, seats by state or district, Monte Carlo seat histogram, and vote or seat history
- Party or alliance view (NDA, INDIA, MVA, Mahayuti, LDF/UDF and more), with vote-transfer between allies
- Proportional or uniform swing, lockable sliders that rebalance to 100%
- Regional swing by state (Lok Sabha) or district (assemblies), plus SC/ST reserved-seat swing
- Odds mode: Monte Carlo runs with national, regional and seat-level error, seat ranges, majority and hung-house chances, per-seat win chances
- Constituency maps (2008 delimitation) with winner, margin and "changed hands" shading; seat grid where no map fits
- Click any seat to see simulated vs actual result and force a winner
- Rename and recolour parties, move parties between alliances, create new alliances
- Save scenarios in the browser, share them as a code, copy seat results as CSV, export a result image
- "Repeat last swing" preset and a seats-over-time history chart

## Deploy on GitHub Pages

1. Create a new public repository on GitHub (for example `janadesh`).
2. Upload `index.html` (it already contains all data and maps, so it is the only file the site needs).
3. In the repository, open Settings, then Pages. Set Source to "Deploy from a branch", branch `main`, folder `/ (root)`, and save.
4. After a minute the site is live at `https://<your-username>.github.io/janadesh/`.

Or from a terminal:

```bash
cd janadesh-site
git init && git add . && git commit -m "Janadesh election simulator"
gh repo create janadesh --public --source . --push
gh api -X POST repos/{owner}/janadesh/pages -f "source[branch]=main" -f "source[path]=/"
```

`index.html` is fully self-contained, so you can also just double-click it to open it locally. The `source/` folder has the unbundled page plus separate data files; `build/make_dist.py` bundles them back into one file.

## Data

- Constituency results: Election Commission of India, via DataMeet `india-election-data`, `gitcheckoutnikhil/india-elections-data`, `data-analytics.github.io`, `spfrantz/vidhan-sabha-2017-scraper`, `spfrantz/vidhan-sabha-2018`, `azadecon/assembly_elections_2023`.
- Elections marked "Reconstructed seats" (for example Maharashtra 2014–2024, Haryana 2014–2024, Delhi 2015–2025, Bihar 2015–2025, Gujarat 2012–2022, West Bengal and Assam 2026) use exact statewide seats and vote shares from Wikipedia, with constituency figures rebuilt from the nearest election that has seat-level data. Seat totals match the real result; individual seats are approximate.
- 1951 and 1957 Lok Sabha two-member seats are approximated from electorate size.
- Maps: DataMeet boundary files (2008 delimitation).

## Rebuilding the data

The `build/` folder holds the scripts: `build.py`, `build2.py`, `build3.py` produce `data/` and `maps/`; `assemble.py` builds the page from `template.html`, `i18n.js` and `engine.js`; `make_dist.py` embeds the data into the single `index.html`. They expect the source repositories cloned under a `dl/` folder; paths are set at the top of each script.


## Logo

The `logo/` folder has the mark (a horseshoe of seats with the violet indelible-ink stroke at its centre) as SVG and PNG: `janadesh-icon` for avatars, `janadesh-favicon` for small sizes, `janadesh-logo` and `janadesh-logo-dark` for headers, and `janadesh-social.png` (1280 x 640) for the GitHub social preview. Text in the SVGs is converted to outlines, so no fonts are needed. Fonts used: Anek Latin and Anek Devanagari (SIL Open Font License).
