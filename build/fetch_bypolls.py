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
SINCE = '2024-06-04'   # the Lok Sabha result
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
    if not name or name in ('–', '—', '-') or re.match(r'^(Vacant|None|N/?A)', name, re.I): return ''
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

def main():
    items = []
    try: items += parse_ls(fetch('By-elections to the 18th Lok Sabha'))
    except Exception as e: print('LS failed', e)
    for y in (2024, 2025, 2026):
        try: items += parse_assembly(fetch(f'{y} elections in India'), y)
        except Exception as e: print(y, 'failed', e)
    items = [i for i in items if i['date'] >= SINCE]
    seen = set(); uniq = []
    for i in sorted(items, key=lambda x: (x['date'], x['state'], x['seat'])):
        k = (i['date'], i['state'], i['seat'])
        if k not in seen: seen.add(k); uniq.append(i)
    for i in uniq:
        i['changed'] = bool(i['prevParty'] and i['winParty'] and i['prevParty'] != i['winParty'])
    json.dump({'v': 1, 'since': SINCE, 'source': 'Wikipedia, By-elections to the 18th Lok Sabha and the by-election tables of the 2024, 2025 and 2026 elections in India', 'items': uniq},
              open(os.path.join(ROOT, 'source', 'ref', 'bypolls.json'), 'w', encoding='utf-8'), separators=(',', ':'), ensure_ascii=False)
    print('by-elections:', len(uniq), '; LS', sum(1 for i in uniq if i['kind'] == 'LS'), '; changed hands', sum(1 for i in uniq if i['changed']))
    for i in uniq[:6] + uniq[-4:]: print(' ', i['date'], i['kind'], i['state'], '|', i['seat'], '|', i['prevParty'], '->', i['winParty'], '|', i['winner'])

if __name__ == '__main__':
    main()
