// How constituencies changed: delimitation history (#/boundaries), a "new and renamed seats" tool with approximate areas, and a "new seats" map shading.
// Seats are matched by name across elections (Lok Sabha: name within the state), so a renamed seat shows as one new and one gone.
addI18n('en', {
  footBounds: 'How constituencies changed', boundsTitle: 'How constituencies changed', boundsSub: 'Constituencies have been redrawn, renamed, created and abolished several times since 1951. Here is what happened, and how many seats each state had.',
  boundsTimeline: 'What changed and when', boundsLS: 'Lok Sabha seats by state, election by election', boundsLSNote: 'A highlighted number means the state\'s seat count changed from the previous election. Madras, Bombay, Hyderabad, Mysore, Travancore-Cochin, Madhya Bharat, Vindhya Pradesh, Bhopal, Ajmer, Kutch, Saurashtra, Coorg, Bilaspur and PEPSU (Patiala and East Punjab States Union) were states before the 1956 reorganisation.', boundsAE: 'Assembly seats, whenever the count changed', boundsMaps: 'Maps: only the boundaries drawn after the 2002 Delimitation Commission (in force from 2008) are available as open data, so older constituencies cannot be drawn and the area of a seat is known only for those.',
  toolNew: 'New and renamed seats', newSub: 'Seats whose name did not exist at the previous election of this state (or the Lok Sabha), seats no longer in use, and likely renames. Areas come from the 2008-delimitation map.',
  newSummary: '{n} of {N} seats have a name that was not used at the {y} election; {g} names from {y} are no longer in use.', newNone: 'Every seat name here was also used at the {y} election: no seat was created or renamed.', newFirst: 'This is the first election in the data for this state, so there is nothing to compare with.',
  newList: 'New seats', newGone: 'No longer in use', newArea: 'Area (km²)', newRename: 'Same number as', newShow: 'Show', newDelim: 'Boundaries were redrawn between these elections: {d}', thSeatNo: 'No.', shNew: 'New seats', legNew: 'Violet: the seat name was not used at the {y} election. Grey: unchanged name. Only 2008-delimitation boundaries are drawn.',
  seatFirst: 'First election in the data under this name: {y}.', seatNewSince: 'A seat created or renamed at the {y} election; earlier history belongs to differently named seats.',
});
addI18n('hi', {
  footBounds: 'चुनाव क्षेत्र कैसे बदले', boundsTitle: 'चुनाव क्षेत्र कैसे बदले', boundsSub: '1951 से अब तक चुनाव क्षेत्र कई बार नए सिरे से बने, उनके नाम बदले, नए बने और कुछ ख़त्म हुए। यहाँ बताया गया है क्या हुआ, और हर राज्य के पास कितनी सीटें थीं।',
  boundsTimeline: 'क्या कब बदला', boundsLS: 'राज्य के हिसाब से लोकसभा सीटें, चुनाव दर चुनाव', boundsLSNote: 'रंग वाला अंक बताता है कि पिछले चुनाव से राज्य की सीटों की संख्या बदली। मद्रास, बंबई, हैदराबाद, मैसूर, त्रावणकोर-कोचीन, मध्य भारत, विंध्य प्रदेश, भोपाल, अजमेर, कच्छ, सौराष्ट्र, कूर्ग, बिलासपुर और पेप्सू (पटियाला और पूर्वी पंजाब रियासत संघ) 1956 के पुनर्गठन से पहले राज्य थे।', boundsAE: 'विधानसभा सीटें, जब-जब संख्या बदली', boundsMaps: 'नक्शे: 2002 के परिसीमन आयोग (2008 से लागू) के बाद वाली सीमाएँ ही खुले डेटा में उपलब्ध हैं, इसलिए पुराने चुनाव क्षेत्र नहीं दिखाए जा सकते और सीट का क्षेत्रफल सिर्फ़ उन्हीं का पता है।',
  toolNew: 'नई और नाम बदली सीटें', newSub: 'वे सीटें जिनका नाम इस राज्य (या लोकसभा) के पिछले चुनाव में नहीं था, जो सीटें अब इस्तेमाल में नहीं, और संभावित नाम-बदल। क्षेत्रफल 2008 के परिसीमन वाले नक्शे से है।',
  newSummary: '{N} में से {n} सीटों का नाम {y} के चुनाव में इस्तेमाल नहीं हुआ था; {y} के {g} नाम अब इस्तेमाल में नहीं हैं।', newNone: 'यहाँ हर सीट का नाम {y} के चुनाव में भी था: कोई सीट नई नहीं बनी, न नाम बदला।', newFirst: 'इस राज्य का यह आँकड़ों में पहला चुनाव है, इसलिए तुलना के लिए कुछ नहीं है।',
  newList: 'नई सीटें', newGone: 'अब इस्तेमाल में नहीं', newArea: 'क्षेत्रफल (वर्ग किमी)', newRename: 'वही नंबर जो', newShow: 'दिखाएँ', newDelim: 'इन चुनावों के बीच सीमाएँ नए सिरे से खींची गईं: {d}', thSeatNo: 'क्र.', shNew: 'नई सीटें', legNew: 'बैंगनी: सीट का नाम {y} के चुनाव में इस्तेमाल नहीं हुआ था। स्लेटी: नाम वही। सिर्फ़ 2008 के परिसीमन वाली सीमाएँ दिखती हैं।',
  seatFirst: 'आँकड़ों में इस नाम से पहला चुनाव: {y}।', seatNewSince: '{y} के चुनाव में बनी या नाम बदली सीट; उससे पहले का इतिहास अलग नाम वाली सीटों का है।',
});
// effective_from is the first election held under the change
const DELIMS = [
  {y: 1951, en: ['1951 to 52: the first elections', 'The first elections are held under the Delimitation of Parliamentary and Assembly Constituencies Order, 1951. Many constituencies send two members, so that Scheduled Caste and Scheduled Tribe candidates can be elected. The Lok Sabha has 489 seats.'], hi: ['1951-52: पहले चुनाव', 'पहले चुनाव परिसीमन आदेश 1951 के तहत होते हैं। कई चुनाव क्षेत्रों से दो सदस्य चुने जाते हैं ताकि अनुसूचित जाति और जनजाति के उम्मीदवार चुने जा सकें। लोकसभा में 489 सीटें हैं।']},
  {y: 1957, en: ['1952 to 57: first Delimitation Commission, and states redrawn', 'The 1952 Commission raises the Lok Sabha from 489 to 494 seats (3,280 assembly seats). The States Reorganisation Act of 1956 redraws state borders on language lines, so constituencies in many states are redrawn for 1957.'], hi: ['1952-57: पहला परिसीमन आयोग, और राज्यों का पुनर्गठन', '1952 का आयोग लोकसभा को 489 से बढ़ाकर 494 सीटें करता है (विधानसभा की 3,280 सीटें)। 1956 का राज्य पुनर्गठन अधिनियम राज्यों की सीमाएँ भाषा के आधार पर बदलता है, इसलिए 1957 के लिए कई राज्यों के चुनाव क्षेत्र नए सिरे से बनते हैं।']},
  {y: 1962, en: ['1961 to 62: two-member seats abolished', 'The Two-Member Constituencies (Abolition) Act, 1961 ends two-member constituencies. From the 1962 election every seat has one member.'], hi: ['1961-62: दो-सदस्यीय सीटें ख़त्म', 'दो-सदस्यीय निर्वाचन क्षेत्र (उन्मूलन) अधिनियम 1961 दो-सदस्यीय चुनाव क्षेत्र ख़त्म करता है। 1962 के चुनाव से हर सीट पर एक सदस्य।']},
  {y: 1967, en: ['1963 to 67: second Delimitation Commission', 'The 1963 Commission, the first after the 1956 reorganisation, raises the Lok Sabha from 494 to 522 seats and the assemblies to 3,771 seats, based on the 1961 census. In 1966 Punjab is split, creating Haryana and Chandigarh and moving some areas to Himachal Pradesh.'], hi: ['1963-67: दूसरा परिसीमन आयोग', '1963 का आयोग, जो 1956 के पुनर्गठन के बाद पहला है, 1961 की जनगणना के आधार पर लोकसभा को 494 से 522 और विधानसभाओं को 3,771 सीटों तक ले जाता है। 1966 में पंजाब बँटता है, हरियाणा और चंडीगढ़ बनते हैं और कुछ इलाक़े हिमाचल प्रदेश में जाते हैं।']},
  {y: 1977, en: ['1973 to 77: third Commission, based on the 1971 census', 'The 1973 Commission raises the Lok Sabha from 522 to 542 seats, with a 543rd for Sikkim after it joins India in 1975 (Sikkim also gets 32 assembly seats), and assemblies to 3,997 seats. The 42nd Amendment in 1976 then freezes the number of seats per state until the 2001 census.'], hi: ['1973-77: तीसरा आयोग, 1971 की जनगणना पर आधारित', '1973 का आयोग लोकसभा को 522 से 542 सीटों तक ले जाता है, और 1975 में भारत में शामिल होने वाले सिक्किम के लिए 543वीं सीट (साथ में 32 विधानसभा सीटें), और विधानसभाओं को 3,997 सीटों तक। 1976 का 42वाँ संशोधन फिर 2001 की जनगणना तक हर राज्य की सीटें जमा देता है।']},
  {y: 2000, en: ['2000: three new states', 'Chhattisgarh (from Madhya Pradesh), Jharkhand (from Bihar) and Uttarakhand (from Uttar Pradesh) are created. Their assemblies are carved out of the old ones, and the Lok Sabha seats move to the new states after the 2002 delimitation, so Uttar Pradesh falls from 85 to 80 seats, Bihar from 54 to 40 and Madhya Pradesh from 40 to 29.'], hi: ['2000: तीन नए राज्य', 'छत्तीसगढ़ (मध्य प्रदेश से), झारखंड (बिहार से) और उत्तराखंड (उत्तर प्रदेश से) बनते हैं। उनकी विधानसभाएँ पुरानी विधानसभाओं से काटकर बनती हैं, और 2002 के परिसीमन के बाद लोकसभा सीटें नए राज्यों में जाती हैं, इसलिए उत्तर प्रदेश 85 से 80, बिहार 54 से 40 और मध्य प्रदेश 40 से 29 सीटों पर आ जाता है।']},
  {y: 2009, en: ['2002 to 2009: the fourth Commission, in force from 2008', 'Based on the 2001 census, the 2002 Commission keeps 543 Lok Sabha seats and their split between states, but redraws almost every constituency and raises assembly seats to 4,123. The orders take effect on 19 February 2008; Karnataka votes on the new boundaries in May 2008 and the whole Lok Sabha in 2009. Jharkhand is left out until after 2026, and Assam, Arunachal Pradesh, Manipur and Nagaland are put off for security reasons.'], hi: ['2002-2009: चौथा आयोग, 2008 से लागू', '2001 की जनगणना के आधार पर 2002 का आयोग लोकसभा की 543 सीटें और राज्यों में उनका बँटवारा वही रखता है, पर लगभग हर चुनाव क्षेत्र नए सिरे से बनाता है और विधानसभा सीटें 4,123 करता है। आदेश 19 फ़रवरी 2008 से लागू होते हैं; कर्नाटक मई 2008 में नई सीमाओं पर वोट डालता है और पूरी लोकसभा 2009 में। झारखंड 2026 के बाद तक छोड़ा गया, और असम, अरुणाचल प्रदेश, मणिपुर और नागालैंड सुरक्षा कारणों से टाले गए।']},
  {y: 2014, en: ['2014: Telangana is formed', 'Andhra Pradesh is split. Andhra Pradesh keeps 175 assembly seats and Telangana gets 119; the 25 and 17 Lok Sabha seats go with them.'], hi: ['2014: तेलंगाना बना', 'आंध्र प्रदेश बँटता है। आंध्र प्रदेश के पास 175 विधानसभा सीटें रहती हैं और तेलंगाना को 119 मिलती हैं; लोकसभा की 25 और 17 सीटें उनके साथ जाती हैं।']},
  {y: 2024, en: ['2019 to 2024: Jammu and Kashmir, Ladakh and Assam', 'In 2019 Jammu and Kashmir is reorganised and Ladakh becomes a separate Union Territory. A 2022 delimitation gives Jammu and Kashmir 90 assembly seats, and the 2024 election is the first under them. Assam\'s 2008 order was withdrawn in 2020 and its constituencies were redrawn in 2023 (still 126 seats); the 2026 election uses them.'], hi: ['2019-2024: जम्मू-कश्मीर, लद्दाख और असम', '2019 में जम्मू-कश्मीर का पुनर्गठन होता है और लद्दाख अलग केंद्रशासित प्रदेश बनता है। 2022 का परिसीमन जम्मू-कश्मीर को 90 विधानसभा सीटें देता है, और 2024 का चुनाव उन पर पहला है। असम का 2008 वाला आदेश 2020 में वापस लिया गया और 2023 में उसके चुनाव क्षेत्र नए सिरे से बने (अब भी 126 सीटें); 2026 का चुनाव उन पर हुआ।']},
  {y: 2027, en: ['Next: the freeze and the 2026 Bill', 'The 84th Amendment (2001) keeps the number of seats frozen until the first census after 2026. A Delimitation Bill introduced on 16 April 2026 proposed raising the Lok Sabha to 850 seats (815 for states, 35 for Union Territories); Wikipedia lists it as rejected in committee in the Lok Sabha at the time of writing, so nothing has changed yet.'], hi: ['आगे: रोक और 2026 का विधेयक', '84वाँ संशोधन (2001) सीटों की संख्या 2026 के बाद की पहली जनगणना तक रोके रखता है। 16 अप्रैल 2026 को पेश परिसीमन विधेयक में लोकसभा को 850 सीटों तक (राज्यों के लिए 815, केंद्रशासित प्रदेशों के लिए 35) ले जाने का प्रस्ताव था; विकिपीडिया के अनुसार लिखते समय लोकसभा में वह समिति में ख़ारिज हुआ दर्ज है, इसलिए अभी कुछ नहीं बदला।']},
];
// ---- helpers: names that are new, gone, or possibly renamed ----
const seatNameKey = (e, s) => (e.kind === 'LS' && s[3] >= 0 ? (e.regions[s[3]] || '') + '|' : '') + nameKey(s[1]);
async function prevElection(){ const list = await history(), i = list.findIndex(x => x.id === entry().id); return i > 0 ? {prev: list[i - 1], cur: list[i], list, i} : null; }
function compareNames(cur, prev){
  const pset = new Map(prev.seats.map((s, i) => [seatNameKey(prev, s), i])), cset = new Map(cur.seats.map((s, i) => [seatNameKey(cur, s), i]));
  const isNew = cur.seats.map(s => !pset.has(seatNameKey(cur, s)));
  const gone = prev.seats.map((s, i) => i).filter(i => !cset.has(seatNameKey(prev, prev.seats[i])));
  return {isNew, gone, newIdx: isNew.map((b, i) => b ? i : -1).filter(i => i >= 0)};
}
const AREA = {};
async function seatAreas(name){
  if(AREA[name]) return AREA[name];
  const topo = await mapFor(name), fc = topojson.feature(topo, topo.objects[Object.keys(topo.objects)[0]]), m = new Map();
  fc.features.forEach(f => m.set(String(f.properties.k != null ? f.properties.k : f.properties.n), d3.geoArea(f) * 6371.0088 * 6371.0088));
  return AREA[name] = m;
}
let newMaskCache = null;
async function newSeatMask(){
  const pe = await prevElection(); if(!pe) return null;
  const key = entry().id; if(newMaskCache && newMaskCache.key === key) return newMaskCache;
  const c = compareNames(pe.cur, pe.prev); return newMaskCache = {key, isNew: c.isNew, label: pe.prev.label, n: c.newIdx.length};
}
// ---- the tool ----
registerTool({id: 'newseats', label: 'toolNew', sub: 'newSub', async render(body, stale){
  const pe = await prevElection(); if(stale()) return;
  if(!pe){ body.innerHTML = `<p class="small">${esc(t('newFirst'))}</p>`; return; }
  const {prev, cur} = pe, c = compareNames(cur, prev), N = cur.seats.length;
  const delims = DELIMS.filter(d => d.y > prev.year && d.y <= cur.year + (cur.year >= 2024 ? 0 : 0)).map(d => L2(d.en[0], d.hi[0]));
  const area = cur.map && cur.map !== 'states' ? await seatAreas(cur.map).catch(() => null) : null; if(stale()) return;
  const pbyNo = new Map(prev.seats.map(s => [s[0], s]));
  const rows = c.newIdx.map(i => { const s = cur.seats[i], k = String(cur.mapkeys ? cur.mapkeys[i] : (s[0] + (cur.mapoff || 0))), ps = cur.kind === 'AE' ? pbyNo.get(s[0]) : null,
    ren = ps && seatNameKey(prev, ps) !== seatNameKey(cur, s) && c.gone.some(g => prev.seats[g] === ps) ? ps[1] : '';
    return {i, s, a: area ? area.get(k) : null, ren}; });
  const ptot = rows.reduce((a, r) => a + (r.a || 0), 0);
  body.innerHTML = `<p style="font-family:var(--display);font-weight:600;margin:0 0 6px">${esc(c.newIdx.length ? t('newSummary', {n: c.newIdx.length, N, y: prev.label, g: c.gone.length}) : t('newNone', {y: prev.label}))}</p>
    ${delims.length && c.newIdx.length > 0.2 * N ? `<p class="small">${esc(t('newDelim', {d: delims.join('; ')}))}</p>` : ''}
    ${rows.length ? `<h4>${esc(t('newList'))}</h4><div class="seatlist" style="max-height:380px"><table class="tbl"><thead><tr><th>${esc(t('thSeatNo'))}</th><th>${esc(t('thSeatN'))}</th><th>${esc(t('newArea'))}</th><th>${esc(t('newRename'))}</th><th></th></tr></thead><tbody>
      ${rows.slice(0, 400).map(r => `<tr><td class="num">${r.s[0]}</td><td>${esc(r.s[1])}${cur.kind === 'LS' && r.s[3] >= 0 ? ` <span class="small">${esc(stName(cur.regions[r.s[3]]))}</span>` : ''}</td><td class="num">${r.a ? fmtN(r.a) : ''}</td><td>${esc(r.ren)}</td><td><button class="btn small" data-sh="${r.i}">${esc(t('newShow'))}</button></td></tr>`).join('')}</tbody></table></div>` : ''}
    ${c.gone.length ? `<h4 style="margin-top:12px">${esc(t('newGone'))}</h4><div class="row">${c.gone.slice(0, 120).map(g => `<span class="chip">${esc(prev.seats[g][1])}</span>`).join('')}${c.gone.length > 120 ? `<span class="small">+${c.gone.length - 120}</span>` : ''}</div>` : ''}
    <p class="small" style="margin-top:8px">${esc(t('boundsMaps'))} <a href="#/boundaries">${esc(t('footBounds'))} →</a></p>`;
  alignTables(body);
  body.querySelectorAll('[data-sh]').forEach(b => b.onclick = () => { const i = +b.dataset.sh; if(E.seats[i] && nameKey(E.seats[i].name) === nameKey(cur.seats[i][1])){ setShade('new'); selectSeat(i); if(typeof zoomToSeat === 'function') setTimeout(() => zoomToSeat(i), 400); } });
}});
// ---- the page ----
PAGES.set('boundaries', async box => {
  const ls = await bundle('ls'); const els = ls.slice().sort((a, b) => a.year - b.year);
  const states = new Map(); els.forEach((e, j) => e.seats.forEach(s => { if(s[3] < 0) return; const st = e.regions[s[3]], a = states.get(st) || new Array(els.length).fill(0); a[j] += s[6] || 1; states.set(st, a); }));
  const lsRows = [...states.entries()].sort((a, b) => Math.max(...b[1]) - Math.max(...a[1]));
  const ae = new Map(); INDEX.elections.filter(e => e.kind === 'AE').sort((a, b) => a.year - b.year || a.label.localeCompare(b.label)).forEach(e => { const a = ae.get(e.state) || []; if(!a.length || a[a.length - 1].n !== e.seats) a.push({y: e.label, n: e.seats}); ae.set(e.state, a); });
  box.innerHTML = `<article class="page" style="max-width:1100px"><h2>${esc(t('boundsTitle'))}</h2><p class="lede">${esc(t('boundsSub'))}</p>
    <h3>${esc(t('boundsTimeline'))}</h3>${DELIMS.map(d => `<div class="chg"><span class="pill">${esc(d.y === 2027 ? '2026+' : d.y)}</span> <b>${esc(L2(d.en[0], d.hi[0]))}</b><p>${esc(L2(d.en[1], d.hi[1]))}</p></div>`).join('')}
    <h3>${esc(t('boundsLS'))}</h3><p class="small">${esc(t('boundsLSNote'))}</p>
    <div class="tw"><table class="tbl" style="min-width:${150 + els.length * 46}px"><thead><tr><th style="text-align:left;position:sticky;left:0;background:var(--panel)">${esc(t('thRegion'))}</th>${els.map(e => `<th style="font-size:11px">${esc(e.label)}</th>`).join('')}</tr></thead><tbody>
    ${lsRows.map(([st, a]) => `<tr><td style="text-align:left;position:sticky;left:0;background:var(--panel);white-space:nowrap">${esc(stName(st))}</td>${a.map((n, j) => `<td class="num" style="${j && n !== a[j - 1] ? 'background:var(--violet-soft);font-weight:700' : ''}">${n || ''}</td>`).join('')}</tr>`).join('')}
    <tr style="font-weight:700"><td style="text-align:left;position:sticky;left:0;background:var(--panel)">${esc(L2('Total', 'कुल'))}</td>${els.map((e, j) => `<td class="num">${lsRows.reduce((s, r) => s + r[1][j], 0)}</td>`).join('')}</tr></tbody></table></div>
    <h3>${esc(t('boundsAE'))}</h3>${[...ae.entries()].sort((a, b) => stName(a[0]).localeCompare(stName(b[0]), LANG === 'hi' ? 'hi' : 'en')).map(([st, a]) => `<p style="margin:4px 0"><b>${esc(stName(st))}:</b> ${a.map(x => `<span class="chip" style="cursor:default">${esc(x.y)}: ${x.n}</span>`).join(' ')}</p>`).join('')}
    <p class="small" style="margin-top:14px">${esc(t('boundsMaps'))}</p></article>`;
});
