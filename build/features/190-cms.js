// Chief Minister history (#55): every state's chief ministers, their terms and parties, linked to the election of the assembly they served under.
addI18n('en', {toolCM: 'Chief ministers', cmSub: 'Every chief minister of this state, with the party and term, and the assembly election they came in under. Names and dates from Wikipedia.', cmNone: 'Pick a state assembly to see its chief ministers.', cmTimeline: 'Terms and elections', cmTable: 'Chief ministers', cmCameIn: 'Came in with the {y} election', cmMid: 'Took over during the {y} assembly', cmTerm: 'Term', cmPartyH: 'Party', cmBy: 'Election', cmIncumbent: 'present', cmLongest: 'Longest single term: {n} ({y} years)', cmCount: '{n} chief ministers since {y}', cmSource: 'Source: Wikipedia, List of chief ministers of {s}.'});
addI18n('hi', {toolCM: 'मुख्यमंत्री', cmSub: 'इस राज्य के हर मुख्यमंत्री, दल और कार्यकाल के साथ, और वह चुनाव जिसकी विधानसभा में वे आए। नाम और तारीख़ें विकिपीडिया से।', cmNone: 'मुख्यमंत्री देखने के लिए किसी राज्य की विधानसभा चुनें।', cmTimeline: 'कार्यकाल और चुनाव', cmTable: 'मुख्यमंत्री', cmCameIn: '{y} के चुनाव के साथ आए', cmMid: '{y} की विधानसभा के दौरान कमान संभाली', cmTerm: 'कार्यकाल', cmPartyH: 'दल', cmBy: 'चुनाव', cmIncumbent: 'वर्तमान', cmLongest: 'सबसे लंबा एक कार्यकाल: {n} ({y} साल)', cmCount: '{y} से {n} मुख्यमंत्री', cmSource: 'स्रोत: विकिपीडिया, {s} के मुख्यमंत्रियों की सूची।'});
let CMS = null;
async function cmData(){ if(!CMS){ try{ CMS = await getJSON('ref/cms.json'); }catch(e){ CMS = {states: {}}; } } return CMS; }
function partyCodeFromName(nm){
  if(!nm) return null; const k = nameKey(nm); if(partyCodeFromName.map === undefined){ const m = new Map(); Object.entries(META).forEach(([c, v]) => m.set(nameKey(v.n), c)); partyCodeFromName.map = m; }
  const m = partyCodeFromName.map; if(m.has(k)) return m.get(k);
  for(const [kk, c] of m) if(kk.length > 6 && (k.startsWith(kk) || kk.startsWith(k))) return c;
  const ab = nm.match(/\(([A-Z()]{2,8})\)/); return ab && META[ab[1]] ? ab[1] : null;
}
const cmColor = nm => { const c = partyCodeFromName(nm); return c ? pColor(c) : '#9aa0aa'; };
const cmShort = nm => { const c = partyCodeFromName(nm); return c ? shortCode2(c) : (nm || '').split(' ').map(w => w[0]).join('').slice(0, 5); };
registerTool({id: 'cms', label: 'toolCM', sub: 'cmSub', key: () => S.eid + '|' + S.kind, async render(body, stale){
  if(S.kind !== 'AE'){ body.innerHTML = `<p class="small">${esc(t('cmNone'))}</p>`; return; }
  const d = await cmData(); if(stale()) return;
  const terms = (d.states || {})[S.state];
  if(!terms || !terms.length){ body.innerHTML = `<p class="small">${esc(t('toolsNoData'))}</p>`; return; }
  const els = INDEX.elections.filter(e => e.kind === 'AE' && e.state === S.state).sort((a, b) => a.year - b.year || a.label.localeCompare(b.label));
  const Y0 = Math.min(1950, +terms[0].from.slice(0, 4)), Y1 = new Date().getFullYear() + 1, W = 900, L = 6, R = 6, px = (W - L - R) / (Y1 - Y0), X = y => L + (y - Y0) * px;
  const yrOf = s => +s.slice(0, 4) + (+s.slice(5, 7) - 1) / 12;
  const lanes = []; // keep overlapping terms (interim, back-to-back same month) on separate rows
  const bars = terms.map(c => { const a = yrOf(c.from), b = c.to ? yrOf(c.to) : Y1 - 0.5; let r = 0; while(lanes[r] && lanes[r] > a + .02) r++; lanes[r] = b; return {c, a, b, r}; });
  const rows = Math.max(...bars.map(b => b.r)) + 1, H = 30 + rows * 24 + 20;
  let g = '';
  for(let y = Math.ceil(Y0 / 10) * 10; y <= Y1; y += 10) g += `<line x1="${X(y)}" x2="${X(y)}" y1="22" y2="${H - 16}" stroke="var(--line)"/>${svgText(X(y), 14, String(y), {anchor: 'middle', size: 11})}`;
  bars.forEach(o => { const x0 = X(o.a), w = Math.max(3, X(o.b) - x0), y = 28 + o.r * 24, col = cmColor(o.c.party);
    g += `<g><title>${esc(o.c.name)} · ${esc(o.c.party)} · ${o.c.from} → ${o.c.to || t('cmIncumbent')}</title><rect x="${x0}" y="${y}" width="${w}" height="19" rx="4" fill="${col}"/>${w > 46 ? `<text x="${x0 + 4}" y="${y + 13.5}" font-size="11" fill="#fff" style="paint-order:stroke;stroke:rgba(0,0,0,.35);stroke-width:2px">${esc(o.c.name.split(' ').slice(-1)[0].slice(0, Math.floor(w / 6.5)))}</text>` : ''}</g>`; });
  els.forEach(e => { const x = X(e.year + .4); g += `<line x1="${x}" x2="${x}" y1="24" y2="${H - 16}" stroke="var(--ink)" stroke-opacity=".5" stroke-dasharray="2 3"/><circle cx="${x}" cy="${H - 12}" r="3" fill="var(--ink)"><title>${esc(e.label)}</title></circle>`; });
  // link each term to the election it came in under
  const elFor = c => { const y = c.asm || +c.from.slice(0, 4); const cand = els.filter(e => e.year <= y); return cand.length ? cand[cand.length - 1] : null; };
  const rowsT = terms.slice().reverse().map(c => { const e = elFor(c), sy = +c.from.slice(0, 4), fresh = e && sy - e.year <= 1 && !terms.some(o => o !== c && o.from < c.from && o.from >= (e.year + '-01-01') && o.asm === c.asm && o.name !== c.name && false);
    const firstOfAsm = e && terms.filter(o => elFor(o) === e).sort((a, b) => a.from.localeCompare(b.from))[0] === c;
    const yrs = ((c.to ? new Date(c.to) : new Date()) - new Date(c.from)) / 31557600000;
    return `<tr><td><b>${esc(c.name)}</b></td><td><span class="pname"><i class="sw" style="background:${cmColor(c.party)}"></i><span>${esc(c.party || '')}</span></span></td><td class="num" style="white-space:nowrap">${esc(c.from.slice(0, 4))}–${c.to ? esc(c.to.slice(0, 4)) : esc(t('cmIncumbent'))}<div class="small">${fmt1(yrs)} ${LANG === 'hi' ? 'साल' : 'yrs'}</div></td><td class="small">${e ? esc(firstOfAsm ? t('cmCameIn', {y: e.label}) : t('cmMid', {y: e.label})) : ''}</td></tr>`; }).join('');
  const long = terms.slice().sort((a, b) => ((b.to ? new Date(b.to) : new Date()) - new Date(b.from)) - ((a.to ? new Date(a.to) : new Date()) - new Date(a.from)))[0];
  body.innerHTML = `<p style="font-family:var(--display);font-weight:600;margin:0 0 4px">${esc(t('cmCount', {n: new Set(terms.map(c => c.name)).size, y: terms[0].from.slice(0, 4)}))} · ${esc(t('cmLongest', {n: long.name, y: fmt1(((long.to ? new Date(long.to) : new Date()) - new Date(long.from)) / 31557600000)}))}</p>
    <h4>${esc(t('cmTimeline'))}</h4><div class="tw"><svg viewBox="0 0 ${W} ${H}" style="min-width:560px" role="img" aria-label="${esc(t('cmTimeline'))}">${g}</svg></div>
    <h4 style="margin-top:10px">${esc(t('cmTable'))}</h4><div class="seatlist" style="max-height:420px"><table class="tbl"><thead><tr><th>${esc(t('cmTable'))}</th><th>${esc(t('cmPartyH'))}</th><th>${esc(t('cmTerm'))}</th><th>${esc(t('cmBy'))}</th></tr></thead><tbody>${rowsT}</tbody></table></div>
    <p class="small" style="margin-top:6px">${esc(t('cmSource', {s: stName(S.state)}))}</p>`;
  alignTables(body);
}});
