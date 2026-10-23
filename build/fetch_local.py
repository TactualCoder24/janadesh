"""Results of the big city corporation elections: seats won by each party, from the infobox of the Wikipedia election pages.

  python build/fetch_local.py     writes source/ref/localbodies.json

Only the parties the infobox lists (the top few) are kept, with the seats they won, their vote share where given and their seats at the election before.
"""
import os, re, sys, json
from bs4 import BeautifulSoup
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import parties as P
import fetch_bypolls as FB
HERE = os.path.dirname(os.path.abspath(__file__)); ROOT = os.path.dirname(HERE)

# city, state, [(year, wikipedia page)]; newest first
CITIES = [
    ('Delhi (MCD)', 'Delhi', [(2022, '2022 Municipal Corporation of Delhi election'), (2017, '2017 Delhi Municipal Corporation election')]),
    ('Mumbai (BMC)', 'Maharashtra', [(2026, '2026 Brihanmumbai Municipal Corporation election'), (2017, '2017 Brihanmumbai Municipal Corporation election')]),
    ('Pune (PMC)', 'Maharashtra', [(2026, '2026 Pune Municipal Corporation election'), (2017, '2017 Pune Municipal Corporation election')]),
    ('Hyderabad (GHMC)', 'Telangana', [(2020, '2020 Greater Hyderabad Municipal Corporation election'), (2016, '2016 Greater Hyderabad Municipal Corporation election')]),
    ('Kolkata (KMC)', 'West Bengal', [(2026, '2026 Kolkata Municipal Corporation election'), (2021, '2021 Kolkata Municipal Corporation election')]),
    ('Bengaluru (BBMP)', 'Karnataka', [(2015, '2015 Bruhat Bengaluru Mahanagara Palike election'), (2010, '2010 Bruhat Bengaluru Mahanagara Palike election')]),
]

def nint(s):
    m = re.search(r'-?\d[\d,]*', (s or '').replace('−', '-'))
    return int(m.group(0).replace(',', '')) if m else None

def pct(s):
    m = re.search(r'\d+(?:\.\d+)?\s*%', s or '')
    return float(m.group(0).rstrip('% ')) if m else None

def parse_infobox(html):
    soup = BeautifulSoup(html, 'lxml'); ib = soup.find('table', class_=re.compile('infobox'))
    if not ib: return None
    rows = []
    for tr in ib.find_all('tr'):
        cells = [FB.txt(c) for c in tr.find_all(['th', 'td'])]
        if any(cells): rows.append(cells)
    head = ' '.join(rows[0]) if rows else ''
    dm = re.search(r'(\d{1,2}\s+[A-Z][a-z]+\s+\d{4})', head); date = FB.iso(dm.group(1)) if dm else None
    total = None
    for r in rows[:3]:
        m = re.search(r'All\s+(\d+)\s+(?:elected\s+)?seats', ' '.join(r))
        if m: total = int(m.group(1))
    parties = []; names = []; last = {}; seats = {}; share = {}
    def flush():
        for i, nm in enumerate(names):
            if i in seats: parties.append({'p': nm, 'seats': seats[i], 'pct': share.get(i), 'last': last.get(i)})
        names.clear(); last.clear(); seats.clear(); share.clear()
    for r in rows:
        lab = r[0].lower() if r else ''
        vals = r[1:]
        if lab == 'party':
            flush(); names.extend(vals)
        elif lab == 'seats won' or lab == 'seats':
            for i, v in enumerate(vals):
                n = nint(v)
                if n is not None: seats[i] = n
        elif lab in ('percentage', 'popular vote %', 'vote %'):
            for i, v in enumerate(vals): share[i] = pct(v) if pct(v) is not None else share.get(i)
        elif lab == 'last election':
            for i, v in enumerate(vals): last[i] = nint(v) if re.match(r'^\s*\d', v or '') and 'seat' not in (v or '').lower() or re.search(r'seats', v or '', re.I) else None
            for i, v in enumerate(vals):
                m = re.search(r'(\d+)\s*seats', v or '')
                if m: last[i] = int(m.group(1))
    flush()
    return {'date': date, 'total': total, 'parties': parties}

def code(name, year=2026):
    c = FB.code(name)
    if c == 'SHS_SHINDE' and year < 2022: c = 'SHS'   # before the 2022 split "Shiv Sena" is one party
    if c in ('OTHERS', 'OTH'): c = 'OTH'
    return c

def parse_gujarat(html):
    """2026 Gujarat local elections: one row per municipal corporation, "Party won" and "BJP (160) INC (32)"."""
    soup = BeautifulSoup(html, 'lxml'); out = []
    for t in soup.find_all('table'):
        g = FB.grid(t)
        if len(g) < 3 or not g[0] or g[0][0].strip().lower() != 'corporation': continue
        for row in g[1:]:
            m = re.match(r'^(.*?)\s+Total seats\s*\((\d+)\)', row[0])
            if not m: continue
            comp = re.findall(r'([A-Za-z][A-Za-z.() ]*?)\s*\((\d+)\)', row[-1])
            parties = [{'p': code(n.strip(), 2026), 'seats': int(v), 'pct': None, 'last': None} for n, v in comp]
            name = re.sub(r'\s*(Municipal Corporation)$', '', m.group(1)).strip()
            out.append({'city': name + ' (corporation)', 'state': 'Gujarat', 'elections': [{'year': 2026, 'date': '2026-04-26', 'total': int(m.group(2)), 'parties': parties}]})
    return out

def parse_up(html):
    """2023 Uttar Pradesh local elections: the heads (mayors and chairpersons) of 760 urban bodies, by party."""
    soup = BeautifulSoup(html, 'lxml'); ib = soup.find('table', class_=re.compile('infobox'))
    for t in ([ib] if ib else []) + soup.find_all('table'):
        g = FB.grid(t); parties = []
        for row in g:
            cells = [c for c in row if c]
            if len(cells) >= 2 and cells[0] in ('BJP', 'SP', 'BSP', 'INC', 'AAP', 'RLD', 'AIMIM', 'Others', 'Independents'):
                n = nint(cells[-1]) if re.match(r'^\s*\d+\s*$', cells[-1]) else nint(next((c for c in cells[1:] if re.match(r'^\s*\d+\s*$', c)), ''))
                if n is not None: parties.append({'p': 'IND' if cells[0] == 'Independents' else ('OTH' if cells[0] == 'Others' else code(cells[0], 2023)), 'seats': n, 'pct': None, 'last': None})
        if len(parties) >= 5:
            return [{'city': 'Uttar Pradesh (heads of 760 urban bodies)', 'state': 'Uttar Pradesh', 'elections': [{'year': 2023, 'date': '2023-05-11', 'total': sum(p['seats'] for p in parties), 'parties': parties}]}]
    return []

def main():
    out = []
    for city, state, pages in CITIES:
        els = []
        for year, title in pages:
            try: res = parse_infobox(FB.fetch(title))
            except Exception as e: print('  failed', title, repr(e)[:80]); continue
            if not res or not res['parties']: print('  no infobox results:', title); continue
            tot = res['total'] or sum(p['seats'] for p in res['parties'])
            for p in res['parties']: p['p'] = code(p['p'], year)
            els.append({'year': year, 'date': res['date'], 'total': tot, 'parties': res['parties']})
        if els: out.append({'city': city, 'state': state, 'elections': els})
    for title, fn in (('2026 Gujarat local elections', parse_gujarat), ('2023 Uttar Pradesh local elections', parse_up)):
        try: out += fn(FB.fetch(title))
        except Exception as e: print('  failed', title, repr(e)[:80])
    json.dump({'v': 1, 'source': 'Wikipedia, the election pages of each city corporation (infobox), the 2026 Gujarat local elections and the 2023 Uttar Pradesh local elections', 'items': out},
              open(os.path.join(ROOT, 'source', 'ref', 'localbodies.json'), 'w', encoding='utf-8'), separators=(',', ':'), ensure_ascii=False)
    for c in out:
        for e in c['elections']:
            print(c['city'], e['year'], e['date'], e['total'], [(p['p'], p['seats'], p['last']) for p in e['parties']])

if __name__ == '__main__':
    main()
