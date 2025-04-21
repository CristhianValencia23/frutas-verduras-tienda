
function agregarAlCarrito(nombreProducto) {
    let carrito = JSON.parse(localStorage.getItem("carrito")) || [];
    let producto = carrito.find(item => item.nombre === nombreProducto);
    
    if (producto) {
        producto.cantidad++;
    } else {
        carrito.push({ nombre: nombreProducto, cantidad: 1 });
    }

    localStorage.setItem("carrito", JSON.stringify(carrito));
    alert(`${nombreProducto} agregado al carrito`);
    mostrarCarrito();
}

function mostrarCarrito() {
    let carrito = JSON.parse(localStorage.getItem("carrito")) || [];
    let carritoDiv = document.getElementById("productos-carrito");

    carritoDiv.innerHTML = "";

    if (carrito.length === 0) {
        carritoDiv.innerHTML = "<p>No hay productos en el carrito.</p>";
    } else {
        carrito.forEach(item => {
            carritoDiv.innerHTML += `<p>${item.nombre} - Cantidad: ${item.cantidad}</p>`;
        });
    }
}

document.addEventListener('DOMContentLoaded', mostrarCarrito);
