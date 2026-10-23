// Representation (#25): women among winners, average age of winners, and party performance in reserved (SC / ST) seats.
addI18n('en', {
  toolRep: 'Representation', repSub: 'Women among the winners over time, the average age of winners, and how parties did in the seats reserved for Scheduled Castes and Tribes.',
  repWomen: 'Women among winners', repWomenNote: 'From the candidate data where it records sex; Lok Sabha 2009 to 2024 use the counts listed by Wikipedia. Elections without sex data are left out.', repAge: 'Average age of winners', repAgeNote: 'Only elections where the source recorded ages.',
  repReserved: 'Reserved seats', repSC: 'SC seats', repST: 'ST seats', repReal: 'Real result', repScn: 'Scenario', repNoRes: 'No reserved-seat information for this election.', repWomenN: '{n} women ({p}%)', repYrs: '{n} yrs',
  repSeatsOf: '{a} of {b}', repNoData: 'No sex data recorded for this election history.',
});
addI18n('hi', {
  toolRep: 'प्रतिनिधित्व', repSub: 'समय के साथ विजेताओं में महिलाएँ, विजेताओं की औसत उम्र, और अनुसूचित जाति-जनजाति के लिए आरक्षित सीटों पर दलों का प्रदर्शन।',
  repWomen: 'विजेताओं में महिलाएँ', repWomenNote: 'उम्मीदवार-आँकड़ों से, जहाँ लिंग दर्ज है; लोकसभा 2009 से 2024 के लिए विकिपीडिया की सूचीबद्ध गिनती ली गई है। जिन चुनावों में लिंग दर्ज नहीं, वे छोड़े गए हैं।', repAge: 'विजेताओं की औसत उम्र', repAgeNote: 'सिर्फ़ वे चुनाव जिनमें स्रोत ने उम्र दर्ज की।',
  repReserved: 'आरक्षित सीटें', repSC: 'अनुसूचित जाति की सीटें', repST: 'अनुसूचित जनजाति की सीटें', repReal: 'असली नतीजा', repScn: 'परिदृश्य', repNoRes: 'इस चुनाव के लिए आरक्षित सीटों की जानकारी नहीं है।', repWomenN: '{n} महिलाएँ ({p}%)', repYrs: '{n} वर्ष',
  repSeatsOf: '{b} में से {a}', repNoData: 'इस चुनावी इतिहास के लिए लिंग का आँकड़ा दर्ज नहीं है।',
});
function barSvg(pts, o){
  const W = 760, H = 190, L = 36, B = 26, T = 18, n = pts.length, bw = (W - L - 8) / Math.max(n, 1), mx = Math.max(o.min || 0, ...pts.map(p => p.v));
  const y = v => H - B - (H - B - T) * v / mx;
  let g = [0, .5, 1].map(f => `<line x1="${L}" x2="${W}" y1="${y(mx * f)}" y2="${y(mx * f)}" stroke="var(--line)"/>${svgText(L - 6, y(mx * f) + 4, o.fmt(mx * f), {anchor: 'end', size: 11})}`).join('');
  pts.forEach((p, i) => { const cx = L + i * bw + bw / 2; g += `<rect x="${cx - bw * .34}" y="${y(p.v)}" width="${bw * .68}" height="${H - B - y(p.v)}" rx="2" fill="${o.color}" fill-opacity="${p.off ? .45 : .9}"><title>${esc(p.l)}: ${o.fmt(p.v)}${p.off ? ' *' : ''}</title></rect>`;
    if(bw > 26 || i % 2 === 0) g += svgText(cx, y(p.v) - 4, o.fmt(p.v), {anchor: 'middle', size: 10.5, fill: 'var(--ink)', weight: 600});
    if(n <= 22 || i % 2 === 0 || i === n - 1) g += svgText(cx, H - 9, p.l, {anchor: 'middle', size: 10.5}); });
  return `<div class="tw"><svg viewBox="0 0 ${W} ${H}" style="min-width:520px" role="img" aria-label="${esc(o.label)}">${g}</svg></div>`;
}
registerTool({id: 'representation', label: 'toolRep', sub: 'repSub', live: true, key: simKey, async render(body, stale){
  const st = await statsData(); if(stale()) return;
  const els = INDEX.elections.filter(e => S.kind === 'LS' ? e.kind === 'LS' : (e.kind === 'AE' && e.state === S.state)).sort((a, b) => a.year - b.year || a.label.localeCompare(b.label));
  const wp = els.map(e => { const s = st[e.id]; if(!s) return null; if(s.wOff != null) return {l: e.label, v: 100 * s.wOff / s.n, n: s.wOff, off: true}; return s.women[0] > 0.7 * s.n ? {l: e.label, v: 100 * s.women[1] / s.women[0], n: s.women[1]} : null; }).filter(Boolean);
  const ap = els.map(e => { const s = st[e.id]; return s && s.age[0] > 0.5 * s.n ? {l: e.label, v: s.age[1] / s.age[0]} : null; }).filter(Boolean);
  // reserved seats: real result vs the scenario
  const cats = ['SC', 'ST'].map(c => { const idx = E.seats.map((s, i) => i).filter(i => E.seats[i].cat === c); if(!idx.length) return null;
    const cnt = (win) => { const m = new Map(); idx.forEach(i => { const k = win[i]; m.set(k, (m.get(k) || 0) + 1); }); return m; }, a = cnt(E.baseWin), b = cnt(RES.win);
    const keys = U.map((g, k) => k).filter(k => U[k].key !== 'OTH' && ((a.get(k) || 0) + (b.get(k) || 0)) > 0).sort((x, y) => (b.get(y) || 0) - (b.get(x) || 0) || (a.get(y) || 0) - (a.get(x) || 0)).slice(0, 7);
    return {c, n: idx.length, keys, a, b}; }).filter(Boolean);
  body.innerHTML = `<h4>${esc(t('repWomen'))}</h4>${wp.length ? barSvg(wp, {color: 'var(--violet)', fmt: v => fmt1(v) + '%', label: t('repWomen'), min: 20}) + `<p class="small" style="margin:2px 0 12px">${esc(t('repWomenNote'))} ${wp.some(p => p.off) ? '* ' : ''}</p>` : `<p class="small">${esc(t('repNoData'))}</p>`}
    ${ap.length >= 3 ? `<h4>${esc(t('repAge'))}</h4>${barSvg(ap, {color: '#0F8B8D', fmt: v => Math.round(v) + '', label: t('repAge'), min: 60})}<p class="small" style="margin:2px 0 12px">${esc(t('repAgeNote'))}</p>` : ''}
    <h4>${esc(t('repReserved'))}</h4>${cats.length ? `<div class="tools-cols">${cats.map(c => `<div><p class="small" style="margin:0 0 4px"><b>${esc(t(c.c === 'SC' ? 'repSC' : 'repST'))}</b> · ${c.n}</p><table class="tbl"><thead><tr><th>${esc(S.mode === 'alliance' ? t('thAlly') : t('thParty'))}</th><th>${esc(t('repReal'))}</th><th>${esc(t('repScn'))}</th></tr></thead><tbody>
      ${c.keys.map(k => { const x = c.a.get(k) || 0, y = c.b.get(k) || 0; return `<tr><td><span class="pname"><i class="sw" style="background:${U[k].hex}"></i><span>${esc(shortName(U[k]))}</span></span></td><td class="num">${x}</td><td class="num"><b>${y}</b>${y !== x ? ` <small class="${y > x ? 'up' : 'down'}">${y > x ? '+' : ''}${y - x}</small>` : ''}</td></tr>`; }).join('')}</tbody></table></div>`).join('')}</div>` : `<p class="small">${esc(t('repNoRes'))}</p>`}`;
}});
