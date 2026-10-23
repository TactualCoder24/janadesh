// Content pages: #/how (how it works), #/glossary, #/changelog, #/data (open data). Other features add pages with PAGES.set(name, async render).
addI18n('en', {
  footHow: 'How it works', footGlossary: 'Glossary', footChangelog: 'Changelog', footData: 'Open data', footTree: 'Party family tree', footBack: 'Back to the simulator',
  howTitle2: 'How Janadesh works', glossTitle: 'Glossary', glossSub: 'Plain-language meanings of the terms used in Janadesh.', glossFind: 'Find a term', changeTitle: 'Changelog', changeSub: 'Every feature and data fix, newest first.',
  dataTitle: 'Open data', dataSub: 'Download the constituency results behind Janadesh, free to use. Static files at fixed links, no sign-up and no server.',
  tagFeature: 'New', tagFix: 'Data fix', tagData: 'Data', tagSite: 'Site',
});
addI18n('hi', {
  footHow: 'यह कैसे काम करता है', footGlossary: 'शब्दावली', footChangelog: 'बदलावों की सूची', footData: 'खुला डेटा', footTree: 'दलों का वंश-वृक्ष', footBack: 'सिम्युलेटर पर वापस',
  howTitle2: 'जनादेश कैसे काम करता है', glossTitle: 'शब्दावली', glossSub: 'जनादेश में इस्तेमाल होने वाले शब्दों के सरल अर्थ।', glossFind: 'कोई शब्द खोजें', changeTitle: 'बदलावों की सूची', changeSub: 'हर नई सुविधा और आँकड़ों का सुधार, सबसे नया ऊपर।',
  dataTitle: 'खुला डेटा', dataSub: 'जनादेश के पीछे के चुनाव-क्षेत्र वाले नतीजे डाउनलोड करें, मुफ़्त इस्तेमाल के लिए। तय लिंक पर स्थिर फ़ाइलें, न साइन-अप, न सर्वर।',
  tagFeature: 'नया', tagFix: 'आँकड़ा सुधार', tagData: 'डेटा', tagSite: 'साइट',
});
const PAGES = new Map();
function showPageView(){ $('#home').hidden = true; $('#app').hidden = true; $('#seatview').hidden = true; $('#appPick').hidden = true; $('#tabbar').hidden = true; closeSheet(); $('#homeBtn').hidden = false; $('#pageview').hidden = false; document.body.classList.remove('inapp'); window.scrollTo(0, 0); }
async function routePages(h){
  const m = h.match(/^#\/([a-z-]+)$/); if(!m || !PAGES.has(m[1])) return false;
  showPageView(); const box = $('#pageview'); box.innerHTML = `<span class="loading"><i></i>${esc(t('loading'))}</span>`;
  await PAGES.get(m[1])(box);
  box.insertAdjacentHTML('beforeend', `<p style="margin-top:28px"><button class="btn" id="pgBack">← ${esc(t('footBack'))}</button></p>`);
  $('#pgBack').onclick = () => { location.hash = ''; };
  return true;
}
const L2 = (en, hi) => LANG === 'hi' ? hi : en;

// ---------- How it works (#26) ----------
const HOW = {
  en: [
    ['What this is', 'Janadesh is a seat simulator. You move vote shares and it shows which constituencies would change hands. It is a thought experiment built on real past results. It is not an exit poll, a prediction or a forecast.'],
    ['The starting point', 'Every simulation begins with a real election, constituency by constituency: the votes each party got in each seat. For a future election the starting point is the latest real result of that state or of the Lok Sabha.'],
    ['Uniform swing', 'A swing moves vote share between parties. In uniform swing every seat gets the same shift in percentage points. If a party goes from 30% to 33% nationally, it gains 3 points in every seat (a seat where it had 1% simply cannot lose more than it has). Simple, and good for small moves.'],
    ['Proportional swing', 'In proportional swing every party\'s share in every seat is multiplied by the same factor. A party going from 30% to 33% nationally is multiplied by 1.1, so 40% becomes 44% and 10% becomes 11%. Strong areas move more than weak ones. After the multiplication each seat is scaled back to 100%. This is the default.'],
    ['Staying true to the national numbers', 'After the swing is applied the national vote shares of all parties are recalculated and corrected a few times, so that the totals match the shares you chose. You can switch this off.'],
    ['Alliances and vote transfer', 'In alliance view the votes of partners in each seat are added together. The transfer slider says how much of a partner\'s vote actually goes to the alliance: at 100% all of it, at 70% only 70% of the junior partner\'s votes. Edit alliances in the Parties tab and test what would have happened with different partners.'],
    ['Local adjustments', 'You can shift a state or district, shift reserved (SC and ST) seats, force the winner of a seat, or ask the tool to find the vote share a party needs for a seat total ("solve for seats").'],
    ['Odds', 'The Odds tab runs the simulation hundreds of times with random errors: one national error, one regional error and one error for each seat. The spread of results gives a seat range and the chances of a majority or a hung house. The error sizes are yours to choose.'],
    ['Future elections', 'Future elections start from the latest result. "Continue the trend" carries the most recent swing forward, fading a little each election. These are scenarios, not projections.'],
    ['Reconstructed data', 'For 39 recent assembly elections without open seat-level data, the official winner and runner-up of every constituency come from Wikipedia and the votes of smaller parties are estimated. Seat totals are checked against the official party tallies. Such elections carry a label.'],
    ['What it cannot do', 'It does not know about candidates, local issues, turnout, new parties with no history, or boundary changes. A scenario that has never happened in real life will still give an answer, so read extreme results with care.'],
  ],
  hi: [
    ['यह क्या है', 'जनादेश एक सीट-सिम्युलेटर है। आप वोट हिस्से खिसकाते हैं और यह दिखाता है कि कौन-से चुनाव क्षेत्र हाथ बदलेंगे। यह असली पुराने नतीजों पर बना एक सोच-प्रयोग है। यह एग्ज़िट पोल, भविष्यवाणी या पूर्वानुमान नहीं है।'],
    ['शुरुआती बिंदु', 'हर सिम्युलेशन किसी असली चुनाव से शुरू होता है, चुनाव क्षेत्र दर चुनाव क्षेत्र: हर सीट में हर दल को कितने वोट मिले। आगे के चुनाव के लिए शुरुआती बिंदु उस राज्य या लोकसभा का सबसे ताज़ा असली नतीजा होता है।'],
    ['एकसमान स्विंग', 'स्विंग का मतलब दलों के बीच वोट हिस्सा खिसकना है। एकसमान स्विंग में हर सीट पर प्रतिशत अंकों में एक जैसा बदलाव लगता है। अगर कोई दल देशभर में 30% से 33% पर जाता है, तो वह हर सीट पर 3 अंक बढ़ता है (जिस सीट पर उसके पास 1% है, वहाँ वह उससे ज़्यादा घट नहीं सकता)। सरल और छोटे बदलावों के लिए ठीक।'],
    ['अनुपातिक स्विंग', 'अनुपातिक स्विंग में हर सीट पर हर दल का हिस्सा एक ही गुणक से बढ़ता है। देशभर में 30% से 33% पर जाने वाले दल का गुणक 1.1 है, यानी 40% का 44% और 10% का 11%। मज़बूत इलाक़े ज़्यादा खिसकते हैं, कमज़ोर कम। गुणा करने के बाद हर सीट को फिर 100% पर लाया जाता है। यही डिफ़ॉल्ट है।'],
    ['राष्ट्रीय आँकड़ों से मेल', 'स्विंग लगाने के बाद सभी दलों के राष्ट्रीय वोट हिस्से फिर से निकाले जाते हैं और कई बार सुधारे जाते हैं ताकि कुल योग आपके चुने हिस्सों से मेल खाएँ। इसे बंद भी किया जा सकता है।'],
    ['गठबंधन और वोट ट्रांसफ़र', 'गठबंधन दृश्य में हर सीट पर साझेदारों के वोट जोड़े जाते हैं। ट्रांसफ़र स्लाइडर बताता है कि साझेदार का कितना वोट सचमुच गठबंधन को जाता है: 100% पर पूरा, 70% पर छोटे साझेदार के सिर्फ़ 70% वोट। दल टैब में गठबंधन बदलकर देखें कि अलग साझेदारों के साथ क्या होता।'],
    ['स्थानीय बदलाव', 'आप किसी राज्य या ज़िले को खिसका सकते हैं, आरक्षित (अनुसूचित जाति और जनजाति) सीटों को खिसका सकते हैं, किसी सीट का विजेता तय कर सकते हैं, या टूल से पूछ सकते हैं कि किसी सीट-संख्या के लिए दल को कितना वोट चाहिए ("सीटों के लिए हल करें")।'],
    ['संभावनाएँ', 'संभावना टैब सिम्युलेशन को सैकड़ों बार चलाता है और हर बार यादृच्छिक त्रुटि जोड़ता है: एक राष्ट्रीय, एक क्षेत्रीय और हर सीट की अपनी। नतीजों के फैलाव से सीटों की रेंज और बहुमत या त्रिशंकु सदन की संभावना निकलती है। त्रुटि का आकार आप तय करते हैं।'],
    ['आगे के चुनाव', 'आगे के चुनाव ताज़ा नतीजे से शुरू होते हैं। "रुझान जारी रखें" सबसे हाल के स्विंग को आगे ले जाता है, हर चुनाव में थोड़ा घटाते हुए। ये परिदृश्य हैं, पूर्वानुमान नहीं।'],
    ['पुनर्निर्मित आँकड़े', 'जिन 39 हाल के विधानसभा चुनावों के सीट-स्तर के खुले आँकड़े नहीं हैं, उनमें हर चुनाव क्षेत्र का आधिकारिक विजेता और उपविजेता विकिपीडिया से लिया गया है और छोटे दलों के वोट अनुमानित हैं। सीटों का योग आधिकारिक दलवार गिनती से मिलाया गया है। ऐसे चुनावों पर लेबल लगा होता है।'],
    ['यह क्या नहीं कर सकता', 'इसे उम्मीदवारों, स्थानीय मुद्दों, मतदान प्रतिशत, बिना इतिहास वाले नए दलों या सीमाओं के बदलाव का पता नहीं होता। जो परिदृश्य असल में कभी हुआ ही नहीं, उसका भी जवाब आ जाता है, इसलिए चरम नतीजों को सावधानी से पढ़ें।'],
  ],
};
const SOURCES = [
  ['Election Commission of India results, via DataMeet india-election-data', 'https://github.com/datameet/india-election-data'],
  ['ECI statistical reports 1951-2004, via gitcheckoutnikhil/india-elections-data', 'https://github.com/gitcheckoutnikhil/india-elections-data'],
  ['data-analytics.github.io: ECI results 2009-2024', 'https://github.com/data-analytics/data-analytics.github.io'],
  ['spfrantz/vidhan-sabha-2017-scraper and vidhan-sabha-2018', 'https://github.com/spfrantz'],
  ['azadecon/assembly_elections_2023', 'https://github.com/azadecon/assembly_elections_2023'],
  ['Wikipedia: constituency tables and exit-poll tables of each election page (official winners for 39 assembly elections, names, exit polls)', 'https://en.wikipedia.org/'],
  ['DataMeet constituency boundary files (2008 delimitation)', 'https://github.com/datameet/maps'],
];
PAGES.set('how', async box => {
  box.innerHTML = `<article class="page"><h2>${esc(t('howTitle2'))}</h2><p class="lede">${esc(t('disclaimer'))}</p>
    ${HOW[LANG].map(([h, p], i) => `<h3>${i + 1}. ${esc(h)}</h3><p>${esc(p)}</p>`).join('')}
    <h3>${esc(L2('Data sources', 'आँकड़ों के स्रोत'))}</h3><ul>${SOURCES.map(([n, u]) => `<li><a href="${u}" target="_blank" rel="noopener">${esc(n)}</a></li>`).join('')}</ul>
    <p class="small">${esc(L2('Janadesh is independent and not affiliated with the Election Commission of India.', 'जनादेश स्वतंत्र है और भारत निर्वाचन आयोग से जुड़ा नहीं है।'))}</p></article>`;
});

// ---------- Glossary (#57) ----------
const GLOSS = [
  ['First past the post', 'पहले नंबर पर जीत (फ़र्स्ट पास्ट द पोस्ट)', 'The candidate with the most votes in a constituency wins, even without a majority of the votes. India uses this for the Lok Sabha and state assemblies, which is why a party\'s share of seats can differ a lot from its share of votes.', 'चुनाव क्षेत्र में सबसे ज़्यादा वोट पाने वाला उम्मीदवार जीतता है, भले ही उसे आधे से कम वोट मिले हों। भारत में लोकसभा और विधानसभाओं में यही व्यवस्था है, इसीलिए किसी दल का सीट-हिस्सा उसके वोट-हिस्से से काफ़ी अलग हो सकता है।'],
  ['Vote share', 'वोट हिस्सा', 'The percentage of all votes polled that a party or candidate received.', 'डाले गए कुल वोटों में से किसी दल या उम्मीदवार को मिले वोटों का प्रतिशत।'],
  ['Seat share', 'सीट हिस्सा', 'The percentage of all seats a party won. Compare it with vote share to see how well a party turns votes into seats.', 'किसी दल की जीती हुई सीटों का कुल सीटों में प्रतिशत। इसे वोट हिस्से से मिलाकर देखें कि दल वोट को सीट में कितना बदल पाता है।'],
  ['Swing', 'स्विंग', 'The change in a party\'s vote share between two elections, in percentage points.', 'दो चुनावों के बीच किसी दल के वोट हिस्से में हुआ बदलाव, प्रतिशत अंकों में।'],
  ['Uniform swing', 'एकसमान स्विंग', 'Every constituency gets the same change in percentage points.', 'हर चुनाव क्षेत्र पर प्रतिशत अंकों में एक जैसा बदलाव लगता है।'],
  ['Proportional swing', 'अनुपातिक स्विंग', 'Every party\'s share is multiplied by the same factor, so strong areas move more than weak ones.', 'हर दल का हिस्सा एक ही गुणक से बढ़ता या घटता है, इसलिए मज़बूत इलाक़े ज़्यादा खिसकते हैं।'],
  ['Majority mark', 'बहुमत का आँकड़ा', 'More than half the seats: 272 of 543 in the Lok Sabha, and half plus one in an assembly.', 'आधे से ज़्यादा सीटें: लोकसभा में 543 में से 272, और विधानसभा में आधा और एक।'],
  ['Hung house', 'त्रिशंकु सदन', 'A result where no party or alliance has a majority on its own.', 'ऐसा नतीजा जिसमें किसी दल या गठबंधन के पास अपने दम पर बहुमत न हो।'],
  ['Alliance (coalition)', 'गठबंधन', 'Parties that contest together or govern together, such as the NDA or the INDIA bloc.', 'वे दल जो साथ चुनाव लड़ते या साथ सरकार चलाते हैं, जैसे एनडीए या इंडिया गठबंधन।'],
  ['Vote transfer', 'वोट ट्रांसफ़र', 'How much of one ally\'s vote moves to its partner in a seat where the partner stands. It is never a full 100% in real life.', 'जिस सीट पर साझेदार लड़ रहा हो वहाँ एक सहयोगी का कितना वोट उसके साझेदार को जाता है। असल में यह कभी पूरा 100% नहीं होता।'],
  ['Reserved seat (SC / ST)', 'आरक्षित सीट (अनुसूचित जाति / जनजाति)', 'A constituency where only candidates from Scheduled Castes or Scheduled Tribes can stand. Every voter in it still votes.', 'ऐसा चुनाव क्षेत्र जहाँ सिर्फ़ अनुसूचित जाति या जनजाति के उम्मीदवार खड़े हो सकते हैं। उसके सभी मतदाता फिर भी वोट देते हैं।'],
  ['NOTA', 'नोटा', 'None of the above. A button on the voting machine to reject all candidates. It does not change who wins.', 'इनमें से कोई नहीं। सभी उम्मीदवारों को नकारने का बटन। इससे यह तय नहीं होता कि कौन जीतेगा।'],
  ['Delimitation', 'परिसीमन', 'Redrawing constituency boundaries, and the number of seats per state, after a census. The latest one used in Janadesh maps is from 2008.', 'जनगणना के बाद चुनाव क्षेत्रों की सीमाएँ और हर राज्य की सीटें फिर से तय करना। जनादेश के नक्शों में 2008 वाला परिसीमन है।'],
  ['Anti-defection law', 'दल-बदल विरोधी क़ानून', 'The Tenth Schedule of the Constitution: a member who leaves their party or defies its whip can lose their seat.', 'संविधान की दसवीं अनुसूची: जो सदस्य अपनी पार्टी छोड़े या व्हिप न माने, उसकी सदस्यता जा सकती है।'],
  ['Anti-incumbency', 'सत्ता-विरोधी लहर', 'Voters\' tendency to vote against the party that has been in power.', 'सत्ताधारी दल के ख़िलाफ़ वोट देने का मतदाताओं का रुझान।'],
  ['Incumbent', 'मौजूदा सदस्य / सत्तारूढ़', 'The sitting member of a seat, or the party in government.', 'किसी सीट का वर्तमान सदस्य, या सत्ता में बैठी पार्टी।'],
  ['Margin', 'जीत का अंतर', 'The difference in votes between the winner and the runner-up.', 'विजेता और उपविजेता के वोटों का अंतर।'],
  ['Strike rate', 'स्ट्राइक रेट', 'Seats won divided by seats contested. It matters in seat-sharing talks between allies.', 'जीती गई सीटें भाग लड़ी गई सीटें। सहयोगियों के बीच सीट-बँटवारे की बातचीत में यह अहम होता है।'],
  ['Deposit', 'ज़मानत राशि', 'Money a candidate pays to stand. It is lost if the candidate gets less than one sixth of the valid votes in the seat.', 'चुनाव लड़ने के लिए उम्मीदवार जो रकम जमा करता है। अगर उसे सीट के वैध वोटों का छठा हिस्सा भी न मिले तो रकम ज़ब्त हो जाती है।'],
  ['Bellwether seat', 'बेलवेदर सीट', 'A seat that tends to vote for the party that goes on to win the election overall.', 'ऐसी सीट जो अक्सर उसी दल को चुनती है जो पूरा चुनाव जीतता है।'],
  ['By-election', 'उप-चुनाव', 'An election held for a single seat that has fallen vacant between general elections.', 'आम चुनावों के बीच किसी एक ख़ाली हुई सीट के लिए होने वाला चुनाव।'],
  ['Exit poll', 'एग्ज़िट पोल', 'A survey of voters as they leave the polling booth, published after voting ends. It is different from an opinion poll, which is taken before the vote.', 'मतदान केंद्र से निकलते मतदाताओं का सर्वे, जो मतदान ख़त्म होने के बाद छपता है। ओपिनियन पोल से अलग, जो वोटिंग से पहले होता है।'],
  ['Opinion poll', 'ओपिनियन पोल', 'A survey of voters\' intentions taken before the election.', 'चुनाव से पहले मतदाताओं की मंशा का सर्वे।'],
  ['Lok Sabha', 'लोकसभा', 'The lower house of Parliament, with 543 elected seats.', 'संसद का निचला सदन, जिसमें 543 निर्वाचित सीटें हैं।'],
  ['Vidhan Sabha', 'विधानसभा', 'The legislative assembly of a state or union territory.', 'किसी राज्य या केंद्रशासित प्रदेश की विधायिका।'],
  ['Rajya Sabha', 'राज्यसभा', 'The upper house of Parliament, elected by state assembly members rather than directly by voters.', 'संसद का ऊपरी सदन, जिसे मतदाता सीधे नहीं बल्कि राज्यों के विधायक चुनते हैं।'],
  ['Two-member constituency', 'दो-सदस्यीय चुनाव क्षेत्र', 'A seat that sent two members, used in the first elections to give representation to SC and ST communities.', 'ऐसी सीट जिससे दो सदस्य चुने जाते थे, जो शुरुआती चुनावों में अनुसूचित जाति और जनजाति को प्रतिनिधित्व देने के लिए थी।'],
  ['Monte Carlo simulation', 'मोंटे कार्लो सिम्युलेशन', 'Running the same calculation many times with random errors to see the range of likely results.', 'एक ही गणना को यादृच्छिक त्रुटियों के साथ कई बार चलाना ताकि संभावित नतीजों की रेंज दिखे।'],
  ['Split-ticket voting', 'अलग-अलग चुनावों में अलग वोट', 'Voting for different parties in different elections, for example one party for the state and another for the Lok Sabha.', 'अलग-अलग चुनावों में अलग दलों को वोट देना, जैसे राज्य में एक दल और लोकसभा में दूसरा।'],
  ['Model Code of Conduct', 'आदर्श आचार संहिता', 'Rules for parties and governments from the day an election is announced until results.', 'चुनाव की घोषणा से नतीजों तक दलों और सरकारों के लिए नियम।'],
  ['EVM and VVPAT', 'ईवीएम और वीवीपैट', 'The electronic voting machine, and the paper slip machine that lets a voter see their vote.', 'इलेक्ट्रॉनिक वोटिंग मशीन, और काग़ज़ की पर्ची वाली मशीन जिससे मतदाता अपना वोट देख सकता है।'],
];
PAGES.set('glossary', async box => {
  const draw = q => { const n = nameKey(q || ''); return GLOSS.filter(g => !n || nameKey(g[0] + g[1] + g[2] + g[3]).includes(n)).map(g => `<div class="gl"><h4>${esc(L2(g[0], g[1]))}${LANG === 'hi' ? ` <span class="small">${esc(g[0])}</span>` : ''}</h4><p>${esc(L2(g[2], g[3]))}</p></div>`).join('') || `<p class="small">${esc(t('searchNone'))}</p>`; };
  box.innerHTML = `<article class="page"><h2>${esc(t('glossTitle'))}</h2><p class="lede">${esc(t('glossSub'))}</p><input class="inp" id="glq" type="search" placeholder="${esc(t('glossFind'))}" aria-label="${esc(t('glossFind'))}" style="width:100%;max-width:420px;margin-bottom:12px"><div id="glist">${draw('')}</div></article>`;
  $('#glq').oninput = e => { $('#glist').innerHTML = draw(e.target.value); };
});

// ---------- Changelog (#58) ----------
const CHANGES = [
  ['2026-10-23', 'feature', 'A smarter model: core voters, waves, momentum and early signals', 'ज़्यादा समझदार मॉडल: कोर मतदाता, लहरें, गति और शुरुआती संकेत', 'A new Core + swing method moves the swing voters first and the core only in a wave; a wave tracker scores every past election; a momentum baseline averages the last four results in each seat; realistic mode stops swings that have never happened; and a signals tool reads the latest assembly results, 543 by-elections since 2014 and the big city corporations as hints for the next Lok Sabha.', 'नया कोर + स्विंग तरीक़ा पहले स्विंग वाले मतदाताओं को खिसकाता है और कोर को सिर्फ़ लहर में; लहर ट्रैकर हर पुराने चुनाव को अंक देता है; गति वाली शुरुआत हर सीट के पिछले चार नतीजों का औसत लेती है; यथार्थवादी मोड वे स्विंग रोकता है जो कभी हुए ही नहीं; और संकेत वाला औज़ार ताज़ा विधानसभा नतीजे, 2014 से 543 उप-चुनाव और बड़े नगर निगमों को अगली लोकसभा के संकेत की तरह पढ़ता है।'],
  ['2026-10-23', 'feature', 'What-if lab, voting systems, One Nation One Election, delimitation and Rajya Sabha', 'अगर-मगर लैब, मतदान प्रणालियाँ, एक देश एक चुनाव, परिसीमन और राज्यसभा', 'A new party, a party split, turnout shifts and a sitting-member penalty; the same votes counted under proportional and runoff systems; one national swing across every assembly; the Lok Sabha enlarged to 800 or more seats; and the Rajya Sabha with the electoral college for President.', 'एक नया दल, दल की टूट, मतदान में बदलाव और मौजूदा सदस्य का जुर्माना; वही वोट अनुपातिक और रनऑफ़ प्रणालियों में गिने हुए; हर विधानसभा में एक राष्ट्रीय स्विंग; 800 या ज़्यादा सीटों वाली लोकसभा; और राज्यसभा तथा राष्ट्रपति का निर्वाचक-मंडल।'],
  ['2026-10-23', 'feature', 'Chief ministers and by-elections', 'मुख्यमंत्री और उप-चुनाव', 'The chief ministers of every state with their terms, parties and the election they came in under; and the by-elections since the 2024 Lok Sabha result with a party scoreboard.', 'हर राज्य के मुख्यमंत्री, उनके कार्यकाल, दल और वह चुनाव जिसमें वे आए; और 2024 की लोकसभा के बाद के उप-चुनाव, दलों के स्कोरबोर्ड के साथ।'],
  ['2026-10-23', 'feature', 'How constituencies changed', 'चुनाव क्षेत्र कैसे बदले', 'The history of delimitation since 1951, Lok Sabha seats by state in every election, new and renamed seats with their area, and a map of new seats.', '1951 से परिसीमन का इतिहास, हर चुनाव में राज्यवार लोकसभा सीटें, नई और नाम बदली सीटें क्षेत्रफल के साथ, और नई सीटों का नक्शा।'],
  ['2026-10-23', 'feature', 'Alliance timeline with old alliance names and splits', 'पुराने गठबंधन नामों और टूट के साथ गठबंधन समयरेखा', 'National Front, United Front, NDA, UPA and INDIA by election, the biggest alliances of each election, and markers for the splits, mergers and foundings of each party.', 'हर चुनाव में राष्ट्रीय मोर्चा, संयुक्त मोर्चा, एनडीए, यूपीए और इंडिया, हर चुनाव के सबसे बड़े गठबंधन, और हर दल की टूट, विलय और स्थापना के निशान।'],
  ['2026-10-23', 'fix', 'Independents no longer counted in the NDA', 'निर्दलीय अब एनडीए में नहीं गिने जाते', 'Seven independents were counted as NDA in Lok Sabha 2024. They now stand alone, in their own colour: NDA 293, INDIA 234, independents 7.', 'लोकसभा 2024 में सात निर्दलीय एनडीए में गिने गए थे। अब वे अपने रंग में अलग हैं: एनडीए 293, इंडिया 234, निर्दलीय 7।'],
  ['2026-10-23', 'feature', 'Party family tree', 'दलों का वंश-वृक्ष', 'How parties split and merged, from the Congress and Janata families to the Shiv Sena and NCP splits.', 'दल कैसे टूटे और जुड़े, कांग्रेस और जनता परिवार से लेकर शिवसेना और एनसीपी के बँटवारे तक।'],
  ['2026-10-23', 'feature', 'Story mode', 'स्टोरी मोड', 'Swipe through any election in about ten cards with the map changing, and record it as a video for Reels and Shorts.', 'किसी भी चुनाव को लगभग दस कार्डों में स्वाइप करें, नक्शा बदलता दिखे, और रील्स-शॉर्ट्स के लिए वीडियो रिकॉर्ड करें।'],
  ['2026-10-23', 'feature', 'Did you know cards, famous what-ifs, alliance timeline, small-multiple maps, incumbency patterns, representation', 'क्या आप जानते हैं कार्ड, मशहूर अगर-मगर, गठबंधन समयरेखा, छोटे नक्शों की क़तार, सत्ता के पैटर्न, प्रतिनिधित्व', 'New analysis views for every election, and one-click what-if scenarios.', 'हर चुनाव के लिए नए विश्लेषण, और एक क्लिक पर अगर-मगर परिदृश्य।'],
  ['2026-10-23', 'feature', 'Open data, glossary, how it works, changelog', 'खुला डेटा, शब्दावली, यह कैसे काम करता है, बदलावों की सूची', 'New pages. Every election is downloadable as CSV and JSON at a fixed link.', 'नए पन्ने। हर चुनाव CSV और JSON में तय लिंक पर डाउनलोड हो सकता है।'],
  ['2026-10-23', 'feature', 'Mobile layout', 'मोबाइल लेआउट', 'Tab bar, compact seat tally, pull-up controls, big sliders, swipe between tabs, pinch-zoom map, tablet layout.', 'टैब बार, छोटा सीट-टैली, ऊपर खींचने वाले नियंत्रण, बड़े स्लाइडर, टैब के बीच स्वाइप, पिंच-ज़ूम नक्शा, टैबलेट लेआउट।'],
  ['2026-10-23', 'feature', 'Faster loading', 'तेज़ लोडिंग', 'Each state\'s data and maps load only when opened.', 'हर राज्य का डेटा और नक्शे खोलने पर ही लोड होते हैं।'],
  ['2026-10-23', 'feature', 'Share link, image, WhatsApp text, Twitter thread', 'शेयर लिंक, तस्वीर, व्हाट्सऐप संदेश, ट्विटर थ्रेड', 'Share the exact scenario, or a map and tally image in 16:9 and 9:16.', 'ठीक वही परिदृश्य शेयर करें, या 16:9 और 9:16 में नक्शे और तालिका की तस्वीर।'],
  ['2026-10-23', 'feature', 'Search and a history page for every seat', 'खोज और हर सीट का इतिहास पन्ना', 'Find any constituency or member by name and see every election it has voted in.', 'नाम से कोई भी चुनाव क्षेत्र या सदस्य खोजें और देखें उसने किन-किन चुनावों में वोट दिया।'],
  ['2026-10-23', 'feature', 'Analysis tools and exit-poll presets', 'विश्लेषण टूल और एग्ज़िट पोल प्रीसेट', 'Flip targets, closest contests, seat records, strike rate, head-to-head, deposits lost, party journey, compare two elections, coalition builder, and 14 sets of exit polls.', 'पलट सकने वाली सीटें, कांटे के मुक़ाबले, सीट रिकॉर्ड, स्ट्राइक रेट, आमने-सामने, ज़मानत ज़ब्त, पार्टी का सफ़र, दो चुनावों की तुलना, गठबंधन बनाएँ, और 14 एग्ज़िट पोल सेट।'],
  ['2026-10-23', 'data', 'Names on every seat', 'हर सीट पर नाम', 'Winner and runner-up names for every seat, from the raw results and Wikipedia.', 'हर सीट के विजेता और उपविजेता के नाम, मूल नतीजों और विकिपीडिया से।'],
  ['2026-10-23', 'fix', 'Delhi 2025 corrected, and 38 other elections', 'दिल्ली 2025 सही किया गया, और 38 अन्य चुनाव', 'Shalimar Bagh and 30 other Delhi 2025 seats had been shuffled. The official winners and runners-up of every seat are now applied to 39 assembly elections, and party totals match the official tallies.', 'शालीमार बाग़ और दिल्ली 2025 की 30 अन्य सीटें आपस में उलझ गई थीं। 39 विधानसभा चुनावों में हर सीट के आधिकारिक विजेता और उपविजेता अब लगाए गए हैं, और दलवार योग आधिकारिक गिनती से मेल खाते हैं।'],
  ['2026-10-23', 'fix', 'CPI(M) votes repaired', 'सीपीआई(एम) के वोट सुधारे गए', 'Votes of many small parties had been counted as CPI(M) in Lok Sabha 2014 to 2024 and several assemblies. CPI(M) now shows 52 seats contested in 2024, not 494. The 2029 Lok Sabha projection moved a little as a result.', 'लोकसभा 2014 से 2024 और कई विधानसभाओं में कई छोटे दलों के वोट सीपीआई(एम) में गिन लिए गए थे। अब 2024 में सीपीआई(एम) की 52 लड़ी सीटें दिखती हैं, 494 नहीं। इससे 2029 की लोकसभा परियोजना थोड़ी बदली।'],
  ['2026-10-21', 'site', 'Link previews', 'लिंक प्रीव्यू', 'Preview image and tags for WhatsApp, Twitter and Facebook, and a Janadesh watermark on exported images.', 'व्हाट्सऐप, ट्विटर और फ़ेसबुक के लिए प्रीव्यू तस्वीर और टैग, और निर्यात की गई तस्वीरों पर जनादेश का वॉटरमार्क।'],
  ['2026-10-21', 'feature', 'Janadesh launches', 'जनादेश की शुरुआत', 'Lok Sabha 1951 to 2024 and every state assembly at constituency level, swing and alliance simulation, odds, maps, Hindi and English.', 'लोकसभा 1951 से 2024 और हर राज्य की विधानसभा चुनाव-क्षेत्र स्तर पर, स्विंग और गठबंधन सिम्युलेशन, संभावनाएँ, नक्शे, हिंदी और अंग्रेज़ी।'],
];
PAGES.set('changelog', async box => {
  const tag = {feature: 'tagFeature', fix: 'tagFix', data: 'tagData', site: 'tagSite'};
  const byDate = new Map(); CHANGES.forEach(c => { if(!byDate.has(c[0])) byDate.set(c[0], []); byDate.get(c[0]).push(c); });
  box.innerHTML = `<article class="page"><h2>${esc(t('changeTitle'))}</h2><p class="lede">${esc(t('changeSub'))}</p>${[...byDate.entries()].map(([d, list]) => `<h3>${esc(new Date(d).toLocaleDateString(LANG === 'hi' ? 'hi-IN' : 'en-IN', {day: 'numeric', month: 'long', year: 'numeric'}))}</h3>
    ${list.map(c => `<div class="chg"><span class="pill">${esc(t(tag[c[1]]))}</span> <b>${esc(L2(c[2], c[3]))}</b><p>${esc(L2(c[4], c[5]))}</p></div>`).join('')}`).join('')}</article>`;
});

// ---------- Open data (#27) ----------
addI18n('en', {dataAll: 'All seats, every election (CSV)', dataPick: 'Pick an election', dataCols: 'Columns', dataApi: 'Use it like an API', dataSources: 'Sources and credit', dataLic: 'The official results are public data of the Election Commission of India. The compilation here (name matching, repairs, reconstructed seats) is free to use with credit to Janadesh. Please also credit the sources listed on the How it works page.', dataFlag: 'Seats marked "official winners" have the real winner and runner-up but estimated smaller-party votes.', dataJson: 'JSON', dataCsv: 'CSV'});
addI18n('hi', {dataAll: 'सभी सीटें, हर चुनाव (CSV)', dataPick: 'चुनाव चुनें', dataCols: 'कॉलम', dataApi: 'एपीआई की तरह इस्तेमाल करें', dataSources: 'स्रोत और श्रेय', dataLic: 'आधिकारिक नतीजे भारत निर्वाचन आयोग का सार्वजनिक डेटा हैं। यहाँ का संकलन (नाम मिलान, सुधार, पुनर्निर्मित सीटें) जनादेश को श्रेय देकर मुफ़्त इस्तेमाल के लिए है। कृपया "यह कैसे काम करता है" पन्ने पर दिए स्रोतों को भी श्रेय दें।', dataFlag: '"आधिकारिक विजेता" वाली सीटों में विजेता और उपविजेता असली हैं पर छोटे दलों के वोट अनुमानित हैं।', dataJson: 'JSON', dataCsv: 'CSV'});
const DATA_COLS = [['election_id', 'e.g. ls-2024, ae-delhi-2025', 'जैसे ls-2024, ae-delhi-2025'], ['kind', 'LS (Lok Sabha) or AE (assembly)', 'LS (लोकसभा) या AE (विधानसभा)'], ['state', 'State, or India for the Lok Sabha', 'राज्य, या लोकसभा के लिए India'], ['year, label', 'Election year and label (for two elections in one year, e.g. "2005 (Feb)")', 'चुनाव का साल और लेबल (एक साल में दो चुनाव हों तो जैसे "2005 (Feb)")'],
  ['seat_no, seat_name, category', 'Constituency number, name, and GEN / SC / ST', 'चुनाव क्षेत्र का नंबर, नाम, और GEN / SC / ST'], ['region', 'State (Lok Sabha) or district (assembly), where known', 'राज्य (लोकसभा) या ज़िला (विधानसभा), जहाँ पता हो'], ['total_votes', 'Valid votes counted for the listed candidates plus others', 'सूचीबद्ध उम्मीदवारों और अन्य के गिने गए वैध वोट'],
  ['winner_party, winner_name, winner_votes', 'Winner; the name is blank where no candidate-level source exists', 'विजेता; जहाँ उम्मीदवार-स्तर का स्रोत नहीं वहाँ नाम ख़ाली'], ['runner_up_party, runner_up_name, runner_up_votes', 'Runner-up', 'उपविजेता'], ['margin, margin_pct', 'Votes and percentage points between winner and runner-up', 'विजेता और उपविजेता के बीच वोट और प्रतिशत अंक'], ['status', 'official, official_winners_only (smaller-party votes estimated), or reconstructed', 'official, official_winners_only (छोटे दलों के वोट अनुमानित), या reconstructed']];
PAGES.set('data', async box => {
  let idx = null; try{ const r = await fetch('data/index.json'); idx = await r.json(); }catch(e){}
  const els = idx ? idx.elections : [];
  box.innerHTML = `<article class="page"><h2>${esc(t('dataTitle'))}</h2><p class="lede">${esc(t('dataSub'))}</p>
    <p><a class="btn primary" href="data/all-seats.csv" download>${esc(t('dataAll'))}</a></p>
    <h3>${esc(t('dataPick'))}</h3>
    <div class="tools-row"><select id="dsel" aria-label="${esc(t('dataPick'))}">${els.map(e => `<option value="${e.id}">${esc(e.title)}</option>`).join('')}</select><span id="dlinks"></span></div>
    <p class="small">${esc(t('dataFlag'))}</p>
    <h3>${esc(t('dataApi'))}</h3><pre class="code" id="dapi"></pre>
    <h3>${esc(t('dataCols'))}</h3><table class="tbl"><tbody>${DATA_COLS.map(c => `<tr><td style="white-space:nowrap"><code>${esc(c[0])}</code></td><td>${esc(L2(c[1], c[2]))}</td></tr>`).join('')}</tbody></table>
    <h3>${esc(t('dataSources'))}</h3><p>${esc(t('dataLic'))}</p></article>`;
  const show = () => { const e = els.find(x => x.id === $('#dsel').value); if(!e) return; const base = location.origin + location.pathname.replace(/[^/]*$/, '');
    $('#dlinks').innerHTML = `<a class="btn small" href="${e.json}" download>${esc(t('dataJson'))}</a> <a class="btn small" href="${e.csv}" download>${esc(t('dataCsv'))}</a>`;
    $('#dapi').textContent = `curl ${base}${e.json}\ncurl ${base}data/index.json`; };
  if(els.length){ $('#dsel').onchange = show; show(); }
});
