// Phase 2 analysis tools. They use the real results of the open election's state or Lok Sabha history (not the simulation), except where noted.
addI18n('en', {
  thYear: 'Year', thMargin: 'Margin', thMarginPct: 'Margin %', thSeatsN: 'Seats', thContested: 'Contested', thStrike: 'Strike rate', thAvgShare: 'Avg vote where contested', thFights: 'Fights', thLost: 'Deposits lost', thLostPct: 'Lost %',
  thRegion: 'Region', thWins: 'Wins', thVotePct: 'Votes %', thSeatPct: 'Seats %', thPerPt: 'Seats per 1%', thBonus: 'Seat bonus', thThen: 'Then', thNow: 'Now', thChg: 'Change', thElection: 'Election', thParty2: 'Party', thStreak: 'Streak', thTimes: 'Times',
  clTitle: 'Closest contests', clSub: 'Seats decided by the narrowest margins, from the real results.', clScope: 'Scope', clThis: 'This election', clAll: 'Every election in the data', clUnder: 'Under', clVotes: '{n} votes', clNone: 'No seat was decided by fewer than {n} votes.', clApprox: 'Smaller-party votes are estimated in this election, so margins are approximate.', clCount: '{n} seats', votesWord: 'votes',
  recTitle: 'Seat records', recSub: 'Records across every election in the data. Seats are matched by name, so redrawn seats may break a streak.',
  recBell: 'Bellwether seats', recBellSub: 'Seats that most often voted for the party that won the most seats overall', recStreak: 'Longest winning streaks', recSafe: 'Safest seats', recSafeSub: 'Highest average winning margin', recClose: 'Closest results ever', recBig: 'Biggest margins ever', recFlip: 'Most changes of hands', recOf: '{a} of {b}', recYears: '{a} to {b}', recTimes: '{n} times',
  srTitle: 'Strike rate', srSub: 'Seats won out of seats contested. Contested seats come from the real {y} result; "simulated" uses the scenario above with the same candidates.', srActual: 'Won (real)', srSim: 'Won (simulated)', srSimRate: 'Simulated rate', srNote: 'Parties not listed separately in the data are grouped as Others and are not counted here.',
  h2hTitle: 'Head-to-head', h2hSub: 'How two parties fare when they are the top two in a seat.', h2hVs: 'versus', h2hByYear: 'By election', h2hByRegion: 'By {w} (open election)', h2hNone: 'These two were never the top two in the same seat.',
  dlTitle: 'Deposits lost', dlSub: 'Candidates who got less than one sixth of the votes in their seat and lost their deposit.', dlNote: 'Independents and small parties are grouped in the data, so they are not counted. Smaller-party votes are estimated in some recent elections, so treat those counts as approximate.',
  ppTitle: 'Seats per 1% of vote', ppSub: 'How well each side turns votes into seats in the current scenario. A bonus above zero means a bigger share of seats than of votes.',
  pjTitle: 'Party journey', pjSub: 'One party across every election in the data.', pjSeats: 'Seats won', pjVotes: 'Vote share', pjFromTo: '{p}: {a} → {b} seats ({y1} to {y2})', pjPeak: 'Peak {n} seats in {y}',
  cmpTitle: 'Compare two elections', cmpSub: 'Seats and vote share side by side for any two elections of this state or the Lok Sabha.', cmpA: 'Earlier', cmpB: 'Later', cmpMap: 'Show swing map',
});
addI18n('hi', {
  thYear: 'साल', thMargin: 'अंतर', thMarginPct: 'अंतर %', thSeatsN: 'सीटें', thContested: 'लड़ीं', thStrike: 'स्ट्राइक रेट', thAvgShare: 'लड़ी सीटों पर औसत वोट', thFights: 'मुक़ाबले', thLost: 'ज़मानत ज़ब्त', thLostPct: 'ज़ब्त %',
  thRegion: 'इलाक़ा', thWins: 'जीत', thVotePct: 'वोट %', thSeatPct: 'सीट %', thPerPt: 'प्रति 1% सीटें', thBonus: 'सीट बोनस', thThen: 'तब', thNow: 'अब', thChg: 'बदलाव', thElection: 'चुनाव', thParty2: 'पार्टी', thStreak: 'लगातार', thTimes: 'बार',
  clTitle: 'सबसे कांटे के मुक़ाबले', clSub: 'असली नतीजों में सबसे कम अंतर से तय हुई सीटें।', clScope: 'दायरा', clThis: 'यह चुनाव', clAll: 'आँकड़ों के सभी चुनाव', clUnder: 'से कम', clVotes: '{n} वोट', clNone: 'कोई सीट {n} से कम वोट के अंतर से तय नहीं हुई।', clApprox: 'इस चुनाव में छोटे दलों के वोट अनुमानित हैं, इसलिए अंतर लगभग हैं।', clCount: '{n} सीटें', votesWord: 'वोट',
  recTitle: 'सीटों के रिकॉर्ड', recSub: 'आँकड़ों के सभी चुनावों के रिकॉर्ड। सीटें नाम से मिलाई गई हैं, इसलिए नए सिरे से बनी सीट पर सिलसिला टूट सकता है।',
  recBell: 'बेलवेदर सीटें', recBellSub: 'जो सीटें सबसे ज़्यादा बार उस पार्टी को चुनती रहीं जिसने कुल सबसे ज़्यादा सीटें जीतीं', recStreak: 'सबसे लंबे जीत के सिलसिले', recSafe: 'सबसे सुरक्षित सीटें', recSafeSub: 'जीत का औसत अंतर सबसे ज़्यादा', recClose: 'अब तक के सबसे कम अंतर', recBig: 'अब तक के सबसे बड़े अंतर', recFlip: 'सबसे ज़्यादा बार हाथ बदलीं', recOf: '{b} में से {a}', recYears: '{a} से {b}', recTimes: '{n} बार',
  srTitle: 'स्ट्राइक रेट', srSub: 'लड़ी गई सीटों में से जीती गई सीटें। लड़ी सीटें असली {y} नतीजे से हैं; "सिम्युलेटेड" में ऊपर के परिदृश्य को उन्हीं उम्मीदवारों के साथ लिया गया है।', srActual: 'जीत (असली)', srSim: 'जीत (सिम्युलेटेड)', srSimRate: 'सिम्युलेटेड दर', srNote: 'जो दल आँकड़ों में अलग से दर्ज नहीं हैं वे "अन्य" में हैं और यहाँ नहीं गिने गए।',
  h2hTitle: 'आमने-सामने', h2hSub: 'जब दो दल किसी सीट पर पहले-दूसरे नंबर पर हों तो कौन जीतता है।', h2hVs: 'बनाम', h2hByYear: 'चुनाव के हिसाब से', h2hByRegion: '{w} के हिसाब से (खुला चुनाव)', h2hNone: 'ये दोनों कभी किसी सीट पर पहले-दूसरे नंबर पर नहीं रहे।',
  dlTitle: 'ज़मानत ज़ब्त', dlSub: 'वे उम्मीदवार जिन्हें अपनी सीट पर छठे हिस्से से कम वोट मिले और ज़मानत ज़ब्त हुई।', dlNote: 'निर्दलीय और छोटे दल आँकड़ों में एक साथ दर्ज हैं, इसलिए गिने नहीं गए। कुछ हाल के चुनावों में छोटे दलों के वोट अनुमानित हैं, इसलिए गिनती लगभग मानें।',
  ppTitle: 'प्रति 1% वोट पर सीटें', ppSub: 'मौजूदा परिदृश्य में हर पक्ष वोट को कितनी अच्छी तरह सीटों में बदलता है। शून्य से ऊपर बोनस का मतलब वोट से बड़ा सीट-हिस्सा।',
  pjTitle: 'पार्टी का सफ़र', pjSub: 'आँकड़ों के हर चुनाव में एक पार्टी।', pjSeats: 'जीती सीटें', pjVotes: 'वोट हिस्सा', pjFromTo: '{p}: {a} → {b} सीटें ({y1} से {y2})', pjPeak: 'सबसे ऊँचा {n} सीटें, {y} में',
  cmpTitle: 'दो चुनावों की तुलना', cmpSub: 'इस राज्य या लोकसभा के किन्हीं दो चुनावों की सीटें और वोट हिस्सा साथ-साथ।', cmpA: 'पहले का', cmpB: 'बाद का', cmpMap: 'स्विंग नक्शा दिखाएँ',
});

// ---- shared ----
const SKIP_P = new Set(['IND', 'OTH', 'NOTA']);
function ranked(e, s){ const f = s[4], out = []; for(let k = 0; k < f.length; k += 2) out.push([e.parties[f[k]], f[k+1]]); out.sort((a, b) => b[1] - a[1]); return out; }
const pcell = code => `<span class="pname"><i class="sw" style="background:${pColor(code)}"></i><span>${esc(pName(code))}</span></span>`;
function seatLabelOf(e, s){ return esc(s[1]) + (e.kind === 'LS' && s[3] >= 0 ? ` <span class="small">${esc(stName(e.regions[s[3]] || ''))}</span>` : ''); }
const histCache = {};
async function history(){ const f = entry().file; if(!histCache[f]) histCache[f] = await histList(); return histCache[f]; }
function nationalLeader(e){ const c = {}; e.seats.forEach(s => { if(s[4].length){ const p = e.parties[s[4][0]]; c[p] = (c[p] || 0) + (s[6] || 1); } }); return Object.entries(c).sort((a, b) => b[1] - a[1])[0][0]; }

// ---------- Closest contests (#13) ----------
registerTool({id: 'closest', label: 'clTitle', sub: 'clSub', async render(body, stale){
  const ent = entry(), list = await history(); if(stale()) return;
  const scope = S.clScope || 'this', thr = +(S.clThr || 1000);
  const rows = [];
  (scope === 'all' ? list : list.filter(e => e.id === ent.id)).forEach(e => e.seats.forEach(s => {
    const r = ranked(e, s); if(r.length < 2) return; const m = r[0][1] - r[1][1], tot = seatTotal(s);
    if(m < thr) rows.push({e, s, w: r[0][0], u: r[1][0], m, pct: tot ? 100 * m / tot : 0}); }));
  rows.sort((a, b) => a.m - b.m || a.e.year - b.e.year);
  body.innerHTML = `<div class="tools-row"><label>${esc(t('clScope'))} <select id="clScope"><option value="this" ${scope==='this'?'selected':''}>${esc(t('clThis'))}</option><option value="all" ${scope==='all'?'selected':''}>${esc(t('clAll'))}</option></select></label>
    <label>${esc(t('clUnder'))} <select id="clThr">${[100, 500, 1000, 2000, 5000].map(n => `<option value="${n}" ${n===thr?'selected':''}>${esc(t('clVotes', {n: fmtN(n)}))}</option>`).join('')}</select></label>
    <span class="pill">${esc(t('clCount', {n: rows.length}))}</span></div>
    ${scope === 'this' && (ent.approx || ent.partial) ? `<p class="small" style="color:var(--warn)">${esc(t('clApprox'))}</p>` : ''}
    ${rows.length ? `<div class="seatlist" style="max-height:440px"><table class="tbl"><thead><tr><th>${esc(t('thYear'))}</th><th>${esc(t('thSeatN'))}</th><th>${esc(t('thWon'))}</th><th>${esc(t('thRun'))}</th><th>${esc(t('thMargin'))}</th><th>${esc(t('thMarginPct'))}</th></tr></thead><tbody>
    ${rows.slice(0, 300).map(o => `<tr><td>${esc(o.e.label)}</td><td>${seatLabelOf(o.e, o.s)}</td><td>${pcell(o.w)}</td><td>${pcell(o.u)}</td><td class="num"><b>${fmtN(o.m)}</b></td><td class="num">${fmt1(o.pct)}</td></tr>`).join('')}</tbody></table></div>` : `<p class="small">${esc(t('clNone', {n: fmtN(thr)}))}</p>`}`;
  $('#clScope').onchange = e => { S.clScope = e.target.value; toolKeyShown = null; toolsTouch(true); };
  $('#clThr').onchange = e => { S.clThr = e.target.value; toolKeyShown = null; toolsTouch(true); };
}});

// ---------- Seat records (#12) ----------
const recCache = {};
function buildRecords(list){
  const seats = new Map(), lead = list.map(nationalLeader);
  list.forEach((e, ei) => e.seats.forEach(s => {
    if(!s[4].length || seatTotal(s) <= 0) return;
    const r = ranked(e, s), tot = seatTotal(s), key = (e.kind === 'LS' && s[3] >= 0 ? (e.regions[s[3]] || '') + '|' : '') + nameKey(s[1]);
    let a = seats.get(key); if(!a){ a = {name: s[1], region: e.kind === 'LS' && s[3] >= 0 ? e.regions[s[3]] : '', hist: []}; seats.set(key, a); }
    a.name = s[1]; a.hist.push({y: e.label, ei, p: r[0][0], m: r.length > 1 ? r[0][1] - r[1][1] : r[0][1], pct: 100 * (r.length > 1 ? r[0][1] - r[1][1] : r[0][1]) / tot, lead: lead[ei] === r[0][0]});
  }));
  return [...seats.values()];
}
registerTool({id: 'records', label: 'recTitle', sub: 'recSub', async render(body, stale){
  const list = await history(); if(stale()) return;
  const f = entry().file; if(!recCache[f]) recCache[f] = buildRecords(list);
  const all = recCache[f], minN = Math.min(8, Math.max(3, Math.floor(list.length / 2)));
  const lbl = a => `${esc(a.name)}${a.region ? ` <span class="small">${esc(stName(a.region))}</span>` : ''}`;
  const tab = (title, sub, head, rows) => `<div><h4>${esc(title)}</h4>${sub ? `<p class="small" style="margin:0 0 4px">${esc(sub)}</p>` : ''}<div class="seatlist" style="max-height:330px"><table class="tbl"><thead><tr>${head.map(h => `<th>${esc(h)}</th>`).join('')}</tr></thead><tbody>${rows.join('')}</tbody></table></div></div>`;
  const bell = all.filter(a => a.hist.length >= minN).map(a => ({a, hit: a.hist.filter(h => h.lead).length, n: a.hist.length})).sort((x, y) => y.hit / y.n - x.hit / x.n || y.n - x.n).slice(0, 10);
  const streaks = all.map(a => { let best = {n: 0}, cur = {n: 0}; a.hist.forEach((h, i) => { if(i && a.hist[i-1].p === h.p) cur = {n: cur.n + 1, p: h.p, from: cur.from, to: h.y}; else cur = {n: 1, p: h.p, from: h.y, to: h.y}; if(cur.n > best.n) best = Object.assign({}, cur); }); return {a, best}; }).sort((x, y) => y.best.n - x.best.n).slice(0, 10);
  const safe = all.filter(a => a.hist.length >= minN).map(a => ({a, avg: a.hist.reduce((s, h) => s + h.pct, 0) / a.hist.length})).sort((x, y) => y.avg - x.avg).slice(0, 10);
  const flat = all.flatMap(a => a.hist.map(h => ({a, h})));
  const closeR = flat.slice().sort((x, y) => x.h.m - y.h.m).slice(0, 10), bigR = flat.slice().sort((x, y) => y.h.m - x.h.m).slice(0, 10);
  const flips = all.map(a => ({a, n: a.hist.reduce((c, h, i) => c + (i && a.hist[i-1].p !== h.p ? 1 : 0), 0), tot: a.hist.length})).sort((x, y) => y.n - x.n || y.tot - x.tot).slice(0, 10);
  body.innerHTML = `<div class="tools-cols">
    ${tab(t('recBell'), t('recBellSub'), [t('thSeatN'), t('thTimes')], bell.map(o => `<tr><td>${lbl(o.a)}</td><td class="num"><b>${esc(t('recOf', {a: o.hit, b: o.n}))}</b></td></tr>`))}
    ${tab(t('recStreak'), '', [t('thSeatN'), t('thParty2'), t('thStreak')], streaks.map(o => `<tr><td>${lbl(o.a)}</td><td>${pcell(o.best.p)}</td><td class="num"><b>${o.best.n}</b><div class="small">${esc(t('recYears', {a: o.best.from, b: o.best.to}))}</div></td></tr>`))}
    ${tab(t('recSafe'), t('recSafeSub'), [t('thSeatN'), t('thParty2'), t('thMarginPct')], safe.map(o => `<tr><td>${lbl(o.a)}</td><td>${pcell(o.a.hist[o.a.hist.length - 1].p)}</td><td class="num"><b>${fmt1(o.avg)}</b></td></tr>`))}
    ${tab(t('recFlip'), '', [t('thSeatN'), t('thTimes')], flips.map(o => `<tr><td>${lbl(o.a)}</td><td class="num"><b>${esc(t('recOf', {a: o.n, b: o.tot - 1}))}</b></td></tr>`))}
    ${tab(t('recClose'), '', [t('thYear'), t('thSeatN'), t('thParty2'), t('thMargin')], closeR.map(o => `<tr><td>${esc(o.h.y)}</td><td>${lbl(o.a)}</td><td>${pcell(o.h.p)}</td><td class="num"><b>${fmtN(o.h.m)}</b></td></tr>`))}
    ${tab(t('recBig'), '', [t('thYear'), t('thSeatN'), t('thParty2'), t('thMargin')], bigR.map(o => `<tr><td>${esc(o.h.y)}</td><td>${lbl(o.a)}</td><td>${pcell(o.h.p)}</td><td class="num"><b>${fmtN(o.h.m)}</b></td></tr>`))}
  </div>`;
}});

// ---------- Strike rate (#52) ----------
registerTool({id: 'strike', label: 'srTitle', sub: 'srSub', live: true, key: simKey, render(body){
  const ent = entry(), N = E.seats.length;
  const rows = U.map((g, ui) => ({g, ui})).filter(o => o.g.key !== 'OTH').map(o => {
    let c = 0, vs = 0; E.seats.forEach(s => { if(s.tot > 0 && o.g.members.some(k => E.parties[k] !== 'IND' && s.v[k] > 0)){ c++; vs += s.base[o.ui]; } });
    return {g: o.g, c, won: o.g.baseSeats, sim: RES.counts[o.ui], avg: c ? 100 * vs / c : 0};
  }).filter(r => r.c > 0).sort((a, b) => b.won - a.won || b.c - a.c).slice(0, 18);
  const bar = (w, col) => `<div class="meter"><i style="width:${Math.min(100, w)}%;background:${col}"></i></div>`;
  body.innerHTML = `<div class="seatlist" style="max-height:480px"><table class="tbl"><thead><tr><th>${esc(S.mode === 'alliance' ? t('thAlly') : t('thParty'))}</th><th>${esc(t('thContested'))}</th><th>${esc(t('srActual'))}</th><th>${esc(t('thStrike'))}</th><th>${esc(t('srSim'))}</th><th>${esc(t('srSimRate'))}</th><th>${esc(t('thAvgShare'))}</th></tr></thead><tbody>
    ${rows.map(r => { const a = 100 * r.won / r.c, s = 100 * r.sim / r.c; return `<tr><td><span class="pname"><i class="sw" style="background:${r.g.hex}"></i><span>${esc(r.g.name)}</span></span></td><td class="num">${r.c}</td><td class="num">${r.won}</td><td class="num"><b>${fmt1(a)}%</b>${bar(a, r.g.hex)}</td><td class="num">${r.sim}${r.sim !== r.won ? ` <small class="${r.sim > r.won ? 'up' : 'down'}">${r.sim > r.won ? '+' : ''}${r.sim - r.won}</small>` : ''}</td><td class="num"><b>${fmt1(s)}%</b>${bar(s, r.g.hex)}</td><td class="num">${fmt1(r.avg)}%</td></tr>`; }).join('')}</tbody></table></div>
    <p class="small" style="margin:6px 0 0">${esc(t('srNote'))}</p>`;
  $('#toolSub').textContent = t('srSub', {y: ent.label});
}});

// ---------- Head-to-head (#53) ----------
registerTool({id: 'h2h', label: 'h2hTitle', sub: 'h2hSub', async render(body, stale){
  const list = await history(); if(stale()) return;
  const wins = {}; list.forEach(e => e.seats.forEach(s => { if(s[4].length){ const p = e.parties[s[4][0]]; if(!SKIP_P.has(p)) wins[p] = (wins[p] || 0) + (s[6] || 1); } }));
  const opts = Object.entries(wins).sort((a, b) => b[1] - a[1]).slice(0, 14).map(x => x[0]);
  if(opts.length < 2){ body.innerHTML = `<p class="small">${esc(t('toolsNoData'))}</p>`; return; }
  let A = S.h2hA, B = S.h2hB; if(!opts.includes(A)) A = opts[0]; if(!opts.includes(B) || B === A) B = opts.find(x => x !== A);
  S.h2hA = A; S.h2hB = B;
  const fights = (e) => { let n = 0, a = 0, b = 0, byR = new Map();
    e.seats.forEach(s => { const r = ranked(e, s); if(r.length < 2) return; const x = r[0][0], y = r[1][0]; if((x === A && y === B) || (x === B && y === A)){ n++; (x === A ? a++ : b++);
      if(s[3] >= 0){ const g = byR.get(s[3]) || {n: 0, a: 0, b: 0}; g.n++; x === A ? g.a++ : g.b++; byR.set(s[3], g); } } });
    return {n, a, b, byR}; };
  const per = list.map(e => ({e, f: fights(e)})).filter(o => o.f.n > 0);
  const cur = fights(E.raw), isLS = S.kind === 'LS';
  const sel = (id, v) => `<select id="${id}">${opts.map(p => `<option value="${esc(p)}" ${p === v ? 'selected' : ''}>${esc(pName(p))}</option>`).join('')}</select>`;
  const stack = (f) => `<div class="bar" style="min-width:90px"><i style="width:${100 * f.a / f.n}%;background:${pColor(A)}"></i><i style="width:${100 * f.b / f.n}%;background:${pColor(B)}"></i></div>`;
  body.innerHTML = `<div class="tools-row">${sel('h2hA', A)} <b>${esc(t('h2hVs'))}</b> ${sel('h2hB', B)}</div>
    ${per.length ? `<div class="tools-cols"><div><h4>${esc(t('h2hByYear'))}</h4><div class="seatlist" style="max-height:380px"><table class="tbl"><thead><tr><th>${esc(t('thElection'))}</th><th>${esc(t('thFights'))}</th><th>${esc(pName(A))}</th><th>${esc(pName(B))}</th><th></th></tr></thead><tbody>
      ${per.slice().reverse().map(o => `<tr><td>${esc(o.e.label)}</td><td class="num">${o.f.n}</td><td class="num"><b>${o.f.a}</b></td><td class="num"><b>${o.f.b}</b></td><td>${stack(o.f)}</td></tr>`).join('')}</tbody></table></div></div>
      <div><h4>${esc(t('h2hByRegion', {w: t(isLS ? 'states' : 'districts')}))} · ${esc(entry().label)}</h4>${cur.n ? `<div class="seatlist" style="max-height:380px"><table class="tbl"><thead><tr><th>${esc(t('thRegion'))}</th><th>${esc(t('thFights'))}</th><th>${esc(pName(A))}</th><th>${esc(pName(B))}</th><th></th></tr></thead><tbody>
      ${[...cur.byR.entries()].sort((a, b) => b[1].n - a[1].n).map(([r, g]) => `<tr><td>${esc(stName(E.regions[r]))}</td><td class="num">${g.n}</td><td class="num"><b>${g.a}</b></td><td class="num"><b>${g.b}</b></td><td>${stack(g)}</td></tr>`).join('')}</tbody></table></div>` : `<p class="small">${esc(t('h2hNone'))}</p>`}</div></div>` : `<p class="small">${esc(t('h2hNone'))}</p>`}`;
  $('#h2hA').onchange = e => { S.h2hA = e.target.value; toolKeyShown = null; toolsTouch(true); };
  $('#h2hB').onchange = e => { S.h2hB = e.target.value; toolKeyShown = null; toolsTouch(true); };
}});

// ---------- Deposits lost (#54) ----------
registerTool({id: 'deposit', label: 'dlTitle', sub: 'dlSub', render(body){
  const e = E.raw, ent = entry(), st = {};
  e.seats.forEach(s => { const tot = seatTotal(s); if(tot <= 0) return; const f = s[4];
    for(let k = 0; k < f.length; k += 2){ const p = e.parties[f[k]]; if(SKIP_P.has(p)) continue; const o = st[p] || (st[p] = {c: 0, lost: 0, won: 0}); o.c++; if(f[k+1] < tot / 6) o.lost++; if(k === 0) o.won++; } });
  const rows = Object.entries(st).sort((a, b) => b[1].c - a[1].c).slice(0, 20);
  const totC = rows.reduce((a, r) => a + r[1].c, 0), totL = rows.reduce((a, r) => a + r[1].lost, 0);
  body.innerHTML = `${(ent.approx || ent.partial) ? `<p class="small" style="color:var(--warn)">${esc(t('clApprox'))}</p>` : ''}<div class="seatlist" style="max-height:460px"><table class="tbl"><thead><tr><th>${esc(t('thParty2'))}</th><th>${esc(t('thContested'))}</th><th>${esc(t('thWon'))}</th><th>${esc(t('thLost'))}</th><th>${esc(t('thLostPct'))}</th></tr></thead><tbody>
    ${rows.map(([p, o]) => `<tr><td>${pcell(p)}</td><td class="num">${o.c}</td><td class="num">${o.won}</td><td class="num"><b>${o.lost}</b></td><td class="num">${fmt1(100 * o.lost / o.c)}%<div class="meter"><i style="width:${100 * o.lost / o.c}%;background:${pColor(p)}"></i></div></td></tr>`).join('')}</tbody></table></div>
    <p class="small" style="margin:6px 0 0">${esc(t('dlNote'))}</p>`;
}});

// ---------- Seats per 1% of vote (#16) ----------
registerTool({id: 'perpt', label: 'ppTitle', sub: 'ppSub', live: true, key: simKey, render(body){
  const N = E.N, rows = U.map((g, ui) => ({g, ui})).filter(o => o.g.key !== 'OTH' && (RES.counts[o.ui] > 0 || RES.T[o.ui] >= 1)).sort((a, b) => RES.counts[b.ui] - RES.counts[a.ui]).slice(0, 12);
  const mx = Math.max(...rows.map(o => Math.abs(100 * RES.counts[o.ui] / N - RES.T[o.ui])), 1);
  body.innerHTML = `<div class="seatlist" style="max-height:460px"><table class="tbl"><thead><tr><th>${esc(S.mode === 'alliance' ? t('thAlly') : t('thParty'))}</th><th>${esc(t('thVotePct'))}</th><th>${esc(t('thSeatsN'))}</th><th>${esc(t('thSeatPct'))}</th><th>${esc(t('thPerPt'))}</th><th>${esc(t('thBonus'))}</th></tr></thead><tbody>
    ${rows.map(o => { const v = RES.T[o.ui], sc = RES.counts[o.ui], sp = 100 * sc / N, pp = v > 0 ? sc / v : 0, bo = sp - v;
      return `<tr><td><span class="pname"><i class="sw" style="background:${o.g.hex}"></i><span>${esc(o.g.name)}</span></span></td><td class="num">${fmt1(v)}</td><td class="num"><b>${sc}</b></td><td class="num">${fmt1(sp)}</td><td class="num"><b>${fmt1(pp)}</b></td><td class="num ${bo >= 0 ? 'up' : 'down'}">${bo >= 0 ? '+' : ''}${fmt1(bo)}<div class="meter"><i style="width:${100 * Math.abs(bo) / mx}%;background:${bo >= 0 ? 'var(--good)' : 'var(--bad)'}"></i></div></td></tr>`; }).join('')}</tbody></table></div>`;
}});

// ---------- Party journey (#17) ----------
registerTool({id: 'journey', label: 'pjTitle', sub: 'pjSub', async render(body, stale){
  const list = await history(); if(stale()) return;
  const tally = list.map(e => { const c = {}, v = {}; let tv = 0; e.seats.forEach(s => { if(s[4].length){ const p = e.parties[s[4][0]]; c[p] = (c[p] || 0) + (s[6] || 1); } const f = s[4]; for(let k = 0; k < f.length; k += 2){ const p = e.parties[f[k]]; v[p] = (v[p] || 0) + f[k+1]; tv += f[k+1]; } tv += s[5] || 0; }); return {e, c, v, tv}; });
  const peak = {}; tally.forEach(x => Object.entries(x.c).forEach(([p, n]) => { if(!SKIP_P.has(p)) peak[p] = Math.max(peak[p] || 0, n); }));
  const opts = Object.entries(peak).sort((a, b) => b[1] - a[1]).slice(0, 30).map(x => x[0]);
  if(!opts.length){ body.innerHTML = `<p class="small">${esc(t('toolsNoData'))}</p>`; return; }
  let P = S.pjParty; if(!opts.includes(P)) P = opts[0]; S.pjParty = P;
  const first = tally.findIndex(x => (x.c[P] || 0) > 0 || (x.v[P] || 0) > 0), pts = tally.slice(Math.max(0, first));
  const W = 900, H = 250, L = 38, B = 28, T = 22, n = pts.length, bw = (W - L - 10) / n, mxs = Math.max(...pts.map(x => x.c[P] || 0), 1), mxv = Math.max(...pts.map(x => 100 * (x.v[P] || 0) / x.tv), 1);
  const hex = pColor(P), y = v => H - B - (H - B - T) * v / mxs, yv = v => H - B - (H - B - T) * v / mxv;
  let g = [0, .5, 1].map(f => `<line x1="${L}" x2="${W}" y1="${y(mxs * f)}" y2="${y(mxs * f)}" stroke="var(--line)"/>${svgText(L - 6, y(mxs * f) + 4, Math.round(mxs * f), {anchor: 'end', size: 11})}`).join('');
  pts.forEach((x, i) => { const n1 = x.c[P] || 0, cx = L + i * bw + bw / 2; g += `<rect x="${cx - bw * .32}" y="${y(n1)}" width="${bw * .64}" height="${H - B - y(n1)}" rx="2" fill="${hex}" fill-opacity=".85"><title>${esc(x.e.label)}: ${n1}</title></rect>`;
    if(bw > 24 || i % 2 === 0) g += svgText(cx, y(n1) - 4, n1, {anchor: 'middle', size: 11, fill: 'var(--ink)', weight: 600});
    if(pts.length <= 20 || i % 2 === 0 || i === n - 1) g += svgText(cx, H - 10, x.e.label, {anchor: 'middle', size: 10.5}); });
  const line = pts.map((x, i) => `${i ? 'L' : 'M'}${L + i * bw + bw / 2},${yv(100 * (x.v[P] || 0) / x.tv)}`).join('');
  const a = pts[0], b = pts[pts.length - 1], pk = pts.reduce((m, x) => (x.c[P] || 0) > (m.c[P] || 0) ? x : m, pts[0]);
  body.innerHTML = `<div class="tools-row"><label>${esc(t('thParty2'))} <select id="pjParty">${opts.map(p => `<option value="${esc(p)}" ${p === P ? 'selected' : ''}>${esc(pName(p))}</option>`).join('')}</select></label></div>
    <p style="font-family:var(--display);font-size:18px;font-weight:600;margin:0 0 4px">${esc(t('pjFromTo', {p: pName(P), a: a.c[P] || 0, b: b.c[P] || 0, y1: a.e.label, y2: b.e.label}))} <span class="small">· ${esc(t('pjPeak', {n: pk.c[P] || 0, y: pk.e.label}))}</span></p>
    <p class="small" style="margin:0 0 4px">${esc(t('pjSeats'))} <i class="sw" style="background:${hex}"></i> &nbsp; ${esc(t('pjVotes'))} <svg width="26" height="8" aria-hidden="true"><path d="M0 4h26" stroke="var(--ink)" stroke-width="2.2" stroke-dasharray="4 3"/></svg> (max ${fmt1(mxv)}%)</p>
    <div class="tw"><svg viewBox="0 0 ${W} ${H}" style="min-width:560px" role="img" aria-label="${esc(t('pjTitle'))}">${g}<path d="${line}" fill="none" stroke="var(--ink)" stroke-width="2.2" stroke-dasharray="4 3" stroke-opacity=".75"/></svg></div>`;
  $('#pjParty').onchange = e => { S.pjParty = e.target.value; toolKeyShown = null; toolsTouch(true); };
}});

// ---------- Compare two elections (#10) ----------
registerTool({id: 'compare', label: 'cmpTitle', sub: 'cmpSub', async render(body, stale){
  const list = await history(); if(stale()) return;
  if(list.length < 2){ body.innerHTML = `<p class="small">${esc(t('toolsNoData'))}</p>`; return; }
  const ent = entry(), curI = Math.max(0, list.findIndex(e => e.id === ent.id));
  let ib = list.findIndex(e => e.id === S.cmpB); if(ib < 0) ib = curI;
  let ia = list.findIndex(e => e.id === S.cmpA); if(ia < 0 || ia === ib) ia = Math.max(0, ib - 1);
  if(ia === ib) ia = ib === 0 ? 1 : 0;
  const A = list[ia], Bq = list[ib];
  const agg = e => { const c = {}, v = {}; let tv = 0; e.seats.forEach(s => { if(s[4].length){ const p = e.parties[s[4][0]]; c[p] = (c[p] || 0) + (s[6] || 1); } const f = s[4]; for(let k = 0; k < f.length; k += 2){ const p = e.parties[f[k]]; v[p] = (v[p] || 0) + f[k+1]; tv += f[k+1]; } tv += s[5] || 0; }); return {c, v, tv, n: e.seats.reduce((a, s) => a + (s[6] || 1), 0)}; };
  const a = agg(A), b = agg(Bq), parties = [...new Set([...Object.keys(a.c), ...Object.keys(b.c)])].filter(p => !SKIP_P.has(p)).sort((x, y) => Math.max(b.c[y] || 0, a.c[y] || 0) - Math.max(b.c[x] || 0, a.c[x] || 0)).slice(0, 16);
  const opt = (sel) => list.map((e, i) => `<option value="${e.id}" ${i === sel ? 'selected' : ''}>${esc(e.label)}</option>`).join('');
  body.innerHTML = `<div class="tools-row"><label>${esc(t('cmpA'))} <select id="cmpA">${opt(ia)}</select></label><label>${esc(t('cmpB'))} <select id="cmpB">${opt(ib)}</select></label><button class="btn small" id="cmpMap">${esc(t('cmpMap'))}</button></div>
    <div class="seatlist" style="max-height:460px"><table class="tbl"><thead><tr><th>${esc(t('thParty2'))}</th><th>${esc(A.label)} ${esc(t('thSeatsN'))}</th><th>${esc(Bq.label)} ${esc(t('thSeatsN'))}</th><th>${esc(t('thChg'))}</th><th>${esc(A.label)} ${esc(t('thVotePct'))}</th><th>${esc(Bq.label)} ${esc(t('thVotePct'))}</th><th>${esc(t('thChg'))}</th></tr></thead><tbody>
    ${parties.map(p => { const sa = a.c[p] || 0, sb = b.c[p] || 0, va = 100 * (a.v[p] || 0) / a.tv, vb = 100 * (b.v[p] || 0) / b.tv, ds = sb - sa, dv = vb - va;
      return `<tr><td>${pcell(p)}</td><td class="num">${sa}</td><td class="num"><b>${sb}</b></td><td class="num ${ds > 0 ? 'up' : ds < 0 ? 'down' : ''}">${ds > 0 ? '+' : ''}${ds}</td><td class="num">${fmt1(va)}</td><td class="num"><b>${fmt1(vb)}</b></td><td class="num ${dv > 0 ? 'up' : dv < 0 ? 'down' : ''}">${dv > 0 ? '+' : ''}${fmt1(dv)}</td></tr>`; }).join('')}</tbody></table></div>`;
  $('#cmpA').onchange = e => { S.cmpA = e.target.value; toolKeyShown = null; toolsTouch(true); };
  $('#cmpB').onchange = e => { S.cmpB = e.target.value; toolKeyShown = null; toolsTouch(true); };
  $('#cmpMap').onclick = () => { S.cmpId = A.id; setShade('swing'); $('#cardMap').scrollIntoView({behavior: 'smooth'}); if(PHONE.matches) setPTab('map'); };
}});
