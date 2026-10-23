"""Search index: one row per constituency (matched by name within its state), with the latest winner and, when names exist, the recent winners' names.
Row: [name, state, 'LS'|'AE', latest election label, latest winner party, 'winner names separated by ;']"""
import os, re, json, glob
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
D = os.path.join(ROOT, 'source', 'data')
N = os.path.join(ROOT, 'source', 'names')

def nk(n):
    return re.sub(r'[^a-z0-9]+', '', re.sub(r'\(.*?\)', '', str(n).lower()))

rows = []
for f in sorted(glob.glob(f'{D}/*.json')):
    base = os.path.basename(f)[:-5]
    if base in ('index', 'search', 'polls', 'stats'):
        continue
    els = json.load(open(f, encoding='utf-8'))
    names = {}
    nf = f'{N}/{base}.json'
    if os.path.exists(nf):
        names = json.load(open(nf, encoding='utf-8'))
    els.sort(key=lambda e: (e['year'], e['label']))
    seats = {}
    for e in els:
        nm = names.get(e['id'])
        for i, s in enumerate(e['seats']):
            st = e['regions'][s[3]] if e['kind'] == 'LS' and s[3] >= 0 else (e['state'] if e['kind'] == 'AE' else '')
            if not st:
                continue
            key = (st, nk(s[1]))
            a = seats.setdefault(key, {'name': s[1], 'state': st, 'kind': e['kind'], 'w': []})
            a['name'] = s[1]
            win = e['parties'][s[4][0]] if s[4] else ''
            who = nm[i][0] if nm and i < len(nm) and nm[i] else ''
            a['label'] = e['label']; a['party'] = win
            if who and who not in a['w']:
                a['w'].append(who)
    for a in seats.values():
        rows.append([a['name'], a['state'], a['kind'], a['label'], a['party'], ';'.join(a['w'][-5:])])
rows.sort(key=lambda r: (r[2] != 'LS', r[1], r[0]))
json.dump(rows, open(f'{D}/search.json', 'w', encoding='utf-8'), separators=(',', ':'), ensure_ascii=False)
print('search index:', len(rows), 'seats,', round(os.path.getsize(f'{D}/search.json') / 1e3), 'KB')
