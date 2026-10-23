// Delimitation scenario (#30): the Lok Sabha enlarged and redrawn, by pro-rata growth or by 2011 population, and what it does to each state's weight and to the NDA / INDIA tally (page #/delimitation).
addI18n('en', {
  footDelim: 'Delimitation scenario', delimTitle: 'Delimitation scenario', delimSub: 'The Lok Sabha has had 543 seats since the 1970s. If it grew to 800 or more, how many seats would each state get, and who would gain? Each state keeps the same political mix it had in the 2024 result; only the number of seats changes.', delimNote: 'A thought experiment. New seats are assumed to vote like the existing ones in the same state, and the real exercise would also redraw boundaries inside each state. The 2026 Delimitation Bill proposed 850 seats; Wikipedia lists it as not passed.',
  delimTotal: 'Lok Sabha seats: {n}', delimMethod: 'How seats are shared', delimPro: 'Pro rata: every state grows by the same share', delimPop: 'By population (Census 2011)', delimSouth: 'Five southern states', delimHeart: 'Hindi belt (UP, Bihar, MP, Rajasthan, Jharkhand, Chhattisgarh, Uttarakhand, Haryana, Himachal, Delhi)', delimShare: '{a} → {b} seats, {c}% → {d}% of the House',
  delimSides: '2024 mix, new House', delimOld: 'Now', delimNew: 'New', delimChg: 'Change', delimPer: 'People per MP now → new (lakh)', delimMaj: 'Majority mark would be {m}', delimSeatsBy: 'Seats by state',
});
addI18n('hi', {
  footDelim: 'परिसीमन परिदृश्य', delimTitle: 'परिसीमन परिदृश्य', delimSub: 'लोकसभा में 1970 के दशक से 543 सीटें हैं। अगर वह 800 या ज़्यादा हो जाए, तो हर राज्य को कितनी सीटें मिलेंगी और किसे फ़ायदा होगा? हर राज्य का राजनीतिक मिज़ाज वही माना गया है जो 2024 के नतीजे में था; सिर्फ़ सीटों की संख्या बदलती है।', delimNote: 'यह सोच-प्रयोग है। नई सीटें उसी राज्य की मौजूदा सीटों की तरह वोट करेंगी, यह माना गया है, और असली प्रक्रिया में हर राज्य के भीतर सीमाएँ भी नए सिरे से खिंचतीं। परिसीमन विधेयक 2026 में 850 सीटों का प्रस्ताव था; विकिपीडिया के अनुसार वह पारित नहीं हुआ।',
  delimTotal: 'लोकसभा सीटें: {n}', delimMethod: 'सीटें कैसे बँटें', delimPro: 'अनुपात में: हर राज्य बराबर हिस्से से बढ़े', delimPop: 'आबादी के हिसाब से (जनगणना 2011)', delimSouth: 'पाँच दक्षिणी राज्य', delimHeart: 'हिंदी पट्टी (उप्र, बिहार, मप्र, राजस्थान, झारखंड, छत्तीसगढ़, उत्तराखंड, हरियाणा, हिमाचल, दिल्ली)', delimShare: '{a} → {b} सीटें, सदन का {c}% → {d}%',
  delimSides: '2024 का मिज़ाज, नया सदन', delimOld: 'अभी', delimNew: 'नई', delimChg: 'बदलाव', delimPer: 'प्रति सांसद आबादी अभी → नई (लाख)', delimMaj: 'बहुमत का आँकड़ा {m} होता', delimSeatsBy: 'राज्यवार सीटें',
});
function apportion(total, weights, minEach){
  const n = weights.length, sum = weights.reduce((a, b) => a + b, 0), out = new Array(n).fill(0);
  const q = weights.map(w => w / sum * total); let used = 0;
  q.forEach((v, i) => { out[i] = Math.max(minEach, Math.floor(v)); used += out[i]; });
  const rem = q.map((v, i) => ({i, r: v - Math.floor(v)})).sort((a, b) => b.r - a.r);
  for(let k = 0; used < total && k < 10 * n; k++){ out[rem[k % n].i]++; used++; }
  for(let k = n - 1; used > total && k >= 0; k--){ if(out[rem[k % n].i] > minEach){ out[rem[k % n].i]--; used--; } }
  return out;
}
PAGES.set('delimitation', async box => {
  box.innerHTML = `<article class="page" style="max-width:1100px"><h2>${esc(t('delimTitle'))}</h2><p class="lede">${esc(t('delimSub'))}</p><p class="small">${esc(t('delimNote'))}</p><div id="dlBody"><span class="loading"><i></i>${esc(t('loading'))}</span></div></article>`;
  const ls = await bundle('ls'), e = ls.slice().sort((a, b) => b.year - a.year)[0], pop = (await getJSON('ref/population.json')).pop, alli = e.alliances || {};
  const st = e.regions.map((name, r) => ({name, r, seats: 0, sides: {}}));
  e.seats.forEach(s => { if(s[3] < 0) return; const a = st[s[3]], m = s[6] || 1; a.seats += m; if(!s[4].length) return; const p = e.parties[s[4][0]], k = alli[p] || (p === 'IND' ? 'IND' : 'OTH'); a.sides[k] = (a.sides[k] || 0) + m; });
  const sideNames = [...new Set(Object.values(alli))].filter(a => st.some(x => x.sides[a])).sort((a, b) => st.reduce((s, x) => s + (x.sides[b] || 0), 0) - st.reduce((s, x) => s + (x.sides[a] || 0), 0)).slice(0, 2).concat(['OTH']);
  const sideOf = k => sideNames.includes(k) ? k : 'OTH';
  const south = ['Andhra Pradesh', 'Telangana', 'Karnataka', 'Tamil Nadu', 'Kerala'], heart = ['Uttar Pradesh', 'Bihar', 'Madhya Pradesh', 'Rajasthan', 'Jharkhand', 'Chhattisgarh', 'Uttarakhand', 'Haryana', 'Himachal Pradesh', 'Delhi'];
  const state = {total: S.dlTotal || 850, method: S.dlMethod || 'pro'}, N0 = st.reduce((a, b) => a + b.seats, 0);
  function draw(){
    const w = state.method === 'pop' ? st.map(x => pop[x.name] || 1) : st.map(x => x.seats), nw = apportion(state.total, w, 1);
    const rows = st.map((x, i) => { const f = nw[i] / x.seats, sides = {}; Object.entries(x.sides).forEach(([k, v]) => { const sk = sideOf(k); sides[sk] = (sides[sk] || 0) + v * f; });
      // round the state's side counts to its new seat total
      const ks = Object.keys(sides), sub = apportion(nw[i], ks.map(k => sides[k]), 0), fin = {}; ks.forEach((k, j) => fin[k] = sub[j]);
      return {x, old: x.seats, nw: nw[i], sides: x.sides, fin, per0: (pop[x.name] || 0) / x.seats / 1e5, per1: (pop[x.name] || 0) / nw[i] / 1e5}; }).sort((a, b) => b.nw - a.nw);
    const tot = {}, tot0 = {}; rows.forEach(r => { Object.entries(r.fin).forEach(([k, v]) => tot[k] = (tot[k] || 0) + v); Object.entries(r.sides).forEach(([k, v]) => { const sk = sideOf(k); tot0[sk] = (tot0[sk] || 0) + v; }); });
    const sum = (list, f) => rows.filter(r => list.includes(r.x.name)).reduce((a, r) => a + f(r), 0), grp = (list, label) => `<p style="margin:0 0 4px"><b>${esc(label)}:</b> ${esc(t('delimShare', {a: sum(list, r => r.old), b: sum(list, r => r.nw), c: fmt1(100 * sum(list, r => r.old) / N0), d: fmt1(100 * sum(list, r => r.nw) / state.total)}))}</p>`;
    const mx = Math.max(...rows.map(r => r.nw));
    $('#dlBody').innerHTML = `<div class="tools-row"><label style="flex:1;min-width:240px"><span id="dlTL">${esc(t('delimTotal', {n: state.total}))}</span> <input type="range" id="dlT" min="543" max="1000" step="1" value="${state.total}" style="width:100%"></label>
      <label>${esc(t('delimMethod'))} <select id="dlM"><option value="pro" ${state.method === 'pro' ? 'selected' : ''}>${esc(t('delimPro'))}</option><option value="pop" ${state.method === 'pop' ? 'selected' : ''}>${esc(t('delimPop'))}</option></select></label></div>
      <div class="tools-cols"><div>${grp(south, t('delimSouth'))}${grp(heart, t('delimHeart'))}<p class="small" style="margin:4px 0">${esc(t('delimMaj', {m: Math.floor(state.total / 2) + 1}))}</p></div>
        <div><h4>${esc(t('delimSides'))}</h4><p style="margin:0;font-family:var(--display);font-size:19px;font-weight:700">${sideNames.map(k => `<span class="pname" style="display:inline-flex"><i class="sw" style="background:${k === 'OTH' ? '#9aa0aa' : pColor(k === 'NDA' ? 'BJP' : k === 'INDIA' ? 'INC' : k)}"></i>${esc(k === 'OTH' ? t('onoeOthers') : allyName(k))} ${tot0[k] || 0} → <b>${tot[k] || 0}</b></span>`).join(' &nbsp; ')}</p></div></div>
      <h3>${esc(t('delimSeatsBy'))}</h3><div class="seatlist" style="max-height:520px"><table class="tbl"><thead><tr><th>${esc(t('thRegion'))}</th><th>${esc(t('delimOld'))}</th><th>${esc(t('delimNew'))}</th><th>${esc(t('delimChg'))}</th><th></th><th>${esc(t('delimPer'))}</th><th>${sideNames.map(k => esc(k === 'OTH' ? t('onoeOthers') : allyName(k))).join(' / ')}</th></tr></thead><tbody>
      ${rows.map(r => `<tr><td>${esc(stName(r.x.name))}</td><td class="num">${r.old}</td><td class="num"><b>${r.nw}</b></td><td class="num ${r.nw > r.old ? 'up' : r.nw < r.old ? 'down' : ''}">${r.nw > r.old ? '+' : ''}${r.nw - r.old}</td><td style="min-width:90px"><div class="meter"><i style="width:${100 * r.nw / mx}%;background:var(--violet)"></i></div></td><td class="num">${fmt1(r.per0)} → ${fmt1(r.per1)}</td><td class="num small">${sideNames.map(k => `${(Object.entries(r.sides).filter(([kk]) => sideOf(kk) === k).reduce((a, [, v]) => a + v, 0))}→${r.fin[k] || 0}`).join(' / ')}</td></tr>`).join('')}</tbody></table></div>`;
    $('#dlT').oninput = ev => { $('#dlTL').textContent = t('delimTotal', {n: ev.target.value}); };
    $('#dlT').onchange = ev => { state.total = +ev.target.value; S.dlTotal = state.total; draw(); };
    $('#dlM').onchange = ev => { state.method = ev.target.value; S.dlMethod = state.method; draw(); };
    alignTables($('#dlBody'));
  }
  draw();
});
