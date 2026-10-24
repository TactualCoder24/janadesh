"""When each Lok Sabha sat: the first and last day of every House since 1952.

Reads the table "Formation of Lok Sabha over time" on Wikipedia's Lok Sabha page (cached in dl/wiki/lok-sabha.json) and writes source/ref/loksabha.json.
The length printed on the page is checked against the two dates before anything is written.

  python build/fetch_ls_terms.py
"""
import os, re, json, time, datetime, urllib.request
from bs4 import BeautifulSoup
HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.dirname(HERE)
CACHE = os.path.join(ROOT, 'dl', 'wiki'); os.makedirs(CACHE, exist_ok=True)
F = os.path.join(CACHE, 'lok-sabha.json')
if not os.path.exists(F):
    url = 'https://en.wikipedia.org/w/api.php?action=parse&prop=text&format=json&formatversion=2&redirects=1&page=Lok_Sabha'
    req = urllib.request.Request(url, headers={'User-Agent': 'janadesh-build/1.0 (https://github.com/TactualCoder24/janadesh)'})
    open(F, 'wb').write(urllib.request.urlopen(req, timeout=90).read()); time.sleep(2.5)
soup = BeautifulSoup(json.load(open(F, encoding='utf-8'))['parse']['text'], 'html.parser')
cells = lambda r: [re.sub(r'\s+', ' ', c.get_text(' ', strip=True)) for c in r.find_all(['th', 'td'])]
ORD = ['First', 'Second', 'Third', 'Fourth', 'Fifth', 'Sixth', 'Seventh', 'Eighth', 'Ninth', 'Tenth', 'Eleventh', 'Twelfth', 'Thirteenth', 'Fourteenth', 'Fifteenth', 'Sixteenth', 'Seventeenth', 'Eighteenth']
day = lambda s: datetime.datetime.strptime(s, '%d %B %Y').date()

def span(a, b):
    """years, months and days from a to b, counted the calendar way"""
    y, m, d = b.year - a.year, b.month - a.month, b.day - a.day
    if d < 0:
        m -= 1; pm = b.month - 1 or 12; py = b.year if b.month > 1 else b.year - 1
        d += (datetime.date(py + (pm == 12), pm % 12 + 1, 1) - datetime.timedelta(days=1)).day
    if m < 0: y -= 1; m += 12
    return y, m, d

terms = []
for t in soup.find_all('table'):
    rows = [cells(r) for r in t.find_all('tr')]
    if rows and rows[0][:4] == ['Lok Sabha', 'Commencement Date', 'Dissolution Date', 'Duration']:
        for r in rows[1:]:
            if r[0] not in ORD: continue
            n = ORD.index(r[0]) + 1; a = day(r[1]); b = None if r[2].lower() == 'present' else day(r[2])
            nums = lambda w: int((re.search(r'(\d+) ' + w, r[3]) or [0, 0])[1])
            page = (nums('year'), nums('month'), nums('day'))
            if b and span(a, b) != page: print('  length differs on', r[0], span(a, b), page)
            terms.append({'n': n, 'from': a.isoformat(), 'to': b.isoformat() if b else None, 'len': list(page) if b else None})
        break
assert [x['n'] for x in terms] == list(range(1, 19)), [x['n'] for x in terms]
json.dump({'v': 1, 'source': 'Wikipedia, Lok Sabha: Formation of Lok Sabha over time', 'terms': terms}, open(os.path.join(ROOT, 'source', 'ref', 'loksabha.json'), 'w', encoding='utf-8'), ensure_ascii=False, indent=1)
print(len(terms), 'Lok Sabhas written')
