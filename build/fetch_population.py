"""Census 2011 population of every state and union territory (Wikipedia, List of states and union territories of India by population)
-> source/ref/population.json. Used by the delimitation scenario.

  python build/fetch_population.py
"""
import os, re, json, time, urllib.request, urllib.parse
from bs4 import BeautifulSoup
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
D = os.path.join(ROOT, 'source', 'data')

def txt(c):
    for sup in c.find_all(['sup', 'style']): sup.decompose()
    return re.sub(r'\s+', ' ', c.get_text(' ', strip=True))

def norm(s): return re.sub(r'[^a-z]', '', s.lower().replace('&', 'and'))

def main():
    url = 'https://en.wikipedia.org/w/api.php?action=parse&prop=text&format=json&formatversion=2&redirects=1&page=' + urllib.parse.quote('List of states and union territories of India by population')
    req = urllib.request.Request(url, headers={'User-Agent': 'janadesh-build/1.0 (https://github.com/TactualCoder24/janadesh)'})
    html = json.load(urllib.request.urlopen(req, timeout=60))['parse']['text']
    soup = BeautifulSoup(html, 'lxml'); pop = {}
    for t in soup.find_all('table'):
        rows = t.find_all('tr')
        if len(rows) < 30: continue
        for r in rows:
            c = [txt(x) for x in r.find_all(['th', 'td'])]
            if len(c) < 8 or not re.match(r'^\d', c[0]): continue
            n = re.sub(r'\[.*?\]', '', c[1]).strip(); v = re.sub(r'[^\d]', '', c[6])
            if n and v: pop[n] = int(v)
        break
    ls = json.load(open(f'{D}/ls.json', encoding='utf-8')); e = ls[-1]; names = e['regions']
    byn = {norm(k): k for k in pop}; out = {}; miss = []
    alias = {'andamanandnicobarislands': 'andamanandnicobarislands', 'dadraandnagarhavelianddamananddiu': 'dadraandnagarhavelianddamananddiu', 'delhi': 'delhi', 'nctofdelhi': 'delhi'}
    for r in names:
        k = norm(r); src = byn.get(k) or byn.get(alias.get(k, '')) or next((byn[x] for x in byn if x.startswith(k[:8]) or k.startswith(x[:8])), None)
        if src: out[r] = pop[src]
        else: miss.append(r)
    # Andhra Pradesh and Telangana were one state in 2011; the page lists them separately with 2011 figures for the new boundaries
    json.dump({'v': 1, 'source': 'Wikipedia, List of states and union territories of India by population (2011 Census column)', 'pop': out}, open(os.path.join(ROOT, 'source', 'ref', 'population.json'), 'w', encoding='utf-8'), separators=(',', ':'), ensure_ascii=False)
    print(len(out), 'regions; missing:', miss); print({k: out[k] for k in list(out)[:6]}, 'total', sum(out.values()))

if __name__ == '__main__':
    main()
