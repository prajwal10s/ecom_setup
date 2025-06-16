import React from "react";

export const ProductList = ({ products, onAddToCart }) => (
  <div className="bg-white p-6 rounded-xl shadow-md">
    <h2 className="text-2xl font-bold text-gray-800 mb-4">
      Available Products
    </h2>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {products.map((product) => (
        <div
          key={product.id}
          className="border border-gray-200 rounded-lg p-4 flex flex-col items-center justify-between shadow-sm hover:shadow-md transition-shadow"
        >
          <h3 className="text-lg font-semibold text-gray-700">
            {product.name}
          </h3>
          <p className="text-gray-600">₹{product.price.toFixed(2)}</p>
          <button
            onClick={() => onAddToCart(product.id)}
            className="mt-3 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full transition duration-300 transform hover:scale-105"
          >
            Add to Cart
          </button>
        </div>
      ))}
    </div>
  </div>
);
