import React from "react";

export default function Card({ product, addToCart, updateWeight, weight }) {
  return (
    <div className="p-2 border rounded-lg">
      <img src={product.image} alt={product.name} className="w-full h-32 object-cover rounded" />
      <div className="p-2">
        <h3 className="text-lg font-semibold">{product.name}</h3>
        <p className="text-sm text-gray-600">{product.description}</p>
        <p className="text-md font-bold">${product.price} / kg</p>
        <div className="flex items-center gap-2 mt-2">
          <button onClick={() => updateWeight(product.id, -0.5)}>-</button>
          <span>{weight} kg</span>
          <button onClick={() => updateWeight(product.id, 0.5)}>+</button>
        </div>
        <button className="mt-2 w-full bg-green-500 text-white p-2 rounded" onClick={() => addToCart(product)}>Agregar al carrito</button>
      </div>
    </div>
  );
}