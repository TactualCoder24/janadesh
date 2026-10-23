// "Did you know" cards (#18): facts generated from the real result of the open election. makeFacts() is also used by Story mode.
addI18n('en', {
  toolFacts: 'Did you know?', factsSub: 'Facts picked out of the real result of this election. Tap a card to see the seat; share the ones you like.', factSee: 'Show seat', factShare: 'Share', factCopied: 'Fact copied',
  fxClose: '{seat} was decided by just {n} votes: {w} beat {r}.', fxBig: '{seat} had the biggest margin: {w} won by {n} votes.', fxUnder1k: '{n} seats were decided by fewer than 1,000 votes.',
  fxLowShare: '{seat} was won with only {x}% of the votes, the lowest winning share: {w}.', fxHighShare: '{w} won {seat} with {x}% of the votes, the highest winning share.',
  fxSeatsVotes: '{p} won {s}% of the seats with {v}% of the votes.', fxVotesNoSeats: '{p} got {v}% of the votes but won only {n} seats.', fxRunner: '{p} finished second in {n} seats but won only {m}.',
  fxSweep: '{p} won all {n} seats in {r}.', fxInd: '{n} independents won seats.', fxOne: '{n} parties won exactly one seat.', fxTight: 'In {n} seats the top two were within one point of each other.',
  fxGain: '{p} gained the most vote share since {y}: +{x} points.', fxLoss: '{p} lost the most vote share since {y}: {x} points.', fxSeatGain: '{p} gained the most seats since {y}: {a} → {b}.',
  fxWomen: '{n} women won seats ({x}% of seats).', fxUnopp: '{seat} was won unopposed by {w}.', fxRes: 'Of {n} seats reserved for {c}, {p} won {m}.', fxPartyRes: '{p} won {m} of the {n} {c} seats.',
  factWho: '{name} ({party})',
});
addI18n('hi', {
  toolFacts: 'क्या आप जानते हैं?', factsSub: 'इस चुनाव के असली नतीजे से चुने गए तथ्य। सीट देखने के लिए कार्ड पर टैप करें; जो पसंद आए उसे शेयर करें।', factSee: 'सीट देखें', factShare: 'शेयर करें', factCopied: 'तथ्य कॉपी हो गया',
  fxClose: '{seat} सिर्फ़ {n} वोट से तय हुई: {w} ने {r} को हराया।', fxBig: 'सबसे बड़ा अंतर {seat} में रहा: {w} {n} वोट से जीते।', fxUnder1k: '{n} सीटें 1,000 से कम वोट के अंतर से तय हुईं।',
  fxLowShare: '{seat} सिर्फ़ {x}% वोट से जीती गई, सबसे कम जीत का हिस्सा: {w}।', fxHighShare: '{w} ने {seat} {x}% वोट से जीती, जीत का सबसे ऊँचा हिस्सा।',
  fxSeatsVotes: '{p} ने {v}% वोट पर {s}% सीटें जीतीं।', fxVotesNoSeats: '{p} को {v}% वोट मिले पर सिर्फ़ {n} सीटें मिलीं।', fxRunner: '{p} {n} सीटों पर दूसरे नंबर पर रहा पर जीता सिर्फ़ {m}।',
  fxSweep: '{p} ने {r} की सभी {n} सीटें जीतीं।', fxInd: '{n} निर्दलीय जीते।', fxOne: '{n} दलों ने ठीक एक सीट जीती।', fxTight: '{n} सीटों पर पहले दो दलों में एक अंक से भी कम का फ़र्क़ रहा।',
  fxGain: '{y} के बाद {p} का वोट हिस्सा सबसे ज़्यादा बढ़ा: +{x} अंक।', fxLoss: '{y} के बाद {p} का वोट हिस्सा सबसे ज़्यादा घटा: {x} अंक।', fxSeatGain: '{y} के बाद {p} की सीटें सबसे ज़्यादा बढ़ीं: {a} → {b}।',
  fxWomen: '{n} महिलाएँ जीतीं (सीटों का {x}%)।', fxUnopp: '{seat} सीट {w} ने निर्विरोध जीती।', fxRes: '{c} के लिए आरक्षित {n} सीटों में से {p} ने {m} जीतीं।', fxPartyRes: '{p} ने {n} {c} सीटों में से {m} जीतीं।',
  factWho: '{name} ({party})',
});
function seatPlace(i){ const s = E.seats[i]; return s.name + (S.kind === 'LS' && s.r >= 0 ? ', ' + stName(E.regions[s.r]) : ''); }
function whoAt(i, which, code){ const n = E.names && E.names[i] && E.names[i][which]; return n ? t('factWho', {name: n, party: pName(code)}) : pName(code); }
async function makeFacts(){
  await namesFor(entry().file).then(n => { E.names = (n && n[S.eid]) || E.names || null; });
  const e = E.raw, ent = entry(), P = e.parties, F = [], N = E.N, seats = E.seats;
  const top2 = seats.map((s, i) => { const a = []; for(let k = 0; k < E.P - 1; k++) if(s.v[k] > 0) a.push([k, s.v[k]]); a.sort((x, y) => y[1] - x[1]); return a; });
  const win = i => top2[i][0] && P[top2[i][0][0]];
  const gaps = seats.map((s, i) => ({i, m: top2[i].length > 1 ? top2[i][0][1] - top2[i][1][1] : -1, tot: s.tot})).filter(o => o.m >= 0 && o.tot > 0);
  const add = (id, w, text, seat) => F.push({id, w, text, seat});
  // closest and biggest
  const cl = gaps.slice().sort((a, b) => a.m - b.m)[0];
  if(cl) add('close', 10, t('fxClose', {seat: seatPlace(cl.i), n: fmtN(cl.m), w: whoAt(cl.i, 0, win(cl.i)), r: whoAt(cl.i, 1, P[top2[cl.i][1][0]])}), cl.i);
  const bg = gaps.slice().sort((a, b) => b.m - a.m)[0];
  if(bg && bg.m > 0) add('big', 7, t('fxBig', {seat: seatPlace(bg.i), n: fmtN(bg.m), w: whoAt(bg.i, 0, win(bg.i))}), bg.i);
  const u1k = gaps.filter(o => o.m < 1000).length; if(u1k >= 2) add('u1k', 8, t('fxUnder1k', {n: u1k}));
  const sh = gaps.map(o => ({i: o.i, x: 100 * top2[o.i][0][1] / o.tot})).sort((a, b) => a.x - b.x);
  if(sh.length){ add('low', 6, t('fxLowShare', {seat: seatPlace(sh[0].i), x: fmt1(sh[0].x), w: whoAt(sh[0].i, 0, win(sh[0].i))}), sh[0].i); const hi = sh[sh.length - 1]; add('high', 5, t('fxHighShare', {seat: seatPlace(hi.i), x: fmt1(hi.x), w: whoAt(hi.i, 0, win(hi.i))}), hi.i); }
  const tight = gaps.filter(o => 100 * o.m / o.tot < 1).length; if(tight >= 3) add('tight', 4, t('fxTight', {n: tight}));
  const unopp = seats.map((s, i) => i).filter(i => seats[i].tot <= 0 && e.seats[i][4].length);
  unopp.slice(0, 2).forEach(i => add('unopp', 9, t('fxUnopp', {seat: seatPlace(i), w: whoAt(i, 0, P[e.seats[i][4][0]])}), i));
  // parties
  const won = new Map(), second = new Map(), votes = new Map(); let tv = 0;
  seats.forEach((s, i) => { const m = s.m; if(top2[i][0]) won.set(top2[i][0][0], (won.get(top2[i][0][0]) || 0) + m); if(top2[i][1]) second.set(top2[i][1][0], (second.get(top2[i][1][0]) || 0) + 1);
    for(let k = 0; k < E.P - 1; k++){ votes.set(k, (votes.get(k) || 0) + s.v[k]); } tv += s.tot; });
  const real = k => !SKIP_P.has(P[k]);
  const stat = [...votes.keys()].filter(real).map(k => ({k, v: 100 * votes.get(k) / tv, s: 100 * (won.get(k) || 0) / N, n: won.get(k) || 0, sec: second.get(k) || 0})).filter(o => o.v >= 3);
  const bonus = stat.slice().sort((a, b) => (b.s - b.v) - (a.s - a.v))[0];
  if(bonus && bonus.s - bonus.v > 4) add('bonus', 9, t('fxSeatsVotes', {p: pName(P[bonus.k]), s: fmt1(bonus.s), v: fmt1(bonus.v)}));
  const unlucky = stat.slice().sort((a, b) => (a.s - a.v) - (b.s - b.v))[0];
  if(unlucky && unlucky.v - unlucky.s > 3 && unlucky.k !== (bonus && bonus.k)) add('unlucky', 8, t('fxVotesNoSeats', {p: pName(P[unlucky.k]), v: fmt1(unlucky.v), n: unlucky.n}));
  const rn = stat.slice().sort((a, b) => b.sec - a.sec).find(o => o.sec >= 8 && o.sec > 2 * o.n);
  if(rn) add('runner', 6, t('fxRunner', {p: pName(P[rn.k]), n: rn.sec, m: rn.n}));
  const ind = seats.filter((s, i) => P[(top2[i][0] || [0])[0]] === 'IND').length; if(ind) add('ind', 3, t('fxInd', {n: ind}));
  const ones = [...won.entries()].filter(([k, n]) => n === 1 && real(k)).length; if(ones >= 3) add('one', 3, t('fxOne', {n: ones}));
  // sweeps by region
  if(E.regions.length){
    const per = E.regions.map(() => ({n: 0, c: new Map()}));
    seats.forEach((s, i) => { if(s.r < 0 || !top2[i][0]) return; const a = per[s.r]; a.n++; const k = top2[i][0][0]; a.c.set(k, (a.c.get(k) || 0) + 1); });
    const sw = per.map((a, r) => ({r, n: a.n, top: [...a.c.entries()].sort((x, y) => y[1] - x[1])[0]})).filter(o => o.n >= 4 && o.top && o.top[1] === o.n && real(o.top[0])).sort((a, b) => b.n - a.n)[0];
    if(sw) add('sweep', 7, t('fxSweep', {p: pName(P[sw.top[0]]), n: sw.n, r: stName(E.regions[sw.r])}));
  }
  // reserved seats
  ['SC', 'ST'].forEach(c => { const idx = seats.map((s, i) => i).filter(i => seats[i].cat === c); if(idx.length >= 10){ const cnt = new Map(); idx.forEach(i => { const k = top2[i][0] && top2[i][0][0]; if(k != null) cnt.set(k, (cnt.get(k) || 0) + 1); });
    const best = [...cnt.entries()].sort((a, b) => b[1] - a[1])[0]; if(best) add('res' + c, 4, t('fxRes', {n: idx.length, c, p: pName(P[best[0]]), m: best[1]})); } });
  // women (only where most seats have a recorded sex)
  if(E.names){ let known = 0, w = 0; E.names.forEach(r => { if(r && r[2]){ known++; if(r[2] === 'F') w++; } }); if(known > 0.7 * N && w) add('women', 8, t('fxWomen', {n: w, x: fmt1(100 * w / known)})); }
  // versus the previous election
  try{
    const list = await history(), idx = list.findIndex(x => x.id === ent.id);
    if(idx > 0){ const pv = list[idx - 1], cnt = {}, vs = {}; let pt = 0;
      pv.seats.forEach(s => { if(s[4].length){ const p = pv.parties[s[4][0]]; cnt[p] = (cnt[p] || 0) + (s[6] || 1); } for(let k = 0; k < s[4].length; k += 2){ const p = pv.parties[s[4][k]]; vs[p] = (vs[p] || 0) + s[4][k + 1]; pt += s[4][k + 1]; } pt += s[5] || 0; });
      const diffs = stat.map(o => { const c = P[o.k]; return {c, dv: o.v - 100 * (vs[c] || 0) / pt, ds: o.n - (cnt[c] || 0), a: cnt[c] || 0, b: o.n}; }).filter(o => vs[o.c] > 0);
      const g = diffs.slice().sort((a, b) => b.dv - a.dv)[0], l = diffs.slice().sort((a, b) => a.dv - b.dv)[0], sg = diffs.slice().sort((a, b) => b.ds - a.ds)[0];
      if(g && g.dv > 1.5) add('gain', 8, t('fxGain', {p: pName(g.c), y: pv.label, x: fmt1(g.dv)}));
      if(l && l.dv < -1.5) add('loss', 7, t('fxLoss', {p: pName(l.c), y: pv.label, x: fmt1(l.dv)}));
      if(sg && sg.ds >= 3) add('sgain', 8, t('fxSeatGain', {p: pName(sg.c), y: pv.label, a: sg.a, b: sg.b}));
    }
  }catch(err){ console.error(err); }
  return F.sort((a, b) => b.w - a.w);
}
registerTool({id: 'facts', label: 'toolFacts', sub: 'factsSub', async render(body, stale){
  const F = await makeFacts(); if(stale()) return;
  const ent = entry();
  body.innerHTML = `<div class="facts">${F.map((f, i) => `<div class="fact"><p>${esc(f.text)}</p><div class="row">${f.seat != null ? `<button class="btn small" data-see="${i}">${esc(t('factSee'))}</button>` : ''}<button class="btn small" data-fs="${i}">${esc(t('factShare'))}</button></div></div>`).join('')}</div>`;
  body.querySelectorAll('[data-see]').forEach(b => b.onclick = () => selectSeat(F[+b.dataset.see].seat));
  body.querySelectorAll('[data-fs]').forEach(b => b.onclick = () => { const f = F[+b.dataset.fs], txt = `${f.text}\n— ${$('#title').textContent} · Janadesh`, url = location.origin + location.pathname;
    if(navigator.share) navigator.share({text: txt, url}).catch(() => {}); else copy(txt + '\n' + url, t('factCopied')); });
}});
TOOLS.unshift(TOOLS.pop());
