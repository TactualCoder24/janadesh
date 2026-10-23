// One Nation One Election (#29): one national swing between two sides applied to the Lok Sabha and every assembly at once (page #/onoe).
addI18n('en', {
  footOnoe: 'One Nation One Election', onoeTitle: 'One Nation One Election', onoeSub: 'Imagine the Lok Sabha and every assembly voting on the same day, with the whole country swinging the same way. Move votes from one side to the other and see who would rule where. Each state starts from its latest assembly result.', onoeNote: 'The sides come from the 2024 Lok Sabha alliances: a party that was in neither is counted as "others". The same number of points is moved in every state, which real voters would not do: it is a thought experiment, not a forecast.',
  onoeSideA: 'Side that gains', onoeSideB: 'Side that loses', onoeSwing: 'Swing: {v} points', onoeRun: 'Counting…', onoeLS: 'Lok Sabha', onoeRules: '{s} would rule {n} of {m} states and territories', onoeNowRules: 'today: {n}', onoeTable: 'State by state', onoeNow: 'Largest party today', onoeThen: 'With the swing', onoeHung: 'No majority', onoeSeats: 'Seats', onoeLSres: 'Lok Sabha with this swing', onoeOthers: 'Others', onoeMapT: 'Who would rule where', onoeMajOf: '{a} / {b} / {o}',
});
addI18n('hi', {
  footOnoe: 'एक देश एक चुनाव', onoeTitle: 'एक देश एक चुनाव', onoeSub: 'सोचिए लोकसभा और हर विधानसभा एक ही दिन वोट डालें, और पूरा देश एक ही तरफ़ खिसके। वोट एक पक्ष से दूसरे को खिसकाइए और देखिए कहाँ कौन राज करता। हर राज्य अपने सबसे ताज़ा विधानसभा नतीजे से शुरू होता है।', onoeNote: 'पक्ष 2024 की लोकसभा के गठबंधनों से लिए गए हैं: जो दल दोनों में नहीं था वह "अन्य" गिना गया। हर राज्य में बराबर अंक खिसकाए गए हैं, जो असली मतदाता नहीं करेंगे: यह सोच-प्रयोग है, पूर्वानुमान नहीं।',
  onoeSideA: 'जो पक्ष बढ़ता है', onoeSideB: 'जो पक्ष घटता है', onoeSwing: 'स्विंग: {v} अंक', onoeRun: 'गिनती हो रही है…', onoeLS: 'लोकसभा', onoeRules: '{m} राज्यों और केंद्रशासित प्रदेशों में से {n} में {s} का राज होता', onoeNowRules: 'आज: {n}', onoeTable: 'राज्य दर राज्य', onoeNow: 'आज सबसे बड़ा दल', onoeThen: 'स्विंग के साथ', onoeHung: 'बहुमत नहीं', onoeSeats: 'सीटें', onoeLSres: 'इस स्विंग के साथ लोकसभा', onoeOthers: 'अन्य', onoeMapT: 'कहाँ कौन राज करता', onoeMajOf: '{a} / {b} / {o}',
});
// run one election through the engine without touching what is on screen
function silentRun(raw, mode, pts, sideOf, A, B){
  const keep = {E, U, RES, T: S.T, mode: S.mode, lab: S.lab, ally: S.allyEdit, reg: S.regional, res: S.reserved, ov: S.overrides, lk: S.locks, tr: S.transfer};
  try{
    S.mode = 'party'; S.lab = null; S.allyEdit = {}; S.regional = {}; S.reserved = {SC: {}, ST: {}}; S.overrides = {}; S.locks = {}; S.transfer = 100;
    E = prepare(raw); buildUnits();
    const T0 = U.map(g => g.base); let sa = 0, sb = 0; U.forEach((g, k) => { const sd = g.key === 'OTH' ? null : sideOf(g.key); if(sd === A) sa += T0[k]; else if(sd === B) sb += T0[k]; });
    const ga = sa > 0 ? (sa + pts) / sa : 1, gb = sb > 0 ? Math.max(0, sb - pts) / sb : 1, T = T0.map((v, k) => { const sd = U[k].key === 'OTH' ? null : sideOf(U[k].key); return sd === A ? v * Math.max(0, ga) : sd === B ? v * gb : v; });
    const tot = T.reduce((a, b) => a + b, 0); const Tn = T.map(v => 100 * v / tot);
    S.T = {}; U.forEach((g, k) => S.T[g.key] = Tn[k]);
    const w = winners(simulate(Tn), {}), bySide = {A: 0, B: 0, O: 0}, N = E.N;
    U.forEach((g, k) => { const sd = g.key === 'OTH' ? null : sideOf(g.key); bySide[sd === A ? 'A' : sd === B ? 'B' : 'O'] += w.counts[k]; });
    const lead = U.map((g, k) => k).sort((x, y) => w.counts[y] - w.counts[x])[0];
    return {bySide, N, leadKey: U[lead].key};
  } finally { E = keep.E; U = keep.U; RES = keep.RES; S.T = keep.T; S.mode = keep.mode; S.lab = keep.lab; S.allyEdit = keep.ally; S.regional = keep.reg; S.reserved = keep.res; S.overrides = keep.ov; S.locks = keep.lk; S.transfer = keep.tr; }
}
PAGES.set('onoe', async box => {
  const ix = INDEX.elections, files = new Map();
  const latest = new Map(); ix.filter(e => e.kind === 'AE').forEach(e => { const l = latest.get(e.state); if(!l || e.year > l.year || (e.year === l.year && e.label > l.label)) latest.set(e.state, e); });
  const lsEnt = ix.filter(e => e.kind === 'LS').sort((a, b) => b.year - a.year)[0];
  box.innerHTML = `<article class="page" style="max-width:1100px"><h2>${esc(t('onoeTitle'))}</h2><p class="lede">${esc(t('onoeSub'))}</p><p class="small">${esc(t('onoeNote'))}</p><div id="onoeBody"><span class="loading"><i></i>${esc(t('onoeRun'))}</span></div></article>`;
  const ls = await bundle('ls'), lsRaw = ls.find(e => e.id === lsEnt.id), alli = lsRaw.alliances || {};
  const raws = []; for(const [st, ent] of latest){ const b = await bundle(ent.file); raws.push({st, ent, raw: b.find(e => e.id === ent.id)}); }
  const sides = [...new Set(Object.values(alli))].filter(a => lsRaw.seats.some(s => s[4].length && alli[lsRaw.parties[s[4][0]]] === a)).sort((a, b) => lsRaw.seats.filter(s => s[4].length && alli[lsRaw.parties[s[4][0]]] === b).length - lsRaw.seats.filter(s => s[4].length && alli[lsRaw.parties[s[4][0]]] === a).length).slice(0, 2);
  const state = {A: sides[0] || 'NDA', B: sides[1] || 'INDIA', pts: S.onoePts != null ? S.onoePts : 3};
  const geoP = mapFor('states').catch(() => null);
  const sideCol = k => k === 'A' ? pColor('BJP') : k === 'B' ? pColor('INC') : '#9aa0aa';
  async function draw(){
    const sideOf = code => alli[code] || null, res = [], A = state.A, B = state.B;
    const lsRes = silentRun(lsRaw, 'party', state.pts, sideOf, A, B);
    raws.forEach(o => { const now = silentRun(o.raw, 'party', 0, sideOf, A, B), then = silentRun(o.raw, 'party', state.pts, sideOf, A, B); res.push({st: o.st, ent: o.ent, now, then}); });
    const verdict = r => { const m = Math.floor(r.N / 2) + 1; return r.bySide.A >= m ? 'A' : r.bySide.B >= m ? 'B' : (r.bySide.A + r.bySide.B + r.bySide.O ? 'H' : 'H'); };
    const cnt = (f) => { const c = {A: 0, B: 0, H: 0}; res.forEach(r => c[verdict(f(r))]++); return c; };
    const cn = cnt(r => r.now), ct = cnt(r => r.then), M = res.length;
    const geo = await geoP; let mapSvg = '';
    if(geo){ const fc = topojson.feature(geo, geo.objects[Object.keys(geo.objects)[0]]), W = 600, H = 680, path = d3.geoPath(d3.geoMercator().fitSize([W, H], fc)), byKey = new Map(res.map(r => [stKey(r.st), r]));
      mapSvg = `<svg viewBox="0 0 ${W} ${H}" role="img" aria-label="${esc(t('onoeMapT'))}">${fc.features.map(f => { const r = byKey.get(stKey(f.properties.st)), v = r ? verdict(r.then) : null;
        return `<path d="${path(f)}" fill="${r ? (v === 'H' ? '#D9DCE2' : sideCol(v)) : '#F2F3F5'}" stroke="#fff" stroke-width=".6"><title>${esc(stName(f.properties.st))}${r ? ': ' + (v === 'H' ? t('onoeHung') : v === 'A' ? allyName(A) : allyName(B)) : ''}</title></path>`; }).join('')}</svg>`; }
    const lsM = Math.floor(lsRes.N / 2) + 1;
    $('#onoeBody').innerHTML = `<div class="tools-row"><label>${esc(t('onoeSideA'))} <select id="oA">${sides.map(s => `<option ${s === A ? 'selected' : ''}>${esc(s)}</option>`).join('')}</select></label>
      <label>${esc(t('onoeSideB'))} <select id="oB">${sides.map(s => `<option ${s === B ? 'selected' : ''}>${esc(s)}</option>`).join('')}</select></label>
      <label style="flex:1;min-width:220px"><span id="oPL">${esc(t('onoeSwing', {v: (state.pts > 0 ? '+' : '') + state.pts}))}</span> <input type="range" id="oP" min="-12" max="12" step="0.5" value="${state.pts}" style="width:100%"></label></div>
      <div class="tools-cols"><div><div class="map" style="max-width:520px">${mapSvg}</div>
        <p class="small" style="margin:4px 0"><i class="sw" style="background:${sideCol('A')}"></i> ${esc(allyName(A))} &nbsp; <i class="sw" style="background:${sideCol('B')}"></i> ${esc(allyName(B))} &nbsp; <i class="sw" style="background:#D9DCE2"></i> ${esc(t('onoeHung'))}</p></div>
        <div><p style="font-family:var(--display);font-size:20px;font-weight:700;margin:0">${esc(t('onoeRules', {s: allyName(A), n: ct.A, m: M}))}</p><p class="small" style="margin:0 0 8px">${esc(allyName(B))}: ${ct.B} · ${esc(t('onoeHung'))}: ${ct.H} · ${esc(t('onoeNowRules', {n: allyName(A) + ' ' + cn.A + ', ' + allyName(B) + ' ' + cn.B}))}</p>
          <h4>${esc(t('onoeLSres'))}</h4><p style="margin:0;font-family:var(--display);font-weight:600">${esc(allyName(A))} ${lsRes.bySide.A} · ${esc(allyName(B))} ${lsRes.bySide.B} · ${esc(t('onoeOthers'))} ${lsRes.bySide.O} <span class="small">(${lsM} ${LANG === 'hi' ? 'चाहिए' : 'needed'})</span></p></div></div>
      <h3>${esc(t('onoeTable'))}</h3><div class="seatlist" style="max-height:480px"><table class="tbl"><thead><tr><th>${esc(t('thRegion'))}</th><th>${esc(t('onoeNow'))}</th><th>${esc(allyName(A))} / ${esc(allyName(B))} / ${esc(t('onoeOthers'))}</th><th>${esc(t('onoeThen'))}</th></tr></thead><tbody>
      ${res.sort((a, b) => stName(a.st).localeCompare(stName(b.st), LANG === 'hi' ? 'hi' : 'en')).map(r => { const v = verdict(r.then), vn = verdict(r.now), b = r.then.bySide; return `<tr><td>${esc(stName(r.st))}<div class="small">${esc(r.ent.label)}</div></td><td>${vn === 'H' ? esc(t('onoeHung')) : `<span class="pname"><i class="sw" style="background:${sideCol(vn)}"></i><span>${esc(allyName(vn === 'A' ? A : B))}</span></span>`}</td><td class="num">${b.A} / ${b.B} / ${b.O}</td><td>${v === 'H' ? esc(t('onoeHung')) : `<span class="pname"><i class="sw" style="background:${sideCol(v)}"></i><span><b>${esc(allyName(v === 'A' ? A : B))}</b></span></span>`}${v !== vn ? ' ◀' : ''}</td></tr>`; }).join('')}</tbody></table></div>`;
    $('#oA').onchange = e => { state.A = e.target.value; if(state.A === state.B) state.B = sides.find(s => s !== state.A); draw(); };
    $('#oB').onchange = e => { state.B = e.target.value; if(state.A === state.B) state.A = sides.find(s => s !== state.B); draw(); };
    $('#oP').oninput = e => { $('#oPL').textContent = t('onoeSwing', {v: (+e.target.value > 0 ? '+' : '') + e.target.value}); };
    $('#oP').onchange = e => { state.pts = +e.target.value; S.onoePts = state.pts; draw(); };
    alignTables($('#onoeBody'));
  }
  await draw();
});
