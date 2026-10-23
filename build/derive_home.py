"""Derived numbers stored next to the election index so the home page does not need to load ls.json."""
import os, json
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
D = os.path.join(ROOT, 'source', 'data')
ix = json.load(open(f'{D}/index.json', encoding='utf-8'))
ls = json.load(open(f'{D}/ls.json', encoding='utf-8'))
e = next(x for x in ls if x['id'] == 'ls-2024')
c = {}
for s in e['seats']:
    if not s[4]: continue
    p = e['parties'][s[4][0]]
    k = e['alliances'].get(p) or p
    c[k] = c.get(k, 0) + 1
ix['home'] = {'id': 'ls-2024', 'groups': sorted(c.items(), key=lambda kv: -kv[1])}
json.dump(ix, open(f'{D}/index.json', 'w', encoding='utf-8'), separators=(',', ':'), ensure_ascii=False)
print('home summary:', ix['home']['groups'][:3])
