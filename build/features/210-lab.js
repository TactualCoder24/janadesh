// What-if lab: new party (#59), party split (#60), turnout (#61), sitting-member penalty (#62). The engine reshapes each seat's vote shares (see labApply in engine.js).
addI18n('en', {
  tabLab: 'Lab', labTitle: 'What-if lab', labHint: 'These change who votes for whom in every seat first; the Easy and Vote share tabs then swing from there. Seat counts are compared with the real result. Changing anything here resets the vote-share sliders.', labReset: 'Reset the lab',
  labNewName: 'New party', labFaction: 'New faction', labNP: 'A new party', labNPHint: 'It takes a fraction of the chosen parties\' voters in every seat, so it is strongest where they are strongest.', labName: 'Name', labColour: 'Colour', labShare: 'Vote share nationwide: {v}%', labFrom: 'Takes votes from (tick; none ticked means everyone in proportion)', labWeight: 'weight', labSpread: 'Local variation: {v}%',
  labNPgot: 'The chosen parties do not have enough votes: the new party reaches {v}%.',
  labSplit: 'Split a party', labSplitHint: 'A share of its voters goes to a new faction, a little differently in every seat (as with Shiv Sena and NCP).', labSplitWho: 'Party', labSplitShare: 'Voters going to the faction: {v}%', labFactionName: 'Faction name',
  labTurnout: 'Turnout', labTurnoutHint: 'Voters of a party staying home (or coming out more), or a whole state or district turning out less or more. Votes are rescaled, not the other parties\' shares.', labTOParty: 'Change in {p} voters turning out: {v}%', labTORegion: 'State or district', labTOAdd: 'Add', labTOReg: '{r}: {v}%', labTOPick: 'Pick…',
  labPen: 'Sitting-member penalty', labPenHint: 'Anti-incumbency only where it bites: the party that holds a seat loses points in that seat, not across the whole state.', labPenOn: 'Apply', labPenPts: 'Points lost by the holder of each seat: {v}',
  labBanner: 'What-if lab on: {list}. Compared with the real result.', labBNew: 'new party {n} at {v}%', labBSplit: '{p} splits ({v}% of its voters go to {n})', labBTurn: 'turnout changes', labBPen: 'sitting-member penalty {v} points',
});
addI18n('hi', {
  tabLab: 'लैब', labTitle: 'अगर-मगर लैब', labHint: 'ये पहले हर सीट में तय करते हैं कि कौन किसे वोट देता है; फिर आसान और वोट हिस्सा टैब वहीं से स्विंग लगाते हैं। सीटों की गिनती असली नतीजे से मिलाई जाती है। यहाँ कुछ भी बदलने से वोट-हिस्से के स्लाइडर फिर शुरुआती जगह पर आ जाते हैं।', labReset: 'लैब रीसेट करें',
  labNewName: 'नया दल', labFaction: 'नया धड़ा', labNP: 'नया दल', labNPHint: 'यह चुने हुए दलों के मतदाताओं का एक अंश हर सीट पर ले जाता है, इसलिए वहीं सबसे मज़बूत होता है जहाँ वे मज़बूत हैं।', labName: 'नाम', labColour: 'रंग', labShare: 'देशभर में वोट हिस्सा: {v}%', labFrom: 'किनसे वोट लेता है (टिक करें; कुछ न चुनें तो सबसे अनुपात में)', labWeight: 'भार', labSpread: 'स्थानीय अंतर: {v}%',
  labNPgot: 'चुने हुए दलों के पास इतने वोट नहीं हैं: नया दल {v}% तक पहुँचता है।',
  labSplit: 'किसी दल को तोड़ें', labSplitHint: 'उसके मतदाताओं का एक हिस्सा नए धड़े में जाता है, हर सीट पर थोड़ा अलग (जैसे शिवसेना और राकांपा में)।', labSplitWho: 'दल', labSplitShare: 'धड़े में जाने वाले मतदाता: {v}%', labFactionName: 'धड़े का नाम',
  labTurnout: 'मतदान', labTurnoutHint: 'किसी दल के मतदाताओं का घर बैठना (या ज़्यादा निकलना), या पूरे राज्य या ज़िले का कम-ज़्यादा वोट डालना। वोट पैमाने पर बदलते हैं, दूसरे दलों के हिस्से नहीं।', labTOParty: '{p} के मतदाताओं के निकलने में बदलाव: {v}%', labTORegion: 'राज्य या ज़िला', labTOAdd: 'जोड़ें', labTOReg: '{r}: {v}%', labTOPick: 'चुनें…',
  labPen: 'मौजूदा सदस्य का जुर्माना', labPenHint: 'सत्ता-विरोधी लहर सिर्फ़ वहाँ जहाँ वह चुभती है: सीट पर क़ाबिज़ दल उसी सीट पर अंक खोता है, पूरे राज्य में नहीं।', labPenOn: 'लागू करें', labPenPts: 'हर सीट के क़ाबिज़ दल के खोए अंक: {v}',
  labBanner: 'अगर-मगर लैब चालू: {list}। असली नतीजे से तुलना।', labBNew: 'नया दल {n}, {v}% पर', labBSplit: '{p} टूटता है (उसके {v}% मतदाता {n} में जाते हैं)', labBTurn: 'मतदान में बदलाव', labBPen: 'मौजूदा सदस्य का जुर्माना {v} अंक',
});
function labState(){ if(!S.lab) S.lab = {mom: {on: false}, np: {on: false, name: '', share: 10, color: '#00A6A6', from: {}, spread: 40}, sp: {on: false, key: '', share: 30, name: '', spread: 30}, to: {p: {}, r: {}}, pen: {on: false, pts: 5}}; return S.lab; }
function labChanged(){ S.T = {}; S.locks = {}; S.swing = {a: null, b: null, pts: 0}; S.mc = null; S.pollScn = null; S.whatIf = null; rebuild(); }
function labUnits(){ return U.map((g, k) => ({g, k})).filter(o => o.g.key !== 'OTH' && !o.g.labKind); }
function paneLab(p){
  const L = labState(), us = labUnits(), top = us.slice(0, 8), regs = E.regions || [];
  if(!L.sp.key || !us.some(o => o.g.key === L.sp.key)) L.sp.key = us.length ? us[0].g.key : '';
  const sl = (id, min, max, step, val, lbl) => `<label class="stack" style="gap:2px"><span id="${id}L">${lbl}</span><input type="range" id="${id}" min="${min}" max="${max}" step="${step}" value="${val}"></label>`;
  p.innerHTML = `<div class="stack">
    <div><h3>${esc(t('labTitle'))}</h3><p class="hint">${esc(t('labHint'))}</p></div>
    <div class="swingbox"><label class="row"><input type="checkbox" id="npOn" ${L.np.on ? 'checked' : ''}> <b>${esc(t('labNP'))}</b></label><p class="hint" style="margin:4px 0 8px">${esc(t('labNPHint'))}</p>
      <div class="row"><input class="inp" id="npName" placeholder="${esc(t('labName'))}" value="${esc(L.np.name || '')}" style="flex:1;min-width:120px" aria-label="${esc(t('labName'))}"><input type="color" id="npCol" value="${esc(L.np.color || '#00A6A6')}" aria-label="${esc(t('labColour'))}"></div>
      ${sl('npShare', 0, 40, 0.5, L.np.share, esc(t('labShare', {v: fmt1(L.np.share)})))}
      <p class="hint" style="margin:6px 0 2px">${esc(t('labFrom'))}</p>
      ${top.map(o => { const w = L.np.from[o.g.key]; return `<div class="row" style="margin:2px 0"><label class="row" style="flex:1;gap:6px;min-width:0"><input type="checkbox" data-from="${esc(o.g.key)}" ${w ? 'checked' : ''}><i class="sw" style="background:${o.g.hex}"></i><span style="overflow:hidden;text-overflow:ellipsis;white-space:nowrap">${esc(o.g.name)}</span></label><input class="inp num" type="number" min="0.5" max="5" step="0.5" value="${w || 1}" data-fromw="${esc(o.g.key)}" style="width:62px" aria-label="${esc(t('labWeight'))}" ${w ? '' : 'disabled'}></div>`; }).join('')}
      ${sl('npSpread', 0, 100, 5, L.np.spread == null ? 40 : L.np.spread, esc(t('labSpread', {v: L.np.spread == null ? 40 : L.np.spread})))}
      ${L.np.on && S.labInfo && S.labInfo.np && S.labInfo.np.got < S.labInfo.np.asked - 0.3 ? `<p class="hint" style="color:var(--warn)">${esc(t('labNPgot', {v: fmt1(S.labInfo.np.got)}))}</p>` : ''}</div>
    <div class="swingbox"><label class="row"><input type="checkbox" id="spOn" ${L.sp.on ? 'checked' : ''}> <b>${esc(t('labSplit'))}</b></label><p class="hint" style="margin:4px 0 8px">${esc(t('labSplitHint'))}</p>
      <label class="stack" style="gap:2px"><span>${esc(t('labSplitWho'))}</span><select id="spKey">${us.map(o => `<option value="${esc(o.g.key)}" ${o.g.key === L.sp.key ? 'selected' : ''}>${esc(o.g.name)}</option>`).join('')}</select></label>
      <input class="inp" id="spName" placeholder="${esc(t('labFactionName'))}" value="${esc(L.sp.name || '')}" style="width:100%;margin-top:6px" aria-label="${esc(t('labFactionName'))}">
      ${sl('spShare', 0, 100, 1, L.sp.share, esc(t('labSplitShare', {v: L.sp.share})))}
      ${sl('spSpread', 0, 100, 5, L.sp.spread || 0, esc(t('labSpread', {v: L.sp.spread || 0})))}</div>
    <div class="swingbox"><b>${esc(t('labTurnout'))}</b><p class="hint" style="margin:4px 0 8px">${esc(t('labTurnoutHint'))}</p>
      ${top.slice(0, 6).map(o => `<label class="stack" style="gap:2px"><span id="toP${esc(o.g.key)}L">${esc(t('labTOParty', {p: o.g.name, v: (L.to.p[o.g.key] || 0)}))}</span><input type="range" min="-50" max="50" step="1" value="${L.to.p[o.g.key] || 0}" data-top="${esc(o.g.key)}" style="--c:${o.g.hex}"></label>`).join('')}
      ${regs.length ? `<div class="row" style="margin-top:8px"><select id="toReg" aria-label="${esc(t('labTORegion'))}" style="flex:1;min-width:0"><option value="">${esc(t('labTOPick'))}</option>${regs.map(r => `<option value="${esc(r)}">${esc(stName(r))}</option>`).join('')}</select><input class="inp num" type="number" id="toRegV" aria-label="${esc(t('labTurnout'))} %" min="-50" max="50" step="1" value="-10" style="width:70px"><button class="btn small" id="toRegAdd">${esc(t('labTOAdd'))}</button></div>
      <div class="row" style="margin-top:6px">${Object.entries(L.to.r).filter(([, v]) => v).map(([r, v]) => `<button class="chip" data-torm="${esc(r)}">${esc(t('labTOReg', {r: stName(r), v}))} ×</button>`).join('')}</div>` : ''}</div>
    <div class="swingbox"><label class="row"><input type="checkbox" id="momOn" ${L.mom && L.mom.on ? 'checked' : ''}> <b>${esc(t('labMom'))}</b></label><p class="hint" style="margin:4px 0 0">${esc(t('labMomHint'))}</p></div>
    <div class="swingbox"><label class="row"><input type="checkbox" id="realOn" ${S.real && S.real.on ? 'checked' : ''}> <b>${esc(t('realTitle'))}</b></label><p class="hint" style="margin:4px 0 8px">${esc(t('realHint'))}</p>
      <label class="stack" style="gap:2px"><span id="realML">${esc(t('realMonths', {v: S.real && S.real.months != null ? S.real.months : 24}))}</span><input type="range" id="realM" min="0" max="60" step="1" value="${S.real && S.real.months != null ? S.real.months : 24}"></label>
      <div class="seg" role="group" aria-label="${esc(t('realWave'))}" style="margin-top:6px"><button data-rwave="none" aria-pressed="${(S.wave || 'none') === 'none'}">${esc(t('waveNone'))}</button><button data-rwave="mild" aria-pressed="${S.wave === 'mild'}">${esc(t('waveMild'))}</button><button data-rwave="strong" aria-pressed="${S.wave === 'strong'}">${esc(t('waveStrong'))}</button></div></div>
    <div class="swingbox"><label class="row"><input type="checkbox" id="penOn" ${L.pen.on ? 'checked' : ''}> <b>${esc(t('labPen'))}</b></label><p class="hint" style="margin:4px 0 8px">${esc(t('labPenHint'))}</p>
      ${sl('penPts', 0, 20, 0.5, L.pen.pts, esc(t('labPenPts', {v: fmt1(L.pen.pts)})))}</div>
    <button class="btn small" id="labReset">${esc(t('labReset'))}</button></div>`;
  const on = (id, ev, fn) => { const el = $('#' + id); if(el) el[ev] = fn; };
  on('npOn', 'onchange', e => { L.np.on = e.target.checked; labChanged(); });
  on('npName', 'onchange', e => { L.np.name = e.target.value.trim(); if(L.np.on) labChanged(); });
  on('npCol', 'onchange', e => { L.np.color = e.target.value; if(L.np.on) labChanged(); });
  const slide = (id, key, obj, labFn, apply) => { const el = $('#' + id); if(!el) return; el.oninput = () => { obj[key] = +el.value; $('#' + id + 'L').textContent = labFn(+el.value); }; el.onchange = () => { obj[key] = +el.value; if(apply()) labChanged(); }; };
  slide('npShare', 'share', L.np, v => t('labShare', {v: fmt1(v)}), () => L.np.on);
  slide('npSpread', 'spread', L.np, v => t('labSpread', {v}), () => L.np.on);
  p.querySelectorAll('[data-from]').forEach(c => c.onchange = () => { const k = c.dataset.from; if(c.checked) L.np.from[k] = +(p.querySelector(`[data-fromw="${CSS.escape(k)}"]`).value) || 1; else delete L.np.from[k]; if(L.np.on) labChanged(); else renderPane(); });
  p.querySelectorAll('[data-fromw]').forEach(c => c.onchange = () => { const k = c.dataset.fromw; if(L.np.from[k]){ L.np.from[k] = +c.value || 1; if(L.np.on) labChanged(); } });
  on('spOn', 'onchange', e => { L.sp.on = e.target.checked; labChanged(); });
  on('spKey', 'onchange', e => { L.sp.key = e.target.value; if(L.sp.on) labChanged(); });
  on('spName', 'onchange', e => { L.sp.name = e.target.value.trim(); if(L.sp.on) labChanged(); });
  slide('spShare', 'share', L.sp, v => t('labSplitShare', {v}), () => L.sp.on);
  slide('spSpread', 'spread', L.sp, v => t('labSpread', {v}), () => L.sp.on);
  p.querySelectorAll('[data-top]').forEach(r => { r.oninput = () => { $('#toP' + CSS.escape(r.dataset.top) + 'L') ; const k = r.dataset.top, g = U.find(x => x.key === k); r.parentElement.querySelector('span').textContent = t('labTOParty', {p: g ? g.name : k, v: +r.value}); };
    r.onchange = () => { L.to.p[r.dataset.top] = +r.value; labChanged(); }; });
  on('toRegAdd', 'onclick', () => { const r = $('#toReg').value, v = +$('#toRegV').value; if(!r) return; L.to.r[r] = v; labChanged(); });
  p.querySelectorAll('[data-torm]').forEach(b => b.onclick = () => { delete L.to.r[b.dataset.torm]; labChanged(); });
  on('momOn', 'onchange', e => { L.mom = L.mom || {}; L.mom.on = e.target.checked; labChanged(); });
  on('realOn', 'onchange', e => { S.real = S.real || {on: false, months: 24}; S.real.on = e.target.checked; run(); renderPane(); });
  on('realM', 'oninput', e => { $('#realML').textContent = t('realMonths', {v: e.target.value}); });
  on('realM', 'onchange', e => { S.real = S.real || {on: false, months: 24}; S.real.months = +e.target.value; run(); });
  p.querySelectorAll('[data-rwave]').forEach(b => b.onclick = () => { S.wave = b.dataset.rwave; run(); renderPane(); });
  on('penOn', 'onchange', e => { L.pen.on = e.target.checked; labChanged(); });
  slide('penPts', 'pts', L.pen, v => t('labPenPts', {v: fmt1(v)}), () => L.pen.on);
  on('labReset', 'onclick', () => { S.lab = null; labChanged(); });
}
function renderLabBanner(){
  const el = $('#scnBanner'), L = S.lab; if(!el || !L || !labActive()) return false;
  const bits = [];
  if(L.np && L.np.on) bits.push(t('labBNew', {n: L.np.name || t('labNewName'), v: fmt1(S.labInfo && S.labInfo.np ? S.labInfo.np.got : L.np.share)}));
  if(L.sp && L.sp.on){ const g = U.find(x => x.key === L.sp.key); bits.push(t('labBSplit', {p: g ? g.name : L.sp.key, v: L.sp.share, n: L.sp.name || t('labFaction')})); }
  if(labTurnoutOn(L)) bits.push(t('labBTurn'));
  if(L.mom && L.mom.on) bits.push(t('labBMom'));
  if(L.pen && L.pen.on) bits.push(t('labBPen', {v: fmt1(L.pen.pts)}));
  el.hidden = false; el.textContent = t('labBanner', {list: bits.join('; ')}); return true;
}
