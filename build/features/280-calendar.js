// Election calendar (#35): countdowns to the next elections with a "simulate now" button (page #/calendar). Data: source/ref/calendar.json.
addI18n('en', {
  footCal: 'Election calendar', calTitle: 'Election calendar', calLede: 'The next elections and how long to wait. Click one to simulate it now.', calAll: 'See the full calendar', calSim: 'Simulate now', calPredict: 'Predict',
  calSub: 'Every house that faces voters next, soonest first. Each assembly serves five years, so the Election Commission votes a few months before the term ends; the exact days are announced only a few weeks ahead.',
  calNote: 'Windows are estimates from each house\'s five-year term (listed as of {d}). They are not announcements: when the Election Commission fixes a schedule the exact date replaces the window here. A Census year or a political crisis can move an election.',
  calNext: 'Next up', calIn: 'in {s}', calOn: 'on {d}', calWindowNow: 'The window is open now', calPassed: 'Window passed, date to be confirmed', calEndsIn: 'closes in {s}', calSched: 'Scheduled',
  calExpected: 'Expected', calTermEnd: 'Term ends {m}', calLast: 'Last election {y}: {p} won {n}', calSeats: '{n} seats', calPres: 'Presidential election', calPresSub: 'MPs and MLAs vote as an electoral college. The President\'s five-year term ends in July 2027.', calPresGo: 'Electoral college tool',
  calLS: 'Lok Sabha', calVS: '{s} Vidhan Sabha', calToday: 'today', calD1: '1 day', calDn: '{n} days', calM1: '1 month', calMn: '{n} months', calYm: '{y} years {m} months', calY1: '1 year', calYn: '{y} years',
  calToEC: 'Election Commission of India', calCountdown: 'until the first expected polling month',
});
addI18n('hi', {
  footCal: 'चुनाव कैलेंडर', calTitle: 'चुनाव कैलेंडर', calLede: 'अगले चुनाव और कितना इंतज़ार बाक़ी है। किसी पर क्लिक करके उसे अभी सिम्युलेट करें।', calAll: 'पूरा कैलेंडर देखें', calSim: 'अभी सिम्युलेट करें', calPredict: 'भविष्यवाणी',
  calSub: 'अगली बार जनता के सामने जाने वाले हर सदन की सूची, जो सबसे पहले है वह ऊपर। हर विधानसभा पाँच साल चलती है, इसलिए चुनाव आयोग कार्यकाल ख़त्म होने से कुछ महीने पहले वोट कराता है; सही तारीख़ें कुछ हफ़्ते पहले ही घोषित होती हैं।',
  calNote: 'ये अवधियाँ हर सदन के पाँच साल के कार्यकाल से लगाए अनुमान हैं ({d} तक की स्थिति)। ये घोषणाएँ नहीं हैं: जब चुनाव आयोग कार्यक्रम तय करेगा तो अवधि की जगह सही तारीख़ दिखेगी। जनगणना का साल या कोई राजनीतिक संकट चुनाव को खिसका सकता है।',
  calNext: 'सबसे पहले', calIn: '{s} में', calOn: '{d} को', calWindowNow: 'अवधि अभी चल रही है', calPassed: 'अवधि बीत गई, तारीख़ तय होनी बाक़ी', calEndsIn: '{s} में ख़त्म', calSched: 'तय',
  calExpected: 'अनुमानित', calTermEnd: 'कार्यकाल {m} में ख़त्म', calLast: 'पिछला चुनाव {y}: {p} ने {n} जीतीं', calSeats: '{n} सीटें', calPres: 'राष्ट्रपति चुनाव', calPresSub: 'सांसद और विधायक निर्वाचक-मंडल की तरह वोट डालते हैं। राष्ट्रपति का पाँच साल का कार्यकाल जुलाई 2027 में ख़त्म होता है।', calPresGo: 'निर्वाचक-मंडल का औज़ार',
  calLS: 'लोकसभा', calVS: '{s} विधानसभा', calToday: 'आज', calD1: '1 दिन', calDn: '{n} दिन', calM1: '1 महीना', calMn: '{n} महीने', calYm: '{y} साल {m} महीने', calY1: '1 साल', calYn: '{y} साल',
  calToEC: 'भारत निर्वाचन आयोग', calCountdown: 'पहले अनुमानित मतदान महीने तक',
});
let CAL = null;
async function calData(){ if(!CAL){ try{ CAL = await getJSON('ref/calendar.json'); }catch(e){ CAL = {items: [], asof: ''}; } } return CAL; }
const calLocale = () => LANG === 'hi' ? 'hi-IN' : 'en-IN';
const ymStart = ym => new Date(+ym.slice(0, 4), +ym.slice(5, 7) - 1, 1);
const ymEnd = ym => new Date(+ym.slice(0, 4), +ym.slice(5, 7), 0, 23, 59, 59);
function calMonth(ym, withYear){ return ymStart(ym).toLocaleDateString(calLocale(), withYear ? {month: 'long', year: 'numeric'} : {month: 'long'}); }
function calWindow(it){
  if(it.date) return new Date(it.date + 'T00:00:00').toLocaleDateString(calLocale(), {day: 'numeric', month: 'long', year: 'numeric'});
  if(it.from === it.to) return calMonth(it.from, true);
  const y1 = it.from.slice(0, 4), y2 = it.to.slice(0, 4);
  return y1 === y2 ? calMonth(it.from) + ' – ' + calMonth(it.to) + ' ' + y1 : calMonth(it.from, true) + ' – ' + calMonth(it.to, true);
}
// a span of days as plain words: "9 days", "5 months", "2 years 3 months"
function calSpan(d){
  d = Math.max(0, Math.round(d));
  if(d === 0) return t('calToday');
  if(d < 45) return d === 1 ? t('calD1') : t('calDn', {n: d});
  const mo = Math.round(d / 30.44);
  if(mo < 24) return mo === 1 ? t('calM1') : t('calMn', {n: mo});
  const y = Math.floor(mo / 12), m = mo % 12;
  return m ? t('calYm', {y, m}) : (y === 1 ? t('calY1') : t('calYn', {y}));
}
// where an item stands today: scheduled (exact date known), soon (window ahead), open (inside the window) or passed
function calState(it, now){
  if(it.date){ const d = (new Date(it.date + 'T00:00:00') - now) / 864e5; return {k: d >= -1 ? 'sched' : 'passed', d}; }
  const a = ymStart(it.from), b = ymEnd(it.to);
  if(now < a) return {k: 'soon', d: (a - now) / 864e5};
  if(now <= b) return {k: 'open', d: (b - now) / 864e5};
  return {k: 'passed', d: 0};
}
function calLatest(state){ let l = null; INDEX.elections.forEach(x => { if(x.kind === 'AE' && x.state === state && (!l || x.year > l.year)) l = x; }); return l; }
function calTitle(it){ return it.kind === 'LS' ? t('calLS') + ' ' + it.from.slice(0, 4) : it.kind === 'PRES' ? t('calPres') + ' ' + it.from.slice(0, 4) : t('calVS', {s: stName(it.state)}) + ' ' + it.from.slice(0, 4); }
function calGo(it){
  S.tab = 'easy'; track('calendar_simulate', {id: it.id});
  if(it.kind === 'PRES'){ location.hash = '#/rajyasabha'; return; }
  if(it.kind === 'LS'){ const l = INDEX.elections.filter(e => e.kind === 'LS').sort((a, b) => b.year - a.year)[0]; location.hash = ''; S.mode = 'alliance'; openSim('LS', null, 'next:' + l.id); return; }
  const l = calLatest(it.state); if(!l) return;
  location.hash = ''; S.mode = 'party'; openSim('AE', it.state, 'next:' + l.id, true);
}
function calStatusLine(it, st){
  if(st.k === 'sched') return `<b>${esc(t('calSched'))}: ${esc(calWindow(it))}</b> · ${esc(t('calIn', {s: calSpan(st.d)}))}`;
  if(st.k === 'soon') return `<b>${esc(t('calIn', {s: calSpan(st.d)}))}</b> <span class="small">· ${esc(t('calExpected'))}: ${esc(calWindow(it))}</span>`;
  if(st.k === 'open') return `<b>${esc(t('calWindowNow'))}</b> <span class="small">· ${esc(calWindow(it))} · ${esc(t('calEndsIn', {s: calSpan(st.d)}))}</span>`;
  return `<b>${esc(t('calPassed'))}</b> <span class="small">· ${esc(calWindow(it))}</span>`;
}
function calCard(it, now){
  const st = calState(it, now), l = it.kind === 'AE' ? calLatest(it.state) : it.kind === 'LS' ? INDEX.elections.filter(e => e.kind === 'LS').sort((a, b) => b.year - a.year)[0] : null;
  const lead = l && l.top && l.top[0] ? l.top[0] : null;
  const bits = [];
  if(it.kind === 'PRES') bits.push(esc(t('calPresSub')));
  else {
    if(l) bits.push(esc(t('calSeats', {n: l.seats})));
    if(it.termEnd) bits.push(esc(t('calTermEnd', {m: calMonth(it.termEnd, true)})));
    if(lead) bits.push(esc(t('calLast', {y: l.label, p: pName(lead[0]), n: lead[1]})));
  }
  const color = it.kind === 'PRES' ? 'var(--violet)' : lead ? pColor(lead[0]) : '#9aa0aa';
  return `<div class="calc ${st.k}" data-cal="${esc(it.id)}"><i style="background:${color}"></i><div><b class="calt">${esc(calTitle(it))}</b><p class="calst">${calStatusLine(it, st)}</p><p class="small" style="margin:0 0 8px">${bits.join(' · ')}</p>
    <button class="btn small primary" data-cgo="${esc(it.id)}">${esc(it.kind === 'PRES' ? t('calPresGo') : t('calSim'))}</button></div></div>`;
}
async function calItems(){
  const cal = await calData(), now = new Date();
  const items = cal.items.filter(it => it.kind !== 'AE' || calLatest(it.state)).map(it => ({it, st: calState(it, now)}));
  const key = o => o.it.date ? new Date(o.it.date + 'T00:00:00').getTime() : ymStart(o.it.from).getTime() + (o.st.k === 'passed' ? 1e13 : 0);
  items.sort((a, b) => key(a) - key(b) || (a.it.state || a.it.id).localeCompare(b.it.state || b.it.id));
  return {cal, now, items};
}
async function renderCalendarHome(){
  const box = $('#calGrid'); if(!box) return;
  const {now, items, cal} = await calItems(); if(!cal.items.length){ $('#calSec').hidden = true; return; }
  const soon = items.filter(o => o.st.k !== 'passed').slice(0, 4);
  box.innerHTML = soon.map(o => `<button class="scn" data-chome="${esc(o.it.id)}"><i style="background:${o.it.kind === 'PRES' ? 'var(--violet)' : (() => { const l = o.it.kind === 'AE' ? calLatest(o.it.state) : null; return l && l.top[0] ? pColor(l.top[0][0]) : '#9aa0aa'; })()}"></i><span><b>${esc(calTitle(o.it))}</b><br><span class="small">${calStatusLine(o.it, o.st)}</span></span></button>`).join('');
  box.querySelectorAll('[data-chome]').forEach(b => b.onclick = () => calGo(cal.items.find(i => i.id === b.dataset.chome)));
}
PAGES.set('calendar', async box => {
  const {cal, now, items} = await calItems();
  const live = items.filter(o => o.st.k !== 'passed'), late = items.filter(o => o.st.k === 'passed'), first = live[0];
  const years = new Map(); live.forEach(o => { const y = (o.it.date || o.it.from).slice(0, 4); if(!years.has(y)) years.set(y, []); years.get(y).push(o); });
  box.innerHTML = `<article class="page" style="max-width:1000px"><h2>${esc(t('calTitle'))}</h2><p class="lede">${esc(t('calSub'))}</p>
    ${first ? `<div class="calhero"><div><span class="small">${esc(t('calNext'))}</span><h3>${esc(calTitle(first.it))}</h3><p class="calbig">${esc(first.st.k === 'open' ? t('calWindowNow') : calSpan(first.st.d))}</p><p class="small" style="margin:0">${esc(first.st.k === 'open' ? calWindow(first.it) : t('calCountdown') + ' · ' + calWindow(first.it))}</p></div>
      <button class="btn primary" data-cgo="${esc(first.it.id)}">${esc(first.it.kind === 'PRES' ? t('calPresGo') : t('calSim'))}</button></div>` : ''}
    ${[...years.entries()].map(([y, list]) => `<h3 style="margin-top:22px">${esc(y)}</h3><div class="calgrid">${list.map(o => calCard(o.it, now)).join('')}</div>`).join('')}
    ${late.length ? `<h3 style="margin-top:22px">${esc(t('calPassed'))}</h3><div class="calgrid">${late.map(o => calCard(o.it, now)).join('')}</div>` : ''}
    <p class="small" style="margin-top:18px">${esc(t('calNote', {d: new Date(cal.asof + 'T00:00:00').toLocaleDateString(calLocale(), {day: 'numeric', month: 'long', year: 'numeric'})}))} <a href="https://www.eci.gov.in/" target="_blank" rel="noopener">${esc(t('calToEC'))} ↗</a></p></article>`;
  box.querySelectorAll('[data-cgo]').forEach(b => b.onclick = () => calGo(cal.items.find(i => i.id === b.dataset.cgo)));
});
