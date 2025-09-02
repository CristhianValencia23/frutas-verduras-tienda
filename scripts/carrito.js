// carrito.js - manejo de carrito (localStorage) y compatibilidad con diferentes atributos
(function(){
  var KEY = 'fv-cart';

  function getCart() {
    try { return JSON.parse(localStorage.getItem(KEY)) || []; } catch(e) { return []; }
  }
  function saveCart(items) { localStorage.setItem(KEY, JSON.stringify(items)); }
  function totalCount(items) { return items.reduce(function(s,i){ return s + (i.qty||0); }, 0); }

  function updateBadge() {
    var badge = document.querySelector('[data-cart-badge]') || document.getElementById('contador-carrito');
    if (!badge) return;
    var count = totalCount(getCart());
    badge.textContent = count;
    badge.style.display = count ? 'inline-block' : 'none';
  }

  function renderCartIfPresent() {
    var tbody = document.getElementById('cart-table-body') || document.getElementById('cart-items') || document.getElementById('lista-carrito');
    var totalEl = document.getElementById('cart-total') || document.getElementById('total-carrito') || document.getElementById('total');
    if (!tbody) return;
    var items = getCart();
    // Si el contenedor es una UL/OL, representarlo como lista
    if (tbody.tagName.toLowerCase() === 'ul' || tbody.tagName.toLowerCase() === 'ol') {
      tbody.innerHTML = '';
      var total = 0;
      items.forEach(function(it){
        var li = document.createElement('li');
        li.textContent = it.name + ' x ' + (it.qty||1) + ' - $' + ((it.price||0)*(it.qty||1)).toFixed(2);
        tbody.appendChild(li);
        total += (it.price||0)*(it.qty||1);
      });
      if (totalEl) totalEl.textContent = 'Total: $' + total.toFixed(2);
      return;
    }

    // Si es una tabla
    tbody.innerHTML = '';
    var total = 0;
    items.forEach(function(it){
      var tr = document.createElement('tr');
      var qty = it.qty || 1;
      var line = (it.price||0) * qty;
      total += line;
      tr.innerHTML = '<td>' + it.name + '</td>' +
                     '<td>' + qty + '</td>' +
                     '<td>$' + (it.price||0).toFixed(2) + '</td>' +
                     '<td>$' + line.toFixed(2) + '</td>' +
                     '<td><button data-dec="' + it.id + '">-</button> <button data-inc="' + it.id + '">+</button> <button data-del="' + it.id + '">Quitar</button></td>';
      tbody.appendChild(tr);
    });
    if (totalEl) totalEl.textContent = '$' + total.toFixed(2);
  }

  function addItem(obj) {
    var items = getCart();
    var found = items.find(function(i){ return i.id === obj.id; });
    if (found) found.qty = (found.qty||1) + 1;
    else items.push({ id: obj.id, name: obj.name, price: obj.price||0, qty: 1 });
    saveCart(items);
    updateBadge();
  }

  function removeItem(id) {
    var items = getCart().filter(function(i){ return i.id !== id; });
    saveCart(items);
    updateBadge();
    renderCartIfPresent();
  }

  function changeQty(id, delta) {
    var items = getCart();
    var it = items.find(function(i){ return i.id === id; });
    if (!it) return;
    it.qty = (it.qty||1) + delta;
    if (it.qty <= 0) items = items.filter(function(i){ return i.id !== id; });
    saveCart(items);
    updateBadge();
    renderCartIfPresent();
  }

  // Compatibilidad con llamada global agregarAlCarrito(nombre, price)
  window.agregarAlCarrito = function(name, price) {
    var id = String(name).toLowerCase().replace(/\s+/g,'-');
    addItem({ id: id, name: name, price: Number(price) || 0 });
  };

  // Delegación de eventos: soporta data-add-to-cart y clase .add-to-cart y onclicks
  document.addEventListener('click', function(ev){
    var add = ev.target.closest('[data-add-to-cart], .add-to-cart');
    if (add) {
      var id = add.dataset.id || add.getAttribute('data-id') || (add.textContent||'item').trim().toLowerCase().replace(/\s+/g,'-');
      var name = add.dataset.name || add.getAttribute('data-name') || (add.getAttribute('aria-label') || add.textContent || 'Item').trim();
      var price = Number(add.dataset.price || add.getAttribute('data-price') || 0);
      addItem({ id: id, name: name, price: price });
      return;
    }
    var inc = ev.target.closest('[data-inc]');
    if (inc) { changeQty(inc.dataset.inc, +1); return; }
    var dec = ev.target.closest('[data-dec]');
    if (dec) { changeQty(dec.dataset.dec, -1); return; }
    var del = ev.target.closest('[data-del]');
    if (del) { removeItem(del.dataset.del); return; }
  });

  // Inicializar
  document.addEventListener('DOMContentLoaded', function(){
    updateBadge();
    renderCartIfPresent();
  });

  window.Cart = { getCart: getCart, updateBadge: updateBadge, renderCartIfPresent: renderCartIfPresent, addItem: addItem, removeItem: removeItem, changeQty: changeQty };
})();