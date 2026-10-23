// Report wrong data: a prefilled GitHub issue for the open seat.
addI18n('en', {reportData: 'Report wrong data', reportHint: 'Spotted a mistake in this seat? It opens a prefilled issue on GitHub.'});
addI18n('hi', {reportData: 'गलत आँकड़ा बताएँ', reportHint: 'इस सीट में कोई गलती दिखी? यह GitHub पर पहले से भरा हुआ इश्यू खोलता है।'});
const REPO = 'https://github.com/TactualCoder24/janadesh';
function reportLink(i){
  const s = E.seats[i], ent = entry(), top = [...s.v.keys()].filter(k => s.v[k] > 0 && E.parties[k] !== 'OTH').sort((a,b) => s.v[b]-s.v[a]).slice(0, 4);
  const where = ent.kind === 'LS' ? 'Lok Sabha' : ent.state + ' Assembly';
  const title = `Data error: ${s.name} (${where} ${ent.label})`;
  const body = `**Election:** ${where} ${ent.label} (\`${ent.id}\`)\n**Seat:** ${s.no}. ${s.name} (${s.cat})${s.r >= 0 ? ', ' + E.regions[s.r] : ''}\n` +
    `**What Janadesh shows:** ${top.map(k => `${E.parties[k]} ${Math.round(s.v[k]).toLocaleString('en-IN')}`).join(', ')}\n\n` +
    `**What is wrong:**\n\n\n**Correct result and a source link:**\n\n\n_Sent from ${location.origin}${location.pathname}_`;
  return `<a href="${REPO}/issues/new?labels=data&title=${encodeURIComponent(title)}&body=${encodeURIComponent(body)}" target="_blank" rel="noopener" title="${esc(t('reportHint'))}">${esc(t('reportData'))} ↗</a>`;
}
