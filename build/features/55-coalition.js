// Coalition builder (#11): group parties (drag them, or tap) and see whether they reach the majority mark.
addI18n('en', {
  toolCoal: 'Coalition builder', coalSub: 'Drag parties into the government bloc (or tap them) and see whether the seats reach the majority mark. Uses the seats in the current scenario.',
  coalAvail: 'Parties and alliances', coalGov: 'Government bloc', coalDrop: 'Drag parties here, or tap one', coalClear: 'Clear', coalLargest: 'Largest alone', coalSuggest: 'Smallest coalitions that reach {m} seats',
  coalReach: '{n} seats: majority with {x} to spare', coalExact: '{n} seats: exactly the majority mark', coalShort: '{n} seats: {x} short of {m}', coalNone: 'No coalition of these parties reaches the majority mark.', coalUse: 'Use', coalOpp: '{n} seats outside the bloc',
});
addI18n('hi', {
  toolCoal: 'गठबंधन बनाएँ', coalSub: 'दलों को सरकारी गुट में खींचें (या टैप करें) और देखें कि सीटें बहुमत के आँकड़े तक पहुँचती हैं या नहीं। मौजूदा परिदृश्य की सीटें ली गई हैं।',
  coalAvail: 'दल और गठबंधन', coalGov: 'सरकारी गुट', coalDrop: 'दलों को यहाँ खींचें, या किसी पर टैप करें', coalClear: 'साफ़ करें', coalLargest: 'सिर्फ़ सबसे बड़ा', coalSuggest: '{m} सीटों तक पहुँचने वाले सबसे छोटे गठबंधन',
  coalReach: '{n} सीटें: बहुमत से {x} ज़्यादा', coalExact: '{n} सीटें: ठीक बहुमत का आँकड़ा', coalShort: '{n} सीटें: {m} से {x} कम', coalNone: 'इन दलों का कोई गठबंधन बहुमत तक नहीं पहुँचता।', coalUse: 'चुनें', coalOpp: 'गुट के बाहर {n} सीटें',
});
registerTool({id: 'coalition', label: 'toolCoal', sub: 'coalSub', live: true, key: simKey, render(body){
  const maj = Math.floor(E.N / 2) + 1;
  const units = U.map((g, k) => ({g, k, n: RES.counts[k]})).filter(o => o.n > 0 && o.g.key !== 'OTH').sort((a, b) => b.n - a.n);
  const have = new Set(units.map(o => o.g.key));
  S.coal = (S.coal || []).filter(k => have.has(k));
  const chip = o => `<button class="chip coalchip" draggable="true" data-k="${esc(o.g.key)}" style="border-color:${o.g.hex}"><i class="sw" style="background:${o.g.hex}"></i>${esc(shortName(o.g))} <b class="num">${o.n}</b></button>`;
  const inCoal = new Set(S.coal), sum = units.filter(o => inCoal.has(o.g.key)).reduce((a, o) => a + o.n, 0);
  const pct = Math.min(100, 100 * sum / E.N), x = sum - maj;
  const msg = !S.coal.length ? '' : sum > maj ? t('coalReach', {n: sum, x}) : sum === maj ? t('coalExact', {n: sum}) : t('coalShort', {n: sum, x: -x, m: maj});
  // smallest coalitions of the biggest parties that reach the majority
  const top = units.slice(0, 10), combos = [];
  for(let mask = 1; mask < (1 << top.length); mask++){ let s2 = 0, c = 0; for(let i = 0; i < top.length; i++) if(mask & (1 << i)){ s2 += top[i].n; c++; } if(s2 >= maj) combos.push({mask, c, s2}); }
  combos.sort((a, b) => a.c - b.c || a.s2 - b.s2);
  const minimal = combos.filter((o, i) => !combos.slice(0, i).some(p => (p.mask & o.mask) === p.mask)).slice(0, 5);
  body.innerHTML = `<div class="tools-cols">
    <div><h4>${esc(t('coalAvail'))}</h4><div class="row coalzone" id="coalPool" data-zone="pool" style="min-height:48px;padding:6px;border:1px dashed var(--line);border-radius:10px">${units.filter(o => !inCoal.has(o.g.key)).map(chip).join('')}</div></div>
    <div><h4>${esc(t('coalGov'))}</h4><div class="row coalzone" id="coalGov" data-zone="gov" style="min-height:48px;padding:6px;border:1px dashed var(--violet);border-radius:10px;background:var(--violet-soft)">${units.filter(o => inCoal.has(o.g.key)).map(chip).join('') || `<span class="small">${esc(t('coalDrop'))}</span>`}</div>
      <div style="margin:10px 0 4px;position:relative"><div class="meter" style="height:14px"><i style="width:${pct}%;background:${sum >= maj ? 'var(--good)' : 'var(--evmblue)'}"></i></div><div style="position:absolute;top:-3px;bottom:-3px;left:${100 * (maj - .5) / E.N}%;width:2px;background:var(--ink)"></div></div>
      <p style="margin:2px 0;font-family:var(--display);font-weight:600;color:${sum >= maj ? 'var(--good)' : 'var(--ink)'}">${esc(msg)}</p>
      ${S.coal.length ? `<p class="small" style="margin:0">${esc(t('coalOpp', {n: E.N - sum}))}</p>` : ''}
      <div class="row" style="margin-top:8px"><button class="btn small" id="coalBig">${esc(t('coalLargest'))}</button><button class="btn small" id="coalClr">${esc(t('coalClear'))}</button></div></div></div>
    <h4 style="margin:14px 0 4px">${esc(t('coalSuggest', {m: maj}))}</h4>
    ${minimal.length ? `<div class="stack">${minimal.map((o, i) => `<div class="row"><button class="btn small" data-combo="${o.mask}">${esc(t('coalUse'))}</button>${top.filter((_, j) => o.mask & (1 << j)).map(u => `<span class="pname"><i class="sw" style="background:${u.g.hex}"></i><span>${esc(shortName(u.g))} ${u.n}</span></span>`).join(' + ')} <b class="num">= ${o.s2}</b></div>`).join('')}</div>` : `<p class="small">${esc(t('coalNone'))}</p>`}`;
  const redraw = () => { toolKeyShown = null; toolsTouch(true); };
  body.querySelectorAll('.coalchip').forEach(c => {
    c.onclick = () => { const k = c.dataset.k; S.coal = inCoal.has(k) ? S.coal.filter(x => x !== k) : S.coal.concat(k); redraw(); };
    c.ondragstart = e => { e.dataTransfer.setData('text/plain', c.dataset.k); e.dataTransfer.effectAllowed = 'move'; };
  });
  body.querySelectorAll('.coalzone').forEach(z => {
    z.ondragover = e => { e.preventDefault(); z.style.outline = '2px solid var(--violet)'; };
    z.ondragleave = () => { z.style.outline = ''; };
    z.ondrop = e => { e.preventDefault(); z.style.outline = ''; const k = e.dataTransfer.getData('text/plain'); if(!have.has(k)) return; S.coal = S.coal.filter(x => x !== k); if(z.dataset.zone === 'gov') S.coal.push(k); redraw(); };
  });
  $('#coalClr').onclick = () => { S.coal = []; redraw(); };
  $('#coalBig').onclick = () => { S.coal = units.length ? [units[0].g.key] : []; redraw(); };
  body.querySelectorAll('[data-combo]').forEach(b => b.onclick = () => { const mask = +b.dataset.combo; S.coal = top.filter((_, j) => mask & (1 << j)).map(u => u.g.key); redraw(); });
}});
