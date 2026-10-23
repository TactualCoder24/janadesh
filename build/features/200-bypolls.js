// Bypoll tracker (#24): by-elections since the 2024 Lok Sabha result, with a party scoreboard and what they may suggest.
addI18n('en', {
  toolBy: 'By-elections', bySub: 'Seats filled by by-election since 2014, in the 16th, 17th and 18th Lok Sabha terms: who held the seat, who won it, and which changed hands. Older ones show the winner only, without vote counts. From Wikipedia; it may miss a few.', byScope: 'Where', byAllIndia: 'All of India', byOnlyChanged: 'Only seats that changed hands',
  bySummary: '{n} by-elections {d}: {c} changed hands ({p}%), {h} were held by the party that had the seat.', byBoard: 'Scoreboard', byDef: 'Held before', byHeld: 'Held', byLost: 'Lost', byGained: 'Gained', byNet: 'Net', byNow: 'Hold now',
  byRead: 'What they suggest', bySugg1: '{p} gained {g} seats and lost {l}, a net {n} compared with the seats it held before these by-elections.', byCaution: 'Read with care: a by-election fills one vacant seat, the party in power often wins them, and turnout and local reasons matter. They are a weak signal for the next general election, and a stronger one only when the same pattern repeats across many states.',
  thBefore: 'Before', thAfter: 'After', thDate: 'Date', byNone: 'No by-elections in this selection.', byReason: 'Reason', byLS: 'Lok Sabha',
  byTerm: 'Period', byT18: 'Since June 2024 (18th Lok Sabha)', byT17: '2019 to 2024 (17th)', byT16: '2014 to 2019 (16th)', byTAll: 'All since 2014', byD18: 'since June 2024', byD17: 'from 2019 to 2024', byD16: 'from 2014 to 2019', byDAll: 'since 2014',
});
addI18n('hi', {
  toolBy: 'उप-चुनाव', bySub: '2014 से उप-चुनाव में भरी गई सीटें, 16वीं, 17वीं और 18वीं लोकसभा के दौर में: सीट किसके पास थी, कौन जीता और कौन-सी सीट हाथ बदल गई। पुराने उप-चुनावों में सिर्फ़ विजेता है, वोट-संख्या नहीं। विकिपीडिया से; कुछ छूट सकती हैं।', byScope: 'कहाँ', byAllIndia: 'पूरा भारत', byOnlyChanged: 'सिर्फ़ हाथ बदलने वाली सीटें',
  bySummary: '{d} {n} उप-चुनाव: {c} सीटों ने हाथ बदला ({p}%), {h} उसी दल के पास रहीं जिसके पास थीं।', byBoard: 'स्कोरबोर्ड', byDef: 'पहले के पास', byHeld: 'बचाईं', byLost: 'गँवाईं', byGained: 'जीतीं', byNet: 'शुद्ध', byNow: 'अब के पास',
  byRead: 'ये क्या इशारा करते हैं', bySugg1: '{p} ने {g} सीटें जीतीं और {l} गँवाईं, यानी इन उप-चुनावों से पहले अपनी सीटों के मुक़ाबले शुद्ध {n}।', byCaution: 'सावधानी से पढ़ें: उप-चुनाव एक ख़ाली सीट भरता है, सत्ताधारी दल अक्सर उन्हें जीतता है, और मतदान तथा स्थानीय कारण मायने रखते हैं। अगले आम चुनाव के लिए यह कमज़ोर संकेत है, और मज़बूत तभी जब कई राज्यों में वही रुझान दोहराए।',
  thBefore: 'पहले', thAfter: 'बाद में', thDate: 'तारीख़', byNone: 'इस चयन में कोई उप-चुनाव नहीं।', byReason: 'कारण', byLS: 'लोकसभा',
  byTerm: 'अवधि', byT18: 'जून 2024 से (18वीं लोकसभा)', byT17: '2019 से 2024 (17वीं)', byT16: '2014 से 2019 (16वीं)', byTAll: '2014 से अब तक सब', byD18: 'जून 2024 से', byD17: '2019 से 2024 के बीच', byD16: '2014 से 2019 के बीच', byDAll: '2014 से',
});
let BYP = null;
async function bypollData(){ if(!BYP){ try{ BYP = await getJSON('ref/bypolls.json'); }catch(e){ BYP = {items: [], since: ''}; } } return BYP; }
registerTool({id: 'bypolls', label: 'toolBy', sub: 'bySub', key: () => S.eid + '|' + S.kind + '|' + (S.byScope || '') + '|' + (S.byTerm != null ? S.byTerm : '-') + '|' + (S.byChanged ? 1 : 0), async render(body, stale){
  const d = await bypollData(); if(stale()) return;
  const states = [...new Set(d.items.map(i => i.state))].sort();
  const scope = S.byScope != null ? S.byScope : (S.kind === 'AE' && states.includes(S.state) ? S.state : '');
  const term = S.byTerm != null ? S.byTerm : (scope ? '' : '18');
  let items = d.items.filter(i => (!scope || i.state === scope) && (!term || String(i.term) === term));
  const all = items;
  if(S.byChanged) items = items.filter(i => i.changed);
  const n = all.length, ch = all.filter(i => i.changed).length, held = all.filter(i => i.prevParty && i.winParty && !i.changed).length;
  const parties = new Map(); const get = p => { if(!parties.has(p)) parties.set(p, {def: 0, held: 0, lost: 0, gained: 0}); return parties.get(p); };
  all.forEach(i => { if(i.prevParty){ const a = get(i.prevParty); a.def++; if(i.winParty === i.prevParty) a.held++; else a.lost++; } if(i.winParty && i.winParty !== i.prevParty) get(i.winParty).gained++; });
  const board = [...parties.entries()].map(([p, a]) => ({p, ...a, net: a.gained - a.lost, now: a.def - a.lost + a.gained})).sort((x, y) => y.now - x.now || y.def - x.def).slice(0, 10);
  const top = board.slice().sort((a, b) => b.net - a.net)[0], bot = board.slice().sort((a, b) => a.net - b.net)[0];
  const fmtNet = v => (v > 0 ? '+' : '') + v;
  const short = x => x.reason ? x.reason.replace(/\s+on\s.*$/i, '').replace(/^Elected to .*$/i, 'Elected to Lok Sabha/other house').slice(0, 34) : '';
  body.innerHTML = `<div class="tools-row"><label>${esc(t('byTerm'))} <select id="byTerm">${[['18', 'byT18'], ['17', 'byT17'], ['16', 'byT16'], ['', 'byTAll']].map(o => `<option value="${o[0]}" ${o[0] === term ? 'selected' : ''}>${esc(t(o[1]))}</option>`).join('')}</select></label>
      <label>${esc(t('byScope'))} <select id="byScope"><option value="">${esc(t('byAllIndia'))}</option>${states.map(s => `<option value="${esc(s)}" ${s === scope ? 'selected' : ''}>${esc(stName(s))}</option>`).join('')}</select></label>
      <label><input type="checkbox" id="byCh" ${S.byChanged ? 'checked' : ''}> ${esc(t('byOnlyChanged'))}</label></div>
    ${n ? `<p style="font-family:var(--display);font-weight:600;margin:0 0 8px">${esc(t('bySummary', {n, d: t(term ? 'byD' + term : 'byDAll'), c: ch, p: Math.round(100 * ch / n), h: held}))}</p>
    <div class="tools-cols"><div><h4>${esc(t('byBoard'))}</h4><table class="tbl"><thead><tr><th>${esc(t('thParty2'))}</th><th>${esc(t('byDef'))}</th><th>${esc(t('byLost'))}</th><th>${esc(t('byGained'))}</th><th>${esc(t('byNet'))}</th><th>${esc(t('byNow'))}</th></tr></thead><tbody>
      ${board.map(b => `<tr><td>${pcell(b.p)}</td><td class="num">${b.def}</td><td class="num">${b.lost}</td><td class="num">${b.gained}</td><td class="num ${b.net > 0 ? 'up' : b.net < 0 ? 'down' : ''}"><b>${fmtNet(b.net)}</b></td><td class="num">${b.now}</td></tr>`).join('')}</tbody></table></div>
      <div><h4>${esc(t('byRead'))}</h4>${top && top.net !== 0 ? `<p>${esc(t('bySugg1', {p: pName(top.p), g: top.gained, l: top.lost, n: fmtNet(top.net)}))}</p>` : ''}${bot && bot !== top && bot.net < 0 ? `<p>${esc(t('bySugg1', {p: pName(bot.p), g: bot.gained, l: bot.lost, n: fmtNet(bot.net)}))}</p>` : ''}<p class="small">${esc(t('byCaution'))}</p></div></div>` : `<p class="small">${esc(t('byNone'))}</p>`}
    ${items.length ? `<h4 style="margin-top:12px">${esc(t('toolBy'))}</h4><div class="seatlist" style="max-height:420px"><table class="tbl"><thead><tr><th>${esc(t('thDate'))}</th><th>${esc(t('thSeatN'))}</th><th>${esc(t('thBefore'))}</th><th>${esc(t('thAfter'))}</th><th>${esc(t('byReason'))}</th></tr></thead><tbody>
      ${items.slice().reverse().map(i => `<tr><td class="num" style="white-space:nowrap">${esc(i.date)}</td><td><b>${esc(i.seat)}</b>${i.kind === 'LS' ? ` <span class="pill">${esc(t('byLS'))}</span>` : ''}<div class="small">${esc(stName(i.state))}</div></td><td>${i.prevParty ? pcell(i.prevParty) : ''}<div class="small">${esc(i.prev)}</div></td><td>${i.winParty ? pcell(i.winParty) : ''}<div class="small">${esc(i.winner)}${i.changed ? ' ▲' : ''}</div></td><td class="small">${esc(short(i))}</td></tr>`).join('')}</tbody></table></div>` : ''}`;
  alignTables(body);
  $('#byTerm').onchange = e => { S.byTerm = e.target.value; toolKeyShown = null; toolsTouch(true); };
  $('#byScope').onchange = e => { S.byScope = e.target.value; toolKeyShown = null; toolsTouch(true); };
  $('#byCh').onchange = e => { S.byChanged = e.target.checked; toolKeyShown = null; toolsTouch(true); };
}});
