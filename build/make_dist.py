"""Build the deployable site at the repo root.

  python build/make_dist.py           assemble index.html (data stays in source/ and loads on demand)
  python build/make_dist.py --single  also write janadesh-single.html with all data embedded (gzip + base64), for offline / one-file hosting

Order: assemble.py (template + i18n + engine + features -> index.html), then derived data files
(home summary inside source/data/index.json, open-data downloads in data/)."""
import os, sys, gzip, base64, json, subprocess
HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.dirname(HERE)
SITE = os.path.join(ROOT, 'source')

def run(script):
    r = subprocess.run([sys.executable, os.path.join(HERE, script)], capture_output=True, text=True, encoding='utf-8', errors='replace')
    print(r.stdout.strip()); 
    if r.returncode: print(r.stderr); sys.exit(r.returncode)

run('assemble.py')

def syntax_check():
    """Fail the build if the page's script does not parse (one stray apostrophe in a string takes the whole site down)."""
    import shutil, tempfile
    node = shutil.which('node')
    if not node:
        print('warning: node not found, skipping the JavaScript syntax check'); return
    html = open(os.path.join(ROOT, 'index.html'), encoding='utf-8').read()
    i = html.index("(() => {" + chr(10) + "'use strict';"); j = html.index('</script>', i)
    with tempfile.NamedTemporaryFile('w', suffix='.js', delete=False, encoding='utf-8') as f:
        f.write(html[i:j]); tmp = f.name
    r = subprocess.run([node, '--check', tmp], capture_output=True, text=True, encoding='utf-8', errors='replace')
    os.unlink(tmp)
    if r.returncode:
        print('JAVASCRIPT SYNTAX ERROR in the built page:' + chr(10) + r.stderr); sys.exit(1)
    print('syntax check ok')
syntax_check()
for extra in ['fix_independents.py', 'derive_home.py', 'make_search.py', 'derive_stats.py', 'make_opendata.py']:
    if os.path.exists(os.path.join(HERE, extra)): run(extra)

if '--single' in sys.argv:
    html = open(f'{ROOT}/index.html', encoding='utf-8').read()
    html = html.replace("const BASE = 'source/';", "const BASE = '';")
    blocks = []
    for d in ['data', 'maps', 'maps/ac']:
        for f in sorted(os.listdir(f'{SITE}/{d}')):
            p = f'{d}/{f}'
            if not os.path.isfile(f'{SITE}/{p}') or not f.endswith('.json'):
                continue
            raw = json.dumps(json.load(open(f'{SITE}/{p}', encoding='utf-8')), separators=(',', ':')).encode()
            b = base64.b64encode(gzip.compress(raw, 9, mtime=0)).decode()
            blocks.append(f'<script type="application/octet-stream" id="d:{p}">{b}</script>')
    html = html.replace('<!--EMBED-->', '\n'.join(blocks), 1)
    open(f'{ROOT}/janadesh-single.html', 'w', encoding='utf-8', newline='\n').write(html)
    print(len(blocks), 'files embedded,', round(len(html) / 1e6, 2), 'MB -> janadesh-single.html')
