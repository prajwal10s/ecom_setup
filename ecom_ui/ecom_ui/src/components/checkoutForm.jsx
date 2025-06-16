import React from "react";
import { OrderConfirmation } from "./orderConfirmation.jsx";

export const CheckoutForm = ({
  couponCode,
  setCouponCode,
  onCheckout,
  orderConfirmation,
  cartIsEmpty,
}) => (
  <div className="bg-white p-6 rounded-xl shadow-md">
    <h2 className="text-2xl font-bold text-gray-800 mb-4">Checkout</h2>
    <div className="mb-4">
      <label
        htmlFor="coupon"
        className="block text-gray-700 text-sm font-bold mb-2"
      >
        Discount Code (Optional):
      </label>
      <input
        type="text"
        id="coupon"
        className="shadow appearance-none border rounded-lg w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500"
        placeholder="Enter coupon code"
        value={couponCode}
        onChange={(e) => setCouponCode(e.target.value)}
      />
    </div>
    <button
      onClick={onCheckout}
      disabled={cartIsEmpty} // Disable if cart is empty
      className={`w-full text-white font-bold py-3 px-4 rounded-full transition duration-300 transform hover:scale-105 ${
        cartIsEmpty
          ? "bg-gray-400 cursor-not-allowed"
          : "bg-green-600 hover:bg-green-700"
      }`}
    >
      Place Order
    </button>

    <OrderConfirmation orderConfirmation={orderConfirmation} />
  </div>
);
