// Analysis card: a registry of small tools that read the open election and the current simulation.
addI18n('en', {toolsTitle: 'Analysis', toolsAll: 'All seats', toolsNoData: 'Not enough data for this view.', thSeatN: 'Seat', thLeadPts: 'Lead', thNeeds: 'Swing needed', thGap: 'Gap', thWon: 'Won', thRun: 'Runner-up'});
addI18n('hi', {toolsTitle: 'विश्लेषण', toolsAll: 'सभी सीटें', toolsNoData: 'इस दृश्य के लिए पर्याप्त आँकड़े नहीं हैं।', thSeatN: 'सीट', thLeadPts: 'बढ़त', thNeeds: 'ज़रूरी स्विंग', thGap: 'अंतर', thWon: 'विजेता', thRun: 'उपविजेता'});
const TOOLS = [];
function registerTool(def){ TOOLS.push(def); }
let toolTimer = null, toolKeyShown = null, toolRun = 0;
function curTool(){ return TOOLS.find(x => x.id === S.tool) || TOOLS[0]; }
function toolsSetup(){
  const sel = $('#toolSel'); if(!sel) return;
  S.tool = store.get('tool', 'facts');
  sel.innerHTML = TOOLS.map(x => `<option value="${x.id}">${esc(t(x.label))}</option>`).join('');
  sel.value = curTool() ? curTool().id : '';
  sel.onchange = () => { S.tool = sel.value; store.set('tool', S.tool); toolKeyShown = null; toolsTouch(true); };
}
function toolsRelabel(){ const sel = $('#toolSel'); if(!sel) return; const v = sel.value; sel.innerHTML = TOOLS.map(x => `<option value="${x.id}">${esc(t(x.label))}</option>`).join(''); sel.value = v; }
function toolsTouch(now){
  const def = curTool(); if(!def || !E || !RES) return;
  const key = (def.key ? def.key() : S.eid) + '|' + LANG;
  if(key === toolKeyShown) return;
  clearTimeout(toolTimer);
  toolTimer = setTimeout(async () => {
    toolKeyShown = key; const my = ++toolRun, body = $('#toolBody');
    $('#toolSub').textContent = def.sub ? t(def.sub) : '';
    try{ await def.render(body, () => my !== toolRun); if(my === toolRun) alignTables(body); }catch(err){ console.error(err); if(my === toolRun) body.innerHTML = `<p class="small">${esc(t('toolsNoData'))}</p>`; }
  }, now ? 0 : (def.live ? 180 : 40));
}
function alignTables(root){
  root.querySelectorAll('table.tbl').forEach(tb => { const r = tb.querySelector('tbody tr'); if(!r) return; const tds = [...r.children];
    tb.querySelectorAll('thead th').forEach((th, i) => { const left = tds[i] && !tds[i].classList.contains('num'); th.style.textAlign = left ? 'left' : 'right'; });
    tb.querySelectorAll('tbody tr').forEach(tr => [...tr.children].forEach(td => { if(!td.classList.contains('num')) td.style.textAlign = 'left'; })); });
}
const simKey = () => S.eid + '|' + JSON.stringify(sigOf());
// helpers shared by tools
async function histList(){ return (await bundle(entry().file)).slice().sort((a, b) => a.year - b.year || a.label.localeCompare(b.label)); }
function votesOf(s){ const m = new Map(); const f = s[4]; for(let k = 0; k < f.length; k += 2) m.set(f[k], (m.get(f[k]) || 0) + f[k+1]); return m; }
function seatTotal(s){ let tt = s[5] || 0; const f = s[4]; for(let k = 1; k < f.length; k += 2) tt += f[k]; return tt; }
function seatMargin(s){ const f = s[4]; return f.length >= 4 ? f[1] - f[3] : (f.length >= 2 ? f[1] : 0); }
function fmtN(n){ return Math.round(n).toLocaleString(LANG === 'hi' ? 'hi-IN' : 'en-IN'); }
const nameKey = n => String(n).toLowerCase().replace(/\(.*?\)/g, '').replace(/[^a-z0-9]+/g, '');
function partyOpts(sel, withAll){ return (withAll ? `<option value="">${esc(t('toolsAll'))}</option>` : '') + U.map((g, k) => ({g, k})).filter(o => o.g.key !== 'OTH').map(o => `<option value="${esc(o.g.key)}" ${o.g.key === sel ? 'selected' : ''}>${esc(o.g.name)}</option>`).join(''); }

// ---------- Flip targets (#7) ----------
addI18n('en', {toolFlip: 'Flip targets', flipSub: 'Seats closest to changing hands in the current scenario, and the swing each one needs (a straight shift of vote from the leader to the challenger).',
  flipFor: 'For', flipLose: '{p}: most at risk', flipGain: '{p}: best targets', flipClosest: 'Closest seats', flippedNow: 'flipped'});
addI18n('hi', {toolFlip: 'पलट सकने वाली सीटें', flipSub: 'मौजूदा परिदृश्य में सबसे कम अंतर वाली सीटें और हर सीट को पलटने के लिए ज़रूरी स्विंग (नेता से चुनौती देने वाले की ओर सीधा वोट-खिसकाव)।',
  flipFor: 'किसके लिए', flipLose: '{p}: सबसे जोखिम में', flipGain: '{p}: सबसे अच्छे निशाने', flipClosest: 'सबसे कांटे की सीटें', flippedNow: 'पलटी'});
registerTool({id: 'flip', label: 'toolFlip', sub: 'flipSub', live: true, key: simKey, render(body){
  const cur = S.flipFor && U.some(g => g.key === S.flipFor) ? S.flipFor : '';
  const row = (i, a, b, gap) => { const s = E.seats[i], flipped = RES.win[i] !== E.baseWin[i];
    return `<tr class="click" data-i="${i}"><td>${s.no}. ${esc(s.name)}${s.r >= 0 && S.kind === 'LS' ? `<div class="small">${esc(stName(E.regions[s.r]))}</div>` : ''}</td>
      <td><span class="pname"><i class="sw" style="background:${U[a].hex}"></i><span>${esc(shortName(U[a]))}</span></span>${flipped ? `<div class="small">${esc(t('flippedNow'))}</div>` : ''}</td>
      <td><span class="pname"><i class="sw" style="background:${U[b].hex}"></i><span>${esc(shortName(U[b]))}</span></span></td>
      <td class="num">${fmt1(gap)}</td><td class="num"><b>${fmt1(gap / 2)}</b></td></tr>`; };
  const head = `<thead><tr><th>${esc(t('thSeatN'))}</th><th>${esc(t('thWon'))}</th><th>${esc(t('thRun'))}</th><th>${esc(t('thLeadPts'))}</th><th>${esc(t('thNeeds'))}</th></tr></thead>`;
  const lead = i => 100 * (RES.shares[i][RES.win[i]] - RES.shares[i][RES.second[i]]);
  let html = `<div class="tools-row"><label>${esc(t('flipFor'))} <select id="flipFor">${partyOpts(cur, true)}</select></label></div>`;
  const wrap = (title, rows) => `<div><h4>${esc(title)}</h4><div class="seatlist" style="max-height:420px"><table class="tbl">${head}<tbody>${rows}</tbody></table></div></div>`;
  if(!cur){
    const rows = E.seats.map((s, i) => i).filter(i => E.seats[i].tot > 0).sort((a, b) => lead(a) - lead(b)).slice(0, 25).map(i => row(i, RES.win[i], RES.second[i], lead(i))).join('');
    html += wrap(t('flipClosest'), rows);
  } else {
    const ui = U.findIndex(g => g.key === cur), pn = U[ui].name;
    const lose = E.seats.map((s, i) => i).filter(i => RES.win[i] === ui && E.seats[i].tot > 0).sort((a, b) => lead(a) - lead(b)).slice(0, 20).map(i => row(i, ui, RES.second[i], lead(i))).join('');
    const gain = E.seats.map((s, i) => i).filter(i => RES.win[i] !== ui && E.seats[i].tot > 0).map(i => ({i, g: 100 * (RES.shares[i][RES.win[i]] - RES.shares[i][ui])})).sort((a, b) => a.g - b.g).slice(0, 20).map(o => row(o.i, RES.win[o.i], ui, o.g)).join('');
    html += `<div class="tools-cols">${wrap(t('flipLose', {p: pn}), lose || `<tr><td colspan="5" class="small">${esc(t('toolsNoData'))}</td></tr>`)}${wrap(t('flipGain', {p: pn}), gain)}</div>`;
  }
  body.innerHTML = html;
  $('#flipFor').onchange = e => { S.flipFor = e.target.value; toolKeyShown = null; toolsTouch(true); };
  body.querySelectorAll('tr[data-i]').forEach(tr => tr.onclick = () => selectSeat(+tr.dataset.i));
}});
