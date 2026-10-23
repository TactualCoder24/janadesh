// Alliance timeline (#21): who allied with whom in each election, read from the alliances recorded in the data,
// with the name of each alliance era and the splits, mergers and foundings of each party (from source/ref/lineage.json).
addI18n('en', {toolAlly: 'Alliance timeline', allySub: 'Which alliance each party was recorded in, election by election, with the biggest alliances of each election on top. ✂ split · ⊕ merger · ★ founded marks the first election after such an event. A dashed outline marks a change of alliance. Older elections may have no alliance data, and their labels are only as good as the source.', allySwitch: 'changed alliance', allyAlone: 'not in an alliance', allyNone: 'No alliance information is recorded for this election history.', allyBiggest: 'Biggest alliances (seats)', allyEras: 'Alliance names over the years',
  eraLS: '1977 Janata Party · 1980 and 1984 the Congress alone · 1989 and 1991 National Front, with the Left Front and the BJP outside it · 1996 United Front · 1998 and 1999 the NDA (BJP) against the Congress and allies · 2004 and 2009 the UPA (Congress) against the NDA · 2014 and 2019 NDA against UPA · 2024 NDA against the INDIA bloc (formed in 2023).'});
addI18n('hi', {toolAlly: 'गठबंधन समयरेखा', allySub: 'हर चुनाव में कौन-सा दल किस गठबंधन में दर्ज था, हर चुनाव के सबसे बड़े गठबंधन ऊपर। ✂ टूट · ⊕ विलय · ★ स्थापना ऐसी घटना के बाद का पहला चुनाव बताता है। बिंदीदार किनारा गठबंधन बदलने का संकेत है। पुराने चुनावों के गठबंधन आँकड़े न हों तो ख़ाली दिखेगा, और उनके नाम स्रोत जितने ही सही हैं।', allySwitch: 'गठबंधन बदला', allyAlone: 'किसी गठबंधन में नहीं', allyNone: 'इस चुनावी इतिहास के लिए गठबंधन की जानकारी दर्ज नहीं है।', allyBiggest: 'सबसे बड़े गठबंधन (सीटें)', allyEras: 'सालों में गठबंधनों के नाम',
  eraLS: '1977 जनता पार्टी · 1980 और 1984 में कांग्रेस अकेली · 1989 और 1991 राष्ट्रीय मोर्चा, वाम मोर्चा और भाजपा बाहर से · 1996 संयुक्त मोर्चा · 1998 और 1999 में एनडीए (भाजपा) बनाम कांग्रेस और सहयोगी · 2004 और 2009 में यूपीए (कांग्रेस) बनाम एनडीए · 2014 और 2019 में एनडीए बनाम यूपीए · 2024 में एनडीए बनाम इंडिया गठबंधन (2023 में बना)।'});
const ALLY_ABBR = {'National Front': 'NF', 'United Front': 'UF', 'Left Front': 'LF', 'Third Front': '3F', 'Janata': 'Janata', 'Sanyukta Morcha': 'SM'};
const allyShort = a => { const n = allyName(a); return ALLY_ABBR[a] || (n.length > 8 ? (n.split(/[\s+]+/).length > 1 ? n.split(/[\s+]+/).map(w => w[0]).join('').toUpperCase().slice(0, 5) + (a.endsWith('+') ? '+' : '') : n.slice(0, 7)) : n); };
registerTool({id: 'alliances', label: 'toolAlly', sub: 'allySub', async render(body, stale){
  const lin = await lineageData().catch(() => ({events: []}));
  const list = (await history()).filter(e => Object.keys(e.alliances || {}).length); if(stale()) return;
  if(list.length < 2){ body.innerHTML = `<p class="small">${esc(t('allyNone'))}</p>`; return; }
  const seats = {}, appear = {};
  list.forEach(e => { e.seats.forEach(s => { if(s[4].length){ const p = e.parties[s[4][0]]; seats[p] = (seats[p] || 0) + (s[6] || 1); } }); Object.keys(e.alliances).forEach(p => appear[p] = (appear[p] || 0) + 1); });
  const rows = Object.keys(appear).filter(p => appear[p] >= 2 && !SKIP_P.has(p)).sort((a, b) => (seats[b] || 0) - (seats[a] || 0) || appear[b] - appear[a]).slice(0, 24);
  const seatsIn = (e, p) => { const i = e.parties.indexOf(p); let n = 0; if(i < 0) return 0; e.seats.forEach(s => { if(s[4].length && s[4][0] === i) n += s[6] || 1; }); return n; };
  const colour = (e, a) => { const mem = Object.entries(e.alliances).filter(([, v]) => v === a).map(([p]) => p).sort((x, y) => seatsIn(e, y) - seatsIn(e, x)); return pColor(mem[0]); };
  // biggest alliances per election, by seats won by their members
  const big = list.map(e => { const m = new Map(); e.seats.forEach(s => { if(!s[4].length) return; const p = e.parties[s[4][0]], a = e.alliances[p]; if(a) m.set(a, (m.get(a) || 0) + (s[6] || 1)); }); return [...m.entries()].sort((x, y) => y[1] - x[1]).slice(0, 3); });
  // events by party code -> glyph in the first election at or after the event year
  const marks = new Map();
  (lin.events || []).forEach(ev => (ev.codes || []).forEach(c => { const j = list.findIndex((e, k) => e.year >= ev.year && (k === 0 || list[k - 1].year < ev.year)); if(j < 0 || list[j].year - ev.year > 12) return; const k = c + '|' + j; if(!marks.has(k)) marks.set(k, []); marks.get(k).push(ev); }));
  const head = list.map(e => `<th style="text-align:center;font-size:11.5px;min-width:60px">${esc(e.label)}</th>`).join('');
  const bigRow = list.map((e, j) => `<td style="text-align:center;padding:3px 2px;vertical-align:top">${big[j].map(([a, n]) => `<div class="achip" style="background:${colour(e, a)}22;border:1.5px solid ${colour(e, a)}" title="${esc(allyName(a))} ${n}">${esc(allyShort(a))} <b>${n}</b></div>`).join('')}</td>`).join('');
  const cells = p => list.map((e, j) => {
    const a = e.alliances[p], present = e.parties.includes(p), prev = j ? list[j - 1].alliances[p] : undefined, changed = j && prev !== a && (prev || a);
    const mk = (marks.get(p + '|' + j) || []), glyph = mk.length ? `<span class="evmark" title="${esc(mk.map(ev => ev.year + ' · ' + L2(ev.en, ev.hi)).join('\n'))}">${mk.map(ev => EV_GLYPH[ev.kind]).filter((x, i, arr) => arr.indexOf(x) === i).join('')}</span>` : '';
    if(!a) return `<td style="text-align:center;padding:2px;position:relative">${present ? `<span class="small" title="${esc(t('allyAlone'))}">–</span>` : ''}${glyph}</td>`;
    const c = colour(e, a);
    return `<td style="padding:2px;position:relative"><span class="achip" style="background:${c}22;border:1.5px ${changed ? 'dashed' : 'solid'} ${c};color:var(--ink)" title="${esc(allyName(a))}${changed ? ' · ' + esc(t('allySwitch')) : ''}">${esc(allyShort(a))}</span>${glyph}</td>`;
  }).join('');
  body.innerHTML = `${S.kind === 'LS' ? `<p class="small" style="margin:0 0 8px"><b>${esc(t('allyEras'))}:</b> ${esc(t('eraLS'))}</p>` : ''}
    <div class="tw"><table class="tbl" style="min-width:${150 + list.length * 62}px"><thead><tr><th style="text-align:left;position:sticky;left:0;background:var(--panel)">${esc(t('thParty2'))}</th>${head}</tr></thead><tbody>
    <tr style="background:var(--sunk)"><td style="text-align:left;position:sticky;left:0;background:var(--sunk);font-size:12px;font-weight:600">${esc(t('allyBiggest'))}</td>${bigRow}</tr>
    ${rows.map(p => `<tr><td style="text-align:left;position:sticky;left:0;background:var(--panel);white-space:nowrap">${pcell(p)}</td>${cells(p)}</tr>`).join('')}</tbody></table></div>`;
}});
