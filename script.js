// script.js

// Inicializar el carrito desde localStorage o vacío
let cart = JSON.parse(localStorage.getItem("cart")) || [];

// Función para guardar carrito en localStorage
function saveCart() {
  localStorage.setItem("cart", JSON.stringify(cart));
}

// Función para actualizar el contador del carrito en el header
function updateCartCount() {
  const countElement = document.querySelector("#cart-count");
  if (countElement) {
    countElement.textContent = cart.length;
  }
}

// Función para mostrar los productos en el carrito (si existe contenedor)
function renderCart() {
  const cartContainer = document.querySelector("#cart-items");
  if (!cartContainer) return;

  cartContainer.innerHTML = "";
  if (cart.length === 0) {
    cartContainer.innerHTML = "<p>El carrito está vacío.</p>";
    return;
  }

  cart.forEach((item, index) => {
    const li = document.createElement("li");
    li.textContent = `${item.name} - $${item.price}`;
    
    const removeBtn = document.createElement("button");
    removeBtn.textContent = "Eliminar";
    removeBtn.addEventListener("click", () => {
      cart.splice(index, 1);
      saveCart();
      updateCartCount();
      renderCart();
    });

    li.appendChild(removeBtn);
    cartContainer.appendChild(li);
  });
}

// Función para manejar clic en "Agregar al carrito"
function addToCart(event) {
  const button = event.target;
  const name = button.getAttribute("data-name");
  const price = parseFloat(button.getAttribute("data-price"));

  const product = { name, price };
  cart.push(product);

  saveCart();
  updateCartCount();
  alert(`${name} fue agregado al carrito`);
}

// Escuchar eventos cuando el DOM esté listo
document.addEventListener("DOMContentLoaded", () => {
  // Vincular botones "Agregar al carrito"
  document.querySelectorAll(".add-to-cart").forEach(button => {
    button.addEventListener("click", addToCart);
  });

  // Actualizar contador al cargar página
  updateCartCount();

  // Renderizar carrito si estamos en la página del carrito
  renderCart();
});
