// Scenario gallery (#37), page #/gallery. Featured scenarios come from source/ref/gallery.json; your own saved scenarios sit beside them.
// Publishing and upvotes need a server, so instead a scenario can be sent for featuring as a prefilled GitHub issue, and stars are kept in this browser.
addI18n('en', {
  footGallery: 'Scenario gallery', glTitle: 'Scenario gallery', glSub: 'Ready-made scenarios to open, change and share, and the ones you saved yourself. All are hypotheticals on real constituency results, not forecasts.',
  glFeatured: 'Featured', glMine: 'My scenarios', glNoMine: 'Nothing saved yet. Open the simulator, set up a scenario and use the Save tab.', glNoFeat: 'No featured scenarios yet.', glOpen: 'Open', glLink: 'Copy link', glDel: 'Delete', glStar: 'Star', glStarred: 'Starred',
  glBy: 'by {n}', glSubmit: 'Send a scenario to be featured', glSubmitSub: 'There is no upload button because Janadesh has no server. Pick one of your saved scenarios and it opens a prefilled GitHub issue with its link; if it is a fair, well-explained hypothetical it gets added here.',
  glPick: 'Scenario', glName: 'Title', glDesc: 'What does it ask? One or two sentences', glSend: 'Open the GitHub issue', glNeedMine: 'Save a scenario first, then you can send it.', glWhen: 'saved {d}', glHead: 'Seats: {h}',
  homeUnaligned: 'In neither', homeVacant: 'Vacant', homeLiveNote: 'Sitting members as of {d}, from Wikipedia. Independents are shown on their own, and are not part of either bloc. The simulator starts from the 2024 election result.',
  plTitle: 'Play and follow', plLede: 'Make a prediction, follow the count on results day, test what you know, or open a scenario someone else made.',
  plPredD: 'Lock a seat prediction, share it and get scored when the result is in.', plLiveD: 'Enter the count as it comes and compare with your prediction and the exit polls.', plGuessD: 'Name the election from its seat arc.', plQuizD: 'Ten questions on elections, the Lok Sabha and the states.', plGalD: 'Ready-made scenarios, and yours.',
  glRules: 'Please keep submissions to hypotheticals that stay true to the data: no claims that they are predictions, and nothing about named private people.',
});
addI18n('hi', {
  footGallery: 'परिदृश्य गैलरी', glTitle: 'परिदृश्य गैलरी', glSub: 'खोलने, बदलने और शेयर करने के लिए तैयार परिदृश्य, और वे जो आपने ख़ुद सहेजे। सभी असली चुनाव-क्षेत्र नतीजों पर काल्पनिक परिदृश्य हैं, पूर्वानुमान नहीं।',
  glFeatured: 'चुनिंदा', glMine: 'मेरे परिदृश्य', glNoMine: 'अभी कुछ सहेजा नहीं है। सिम्युलेटर खोलें, परिदृश्य बनाएँ और सहेजें टैब इस्तेमाल करें।', glNoFeat: 'अभी कोई चुनिंदा परिदृश्य नहीं।', glOpen: 'खोलें', glLink: 'लिंक कॉपी करें', glDel: 'हटाएँ', glStar: 'सितारा दें', glStarred: 'सितारा लगा है',
  glBy: '{n} की ओर से', glSubmit: 'किसी परिदृश्य को चुनिंदा में जुड़वाने के लिए भेजें', glSubmitSub: 'अपलोड का बटन इसलिए नहीं है कि जनादेश का कोई सर्वर नहीं है। अपने सहेजे परिदृश्यों में से एक चुनें, इससे उसके लिंक के साथ GitHub का भरा हुआ इश्यू खुलता है; अगर वह निष्पक्ष और अच्छी तरह समझाया गया काल्पनिक परिदृश्य हुआ तो यहाँ जोड़ दिया जाएगा।',
  glPick: 'परिदृश्य', glName: 'शीर्षक', glDesc: 'यह क्या पूछता है? एक या दो वाक्य', glSend: 'GitHub इश्यू खोलें', glNeedMine: 'पहले कोई परिदृश्य सहेजें, फिर उसे भेज सकेंगे।', glWhen: '{d} को सहेजा', glHead: 'सीटें: {h}',
  homeUnaligned: 'किसी में नहीं', homeVacant: 'ख़ाली', homeLiveNote: '{d} तक के मौजूदा सदस्य, विकिपीडिया से। निर्दलीय अलग दिखाए गए हैं, किसी गुट में नहीं गिने गए। सिम्युलेटर 2024 के चुनावी नतीजे से शुरू होता है।',
  plTitle: 'खेलें और देखें', plLede: 'भविष्यवाणी करें, नतीजे के दिन गिनती के साथ चलें, अपनी जानकारी परखें, या किसी और का बनाया परिदृश्य खोलें।',
  plPredD: 'सीटों की भविष्यवाणी पक्की करें, शेयर करें और नतीजा आने पर अंक पाएँ।', plLiveD: 'गिनती के साथ आँकड़े दर्ज करें और अपनी भविष्यवाणी व एग्ज़िट पोल से तुलना करें।', plGuessD: 'सीटों के अर्धवृत्त से चुनाव पहचानिए।', plQuizD: 'चुनावों, लोकसभा और राज्यों पर दस प्रश्न।', plGalD: 'तैयार परिदृश्य, और आपके अपने।',
  glRules: 'कृपया वही काल्पनिक परिदृश्य भेजें जो आँकड़ों के प्रति ईमानदार हों: उन्हें भविष्यवाणी न बताएँ, और किसी निजी व्यक्ति के बारे में कुछ न हो।',
});
let GAL = null;
async function galData(){ if(!GAL){ try{ GAL = await getJSON('ref/gallery.json'); }catch(e){ GAL = {items: []}; } } return GAL; }
const galLink = code => location.origin + location.pathname + '#s=' + code;
PAGES.set('gallery', async box => {
  const gal = await galData(), saved = store.get('scenarios', []), stars = new Set(store.get('galstars', []));
  const star = id => `<button class="btn small gstar" data-star="${esc(id)}" aria-pressed="${stars.has(id)}" title="${esc(t(stars.has(id) ? 'glStarred' : 'glStar'))}">${stars.has(id) ? '★' : '☆'}</button>`;
  const feat = gal.items.slice().sort((a, b) => stars.has(b.id) - stars.has(a.id));
  const mine = saved.map((s, i) => ({s, i, id: 'm' + i}));
  const scnTitle = s => { const e = INDEX.elections.find(x => x.id === s.s.eid); return e ? (e.kind === 'LS' ? t('titleLS', {y: s.s.next ? nextYear(e, s.s.ahead || 1) : e.label}) : t('titleAE', {s: stName(e.state), y: s.s.next ? nextYear(e, s.s.ahead || 1) : e.label})) : ''; };
  box.innerHTML = `<article class="page" style="max-width:1000px"><h2>${esc(t('glTitle'))}</h2><p class="lede">${esc(t('glSub'))}</p>
    <h3 style="margin-top:18px">${esc(t('glFeatured'))}</h3>
    ${feat.length ? `<div class="calgrid">${feat.map(it => `<div class="calc"><i style="background:${esc(it.color || 'var(--violet)')}"></i><div><b class="calt">${esc(L2(it.en[0], it.hi[0]))}</b><p class="small" style="margin:2px 0 4px">${esc(L2(it.en[1], it.hi[1]))}</p>${it.head ? `<p class="small" style="margin:0 0 6px"><b>${esc(t('glHead', {h: it.head}))}</b></p>` : ''}<p class="small" style="margin:0 0 8px">${esc(t('glBy', {n: it.by || 'Janadesh'}))}</p>
        <div class="row"><button class="btn small primary" data-gopen="${esc(it.id)}">${esc(t('glOpen'))}</button><button class="btn small" data-glink="${esc(it.id)}">${esc(t('glLink'))}</button>${star(it.id)}</div></div></div>`).join('')}</div>` : `<p class="small">${esc(t('glNoFeat'))}</p>`}
    <h3 style="margin-top:22px">${esc(t('glMine'))}</h3>
    ${mine.length ? `<div class="calgrid">${mine.map(o => `<div class="calc"><i style="background:var(--evmblue)"></i><div><b class="calt">${esc(o.s.name)}</b><p class="small" style="margin:2px 0 8px">${esc(scnTitle(o.s))} · ${esc(t('glWhen', {d: o.s.when}))}</p>
        <div class="row"><button class="btn small primary" data-mopen="${o.i}">${esc(t('glOpen'))}</button><button class="btn small" data-mlink="${o.i}">${esc(t('glLink'))}</button><button class="btn small" data-mdel="${o.i}">${esc(t('glDel'))}</button></div></div></div>`).join('')}</div>` : `<p class="small">${esc(t('glNoMine'))}</p>`}
    <h3 style="margin-top:22px">${esc(t('glSubmit'))}</h3><p class="small" style="margin:0 0 8px">${esc(t('glSubmitSub'))}</p>
    ${mine.length ? `<div class="stack" style="gap:8px;max-width:560px"><label class="stack" style="gap:3px"><span class="small">${esc(t('glPick'))}</span><select id="glSel">${mine.map(o => `<option value="${o.i}">${esc(o.s.name)}</option>`).join('')}</select></label>
      <label class="stack" style="gap:3px"><span class="small">${esc(t('glName'))}</span><input class="inp" id="glNm" maxlength="80"></label>
      <label class="stack" style="gap:3px"><span class="small">${esc(t('glDesc'))}</span><textarea id="glDs" maxlength="400" style="min-height:70px"></textarea></label>
      <div><button class="btn primary" id="glGo">${esc(t('glSend'))}</button></div></div>` : `<p class="small">${esc(t('glNeedMine'))}</p>`}
    <p class="small" style="margin-top:12px">${esc(t('glRules'))}</p></article>`;
  const open = code => { location.hash = '#s=' + code; };
  box.querySelectorAll('[data-gopen]').forEach(b => b.onclick = () => { track('gallery_open', {id: b.dataset.gopen}); open(gal.items.find(i => i.id === b.dataset.gopen).code); });
  box.querySelectorAll('[data-glink]').forEach(b => b.onclick = () => copy(galLink(gal.items.find(i => i.id === b.dataset.glink).code), t('linkCopied')));
  box.querySelectorAll('[data-star]').forEach(b => b.onclick = () => { const id = b.dataset.star; if(stars.has(id)) stars.delete(id); else stars.add(id); store.set('galstars', [...stars]); routePages('#/gallery'); });
  const forLink = s => { const sc = Object.assign({}, s, {lang: LANG}); const T = {}; for(const k in sc.T || {}) T[k] = Math.round(sc.T[k] * 100) / 100; sc.T = T; for(const k of ['locks', 'regional', 'reserved', 'overrides', 'allyEdit', 'partyEdit']){ if(sc[k] && !Object.keys(sc[k]).length) delete sc[k]; } if(sc.reserved && !Object.keys(sc.reserved.SC || {}).length && !Object.keys(sc.reserved.ST || {}).length) delete sc.reserved; return sc; };
  box.querySelectorAll('[data-mopen]').forEach(b => b.onclick = () => { location.hash = ''; applyScenario(saved[+b.dataset.mopen].s); });
  box.querySelectorAll('[data-mlink]').forEach(b => b.onclick = () => copy(galLink(encodeScenario(forLink(saved[+b.dataset.mlink].s))), t('linkCopied')));
  box.querySelectorAll('[data-mdel]').forEach(b => b.onclick = () => { saved.splice(+b.dataset.mdel, 1); store.set('scenarios', saved); routePages('#/gallery'); });
  const sel = $('#glSel'); if(sel){ const fill = () => { const s = saved[+sel.value]; if(s && !$('#glNm').value) $('#glNm').value = s.name; }; sel.onchange = () => { $('#glNm').value = ''; fill(); }; fill();
    $('#glGo').onclick = () => {
      const s = saved[+sel.value], name = $('#glNm').value.trim() || s.name, desc = $('#glDs').value.trim(), url = galLink(encodeScenario(forLink(s.s)));
      const body = `**Title:** ${name}\n**What it asks:** ${desc || '(please describe)'}\n**Election:** ${scnTitle(s)}\n\n**Link:** ${url}\n\n_Sent from ${location.origin}${location.pathname}_`;
      track('gallery_submit', {e: s.s.eid}); window.open(`${REPO}/issues/new?labels=scenario&title=${encodeURIComponent('Scenario: ' + name)}&body=${encodeURIComponent(body)}`, '_blank', 'noopener'); }; }
});
function renderPlayHome(){
  const g = $('#plGrid'); if(!g) return;
  const cards = [['predict', 'prTitle', 'plPredD', 'var(--violet)'], ['live', 'lvTitle', 'plLiveD', 'var(--bad)'], ['guess', 'gsTitle', 'plGuessD', '#0F8B8D'], ['quiz', 'qzTitle', 'plQuizD', '#D4A017'], ['gallery', 'glTitle', 'plGalD', 'var(--evmblue)']];
  g.innerHTML = cards.map(c => `<button class="scn" data-pl="${c[0]}"><i style="background:${c[3]}"></i><span><b>${esc(t(c[1]))}</b><br><span class="small">${esc(t(c[2]))}</span></span></button>`).join('');
  g.querySelectorAll('[data-pl]').forEach(b => b.onclick = () => { location.hash = '#/' + b.dataset.pl; });
}
