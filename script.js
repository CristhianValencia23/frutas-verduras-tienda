// ======================
// FUNCIONES DEL CARRITO
// ======================
function getCart() {
  return JSON.parse(localStorage.getItem("cart")) || [];
}

function saveCart(cart) {
  localStorage.setItem("cart", JSON.stringify(cart));
}

function updateCartCount() {
  const cart = getCart();
  const count = cart.reduce((acc, item) => acc + item.quantity, 0);
  const cartCount = document.getElementById("cart-count");
  if (cartCount) cartCount.textContent = count;
}

// ======================
// AGREGAR PRODUCTO
// ======================
document.addEventListener("click", (e) => {
  if (e.target.classList.contains("add-to-cart")) {
    const id = e.target.dataset.id;
    const name = e.target.dataset.name;
    const price = parseFloat(e.target.dataset.price);

    let cart = getCart();
    const existing = cart.find((item) => item.id === id);

    if (existing) {
      existing.quantity++;
    } else {
      cart.push({ id, name, price, quantity: 1 });
    }

    saveCart(cart);
    updateCartCount();
    alert(`${name} agregado al carrito`);
  }
});

// ======================
// MOSTRAR CARRITO EN carrito.html
// ======================
function renderCart() {
  const carritoItems = document.getElementById("carrito-items");
  const totalElement = document.getElementById("total");
  if (!carritoItems) return;

  let cart = getCart();
  carritoItems.innerHTML = "";

  let total = 0;

  cart.forEach((item) => {
    const div = document.createElement("div");
    div.textContent = `${item.name} - $${item.price} x ${item.quantity}`;
    carritoItems.appendChild(div);
    total += item.price * item.quantity;
  });

  totalElement.textContent = `Total: $${total.toFixed(2)}`;
}

document.addEventListener("DOMContentLoaded", () => {
  updateCartCount();
  renderCart();
});
