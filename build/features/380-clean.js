// Clean view (#42): the controls out of the way, only the seat arc, tally and map in a 16:9 or 9:16 frame, for screen recording (Shorts, Reels).
// It updates as the scenario changes, and the left and right arrow keys move the swing so a recording can show it sliding.
addI18n('en', {
  cvBtn: 'Clean view', cvTitle: 'Clean view', cvWide: '16:9', cvStory: '9:16', cvFull: 'Full screen', cvClose: 'Close', cvKeys: 'Left and right arrows move the swing. Esc closes.',
});
addI18n('hi', {
  cvBtn: 'साफ़ दृश्य', cvTitle: 'साफ़ दृश्य', cvWide: '16:9', cvStory: '9:16', cvFull: 'पूरी स्क्रीन', cvClose: 'बंद करें', cvKeys: 'बाएँ और दाएँ तीर स्विंग खिसकाते हैं। Esc बंद करता है।',
});
const CV = {open: false, fmt: 'wide', timer: null, busy: false, again: false, hide: null};
function cvEl(){
  let el = $('#cleanView');
  if(!el){
    el = document.createElement('div'); el.id = 'cleanView'; el.setAttribute('role', 'dialog'); el.setAttribute('aria-modal', 'true'); el.setAttribute('aria-label', t('cvTitle'));
    el.innerHTML = `<div class="cvbar" id="cvBar"><div class="seg" role="group" aria-label="Format"><button data-cvf="wide">${esc(t('cvWide'))}</button><button data-cvf="story">${esc(t('cvStory'))}</button></div><button class="btn small" id="cvFull">${esc(t('cvFull'))}</button><span class="small" id="cvKeys">${esc(t('cvKeys'))}</span><button class="btn small" id="cvX">${esc(t('cvClose'))}</button></div><div class="cvstage" id="cvStage"><canvas id="cvCanvas" aria-label="${esc(t('cvTitle'))}"></canvas></div>`;
    document.body.appendChild(el);
    el.querySelectorAll('[data-cvf]').forEach(b => b.onclick = () => { CV.fmt = b.dataset.cvf; cvDraw(); });
    $('#cvX').onclick = closeClean; $('#cvFull').onclick = () => { if(document.fullscreenElement) document.exitFullscreen(); else if(el.requestFullscreen) el.requestFullscreen().catch(() => {}); };
    el.addEventListener('pointermove', cvShowBar);
  }
  return el;
}
function cvShowBar(){ const bar = $('#cvBar'); if(!bar) return; bar.classList.remove('off'); clearTimeout(CV.hide); CV.hide = setTimeout(() => bar.classList.add('off'), 2800); }
async function cvDraw(){
  if(!CV.open || !E || !RES) return;
  if(CV.busy){ CV.again = true; return; }
  CV.busy = true;
  try{
    const c = await composeImage(CV.fmt), cv = $('#cvCanvas'); cv.width = c.width; cv.height = c.height; cv.getContext('2d').drawImage(c, 0, 0);
    cv.style.aspectRatio = CV.fmt === 'story' ? '9 / 16' : '16 / 9';
    document.querySelectorAll('#cleanView [data-cvf]').forEach(b => b.setAttribute('aria-pressed', b.dataset.cvf === CV.fmt));
  }finally{ CV.busy = false; if(CV.again){ CV.again = false; cvDraw(); } }
}
// called at the end of run(): redraw once the sliders have settled
function cleanTouch(){ if(!CV.open) return; clearTimeout(CV.timer); CV.timer = setTimeout(cvDraw, 140); }
function openClean(){
  if(!E || !RES) return;
  $('#modalRoot').innerHTML = ''; CV.open = true; cvEl(); document.body.classList.add('clean'); cvDraw(); cvShowBar(); track('clean_view', {fmt: CV.fmt});
  $('#cvX').focus();
}
function closeClean(){ CV.open = false; document.body.classList.remove('clean'); if(document.fullscreenElement) document.exitFullscreen().catch(() => {}); clearTimeout(CV.hide); }
document.addEventListener('keydown', ev => {
  if(!CV.open) return;
  if(ev.key === 'Escape' && !document.fullscreenElement){ ev.preventDefault(); closeClean(); return; }
  if(ev.key === 'ArrowLeft' || ev.key === 'ArrowRight'){
    ev.preventDefault(); const d = ev.key === 'ArrowRight' ? 0.5 : -0.5; easyPair();
    S.swing.pts = Math.max(-15, Math.min(15, Math.round((S.swing.pts + d) * 10) / 10)); applySwing(); cvShowBar();
  }
});
SHARE_ACTIONS.push({k: 'cvBtn', run: openClean});
