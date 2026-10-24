"""Reservation type (general, SC or ST) of every Lok Sabha constituency, from Wikipedia's "List of constituencies of the Lok Sabha".

Reads the page (cached in dl/wiki/ls-constituencies.json) and writes build/ls_categories.json:
  {"State": {"constituency name": "GEN" | "SC" | "ST"}}   for the 543 seats of the 2024 Lok Sabha.

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
json.dump(out, open(os.path.join(HERE, 'ls_categories.json'), 'w', encoding='utf-8'), ensure_ascii=False, indent=0)
