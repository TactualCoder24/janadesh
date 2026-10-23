// Phone layout: tab bar (Result / Map / Controls / Seats), compact tally on top, controls in a pull-up sheet, swipe between tabs.
addI18n('en', {
  ptResult: 'Result', ptMap: 'Map', ptControls: 'Controls', ptSeats: 'Seats',
  zoomHint: 'Pinch or use + and − to zoom. Tap a seat for details.',
});
addI18n('hi', {
  ptResult: 'नतीजा', ptMap: 'नक्शा', ptControls: 'नियंत्रण', ptSeats: 'सीटें',
  zoomHint: 'ज़ूम के लिए दो उँगलियों से पिंच करें या + और − दबाएँ। विवरण के लिए सीट पर टैप करें।',
});
const PHONE = matchMedia('(max-width:700px)');
function paintTabbar(){
  const open = document.body.classList.contains('sheet-open');
  document.querySelectorAll('#tabbar button').forEach(b => b.setAttribute('aria-selected', b.dataset.pt === 'controls' ? open : (!open && b.dataset.pt === document.body.dataset.ptab)));
}
function openSheet(full){ document.body.classList.add('sheet-open'); document.body.classList.toggle('sheet-full', !!full); paintTabbar(); }
function closeSheet(){ document.body.classList.remove('sheet-open', 'sheet-full'); paintTabbar(); }
function setPTab(name){
  if(name === 'controls'){ document.body.classList.contains('sheet-open') ? closeSheet() : openSheet(); return; }
  closeSheet();
  document.body.dataset.ptab = name; S.ptab = name;
  paintTabbar();
  if(PHONE.matches) window.scrollTo(0, 0);
}
function renderDock(order, maj){
  const dk = $('#dock'); if(!dk) return;
  const seats = order.filter(k => RES.counts[k] > 0);
  dk.innerHTML = `<div class="dbar" role="img" aria-label="${esc(t('needed',{n:maj}))}">${seats.map(k => `<i style="width:${100*RES.counts[k]/E.N}%;background:${U[k].hex}"></i>`).join('')}<u style="left:${100*(maj-.5)/E.N}%"></u></div>` +
    `<div class="drow">${seats.slice(0, 5).map(k => { const d = RES.counts[k] - U[k].baseSeats; return `<span><i class="sw" style="background:${U[k].hex}"></i>${esc(shortName(U[k]))} <b class="num">${RES.counts[k]}</b>${d ? `<small class="${d>0?'up':'down'}">${d>0?'+':''}${d}</small>` : ''}</span>`; }).join('')}<span class="small">${esc(t('needed',{n:maj}))}</span></div>`;
}
(function initPhone(){
  const bar = $('#tabbar'); bar.querySelectorAll('button').forEach(b => b.onclick = () => setPTab(b.dataset.pt));
  $('#sheetScrim').onclick = closeSheet;
  // drag the sheet handle: up = full height, down = half / close
  const h = $('#sheetHandle'); let y0 = null;
  h.addEventListener('pointerdown', e => { y0 = e.clientY; h.setPointerCapture(e.pointerId); });
  h.addEventListener('pointerup', e => { if(y0 == null) return; const dy = e.clientY - y0; y0 = null;
    if(Math.abs(dy) < 8){ document.body.classList.toggle('sheet-full'); return; }
    if(dy < -40) document.body.classList.add('sheet-full'); else if(dy > 50) document.body.classList.contains('sheet-full') ? document.body.classList.remove('sheet-full') : closeSheet(); });
  h.addEventListener('pointercancel', () => { y0 = null; });
  // swipe sideways between Result / Map / Seats
  let sx = 0, sy = 0, st = 0, ok = false;
  const app = $('#app');
  app.addEventListener('touchstart', e => { const tg = e.target;
    ok = PHONE.matches && e.touches.length === 1 && !document.body.classList.contains('sheet-open') && !tg.closest('.tw, input, select, textarea, .mapz.zoomed, .tabs, .drow, .seatlist, svg[style*="min-width"]');
    sx = e.touches[0].clientX; sy = e.touches[0].clientY; st = Date.now(); }, {passive:true});
  app.addEventListener('touchend', e => { if(!ok) return; ok = false; const c = e.changedTouches[0], dx = c.clientX - sx, dy = c.clientY - sy;
    if(Math.abs(dx) < 70 || Math.abs(dy) > 45 || Date.now() - st > 600) return;
    const order = ['result', 'map', 'seats'], i = order.indexOf(document.body.dataset.ptab), n = i + (dx < 0 ? 1 : -1);
    if(n >= 0 && n < order.length) setPTab(order[n]); }, {passive:true});
  PHONE.addEventListener('change', () => { closeSheet(); });
  document.body.dataset.ptab = 'result';
})();
