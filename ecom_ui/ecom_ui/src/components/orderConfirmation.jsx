import React from "react";

export const OrderConfirmation = ({ orderConfirmation }) => {
  if (!orderConfirmation) return null;
  return (
    <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200 text-blue-800">
      <h3 className="text-xl font-semibold mb-2">Order Confirmation</h3>
      <p>
        <strong>Order ID:</strong> {orderConfirmation.id}
      </p>
      <p>
        <strong>Original Total:</strong> $
        {orderConfirmation.totalAmount.toFixed(2)}
      </p>
      <p>
        <strong>Discount Applied:</strong> $
        {orderConfirmation.discountAmount.toFixed(2)}
      </p>
      <p>
        <strong>Final Amount:</strong>{" "}
        <span className="font-bold text-2xl">
          ${orderConfirmation.finalAmount.toFixed(2)}
        </span>
      </p>
      {orderConfirmation.appliedCoupon && (
        <p>
          <strong>Coupon Used:</strong> {orderConfirmation.appliedCoupon}
        </p>
      )}
      <p>
        <strong>Timestamp:</strong>{" "}
        {new Date(orderConfirmation.timestamp).toLocaleString()}
      </p>
    </div>
  );
};
