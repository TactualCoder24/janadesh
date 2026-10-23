// Small-multiple maps (#22): one party's vote share, seat by seat, in every election on one screen.
addI18n('en', {toolMulti: 'Party maps over time', multiSub: 'One party\'s vote share in every constituency, election by election. A darker seat means a higher share; the shading uses one scale across all years. Older elections without a constituency map show state shares, or a seat grid.', multiParty: 'Party', multiLine: '{n} seats won · {v}% of votes', multiScale: 'Darkest = {n}% of the votes in the seat'});
addI18n('hi', {toolMulti: 'समय के साथ दल के नक्शे', multiSub: 'हर चुनाव में हर चुनाव क्षेत्र में एक दल का वोट हिस्सा। जितनी गहरी सीट, उतना ज़्यादा हिस्सा; सभी सालों के लिए एक ही पैमाना है। जिन पुराने चुनावों का चुनाव-क्षेत्र नक्शा नहीं, उनमें राज्यवार हिस्सा या सीटों की ग्रिड दिखती है।', multiParty: 'दल', multiLine: '{n} सीटें जीतीं · {v}% वोट', multiScale: 'सबसे गहरा = सीट के {n}% वोट'});
const MMG = {};
async function miniGeo(name){
  if(MMG[name]) return MMG[name];
  const topo = await mapFor(name), fc = topojson.feature(topo, topo.objects[Object.keys(topo.objects)[0]]), W = 600, H = (name === 'pc' || name === 'states') ? 680 : 520;
  const path = d3.geoPath(d3.geoMercator().fitSize([W, H], fc)), feats = new Map(), all = [];
  fc.features.forEach(f => { const d = path(f); if(!d) return; all.push(d); feats.set(String(name === 'states' ? stKey(f.properties.st) : (f.properties.k != null ? f.properties.k : f.properties.n)), d); });
  return MMG[name] = {W, H, feats, all: all.join('')};
}
function partyShareSeats(e, code){
  const pi = e.parties.indexOf(code);
  return e.seats.map(s => { let v = 0, tot = s[5] || 0; for(let k = 0; k < s[4].length; k += 2){ if(s[4][k] === pi) v += s[4][k + 1]; tot += s[4][k + 1]; } return tot > 0 ? v / tot : null; });
}
registerTool({id: 'multiples', label: 'toolMulti', sub: 'multiSub', async render(body, stale){
  const list = await history(); if(stale()) return;
  const seatsWon = {}, present = {}; list.forEach(e => { const w = {}; e.seats.forEach(s => { if(s[4].length){ const p = e.parties[s[4][0]]; w[p] = (w[p] || 0) + (s[6] || 1); } }); e.parties.forEach(p => { present[p] = (present[p] || 0) + 1; }); Object.entries(w).forEach(([p, n]) => seatsWon[p] = (seatsWon[p] || 0) + n); });
  const opts = Object.keys(seatsWon).filter(p => !SKIP_P.has(p) && present[p] >= 3).sort((a, b) => seatsWon[b] - seatsWon[a]).slice(0, 30);
  if(!opts.length){ body.innerHTML = `<p class="small">${esc(t('toolsNoData'))}</p>`; return; }
  let P = S.mmParty; if(!opts.includes(P)) P = opts[0]; S.mmParty = P;
  const shares = list.map(e => partyShareSeats(e, P));
  const maxS = Math.max(.25, ...shares.map(a => Math.max(0, ...a.filter(x => x != null))));
  const cards = [];
  for(const [j, e] of list.entries()){
    const sh = shares[j], pi = e.parties.indexOf(P); let won = 0, vp = 0, tv = 0;
    e.seats.forEach((s, i) => { if(s[4].length && s[4][0] === pi) won += s[6] || 1; for(let k = 0; k < s[4].length; k += 2){ if(s[4][k] === pi) vp += s[4][k + 1]; tv += s[4][k + 1]; } tv += s[5] || 0; });
    if(pi < 0 || vp === 0){ continue; }
    const op = x => .08 + .92 * Math.min(1, x / maxS), hex = pColor(P);
    let svg = '';
    try{
      if(e.map && e.map !== 'states'){
        const geo = await miniGeo(e.map); if(stale()) return;
        svg = `<svg viewBox="0 0 ${geo.W} ${geo.H}"><path d="${geo.all}" fill="#EEF0F2"/>${e.seats.map((s, i) => { const k = String(e.mapkeys ? e.mapkeys[i] : (s[0] + (e.mapoff || 0))), d = geo.feats.get(k); return d && sh[i] != null ? `<path d="${d}" fill="${hex}" fill-opacity="${op(sh[i]).toFixed(2)}"/>` : ''; }).join('')}</svg>`;
      } else if(e.kind === 'LS'){
        const geo = await miniGeo('states'); if(stale()) return;
        const agg = new Map(); e.seats.forEach((s, i) => { if(s[3] < 0 || sh[i] == null) return; const k = stKey(e.regions[s[3]]), a = agg.get(k) || {v: 0, t: 0}; let tot = s[5] || 0; for(let q = 1; q < s[4].length; q += 2) tot += s[4][q]; a.v += sh[i] * tot; a.t += tot; agg.set(k, a); });
        svg = `<svg viewBox="0 0 ${geo.W} ${geo.H}"><path d="${geo.all}" fill="#EEF0F2"/>${[...agg.entries()].map(([k, a]) => { const d = geo.feats.get(k); return d && a.t ? `<path d="${d}" fill="${hex}" fill-opacity="${op(a.v / a.t).toFixed(2)}"/>` : ''; }).join('')}</svg>`;
      }
    }catch(err){ svg = ''; }
    if(!svg){ const n = e.seats.length, cols = Math.ceil(Math.sqrt(n * 1.4)), cell = 600 / cols, rows = Math.ceil(n / cols);
      svg = `<svg viewBox="0 0 600 ${Math.max(200, rows * cell)}">${e.seats.map((s, i) => sh[i] != null ? `<rect x="${(i % cols) * cell}" y="${Math.floor(i / cols) * cell}" width="${cell - 1.5}" height="${cell - 1.5}" fill="${hex}" fill-opacity="${op(sh[i]).toFixed(2)}"/>` : '').join('')}</svg>`; }
    cards.push(`<figure class="mm"><figcaption><b>${esc(e.label)}</b></figcaption>${svg}<p class="small">${esc(t('multiLine', {n: won, v: fmt1(100 * vp / tv)}))}</p></figure>`);
  }
  body.innerHTML = `<div class="tools-row"><label>${esc(t('multiParty'))} <select id="mmParty">${opts.map(p => `<option value="${esc(p)}" ${p === P ? 'selected' : ''}>${esc(pName(p))}</option>`).join('')}</select></label><span class="small"><i class="sw" style="background:${pColor(P)}"></i> ${esc(t('multiScale', {n: Math.round(maxS * 100)}))}</span></div><div class="mmgrid">${cards.join('')}</div>`;
  $('#mmParty').onchange = e => { S.mmParty = e.target.value; toolKeyShown = null; toolsTouch(true); };
}});
