"""Repair the reservation type (GEN / SC / ST) of Lok Sabha seats in 2004, 2009, 2014, 2019 and 2024.

In the packed data the type was swapped between neighbouring seats in several states (Ahmedabad West and Surendranagar, Inner and Outer Manipur,
Tripura East and West, Bangaon and Barrackpur, Dadra and Nagar Haveli and Daman and Diu, five seats of Assam in 2024) and 2009 still carried the
types of the 2004 map (93 SC and 55 ST seats instead of 84 and 47).

The reference is Wikipedia's "List of constituencies of the Lok Sabha" (build/fetch_ls_categories.py writes build/ls_categories.json), which gives the
type of every seat of the 2024 Lok Sabha and, for Assam, the list before its 2023 delimitation. 2009 to 2019 use the 2008 delimitation
(Assam as before 2023), 2024 uses the current list, 2004 (before the 2008 delimitation) uses the list of its members. The result must add up to the official
totals, 412 general, 84 SC and 47 ST seats from 2009 on and 423, 79 and 41 in 2004, or nothing is written. Idempotent.

  python build/fix_ls_categories.py
"""
import os, re, sys, json, difflib
VERBOSE = '-v' in sys.argv
HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.dirname(HERE)
REF = os.path.join(HERE, 'ls_categories.json')
F = os.path.join(ROOT, 'source', 'data', 'ls.json')
ELECTIONS = ['ls-2004', 'ls-2009', 'ls-2014', 'ls-2019', 'ls-2024']
TOTALS = {'ls-2004': {'GEN': 423, 'SC': 79, 'ST': 41}}
DEFAULT = {'GEN': 412, 'SC': 84, 'ST': 47}
ALIAS = {'orissa': 'odisha', 'nationalcapitalterritoryofdelhi': 'delhi', 'nowgong': 'nagaon', 'nctofdelhi': 'delhi', 'dadarnagarhaveli': 'dadraandnagarhaveli', 'dadranagarhaveli': 'dadraandnagarhaveli'}

def nk(s):
    k = re.sub(r'[^a-z]', '', re.sub(r'\(.*?\)', '', s.lower().replace('&', 'and')))
    return ALIAS.get(k, k)

def table_for(cat, eid):
    t = {}
    if eid == 'ls-2004':
        return {nk(st): {nk(n): c for n, c in d.items()} for st, d in cat['_2004'].items()}
    for st, d in cat.items():
        if st == 'Assam (before 2023)' or st.startswith('_'): continue
        if st == 'Assam' and eid != 'ls-2024': d = cat['Assam (before 2023)']
        t[nk(st)] = {nk(n): c for n, c in d.items()}
    return t

def main():
    if not os.path.exists(REF):
        print('no build/ls_categories.json (run build/fetch_ls_categories.py), categories left as they are'); return
    cat = json.load(open(REF, encoding='utf-8'))
    els = json.load(open(F, encoding='utf-8')); changed = 0; report = []
    for e in els:
        if e['id'] not in ELECTIONS: continue
        ref = table_for(cat, e['id']); new = []; used = set()
        for s in e['seats']:
            st = ref.get(nk(e['regions'][s[3]]))
            if st is None: raise SystemExit(f"{e['id']}: state {e['regions'][s[3]]} is not in the list")
            k = nk(s[1]); c = st.get(k)
            if c is None:   # a different spelling of the same seat: the closest unused name in the same state
                best = difflib.get_close_matches(k, [x for x in st if (nk(e['regions'][s[3]]), x) not in used], 1, 0.7)
                if best:
                    k = best[0]; c = st[k]
                    if VERBOSE: print('  spelling:', e['id'], e['regions'][s[3]], s[1], '->', k, c)
            if c is None and e['id'] == 'ls-2004': c = 'GEN'   # the spelling on Wikipedia is too different to match: the totals below are the check
            if c is None: raise SystemExit(f"{e['id']}: no match for {e['regions'][s[3]]} / {s[1]}")
            used.add((nk(e['regions'][s[3]]), k)); new.append(c)
        tot = {x: new.count(x) for x in ('GEN', 'SC', 'ST')}
        want = TOTALS.get(e['id'], DEFAULT)
        if tot != want: raise SystemExit(f"{e['id']}: types add up to {tot}, expected {want}, nothing written")
        for s, c in zip(e['seats'], new):
            if s[2] != c: report.append((e['id'], e['regions'][s[3]], s[1], s[2], c)); s[2] = c; changed += 1
    if changed:
        json.dump(els, open(F, 'w', encoding='utf-8'), separators=(',', ':'), ensure_ascii=False)
        for r in report: print('  ', *r)
    print('reservation types corrected:', changed)

if __name__ == '__main__':
    main()
