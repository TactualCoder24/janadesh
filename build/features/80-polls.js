// Poll presets: what the exit polls projected, loaded as ready-made scenarios. Seat projections come from the cited Wikipedia exit-poll tables.
addI18n('en', {
  pollTitle: 'What the exit polls said', pollLede: 'Load a published exit poll as a scenario and see what vote shares it needs, then compare with the real result.',
  pollCard: 'Exit polls: {p}', pollActual: 'Actual: {a}', pollPick: 'Choose an exit poll', pollApply: 'Simulate', pollSource: 'Source: Wikipedia, exit polls table', pollActualRow: 'Actual result',
  pollNote: 'Each projection is turned into vote shares for the earlier election so that the simulated seats match the poll, then applied to its constituencies. Range projections use the mid-point.',
  pollBanner: '{by}, {title}: {p}. Simulated seats: {s}. Actual result: {a}.', pollEasy: 'Exit polls for {title}', pollEasyHint: 'Load what a pollster projected as a scenario.', pollFit: 'Fitting the vote shares…',
});
addI18n('hi', {
  pollTitle: 'एग्ज़िट पोल ने क्या कहा था', pollLede: 'किसी प्रकाशित एग्ज़िट पोल को परिदृश्य की तरह खोलें, देखें उसके लिए कितना वोट चाहिए, और असली नतीजे से तुलना करें।',
  pollCard: 'एग्ज़िट पोल: {p}', pollActual: 'असल में: {a}', pollPick: 'एग्ज़िट पोल चुनें', pollApply: 'सिम्युलेट करें', pollSource: 'स्रोत: विकिपीडिया, एग्ज़िट पोल तालिका', pollActualRow: 'असली नतीजा',
  pollNote: 'हर अनुमान को पिछले चुनाव के वोट हिस्सों में बदला जाता है ताकि सिम्युलेटेड सीटें पोल से मेल खाएँ, फिर उसे चुनाव क्षेत्रों पर लागू किया जाता है। रेंज वाले अनुमानों का मध्य-मान लिया गया है।',
  pollBanner: '{by}, {title}: {p}। सिम्युलेटेड सीटें: {s}। असली नतीजा: {a}।', pollEasy: '{title} के एग्ज़िट पोल', pollEasyHint: 'किसी पोलस्टर का अनुमान परिदृश्य की तरह खोलें।', pollFit: 'वोट हिस्से बैठाए जा रहे हैं…',
});
let POLLS = null;
async function pollData(){ if(!POLLS){ try{ POLLS = await getJSON('data/polls.json'); }catch(e){ POLLS = {sets: []}; } } return POLLS; }
const unitName = (set, label) => { const u = set.units[label]; return set.mode === 'alliance' ? allyName(u) : pName(u); };
function seatsText(set, seats){ return Object.keys(set.units).map(l => `${LANG === 'hi' && HI_ALLY[l] ? HI_ALLY[l] : l} ${seats[l]}`).join(', '); }
function actualText(set){ return set.actual.slice(0, 3).map(([k, n]) => `${LANG === 'hi' && (HI_ALLY[k] || HI_PARTY[k]) ? (HI_ALLY[k] || HI_PARTY[k]) : k} ${n}`).join(', '); }
async function renderPollHome(){
  const d = await pollData(), sec = $('#pollSec'); if(!sec) return;
  sec.hidden = !d.sets.length;
  $('#pollGrid').innerHTML = d.sets.map((s, i) => `<button class="scn" data-poll="${i}"><i style="background:var(--violet)"></i><span><b>${esc(stName(s.title))}</b><br><span class="small">${esc(t('pollCard', {p: seatsText(s, s.polls[0].seats)}))}<br>${esc(t('pollActual', {a: actualText(s)}))}</span></span></button>`).join('');
  $('#pollGrid').querySelectorAll('[data-poll]').forEach(b => b.onclick = () => openPolls(d.sets[+b.dataset.poll]));
}
function openPolls(set){
  const keys = Object.keys(set.units);
  modal(`<h3>${esc(stName(set.title))}: ${esc(t('pollPick'))}</h3>
    <p class="small">${esc(t('pollActual', {a: actualText(set)}))}</p>
    <div class="seatlist" style="max-height:52vh"><table class="tbl"><thead><tr><th>${esc(t('thElection'))}</th>${keys.map(k => `<th>${esc(LANG === 'hi' && HI_ALLY[k] ? HI_ALLY[k] : k)}</th>`).join('')}<th></th></tr></thead><tbody>
    ${set.polls.map((p, i) => `<tr${p.avg ? ' style="background:var(--violet-soft)"' : ''}><td>${p.avg ? '<b>' + esc(p.by) + '</b>' : esc(p.by)}</td>${keys.map(k => `<td class="num">${p.seats[k]}</td>`).join('')}<td><button class="btn small" data-ap="${i}">${esc(t('pollApply'))}</button></td></tr>`).join('')}</tbody></table></div>
    <p class="small" style="margin:8px 0">${esc(t('pollNote'))} <a href="${esc(set.source)}" target="_blank" rel="noopener">${esc(t('pollSource'))} ↗</a></p>
    <div class="row"><button class="btn small" data-close>${esc(t('close'))}</button></div>`);
  document.querySelectorAll('#modalRoot [data-ap]').forEach(b => b.onclick = () => { $('#modalRoot').innerHTML = ''; applyPoll(set, set.polls[+b.dataset.ap]); });
}
function fitSeats(ui, want){
  const save = Object.assign({}, S.T), seatsAt = v => { S.T = Object.assign({}, save); setTarget(ui, v); return winners(simulate(targets()), S.overrides).counts[ui]; };
  const T0 = targets(), lockedSum = U.reduce((a, g, j) => a + (j !== ui && S.locks[g.key] ? T0[j] : 0), 0);
  let lo = 0, hi = Math.max(0, 100 - lockedSum - 0.5);
  if(want >= seatsAt(hi)){ S.T = save; setTarget(ui, hi); return; }
  if(want <= 0){ S.T = save; setTarget(ui, 0); return; }
  for(let it = 0; it < 22; it++){ const mid = (lo + hi) / 2; if(seatsAt(mid) >= want) hi = mid; else lo = mid; }
  S.T = save; setTarget(ui, Math.round(hi * 10) / 10);
}
async function applyPoll(set, poll){
  const base = INDEX.elections.find(e => e.id === set.base); if(!base) return;
  track('poll_preset', {set: set.id, by: poll.by});
  S.tab = 'easy'; S.mode = set.mode;
  await openSim(base.kind, base.state, set.base);
  if(S.mode !== set.mode){ S.mode = set.mode; }
  S.T = {}; S.locks = {}; S.overrides = {}; S.regional = {}; S.swing = {a: null, b: null, pts: 0}; rebuild();
  const order = Object.keys(set.units).sort((a, b) => poll.seats[b] - poll.seats[a]);
  const targetsList = order.map(l => ({l, ui: U.findIndex(g => g.key === (set.mode === 'alliance' ? 'A:' + set.units[l] : set.units[l])), want: poll.seats[l]})).filter(o => o.ui >= 0);
  for(let pass = 0; pass < 12; pass++){
    targetsList.forEach(o => { S.locks = {}; targetsList.forEach(p => { if(p !== o) S.locks[U[p.ui].key] = true; }); fitSeats(o.ui, o.want); });
    if(targetsList.every(o => Math.abs(winners(simulate(targets()), S.overrides).counts[o.ui] - o.want) <= 1)) break;
  }
  S.locks = {};
  S.pollScn = {set, poll, sig: pollSig()};
  run(); renderPane();
}
const pollSig = () => JSON.stringify(Object.entries(S.T).map(([k, v]) => [k, Math.round(v * 10) / 10]));
function renderBanner(){
  const el = $('#scnBanner'); if(!el) return;
  const sc = S.pollScn;
  if(!sc || sc.set.base !== S.eid || sc.sig !== pollSig()){ el.hidden = true; return; }
  const sim = {}; Object.entries(sc.set.units).forEach(([l, u]) => { const ui = U.findIndex(g => g.key === (sc.set.mode === 'alliance' ? 'A:' + u : u)); sim[l] = ui >= 0 ? RES.counts[ui] : 0; });
  el.hidden = false;
  el.innerHTML = esc(t('pollBanner', {by: sc.poll.by, title: stName(sc.set.title), p: seatsText(sc.set, sc.poll.seats), s: seatsText(sc.set, sim), a: actualText(sc.set)})) + ` <a href="${esc(sc.set.source)}" target="_blank" rel="noopener">↗</a>`;
}
function pollEasyBlock(){
  if(!POLLS || S.next) return '';
  const set = POLLS.sets.find(s => s.base === S.eid); if(!set) return '';
  return `<div><h3>${esc(t('pollEasy', {title: stName(set.title)}))}</h3><p class="hint">${esc(t('pollEasyHint'))}</p><button class="btn" id="pollOpen">${esc(t('pollApply'))} …</button></div>`;
}
function pollEasyBind(){ const b = $('#pollOpen'); if(b) b.onclick = () => openPolls(POLLS.sets.find(s => s.base === S.eid)); }
