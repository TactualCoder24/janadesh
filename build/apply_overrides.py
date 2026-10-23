"""Apply build/seat_overrides/<State>-<Year>.csv (real constituency winners and runners-up) to the packed election JSON in source/data/.

Same rules as build2.apply_overrides, but works on the packed files so it does not need the raw sources. Safe to re-run:
elections already flagged partial are skipped. After applying, party seat totals are checked against the official tallies in summary_data.py.

  python build/apply_overrides.py
"""
import os, sys, json, glob, collections
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import parties as P
import summary_data as SD

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
D = os.path.join(ROOT, 'source', 'data')
OVR = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'seat_overrides')
KTOP = 7
NOTE = 'Constituency winners and runners-up are the official results; smaller-party votes in each seat are estimated.'

def slug(s):
    import re
    return re.sub(r'[^a-z0-9]+', '-', str(s).lower()).strip('-')

def read_rows(f):
    rows = {}
    for line in open(f, encoding='utf-8'):
        p = [x.strip() for x in line.rstrip('\n').split(',')]
        if len(p) < 6 or not p[0].isdigit():
            continue
        rows[int(p[0])] = p
    return rows

def fix(c):
    return c if c in ('', 'NONE') else (c if c in P.DISPLAY or c in ('IND', 'OTH') else 'OTH')

def fl(x):
    return float(x) / 100 if x else None

def apply_seat(res, oth, p):
    """res: [(party, votes)] sorted desc; oth: other votes. Returns new (res, oth)."""
    W, wp, R, rp = fix(p[2]), fl(p[3]), fix(p[4]), fl(p[5])
    if R == W and R not in ('IND', 'OTH'):
        R = ''
    tot = sum(v for _, v in res) + oth
    sh = collections.OrderedDict()
    for k, v in res:
        sh[k] = sh.get(k, 0) + v / tot
    oth = oth / tot
    if R == 'NONE':  # returned unopposed
        sh = {W: 1.0}; oth = 0.0
    elif wp is not None:
        rest = {k: v for k, v in sh.items() if k not in (W, R)}
        used = wp + (rp or 0)
        if rp is None and R:
            rp = min(wp * 0.8, (1 - wp) * 0.6); used = wp + rp
        cap = max(0.0, 1 - used)
        rs = sum(rest.values()) + oth
        k_ = cap / rs if rs > 0 else 0
        top = (rp if rp is not None else wp) * 0.97
        rest = {k: min(v * k_, top) for k, v in rest.items()}
        oth = max(0.0, cap - sum(rest.values()))
        sh = dict(rest); sh[W] = wp
        if R and R != W: sh[R] = rp
        elif R: oth += rp
    else:
        order = sorted(sh.items(), key=lambda x: -x[1])
        if W not in sh: sh[W] = 0.0
        if R and R not in sh: sh[R] = 0.0
        names = [W] + ([R] if R else [])
        others = [k for k, _ in sorted(sh.items(), key=lambda x: -x[1]) if k not in names]
        allv = sorted(list(sh.values()), reverse=True)
        sh = {}
        for k, v in zip(names + others, allv):
            sh[k] = v
        if len(sh) == 1 or (len(allv) > 1 and allv[0] == allv[1]):
            sh[W] += 0.01
    out = sorted([(k, round(v * tot)) for k, v in sh.items() if v * tot >= 1], key=lambda x: -x[1])
    return out[:KTOP], oth * tot + sum(v for _, v in out[KTOP:])

def repack(e, seats):
    tot = collections.Counter()
    for s in seats:
        for p_, v in s['res']: tot[p_] += v
        tot['OTH'] += s['oth']
    order = [p_ for p_, _ in tot.most_common() if p_ != 'OTH'] + ['OTH']
    idx = {p_: i for i, p_ in enumerate(order)}
    out = []
    for s in seats:
        flat = []
        for p_, v in s['res']:
            flat += [idx[p_], int(round(v))]
        rec = [s['no'], s['name'], s['cat'], s['r'], flat, int(round(s['oth']))]
        if s.get('extra'):
            rec += s['extra']
        out.append(rec)
    e['parties'] = order
    e['seats'] = out
    e['alliances'] = {k: v for k, v in e['alliances'].items() if k in idx}

def main():
    index = json.load(open(f'{D}/index.json', encoding='utf-8'))
    summ = {(s['state'], str(s['year'])): s for s in SD.S}
    changed = 0
    for f in sorted(glob.glob(f'{D}/ae-*.json')):
        els = json.load(open(f, encoding='utf-8')); dirty = False
        for e in els:
            ovf = os.path.join(OVR, f"{e['state']}-{e['year']}.csv")
            if not os.path.exists(ovf) or e.get('partial'):
                continue
            rows = read_rows(ovf); done = 0; seats = []
            for s in e['seats']:
                flat = s[4]
                res = [(e['parties'][flat[k]], flat[k + 1]) for k in range(0, len(flat), 2)]
                rec = {'no': s[0], 'name': s[1], 'cat': s[2], 'r': s[3], 'res': res, 'oth': s[5], 'extra': s[6:] if len(s) > 6 else None}
                p = rows.get(s[0])
                if p:
                    rec['res'], rec['oth'] = apply_seat(res, s[5], p)
                    if p[1]: rec['name'] = p[1]
                    done += 1
                seats.append(rec)
            if done < 0.9 * len(e['seats']):
                print('skip (few rows)', e['id'], done, '/', len(e['seats']))
                continue
            repack(e, seats)
            e['approx'] = False; e['partial'] = True; e['note'] = NOTE
            # check winners against the official tallies
            wins = collections.Counter(e['parties'][s[4][0]] for s in e['seats'] if s[4])
            sm = summ.get((e['state'], str(e['year'])))
            bad = []
            if sm:
                for row in sm['rows']:
                    if row[2] and wins.get(row[0], 0) != row[2]:
                        bad.append(f'{row[0]} {wins.get(row[0], 0)} vs official {row[2]}')
            print('applied', e['id'], done, 'rows', 'OK' if not bad else 'MISMATCH ' + '; '.join(bad))
            ent = next(x for x in index['elections'] if x['id'] == e['id'])
            ent['approx'] = False; ent['partial'] = True
            ent['top'] = [list(x) for x in wins.most_common(3)]
            dirty = True; changed += 1
        if dirty:
            json.dump(els, open(f, 'w', encoding='utf-8'), separators=(',', ':'), ensure_ascii=False)
    json.dump(index, open(f'{D}/index.json', 'w', encoding='utf-8'), separators=(',', ':'), ensure_ascii=False)
    print('elections updated:', changed)

if __name__ == '__main__':
    main()
