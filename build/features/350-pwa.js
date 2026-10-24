// Installable app and offline use (#47): a service worker (sw.js, written by build/make_dist.py) keeps the page, the data and the map files on the device, and the Display dialog offers to install.
addI18n('en', {
  instTitle: 'Install the app', instHint: 'Adds Janadesh to your home screen or desktop. Data you have opened keeps working without a connection.', instBtn: 'Install', instIos: 'On an iPhone or iPad: tap the Share button, then "Add to Home Screen".', instDone: 'Installed. Open Janadesh from your home screen or apps.',
  offNow: 'You are offline. Data you opened before still works.', onNow: 'Back online.', offReady: 'Ready to work offline',
});
addI18n('hi', {
  instTitle: 'ऐप इंस्टॉल करें', instHint: 'जनादेश को होम स्क्रीन या डेस्कटॉप पर जोड़ता है। जो डेटा आप खोल चुके हैं वह बिना इंटरनेट भी चलता है।', instBtn: 'इंस्टॉल करें', instIos: 'iPhone या iPad पर: शेयर बटन दबाएँ, फिर "होम स्क्रीन पर जोड़ें" चुनें।', instDone: 'इंस्टॉल हो गया। होम स्क्रीन या ऐप्स से जनादेश खोलें।',
  offNow: 'आप ऑफ़लाइन हैं। जो डेटा पहले खोला था वह चलेगा।', onNow: 'फिर ऑनलाइन।', offReady: 'ऑफ़लाइन चलने के लिए तैयार',
});
let installEvt = null;
const standalone = () => matchMedia('(display-mode: standalone)').matches || navigator.standalone === true;
window.addEventListener('beforeinstallprompt', e => { e.preventDefault(); installEvt = e; });
window.addEventListener('appinstalled', () => { installEvt = null; toast(t('instDone')); });
// the install block shown in the Display dialog
function installBlock(){
  if(standalone()) return '';
  const ios = /iphone|ipad|ipod/i.test(navigator.userAgent) && !window.MSStream;
  if(!installEvt && !ios) return '';
  return `<div style="margin:12px 0;padding:10px 12px;border:1px solid var(--line);border-radius:8px"><b>${esc(t('instTitle'))}</b><p class="small" style="margin:4px 0 8px">${esc(t('instHint'))}</p>${installEvt ? `<button class="btn primary" id="instGo">${esc(t('instBtn'))}</button>` : `<p class="small" style="margin:0">${esc(t('instIos'))}</p>`}</div>`;
}
function installBind(){ const b = $('#instGo'); if(b) b.onclick = async () => { if(!installEvt) return; installEvt.prompt(); try{ await installEvt.userChoice; }catch(e){} installEvt = null; $('#modalRoot').innerHTML = ''; }; }
window.addEventListener('offline', () => toast(t('offNow')));
window.addEventListener('online', () => toast(t('onNow')));
if('serviceWorker' in navigator && (location.protocol === 'https:' || location.hostname === 'localhost' || location.hostname === '127.0.0.1')){
  window.addEventListener('load', () => { navigator.serviceWorker.register('sw.js').catch(err => console.warn('service worker', err)); });
}
