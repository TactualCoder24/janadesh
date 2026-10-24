// Header and footer: the Data button (opens the open-data page) and the footer's dynamic parts.
addI18n('en', {dataBtn: 'Data', ftExplore: 'Explore', ftSim: 'More simulations', ftPlay: 'Play and follow', ftAbout: 'Data and about', ftRepo: 'Source code on GitHub', ftIssue: 'Report a problem', ftBuilt: 'Site updated {d}', ftTop: 'Back to top', ftLic: 'Free to use with credit to Janadesh'});
addI18n('hi', {dataBtn: 'डेटा', ftExplore: 'देखें', ftSim: 'और सिम्युलेशन', ftPlay: 'खेलें और देखें', ftAbout: 'डेटा और जानकारी', ftRepo: 'GitHub पर सोर्स कोड', ftIssue: 'समस्या बताएँ', ftBuilt: 'साइट अपडेट: {d}', ftTop: 'ऊपर जाएँ', ftLic: 'जनादेश को श्रेय देकर मुफ़्त इस्तेमाल करें'});
$('#dataBtn').onclick = () => { location.hash = '#/data'; };
$('#anaBtn').onclick = () => { location.hash = '#/analysis'; };
$('#ftRepo').href = REPO; $('#ftIssue').href = REPO + '/issues/new';
$('#ftDisp').onclick = openDisplay;
function renderFooterMeta(){
  const b = /^(\d{4})(\d{2})(\d{2})/.exec(BUILD || ''), d = b ? new Date(+b[1], +b[2] - 1, +b[3]).toLocaleDateString(LANG === 'hi' ? 'hi-IN' : 'en-IN', {day: 'numeric', month: 'long', year: 'numeric'}) : '';
  $('#ftMeta').innerHTML = [d ? esc(t('ftBuilt', {d})) : '', esc(t('ftLic')), `<a href="#top" id="ftTop">${esc(t('ftTop'))}</a>`].filter(Boolean).join(' · ');
  $('#ftTop').onclick = e => { e.preventDefault(); window.scrollTo({top: 0, behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth'}); };
}
renderFooterMeta();
