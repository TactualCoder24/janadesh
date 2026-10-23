"""By-elections since the 2024 Lok Sabha election: seat, state, date, who held it before (and why it fell vacant), who won.

Reads the Wikipedia tables "By-elections to the 18th Lok Sabha" and the by-election tables of "2024 / 2025 / 2026 elections in India"
(cached in dl/wiki/) and writes source/ref/bypolls.json.

  python build/fetch_bypolls.py
"""
import os, re, sys, json, time, urllib.request, urllib.parse, urllib.error
from bs4 import BeautifulSoup
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import parties as P
HERE = os.path.dirname(os.path.abspath(__file__)); ROOT = os.path.dirname(HERE)
CACHE = os.path.join(ROOT, 'dl', 'wiki'); os.makedirs(CACHE, exist_ok=True)
SINCE = '2024-06-04'   # the 18th Lok Sabha result
FROM = '2014-05-16'    # the 16th Lok Sabha result: how far back the history goes
TERMS = [('2014-05-16', 16), ('2019-05-23', 17), ('2024-06-04', 18)]
MONTHS = {m: i + 1 for i, m in enumerate(['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'])}
STATE = {'Jammu & Kashmir': 'Jammu & Kashmir', 'Jammu and Kashmir': 'Jammu & Kashmir', 'Odisha': 'Odisha', 'Orissa': 'Odisha', 'NCT of Delhi': 'Delhi', 'Puducherry': 'Puducherry', 'Pondicherry': 'Puducherry', 'Keralam': 'Kerala'}
REASON = re.compile(r'^(Died|Death|Resign|Disqualif|Elected|Vacat|Expel|Convict|Appoint|Join|Cancel|Nominat|Contested|Unseated|Seat vacated|Unknown|Removed|Withdrew|Sentenced)', re.I)

def fetch(title):
    f = os.path.join(CACHE, 'bp-' + re.sub(r'[^a-z0-9]+', '-', title.lower()) + '.json')
    if not os.path.exists(f):
        url = 'https://en.wikipedia.org/w/api.php?action=parse&prop=text&format=json&formatversion=2&redirects=1&page=' + urllib.parse.quote(title.replace(' ', '_'))
        req = urllib.request.Request(url, headers={'User-Agent': 'janadesh-build/1.0 (https://github.com/TactualCoder24/janadesh)'})
        for attempt in range(6):
            try:
                data = urllib.request.urlopen(req, timeout=120).read(); break
            except (urllib.error.HTTPError, urllib.error.URLError, TimeoutError) as e:
                if getattr(e, 'code', 0) not in (0, 429, 500, 502, 503): raise
                time.sleep(10 * (attempt + 1))
        else:
            raise RuntimeError('rate limited')
        open(f, 'wb').write(data); time.sleep(2.5)
    return json.load(open(f, encoding='utf-8'))['parse']['text']

def txt(c):
    for sup in c.find_all(['sup', 'style']): sup.decompose()
    return re.sub(r'\s+', ' ', c.get_text(' ', strip=True)).strip()

def grid(table):
    g = []; pend = {}
    for tr in table.find_all('tr'):
        row = []; col = 0; cells = tr.find_all(['th', 'td']); ci = 0
        while ci < len(cells) or col in pend:
            if col in pend:
                tx0, left = pend[col]; row.append(tx0); left -= 1
                if left: pend[col] = (tx0, left)
                else: del pend[col]
                col += 1; continue
            c = cells[ci]; ci += 1; tx = txt(c)
            rs = int(re.sub(r'\D', '', c.get('rowspan', '1')) or 1); cs = int(re.sub(r'\D', '', c.get('colspan', '1')) or 1)
            for k in range(cs):
                row.append(tx)
                if rs > 1: pend[col] = (tx, rs - 1)
                col += 1
        g.append(row)
    return g

def iso(s):
    m = re.search(r'(\d{1,2})(?:\s*(?:&|and|,|–|-)\s*\d{1,2})?\s+([A-Z][a-z]+)\s+(\d{4})', s or '')
    return f'{m.group(3)}-{MONTHS[m.group(2)]:02d}-{int(m.group(1)):02d}' if m and m.group(2) in MONTHS else None

def code(name):
    if not name or name in ('–', '—', '-') or re.match(r'^(Vacant|None|N/?A)', name, re.I): return ''
    return P.norm(name)

def is_party(c):
    return bool(c) and bool(re.search(r'[A-Za-z]{2}', c)) and (len(c) < 60) and (P.norm(c) != c.upper().replace(' ', '')[:14] or c in ('Independent',) or 'Party' in c or 'Congress' in c or 'Dal' in c or 'Front' in c)

def state_of(t):
    h = t.find_previous(['h2', 'h3', 'h4'])
    s = re.sub(r'\[.*?\]|edit', '', h.get_text(' ', strip=True) if h else '').strip()
    return STATE.get(s, s)

def parse_assembly(html, year):
    soup = BeautifulSoup(html, 'lxml'); out = []
    for t in soup.find_all('table'):
        g = grid(t)
        if len(g) < 3 or not any('Previous MLA' in (c or '') for c in g[0]) or not any('Elected MLA' in (c or '') for c in g[0]): continue
        st = state_of(t)
        for row in g[2:]:
            toks = [c for c in row if c and c not in ('–',)]
            if not toks: continue
            d = iso(toks[0])
            ri = next((i for i, c in enumerate(toks) if REASON.match(c)), None)
            if not d or ri is None or ri < 3: continue
            before = toks[1:ri]; after = toks[ri + 1:]
            if before and re.match(r'^\d{1,3}$', before[0]): before = before[1:]
            if not before or not after: continue
            seat = before[0]; pm = before[1] if len(before) > 1 else ''; pp = before[2] if len(before) > 2 else ''
            wm = after[0]; wp = after[1] if len(after) > 1 else ''
            out.append({'date': d, 'kind': 'AE', 'state': st, 'seat': seat, 'prev': pm, 'prevParty': code(pp), 'reason': toks[ri], 'winner': wm, 'winParty': code(wp)})
    return out

def parse_ls(html):
    soup = BeautifulSoup(html, 'lxml'); out = []
    for t in soup.find_all('table'):
        g = grid(t)
        if len(g) < 3 or not any('Constituency' in (c or '') for c in g[0]) or not any('Before election' in (c or '') for c in g[0]): continue
        for row in g[2:]:
            toks = [c for c in row if c is not None]
            if len(toks) < 10: continue
            try:
                seat, st, vac, cause, dt, pm, _, pp, wm, _, wp = toks[1], toks[2], toks[3], toks[4], toks[5], toks[6], toks[7], toks[8], toks[9], toks[10], toks[11]
            except IndexError:
                continue
            d = iso(dt)
            if d: out.append({'date': d, 'kind': 'LS', 'state': STATE.get(st, st), 'seat': seat, 'prev': pm, 'prevParty': code(pp), 'reason': cause, 'winner': wm, 'winParty': code(wp)})
    return out

_LSST = None
def ls_state(seat):
    """The older Lok Sabha by-election tables have no state column: take it from the seat name in the Lok Sabha data (only when the name is unique)."""
    global _LSST
    if _LSST is None:
        _LSST = {}
        for e in sorted(json.load(open(os.path.join(ROOT, 'source', 'data', 'ls.json'), encoding='utf-8')), key=lambda e: e['year']):
            cur = {}
            for st in e['seats']:
                r = e['regions'][st[3]] if st[3] >= 0 else ''
                cur.setdefault(key(st[1]), set()).add(STATE.get(r, r))
            _LSST.update(cur)   # the latest election that has the seat wins, so old state names are replaced
    v = _LSST.get(key(seat), set())
    return next(iter(v)) if len(v) == 1 else ''

def key(n): return re.sub(r'[^a-z0-9]+', '', re.sub(r'\(.*?\)', '', str(n).lower()))

def parse_old(html):
    """The yearly pages up to 2023 list one table per state with the columns Date, Constituency, MLA/MP before election, Party before election (twice: a colour cell, then the name), Elected MLA/MP, Party after election."""
    soup = BeautifulSoup(html, 'lxml'); out = []
    for t in soup.find_all('table'):
        g = grid(t)
        if len(g) < 2: continue
        hdr = [(c or '').strip().lower() for c in g[0]]
        if 'constituency' not in hdr or not any('before election' in c for c in hdr) or not any(c.startswith('elected') for c in hdr): continue
        ix = lambda pred: [i for i, c in enumerate(hdr) if pred(c)]
        di, ci = ix(lambda c: c == 'date'), ix(lambda c: c == 'constituency')
        pm, pp = ix(lambda c: c in ('mla before election', 'mp before election')), ix(lambda c: c == 'party before election')
        wm, wp = ix(lambda c: c in ('elected mla', 'elected mp')), ix(lambda c: c == 'party after election')
        si = ix(lambda c: c in ('state/ut', 'state', 'state / ut'))
        if not (di and ci and pm and wm and pp and wp): continue
        kind = 'LS' if 'mp before election' in hdr else 'AE'
        st = state_of(t) if kind == 'AE' else ''
        for row in g[1:]:
            if len(row) < max(di + ci + pm + wm + pp + wp) + 1: continue
            d = iso(row[di[0]])
            if not d: continue
            seat = re.sub(r'\s*\((SC|ST)\)\s*$', '', row[ci[0]]).strip()
            if not seat: continue
            state = (STATE.get(row[si[0]], row[si[0]]) if si else ls_state(seat)) if kind == 'LS' else st
            prevParty = next((code(row[i]) for i in reversed(pp) if row[i] and not re.match(r'^[\s\d]*$', row[i])), '')
            winParty = next((code(row[i]) for i in reversed(wp) if row[i] and not re.match(r'^[\s\d]*$', row[i])), '')
            out.append({'date': d, 'kind': kind, 'state': state, 'seat': seat, 'prev': row[pm[0]], 'prevParty': prevParty, 'reason': '', 'winner': row[wm[0]], 'winParty': winParty})
    return out

def main():
    items = []
    try: items += parse_ls(fetch('By-elections to the 18th Lok Sabha'))
    except Exception as e: print('LS failed', e)
    for y in range(2014, 2027):
        try:
            h = fetch(f'{y} elections in India')
            items += parse_assembly(h, y) if y >= 2024 else []
            items += parse_old(h)
        except Exception as e: print(y, 'failed', e)
    items = [i for i in items if i['date'] >= FROM]
    seen = set(); uniq = []
    for i in sorted(items, key=lambda x: (x['date'], x['state'], x['seat'])):
        k = (i['date'], i['state'], i['seat'])
        if k not in seen: seen.add(k); uniq.append(i)
    term = lambda d: [n for f, n in TERMS if d >= f][-1]
    for i in uniq:
        i['term'] = term(i['date'])
        i['changed'] = bool(i['prevParty'] and i['winParty'] and i['prevParty'] != i['winParty'])
    json.dump({'v': 2, 'since': SINCE, 'from': FROM, 'source': 'Wikipedia, By-elections to the 18th Lok Sabha and the by-election tables of the 2014 to 2026 elections in India', 'items': uniq},
              open(os.path.join(ROOT, 'source', 'ref', 'bypolls.json'), 'w', encoding='utf-8'), separators=(',', ':'), ensure_ascii=False)
    print('by-elections:', len(uniq), '; LS', sum(1 for i in uniq if i['kind'] == 'LS'), '; changed hands', sum(1 for i in uniq if i['changed']))
    for i in uniq[:6] + uniq[-4:]: print(' ', i['date'], i['kind'], i['state'], '|', i['seat'], '|', i['prevParty'], '->', i['winParty'], '|', i['winner'])

if __name__ == '__main__':
    main()
