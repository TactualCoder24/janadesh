
// ---------- charts ----------
function svgText(x,y,t,o={}){ return `<text x="${x}" y="${y}" font-size="${o.size||12}" fill="${o.fill||'var(--muted)'}" text-anchor="${o.anchor||'start'}" ${o.weight?`font-weight="${o.weight}"`:''}>${esc(t)}</text>`; }
function drawCharts(order, maj){
  const ks = order.filter(k => RES.counts[k] > 0 || RES.T[k] >= 1).slice(0, 8);
  // votes vs seats
  { const W = 460, rowH = 30, H = ks.length*rowH + 24, L = 120, R = 70;
    const mx = Math.max(10, ...ks.map(k => Math.max(RES.T[k], 100*RES.counts[k]/E.N)));
    const x = v => L + (W-L-R) * v / mx;
    let g = '';
    ks.forEach((k,i) => { const y = i*rowH + 6, sp = 100*RES.counts[k]/E.N;
      g += svgText(0, y+14, U[k].name.slice(0,17), {fill:'var(--ink)', size:12.5});
      g += `<rect x="${L}" y="${y}" width="${Math.max(1,x(RES.T[k])-L)}" height="10" rx="3" fill="${U[k].hex}" fill-opacity=".3"/>`;
      g += `<rect x="${L}" y="${y+12}" width="${Math.max(1,x(sp)-L)}" height="10" rx="3" fill="${U[k].hex}"/>`;
      g += svgText(x(Math.max(RES.T[k],sp))+6, y+17, `${fmt1(RES.T[k])} / ${fmt1(sp)}%`, {size:11.5});
    });
    $('#chVS').innerHTML = `<svg viewBox="0 0 ${W} ${H}" role="img" aria-label="Vote share against seat share">${g}${svgText(L, H-4, 'votes % / seats %', {size:11})}</svg>`;
  }
  // seat change
  { const items = U.map((g,k)=>({k, d: RES.counts[k]-g.baseSeats})).filter(o => o.d !== 0).sort((a,b)=>b.d-a.d).slice(0, 10);
    const ent = INDEX.elections.find(e=>e.id===S.eid);
    $('#capDelta').textContent = `Seats gained or lost against the ${ent.label} result.`;
    if(!items.length){ $('#chDelta').innerHTML = '<p class="small">No seats change hands yet. Move a vote share slider to see gains and losses.</p>'; }
    else { const W = 460, rowH = 26, H = items.length*rowH + 10, L = 120, mid = L + (W-L)/2;
      const mx = Math.max(...items.map(o=>Math.abs(o.d)));
      const sc = v => (W-L)/2 * 0.78 * v / mx;
      let g = `<line x1="${mid}" x2="${mid}" y1="0" y2="${H}" stroke="var(--line)"/>`;
      items.forEach((o,i) => { const y = i*rowH + 4, w = sc(o.d);
        g += svgText(0, y+13, U[o.k].name.slice(0,17), {fill:'var(--ink)', size:12.5});
        g += `<rect x="${w>=0?mid:mid+w}" y="${y+2}" width="${Math.abs(w)}" height="14" rx="3" fill="${U[o.k].hex}"/>`;
        g += svgText(w>=0 ? mid+w+5 : mid+w-5, y+13, (o.d>0?'+':'')+o.d, {anchor: w>=0?'start':'end', fill: o.d>0?'var(--good)':'var(--bad)', weight:600});
      });
      $('#chDelta').innerHTML = `<svg viewBox="0 0 ${W} ${H}" role="img" aria-label="Seat change">${g}</svg>`;
    }
  }
  // margins
  { const bins = [[0,2,'0–2'],[2,5,'2–5'],[5,10,'5–10'],[10,20,'10–20'],[20,101,'20+']];
    const top = order.slice(0,4);
    const cnt = bins.map(() => new Map());
    E.seats.forEach((s,i) => { const x = RES.shares[i], w = RES.win[i], m = 100*(x[w]-x[RES.second[i]]);
      let b = bins.findIndex(r => m >= r[0] && m < r[1]); if(b < 0) b = 0; const key = top.includes(w) ? w : -1; cnt[b].set(key, (cnt[b].get(key)||0)+1); });
    const W = 460, H = 200, L = 34, B = 24, bw = (W-L)/bins.length;
    const mx = Math.max(...cnt.map(m => [...m.values()].reduce((a,b)=>a+b,0)), 1);
    const y = v => (H-B-18) * v / mx;
    let g = '';
    [0, .5, 1].forEach(f => { const v = Math.round(mx*f), yy = H-B-y(v); g += `<line x1="${L}" x2="${W}" y1="${yy}" y2="${yy}" stroke="var(--line)"/>` + svgText(L-6, yy+4, v, {anchor:'end', size:11}); });
    cnt.forEach((m,bi) => { let acc = 0; const x0 = L + bi*bw + bw*.15;
      [...top, -1].forEach(k => { const v = m.get(k)||0; if(!v) return; const h = y(v); g += `<rect x="${x0}" y="${H-B-acc-h}" width="${bw*.7}" height="${h}" fill="${k>=0?U[k].hex:'#C9CCD6'}"><title>${k>=0?esc(U[k].name):'Others'}: ${v}</title></rect>`; acc += h; });
      g += svgText(x0 + bw*.35, H-6, bins[bi][2]+' pts', {anchor:'middle', size:11.5});
      const tot = [...m.values()].reduce((a,b)=>a+b,0); g += svgText(x0 + bw*.35, H-B-acc-5, tot, {anchor:'middle', fill:'var(--ink)', size:12, weight:600});
    });
    $('#chMargin').innerHTML = `<svg viewBox="0 0 ${W} ${H}" role="img" aria-label="Margin distribution">${g}</svg>`;
  }
  // regions
  { const R = E.regions, isLS = S.kind === 'LS';
    $('#capRegion').textContent = isLS ? 'Seats by state' : 'Seats by district';
    if(!R.length){ $('#chRegion').innerHTML = '<p class="small">This election has no regional breakdown in the data.</p>'; $('#cap2Region').textContent = ''; }
    else {
      const agg = R.map(name => ({name, n:0, c:new Map()}));
      E.seats.forEach((s,i) => { if(s.r < 0) return; const a = agg[s.r]; a.n += s.m; a.c.set(RES.win[i], (a.c.get(RES.win[i])||0) + s.m); });
      const list = agg.filter(a=>a.n).sort((a,b)=>b.n-a.n).slice(0, 16);
      $('#cap2Region').textContent = `Simulated winners in the ${list.length} ${isLS?'states':'districts'} with the most seats.`;
      const W = 940, rowH = 24, L = 170, H = list.length*rowH + 6;
      const mx = list[0].n; let g = '';
      list.forEach((a,i) => { const y = i*rowH + 3; let x = L;
        g += svgText(0, y+13, a.name.slice(0,24), {fill:'var(--ink)', size:12.5});
        order.forEach(k => { const v = a.c.get(k)||0; if(!v) return; const w = (W-L-40) * v / mx; g += `<rect x="${x}" y="${y}" width="${w}" height="16" fill="${U[k].hex}"><title>${esc(U[k].name)}: ${v}</title></rect>`; if(w > 22) g += `<text x="${x+w/2}" y="${y+12}" font-size="11" text-anchor="middle" fill="#fff">${v}</text>`; x += w; });
        g += svgText(x+6, y+13, a.n, {size:11.5});
      });
      $('#chRegion').innerHTML = `<div class="tw"><svg viewBox="0 0 ${W} ${H}" style="min-width:520px" role="img" aria-label="Seats by region">${g}</svg></div>`;
    }
  }
  // seat curve
  const sel = $('#curveUnit');
  const opts = order.filter(k => U[k].key !== 'OTH').slice(0, 8);
  if(!S.curveKey || !opts.some(k => U[k].key === S.curveKey)) S.curveKey = U[opts[0]].key;
  sel.innerHTML = opts.map(k => `<option value="${esc(U[k].key)}" ${U[k].key===S.curveKey?'selected':''}>${esc(U[k].name)}</option>`).join('');
  clearTimeout(drawCharts.t); drawCharts.t = setTimeout(drawCurve, 250);
}

function drawCurve(){
  const ui = U.findIndex(g => g.key === S.curveKey); if(ui < 0) return;
  const T0 = targets(), maj = Math.floor(E.N/2)+1;
  const lo = Math.max(0, Math.floor(T0[ui]) - 12), hi = Math.min(95, Math.ceil(T0[ui]) + 12);
  const pts = [];
  for(let v = lo; v <= hi; v += 1){
    const T = T0.slice(); const rest = 100 - v, others = T0.reduce((a,t,k)=>k===ui?a:a+t,0);
    for(let k=0;k<T.length;k++) T[k] = k===ui ? v : (others>0 ? T0[k]*rest/others : 0);
    const w = winners(simulate(T), S.overrides); pts.push([v, w.counts[ui]]);
  }
  const W = 460, H = 210, L = 40, B = 26, Rr = 10;
  const x = d3.scaleLinear([lo, hi], [L, W-Rr]), y = d3.scaleLinear([0, Math.max(maj*1.15, d3.max(pts, p=>p[1]))], [H-B, 8]);
  const hex = U[ui].hex;
  let g = y.ticks(4).map(v => `<line x1="${L}" x2="${W-Rr}" y1="${y(v)}" y2="${y(v)}" stroke="var(--line)"/>${svgText(L-6, y(v)+4, v, {anchor:'end', size:11})}`).join('');
  g += x.ticks(6).map(v => svgText(x(v), H-8, v+'%', {anchor:'middle', size:11})).join('');
  g += `<line x1="${L}" x2="${W-Rr}" y1="${y(maj)}" y2="${y(maj)}" stroke="var(--violet)" stroke-dasharray="4 3"/>${svgText(W-Rr, y(maj)-5, maj+' for majority', {anchor:'end', fill:'var(--violet)', size:11})}`;
  const area = d3.area().x(p=>x(p[0])).y0(H-B).y1(p=>y(p[1]))(pts);
  g += `<path d="${area}" fill="${hex}" fill-opacity=".14"/><path d="${d3.line().x(p=>x(p[0])).y(p=>y(p[1]))(pts)}" fill="none" stroke="${hex}" stroke-width="2.4"/>`;
  const cv = T0[ui], cs = RES.counts[ui];
  const lx = x(cv) > W - 150 ? x(cv) - 8 : x(cv) + 8, la = x(cv) > W - 150 ? 'end' : 'start';
  g += `<circle cx="${x(cv)}" cy="${y(cs)}" r="5.5" fill="#fff" stroke="${hex}" stroke-width="2.5"/>${svgText(lx, y(cs)-9, `Now ${fmt1(cv)}%, ${cs} seats`, {fill:'var(--ink)', size:12, weight:600, anchor:la})}`;
  const cross = pts.find(p => p[1] >= maj);
  $('#chCurve').innerHTML = `<svg viewBox="0 0 ${W} ${H}" role="img" aria-label="Seat curve">${g}</svg>` +
    `<p class="small" style="margin:4px 0 0">${cross ? `Reaches ${maj} seats on its own at about ${cross[0]}% of the vote.` : `Does not reach ${maj} seats on its own between ${lo}% and ${hi}%.`}</p>`;
}

function mcHistogram(ks, maj){
  if(!ks.length || !S.mc.units[ks[0]].all) return '';
  const W = 330, H = 150, L = 8, B = 22;
  const all = ks.flatMap(k => S.mc.units[k].all);
  const lo = Math.min(...all), hi = Math.max(...all, maj);
  const nb = 30, step = Math.max(1, Math.ceil((hi-lo+1)/nb));
  const x = d3.scaleLinear([lo, hi+1], [L, W-L]);
  let mxc = 1; const hists = ks.map(k => { const h = new Map(); S.mc.units[k].all.forEach(v => { const b = lo + Math.floor((v-lo)/step)*step; h.set(b, (h.get(b)||0)+1); }); h.forEach(c => mxc = Math.max(mxc, c)); return h; });
  const y = c => (H-B-14) * c / mxc;
  let g = '';
  hists.forEach((h,i) => { const k = ks[i]; h.forEach((c,b) => { g += `<rect x="${x(b)}" y="${H-B-y(c)}" width="${Math.max(1, x(b+step)-x(b)-1)}" height="${y(c)}" fill="${U[k].hex}" fill-opacity=".55"/>`; }); });
  g += `<line x1="${x(maj)}" x2="${x(maj)}" y1="0" y2="${H-B}" stroke="var(--violet)" stroke-dasharray="3 3"/>${svgText(x(maj)+4, 11, maj, {fill:'var(--violet)', size:11})}`;
  g += svgText(L, H-6, lo, {size:11}) + svgText(W-L, H-6, hi, {anchor:'end', size:11});
  return `<p class="small" style="margin:10px 0 2px">Seat distribution across runs</p><svg viewBox="0 0 ${W} ${H}" style="width:100%;height:auto" role="img" aria-label="Seat distribution">${g}</svg>`;
}
