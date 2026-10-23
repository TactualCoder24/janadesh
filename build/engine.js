function prepare(raw){
  const P = raw.parties.length;
  const seats = raw.seats.map((s, i) => {
    const v = new Float64Array(P);
    const flat = s[4];
    for(let k=0;k<flat.length;k+=2) v[flat[k]] += flat[k+1];
    v[P-1] += s[5];
    let tot = 0; for(let k=0;k<P;k++) tot += v[k];
    return {i, no:s[0], name:s[1], cat:s[2], r:s[3], v, tot, m:s[6]||1, m2:s[7]||null,
            key: raw.mapkeys ? raw.mapkeys[i] : (s[0] + (raw.mapoff||0))};
  });
  return {raw, P, seats, parties:raw.parties, regions:raw.regions||[], N: seats.reduce((a,s)=>a+s.m,0)};
}

function alliancesOf(){
  const a = Object.assign({}, E.raw.alliances, S.allyEdit);
  for(const k in a) if(!a[k]) delete a[k];
  return a;
}

function buildUnits(){
  const P = E.P, codes = E.parties;
  const totAll = E.seats.reduce((a,s)=>a+s.tot,0);
  const pv = new Float64Array(P); E.seats.forEach(s => { for(let k=0;k<P;k++) pv[k]+=s.v[k]; });
  const pseats = new Float64Array(P);
  E.seats.forEach(s => { let b=-1,bi=-1; for(let k=0;k<P-1;k++) if(s.v[k]>b){b=s.v[k];bi=k;} if(bi>=0) pseats[bi]+=s.m; });
  const ally = S.mode === 'alliance' ? alliancesOf() : {};
  const groups = new Map();
  for(let k=0;k<P;k++){
    const c = codes[k];
    let key = c, name = pName(c);
    if(c !== 'OTH' && ally[c]){ key = 'A:'+ally[c]; name = allyName(ally[c]); }
    if(!groups.has(key)) groups.set(key, {key, name, members:[], vote:0, seats:0});
    const g = groups.get(key); g.members.push(k); g.vote += pv[k]; g.seats += pseats[k];
  }
  let list = [...groups.values()];
  list.forEach(g => g.members.sort((a,b)=>pv[b]-pv[a]));
  // small units fold into Others
  list.sort((a,b)=>b.vote-a.vote);
  const keep = [], oth = {key:'OTH', name:t('others'), members:[], vote:0, seats:0};
  list.forEach(g => {
    if(g.key === 'OTH'){ oth.members.push(...g.members); oth.vote += g.vote; oth.seats += g.seats; return; }
    const share = g.vote/totAll;
    if(g.seats > 0 || (keep.length < 14 && share >= 0.004)) keep.push(g);
    else { oth.members.push(...g.members); oth.vote += g.vote; oth.seats += g.seats; }
  });
  labExtraUnits().forEach(g => keep.push(g));
  keep.push(oth);
  keep.forEach(g => {
    g.base = 100*g.vote/totAll;
    g.color = g.key === 'OTH' ? 'var(--muted)' : (g.key.startsWith('A:') ? allyColor(g.name, g.members.map(k=>codes[k])) : pColor(g.key));
    g.hex = g.key === 'OTH' ? '#9aa0aa' : (g.key.startsWith('A:') ? allyColor(g.name, g.members.map(k=>codes[k])) : pColor(g.key));
    if(g.labKind) g.color = g.hex = labColor(g, keep);
  });
  U = keep;
  // unit index per party
  E.unitOf = new Int32Array(P);
  U.forEach((g,ui) => g.members.forEach(k => E.unitOf[k] = ui));
  // per-seat unit votes (alliance members merged, transfer applied to non-lead members)
  const tr = S.transfer/100;
  E.seats.forEach(s => {
    const u = new Float64Array(U.length);
    const lead = new Float64Array(U.length);
    U.forEach((g,ui) => { let mx=0,sum=0; g.members.forEach(k=>{ sum+=s.v[k]; if(s.v[k]>mx) mx=s.v[k]; }); lead[ui]=mx;
      u[ui] = g.key==='OTH' || !g.key.startsWith('A:') ? sum : mx + tr*(sum-mx); });
    let t=0; for(let k=0;k<u.length;k++) t+=u[k];
    s.u = u; s.ut = t || 1;
    s.base = u.map(x => x/(t||1));
  });
  // the real result (before any what-if from the lab): base seats and base winners always describe this
  E.hist = histShares();
  const bs = winners(E.seats.map(s=>s.base), null);
  labApply(bs.win);
  const totU = E.seats.reduce((a,s)=>a+s.ut,0);
  U.forEach((g,ui) => { g.base = 100*E.seats.reduce((a,s)=>a+s.u[ui],0)/totU; });
  U.forEach((g,ui)=> g.baseSeats = bs.counts[ui]);
  E.baseWin = bs.win;
  E.core = S.method === 'core' ? coreShares() : null;
}

// ---------- earlier elections, seat by seat ----------
async function loadPrev(raw){
  const list = (await bundle(entry().file)).slice().sort((a, b) => a.year - b.year || a.label.localeCompare(b.label)), i = list.findIndex(x => x.id === raw.id);
  return list.slice(Math.max(0, i - 3), Math.max(0, i)).reverse().map(p => ({raw: p, idx: new Map(p.seats.map((s, j) => [seatKey(p, s), j]))}));
}
function histShares(){
  const prev = E.prev || [], n = U.length, pc = E.parties;
  const keys = E.raw.seats.map(s => seatKey(E.raw, s));
  return E.seats.map((s, i) => prev.map(p => {
    const j = p.idx.get(keys[i]); if(j == null) return null;
    const ps = p.raw.seats[j], v = new Float64Array(n); let tot = 0;
    for(let k = 0; k < ps[4].length; k += 2){ const c = pc.indexOf(p.raw.parties[ps[4][k]]), ui = c >= 0 ? E.unitOf[c] : n - 1; v[ui] += ps[4][k + 1]; tot += ps[4][k + 1]; }
    v[n - 1] += ps[5] || 0; tot += ps[5] || 0;
    if(!(tot > 0)) return null;
    for(let k = 0; k < n; k++) v[k] /= tot;
    return v;
  }));
}
const MOM_W = [0.5, 0.25, 0.15, 0.10];
// core vote of a party in a seat: its floor over the last elections (a share of it, so a core is never the whole vote)
function coreShares(){
  const H = E.hist || [], n = U.length;
  return E.seats.map((s, i) => { const c = new Float64Array(n), hs = (H[i] || []).filter(Boolean);
    for(let u = 0; u < n; u++){ let m = s.base[u]; hs.forEach(h => { if(h[u] < m) m = h[u]; }); c[u] = (hs.length ? 0.85 : 0.5) * m; }
    return c; });
}

// ---------- what-if lab: reshapes each seat's vote shares before any swing (new party, split, turnout, sitting-member penalty) ----------
const hash01 = x => { const v = Math.sin(x * 12.9898 + 78.233) * 43758.5453; return v - Math.floor(v); };
function labTurnoutOn(L){ return !!(L && L.to && (Object.values(L.to.p || {}).some(v => v) || Object.values(L.to.r || {}).some(v => v))); }
function labActive(){ const L = S.lab; return !!(L && ((L.np && L.np.on) || (L.sp && L.sp.on) || (L.pen && L.pen.on) || (L.mom && L.mom.on) || labTurnoutOn(L))); }
function labExtraUnits(){
  const L = S.lab, out = []; if(!L) return out;
  if(L.sp && L.sp.on && L.sp.key) out.push({key:'SPLIT:' + L.sp.key, name:L.sp.name || (t('labFaction')), members:[], vote:0, seats:0, labKind:'split', parent:L.sp.key});
  if(L.np && L.np.on) out.push({key:'NEW:party', name:L.np.name || t('labNewName'), members:[], vote:0, seats:0, labKind:'new', hexOwn:L.np.color || '#00A6A6'});
  return out;
}
function mixHex(a, b, f){ const pa = a.replace('#',''), pb = b.replace('#',''); const r = i => Math.round(parseInt(pa.substr(i,2),16)*(1-f) + parseInt(pb.substr(i,2),16)*f).toString(16).padStart(2,'0'); return '#' + r(0) + r(2) + r(4); }
function labColor(g, list){
  if(g.labKind === 'new') return g.hexOwn;
  const par = list.find(x => x.key === g.parent); const ph = par && /^#[0-9a-f]{6}$/i.test(par.hex) ? par.hex : '#8A8F98';
  return (S.lab.sp && S.lab.sp.color) || mixHex(ph, '#8E5BD0', .55);
}
function labApply(origWin){
  const L = S.lab; if(!L || !labActive()) { S.labInfo = null; return; }
  const n = U.length, idx = k => U.findIndex(g => g.key === k), seats = E.seats, info = {};
  // 0. momentum baseline: a weighted average of the last elections instead of only the latest
  if(L.mom && L.mom.on && E.hist){
    seats.forEach((s, i) => { const hs = E.hist[i] || [], w = [MOM_W[0]], parts = [s.base]; hs.forEach((h, k) => { if(h){ w.push(MOM_W[k + 1]); parts.push(h); } });
      const ws = w.reduce((a, b) => a + b, 0), tot = s.u.reduce((a, b) => a + b, 0); if(parts.length < 2 || !(tot > 0)) return;
      for(let u = 0; u < n; u++){ let v = 0; parts.forEach((pt, k) => v += w[k] * pt[u]); s.u[u] = v / ws * tot; } });
    info.mom = true;
  }
  // 1. turnout: scale the votes of a party's voters everywhere, or of every voter in a state or district
  if(labTurnoutOn(L)){
    const fu = U.map(g => Math.max(0, 1 + ((L.to.p || {})[g.key] || 0) / 100));
    seats.forEach(s => { const rn = s.r >= 0 ? E.regions[s.r] : null, fr = Math.max(0, 1 + (((L.to.r || {})[rn]) || 0) / 100); for(let k = 0; k < n; k++) s.u[k] *= fu[k] * fr; });
  }
  // 2. split a party: a share of its voters goes to a new faction, a little differently in every seat
  if(L.sp && L.sp.on){
    const a = idx(L.sp.key), b = idx('SPLIT:' + L.sp.key);
    if(a >= 0 && b >= 0){ const f = Math.max(0, Math.min(1, (L.sp.share || 0) / 100)), v = (L.sp.spread || 0) / 100;
      seats.forEach(s => { const fi = Math.max(0, Math.min(1, f * (1 + v * (hash01(s.no * 31 + 7) - .5) * 2))), m = s.u[a] * fi; s.u[a] -= m; s.u[b] += m; }); }
  }
  // 3. a new party: it takes a fraction of each chosen party's voters (the weights say how much of whose), with local variation
  if(L.np && L.np.on){
    const nk = U.findIndex(g => g.labKind === 'new');
    if(nk >= 0){
      const w = new Float64Array(n), src = Object.entries(L.np.from || {}).filter(([, wt]) => wt > 0);
      if(src.length) src.forEach(([k, wt]) => { const j = idx(k); if(j >= 0 && j !== nk) w[j] = wt; }); else for(let k = 0; k < n; k++) if(k !== nk) w[k] = 1;
      const v = (L.np.spread == null ? 40 : L.np.spread) / 100, gi = seats.map(s => 1 + v * (hash01(s.no * 17 + 3) - .5) * 2);
      const totalV = seats.reduce((a, s) => a + s.u.reduce((x, y) => x + y, 0), 0), want = Math.max(0, Math.min(60, L.np.share || 0)) / 100 * totalV;
      const taken = lam => { let tot = 0; seats.forEach((s, i) => { for(let k = 0; k < n; k++) if(w[k]) tot += Math.min(1, lam * w[k] * gi[i]) * s.u[k]; }); return tot; };
      let lo = 0, hi = 1; while(taken(hi) < want && hi < 1e4) hi *= 2;
      for(let it = 0; it < 40; it++){ const mid = (lo + hi) / 2; if(taken(mid) < want) lo = mid; else hi = mid; }
      const lam = (lo + hi) / 2, gotV = taken(lam);
      seats.forEach((s, i) => { let got = 0; for(let k = 0; k < n; k++) if(w[k]){ const f = Math.min(1, lam * w[k] * gi[i]), m = s.u[k] * f; s.u[k] -= m; got += m; } s.u[nk] += got; });
      info.np = {asked: L.np.share || 0, got: 100 * gotV / totalV};
    }
  }
  // 4. sitting-member penalty: the party that holds a seat loses points there, not everywhere
  if(L.pen && L.pen.on && L.pen.pts > 0){
    seats.forEach((s, i) => { const w0 = origWin[i], tot = s.u.reduce((a, b) => a + b, 0); if(!(tot > 0) || s.u[w0] == null) return;
      const cut = Math.min(s.u[w0], L.pen.pts / 100 * tot), rest = tot - s.u[w0]; if(rest <= 0) return;
      s.u[w0] -= cut; for(let k = 0; k < n; k++) if(k !== w0) s.u[k] += cut * s.u[k] / rest; });
  }
  seats.forEach(s => { let t0 = 0; for(let k = 0; k < n; k++) t0 += s.u[k]; s.ut = t0 || 1; s.base = s.u.map(x => x / s.ut); });
  S.labInfo = info;
}

// ---------- engine ----------
function winners(shares, overrides){
  const counts = new Float64Array(U.length), win = [], second = [];
  const othI = U.length-1;
  E.seats.forEach((s, i) => {
    const x = shares[i];
    let order = [...x.keys()].sort((a,b)=>x[b]-x[a]);
    // "Others" is a bundle of small parties; it can only win if it is genuinely a single party's lead
    if(order[0] === othI && U[othI].members.length > 1){
      const realTop = s.v.reduce((b,v,k)=> (k < E.P-1 && E.unitOf[k]===othI && v>b.v) ? {v,k} : b, {v:-1,k:-1});
      const topShare = realTop.v / s.tot;
      if(topShare < x[order[1]]) order = order.slice(1).concat(othI);
    }
    let w = order[0];
    if(overrides && overrides[s.no] != null){ const ui = U.findIndex(g=>g.key===overrides[s.no]); if(ui>=0) w = ui; }
    win[i] = w; second[i] = order[0] === w ? order[1] : order[0];
    counts[w] += 1;
    if(s.m > 1){
      // two-member seat: the winning party's second candidate takes the second seat if it out-polled every rival
      const r2 = order.find(k => k !== w);
      let w2 = r2;
      if(s.m2 && E.unitOf[s.m2[0]] === w){ const lv = s.v[s.m2[0]] || 1; if(x[w] * s.m2[1] / lv > x[r2]) w2 = w; }
      counts[w2] += s.m-1;
    }
  });
  return {counts, win, second};
}

function simulate(T, noise){
  // T: target shares (percent) per unit; returns per-seat share arrays
  const n = U.length, method = S.method;
  const base = U.map(g=>g.base);
  const reg = S.regional, res = S.reserved;
  const regDelta = (r, ui) => { const o = reg[E.regions[r]]; return o && o[U[ui].key] ? o[U[ui].key]/100 : 0; };
  // core and swing voters: a swing first moves the swing pool, the core only moves with a wave
  const core = method === 'core' ? (E.core || (E.core = coreShares())) : null, wv = {none: 0, mild: .4, strong: 1}[S.wave || 'none'];
  let Cn = null, te = null, fc = null, fs = null;
  if(core){ Cn = new Float64Array(n); const tw = E.seats.reduce((a, s) => a + s.ut, 0); E.seats.forEach((s, i) => { for(let u = 0; u < n; u++) Cn[u] += core[i][u] * s.ut; }); for(let u = 0; u < n; u++) Cn[u] = 100 * Cn[u] / tw; te = T.slice(); fc = new Float64Array(n); fs = new Float64Array(n); }
  const coreFactors = () => { for(let u = 0; u < n; u++){ const B = base[u], C = Math.min(Cn[u], B), Sp = B - C, Tu = te[u];
      if(Tu >= B){ const den = Sp + wv * C; if(den > 1e-9){ const dl = (Tu - B) / den; fs[u] = 1 + dl; fc[u] = 1 + wv * dl; } else { fs[u] = fc[u] = B > 0 ? Tu / B : 1; } }
      else if(Tu >= C){ fc[u] = 1; fs[u] = Sp > 1e-9 ? (Tu - C) / Sp : 1; }
      else { fs[u] = 0; fc[u] = C > 0 ? Math.max(Tu / C, 1 - wv) : 1; } } };
  let f = T.map((t,ui) => base[ui] > 0 ? t/base[ui] : 0);      // proportional factors
  let d = T.map((t,ui) => (t-base[ui])/100);                    // uniform shifts
  let out;
  for(let pass=0; pass<5; pass++){
    if(core) coreFactors();
    out = E.seats.map((s, i) => {
      const x = new Float64Array(n);
      let sum = 0;
      for(let ui=0; ui<n; ui++){
        const b = s.base[ui];
        let y;
        if(method === 'prop') y = b * f[ui];
        else if(core){ const c0 = core[i][ui]; y = c0 * fc[ui] + (b - c0) * fs[ui]; }
        else y = b > 0 ? Math.max(0.0005, b + d[ui]) : 0;
        if(b > 0 || y > 0){
          if(s.r >= 0) y += regDelta(s.r, ui);
          if(s.cat === 'SC' && res.SC[U[ui].key]) y += res.SC[U[ui].key]/100;
          if(s.cat === 'ST' && res.ST[U[ui].key]) y += res.ST[U[ui].key]/100;
        }
        if(noise) y = y + noise(i, ui, y);
        if(b === 0 && T[ui] > 0 && base[ui] === 0) y = Math.max(y, T[ui]/100 * 0.8); // new party with no history: spread evenly
        y = Math.max(0, y); x[ui] = y; sum += y;
      }
      if(sum > 0) for(let ui=0; ui<n; ui++) x[ui] /= sum;
      return x;
    });
    if(!S.fixNational && !noise) break;
    // recalibrate so national totals match the targets
    const tot = E.seats.reduce((a,s)=>a+s.ut,0);
    const cur = new Float64Array(n);
    out.forEach((x,i)=>{ const w = E.seats[i].ut; for(let ui=0;ui<n;ui++) cur[ui]+=x[ui]*w; });
    let err = 0;
    for(let ui=0; ui<n; ui++){
      const c = 100*cur[ui]/tot, t = T[ui];
      err = Math.max(err, Math.abs(c-t));
      if(c > 0){ f[ui] *= t/c; d[ui] += (t-c)/100; if(te) te[ui] = Math.max(0, te[ui] * t / c); }
    }
    if(err < 0.02) break;
  }
  return out;
}

function targets(){ return U.map(g => S.T[g.key] != null ? S.T[g.key] : g.base); }

function run(){
  S.realHit = null;
  const T = realisticClamp(targets());
  const shares = simulate(T);
  const w = winners(shares, S.overrides);
  RES = {T, shares, ...w};
  renderResult();
}

// ---------- Monte Carlo ----------
function gauss(){ let u=0,v=0; while(!u)u=Math.random(); while(!v)v=Math.random(); return Math.sqrt(-2*Math.log(u))*Math.cos(2*Math.PI*v); }
async function runMC(progress){
  const N = S.mcSig.n, n = U.length, T0 = targets();
  const counts = U.map(()=>[]);
  const seatWins = E.seats.map(()=>new Float64Array(n));
  const maj = Math.floor(E.N/2)+1;
  const majHits = new Float64Array(n), largest = new Float64Array(n), hung = {v:0};
  const R = E.regions.length;
  for(let it=0; it<N; it++){
    const T = T0.map(t => Math.max(0, t + gauss()*S.mcSig.nat*Math.sqrt(Math.max(t,0.5)/25)));
    const st = T.reduce((a,b)=>a+b,0); for(let k=0;k<n;k++) T[k] = T[k]*100/st;
    const rn = []; for(let r=0;r<Math.max(R,1);r++){ const a = new Float64Array(n); for(let k=0;k<n;k++) a[k]=gauss()*S.mcSig.reg/100; rn.push(a); }
    const sn = S.mcSig.seat/100;
    const shares = simulate(T, (i, ui, y) => {
      const s = E.seats[i]; const r = s.r >= 0 ? s.r : 0;
      return (rn[r][ui] + gauss()*sn) * Math.sqrt(Math.max(y,0.01)/0.25);
    });
    const w = winners(shares, S.overrides);
    let best = 0;
    for(let k=0;k<n;k++){ counts[k].push(w.counts[k]); if(w.counts[k] >= maj) majHits[k]++; if(w.counts[k] > w.counts[best]) best = k; }
    largest[best]++;
    if(!w.counts.some(c => c >= maj)) hung.v++;
    w.win.forEach((u,i) => seatWins[i][u]++);
    if(it % 25 === 24){ progress && progress((it+1)/N); await new Promise(r=>setTimeout(r,0)); }
  }
  const q = (arr,p) => { const a = [...arr].sort((x,y)=>x-y); return a[Math.min(a.length-1, Math.floor(p*a.length))]; };
  S.mc = { n:N, units: U.map((g,k)=>({key:g.key, lo:q(counts[k],.05), med:q(counts[k],.5), hi:q(counts[k],.95), pMaj:majHits[k]/N, pLargest:largest[k]/N, all:counts[k]})),
    hung: hung.v/N, seatP: seatWins.map(a=>Array.from(a, x=>x/N)), sig: JSON.stringify(sigOf()) };
}
function sigOf(){ return [S.eid, S.mode, S.method, targets().map(x=>+x.toFixed(2)), S.regional, S.reserved, S.overrides, S.transfer, S.allyEdit]; }

// ---------- rendering ----------
