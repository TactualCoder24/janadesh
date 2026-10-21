"""Embed all data and map files (gzip + base64) into one self-contained index.html."""
import os, gzip, base64, json
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SITE = os.path.join(ROOT, 'source')
OUT = ROOT  # writes the single-file index.html at the repo root
os.makedirs(OUT, exist_ok=True)
html = open(f'{SITE}/index.html', encoding='utf-8').read()
blocks = []
for d in ['data', 'maps', 'maps/ac']:
    for f in sorted(os.listdir(f'{SITE}/{d}')):
        p = f'{d}/{f}'
        if not os.path.isfile(f'{SITE}/{p}') or not f.endswith('.json'):
            continue
        raw = json.dumps(json.load(open(f'{SITE}/{p}')), separators=(',', ':')).encode()
        b = base64.b64encode(gzip.compress(raw, 9)).decode()
        blocks.append(f'<script type="application/octet-stream" id="d:{p}">{b}</script>')
html = html.replace('<!--EMBED-->', '\n'.join(blocks), 1)
open(f'{OUT}/index.html', 'w', encoding='utf-8', newline='\n').write(html)
print(len(blocks), 'files embedded,', round(len(html) / 1e6, 2), 'MB')
