import React from "react";

export const Cart = ({ cartId, cartDetails, products }) => {
  return (
    <div className="bg-white p-6 rounded-xl shadow-md">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">
        Your Cart (ID: {cartId || "Loading..."})
      </h2>
      {cartDetails && cartDetails.items.length > 0 ? (
        <>
          <ul className="space-y-2 mb-4">
            {cartDetails.items.map((item) => (
              <li
                key={item.productId}
                className="flex justify-between items-center bg-gray-50 p-3 rounded-md"
              >
                <span className="font-medium text-gray-700">
                  {products.find((p) => p.id === item.productId)?.name ||
                    `Product ${item.productId}`}
                </span>
                <span className="text-gray-600">
                  {item.quantity} x ₹{item.price.toFixed(2)}
                </span>
                <span className="font-semibold text-gray-800">
                  ₹{(item.quantity * item.price).toFixed(2)}
                </span>
              </li>
            ))}
          </ul>
          <div className="text-xl font-bold text-gray-800 text-right mt-4">
            Cart Total: ₹{cartDetails.total.toFixed(2)}
          </div>
        </>
      ) : (
        <p className="text-gray-500">Your cart is empty. Add some products!</p>
      )}
    </div>
  );
};
