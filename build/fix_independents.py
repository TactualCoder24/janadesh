"""Independents and the "Others" bucket never belong to an alliance (Lok Sabha 2024 had IND counted in the NDA).
Removes IND / OTH / NOTA from every election's alliances and gives independents their own colour. Idempotent.

  python build/fix_independents.py
"""
import os, json, glob
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
D = os.path.join(ROOT, 'source', 'data')
IND_COLOUR = '#8D6E63'   # earthy brown: distinct from grey "Others" and from the orange / blue of the big blocs

def main():
    fixed = 0
    for f in sorted(glob.glob(f'{D}/*.json')):
        b = os.path.basename(f)[:-5]
        if b in ('index', 'search', 'polls', 'stats'):
            continue
        els = json.load(open(f, encoding='utf-8')); dirty = False
        for e in els:
            for p in ('IND', 'OTH', 'NOTA'):
                if p in e.get('alliances', {}):
                    print('removed', p, 'from', e['alliances'][p], 'in', e['id']); del e['alliances'][p]; dirty = True; fixed += 1
        if dirty:
            json.dump(els, open(f, 'w', encoding='utf-8'), separators=(',', ':'), ensure_ascii=False)
    ix = json.load(open(f'{D}/index.json', encoding='utf-8'))
    if ix['parties'].get('IND', {}).get('c') != IND_COLOUR:
        ix['parties']['IND']['c'] = IND_COLOUR
        json.dump(ix, open(f'{D}/index.json', 'w', encoding='utf-8'), separators=(',', ':'), ensure_ascii=False)
        print('independents colour set to', IND_COLOUR)
    print('alliance entries removed:', fixed)

if __name__ == '__main__':
    main()
