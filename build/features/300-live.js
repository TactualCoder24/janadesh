// Live counting mode (#34), page #/live. On results day you type in the party totals or declare seat by seat, and the page fills the seat arc and compares with
// your locked prediction, the exit polls and any benchmark you type. There is no results feed, so nothing here is automatic; a replay of a past count shows how it looks.
addI18n('en', {
  footLive: 'Live counting', lvTitle: 'Live counting', lvSub: 'On counting day, enter what the Election Commission shows and watch the seat arc fill up. Compare the count so far with your locked prediction, the exit polls or any numbers you type. Or replay a past count to see how it looks.',
  lvNote: 'Nothing here comes from a live feed: you type the numbers, so they are only as good as what you copy. Seats and parties start from the last election in that house, so a new party or a changed map will not appear until you rename a row or use "Others".',
  lvWhere: 'House', lvWhen: 'Election', lvNext: 'Next election (counting day)', lvReplay: 'Replay of {y}', lvMode: 'Count as', lvAlly: 'Alliances', lvParty: 'Parties', lvEntry: 'Enter', lvTotals: 'Party totals', lvSeats: 'Seat by seat',
  lvDecl: '{n} of {m} seats declared', lvMaj: '{n} to win', lvLeads: '{a} leads with {n}', lvNone: 'No seat declared yet', lvOver: 'The totals add up to more than {n} seats', lvWon: 'Won or leading', lvBench: 'Compare with', lvDelta: 'Counted minus {b}',
  lvPlay: 'Play', lvPause: 'Pause', lvReset: 'Start over', lvSpeed: 'Speed', lvClear: 'Clear all', lvFilter: 'Find a seat', lvNotYet: 'not declared', lvShow: 'Showing {n} of {m} seats', lvAnyR: 'All',
  lvAddBench: 'Add a benchmark', lvBenchHint: 'One per line, for example "Axis poll: NDA 305, INDIA 190". Names can be a party code or an alliance.', lvBenchAdd: 'Add', lvBenchBad: 'Could not read any numbers from that line', lvBenchUnk: 'Not recognised: {n}',
  lvMine: 'My prediction', lvFriend: 'Friend\'s prediction', lvPoll: 'Exit poll: {n}', lvCopy: 'Copy update', lvCopied: 'Update copied', lvImg: 'Live count', lvText: '🗳️ Counting update, {t}: {a}. {d} of {m} declared, {w} to win.', lvStart: 'Start counting', lvOthers: 'Others',
  lvRem: 'Remove', lvMore: '{n} more', lvDeclaredBy: 'Declared', lvStepUp: 'One more seat for {p}', lvStepDown: 'One fewer seat for {p}', lvNoBench: 'No benchmark yet. Add one, or lock a prediction.', lvCardFoot: 'Numbers entered by hand, not an official result.',
});
addI18n('hi', {
  footLive: 'लाइव गिनती', lvTitle: 'लाइव गिनती', lvSub: 'गिनती के दिन चुनाव आयोग जो दिखाए उसे दर्ज करें और सीटों का अर्धवृत्त भरते देखें। अब तक की गिनती की तुलना अपनी पक्की भविष्यवाणी, एग्ज़िट पोल या अपने डाले आँकड़ों से करें। या किसी पुरानी गिनती को दोबारा चलाकर देखें।',
  lvNote: 'यहाँ कुछ भी लाइव फ़ीड से नहीं आता: आँकड़े आप डालते हैं, इसलिए वे उतने ही सही हैं जितना आपने उतारा। सीटें और दल उस सदन के पिछले चुनाव से शुरू होते हैं, इसलिए नया दल या बदला नक्शा तब तक नहीं दिखेगा जब तक आप किसी पंक्ति का नाम न बदलें या "अन्य" न इस्तेमाल करें।',
  lvWhere: 'सदन', lvWhen: 'चुनाव', lvNext: 'अगला चुनाव (गिनती का दिन)', lvReplay: '{y} की गिनती दोबारा', lvMode: 'ऐसे गिनें', lvAlly: 'गठबंधन', lvParty: 'दल', lvEntry: 'दर्ज करें', lvTotals: 'दलों का योग', lvSeats: 'सीट दर सीट',
  lvDecl: '{m} में से {n} सीटों के नतीजे आए', lvMaj: 'जीतने को {n}', lvLeads: '{a} {n} पर आगे', lvNone: 'अभी कोई सीट घोषित नहीं', lvOver: 'योग {n} सीटों से ज़्यादा है', lvWon: 'जीते या आगे', lvBench: 'तुलना करें', lvDelta: 'गिनती घटा {b}',
  lvPlay: 'चलाएँ', lvPause: 'रोकें', lvReset: 'फिर से शुरू', lvSpeed: 'रफ़्तार', lvClear: 'सब मिटाएँ', lvFilter: 'कोई सीट खोजें', lvNotYet: 'घोषित नहीं', lvShow: '{m} में से {n} सीटें दिख रही हैं', lvAnyR: 'सभी',
  lvAddBench: 'तुलना का आँकड़ा जोड़ें', lvBenchHint: 'हर पंक्ति में एक, जैसे "Axis poll: NDA 305, INDIA 190"। नाम दल का कोड या गठबंधन हो सकता है।', lvBenchAdd: 'जोड़ें', lvBenchBad: 'उस पंक्ति से कोई आँकड़ा पढ़ा नहीं जा सका', lvBenchUnk: 'पहचाना नहीं: {n}',
  lvMine: 'मेरी भविष्यवाणी', lvFriend: 'दोस्त की भविष्यवाणी', lvPoll: 'एग्ज़िट पोल: {n}', lvCopy: 'अपडेट कॉपी करें', lvCopied: 'अपडेट कॉपी हो गया', lvImg: 'लाइव गिनती', lvText: '🗳️ गिनती का अपडेट, {t}: {a}। {m} में से {d} के नतीजे आए, जीतने को {w}।', lvStart: 'गिनती शुरू करें', lvOthers: 'अन्य',
  lvRem: 'हटाएँ', lvMore: '{n} और', lvDeclaredBy: 'घोषित', lvStepUp: '{p} की एक और सीट', lvStepDown: '{p} की एक सीट कम', lvNoBench: 'अभी तुलना का कोई आँकड़ा नहीं। एक जोड़ें, या भविष्यवाणी पक्की करें।', lvCardFoot: 'आँकड़े हाथ से दर्ज किए गए, आधिकारिक नतीजा नहीं।',
});
const lvNk = x => String(x).toLowerCase().replace(/[^a-z0-9]/g, '');
// the parties or alliances to count, from the last election of that house
function liveUnits(raw, mode){
  const ally = mode === 'alliance' ? (raw.alliances || {}) : {}, seatsBy = new Map(), voteBy = new Map();
  raw.seats.forEach(s => { if(s[4].length){ const c = raw.parties[s[4][0]]; seatsBy.set(c, (seatsBy.get(c) || 0) + (s[6] || 1)); } for(let k = 0; k < s[4].length; k += 2){ const c = raw.parties[s[4][k]]; voteBy.set(c, (voteBy.get(c) || 0) + s[4][k + 1]); } });
  const keyOf = c => c !== 'OTH' && c !== 'IND' && ally[c] ? 'A:' + ally[c] : c, g = new Map();
  new Set([...seatsBy.keys(), ...voteBy.keys()]).forEach(c => { if(c === 'OTH') return; const k = keyOf(c); if(!g.has(k)) g.set(k, {key: k, seats: 0, votes: 0, lead: c, leadV: -1}); const o = g.get(k); o.seats += seatsBy.get(c) || 0; o.votes += voteBy.get(c) || 0; if((voteBy.get(c) || 0) > o.leadV){ o.leadV = voteBy.get(c) || 0; o.lead = c; } });
  const all = [...g.values()].sort((a, b) => b.seats - a.seats || b.votes - a.votes), keep = all.filter((u, i) => u.seats > 0 || i < 6).slice(0, 14), kept = new Set(keep.map(u => u.key));
  const units = keep.map(u => ({key: u.key, name: u.key.startsWith('A:') ? allyName(u.key.slice(2)) : pName(u.key), hex: pColor(u.lead), base: u.seats}));
  units.push({key: 'OTH', name: t('others'), hex: '#9aa0aa', base: all.filter(u => !kept.has(u.key)).reduce((a, u) => a + u.seats, 0)});
  return {units, unitOf: c => { const k = c === 'OTH' ? 'OTH' : keyOf(c); return kept.has(k) ? k : 'OTH'; }};
}
// read a line such as "Axis poll: NDA 305, INDIA 190" against the units on screen
function liveParseBench(line, units){
  const i = line.indexOf(':'), label = i > 0 ? line.slice(0, i).trim() : '', body = i > 0 ? line.slice(i + 1) : line, seats = {}, bad = [];
  const idx = new Map(); units.forEach(u => { [u.key.replace(/^A:/, ''), u.name, u.key].forEach(a => idx.set(lvNk(a), u.key)); });
  body.split(/[,;]/).forEach(part => { const m = part.trim().match(/^(.+?)\s*[:=]?\s*(\d+)$/); if(!m) { if(part.trim()) bad.push(part.trim()); return; } const k = idx.get(lvNk(m[1])); if(k) seats[k] = (seats[k] || 0) + (+m[2]); else bad.push(m[1].trim()); });
  return {label: label || t('lvAddBench'), seats, bad};
}
PAGES.set('live', async box => {
  const ix = INDEX.elections, cfg = Object.assign({where: 'LS', when: 'next', mode: 'alliance', entry: 'totals'}, store.get('livecfg', {}));
  const wheres = ['LS', ...statesList().sort((a, b) => stName(a).localeCompare(stName(b), LANG === 'hi' ? 'hi' : 'en'))];
  if(!wheres.includes(cfg.where)) cfg.where = 'LS';
  const latestOf = w => w === 'LS' ? ix.filter(e => e.kind === 'LS').sort((a, b) => b.year - a.year)[0] : calLatest(w);
  const pastOf = w => ix.filter(e => w === 'LS' ? e.kind === 'LS' : (e.kind === 'AE' && e.state === w)).sort((a, b) => b.year - a.year || b.label.localeCompare(a.label));
  if(cfg.when !== 'next' && !pastOf(cfg.where).some(e => e.id === cfg.when)) cfg.when = 'next';
  const L = {rp: null};   // L.rp: the replay timer
  box.innerHTML = `<article class="page" style="max-width:1100px"><h2>${esc(t('lvTitle'))}</h2><p class="lede">${esc(t('lvSub'))}</p>
    <div class="tools-row" id="lvPick"></div><div id="lvBody"><span class="loading"><i></i>${esc(t('loading'))}</span></div><p class="small" style="margin-top:16px">${esc(t('lvNote'))}</p></article>`;
  const stopReplay = () => { if(L.rp && L.rp.timer){ clearInterval(L.rp.timer); L.rp.timer = null; } };
  async function go(){
    stopReplay(); store.set('livecfg', cfg);
    const base = cfg.when === 'next' ? latestOf(cfg.where) : ix.find(e => e.id === cfg.when);
    const raw = (await bundle(base.file)).find(e => e.id === base.id), hasAlly = new Set(Object.values(raw.alliances || {})).size >= 2;
    if(cfg.mode === 'alliance' && !hasAlly) cfg.mode = 'party';
    const {units, unitOf} = liveUnits(raw, cfg.mode), N = raw.seats.reduce((a, s) => a + (s[6] || 1), 0), maj = Math.floor(N / 2) + 1;
    const yr = cfg.when === 'next' ? nextYear(base) : base.label, title = base.kind === 'LS' ? t('titleLS', {y: yr}) : t('titleAE', {s: stName(base.state), y: yr});
    const seats = raw.seats.map((s, i) => ({i, no: s[0], name: s[1], region: s[3] >= 0 && raw.regions ? raw.regions[s[3]] || '' : '', m: s[6] || 1, win: s[4].length ? unitOf(raw.parties[s[4][0]]) : null}));
    const skey = `${cfg.where}|${cfg.when}|${cfg.mode}`, saveAll = store.get('livecount', {}), cur = saveAll[skey] || {t: {}, d: {}, b: []};
    const persist = () => { saveAll[skey] = cur; store.set('livecount', saveAll); };
    const showN = 60; let filter = '';
    // benchmarks: my predictions and friends' for this count, exit polls for a past election, and lines the user typed
    const benches = [];
    const polls = await pollData();
    const target = p => { const tg = predTarget(p); return cfg.when === 'next' ? (p.e === base.id && (p.a || 1) === 1) : (tg && tg.id === cfg.when); };
    store.get('preds', []).filter(p => target(p) && p.mode === cfg.mode).forEach(p => { const s = {}; p.u.forEach(u => { if(u[1] > 0) s[u[0]] = u[1]; }); benches.push({id: 'p' + p.id, name: (p.n ? p.n + ': ' : '') + t('lvMine'), seats: s}); });
    store.get('league', []).filter(p => target(p) && p.mode === cfg.mode).forEach((p, i) => { const s = {}; p.u.forEach(u => { if(u[1] > 0) s[u[0]] = u[1]; }); benches.push({id: 'l' + i, name: (p.n || t('prAnon')) + ' · ' + t('lvFriend'), seats: s}); });
    if(cfg.when !== 'next') polls.sets.filter(st => st.id === cfg.when && st.mode === cfg.mode).forEach(st => st.polls.forEach((p, j) => { const s = {}; for(const [label, n] of Object.entries(p.seats)){ const k = st.mode === 'alliance' ? 'A:' + label : st.units[label]; if(units.some(u => u.key === k)) s[k] = (s[k] || 0) + n; } benches.push({id: 'e' + j, name: t('lvPoll', {n: p.by}), seats: s, avg: !!p.avg}); }));
    cur.b.forEach((b, j) => benches.push({id: 'c' + j, name: b.name, seats: b.seats, own: j}));
    const on = new Set(cur.on || benches.filter(b => b.avg).map(b => b.id).concat(benches.filter(b => !b.avg && /^[pl]/.test(b.id)).map(b => b.id)).slice(0, 2));
    if(!on.size && benches.length) on.add(benches[0].id);
    const counts = () => { const c = {}; units.forEach(u => c[u.key] = 0); if(cfg.entry === 'totals') units.forEach(u => c[u.key] = Math.max(0, Math.min(N, Math.round(+cur.t[u.key] || 0)))); else seats.forEach(s => { const k = cur.d[s.i]; if(k && c[k] != null) c[k] += s.m; }); return c; };
    const text = () => { const c = counts(), d = Object.values(c).reduce((a, b) => a + b, 0); return t('lvText', {t: title, a: units.filter(u => c[u.key] > 0).sort((a, b) => c[b.key] - c[a.key]).slice(0, 5).map(u => `${u.name} ${c[u.key]}`).join(', ') || t('lvNone'), d, m: N, w: maj}) + ' ' + location.origin + location.pathname + '#/live'; };

    $('#lvPick').innerHTML = `<label>${esc(t('lvWhere'))} <select id="lvW">${wheres.map(w => `<option value="${esc(w)}" ${w === cfg.where ? 'selected' : ''}>${esc(w === 'LS' ? t('lokSabha') : stName(w) + ' ' + t('vidhanSabha'))}</option>`).join('')}</select></label>
      <label>${esc(t('lvWhen'))} <select id="lvY"><option value="next" ${cfg.when === 'next' ? 'selected' : ''}>${esc(t('lvNext'))}</option>${pastOf(cfg.where).map(e => `<option value="${e.id}" ${cfg.when === e.id ? 'selected' : ''}>${esc(t('lvReplay', {y: e.label}))}</option>`).join('')}</select></label>
      ${hasAlly ? `<span class="small">${esc(t('lvMode'))}</span><div class="seg" role="group" aria-label="${esc(t('lvMode'))}"><button data-md="alliance" aria-pressed="${cfg.mode === 'alliance'}">${esc(t('lvAlly'))}</button><button data-md="party" aria-pressed="${cfg.mode === 'party'}">${esc(t('lvParty'))}</button></div>` : ''}
      <span class="small">${esc(t('lvEntry'))}</span><div class="seg" role="group" aria-label="${esc(t('lvEntry'))}"><button data-en="totals" aria-pressed="${cfg.entry === 'totals'}">${esc(t('lvTotals'))}</button><button data-en="seats" aria-pressed="${cfg.entry === 'seats'}">${esc(t('lvSeats'))}</button></div>`;
    $('#lvW').onchange = e => { cfg.where = e.target.value; cfg.when = 'next'; go(); };
    $('#lvY').onchange = e => { cfg.when = e.target.value; if(cfg.when !== 'next') cfg.entry = 'seats'; go(); };
    box.querySelectorAll('[data-md]').forEach(b => b.onclick = () => { cfg.mode = b.dataset.md; go(); });
    box.querySelectorAll('[data-en]').forEach(b => b.onclick = () => { cfg.entry = b.dataset.en; go(); });

    $('#lvBody').innerHTML = `<div class="tools-cols"><div><h3 id="lvHead" style="font-size:20px;margin:0">${esc(title)}</h3><div id="lvHemi"></div><p id="lvLine" style="font-family:var(--display);font-size:18px;font-weight:600;margin:4px 0"></p><p class="small" id="lvSub" style="margin:0"></p>
        <div class="row" style="margin-top:10px" id="lvAct"></div></div><div><div class="tw"><table class="tbl" id="lvTbl"></table></div><p class="small" id="lvWarn" style="color:var(--bad);margin:4px 0"></p>
        <h4 style="margin:12px 0 4px">${esc(t('lvAddBench'))}</h4><div class="row"><input class="inp" id="lvB" placeholder="Axis poll: ${esc(units[0].key.replace(/^A:/, ''))} 120, ${esc((units[1] || units[0]).key.replace(/^A:/, ''))} 90" aria-label="${esc(t('lvAddBench'))}" style="flex:1;min-width:200px"><button class="btn" id="lvBAdd">${esc(t('lvBenchAdd'))}</button></div><p class="small" style="margin:4px 0">${esc(t('lvBenchHint'))}</p></div></div>
      <div id="lvSeatBox"></div>`;
    function drawTop(){
      const c = counts(), declared = Object.values(c).reduce((a, b) => a + b, 0), order = units.filter(u => c[u.key] > 0).sort((a, b) => c[b.key] - c[a.key]);
      drawHemicycle($('#lvHemi'), order.map(u => ({n: c[u.key], c: u.hex})), N, maj, order[0] ? c[order[0].key] : 0, t('lvMaj', {n: maj}));
      $('#lvLine').textContent = order[0] ? t('lvLeads', {a: order[0].name, n: c[order[0].key]}) : t('lvNone');
      $('#lvSub').textContent = t('lvDecl', {n: declared, m: N});
      $('#lvWarn').textContent = declared > N ? t('lvOver', {n: N}) : '';
      const act = benches.filter(b => on.has(b.id)), head = `<thead><tr><th>${esc(t('thParty'))}</th><th>${esc(t('lvWon'))}</th>${act.map(b => `<th title="${esc(t('lvDelta', {b: b.name}))}">${esc(b.name)}</th>`).join('')}</tr></thead>`;
      $('#lvTbl').innerHTML = head + `<tbody>${units.filter(u => c[u.key] > 0 || u.base > 0 || cfg.entry === 'totals' || act.some(b => b.seats[u.key])).map(u => {
        const inp = cfg.entry === 'totals' ? `<span class="lvstep"><button class="btn small" data-st="${esc(u.key)}" data-d="-1" aria-label="${esc(t('lvStepDown', {p: u.name}))}">−</button><input class="inp" type="number" min="0" max="${N}" value="${c[u.key]}" data-in="${esc(u.key)}" aria-label="${esc(u.name)}"><button class="btn small" data-st="${esc(u.key)}" data-d="1" aria-label="${esc(t('lvStepUp', {p: u.name}))}">+</button></span>` : `<b>${c[u.key]}</b>`;
        return `<tr><td><span class="pname"><i class="sw" style="background:${u.hex}"></i><span>${esc(u.name)}</span></span></td><td class="num">${inp}</td>${act.map(b => { const v = b.seats[u.key] || 0, d = c[u.key] - v; return `<td class="num">${v}<div class="small ${d > 0 ? 'up' : d < 0 ? 'down' : ''}">${d > 0 ? '+' : ''}${d}</div></td>`; }).join('')}</tr>`; }).join('')}</tbody>`;
      alignTables($('#lvTbl'));
      $('#lvTbl').querySelectorAll('[data-st]').forEach(b => b.onclick = () => { cur.t[b.dataset.st] = Math.max(0, Math.min(N, (+cur.t[b.dataset.st] || 0) + +b.dataset.d)); persist(); drawTop(); });
      $('#lvTbl').querySelectorAll('[data-in]').forEach(i => i.onchange = () => { cur.t[i.dataset.in] = Math.max(0, Math.min(N, Math.round(+i.value || 0))); persist(); drawTop(); });
      // which benchmarks to show
      const bl = $('#lvBL'); if(bl) bl.innerHTML = benchHTML();
      bindBench();
    }
    const chipOf = b => `<label class="chip"><input type="checkbox" data-bc="${esc(b.id)}" ${on.has(b.id) ? 'checked' : ''}> ${esc(b.name)}</label>${b.own != null ? `<button class="btn small" data-brm="${b.own}" aria-label="${esc(t('lvRem'))}">×</button>` : ''}`;
    const benchHTML = () => benches.length ? `<span class="small">${esc(t('lvBench'))}:</span> ${benches.slice(0, 4).map(chipOf).join(' ')}${benches.length > 4 ? ` <details style="display:inline" ${L.bopen ? 'open' : ''}><summary class="small" style="display:inline;cursor:pointer">${esc(t('lvMore', {n: benches.length - 4}))}</summary>${benches.slice(4).map(chipOf).join(' ')}</details>` : ''}` : `<span class="small">${esc(t('lvNoBench'))}</span>`;
    function bindBench(){
      const dt = box.querySelector('#lvBL details'); if(dt) dt.ontoggle = () => { L.bopen = dt.open; };
      box.querySelectorAll('[data-bc]').forEach(i => i.onchange = () => { if(i.checked) on.add(i.dataset.bc); else on.delete(i.dataset.bc); cur.on = [...on]; persist(); drawTop(); });
      box.querySelectorAll('[data-brm]').forEach(b => b.onclick = () => { cur.b.splice(+b.dataset.brm, 1); delete cur.on; persist(); go(); });
    }
    $('#lvAct').innerHTML = `<div id="lvBL" style="flex:1 1 100%"></div><button class="btn" id="lvCopy">${esc(t('lvCopy'))}</button><button class="btn" id="lvImg">${esc(t('downloadPng'))}</button><button class="btn" id="lvClear">${esc(t('lvClear'))}</button>${cfg.when !== 'next' ? `<span class="lvreplay"><button class="btn primary" id="lvPlay">${esc(t('lvPlay'))}</button><button class="btn" id="lvRst">${esc(t('lvReset'))}</button><label class="small">${esc(t('lvSpeed'))} <select id="lvSp"><option value="1">1×</option><option value="4" selected>4×</option><option value="16">16×</option></select></label></span>` : ''}`;
    $('#lvCopy').onclick = () => copy(text(), t('lvCopied'));
    $('#lvClear').onclick = () => { cur.t = {}; cur.d = {}; persist(); stopReplay(); L.rp = null; drawTop(); drawSeats(); };
    $('#lvImg').onclick = () => imageModal({title: t('lvImg'), file: 'janadesh-live.png', text: text(), compose: async fmt => {
      const wide = fmt !== 'story', W = wide ? 1200 : 1080, H = wide ? 675 : 1920, pad = wide ? 48 : 56, c = document.createElement('canvas'); c.width = W; c.height = H;
      const g = c.getContext('2d'), col = lightCol; await cardFonts(); cardFrame(g, W, H, wide, pad, col);
      const cn = counts(), order = units.filter(u => cn[u.key] > 0).sort((a, b) => cn[b.key] - cn[a.key]), declared = Object.values(cn).reduce((a, b) => a + b, 0);
      g.fillStyle = col('--ink'); g.font = `700 ${wide ? 40 : 66}px "Anek Latin","Anek Devanagari", system-ui`; let y = wide ? 82 : 150; g.fillText(title, pad, y);
      g.font = `500 ${wide ? 22 : 34}px "Hind", system-ui`; g.fillStyle = col('--muted'); g.fillText(t('lvDecl', {n: declared, m: N}), pad, y + (wide ? 34 : 56));
      const hw = wide ? 540 : W - 2 * pad, hy = wide ? 128 : y + 100, h = hemiOnCanvas(g, order.map(u => ({n: cn[u.key], c: u.hex})), N, maj, order[0] ? cn[order[0].key] : 0, t('lvMaj', {n: maj}), pad, hy, hw, col('--ink'), col('--muted'));
      const rx = wide ? pad + hw + 50 : pad, ry = wide ? hy + 24 : hy + h + 40, rh = wide ? 48 : 70;
      order.slice(0, wide ? 7 : 9).forEach((u, j) => { const yy = ry + j * rh + 30; g.fillStyle = u.hex; g.fillRect(rx, yy - (wide ? 22 : 34), wide ? 22 : 34, wide ? 22 : 34); g.fillStyle = col('--ink'); g.font = `600 ${wide ? 28 : 42}px "Hind", system-ui`; g.fillText(u.name.slice(0, 22), rx + (wide ? 34 : 50), yy); g.textAlign = 'right'; g.font = `800 ${wide ? 32 : 50}px "Anek Latin", system-ui`; g.fillText(String(cn[u.key]), W - pad, yy); g.textAlign = 'left'; });
      g.fillStyle = col('--warn'); g.font = `600 ${wide ? 18 : 28}px "Hind", system-ui`; g.fillText(t('lvCardFoot'), pad, H - (wide ? 24 : 40)); return c; } });
    $('#lvBAdd').onclick = () => {
      const lines = $('#lvB').value.split('\n').map(x => x.trim()).filter(Boolean); let added = 0, unk = [];
      lines.forEach(l => { const r = liveParseBench(l, units); unk.push(...r.bad); if(Object.keys(r.seats).length){ cur.b.push({name: r.label, seats: r.seats}); added++; } });
      if(unk.length) toast(t('lvBenchUnk', {n: unk.join(', ')})); else if(!added) toast(t('lvBenchBad'));
      if(added){ delete cur.on; persist(); go(); }
    };
    // replay: the real winners declared in a shuffled order
    if(cfg.when !== 'next'){
      let sd = 0; for(const ch of base.id) sd = (sd * 31 + ch.charCodeAt(0)) >>> 0; const rnd = () => { sd = (sd * 1664525 + 1013904223) >>> 0; return sd / 4294967296; };
      const order = seats.filter(s => s.win).map(s => s.i); for(let i = order.length - 1; i > 0; i--){ const j = Math.floor(rnd() * (i + 1)); [order[i], order[j]] = [order[j], order[i]]; }
      L.rp = {order, n: Object.keys(cur.d).length, timer: null};
      const step = () => { if(!$('#lvSp')){ stopReplay(); return; } const sp = +$('#lvSp').value, k = Math.max(1, Math.round(sp * N / 600)); for(let q = 0; q < k && L.rp.n < order.length; q++){ const s = seats[order[L.rp.n++]]; cur.d[s.i] = s.win; }
        if(L.rp.n >= order.length){ stopReplay(); $('#lvPlay').textContent = t('lvPlay'); } persist(); drawTop(); drawSeats(); };
      $('#lvPlay').onclick = () => { if(L.rp.timer){ stopReplay(); $('#lvPlay').textContent = t('lvPlay'); return; } if(L.rp.n >= order.length){ cur.d = {}; L.rp.n = 0; } cfg.entry = 'seats'; $('#lvPlay').textContent = t('lvPause'); L.rp.timer = setInterval(step, 120); };
      $('#lvRst').onclick = () => { stopReplay(); cur.d = {}; L.rp.n = 0; $('#lvPlay').textContent = t('lvPlay'); persist(); drawTop(); drawSeats(); };
    }
    function drawSeats(){
      const sb = $('#lvSeatBox'); if(!sb) return;
      if(cfg.entry !== 'seats'){ sb.innerHTML = ''; return; }
      const q = nameKey(filter), list = seats.filter(s => !q || nameKey(s.name + s.region).includes(q)), shown = list.slice(0, showN);
      if(!$('#lvFq')){ sb.innerHTML = `<h3 style="margin-top:18px">${esc(t('lvSeats'))}</h3><input class="inp" id="lvFq" type="search" placeholder="${esc(t('lvFilter'))}" aria-label="${esc(t('lvFilter'))}" style="width:100%;max-width:360px;margin-bottom:6px"><p class="small" id="lvShow"></p><div class="seatlist" style="max-height:520px"><table class="tbl" id="lvSeatTbl"></table></div>`; $('#lvFq').oninput = e => { filter = e.target.value; drawSeats(); }; }
      $('#lvShow').textContent = t('lvShow', {n: shown.length, m: list.length});
      $('#lvSeatTbl').innerHTML = `<tbody>${shown.map(s => `<tr><td>${esc(s.name)}<div class="small">${esc(s.region)}</div></td><td><select data-sw="${s.i}" aria-label="${esc(s.name)}"><option value="">— ${esc(t('lvNotYet'))}</option>${units.map(u => `<option value="${esc(u.key)}" ${cur.d[s.i] === u.key ? 'selected' : ''}>${esc(u.name)}</option>`).join('')}</select></td></tr>`).join('')}</tbody>`;
      $('#lvSeatTbl').querySelectorAll('[data-sw]').forEach(sel => sel.onchange = () => { if(sel.value) cur.d[sel.dataset.sw] = sel.value; else delete cur.d[sel.dataset.sw]; persist(); drawTop(); });
    }
    drawTop(); drawSeats();
  }
  await go();
});
