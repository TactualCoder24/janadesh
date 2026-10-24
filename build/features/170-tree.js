// Party family tree (#56): splits, mergers and foundings, as a timeline diagram (page #/tree). Data: source/ref/lineage.json.
addI18n('en', {treeTitle: 'Party family tree', treeSub: 'How today\'s parties split off from, or merged into, older ones. Simplified; each event is a split, a merger or a founding.', treeEvents: 'What happened, year by year', treeNow: 'today', evSplit: 'Split', evMerge: 'Merger', evFormed: 'Founded', treeNote: 'Hover or tap a marker for the event. Colours are the party colours used in the simulator.'});
addI18n('hi', {treeTitle: 'दलों का वंश-वृक्ष', treeSub: 'आज के दल पुराने दलों से कैसे टूटे या उनमें कैसे मिले। सरलीकृत; हर घटना एक टूट, विलय या स्थापना है।', treeEvents: 'साल दर साल क्या हुआ', treeNow: 'आज', evSplit: 'टूट', evMerge: 'विलय', evFormed: 'स्थापना', treeNote: 'घटना देखने के लिए मार्कर पर होवर या टैप करें। रंग सिम्युलेटर के दलों के रंग हैं।'});
let LIN = null;
async function lineageData(){ if(!LIN) LIN = await getJSON('ref/lineage.json'); return LIN; }
const EV_GLYPH = {split: '✂', merge: '⊕', formed: '★'};
PAGES.set('tree', async box => {
  const D = await lineageData();
  const Y0 = 1950, Y1 = 2028, PX = 12, L = 14, W = L + (Y1 - Y0) * PX + 30, RH = 28, rows = Math.max(...D.nodes.map(n => n.row)) + 2, H = rows * RH + 40;
  const X = y => L + (Math.min(y, Y1) - Y0) * PX, Yr = r => 30 + r * RH + RH / 2 + 8, node = id => D.nodes.find(n => n.id === id);
  const fam = ['#EEF0FA', '#FFF3E6', '#FDECEC', '#EEF7EE', '#EAF3F8', '#FFF6DD', '#F2EEF8'];
  const colour = n => n.code ? pColor(n.code) : '#8A8F98';
  let g = D.families.map((f, i) => `<rect x="0" y="${30 + f.from * RH}" width="${W}" height="${(f.to - f.from) * RH}" fill="${fam[i % fam.length]}"/>${svgText(W - 8, 30 + f.from * RH + 13, L2(f.en, f.hi), {size: 11.5, weight: 700, fill: 'var(--muted)', anchor: 'end'})}`).join('');
  for(let y = 1950; y <= 2020; y += 10) g += `<line x1="${X(y)}" x2="${X(y)}" y1="22" y2="${H - 8}" stroke="var(--line)"/>${svgText(X(y), 16, String(y), {anchor: 'middle', size: 11})}`;
  g += svgText(X(2026), 16, t('treeNow'), {anchor: 'middle', size: 11});
  D.events.forEach(ev => { const x = X(ev.year), pairs = ev.links || (ev.parents.length ? ev.parents.flatMap(a => ev.children.map(b => [a, b])) : []);
    pairs.forEach(([a, b]) => { g += `<path d="M${x},${Yr(node(a).row)} V${Yr(node(b).row)}" stroke="var(--ink)" stroke-opacity=".55" stroke-width="1.6" stroke-dasharray="${ev.kind === 'merge' ? '0' : '3 2'}"/>`; }); });
  D.nodes.forEach(n => { const x0 = X(n.from), x1 = n.to ? X(n.to + .8) : X(2027), y = Yr(n.row);
    g += `<line x1="${x0}" x2="${Math.max(x1, x0 + 6)}" y1="${y}" y2="${y}" stroke="${colour(n)}" stroke-width="9" stroke-linecap="round"/>`;
    g += svgText(x0 + (x0 > 600 ? -4 : 4), y - 8, L2(n.n, n.h), {size: 11.5, weight: 600, fill: 'var(--ink)', anchor: x0 > 700 ? 'end' : 'start'}); });
  D.events.forEach(ev => ev.children.concat(ev.kind === 'merge' ? [] : ev.parents.slice(0, 0)).forEach(id => { const n = node(id), x = X(ev.year), y = Yr(n.row);
    g += `<g><title>${esc(ev.year + ' · ' + L2(ev.en, ev.hi))}</title><circle cx="${x}" cy="${y}" r="7.5" fill="var(--panel)" stroke="var(--ink)" stroke-width="1.6"/>${svgText(x, y + 4, EV_GLYPH[ev.kind], {anchor: 'middle', size: 10.5, fill: '#141414'})}</g>`; }));
  const kindName = k => t(k === 'split' ? 'evSplit' : k === 'merge' ? 'evMerge' : 'evFormed');
  box.innerHTML = `<article class="page" style="max-width:none"><h2>${esc(t('treeTitle'))}</h2><p class="lede">${esc(t('treeSub'))}</p>
    <p class="small">✂ ${esc(t('evSplit'))} · ⊕ ${esc(t('evMerge'))} · ★ ${esc(t('evFormed'))}. ${esc(t('treeNote'))}</p>
    <div class="tw"><svg viewBox="0 0 ${W} ${H}" style="min-width:${W}px;max-width:100%" role="img" aria-label="${esc(t('treeTitle'))}">${g}</svg></div>
    <h3>${esc(t('treeEvents'))}</h3>${D.events.map(ev => `<div class="chg"><span class="pill">${esc(ev.year)}</span> <span class="pill" style="background:var(--sunk);color:var(--ink)">${EV_GLYPH[ev.kind]} ${esc(kindName(ev.kind))}</span><p style="color:var(--ink)">${esc(L2(ev.en, ev.hi))}</p></div>`).join('')}
    <p class="small">${esc(D.note)}</p></article>`;
});
