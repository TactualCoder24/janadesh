"""Stage 2: turn rows into per-election compact JSON, reconstruct summary-only elections."""
import os, sys, json, re, math, hashlib, collections
import numpy as np, pandas as pd
sys.path.insert(0, os.path.dirname(__file__))
import parties as P
import summary_data as SD
from scipy.optimize import linear_sum_assignment

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DL = os.environ.get('JANADESH_DL', os.path.join(ROOT, 'dl'))
OUT = os.path.join(ROOT, 'source', 'data')
rows = pd.read_pickle(os.path.join(os.path.dirname(__file__), 'rows.pkl'))
pcmap = pd.read_pickle(os.path.join(os.path.dirname(__file__), 'ls_pcmap.pkl'))
acattrs = json.load(open(os.path.join(DL, 'ac_attrs.json')))
KTOP = 7
def slug(s):
    return re.sub(r'[^a-z0-9]+', '-', str(s).lower()).strip('-')

MAPSTATE = {  # election state -> AC shapefile ST_NAME
    'Odisha': 'ORISSA', 'Uttarakhand': 'UTTARKHAND', 'Delhi': 'DELHI', 'Jammu & Kashmir': 'JAMMU & KASHMIR',
}
def mapstate(s):
    return MAPSTATE.get(s, s.upper())

AC = collections.defaultdict(dict)  # mapstate -> acno -> (name, dist, pc)
for a in acattrs:
    AC[a['ST_NAME']].setdefault(int(a['AC_NO']), (a['AC_NAME'], a['DIST_NAME'], a['PC_NAME']))

def simp(s):
    return re.sub(r'[^a-z]', '', str(s).lower())

def name_match(a, b):
    a, b = simp(a), simp(b)
    if not a or not b: return False
    return a[:5] == b[:5] or a in b or b in a

# ---------------- alliance defaults for assembly elections ----------------
AL = {
 ('Uttar Pradesh', '2017'): {'BJP': 'NDA', 'ADS': 'NDA', 'SBSP': 'NDA', 'SP': 'SP+INC', 'INC': 'SP+INC'},
 ('Uttar Pradesh', '2022'): {'BJP': 'NDA', 'ADS': 'NDA', 'NISHAD': 'NDA', 'SP': 'SP+', 'RLD': 'SP+', 'SBSP': 'SP+', 'ADK': 'SP+'},
 ('Punjab', '2017'): {'SAD': 'NDA', 'BJP': 'NDA', 'AAP': 'AAP+', 'LIP': 'AAP+'},
 ('Punjab', '2022'): {'SAD': 'SAD+BSP', 'BSP': 'SAD+BSP', 'BJP': 'NDA', 'PLC': 'NDA', 'SADS': 'NDA'},
 ('Assam', '2016'): {'BJP': 'NDA', 'AGP': 'NDA', 'BPF': 'NDA'},
 ('Assam', '2021'): {'BJP': 'NDA', 'AGP': 'NDA', 'UPPL': 'NDA', 'INC': 'Mahajot', 'AIUDF': 'Mahajot', 'BPF': 'Mahajot',
                     'CPI(M)': 'Mahajot', 'CPI': 'Mahajot', 'CPIML': 'Mahajot', 'RJD': 'Mahajot'},
 ('West Bengal', '2016'): {'INC': 'Left+INC', 'CPI(M)': 'Left+INC', 'CPI': 'Left+INC', 'AIFB': 'Left+INC', 'RSP': 'Left+INC'},
 ('West Bengal', '2021'): {'INC': 'Sanyukta Morcha', 'CPI(M)': 'Sanyukta Morcha', 'CPI': 'Sanyukta Morcha',
                           'AIFB': 'Sanyukta Morcha', 'RSP': 'Sanyukta Morcha', 'AISF': 'Sanyukta Morcha', 'ISF': 'Sanyukta Morcha'},
 ('Tamil Nadu', '2016'): {'DMK': 'DMK+', 'INC': 'DMK+', 'IUML': 'DMK+'},
 ('Tamil Nadu', '2021'): {'DMK': 'DMK+', 'INC': 'DMK+', 'VCK': 'DMK+', 'CPI': 'DMK+', 'CPI(M)': 'DMK+', 'MDMK': 'DMK+', 'IUML': 'DMK+',
                          'AIADMK': 'AIADMK+', 'PMK': 'AIADMK+', 'BJP': 'AIADMK+', 'TMC(M)': 'AIADMK+'},
 ('Tamil Nadu', '2026'): {'DMK': 'DMK+', 'INC': 'DMK+', 'VCK': 'DMK+', 'CPI': 'DMK+', 'CPI(M)': 'DMK+', 'MDMK': 'DMK+', 'IUML': 'DMK+',
                          'AIADMK': 'AIADMK+', 'BJP': 'AIADMK+', 'PMK': 'AIADMK+', 'TMC(M)': 'AIADMK+'},
 ('Puducherry', '2021'): {'AINRC': 'NDA', 'BJP': 'NDA', 'AIADMK': 'NDA', 'INC': 'SPA', 'DMK': 'SPA'},
 ('Puducherry', '2026'): {'AINRC': 'NDA', 'BJP': 'NDA', 'AIADMK': 'NDA', 'INC': 'SPA', 'DMK': 'SPA'},
 ('Andhra Pradesh', '2024'): {'TDP': 'NDA', 'JSP': 'NDA', 'BJP': 'NDA', 'INC': 'INDIA', 'CPI': 'INDIA', 'CPI(M)': 'INDIA'},
 ('Telangana', '2018'): {'INC': 'Praja Kutami', 'TDP': 'Praja Kutami', 'CPI': 'Praja Kutami', 'TJS': 'Praja Kutami'},
}
KERALA_LDF = ['CPI(M)', 'CPI', 'JDS', 'NCP', 'CON(S)', 'INL', 'LJD', 'KEC(B)', 'KCB']
KERALA_UDF = ['INC', 'IUML', 'KECJ', 'RSP', 'CMP', 'KEC']
for y in ['1982', '1987', '1991', '1996', '2001', '2006', '2011', '2016', '2021', '2026']:
    d = {p: 'LDF' for p in KERALA_LDF}
    d.update({p: 'UDF' for p in KERALA_UDF})
    d['KCM'] = 'LDF' if int(y) >= 2021 else 'UDF'
    d['BJP'] = 'NDA'; d['BDJS'] = 'NDA'
    AL[('Kerala', y)] = d

MIN_ALLY_SEATS = 3

def build_election(kind, state, label, g):
    """g: rows of one election. returns dict."""
    year = int(g.year.iloc[0])
    g = g.copy()
    def ctx(pt):
        if state == 'Tamil Nadu' and pt == 'AITC': return 'TMC(M)'
        if state == 'Puducherry' and pt == 'AITC' and year < 2010: return 'TMC(M)'
        if state == 'Andhra Pradesh' and pt == 'JP' and year >= 2014: return 'JSP'
        if state == 'Punjab' and pt == 'ADS': return 'SADSF'
        if state == 'West Bengal' and pt in ('FBL', 'FB'): return 'AIFB'
        if pt == 'SP' and year < 1992: return 'SOC'
        if pt == 'JS': return 'BJS'
        if pt in ('FBL', 'FB'): return 'AIFB'
        return pt
    g['party'] = g.party.map(ctx)
    seats = []
    totals = collections.Counter()
    for seat, s in g.groupby('seat'):
        s = s[s.party != 'NOTA']
        agg = collections.Counter()
        oth = 0.0
        best = {}
        sec = {}
        for pty, v in zip(s.party, s.votes):
            if pty in best:
                # duplicate party candidates (IND etc): keep the largest, rest to others
                lo = min(v, best[pty]); best[pty] = max(v, best[pty])
                sec[pty] = max(sec.get(pty, 0), lo)
                if pty == 'IND' or pty == 'OTH':
                    oth += lo
            else:
                best[pty] = v
        if 'OTH' in best:
            oth += best.pop('OTH')
        items = sorted(best.items(), key=lambda x: -x[1])
        top = items[:KTOP]
        oth += sum(v for _, v in items[KTOP:])
        first = s.iloc[0]
        cat = first['cat'] if isinstance(first['cat'], str) else None
        if not cat:
            nm = str(first['name'])
            cat = 'SC' if '(SC)' in nm.upper() else ('ST' if '(ST)' in nm.upper() else 'GEN')
        name = re.sub(r'\s*\((SC|ST)\)\s*$', '', str(first['name']), flags=re.I).strip()
        reg = first['region'] if isinstance(first['region'], str) else None
        el = first['electors'] if pd.notna(first['electors']) else None
        lead = top[0][0] if top else None
        seats.append(dict(no=int(seat), name=name, cat=cat_short(cat), region=reg, res=top, oth=oth,
                          el=float(el) if el else None, sec=(lead, sec.get(lead, 0)) if lead else None))
        for p_, v in top: totals[p_] += v
        totals['OTH'] += oth
    # alliances
    alliances = {}
    if kind == 'LS':
        a = g[g.alliance.notna() & (g.alliance.astype(str) != 'nan')]
        if len(a):
            m = a.groupby('party').alliance.agg(lambda x: x.value_counts().index[0])
            alliances = {k: norm_alliance(v) for k, v in m.items() if norm_alliance(v) and k not in ('IND', 'OTH', 'NOTA')}
    else:
        alliances = dict(AL.get((state, label), {}))
    return dict(kind=kind, state=state, year=year, label=label, seats=seats, alliances=alliances, totals=totals)

def cat_short(c):
    c = str(c).upper()
    if c.startswith('SC'): return 'SC'
    if c.startswith('ST'): return 'ST'
    return 'GEN'

def norm_alliance(a):
    a = str(a).strip()
    if a in ('', 'nan', 'None', 'Others', 'OTHERS', 'Other'): return None
    a = a.replace('+', '').strip()
    return {'Congress': 'INC+', 'INC': 'INC+'}.get(a, a)

def multi_member(e):
    """1951/1957 double-member seats: give 2 members to seats with ~2x electors (approximation)."""
    if e['kind'] != 'LS' or e['year'] > 1961:
        return
    target = {1951: 489, 1957: 494}.get(e['year'])
    if not target: return
    extra = target - len(e['seats'])
    if extra <= 0: return
    by_state = collections.defaultdict(list)
    for s in e['seats']:
        if s['el']: by_state[s['region']].append(s['el'])
    med = {k: np.median(v) for k, v in by_state.items()}
    cands = sorted([s for s in e['seats'] if s['el'] and len(s['res']) >= 2],
                   key=lambda s: -(s['el'] / med.get(s['region'], s['el'])))
    for s in cands[:extra]:
        s['m'] = 2

# ---------------- reconstruct summary-only elections ----------------
def noise(*k):
    h = int(hashlib.md5('|'.join(map(str, k)).encode()).hexdigest()[:8], 16) / 0xFFFFFFFF
    return math.exp((h - 0.5) * 1.6)

def reconstruct(summary, templates):
    st, yr, N = summary['state'], summary['year'], summary['seats']
    cands = [t for t in templates if t['state'] == st]
    same = [t for t in cands if len(t['seats']) == N]
    pool = same or cands
    T = min(pool, key=lambda t: (abs(t['year'] - yr), -t['year']))
    tseats = sorted(T['seats'], key=lambda s: s['no'])
    # resize seats if needed
    if len(tseats) != N:
        base = tseats
        tseats = [dict(base[i % len(base)], no=i + 1, name=f'AC {i+1}') for i in range(N)]
    rows = summary['rows']
    pcodes = [r[0] for r in rows if r[0] not in ('NOTA',)]
    share = {r[0]: r[3] / 100 for r in rows if r[0] != 'NOTA'}
    nota = sum(r[3] for r in rows if r[0] == 'NOTA') / 100
    seatsw = {r[0]: r[2] for r in rows if r[0] != 'NOTA'}
    tot_named = sum(share.values())
    share_oth = max(0.0, 1 - nota - tot_named)
    # template shares
    tp = []
    for s in tseats:
        tot = sum(v for _, v in s['res']) + s['oth']
        tp.append({k: v / tot for k, v in s['res']} if tot else {})
    # lineage groups: summary parties mapping to the same template party split its share
    def src(pc):
        return P.LINEAGE.get(pc, pc)
    groups = collections.defaultdict(list)
    for pc in pcodes:
        groups[src(pc)].append(pc)
    n = len(tseats)
    B = np.zeros((n, len(pcodes)))
    for j, pc in enumerate(pcodes):
        sp = src(pc)
        gsum = sum(share[x] for x in groups[sp]) or 1
        for i in range(n):
            t = tp[i].get(sp, 0.0)
            if t > 0.005:
                B[i, j] = t * share[pc] / gsum * noise(st, yr, i, pc) ** 0.3
            else:
                B[i, j] = share[pc] * noise(st, yr, i, pc) * 0.6
    allies = collections.defaultdict(list)
    for r in rows:
        if r[1] and r[0] not in ('IND', 'OTH', 'NOTA'):
            allies[r[1]].append(pcodes.index(r[0]))
    for mem in allies.values():
        if len(mem) < 2: continue
        # each seat is contested by one member; spread seats among members in proportion to their share
        want = np.array([share[pcodes[j]] for j in mem]); want = want / want.sum() * n
        rel = B[:, mem] / np.maximum(np.array([share[pcodes[j]] for j in mem]), 1e-6)
        cost = np.zeros((n, n)); slotsA = []
        for t, j in enumerate(mem):
            slotsA += [t] * int(round(want[t]))
        while len(slotsA) < n: slotsA.append(int(np.argmax(want)))
        slotsA = slotsA[:n]
        for c_, t in enumerate(slotsA): cost[:, c_] = -rel[:, t]
        r_, c_ = linear_sum_assignment(cost)
        keep = np.zeros((n, len(mem)), dtype=bool)
        keep[r_, [slotsA[x] for x in c_]] = True
        tot_al = B[:, mem].sum(1)
        for t, j in enumerate(mem):
            B[:, j] = np.where(keep[:, t], tot_al, 0.0)
    w = np.array([sum(v for _, v in s['res']) + s['oth'] for s in tseats], dtype=float)
    w = w / w.mean()
    target = np.array([share[pc] for pc in pcodes])
    seats_target = np.array([seatsw[pc] for pc in pcodes])
    def ipf(B, it=40):
        for _ in range(it):
            cur = (B * w[:, None]).sum(0) / w.sum()
            f = np.where(cur > 0, target / np.maximum(cur, 1e-9), 1)
            B = B * f
            rs = B.sum(1)
            cap = 1 - nota - 0.002
            B = np.where(rs[:, None] > cap, B * (cap / rs)[:, None], B)
        return B
    B = ipf(B)
    # assign winners to match actual seat counts
    slots = [j for j, pc in enumerate(pcodes) for _ in range(int(seats_target[j]))]
    while len(slots) < n:
        slots.append(int(np.argmax(target)))
    slots = slots[:n]
    cost = np.zeros((n, n))
    for c, j in enumerate(slots):
        lead = B[:, j] - np.max(np.delete(B, j, axis=1), axis=1)
        cost[:, c] = -lead
    r, c = linear_sum_assignment(cost)
    winner = np.zeros(n, dtype=int)
    winner[r] = [slots[x] for x in c]
    for rnd in range(8):
        for i in range(n):
            j = winner[i]
            others = np.delete(B[i], j)
            mx = others.max() if len(others) else 0
            if B[i, j] <= mx:
                B[i, j] = mx * (1.03 + 0.12 * (noise(st, yr, i, 'm') - 0.4) ** 2) + 0.004
        if rnd < 7:
            B = ipf(B, 6)
    # final pass guarantees winners
    for i in range(n):
        j = winner[i]
        others = np.delete(B[i], j)
        if len(others) and B[i, j] <= others.max():
            B[i, j] = others.max() + 0.003
    growth = 1.0 + 0.02 * (yr - T['year'])
    seats = []
    for i, s in enumerate(tseats):
        tot = (sum(v for _, v in s['res']) + s['oth']) * max(growth, 0.6)
        res = sorted([(pcodes[j], round(B[i, j] * tot)) for j in range(len(pcodes)) if B[i, j] * tot >= 1], key=lambda x: -x[1])
        named = sum(v for _, v in res)
        oth = max(0, tot * (1 - nota) - named)
        seats.append(dict(no=s['no'], name=s['name'], cat=s['cat'], region=s.get('region'), res=res[:KTOP],
                          oth=oth + sum(v for _, v in res[KTOP:]), el=None))
    al = {r[0]: r[1] for r in rows if r[1]}
    return dict(kind='AE', state=st, year=yr, label=str(yr), seats=seats, alliances=al, approx=True,
                template=T['label'], note=summary.get('note', ''))

OVR_DIR = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'seat_overrides')

def apply_overrides(e):
    """Replace estimated seat winners with real constituency results (seat_overrides/<State>-<Year>.csv)."""
    f = os.path.join(OVR_DIR, f"{e['state']}-{e['year']}.csv")
    if not os.path.exists(f):
        return e
    rows = {}
    for line in open(f, encoding='utf-8'):
        p = [x.strip() for x in line.rstrip('\n').split(',')]
        if len(p) < 6 or not p[0].isdigit():
            continue
        rows[int(p[0])] = p
    fix = lambda c: c if c in ('', 'NONE') else (c if c in P.DISPLAY or c in ('IND', 'OTH') else 'OTH')
    fl = lambda x: float(x) / 100 if x else None
    done = 0
    for s in e['seats']:
        p = rows.get(s['no'])
        if not p:
            continue
        W, wp, R, rp = fix(p[2]), fl(p[3]), fix(p[4]), fl(p[5])
        if R == W and R not in ('IND', 'OTH'):
            R = ''
        tot = sum(v for _, v in s['res']) + s['oth']
        sh = collections.OrderedDict((k, v / tot) for k, v in s['res'])
        oth = s['oth'] / tot
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
            # winner (and runner) known, shares unknown: keep estimated shares, reorder
            order = sorted(sh.items(), key=lambda x: -x[1])
            vals = [v for _, v in order]
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
        res = sorted([(k, round(v * tot)) for k, v in sh.items() if v * tot >= 1], key=lambda x: -x[1])
        s['res'] = res[:KTOP]
        s['oth'] = oth * tot + sum(v for _, v in res[KTOP:])
        if p[1] and (not s.get('name') or s['name'].startswith('AC ') or True):
            s['name'] = p[1]
        done += 1
    if done >= 0.9 * len(e['seats']):
        e['approx'] = False
        e['partial'] = True
        e['note'] = 'Constituency winners and runners-up are the official results; smaller-party votes in each seat are estimated.'
    print('override', e['state'], e['year'], done, '/', len(e['seats']))
    return e

def pack(e, eid):
    tot = collections.Counter()
    for s in e['seats']:
        for p_, v in s['res']: tot[p_] += v
        tot['OTH'] += s['oth']
    order = [p_ for p_, _ in tot.most_common() if p_ != 'OTH'] + ['OTH']
    idx = {p_: i for i, p_ in enumerate(order)}
    S = []
    regions = []
    ridx = {}
    for s in sorted(e['seats'], key=lambda s: s['no']):
        flat = []
        for p_, v in s['res']:
            flat += [idx[p_], int(round(v))]
        r = s.get('region')
        if r is not None and r not in ridx:
            ridx[r] = len(regions); regions.append(r)
        rec = [s['no'], s['name'], s['cat'], ridx.get(r, -1), flat, int(round(s['oth']))]
        if s.get('m'):
            sp = s.get('sec')
            rec += [s['m'], [idx[sp[0]], int(sp[1])] if sp and sp[0] in idx else None]
        S.append(rec)
    return dict(id=eid, kind=e['kind'], state=e['state'], year=e['year'], label=e['label'],
                approx=bool(e.get('approx')), partial=bool(e.get('partial')), template=e.get('template'), note=e.get('note', ''),
                parties=order, alliances={k: v for k, v in e['alliances'].items() if k in idx},
                regions=regions, seats=S, map=e.get('map'), mapoff=e.get('mapoff', 0))

def main():
    elections = []
    for (kind, state, label), g in rows.groupby(['kind', 'state', 'label']):
        if kind == 'LS':
            continue
        e = build_election(kind, state, label, g)
        elections.append(e)
    # LS: whole country per year
    for label, g in rows[rows.kind == 'LS'].groupby('label'):
        e = build_election('LS', 'India', label, g)
        multi_member(e)
        elections.append(e)
    # drop tiny/garbage assembly elections (<10 seats unless small state)
    small = {'Puducherry', 'Sikkim', 'Goa', 'Mizoram', 'Delhi'}
    elections = [e for e in elections if e['kind'] == 'LS' or len(e['seats']) >= 25 or e['state'] in small]
    have = {(e['state'], e['label']) for e in elections if e['kind'] == 'AE'}
    templates = [e for e in elections if e['kind'] == 'AE']
    for s in SD.S:
        if (s['state'], str(s['year'])) in have:
            continue
        elections.append(apply_overrides(reconstruct(s, templates)))
    # region (district) for AE using the AC map when names agree
    for e in elections:
        if e['kind'] != 'AE': continue
        ms = mapstate(e['state'])
        acm = AC.get(ms, {})
        n = len(e['seats'])
        off = 119 if (e['state'] == 'Andhra Pradesh' and e['year'] >= 2014) else 0
        if e['state'] == 'Telangana':
            acm = AC.get('ANDHRA PRADESH', {})
        good = sum(1 for s in e['seats'] if s['no'] + off in acm and name_match(s['name'], acm[s['no'] + off][0]))
        ok = bool(acm) and good >= 0.6 * n
        if e.get('approx') and e['state'] in ('Assam', 'Jammu & Kashmir'):
            ok = False  # new delimitation, old map would mislead
        e['mapoff'] = off
        # templates for approx elections inherit map if template matched
        if e.get('approx') and acm and n == len(acm):
            ok = ok or good >= 0.5 * n
        if ok:
            e['map'] = 'ac/' + slug('Andhra Pradesh' if e['state'] == 'Telangana' else e['state'])
            for s in e['seats']:
                if s['no'] + off in acm and not s.get('region'):
                    s['region'] = acm[s['no'] + off][1].title()
    # LS map: 2009+ use PC map keyed by state|pcno
    pm = pcmap.set_index(['year', 'seat'])
    for e in elections:
        if e['kind'] == 'LS' and e['year'] >= 2009:
            e['map'] = 'pc'
            for s in e['seats']:
                try:
                    r = pm.loc[(e['year'], s['no'])]
                    s['mapkey'] = f"{r.state}|{int(r.pcno)}"
                except KeyError:
                    pass
    # write
    index = []
    bundles = collections.defaultdict(list)
    for e in sorted(elections, key=lambda e: (e['kind'], e['state'], e['year'], e['label'])):
        eid = ('ls-' if e['kind'] == 'LS' else 'ae-' + slug(e['state']) + '-') + slug(e['label'])
        pk = pack(e, eid)
        if e['kind'] == 'LS' and e.get('map') == 'pc':
            pk['mapkeys'] = [s.get('mapkey') for s in sorted(e['seats'], key=lambda s: s['no'])]
        file = 'ls' if e['kind'] == 'LS' else 'ae-' + slug(e['state'])
        bundles[file].append(pk)
        # quick summary for the index
        wins = collections.Counter()
        for s in pk['seats']:
            flat = s[4]
            if flat:
                wins[pk['parties'][flat[0]]] += (s[6] if len(s) > 6 else 1)
        index.append(dict(id=eid, kind=e['kind'], state=e['state'], year=e['year'], label=e['label'], file=file,
                          seats=sum(s[6] if len(s) > 6 else 1 for s in pk['seats']), approx=pk['approx'], partial=pk.get('partial', False),
                          map=pk['map'], top=wins.most_common(3)))
    used = set()
    for f, lst in bundles.items():
        for pk in lst: used.update(pk['parties'])
        json.dump(lst, open(f'{OUT}/{f}.json', 'w'), separators=(',', ':'))
    meta = {c: {'n': P.display(c), 'c': P.color(c)} for c in sorted(used)}
    json.dump(dict(elections=index, parties=meta), open(f'{OUT}/index.json', 'w'), separators=(',', ':'))
    for i in index:
        print(i['id'], i['seats'], 'APPROX' if i['approx'] else '', i['map'] or '', i['top'])

if __name__ == '__main__':
    main()
