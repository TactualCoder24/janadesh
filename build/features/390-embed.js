// Embed links (#40): "Embed code" in the Share menu gives an iframe snippet for the scenario on screen (map, tally or both), so a journalist or YouTuber can put a live seat map on a page.
// The embedded page is this same site in a bare mode (address #embed=<view>.<language>.<scenario>) with a credit line that links back to the simulator.
addI18n('en', {
  emBtn: 'Embed code', emTitle: 'Embed this on a page', emHint: 'Paste this where you want the map. It shows the scenario you have set up, keeps working without any account, and links back to Janadesh.',
  emView: 'Show', emBoth: 'Map and tally', emMap: 'Map only', emTally: 'Tally only', emHeight: 'Height (pixels)', emCopy: 'Copy the code', emCopied: 'Embed code copied', emPreview: 'Preview',
  emAuto: 'Optional: add this once on your page so the frame grows to fit', emCredit: 'Made with Janadesh. Simulation only, not a real result or forecast.', emOpen: 'Open this scenario', emBad: 'This embed link could not be read.',
});
addI18n('hi', {
  emBtn: 'एम्बेड कोड', emTitle: 'इसे किसी पन्ने पर लगाएँ', emHint: 'इसे वहाँ चिपकाएँ जहाँ नक्शा चाहिए। यह आपका बनाया परिदृश्य दिखाता है, बिना किसी खाते के चलता है, और जनादेश से जोड़ता है।',
  emView: 'दिखाएँ', emBoth: 'नक्शा और तालिका', emMap: 'सिर्फ़ नक्शा', emTally: 'सिर्फ़ तालिका', emHeight: 'ऊँचाई (पिक्सेल)', emCopy: 'कोड कॉपी करें', emCopied: 'एम्बेड कोड कॉपी हो गया', emPreview: 'झलक',
  emAuto: 'वैकल्पिक: इसे अपने पन्ने पर एक बार जोड़ें ताकि फ़्रेम अपने आप सही ऊँचाई ले', emCredit: 'जनादेश से बना। सिर्फ़ सिम्युलेशन, असली नतीजा या पूर्वानुमान नहीं।', emOpen: 'यह परिदृश्य खोलें', emBad: 'यह एम्बेड लिंक पढ़ा नहीं जा सका।',
});
const EMBED_H = {both: 1500, map: 900, tally: 1000};
function embedURL(view){ return location.origin + location.pathname + '#embed=' + view + '.' + LANG + '.' + encodeScenario(scenarioForLink()); }
function embedSnippet(view, h){
  return `<iframe src="${embedURL(view)}" title="${$('#title').textContent.replace(/"/g, '&quot;')} (Janadesh)" width="100%" height="${h}" style="border:1px solid #d5d7db;border-radius:8px;max-width:760px" loading="lazy" data-janadesh></iframe>`;
}
const EMBED_AUTO = `<script>addEventListener('message',function(e){var d=e.data;if(d&&d.janadesh==='size'){document.querySelectorAll('iframe[data-janadesh]').forEach(function(f){if(f.contentWindow===e.source)f.style.height=d.h+'px'})}})<\/script>`;
function openEmbed(){
  if(!E || !RES) return;
  let view = 'both', h = EMBED_H.both; track('embed_open', {e: S.eid});
  const draw = () => {
    modal(`<h3>${esc(t('emTitle'))}</h3><p class="small" style="margin:2px 0 8px">${esc(t('emHint'))}</p>
      <div class="row" style="gap:10px;align-items:center;margin-bottom:8px"><span class="small">${esc(t('emView'))}</span><div class="seg" role="group" aria-label="${esc(t('emView'))}">${[['both', 'emBoth'], ['map', 'emMap'], ['tally', 'emTally']].map(([v, k]) => `<button data-emv="${v}" aria-pressed="${v === view}">${esc(t(k))}</button>`).join('')}</div>
        <label class="small">${esc(t('emHeight'))} <input class="inp" id="emH" type="number" min="300" max="2000" step="20" value="${h}" style="width:84px"></label></div>
      <textarea id="emCode" readonly rows="5" style="width:100%;font-family:monospace;font-size:12px" aria-label="${esc(t('emTitle'))}">${esc(embedSnippet(view, h))}</textarea>
      <details style="margin:6px 0"><summary class="small" style="cursor:pointer">${esc(t('emAuto'))}</summary><textarea readonly rows="3" style="width:100%;font-family:monospace;font-size:12px">${esc(EMBED_AUTO)}</textarea></details>
      <div class="row" style="margin:8px 0"><button class="btn primary" id="emCopy">${esc(t('emCopy'))}</button><button class="btn" data-close>${esc(t('close'))}</button></div>
      <p class="small" style="margin:6px 0 4px"><b>${esc(t('emPreview'))}</b></p>
      <iframe id="emFrame" title="${esc(t('emPreview'))}" src="${esc(embedURL(view))}" style="width:100%;height:${Math.min(h, 520)}px;border:1px solid var(--line);border-radius:8px"></iframe>`);
    document.querySelectorAll('#modalRoot [data-emv]').forEach(b => b.onclick = () => { view = b.dataset.emv; h = EMBED_H[view]; draw(); });
    $('#emH').onchange = e => { h = Math.max(300, Math.min(2000, +e.target.value || h)); draw(); };
    $('#emCode').onfocus = e => e.target.select();
    $('#emCopy').onclick = () => copy(embedSnippet(view, h), t('emCopied'));
  };
  draw();
}
SHARE_ACTIONS.push({k: 'emBtn', run: openEmbed});

// the embedded page: the same app with everything but the map and the tally taken away
async function bootEmbed(){
  const m = location.hash.match(/^#embed=(both|map|tally)\.(en|hi)\.([\w-]+)$/); if(!m) return false;
  document.body.classList.add('embed', 'embed-' + m[1]); document.documentElement.setAttribute('data-theme', 'light');   // an embed stays light, whatever the visitor's device prefers
  try{
    if(m[2] !== LANG){ LANG = m[2]; applyLang(); }
    const sc = decodeScenario(m[3]); await applyScenario(sc);
  }catch(e){ console.error(e); document.body.classList.remove('embed', 'embed-' + m[1]); toast(t('emBad')); return false; }
  const link = location.origin + location.pathname + '#s=' + m[3];
  document.body.insertAdjacentHTML('beforeend', `<div class="embedcredit"><span>${esc(t('emCredit'))}</span> <a href="${esc(link)}" target="_blank" rel="noopener">${esc(t('emOpen'))} ↗</a></div>`);
  if(window.parent !== window){ const post = () => parent.postMessage({janadesh: 'size', h: Math.ceil(document.documentElement.scrollHeight)}, '*'); new ResizeObserver(post).observe(document.body); post(); }
  return true;
}
