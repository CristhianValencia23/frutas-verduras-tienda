import React, { useState } from "react";
import Card from "./components/Card";
import Footer from "./components/Footer";
import { ShoppingCart } from "lucide-react";

const products = {
  frutas: [
    { id: 1, name: "Manzana", image: "/images/manzana.jpg", description: "Manzana roja fresca y jugosa.", price: 2.5 },
    { id: 2, name: "Banano", image: "/images/banano.jpg", description: "Banano maduro de alta calidad.", price: 1.2 },
    { id: 3, name: "Uvas", image: "/images/uvas.jpg", description: "Uvas moradas dulces.", price: 3.0 },
  ],
  verduras: [
    { id: 4, name: "Lechuga", image: "/images/lechuga.jpg", description: "Lechuga fresca y orgánica.", price: 1.8 },
    { id: 5, name: "Zanahoria", image: "/images/zanahoria.jpg", description: "Zanahoria crujiente y dulce.", price: 1.5 },
    { id: 6, name: "Tomate", image: "/images/tomate.jpg", description: "Tomates frescos y jugosos.", price: 2.0 },
  ],
  ofertas: [
    { id: 7, name: "Papas", image: "/images/papas.jpg", description: "Papas frescas con 20% de descuento.", price: 1.6 },
    { id: 8, name: "Fresas", image: "/images/fresas.jpg", description: "Fresas dulces con 15% de descuento.", price: 2.5 },
    { id: 9, name: "Cebolla", image: "/images/cebolla.jpg", description: "Cebolla blanca con 10% de descuento.", price: 1.3 },
  ],
};

export default function App() {
  const [cart, setCart] = useState([]);
  const [viewCart, setViewCart] = useState(false);
  const [viewSection, setViewSection] = useState("home");
  const [weights, setWeights] = useState({});

  const addToCart = (product) => {
    const weight = weights[product.id] || 1;
    setCart([...cart, { ...product, weight }]);
    alert("Producto agregado");
  };

  const updateWeight = (id, amount) => {
    setWeights((prev) => ({
      ...prev,
      [id]: Math.max(0.5, (prev[id] || 1) + amount),
    }));
  };

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-3xl font-bold text-green-700">EncuentraTodo</h1>
        <div className="flex gap-4">
          <button onClick={() => setViewSection("home")}>Inicio</button>
          <button onClick={() => setViewSection("frutas")}>Frutas</button>
          <button onClick={() => setViewSection("verduras")}>Verduras</button>
          <button onClick={() => setViewSection("ofertas")}>Ofertas</button>
          <button onClick={() => setViewCart(!viewCart)}>
            <ShoppingCart className="w-6 h-6" />
          </button>
        </div>
      </div>
      {!viewCart ? (
        viewSection === "home" ? (
          <div className="text-center">
            <img src="/images/home-banner.jpg" alt="Bienvenido a EncuentraTodo" className="w-full h-64 object-cover rounded-lg mb-4" />
            <h2 className="text-2xl font-semibold text-green-700">Bienvenido a EncuentraTodo</h2>
            <p className="text-gray-600">Tu mejor opción para comprar frutas y verduras frescas en línea.</p>
          </div>
        ) : (
          <div>
            <h2 className="text-xl font-semibold capitalize mb-2">{viewSection}</h2>
            <div className="grid grid-cols-3 gap-2">
              {products[viewSection]?.map((product) => (
                <Card key={product.id} product={product} addToCart={addToCart} updateWeight={updateWeight} weight={weights[product.id] || 1} />
              ))}
            </div>
          </div>
        )
      ) : (
        <div>
          <h2 className="text-xl font-bold mb-4">Carrito de Compras</h2>
          {cart.length > 0 ? (
            <ul>
              {cart.map((item, index) => (
                <li key={index} className="border-b py-2">
                  {item.name} - {item.weight} kg - ${item.price * item.weight}
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-600">Tu carrito está vacío.</p>
          )}
          <button className="mt-4" onClick={() => setViewCart(false)}>Volver al Inicio</button>
          {cart.length > 0 && <button className="mt-4 ml-2" onClick={() => alert("Proceso de pago iniciado")}>Comprar</button>}
        </div>
      )}
      <Footer />
    </div>
  );
}