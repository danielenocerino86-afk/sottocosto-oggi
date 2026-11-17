const {test} = require('node:test');
const assert = require('node:assert/strict');
const vm = require('node:vm');
const fs = require('node:fs');
class Element {
  constructor(tag) { this.tag = tag; this.children = []; this.value = ''; this.textContent = ''; }
  append(...nodes) { this.children.push(...nodes); }
  replaceChildren(...nodes) { this.children = nodes; }
  addEventListener() {}
  set innerHTML(_) { throw Error('Unsafe HTML insertion'); }
}
const tick = () => new Promise(resolve => setImmediate(resolve));
test('renders untrusted product strings as text and builds only Amazon ASIN links', async () => {
  const ids = new Map();
  const get = id => { if (!ids.has(id)) ids.set(id, new Element('div')); return ids.get(id); };
  const payload = {healthy:true, generated_at:1, runs:[{started:1}], unresolved:[], deals:[{asin:'B012345678',title:'<img src=x onerror=alert(1)>',current_price:10,ts:1,score:40}]};
  const context = vm.createContext({document:{getElementById:get,createElement:t=>new Element(t)},fetch:async()=>({ok:true,json:async()=>payload}),setInterval(){},Date,Number,String,Error});
  vm.runInContext(fs.readFileSync(require('node:path').join(__dirname,'dashboard.js'),'utf8'),context);
  await tick();
  const card = get('deals').children[0];
  assert.equal(card.children[1].textContent, payload.deals[0].title);
  assert.equal(card.children.at(-1).href,'https://www.amazon.it/dp/B012345678');
  assert.equal(get('health').textContent,'Regolare');
  get('filter').value = 'nessun risultato';
  vm.runInContext('render()',context);
  assert.equal(get('deals').children[0].textContent,'Nessuna pubblicazione corrispondente.');
  context.fetch = async()=>({ok:false});
  await vm.runInContext('refresh()',context);
  assert.equal(get('health').textContent,'Non disponibile');
  assert.equal(get('refresh').disabled,false);
});
