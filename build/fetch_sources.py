"""Download the raw result files that build.py reads into dl/ (gitignored). Safe to re-run; existing files are skipped.

  python build/fetch_sources.py
"""
import os, sys, json, urllib.request, urllib.parse

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DL = os.environ.get('JANADESH_DL', os.path.join(ROOT, 'dl'))
UA = {'User-Agent': 'janadesh-build'}

def get(url, dest):
    if os.path.exists(dest) and os.path.getsize(dest) > 0:
        return False
    os.makedirs(os.path.dirname(dest), exist_ok=True)
    req = urllib.request.Request(url, headers=UA)
    with urllib.request.urlopen(req, timeout=120) as r, open(dest, 'wb') as f:
        f.write(r.read())
    print('got', os.path.relpath(dest, ROOT), os.path.getsize(dest))
    return True

def api(path):
    req = urllib.request.Request('https://api.github.com/' + path, headers=UA)
    return json.load(urllib.request.urlopen(req, timeout=60))

RAW = 'https://raw.githubusercontent.com/%s/%s/%s'
DA = ['Election_Data/assembly_kerala_detail.csv', 'Election_Data/assembly_pondi_detail.csv', 'Election_Data/assembly_tn_detail.csv',
      'Election_Data_2018/Karnataka.csv', 'Election_Data_2021/Assam.csv', 'Election_Data_2021/West_Bengal.csv', 'Election_Data_2022/Goa.csv',
      'Election_Data_2022/Manipur.csv', 'Election_Data_2022/Punjab.csv', 'Election_Data_2022/Uttar_Pradesh.csv', 'Election_Data_2022/Uttarakhand.csv',
      'Election_Data_2023/Karnataka_counting.csv', 'Election_Data_2024/andhrapradesh_counting.csv', 'Election_Data_2024/odisha_counting.csv',
      'Election_Data_2024/parliament.csv']

def main():
    for p in DA:
        get(RAW % ('data-analytics/data-analytics.github.io', 'master', p), os.path.join(DL, 'da', p))
    get('https://raw.githubusercontent.com/datameet/india-election-data/master/assembly-elections/assembly.csv', os.path.join(DL, 'india-election-data/assembly-elections/assembly.csv'))
    for repo in ['gitcheckoutnikhil/india-elections-data']:
        try:
            get(RAW % (repo, 'master', 'parliament_final.csv'), os.path.join(DL, 'india-elections-data/parliament_final.csv'))
        except Exception as e:
            print('skip', repo, e)
    for d, repo, branch in [('vidhan-sabha-2017-scraper', 'spfrantz/vidhan-sabha-2017-scraper', 'master')]:
        for f in api(f'repos/{repo}/contents/results'):
            if f['name'].endswith('.csv'):
                get(f['download_url'], os.path.join(DL, d, 'results', f['name']))
    get(RAW % ('spfrantz/vidhan-sabha-2018', 'master', 'vs2018_results.csv'), os.path.join(DL, 'vidhan-sabha-2018/vs2018_results.csv'))
    for st in api('repos/azadecon/assembly_elections_2023/contents'):
        if st['type'] == 'dir':
            for f in api(f"repos/azadecon/assembly_elections_2023/contents/{st['name']}"):
                if f['name'].endswith('.xlsx'):
                    get(f['download_url'], os.path.join(DL, 'assembly_elections_2023', st['name'], f['name']))

if __name__ == '__main__':
    main()
