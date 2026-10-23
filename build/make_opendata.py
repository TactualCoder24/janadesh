"""Open data downloads at fixed links, written to data/ at the repo root (static files, no server):

  data/index.json                       every election with links
  data/ls/<year>.json|csv               Lok Sabha, e.g. data/ls/2024.json
  data/ae/<state>/<year>.json|csv       assemblies, e.g. data/ae/delhi/2025.json
  data/all-seats.csv                    every seat of every election
  data/README.md                        column notes, sources and credit
"""
import os, re, json, glob, csv, io, shutil
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
D = os.path.join(ROOT, 'source', 'data')
N = os.path.join(ROOT, 'source', 'names')
OUT = os.path.join(ROOT, 'data')

def slug(s):
    return re.sub(r'[^a-z0-9]+', '-', str(s).lower()).strip('-')

COLS = ['election_id', 'kind', 'state', 'year', 'label', 'status', 'seat_no', 'seat_name', 'category', 'region', 'total_votes',
        'winner_party', 'winner_name', 'winner_votes', 'runner_up_party', 'runner_up_name', 'runner_up_votes', 'margin', 'margin_pct']

def main():
    if os.path.isdir(OUT):
        shutil.rmtree(OUT)
    os.makedirs(OUT)
    meta = json.load(open(f'{D}/index.json', encoding='utf-8'))
    pname = {c: v['n'] for c, v in meta['parties'].items()}
    index = []
    big = io.StringIO(); bw = csv.writer(big, lineterminator='\n'); bw.writerow(COLS)
    for f in sorted(glob.glob(f'{D}/*.json')):
        base = os.path.basename(f)[:-5]
        if base in ('index', 'search', 'polls', 'stats'):
            continue
        names = json.load(open(f'{N}/{base}.json', encoding='utf-8')) if os.path.exists(f'{N}/{base}.json') else {}
        for e in sorted(json.load(open(f, encoding='utf-8')), key=lambda x: (x['year'], x['label'])):
            status = 'reconstructed' if e.get('approx') else ('official_winners_only' if e.get('partial') else 'official')
            nm = names.get(e['id'])
            P = e['parties']
            seats = []; rows = []
            for i, s in enumerate(e['seats']):
                fl = s[4]
                ranked = [(P[fl[k]], fl[k + 1]) for k in range(0, len(fl), 2)]
                tot = sum(v for _, v in ranked) + s[5]
                n = nm[i] if nm and i < len(nm) and nm[i] else []
                w = ranked[0] if ranked else None; r = ranked[1] if len(ranked) > 1 else None
                margin = (w[1] - (r[1] if r else 0)) if w else None
                region = e['regions'][s[3]] if s[3] >= 0 else ''
                rec = {'no': s[0], 'name': s[1], 'category': s[2], 'region': region, 'total_votes': tot, 'other_votes': s[5], 'votes': dict(ranked)}
                if w:
                    rec['winner'] = {'party': w[0], 'name': n[0] if n else '', 'votes': w[1]}
                    if len(n) > 2 and n[2]: rec['winner']['sex'] = n[2]
                    if len(n) > 3 and n[3]: rec['winner']['age'] = n[3]
                if r: rec['runner_up'] = {'party': r[0], 'name': n[1] if len(n) > 1 else '', 'votes': r[1]}
                if margin is not None: rec['margin'] = margin
                seats.append(rec)
                rows.append([e['id'], e['kind'], e['state'], e['year'], e['label'], status, s[0], s[1], s[2], region, tot,
                             w[0] if w else '', n[0] if n else '', w[1] if w else '', r[0] if r else '', n[1] if len(n) > 1 else '', r[1] if r else '',
                             margin if margin is not None else '', round(100 * margin / tot, 2) if margin is not None and tot else ''])
            rel = f"{'ls' if e['kind'] == 'LS' else 'ae/' + slug(e['state'])}/{slug(e['label'])}"
            os.makedirs(os.path.dirname(f'{OUT}/{rel}'), exist_ok=True)
            doc = {'id': e['id'], 'kind': e['kind'], 'state': e['state'], 'year': e['year'], 'label': e['label'], 'status': status,
                   'parties': {p: pname.get(p, p) for p in P}, 'alliances': e.get('alliances', {}), 'seats': seats}
            json.dump(doc, open(f'{OUT}/{rel}.json', 'w', encoding='utf-8'), separators=(',', ':'), ensure_ascii=False)
            buf = io.StringIO(); w2 = csv.writer(buf, lineterminator='\n'); w2.writerow(COLS); w2.writerows(rows)
            open(f'{OUT}/{rel}.csv', 'w', encoding='utf-8', newline='').write(buf.getvalue())
            for r_ in rows: bw.writerow(r_)
            title = ('Lok Sabha ' if e['kind'] == 'LS' else e['state'] + ' Assembly ') + e['label']
            index.append({'id': e['id'], 'title': title, 'kind': e['kind'], 'state': e['state'], 'year': e['year'], 'label': e['label'], 'seats': len(seats), 'status': status,
                          'json': f'data/{rel}.json', 'csv': f'data/{rel}.csv'})
    open(f'{OUT}/all-seats.csv', 'w', encoding='utf-8', newline='').write(big.getvalue())
    json.dump({'v': 1, 'site': 'https://janadesh-smoky.vercel.app', 'files': {'all_seats_csv': 'data/all-seats.csv'}, 'elections': index}, open(f'{OUT}/index.json', 'w', encoding='utf-8'), separators=(',', ':'), ensure_ascii=False)
    open(f'{OUT}/README.md', 'w', encoding='utf-8', newline='\n').write(README)
    print('open data:', len(index), 'elections;', round(os.path.getsize(f'{OUT}/all-seats.csv') / 1e6, 1), 'MB all-seats.csv')

README = """# Janadesh open data

Constituency-level results of the Lok Sabha (1951 to 2024) and every state assembly in the Janadesh dataset, as static files.
Credit "Janadesh" (https://janadesh-smoky.vercel.app) and the original sources below. The official results are public data of the Election Commission of India.

- `index.json` lists every election with its links.
- `ls/<year>.json|csv`, `ae/<state>/<year>.json|csv` hold one election each. `all-seats.csv` holds all of them.

## CSV columns

| column | meaning |
|---|---|
| election_id | for example `ls-2024`, `ae-delhi-2025` |
| kind, state, year, label | `LS` or `AE`; state (`India` for the Lok Sabha); election year and label |
| status | `official`, `official_winners_only` (real winner and runner-up, smaller-party votes estimated) or `reconstructed` (estimated seats) |
| seat_no, seat_name, category, region | constituency number, name, GEN / SC / ST, state (Lok Sabha) or district (assembly) where known |
| total_votes | votes counted for the listed candidates plus others |
| winner_party, winner_name, winner_votes | winner; names are blank where no candidate-level source exists |
| runner_up_party, runner_up_name, runner_up_votes | runner-up |
| margin, margin_pct | votes, and percentage points of total votes, between winner and runner-up |

The JSON files add the votes of every listed party in each seat (`votes`), votes of other candidates (`other_votes`), and the winner's `sex` and `age` where the source has them.
Party codes are explained by `parties` in each JSON file. Independents are one entry (`IND`): the best independent only; the rest are in `other_votes`.

## Sources

DataMeet india-election-data; gitcheckoutnikhil/india-elections-data; data-analytics.github.io; spfrantz/vidhan-sabha-2017-scraper and vidhan-sabha-2018; azadecon/assembly_elections_2023; Wikipedia election pages (official winners for 39 assembly elections, names).
The compilation here (name matching, repairs, reconstructed seats) is free to use with credit to Janadesh.
"""

if __name__ == '__main__':
    main()
