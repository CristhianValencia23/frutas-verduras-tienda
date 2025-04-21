
function agregarAlCarrito(nombreProducto) {
    let carrito = JSON.parse(localStorage.getItem("carrito")) || [];
    carrito.push({ nombre: nombreProducto, cantidad: 1 });
    localStorage.setItem("carrito", JSON.stringify(carrito));
    alert(`${nombreProducto} agregado al carrito`);
}
