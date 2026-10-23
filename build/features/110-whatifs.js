// Famous what-ifs (#19): one-click scenarios built on the alliance editor and vote-share controls.
addI18n('en', {
  wiTitle: 'Famous what-ifs', wiLede: 'One click: change who allied with whom, or take away a wave, and see how the seats move. Hypotheticals on real constituency results, not forecasts.',
  wiBanner: 'What-if: {title}. {desc} Seats in the real result: {a}. In this what-if: {s}.', wiEasy: 'What-ifs for this election', wiEasyHint: 'Try a famous alternative.', wiGo: 'Try it', wiMissing: 'This what-if needs a party that is not in this election.',
});
addI18n('hi', {
  wiTitle: 'मशहूर अगर-मगर', wiLede: 'एक क्लिक: किसने किसके साथ गठबंधन किया यह बदलें, या कोई लहर हटा दें, और देखें सीटें कैसे खिसकती हैं। असली चुनाव-क्षेत्र नतीजों पर काल्पनिक परिदृश्य, पूर्वानुमान नहीं।',
  wiBanner: 'अगर-मगर: {title}। {desc} असली नतीजे में सीटें: {a}। इस परिदृश्य में: {s}।', wiEasy: 'इस चुनाव के अगर-मगर', wiEasyHint: 'कोई मशहूर विकल्प आज़माएँ।', wiGo: 'आज़माएँ', wiMissing: 'इस अगर-मगर को ऐसा दल चाहिए जो इस चुनाव में नहीं है।',
});
const WHATIFS = [
  {id: 'bsp-india-2024', base: 'ls-2024', ally: {BSP: 'INDIA'}, en: ['BSP joins INDIA (Lok Sabha 2024)', 'The BSP\'s votes are added to the INDIA bloc in every seat where it stood.'], hi: ['बसपा इंडिया गठबंधन में (लोकसभा 2024)', 'जहाँ बसपा लड़ी वहाँ उसके वोट इंडिया गठबंधन में जोड़ दिए गए हैं।']},
  {id: 'no-wave-2014', base: 'ls-2014', share: {party: 'BJP', from: 'ls-2009'}, en: ['No Modi wave (Lok Sabha 2014)', 'The BJP gets only its 2009 national vote share; every other party gains in proportion.'], hi: ['मोदी लहर नहीं (लोकसभा 2014)', 'भाजपा को सिर्फ़ 2009 वाला राष्ट्रीय वोट हिस्सा मिलता है; बाक़ी दल अनुपात में बढ़ते हैं।']},
  {id: 'aap-inc-delhi-2025', base: 'ae-delhi-2025', ally: {AAP: 'AAP+INC', INC: 'AAP+INC'}, en: ['Congress and AAP ally in Delhi 2025', 'AAP and Congress votes are added together in every seat.'], hi: ['दिल्ली 2025 में कांग्रेस और आप साथ', 'हर सीट पर आप और कांग्रेस के वोट जोड़े गए हैं।']},
  {id: 'aap-inc-haryana-2024', base: 'ae-haryana-2024', ally: {AAP: 'INDIA'}, en: ['AAP joins Congress in Haryana 2024', 'AAP votes are added to the INDIA bloc (Congress) in every seat.'], hi: ['हरियाणा 2024 में आप कांग्रेस के साथ', 'हर सीट पर आप के वोट इंडिया गठबंधन (कांग्रेस) में जोड़े गए हैं।']},
  {id: 'bsp-sp-up-2022', base: 'ae-uttar-pradesh-2022', ally: {BSP: 'SP+'}, en: ['BSP joins SP in Uttar Pradesh 2022', 'The BSP\'s votes are added to the SP-led alliance in every seat.'], hi: ['उत्तर प्रदेश 2022 में बसपा सपा के साथ', 'हर सीट पर बसपा के वोट सपा-नीत गठबंधन में जोड़े गए हैं।']},
  {id: 'united-sena-2024', base: 'ae-maharashtra-2024', ally: {SHS_SHINDE: 'United Sena', SSUBT: 'United Sena'}, en: ['Shiv Sena never splits (Maharashtra 2024)', 'The Shinde Sena and Uddhav Sena votes are counted as one party.'], hi: ['शिवसेना टूटती नहीं (महाराष्ट्र 2024)', 'शिंदे सेना और उद्धव सेना के वोट एक दल की तरह गिने गए हैं।']},
  {id: 'ljp-nda-bihar-2020', base: 'ae-bihar-2020', ally: {LJP: 'NDA'}, en: ['LJP stays in the NDA (Bihar 2020)', 'The LJP\'s votes are added to the NDA in every seat instead of a separate run.'], hi: ['लोजपा एनडीए में रहती (बिहार 2020)', 'अलग लड़ने के बजाय हर सीट पर लोजपा के वोट एनडीए में जोड़े गए हैं।']},
  {id: 'jds-bjp-karnataka-2023', base: 'ae-karnataka-2023', ally: {JDS: 'BJP+JDS', BJP: 'BJP+JDS'}, en: ['BJP and JD(S) ally in Karnataka 2023', 'BJP and JD(S) votes are added together in every seat.'], hi: ['कर्नाटक 2023 में भाजपा और जद(एस) साथ', 'हर सीट पर भाजपा और जद(एस) के वोट जोड़े गए हैं।']},
  {id: 'sad-bjp-punjab-2022', base: 'ae-punjab-2022', ally: {SAD: 'SAD+BJP', BJP: 'SAD+BJP'}, en: ['Akali Dal and BJP together in Punjab 2022', 'SAD and BJP votes are added together in every seat.'], hi: ['पंजाब 2022 में अकाली दल और भाजपा साथ', 'हर सीट पर अकाली दल और भाजपा के वोट जोड़े गए हैं।']},
  {id: 'tmc-inc-wb-2021', base: 'ae-west-bengal-2021', ally: {AITC: 'AITC+INC', INC: 'AITC+INC'}, en: ['TMC and Congress together in West Bengal 2021', 'TMC and Congress votes are added together in every seat.'], hi: ['पश्चिम बंगाल 2021 में तृणमूल और कांग्रेस साथ', 'हर सीट पर तृणमूल और कांग्रेस के वोट जोड़े गए हैं।']},
  {id: 'ajsu-nda-jharkhand-2019', base: 'ae-jharkhand-2019', ally: {AJSU: 'NDA'}, en: ['AJSU stays in the NDA (Jharkhand 2019)', 'The AJSU\'s votes are added to the NDA in every seat instead of a separate run.'], hi: ['आजसू एनडीए में रहती (झारखंड 2019)', 'अलग लड़ने के बजाय हर सीट पर आजसू के वोट एनडीए में जोड़े गए हैं।']},
  {id: 'aap-inc-gujarat-2022', base: 'ae-gujarat-2022', ally: {AAP: 'INC+AAP', INC: 'INC+AAP'}, en: ['Congress and AAP ally in Gujarat 2022', 'Congress and AAP votes are added together in every seat.'], hi: ['गुजरात 2022 में कांग्रेस और आप साथ', 'हर सीट पर कांग्रेस और आप के वोट जोड़े गए हैं।']},
];
function wiText(w){ return L2(w.en[0], w.hi[0]); }
function wiSig(){ return JSON.stringify([Object.entries(S.T).map(([k, v]) => [k, Math.round(v * 10) / 10]), S.allyEdit, S.mode]); }
async function partyShareIn(eid, code){
  const ent = INDEX.elections.find(e => e.id === eid), e = (await bundle(ent.file)).find(x => x.id === eid); let v = 0, tot = 0;
  e.seats.forEach(s => { for(let k = 0; k < s[4].length; k += 2){ if(e.parties[s[4][k]] === code) v += s[4][k + 1]; tot += s[4][k + 1]; } tot += s[5] || 0; });
  return 100 * v / tot;
}
async function applyWhatIf(w){
  const base = INDEX.elections.find(e => e.id === w.base); if(!base) return;
  track('whatif', {id: w.id});
  S.tab = 'easy';
  await openSim(base.kind, base.state, w.base);
  const codes = Object.keys(w.ally || {}).concat(w.share ? [w.share.party] : []);
  if(codes.some(c => !E.parties.includes(c))){ toast(t('wiMissing')); }
  const actualCount = new Map(); E.raw.seats.forEach(r => { if(!r[4].length) return; const p = E.raw.parties[r[4][0]], k = (E.raw.alliances || {})[p] || p; actualCount.set(k, (actualCount.get(k) || 0) + (r[6] || 1)); });
  const actualTxt = [...actualCount.entries()].sort((x, y) => y[1] - x[1]).slice(0, 3).map(([k, n]) => `${allyName(k) === k ? (LANG === 'hi' && HI_PARTY[k] ? HI_PARTY[k] : k) : allyName(k)} ${n}`).join(', ');
  S.T = {}; S.locks = {}; S.overrides = {}; S.regional = {}; S.swing = {a: null, b: null, pts: 0}; S.transfer = 100;
  if(w.ally){ S.mode = 'alliance'; S.allyEdit = Object.assign({}, w.ally); rebuild(); }
  else { S.mode = 'party'; S.allyEdit = {}; rebuild(); }
  if(w.share){ const ui = U.findIndex(g => g.key === w.share.party); if(ui >= 0){ const share = await partyShareIn(w.share.from, w.share.party); setAll(computeTargets(ui, share, baseT())); } }
  S.pollScn = null; S.whatIf = {w, sig: '', actual: actualTxt};
  run(); S.whatIf.sig = wiSig(); renderPane(); renderResult();
}
function renderWhatIfBanner(){
  const el = $('#scnBanner'), sc = S.whatIf; if(!el || !sc || sc.w.base !== S.eid || sc.sig !== wiSig()) return false;
  const ord = U.map((g, k) => k).filter(k => U[k].key !== 'OTH').sort((a, b) => Math.max(RES.counts[b], U[b].baseSeats) - Math.max(RES.counts[a], U[a].baseSeats)).slice(0, 3);
  const actual = sc.actual;
  const sim = ord.map(k => `${shortName(U[k])} ${RES.counts[k]}`).join(', ');
  el.hidden = false;
  el.innerHTML = esc(t('wiBanner', {title: wiText(sc.w), desc: L2(sc.w.en[1], sc.w.hi[1]), a: actual, s: sim}));
  return true;
}
function renderWhatIfHome(){
  const g = $('#wiGrid'); if(!g) return;
  g.innerHTML = WHATIFS.map((w, i) => `<button class="scn" data-wi="${i}"><i style="background:#0F8B8D"></i><span><b>${esc(wiText(w))}</b><br><span class="small">${esc(L2(w.en[1], w.hi[1]))}</span></span></button>`).join('');
  g.querySelectorAll('[data-wi]').forEach(b => b.onclick = () => applyWhatIf(WHATIFS[+b.dataset.wi]));
}
function whatifEasyBlock(){
  if(S.next) return ''; const list = WHATIFS.filter(w => w.base === S.eid); if(!list.length) return '';
  return `<div><h3>${esc(t('wiEasy'))}</h3><p class="hint">${esc(t('wiEasyHint'))}</p>${list.map(w => `<button class="btn" data-wie="${w.id}" style="width:100%;text-align:left;margin-bottom:6px">${esc(wiText(w))}</button>`).join('')}</div>`;
}
function whatifEasyBind(){ document.querySelectorAll('[data-wie]').forEach(b => b.onclick = () => applyWhatIf(WHATIFS.find(w => w.id === b.dataset.wie))); }
