// Simple analytics: Vercel Web Analytics (cookie-free, no personal data). Loads only on Vercel-hosted domains.
// Turn it on once under the project's Analytics tab on vercel.com. Custom events (feature usage) need a plan that includes them; page views work on all plans.
const ANALYTICS = /\.vercel\.app$/.test(location.hostname) || /(^|\.)janadesh\./.test(location.hostname);
if(ANALYTICS){
  window.va = window.va || function(){ (window.vaq = window.vaq || []).push(arguments); };
  const s = document.createElement('script'); s.defer = true; s.src = '/_vercel/insights/script.js'; document.head.appendChild(s);
}
function track(name, data){ try{ if(ANALYTICS && window.va) window.va('event', data ? {name, data} : {name}); }catch(e){} }
function withTrack(fn, name, pick){ return function(){ track(name, pick ? pick.apply(null, arguments) : undefined); return fn.apply(this, arguments); }; }
openSim = withTrack(openSim, 'open_simulation', (kind, state) => ({kind, state: state || 'LS'}));
preset = withTrack(preset, 'preset', kind => ({kind}));
runMC = withTrack(runMC, 'monte_carlo');
makeImage = withTrack(makeImage, 'share_image');
