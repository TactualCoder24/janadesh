// Draw and annotate (#43): draw, highlight, point with arrows and write on an exported image before downloading it.
addI18n('en', {
  anBtn: 'Draw on it', anTitle: 'Draw and annotate', anHint: 'Draw on the image, then press Done to download or share it.', anPen: 'Pen', anMarker: 'Highlighter', anArrow: 'Arrow', anText: 'Text', anUndo: 'Undo', anClear: 'Clear', anDone: 'Done', anCancel: 'Cancel',
  anTextPh: 'Type, then press Enter', anColour: 'Colour', anSize: 'Thickness', anRed: 'Red', anBlack: 'Black', anBlue: 'Blue', anYellow: 'Yellow', anWhite: 'White', anGreen: 'Green', anImage: 'Annotated image',
});
addI18n('hi', {
  anBtn: 'इस पर बनाएँ', anTitle: 'बनाएँ और लिखें', anHint: 'तस्वीर पर बनाएँ, फिर डाउनलोड या शेयर करने के लिए "हो गया" दबाएँ।', anPen: 'क़लम', anMarker: 'हाइलाइटर', anArrow: 'तीर', anText: 'लिखें', anUndo: 'पलटें', anClear: 'मिटाएँ', anDone: 'हो गया', anCancel: 'रद्द करें',
  anTextPh: 'लिखें, फिर Enter दबाएँ', anColour: 'रंग', anSize: 'मोटाई', anRed: 'लाल', anBlack: 'काला', anBlue: 'नीला', anYellow: 'पीला', anWhite: 'सफ़ेद', anGreen: 'हरा', anImage: 'चिह्नित तस्वीर',
});
const AN_COLOURS = [['#D7263D', 'anRed'], ['#141414', 'anBlack'], ['#1F4FA8', 'anBlue'], ['#16794A', 'anGreen'], ['#F2B600', 'anYellow'], ['#FFFFFF', 'anWhite']];
function anDraw(g, base, ops, W){
  g.clearRect(0, 0, base.width, base.height); g.drawImage(base, 0, 0);
  g.lineCap = 'round'; g.lineJoin = 'round';
  ops.forEach(o => {
    g.save(); g.strokeStyle = g.fillStyle = o.c;
    if(o.k === 'pen' || o.k === 'marker'){
      g.globalAlpha = o.k === 'marker' ? 0.35 : 1; g.lineWidth = o.k === 'marker' ? o.w * 4 : o.w; g.beginPath(); o.p.forEach((p, i) => i ? g.lineTo(p[0], p[1]) : g.moveTo(p[0], p[1])); if(o.p.length === 1) g.lineTo(o.p[0][0] + 0.01, o.p[0][1]); g.stroke();
    } else if(o.k === 'arrow'){
      const [a, b] = o.p, ang = Math.atan2(b[1] - a[1], b[0] - a[0]), hl = o.w * 4.5 + 10;
      g.lineWidth = o.w; g.beginPath(); g.moveTo(a[0], a[1]); g.lineTo(b[0] - Math.cos(ang) * hl * 0.6, b[1] - Math.sin(ang) * hl * 0.6); g.stroke();
      g.beginPath(); g.moveTo(b[0], b[1]); g.lineTo(b[0] - hl * Math.cos(ang - 0.4), b[1] - hl * Math.sin(ang - 0.4)); g.lineTo(b[0] - hl * Math.cos(ang + 0.4), b[1] - hl * Math.sin(ang + 0.4)); g.closePath(); g.fill();
    } else if(o.k === 'text'){
      g.font = `700 ${o.s}px "Anek Latin","Anek Devanagari","Hind", system-ui`; g.textBaseline = 'middle'; g.lineWidth = Math.max(3, o.s / 7); g.strokeStyle = o.c === '#FFFFFF' || o.c === '#F2B600' ? '#141414' : '#FFFFFF'; g.strokeText(o.t, o.p[0][0], o.p[0][1]); g.fillText(o.t, o.p[0][0], o.p[0][1]);
    }
    g.restore();
  });
}
function annotateImage(src, opts){
  const W = src.width, H = src.height, base = document.createElement('canvas'); base.width = W; base.height = H; base.getContext('2d').drawImage(src, 0, 0);
  const st = {tool: 'pen', colour: AN_COLOURS[0][0], size: 1, ops: [], cur: null};
  const sizes = [Math.max(3, W / 300), Math.max(6, W / 160), Math.max(10, W / 100)];
  modal(`<h3>${esc(t('anTitle'))}</h3><p class="small" style="margin:2px 0 8px">${esc(t('anHint'))}</p>
    <div class="row" style="gap:6px;margin-bottom:8px;align-items:center">
      <div class="seg" role="group" aria-label="${esc(t('anTitle'))}">${[['pen', 'anPen'], ['marker', 'anMarker'], ['arrow', 'anArrow'], ['text', 'anText']].map(([k, l]) => `<button data-tool="${k}" aria-pressed="${k === st.tool}">${esc(t(l))}</button>`).join('')}</div>
      <span class="ancols" role="group" aria-label="${esc(t('anColour'))}">${AN_COLOURS.map(([c, l]) => `<button class="ancol" data-col="${c}" style="background:${c}" aria-label="${esc(t(l))}" aria-pressed="${c === st.colour}"></button>`).join('')}</span>
      <label class="small">${esc(t('anSize'))} <input type="range" id="anSize" min="0" max="2" step="1" value="1" style="width:70px;vertical-align:middle"></label>
    </div>
    <div class="anwrap" id="anWrap"><canvas id="anCv" width="${W}" height="${H}" style="touch-action:none;width:100%;height:auto;display:block;border:1px solid var(--line);border-radius:8px;cursor:crosshair"></canvas></div>
    <div class="row" style="margin-top:8px"><button class="btn" id="anUndo">${esc(t('anUndo'))}</button><button class="btn" id="anClear">${esc(t('anClear'))}</button><span style="flex:1"></span><button class="btn" data-close>${esc(t('anCancel'))}</button><button class="btn primary" id="anDone">${esc(t('anDone'))}</button></div>`);
  const cv = $('#anCv'), g = cv.getContext('2d'), redraw = () => anDraw(g, base, st.cur ? st.ops.concat([st.cur]) : st.ops, W);
  redraw();
  const pos = ev => { const r = cv.getBoundingClientRect(); return [(ev.clientX - r.left) * W / r.width, (ev.clientY - r.top) * H / r.height]; };
  const textAt = (p, ev) => {
    const wrap = $('#anWrap'), r = cv.getBoundingClientRect(), wr = wrap.getBoundingClientRect(), inp = document.createElement('input');
    inp.className = 'inp'; inp.placeholder = t('anTextPh'); inp.style.cssText = `position:absolute;left:${Math.min(ev.clientX - wr.left, wr.width - 200)}px;top:${ev.clientY - wr.top - 16}px;width:200px;z-index:2`; wrap.style.position = 'relative'; wrap.appendChild(inp); inp.focus();
    let done = false; const commit = ok => { if(done) return; done = true; const v = inp.value.trim(); inp.remove(); if(ok && v){ st.ops.push({k: 'text', t: v, p: [p], c: st.colour, s: Math.round(W / 24 * (0.8 + st.size * 0.35))}); redraw(); } };
    inp.onkeydown = e => { if(e.key === 'Enter'){ e.preventDefault(); commit(true); } else if(e.key === 'Escape'){ e.stopPropagation(); commit(false); } }; inp.onblur = () => commit(true);
  };
  cv.onpointerdown = ev => {
    if(st.tool === 'text'){ ev.preventDefault(); textAt(pos(ev), ev); return; }
    cv.setPointerCapture(ev.pointerId); const p = pos(ev); st.cur = {k: st.tool, p: st.tool === 'arrow' ? [p, p] : [p], c: st.colour, w: sizes[st.size]}; redraw();
  };
  cv.onpointermove = ev => { if(!st.cur) return; const p = pos(ev); if(st.cur.k === 'arrow') st.cur.p[1] = p; else st.cur.p.push(p); redraw(); };
  const end = () => { if(!st.cur) return; st.ops.push(st.cur); st.cur = null; redraw(); };
  cv.onpointerup = end; cv.onpointercancel = end;
  document.querySelectorAll('#modalRoot [data-tool]').forEach(b => b.onclick = () => { st.tool = b.dataset.tool; document.querySelectorAll('#modalRoot [data-tool]').forEach(x => x.setAttribute('aria-pressed', x === b)); cv.style.cursor = st.tool === 'text' ? 'text' : 'crosshair'; });
  document.querySelectorAll('#modalRoot [data-col]').forEach(b => b.onclick = () => { st.colour = b.dataset.col; document.querySelectorAll('#modalRoot [data-col]').forEach(x => x.setAttribute('aria-pressed', x === b)); });
  $('#anSize').oninput = e => { st.size = +e.target.value; };
  $('#anUndo').onclick = () => { st.ops.pop(); redraw(); };
  $('#anClear').onclick = () => { st.ops = []; redraw(); };
  $('#anDone').onclick = () => { st.cur = null; const out = document.createElement('canvas'); out.width = W; out.height = H; anDraw(out.getContext('2d'), base, st.ops, W); imageModal(Object.assign({}, opts, {title: t('anImage'), compose: async () => out, noFormats: true})); };
}
