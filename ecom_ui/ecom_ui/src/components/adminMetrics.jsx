import React from "react";

export const AdminMetrics = ({
  adminMetrics,
  onRefreshMetrics,
  onGenerateCoupon,
}) => (
  <div className="bg-white p-6 rounded-xl shadow-md">
    <h2 className="text-2xl font-bold text-gray-800 mb-4">Admin Metrics</h2>
    {adminMetrics ? (
      <div className="space-y-2 text-gray-700">
        <p>
          <strong>Orders Processed:</strong> {adminMetrics.totalOrdersProcessed}
        </p>
        <p>
          <strong>Items Purchased:</strong> {adminMetrics.totalItemsPurchased}
        </p>
        <p>
          <strong>Total Sales Amount:</strong> ₹
          {adminMetrics.totalPurchaseAmount.toFixed(2)}
        </p>
        <p>
          <strong>Total Discount Given:</strong> ₹
          {adminMetrics.totalDiscountAmount.toFixed(2)}
        </p>
        <p className="mt-4 font-semibold">
          Coupon Status (N = {adminMetrics.NTH_ORDER_THRESHOLD}):
        </p>
        <p>
          Active Code:{" "}
          <span className="font-mono text-blue-700">
            {adminMetrics.currentActiveCouponCode || "N/A"}
          </span>
        </p>
        <p>
          Available for Use:{" "}
          <span
            className={`font-semibold ${
              adminMetrics.isCouponAvailable ? "text-green-600" : "text-red-600"
            }`}
          >
            {adminMetrics.isCouponAvailable ? "YES" : "NO"}
          </span>
        </p>
        <div className="mt-4">
          <h4 className="font-semibold text-gray-800">
            All Generated Coupons:
          </h4>
          {adminMetrics.allGeneratedCouponCodes.length > 0 ? (
            <ul className="list-disc list-inside text-sm text-gray-600">
              {adminMetrics.allGeneratedCouponCodes.map((code, index) => (
                <li key={index} className="font-mono">
                  {code}
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-gray-500">No coupons generated yet.</p>
          )}
        </div>
      </div>
    ) : (
      <p className="text-gray-500">Loading admin metrics...</p>
    )}
    <div className="flex flex-col space-y-3 mt-6">
      <button
        onClick={onRefreshMetrics}
        className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded-full transition duration-300 transform hover:scale-105"
      >
        Refresh Metrics
      </button>
    </div>
  </div>
);
