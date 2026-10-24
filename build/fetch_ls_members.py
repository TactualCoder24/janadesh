"""The Lok Sabha as it stands now: members per party and alliance, from Wikipedia's Lok Sabha page ("Membership by party").

Reads the page (cached in dl/wiki/lok-sabha.json, delete it to fetch a fresh copy) and writes source/ref/ls-now.json.
Every alliance total on the page is checked against the sum of its parties, and the grand total against 543, before anything is written.
Independents are never counted inside an alliance in Janadesh, so the three independents Wikipedia lists under INDIA are shown on their own
(groups: NDA, INDIA, IND, OTH = parties in neither, VAC = vacant).

  python build/fetch_ls_members.py
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
table = next(t for t in soup.find_all('table') if (lambda rows: rows and rows[0][:3] == ['Alliance', 'Party', 'No. of MPs'])([cells(r) for r in t.find_all('tr')]))
m = re.search(r'As of (\d{1,2} [A-Z][a-z]+ \d{4})', table.find_previous(string=re.compile(r'As of \d{1,2} [A-Z][a-z]+ \d{4}')))
asof = datetime.datetime.strptime(m.group(1), '%d %B %Y').date().isoformat()
alliances, parties, vacant, total, cur = {}, [], None, None, None
for r in [cells(r) for r in table.find_all('tr')][1:]:
    if r[0] == 'Vacant': vacant = (int(r[1]), r[2] if len(r) > 2 else ''); continue
    if r[0] == 'Total': total = int(r[1]); continue
    r = r[1:] if r and r[0] == '' else r
    h = re.match(r'(?:Government )?(.+?) Seats: (\d+)$', r[0])
    if h: cur = h.group(1); alliances[cur] = int(h.group(2)); r = r[2:] if len(r) > 2 and r[1] == '' else r[1:]
    if len(r) >= 2 and r[1].isdigit(): parties.append({'alliance': cur, 'party': r[0], 'n': int(r[1]), 'leader': r[2] if len(r) > 2 else ''})
for a, n in alliances.items():
    got = sum(p['n'] for p in parties if p['alliance'] == a)
    assert got == n, (a, got, n)
assert total == 543 and sum(alliances.values()) + vacant[0] == total, (alliances, vacant, total)
ind = sum(p['n'] for p in parties if p['party'] == 'IND')
groups = [['NDA', alliances['NDA']], ['INDIA', alliances['INDIA'] - sum(p['n'] for p in parties if p['alliance'] == 'INDIA' and p['party'] == 'IND')],
          ['IND', ind], ['OTH', alliances['Unaligned'] - sum(p['n'] for p in parties if p['alliance'] == 'Unaligned' and p['party'] == 'IND')], ['VAC', vacant[0]]]
assert sum(n for _, n in groups) == 543, groups
out = {'v': 1, 'asof': asof, 'source': 'Wikipedia, Lok Sabha: Membership by party', 'alliances': alliances, 'groups': groups, 'vacant': {'n': vacant[0], 'seats': vacant[1]}, 'parties': parties}
json.dump(out, open(os.path.join(ROOT, 'source', 'ref', 'ls-now.json'), 'w', encoding='utf-8'), ensure_ascii=False, indent=1)
print('as of', asof, '| page alliances', alliances, '| vacant', vacant[0], '| shown', groups)
