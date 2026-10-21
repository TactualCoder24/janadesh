"""Stage 3: harmonise Lok Sabha map keys between ls.json and maps/pc.json."""
import json, re, os
SITE = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), 'source')

def s(x):
    return re.sub(r'[^a-z]', '', x.lower().replace('&', 'and'))

ALIAS = {'orissa': 'odisha', 'andamanandnicobar': 'andamanandnicobarislands'}

t = json.load(open(f'{SITE}/maps/pc.json'))
obj = list(t['objects'].values())[0]
for g in obj['geometries']:
    p = g['properties']
    if 'k' not in p:
        st = ALIAS.get(s(p['st']), s(p['st']))
        p['k'] = f"{st}|{int(p['n'])}"
    g['properties'] = {'k': p['k']}
json.dump(t, open(f'{SITE}/maps/pc.json', 'w'), separators=(',', ':'))
keys = {g['properties']['k'] for g in obj['geometries']}

R2024 = {'jammuandkashmir|4': 'jammuandkashmir|5', 'jammuandkashmir|5': 'jammuandkashmir|6',
         'ladakh|1': 'jammuandkashmir|4', 'dadraandnagarhavelianddamananddiu|1': 'dadraandnagarhaveli|1',
         'dadraandnagarhavelianddamananddiu|2': 'damananddiu|1'}
ls = json.load(open(f'{SITE}/data/ls.json'))
for e in ls:
    if not e.get('mapkeys'):
        continue
    out = []
    for k in e['mapkeys']:
        if not k:
            out.append(None); continue
        st, n = k.split('|')
        kk = f"{ALIAS.get(s(st), s(st))}|{int(n)}"
        st2, n2 = kk.split('|'); n2 = int(n2)
        if st2 == 'andhrapradesh':
            if e['year'] <= 2009 and n2 <= 17: kk = f'telangana|{n2}'
            elif e['year'] >= 2014: kk = f'andhrapradesh|{n2 + 17}'
        if st2 == 'ladakh': kk = 'jammuandkashmir|4'
        if st2 == 'dadraandnagarhavelianddamananddiu':
            kk = 'dadraandnagarhaveli|1' if n2 == 1 else 'damananddiu|1'
        if e['year'] >= 2024 and st2 == 'jammuandkashmir' and n2 in (4, 5):
            kk = f'jammuandkashmir|{n2 + 1}'
        out.append(kk)
    e['mapkeys'] = out
    miss = [k for k in out if k not in keys]
    print(e['year'], 'unmatched', miss)
json.dump(ls, open(f'{SITE}/data/ls.json', 'w'), separators=(',', ':'))
