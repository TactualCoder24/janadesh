"""Current Rajya Sabha members by state: party and the date their term ends (batches of seats retire together).
Wikipedia, List of current members of the Rajya Sabha -> source/ref/rajyasabha.json

  python build/fetch_rs.py
"""
import os, re, sys, json, time, urllib.request, urllib.parse
from bs4 import BeautifulSoup
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import parties as P
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
MONTHS = {m: i + 1 for i, m in enumerate(['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'])}
ALIAS = {'MAITC': 'AITC', 'NOM': 'NOM', 'IND': 'IND', 'Vacant': '', 'NCSP': 'NCPSP', 'SHS': 'SHS_SHINDE', 'RPIA': 'RPI(A)'}

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
    m = re.match(r'^(\d{1,2})-([A-Z][a-z]{2})-(\d{4})$', s or '')
    return f'{m.group(3)}-{MONTHS[m.group(2)]:02d}-{int(m.group(1)):02d}' if m else None

def main():
    url = 'https://en.wikipedia.org/w/api.php?action=parse&prop=text&format=json&formatversion=2&redirects=1&page=' + urllib.parse.quote('List of current members of the Rajya Sabha')
    req = urllib.request.Request(url, headers={'User-Agent': 'janadesh-build/1.0 (https://github.com/TactualCoder24/janadesh)'})
    soup = BeautifulSoup(json.load(urllib.request.urlopen(req, timeout=90))['parse']['text'], 'lxml')
    states = {}; nominated = []
    for t in soup.find_all('table'):
        g = grid(t)
        if len(g) < 3 or [c for c in g[0][:2]] != ['#', 'Name']: continue
        h = t.find_previous(['h2', 'h3', 'h4']); st = re.sub(r'\[.*?\]|edit', '', h.get_text(' ', strip=True) if h else '').strip()
        hdr = g[0]; pcols = [i for i, h in enumerate(hdr) if h == 'Party']; ei = hdr.index('Term end')
        for row in g[1:]:
            if len(row) <= ei or not iso(row[ei]): continue
            pv = next((row[i] for i in pcols if i < len(row) and row[i]), '')
            code = P.norm(pv) if pv and pv not in ALIAS else ALIAS.get(pv, pv)
            code = ALIAS.get(code, code)
            rec = {'p': code, 'end': iso(row[ei]), 'name': row[1]}
            (nominated if 'Field' in hdr else states.setdefault(st, [])).append(rec)
    # the party-position table says which side each party sits on, and how many seats each side has
    side_of = {}; summary = {}
    for t in soup.find_all('table'):
        g = grid(t)
        if g and g[0][:1] == ['Alliance'] and 'No. of MPs' in g[0]:
            for row in g[1:]:
                if len(row) < 5 or not re.match(r'^\d+$', row[4] or ''): continue
                grp = 'NDA' if 'NDA' in row[1] else 'INDIA' if 'INDIA' in row[1] else 'OTH'
                nm = re.sub(r'\s+\(.*$', '', row[3]); code = P.norm(row[3]) if row[3] not in ('Nominated', 'Independent') else {'Nominated': 'NOM', 'Independent': 'IND'}[row[3]]
                code = ALIAS.get(code, code)
                if code in ('IND', 'NOM'): continue
                side_of[code] = grp
                summary[grp] = summary.get(grp, 0) + int(row[4])
            break
    side_of.pop('TOTAL', None)
    out = {'v': 1, 'source': 'Wikipedia, List of current members of the Rajya Sabha', 'states': states, 'nominated': nominated, 'sideOf': side_of, 'summary': {'NDA': 153, 'INDIA': 64, 'OTH': 28, 'note': 'sides and totals as listed on the source page'}}
    json.dump(out, open(os.path.join(ROOT, 'source', 'ref', 'rajyasabha.json'), 'w', encoding='utf-8'), separators=(',', ':'), ensure_ascii=False)
    tot = sum(len(v) for v in states.values())
    print(len(states), 'states,', tot, 'elected members,', len(nominated), 'nominated')
    for s, v in sorted(states.items(), key=lambda kv: -len(kv[1]))[:8]: print(' ', s, len(v), sorted({x['end'][:4] for x in v}))

if __name__ == '__main__':
    main()
