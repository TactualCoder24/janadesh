"""Exit-poll seat projections for the poll presets, read from the "Exit polls" tables of the Wikipedia election pages.

  python build/fetch_polls.py        # fetch (cached in dl/wiki/polls-*.json) and write source/data/polls.json

Each set: the election polled, the earlier election used as the base for the simulation, which bloc column maps to which party / alliance
of the base election, every pollster's projection (range mid-points) and the actual result from our own data. Pollster rows that do not
parse into seat numbers are skipped. Always check the output against the cited page.
"""
import os, re, sys, json, glob, time, urllib.request, urllib.parse, urllib.error
from bs4 import BeautifulSoup
HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.dirname(HERE)
D = os.path.join(ROOT, 'source', 'data')
CACHE = os.path.join(ROOT, 'dl', 'wiki')
os.makedirs(CACHE, exist_ok=True)

# page, polled election id, base election id, mode, {column label in the table: unit key in the base election}
SETS = [
    ('2024 Indian general election', 'ls-2024', 'ls-2019', 'alliance', {'NDA': 'NDA', 'INDIA': 'UPA'}),
    ('2019 Indian general election', 'ls-2019', 'ls-2014', 'alliance', {'NDA': 'NDA', 'UPA': 'UPA'}),
    ('2025 Delhi Legislative Assembly election', 'ae-delhi-2025', 'ae-delhi-2020', 'party', {'AAP': 'AAP', 'NDA': 'BJP', 'INC': 'INC'}),
    ('2020 Delhi Legislative Assembly election', 'ae-delhi-2020', 'ae-delhi-2015', 'party', {'AAP': 'AAP', 'BJP+': 'BJP', 'INC+': 'INC'}),
    ('2024 Maharashtra Legislative Assembly election', 'ae-maharashtra-2024', 'ae-maharashtra-2019', 'alliance', {'Maha Yuti': 'NDA', 'Maha Vikas Aghadi': 'UPA'}),
    ('2025 Bihar Legislative Assembly election', 'ae-bihar-2025', 'ae-bihar-2020', 'alliance', {'NDA': 'NDA', 'MGB': 'MGB'}),
    ('2026 Kerala Legislative Assembly election', 'ae-kerala-2026', 'ae-kerala-2021', 'alliance', {'LDF': 'LDF', 'UDF': 'UDF', 'NDA': 'NDA'}),
    ('2026 West Bengal Legislative Assembly election', 'ae-west-bengal-2026', 'ae-west-bengal-2021', 'party', {'AITC+': 'AITC', 'BJP': 'BJP'}),
    ('2021 West Bengal Legislative Assembly election', 'ae-west-bengal-2021', 'ae-west-bengal-2016', 'party', {'AITC+': 'AITC', 'BJP+': 'BJP'}),
    ('2022 Uttar Pradesh Legislative Assembly election', 'ae-uttar-pradesh-2022', 'ae-uttar-pradesh-2017', 'party', {'NDA': 'BJP', 'SP+': 'SP', 'BSP': 'BSP'}),
    ('2023 Karnataka Legislative Assembly election', 'ae-karnataka-2023', 'ae-karnataka-2018', 'party', {'INC': 'INC', 'BJP': 'BJP', 'JD(S)': 'JDS'}),
    ('2023 Rajasthan Legislative Assembly election', 'ae-rajasthan-2023', 'ae-rajasthan-2018', 'party', {'INC+': 'INC', 'BJP': 'BJP'}),
    ('2023 Madhya Pradesh Legislative Assembly election', 'ae-madhya-pradesh-2023', 'ae-madhya-pradesh-2018', 'party', {'INC': 'INC', 'BJP': 'BJP'}),
    ('2022 Gujarat Legislative Assembly election', 'ae-gujarat-2022', 'ae-gujarat-2017', 'party', {'BJP': 'BJP', 'INC': 'INC', 'AAP': 'AAP'}),
]

def fetch(page):
    f = os.path.join(CACHE, 'polls-' + re.sub(r'[^a-z0-9]+', '-', page.lower()) + '.json')
    if not os.path.exists(f):
        url = 'https://en.wikipedia.org/w/api.php?action=parse&prop=text&format=json&formatversion=2&redirects=1&page=' + urllib.parse.quote(page.replace(' ', '_'))
        req = urllib.request.Request(url, headers={'User-Agent': 'janadesh-build/1.0 (election simulator; https://github.com/TactualCoder24/janadesh)'})
        for attempt in range(6):
            try:
                data = urllib.request.urlopen(req, timeout=120).read(); break
            except (urllib.error.HTTPError, TimeoutError, urllib.error.URLError) as e:
                if getattr(e, 'code', 0) not in (0, 429, 500, 502, 503): raise
                time.sleep(10 * (attempt + 1))
        else:
            raise RuntimeError('fetch failed ' + page)
        open(f, 'wb').write(data); time.sleep(2.5)
    return json.load(open(f, encoding='utf-8'))['parse']['text']

def cell(c):
    for sup in c.find_all(['sup', 'style']): sup.decompose()
    return re.sub(r'\s+', ' ', c.get_text(' ', strip=True)).strip()

NUM = re.compile(r'^\(?\s*(\d{1,3})\s*(?:[-–—±+�?]+\s*(\d{1,3}))?\s*\)?(?:\s*=\s*\d+)?$')
def seats(x):
    """'368 ± 15' -> 368; '32-37' -> 34.5; '(193+1)=194' -> 194; '%' cells and sample sizes are not seat counts."""
    x = x.replace('±', '±').strip()
    if '%' in x or ',' in x: return None
    m = re.match(r'^\(\s*\d+\s*\+\s*\d+\s*\)\s*=\s*(\d+)$', x)
    if m: return float(m.group(1))
    m = re.match(r'^(\d{1,3})\s*[±�]\s*(\d{1,3})$', x)
    if m: return float(m.group(1))
    m = re.match(r'^(\d{1,3})\s*[-–—]\s*(\d{1,3})$', x)
    if m: return (float(m.group(1)) + float(m.group(2))) / 2
    m = re.match(r'^(\d{1,3})$', x)
    if m: return float(m.group(1))
    return None

def exit_table(html):
    s = BeautifulSoup(html, 'lxml')
    for h in s.find_all(['h2', 'h3', 'h4']):
        if 'exit' in h.get_text().lower():
            node = h.parent if h.parent.name == 'div' else h
            t = node.find_next('table', class_='wikitable')
            if t is not None: return t
    return None

def parse(table, cols):
    rows = [[cell(c) for c in tr.find_all(['th', 'td'])] for tr in table.find_all('tr')]
    names = None
    for r in rows[:4]:   # the row that names the bloc columns
        hit = [c for c in r if c in cols]
        if len(hit) >= len(cols) - (1 if len(cols) > 2 else 0) and len(hit) >= 2:
            names = [c for c in r if c in cols]; break
    if not names: return None, []
    out = []
    for r in rows:
        if not r or r[0] in cols or sum(1 for c in r if c in cols) >= 2: continue
        if re.search(r'election result|actual|average|poll of polls', ' '.join(r[:2]), re.I): continue
        label = next((c for c in r[:3] if re.search(r'[A-Za-z]{3}', c) and not re.search(r'\d{4}$', c) and not re.match(r'^(\d{1,2} )?[A-Z][a-z]+ \d{1,2}?,? ?\d{4}', c) and c.lower() not in ('exit polls', 'n/a', 'na')), None)
        if not label: continue
        nums = [seats(c) for c in r[r.index(label) + 1:]]
        nums = [n for n in nums if n is not None]
        if len(nums) < len(names): continue
        out.append((re.sub(r'\s+', ' ', label).strip(), dict(zip(names, nums[:len(names)]))))
    return names, out

def actual(eid):
    f = eid.rsplit('-', 1)[0]
    f = 'ls' if eid.startswith('ls-') else f
    e = next(x for x in json.load(open(f'{D}/{f}.json', encoding='utf-8')) if x['id'] == eid)
    c = {}
    for s in e['seats']:
        if s[4]:
            p = e['parties'][s[4][0]]; k = e['alliances'].get(p) or p
            c[k] = c.get(k, 0) + (s[6] if len(s) > 6 else 1)
    return sorted(c.items(), key=lambda x: -x[1])[:4]

def main():
    sets = []
    for page, polled, base, mode, cols in SETS:
        try:
            names, polls = parse(exit_table(fetch(page)), cols)
        except Exception as e:
            print('FAIL', page, e); continue
        if not polls:
            print('no polls parsed', page); continue
        ent = next(x for x in json.load(open(f'{D}/index.json', encoding='utf-8'))['elections'] if x['id'] == polled)
        avg = {n: round(sum(p[1][n] for p in polls) / len(polls)) for n in names}
        sets.append({'id': polled, 'title': ('Lok Sabha ' if polled.startswith('ls-') else ent['state'] + ' Assembly ') + ent['label'], 'kind': ent['kind'], 'state': None if ent['kind'] == 'LS' else ent['state'],
                     'base': base, 'mode': mode, 'units': {n: cols[n] for n in names}, 'source': 'https://en.wikipedia.org/wiki/' + page.replace(' ', '_') + '#Exit_polls',
                     'actual': actual(polled), 'polls': [{'by': 'Average of ' + str(len(polls)) + ' exit polls', 'seats': avg, 'avg': True}] + [{'by': p[0], 'seats': {k: int(round(v)) for k, v in p[1].items()}} for p in polls]})
        print(page, '->', len(polls), 'polls; average', avg, '; actual', actual(polled))
    json.dump({'v': 1, 'sets': sets}, open(f'{D}/polls.json', 'w', encoding='utf-8'), separators=(',', ':'), ensure_ascii=False)
    print('polls.json:', len(sets), 'sets,', os.path.getsize(f'{D}/polls.json') // 1000, 'KB')

if __name__ == '__main__':
    main()
