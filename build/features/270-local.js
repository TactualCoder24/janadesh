// City bodies (#72): seats won by each party in the big city corporations, as a lighter hint of urban party strength; also feeds "Signals from other elections".
addI18n('en', {
  toolLocal: 'City bodies', localSub: 'Who won the big city corporations at their last two elections: Delhi, Mumbai, Pune, Hyderabad, Kolkata, Bengaluru, the Gujarat corporations and the heads of Uttar Pradesh\'s urban bodies. From Wikipedia.',
  localLead: '{p} won the most seats in {n} of {m} of these bodies at their latest elections.', localSeats: '{n} seats, {m} for a majority', localBefore: 'Before', localOthers: 'Others', localYear: 'Election', localNo: 'No city results could be loaded.', localGuj: 'Gujarat: {n} corporations', localEach: 'Each corporation',
  localNote: 'City elections are fought on local issues and often go differently from the Lok Sabha and the assembly in the same place: Delhi\'s corporation chose the AAP in 2022 and the BJP won all seven Lok Sabha seats in 2024. Only the top parties in each infobox are listed, so small parties and independents may be missing, and Bengaluru\'s last election was in 2015.',
  sigOther: 'Other signals', sigBy: 'By-elections in this Lok Sabha term ({n}): the BJP gained {a} seats and lost {b}; the Congress gained {c} and lost {d}. They show who won the seat, not the vote share, so they are not added to the swing above.',
  sigLocal: 'City bodies: the BJP won the most seats in {a} of {m} at their latest elections; the Congress in {b}. A lighter hint than assembly results, see "City bodies".',
});
addI18n('hi', {
  toolLocal: 'शहरी निकाय', localSub: 'बड़े नगर निगमों के पिछले दो चुनावों में कौन जीता: दिल्ली, मुंबई, पुणे, हैदराबाद, कोलकाता, बेंगलुरु, गुजरात के निगम और उत्तर प्रदेश के शहरी निकायों के प्रमुख। विकिपीडिया से।',
  localLead: '{m} निकायों में से {n} में ताज़ा चुनाव में {p} को सबसे ज़्यादा सीटें मिलीं।', localSeats: '{n} सीटें, बहुमत के लिए {m}', localBefore: 'पहले', localOthers: 'अन्य', localYear: 'चुनाव', localNo: 'शहरी नतीजे लोड नहीं हो सके।', localGuj: 'गुजरात: {n} निगम', localEach: 'हर निगम',
  localNote: 'शहरी चुनाव स्थानीय मुद्दों पर लड़े जाते हैं और अक्सर उसी जगह के लोकसभा और विधानसभा नतीजों से अलग जाते हैं: दिल्ली के निगम ने 2022 में आप को चुना और 2024 में भाजपा ने सातों लोकसभा सीटें जीतीं। हर इन्फ़ोबॉक्स में सिर्फ़ शीर्ष दल हैं, इसलिए छोटे दल और निर्दलीय छूट सकते हैं, और बेंगलुरु का आख़िरी चुनाव 2015 में हुआ था।',
  sigOther: 'दूसरे संकेत', sigBy: 'इस लोकसभा के दौर के उप-चुनाव ({n}): भाजपा ने {a} सीटें जीतीं और {b} गँवाईं; कांग्रेस ने {c} जीतीं और {d} गँवाईं। ये बताते हैं कि सीट किसने जीती, वोट हिस्सा नहीं, इसलिए ऊपर के स्विंग में नहीं जोड़े गए।',
  sigLocal: 'शहरी निकाय: ताज़ा चुनावों में {m} में से {a} में भाजपा को सबसे ज़्यादा सीटें मिलीं; कांग्रेस को {b} में। यह विधानसभा नतीजों से हल्का संकेत है, "शहरी निकाय" देखें।',
});
let LOCAL = null;
async function localData(){ if(!LOCAL){ try{ LOCAL = await getJSON('ref/localbodies.json'); }catch(e){ LOCAL = {items: []}; } } return LOCAL; }
// the 15 Gujarat corporations count as one entry (their seats added up), so that they do not outvote the big cities
function localGroups(items){
  const out = [], guj = items.filter(it => it.state === 'Gujarat');
  items.forEach(it => { if(it.state !== 'Gujarat') out.push({city: it.city, state: it.state, elections: it.elections, members: null}); });
  if(guj.length){ const m = new Map(); let total = 0; guj.forEach(it => { const e = it.elections[0]; total += e.total; e.parties.forEach(p => m.set(p.p, (m.get(p.p) || 0) + p.seats)); });
    out.splice(Math.min(out.length, 4), 0, {city: t('localGuj', {n: guj.length}), state: 'Gujarat', elections: [{year: guj[0].elections[0].year, total, parties: [...m.entries()].map(([p, seats]) => ({p, seats})).sort((a, b) => b.seats - a.seats)}], members: guj}); }
  return out;
}
const localLeader = it => { const p = it.elections[0].parties.filter(x => x.p !== 'OTH' && x.p !== 'IND').slice().sort((a, b) => b.seats - a.seats)[0]; return p ? p.p : null; };
registerTool({id: 'local', label: 'toolLocal', sub: 'localSub', async render(body, stale){
  const d = await localData(); if(stale()) return;
  const items = localGroups(d.items);
  if(!items.length){ body.innerHTML = `<p class="small">${esc(t('localNo'))}</p>`; return; }
  const cnt = {}; items.forEach(it => { const l = localLeader(it); if(l) cnt[l] = (cnt[l] || 0) + 1; });
  const top = Object.entries(cnt).sort((a, b) => b[1] - a[1])[0];
  const bar = e => { const rest = e.total - e.parties.reduce((a, p) => a + p.seats, 0); const segs = e.parties.filter(p => p.seats > 0).map(p => ({p: p.p, n: p.seats, c: pColor(p.p)})); if(rest > 0) segs.push({p: 'OTH', n: rest, c: '#9aa0aa'});
    return `<div class="lbar" role="img" aria-label="${esc(segs.map(s => pName(s.p) + ' ' + s.n).join(', '))}" style="position:relative;display:flex;height:16px;border-radius:4px;overflow:hidden;background:var(--line)">${segs.map(s => `<i style="width:${100 * s.n / e.total}%;background:${s.c}" title="${esc(pName(s.p))}: ${s.n}"></i>`).join('')}<b style="position:absolute;left:50%;top:-2px;bottom:-2px;width:2px;background:var(--ink);opacity:.55" title="${esc(t('localSeats', {n: e.total, m: Math.floor(e.total / 2) + 1}))}"></b></div>`; };
  const legend = e => e.parties.filter(p => p.seats > 0).map(p => `<span class="lg"><i class="sw" style="background:${pColor(p.p)};display:inline-block;width:10px;height:10px;border-radius:2px;margin-right:4px"></i>${esc(pName(p.p))} <b>${p.seats}</b></span>`).join(' ');
  body.innerHTML = `<p style="font-family:var(--display);font-weight:600;margin:0 0 8px">${esc(t('localLead', {p: top ? pName(top[0]) : '', n: top ? top[1] : 0, m: items.length}))}</p>
    <div class="seatlist" style="max-height:480px">${items.map(it => { const e = it.elections[0], pv = it.elections[1];
      return `<div class="lrow" style="padding:8px 0;border-bottom:1px solid var(--line)"><div style="display:flex;justify-content:space-between;gap:8px;flex-wrap:wrap"><b>${esc(it.city)}</b><span class="small">${esc(stName(it.state))} · ${esc(String(e.year))} · ${esc(t('localSeats', {n: e.total, m: Math.floor(e.total / 2) + 1}))}</span></div>
        ${bar(e)}<div class="small lgd" style="margin-top:3px;display:flex;gap:10px;flex-wrap:wrap">${legend(e)}</div>
        ${pv ? `<div class="small" style="margin-top:2px;color:var(--muted)">${esc(t('localBefore'))} (${esc(String(pv.year))}): ${pv.parties.filter(p => p.seats > 0).slice(0, 4).map(p => esc(pName(p.p)) + ' ' + p.seats).join(' · ')}</div>` : ''}
        ${it.members ? `<details style="margin-top:4px"><summary class="small">${esc(t('localEach'))}</summary>${it.members.map(m => { const me = m.elections[0]; return `<div style="margin:6px 0 2px"><span class="small"><b>${esc(m.city.replace(' (corporation)', ''))}</b> · ${esc(t('localSeats', {n: me.total, m: Math.floor(me.total / 2) + 1}))}</span>${bar(me)}<div class="small lgd" style="display:flex;gap:10px;flex-wrap:wrap">${legend(me)}</div></div>`; }).join('')}</details>` : ''}</div>`; }).join('')}</div>
    <p class="small" style="margin:8px 0 0">${esc(t('localNote'))}</p>`;
  body.querySelectorAll('.lbar i').forEach(i => { i.style.height = '100%'; });
}});
