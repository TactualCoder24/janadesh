// Phase 4b, the smarter model: wave tracker (#67), realistic mode (#70), signals from other elections (#69). Core and swing voters (#66) and the momentum baseline (#68) live in engine.js.
addI18n('en', {
  coreM: 'Core + swing', coreHint: 'Each party\'s core is its floor in the last three elections in that seat. A swing first moves the swing voters; the core only moves with a wave. Seats that have moved a lot before swing more.', waveLbl: 'Wave', waveNone: 'No wave', waveMild: 'Mild wave', waveStrong: 'Strong wave',
  toolWave: 'Wave tracker', waveSub: 'How big and how even the biggest swing was at every election in the data: the vote share the biggest gainer added, times the share of seats where it rose. Strong is 8 points or more, mild 4 to 8. Only parties that already had at least 1.5% before count, so new parties and splits do not show up as waves.', waveScore: 'Wave score', waveGainer: 'Biggest gainer', waveUni: '{p}% of seats up', waveStrongT: 'Strong wave', waveMildT: 'Mild wave', waveNoneT: 'No wave', waveNeedPrev: 'This is the first election in the data, so there is nothing to compare with.',
  waveName1977: 'Janata wave', waveName1984: 'Rajiv Gandhi sympathy wave', waveName2014: 'Modi wave', waveName2019: 'Modi wave',
  realTitle: 'Realistic mode', realHint: 'Limits how far votes can move, given the months left before the election and whether a wave is on, so a slider cannot give something that has never happened. Without it you only get a warning.', realOn: 'Keep swings realistic', realMonths: 'Months until the election: {v}', realWave: 'Wave',
  realBeyond: 'Beyond anything seen: {p} moves {x} points; the biggest move between two elections here is {m} points.', realLimit: 'Above the realistic limit of {a} points: {p} moves {x}.', realClamped: 'Realistic mode held {p} to {a} points.',
  toolSig: 'Signals from other elections', sigSub: 'The latest assembly results as early hints for the next Lok Sabha. Each state\'s assembly vote has a habit of differing from its Lok Sabha vote, measured from past elections held close together, so a state\'s assembly vote is translated before it is read as a hint.', sigState: 'State', sigAsm: 'Latest assembly', sigLS: 'Lok Sabha {y}', sigGap: 'Usual assembly-minus-Lok Sabha gap', sigImp: 'Hint for the next Lok Sabha (change from {y})', sigNat: 'Weighted across states, the hints point to BJP {a} points and Congress {b} points compared with {y}.', sigApply: 'Use this as the swing', sigNote: 'Where a state has no past pair of elections close together the gap is taken as zero. By-elections point the same way as the scoreboard in "By-elections". Local body results are not used because comparable data is not available in one place.', sigPts: 'pts', sigNoLS: 'The assembly-to-Lok Sabha translation is only shown for the Lok Sabha. For this state:', sigStByp: 'By-elections in {s} since 2014: {n}, of which {c} changed hands. Most were won by {p} ({w}).', sigStNone: 'No by-elections or city body results for {s} in the data.', sigStLocal: '{c}, {y}: {r}.',
  labMom: 'Momentum baseline', labMomHint: 'Start from a weighted average of the last four elections in each seat (latest counts most) instead of only the latest, so places where a party keeps winning lean its way.', labMomOn: 'Use the weighted average', labBMom: 'momentum baseline',
});
addI18n('hi', {
  coreM: 'कोर + स्विंग', coreHint: 'हर दल का कोर उस सीट पर पिछले तीन चुनावों में उसका न्यूनतम हिस्सा है। स्विंग पहले स्विंग वाले मतदाताओं को खिसकाता है; कोर सिर्फ़ लहर के साथ खिसकता है। जो सीटें पहले ज़्यादा खिसकी हैं वे ज़्यादा स्विंग करती हैं।', waveLbl: 'लहर', waveNone: 'लहर नहीं', waveMild: 'हल्की लहर', waveStrong: 'तेज़ लहर',
  toolWave: 'लहर ट्रैकर', waveSub: 'आँकड़ों के हर चुनाव में सबसे बड़ा स्विंग कितना बड़ा और कितना एक-सा था: सबसे ज़्यादा बढ़ने वाले दल का जुड़ा वोट हिस्सा, गुणा उन सीटों का हिस्सा जहाँ वह बढ़ा। 8 अंक या ज़्यादा तेज़, 4 से 8 हल्की। सिर्फ़ वे दल गिने जाते हैं जिनके पास पहले से कम से कम 1.5% वोट था, इसलिए नए दल और टूट लहर की तरह नहीं दिखते।', waveScore: 'लहर का अंक', waveGainer: 'सबसे ज़्यादा बढ़ने वाला', waveUni: '{p}% सीटों पर बढ़त', waveStrongT: 'तेज़ लहर', waveMildT: 'हल्की लहर', waveNoneT: 'लहर नहीं', waveNeedPrev: 'यह आँकड़ों का पहला चुनाव है, इसलिए तुलना के लिए कुछ नहीं है।',
  waveName1977: 'जनता लहर', waveName1984: 'राजीव गांधी सहानुभूति लहर', waveName2014: 'मोदी लहर', waveName2019: 'मोदी लहर',
  realTitle: 'यथार्थवादी मोड', realHint: 'चुनाव में बचे महीनों और लहर के होने न होने को देखकर वोट कितना खिसक सकता है यह सीमित करता है, ताकि स्लाइडर ऐसा नतीजा न दे जो कभी हुआ ही नहीं। इसके बिना सिर्फ़ चेतावनी मिलती है।', realOn: 'स्विंग यथार्थवादी रखें', realMonths: 'चुनाव में बचे महीने: {v}', realWave: 'लहर',
  realBeyond: 'अब तक देखे गए से बाहर: {p} {x} अंक खिसकता है; यहाँ दो चुनावों के बीच सबसे बड़ा खिसकाव {m} अंक का है।', realLimit: '{a} अंक की यथार्थवादी सीमा से ऊपर: {p} {x} खिसकता है।', realClamped: 'यथार्थवादी मोड ने {p} को {a} अंक तक रोका।',
  toolSig: 'दूसरे चुनावों के संकेत', sigSub: 'ताज़ा विधानसभा नतीजे अगली लोकसभा के शुरुआती संकेत की तरह। हर राज्य का विधानसभा वोट अक्सर उसके लोकसभा वोट से अलग होता है, जिसे पास-पास हुए पिछले चुनावों से नापा गया है; इसलिए संकेत पढ़ने से पहले राज्य के विधानसभा वोट का अनुवाद किया जाता है।', sigState: 'राज्य', sigAsm: 'ताज़ा विधानसभा', sigLS: 'लोकसभा {y}', sigGap: 'आम तौर पर विधानसभा-घटा-लोकसभा अंतर', sigImp: 'अगली लोकसभा का संकेत ({y} से बदलाव)', sigNat: 'राज्यों के भार से जोड़कर, संकेत {y} की तुलना में भाजपा के लिए {a} अंक और कांग्रेस के लिए {b} अंक की ओर इशारा करते हैं।', sigApply: 'इसे स्विंग की तरह इस्तेमाल करें', sigNote: 'जिस राज्य में पास-पास हुए चुनावों की पुरानी जोड़ी नहीं है वहाँ अंतर शून्य लिया गया है। उप-चुनाव "उप-चुनाव" के स्कोरबोर्ड वाली दिशा में ही इशारा करते हैं। स्थानीय निकाय के नतीजे इस्तेमाल नहीं हुए क्योंकि तुलनीय आँकड़े एक जगह उपलब्ध नहीं हैं।', sigPts: 'अंक', sigNoLS: 'विधानसभा से लोकसभा का अनुवाद सिर्फ़ लोकसभा के लिए दिखता है। इस राज्य के लिए:', sigStByp: '2014 से {s} में उप-चुनाव: {n}, जिनमें {c} ने हाथ बदला। ज़्यादातर {p} ने जीते ({w})।', sigStNone: '{s} के लिए आँकड़ों में कोई उप-चुनाव या शहरी निकाय का नतीजा नहीं।', sigStLocal: '{c}, {y}: {r}।',
  labMom: 'गति पर आधारित शुरुआत', labMomHint: 'हर सीट पर सिर्फ़ ताज़ा चुनाव की जगह पिछले चार चुनावों के भारित औसत से शुरू करें (ताज़ा का वज़न सबसे ज़्यादा), ताकि जहाँ कोई दल लगातार जीतता रहा वहाँ उसी की ओर झुकाव रहे।', labMomOn: 'भारित औसत इस्तेमाल करें', labBMom: 'गति पर आधारित शुरुआत',
});
// ---------- history of national swings (from stats.json), shared by the wave tracker and realistic mode ----------
async function swingStats(kind, state){
  const els = INDEX.elections.filter(e => kind === 'LS' ? e.kind === 'LS' : (e.kind === 'AE' && e.state === state)).sort((a, b) => a.year - b.year || a.label.localeCompare(b.label)), st = await statsData(), maxes = [];
  for(let i = 1; i < els.length; i++){ const a = st[els[i - 1].id], b = st[els[i].id]; if(!a || !b) continue; const am = new Map(a.votes); let m = 0; b.votes.forEach(([p, v]) => { if(am.has(p) && (v >= 3 || am.get(p) >= 3)) m = Math.max(m, Math.abs(v - am.get(p))); }); if(m) maxes.push(m); }
  const sorted = maxes.slice().sort((x, y) => x - y);
  return {max: sorted.length ? sorted[sorted.length - 1] : 12, typical: sorted.length ? sorted[Math.floor(sorted.length / 2)] : 5, n: sorted.length};
}
const SWS = new Map(), SWS_WAIT = new Set();
function swingStatsNow(){
  const key = S.kind + '|' + S.state; if(SWS.has(key)) return SWS.get(key);
  if(!SWS_WAIT.has(key)){ SWS_WAIT.add(key); swingStats(S.kind, S.state).then(r => { SWS.set(key, r); if(E && key === S.kind + '|' + S.state){ if(S.real && S.real.on) run(); else realBadge(); } }); }
  return null;
}
function realAllow(hs){
  const w = S.wave || 'none', base = w === 'strong' ? hs.max : w === 'mild' ? (hs.typical * 1.6 + hs.max) / 2 : hs.typical * 1.6, months = S.real && S.real.months != null ? S.real.months : 24;
  return base * (0.35 + 0.65 * Math.min(1, months / 60));
}
function realisticClamp(T){
  if(!S.real || !S.real.on) return T; const hs = swingStatsNow(); if(!hs) return T;
  const allow = realAllow(hs), B = U.map(g => g.base), out = T.slice(); let hit = null;
  U.forEach((g, k) => { if(g.key === 'OTH' || B[k] < 3) return; const d = T[k] - B[k]; if(Math.abs(d) > allow){ out[k] = B[k] + Math.sign(d) * allow; hit = hit || {p: g.name, a: allow}; } });
  if(!hit) return T; const tot = out.reduce((a, b) => a + b, 0); S.realHit = hit; return out.map(v => 100 * v / tot);
}
function realBadge(){
  const el = $('#badges'); if(!el || !RES || !E) return; el.querySelectorAll('.realtag').forEach(x => x.remove());
  const hs = swingStatsNow(); if(!hs) return; const T = RES.T, B = U.map(g => g.base); let worst = null;
  U.forEach((g, k) => { if(g.key === 'OTH' || B[k] < 3) return; const d = Math.abs(T[k] - B[k]); if(!worst || d > worst.d) worst = {d, g}; });
  if(!worst) return; let msg = '';
  if(S.real && S.real.on){ const a = realAllow(hs); if(S.realHit) msg = t('realClamped', {p: S.realHit.p, a: fmt1(a)}); else if(worst.d > a) msg = t('realLimit', {a: fmt1(a), p: worst.g.name, x: fmt1(worst.d)}); }
  if(!msg && worst.d > hs.max + 0.05) msg = t('realBeyond', {p: worst.g.name, x: fmt1(worst.d), m: fmt1(hs.max)});
  if(msg) el.insertAdjacentHTML('beforeend', ` <span class="tag warn realtag" title="${esc(msg)}">⚠ ${esc(msg)}</span>`);
}
// ---------- wave tracker ----------
registerTool({id: 'waves', label: 'toolWave', sub: 'waveSub', async render(body, stale){
  const list = await history(); if(stale()) return;
  if(list.length < 2){ body.innerHTML = `<p class="small">${esc(t('waveNeedPrev'))}</p>`; return; }
  const agg = e => { const v = {}; let tot = 0; e.seats.forEach(s => { const f = s[4]; for(let k = 0; k < f.length; k += 2){ const p = e.parties[f[k]]; v[p] = (v[p] || 0) + f[k + 1]; tot += f[k + 1]; } tot += s[5] || 0; }); return {v, tot}; };
  const seatShare = (e, s, p) => { let v = 0, tot = s[5] || 0; for(let k = 0; k < s[4].length; k += 2){ if(e.parties[s[4][k]] === p) v += s[4][k + 1]; tot += s[4][k + 1]; } return tot > 0 && v > 0 ? v / tot : null; };
  const rows = [];
  for(let i = 1; i < list.length; i++){ const a = list[i - 1], b = list[i], A = agg(a), B = agg(b);
    const gain = Object.keys(B.v).filter(p => !SKIP_P.has(p) && 100 * B.v[p] / B.tot >= 3 && 100 * (A.v[p] || 0) / A.tot >= 1.5).map(p => ({p, d: 100 * B.v[p] / B.tot - 100 * (A.v[p] || 0) / A.tot})).sort((x, y) => y.d - x.d)[0]; if(!gain) continue;
    const prev = new Map(a.seats.map(s => [seatKey(a, s), s])); let up = 0, n = 0;
    b.seats.forEach(s => { const ps = prev.get(seatKey(b, s)); if(!ps) return; const x1 = seatShare(a, ps, gain.p), x2 = seatShare(b, s, gain.p); if(x1 != null && x2 != null){ n++; if(x2 > x1) up++; } });
    const uni = n >= 20 ? up / n : null, score = uni == null ? gain.d : gain.d * uni; rows.push({e: b, p: gain.p, d: gain.d, uni, score, n}); }
  const nameOf = e => S.kind === 'LS' && ['1977', '1984', '2014', '2019'].includes(e.label) ? t('waveName' + e.label) : '';
  const cls = r => r.score >= 8 ? ['waveStrongT', 'var(--bad)'] : r.score >= 4 ? ['waveMildT', 'var(--warn)'] : ['waveNoneT', 'var(--muted)'];
  body.innerHTML = `${barSvg(rows.map(r => ({l: r.e.label, v: Math.max(0, r.score), c: pColor(r.p)})), {color: 'var(--violet)', fmt: v => fmt1(v), label: t('toolWave'), min: 8})}
    <div class="seatlist" style="max-height:380px;margin-top:6px"><table class="tbl"><thead><tr><th>${esc(t('thElection'))}</th><th>${esc(t('waveGainer'))}</th><th>${esc(t('waveScore'))}</th><th></th></tr></thead><tbody>
    ${rows.slice().reverse().map(r => { const c = cls(r); return `<tr><td><b>${esc(r.e.label)}</b></td><td>${pcell(r.p)}<div class="small">+${fmt1(r.d)} ${LANG === 'hi' ? 'अंक' : 'pts'}${r.uni != null ? ' · ' + esc(t('waveUni', {p: Math.round(100 * r.uni)})) : ''}</div></td><td class="num"><b>${fmt1(r.score)}</b></td><td style="color:${c[1]}"><b>${esc(t(c[0]))}</b>${nameOf(r.e) ? `<div class="small" style="color:var(--muted)">${esc(nameOf(r.e))}</div>` : ''}</td></tr>`; }).join('')}</tbody></table></div>`;
  alignTables(body);
}});
// ---------- signals from other elections (Lok Sabha only) ----------
registerTool({id: 'signals', label: 'toolSig', sub: 'sigSub', async render(body, stale){
  if(S.kind !== 'LS'){
    const by = await bypollData(), lb = await localData(); if(stale()) return;
    const mine = by.items.filter(i => i.state === S.state), won = {}; mine.forEach(i => { if(i.winParty) won[i.winParty] = (won[i.winParty] || 0) + 1; });
    const topW = Object.entries(won).sort((a, b) => b[1] - a[1])[0], lc = lb.items.filter(it => it.state === S.state);
    body.innerHTML = `<p class="small">${esc(t('sigNoLS'))}</p>` + (mine.length ? `<p>${esc(t('sigStByp', {s: stName(S.state), n: mine.length, c: mine.filter(i => i.changed).length, p: topW ? pName(topW[0]) : '', w: topW ? topW[1] : 0}))}</p>` : '')
      + lc.map(it => { const e = it.elections[0]; return `<p>${esc(t('sigStLocal', {c: it.city, y: e.year, r: e.parties.filter(p => p.seats > 0).slice(0, 4).map(p => pName(p.p) + ' ' + p.seats).join(', ')}))}</p>`; }).join('')
      + (!mine.length && !lc.length ? `<p class="small">${esc(t('sigStNone', {s: stName(S.state)}))}</p>` : '');
    return;
  }
  const ix = INDEX.elections, ls = await bundle('ls'), lsList = ls.slice().sort((a, b) => a.year - b.year), lsCur = lsList[lsList.length - 1];
  const latest = new Map(); ix.filter(e => e.kind === 'AE').forEach(e => { const l = latest.get(e.state); if(!l || e.year > l.year || (e.year === l.year && e.label > l.label)) latest.set(e.state, e); });
  const stateShare = (raw, code, region) => { let v = 0, tot = 0; raw.seats.forEach(s => { if(region != null && raw.regions[s[3]] !== region) return; for(let k = 0; k < s[4].length; k += 2){ if(raw.parties[s[4][k]] === code) v += s[4][k + 1]; tot += s[4][k + 1]; } tot += s[5] || 0; }); return tot > 0 ? 100 * v / tot : null; };
  const rows = [], tw = {BJP: 0, INC: 0}, sw = {BJP: 0, INC: 0}; let wtot = 0;
  for(const [st, ent] of latest){ const reg = lsCur.regions.find(r => nameKey(r) === nameKey(st)); if(!reg) continue; const asm = (await bundle(ent.file)).find(e => e.id === ent.id); if(stale()) return;
    const w = lsCur.seats.filter(s => lsCur.regions[s[3]] === reg).reduce((a, s) => a + s[4].reduce((x, y, k) => x + (k % 2 ? y : 0), 0), 0), r = {st, ent, w, codes: {}};
    for(const code of ['BJP', 'INC']){ const a = stateShare(asm, code), l = stateShare(lsCur, code, reg); if(a == null || l == null){ continue; }
      // usual gap: assembly share minus Lok Sabha share for assemblies held within a year of a Lok Sabha election
      const asmList = (await bundle(ent.file)).filter(e => e.year < ent.year), gaps = [];
      asmList.forEach(ae => { const nl = lsList.find(l2 => Math.abs(l2.year - ae.year) <= 1 && l2.year < lsCur.year); if(!nl) return; const x = stateShare(ae, code), y = stateShare(nl, code, nl.regions.find(rr => nameKey(rr) === nameKey(st))); if(x != null && y != null) gaps.push(x - y); });
      const gap = gaps.length ? gaps.reduce((p, q) => p + q, 0) / gaps.length : 0, imp = a - gap; r.codes[code] = {a, l, gap, imp, n: gaps.length}; }
    if(r.codes.BJP && r.codes.INC){ rows.push(r); wtot += w; ['BJP', 'INC'].forEach(c => { sw[c] += w * (r.codes[c].imp - r.codes[c].l); }); } }
  const nat = {BJP: wtot ? sw.BJP / wtot : 0, INC: wtot ? sw.INC / wtot : 0};
  const by = await bypollData(), lb = await localData(); if(stale()) return;
  const curBy = by.items.filter(i => i.term === 18), tally = c => ({g: curBy.filter(i => i.winParty === c && i.prevParty !== c).length, l: curBy.filter(i => i.prevParty === c && i.winParty !== c).length});
  const tb = tally('BJP'), tc = tally('INC'), lg = localGroups(lb.items), leads = c => lg.filter(it => localLeader(it) === c).length;
  const others = `<h4 style="margin:12px 0 4px">${esc(t('sigOther'))}</h4>${curBy.length ? `<p class="small" style="margin:0 0 4px">${esc(t('sigBy', {n: curBy.length, a: tb.g, b: tb.l, c: tc.g, d: tc.l}))}</p>` : ''}${lg.length ? `<p class="small" style="margin:0">${esc(t('sigLocal', {a: leads('BJP'), b: leads('INC'), m: lg.length}))}</p>` : ''}`;
  body.innerHTML = `<p style="font-family:var(--display);font-weight:600;margin:0 0 6px">${esc(t('sigNat', {a: (nat.BJP > 0 ? '+' : '') + fmt1(nat.BJP), b: (nat.INC > 0 ? '+' : '') + fmt1(nat.INC), y: lsCur.label}))} <button class="btn small" id="sigGo">${esc(t('sigApply'))}</button></p>
    <div class="seatlist" style="max-height:420px"><table class="tbl"><thead><tr><th>${esc(t('sigState'))}</th><th>${esc(t('sigAsm'))} BJP / INC</th><th>${esc(t('sigLS', {y: lsCur.label}))} BJP / INC</th><th>${esc(t('sigGap'))}</th><th>${esc(t('sigImp', {y: lsCur.label}))}</th></tr></thead><tbody>
    ${rows.sort((a, b) => b.w - a.w).map(r => { const B = r.codes.BJP, C = r.codes.INC, fm = v => (v > 0 ? '+' : '') + fmt1(v); return `<tr><td>${esc(stName(r.st))}<div class="small">${esc(r.ent.label)}</div></td><td class="num">${fmt1(B.a)} / ${fmt1(C.a)}</td><td class="num">${fmt1(B.l)} / ${fmt1(C.l)}</td><td class="num small">${fm(B.gap)} / ${fm(C.gap)}</td><td class="num"><b>${fm(B.imp - B.l)} / ${fm(C.imp - C.l)}</b></td></tr>`; }).join('')}</tbody></table></div>
    <p class="small" style="margin:6px 0 0">${esc(t('sigNote'))}</p>${others}`;
  alignTables(body);
  $('#sigGo').onclick = () => { const a = U.findIndex(g => g.key === 'A:NDA'), b = U.findIndex(g => g.key === 'A:INDIA'); const pts = Math.max(-15, Math.min(15, Math.round(((nat.INC - nat.BJP) / 2) * 2) / 2));
    if(S.mode !== 'alliance' || a < 0 || b < 0){ S.mode = 'alliance'; S.T = {}; rebuild(); }
    S.swing = {a: 'A:NDA', b: 'A:INDIA', pts}; S.tab = 'easy'; applySwing(); renderPane(); toast(t('sigApply') + ': ' + (pts > 0 ? '+' : '') + pts); };
}});
