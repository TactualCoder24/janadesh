// Rajya Sabha projection and the Presidential electoral college (#28), page #/rajyasabha.
// Rajya Sabha seats retire in batches; each batch is refilled by the state assembly of the day (here: its latest result, plus an optional national swing).
// Electoral college: elected MPs (Lok Sabha and Rajya Sabha) and MLAs, with the 1971-census vote value per MLA.
addI18n('en', {
  footRS: 'Rajya Sabha and President', rsTitle: 'Rajya Sabha and the Presidency', rsSub: 'The Rajya Sabha is elected by the state assemblies, a third of it every two years. This page refills every seat whose term ends by the year you pick, using each state\'s latest assembly result, and then counts the votes of the electoral college that elects the President.',
  rsNote: 'Simplified. A batch of seats goes to the sides in proportion to their MLAs (Droop quota, parties voting as blocs). Sides follow the Wikipedia Rajya Sabha party table; parties outside it follow the 2024 Lok Sabha alliances. Nine small states with one seat each, and any seat shown as vacant, are not tracked by term. A swing moves the same points in every assembly and in the Lok Sabha.',
  rsSwing: 'Swing {a} to {b}: {v} points', rsYear: 'Seats ending by', rsNom: 'Nominated members side with', rsNomGov: 'the NDA (the government)', rsNomNone: 'nobody (leave out)', rsNow: 'Rajya Sabha now', rsProj: 'Rajya Sabha after the batches ending by {y}', rsMaj: 'Majority of {n}: {m}', rsElectoral: 'The electoral college for President', rsVotes: '{s}: {v} votes, {p}% of {t}', rsNeed: 'Majority needs {m}. {s} {r} {n} {w}.', rsShort: 'is short by', rsAhead: 'is ahead by', rsMP: 'MP vote value: {v}', rsLS: 'Lok Sabha', rsRS: 'Rajya Sabha', rsMLA: 'MLAs', rsByState: 'Rajya Sabha seats and MLAs by state', rsSeatsNow: 'RS now', rsSeatsThen: 'RS projected', rsMLAs: 'MLAs', rsVal: 'Vote value', rsOthers: 'Others', rsLine: 'NDA {a} · INDIA {b} · others {c}', rsWiki: 'As listed on Wikipedia: NDA {a} · INDIA {b} · others {c}. This page tracks 221 of the 233 elected seats by term and counts the 12 nominated members as you choose, so its totals differ a little.',
});
addI18n('hi', {
  footRS: 'राज्यसभा और राष्ट्रपति', rsTitle: 'राज्यसभा और राष्ट्रपति पद', rsSub: 'राज्यसभा को राज्यों की विधानसभाएँ चुनती हैं, हर दो साल में एक तिहाई। यह पन्ना चुने हुए साल तक जिन सीटों का कार्यकाल ख़त्म होता है उन्हें हर राज्य के ताज़ा विधानसभा नतीजे से भरता है, और फिर राष्ट्रपति को चुनने वाले निर्वाचक-मंडल के वोट गिनता है।',
  rsNote: 'सरलीकृत। सीटों का एक जत्था पक्षों को उनके विधायकों के अनुपात में मिलता है (ड्रूप कोटा, दल गुट की तरह वोट करते हैं)। पक्ष विकिपीडिया की राज्यसभा दल-तालिका से लिए गए हैं; उससे बाहर के दल 2024 की लोकसभा के गठबंधनों के साथ हैं। एक-एक सीट वाले नौ छोटे राज्य, और ख़ाली दिखाई गई सीटें, कार्यकाल के हिसाब से नहीं गिनी गईं। स्विंग हर विधानसभा और लोकसभा में बराबर अंक खिसकाता है।',
  rsSwing: '{a} से {b} की ओर स्विंग: {v} अंक', rsYear: 'इस साल तक ख़त्म होने वाली सीटें', rsNom: 'मनोनीत सदस्य किसके साथ', rsNomGov: 'एनडीए (सरकार)', rsNomNone: 'किसी के नहीं (छोड़ दें)', rsNow: 'अभी राज्यसभा', rsProj: '{y} तक के जत्थों के बाद राज्यसभा', rsMaj: '{n} में बहुमत: {m}', rsElectoral: 'राष्ट्रपति का निर्वाचक-मंडल', rsVotes: '{s}: {v} वोट, {t} में से {p}%', rsNeed: 'बहुमत के लिए {m} चाहिए। {s} {n} {r} {w}।', rsShort: 'से पीछे है', rsAhead: 'से आगे है', rsMP: 'सांसद के वोट का मूल्य: {v}', rsLS: 'लोकसभा', rsRS: 'राज्यसभा', rsMLA: 'विधायक', rsByState: 'राज्यवार राज्यसभा सीटें और विधायक', rsSeatsNow: 'राज्यसभा अभी', rsSeatsThen: 'राज्यसभा अनुमानित', rsMLAs: 'विधायक', rsVal: 'वोट मूल्य', rsOthers: 'अन्य', rsLine: 'एनडीए {a} · इंडिया {b} · अन्य {c}', rsWiki: 'विकिपीडिया की सूची के अनुसार: एनडीए {a} · इंडिया {b} · अन्य {c}। यह पन्ना 233 निर्वाचित सीटों में से 221 को कार्यकाल के हिसाब से गिनता है और 12 मनोनीत सदस्यों को आपके चुनाव के अनुसार, इसलिए योग थोड़े अलग हैं।',
});
// value of one MLA's vote (1971-census formula); the 2022 totals add up to the official 543,231. Jammu and Kashmir: 87-seat value rescaled to 90 seats.
const MLA_VALUE = {'Andhra Pradesh': 159, 'Arunachal Pradesh': 8, 'Assam': 116, 'Bihar': 173, 'Chhattisgarh': 129, 'Delhi': 58, 'Goa': 20, 'Gujarat': 147, 'Haryana': 112, 'Himachal Pradesh': 51, 'Jammu & Kashmir': 70, 'Jharkhand': 176, 'Karnataka': 131, 'Kerala': 152, 'Madhya Pradesh': 131, 'Maharashtra': 175, 'Manipur': 18, 'Meghalaya': 17, 'Mizoram': 8, 'Nagaland': 9, 'Odisha': 149, 'Puducherry': 16, 'Punjab': 116, 'Rajasthan': 129, 'Sikkim': 7, 'Tamil Nadu': 176, 'Telangana': 132, 'Tripura': 26, 'Uttar Pradesh': 208, 'Uttarakhand': 64, 'West Bengal': 151};
const RS_STATE = {'Jammu and Kashmir': 'Jammu & Kashmir'};
function droop(n, v){ // seats for a batch of n, by side votes v = {side: MLAs}
  const tot = Object.values(v).reduce((a, b) => a + b, 0), out = {}; if(!tot || n <= 0) return out;
  const q = Math.floor(tot / (n + 1)) + 1; let used = 0; const rem = [];
  Object.entries(v).forEach(([k, x]) => { const s = Math.floor(x / q); out[k] = s; used += s; rem.push([k, x - s * q]); });
  rem.sort((a, b) => b[1] - a[1]); for(let i = 0; used < n; i++, used++) out[rem[i % rem.length][0]]++;
  return out;
}
PAGES.set('rajyasabha', async box => {
  box.innerHTML = `<article class="page" style="max-width:1100px"><h2>${esc(t('rsTitle'))}</h2><p class="lede">${esc(t('rsSub'))}</p><p class="small">${esc(t('rsNote'))}</p><div id="rsBody"><span class="loading"><i></i>${esc(t('onoeRun'))}</span></div></article>`;
  const RS = await getJSON('ref/rajyasabha.json'), ix = INDEX.elections, ls = await bundle('ls'), lsEnt = ix.filter(e => e.kind === 'LS').sort((a, b) => b.year - a.year)[0], lsRaw = ls.find(e => e.id === lsEnt.id), alli = lsRaw.alliances || {};
  const latest = new Map(); ix.filter(e => e.kind === 'AE').forEach(e => { const l = latest.get(e.state); if(!l || e.year > l.year || (e.year === l.year && e.label > l.label)) latest.set(e.state, e); });
  const raws = []; for(const [st, ent] of latest){ const b = await bundle(ent.file); raws.push({st, ent, raw: b.find(e => e.id === ent.id)}); }
  const sideCode = c => RS.sideOf[c] || (alli[c] === 'NDA' ? 'NDA' : alli[c] === 'INDIA' ? 'INDIA' : 'OTH');
  const sideOf = c => { const s = sideCode(c); return s === 'NDA' ? 'NDA' : s === 'INDIA' ? 'INDIA' : null; };
  const state = {pts: S.rsPts != null ? S.rsPts : 0, year: S.rsYear || 2032, nom: S.rsNom || 'gov'};
  const sk = k => k === 'NDA' ? 'A' : k === 'INDIA' ? 'B' : 'O';
  const colr = k => k === 'NDA' ? pColor('BJP') : k === 'INDIA' ? pColor('INC') : '#9aa0aa';
  function draw(){
    const asm = new Map(); raws.forEach(o => { const r = silentRun(o.raw, 'party', state.pts, sideOf, 'NDA', 'INDIA'); asm.set(o.st, {NDA: r.bySide.A, INDIA: r.bySide.B, OTH: r.bySide.O, n: r.N}); });
    const lsR = silentRun(lsRaw, 'party', state.pts, sideOf, 'NDA', 'INDIA'), lsSide = {NDA: lsR.bySide.A, INDIA: lsR.bySide.B, OTH: lsR.bySide.O};
    const lead = st => { const a = asm.get(st); return a ? ['NDA', 'INDIA', 'OTH'].sort((x, y) => a[y] - a[x])[0] : 'OTH'; };
    // Rajya Sabha now and projected
    const now = {NDA: 0, INDIA: 0, OTH: 0}, proj = {NDA: 0, INDIA: 0, OTH: 0}, byState = [], cut = state.year + '-12-31';
    Object.entries(RS.states).forEach(([sn, mem]) => { const st = RS_STATE[sn] || sn, a = asm.get(st); const cn = {NDA: 0, INDIA: 0, OTH: 0}, cp = {NDA: 0, INDIA: 0, OTH: 0}, batches = new Map();
      mem.forEach(m => { const sd = sideCode(m.p); cn[sd]++; if(m.end <= cut && a){ const b = batches.get(m.end) || 0; batches.set(m.end, b + 1); } else cp[sd]++; });
      batches.forEach(nn => { const g = droop(nn, {NDA: a.NDA, INDIA: a.INDIA, OTH: a.OTH}); Object.entries(g).forEach(([k, v]) => cp[k] += v); });
      Object.keys(cn).forEach(k => { now[k] += cn[k]; proj[k] += cp[k]; }); byState.push({st, cn, cp, n: mem.length}); });
    const small = ['Arunachal Pradesh', 'Goa', 'Manipur', 'Meghalaya', 'Mizoram', 'Nagaland', 'Sikkim', 'Tripura', 'Puducherry'];
    small.forEach(st => { const l = lead(st); now[l]++; proj[l]++; byState.push({st, cn: {NDA: l === 'NDA' ? 1 : 0, INDIA: l === 'INDIA' ? 1 : 0, OTH: l === 'OTH' ? 1 : 0}, cp: {NDA: l === 'NDA' ? 1 : 0, INDIA: l === 'INDIA' ? 1 : 0, OTH: l === 'OTH' ? 1 : 0}, n: 1}); });
    const nomN = RS.nominated.length, nomNow = state.nom === 'gov' ? {NDA: nomN} : {}; if(state.nom === 'gov'){ now.NDA += nomN; proj.NDA += nomN; }
    const rsTotNow = now.NDA + now.INDIA + now.OTH, rsTot = proj.NDA + proj.INDIA + proj.OTH, rsMaj = Math.floor(rsTot / 2) + 1;
    // electoral college: elected MPs and MLAs; nominated members do not vote
    const mpsRS = {NDA: proj.NDA - (state.nom === 'gov' ? nomN : 0), INDIA: proj.INDIA, OTH: proj.OTH}, totalMLAvalue = [...asm.entries()].reduce((a, [st, x]) => a + (MLA_VALUE[st] || 0) * x.n, 0), mpTotal = 543 + (rsTot - (state.nom === 'gov' ? nomN : 0));
    const mpv = Math.round(totalMLAvalue / mpTotal), val = {NDA: 0, INDIA: 0, OTH: 0}, parts = {NDA: {ls: lsSide.NDA * mpv, rs: mpsRS.NDA * mpv, mla: 0}, INDIA: {ls: lsSide.INDIA * mpv, rs: mpsRS.INDIA * mpv, mla: 0}, OTH: {ls: lsSide.OTH * mpv, rs: mpsRS.OTH * mpv, mla: 0}};
    asm.forEach((x, st) => ['NDA', 'INDIA', 'OTH'].forEach(k => parts[k].mla += x[k] * (MLA_VALUE[st] || 0)));
    ['NDA', 'INDIA', 'OTH'].forEach(k => val[k] = parts[k].ls + parts[k].rs + parts[k].mla);
    const total = val.NDA + val.INDIA + val.OTH, need = Math.floor(total / 2) + 1, gap = val.NDA - need;
    const bar = (k, w) => `<i style="width:${100 * w}%;background:${colr(k)}"></i>`;
    const stack = (obj, tot, maj) => `<div class="bar" style="height:20px;position:relative">${['NDA', 'OTH', 'INDIA'].map(k => bar(k, obj[k] / tot)).join('')}<u style="position:absolute;top:-3px;bottom:-3px;left:${100 * (maj - .5) / tot}%;width:2px;background:var(--ink)"></u></div>`;
    const nm = k => k === 'NDA' ? 'NDA' : k === 'INDIA' ? (LANG === 'hi' ? 'इंडिया' : 'INDIA') : t('rsOthers');
    $('#rsBody').innerHTML = `<div class="tools-row"><label style="flex:1;min-width:230px"><span id="rsPL">${esc(t('rsSwing', {a: 'NDA', b: LANG === 'hi' ? 'इंडिया' : 'INDIA', v: (state.pts > 0 ? '+' : '') + state.pts}))}</span> <input type="range" id="rsP" min="-8" max="8" step="0.5" value="${state.pts}" style="width:100%"></label>
      <label>${esc(t('rsYear'))} <select id="rsY">${[2026, 2027, 2028, 2029, 2030, 2031, 2032].map(y => `<option ${y === state.year ? 'selected' : ''}>${y}</option>`).join('')}</select></label>
      <label>${esc(t('rsNom'))} <select id="rsN"><option value="gov" ${state.nom === 'gov' ? 'selected' : ''}>${esc(t('rsNomGov'))}</option><option value="none" ${state.nom === 'none' ? 'selected' : ''}>${esc(t('rsNomNone'))}</option></select></label></div>
      <div class="tools-cols"><div><h3>${esc(t('rsNow'))}</h3>${stack(now, rsTotNow, Math.floor(rsTotNow / 2) + 1)}<p style="margin:4px 0;font-family:var(--display);font-weight:600">${esc(t('rsLine', {a: now.NDA, b: now.INDIA, c: now.OTH}))}</p><p class="small" style="margin:0 0 6px">${esc(t('rsWiki', {a: RS.summary.NDA, b: RS.summary.INDIA, c: RS.summary.OTH}))}</p>
        <h3>${esc(t('rsProj', {y: state.year}))}</h3>${stack(proj, rsTot, rsMaj)}<p style="margin:4px 0;font-family:var(--display);font-size:19px;font-weight:700">${esc(t('rsLine', {a: proj.NDA, b: proj.INDIA, c: proj.OTH}))}</p><p class="small" style="margin:0">${esc(t('rsMaj', {n: rsTot, m: rsMaj}))}</p></div>
        <div><h3>${esc(t('rsElectoral'))}</h3>${stack(val, total, need)}
          <p style="margin:6px 0 2px;font-family:var(--display);font-size:19px;font-weight:700">${esc(t('rsVotes', {s: 'NDA', v: fmtN(val.NDA), p: fmt1(100 * val.NDA / total), t: fmtN(total)}))}</p>
          <p style="margin:0;color:${gap >= 0 ? 'var(--good)' : 'var(--bad)'};font-weight:600">${esc(t('rsNeed', {m: fmtN(need), s: 'NDA', r: gap >= 0 ? t('rsAhead') : t('rsShort'), n: fmtN(Math.abs(gap)), w: LANG === 'hi' ? 'वोट' : 'votes'}))}</p>
          <p class="small" style="margin:6px 0 0">${['NDA', 'INDIA', 'OTH'].map(k => `${esc(nm(k))}: ${esc(t('rsLS'))} ${fmtN(parts[k].ls)} · ${esc(t('rsRS'))} ${fmtN(parts[k].rs)} · ${esc(t('rsMLA'))} ${fmtN(parts[k].mla)}`).join('<br>')}<br>${esc(t('rsMP', {v: mpv}))}</p></div></div>
      <h3>${esc(t('rsByState'))}</h3><div class="seatlist" style="max-height:460px"><table class="tbl"><thead><tr><th>${esc(t('thRegion'))}</th><th>${esc(t('rsSeatsNow'))} (NDA / INDIA / ${esc(t('rsOthers'))})</th><th>${esc(t('rsSeatsThen'))}</th><th>${esc(t('rsMLAs'))} (NDA / INDIA / ${esc(t('rsOthers'))})</th><th>${esc(t('rsVal'))}</th></tr></thead><tbody>
      ${byState.sort((a, b) => b.n - a.n).map(r => { const a = asm.get(r.st) || {NDA: 0, INDIA: 0, OTH: 0}; return `<tr><td>${esc(stName(r.st))}</td><td class="num">${r.cn.NDA} / ${r.cn.INDIA} / ${r.cn.OTH}</td><td class="num"><b>${r.cp.NDA} / ${r.cp.INDIA} / ${r.cp.OTH}</b></td><td class="num">${a.NDA} / ${a.INDIA} / ${a.OTH}</td><td class="num">${MLA_VALUE[r.st] || ''}</td></tr>`; }).join('')}</tbody></table></div>`;
    $('#rsP').oninput = e => { $('#rsPL').textContent = t('rsSwing', {a: 'NDA', b: LANG === 'hi' ? 'इंडिया' : 'INDIA', v: (+e.target.value > 0 ? '+' : '') + e.target.value}); };
    $('#rsP').onchange = e => { state.pts = +e.target.value; S.rsPts = state.pts; draw(); };
    $('#rsY').onchange = e => { state.year = +e.target.value; S.rsYear = state.year; draw(); };
    $('#rsN').onchange = e => { state.nom = e.target.value; S.rsNom = state.nom; draw(); };
    alignTables($('#rsBody'));
  }
  draw();
});
