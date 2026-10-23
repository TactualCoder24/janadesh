// Story mode (#20): the real result of the open election in about ten full-screen cards (9:16), map changing from card to card.
// Everything is drawn on one canvas, so it can be shown, saved as images, or recorded as a video for Reels and Shorts.
addI18n('en', {
  storyBtn: 'Story', storyTitle: 'Story of {t}', storyIntro: '{n} seats · {m} for a majority', storyWon: '{p} won {n} seats', storyLead: '{p} led with {n} seats, {s} short of a majority', storyMajLine: 'Majority mark: {m}',
  storyMapT: 'Who won where', storyVotes: 'Votes and seats', storyVotesSub: 'Light bar: share of votes. Solid bar: share of seats.', storyChanges: 'Gainers and losers since {y}', storyHands: '{n} seats changed hands', storyHandsSub: 'The colour is the new winner. Compared with {y}.',
  storyFact: 'Did you know?', storyOutro: 'Now move the vote yourself', storyImages: 'Save images', storyRecord: 'Record video', storyRecording: 'Recording {n} of {m}…', storyVideoNote: 'Saves a WebM video. Most editors and phone apps take it; if one does not, convert it to MP4.', storyPause: 'Pause', storyPlay: 'Play', storyClose: 'Close', storyImgs: 'Story cards', storyLoading: 'Preparing the story…', storySaved: 'Video saved', storyNoRec: 'Video recording is not supported in this browser.',
});
addI18n('hi', {
  storyBtn: 'स्टोरी', storyTitle: '{t} की कहानी', storyIntro: '{n} सीटें · बहुमत के लिए {m}', storyWon: '{p} ने {n} सीटें जीतीं', storyLead: '{p} {n} सीटों के साथ आगे रहा, बहुमत से {s} कम', storyMajLine: 'बहुमत का आँकड़ा: {m}',
  storyMapT: 'कहाँ कौन जीता', storyVotes: 'वोट और सीटें', storyVotesSub: 'हल्की पट्टी: वोट का हिस्सा। गहरी पट्टी: सीटों का हिस्सा।', storyChanges: '{y} के बाद बढ़त और नुक़सान', storyHands: '{n} सीटों ने हाथ बदला', storyHandsSub: 'रंग नए विजेता का है। {y} से तुलना।',
  storyFact: 'क्या आप जानते हैं?', storyOutro: 'अब वोट खुद खिसकाकर देखें', storyImages: 'तस्वीरें सेव करें', storyRecord: 'वीडियो रिकॉर्ड करें', storyRecording: '{m} में से {n} रिकॉर्ड हो रहा है…', storyVideoNote: 'WebM वीडियो सेव होता है। ज़्यादातर एडिटर और फ़ोन ऐप इसे लेते हैं; न ले तो MP4 में बदल लें।', storyPause: 'रोकें', storyPlay: 'चलाएँ', storyClose: 'बंद करें', storyImgs: 'स्टोरी कार्ड', storyLoading: 'स्टोरी तैयार हो रही है…', storySaved: 'वीडियो सेव हो गया', storyNoRec: 'इस ब्राउज़र में वीडियो रिकॉर्डिंग समर्थित नहीं है।',
});
const SW = 1080, SH = 1920, STY = {on: false, cards: [], idx: 0, t0: 0, playing: true, raf: 0, rec: null, dur: 5200, data: null};
const FONT_D = '"Anek Latin","Anek Devanagari",system-ui,sans-serif', FONT_B = '"Hind",system-ui,sans-serif';
const ease = x => x < 0 ? 0 : x > 1 ? 1 : 1 - Math.pow(1 - x, 3);
async function storyGeo(e){
  const hasMap = e.map && e.map !== 'states', name = hasMap ? e.map : (e.kind === 'LS' ? 'states' : null);
  if(!name) return null;
  const geo = await miniGeo(name);
  if(!geo.p2d){ geo.p2d = new Map(); geo.feats.forEach((d, k) => geo.p2d.set(k, new Path2D(d))); }
  if(!geo.bounds){ const topo = await mapFor(name), fc = topojson.feature(topo, topo.objects[Object.keys(topo.objects)[0]]), path = d3.geoPath(d3.geoMercator().fitSize([geo.W, geo.H], fc)); geo.bounds = new Map();
    fc.features.forEach(f => geo.bounds.set(String(name === 'states' ? stKey(f.properties.st) : (f.properties.k != null ? f.properties.k : f.properties.n)), path.bounds(f))); }
  return {geo, mode: hasMap ? 'seats' : 'states', name};
}
async function storyData(){
  const ent = entry(), e = E.raw, P = e.parties, N = E.N, maj = Math.floor(N / 2) + 1;
  // the real winners, grouped into the units on screen (not the simulator's merged-vote counterfactual)
  const win = e.seats.map(s => s[4].length ? E.unitOf[s[4][0]] : -1), cnt = new Array(U.length).fill(0);
  e.seats.forEach((s, i) => { if(win[i] >= 0) cnt[win[i]] += s[6] || 1; });
  const order = U.map((g, k) => k).filter(k => cnt[k] > 0).sort((a, b) => cnt[b] - cnt[a]);
  const sg = await storyGeo(e).catch(() => null);
  const keyOf = i => String(e.mapkeys ? e.mapkeys[i] : (e.seats[i][0] + (e.mapoff || 0)));
  const curWin = e.seats.map(s => s[4].length ? P[s[4][0]] : null);
  // previous election, for changes and the gainers / losers card
  let prev = null, changed = null, deltas = null;
  try{
    const list = await history(), ix = list.findIndex(x => x.id === ent.id);
    if(ix > 0){ prev = list[ix - 1]; const pw = new Map(); prev.seats.forEach(s => { if(s[4].length) pw.set(seatKey(prev, s), prev.parties[s[4][0]]); });
      let matched = 0; changed = e.seats.map((s, i) => { const p = pw.get(seatKey(e, s)); if(p == null || !curWin[i]) return null; matched++; return p !== curWin[i]; });
      if(matched < 0.6 * e.seats.length) changed = null;
      const c0 = new Map(), c1 = new Map(); prev.seats.forEach(s => { if(s[4].length) c0.set(prev.parties[s[4][0]], (c0.get(prev.parties[s[4][0]]) || 0) + (s[6] || 1)); });
      e.seats.forEach((s, i) => { if(curWin[i]) c1.set(curWin[i], (c1.get(curWin[i]) || 0) + (s[6] || 1)); });
      deltas = [...new Set([...c0.keys(), ...c1.keys()])].filter(p => !SKIP_P.has(p)).map(p => ({p, a: c0.get(p) || 0, b: c1.get(p) || 0, d: (c1.get(p) || 0) - (c0.get(p) || 0)}));
    }
  }catch(err){ console.error(err); }
  const facts = await makeFacts();
  // dots for the hemicycle in seat order, left to right
  const tmp = document.createElement('div'); drawHemicycle(tmp, order.map(k => ({n: cnt[k], c: U[k].hex})), N, maj, 0, '');
  const dots = [...tmp.querySelectorAll('circle')].map(c => ({x: +c.getAttribute('cx'), y: +c.getAttribute('cy'), r: +c.getAttribute('r'), c: c.getAttribute('fill')}));
  const tot = {}; let tv = 0; E.seats.forEach(s => { tv += s.tot; });
  return {ent, e, P, N, maj, order, win, cnt, sg, keyOf, curWin, prev, changed, deltas, facts, dots, title: t(ent.kind === 'LS' ? 'titleLS' : 'titleAE', {y: ent.label, s: stName(ent.state)})};
}
// ---- drawing helpers ----
function sText(g, txt, x, y, o = {}){ g.font = `${o.w || 700} ${o.s || 48}px ${o.f || FONT_D}`; g.fillStyle = o.c || '#141414'; g.textAlign = o.a || 'left'; g.textBaseline = 'alphabetic'; g.fillText(txt, x, y); }
function sWrap(g, txt, x, y, maxW, lh, o = {}){ g.font = `${o.w || 700} ${o.s || 48}px ${o.f || FONT_D}`; g.fillStyle = o.c || '#141414'; g.textAlign = o.a || 'left';
  const words = String(txt).split(/\s+/); let line = '', yy = y; for(const w of words){ const tt = line ? line + ' ' + w : w; if(g.measureText(tt).width > maxW && line){ g.fillText(line, x, yy); yy += lh; line = w; } else line = tt; } g.fillText(line, x, yy); return yy + lh; }
function sFrame(g, D, bg, dark, n, i, p){
  g.fillStyle = bg; g.fillRect(0, 0, SW, SH);
  // progress bars like stories
  const gap = 8, bw = (SW - 80 - gap * (n - 1)) / n;
  for(let k = 0; k < n; k++){ g.fillStyle = dark ? 'rgba(255,255,255,.28)' : 'rgba(20,20,20,.16)'; g.beginPath(); g.roundRect(40 + k * (bw + gap), 34, bw, 8, 4); g.fill();
    const f = k < i ? 1 : k === i ? p : 0; if(f > 0){ g.fillStyle = dark ? '#fff' : '#141414'; g.beginPath(); g.roundRect(40 + k * (bw + gap), 34, bw * f, 8, 4); g.fill(); } }
  sText(g, 'JANADESH  जनादेश', 48, 98, {s: 30, w: 800, c: dark ? '#B79BEA' : '#4A2577'});
  sText(g, D.title, SW - 48, 98, {s: 28, w: 600, a: 'right', f: FONT_B, c: dark ? 'rgba(255,255,255,.7)' : '#5D6068'});
}
function sMap(g, D, box, fillFor, o = {}){
  const sg = D.sg; if(!sg){ return false; }
  const {geo, mode} = sg, k0 = Math.min(box.w / geo.W, box.h / geo.H);
  g.save(); g.beginPath(); g.rect(box.x, box.y, box.w, box.h); g.clip();
  let k = k0, tx = box.x + (box.w - geo.W * k0) / 2, ty = box.y + (box.h - geo.H * k0) / 2;
  if(o.zoom && o.focus){ const b = geo.bounds.get(o.focus); if(b){ const bw = b[1][0] - b[0][0], bh = b[1][1] - b[0][1], kz = Math.min(box.w / Math.max(bw * 5, 60), box.h / Math.max(bh * 5, 60), 7), kk = k0 + (Math.max(k0, kz) - k0) * o.zoom, cx = (b[0][0] + b[1][0]) / 2, cy = (b[0][1] + b[1][1]) / 2;
    k = kk; tx = box.x + box.w / 2 - cx * kk; ty = box.y + box.h / 2 - cy * kk; } }
  g.translate(tx, ty); g.scale(k, k);
  g.fillStyle = '#EEF0F2'; geo.p2d.forEach(pp => g.fill(pp));
  g.lineWidth = .35 * (k0 / k); g.strokeStyle = '#fff';
  if(mode === 'seats'){ D.e.seats.forEach((s, i) => { const pp = geo.p2d.get(D.keyOf(i)); if(!pp) return; const f = fillFor(i); if(!f) return; g.globalAlpha = f.a == null ? 1 : f.a; g.fillStyle = f.c; g.fill(pp); g.globalAlpha = 1; g.stroke(pp); }); }
  else { const agg = new Map(); D.e.seats.forEach((s, i) => { if(s[3] < 0) return; const key = stKey(D.e.regions[s[3]]), f = fillFor(i); if(!f) return; const a = agg.get(key) || new Map(); a.set(f.c, (a.get(f.c) || 0) + 1); agg.set(key, a); });
    agg.forEach((a, key) => { const pp = geo.p2d.get(key); if(!pp) return; g.fillStyle = [...a.entries()].sort((x, y) => y[1] - x[1])[0][0]; g.fill(pp); g.stroke(pp); }); }
  if(o.after) o.after(g, {k, tx, ty, geo});
  g.restore(); return true;
}
function sWaffle(g, D, box, fillFor, hi){
  const n = D.e.seats.length, cols = Math.ceil(Math.sqrt(n * box.w / box.h)), cell = box.w / cols, rows = Math.ceil(n / cols), oy = box.y + Math.max(0, (box.h - rows * cell) / 2);
  D.e.seats.forEach((s, i) => { const f = fillFor(i); g.fillStyle = f ? f.c : '#EEF0F2'; g.globalAlpha = f && f.a != null ? f.a : 1; g.beginPath(); g.roundRect(box.x + (i % cols) * cell + 1.5, oy + Math.floor(i / cols) * cell + 1.5, cell - 3, cell - 3, 3); g.fill(); g.globalAlpha = 1;
    if(hi === i){ g.strokeStyle = '#141414'; g.lineWidth = 5; g.stroke(); } });
}
const unitOfSeat = (D, i) => Math.max(0, D.win[i]);
function legend(g, D, y, items){
  let x = 56; g.textBaseline = 'alphabetic';
  items.forEach(([c, label]) => { g.fillStyle = c; g.beginPath(); g.roundRect(x, y - 26, 30, 30, 6); g.fill(); sText(g, label, x + 42, y, {s: 34, w: 600, f: FONT_B}); x += 60 + g.measureText(label).width + 22; if(x > SW - 200){ x = 56; y += 52; } });
}
function storyCards(D){
  const C = [], n0 = () => C.length;
  const top = D.order.slice(0, 5), lead = D.order[0], lc = D.cnt[lead];
  const mapBox = {x: 40, y: 250, w: SW - 80, h: 1250};
  // 1 intro
  C.push({dark: true, bg: '#141414', draw(g, p){
    sText(g, D.title, SW / 2, 330, {s: 112, c: '#fff', a: 'center', w: 800}); sText(g, t('storyIntro', {n: D.N, m: D.maj}), SW / 2, 410, {s: 44, c: 'rgba(255,255,255,.75)', a: 'center', f: FONT_B, w: 500});
    const sc = 1.9, ox = (SW - 520 * sc) / 2, oy = 560, show = Math.floor(D.dots.length * ease(p / .8));
    D.dots.forEach((d, i) => { g.fillStyle = i < show ? d.c : 'rgba(255,255,255,.14)'; g.beginPath(); g.arc(ox + d.x * sc, oy + d.y * sc, d.r * sc, 0, 7); g.fill(); });
    sText(g, t('storyIntro', {n: D.N, m: D.maj}).split(' · ')[1] || '', SW / 2, oy + 290 * sc - 40, {s: 40, c: 'rgba(255,255,255,.8)', a: 'center', f: FONT_B, w: 500});
    sText(g, '←  →', SW / 2, SH - 90, {s: 40, c: 'rgba(255,255,255,.5)', a: 'center'});
  }});
  // 2 winner
  C.push({bg: '#fff', draw(g, p){
    const col = U[lead].hex, cnt = Math.round(lc * ease(p / .6));
    g.fillStyle = col; g.fillRect(0, 160, SW, 640); g.globalAlpha = .12; g.fillStyle = '#000'; g.fillRect(0, 160, SW, 640); g.globalAlpha = 1;
    sText(g, String(cnt), SW / 2, 560, {s: 360, c: '#fff', a: 'center', w: 800});
    sWrap(g, lc >= D.maj ? t('storyWon', {p: U[lead].name, n: lc}) : t('storyLead', {p: U[lead].name, n: lc, s: D.maj - lc}), SW / 2, 650, SW - 140, 64, {s: 54, c: '#fff', a: 'center'});
    // seat bar
    const bx = 56, bw = SW - 112, by = 940; let x = bx;
    g.fillStyle = '#EEF0F2'; g.beginPath(); g.roundRect(bx, by, bw, 80, 14); g.fill();
    g.save(); g.beginPath(); g.roundRect(bx, by, bw, 80, 14); g.clip(); D.order.forEach(k => { const w = bw * D.cnt[k] / D.N * ease(p / .9); g.fillStyle = U[k].hex; g.fillRect(x, by, w, 80); x += w; }); g.restore();
    const mx = bx + bw * (D.maj - .5) / D.N; g.fillStyle = '#141414'; g.fillRect(mx - 2, by - 18, 4, 116); sText(g, t('storyMajLine', {m: D.maj}), mx, by + 150, {s: 36, a: 'center', f: FONT_B, w: 600});
    top.forEach((k, i) => { const y = 1230 + i * 120; g.fillStyle = U[k].hex; g.beginPath(); g.roundRect(56, y - 44, 56, 56, 12); g.fill(); sText(g, shortName(U[k]), 136, y, {s: 56, w: 600}); sText(g, String(Math.round(D.cnt[k] * ease((p - i * .05) / .6))), SW - 56, y, {s: 66, a: 'right', w: 800}); });
  }});
  // 3 map: who won where
  C.push({bg: '#fff', draw(g, p){
    sText(g, t('storyMapT'), 56, 190, {s: 74, w: 800});
    const nShow = Math.floor(D.e.seats.length * ease(p / .85)), fill = i => i < nShow ? {c: U[unitOfSeat(D, i)].hex} : null;
    if(!sMap(g, D, mapBox, fill)) sWaffle(g, D, mapBox, fill);
    legend(g, D, 1580, top.slice(0, 4).map(k => [U[k].hex, shortName(U[k]) + ' ' + D.cnt[k]]));
  }});
  // 4 votes vs seats
  C.push({bg: '#fff', draw(g, p){
    sText(g, t('storyVotes'), 56, 190, {s: 74, w: 800}); sText(g, t('storyVotesSub'), 56, 250, {s: 34, c: '#5D6068', f: FONT_B, w: 500});
    const mx = Math.max(...top.map(k => Math.max(U[k].base, 100 * D.cnt[k] / D.N)), 10), bw = SW - 112 - 300;
    top.forEach((k, i) => { const y = 380 + i * 230, f = ease((p - i * .06) / .5), vw = bw * U[k].base / mx * f, sw2 = bw * (100 * D.cnt[k] / D.N) / mx * f;
      sText(g, shortName(U[k]), 56, y, {s: 56, w: 700}); g.fillStyle = U[k].hex; g.globalAlpha = .3; g.beginPath(); g.roundRect(56, y + 24, Math.max(6, vw), 46, 10); g.fill(); g.globalAlpha = 1;
      g.fillStyle = U[k].hex; g.beginPath(); g.roundRect(56, y + 82, Math.max(6, sw2), 46, 10); g.fill();
      sText(g, fmt1(U[k].base) + '% ' + '·', 56 + Math.max(6, vw) + 16, y + 62, {s: 34, f: FONT_B, w: 600, c: '#5D6068'}); sText(g, fmt1(100 * D.cnt[k] / D.N) + '% (' + D.cnt[k] + ')', 56 + Math.max(6, sw2) + 16, y + 120, {s: 38, w: 800}); });
  }});
  // 5 gainers and losers
  if(D.deltas){ const g1 = D.deltas.filter(x => x.d > 0).sort((a, b) => b.d - a.d).slice(0, 3), l1 = D.deltas.filter(x => x.d < 0).sort((a, b) => a.d - b.d).slice(0, 3);
    if(g1.length || l1.length) C.push({bg: '#fff', draw(g, p){
      sWrap(g, t('storyChanges', {y: D.prev.label}), 56, 190, SW - 112, 84, {s: 74, w: 800});
      const rows = g1.concat(l1), mx = Math.max(...rows.map(r => Math.abs(r.d)), 1);
      rows.forEach((r, i) => { const y = 500 + i * 200 + (i >= g1.length ? 60 : 0), w = (SW - 112 - 200) * Math.abs(r.d) / mx * ease((p - i * .05) / .5), up = r.d > 0;
        sText(g, pName(r.p), 56, y, {s: 52, w: 700}); g.fillStyle = up ? '#16794A' : '#B4372B'; g.beginPath(); g.roundRect(56, y + 24, Math.max(8, w), 56, 12); g.fill();
        sText(g, (up ? '+' : '') + r.d, 56 + Math.max(8, w) + 20, y + 70, {s: 54, w: 800, c: up ? '#16794A' : '#B4372B'}); sText(g, r.a + ' → ' + r.b, SW - 56, y, {s: 40, a: 'right', f: FONT_B, w: 600, c: '#5D6068'}); });
    }}); }
  // 6 what changed hands
  if(D.changed){ const cnt = D.changed.filter(Boolean).length;
    C.push({bg: '#fff', draw(g, p){
      sText(g, t('storyHands', {n: cnt}), 56, 190, {s: 74, w: 800}); sText(g, t('storyHandsSub', {y: D.prev.label}), 56, 250, {s: 34, c: '#5D6068', f: FONT_B, w: 500});
      const fill = i => D.changed[i] ? {c: pColor(D.curWin[i]), a: ease((p - .1) / .5)} : (D.curWin[i] ? {c: '#E3E5E9'} : null);
      if(!sMap(g, D, mapBox, fill)) sWaffle(g, D, mapBox, fill);
      const by = {}; D.changed.forEach((c, i) => { if(c) by[D.curWin[i]] = (by[D.curWin[i]] || 0) + 1; });
      legend(g, D, 1580, Object.entries(by).sort((a, b) => b[1] - a[1]).slice(0, 4).map(([c, n]) => [pColor(c), shortCode2(c) + ' +' + n]));
    }}); }
  // 7, 8: closest and biggest, zoomed on the seat
  ['close', 'big'].forEach(id => { const f = D.facts.find(x => x.id === id); if(!f || f.seat == null) return; const i = f.seat;
    C.push({bg: '#fff', draw(g, p){
      sText(g, t('storyFact'), 56, 190, {s: 74, w: 800});
      const zoom = ease((p - .1) / .6), focus = D.keyOf(i), win = unitOfSeat(D, i);
      const fill = j => j === i ? {c: U[win].hex} : (D.curWin[j] ? {c: '#E8EAEE'} : null);
      const after = (g2, m) => { const b = m.geo.bounds.get(focus); if(!b) return; const cx = (b[0][0] + b[1][0]) / 2, cy = (b[0][1] + b[1][1]) / 2, r = Math.max(8 / m.k * 3, Math.max(b[1][0] - b[0][0], b[1][1] - b[0][1]) / 2) * (1.2 + .3 * Math.sin(p * 18));
        g2.strokeStyle = '#141414'; g2.lineWidth = 3 / m.k * m.geo.W / 600; g2.beginPath(); g2.arc(cx, cy, r, 0, 7); g2.stroke(); };
      const ok = sMap(g, D, {x: 40, y: 280, w: SW - 80, h: 900}, fill, {zoom, focus, after}); if(!ok) sWaffle(g, D, {x: 40, y: 280, w: SW - 80, h: 900}, fill, i);
      sWrap(g, f.text, 56, 1290, SW - 112, 78, {s: 56, w: 700});
    }}); });
  // up to two more facts
  D.facts.filter(f => !['close', 'big'].includes(f.id)).slice(0, 2).forEach(f => { C.push({bg: '#F3EFFA', draw(g, p){
    sText(g, t('storyFact'), 56, 190, {s: 74, w: 800, c: '#4A2577'}); const a = ease(p / .4); g.globalAlpha = a;
    sWrap(g, f.text, 70, 620 - 30 * (1 - a), SW - 140, 104, {s: 78, w: 800}); g.globalAlpha = 1;
  }}); });
  // outro
  C.push({dark: true, bg: '#141414', draw(g, p){
    sText(g, t('storyOutro'), SW / 2, 760, {s: 96, c: '#fff', a: 'center', w: 800}); sText(g, 'janadesh-smoky.vercel.app', SW / 2, 900, {s: 54, c: '#B79BEA', a: 'center', f: FONT_B, w: 600});
    const sc = 1.7, ox = (SW - 520 * sc) / 2; D.dots.forEach(d => { g.fillStyle = d.c; g.beginPath(); g.arc(ox + d.x * sc, 1080 + d.y * sc, d.r * sc, 0, 7); g.fill(); });
    sText(g, t('disclaimer').split('.')[0] + '.', SW / 2, SH - 100, {s: 34, c: 'rgba(255,255,255,.6)', a: 'center', f: FONT_B, w: 500});
  }});
  return C;
}
const shortCode2 = c => LANG === 'hi' && HI_PARTY[c] ? HI_PARTY[c] : c.replace('_SHINDE', '');
// ---- player ----
function storyDraw(now){
  const cv = $('#storyCv'), g = cv.getContext('2d'), n = STY.cards.length, c = STY.cards[STY.idx]; if(!c) return;
  const dur = STY.rec ? STY.recDur : STY.dur, p = Math.min(1, (now - STY.t0) / dur);
  sFrame(g, STY.data, c.bg, c.dark, n, STY.idx, p); c.draw(g, p);
  return p;
}
function storyLoop(now){
  if(!STY.on) return;
  const p = storyDraw(now);
  if(STY.playing || STY.rec){ if(p >= 1){ if(STY.idx < STY.cards.length - 1){ STY.idx++; STY.t0 = now; } else if(STY.rec){ stopRecording(); } else { STY.playing = false; paintStoryUI(); } } }
  STY.raf = requestAnimationFrame(storyLoop);
}
function storyGo(i){ STY.idx = Math.max(0, Math.min(STY.cards.length - 1, i)); STY.t0 = performance.now(); }
function paintStoryUI(){ const b = $('#storyPlay'); if(b) b.textContent = STY.playing ? t('storyPause') : t('storyPlay'); }
function closeStory(){ STY.on = false; cancelAnimationFrame(STY.raf); if(STY.rec) try{ STY.rec.recorder.stop(); }catch(e){} STY.rec = null; $('#story').hidden = true; document.body.style.overflow = ''; document.removeEventListener('keydown', storyKey); }
function storyKey(ev){ if(ev.key === 'Escape') closeStory(); else if(ev.key === 'ArrowRight' || ev.key === ' '){ ev.preventDefault(); storyGo(STY.idx + 1); } else if(ev.key === 'ArrowLeft') storyGo(STY.idx - 1); }
async function openStory(){
  const box = $('#story'); box.hidden = false; document.body.style.overflow = 'hidden'; STY.on = true;
  box.innerHTML = `<div class="story-load"><span class="loading"><i></i>${esc(t('storyLoading'))}</span></div>`;
  try{ await Promise.all(['800 40px "Anek Latin"', '600 24px "Hind"', '700 30px "Anek Devanagari"'].map(f => document.fonts.load(f, 'Aअ'))); }catch(e){}
  let D; try{ D = await storyData(); }catch(err){ console.error(err); closeStory(); return; }
  if(!STY.on) return;
  STY.data = D; STY.cards = storyCards(D); STY.idx = 0; STY.playing = true; STY.t0 = performance.now(); track('story_open');
  box.innerHTML = `<div class="story-stage"><canvas id="storyCv" width="${SW}" height="${SH}" aria-label="${esc(t('storyTitle', {t: D.title}))}"></canvas>
    <div class="story-tap" id="stPrev" aria-label="Previous"></div><div class="story-tap right" id="stNext" aria-label="Next"></div></div>
    <div class="story-bar"><button class="btn small" id="storyPlay"></button><button class="btn small" id="storyImgs">${esc(t('storyImages'))}</button><button class="btn small" id="storyRec">${esc(t('storyRecord'))}</button><button class="btn small" id="storyX">${esc(t('storyClose'))}</button></div>`;
  paintStoryUI();
  $('#stPrev').onclick = () => storyGo(STY.idx - 1); $('#stNext').onclick = () => storyGo(STY.idx + 1);
  $('#storyPlay').onclick = () => { STY.playing = !STY.playing; if(STY.playing && STY.idx === STY.cards.length - 1) storyGo(0); STY.t0 = performance.now(); paintStoryUI(); };
  $('#storyX').onclick = closeStory; $('#storyImgs').onclick = storyImages; $('#storyRec').onclick = startRecording;
  let sx = 0; const st = $('#storyCv'); st.addEventListener('touchstart', e => { sx = e.touches[0].clientX; }, {passive: true}); st.addEventListener('touchend', e => { const dx = e.changedTouches[0].clientX - sx; if(Math.abs(dx) > 50) storyGo(STY.idx + (dx < 0 ? 1 : -1)); }, {passive: true});
  document.addEventListener('keydown', storyKey);
  STY.raf = requestAnimationFrame(storyLoop);
}
function renderFrame(i, canvas){ const g = canvas.getContext('2d'), c = STY.cards[i]; sFrame(g, STY.data, c.bg, c.dark, STY.cards.length, i, 1); c.draw(g, 1); }
function storyImages(){
  STY.playing = false; paintStoryUI();
  const imgs = STY.cards.map((c, i) => { const cv = document.createElement('canvas'); cv.width = SW; cv.height = SH; renderFrame(i, cv); return cv.toDataURL('image/png'); });
  modal(`<h3>${esc(t('storyImgs'))}</h3><div class="storythumbs">${imgs.map((u, i) => `<a href="${u}" download="janadesh-story-${i + 1}.png"><img src="${u}" alt="${i + 1}" loading="lazy"></a>`).join('')}</div><div class="row" style="margin-top:8px"><button class="btn" data-close>${esc(t('close'))}</button></div>`);
}
function startRecording(){
  if(!window.MediaRecorder || !$('#storyCv').captureStream){ toast(t('storyNoRec')); return; }
  const cv = $('#storyCv'), mime = ['video/webm;codecs=vp9', 'video/webm;codecs=vp8', 'video/webm'].find(m => MediaRecorder.isTypeSupported(m));
  if(!mime){ toast(t('storyNoRec')); return; }
  const chunks = [], recorder = new MediaRecorder(cv.captureStream(30), {mimeType: mime, videoBitsPerSecond: 6e6});
  recorder.ondataavailable = e => { if(e.data.size) chunks.push(e.data); };
  recorder.onstop = () => { const blob = new Blob(chunks, {type: 'video/webm'}), a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = 'janadesh-story.webm'; document.body.appendChild(a); a.click(); a.remove(); STY.rec = null; STY.playing = false; paintStoryUI(); $('#storyRec').textContent = t('storyRecord'); toast(t('storySaved')); STY.lastBlob = blob; };
  STY.rec = {recorder}; STY.recDur = 4200; STY.idx = 0; STY.t0 = performance.now(); STY.playing = true;
  recorder.start(250);
  const tick = setInterval(() => { if(!STY.rec){ clearInterval(tick); return; } $('#storyRec').textContent = t('storyRecording', {n: STY.idx + 1, m: STY.cards.length}); }, 300);
}
function stopRecording(){ if(STY.rec) STY.rec.recorder.stop(); }
$('#storyBtn').onclick = openStory;
