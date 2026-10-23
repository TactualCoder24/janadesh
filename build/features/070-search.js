// Search any constituency (or MP / MLA by name) and open its history page: #/seat/<ls|ae>/<state>/<seat>.
addI18n('en', {
  search: 'Search', searchTitle: 'Find a constituency or MP / MLA', searchPh: 'Seat or member name, e.g. Varanasi or Shalimar Bagh', searchNone: 'No match. Try the first few letters of the seat name.', searchLoading: 'Loading the index…',
  searchMore: 'Showing the first {n} matches. Type more to narrow down.', lokSabhaSeat: 'Lok Sabha', assemblySeat: 'Assembly', seatPage: 'Seat history', seatBack: 'Back', seatHistory: 'Every election in the data', seatSim: 'Simulate this {w}',
  seatShareLink: 'Copy link to this seat', seatMatched: 'Seats are matched by name across elections, so a redrawn or renamed seat may show a shorter history.', seatNotFound: 'We could not find this seat.', seatShare: 'Vote share by party',
  thWinnerN: 'Winner', thRunnerN: 'Runner-up', thVotesN: 'Votes', seatCat: 'Reserved: {c}', homeSearch: 'Find your constituency', homeSearchSub: 'Search any seat or member since 1951 and see how it has voted.', inSeat: 'Seat',
});
addI18n('hi', {
  search: 'खोजें', searchTitle: 'चुनाव क्षेत्र या सांसद / विधायक खोजें', searchPh: 'सीट या सदस्य का नाम, जैसे वाराणसी या शालीमार बाग', searchNone: 'कोई मेल नहीं मिला। सीट के नाम के पहले कुछ अक्षर लिखकर देखें।', searchLoading: 'सूची खुल रही है…',
  searchMore: 'पहले {n} नतीजे दिखाए गए हैं। सीमित करने के लिए और लिखें।', lokSabhaSeat: 'लोकसभा', assemblySeat: 'विधानसभा', seatPage: 'सीट का इतिहास', seatBack: 'वापस', seatHistory: 'आँकड़ों का हर चुनाव', seatSim: 'इस {w} का सिम्युलेशन करें',
  seatShareLink: 'इस सीट का लिंक कॉपी करें', seatMatched: 'सीटें चुनावों में नाम से मिलाई गई हैं, इसलिए नए सिरे से बनी या नाम बदली सीट का इतिहास छोटा दिख सकता है।', seatNotFound: 'यह सीट नहीं मिली।', seatShare: 'दलों का वोट हिस्सा',
  thWinnerN: 'विजेता', thRunnerN: 'उपविजेता', thVotesN: 'वोट', seatCat: 'आरक्षित: {c}', homeSearch: 'अपना चुनाव क्षेत्र खोजें', homeSearchSub: '1951 से अब तक कोई भी सीट या सदस्य खोजें और देखें उसने कैसे वोट किया।', inSeat: 'सीट',
});
const slugify = s => String(s).toLowerCase().replace(/&/g, 'and').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
let SEARCH = null;
async function searchIndex(){ if(!SEARCH) SEARCH = await getJSON('data/search.json'); return SEARCH; }
const NAMES = {};
async function namesFor(file){ if(NAMES[file] === undefined){ try{ NAMES[file] = await getJSON('names/' + file + '.json'); }catch(e){ NAMES[file] = null; } } return NAMES[file]; }
// index item: [name, state, kind('LS'|'AE'), latestLabel, latestParty, winnerNames]
function searchMatch(items, q){
  const nq = nameKey(q); if(!nq) return [];
  const out = [];
  for(const it of items){
    const n = nameKey(it[0]); let sc = 0;
    if(n === nq) sc = 100; else if(n.startsWith(nq)) sc = 80; else if(n.includes(nq)) sc = 60;
    else if(it[5] && nameKey(it[5]).includes(nq)) sc = 40; else if(nameKey(it[1]).includes(nq)) sc = 10;
    if(sc) out.push([sc + (it[2] === 'LS' ? 3 : 0), it]);
  }
  return out.sort((a, b) => b[0] - a[0] || a[1][0].localeCompare(b[1][0])).map(x => x[1]);
}
function seatHash(it){ return `#/seat/${it[2].toLowerCase()}/${slugify(it[1])}/${slugify(it[0])}`; }
function openSearch(initial){
  modal(`<h3>${esc(t('searchTitle'))}</h3><input class="inp" id="gq" type="search" autocomplete="off" placeholder="${esc(t('searchPh'))}" aria-label="${esc(t('searchTitle'))}" style="width:100%;margin:6px 0 8px">
    <div id="gres" class="seatlist" style="max-height:52vh"><p class="small" style="padding:8px">${esc(t('searchLoading'))}</p></div>
    <div class="row" style="margin-top:8px"><button class="btn small" data-close>${esc(t('close'))}</button></div>`);
  const inp = $('#gq'), res = $('#gres'); if(initial) inp.value = initial; inp.focus();
  const paint = async () => {
    const items = await searchIndex(), q = inp.value.trim(); if(!q){ res.innerHTML = ''; return; }
    const m = searchMatch(items, q), shown = m.slice(0, 40);
    res.innerHTML = shown.length ? `<table class="tbl"><tbody>${shown.map((it, i) => `<tr class="click" data-i="${i}"><td><b>${esc(it[0])}</b><div class="small">${esc(t(it[2] === 'LS' ? 'lokSabhaSeat' : 'assemblySeat'))} · ${esc(stName(it[1]))}</div></td>
      <td style="text-align:right">${it[4] ? `<span class="pname" style="justify-content:flex-end"><i class="sw" style="background:${pColor(it[4])}"></i><span>${esc(pName(it[4]))}</span></span><div class="small">${esc(it[3])}</div>` : ''}</td></tr>`).join('')}</tbody></table>${m.length > 40 ? `<p class="small" style="padding:6px 8px">${esc(t('searchMore', {n: 40}))}</p>` : ''}` : `<p class="small" style="padding:8px">${esc(t('searchNone'))}</p>`;
    res.querySelectorAll('tr[data-i]').forEach(tr => tr.onclick = () => { const it = shown[+tr.dataset.i]; $('#modalRoot').innerHTML = ''; location.hash = seatHash(it); });
  };
  let tm; inp.oninput = () => { clearTimeout(tm); tm = setTimeout(paint, 90); };
  if(initial) paint();
}
function showSeatView(){ $('#pageview').hidden = true; $('#home').hidden = true; $('#app').hidden = true; $('#appPick').hidden = true; $('#tabbar').hidden = true; closeSheet(); $('#homeBtn').hidden = false; $('#seatview').hidden = false; document.body.classList.remove('inapp'); window.scrollTo(0, 0); }
async function openSeatPage(kind, stateSlug, seatSlug){
  showSeatView();
  const box = $('#seatview'); box.innerHTML = `<span class="loading"><i></i>${esc(t('loading'))}</span>`;
  const items = await searchIndex();
  const it = items.find(x => x[2].toLowerCase() === kind && slugify(x[1]) === stateSlug && slugify(x[0]) === seatSlug);
  if(!it){ box.innerHTML = `<p>${esc(t('seatNotFound'))}</p><button class="btn" id="sbk">${esc(t('seatBack'))}</button>`; $('#sbk').onclick = () => { location.hash = ''; }; return; }
  const file = kind === 'ls' ? 'ls' : INDEX.elections.find(e => e.kind === 'AE' && e.state === it[1]).file;
  const list = (await bundle(file)).slice().sort((a, b) => a.year - b.year || a.label.localeCompare(b.label)), names = await namesFor(file);
  const want = nameKey(it[0]), rows = [];
  list.forEach(e => { const idx = e.seats.findIndex(s => nameKey(s[1]) === want && (kind === 'ae' || (e.regions[s[3]] || '') === it[1])); if(idx < 0) return;
    const s = e.seats[idx], r = ranked(e, s), tot = seatTotal(s), nm = names && names[e.id] ? names[e.id][idx] : null;
    rows.push({e, s, r, tot, nm, idx}); });
  rows.reverse();
  const cat = rows.length ? rows[0].s[2] : 'GEN', ent = INDEX.elections.filter(e => kind === 'ls' ? e.kind === 'LS' : e.kind === 'AE' && e.state === it[1]).sort((a, b) => b.year - a.year || b.label.localeCompare(a.label))[0];
  // chart: vote share by party across the years
  const asc = rows.slice().reverse(), tops = {};
  asc.forEach(o => o.r.forEach(([p, v]) => { if(!SKIP_P.has(p)) tops[p] = Math.max(tops[p] || 0, v / o.tot); }));
  const keep = Object.entries(tops).sort((a, b) => b[1] - a[1]).slice(0, 5).map(x => x[0]);
  const W = 760, H = 220, m = {l: 36, r: 90, t: 10, b: 26}, xs = asc.map((o, i) => m.l + (asc.length > 1 ? i * (W - m.l - m.r) / (asc.length - 1) : (W - m.l - m.r) / 2));
  const ymax = Math.min(100, Math.ceil(Math.max(...keep.map(p => Math.max(...asc.map(o => 100 * (o.r.find(x => x[0] === p) || [0, 0])[1] / o.tot)))) / 10) * 10 || 50), y = v => H - m.b - (H - m.b - m.t) * v / ymax;
  let g = [0, ymax / 2, ymax].map(v => `<line x1="${m.l}" x2="${W - m.r}" y1="${y(v)}" y2="${y(v)}" stroke="var(--line)"/>${svgText(m.l - 6, y(v) + 4, v + '%', {anchor: 'end', size: 11})}`).join('');
  const ends = [];
  keep.forEach(p => { const pts = asc.map((o, i) => [xs[i], y(100 * (o.r.find(x => x[0] === p) || [0, 0])[1] / o.tot)]);
    g += `<path d="${pts.map((q, i) => (i ? 'L' : 'M') + q[0] + ',' + q[1]).join('')}" fill="none" stroke="${pColor(p)}" stroke-width="2.2"/>` + pts.map(q => `<circle cx="${q[0]}" cy="${q[1]}" r="2.8" fill="${pColor(p)}"/>`).join('');
    ends.push({p, x: pts[pts.length - 1][0], y: pts[pts.length - 1][1]}); });
  ends.sort((a2, b2) => a2.y - b2.y); ends.forEach((o, i, arr) => { if(i && o.y - arr[i - 1].y < 13) o.y = arr[i - 1].y + 13; });
  for(let i = ends.length - 1; i >= 0; i--){ const lim = H - m.b - (ends.length - 1 - i) * 13; if(ends[i].y > lim) ends[i].y = lim; }
  ends.forEach(o => { g += svgText(o.x + 8, o.y + 4, LANG === 'hi' && HI_PARTY[o.p] ? HI_PARTY[o.p] : o.p, {fill: pColor(o.p), size: 12, weight: 700}); });
  const step = Math.ceil(asc.length / 12); asc.forEach((o, i) => { if(i % step === 0 || i === asc.length - 1) g += svgText(xs[i], H - 8, o.e.label, {anchor: 'middle', size: 10.5}); });
  const link = location.origin + location.pathname + seatHash(it);
  const cand = (e, nm, i, p) => { const n = nm ? nm[i] : null; return `<div>${n ? `<b>${esc(n)}</b>` : ''}<div class="small">${p ? `<span class="pname"><i class="sw" style="background:${pColor(p)}"></i><span>${esc(pName(p))}</span></span>` : ''}</div></div>`; };
  box.innerHTML = `<div class="row" style="margin:6px 0 10px"><button class="btn small" id="sbk">← ${esc(t('seatBack'))}</button></div>
    <div class="headline"><h2 style="font-size:34px">${esc(it[0])}</h2><span class="tag">${esc(t(kind === 'ls' ? 'lokSabhaSeat' : 'assemblySeat'))}</span><span class="tag">${esc(stName(it[1]))}</span>${cat !== 'GEN' ? `<span class="tag">${esc(t('seatCat', {c: cat}))}</span>` : ''}</div>
    ${rows.length && rows[rows.length - 1].e.label !== list[0].label ? `<p class="small" style="margin:6px 0 0">${esc(t('seatNewSince', {y: rows[rows.length - 1].e.label}))}</p>` : ''}
    <div class="row" style="margin:8px 0 14px"><button class="btn primary" id="sSim">${esc(t('seatSim', {w: t(kind === 'ls' ? 'lokSabhaSeat' : 'assemblySeat')}))}</button><button class="btn" id="sLink">${esc(t('seatShareLink'))}</button></div>
    ${rows.length > 1 ? `<section class="card"><h3 style="font-size:17px">${esc(t('seatShare'))}</h3><div class="tw"><svg viewBox="0 0 ${W} ${H}" style="min-width:520px" role="img" aria-label="${esc(t('seatShare'))}">${g}</svg></div></section>` : ''}
    <section class="card"><h3 style="font-size:17px">${esc(t('seatHistory'))}</h3><div class="tw"><table class="tbl"><thead><tr><th>${esc(t('thYear'))}</th><th style="text-align:left">${esc(t('thWinnerN'))}</th><th>${esc(t('thVotesN'))}</th><th>${esc(t('thMargin'))}</th><th style="text-align:left">${esc(t('thRunnerN'))}</th></tr></thead><tbody>
      ${rows.map(o => { const w = o.r[0], u = o.r[1], mg = u ? w[1] - u[1] : w[1]; return `<tr><td><b>${esc(o.e.label)}</b></td><td style="text-align:left">${w ? cand(o.e, o.nm, 0, w[0]) : ''}</td><td class="num">${w ? fmtN(w[1]) : ''}<div class="small">${o.tot ? fmt1(100 * w[1] / o.tot) + '%' : ''}</div></td><td class="num">${fmtN(mg)}<div class="small">${o.tot ? fmt1(100 * mg / o.tot) + '%' : ''}</div></td><td style="text-align:left">${u ? cand(o.e, o.nm, 1, u[0]) : ''}</td></tr>`; }).join('')}</tbody></table></div>
      <p class="small">${esc(t('seatMatched'))}</p></section>`;
  $('#sbk').onclick = () => { if(history.length > 1) history.back(); else location.hash = ''; };
  $('#sLink').onclick = () => copy(link, t('linkCopied'));
  $('#sSim').onclick = async () => { location.hash = ''; S.tab = 'easy'; if(kind === 'ls') await openSim('LS', null, 'next:' + ent.id); else await openSim('AE', it[1], 'next:' + ent.id, true);
    const i = E.seats.findIndex(s => nameKey(s.name) === want); if(i >= 0) selectSeat(i); };
  document.title = `${it[0]} (${t(kind === 'ls' ? 'lokSabhaSeat' : 'assemblySeat')}, ${stName(it[1])}) | Janadesh`;
}
async function route(){
  const h = location.hash;
  if(await routePages(h)) return;
  const m = h.match(/^#\/seat\/(ls|ae)\/([^/]+)\/([^/]+)$/);
  if(m){ await openSeatPage(m[1], m[2], m[3]); return; }
  document.title = 'Janadesh';
  if(!$('#seatview').hidden || !$('#pageview').hidden){ $('#seatview').hidden = true; $('#pageview').hidden = true; showHome(); }
}
window.addEventListener('hashchange', () => { if(INDEX) route(); });

// ---------- names on seats ----------
addI18n('en', {wonSeat: 'won', runnerUp: 'runner-up', genderF: 'woman', genderM: 'man', ageN: 'age {n}'});
addI18n('hi', {wonSeat: 'विजयी', runnerUp: 'उपविजेता', genderF: 'महिला', genderM: 'पुरुष', ageN: 'उम्र {n}'});
function loadNames(){
  const file = entry().file, id = S.eid;
  namesFor(file).then(n => { if(E && E.raw && E.raw.id === id){ E.names = (n && n[id]) || null; if(S.sel != null) drawDetail(); } });
}
function nameLines(i){
  const n = E.names && E.names[i]; if(!n) return '';
  const [w, r, sx, age] = n, bits = [sx === 'F' ? t('genderF') : sx === 'M' ? t('genderM') : '', age ? t('ageN', {n: age}) : ''].filter(Boolean).join(', ');
  return `<p style="margin:0 0 6px;font-size:14px"><b>${esc(w)}</b> <span class="small">${esc(t('wonSeat'))}${bits ? ' · ' + esc(bits) : ''}</span>${r ? `<br>${esc(r)} <span class="small">${esc(t('runnerUp'))}</span>` : ''}</p>`;
}
