// Extra map shadings: one party's vote share (stronghold map, #15) and its swing since an earlier election (swing map, #10).
addI18n('en', {shShare: 'Party share', shSwing: 'Swing since', shParty: 'Party', shSince: 'Since', legShare: 'Darker = higher vote share for {p} (top seat {n}%)', legSwing: 'Green: {p} vote share up. Red: down. Compared with {y}. Grey: seat not matched.', swingNone: 'No earlier election to compare with.'});
addI18n('hi', {shShare: 'दल का हिस्सा', shSwing: 'स्विंग', shParty: 'दल', shSince: 'से', legShare: 'गहरा = {p} का वोट हिस्सा ज़्यादा (सबसे ऊँची सीट {n}%)', legSwing: 'हरा: {p} का वोट हिस्सा बढ़ा। लाल: घटा। {y} की तुलना में। स्लेटी: सीट मेल नहीं खाई।', swingNone: 'तुलना के लिए कोई पहले का चुनाव नहीं है।'});
let thenShare = null, shareMax = 0.3;
const GREEN = '#16794A', RED = '#B4372B', GREY = '#E3E4EC';
function shadeUnit(){
  let ui = U.findIndex(g => g.key === S.shadeParty);
  if(ui < 0 || U[ui].key === 'OTH'){ ui = U.map((g, k) => k).filter(k => U[k].key !== 'OTH').sort((a, b) => RES.counts[b] - RES.counts[a])[0]; S.shadeParty = U[ui].key; }
  return ui;
}
function seatFill(i){
  if(S.shade === 'new'){ const m = newMaskCache && newMaskCache.key === S.eid ? newMaskCache : null; return m && m.isNew[i] ? '#7B3FBF' : '#E3E4EC'; }
  if(S.shade === 'share') return U[shadeUnit()].hex;
  if(S.shade === 'swing'){ const th = thenShare && thenShare.vals[i]; if(th == null || isNaN(th)) return GREY; return RES.shares[i][shadeUnit()] - th >= 0 ? GREEN : RED; }
  const w = RES.win[i]; return S.shade === 'flip' && w === E.baseWin[i] ? '#E3E4EC' : U[w].hex;
}
function seatOpacity(i){
  if(S.shade === 'new') return 1;
  if(S.shade === 'share') return .1 + .9 * Math.min(1, RES.shares[i][shadeUnit()] / shareMax);
  if(S.shade === 'swing'){ const th = thenShare && thenShare.vals[i]; if(th == null || isNaN(th)) return 1; return .18 + .82 * Math.min(1, Math.abs(RES.shares[i][shadeUnit()] - th) / .15); }
  if(S.shade !== 'mar') return 1; const x = RES.shares[i]; return Math.max(.18, Math.min(1, .2 + (x[RES.win[i]] - x[RES.second[i]]) * 4));
}
function seatKey(raw, s){ return (raw.kind === 'LS' && s[3] >= 0 ? (raw.regions[s[3]] || '') + '|' : '') + nameKey(s[1]); }
async function shadeData(){
  if(S.shade === 'new'){ await newSeatMask(); }
  if(S.shade === 'share'){ const ui = shadeUnit(); shareMax = Math.max(.25, ...RES.shares.map(x => x[ui])); }
  if(S.shade === 'swing'){
    const list = await histList(), ent = entry(), earlier = list.filter(e => e.year < ent.year || (e.year === ent.year && e.label < ent.label));
    if(!earlier.length){ thenShare = null; return; }
    if(!earlier.some(e => e.id === S.cmpId)) S.cmpId = earlier[earlier.length - 1].id;
    const ui = shadeUnit(), key = [S.eid, S.cmpId, U[ui].key, U[ui].members.join()].join('|');
    if(thenShare && thenShare.key === key) return;
    const A = earlier.find(e => e.id === S.cmpId), codes = new Set(U[ui].members.map(k => E.parties[k])), idx = new Map();
    A.seats.forEach(s => { const tot = seatTotal(s); if(tot <= 0) return; let v = 0; const f = s[4]; for(let k = 0; k < f.length; k += 2) if(codes.has(A.parties[f[k]])) v += f[k+1]; idx.set(seatKey(A, s), v / tot); });
    const vals = new Float64Array(E.seats.length);
    E.raw.seats.forEach((s, i) => { const v = idx.get(seatKey(E.raw, s)); vals[i] = v == null ? NaN : v; });
    thenShare = {key, vals, label: A.label, ids: earlier.map(e => [e.id, e.label])};
  }
  syncShadeUI();
}
function syncShadeUI(){
  const ex = $('#shExtra'); if(!ex) return;
  ex.hidden = !(S.shade === 'share' || S.shade === 'swing');
  const ps = $('#shParty'); const ui = shadeUnit();
  const sig = U.map(g => g.key).join() + '|' + ui; if(ps.dataset.sig !== sig){ ps.innerHTML = U.map((g, k) => ({g, k})).filter(o => o.g.key !== 'OTH').map(o => `<option value="${esc(o.g.key)}" ${o.k === ui ? 'selected' : ''}>${esc(o.g.name)}</option>`).join(''); ps.dataset.sig = sig; }
  ps.value = U[ui].key;
  $('#shCmpWrap').hidden = S.shade !== 'swing';
  if(S.shade === 'swing' && thenShare){ const c = $('#shCmp'), s2 = thenShare.ids.map(x => x[0]).join(); if(c.dataset.sig !== s2){ c.innerHTML = thenShare.ids.map(([id, lb]) => `<option value="${id}">${esc(lb)}</option>`).join(''); c.dataset.sig = s2; } c.value = S.cmpId; }
}
function shadeLegend(){
  if(S.shade === 'new'){ const m = newMaskCache && newMaskCache.key === S.eid ? newMaskCache : null; return `<span><i class="sw" style="background:#7B3FBF"></i>${esc(m ? t('legNew', {y: m.label}) : t('newFirst'))}</span>`; }
  const ui = shadeUnit(), g = U[ui];
  if(S.shade === 'share') return `<span><i class="sw" style="background:${g.hex}"></i>${esc(t('legShare', {p: g.name, n: Math.round(shareMax * 100)}))}</span>`;
  return `<span class="small">${esc(thenShare ? t('legSwing', {p: g.name, y: thenShare.label}) : t('swingNone'))}</span>`;
}
function setShade(v){
  S.shade = v; if(v !== 'swing') thenShare = null;
  document.querySelectorAll('#cardMap .maphead .seg button').forEach(b => b.setAttribute('aria-pressed', b.dataset.sh === v));
  drawMap();
}
function initShades(){
  const seg = $('#cardMap .maphead .seg');
  [['shWin', 'win'], ['shMar', 'mar'], ['shFlip', 'flip']].forEach(([id, v]) => { const b = $('#' + id); b.dataset.sh = v; });
  seg.insertAdjacentHTML('beforeend', `<button id="shShare" data-sh="share" aria-pressed="false" data-i18n="shShare"></button><button id="shSwing" data-sh="swing" aria-pressed="false" data-i18n="shSwing"></button><button id="shNew" data-sh="new" aria-pressed="false" data-i18n="shNew"></button>`);
  seg.querySelectorAll('button').forEach(b => b.onclick = () => setShade(b.dataset.sh));
  $('#cardMap .maphead').insertAdjacentHTML('afterend', `<div class="tools-row" id="shExtra" hidden><label><span data-i18n="shParty"></span> <select id="shParty" aria-label="Party"></select></label><label id="shCmpWrap" hidden><span data-i18n="shSince"></span> <select id="shCmp" aria-label="Compare with"></select></label></div>`);
  $('#shParty').onchange = e => { S.shadeParty = e.target.value; drawMap(); };
  $('#shCmp').onchange = e => { S.cmpId = e.target.value; drawMap(); };
  document.querySelectorAll('#cardMap [data-i18n]').forEach(el => el.textContent = t(el.dataset.i18n));
}
