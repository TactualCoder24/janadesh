"""Reservation type (general, SC or ST) of every Lok Sabha constituency, from Wikipedia's "List of constituencies of the Lok Sabha".

Reads the page (cached in dl/wiki/ls-constituencies.json) and writes build/ls_categories.json:
  {"State": {"constituency name": "GEN" | "SC" | "ST"}}   for the 543 seats of the 2024 Lok Sabha, plus
  "Assam (before 2023)" and "_2004": the same for the 543 seats of the 2004 Lok Sabha (from "List of members of the 14th Lok Sabha",
  where a seat reserved for SC or ST carries that tag; two nominated Anglo-Indian members are not constituencies and are skipped).

  python build/fetch_ls_categories.py
"""
import os, re, json, time, urllib.request, urllib.parse
from bs4 import BeautifulSoup
HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.dirname(HERE)
CACHE = os.path.join(ROOT, 'dl', 'wiki'); os.makedirs(CACHE, exist_ok=True)
F = os.path.join(CACHE, 'ls-constituencies.json')
if not os.path.exists(F):
    url = 'https://en.wikipedia.org/w/api.php?action=parse&prop=text&format=json&formatversion=2&redirects=1&page=List_of_constituencies_of_the_Lok_Sabha'
    req = urllib.request.Request(url, headers={'User-Agent': 'janadesh-build/1.0 (https://github.com/TactualCoder24/janadesh)'})
    open(F, 'wb').write(urllib.request.urlopen(req, timeout=90).read()); time.sleep(2.5)
soup = BeautifulSoup(json.load(open(F, encoding='utf-8'))['parse']['text'], 'html.parser')
tabs = soup.find_all('table')
cells = lambda r: [re.sub(r'\s+', ' ', c.get_text(' ', strip=True)).strip() for c in r.find_all(['th', 'td'])]
hdr = lambda t: cells(t.find_all('tr')[0]) if t.find_all('tr') else []
isc = lambda t: len(hdr(t)) >= 2 and hdr(t)[0] == 'Constituency' and 'reserved for' in hdr(t)[1].lower()
cons = [t for t in tabs if isc(t) and 'Electors (2024)' in hdr(t)]
old = [t for t in tabs if isc(t) and 'Electors (2024)' not in hdr(t)]   # Assam before its 2023 delimitation
def read(t):
    d = {}
    for r in t.find_all('tr'):
        c = cells(r)
        if len(c) >= 3 and c[0].isdigit() and c[2] in ('None', 'SC', 'ST'): d[c[1]] = 'GEN' if c[2] == 'None' else c[2]
    return d
name = lambda t: re.sub(r'\s*\(\d+\)\s*$', '', t.find_previous(['h2', 'h3', 'h4']).get_text(' ', strip=True)).strip()
out = {name(t): read(t) for t in cons}
assert len(old) == 1 and name(old[0]) == 'Assam' and len(out) == 36, (len(out), [name(t) for t in old])
out['Assam (before 2023)'] = read(old[0])
n = sum(len(v) for k, v in out.items() if '(' not in k)
tot = {k: sum(1 for st, v in out.items() if '(' not in st for x in v.values() if x == k) for k in ('GEN', 'SC', 'ST')}
print(len(out), 'states,', n, 'constituencies', tot)
# the 2004 Lok Sabha (before the 2008 delimitation): 543 seats, 79 SC and 41 ST
F4 = os.path.join(CACHE, 'ls14-members.json')
if not os.path.exists(F4):
    url = 'https://en.wikipedia.org/w/api.php?action=parse&prop=text&format=json&formatversion=2&redirects=1&page=List_of_members_of_the_14th_Lok_Sabha'
    req = urllib.request.Request(url, headers={'User-Agent': 'janadesh-build/1.0 (https://github.com/TactualCoder24/janadesh)'})
    open(F4, 'wb').write(urllib.request.urlopen(req, timeout=90).read()); time.sleep(2.5)
soup4 = BeautifulSoup(json.load(open(F4, encoding='utf-8'))['parse']['text'], 'html.parser')
y04 = {}
for t in soup4.find_all('table'):
    rows = [cells(r) for r in t.find_all('tr')]
    if not rows or rows[0][:2] != ['No.', 'Constituency']: continue
    st = re.sub(r'\s*\[.*?\]|\s*\(\d+\)\s*$', '', t.find_previous(['h2', 'h3', 'h4']).get_text(' ', strip=True)).strip()
    if st == 'Nominated': continue
    for r in rows[1:]:
        if len(r) >= 2 and r[0].isdigit():
            mt = re.match(r'(.*?)\s*\((SC|ST)\)\s*$', r[1])
            y04.setdefault(st, {})[mt.group(1) if mt else r[1]] = mt.group(2) if mt else 'GEN'
t04 = {k: sum(1 for v in y04.values() for x in v.values() if x == k) for k in ('GEN', 'SC', 'ST')}
assert t04 == {'GEN': 423, 'SC': 79, 'ST': 41}, t04
out['_2004'] = y04
json.dump(out, open(os.path.join(HERE, 'ls_categories.json'), 'w', encoding='utf-8'), ensure_ascii=False, indent=0)
print('2004:', len(y04), 'states,', sum(len(v) for v in y04.values()), 'constituencies', t04)
