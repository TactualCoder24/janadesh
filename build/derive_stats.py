"""Per-election summary numbers shared by the incumbency, representation and story features: source/data/stats.json

  id: { n: seats, lead: [party, seats], top: [[party, seats], ...], votes: [[party, vote share %], ...],
        women: [seats with known sex, women winners], age: [winners with known age, sum of ages],
        res: {SC: [reserved seats, {party: won}], ST: [...]} }
"""
import os, json, glob, collections
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
D = os.path.join(ROOT, 'source', 'data')
N = os.path.join(ROOT, 'source', 'names')

def main():
    out = {}
    official = json.load(open(os.path.join(os.path.dirname(os.path.abspath(__file__)), 'official_women.json'), encoding='utf-8'))
    for f in sorted(glob.glob(f'{D}/*.json')):
        base = os.path.basename(f)[:-5]
        if base in ('index', 'search', 'polls', 'stats'):
            continue
        names = {}
        nf = f'{N}/{base}.json'
        if os.path.exists(nf):
            names = json.load(open(nf, encoding='utf-8'))
        for e in json.load(open(f, encoding='utf-8')):
            P = e['parties']; seats = collections.Counter(); votes = collections.Counter(); tot = 0
            wk = wn = ak = asum = 0; res = {'SC': [0, collections.Counter()], 'ST': [0, collections.Counter()]}
            nm = names.get(e['id'])
            n = 0
            for i, s in enumerate(e['seats']):
                m = s[6] if len(s) > 6 else 1; n += m
                fl = s[4]
                w = P[fl[0]] if fl else None
                if w: seats[w] += m
                for k in range(0, len(fl), 2):
                    votes[P[fl[k]]] += fl[k + 1]; tot += fl[k + 1]
                tot += s[5]
                if s[2] in res:
                    res[s[2]][0] += 1
                    if w: res[s[2]][1][w] += 1
                r = nm[i] if nm and i < len(nm) else None
                if r and len(r) > 2 and r[2] in ('M', 'F'):
                    wk += 1; wn += 1 if r[2] == 'F' else 0
                if r and len(r) > 3 and r[3]:
                    ak += 1; asum += r[3]
            top = seats.most_common(6)
            out[e['id']] = {'n': n, 'lead': list(top[0]) if top else None, 'top': [list(x) for x in top],
                            'votes': [[p, round(100 * v / tot, 2)] for p, v in votes.most_common(6) if p != 'OTH'] if tot else [],
                            'women': [wk, wn], 'age': [ak, asum],
                            **({'wOff': official[e['id']]} if e['id'] in official and (wk < 0.7 * n or abs(wn - official[e['id']]) > 3) else {}),
                            'res': {k: [v[0], dict(v[1].most_common(8))] for k, v in res.items() if v[0]}}
    json.dump(out, open(f'{D}/stats.json', 'w', encoding='utf-8'), separators=(',', ':'), ensure_ascii=False)
    print('stats:', len(out), 'elections,', round(os.path.getsize(f'{D}/stats.json') / 1e3), 'KB')

if __name__ == '__main__':
    main()
