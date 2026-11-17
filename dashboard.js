'use strict';
let deals = [];
const el = id => document.getElementById(id);
const date = ts => new Date(ts * 1000).toLocaleString('it-IT', {timeZone: 'Europe/Rome'});
function node(tag, text, cls) {
  const result = document.createElement(tag);
  result.textContent = text;
  if (cls) result.className = cls;
  return result;
}
function render() {
  const query = el('filter').value.toLocaleLowerCase('it-IT');
  const cards = deals.filter(d => `${d.title} ${d.asin}`.toLocaleLowerCase('it-IT').includes(query)).map(d => {
    const card = node('article', '', 'deal');
    card.append(node('small', `${d.asin} · ${date(d.ts)}`), node('h3', d.title));
    card.append(node('span', d.current_price == null ? 'Prezzo non disponibile' : Number(d.current_price).toLocaleString('it-IT', {style:'currency', currency:'EUR'}), 'price'));
    card.append(node('span', `Sconto ${Number(d.discount_percent || 0)}% · Punteggio ${d.score == null ? 'non disponibile' : Number(d.score)}`, 'badge'));
    if (/^[A-Z0-9]{10}$/.test(d.asin)) {
      const link = node('a', 'Verifica su Amazon ↗');
      link.href = `https://www.amazon.it/dp/${d.asin}`;
      link.target = '_blank'; link.rel = 'noopener noreferrer';
      card.append(node('p', ''), link);
    }
    return card;
  });
  el('deals').replaceChildren(...(cards.length ? cards : [node('p', 'Nessuna pubblicazione corrispondente.')]));
}
async function refresh() {
  el('refresh').disabled = true;
  try {
    const response = await fetch('/api/status', {credentials:'same-origin', cache:'no-store', redirect:'error'});
    if (!response.ok) throw new Error('unavailable');
    const data = await response.json();
    if (!Array.isArray(data.deals) || !Array.isArray(data.runs) || !Array.isArray(data.unresolved)) throw new Error('invalid');
    deals = data.deals;
    el('health').textContent = data.healthy ? 'Regolare' : 'Da controllare';
    el('last-run').textContent = data.runs.length ? date(data.runs[0].started) : 'Non ancora eseguito';
    el('unresolved').textContent = String(data.unresolved.length);
    el('pending').replaceChildren(...(data.unresolved.length ? data.unresolved.map(d => node('li', `${d.key} · ${d.state} · ${date(d.updated)}`)) : [node('li', 'Nessun invio sospeso.')]));
    el('updated').textContent = `Dati aggiornati: ${date(data.generated_at)}`;
    el('notice').textContent = data.healthy ? 'Il bot è operativo. Nessun invio sospeso.' : 'Controlla ultimo ciclo e invii sospesi. Fuori orario l’attività può essere ferma.';
    el('notice').className = data.healthy ? '' : 'error';
    render();
  } catch (_) {
    el('notice').textContent = 'Dati non aggiornati. Accedi al servizio protetto e riprova. Le eventuali informazioni precedenti restano visibili.';
    el('notice').className = 'error';
    el('health').textContent = 'Non disponibile';
  } finally { el('refresh').disabled = false; }
}
el('refresh').addEventListener('click', refresh);
el('filter').addEventListener('input', render);
refresh();
setInterval(refresh, 60000);
