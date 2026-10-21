"""Build compact election JSON for the simulator.
Run: python3 -I build.py  (from any dir; paths are absolute)
"""
import os, sys, json, re, glob, math, hashlib, collections
import numpy as np, pandas as pd

sys.path.insert(0, os.path.dirname(__file__))
import parties as P
import summary_data as SD
from scipy.optimize import linear_sum_assignment

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DL = os.environ.get('JANADESH_DL', os.path.join(ROOT, 'dl'))  # cloned source repos
OUT = os.path.join(ROOT, 'source', 'data')
os.makedirs(OUT, exist_ok=True)

STATE_FIX = {
    'ORISSA': 'Odisha', 'PONDICHERRY': 'Puducherry', 'NCT OF DELHI': 'Delhi', 'DELHI': 'Delhi',
    'JAMMU & KASHMIR': 'Jammu & Kashmir', 'JAMMU AND KASHMIR': 'Jammu & Kashmir', 'UTTARKHAND': 'Uttarakhand',
    'ANDAMAN & NICOBAR': 'Andaman & Nicobar Islands', 'NCT OF Delhi': 'Delhi', 'NCT Of Delhi': 'Delhi',
    'DADRA & NAGAR HAVELI & DAMAN & DIU': 'Dadra & Nagar Haveli and Daman & Diu',
}

def fix_state(s):
    s = str(s).strip()
    if s.upper() in STATE_FIX:
        return STATE_FIX[s.upper()]
    if s in STATE_FIX:
        return STATE_FIX[s]
    t = s.title().replace(' And ', ' and ').replace(' Of ', ' of ')
    return t

def slug(s):
    return re.sub(r'[^a-z0-9]+', '-', s.lower()).strip('-')

def cat_norm(c):
    c = str(c).upper().strip()
    if c.startswith('SC'): return 'SC'
    if c.startswith('ST'): return 'ST'
    return 'GEN'

# rows: kind, state, year(int), label, seat(int), name, cat, party, votes, alliance, electors, region
ROWS = []

def push(df, kind, source):
    df = df.copy()
    df['kind'] = kind
    df['source'] = source
    for c in ['cat', 'alliance', 'electors', 'region', 'label']:
        if c not in df.columns:
            df[c] = None
    ROWS.append(df[['kind', 'state', 'year', 'label', 'seat', 'name', 'cat', 'party', 'votes', 'alliance', 'electors', 'region', 'source']])

# ---------------- Lok Sabha ----------------
def load_ls():
    q = pd.read_csv(f'{DL}/india-elections-data/parliament_final.csv', low_memory=False, encoding_errors='replace')
    q = q[q.YEAR <= 2004].copy()
    q.loc[q.YEAR == 1985, 'YEAR'] = 1984
    q.loc[q.YEAR == 1992, 'YEAR'] = 1991
    q['state'] = q.STATE.map(fix_state)
    # seat numbering: per year, order by state then PC name
    q['pckey'] = q.state + '|' + q.PC.astype(str).str.strip().str.upper()
    out = []
    for y, g in q.groupby('YEAR'):
        keys = sorted(g.pckey.unique())
        idx = {k: i + 1 for i, k in enumerate(keys)}
        g = g.assign(seat=g.pckey.map(idx))
        out.append(g)
    q = pd.concat(out)
    df = pd.DataFrame(dict(state=q.state, year=q.YEAR.astype(int), label=None, seat=q.seat,
        name=q.PC.astype(str).str.strip().str.title(), cat=q.CATEGORY.fillna('GEN'), party=q.PARTY.map(P.norm),
        votes=pd.to_numeric(q.VOTES, errors='coerce'), alliance=q.COALITION, electors=pd.to_numeric(q.ELECTORS, errors='coerce'),
        region=q.state))
    # category per seat: derive from name suffix '(SC)' if missing
    push(df, 'LS', 'DataMeet / gitcheckoutnikhil india-elections-data (ECI statistical reports)')

    p = pd.read_csv(f'{DL}/da/Election_Data_2024/parliament.csv', low_memory=False, encoding_errors='replace')
    p['state'] = p.STATE.map(fix_state)
    p['pckey'] = p.state + '|' + p.PC_NO.astype(int).astype(str)
    out = []
    for y, g in p.groupby('YEAR'):
        keys = sorted(g.pckey.unique(), key=lambda k: (k.split('|')[0], int(k.split('|')[1])))
        idx = {k: i + 1 for i, k in enumerate(keys)}
        out.append(g.assign(seat=g.pckey.map(idx)))
    p = pd.concat(out)
    al = p.ALLIANCE.astype(str).str.replace('+', '', regex=False).replace({'nan': None})
    df = pd.DataFrame(dict(state=p.state, year=p.YEAR.astype(int), label=None, seat=p.seat,
        name=p.PC_NAME.astype(str).str.strip().str.title(), cat=p.Category, party=p.PARTY_CODE.fillna(p.PARTY).map(P.norm),
        votes=pd.to_numeric(p.VOTES, errors='coerce'), alliance=al, electors=None, region=p.state,
        pcno=p.PC_NO.astype(int)))
    df['electors'] = None
    push(df, 'LS', 'data-analytics.github.io (ECI results 2009-2024)')
    # keep state PC numbers for map join (2009+): store mapping
    return df[['year', 'seat', 'state', 'pcno']].drop_duplicates()

# ---------------- Assemblies ----------------
def load_datameet_ae():
    a = pd.read_csv(f'{DL}/india-election-data/assembly-elections/assembly.csv', low_memory=False, encoding='latin-1')
    a['state'] = a.ST_NAME.map(fix_state)
    yr = a.YEAR.astype(str)
    a['label'] = None
    a.loc[yr == 'feb2005', 'label'] = '2005 (Feb)'
    a.loc[yr == 'oct2005', 'label'] = '2005 (Oct)'
    a['year'] = yr.str.extract(r'(\d{4})')[0].astype(int)
    df = pd.DataFrame(dict(state=a.state, year=a.year, label=a.label, seat=pd.to_numeric(a.AC_NO, errors='coerce'),
        name=a.AC_NAME.astype(str).str.strip().str.title(), cat=a.AC_TYPE, party=a.PARTY.map(P.norm),
        votes=pd.to_numeric(a.VOTES, errors='coerce')))
    push(df, 'AE', 'DataMeet india-election-data (ECI results)')

def load_da_ae():
    files = {
        'Election_Data/assembly_kerala_detail.csv': 'Kerala', 'Election_Data/assembly_pondi_detail.csv': 'Puducherry',
        'Election_Data/assembly_tn_detail.csv': 'Tamil Nadu', 'Election_Data_2018/Karnataka.csv': 'Karnataka',
        'Election_Data_2021/Assam.csv': 'Assam', 'Election_Data_2021/West_Bengal.csv': 'West Bengal',
        'Election_Data_2022/Goa.csv': 'Goa', 'Election_Data_2022/Manipur.csv': 'Manipur',
        'Election_Data_2022/Punjab.csv': 'Punjab', 'Election_Data_2022/Uttar_Pradesh.csv': 'Uttar Pradesh',
        'Election_Data_2022/Uttarakhand.csv': 'Uttarakhand', 'Election_Data_2023/Karnataka_counting.csv': 'Karnataka',
        'Election_Data_2024/andhrapradesh_counting.csv': 'Andhra Pradesh', 'Election_Data_2024/odisha_counting.csv': 'Odisha',
    }
    for f, st in files.items():
        d = pd.read_csv(f'{DL}/da/{f}', low_memory=False, encoding_errors='replace')
        d = d[pd.to_numeric(d.YEAR, errors='coerce').notna()]
        cat = d['AC_TYPE'] if 'AC_TYPE' in d.columns else (d['Category'] if 'Category' in d.columns else None)
        df = pd.DataFrame(dict(state=st, year=pd.to_numeric(d.YEAR).astype(int), label=None,
            seat=pd.to_numeric(d.AC_NO, errors='coerce'), name=d.AC_NAME.astype(str).str.strip().str.title(),
            cat=cat if cat is not None else None, party=d.PARTY.map(P.norm), votes=pd.to_numeric(d.VOTES, errors='coerce'),
            region=d['District'] if 'District' in d.columns else None))
        push(df, 'AE', 'data-analytics.github.io (ECI results)')

def load_2017():
    for f in glob.glob(f'{DL}/vidhan-sabha-2017-scraper/results/*.csv'):
        d = pd.read_csv(f)
        st = d.state.iloc[0]
        yr = 2016 if 'assam' in f else 2017
        df = pd.DataFrame(dict(state=fix_state(st), year=yr, label=None, seat=d.const_num,
            name=d.const_name.astype(str).str.split(' - ').str[-1].str.strip().str.title(), party=d.party.map(P.norm),
            votes=pd.to_numeric(d.votes, errors='coerce')))
        push(df, 'AE', 'spfrantz/vidhan-sabha-2017-scraper (ECI results)')

def load_2018():
    d = pd.read_csv(f'{DL}/vidhan-sabha-2018/vs2018_results.csv')
    df = pd.DataFrame(dict(state=d.state.map(fix_state), year=2018, label=None, seat=d.const_id,
        name=d.const_name.astype(str).str.split(' - ').str[-1].str.strip().str.title(), party=d.party.map(P.norm),
        votes=pd.to_numeric(d.votes, errors='coerce')))
    push(df, 'AE', 'spfrantz/vidhan-sabha-2018 (ECI results)')
    return df

def load_2023(names2018):
    m = {'cg': 'Chhattisgarh', 'mp': 'Madhya Pradesh', 'mz': 'Mizoram', 'raj': 'Rajasthan', 'ts': 'Telangana'}
    nm = names2018.drop_duplicates(['state', 'seat']).set_index(['state', 'seat']).name.to_dict()
    for k, st in m.items():
        parts = []
        for f in glob.glob(f'{DL}/assembly_elections_2023/{k}/*.xlsx'):
            d = pd.read_excel(f)
            parts.append(d)
        d = pd.concat(parts)
        d = d[d.party.notna() & ~d.candidate.astype(str).str.contains('total', case=False)]
        d['seat'] = pd.to_numeric(d.constituency, errors='coerce')
        df = pd.DataFrame(dict(state=st, year=2023, label=None, seat=d.seat,
            name=[nm.get((st, s), f'AC {s}') for s in d.seat], party=d.party.map(P.norm),
            votes=pd.to_numeric(d.total_votes, errors='coerce')))
        push(df, 'AE', 'azadecon/assembly_elections_2023 (ECI results)')


def main():
    ls_pcmap = load_ls()
    load_datameet_ae()
    load_da_ae()
    load_2017()
    d18 = load_2018()
    load_2023(d18)
    allr = pd.concat(ROWS, ignore_index=True)
    allr = allr[allr.votes.notna() & allr.seat.notna()]
    allr['seat'] = allr.seat.astype(int)
    allr['votes'] = allr.votes.astype(float)
    allr['label'] = allr.label.where(allr.label.notna(), allr.year.astype(str))
    # priority: later-pushed sources override earlier for the same (kind,state,label)
    allr['prio'] = 0
    order = {s: i for i, s in enumerate(allr.source.unique())}
    allr['prio'] = allr.source.map(order)
    best = allr.groupby(['kind', 'state', 'label']).prio.max().rename('best')
    allr = allr.join(best, on=['kind', 'state', 'label'])
    allr = allr[allr.prio == allr.best]
    allr.to_pickle(os.path.join(os.path.dirname(__file__), 'rows.pkl'))
    ls_pcmap.to_pickle(os.path.join(os.path.dirname(__file__), 'ls_pcmap.pkl'))
    print(allr.groupby(['kind']).size())
    print(allr[allr.kind == 'AE'].groupby('state').label.nunique().to_string())

if __name__ == '__main__':
    main()
