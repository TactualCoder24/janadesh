"""Winner and runner-up names for every seat that has candidate-level source data.

Reads build/rows.pkl (python build/build.py) and the packed election files in source/data/, and writes source/names/<file>.json:
  { election id: [ [winner, runner-up, winner sex, winner age] per seat, in the same order as the election's seats ] }
Elections rebuilt from party summaries (no candidate data), plus any in build/names_extra/<file>.json, are filled separately.
"""
import os, re, json, glob
import pandas as pd
HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.dirname(HERE)
D = os.path.join(ROOT, 'source', 'data')
N = os.path.join(ROOT, 'source', 'names')
EXTRA = os.path.join(HERE, 'names_extra')
os.makedirs(N, exist_ok=True)
rows = pd.read_pickle(os.path.join(HERE, 'rows.pkl'))
rows = rows[rows.party != 'NOTA']

def clean(n):
    if n is None or (isinstance(n, float) and pd.isna(n)):
        return ''
    n = re.sub(r'\s+', ' ', str(n)).strip().strip('.,')
    n = re.sub(r'\s*\((SC|ST)\)\s*$', '', n, flags=re.I)
    n = re.sub(r'\s*\(\s*(uncontested|unopposed|elected unopposed)[^)]*\)', '', n, flags=re.I).strip()
    if n.isupper() or n.islower():
        n = n.title()
        n = re.sub(r"\bMc([a-z])", lambda m: "Mc" + m.group(1).upper(), n)
    return n

def main():
    groups = {}
    rr = rows.assign(gstate=rows.state.where(rows.kind == 'AE', 'India'))
    for (kind, state, label), g in rr.groupby(['kind', 'gstate', 'label']):
        groups[(kind, state, str(label))] = g
    total = {'ok': 0, 'miss': 0, 'bad': 0}
    for f in sorted(glob.glob(f'{D}/*.json')):
        base = os.path.basename(f)[:-5]
        if base in ('index', 'search', 'polls'):
            continue
        out = {}
        extra = {}
        ef = os.path.join(EXTRA, base + '.json')
        if os.path.exists(ef):
            extra = json.load(open(ef, encoding='utf-8'))
        for e in json.load(open(f, encoding='utf-8')):
            g = groups.get((e['kind'], e['state'], str(e['label'])))
            if e['id'] in extra:
                out[e['id']] = extra[e['id']]; continue
            if g is None or e.get('approx') or e.get('partial'):
                continue
            by = {int(k): v for k, v in g.groupby('seat')}
            res = []; ok = bad = miss = 0
            for s in e['seats']:
                sg = by.get(s[0])
                if sg is None:
                    res.append(None); miss += 1; continue
                sg = sg[sg.votes.notna()].sort_values('votes', ascending=False)
                if len(sg) == 0:
                    res.append(None); miss += 1; continue
                w = sg.iloc[0]; r = sg.iloc[1] if len(sg) > 1 else None
                if s[4] and abs(float(w.votes) - s[4][1]) > max(2, 0.002 * s[4][1]):
                    bad += 1   # winner votes disagree: do not trust the join for this seat
                    res.append(None); continue
                sx = str(w.sex)[:1].upper() if isinstance(w.sex, str) else ''
                age = int(w.age) if pd.notna(w.age) and 18 <= w.age <= 110 else 0
                rec = [clean(w.cand), clean(r.cand) if r is not None else '', sx if sx in ('M', 'F') else '', age]
                while rec and rec[-1] in ('', 0):
                    rec.pop()
                res.append(rec); ok += 1
            if ok:
                out[e['id']] = res
            total['ok'] += ok; total['bad'] += bad; total['miss'] += miss
            if bad or miss > 0.05 * len(e['seats']):
                print(f"  {e['id']}: matched {ok}, winner-votes mismatch {bad}, no raw row {miss}, of {len(e['seats'])}")
        if out:
            json.dump(out, open(f'{N}/{base}.json', 'w', encoding='utf-8'), separators=(',', ':'), ensure_ascii=False)
    print('names:', total)

if __name__ == '__main__':
    main()
