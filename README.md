<p><img src="logo/janadesh-logo.svg" alt="Janadesh" width="420"></p>

# Janadesh

A seat simulator for India's Lok Sabha (1951 to 2024, plus a 2029 projection mode) and every state assembly election in the dataset.

**Simulation only.** Nothing here is a real result, exit poll or forecast.

## Features

- Simulate any future election (up to four cycles ahead) for the Lok Sabha or any state, with a "continue the trend" option
- Home page with the Lok Sabha as it stands (members per bloc, from Wikipedia), an election calendar, ready-made scenarios and one-tap state picker
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
- What-if lab: a new party, a party split, turnout shifts and a sitting-member penalty; voting systems compared, One Nation One Election, a delimitation scenario, the Rajya Sabha and the presidential electoral college
- Smarter model: a Core + swing method with a wave setting, a wave tracker for every past election, a momentum baseline (weighted last four elections), realistic mode, and signals from assembly results, by-elections and city corporations
- Analysis tools: flip targets, closest contests, records, head-to-head, incumbency patterns, representation, chief ministers, by-elections since 2014 (by Lok Sabha term), city bodies, party family tree, alliance timeline and a history page for every seat
- Election calendar, a prediction challenge with shareable cards, live counting (type in the count, or replay a past one), Guess the election, a polity quiz and a scenario gallery. All in the browser, with no server
- Dark mode and colour-blind-safe colours, undo and redo, installable app that works offline, PDF report, drawing on exported images, a clean recording view, and embed codes for other websites

## Deploy on GitHub Pages

1. Create a new public repository on GitHub (for example `janadesh`).
2. Upload `index.html` and the `source/` folder (the page loads each state's data from `source/data/` and maps from `source/maps/` only when they are needed).
3. In the repository, open Settings, then Pages. Set Source to "Deploy from a branch", branch `main`, folder `/ (root)`, and save.
4. After a minute the site is live at `https://<your-username>.github.io/janadesh/`.

Or from a terminal:

```bash
cd janadesh-site
git init && git add . && git commit -m "Janadesh election simulator"
gh repo create janadesh --public --source . --push
gh api -X POST repos/{owner}/janadesh/pages -f "source[branch]=main" -f "source[path]=/"
```

The page needs its data files, so serve the folder with any static host (or run `python -m http.server` in it and open http://localhost:8000). For a single offline file run `python build/make_dist.py --single`, which writes `janadesh-single.html` with every data file embedded.

## Data

- Constituency results: Election Commission of India, via DataMeet `india-election-data`, `gitcheckoutnikhil/india-elections-data`, `data-analytics.github.io`, `spfrantz/vidhan-sabha-2017-scraper`, `spfrantz/vidhan-sabha-2018`, `azadecon/assembly_elections_2023`.
- 39 recent assembly elections without open seat-level data (for example Maharashtra 2014–2024, Haryana 2014–2024, Delhi 2015–2025, Bihar 2015–2025, Gujarat 2012–2022, West Bengal and Assam 2026) use the official winner and runner-up of every constituency from Wikipedia (`build/seat_overrides/`); the votes of smaller parties in each seat are estimated, and statewide seat totals are checked against the official tallies.
- Winner and runner-up names (and the winner's sex and age where the source has them) are in `source/names/`, matched to every seat.
- Exit-poll projections for the poll presets are read from the Wikipedia exit-poll tables (`source/data/polls.json`, built by `build/fetch_polls.py`).
- 1951 and 1957 Lok Sabha two-member seats are approximated from electorate size.
- Maps: DataMeet boundary files (2008 delimitation).

## Rebuilding

```bash
python build/make_dist.py            # page: template + i18n + engine + features -> index.html, then derived data (home summary, search index)
python build/make_dist.py --single   # also janadesh-single.html with all data embedded
```

`build/template.html` is the page, `build/i18n.js` the English and Hindi strings, `build/engine.js` the swing engine and `build/features/*.js` the features (mobile layout, map zoom, share, analysis tools, search, polls). `assemble.py` joins them. Features add their own strings with `addI18n('en', {...})` and `addI18n('hi', {...})`; a clash with an existing key logs a warning in the browser console.

Data pipeline (needs Python with pandas, numpy, scipy, openpyxl, beautifulsoup4, lxml):

1. `python build/fetch_sources.py` downloads the raw result files into `dl/` (not committed).
2. `python build/build.py` (rows), `build2.py` (elections), `build3.py` (map keys) write `source/data/` and `source/maps/`.
3. `python build/apply_overrides.py` applies the official constituency results in `build/seat_overrides/`; `python build/fix_others.py` repairs CPI(M) votes polluted by the old "Others" mapping (both are idempotent repairs on the packed files).
4. `python build/make_names.py` writes `source/names/` (add Wikipedia names first with `python build/fetch_wiki_names.py`); `python build/fetch_polls.py` writes `source/data/polls.json`.
5. `python build/fix_independents.py` keeps independents out of alliances (run by make_dist). Reference data: `python build/fetch_cms.py` (chief ministers), `python build/fetch_bypolls.py` (by-elections), `python build/fetch_local.py` (city corporation results), `python build/fetch_population.py` (Census 2011), `python build/fetch_rs.py` (Rajya Sabha members and terms), `source/ref/lineage.json` (party splits and mergers, hand-written).
6. `python build/make_dist.py` rebuilds the page, the search index, `source/data/stats.json` and the open data downloads in `data/` (JSON and CSV per election, `all-seats.csv`).

Data fixes go into `build/seat_overrides/` and are checked against official party tallies before release.

## Logo

The `logo/` folder has the mark (a horseshoe of seats with the violet indelible-ink stroke at its centre) as SVG and PNG: `janadesh-icon` for avatars, `janadesh-favicon` for small sizes, `janadesh-logo` and `janadesh-logo-dark` for headers, and `janadesh-social.png` (1280 x 640) for the GitHub social preview. Text in the SVGs is converted to outlines, so no fonts are needed. Fonts used: Anek Latin and Anek Devanagari (SIL Open Font License).
