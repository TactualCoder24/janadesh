// Loading speed: while the home page is quiet, fetch what the main button needs, and fetch a state's data when its button is touched or hovered.
function saveDataOn(){ const c = navigator.connection; return !!(c && (c.saveData || /(^|-)2g$/.test(c.effectiveType || ''))); }
function warmElection(ent){ if(!ent || saveDataOn()) return; bundle(ent.file).catch(() => {}); warmMap(ent); }
function idleWarm(){
  if(saveDataOn()) return;
  const go = () => warmElection(INDEX.elections.filter(e => e.kind === 'LS').sort((a, b) => b.year - a.year)[0]);
  if('requestIdleCallback' in window) requestIdleCallback(go, {timeout: 5000}); else setTimeout(go, 2000);
}
['pointerover', 'touchstart', 'focusin'].forEach(ev => $('#stgrid').addEventListener(ev, e => { const b = e.target.closest && e.target.closest('.stbtn'); if(b) warmElection(INDEX.elections.find(x => x.id === b.dataset.id)); }, {passive: true}));
['pointerover', 'touchstart', 'focusin'].forEach(ev => $('#goLS').addEventListener(ev, () => warmElection(INDEX.elections.filter(e => e.kind === 'LS').sort((a, b) => b.year - a.year)[0]), {passive: true}));
