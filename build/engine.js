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
  keep.push(oth);
  keep.forEach(g => {
    g.base = 100*g.vote/totAll;
    g.color = g.key === 'OTH' ? 'var(--muted)' : (g.key.startsWith('A:') ? allyColor(g.name, g.members.map(k=>codes[k])) : pColor(g.key));
    g.hex = g.key === 'OTH' ? '#9aa0aa' : (g.key.startsWith('A:') ? allyColor(g.name, g.members.map(k=>codes[k])) : pColor(g.key));
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
  // recompute base share with merged votes
  const totU = E.seats.reduce((a,s)=>a+s.ut,0);
  U.forEach((g,ui) => { g.base = 100*E.seats.reduce((a,s)=>a+s.u[ui],0)/totU; });
  // base seats by unit
  const bs = winners(E.seats.map(s=>s.base), null);
  U.forEach((g,ui)=> g.baseSeats = bs.counts[ui]);
  E.baseWin = bs.win;
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
  let f = T.map((t,ui) => base[ui] > 0 ? t/base[ui] : 0);      // proportional factors
  let d = T.map((t,ui) => (t-base[ui])/100);                    // uniform shifts
  let out;
  for(let pass=0; pass<5; pass++){
    out = E.seats.map((s, i) => {
      const x = new Float64Array(n);
      let sum = 0;
      for(let ui=0; ui<n; ui++){
        const b = s.base[ui];
        let y;
        if(method === 'prop') y = b * f[ui];
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
      if(c > 0){ f[ui] *= t/c; d[ui] += (t-c)/100; }
    }
    if(err < 0.02) break;
  }
  return out;
}

function targets(){ return U.map(g => S.T[g.key] != null ? S.T[g.key] : g.base); }

function run(){
  const T = targets();
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
