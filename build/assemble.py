import os, glob
HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.dirname(HERE)
t = open(os.path.join(HERE, 'template.html'), encoding='utf-8').read()
t = t.replace('/*I18N*/', open(os.path.join(HERE, 'i18n.js'), encoding='utf-8').read(), 1)
t = t.replace('/*ENGINE*/', open(os.path.join(HERE, 'engine.js'), encoding='utf-8').read(), 1)
feats = ''
for p in sorted(glob.glob(os.path.join(HERE, 'features', '*.js'))):
    feats += '\n// ======== feature: %s ========\n' % os.path.basename(p) + open(p, encoding='utf-8').read() + '\n'
assert '/*FEATURES*/' in t
t = t.replace('/*FEATURES*/', feats, 1)
# the deployed site lives at the repo root and reads its data from source/
open(os.path.join(ROOT, 'index.html'), 'w', encoding='utf-8', newline='\n').write(t)
print('assembled', len(t))
