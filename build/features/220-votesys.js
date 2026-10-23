// Different voting systems (#31): the same votes in the current scenario, counted four ways.
addI18n('en', {
  toolVS: 'Voting systems', vsSub: 'The votes in the current scenario, counted under other systems: proportional representation (nationwide, or by state) and a two-round runoff. How far seats are from vote shares is shown as the Gallagher index (0 is perfectly proportional).',
  vsFPTP: 'First past the post (now)', vsPRnat: 'Proportional, nationwide', vsPRreg: 'Proportional, by {w}', vsRun: 'Two-round runoff', vsMethod: 'Method', vsDhondt: "D'Hondt", vsSL: 'Sainte-Laguë', vsHare: 'Largest remainder (Hare)', vsThr: 'Threshold', vsThrN: '{n}% of votes', vsLoyal: 'Allies\' voters who back their ally in the runoff: {v}%',
  vsGall: 'Gallagher index', vsStateW: 'state', vsDistW: 'district', vsNoteRun: 'Round one: a candidate with more than half the votes wins. Otherwise the top two meet in a runoff; voters of an eliminated party mostly back a finalist from their own alliance, the rest split between the finalists in proportion to their first-round votes.', vsNoteOthers: '"Others" (all small parties together) are left out of the proportional counts and the runoff finals.', vsVotes: 'Votes %', vsGainLoss: 'vs now',
  vsNoteNat: 'Nationwide: all {n} seats shared out by national vote share.', vsNoteReg: 'By {w}: each {w} shares out its own seats by the vote share inside it.',
});
addI18n('hi', {
  toolVS: 'मतदान प्रणालियाँ', vsSub: 'मौजूदा परिदृश्य के वोट, दूसरी प्रणालियों में गिने हुए: अनुपातिक प्रतिनिधित्व (देशभर में, या राज्यवार) और दो-चरण का रनऑफ़। सीटें वोट हिस्से से कितनी दूर हैं यह गैलाघर इंडेक्स से दिखता है (0 यानी पूरा अनुपातिक)।',
  vsFPTP: 'पहले नंबर पर जीत (अभी)', vsPRnat: 'अनुपातिक, देशभर में', vsPRreg: 'अनुपातिक, {w} के हिसाब से', vsRun: 'दो-चरण रनऑफ़', vsMethod: 'तरीक़ा', vsDhondt: 'डी\'हॉन्ट', vsSL: 'सैंट-लैग्यू', vsHare: 'सबसे बड़ा शेष (हेयर)', vsThr: 'न्यूनतम सीमा', vsThrN: '{n}% वोट', vsLoyal: 'रनऑफ़ में अपने सहयोगी को वोट देने वाले सहयोगी-दल के मतदाता: {v}%',
  vsGall: 'गैलाघर इंडेक्स', vsStateW: 'राज्य', vsDistW: 'ज़िले', vsNoteRun: 'पहला चरण: आधे से ज़्यादा वोट पाने वाला उम्मीदवार जीतता है। वरना पहले दो के बीच रनऑफ़; बाहर हुए दल के मतदाता ज़्यादातर अपने गठबंधन के फ़ाइनलिस्ट को वोट देते हैं, बाक़ी पहले चरण के वोटों के अनुपात में दोनों फ़ाइनलिस्टों में बँटते हैं।', vsNoteOthers: '"अन्य" (सभी छोटे दल मिलाकर) अनुपातिक गिनती और रनऑफ़ के फ़ाइनल से बाहर रखे गए हैं।', vsVotes: 'वोट %', vsGainLoss: 'अभी के मुक़ाबले',
  vsNoteNat: 'देशभर में: सभी {n} सीटें राष्ट्रीय वोट हिस्से के हिसाब से बँटती हैं।', vsNoteReg: '{w} के हिसाब से: हर {w} अपनी सीटें अपने भीतर के वोट हिस्से से बाँटता है।',
});
function allocate(shares, seats, method, thr){
  // shares: array of percentages (null/0 = out); returns seats per index
  const out = new Array(shares.length).fill(0), ok = shares.map(v => v != null && v >= thr && v > 0);
  const live = shares.map((v, i) => ok[i] ? v : 0), tot = live.reduce((a, b) => a + b, 0); if(!tot || seats <= 0) return out;
  if(method === 'hare'){ const q = tot / seats; let used = 0; const rem = live.map((v, i) => { const n = Math.floor(v / q); out[i] = n; used += n; return {i, r: v / q - n}; }); rem.sort((a, b) => b.r - a.r); for(let k = 0; k < seats - used; k++) out[rem[k % rem.length].i]++; return out; }
  for(let s2 = 0; s2 < seats; s2++){ let best = -1, bv = -1; live.forEach((v, i) => { if(!v) return; const d = method === 'sl' ? 2 * out[i] + 1 : out[i] + 1, q = v / d; if(q > bv){ bv = q; best = i; } }); out[best]++; }
  return out;
}
function gallagher(votes, seats, N){ let s = 0; votes.forEach((v, i) => { const d = v - 100 * seats[i] / N; s += d * d; }); return Math.sqrt(s / 2); }
registerTool({id: 'votesys', label: 'toolVS', sub: 'vsSub', live: true, key: () => simKey() + '|' + (S.vsMethod || '') + (S.vsThr || '') + (S.vsLoyal || ''), render(body){
  const method = S.vsMethod || 'dhondt', thr = S.vsThr != null ? +S.vsThr : 0, loyal = S.vsLoyal != null ? +S.vsLoyal : 70, N = E.N, n = U.length, oth = n - 1;
  const live = U.map((g, k) => k).filter(k => k !== oth && !U[k].labKind || (U[k].labKind && true)).filter(k => k !== oth);
  const T = RES.T.slice();
  // nationwide PR
  const natSeats = new Array(n).fill(0); allocate(T.map((v, k) => k === oth ? 0 : v), N, method, thr).forEach((c, k) => natSeats[k] = c);
  // PR by state (Lok Sabha) or district (assembly); seats without a region are counted with the whole
  const regSeats = new Array(n).fill(0), byR = new Map();
  E.seats.forEach((s, i) => { const r = s.r >= 0 ? s.r : -1, a = byR.get(r) || {m: 0, w: new Float64Array(n), t: 0}; a.m += s.m; a.t += s.ut; for(let k = 0; k < n; k++) a.w[k] += RES.shares[i][k] * s.ut; byR.set(r, a); });
  byR.forEach(a => { const sh = Array.from(a.w, (w, k) => k === oth ? 0 : 100 * w / a.t); allocate(sh, a.m, method, thr).forEach((c, k) => regSeats[k] += c); });
  // runoff
  const allyOf = k => { const g = U[k]; if(g.key.startsWith('A:')) return g.key; const al = alliancesOf()[g.members.length ? E.parties[g.members[0]] : '']; return al ? 'A:' + al : null; };
  const runSeats = new Array(n).fill(0); let seatsRun = 0;
  E.seats.forEach((s, i) => { const x = RES.shares[i], ord = [...x.keys()].filter(k => k !== oth).sort((a, b) => x[b] - x[a]); if(!ord.length) return; const m = s.m;
    if(x[ord[0]] > .5){ runSeats[ord[0]] += m; return; }
    const A = ord[0], B = ord[1]; if(B == null){ runSeats[A] += m; return; }
    let va = x[A], vb = x[B];
    ord.slice(2).concat([oth]).forEach(k => { const v = x[k]; if(!v) return; const fa = allyOf(k) && allyOf(k) === allyOf(A), fb = allyOf(k) && allyOf(k) === allyOf(B);
      let toA, toB; const base = va + vb || 1;
      if(fa && !fb){ toA = loyal / 100 + (1 - loyal / 100) * va / base; toB = 1 - toA; } else if(fb && !fa){ toB = loyal / 100 + (1 - loyal / 100) * vb / base; toA = 1 - toB; } else { toA = va / base; toB = vb / base; }
      va += v * toA * (k === oth ? .7 : 1); vb += v * toB * (k === oth ? .7 : 1); });
    runSeats[va >= vb ? A : B] += m; });
  const cols = [['vsFPTP', RES.counts], ['vsPRnat', natSeats], ['vsPRreg', regSeats], ['vsRun', runSeats]];
  const regW = t(S.kind === 'LS' ? 'vsStateW' : 'vsDistW');
  const order = U.map((g, k) => k).filter(k => cols.some(c => c[1][k] > 0) || T[k] >= 1).sort((a, b) => RES.counts[b] - RES.counts[a] || T[b] - T[a]).slice(0, 14);
  const votesForG = T.filter((v, k) => k !== oth), gal = cols.map(c => gallagher(T.map((v, k) => v), c[1], N));
  const tot = cols.map(c => c[1].reduce((a, b) => a + b, 0));
  body.innerHTML = `<div class="tools-row"><label>${esc(t('vsMethod'))} <select id="vsM">${[['dhondt', 'vsDhondt'], ['sl', 'vsSL'], ['hare', 'vsHare']].map(([v, l]) => `<option value="${v}" ${v === method ? 'selected' : ''}>${esc(t(l))}</option>`).join('')}</select></label>
    <label>${esc(t('vsThr'))} <select id="vsT">${[0, 1, 3, 5].map(v => `<option value="${v}" ${v === thr ? 'selected' : ''}>${esc(t('vsThrN', {n: v}))}</option>`).join('')}</select></label>
    <label style="min-width:200px">${esc(t('vsLoyal', {v: loyal}))} <input type="range" id="vsL" min="0" max="100" step="5" value="${loyal}"></label></div>
    <div class="seatlist" style="max-height:480px"><table class="tbl"><thead><tr><th>${esc(S.mode === 'alliance' ? t('thAlly') : t('thParty'))}</th><th>${esc(t('vsVotes'))}</th>${cols.map(c => `<th>${esc(t(c[0], {w: regW}))}</th>`).join('')}</tr></thead><tbody>
    ${order.map(k => `<tr><td><span class="pname"><i class="sw" style="background:${U[k].hex}"></i><span>${esc(k === oth ? t('others') : U[k].name)}</span></span></td><td class="num">${fmt1(T[k])}</td>${cols.map((c, j) => { const v = c[1][k], d = v - RES.counts[k]; return `<td class="num"><b>${v}</b>${j && d ? ` <small class="${d > 0 ? 'up' : 'down'}">${d > 0 ? '+' : ''}${d}</small>` : ''}</td>`; }).join('')}</tr>`).join('')}
    <tr style="background:var(--sunk)"><td><b>${esc(t('vsGall'))}</b></td><td></td>${gal.map(v => `<td class="num"><b>${fmt1(v)}</b></td>`).join('')}</tr></tbody></table></div>
    <p class="small" style="margin:6px 0 0">${esc(t('vsNoteNat', {n: N}))} ${esc(t('vsNoteReg', {w: regW}))} ${esc(t('vsNoteOthers'))}</p><p class="small" style="margin:2px 0 0">${esc(t('vsNoteRun'))}</p>`;
  $('#vsM').onchange = e => { S.vsMethod = e.target.value; toolKeyShown = null; toolsTouch(true); };
  $('#vsT').onchange = e => { S.vsThr = +e.target.value; toolKeyShown = null; toolsTouch(true); };
  $('#vsL').onchange = e => { S.vsLoyal = +e.target.value; toolKeyShown = null; toolsTouch(true); };
  alignTables(body);
}});
