"""Chief ministers of every state: name, term, party, and the assembly (election year) they served under.

Reads the "List of chief ministers of <state>" pages on Wikipedia (cached in dl/wiki/cm-*.json) and writes source/ref/cms.json.

  python build/fetch_cms.py
"""
import os, re, sys, json, time, urllib.request, urllib.parse, urllib.error
from bs4 import BeautifulSoup
HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.dirname(HERE)
CACHE = os.path.join(ROOT, 'dl', 'wiki'); os.makedirs(CACHE, exist_ok=True)
D = os.path.join(ROOT, 'source', 'data')
TITLE = {'Jammu & Kashmir': 'Jammu and Kashmir', 'Punjab': 'Punjab, India', 'Dadra & Nagar Haveli and Daman & Diu': None}
FULL = {'Punjab': 'Chief Minister of Punjab, India', 'Andhra Pradesh': 'Chief Minister of Andhra Pradesh'}
MONTHS = {m: i + 1 for i, m in enumerate(['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'])}
DATE = re.compile(r'^(\d{1,2}) ([A-Z][a-z]+) (\d{4})$')

def slug(s): return re.sub(r'[^a-z0-9]+', '-', s.lower()).strip('-')

def fetch(state):
    f = os.path.join(CACHE, 'cm-' + slug(state) + '.json')
    if not os.path.exists(f):
        title = FULL.get(state) or 'List of chief ministers of ' + TITLE.get(state, state)
        url = 'https://en.wikipedia.org/w/api.php?action=parse&prop=text&format=json&formatversion=2&redirects=1&page=' + urllib.parse.quote(title.replace(' ', '_'))
        req = urllib.request.Request(url, headers={'User-Agent': 'janadesh-build/1.0 (https://github.com/TactualCoder24/janadesh)'})
        for attempt in range(6):
            try:
                data = urllib.request.urlopen(req, timeout=90).read(); break
            except (urllib.error.HTTPError, urllib.error.URLError, TimeoutError) as e:
                if getattr(e, 'code', 0) not in (0, 429, 500, 502, 503): raise
                time.sleep(10 * (attempt + 1))
        else:
            raise RuntimeError('rate limited')
        open(f, 'wb').write(data); time.sleep(2.5)
    j = json.load(open(f, encoding='utf-8'))
    return j['parse']['text'] if 'parse' in j else ''

def txt(c):
    for sup in c.find_all(['sup', 'style']): sup.decompose()
    return re.sub(r'\s+', ' ', c.get_text(' ', strip=True)).strip()

def iso(s):
    m = DATE.match(s)
    return f'{m.group(3)}-{MONTHS[m.group(2)]:02d}-{int(m.group(1)):02d}' if m and m.group(2) in MONTHS else None

def grid(table):
    """Expand rowspan / colspan into a rectangular grid of cell texts."""
    g = []; pend = {}
    for tr in table.find_all('tr'):
        row = []; col = 0; cells = tr.find_all(['th', 'td'])
        ci = 0
        while ci < len(cells) or col in pend:
            if col in pend:
                txt0, left = pend[col]; row.append(txt0); left -= 1
                if left: pend[col] = (txt0, left)
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

def parse(html):
    soup = BeautifulSoup(html, 'lxml'); best = []
    for t in soup.find_all('table'):
        g = grid(t)
        if len(g) < 4: continue
        hdr = [' '.join(g[r][c] for r in range(min(2, len(g))) if c < len(g[r])).lower() for c in range(max(len(r) for r in g[:2]))]
        pc = [i for i, h in enumerate(hdr) if 'party' in h]; nc = [i for i, h in enumerate(hdr) if ('name' in h or 'chief minister' in h or ('minister' in h and 'other' not in h and 'ministry' not in h)) and 'portrait' not in h]
        if not pc or not nc: continue
        ac = [i for i, h in enumerate(hdr) if 'assembly' in h or 'election' in h]
        numd = lambda row: any(re.match(r'^\(?\d{1,3}\)?$', c or '') for c in row[:3])
        cand = [row for row in g if len(row) > max(pc + nc) and any(iso(c) for c in row)]
        need_num = cand and sum(1 for r in cand if numd(r)) >= 0.5 * len(cand)
        out = []
        for row in g:
            if need_num and not numd(row): continue
            if len(row) <= max(pc + nc): continue
            dates = [(i, iso(c)) for i, c in enumerate(row) if iso(c)]
            inc = any(re.match(r'^(Incumbent|Present|Current)', c, re.I) for c in row)
            if not dates: continue
            name = next((row[i] for i in nc if re.search(r'[A-Za-z]{3}', row[i] or '')), '')
            name = re.split(r'\s+(?:MLA|MP|MLC|Member|Rajya|Lok)\b', name)[0]
            name = re.sub(r'\s*\([^)]*\d{4}[^)]*\)', '', name).strip()
            start = dates[0][1]; end = dates[1][1] if len(dates) > 1 else ('' if inc else None)
            name = re.sub(r'\s*[–—-]\s*$', '', name).strip()
            if end is None or not name or re.search(r"vacant|president'?s rule", name, re.I): continue
            party = next((row[i] for i in pc if re.search(r'[A-Za-z]{3}', row[i] or '')), '')
            asm = None
            for i in ac:
                m = re.search(r'\(\s*(\d{4})', row[i] or '') if i < len(row) else None
                if m: asm = int(m.group(1))
            if not any(o['name'] == name and o['from'] == start for o in out): out.append({'name': name, 'from': start, 'to': end or '', 'party': party, 'asm': asm})
        if len(out) > len(best): best = out
    return best

def main():
    ix = json.load(open(f'{D}/index.json', encoding='utf-8'))
    states = sorted({e['state'] for e in ix['elections'] if e['kind'] == 'AE'})
    res = {}
    for st in states:
        if TITLE.get(st, st) is None: continue
        try:
            terms = parse(fetch(st))
        except Exception as e:
            print('FAIL', st, e); continue
        for c in terms:   # typo on the source page
            if st == 'Punjab' and c['name'].startswith('Gurmukh Singh Musafir') and c['from'].startswith('1866'): c['from'] = '1966' + c['from'][4:]
        terms.sort(key=lambda x: x['from'])
        res[st] = terms
        print(f"{st}: {len(terms)} terms; first {terms[0]['name'] if terms else '-'} {terms[0]['from'] if terms else ''}; last {terms[-1]['name'] if terms else '-'} {terms[-1]['from'] if terms else ''} {terms[-1]['party'] if terms else ''}")
    json.dump({'v': 1, 'source': 'Wikipedia, List of chief ministers of each state', 'states': res}, open(os.path.join(ROOT, 'source', 'ref', 'cms.json'), 'w', encoding='utf-8'), separators=(',', ':'), ensure_ascii=False)
    print('cms.json:', len(res), 'states')

if __name__ == '__main__':
    main()
