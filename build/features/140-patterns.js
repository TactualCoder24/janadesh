// Incumbency patterns (#23): how often the largest party was the same at the next election, by state, with "break the pattern" scenarios.
addI18n('en', {
  toolPat: 'Incumbency patterns', patSub: 'How often the party with the most seats was the same as at the previous election. The pattern label looks at the last seven elections. The largest party stands in for the party in power.',
  patTimeline: 'Largest party, election by election', patRate: 'The same party led again in {a} of {b} elections ({p}%); in the last {rt} elections, {rs}.', patStreak: 'Current streak: {n} in a row for {p}.', patRevolving: 'Revolving door', patSticky: 'Same party keeps winning', patMixed: 'Mixed',
  patBreak: 'Break the pattern', patAgain: '{p} wins again', patFlip: 'Smallest swing that hands the lead to {p}', patFlipDone: '{r} overtakes {p} at a swing of {n} points.', patNoFlip: 'No swing up to 15 points hands the lead over.', patAll: 'Every state', patElections: 'Elections', patSame: 'Same party again', patPattern: 'Pattern', patLast: 'Last winners',
});
addI18n('hi', {
  toolPat: 'सत्ता के पैटर्न', patSub: 'सबसे ज़्यादा सीटों वाला दल पिछले चुनाव जैसा ही कितनी बार रहा। सत्ता में बैठे दल की जगह सबसे बड़े दल को लिया गया है।',
  patTimeline: 'सबसे बड़ा दल, चुनाव दर चुनाव', patRate: '{b} में से {a} चुनावों में वही दल फिर आगे रहा ({p}%); पिछले {rt} चुनावों में {rs} बार।', patStreak: 'मौजूदा सिलसिला: {p} का लगातार {n} बार।', patRevolving: 'हर बार बदलाव', patSticky: 'वही दल जीतता रहता है', patMixed: 'मिला-जुला',
  patBreak: 'पैटर्न तोड़ें', patAgain: '{p} फिर जीते', patFlip: '{p} को बढ़त दिलाने वाला सबसे छोटा स्विंग', patFlipDone: '{n} अंक के स्विंग पर {r} {p} से आगे निकल जाता है।', patNoFlip: '15 अंक तक के किसी स्विंग से बढ़त नहीं पलटती।', patAll: 'हर राज्य', patElections: 'चुनाव', patSame: 'वही दल फिर', patPattern: 'पैटर्न', patLast: 'पिछले विजेता',
});
let STATS = null;
async function statsData(){ if(!STATS) STATS = await getJSON('data/stats.json'); return STATS; }
function patternOf(seq){
  const trans = seq.length - 1; if(trans < 1) return null;
  let same = 0; for(let i = 1; i < seq.length; i++) if(seq[i].lead === seq[i - 1].lead) same++;
  let streak = 1; for(let i = seq.length - 1; i > 0 && seq[i].lead === seq[i - 1].lead; i--) streak++;
  const rate = same / trans, rc = seq.slice(-7), rt = rc.length - 1; let rs = 0; for(let i = 1; i < rc.length; i++) if(rc[i].lead === rc[i - 1].lead) rs++;
  const rr = rt >= 4 ? rs / rt : rate, kt = rt >= 4 ? rt : trans;
  return {same, trans, rate, streak, rs, rt, kind: kt >= 4 && rr <= 0.34 ? 'rev' : (kt >= 4 && rr >= 0.67 ? 'sticky' : 'mixed')};
}
function patLabel(k){ return t(k === 'rev' ? 'patRevolving' : k === 'sticky' ? 'patSticky' : 'patMixed'); }
const patKey = () => S.eid + '|' + S.kind + '|' + (U.length ? U.map(g => g.baseSeats).join() : '');
registerTool({id: 'patterns', label: 'toolPat', sub: 'patSub', key: patKey, async render(body, stale){
  const st = await statsData(); if(stale()) return;
  const groups = new Map();
  INDEX.elections.forEach(e => { const k = e.kind === 'LS' ? 'LS' : e.state; if(!groups.has(k)) groups.set(k, []); const s = st[e.id]; if(s && s.lead) groups.get(k).push({e, lead: s.lead[0], n: s.lead[1], tot: s.n}); });
  groups.forEach(a => a.sort((x, y) => x.e.year - y.e.year || x.e.label.localeCompare(y.e.label)));
  const key = S.kind === 'LS' ? 'LS' : S.state, seq = groups.get(key) || [], pat = patternOf(seq);
  const incumbent = U.map((g, k) => k).filter(k => U[k].key !== 'OTH').sort((a, b) => U[b].baseSeats - U[a].baseSeats);
  const inc = incumbent[0], riv = incumbent[1];
  const rows = [...groups.entries()].map(([k, a]) => ({k, a, p: patternOf(a)})).filter(o => o.p).sort((x, y) => x.p.rate - y.p.rate || y.p.trans - x.p.trans);
  const box = x => `<div class="pbox" title="${esc(x.e.label)}: ${esc(pName(x.lead))} ${x.n}" style="background:${pColor(x.lead)}"><b>${esc(x.e.label.slice(-4))}</b><span>${esc(shortCode(x.lead))}</span></div>`;
  function shortCode(c){ return LANG === 'hi' && HI_PARTY[c] ? HI_PARTY[c] : c.replace('_SHINDE', '').slice(0, 7); }
  body.innerHTML = `<h4>${esc(t('patTimeline'))}: ${esc(key === 'LS' ? t('lokSabha') : stName(key))}</h4>
    <div class="ptimeline">${seq.map(box).join('')}</div>
    ${pat ? `<p style="margin:8px 0 2px;font-family:var(--display);font-weight:600">${esc(t('patRate', {a: pat.same, b: pat.trans, p: Math.round(100 * pat.rate), rt: pat.rt, rs: pat.rs}))} <span class="pill">${esc(patLabel(pat.kind))}</span></p>${pat.streak > 1 ? `<p class="small" style="margin:0">${esc(t('patStreak', {n: pat.streak, p: pName(seq[seq.length - 1].lead)}))}</p>` : ''}` : ''}
    ${inc != null && riv != null ? `<h4 style="margin:14px 0 6px">${esc(t('patBreak'))}</h4><div class="row"><button class="btn small" id="patAgain">${esc(t('patAgain', {p: U[inc].name}))}</button><button class="btn small" id="patFlip">${esc(t('patFlip', {p: U[riv].name}))}</button></div>` : ''}
    <h4 style="margin:16px 0 4px">${esc(t('patAll'))}</h4>
    <div class="seatlist" style="max-height:420px"><table class="tbl"><thead><tr><th>${esc(t('thRegion'))}</th><th>${esc(t('patElections'))}</th><th>${esc(t('patSame'))}</th><th>${esc(t('patPattern'))}</th><th>${esc(t('patLast'))}</th></tr></thead><tbody>
    ${rows.map(o => `<tr class="click${o.k === key ? ' cur' : ''}" data-k="${esc(o.k)}"><td>${esc(o.k === 'LS' ? t('lokSabha') : stName(o.k))}</td><td class="num">${o.p.trans + 1}</td><td class="num"><b>${o.p.same}/${o.p.trans}</b><div class="meter"><i style="width:${100 * o.p.rate}%;background:var(--violet)"></i></div></td><td>${esc(patLabel(o.p.kind))}</td><td><div class="ptimeline mini">${o.a.slice(-6).map(x => `<i title="${esc(x.e.label)}: ${esc(pName(x.lead))}" style="background:${pColor(x.lead)}"></i>`).join('')}</div></td></tr>`).join('')}</tbody></table></div>`;
  alignTables(body);
  body.querySelectorAll('tr[data-k]').forEach(tr => tr.onclick = () => { const k = tr.dataset.k, l = groups.get(k), last = l[l.length - 1].e; S.tab = 'easy'; if(k === 'LS') openSim('LS', null, 'next:' + last.id); else openSim('AE', k, 'next:' + last.id, true); });
  const ag = $('#patAgain'); if(ag) ag.onclick = () => { S.swing = {a: null, b: null, pts: 0}; S.T = {}; run(); renderPane(); toast(t('patAgain', {p: U[inc].name})); };
  const fl = $('#patFlip'); if(fl) fl.onclick = () => {
    const base = baseT(); let found = null;
    for(let pts = 0; pts <= 15; pts += 0.5){ const T = base.slice(), mv = Math.min(pts, T[inc]); T[inc] -= mv; T[riv] += mv; const save = S.T; S.T = {}; setAll(T); const c = winners(simulate(targets()), S.overrides).counts; S.T = save; if(c[riv] > c[inc]){ found = pts; break; } }
    if(found == null){ toast(t('patNoFlip')); return; }
    S.swing = {a: U[inc].key, b: U[riv].key, pts: found}; applySwing(); renderPane(); toast(t('patFlipDone', {r: U[riv].name, p: U[inc].name, n: fmt1(found)}));
  };
}});
