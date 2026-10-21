import os
HERE = os.path.dirname(os.path.abspath(__file__))
SITE = os.path.join(os.path.dirname(HERE), 'source')
t = open(os.path.join(HERE, 'template.html'), encoding='utf-8').read()
t = t.replace('/*I18N*/', open(os.path.join(HERE, 'i18n.js'), encoding='utf-8').read(), 1)
t = t.replace('/*ENGINE*/', open(os.path.join(HERE, 'engine.js'), encoding='utf-8').read(), 1)
open(os.path.join(SITE, 'index.html'), 'w', encoding='utf-8', newline='\n').write(t)
print('assembled', len(t))
