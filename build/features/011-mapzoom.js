// Pinch / drag / button zoom for the seat map.
const MZ = {k:1, x:0, y:0, max:10};
function mzBox(){ return $('#mapz').getBoundingClientRect(); }
function mzApply(){
  const z = $('#mapz'), m = $('#map'), r = z.getBoundingClientRect();
  MZ.k = Math.max(1, Math.min(MZ.max, MZ.k));
  MZ.x = Math.min(0, Math.max(r.width * (1 - MZ.k), MZ.x)); MZ.y = Math.min(0, Math.max(m.offsetHeight * (1 - MZ.k) , MZ.y));
  if(MZ.k === 1){ MZ.x = 0; MZ.y = 0; }
  m.style.transform = MZ.k === 1 ? '' : `translate(${MZ.x}px,${MZ.y}px) scale(${MZ.k})`;
  z.classList.toggle('zoomed', MZ.k > 1); $('#zReset').hidden = MZ.k === 1;
}
function resetZoom(){ MZ.k = 1; MZ.x = 0; MZ.y = 0; if($('#map')) mzApply(); }
function mzAt(f, cx, cy){ // zoom by factor f keeping point (cx, cy) in the container fixed
  const k0 = MZ.k, k1 = Math.max(1, Math.min(MZ.max, k0 * f));
  MZ.x = cx - (cx - MZ.x) * k1 / k0; MZ.y = cy - (cy - MZ.y) * k1 / k0; MZ.k = k1; mzApply();
}
function zoomToSeat(i){
  const p = $('#map path.seat[data-i="' + i + '"]'); if(!p) return;
  const z = $('#mapz'), m = $('#map'), zr = z.getBoundingClientRect();
  MZ.k = 1; mzApply();
  const pr = p.getBoundingClientRect(), mr = m.getBoundingClientRect();
  const cx = pr.left + pr.width/2 - mr.left, cy = pr.top + pr.height/2 - mr.top;
  const k = Math.max(1, Math.min(6, 0.45 * Math.min(zr.width / Math.max(pr.width, 1), zr.height / Math.max(pr.height, 1))));
  MZ.k = k; MZ.x = zr.width/2 - cx*k; MZ.y = zr.height/2 - cy*k; mzApply();
}
(function initZoom(){
  const z = $('#mapz'), ptr = new Map(); let g = null, moved = false;
  $('#zIn').onclick = () => { const r = mzBox(); mzAt(1.6, r.width/2, r.height/2); };
  $('#zOut').onclick = () => { const r = mzBox(); mzAt(1/1.6, r.width/2, r.height/2); };
  $('#zReset').onclick = resetZoom;
  z.addEventListener('wheel', e => { if(!e.ctrlKey) return; e.preventDefault(); const r = mzBox(); mzAt(Math.exp(-e.deltaY * .01), e.clientX - r.left, e.clientY - r.top); }, {passive:false});
  z.addEventListener('dblclick', e => { const r = mzBox(); mzAt(MZ.k > 1.2 ? 1 / MZ.k : 2.5, e.clientX - r.left, e.clientY - r.top); });
  z.addEventListener('pointerdown', e => { if(e.target.closest('.zoombtns')) return; ptr.set(e.pointerId, {x:e.clientX, y:e.clientY}); moved = false;
    g = {k:MZ.k, x:MZ.x, y:MZ.y, d:null, c:null, sx:e.clientX, sy:e.clientY}; });
  z.addEventListener('pointermove', e => { const p = ptr.get(e.pointerId); if(!p) return; p.x = e.clientX; p.y = e.clientY;
    const r = mzBox();
    if(ptr.size >= 2){ const [a, b] = [...ptr.values()], d = Math.hypot(a.x-b.x, a.y-b.y), c = {x:(a.x+b.x)/2 - r.left, y:(a.y+b.y)/2 - r.top};
      if(!g.d){ g.d = d; g.c = c; g.k = MZ.k; g.x = MZ.x; g.y = MZ.y; }
      const k1 = Math.max(1, Math.min(MZ.max, g.k * d / g.d));
      MZ.x = c.x - (g.c.x - g.x) * k1 / g.k; MZ.y = c.y - (g.c.y - g.y) * k1 / g.k; MZ.k = k1; moved = true; mzApply(); return; }
    if(MZ.k > 1){ const dx = e.clientX - g.sx, dy = e.clientY - g.sy;
      if(!moved && Math.hypot(dx, dy) > 6){ moved = true; try{ z.setPointerCapture(e.pointerId); }catch(_){} }
      if(moved){ MZ.x = g.x + dx; MZ.y = g.y + dy; mzApply(); } } });
  const up = e => { ptr.delete(e.pointerId); if(ptr.size < 2 && g) g.d = null; if(!ptr.size) setTimeout(() => moved = false, 60); };
  z.addEventListener('pointerup', up); z.addEventListener('pointercancel', up);
  z.addEventListener('click', e => { if(moved){ e.stopPropagation(); e.preventDefault(); } }, true);
})();
