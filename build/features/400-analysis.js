// Analysis hub (page #/analysis): every analysis tool and every whole-country analysis page in one place, grouped by what it tells you.
// Pick an election, press a tool, and the simulator opens on that election with the tool already showing.
addI18n('en', {
  anaBtn: 'Analysis', footAna: 'Analysis', anaTitle: 'Analysis', anaSub: 'Everything Janadesh can tell you, in one place. Choose an election, then open any tool: it runs on that election in the simulator, where you can also move the vote and watch it change.',
  anaPick: 'Analyse', anaWhen: 'Election', anaLatest: 'Latest result ({y})', anaNext: 'Next election, as a projection', anaFind: 'Find a tool', anaOpen: 'Open', anaNone: 'No tool matches that.',
  anaGResults: 'Seats and results', anaGParties: 'Parties and alliances', anaGTime: 'Over time and across places', anaGPeople: 'People and representation', anaGModel: 'Reading the signs', anaGWhole: 'The whole country',
  anaTools: '{n} tools', anaPages: '{n} pages', anaRSd: 'How the upper house and the electoral college that elects the President would look after the assembly elections.', anaDelimd: 'Lok Sabha seats redrawn by population, and who gains and loses.', anaOnoed: 'One national swing across the Lok Sabha and every assembly at once.',
  anaTreed: 'How parties split and merged, from the Janata family to the Shiv Sena and NCP.', anaBoundsd: 'Delimitation since 1951, new and renamed seats, seats per state over time.', anaCald: 'Countdowns to the next elections, each with a simulate button.', anaDatad: 'Download every constituency result as CSV or JSON.',
});
addI18n('hi', {
  anaBtn: 'विश्लेषण', footAna: 'विश्लेषण', anaTitle: 'विश्लेषण', anaSub: 'जनादेश जो कुछ बता सकता है, एक जगह। कोई चुनाव चुनें, फिर कोई भी औज़ार खोलें: वह सिम्युलेटर में उसी चुनाव पर चलता है, जहाँ आप वोट खिसकाकर बदलाव भी देख सकते हैं।',
  anaPick: 'विश्लेषण करें', anaWhen: 'चुनाव', anaLatest: 'सबसे ताज़ा नतीजा ({y})', anaNext: 'अगला चुनाव, अनुमान के रूप में', anaFind: 'कोई औज़ार खोजें', anaOpen: 'खोलें', anaNone: 'कोई औज़ार नहीं मिला।',
  anaGResults: 'सीटें और नतीजे', anaGParties: 'दल और गठबंधन', anaGTime: 'समय और जगहों के पार', anaGPeople: 'लोग और प्रतिनिधित्व', anaGModel: 'संकेत पढ़ना', anaGWhole: 'पूरा देश',
  anaTools: '{n} औज़ार', anaPages: '{n} पन्ने', anaRSd: 'विधानसभा चुनावों के बाद ऊपरी सदन और राष्ट्रपति चुनने वाला निर्वाचक-मंडल कैसा दिखेगा।', anaDelimd: 'आबादी के हिसाब से दोबारा बनी लोकसभा सीटें, और किसे फ़ायदा और किसे घाटा।', anaOnoed: 'लोकसभा और हर विधानसभा पर एक साथ एक राष्ट्रीय स्विंग।',
  anaTreed: 'दल कैसे टूटे और जुड़े, जनता परिवार से शिवसेना और एनसीपी तक।', anaBoundsd: '1951 से परिसीमन, नई और नाम बदली सीटें, समय के साथ राज्यवार सीटें।', anaCald: 'अगले चुनावों की गिनती, हर एक के साथ सिम्युलेट बटन।', anaDatad: 'हर चुनाव-क्षेत्र का नतीजा CSV या JSON में डाउनलोड करें।',
});
const ANA_GROUPS = [
  ['anaGResults', '#D7263D', ['facts', 'flip', 'closest', 'records', 'newseats']],
  ['anaGParties', '#1F4FA8', ['strike', 'h2h', 'deposit', 'perpt', 'journey', 'coalition', 'alliances']],
  ['anaGTime', '#0F8B8D', ['compare', 'multiples', 'patterns', 'waves']],
  ['anaGPeople', '#F28C28', ['representation', 'cms']],
  ['anaGModel', '#4A2577', ['signals', 'bypolls', 'local', 'votesys']],
];
const ANA_PAGES = [['rajyasabha', 'footRS', 'anaRSd'], ['delimitation', 'footDelim', 'anaDelimd'], ['onoe', 'footOnoe', 'anaOnoed'], ['tree', 'footTree', 'anaTreed'], ['boundaries', 'footBounds', 'anaBoundsd'], ['calendar', 'footCal', 'anaCald'], ['data', 'footData', 'anaDatad']];
const anaFirst = s => { const x = String(s || '').replace(/\s+/g, ' ').trim(), i = x.search(/[.!?](\s|$)/); const f = i > 20 && i < 170 ? x.slice(0, i + 1) : x.slice(0, 150); return f.length < x.length && f === x.slice(0, 150) ? f.replace(/\s+\S*$/, '') + '…' : f; };
async function anaOpen(toolId, pick){
  S.tab = 'easy'; location.hash = ''; track('analysis_open', {tool: toolId});
  const ix = INDEX.elections;
  if(pick.when === 'next'){ const l = pick.where === 'LS' ? ix.filter(e => e.kind === 'LS').sort((a, b) => b.year - a.year)[0] : calLatest(pick.where); if(pick.where === 'LS') S.mode = 'alliance'; await openSim(pick.where === 'LS' ? 'LS' : 'AE', pick.where === 'LS' ? null : pick.where, 'next:' + l.id, pick.where !== 'LS'); }
  else { const e = ix.find(x => x.id === pick.when); await openSim(e.kind, e.kind === 'LS' ? null : e.state, e.id); }
  S.tool = toolId; store.set('tool', toolId); const sel = $('#toolSel'); if(sel) sel.value = toolId; toolKeyShown = null; toolsTouch(true);
  if(typeof setPTab === 'function') setPTab('result');
  const card = $('#cardTools'); if(card) card.scrollIntoView({behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth', block: 'start'});
}
PAGES.set('analysis', async box => {
  const ix = INDEX.elections, wheres = ['LS', ...statesList().sort((a, b) => stName(a).localeCompare(stName(b), LANG === 'hi' ? 'hi' : 'en'))];
  const pick = Object.assign({where: 'LS', when: 'latest'}, store.get('anapick', {})); if(!wheres.includes(pick.where)) pick.where = 'LS';
  const past = w => ix.filter(e => w === 'LS' ? e.kind === 'LS' : (e.kind === 'AE' && e.state === w)).sort((a, b) => b.year - a.year || b.label.localeCompare(a.label));
  const resolve = () => ({where: pick.where, when: pick.when === 'latest' ? past(pick.where)[0].id : pick.when});
  const known = new Map(TOOLS.map(x => [x.id, x])), used = new Set(ANA_GROUPS.flatMap(g => g[2]));
  const groups = ANA_GROUPS.map(([k, c, ids]) => [k, c, ids.filter(id => known.has(id))]).filter(g => g[2].length);
  const extra = TOOLS.filter(x => !used.has(x.id)).map(x => x.id); if(extra.length) groups.push(['anaGModel', '#4A2577', extra]);
  const draw = (q) => {
    const n = nameKey(q || ''), card = (title, sub, color, attr) => `<div class="calc" ${attr}><i style="background:${color}"></i><div><b class="calt">${esc(title)}</b><p class="small" style="margin:2px 0 8px">${esc(sub)}</p><button class="btn small primary">${esc(t('anaOpen'))}</button></div></div>`;
    const html = groups.map(([k, c, ids]) => { const list = ids.map(id => known.get(id)).filter(x => !n || nameKey(t(x.label) + ' ' + t(x.sub)).includes(n)); if(!list.length) return '';
      return `<h3 style="margin-top:22px">${esc(t(k))} <span class="small">· ${esc(t('anaTools', {n: list.length}))}</span></h3><div class="calgrid">${list.map(x => card(t(x.label), anaFirst(t(x.sub)), c, `data-tool="${esc(x.id)}" tabindex="0"`)).join('')}</div>`; }).join('');
    const pages = ANA_PAGES.filter(p => !n || nameKey(t(p[1]) + ' ' + t(p[2])).includes(n));
    const phtml = pages.length ? `<h3 style="margin-top:22px">${esc(t('anaGWhole'))} <span class="small">· ${esc(t('anaPages', {n: pages.length}))}</span></h3><div class="calgrid">${pages.map(p => card(t(p[1]), t(p[2]), '#8D6E63', `data-page="${p[0]}" tabindex="0"`)).join('')}</div>` : '';
    return (html + phtml) || `<p class="small">${esc(t('anaNone'))}</p>`;
  };
  box.innerHTML = `<article class="page" style="max-width:1080px"><h2>${esc(t('anaTitle'))}</h2><p class="lede">${esc(t('anaSub'))}</p>
    <div class="tools-row"><label>${esc(t('anaPick'))} <select id="anWhere">${wheres.map(w => `<option value="${esc(w)}" ${w === pick.where ? 'selected' : ''}>${esc(w === 'LS' ? t('lokSabha') : stName(w) + ' ' + t('vidhanSabha'))}</option>`).join('')}</select></label>
      <label>${esc(t('anaWhen'))} <select id="anWhen"></select></label>
      <label style="flex:1;min-width:200px"><span class="sronly">${esc(t('anaFind'))}</span><input class="inp" id="anFind" type="search" placeholder="${esc(t('anaFind'))}" style="width:100%"></label></div>
    <div id="anBody"></div></article>`;
  const fillWhen = () => { const list = past(pick.where), latest = list[0];
    $('#anWhen').innerHTML = `<option value="latest">${esc(t('anaLatest', {y: latest.label}))}</option><option value="next">${esc(t('anaNext'))}</option>${list.map(e => `<option value="${e.id}">${esc(e.label)}${e.approx ? esc(t('reconOpt')) : ''}</option>`).join('')}`;
    if(![...$('#anWhen').options].some(o => o.value === pick.when)) pick.when = 'latest'; $('#anWhen').value = pick.when; };
  const paint = () => { $('#anBody').innerHTML = draw($('#anFind').value);
    box.querySelectorAll('[data-tool]').forEach(c => { const go = () => anaOpen(c.dataset.tool, resolve()); c.onclick = go; c.onkeydown = e => { if(e.key === 'Enter'){ e.preventDefault(); go(); } }; });
    box.querySelectorAll('[data-page]').forEach(c => { const go = () => { location.hash = '#/' + c.dataset.page; }; c.onclick = go; c.onkeydown = e => { if(e.key === 'Enter'){ e.preventDefault(); go(); } }; }); };
  $('#anWhere').onchange = e => { pick.where = e.target.value; pick.when = 'latest'; store.set('anapick', pick); fillWhen(); };
  $('#anWhen').onchange = e => { pick.when = e.target.value; store.set('anapick', pick); };
  $('#anFind').oninput = paint;
  fillWhen(); paint();
});
