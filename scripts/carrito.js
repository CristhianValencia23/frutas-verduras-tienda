// scripts/carrito.js
(function(){
  const KEY = 'fv-cart';

  function getCart() {
    try { return JSON.parse(localStorage.getItem(KEY)) || []; }
    catch { return []; }
  }
  function saveCart(items) { localStorage.setItem(KEY, JSON.stringify(items)); }
  function totalCount(items) { return items.reduce((s, it) => s + (it.qty || 0), 0); }

  function updateBadge() {
    const badge = document.querySelector('[data-cart-badge]') || document.getElementById('cart-count');
    if (!badge) return;
    const count = totalCount(getCart());
    badge.textContent = count;
    badge.style.display = count ? 'inline-block' : 'none';
  }

  function renderCartIfPresent() {
    const tbody = document.getElementById('cart-table-body') || document.getElementById('cart-items');
    const totalEl = document.getElementById('cart-total');
    if (!tbody) return;
    const items = getCart();
    tbody.innerHTML = '';
    let total = 0;
    for (const it of items) {
      const tr = document.createElement('tr');
      const qty = it.qty || 1;
      const line = (it.price || 0) * qty;
      total += line;
      tr.innerHTML = `
        <td>${it.name}</td>
        <td>${qty}</td>
        <td>$${(it.price||0).toFixed(2)}</td>
        <td>$${line.toFixed(2)}</td>
        <td>
          <button data-dec="${it.id}">-</button>
          <button data-inc="${it.id}">+</button>
          <button data-del="${it.id}">Quitar</button>
        </td>
      `;
      tbody.appendChild(tr);
    }
    if (totalEl) totalEl.textContent = `$${total.toFixed(2)}`;
  }

  function addItem(item) {
    const items = getCart();
    const found = items.find(i => i.id === item.id);
    if (found) found.qty = (found.qty || 1) + 1;
    else items.push({ ...item, qty: 1 });
    saveCart(items);
    updateBadge();
  }

  function removeItem(id) {
    const items = getCart().filter(i => i.id !== id);
    saveCart(items);
    updateBadge();
    renderCartIfPresent();
  }

  function changeQty(id, delta) {
    const items = getCart();
    const it = items.find(i => i.id === id);
    if (!it) return;
    it.qty = (it.qty || 1) + delta;
    if (it.qty <= 0) {
      const idx = items.indexOf(it);
      if (idx > -1) items.splice(idx, 1);
    }
    saveCart(items);
    updateBadge();
    renderCartIfPresent();
  }

  // Delegación global de eventos (botones Agregar / + / - / Quitar)
  document.addEventListener('click', function(ev) {
    const add = ev.target.closest('[data-add-to-cart], .add-to-cart');
    if (add) {
      const id = String(add.dataset.id || add.getAttribute('data-id') || add.textContent.trim());
      const name = String(add.dataset.name || add.getAttribute('data-name') || add.textContent.trim());
      const price = Number(add.dataset.price || add.getAttribute('data-price') || 0);
      addItem({ id, name, price });
      return;
    }
    const inc = ev.target.closest('[data-inc]');
    if (inc) { changeQty(inc.dataset.inc, +1); return; }
    const dec = ev.target.closest('[data-dec]');
    if (dec) { changeQty(dec.dataset.dec, -1); return; }
    const del = ev.target.closest('[data-del]');
    if (del) { removeItem(del.dataset.del); return; }
  });

  window.Cart = { getCart, saveCart, updateBadge, renderCartIfPresent, addItem, removeItem, changeQty };
})();
