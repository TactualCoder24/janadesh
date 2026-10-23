"""One-off data repair: the old party mapping sent the raw label "Others" (a bucket of small parties) to CPI(M), so CPI(M) carried stray votes
in many seats. Rebuild rows.pkl with the fixed parties.py first (python build/build.py), then run this. For every real election it sets the
CPI(M) vote in each seat to what CPI(M) really polled and moves the surplus to "other parties". Reconstructed (approx / partial) elections are untouched.

  python build/fix_others.py
"""
import os, sys, json, glob, collections
import pandas as pd
HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.dirname(HERE)
D = os.path.join(ROOT, 'source', 'data')
rows = pd.read_pickle(os.path.join(HERE, 'rows.pkl'))
CODE = 'CPI(M)'

def main():
    cm = rows[rows.party == CODE]
    true = {}
    for (kind, state, label, seat), g in cm.groupby(['kind', 'state', 'label', 'seat']):
        true[(kind, state if kind == 'AE' else 'India', str(label), int(seat))] = float(g.votes.sum())
    tot_fixed = 0
    for f in sorted(glob.glob(f'{D}/*.json')):
        b = os.path.basename(f)
        if b in ('index.json', 'search.json', 'polls.json', 'stats.json'):
            continue
        els = json.load(open(f, encoding='utf-8')); dirty = False
        for e in els:
            if e.get('approx') or e.get('partial') or CODE not in e['parties']:
                continue
            ci = e['parties'].index(CODE); moved = 0; seats_fixed = 0
            for s in e['seats']:
                flat = s[4]
                for k in range(0, len(flat), 2):
                    if flat[k] != ci:
                        continue
                    old = flat[k + 1]
                    new = true.get((e['kind'], e['state'], str(e['label']), s[0]), 0.0)
                    if new >= old - 0.5:
                        break
                    if new <= 0:
                        del flat[k:k + 2]
                    else:
                        flat[k + 1] = int(round(new))
                    s[5] = int(round(s[5] + old - max(new, 0)))
                    moved += old - max(new, 0); seats_fixed += 1
                    break
                # keep each seat's list sorted by votes
                pairs = sorted([(flat[k], flat[k + 1]) for k in range(0, len(flat), 2)], key=lambda x: -x[1])
                s[4] = [x for p in pairs for x in p]
            if seats_fixed:
                tot_fixed += 1; dirty = True
                print(e['id'], 'seats fixed', seats_fixed, 'votes moved to others', int(moved))
        if dirty:
            json.dump(els, open(f, 'w', encoding='utf-8'), separators=(',', ':'), ensure_ascii=False)
    print('elections repaired:', tot_fixed)

if __name__ == '__main__':
    main()
