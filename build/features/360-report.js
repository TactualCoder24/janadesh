// PDF report (#44): a printable report of the scenario on screen. It opens the browser's print dialog, where "Save as PDF" makes the file.
addI18n('en', {
  rpBtn: 'PDF report', rpTitle: 'Janadesh simulation report', rpDate: 'Made on {d}', rpTally: 'Seats and votes', rpMap: 'Map', rpAssume: 'What was assumed', rpFlips: 'Seats that change hands', rpFlipsNone: 'No seat changes hands compared with {y}.', rpFlipsNote: '{n} of {m} seats; the narrowest are listed',
  rpRegions: 'Where the seats move', rpMode: 'View', rpMethod: 'Swing method', rpShares: 'Vote shares used', rpNothing: 'No changes: this is the real result.', rpTransfer: 'Vote transfer between allies: {n}%', rpOverrides: '{n} seats forced by hand', rpLocks: '{n} vote shares held fixed',
  rpWave: 'Wave setting: {w}', rpLab: 'What-if lab: {l}', rpLink: 'Open this scenario', rpFoot: 'Simulation only. Made by applying vote shares to past constituency results; it is not a real result, an exit poll or a forecast.', rpMargin: 'Margin', rpSeat: 'Seat', rpFrom: 'From', rpTo: 'To', rpBase: '{y} result',
  rpPrinting: 'Opening the print dialog. Choose "Save as PDF" as the printer.',
});
addI18n('hi', {
  rpBtn: 'पीडीएफ़ रिपोर्ट', rpTitle: 'जनादेश सिम्युलेशन रिपोर्ट', rpDate: '{d} को बनी', rpTally: 'सीटें और वोट', rpMap: 'नक्शा', rpAssume: 'क्या मान लिया गया', rpFlips: 'हाथ बदलने वाली सीटें', rpFlipsNone: '{y} की तुलना में कोई सीट हाथ नहीं बदलती।', rpFlipsNote: '{m} में से {n} सीटें; सबसे कम अंतर वाली दिखाई गई हैं',
  rpRegions: 'सीटें कहाँ खिसकती हैं', rpMode: 'दृश्य', rpMethod: 'स्विंग का तरीक़ा', rpShares: 'इस्तेमाल हुए वोट हिस्से', rpNothing: 'कोई बदलाव नहीं: यह असली नतीजा है।', rpTransfer: 'सहयोगियों के बीच वोट ट्रांसफ़र: {n}%', rpOverrides: '{n} सीटें हाथ से तय', rpLocks: '{n} वोट हिस्से स्थिर रखे',
  rpWave: 'लहर की सेटिंग: {w}', rpLab: 'अगर-मगर लैब: {l}', rpLink: 'यह परिदृश्य खोलें', rpFoot: 'सिर्फ़ सिम्युलेशन। पिछले चुनाव-क्षेत्र नतीजों पर वोट हिस्से लगाकर बना है; यह असली नतीजा, एग्ज़िट पोल या पूर्वानुमान नहीं है।', rpMargin: 'अंतर', rpSeat: 'सीट', rpFrom: 'से', rpTo: 'को', rpBase: '{y} का नतीजा',
  rpPrinting: 'प्रिंट खुल रहा है। प्रिंटर में "पीडीएफ़ के रूप में सहेजें" चुनें।',
});
function reportHTML(){
  const ent = entry(), maj = Math.floor(E.N / 2) + 1, order = seatOrder(), yr = S.next ? nextYear(ent) : ent.label, base = ent.label;
  const hemi = document.createElement('div'); drawHemicycle(hemi, order.map(k => ({n: RES.counts[k], c: U[k].hex})), E.N, maj, RES.counts[order[0]], t('needed', {n: maj}));
  const rows = U.map((g, k) => k).filter(k => RES.counts[k] > 0 || RES.T[k] >= 0.5 || U[k].baseSeats > 0).sort((a, b) => RES.counts[b] - RES.counts[a] || RES.T[b] - RES.T[a]);
  const tally = `<table class="rptbl"><thead><tr><th>${esc(S.mode === 'alliance' ? t('thAlly') : t('thParty'))}</th><th>${esc(t('thVotes'))}</th><th>${esc(t('thSeats'))}</th><th>${esc(t('rpBase', {y: base}))}</th><th>${esc(t('thSwing'))}</th></tr></thead><tbody>${rows.map(k => { const g = U[k], ds = RES.counts[k] - g.baseSeats, dv = RES.T[k] - g.base;
    return `<tr><td><i class="rpsw" style="background:${g.hex}"></i>${esc(g.name)}</td><td class="n">${fmt1(RES.T[k])}%</td><td class="n"><b>${RES.counts[k]}</b> <span class="d">${ds ? (ds > 0 ? '+' : '') + ds : ''}</span></td><td class="n">${g.baseSeats}</td><td class="n">${dv >= 0 ? '+' : ''}${fmt1(dv)}</td></tr>`; }).join('')}</tbody></table>`;
  // assumptions
  const bits = [];
  const shown = U.map((g, k) => ({g, k})).filter(o => Math.abs(RES.T[o.k] - o.g.base) >= 0.05);
  bits.push(`${t('rpMode')}: ${t(S.mode === 'alliance' ? 'modeAlly' : 'modeParty')}`);
  bits.push(`${t('rpMethod')}: ${t(S.method === 'core' ? 'coreM' : S.method === 'prop' ? 'methProp' : 'methUnif')}`);
  if(S.mode === 'alliance' && S.transfer !== 100) bits.push(t('rpTransfer', {n: S.transfer}));
  if(Object.keys(S.overrides || {}).length) bits.push(t('rpOverrides', {n: Object.keys(S.overrides).length}));
  if(Object.values(S.locks || {}).some(Boolean)) bits.push(t('rpLocks', {n: Object.values(S.locks).filter(Boolean).length}));
  if(S.wave && S.wave !== 'none') bits.push(t('rpWave', {w: t(S.wave === 'strong' ? 'waveStrong' : 'waveMild')}));
  if(typeof labActive === 'function' && labActive()){ const L = S.lab || {}, on = []; if(L.np && L.np.on) on.push(t('labNP')); if(L.sp && L.sp.on) on.push(t('labSplit')); if(L.pen && L.pen.on) on.push(t('labPen')); if(L.mom && L.mom.on) on.push(t('labMom')); if(typeof labTurnoutOn === 'function' && labTurnoutOn(L)) on.push(t('labTurnout')); bits.push(t('rpLab', {l: on.join(', ')})); }
  const shares = shown.length ? `<p class="rpp"><b>${esc(t('rpShares'))}:</b> ${shown.sort((a, b) => RES.T[b.k] - RES.T[a.k]).slice(0, 10).map(o => `${esc(o.g.name)} ${fmt1(o.g.base)}% → <b>${fmt1(RES.T[o.k])}%</b>`).join(' · ')}</p>` : `<p class="rpp">${esc(t('rpNothing'))}</p>`;
  // seats that change hands, narrowest first
  const flips = RES.win.map((w, i) => ({w, i})).filter(o => o.w !== E.baseWin[o.i]).map(o => ({i: o.i, w: o.w, was: E.baseWin[o.i], m: 100 * (RES.shares[o.i][o.w] - RES.shares[o.i][RES.second[o.i]])})).sort((a, b) => a.m - b.m);
  const flipHTML = flips.length ? `<p class="small rpp">${esc(t('rpFlipsNote', {n: flips.length, m: E.seats.length}))}</p><table class="rptbl"><thead><tr><th>${esc(t('rpSeat'))}</th><th>${esc(t('rpFrom'))}</th><th>${esc(t('rpTo'))}</th><th>${esc(t('rpMargin'))}</th></tr></thead><tbody>${flips.slice(0, 14).map(f => `<tr><td>${esc(E.seats[f.i].name)}${S.kind === 'LS' && E.seats[f.i].r >= 0 ? ` <span class="d">${esc(stName(E.regions[E.seats[f.i].r]))}</span>` : ''}</td><td><i class="rpsw" style="background:${U[f.was].hex}"></i>${esc(shortName(U[f.was]))}</td><td><i class="rpsw" style="background:${U[f.w].hex}"></i>${esc(shortName(U[f.w]))}</td><td class="n">${fmt1(f.m)}</td></tr>`).join('')}</tbody></table>` : `<p class="rpp">${esc(t('rpFlipsNone', {y: base}))}</p>`;
  // regions with the most movement
  let regHTML = '';
  if(E.regions.length){
    const agg = E.regions.map(() => ({d: new Map(), tot: 0}));
    flips.forEach(f => { const r = E.seats[f.i].r; if(r < 0) return; const a = agg[r]; a.d.set(f.w, (a.d.get(f.w) || 0) + 1); a.d.set(f.was, (a.d.get(f.was) || 0) - 1); a.tot++; });
    const top = agg.map((a, r) => ({r, a})).filter(x => x.a.tot > 0).sort((x, y) => y.a.tot - x.a.tot).slice(0, 8);
    if(top.length) regHTML = `<h3>${esc(t('rpRegions'))}</h3><table class="rptbl"><tbody>${top.map(x => `<tr><td>${esc(stName(E.regions[x.r]))}</td><td>${x.a.tot}</td><td>${[...x.a.d.entries()].filter(e => e[1]).sort((p, q) => q[1] - p[1]).slice(0, 4).map(([k, v]) => `${esc(shortName(U[k]))} ${v > 0 ? '+' : ''}${v}`).join(', ')}</td></tr>`).join('')}</tbody></table>`;
  }
  const svg = $('#map svg'), mapHTML = svg && svg.querySelector('path.seat') ? `<h3>${esc(t('rpMap'))}</h3><div class="map rpmap">${svg.outerHTML}</div><div class="rplegend">${U.map((g, k) => k).filter(k => RES.counts[k] > 0).sort((a, b) => RES.counts[b] - RES.counts[a]).map(k => `<span><i class="rpsw" style="background:${U[k].hex}"></i>${esc(U[k].name)} ${RES.counts[k]}</span>`).join('')}</div>` : '';
  return `<article class="rp"><header><div class="rpbrand">JANADESH <span>जनादेश</span></div><div class="rpdate">${esc(t('rpDate', {d: new Date().toLocaleDateString(LANG === 'hi' ? 'hi-IN' : 'en-IN', {day: 'numeric', month: 'long', year: 'numeric'})}))}</div></header>
    <h1>${esc($('#title').textContent)}</h1><p class="rpverdict">${esc($('#verdict').textContent.trim())}</p>
    <div class="rphemi">${hemi.innerHTML}</div>
    <h3>${esc(t('rpTally'))}</h3>${tally}
    ${mapHTML}
    <h3>${esc(t('rpFlips'))}</h3>${flipHTML}
    ${regHTML}
    <h3>${esc(t('rpAssume'))}</h3><ul class="rpul">${bits.map(b => `<li>${esc(b)}</li>`).join('')}</ul>${shares}
    <p class="rpp"><b>${esc(t('rpLink'))}:</b> <span class="rplink">${esc(shareURL())}</span></p>
    <p class="rpfoot">${esc(t('rpFoot'))}</p></article>`;
}
function printReport(){
  if(!E || !RES){ return; }
  let root = $('#printRoot'); if(!root){ root = document.createElement('div'); root.id = 'printRoot'; document.body.appendChild(root); }
  root.innerHTML = reportHTML(); document.body.classList.add('printing'); track('report', {e: S.eid});
  const done = () => { document.body.classList.remove('printing'); window.removeEventListener('afterprint', done); };
  window.addEventListener('afterprint', done);
  if(window.__noPrint) return;
  setTimeout(() => { window.print(); }, 60);
}
SHARE_ACTIONS.push({k: 'rpBtn', run: () => { $('#modalRoot').innerHTML = ''; toast(t('rpPrinting')); printReport(); }});
