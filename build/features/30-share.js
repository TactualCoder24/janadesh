// Share: link to the exact scenario, image (map + tally), WhatsApp text, Twitter thread. Other features add entries to SHARE_ACTIONS.
addI18n('en', {
  share: 'Share', shareTitle: 'Share this scenario', shareHint: 'The link opens exactly what you see: the election, swings, alliances and seat overrides.',
  copyLink: 'Copy link', linkCopied: 'Link copied', shareNative: 'Share…', shareWA: 'WhatsApp', shareTW: 'Post on X', shareImg: 'Image', shareThread: 'Copy as thread', threadCopied: 'Thread copied, one post per paragraph',
  shareWAtext: 'Copy summary', waCopied: 'Summary copied', downloadPng: 'Download', copyImage: 'Copy image', imageCopied: 'Image copied', imgBusy: 'Making the image…',
  fmtWide: '16:9 (X, YouTube)', fmtStory: '9:16 (Reels, Shorts)',
  waHead: '🗳️ *Janadesh simulation: {title}*', waFlips: '{f} of {n} seats change hands compared with {y}.', waSim: 'Simulation only. Not a real result or forecast.',
  twHead: 'What if the vote moved? {title} on Janadesh: {verdict}', twSeats: 'Seats ({y} → simulation):', twRegions: 'Biggest shifts by {w}:', twClose: 'Seats that flip on the narrowest margins:',
  twBeat: '{a} beats {b} by {m} pts', twLink: 'Try it yourself and move the vote: {url}\nSimulation only, not a real result or forecast.', districts2: 'districts', states2: 'states',
  tweetSeatsLine: '{n} seats', loadingScn: 'Opening the shared scenario…',
});
addI18n('hi', {
  share: 'शेयर करें', shareTitle: 'यह परिदृश्य शेयर करें', shareHint: 'यह लिंक ठीक वही खोलता है जो आप देख रहे हैं: चुनाव, स्विंग, गठबंधन और सीट बदलाव।',
  copyLink: 'लिंक कॉपी करें', linkCopied: 'लिंक कॉपी हो गया', shareNative: 'शेयर…', shareWA: 'व्हाट्सऐप', shareTW: 'X पर पोस्ट करें', shareImg: 'तस्वीर', shareThread: 'थ्रेड कॉपी करें', threadCopied: 'थ्रेड कॉपी हो गया, हर अनुच्छेद एक पोस्ट',
  shareWAtext: 'सारांश कॉपी करें', waCopied: 'सारांश कॉपी हो गया', downloadPng: 'डाउनलोड', copyImage: 'तस्वीर कॉपी करें', imageCopied: 'तस्वीर कॉपी हो गई', imgBusy: 'तस्वीर बन रही है…',
  fmtWide: '16:9 (X, यूट्यूब)', fmtStory: '9:16 (रील्स, शॉर्ट्स)',
  waHead: '🗳️ *जनादेश सिम्युलेशन: {title}*', waFlips: '{y} की तुलना में {n} में से {f} सीटें पलटती हैं।', waSim: 'सिर्फ़ सिम्युलेशन। असली नतीजा या पूर्वानुमान नहीं।',
  twHead: 'अगर वोट खिसक जाएँ? जनादेश पर {title}: {verdict}', twSeats: 'सीटें ({y} → सिम्युलेशन):', twRegions: '{w} के हिसाब से सबसे बड़े बदलाव:', twClose: 'सबसे कम अंतर पर पलटने वाली सीटें:',
  twBeat: '{a} ने {b} को {m} अंक से हराया', twLink: 'खुद आज़माएँ और वोट खिसकाकर देखें: {url}\nसिर्फ़ सिम्युलेशन, असली नतीजा या पूर्वानुमान नहीं।', districts2: 'ज़िलों', states2: 'राज्यों',
  tweetSeatsLine: '{n} सीटें', loadingScn: 'शेयर किया गया परिदृश्य खुल रहा है…',
});

// ---------- link ----------
const b64u = {
  enc(bytes){ let s = ''; bytes.forEach(b => s += String.fromCharCode(b)); return btoa(s).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, ''); },
  dec(str){ const s = atob(str.replace(/-/g, '+').replace(/_/g, '/')); return Uint8Array.from(s, ch => ch.charCodeAt(0)); },
};
function scenarioForLink(){
  const sc = scenario(); sc.lang = LANG;
  const T = {}; for(const k in sc.T) T[k] = Math.round(sc.T[k] * 100) / 100; sc.T = T;
  for(const k of ['locks', 'regional', 'reserved', 'overrides', 'allyEdit']){ if(sc[k] && !Object.keys(sc[k]).length) delete sc[k]; }
  if(sc.reserved && !Object.keys(sc.reserved.SC || {}).length && !Object.keys(sc.reserved.ST || {}).length) delete sc.reserved;
  if(!Object.keys(sc.partyEdit || {}).length) delete sc.partyEdit;
  return sc;
}
function encodeScenario(sc){ return b64u.enc(pako.deflateRaw(new TextEncoder().encode(JSON.stringify(sc)))); }
function decodeScenario(str){ return JSON.parse(new TextDecoder().decode(pako.inflateRaw(b64u.dec(str)))); }
function shareURL(){ return location.origin + location.pathname + '#s=' + encodeScenario(scenarioForLink()); }
async function bootFromHash(){
  const m = location.hash.match(/^#s=([\w-]+)$/); if(!m) return;
  try{
    const sc = decodeScenario(m[1]);
    if(sc.lang && sc.lang !== LANG){ LANG = sc.lang; applyLang(); await renderHome(); }
    await applyScenario(sc);
  }catch(e){ console.error(e); toast(t('badCode')); }
}
window.addEventListener('hashchange', () => { if(/^#s=/.test(location.hash) && INDEX) bootFromHash(); });

// ---------- texts ----------
function plain(html){ const d = document.createElement('div'); d.innerHTML = html; return d.textContent.replace(/\s+/g, ' ').trim(); }
function seatOrder(){ return U.map((g, k) => k).sort((a, b) => RES.counts[b] - RES.counts[a] || RES.T[b] - RES.T[a]).filter(k => RES.counts[k] > 0); }
function flipCount(){ return RES.win.reduce((a, w, i) => a + (w !== E.baseWin[i] ? 1 : 0), 0); }
function whatsappText(){
  const ent = entry(), ord = seatOrder().slice(0, 6), maj = Math.floor(E.N / 2) + 1;
  const lines = ord.map(k => { const d = RES.counts[k] - U[k].baseSeats; return `${shortName(U[k])} ${RES.counts[k]}${d ? ' (' + (d > 0 ? '+' : '') + d + ')' : ''}`; });
  return [t('waHead', {title: $('#title').textContent}), plain($('#verdict').innerHTML), '', lines.join('\n'), '', t('needed', {n: maj}) + ' · ' + t('waFlips', {f: flipCount(), n: E.seats.length, y: ent.label}), t('waSim'), shareURL()].join('\n');
}
const twLen = p => p.replace(/https?:\/\/\S+/g, 'x'.repeat(23)).length;
function threadPosts(){
  const ent = entry(), ord = seatOrder(), posts = [];
  posts.push(t('twHead', {title: $('#title').textContent, verdict: plain($('#verdict').innerHTML)}));
  posts.push(t('twSeats', {y: ent.label}) + '\n' + ord.slice(0, 6).map(k => { const d = RES.counts[k] - U[k].baseSeats; return `${shortName(U[k])}: ${U[k].baseSeats} → ${RES.counts[k]}${d ? ' (' + (d > 0 ? '+' : '') + d + ')' : ''}`; }).join('\n'));
  if(E.regions.length){
    const agg = E.regions.map(() => ({d: new Map(), tot: 0}));
    E.seats.forEach((s, i) => { if(s.r < 0) return; const a = agg[s.r]; const w = RES.win[i], b = E.baseWin[i]; if(w !== b){ a.d.set(w, (a.d.get(w) || 0) + 1); a.d.set(b, (a.d.get(b) || 0) - 1); a.tot++; } });
    const top = agg.map((a, r) => ({r, a})).filter(x => x.a.tot > 0).sort((x, y) => y.a.tot - x.a.tot).slice(0, 4);
    if(top.length) posts.push(t('twRegions', {w: t(S.kind === 'LS' ? 'states2' : 'districts2')}) + '\n' + top.map(x => stName(E.regions[x.r]) + ': ' + [...x.a.d.entries()].filter(e => e[1]).sort((p, q) => q[1] - p[1]).slice(0, 3).map(([k, v]) => `${shortName(U[k])} ${v > 0 ? '+' : ''}${v}`).join(', ')).join('\n'));
  }
  const close = RES.win.map((w, i) => ({w, i})).filter(o => o.w !== E.baseWin[o.i]).map(o => ({i: o.i, m: 100 * (RES.shares[o.i][o.w] - RES.shares[o.i][RES.second[o.i]]), w: o.w})).sort((a, b) => a.m - b.m).slice(0, 5);
  if(close.length) posts.push(t('twClose') + '\n' + close.map(c => `${E.seats[c.i].name}: ` + t('twBeat', {a: shortName(U[c.w]), b: shortName(U[RES.second[c.i]]), m: fmt1(c.m)})).join('\n'));
  posts.push(t('twLink', {url: shareURL()}));
  const n = posts.length;
  return posts.map((p, i) => (n > 1 ? `${i + 1}/${n} ` : '') + p).map(p => twLen(p) > 280 ? p.slice(0, 277) + '…' : p);
}

// ---------- image ----------
function mapImage(){
  return new Promise(res => {
    const svg = $('#map svg'); if(!svg || !svg.querySelector('path.seat')) return res(null);
    const c = svg.cloneNode(true), vb = svg.viewBox.baseVal;
    c.setAttribute('xmlns', 'http://www.w3.org/2000/svg'); c.setAttribute('width', vb.width * 2); c.setAttribute('height', vb.height * 2);
    c.querySelectorAll('title').forEach(x => x.remove());
    c.querySelectorAll('path.seat').forEach(p => { const f = p.style.fill; if(f) p.setAttribute('fill', f); p.removeAttribute('style'); p.setAttribute('stroke', '#fff'); p.setAttribute('stroke-width', '.4'); p.removeAttribute('class'); });
    c.querySelectorAll('path.st').forEach(p => { p.setAttribute('fill', 'none'); p.setAttribute('stroke', '#141414'); p.setAttribute('stroke-opacity', '.35'); p.setAttribute('stroke-width', '.6'); });
    const src = new XMLSerializer().serializeToString(c).replace(/var\(--sunk\)/g, '#F2F3F5');
    const img = new Image(); img.onload = () => res(img); img.onerror = () => res(null);
    img.src = URL.createObjectURL(new Blob([src], {type: 'image/svg+xml'}));
  });
}
function wrapText(g, text, x, y, maxW, lh, maxLines){
  const words = text.split(' '); let line = '', n = 0;
  for(const w of words){ const test = line ? line + ' ' + w : w;
    if(g.measureText(test).width > maxW && line){ g.fillText(line, x, y); y += lh; line = w; if(++n >= maxLines - 1) { break; } } else line = test; }
  g.fillText(line, x, y); return y + lh;
}
async function composeImage(fmt){
  const wide = fmt !== 'story', W = wide ? 1200 : 1080, H = wide ? 675 : 1920;
  const c = document.createElement('canvas'); c.width = W; c.height = H;
  const g = c.getContext('2d'), cs = getComputedStyle(document.documentElement), col = n => cs.getPropertyValue(n).trim() || '#000';
  try{ await Promise.all(['800 40px "Anek Latin"', '600 24px "Hind"', '700 30px "Anek Devanagari"'].map(f => document.fonts.load(f, 'Aअ'))); }catch(e){}
  const maj = Math.floor(E.N / 2) + 1, ord = seatOrder().slice(0, wide ? 6 : 8), pad = wide ? 48 : 56;
  g.fillStyle = '#fff'; g.fillRect(0, 0, W, H);
  g.fillStyle = col('--violet'); g.fillRect(0, 0, wide ? 10 : 14, H);
  g.textBaseline = 'alphabetic';
  g.fillStyle = col('--violet'); g.font = `800 ${wide ? 21 : 30}px "Anek Latin","Anek Devanagari", system-ui`; g.fillText('JANADESH  जनादेश', pad, wide ? 30 : 56);
  g.font = `500 ${wide ? 18 : 26}px "Hind", system-ui`; g.fillStyle = col('--muted'); g.textAlign = 'right'; g.fillText('janadesh-smoky.vercel.app', W - pad, wide ? 30 : 56); g.textAlign = 'left';
  g.fillStyle = col('--ink'); g.font = `700 ${wide ? 40 : 66}px "Anek Latin","Anek Devanagari", system-ui`;
  let y = wide ? 78 : 150; g.fillText($('#title').textContent, pad, y);
  g.font = `500 ${wide ? 22 : 34}px "Hind", system-ui`; g.fillStyle = col('--muted');
  y = wrapText(g, $('#verdict').textContent, pad, y + (wide ? 34 : 56), W - 2 * pad, wide ? 28 : 44, 2);
  // hemicycle
  const hemi = $('#hemi svg'), sc = wide ? 1.04 : (W - 2 * pad) / 520, hx = wide ? pad : pad, hy = wide ? 128 : y + 10;
  hemi.querySelectorAll('circle').forEach(ci => { g.fillStyle = ci.getAttribute('fill'); g.beginPath(); g.arc(hx + (+ci.getAttribute('cx')) * sc, hy + (+ci.getAttribute('cy')) * sc, (+ci.getAttribute('r')) * sc, 0, Math.PI * 2); g.fill(); });
  g.textAlign = 'center'; g.fillStyle = col('--ink'); g.font = `800 ${wide ? 64 : 120}px "Anek Latin", system-ui`; g.fillText(String(RES.counts[ord[0]]), hx + 260 * sc, hy + 272 * sc);
  g.font = `500 ${wide ? 15 : 26}px "Hind", system-ui`; g.fillStyle = col('--muted'); g.fillText(t('needed', {n: maj}), hx + 260 * sc, hy + 272 * sc - (wide ? 70 : 128)); g.textAlign = 'left';
  const hemiBottom = hy + 290 * sc;
  // tally
  const rowH = wide ? 36 : 58, cols = wide ? 2 : 1, tx = pad, tw = wide ? 280 : W - 2 * pad;
  ord.forEach((k, j) => {
    const cx = tx + (wide ? Math.floor(j / 3) * (tw + 16) : 0), cy = (wide ? hemiBottom + 34 : hemiBottom + 40) + (wide ? j % 3 : j) * rowH;
    g.fillStyle = U[k].hex; g.fillRect(cx, cy - (wide ? 18 : 30), wide ? 18 : 30, wide ? 18 : 30);
    g.fillStyle = col('--ink'); g.font = `600 ${wide ? 22 : 36}px "Hind", system-ui`; g.fillText(shortName(U[k]).slice(0, 18), cx + (wide ? 28 : 46), cy);
    const d = RES.counts[k] - U[k].baseSeats, right = cx + (wide ? tw - 8 : tw);
    g.textAlign = 'right'; g.font = `800 ${wide ? 24 : 40}px "Anek Latin", system-ui`; g.fillText(String(RES.counts[k]), right - (d ? (wide ? 56 : 110) : 0), cy);
    if(d){ g.font = `600 ${wide ? 18 : 30}px "Hind", system-ui`; g.fillStyle = d > 0 ? col('--good') : col('--bad'); g.fillText((d > 0 ? '+' : '') + d, right, cy); }
    g.textAlign = 'left';
  });
  const tallyBottom = (wide ? hemiBottom + 34 + 3 * rowH : hemiBottom + 40 + ord.length * rowH);
  // map (or seat grid where there is no map)
  const bx = wide ? 640 : pad, by = wide ? 112 : tallyBottom + 20, bw = wide ? W - 640 - pad : W - 2 * pad, bh = wide ? 500 : H - by - 110;
  const img = await mapImage();
  if(img){ const r = Math.min(bw / img.width, bh / img.height); g.drawImage(img, bx + (bw - img.width * r) / 2, by + (bh - img.height * r) / 2, img.width * r, img.height * r); }
  else { const n = E.seats.length, cell = Math.floor(Math.sqrt(bw * bh / n)), per = Math.floor(bw / cell);
    E.seats.forEach((s, i) => { g.fillStyle = U[RES.win[i]].hex; g.fillRect(bx + (i % per) * cell, by + Math.floor(i / per) * cell, cell - 2, cell - 2); }); }
  g.fillStyle = col('--warn'); g.font = `600 ${wide ? 18 : 26}px "Hind", system-ui`; g.fillText(t('imgFoot', {m: maj}), pad, H - (wide ? 24 : 40));
  return c;
}
let imgFmt = 'wide';
async function makeImage(fmt){
  imgFmt = typeof fmt === 'string' ? fmt : imgFmt;
  modal(`<h3>${esc(t('imgTitle'))}</h3><p class="small">${esc(t('imgBusy'))}</p>`);
  const c = await composeImage(imgFmt), url = c.toDataURL('image/png');
  const blob = await new Promise(r => c.toBlob(r, 'image/png')), file = new File([blob], 'janadesh.png', {type: 'image/png'});
  const canShareFile = navigator.canShare && navigator.canShare({files: [file]}), canCopy = navigator.clipboard && window.ClipboardItem;
  modal(`<h3>${esc(t('imgTitle'))}</h3>
    <div class="row" style="margin-bottom:8px"><div class="seg" role="group" aria-label="Format"><button data-f="wide" aria-pressed="${imgFmt==='wide'}">${esc(t('fmtWide'))}</button><button data-f="story" aria-pressed="${imgFmt==='story'}">${esc(t('fmtStory'))}</button></div></div>
    <img src="${url}" alt="${esc(t('imgTitle'))}" style="width:100%;max-height:60vh;object-fit:contain;border:1px solid var(--line);border-radius:8px">
    <div class="row" style="margin-top:8px"><a class="btn primary" href="${url}" download="janadesh.png">${esc(t('downloadPng'))}</a>${canCopy ? `<button class="btn" id="imgCopy">${esc(t('copyImage'))}</button>` : ''}${canShareFile ? `<button class="btn" id="imgShare">${esc(t('shareNative'))}</button>` : ''}<button class="btn" data-close>${esc(t('close'))}</button></div>`);
  document.querySelectorAll('#modalRoot [data-f]').forEach(b => b.onclick = () => makeImage(b.dataset.f));
  const cp = $('#imgCopy'); if(cp) cp.onclick = async () => { try{ await navigator.clipboard.write([new ClipboardItem({'image/png': blob})]); toast(t('imageCopied')); }catch(e){ toast(t('copyBlocked')); } };
  const sh = $('#imgShare'); if(sh) sh.onclick = () => navigator.share({files: [file], title: $('#title').textContent, text: plain($('#verdict').innerHTML) + ' ' + shareURL()}).catch(() => {});
}

// ---------- share menu ----------
const SHARE_ACTIONS = [];
function openShare(){
  const url = shareURL();
  const acts = [
    {k: 'copyLink', run: () => copy(url, t('linkCopied'))},
    ...(navigator.share ? [{k: 'shareNative', run: () => navigator.share({title: $('#title').textContent, text: plain($('#verdict').innerHTML), url}).catch(() => {})}] : []),
    {k: 'shareWA', run: () => window.open('https://wa.me/?text=' + encodeURIComponent(whatsappText()), '_blank', 'noopener')},
    {k: 'shareTW', run: () => window.open('https://twitter.com/intent/tweet?text=' + encodeURIComponent($('#title').textContent + ': ' + plain($('#verdict').innerHTML)) + '&url=' + encodeURIComponent(url), '_blank', 'noopener')},
    {k: 'shareImg', run: () => makeImage()},
    {k: 'shareWAtext', run: () => copy(whatsappText(), t('waCopied'))},
    {k: 'shareThread', run: () => copy(threadPosts().join('\n\n'), t('threadCopied'))},
    ...SHARE_ACTIONS,
  ];
  modal(`<h3>${esc(t('shareTitle'))}</h3><p class="small">${esc(t('shareHint'))}</p>
    <input class="inp" id="shareUrl" readonly value="${esc(url)}" aria-label="${esc(t('copyLink'))}" style="width:100%;margin:6px 0 10px">
    <div class="row" id="shareActs">${acts.map((a, i) => `<button class="btn" data-a="${i}">${esc(t(a.k))}</button>`).join('')}</div>
    <div class="row" style="margin-top:10px"><button class="btn small" data-close>${esc(t('close'))}</button></div>`);
  document.querySelectorAll('#shareActs [data-a]').forEach(b => b.onclick = () => acts[+b.dataset.a].run());
  $('#shareUrl').onfocus = e => e.target.select();
}
$('#shareBtn').onclick = openShare;
