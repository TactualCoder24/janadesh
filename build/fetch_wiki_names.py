"""Winner and runner-up names for the elections rebuilt from party summaries (those with a build/seat_overrides CSV).

Fetches each state election page from Wikipedia, reads the constituency results table and keeps a row only if its seat name and winning
party agree with the override CSV. Writes build/names_extra/<file>.json (then run make_names.py to merge into source/names/).

  python build/fetch_wiki_names.py            # fetch + parse all (pages are cached in dl/wiki/)
  python build/fetch_wiki_names.py Delhi-2025 # one election
"""
import os, re, sys, json, glob, time, urllib.request, urllib.parse, urllib.error
from bs4 import BeautifulSoup
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import parties as P

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.dirname(HERE)
OVR = os.path.join(HERE, 'seat_overrides')
CACHE = os.path.join(ROOT, 'dl', 'wiki')
OUT = os.path.join(HERE, 'names_extra')
D = os.path.join(ROOT, 'source', 'data')
os.makedirs(CACHE, exist_ok=True); os.makedirs(OUT, exist_ok=True)

TITLE = {'Jammu & Kashmir': 'Jammu and Kashmir'}
STOP = {'independent', 'ind', 'none', 'nota', 'vacant', 'others', 'other', 'tie', 'n/a', 'na', 'winner', 'runner-up', 'margin', 'candidate', 'candidates', 'party', 'votes'}
STOP |= {v.lower() for v in P.DISPLAY.values()}

def slug(s):
    return re.sub(r'[^a-z0-9]+', '-', str(s).lower()).strip('-')

def simp(s):
    return re.sub(r'[^a-z]', '', re.sub(r'\(.*?\)', '', str(s).lower()))

def fetch(state, year):
    f = os.path.join(CACHE, f'{slug(state)}-{year}.json')
    if not os.path.exists(f):
        title = f"{year} {TITLE.get(state, state)} Legislative Assembly election".replace(' ', '_')
        url = 'https://en.wikipedia.org/w/api.php?action=parse&prop=text&format=json&formatversion=2&redirects=1&page=' + urllib.parse.quote(title)
        req = urllib.request.Request(url, headers={'User-Agent': 'janadesh-build/1.0 (election simulator; https://github.com/TactualCoder24/janadesh)'})
        for attempt in range(8):
            try:
                data = urllib.request.urlopen(req, timeout=90).read(); break
            except urllib.error.HTTPError as e:
                if e.code != 429: raise
                time.sleep(15 * (attempt + 1))
        else:
            raise RuntimeError('rate limited')
        open(f, 'wb').write(data); time.sleep(2.5)
    j = json.load(open(f, encoding='utf-8'))
    return j['parse']['text'] if 'parse' in j else ''

def cleantext(c):
    for sup in c.find_all(['sup', 'style']):
        sup.decompose()
    return re.sub(r'\s+', ' ', c.get_text(' ', strip=True)).strip()

def is_name(x):
    if not x or len(x) < 3 or len(x) > 60 or re.search(r'[\d%]', x): return False
    if x.lower() in STOP or x.isupper() and len(x) <= 8: return False
    return bool(re.search(r'[a-z]', x)) and bool(re.match(r"^[A-Za-z][A-Za-z .'’\-ऀ-ॿ()]+$", x))

def parse(html):
    """-> list of (seat no, seat name, [candidate names in order], cells) from the winner / runner-up table"""
    soup = BeautifulSoup(html, 'lxml'); out = []
    tables = soup.find_all('table')
    def hdr(t):
        return ' '.join(cleantext(c).lower() for tr in t.find_all('tr')[:3] for c in tr.find_all(['th', 'td']))
    best = [t for t in tables if 'winner' in hdr(t) and 'runner' in hdr(t)]
    for t in (best or tables):
        for tr in t.find_all('tr'):
            cells = [cleantext(c) for c in tr.find_all(['td', 'th'])]
            # rows can start with a district cell that spans several rows
            i = next((k for k in (0, 1, 2) if k + 1 < len(cells) and re.match(r'^\d{1,3}$', cells[k]) and not re.match(r'^\d', cells[k + 1])), None)
            if i is None or len(cells) - i < 6: continue
            names = [c for c in cells[i + 2:] if is_name(c)]
            if len(names) >= 2:
                out.append((int(cells[i]), cells[i + 1], names, cells[i:]))
    return out

def party_ok(row, W):
    return W in ('IND', 'OTH', '') or any(P.norm(c) == W for c in row[2:] if c and len(c) < 40 and not re.search(r'\d', c))

def main():
    only = sys.argv[1] if len(sys.argv) > 1 else None
    byfile = {}
    for f in sorted(glob.glob(os.path.join(OVR, '*.csv'))):
        stem = os.path.basename(f)[:-4]
        if only and stem != only: continue
        state, year = stem.rsplit('-', 1)
        rows = {}
        for line in open(f, encoding='utf-8'):
            p = [x.strip() for x in line.rstrip('\n').split(',')]
            if len(p) >= 6 and p[0].isdigit(): rows[int(p[0])] = p
        try:
            wiki = parse(fetch(state, year))
        except Exception as e:
            print('FAIL fetch', stem, e); continue
        by_no = {}; by_name = {}
        for w in wiki:
            by_no.setdefault(w[0], w); by_name.setdefault(simp(w[1]), w)
        eid = ('ae-' + slug(state) + '-' + slug(year))
        file = 'ae-' + slug(state)
        els = json.load(open(f'{D}/{file}.json', encoding='utf-8'))
        e = next((x for x in els if x['id'] == eid), None)
        if not e: print('no election', eid); continue
        res = []; ok = 0
        for s in e['seats']:
            r = rows.get(s[0]); w = None
            if r:
                cand = by_no.get(s[0])
                if cand and (simp(cand[1])[:4] == simp(r[1])[:4] or simp(cand[1]) in simp(r[1]) or simp(r[1]) in simp(cand[1])) and party_ok(cand[3], r[2]):
                    w = cand
                else:
                    c2 = by_name.get(simp(r[1])) or next((v for k, v in by_name.items() if len(k) > 3 and k[:6] == simp(r[1])[:6]), None)
                    if c2 and party_ok(c2[3], r[2]): w = c2
            res.append([w[2][0], w[2][1]] if w else None)
            ok += 1 if w else 0
        print(f'{stem}: names for {ok} of {len(e["seats"])} seats (wiki rows {len(wiki)})')
        if ok:
            byfile.setdefault(file, {})[eid] = res
    for file, d in byfile.items():
        p = os.path.join(OUT, file + '.json')
        cur = json.load(open(p, encoding='utf-8')) if os.path.exists(p) else {}
        cur.update(d)
        json.dump(cur, open(p, 'w', encoding='utf-8'), separators=(',', ':'), ensure_ascii=False)

if __name__ == '__main__':
    main()
