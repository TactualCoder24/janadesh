// Undo and redo (#45): every change to the scenario (swings, alliances, locks, overrides, the lab) is a step you can go back to with the arrows or Ctrl+Z and Ctrl+Y.
addI18n('en', {undoBtn: 'Undo', redoBtn: 'Redo', undoDone: 'Undone', redoDone: 'Redone', undoNone: 'Nothing to undo', redoNone: 'Nothing to redo'});
addI18n('hi', {undoBtn: 'पलटें', redoBtn: 'दोहराएँ', undoDone: 'पलट दिया', redoDone: 'दोहराया', undoNone: 'पलटने को कुछ नहीं', redoNone: 'दोहराने को कुछ नहीं'});
const HIST = {stack: [], i: -1, key: null, busy: false, timer: null};
function histSnap(){ const s = scenario(); delete s.partyEdit; return JSON.stringify(s); }
function histBtns(){
  const u = $('#undoBtn'), r = $('#redoBtn'); if(!u || !r) return;
  u.disabled = HIST.i <= 0; r.disabled = HIST.i >= HIST.stack.length - 1;
}
function histPush(){
  HIST.timer = null; if(!E || HIST.busy) return;
  const key = [S.kind, S.state, S.eid, S.next, S.ahead].join('|'), snap = histSnap();
  if(key !== HIST.key){ HIST.key = key; HIST.stack = [snap]; HIST.i = 0; histBtns(); return; }
  if(snap === HIST.stack[HIST.i]) return;
  HIST.stack = HIST.stack.slice(0, HIST.i + 1); HIST.stack.push(snap); if(HIST.stack.length > 80) HIST.stack.shift(); HIST.i = HIST.stack.length - 1; histBtns();
}
// called at the end of run(): steps that come in quick succession (a slider being dragged) count as one
function undoNote(){ if(HIST.busy || !E) return; clearTimeout(HIST.timer); HIST.timer = setTimeout(histPush, 350); }
function histApply(snap){
  const s = JSON.parse(snap); HIST.busy = true;
  try{
    Object.assign(S, {mode: s.mode || 'party', method: s.method || 'prop', allyEdit: s.allyEdit || {}, transfer: s.transfer || 100, fixNational: s.fixNational !== false, lab: s.lab || null, wave: s.wave || 'none', real: s.real || null});
    buildUnits();
    Object.assign(S, {T: s.T || {}, locks: s.locks || {}, regional: s.regional || {}, reserved: s.reserved || {SC: {}, ST: {}}, overrides: s.overrides || {}, swing: s.swing || {a: null, b: null, pts: 0}});
    S.mc = null; mapCache = {key: null}; S.pollScn = null; S.whatIf = null;
    run(); renderPane(); drawHistory();
  } finally { HIST.busy = false; }
}
function histStep(d){
  if(HIST.timer){ clearTimeout(HIST.timer); histPush(); }   // record what is on screen before going back
  const j = HIST.i + d;
  if(j < 0 || j >= HIST.stack.length){ toast(t(d < 0 ? 'undoNone' : 'redoNone')); return; }
  HIST.i = j; histApply(HIST.stack[j]); histBtns(); toast(t(d < 0 ? 'undoDone' : 'redoDone'));
}
(() => {
  const h = $('#cardResult .headline'), story = $('#storyBtn'); if(!h || !story) return;
  story.insertAdjacentHTML('beforebegin', `<button class="btn small" id="undoBtn" disabled style="margin-left:auto">↶ <span class="sronly" data-i18n="undoBtn"></span></button><button class="btn small" id="redoBtn" disabled>↷ <span class="sronly" data-i18n="redoBtn"></span></button>`);
  story.style.marginLeft = '0';
  $('#undoBtn').onclick = () => histStep(-1); $('#redoBtn').onclick = () => histStep(1);
})();
function histTitles(){ const u = $('#undoBtn'), r = $('#redoBtn'); if(u){ u.title = t('undoBtn') + ' (Ctrl+Z)'; u.setAttribute('aria-keyshortcuts', 'Control+Z'); } if(r){ r.title = t('redoBtn') + ' (Ctrl+Y)'; r.setAttribute('aria-keyshortcuts', 'Control+Y'); } }
histTitles();
document.addEventListener('keydown', ev => {
  if(!(ev.ctrlKey || ev.metaKey) || $('#app').hidden || $('#modalRoot').firstChild) return;
  const tg = ev.target, typing = tg && (tg.isContentEditable || tg.tagName === 'TEXTAREA' || tg.tagName === 'SELECT' || (tg.tagName === 'INPUT' && !/^(range|checkbox|radio|button)$/.test(tg.type)));
  if(typing) return;
  const k = ev.key.toLowerCase();
  if(k === 'z' && !ev.shiftKey){ ev.preventDefault(); histStep(-1); }
  else if(k === 'y' || (k === 'z' && ev.shiftKey)){ ev.preventDefault(); histStep(1); }
});
