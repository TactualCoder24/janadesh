// Display and access: dark mode (#46) and the accessibility work (#48): colour-blind-safe party colours, a skip link, keyboard handling for dialogs, announcements for screen readers.
addI18n('en', {
  dispBtn: 'Display', dispTitle: 'Display and access', dispTheme: 'Theme', themeAuto: 'Match my device', themeLight: 'Light', themeDark: 'Dark',
  dispCvd: 'Colour-blind-safe party colours', dispCvdHint: 'Uses a palette that stays apart for the common kinds of colour blindness, and outlines every colour key. Maps, charts and exported images follow it.',
  dispKeys: 'Keyboard', dispKeysHint: 'Press / to search. Tab moves through the page and Enter opens a seat in the seat list. Ctrl+Z and Ctrl+Y undo and redo changes to a scenario. Esc closes a dialog.',
  skipMain: 'Skip to the content', srResult: 'Result updated: {v}', dispDone: 'Done', mapLabel: 'Constituency map. The seat list below has the same information.',
});
addI18n('hi', {
  dispBtn: 'डिस्प्ले', dispTitle: 'डिस्प्ले और पहुँच', dispTheme: 'थीम', themeAuto: 'मेरे डिवाइस जैसी', themeLight: 'हल्की', themeDark: 'गहरी',
  dispCvd: 'रंग-अंधता के लिए सुरक्षित दल-रंग', dispCvdHint: 'ऐसे रंग इस्तेमाल करता है जो रंग-अंधता की आम क़िस्मों में भी अलग दिखते हैं, और हर रंग-चिह्न पर किनारी लगाता है। नक्शे, चार्ट और निर्यात की गई तस्वीरें भी इन्हीं रंगों में बनती हैं।',
  dispKeys: 'कीबोर्ड', dispKeysHint: '/ दबाकर खोजें। Tab पन्ने में आगे बढ़ाता है और सीट-सूची में Enter से सीट खुलती है। Ctrl+Z और Ctrl+Y परिदृश्य के बदलाव पलटते और दोहराते हैं। Esc संवाद बंद करता है।',
  skipMain: 'सीधे सामग्री पर जाएँ', srResult: 'नतीजा बदला: {v}', dispDone: 'हो गया', mapLabel: 'चुनाव-क्षेत्र का नक्शा। नीचे की सीट-सूची में वही जानकारी है।',
});
// the main parties in the Okabe-Ito palette, which stays apart for the common kinds of colour blindness
const CVD_COLORS = {BJP: '#E69F00', INC: '#0072B2', AAP: '#56B4E9', SP: '#D55E00', AITC: '#009E73', DMK: '#CC79A7', TDP: '#F0E442', BSP: '#7F7F7F', SHS_SHINDE: '#B8860B', SSUBT: '#E05A2B', NCP: '#2D9CDB', NCPSP: '#2B5F8A', 'CPI(M)': '#8B1A1A', CPI: '#B5651D', RJD: '#1B5E20', 'JD(U)': '#4B3F99', JDU: '#4B3F99', YSRCP: '#3E8E8E', BRS: '#C2185B', BJD: '#2E7D32', JMM: '#4E7A27', IND: '#8D6E63', OTH: '#9AA0AA'};
S.cvd = !!store.get('cvd', false);
const themeNow = () => store.get('theme', 'auto');
function applyTheme(v){
  const r = document.documentElement; store.set('theme', v);
  if(v === 'dark' || v === 'light') r.setAttribute('data-theme', v); else r.removeAttribute('data-theme');
  const dark = v === 'dark' || (v === 'auto' && matchMedia('(prefers-color-scheme: dark)').matches);
  const m = document.querySelector('meta[name="theme-color"]'); if(m) m.setAttribute('content', dark ? '#101216' : '#141414');
}
function applyCvd(on, redraw){
  S.cvd = !!on; store.set('cvd', S.cvd);
  if(S.cvd) document.documentElement.setAttribute('data-cvd', '1'); else document.documentElement.removeAttribute('data-cvd');
  if(redraw){ if(INDEX) renderHome(); if(E && !$('#app').hidden) rebuild(true); if(!$('#pageview').hidden) route(); }
}
function openDisplay(){
  const th = themeNow();
  modal(`<h3>${esc(t('dispTitle'))}</h3>
    <p class="small" style="margin:8px 0 4px">${esc(t('dispTheme'))}</p>
    <div class="seg" role="group" aria-label="${esc(t('dispTheme'))}">${[['auto', 'themeAuto'], ['light', 'themeLight'], ['dark', 'themeDark']].map(([v, k]) => `<button data-th="${v}" aria-pressed="${th === v}">${esc(t(k))}</button>`).join('')}</div>
    <label class="row" style="margin:14px 0 2px;gap:8px;align-items:flex-start"><input type="checkbox" id="dispCvd" ${S.cvd ? 'checked' : ''} style="margin-top:4px"><span><b>${esc(t('dispCvd'))}</b><br><span class="small">${esc(t('dispCvdHint'))}</span></span></label>
    <p class="small" style="margin:12px 0"><b>${esc(t('dispKeys'))}.</b> ${esc(t('dispKeysHint'))}</p>
    ${typeof installBlock === 'function' ? installBlock() : ''}
    <div class="row" style="margin-top:10px"><button class="btn primary" data-close>${esc(t('dispDone'))}</button></div>`);
  document.querySelectorAll('#modalRoot [data-th]').forEach(b => b.onclick = () => { applyTheme(b.dataset.th); document.querySelectorAll('#modalRoot [data-th]').forEach(x => x.setAttribute('aria-pressed', x === b)); });
  $('#dispCvd').onchange = e => { applyCvd(e.target.checked, true); };
  if(typeof installBind === 'function') installBind();
}
$('#dispBtn').onclick = openDisplay;
applyTheme(themeNow());
matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => { if(themeNow() === 'auto') applyTheme('auto'); });

// skip link: go to whichever view is showing
$('#skipLink').onclick = e => { e.preventDefault(); const t0 = [$('#pageview'), $('#seatview'), $('#app') && !$('#app').hidden ? $('#mainApp') : null, $('#home')].find(el => el && !el.hidden); if(t0){ t0.focus({preventScroll: true}); t0.scrollIntoView(); } };

// dialogs: Esc closes, Tab stays inside, and focus goes back to where it was
document.addEventListener('keydown', ev => {
  const root = $('#modalRoot'); if(!root.firstChild) return;
  if(ev.key === 'Escape'){ root.innerHTML = ''; return; }
  if(ev.key === 'Tab'){
    const f = [...root.querySelectorAll('a[href], button:not(:disabled), input:not(:disabled), select:not(:disabled), textarea:not(:disabled), [tabindex="0"]')].filter(el => el.offsetParent !== null);
    if(!f.length) return; const a = f[0], z = f[f.length - 1];
    if(ev.shiftKey && (document.activeElement === a || document.activeElement === root.querySelector('.modal > div'))){ ev.preventDefault(); z.focus(); }
    else if(!ev.shiftKey && document.activeElement === z){ ev.preventDefault(); a.focus(); }
  }
});
new MutationObserver(() => { const r = $('#modalRoot'); if(!r.firstChild && modalPrev && document.contains(modalPrev)){ try{ modalPrev.focus({preventScroll: true}); }catch(e){} modalPrev = null; } }).observe($('#modalRoot'), {childList: true});

// screen readers: say the result once the sliders have stopped moving, and label the seat chart and the map
let srTimer = null;
function a11yResult(order){
  const hs = $('#hemi svg'); if(hs) hs.setAttribute('aria-label', $('#verdict').textContent.trim() + ' ' + order.slice(0, 6).filter(k => RES.counts[k] > 0).map(k => `${U[k].name} ${RES.counts[k]}`).join(', '));
  const ms = $('#map svg'); if(ms){ ms.setAttribute('role', 'img'); ms.setAttribute('aria-label', t('mapLabel')); }
  clearTimeout(srTimer); srTimer = setTimeout(() => { const el = $('#srLive'); if(el) el.textContent = t('srResult', {v: $('#verdict').textContent.trim()}); }, 900);
}
