function agregarAlCarrito(producto) {
  const carrito = JSON.parse(localStorage.getItem("carrito")) || [];
  carrito.push(producto);
  localStorage.setItem("carrito", JSON.stringify(carrito));
}

document.addEventListener("DOMContentLoaded", () => {
  const lista = document.getElementById("lista-carrito");
  if (lista) {
    const carrito = JSON.parse(localStorage.getItem("carrito")) || [];
    carrito.forEach(p => {
      const li = document.createElement("li");
      li.textContent = p;
      lista.appendChild(li);
    });
  }
});